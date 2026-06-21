<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('why')

const contents = {
  why: `// 为什么需要依赖预构建？
// 1. CommonJS / UMD 模块需要转换成 ESM
// 2. 大型依赖（如 lodash-es）有数百个文件，
//    直接加载会导致大量 HTTP 请求

// Vite 使用 Esbuild 预构建依赖
// 将 lodash-es 合并为单个 ESM 模块
// 启动时间从秒级降到毫秒级`,
  config: `// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    // 强制预构建的包
    include: ['vue', 'vue-router'],
    // 排除预构建的包
    exclude: ['your-local-package'],
    // 强制重新预构建（清除缓存）
    // $ rm -rf node_modules/.vite
  },
})

// 预构建产物缓存位置
// node_modules/.vite/`,
  esbuild: `// Vite 使用 Esbuild 进行：
// 1. 依赖预构建（极快）
// 2. TypeScript 转译（不类型检查）

export default defineConfig({
  esbuild: {
    // 删除 console.log（生产构建）
    drop: ['console', 'debugger'],
    // 目标浏览器
    target: 'es2020',
    // JSX 转换（React）
    jsxFactory: 'React.createElement',
  },
})`,
}
</script>

<template>
  <div class="v07">
    <p class="intro">Vite 使用 Esbuild 预构建 <code>node_modules</code> 中的依赖，将 CommonJS/大量 ESM 转为单个 ESM 文件。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v07 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.intro code { background: #f1f5f9; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #ef4444; color: #fff; border-color: #ef4444; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
