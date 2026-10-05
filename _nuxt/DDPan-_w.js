const n=`// 1. 显式导入资源（推荐）
// 导入后 Vite 会处理哈希、压缩等优化
import logo from './assets/logo.png'
import styles from './assets/style.css'

console.log(logo) // /assets/logo.2d3a5b1c.png

// ====================
// 2. public 目录中的资源
// ====================

// public/favicon.ico 可以直接通过 /favicon.ico 访问
// public 目录的文件会原样复制到 dist 根目录
// 适合: favicon.ico, robots.txt, og-image.png

// 引用方式
const faviconUrl = '/favicon.ico'

// ====================
// 3. 内联为 base64（小资源）
// ====================

// 小于 assetsInlineLimit 阈值的资源会被内联
import tinyIcon from './assets/tiny-icon.svg'

// 默认阈值是 4kb
// 结果: data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...

// ====================
// vite.config.ts 配置
// ====================

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // 内联阈值（字节），默认 4096 (4kb)
    assetsInlineLimit: 4096,
    
    // 静态资源输出目录
    assetsDir: 'assets',
    
    // 资源命名规则
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})

// ====================
// 特殊导入语法
// ====================

// 显式获取 URL（即使大于阈值也不内联）
import bigImage from './assets/big.png?url'

// 显式内联（即使大于阈值也内联）
import forceInline from './assets/icon.png?inline'

// 作为原始字符串导入
import svgRaw from './assets/icon.svg?raw'

// 作为 Worker 导入
import Worker from './worker.js?worker'

// 作为 Web Worker URL 导入
import workerUrl from './worker.js?worker&url'`;export{n as default};
