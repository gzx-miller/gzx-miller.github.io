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
    flow: ['通过核心概念卡片理解原生 ESM、Rollup 构建、HMR 与插件系统。', '对比 Vite 与传统打包器（Webpack）的差异。', '查看常用配置示例，了解 dev server、代理、别名与分包。', '启动一个最小项目，对比 dev 冷启动与生产构建产物的差异。'],
    notes: ['冷启动不受项目规模影响，代价是一次性的依赖预构建。', 'HMR 基于原生 ESM，只精确实时更新发生变化的模块。', '开发阶段按需加载源文件本身，生产阶段才做打包压缩优化。', 'vite preview 可在本地以生产行为预览 dist 产物，部署前先验证。'],
    problem: '解决"传统打包器冷启动慢、HMR 更新延迟、依赖图膨胀拖慢日常开发"的问题。',
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
    principle: 'vite.config.ts 是 Vite 的项目级配置入口：用 defineConfig 包装可获得完整的类型推导与提示；既可导出静态对象，也可导出接收 { mode, command } 的函数，在函数内按环境返回不同配置，或在条件成立时动态追加插件。',
    flow: ['用 defineConfig 编写 server、build、resolve.alias 等基础配置。', '把配置改为函数形式，接收 { mode, command } 按环境返回不同配置。', '在函数内按环境变量（如 ANALYZE）条件性添加插件或调整构建选项。', '环境差异放函数式配置、敏感值放环境变量，避免把密钥或路径硬编码进配置文件。'],
    notes: ['使用 defineConfig 可获得完整类型提示，避免手写配置时字段拼错或被静默忽略。', 'resolve.alias 设置路径别名，css.preprocessorOptions 可注入全局样式。', '函数式配置的返回值会与默认配置深度合并，返回空对象也不会丢失默认行为。', '配置字段拼写错误可能被静默忽略，改动后用 vite --debug 检查最终解析结果。'],
    problem: '解决"开发/生产需要不同的 server、minify、sourcemap 等设置，手动改配置文件既繁琐又容易漏改"的问题。',
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
    flow: ['在 plugins 数组中注册 vue()、vueJsx() 等基础插件。', '用 AutoImport 与 Components 配置 API 与组件的自动按需引入。', '通过 enforce: pre/post 或条件判断控制插件执行顺序与生效阶段。', '仅安装项目实际需要的插件，避免为演示性功能引入过重的依赖。'],
    notes: ['插件在 plugins 数组中按声明顺序执行，配合 enforce: pre/post 可调整先后。', 'unplugin-vue-components 与 unplugin-auto-import 可自动按需引入组件与 API。', '自动引入会生成 dts 声明文件，需加入 tsconfig 的 include，否则编辑器报变量未定义。', '插件执行出错会中断 dev server，报错信息一般带插件名，可据此快速定位。'],
    problem: '解决"每写一个组件都要手动 import，或需要按开发/构建阶段启用不同插件"的问题。',
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
    principle: 'Vite HMR 依托原生 ESM 的模块边界实现：文件修改后服务器沿 import 链向上寻找最近的“接受者”（import.meta.hot.accept 声明的模块），只替换该模块而不刷新页面；Vue/React 插件会为每个组件自动注入接受逻辑并尽量保留组件状态。',
    flow: ['在模块中用 import.meta.hot.accept 声明自身可热替换，并处理状态迁移。', '用 accept(dep, cb) 接受依赖模块更新，用 dispose 做替换前清理。', '观察 Vue SFC 中 template、script、style 分别更新时的页面行为差异。', '热替换代码要包在 if (import.meta.hot) 守卫内，生产构建中该对象不存在。'],
    notes: ['Vue SFC 的 template 与 style 更新不丢失状态，<script setup> 的逻辑变更会重建组件实例。', 'HMR 只沿模块边界替换，状态保存在 Pinia store 或模块级变量中才能跨更新存活。', '模块未声明 accept 时更新会沿依赖链冒泡，找不到边界就整页刷新。', '手动 accept 的回调里要主动应用新模块导出，否则界面不会随更新变化。'],
    problem: '解决"改一行样式页面就整页刷新、表单输入与展开状态被重置，要反复操作才能复现问题"的问题。',
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
    principle: 'Vite 内置 dotenv，按 .env → .env.local → .env.[mode] → .env.[mode].local 的优先级加载变量并以后者覆盖前者；只有 VITE_ 前缀的变量会被静态替换进客户端代码（通过 import.meta.env 访问），其余变量仅对配置文件的 Node 侧逻辑可见，从机制上避免密钥泄漏到浏览器。',
    flow: ['创建 .env.development / .env.production，写入带 VITE_ 前缀的变量。', '在业务代码中用 import.meta.env.VITE_API_BASE_URL 读取变量。', '在 vite.config.ts 中用 loadEnv 读取变量配置 proxy，并在 vite-env.d.ts 中补充类型声明。', '把 .env.local 与 .env.*.local 加入 .gitignore，个人覆盖与敏感值不进仓库。'],
    notes: ['import.meta.env.MODE / DEV / PROD 等内置变量可判断当前运行模式。', '敏感信息（如数据库密码）不应使用 VITE_ 前缀，因为它会被打进客户端产物。', '修改 .env 后需要重启开发服务器才会生效，已注入的旧值不会热更新。', '变量在构建时静态替换进代码，多环境需要各自构建，无法运行时切换。'],
    problem: '解决"开发/测试/生产需要不同的 API 地址与开关，硬编码在代码里每次发布都要手改"的问题。',
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
    principle: 'Vite 对静态资源有三条处理路径：import 导入的资源进入模块图，按内容哈希命名后输出并返回最终 URL；public 目录的文件不经过构建管线、原样复制到产物根目录；小于 assetsInlineLimit（默认 4096 字节）的资源会被内联为 base64 data URL，省去一次请求。',
    flow: ['用 import logo from "./assets/logo.png" 导入图片，观察产物文件名带内容哈希。', '把 favicon、robots.txt 放进 public 目录，用绝对路径 /favicon.ico 引用。', '调整 assetsInlineLimit 或用 ?url、?inline、?raw 后缀显式控制单个资源。', '确认 vite-env.d.ts 声明了资源模块类型，静态导入图片才有类型提示。'],
    notes: ['优先使用导入方式引用资源，可获得哈希缓存与压缩等构建优化。', 'public 目录适合不常变更的静态文件（favicon、robots.txt），引用时必须写绝对路径。', '内联为 base64 会增大约 33% 体积且无法单独缓存，大图应调低阈值避免被打进 JS/CSS。', '哈希由文件内容生成，内容不变文件名不变，可放心为产物设置长期强缓存。'],
    problem: '解决"构建后图片路径 404、小图标产生大量请求拖慢首屏，或不知该把资源放 assets 还是 public"的问题。',
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
    principle: '首次启动时 Vite 用 Esbuild 把 node_modules 中的依赖预构建为单个 ESM 文件：既将 CommonJS/UMD 转换为浏览器可加载的 ESM，又把一个包的内部模块合并，避免开发时产生成百上千次模块请求；产物按依赖与配置的 hash 缓存在 node_modules/.vite 中复用。',
    flow: ['启动开发服务器，观察终端输出的 Pre-bundling dependencies 日志。', '把动态导入未被扫描到的依赖加入 optimizeDeps.include 强制预构建。', '修改 lockfile 或执行 vite --force，验证缓存失效后依赖重新预构建。', '用 optimizeDeps.exclude 排除已是 ESM 的大包，减少不必要的预构建开销。'],
    notes: ['预构建只处理第三方依赖，业务源码不参与，include 中不要写 src 下的路径。', '预构建产物缓存在 node_modules/.vite/ 下，删除缓存可强制重新预构建。', '动态 import 的路径若无法被静态扫描，运行时会出现 404，需要手动加入 include。', '依赖升级或行为异常时，删除 node_modules/.vite 缓存后重启可排除缓存问题。'],
    problem: '解决"依赖内部模块过多导致开发服务器卡顿，或引入 CommonJS 包时报 require is not defined"的问题。',
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
    principle: 'Vite 生产构建基于 Rollup：每个动态 import() 会生成独立 chunk 实现按需加载；rollupOptions.output.manualChunks 可把依赖按组拆分以获得更好的缓存复用；压缩默认用 Esbuild（速度快），可切换 Terser（压缩率更高、可配置 drop_console 等选项）。',
    flow: ['在路由中用 () => import("../views/Home.vue") 配置路由级懒加载。', '在 rollupOptions.output.manualChunks 中按框架、UI 库、工具库分组依赖。', '切换 minify 为 terser 并配置 drop_console，对比产物体积变化。', '用可视化插件查看各 chunk 的体积构成，验证分包是否达到预期。'],
    notes: ['动态 import() 是代码分割的基础，缺少它时 Rollup 只能产出单一大 chunk。', '分包不是越细越好，拆得过散会增加请求数，建议按“变更频率”归组。', 'chunkSizeWarningLimit 只影响警告阈值，不代表超过阈值的 chunk 一定需要拆分。', 'build.target 决定语法降级目标，面向现代浏览器可适当提高以减少产物体积。'],
    problem: '解决"首屏需要下载的 chunk 过大、大依赖与业务代码混在一起导致上线后缓存全部失效"的问题。',
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
    principle: 'Vite 通过 build.rollupOptions.input 声明多个 HTML 入口构建多页面应用：每个 HTML 是独立入口页，Vite 会为其分别产出 HTML 与入口 JS，同时把跨页面共享的依赖自动提取为 common chunk，避免重复打包。',
    flow: ['在 rollupOptions.input 中以 { main, admin, login } 的键值对声明多个 HTML 入口。', '按“HTML + 入口脚本 + 组件”为每个页面组织目录，把共享代码放入 shared 目录。', '执行构建，检查 dist 中每个页面的 HTML 与共享 chunk 产物结构。', '在 dev 下逐一访问各入口页面，确认脚本独立加载、互不干扰。'],
    notes: ['每个 HTML 用 <script type="module" src="..."> 引入自己的入口 JS，路径需与 input 键名对应。', '共享依赖自动提取为公共 chunk，不会在每个页面里重复打包。', 'dev 服务器下访问子页面需带尾部斜杠（/admin/）才能命中其 index.html。', '部署到子目录时统一用 base 调整各页面资源路径，避免绝对路径 404。'],
    problem: '解决"官网与管理后台需要完全隔离的独立页面，用 SPA 前端路由硬拼在一起既臃肿又不好按页发布"的问题。',
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
    principle: 'Vite 库模式通过 build.lib 配置一次输出多种格式：ESM 供现代打包器按需引入、UMD 供 CDN <script> 直接使用、CJS 供 Node.js require；框架依赖用 rollupOptions.external 外部化，UMD 下再通过 output.globals 映射为全局变量避免重复打包。',
    flow: ['在 build.lib 中配置 entry、name 与 formats: ["es", "cjs", "umd"]。', '用 rollupOptions.external 外部化 vue 等依赖，并配置 globals 映射。', '配置 package.json 的 module/main/exports 与 files 字段后发布到 npm。', '用 npm pack 或本地 link 在示例项目中试用产物，逐一验证各格式可用。'],
    notes: ['使用 peerDependencies 声明框架依赖（如 vue），避免打包多份 Vue 实例。', 'package.json 的 module/main/exports 字段应分别指向对应格式产物与类型声明。', '类型声明不会自动生成，需要 vite-plugin-dts 或手写，并保证与 exports 的 types 字段一致。', '库内的 CSS 会单独产出文件，需要使用者手动引入，记得在文档中说明。'],
    problem: '解决"组件库既要被 Vite 项目按 ESM import、又要能用 CDN <script> 直接引入，还要带正确的类型声明"的问题。',
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
    principle: 'SSR 在服务端用 renderToString 把组件渲染为完整 HTML 返回，浏览器先展示静态内容，再由客户端入口 mount 完成 Hydration（激活）绑定事件；Vite 以中间件模式与 ssrLoadModule 在同一进程转换服务端代码，并分别构建服务端与客户端两份产物，Nuxt 3/4 即基于这套机制内置了完整的 SSR 支持。',
    flow: ['用 createServer({ server: { middlewareMode: true } }) 启动 Vite 中间件并挂到 Express。', '服务端用 transformIndexHtml 与 ssrLoadModule 渲染 HTML，客户端 createSSRApp 后 mount 完成 Hydration。', '用 ssr.noExternal / external 控制哪些依赖需要打包进 SSR 产物。', '分别执行客户端与服务端构建，把两份产物一起部署到 Node 服务。'],
    notes: ['SSR 有利于 SEO 和首屏速度，但需要 Node 服务端运行环境；本仓库（小松鼠举栗子）就是 Nuxt 4 + Vite 的 SSR 应用。', '服务端与客户端首次渲染结果必须一致，否则会触发 Hydration 不匹配警告。', '依赖浏览器 API 的代码要放到 onMounted 或 ClientOnly 中，避免服务端执行报错。', '数据请求要放在支持 SSR 的加载函数中，mounted 钩子在服务端不会执行。'],
    problem: '解决"纯客户端渲染的商城首页不被搜索引擎收录、弱网设备首屏长时间白屏"的问题。',
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
    principle: 'Vite 自动读取 postcss.config.js 或 css.postcss 中的插件链并应用于全部样式；安装 sass/less 后即可直接在 <style lang="scss"> 中书写预处理器语法，css.preprocessorOptions 可向每个样式文件注入共享变量；CSS Modules 在 SFC 的 <style module> 中开箱即用。',
    flow: ['在 postcss.config.js（或 css.postcss）中配置 autoprefixer、tailwindcss 等插件。', '安装 sass 后书写 <style lang="scss">，用 preprocessorOptions.additionalData 注入全局变量。', '在 <style module> 中书写样式，通过 :class="$style.xxx" 使用局部类名。', '开发阶段开启 css.devSourcemap，浏览器调试样式时可直接定位到源文件。'],
    notes: ['Vue SFC 的 <style scoped> 已提供组件级样式隔离，普通场景不必再用 CSS Modules。', '预处理器需要单独安装（npm install -D sass），Vite 不内置编译器。', 'additionalData 只能注入变量与 mixin 定义，放入实际样式会被重复输出到每个文件。', 'Tailwind 等工具链通过 PostCSS 接入即可，不必额外安装专门的 Vite 插件。'],
    problem: '解决"全局样式逐步失控、希望统一接入 Tailwind、Sass 变量与组件级样式隔离"的问题。',
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
    principle: 'Vite 用 Esbuild 转译 TypeScript：仅擦除类型注解并做目标语法降级，不做类型检查，因此类型错误不会阻断 dev 与 build；完整的类型安全由 IDE 实时提示与 vue-tsc --noEmit 在构建脚本或 CI 中把关。',
    flow: ['在 package.json 中配置 "type-check": "vue-tsc --noEmit" 并接在构建脚本前。', '在 <script setup lang="ts"> 中编写带接口、泛型的组件逻辑。', '在 vite-env.d.ts 中补充 .vue 模块与 import.meta.env 的类型声明。', '把 type-check 接入 CI 流水线，类型不过就不允许合入与部署。'],
    notes: ['Vite 不负责类型检查（保证开发服务器速度），构建通过不代表类型无误。', '建议配置 type-check 脚本在构建前或 CI 中运行，拦截类型回归。', 'tsconfig.json 的 paths 别名要与 vite.config.ts 的 resolve.alias 保持一致，否则编辑器能跳转但运行时报找不到模块。', '本地 vue-tsc 报错与 IDE 不一致时，核对插件与依赖版本是否对齐。'],
    problem: '解决"Vite 项目写 TS 时类型错误不阻断构建、上线才发现问题，以及别名与环境变量缺类型提示"的问题。',
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
    principle: 'server.proxy 基于 http-proxy 中间件：开发服务器把匹配前缀或正则的请求转发到 target，浏览器只看到同源请求，从机制上绕开 CORS 限制；rewrite 可改写转发路径，changeOrigin 修改 Host 头，ws: true 开启 WebSocket 转发。',
    flow: ['在 server.proxy 中把 /api 转发到 http://localhost:3000 并设置 changeOrigin: true。', '用 rewrite 去掉或重写路径前缀，用 configure 钩子追加或修改请求头。', '用 ws: true 转发 WebSocket，或在函数式配置中按 loadEnv 切换不同后端地址。', '前端请求统一走相对路径（如 /api/user），后端地址切换只改代理配置。'],
    notes: ['changeOrigin: true 会把请求头的 Host 改为 target 的域名，配合虚拟主机后端时必须开启。', '代理只在 vite dev 生效，生产环境需要后端 CORS、Nginx 反向代理或同域部署。', 'rewrite 的正则作用于带前缀的完整路径，注意用 ^ 锚定避免误改其他请求。', '在 configure 回调里挂日志可看到实际转发请求，联调排错更直观。'],
    problem: '解决"本地开发时前端 5173 端口请求后端 3000 端口被 CORS 拦截，或联调时需在不同后端环境间切换"的问题。',
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
    principle: '优化从“测量”开始：用 rollup-plugin-visualizer 生成 treemap 报告，定位占比最大的依赖；再对症下药——按需引入或替换超大依赖（如 moment 换 dayjs）、把大型库外部化交给 CDN、用 manualChunks 合理分包，同时用 server.warmup 与 optimizeDeps 缩短开发启动时间。',
    flow: ['安装 rollup-plugin-visualizer，在 ANALYZE 变量下执行构建产出 stats.html 并查看占比。', '针对报告中的体积大户改为按需引入，或替换为更轻的替代库。', '用 manualChunks 复测分包效果，并设定 chunkSizeWarningLimit 防止反弹。', '用 server.warmup 预热高频入口模块，缩短开发阶段首次访问的等待。'],
    notes: ['定期分析 bundle 大小，及时发现体积膨胀趋势。', '大型库（如 lodash-es）应使用按需引入，避免整体导入。', 'visualizer 只在分析时加入插件数组，日常构建不必生成报告以免拖慢 CI。', '优化前后各存一份报告做对比，用数据确认收益，避免凭感觉调整。'],
    problem: '解决"构建产物体积持续膨胀却找不到是哪个依赖导致，优化效果无法量化对比"的问题。',
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
    flow: ['编写返回 Plugin 对象的函数，注册 name 与 transform、config、configureServer 等钩子。', '在 transform 中按文件后缀过滤并改写代码（如把 .md 内容包装成 Vue 组件）。', '用 resolveId/load 暴露虚拟模块，或在 plugins 中接入项目验证效果。', '为插件写示例或单测，验证各钩子的执行时机与产出是否符合预期。'],
    notes: ['插件命名规范为 vite-plugin-xxx，导出函数返回插件对象。', '可利用 transform 钩子改写模块代码，例如注入版本号等全局信息。', 'transform 会被高频调用，务必先按 id 过滤目标文件、快速 return null，避免拖慢开发与构建。', '调试插件可用 vite --debug 查看钩子调用日志，快速定位执行顺序问题。'],
    problem: '解决"现有插件无法满足需求，比如想直接 import .md 文件、或在构建时把版本号注入代码"的问题。',
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
    principle: 'Vite 在首次启动时用 esbuild 预构建 node_modules 中的依赖：把 CommonJS/UMD 模块统一转换成 ESM，并把一个依赖的众多内部模块合并成单个文件，避免浏览器发起成百上千次请求造成瀑布式加载。构建结果带 hash 缓存到 node_modules/.vite，依赖或配置变化才重新构建，二次启动直接复用缓存。',
    flow: ['首次启动 Vite 时扫描依赖并预构建。', '构建结果缓存到 node_modules/.vite。', '后续启动直接读取缓存，依赖变化时重新构建。', '观察启动日志中是否出现 Pre-bundling，异常时用 --force 强制重新构建。'],
    notes: ['预构建只处理第三方依赖，源码不预构建。', 'optimizeDeps.include 可以强制预构建某些包。', '缓存失效会自动检测并重新构建。', 'monorepo 本地链接的包建议加入 include 并设置 resolve.dedupe，避免多实例问题。'],
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
    principle: 'Vite 用 esbuild 处理 TypeScript 与 JSX 的语法转换：esbuild 以 Go 编写、多核并行，速度比传统 JS 实现的工具快 10-100 倍；转换只剥离类型标注，不做类型检查，因此开发服务器能在毫秒级响应模块请求。类型检查的正确性由 vue-tsc/tsc 在构建前或 CI 中单独保证。',
    flow: ['源码中的 .ts/.tsx 文件请求到达 Vite 开发服务器。', 'esbuild 进行语法转换，输出纯 JS。', '浏览器直接运行转换后的 ESM 模块。', '构建前运行 vue-tsc --noEmit，把类型错误拦截在 CI 阶段。'],
    notes: ['开发环境与依赖预构建都由 esbuild 快速做语法转换，不做类型检查。', 'esbuild 不支持 const enum、export = 等 TS 特性，需改用兼容写法。', '完整类型检查交给 tsc 或 vue-tsc，在构建前或 CI 中执行。', 'esbuild 不支持 emitDecoratorMetadata，依赖装饰器元数据的框架需改用官方插件链。'],
    problem: '解决"传统构建工具 TS/JSX 编译速度慢，改一次代码要等数秒才看到效果"的问题。',
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
    principle: 'Vite 构建时基于 Rollup，因此大部分 Rollup 插件（如 visualizer、imagemin）可直接复用；同时扩展了 config、configResolved、configureServer、transformIndexHtml、handleHotUpdate 等 Vite 特有钩子，并支持 apply 字段让插件只在 serve 或 build 阶段生效。',
    flow: ['在 vite.config.ts 的 plugins 数组中添加 Rollup 插件并观察构建效果。', '用 apply: "serve" / "build" 或钩子类型区分插件在开发与构建阶段的行为。', '编写同时使用 Vite 特有钩子与 Rollup 兼容钩子的通用插件。', '评估插件对构建耗时的影响，用 apply 限定生效阶段避免波及 dev。'],
    notes: ['并非所有 Rollup 插件都能在开发模式下工作，产物类钩子主要在构建时触发。', '插件可通过 apply: "serve" | "build" 只在开发或构建阶段生效。', 'Vite 特有钩子负责开发服务器、HTML 与 HMR，Rollup 钩子负责模块解析、加载与转换。', '接入社区插件前核对兼容性与最低 Vite 版本，避免因版本错配导致构建失败。'],
    problem: '解决"构建工具生态碎片化、Rollup 与 Vite 插件 API 不一、需要学习多套体系"的问题。',
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
    principle: 'Vite 的库模式可以把项目打包成可发布的 npm 包：build.lib 一次输出 ESM、CJS、UMD 等多种格式，框架依赖通过 external 外部化交由使用方提供；CSS 会单独产出文件，类型声明则需借助 vite-plugin-dts 等工具生成后随包发布。',
    flow: ['在 vite.config.ts 中配置 build.lib 选项。', '指定入口文件、输出格式和 UMD 包名，并配置 external 与 exports 映射。', '运行 vite build 生成可发布的 dist 目录。', '用 npm pack 检查产物清单，确认入口、类型声明与文件齐全后再发布。'],
    notes: ['库模式下外部化 Vue 等 peer dependencies。', '需要单独配置 d.ts 生成或使用 vite-plugin-dts。', '注意输出格式兼容性和 Tree Shaking 支持。', '发布时开启 sourcemap，便于使用方在调试依赖问题时直接定位到源码。'],
    problem: '解决"组件库与工具库打包配置复杂、输出格式不统一、类型声明缺失"的问题。',
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
    principle: '多页面应用通过 build.rollupOptions.input 声明多个 HTML 入口；本课重点是动态收集入口、用 manualChunks 按页面拆分共享依赖，并规划公共目录与各页面独立模块的目录结构。入口自动化与分包策略让 MPA 在页面数量增长后依然可维护，构建结果也能按页面精准缓存。',
    flow: ['用 fast-glob 扫描 src/pages/*/index.html 动态生成入口表并传给 rollupOptions.input。', '为每个页面配置 index.html + main.ts + App.vue 的独立目录，公共代码集中到共享目录。', '用 manualChunks 提取跨页面共享依赖，构建后核对各页面 HTML 与公共 chunk。', '新增页面只需创建目录结构，入口扫描会自动纳入，无需改动配置文件。'],
    notes: ['多页面可共享公共组件、工具与状态，Vite 会提取为公共 chunk。', '每个 HTML 入口对应各自的入口脚本，可挂载到不同 DOM 节点。', '配合 manualChunks 把 vue、UI 库等共享依赖单独分包，利于缓存复用。', '入口扫描的模式要排除无关目录，避免把组件测试页等 HTML 误纳入构建。'],
    problem: '解决"传统 MPA 构建配置复杂、入口手工维护、公共资源管理困难"的问题。',
  }
]
