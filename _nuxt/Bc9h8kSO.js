const n=`// vite.config.ts - 代理配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 基础代理: /api → http://localhost:3000/api
      '/api': 'http://localhost:3000',
      
      // 带选项的代理
      '/api2': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api2/, '')
      },
      
      // WebSocket 代理
      '/ws': {
        target: 'ws://localhost:3002',
        ws: true
      },
      
      // 使用正则匹配
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/fallback/, '')
      }
    }
  }
})

// ====================
// 常用代理选项详解
// ====================

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // 目标服务器地址
        target: 'http://localhost:3000',
        
        // 修改请求头中的 Origin 为目标地址
        // 解决虚拟主机站点的跨域问题
        changeOrigin: true,
        
        // 是否允许代理 HTTPS 站点（忽略证书错误）
        secure: false,
        
        // 路径重写
        rewrite: (path) => path.replace(/^\\/api/, '/api/v1'),
        
        // 请求拦截（可修改请求头）
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 添加自定义请求头
            proxyReq.setHeader('X-Custom-Header', 'value')
          })
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // 修改响应
          })
        }
      }
    }
  }
})

// ====================
// 多环境代理配置
// ====================

import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET || 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
  }
})

// ====================
// 实际使用示例
// ====================

// 前端代码中这样写:
import axios from 'axios'

// 请求 /api/users 会被代理到 http://localhost:3000/api/users
async function getUsers() {
  const res = await axios.get('/api/users')
  return res.data
}

// 注意: 代理只在开发环境生效
// 生产环境需要:
// 1. 后端配置 CORS
// 2. 使用 Nginx 反向代理
// 3. 部署在同一域名下`;export{n as default};
