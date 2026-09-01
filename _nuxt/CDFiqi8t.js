const n=`<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('analyze')

const contents = {
  analyze: \`// 构建产物分析
// 安装 rollup-plugin-visualizer
npm install -D rollup-plugin-visualizer

// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,        // 构建后自动打开报告
      filename: './stats.html',
      gzipSize: true,     // 显示 gzip 后大小
    }),
  ],
})

// 运行构建后会生成 stats.html
// 可视化查看每个模块的大小\`,
  optimize: \`// Vite 性能优化清单
// 1. 依赖预构建（自动，首次慢）
//    → 后续构建极快

// 2. 减少依赖体积
import { debounce } from 'lodash-es'  // ❌ 引入整个库
import debounce from 'lodash-es/debounce'  // ✅ 只引入需要的函数

// 3. 使用 CDN（大型库）
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'react'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})

// 4. 启用 gzip/brotli 压缩（服务器端）
// npm install -D vite-plugin-compression\`,
  metrics: \`// 开发服务器性能监控
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,  // 显示编译错误遮罩
    },
  },
  build: {
    reportCompressedSize: true,  // 报告压缩后大小（默认 true）
    chunkSizeWarningLimit: 500,   // chunk 大小警告阈值（KB）
  },
})

// 使用 Chrome DevTools 分析
// 1. 打开 DevTools → Performance
// 2. 录制页面加载
// 3. 查看 Main 线程中的 Vite 相关任务\`,
}
<\/script>

<template>
  <div class="v15">
    <p class="intro">Vite 提供构建产物分析和多种性能优化手段，帮助控制 bundle 体积。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v15 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #dc2626; color: #fff; border-color: #dc2626; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
`;export{n as default};
