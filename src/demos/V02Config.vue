<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('basic')

const configs = {
  basic: `// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: { port: 3000 },
  build: { outDir: 'dist' },
})`,
  advanced: `// vite.config.ts - 高级配置
export default defineConfig({
  resolve: {
    alias: { '@': '/src' },
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: \`@use "@/styles" as *;\` },
    },
  },
  build: {
    rollupOptions: {
      output: { manualChunks: { vue: ['vue'] } },
    },
  },
})`,
  env: `// 环境变量
// .env.development
VITE_API_URL=http://localhost:3000

// 代码中读取
const apiUrl = import.meta.env.VITE_API_URL
// 只暴露 VITE_ 前缀的变量到客户端`,
}
</script>

<template>
  <div class="v02">
    <p class="intro">Vite 配置文件使用 <code>defineConfig</code> 获得类型提示。</p>
    <div class="tabs">
      <button v-for="(v,k) in configs" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ configs[tab as keyof typeof configs] }}</code></pre>
  </div>
</template>

<style scoped>
.v02 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.intro code { background: #f1f5f9; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
