const n=`<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('basic')

const contents = {
  basic: \`// vite.config.ts - 开发代理配置
export default defineConfig({
  server: {
    proxy: {
      // 字符串简写（代理到单个目标）
      '/api': 'http://localhost:3000',

      // 完整配置
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,    // 修改请求头中的 Origin
        rewrite: (path) => path.replace(/^\\/api/, ''),
      },
    },
  },
})

// 前端请求 /api/users → 代理到 http://localhost:3000/users\`,
  ws: \`// WebSocket 代理
export default defineConfig({
  server: {
    proxy: {
      '/socket.io': {
        target: 'ws://localhost:3000',
        ws: true,  // 启用 WebSocket 代理
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
})\`,
  cors: \`// CORS 问题处理（开发环境）
// 方式 1：使用 Vite 代理（推荐）
proxy: { '/api': { target: '...', changeOrigin: true } }

// 方式 2：后端设置 CORS 头
// Express 示例
app.use(cors({ origin: 'http://localhost:5173' }))

// 方式 3：Vite 开发服务器自定义中间件
export default defineConfig({
  server: {
    hmr: { overlay: false },  // 禁用错误遮罩
    middlewareMode: true,       // 中间件模式
  },
})\`,
}
<\/script>

<template>
  <div class="v14">
    <p class="intro">Vite 开发服务器内置代理，解决开发环境跨域问题，无需配置 CORS。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v14 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #a855f7; color: #fff; border-color: #a855f7; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
`;export{n as default};
