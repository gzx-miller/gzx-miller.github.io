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
const lessonRoutes = Array.from(
  new Set(
    Array.from(lessonSource.matchAll(/\bpath:\s*'(\/[a-z-]+\/[^']+)'/g))
      .map((match) => match[1]),
  ),
)

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
          content: '小松鼠举栗子中文前端知识案例库：Vue3、TypeScript、React、Node.js、CSS 等 19 大分类 400+ 真实案例，通过独立小案例学透前端技术。',
        },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f8b369' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#1a1210' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [
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
        '/',
        '/vue',
        '/element-plus',
        '/nestjs',
        '/react',
        '/langchain',
        '/nuxt',
        '/nextjs',
        '/total-vue',
        '/total-vue/vue/k-1/app-entry',
        '/vue/k-12/routing/lee',
        '/vue/k-12/routing/ming',
        ...lessonRoutes,
      ],
    },
  },
  typescript: {
    typeCheck: true,
  },
})
