const n=`<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('concept')

const contents = {
  concept: \`// Vite SSR 工作原理
// 1. 服务端渲染：在服务器上运行 Vue 组件，生成 HTML
// 2. 客户端激活（Hydration）：在浏览器中接管静态 HTML

// 优势
// - SEO 友好（搜索引擎可抓取完整 HTML）
// - 首屏速度快（无需等待 JS 下载执行）
// - 低端设备体验更好\`,
  setup: \`// vite.config.ts
export default defineConfig({
  ssr: {
    // SSR 外部化依赖（不打包到服务端 bundle）
    external: ['vue', 'vue-router'],
  },
})

// server.ts - 简易 SSR 服务器
import { createServer } from 'vite'
import { renderToString } from 'vue/server-renderer'

const vite = await createServer({ ssr: true })
const html = await vite.transformIndexHtml(url, template)
const app = createSSRApp(App)
const rendered = await renderToString(app)\`,
  nuxt: \`// Nuxt 3 基于 Vite + Vue 3 的 SSR 框架
// 零配置 SSR、自动路由、文件系统路由

// Nuxt 内置了：
// - Vite 作为构建工具
// - Vue 3 SSR
// - 自动代码分割
// - 静态站点生成（SSG）

// 本仓库就是使用 Nuxt 4 + Vite 构建的！\`,
}
<\/script>

<template>
  <div class="v11">
    <p class="intro">Vite 原生支持 SSR，Nuxt 3/4 就是基于 Vite + Vue 3 SSR 构建的。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v11 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #f97316; color: #fff; border-color: #f97316; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
`;export{n as default};
