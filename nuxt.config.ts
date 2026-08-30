import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const SITE_URL = 'https://gzx-miller.github.io'

// 收集全站 URL：分类路径（单段）+ 课程路径（双段）
function collectSitePaths(): string[] {
  const paths = new Set<string>(['/'])

  // 分类路径，如 /vue、/react
  for (const match of lessonSource.matchAll(/\bpath:\s*'(\/[a-z-]+)'/g)) {
    paths.add(match[1])
  }

  // 课程路径，如 /vue/k-1/app-entry：读取每个分类课程文件
  const lessonsDir = new URL('./src/data/lessons/', import.meta.url)
  for (const file of readdirSync(lessonsDir)) {
    if (!file.endsWith('.ts')) continue
    const source = readFileSync(new URL(file, lessonsDir), 'utf8')
    for (const match of source.matchAll(/\bpath:\s*'(\/[a-z-]+\/[^']+)'/g)) {
      paths.add(match[1])
    }
  }

  return [...paths].sort()
}

function buildSitemapXml(): string {
  const urls = collectSitePaths()
    .map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)
    .join('\n')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n')
}

const lessonSource = readFileSync(new URL('./src/data/lessons.ts', import.meta.url), 'utf8')

// 预渲染路径：收集所有分类路径和课程路径
const prerenderRoutes = collectSitePaths()

export default defineNuxtConfig({
  srcDir: 'src/',
  compatibilityDate: '2026-06-13',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      zhipuApiKey: '4a144c581416035e180b03574714070553061642165f46465c5f1958545145181c047f743904140e2b350009195b2a3503',
    },
  },
  css: [
    'highlight.js/styles/github.css',
    'nprogress/nprogress.css',
    '~/style.css',
  ],
  hooks: {
    // 构建前把生成的 sitemap.xml 写入 public/，nitro 构建时会一并拷入 .output/public
    'build:before': () => {
      writeFileSync(new URL('./public/sitemap.xml', import.meta.url), buildSitemapXml(), 'utf8')
    },
  },
  vite: {
    plugins: [
      Components({ dts: false, resolvers: [ElementPlusResolver()] }),
      // 注：nitro 渲染器会对产物做 process.env.NODE_ENV 文本替换，会破坏 ?raw
      // 字符串字面量。已在源码层面规避（nodejs-code/D07ProcessEnv.js 使用
      // process.env['NODE_ENV'] 等价写法），勿在 demos 目录引入该字面量。
    ],
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '小松鼠举栗子',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: '小松鼠举栗子中文技术知识内容库：Vue3、TypeScript、React、Node.js、CSS、WebGL、C++、uni-app 等 22 大分类 500+ 真实内容，通过独立小内容学懂软件技术。',
        },
        { name: 'author', content: 'gzx-miller' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: '小松鼠举栗子' },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '小松鼠举栗子 - 通过独立真实内容学习软件技术' },
        {
          property: 'og:description',
          content: '中文技术知识内容库：通过独立真实小内容学习 Vue3、TypeScript、React、Node.js、CSS、WebGL、C++、uni-app 等 22 大分类。',
        },
        { property: 'og:url', content: `${SITE_URL}/` },
        { property: 'og:image', content: `${SITE_URL}/og-image.jpg` },
        { property: 'og:image:width', content: '2560' },
        { property: 'og:image:height', content: '1440' },
        { property: 'og:image:alt', content: '小松鼠举栗子 · 秋日森林里小松鼠抱着栗子' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '小松鼠举栗子 - 通过独立真实内容学习软件技术' },
        {
          name: 'twitter:description',
          content: '中文技术知识内容库：22 大分类 500+ 真实内容，每个栗子只讲一个知识点。',
        },
        { name: 'twitter:image', content: `${SITE_URL}/og-image.jpg` },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f8b369' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#1a1210' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: `${SITE_URL}/` },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: '小松鼠举栗子',
            url: `${SITE_URL}/`,
            description: '中文技术知识内容库：通过独立真实小内容学习 Vue3、TypeScript、React、Node.js、CSS、WebGL、C++、uni-app 等。',
            inLanguage: 'zh-CN',
          }),
          tagPosition: 'head',
        },
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('theme-preference');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          tagPosition: 'head',
        },
      ],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        ...prerenderRoutes,
        '/total-vue/vue/k-1/app-entry',
        '/vue/k-12/routing/lee',
        '/vue/k-12/routing/ming',
      ],
    },
  },
  typescript: {
    typeCheck: true,
  },
})
