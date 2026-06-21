import { readFileSync } from 'node:fs'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

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
  css: [
    'highlight.js/styles/github.css',
    '~/style.css',
  ],
  vite: {
    plugins: [
      Components({ dts: false, resolvers: [ElementPlusResolver()] }),
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
          content: '小松鼠举栗子中文前端知识案例库',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/vue',
        '/element-plus',
        '/react',
        '/langchain',
        '/nuxt',
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
