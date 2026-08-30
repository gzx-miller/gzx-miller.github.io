import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

const V01Core = createDemo('V01Core')
const V02Config = createDemo('V02Config')
const V03Plugins = createDemo('V03Plugins')
const V04HMR = createDemo('V04HMR')
const V05Env = createDemo('V05Env')
const V06Assets = createDemo('V06Assets')
const V07PreBundle = createDemo('V07PreBundle')
const V08Build = createDemo('V08Build')
const V09MPA = createDemo('V09MPA')
const V10Lib = createDemo('V10Lib')
const V11SSR = createDemo('V11SSR')
const V12CSS = createDemo('V12CSS')
const V13TypeScript = createDemo('V13TypeScript')
const V14Proxy = createDemo('V14Proxy')
const V15Perf = createDemo('V15Perf')
const V16PluginDev = createDemo('V16PluginDev')
const V17DependencyPrebundle = createDemo('V17DependencyPrebundle')
const V18Esbuild = createDemo('V18Esbuild')
const V19RollupPlugin = createDemo('V19RollupPlugin')
const V20LibraryMode = createDemo('V20LibraryMode')
const V21MultiPage = createDemo('V21MultiPage')

export const lessons: Lesson[] = [
{
    id: 'V_01', title: 'Vite 核心概念', navTitle: '核心概念', category: '基础',
    path: '/vite/v-1/core', summary: '理解 Vite 的两个阶段：开发服务器（原生 ESM）和生产构建（Rollup）。',
    demo: V01Core, code: () => Promise.resolve(`// Vite 开发服务器启动示例
import { createServer } from 'vite'

async function startDevServer() {
  // 创建 Vite 开发服务器
  const server = await createServer({
    root: process.cwd(),
    server: {
      port: 5173,
      open: true
    }
  })
  
  // 启动服务器
  await server.listen()
  
  // 打印服务器地址
  server.printUrls()
}

startDevServer()

// ====================
// 原生 ESM 导入示例
// ====================

// 浏览器直接通过 ESM 加载模块，无需打包
import { ref } from '/node_modules/.vite/deps/vue.js'
import App from './src/App.vue'

// Vite 对 Vue SFC 的即时编译
// 请求 /src/App.vue → Vite 即时编译 → 返回 JS 模块

// ====================
// 生产构建示例
// ====================

import { build } from 'vite'

async function buildForProduction() {
  // 基于 Rollup 的生产构建
  const result = await build({
    root: process.cwd(),
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  })
  
  console.log('构建完成:', result)
}

buildForProduction()`), language: 'typescript',
    principle: 'Vite 把工程分为开发与构建两个阶段：开发阶段利用浏览器原生 ESM 对源码做按需即时编译，无需打包成 bundle，HMR 只更新发生变化的模块；生产阶段切换 Rollup 打包，做 Tree Shaking、代码分割与压缩，输出高度优化的静态产物。',
    flow: ['通过核心概念卡片理解原生 ESM、Rollup 构建、HMR 与插件系统。', '对比 Vite 与传统打包器（Webpack）的差异。', '查看常用配置示例，了解 dev server、代理、别名与分包。'],
    notes: ['冷启动不受项目规模影响，代价是一次性的依赖预构建。', 'HMR 基于原生 ESM，只精确实时更新发生变化的模块。', '开发阶段按需加载源文件本身，生产阶段才做打包压缩优化。'],
    problem: '解决"传统打包器冷启动慢、HMR 更新延迟、依赖图膨胀"的问题。',
  },
{
    id: 'V_02', title: 'Vite 配置文件', navTitle: '配置文件', category: '配置',
    path: '/vite/v-2/config', summary: '使用 defineConfig 获得类型提示，掌握基础配置与常用选项。',
    demo: V02Config, code: () => Promise.resolve(`// vite.config.ts - 基础配置示例
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// 使用 defineConfig 获得完整类型提示
export default defineConfig({
  // 项目根目录
  root: process.cwd(),
  
  // 开发服务器配置
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015'
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components')
    }
  },
  
  // 插件
  plugins: [vue()]
})

// ====================
// 环境相关配置（函数式）
// ====================

export default defineConfig(({ mode, command }) => {
  // 根据模式返回不同配置
  const isProd = mode === 'production'
  const isBuild = command === 'build'
  
  return {
    plugins: [vue()],
    build: {
      sourcemap: !isProd,
      minify: isProd ? 'terser' : false
    },
    define: {
      __APP_VERSION__: JSON.stringify('1.0.0')
    }
  }
})

// ====================
// 条件加载插件
// ====================

import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const plugins = [vue()]
  
  // 仅在构建分析时添加可视化插件
  if (process.env.ANALYZE) {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html',
        open: true
      })
    )
  }
  
  return { plugins }
})`), language: 'typescript',
    principle: 'vite.config.ts 使用 defineConfig 包装以获得类型推导与提示；既可导出静态对象，也可导出接收 { mode, command } 的函数来按环境切换配置。',
    flow: ['查看基础配置示例（server、build）。', '查看高级配置：resolve.alias 别名、css 预处理器、rollupOptions 分包。', '了解导出函数按 mode 切换不同配置。'],
    notes: ['使用 defineConfig 可获得完整的类型提示。', 'resolve.alias 设置路径别名，css.preprocessorOptions 可注入全局样式。', '配置文件也可导出函数，按 mode 与 command 返回不同配置。'],
    problem: '解决"如何组织 Vite 配置，以及不同环境下如何切换配置"的问题。',
  },
{
    id: 'V_03', title: '插件系统', navTitle: '插件系统', category: '插件',
    path: '/vite/v-3/plugins', summary: '理解 Vite 插件兼容 Rollup 插件接口，掌握常用插件的使用。',
    demo: V03Plugins, code: () => Promise.resolve(`// vite.config.ts - 常用插件配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    // Vue 单文件组件支持
    vue(),
    
    // Vue JSX 支持
    vueJsx(),
    
    // 自动导入 API（ref, computed 等）
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts'
    }),
    
    // 自动导入组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    })
  ]
})

// ====================
// 插件执行顺序
// ====================

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // enforce: 'pre' - 在 Vite 核心插件之前执行
    {
      name: 'pre-plugin',
      enforce: 'pre',
      transform(code, id) {
        // 最早执行的转换
        return code
      }
    },
    
    // 普通插件 - 在 Vite 核心插件之后执行
    {
      name: 'normal-plugin',
      transform(code, id) {
        return code
      }
    },
    
    // enforce: 'post' - 在所有其他插件之后执行
    {
      name: 'post-plugin',
      enforce: 'post',
      transform(code, id) {
        // 最后执行的转换
        return code
      }
    }
  ]
})

// ====================
// 条件应用插件
// ====================

export default defineConfig(({ command }) => {
  const plugins = [vue()]
  
  // 仅在开发模式生效
  if (command === 'serve') {
    plugins.push(devOnlyPlugin())
  }
  
  // 仅在构建模式生效
  if (command === 'build') {
    plugins.push(buildOnlyPlugin())
  }
  
  return { plugins }
})`), language: 'typescript',
    principle: '在 vite.config.ts 的 plugins 数组中注册即可扩展 Vite 功能；常用插件覆盖 Vue 支持、Vue JSX、组件与 API 自动按需引入、PWA 等，社区插件多以 vite-plugin 或 unplugin 前缀分发。',
    flow: ['浏览常用插件列表。', '理解插件在 vite.config.ts 中的注册方式。', '了解插件执行顺序。'],
    notes: ['插件在 plugins 数组中按声明顺序执行，配合 enforce: pre/post 可调整先后。', 'unplugin-vue-components 与 unplugin-auto-import 可自动按需引入组件与 API。'],
    problem: '解决"如何扩展 Vite 功能，以及选择合适的插件"的问题。',
  },
{
    id: 'V_04', title: 'HMR 热更新', navTitle: 'HMR', category: '开发体验',
    path: '/vite/v-4/hmr', summary: '理解 Vite HMR 基于原生 ESM 的实现原理，以及 Vue/React 的框架集成。',
    demo: V04HMR, code: () => Promise.resolve(`// HMR API 手动使用示例
// src/hmr-example.ts

export const state = { count: 0 }

export function increment() {
  state.count++
}

// 接受自身的热更新
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // 模块更新时的回调
    console.log('模块已更新:', newModule)
    // 可以在这里做状态迁移
  })
}

// ====================
// 接受依赖模块的更新
// ====================

import { helper } from './helper'

export function useHelper() {
  return helper()
}

if (import.meta.hot) {
  // 接受 ./helper 的更新
  import.meta.hot.accept('./helper', (newHelper) => {
    console.log('helper 模块已更新')
    // 更新对 helper 的引用
  })
}

// ====================
// 自定义 HMR 边界处理
// ====================

// store.ts
export const store = {
  data: null
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // 热更新时保留状态
    // 或执行清理工作
  })
  
  // 热更新前的清理
  import.meta.hot.dispose(() => {
    console.log('模块即将被替换')
  })
}

// ====================
// Vue SFC 的 HMR（由 @vitejs/plugin-vue 自动处理）
// ====================

// Vite 会自动处理:
// - <template> 更新: 重新渲染组件，不丢失状态
// - <script setup> 更新: 销毁并重建组件，状态会丢失
// - <style> 更新: 即时更新，无需刷新

// 可以在组件中手动处理
if (import.meta.hot) {
  import.meta.hot.accept()
}`), language: 'typescript',
    principle: 'Vite HMR 基于原生 ESM，通过 import.meta.hot API 实现模块级热更新；Vue/React 插件自动处理状态保留。',
    flow: ['查看 HMR API 手动处理示例。', '理解 Vue SFC 的 HMR 行为。', '了解 React Fast Refresh 的工作原理。'],
    notes: ['Vue SFC 的 template 更新不丢失状态。', 'HMR 只更新变化的模块，速度极快。'],
    problem: '解决"开发时修改代码后页面刷新导致状态丢失"的问题。',
  },
{
    id: 'V_05', title: '环境变量与模式', navTitle: '环境变量', category: '配置',
    path: '/vite/v-5/env', summary: '使用 .env 文件和 import.meta.env 管理不同环境下的变量。',
    demo: V05Env, code: () => Promise.resolve(`// .env - 所有环境都会加载
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
}`), language: 'typescript',
    principle: 'Vite 使用 dotenv 加载 .env 文件；只有 VITE_ 前缀的变量会暴露到客户端（通过 import.meta.env 访问）。',
    flow: ['理解 .env 文件的加载优先级。', '学习在代码和配置中读取环境变量。', '掌握 VITE_ 前缀的作用和安全意义。'],
    notes: ['import.meta.env.MODE 可获取当前模式。', '敏感信息（如数据库密码）不应使用 VITE_ 前缀。'],
    problem: '解决"如何在不同环境（开发/测试/生产）中使用不同的 API 地址"的问题。',
  },
{
    id: 'V_06', title: '静态资源处理', navTitle: '静态资源', category: '资源',
    path: '/vite/v-6/assets', summary: '理解导入哈希化、public 目录和 base64 内联三种资源处理方式。',
    demo: V06Assets, code: () => Promise.resolve(`// 1. 显式导入资源（推荐）
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
import workerUrl from './worker.js?worker&url'`), language: 'typescript',
    principle: 'Vite 对静态资源有三种处理：导入的资源会被哈希化并复制到构建产物；public 目录的文件原样复制；小于阈值的小资源会被内联为 base64。',
    flow: ['理解显式导入的资源处理方式。', '了解 public 目录的适用场景。', '掌握 assetsInlineLimit 配置。'],
    notes: ['优先使用导入方式引用资源（可获得哈希和优化）。', 'public 目录适合不常变更的静态文件（favicon、robots.txt）。'],
    problem: '解决"静态资源在构建后路径错误，或希望控制资源哈希/内联行为"的问题。',
  },
{
    id: 'V_07', title: '依赖预构建', navTitle: '预构建', category: '性能',
    path: '/vite/v-7/pre-bundle', summary: '理解 Vite 使用 Esbuild 预构建 node_modules 依赖的原因和配置方式。',
    demo: V07PreBundle, code: () => Promise.resolve(`// vite.config.ts - 依赖预构建配置
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
// 这种情况需要手动加到 include 中`), language: 'typescript',
    principle: 'Vite 使用 Esbuild 将 CommonJS/大量 ESM 依赖转换为单个 ESM 文件，减少 HTTP 请求并兼容 CommonJS 模块。',
    flow: ['理解为什么需要依赖预构建。', '学习 optimizeDeps 配置。', '了解 Esbuild 在 Vite 中的其他用途。'],
    notes: ['预构建产物缓存在 node_modules/.vite/。', '删除缓存可强制重新预构建。'],
    problem: '解决"首次启动慢，或某些 CommonJS 包无法直接使用"的问题。',
  },
{
    id: 'V_08', title: '构建优化', navTitle: '构建优化', category: '构建',
    path: '/vite/v-8/build', summary: '掌握代码分割、懒加载、压缩等 Vite 生产构建优化手段。',
    demo: V08Build, code: () => Promise.resolve(`// vite.config.ts - 构建优化配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 源码映射
    sourcemap: false,
    
    // 压缩方式: 'esbuild' | 'terser' | false
    minify: 'esbuild',
    
    // 目标环境
    target: 'es2015',
    
    // 代码分割配置
    rollupOptions: {
      output: {
        // 手动分包策略
        manualChunks: {
          // Vue 生态单独打包
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI 库单独打包
          'element-plus': ['element-plus'],
          // 工具库单独打包
          'utils': ['lodash-es', 'dayjs']
        }
      }
    },
    
    // chunk 大小警告阈值（默认 500kb）
    chunkSizeWarningLimit: 500
  }
})

// ====================
// 路由级懒加载（代码分割）
// ====================

// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue')
    }
  ]
})

// ====================
// 组件级懒加载
// ====================

import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(() =>
  import('../components/HeavyComponent.vue')
)

// 带加载状态和错误状态
const HeavyComponentWithLoading = defineAsyncComponent({
  loader: () => import('../components/HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000
})

// ====================
// Terser 高级压缩配置
// ====================

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console
        drop_console: true,
        // 移除 debugger
        drop_debugger: true,
        // 移除未使用的代码
        unused: true
      },
      mangle: {
        // 混淆变量名
        safari10: true
      }
    }
  }
})`), language: 'typescript',
    principle: 'Vite 基于 Rollup 构建，支持自动代码分割（每个动态 import 生成独立 chunk）、手动分包、多种压缩策略。',
    flow: ['学习自动代码分割和手动分包配置。', '理解路由级懒加载的实现。', '掌握 esbuild/terser 压缩配置。'],
    notes: ['动态 import() 是代码分割的基础。', 'esbuild 压缩速度快，terser 压缩率高。'],
    problem: '解决"生产构建产物过大，或希望控制 chunk 分割策略"的问题。',
  },
{
    id: 'V_09', title: '多页面应用（MPA）', navTitle: 'MPA', category: '构建',
    path: '/vite/v-9/mpa', summary: '配置多个 HTML 入口，构建多页面应用。',
    demo: V09MPA, code: () => Promise.resolve(`// vite.config.ts - 多页面应用配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        // 主入口
        main: resolve(__dirname, 'index.html'),
        // 管理后台入口
        admin: resolve(__dirname, 'admin/index.html'),
        // 登录页入口
        login: resolve(__dirname, 'login/index.html')
      }
    }
  }
})

// ====================
// 项目结构示例
// ====================

// project/
//   ├── index.html          # 主页面入口
//   ├── admin/
//   │   └── index.html      # 管理后台入口
//   ├── login/
//   │   └── index.html      # 登录页入口
//   ├── src/
//   │   ├── main/
//   │   │   └── main.ts     # 主页面入口脚本
//   │   ├── admin/
//   │   │   └── main.ts     # 管理后台入口脚本
//   │   ├── login/
//   │   │   └── main.ts     # 登录页入口脚本
//   │   └── shared/         # 共享代码
//   └── vite.config.ts

// ====================
// HTML 入口文件示例
// ====================

// index.html
// <!DOCTYPE html>
// <html lang="zh-CN">
//   <head>
//     <title>首页</title>
//   </head>
//   <body>
//     <div id="app"></div>
//     <script type="module" src="/src/main/main.ts"></script>
//   </body>
// </html>

// admin/index.html
// <!DOCTYPE html>
// <html lang="zh-CN">
//   <head>
//     <title>管理后台</title>
//   </head>
//   <body>
//     <div id="app"></div>
//     <script type="module" src="/src/admin/main.ts"></script>
//   </body>
// </html>

// ====================
// 开发服务器访问路径
// ====================

// http://localhost:5173/           →  index.html
// http://localhost:5173/admin/     →  admin/index.html
// http://localhost:5173/login/     →  login/index.html

// ====================
// 构建产物
// ====================

// dist/
//   ├── index.html
//   ├── admin/
//   │   └── index.html
//   ├── login/
//   │   └── index.html
//   └── assets/
//       ├── main-xxx.js
//       ├── admin-xxx.js
//       ├── login-xxx.js
//       └── shared-xxx.js  # 共享依赖自动提取`), language: 'typescript',
    principle: 'Vite 通过 build.rollupOptions.input 配置多个 HTML 入口；每个入口是独立的页面，共享依赖会被提取为 common chunk。',
    flow: ['学习 MPA 配置方式。', '理解项目结构组织。', '对比 MPA 与 SPA 的适用场景。'],
    notes: ['每个 HTML 文件使用 <script type="module"> 引入入口 JS。', '共享依赖自动提取，不会重复打包。'],
    problem: '解决"项目需要多个独立页面（如官网+管理后台），而不想用 SPA 前端路由"的问题。',
  },
{
    id: 'V_10', title: '库模式', navTitle: '库模式', category: '构建',
    path: '/vite/v-10/lib', summary: '使用 Vite 构建可发布的 npm 包，同时输出 ESM/UMD/CJS 格式。',
    demo: V10Lib, code: () => Promise.resolve(`// vite.config.ts - 库模式配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      // 入口文件
      entry: resolve(__dirname, 'src/index.ts'),
      
      // 包名（UMD 格式需要）
      name: 'MyLibrary',
      
      // 输出格式
      formats: ['es', 'cjs', 'umd'],
      
      // 输出文件名
      fileName: (format) => \`my-library.\${format}.js\`
    },
    
    rollupOptions: {
      // 外部化依赖（不打包进产物）
      external: ['vue', 'vue-router'],
      
      output: {
        // UMD 格式下的全局变量映射
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter'
        }
      }
    }
  }
})

// ====================
// 库入口文件示例 (src/index.ts)
// ====================

// 导出组件
export { default as Button } from './components/Button.vue'
export { default as Input } from './components/Input.vue'

// 导出 composable
export { useCounter } from './composables/useCounter'
export { useForm } from './composables/useForm'

// 导出工具函数
export { formatDate, debounce } from './utils'

// 导出类型
export type { ButtonProps, InputProps } from './types'

// ====================
// package.json 配置
// ====================

// {
//   "name": "my-library",
//   "version": "1.0.0",
//   "type": "module",
//   // ESM 入口
//   "module": "./dist/my-library.es.js",
//   // CJS 入口
//   "main": "./dist/my-library.cjs.js",
//   // 类型声明入口
//   "types": "./dist/index.d.ts",
//   // 导出映射
//   "exports": {
//     ".": {
//       "import": "./dist/my-library.es.js",
//       "require": "./dist/my-library.cjs.js",
//       "types": "./dist/index.d.ts"
//     }
//   },
//   // peer dependencies
//   "peerDependencies": {
//     "vue": "^3.0.0"
//   },
//   // 文件发布到 npm
//   "files": ["dist"]
// }

// ====================
// 生成类型声明（配合 vite-plugin-dts）
// ====================

import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      // 输出目录
      outDir: 'dist',
      // 是否插入类型入口
      insertTypesEntry: true,
      // 包含的文件
      include: ['src/**/*.ts', 'src/**/*.vue']
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLibrary',
      formats: ['es', 'cjs']
    }
  }
})`), language: 'typescript',
    principle: 'Vite 库模式通过 build.lib 配置，可同时输出 ESM（供现代打包器）、UMD（供 CDN）、CJS（供 Node.js）格式。',
    flow: ['学习库模式配置。', '理解构建产物结构。', '掌握发布到 npm 的完整流程。'],
    notes: ['使用 peerDependencies 声明框架依赖（如 vue）。', 'package.json 的 module/main 字段指向对应格式产物。'],
    problem: '解决"如何开发一个同时支持 ESM 和 UMD 引入的 npm 包"的问题。',
  },
{
    id: 'V_11', title: '服务端渲染（SSR）', navTitle: 'SSR', category: '进阶',
    path: '/vite/v-11/ssr', summary: '理解 Vite SSR 工作原理，以及 Nuxt 3/4 如何基于 Vite 实现 SSR。',
    demo: V11SSR, code: () => Promise.resolve(`// server.js - Vite SSR 基础服务端
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
})`), language: 'typescript',
    principle: 'Vite SSR 在服务器端运行 Vue 组件生成 HTML，在客户端进行 Hydration（激活）；Nuxt 3/4 内置了完整的 SSR 支持。',
    flow: ['理解 SSR 的工作原理和优势。', '学习 Vite SSR 的基础配置。', '了解 Nuxt 如何基于 Vite 实现 SSR。'],
    notes: ['SSR 有利于 SEO 和首屏速度。', '本仓库（小松鼠举栗子）就是使用 Nuxt 4 + Vite 构建的！'],
    problem: '解决"Vue 应用需要 SEO 友好，或希望提升首屏加载速度"的问题。',
  },
{
    id: 'V_12', title: 'CSS 与 PostCSS', navTitle: 'CSS处理', category: '样式',
    path: '/vite/v-12/css', summary: 'Vite 内置支持 PostCSS、Sass/Less/Stylus 预处理器和 CSS Modules。',
    demo: V12CSS, code: () => Promise.resolve(`// vite.config.ts - CSS 相关配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    // PostCSS 配置（也可以用 postcss.config.js）
    postcss: {
      plugins: [
        // 自动添加浏览器前缀
        require('autoprefixer'),
        // CSS 嵌套
        require('postcss-nested'),
        // 自定义插件
        require('tailwindcss')
      ]
    },
    
    // CSS Modules 配置
    modules: {
      // 生成的类名格式
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      // 是否使用 camelCase
      localsConvention: 'camelCase'
    },
    
    // 预处理器配置
    preprocessorOptions: {
      scss: {
        // 全局注入的变量和 mixin
        additionalData: \`
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        \`,
        // 其他 sass 选项
        api: 'modern-compiler'
      },
      less: {
        // Less 全局变量
        modifyVars: {
          'primary-color': '#1890ff'
        },
        javascriptEnabled: true
      }
    }
  }
})

// ====================
// PostCSS 配置文件 (postcss.config.js)
// ====================

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}

// ====================
// CSS Modules 使用示例
// ====================

// src/styles/Button.module.css
// .button {
//   padding: 8px 16px;
//   border-radius: 4px;
// }
// 
// .primary {
//   background-color: #1890ff;
//   color: white;
// }

// 在组件中使用
import styles from './Button.module.css'

export default {
  template: \`
    <button :class="[styles.button, styles.primary]">
      点击我
    </button>
  \`
}

// 生成的类名: Button__button___abc123 Button__primary___def456

// ====================
// Vue SFC 中的 CSS Modules
// ====================

// <style module>
// .red {
//   color: red;
// }
// </style>
// 
// <template>
//   <p :class="$style.red">这是红色文字</p>
// </template>

// ====================
// CSS 预处理器使用示例
// ====================

// 安装: npm install -D sass
// 然后在 Vue SFC 中直接使用:
// <style lang="scss">
// $primary-color: #1890ff;
// 
// .button {
//   background: $primary-color;
//   
//   &:hover {
//     opacity: 0.8;
//   }
// }
// </style>`), language: 'typescript',
    principle: 'Vite 自动检测 PostCSS 配置；安装预处理器（如 sass）后即可在 Vue SFC 中使用；CSS Modules 在 Vue SFC 中默认启用。',
    flow: ['学习 PostCSS 配置方式。', '掌握预处理器（Sass/Less）的使用。', '理解 CSS Modules 在 Vue 中的使用。'],
    notes: ['Vue SFC 的 <style scoped> 已提供组件级样式隔离。', '预处理器需要单独安装（npm install -D sass）。'],
    problem: '解决"如何在 Vite 项目中使用 Tailwind、Sass 或 CSS Modules"的问题。',
  },
{
    id: 'V_13', title: 'TypeScript 集成', navTitle: 'TypeScript', category: '类型',
    path: '/vite/v-13/typescript', summary: 'Vite 使用 Esbuild 极速转译 TypeScript，类型检查由 IDE 或 vue-tsc 单独完成。',
    demo: V13TypeScript, code: () => Promise.resolve(`// vite.config.ts - TypeScript 配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  // esbuild 配置（用于 TS/JSX 转译）
  esbuild: {
    // 目标语法
    target: 'es2020',
    
    // 移除 console（仅构建时）
    // drop: ['console', 'debugger'],
    
    // JSX 配置
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})

// ====================
// tsconfig.json 配置
// ====================

// {
//   "compilerOptions": {
//     "target": "ES2020",
//     "module": "ESNext",
//     "moduleResolution": "Bundler",
//     "strict": true,
//     "jsx": "preserve",
//     "sourceMap": true,
//     "resolveJsonModule": true,
//     "esModuleInterop": true,
//     "lib": ["ES2020", "DOM", "DOM.Iterable"],
//     "skipLibCheck": true,
//     
//     // 路径别名
//     "baseUrl": ".",
//     "paths": {
//       "@/*": ["src/*"]
//     },
//     
//     // 类型声明文件
//     "types": ["vite/client"]
//   },
//   "include": [
//     "src/**/*.ts",
//     "src/**/*.tsx",
//     "src/**/*.vue",
//     "src/**/*.d.ts"
//   ]
// }

// ====================
// Vite 客户端类型声明 (src/vite-env.d.ts)
// ====================

/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// ====================
// package.json - 类型检查脚本
// ====================

// {
//   "scripts": {
//     "dev": "vite",
//     "build": "vue-tsc --noEmit && vite build",
//     "type-check": "vue-tsc --noEmit",
//     "type-check:watch": "vue-tsc --noEmit --watch"
//   }
// }

// 运行类型检查:
// npm run type-check

// ====================
// Vue SFC 中使用 TypeScript
// ====================

// <script setup lang="ts">
// import { ref, computed } from 'vue'
// 
// interface User {
//   id: number
//   name: string
//   email: string
// }
// 
// const user = ref<User | null>(null)
// const userName = computed(() => user.value?.name ?? '未登录')
// 
// function updateUser(data: Partial<User>) {
//   if (user.value) {
//     Object.assign(user.value, data)
//   }
// }
// </script>`), language: 'typescript',
    principle: 'Vite 使用 Esbuild 转译 TypeScript（移除类型注解，不做类型检查）；类型检查由 IDE 或单独运行 vue-tsc --noEmit 完成。',
    flow: ['理解 Vite 的 TypeScript 处理策略。', '学习 Vue SFC 中使用 TypeScript。', '掌握类型检查的最佳实践。'],
    notes: ['Vite 不负责类型检查（保证开发服务器速度）。', '建议配置 type-check 脚本在构建前运行。'],
    problem: '解决"Vite 项目中如何获得完整的 TypeScript 支持，以及类型检查应该由谁负责"的问题。',
  },
{
    id: 'V_14', title: '代理与跨域', navTitle: '代理跨域', category: '开发体验',
    path: '/vite/v-14/proxy', summary: '使用 Vite 开发服务器代理解决开发环境跨域问题。',
    demo: V14Proxy, code: () => Promise.resolve(`// vite.config.ts - 代理配置
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
// 3. 部署在同一域名下`), language: 'typescript',
    principle: 'Vite 开发服务器的 server.proxy 配置基于 http-proxy，可将特定路径的请求代理到后端服务器，避免浏览器 CORS 限制。',
    flow: ['学习基础代理配置。', '掌握路径重写和 WebSocket 代理。', '了解 CORS 问题的其他解决方案。'],
    notes: ['changeOrigin: true 会修改请求头的 Origin。', '代理只作用于开发环境，生产环境需要后端配置 CORS 或使用 Nginx 反向代理。'],
    problem: '解决"开发环境中前端请求后端 API 遇到 CORS 错误"的问题。',
  },
{
    id: 'V_15', title: '性能分析', navTitle: '性能分析', category: '性能',
    path: '/vite/v-15/perf', summary: '使用可视化工具和最佳实践分析和优化 Vite 构建产物。',
    demo: V15Perf, code: () => Promise.resolve(`// vite.config.ts - 性能分析配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const plugins = [vue()]
  
  // 构建分析（仅在 ANALYZE 模式下启用）
  if (process.env.ANALYZE) {
    plugins.push(
      visualizer({
        // 输出文件名
        filename: 'dist/stats.html',
        // 自动打开
        open: true,
        // 可视化类型: 'sunburst' | 'treemap' | 'network'
        template: 'treemap',
        // 显示 gzip 大小
        gzipSize: true,
        // 显示 brotli 大小
        brotliSize: true
      })
    )
  }
  
  return {
    plugins,
    build: {
      // 生成 sourcemap 便于分析
      sourcemap: true,
      
      // 手动分包
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            utils: ['lodash-es', 'dayjs']
          }
        }
      }
    }
  }
})

// 运行分析:
// ANALYZE=true vite build
// 或在 package.json 中: "analyze": "cross-env ANALYZE=true vite build"

// ====================
// 构建性能优化配置
// ====================

export default defineConfig({
  build: {
    // 使用 esbuild 压缩（更快）
    minify: 'esbuild',
    
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
    
    // 目标为现代浏览器（更快、更小）
    target: 'es2020',
    
    // CSS 代码分割
    cssCodeSplit: true,
    
    rollupOptions: {
      output: {
        // 压缩 rollup 输出
        compact: true
      }
    }
  },
  
  // 依赖预构建优化
  optimizeDeps: {
    // 强制预构建大型依赖
    include: ['lodash-es', 'echarts'],
    // 使用 esbuild 插件加速
    esbuildOptions: {
      target: 'es2020'
    }
  }
})

// ====================
// 开发服务器性能优化
// ====================

export default defineConfig({
  server: {
    // 预热常用模块
    warmup: {
      clientFiles: [
        './src/main.ts',
        './src/App.vue',
        './src/router/index.ts'
      ]
    }
  },
  
  // 预构建优化
  optimizeDeps: {
    // 提前预构建所有依赖
    include: ['vue', 'vue-router', 'pinia', 'axios', 'dayjs']
  }
})

// ====================
// 图片优化（vite-plugin-imagemin）
// ====================

import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    vue(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: {
        plugins: [{ name: 'removeViewBox' }]
      }
    })
  ]
})`), language: 'typescript',
    principle: '用 rollup-plugin-visualizer 生成可视化的构建产物报告来分析体积；优化手段包括按需引入以减小依赖体积、将大型库外部化交给 CDN、合理代码分包与设置 chunk 大小阈值。',
    flow: ['学习使用 rollup-plugin-visualizer 分析产物。', '掌握 Vite 性能优化清单。', '了解如何监控构建和运行时的性能指标。'],
    notes: ['定期分析 bundle 大小，及时发现体积膨胀。', '大型库（如 lodash-es）应使用按需引入。'],
    problem: '解决"构建产物过大，或希望找到体积膨胀的原因"的问题。',
  },
{
    id: 'V_16', title: '自定义插件开发', navTitle: '插件开发', category: '进阶',
    path: '/vite/v-16/plugin-dev', summary: '理解 Vite 插件结构，动手开发一个简单的自定义插件。',
    demo: V16PluginDev, code: () => Promise.resolve(`// vite-plugin-markdown-to-vue.ts - 自定义插件示例
// 将 .md 文件转换为 Vue 组件

import type { Plugin } from 'vite'
import { marked } from 'marked'

export default function markdownPlugin(): Plugin {
  return {
    // 插件名称
    name: 'vite-plugin-markdown-to-vue',
    
    // 插件执行顺序: 'pre' | 'post' | 不设置
    enforce: 'pre',
    
    // 配置钩子 - 修改 Vite 配置
    config(config, { mode }) {
      // 返回部分配置，会被深度合并
      return {
        resolve: {
          extensions: ['.md']
        }
      }
    },
    
    // 配置已解析钩子 - 获取最终配置
    configResolved(resolvedConfig) {
      // 可以在这里保存配置供后续使用
    },
    
    // 开发服务器配置钩子
    configureServer(server) {
      // 添加自定义中间件
      server.middlewares.use('/hello', (req, res) => {
        res.end('Hello from Vite plugin!')
      })
    },
    
    // 转换 index.html
    transformIndexHtml(html) {
      return html.replace(
        '<title>',
        '<title>【插件注入】'
      )
    },
    
    // 解析 ID - 处理虚拟模块
    resolveId(id) {
      if (id === 'virtual:my-module') {
        // \0 前缀表示虚拟模块，不会被其他插件处理
        return '\\0virtual:my-module'
      }
    },
    
    // 加载模块内容
    load(id) {
      if (id === '\\0virtual:my-module') {
        return 'export default "这是虚拟模块的内容"'
      }
      
      // 处理 .md 文件
      if (id.endsWith('.md')) {
        // 返回 null 让其他插件/默认加载器处理
        return null
      }
    },
    
    // 转换代码
    transform(code, id) {
      // 只处理 .md 文件
      if (!id.endsWith('.md')) return null
      
      // 将 Markdown 转换为 HTML
      const html = marked.parse(code) as string
      
      // 包装为 Vue 组件
      const vueCode = \`
<template>
  <div class="markdown-body">
    \${html}
  </div>
</template>

<style scoped>
.markdown-body {
  line-height: 1.8;
}
.markdown-body h1 { font-size: 2em; margin: 0.67em 0; }
.markdown-body h2 { font-size: 1.5em; margin: 0.83em 0; }
.markdown-body p { margin: 1em 0; }
</style>
      \`
      
      return {
        code: vueCode,
        map: null // 可以提供 source map
      }
    },
    
    // 构建完成钩子
    closeBundle() {
      console.log('构建完成！')
    }
  }
}

// ====================
// 使用自定义插件
// ====================

// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import markdownPlugin from './vite-plugin-markdown-to-vue'

export default defineConfig({
  plugins: [
    vue(),
    markdownPlugin()
  ]
})

// 在代码中使用:
// import Readme from './README.md'

// ====================
// 插件命名规范
// ====================

// 命名: vite-plugin-xxx
// 包名: vite-plugin-xxx
// 导出函数: xxxPlugin() 或 default
// name 字段: 'vite-plugin-xxx'
// 提供 TypeScript 类型支持`), language: 'typescript',
    principle: '自定义插件是返回插件对象（含 name 与各钩子）的函数：既有 Rollup 兼容的 resolveId、load、transform，也有 Vite 独有的 config、configureServer、transformIndexHtml、handleHotUpdate，以此参与开发与构建流程。',
    flow: ['理解 Vite 插件的结构和钩子。', '学习自定义插件开发示例。', '掌握发布 Vite 插件到 npm 的流程。'],
    notes: ['插件命名规范为 vite-plugin-xxx，导出函数返回插件对象。', '可利用 transform 钩子改写模块代码，例如注入版本号等全局信息。'],
    problem: '解决"现有插件无法满足需求，需要为项目定制构建行为"的问题。',
  },
{
    id: 'V_17', title: '依赖预构建与缓存优化', navTitle: '依赖预构建', category: '性能',
    path: '/vite/v-17/dependency-prebundle', summary: '理解 Vite 使用 esbuild 预构建依赖的原理，掌握缓存优化和配置。',
    demo: V17DependencyPrebundle, code: () => Promise.resolve(`// vite.config.ts - 依赖预构建详细配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    // 强制预构建的依赖
    include: [
      // 完整的包
      'lodash-es',
      'dayjs',
      // 子模块（如果未被自动发现）
      'lodash-es/debounce',
      'lodash-es/throttle',
      // 作用域包
      '@vueuse/core',
      // monorepo 内部包
      '@my-org/utils'
    ],
    
    // 排除不预构建的依赖
    exclude: [
      // Vue 插件通常不需要预构建
      'vue-demi',
      // 纯 ESM 且模块少的包
      'nanoid'
    ],
    
    // esbuild 转换选项
    esbuildOptions: {
      // 目标环境
      target: 'es2020',
      // 支持的平台
      platform: 'browser',
      // 插件
      plugins: [
        // 自定义 esbuild 插件
      ]
    },
    
    // 是否强制重新预构建（忽略缓存）
    force: false,
    
    // 预构建的入口文件
    entries: ['index.html']
  }
})

// ====================
// 缓存机制详解
// ====================

// 缓存位置:
// Linux/Mac:  node_modules/.vite/deps/
// Windows:    node_modules\\.vite\\deps\\

// 缓存文件:
// - vue.js              # 预构建后的 Vue
// - vue.js.map          # sourcemap
// - _metadata.json      # 元数据（依赖列表、hash 等）

// 缓存失效条件:
// 1. package.json 的 dependencies 变化
// 2. 包管理器 lockfile 变化 (package-lock.json / yarn.lock / pnpm-lock.yaml)
// 3. vite.config.ts 中 optimizeDeps 配置变化
// 4. VITE_ 前缀的环境变量变化（如果配置文件用到了）
// 5. NODE_ENV 变化
// 6. force: true 或 vite --force

// ====================
// 手动控制缓存
// ====================

// 清除缓存并强制重新构建:
// 1. 删除目录: rm -rf node_modules/.vite
// 2. 启动参数: vite --force
// 3. 配置选项: optimizeDeps.force = true

// 缓存预热（开发服务器启动时）:
// server.warmup 可以提前转换常用模块

// ====================
// 常见问题与解决方案
// ====================

// 问题 1: 某个包找不到（动态 import 的依赖）
// 解决: 手动添加到 include
optimizeDeps: {
  include: ['some-dynamic-dep']
}

// 问题 2: CommonJS 包报错
// 解决: esbuild 通常能自动转换，如不行则:
optimizeDeps: {
  include: ['problematic-cjs-package']
}

// 问题 3: 启动太慢
// 解决:
// 1. 确保缓存有效
// 2. 减少 include 中的包
// 3. 升级 esbuild
// 4. 使用 SSD

// 问题 4: 依赖更新后没生效
// 解决: 删除缓存或使用 --force 重新构建`), language: 'typescript',
    principle: 'Vite 在首次启动时使用 esbuild 预构建 node_modules 中的依赖，将 CommonJS/UMD 转换为 ESM，并缓存到磁盘，避免重复构建提升启动速度。',
    flow: ['首次启动 Vite 时扫描依赖并预构建。', '构建结果缓存到 node_modules/.vite。', '后续启动直接读取缓存，依赖变化时重新构建。'],
    notes: ['预构建只处理第三方依赖，源码不预构建。', 'optimizeDeps.include 可以强制预构建某些包。', '缓存失效会自动检测并重新构建。'],
    problem: '解决"大量依赖下启动慢、CommonJS 模块无法直接在浏览器运行"的问题。',
  },
{
    id: 'V_18', title: 'esbuild 转换与 JSX/TS 处理', navTitle: 'esbuild 转换', category: '基础',
    path: '/vite/v-18/esbuild', summary: '了解 Vite 使用 esbuild 进行极速语法转换的机制，以及 TypeScript 和 JSX 的处理策略。',
    demo: V18Esbuild, code: () => Promise.resolve(`// vite.config.ts - esbuild 配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  // esbuild 配置（同时影响开发和构建）
  esbuild: {
    // 目标环境
    target: 'es2020',
    // 等价于: ['es2020', 'chrome80', 'safari14', 'firefox72']
    
    // 支持的平台: 'browser' | 'node' | 'neutral'
    platform: 'browser',
    
    // 是否启用 JSX 自动转换
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: "import { h, Fragment } from 'vue'",
    
    // 构建时移除特定代码
    // drop: ['console', 'debugger'],
    
    // 保留所有注释
    // legalComments: 'none' | 'inline' | 'end-of-file' | 'external'
  },
  
  // 开发环境下的 esbuild 配置
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      // 预构建时的 esbuild 插件
      plugins: []
    }
  }
})

// ====================
// TypeScript 转换流程
// ====================

// 开发环境:
// .ts 文件请求 → esbuild 转译（移除类型）→ 浏览器执行
// 特点: 极快（Go 编写），不做类型检查

// 构建环境:
// .ts 文件 → Rollup (esbuild 转译) → 打包 → 输出
// 类型检查: 由 vue-tsc / tsc 单独负责

// 输入:
// interface User {
//   name: string
//   age: number
// }
// 
// function greet(user: User): string {
//   return \`Hello, \${user.name}!\`
// }

// 输出 (esbuild 转译后):
// function greet(user) {
//   return \`Hello, \${user.name}!\`
// }

// ====================
// JSX 转换示例
// ====================

// 输入 (TSX):
// const element = <div className="app">Hello</div>

// 输出 (经典模式):
// const element = React.createElement("div", { className: "app" }, "Hello")

// 输出 (自动转换模式):
// import { jsx as _jsx } from "react/jsx-runtime"
// const element = _jsx("div", { className: "app", children: "Hello" })

// Vue JSX 配置:
// esbuild: {
//   jsxFactory: 'h',
//   jsxFragment: 'Fragment'
// }

// ====================
// esbuild 不支持的 TypeScript 特性
// ====================

// 1. const enum（需要配置 preserveValueImports）
// 2. export = / import = (CommonJS 风格)
// 3. 装饰器的 emitDecoratorMetadata
// 4. 某些严格模式下的检查（类型检查阶段做）

// 解决方案:
// 1. 使用普通 enum 代替 const enum
// 2. 使用 ES Module 语法
// 3. 装饰器用 Babel 插件或其他工具
// 4. 类型检查交给 vue-tsc

// ====================
// 手动使用 esbuild（API 示例）
// ====================

import * as esbuild from 'esbuild'

// 转换 TypeScript
async function transformTS(code: string) {
  const result = await esbuild.transform(code, {
    loader: 'ts',
    target: 'es2020'
  })
  return result.code
}

// 转换 JSX
async function transformJSX(code: string) {
  const result = await esbuild.transform(code, {
    loader: 'tsx',
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  })
  return result.code
}

// 构建
await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  target: 'es2020'
})`), language: 'typescript',
    principle: 'Vite 使用 esbuild 处理 TypeScript 和 JSX 转换，esbuild 用 Go 编写比传统 JS 工具快 10-100 倍，开发环境下跳过类型检查只做语法转换。',
    flow: ['源码中的 .ts/.tsx 文件请求到达 Vite 开发服务器。', 'esbuild 进行语法转换，输出纯 JS。', '浏览器直接运行转换后的 ESM 模块。'],
    notes: ['开发环境与依赖预构建都由 esbuild 快速做语法转换，不做类型检查。', 'esbuild 不支持 const enum、export = 等 TS 特性，需改用兼容写法。', '完整类型检查交给 tsc 或 vue-tsc，在构建前或 CI 中执行。'],
    problem: '解决"传统构建工具 TS/JSX 编译速度慢、开发体验差"的问题。',
  },
{
    id: 'V_19', title: 'Rollup 插件兼容与构建钩子', navTitle: 'Rollup 插件', category: '插件',
    path: '/vite/v-19/rollup-plugin', summary: '理解 Vite 与 Rollup 插件的兼容性，掌握 Vite 特有钩子和插件使用方式。',
    demo: V19RollupPlugin, code: () => Promise.resolve(`// vite.config.ts - Rollup 插件使用示例
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import image from '@rollup/plugin-image'

export default defineConfig({
  plugins: [
    vue(),
    // Rollup 插件可以直接在 Vite 中使用
    visualizer({
      filename: 'dist/stats.html'
    }),
    image()
  ]
})

// ====================
// Vite 特有钩子 vs Rollup 钩子
// ====================

// Vite 特有钩子（开发和构建都可能用到）:
// - config              修改 Vite 配置
// - configResolved      配置解析完成
// - configureServer     配置开发服务器
// - transformIndexHtml  转换 index.html
// - handleHotUpdate     处理 HMR 更新
// - configurePreviewServer  配置预览服务器
// - resolveId (开发时)  解析模块 ID
// - load (开发时)       加载模块
// - transform (开发时)  转换模块

// Rollup 兼容钩子（主要在构建时使用）:
// - options             构建选项
// - buildStart          构建开始
// - resolveId           解析模块 ID
// - load                加载模块
// - transform           转换代码
// - moduleParsed        模块解析完成
// - resolveDynamicImport  解析动态导入
// - buildEnd            构建结束
// - outputOptions       输出选项
// - renderStart         渲染开始
// - renderChunk         渲染 chunk
// - generateBundle      生成 bundle
// - writeBundle         写入 bundle
// - closeBundle         关闭 bundle

// ====================
// 插件应用阶段控制
// ====================

import type { Plugin } from 'vite'

function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    
    // 只在开发时生效
    apply: 'serve',
    // 或只在构建时生效
    // apply: 'build',
    // 或根据条件决定
    // apply(config, { command }) {
    //   return command === 'serve' && !config.build.ssr
    // },
    
    configureServer(server) {
      // 只有开发模式才会执行
    },
    
    generateBundle() {
      // 只有构建模式才会执行
    }
  }
}

// ====================
// 插件执行顺序
// ====================

// 1. Alias 插件
// 2. enforce: 'pre' 的用户插件
// 3. Vite 核心插件
// 4. 普通用户插件
// 5. Vite 构建插件
// 6. enforce: 'post' 的用户插件
// 7. Vite 后置构建插件（压缩、manifest 等）

// 示例:
// plugins: [
//   { name: 'pre-plugin', enforce: 'pre', ... },
//   { name: 'normal-plugin', ... },
//   { name: 'post-plugin', enforce: 'post', ... }
// ]

// ====================
// 条件应用 Rollup 插件
// ====================

export default defineConfig(({ command }) => {
  const plugins = [vue()]
  
  // 仅在构建时使用的 Rollup 插件
  if (command === 'build') {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html'
      })
    )
  }
  
  return { plugins }
})

// ====================
// 编写兼容 Vite 和 Rollup 的插件
// ====================

import type { Plugin } from 'vite'

function universalPlugin(): Plugin {
  return {
    name: 'universal-plugin',
    
    // Vite 特有钩子（开发模式）
    configureServer(server) {
      // 开发模式下的逻辑
    },
    
    // Rollup 兼容钩子（构建模式 + 开发模式转换）
    transform(code, id) {
      // 开发和构建模式都执行
      if (!id.endsWith('.custom')) return null
      
      return {
        code: transformCustomCode(code),
        map: null
      }
    },
    
    // 仅构建时执行
    generateBundle(options, bundle) {
      // 构建产物生成时的逻辑
    }
  }
}

function transformCustomCode(code: string): string {
  // 转换逻辑
  return code
}`), language: 'typescript',
    principle: 'Vite 构建时基于 Rollup，兼容大部分 Rollup 插件，同时扩展了 Vite 特有的钩子如 config、configureServer、transformIndexHtml 等。',
    flow: ['在 vite.config.ts 的 plugins 数组中添加 Rollup 插件。', '开发和构建时 Vite 调用插件的不同钩子。', '使用 Vite 特有钩子扩展开发服务器等能力。'],
    notes: ['并非所有 Rollup 插件都能在开发模式下工作，产物类钩子主要在构建时触发。', '插件可通过 apply: "serve" | "build" 只在开发或构建阶段生效。', 'Vite 特有钩子负责开发服务器、HTML 与 HMR，Rollup 钩子负责模块解析、加载与转换。'],
    problem: '解决"构建工具生态碎片化、需要学习多套插件 API"的问题。',
  },
{
    id: 'V_20', title: '库模式与组件打包发布', navTitle: '库模式', category: '构建',
    path: '/vite/v-20/library-mode', summary: '使用 Vite 库模式打包组件库或工具库，支持多格式输出和发布到 npm。',
    demo: V20LibraryMode, code: () => Promise.resolve(`// vite.config.ts - 完整库模式配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    // 自动生成类型声明
    dts({
      outDir: 'dist/types',
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue']
    })
  ],
  
  build: {
    lib: {
      // 入口文件（可以是字符串或对象）
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        button: resolve(__dirname, 'src/components/Button/index.ts')
      },
      
      // UMD 全局变量名
      name: 'MyUILib',
      
      // 输出格式: 'es' | 'cjs' | 'umd' | 'iife'
      formats: ['es', 'cjs', 'umd'],
      
      // 输出文件名
      fileName: (format, entryName) => {
        if (format === 'es') return \`\${entryName}.mjs\`
        if (format === 'cjs') return \`\${entryName}.cjs\`
        return \`\${entryName}.\${format}.js\`
      }
    },
    
    rollupOptions: {
      // 外部化 peer dependencies
      external: ['vue', 'vue-router', 'pinia'],
      
      output: {
        // UMD 模式下的全局变量映射
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          pinia: 'Pinia'
        },
        
        // CSS 输出配置
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css'
          return assetInfo.name || 'assets/[name][extname]'
        }
      }
    },
    
    // 库模式下默认不压缩 CSS
    cssCodeSplit: true,
    
    // 源码映射（便于调试）
    sourcemap: true
  }
})

// ====================
// src/index.ts - 库入口文件
// ====================

// 组件
export { default as Button } from './components/Button/Button.vue'
export { default as Input } from './components/Input/Input.vue'
export { default as Form } from './components/Form/Form.vue'

// Composables
export { useForm } from './composables/useForm'
export { useModal } from './composables/useModal'

// 工具函数
export { debounce, throttle, deepClone } from './utils'

// 类型
export type {
  ButtonProps,
  InputProps,
  FormProps,
  FormRules,
  User
} from './types'

// 样式
import './styles/index.scss'

// ====================
// package.json 完整配置
// ====================

// {
//   "name": "@my-org/ui-lib",
//   "version": "1.0.0",
//   "description": "一个 Vue 3 组件库",
//   "type": "module",
//   
//   // 入口配置
//   "main": "./dist/index.cjs",
//   "module": "./dist/index.mjs",
//   "types": "./dist/types/index.d.ts",
//   
//   // 导出映射（推荐）
//   "exports": {
//     ".": {
//       "import": {
//         "types": "./dist/types/index.d.ts",
//         "default": "./dist/index.mjs"
//       },
//       "require": {
//         "types": "./dist/types/index.d.ts",
//         "default": "./dist/index.cjs"
//       }
//     },
//     "./button": {
//       "import": "./dist/button.mjs",
//       "require": "./dist/button.cjs"
//     },
//     "./style.css": "./dist/index.css"
//   },
//   
//   // 样式
//   "style": "./dist/index.css",
//   
//   // 发布的文件
//   "files": ["dist"],
//   
//   // Peer dependencies
//   "peerDependencies": {
//     "vue": "^3.4.0"
//   },
//   
//   // 脚本
//   "scripts": {
//     "build": "vue-tsc --noEmit && vite build",
//     "type-check": "vue-tsc --noEmit",
//     "prepublishOnly": "npm run build"
//   },
//   
//   // 发布配置
//   "publishConfig": {
//     "access": "public"
//   },
//   
//   // 仓库信息
//   "repository": {
//     "type": "git",
//     "url": "https://github.com/your-org/ui-lib.git"
//   }
// }

// ====================
// 使用方式示例
// ====================

// 1. ESM (推荐)
// import { Button, Input } from '@my-org/ui-lib'
// import '@my-org/ui-lib/style.css'

// 2. CommonJS
// const { Button } = require('@my-org/ui-lib')
// require('@my-org/ui-lib/style.css')

// 3. 按需引入（配合 unplugin-vue-components）
// 自动导入组件，按需打包

// 4. UMD (CDN)
// <script src="https://unpkg.com/vue@3"></script>
// <script src="https://unpkg.com/@my-org/ui-lib/dist/index.umd.js"></script>
// <link rel="stylesheet" href="https://unpkg.com/@my-org/ui-lib/dist/index.css">
// const { Button } = MyUILib`), language: 'typescript',
    principle: 'Vite 的库模式（Library Mode）可以把项目打包成可发布的 npm 包，支持 ESM、CommonJS、UMD 等多种输出格式，并自动处理 CSS 和类型声明。',
    flow: ['在 vite.config.ts 中配置 build.lib 选项。', '指定入口文件、输出格式和包名。', '运行 vite build 生成可发布的 dist 目录。'],
    notes: ['库模式下外部化 Vue 等 peer dependencies。', '需要单独配置 d.ts 生成或使用 vite-plugin-dts。', '注意输出格式兼容性和 Tree Shaking 支持。'],
    problem: '解决"组件库/工具库打包配置复杂、输出格式不统一"的问题。',
  },
{
    id: 'V_21', title: '多页面应用配置与入口管理', navTitle: '多页面应用', category: '构建',
    path: '/vite/v-21/multi-page', summary: '配置 Vite 多页面应用，管理多个 HTML 入口和共享资源。',
    demo: V21MultiPage, code: () => Promise.resolve(`// vite.config.ts - 多页面完整配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import glob from 'fast-glob'

// 动态获取所有入口文件
async function getEntryPages() {
  const htmlFiles = await glob('src/pages/*/index.html', {
    cwd: __dirname,
    absolute: true
  })
  
  const entries: Record<string, string> = {}
  for (const file of htmlFiles) {
    const match = file.match(/src\\/pages\\/([^/]+)\\/index\\.html$/)
    if (match) {
      entries[match[1]] = file
    }
  }
  return entries
}

export default defineConfig(async () => {
  const pages = await getEntryPages()
  
  return {
    plugins: [vue()],
    
    // 项目根目录
    root: '.',
    
    build: {
      outDir: 'dist',
      
      rollupOptions: {
        input: {
          // 主页面（项目根目录的 index.html）
          main: resolve(__dirname, 'index.html'),
          // 其他页面
          admin: resolve(__dirname, 'src/pages/admin/index.html'),
          login: resolve(__dirname, 'src/pages/login/index.html'),
          about: resolve(__dirname, 'src/pages/about/index.html')
          // 或者使用动态获取的 pages
          // ...pages
        },
        
        output: {
          // 自定义 chunk 命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          
          // 公共依赖提取
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'ui-lib': ['element-plus']
          }
        }
      }
    },
    
    server: {
      // 开发服务器的打开页面
      open: '/index.html'
    }
  }
})

// ====================
// 推荐项目结构
// ====================

// project/
//   ├── index.html                    # 主入口
//   ├── src/
//   │   ├── pages/
//   │   │   ├── admin/
//   │   │   │   ├── index.html        # 管理后台入口
//   │   │   │   ├── main.ts           # 管理后台入口脚本
//   │   │   │   ├── App.vue
//   │   │   │   └── views/
//   │   │   ├── login/
//   │   │   │   ├── index.html        # 登录页入口
//   │   │   │   ├── main.ts
//   │   │   │   └── App.vue
//   │   │   └── about/
//   │   │       ├── index.html        # 关于页入口
//   │   │       ├── main.ts
//   │   │       └── App.vue
//   │   ├── components/               # 共享组件
//   │   ├── composables/              # 共享 composables
//   │   ├── utils/                    # 共享工具函数
//   │   ├── stores/                   # 共享状态
//   │   └── assets/                   # 共享资源
//   └── vite.config.ts

// ====================
// HTML 入口模板示例
// ====================

// index.html (主页面)
// <!DOCTYPE html>
// <html lang="zh-CN">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>首页 - 我的应用</title>
// </head>
// <body>
//   <div id="app"></div>
//   <script type="module" src="/src/main.ts"></script>
// </body>
// </html>

// src/pages/admin/index.html
// <!DOCTYPE html>
// <html lang="zh-CN">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>管理后台 - 我的应用</title>
// </head>
// <body>
//   <div id="app"></div>
//   <script type="module" src="/src/pages/admin/main.ts"></script>
// </body>
// </html>

// ====================
// 共享代码与资源
// ====================

// 所有页面共享:
// - src/components/  公共组件
// - src/utils/       工具函数
// - src/stores/      Pinia 状态管理
// - src/assets/      图片、样式等资源
// - node_modules/    第三方依赖

// Vite 自动处理:
// - 共享依赖自动提取为 common chunk
// - 共享样式不会重复打包
// - 代码分割和 Tree Shaking 正常工作

// ====================
// 开发服务器访问
// ====================

// 启动开发服务器: vite

// 访问地址:
// http://localhost:5173/              →  index.html (主页)
// http://localhost:5173/admin/        →  src/pages/admin/index.html
// http://localhost:5173/login/        →  src/pages/login/index.html
// http://localhost:5173/about/        →  src/pages/about/index.html

// 注意: 访问子目录时需要带尾部斜杠 /
// 或直接访问完整路径: /admin/index.html

// ====================
// 构建产物结构
// ====================

// dist/
//   ├── index.html
//   ├── admin/
//   │   └── index.html
//   ├── login/
//   │   └── index.html
//   ├── about/
//   │   └── index.html
//   └── assets/
//       ├── js/
//       │   ├── main-xxx.js
//       │   ├── admin-xxx.js
//       │   ├── login-xxx.js
//       │   ├── about-xxx.js
//       │   ├── vue-vendor-xxx.js    # 共享 Vue 生态
//       │   └── ui-lib-xxx.js        # 共享 UI 库
//       └── css/
//           ├── main-xxx.css
//           ├── admin-xxx.css
//           └── ...`), language: 'typescript',
    principle: '多页面应用通过 build.rollupOptions.input 声明多个 HTML 入口；本课重点是动态收集入口、用 manualChunks 按页面拆分共享依赖，并规划公共目录与各页面独立模块的目录结构。',
    flow: ['认识多页面应用在官网+后台等多入口场景中的价值。', '学习配置多个 HTML 入口并动态收集入口文件。', '通过 manualChunks 提取跨页面共享依赖，并查看构建产物。'],
    notes: ['多页面可共享公共组件、工具与状态，Vite 会提取为公共 chunk。', '每个 HTML 入口对应各自的入口脚本，可挂载到不同 DOM 节点。', '配合 manualChunks 把 vue、UI 库等共享依赖单独分包，利于缓存复用。'],
    problem: '解决"传统 MPA 构建配置复杂、公共资源管理困难"的问题。',
  }
]
