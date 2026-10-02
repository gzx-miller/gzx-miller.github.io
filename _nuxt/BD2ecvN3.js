const n=`<script setup lang="ts">
import { ref } from 'vue'

const strategies = [
  { name: '子路径路由', pattern: '/zh/about, /en/about', desc: 'URL 带语言前缀，SEO 友好', recommended: true },
  { name: '域名策略', pattern: 'example.com, example.cn', desc: '不同域名不同语言', recommended: false },
  { name: 'Cookie/Header', pattern: '根据 Accept-Language', desc: '自动检测，配合 middleware', recommended: true },
  { name: 'Dynamic i18n', pattern: 'App Router 原生方案', desc: 'Next.js 14+ 推荐，无插件', recommended: true },
]

const codeExample = \`<span style="color:#8a8a3a">// 方案一：App Router Dynamic i18n（推荐）</span>
<span style="color:#7c7c99">// app/[lang]/layout.tsx</span>
const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(m => m.default),
  zh: () => import('@/dictionaries/zh.json').then(m => m.default),
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: 'en' | 'zh' }
}) {
  const dict = await dictionaries[params.lang]()
  return (
    &lt;html lang={params.lang}&gt;
      &lt;body&gt;&lt;I18nProvider dict={dict}&gt;{children}&lt;/I18nProvider&gt;&lt;/body&gt;
    &lt;/html&gt;
  )
}

<span style="color:#8a8a3a">// middleware.ts — 自动检测语言</span>
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'zh']

export function middleware(request) {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  const accept = new Negotiator({ headers }).languages()
  const lang = match(accept, locales, 'en')
  if (!request.nextUrl.pathname.startsWith(\\\`/\\\${lang}\\\`)) {
    return NextResponse.redirect(new URL(\\\`/\\\${lang}\\\${request.nextUrl.pathname}\\\`, request.url))
  }
}

<span style="color:#8a8a3a">// app/[lang]/page.tsx — 使用</span>
export default function Page({ params }) {
  const t = useI18n()  <span style="color:#7c7c99">// 从 Context 读取字典</span>
  return &lt;h1&gt;{t('welcome')}&lt;/h1&gt;
}\`

const tips = [
  'SEO：每个语言版本用独立 URL，配合 hreflang 标签',
  '字典：按语言拆分 JSON，按需加载避免全量打包',
  '复数/日期：用 Intl API 或 formatjs 处理',
  'next-intl：社区流行的 App Router i18n 方案',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>国际化 i18n</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>路由策略对比</h4>
        <div v-for="s in strategies" :key="s.name" class="strat-card">
          <strong>{{ s.name }}</strong>
          <span v-if="s.recommended" class="tag rec">推荐</span>
          <p><small>模式：<code>{{ s.pattern }}</code></small></p>
          <p><small>{{ s.desc }}</small></p>
        </div>

        <h4 style="margin-top:12px;">实践要点</h4>
        <ul>
          <li v-for="(t, i) in tips" :key="i"><small>{{ t }}</small></li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.strat-card { background: #fff8f0; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 6px; }
.tag { padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
.tag.rec { background: #65a30d; color: #fff; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
`;export{n as default};
