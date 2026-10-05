const n=`// vite.config.ts - 依赖预构建配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    // 强制预构建的依赖
    include: [
      'lodash-es',
      'dayjs',
      // 子模块也要预构建
      'lodash-es/debounce',
      // 自定义包
      '@my-org/utils'
    ],
    
    // 排除不预构建的依赖
    exclude: ['vue-demi'],
    
    // 预构建时的 esbuild 配置
    esbuildOptions: {
      // 目标环境
      target: 'es2020',
      // 插件
      plugins: []
    },
    
    // 是否在开发服务器启动时强制预构建
    force: false
  }
})

// ====================
// 为什么需要预构建？
// ====================

// 1. CommonJS / UMD 兼容性
// 浏览器只支持 ESM，预构建将 CommonJS 转换为 ESM
import lodash from 'lodash' // CommonJS → ESM

// 2. 减少 HTTP 请求数
// 一个包有上百个模块 → 预构建为单个文件
import { debounce, throttle } from 'lodash-es'
// 原本可能发起 100+ 请求 → 预构建后只发 1 个

// ====================
// 缓存机制
// ====================

// 预构建产物缓存在:
// node_modules/.vite/deps/

// 缓存失效条件:
// - package.json 的 dependencies 变化
// - 包管理器 lockfile 变化 (package-lock.json, yarn.lock, pnpm-lock.yaml)
// - vite.config.ts 中 optimizeDeps 配置变化
// - NODE_ENV 变化

// 手动清除缓存并强制重新预构建:
// rm -rf node_modules/.vite
// 或启动时: vite --force

// ====================
// 自动依赖发现
// ====================

// Vite 会自动扫描源码中的 import 语句
import axios from 'axios'           // 自动发现
import { ref } from 'vue'          // 自动发现
import dayjs from 'dayjs'          // 自动发现

// 但动态导入可能无法被自动发现
const module = await import(someDynamicPath)
// 这种情况需要手动加到 include 中`;export{n as default};
