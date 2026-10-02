const e=`// server.js - Vite SSR 基础服务端
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()
  
  // 创建 Vite 开发服务器（中间件模式）
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  
  // 使用 Vite 中间件
  app.use(vite.middlewares)
  
  // 处理所有请求
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      
      // 1. 读取 HTML 模板
      let template = await vite.transformIndexHtml(url, '')
      
      // 2. 加载服务端入口
      const { render } = await vite.ssrLoadModule('/src/entry-server.ts')
      
      // 3. 渲染应用 HTML
      const appHtml = await render(url)
      
      // 4. 注入应用 HTML 到模板
      const html = template.replace('<!--app-html-->', appHtml)
      
      // 5. 返回 HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // 显示错误
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })
  
  app.listen(3000)
}

createServer()

// ====================
// 服务端入口 (src/entry-server.ts)
// ====================

import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { createRouter } from './router'

export async function render(url: string) {
  const app = createSSRApp(App)
  const router = createRouter()
  
  // 设置路由
  router.push(url)
  await router.isReady()
  
  // 渲染为 HTML 字符串
  const html = await renderToString(app)
  
  return html
}

// ====================
// 客户端入口 (src/entry-client.ts)
// ====================

import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'

const app = createSSRApp(App)
const router = createRouter()

// Hydration（激活）
router.isReady().then(() => {
  app.mount('#app')
})

// ====================
// vite.config.ts - SSR 配置
// ====================

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  ssr: {
    // 不外部化的依赖（需要打包进 SSR 产物）
    noExternal: ['some-ui-library'],
    // 外部化的依赖
    external: ['some-cjs-only-package']
  }
})`;export{e as default};
