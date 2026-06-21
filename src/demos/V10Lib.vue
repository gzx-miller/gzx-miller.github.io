<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('config')

const contents = {
  config: `// vite.config.ts - 库模式配置
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',    // 入口文件
      name: 'MyLib',            // 全局变量名（UMD）
      fileName: 'my-lib',       // 输出文件名
    },
    rollupOptions: {
      // 外部化 Vue（使用方提供）
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})`,
  output: `// 构建产物（同时输出多种格式）
// dist/
// ├── my-lib.es.js     # ESM（供现代打包器使用）
// ├── my-lib.umd.js    # UMD（供 CDN 直接引用）
// ├── my-lib.cjs.js    # CJS（供 Node.js 使用）
// └── types.d.ts        # 类型声明（需额外配置）

// package.json
{
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.es.js",
  "types": "./dist/types.d.ts"
}`,
  publish: `// 发布到 npm 的完整流程
// 1. 构建
npm run build

// 2. 确保 package.json 包含
{
  "name": "my-lib",
  "version": "1.0.0",
  "files": ["dist"],
  "peerDependencies": { "vue": ">=3.0.0" }
}

// 3. 发布
npm publish

// 使用者：npm install my-lib`,
}
</script>

<template>
  <div class="v10">
    <p class="intro">Vite 库模式可同时输出 ESM、UMD、CJS 格式，适合开发可复用的 npm 包。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v10 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #14b8a6; color: #fff; border-color: #14b8a6; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
