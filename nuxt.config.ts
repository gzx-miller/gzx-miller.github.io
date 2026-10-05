import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const SITE_URL = 'https://gzx-miller.github.io'

// 收集全站 URL：分类路径（单段）+ 课程路径（段数不限）
// 课程 path 的段数并不固定（/vue/k-1/app-entry、/vue/k-12/routing/lee …），
// 因此统一用「/ 开头、不含空白和引号」的通用模式，避免漏掉多段路径。
function collectSitePaths(): string[] {
  const paths = new Set<string>(['/'])

  // 分类路径，如 /vue、/react
  for (const match of lessonSource.matchAll(/\bpath:\s*'(\/[a-z-]+)'/g)) {
    paths.add(match[1])
  }

  // 课程路径：逐个读取分类课程文件
  const lessonsDir = new URL('./src/data/lessons/', import.meta.url)
  for (const file of readdirSync(lessonsDir)) {
    if (!file.endsWith('.ts')) continue
    const source = readFileSync(new URL(file, lessonsDir), 'utf8')
    for (const match of source.matchAll(/\bpath:\s*'(\/[^'\s]+)'/g)) {
      paths.add(match[1])
    }
  }

  return [...paths].sort()
}

function buildSitemapXml(): string {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = collectSitePaths()
    .map((path) => {
      const segments = path.split('/').filter(Boolean)
      const priority = path === '/' ? '1.0' : segments.length === 1 ? '0.7' : '0.5'
      return `  <url><loc>${SITE_URL}${path}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`
    })
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
      // 智谱 API Key（已混淆）。优先读取 NUXT_PUBLIC_ZHIPU_API_KEY，
      // 未设置时用内置默认值，保证 CI / 本地构建结果一致。
      // 该值会随 SSG 打进前端产物，属于客户端可见信息，
      // 混淆只提高取值门槛，不等同于保密——真正的防护应放在服务端代理。
      zhipuApiKey:
        process.env.NUXT_PUBLIC_ZHIPU_API_KEY ||
        '4a144c581416035e180b03574714070553061642165f46465c5f1958545145181c047f743904140e2b350009195b2a3503',
    },
  },
  css: [
    'highlight.js/styles/github.css',
    'nprogress/nprogress.css',
    '~/style.css',
    // 演示统一基础样式（公共元素 + light/dark 令牌），约 5KB。
    // 新增约 2KB（其余是替换掉的旧 scoped 规则），换来 347 个演示共用
    // 一套定义，代价与收益相比可接受，因此走全局而不做动态注入。
    '~/styles/demo.css',
  ],
  hooks: {
    // 构建前把生成的 sitemap.xml 写入 public/，nitro 构建时会一并拷入 .output/public
    'build:before': () => {
      writeFileSync(new URL('./public/sitemap.xml', import.meta.url), buildSitemapXml(), 'utf8')
    },
    // 关闭动态 chunk 的 prefetch 与 preload。
    //
    // prefetch：否则每页都会预取全部 22 个分类课程数据（实测约 6.4MB），
    // 而首屏真正需要的只有当前分类。动态 import 改为进入对应路由时按需加载。
    //
    // preload：Vite 会把「主 chunk 直接 import 的模块」统一标为 preload，
    // 于是 500+ 个课程页会各自预加载自己那一个分类的 JS/CSS。教学内容的分类
    // chunk 动辄数百 KB（webgl.css 49KB、tailwind-css.css 65KB），
    // 让它们与首屏正文抢带宽会直接拖慢 LCP。真正需要保底的是当前路由的
    // 同步依赖，而 modulepreload 只保留入口链路上的少数几个 chunk 即可。
    'build:manifest': (manifest) => {
      // 入口链路上必须同步就绪的 chunk——除此之外一律不预加载
      const entryChunk = manifest['node_modules/nuxt/dist/app/entry.js']
      const critical = new Set<string>(
        [entryChunk?.file, ...(entryChunk?.imports ?? [])].filter(Boolean) as string[],
      )
      // imports 是间接引用，需要递归展开一层，拿到真正会被同步执行的模块
      for (const key of [...critical]) {
        for (const dep of manifest[key]?.imports ?? []) critical.add(dep)
      }

      for (const key of Object.keys(manifest)) {
        const chunk = manifest[key]
        chunk.prefetch = false
        if (!critical.has(key) && !critical.has(chunk.file)) {
          chunk.preload = false
        }
      }
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
      // 预渲染路径全部由 collectSitePaths() 从课程数据推导，不再手工维护。
      // 历史遗留的 /total-vue/... 与 /vue/k-12/routing/ming 在数据源中已不存在，
      // 继续保留只会白白多渲染两个 404 页。
      routes: [...prerenderRoutes],
    },
  },
  typescript: {
    typeCheck: true,
  },
})
