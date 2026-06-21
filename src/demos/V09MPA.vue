<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('config')

const contents = {
  config: `// vite.config.ts - 多页面应用配置
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})

// 每个 HTML 文件都是独立的入口
// 共享的依赖会被提取为 common chunk`,
  structure: `my-mpa-app/
├── index.html        # 首页入口
├── about.html       # 关于页入口
├── contact.html     # 联系页入口
├── src/
│   ├── main.ts     # 首页 JS
│   ├── about.ts    # 关于页 JS
│   └── shared/     # 共享代码
└── vite.config.ts

// 每个 HTML 文件直接使用 <script type="module">
// <script type="module" src="/src/main.ts"></script>`,
  compare: `// MPA vs SPA
// MPA：每个页面独立 HTML，适合 SEO 要求高的场景
// SPA：单 HTML + 前端路由，适合 Web App

// Vite 同时支持两种模式
// MPA：配置多个入口
// SPA：默认行为，一个 index.html`,
}
</script>

<template>
  <div class="v09">
    <p class="intro">Vite 支持多页面应用（MPA），每个 HTML 文件都是独立入口，共享依赖自动提取。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v09 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #ec4899; color: #fff; border-color: #ec4899; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
