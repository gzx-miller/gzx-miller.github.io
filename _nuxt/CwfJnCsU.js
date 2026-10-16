const n=`// .env - 所有环境都会加载
VITE_APP_TITLE = '我的应用'
VITE_API_BASE_URL = '/api'

// .env.development - 仅开发环境
VITE_APP_TITLE = '我的应用 - 开发版'
VITE_API_BASE_URL = 'http://localhost:3000/api'

// .env.production - 仅生产环境
VITE_APP_TITLE = '我的应用'
VITE_API_BASE_URL = 'https://api.example.com'

// .env.local - 本地覆盖（不会被 git 追踪）
VITE_API_BASE_URL = 'http://192.168.1.100:3000/api'

// ====================
// 在代码中使用环境变量
// ====================

// 只有 VITE_ 前缀的变量才会暴露给客户端
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.VITE_API_BASE_URL)

// 内置环境变量
console.log(import.meta.env.MODE) // 'development' | 'production'
console.log(import.meta.env.DEV) // true | false
console.log(import.meta.env.PROD) // true | false
console.log(import.meta.env.SSR) // true | false

// ====================
// 在 vite.config.ts 中使用环境变量
// ====================

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // 加载当前模式的环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    define: {
      // 将环境变量注入到客户端代码
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET,
          changeOrigin: true
        }
      }
    }
  }
})

// ====================
// TypeScript 类型声明
// ====================

// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}`;export{n as default};
