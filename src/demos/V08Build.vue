<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('split')

const contents = {
  split: `// 代码分割（自动）
// Vite 基于 Rollup，自动进行代码分割
// 每个动态 import() 会生成独立的 chunk

// 手动配置分包策略
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus'],
        },
      },
    },
  },
})`,
  lazy: `// 路由级懒加载（Vue Router）
const routes = [
  {
    path: '/home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/about',
    component: () => import('./views/About.vue'),
  },
]

// 每个路由对应一个独立的 JS chunk
// 首屏只加载必要的代码`,
  minify: `// 压缩配置
export default defineConfig({
  build: {
    // 使用 esbuild 压缩（默认，快）
    minify: 'esbuild',
    // 或使用 terser（慢但压缩率更高）
    // minify: 'terser',
    // terserOptions: { compress: { drop_console: true } },

    // 构建目标
    target: 'es2020',
    // 禁用压缩（调试用）
    // minify: false,
  },
})`,
}
</script>

<template>
  <div class="v08">
    <p class="intro">Vite 基于 Rollup 构建，支持自动代码分割、懒加载和多种压缩策略。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v08 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #6366f1; color: #fff; border-color: #6366f1; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
