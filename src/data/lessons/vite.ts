import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const modules = path.startsWith('react-jsx/')
    ? jsxCodeModules
    : path.startsWith('state-react/')
      ? stateCodeModules
      : path.startsWith('js-code/')
        ? jsCodeModules
        : path.startsWith('ts-code/')
          ? tsCodeModules
          : path.startsWith('style-code/')
            ? styleCodeModules
            : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到案例源码：${path}`)
  return loader
}

const V01Core = createDemo('V01Core')
const V01Code = createCodeLoader('V01Core.vue')
const V02Config = createDemo('V02Config')
const V02Code = createCodeLoader('V02Config.vue')
const V03Plugins = createDemo('V03Plugins')
const V03Code = createCodeLoader('V03Plugins.vue')
const V04HMR = createDemo('V04HMR')
const V04Code = createCodeLoader('V04HMR.vue')
const V05Env = createDemo('V05Env')
const V05Code = createCodeLoader('V05Env.vue')
const V06Assets = createDemo('V06Assets')
const V06Code = createCodeLoader('V06Assets.vue')
const V07PreBundle = createDemo('V07PreBundle')
const V07Code = createCodeLoader('V07PreBundle.vue')
const V08Build = createDemo('V08Build')
const V08Code = createCodeLoader('V08Build.vue')
const V09MPA = createDemo('V09MPA')
const V09Code = createCodeLoader('V09MPA.vue')
const V10Lib = createDemo('V10Lib')
const V10Code = createCodeLoader('V10Lib.vue')
const V11SSR = createDemo('V11SSR')
const V11Code = createCodeLoader('V11SSR.vue')
const V12CSS = createDemo('V12CSS')
const V12Code = createCodeLoader('V12CSS.vue')
const V13TypeScript = createDemo('V13TypeScript')
const V13Code = createCodeLoader('V13TypeScript.vue')
const V14Proxy = createDemo('V14Proxy')
const V14Code = createCodeLoader('V14Proxy.vue')
const V15Perf = createDemo('V15Perf')
const V15Code = createCodeLoader('V15Perf.vue')
const V16PluginDev = createDemo('V16PluginDev')
const V16Code = createCodeLoader('V16PluginDev.vue')
const V17DependencyPrebundle = createDemo('V17DependencyPrebundle')
const V17Code = createCodeLoader('V17DependencyPrebundle.vue')
const V18Esbuild = createDemo('V18Esbuild')
const V18Code = createCodeLoader('V18Esbuild.vue')
const V19RollupPlugin = createDemo('V19RollupPlugin')
const V19Code = createCodeLoader('V19RollupPlugin.vue')
const V20LibraryMode = createDemo('V20LibraryMode')
const V20Code = createCodeLoader('V20LibraryMode.vue')
const V21MultiPage = createDemo('V21MultiPage')
const V21Code = createCodeLoader('V21MultiPage.vue')


export const lessons: Lesson[] = [
{
    id: 'V_01', title: 'Vite 核心概念', navTitle: '核心概念', category: '基础',
    path: '/vite/v-1/core', summary: '理解 Vite 的两个阶段：开发服务器（原生 ESM）和生产构建（Rollup）。',
    demo: V01Core, code: V01Code, language: 'vue',
    principle: 'Vite 在开发阶段基于浏览器原生 ESM 直接按需加载源文件，省去完整打包；HMR 沿着模块依赖图精确替换变更模块，做到"编辑即反馈"。生产阶段则切换到 Rollup，对依赖预构建、代码分割、压缩和按需 polyfill 等做深度优化，兼顾开发速度与产物质量。',
    flow: ['理解原生 ESM 开发服务器的优势。', '对比 Vite 与传统打包器（Webpack）的差异。', '了解 Vite 的插件系统与运行时能力。'],
    notes: ['Vite 冷启动时间与项目规模解耦，主要受依赖预构建影响。', 'HMR 只更新变化的模块，状态可由插件精细保持。', '生产构建的产物经过 Rollup 多轮优化，需要为慢路径做拆分。'],
    problem: '解决"传统打包器冷启动慢、HMR 更新延迟、依赖图膨胀"的问题。',
  },
{
    id: 'V_02', title: 'Vite 配置文件', navTitle: '配置文件', category: '配置',
    path: '/vite/v-2/config', summary: '使用 defineConfig 获得类型提示，掌握基础配置与常用选项。',
    demo: V02Config, code: V02Code, language: 'vue',
    principle: 'vite.config.ts 使用 defineConfig 包装以获得类型推导；支持通过 VITE_ 前缀的环境变量动态配置。',
    flow: ['查看基础配置示例。', '查看高级配置（别名、CSS、构建选项）。', '理解环境变量在不同模式下的加载。'],
    notes: ['使用 defineConfig 可获得完整的类型提示。', '配置文件支持导出函数，接收 { mode, command } 参数。'],
    problem: '解决"如何组织 Vite 配置，以及不同环境下如何切换配置"的问题。',
  },
{
    id: 'V_03', title: '插件系统', navTitle: '插件系统', category: '插件',
    path: '/vite/v-3/plugins', summary: '理解 Vite 插件兼容 Rollup 插件接口，掌握常用插件的使用。',
    demo: V03Plugins, code: V03Code, language: 'vue',
    principle: 'Vite 插件兼容 Rollup 插件接口，同时提供 Vite 独有钩子（config、configureServer、transformIndexHtml 等）。',
    flow: ['浏览常用插件列表。', '理解插件在 vite.config.ts 中的注册方式。', '了解插件执行顺序。'],
    notes: ['插件按数组顺序执行。', 'Vite 独有钩子以 config、configureServer 等命名。'],
    problem: '解决"如何扩展 Vite 功能，以及选择合适的插件"的问题。',
  },
{
    id: 'V_04', title: 'HMR 热更新', navTitle: 'HMR', category: '开发体验',
    path: '/vite/v-4/hmr', summary: '理解 Vite HMR 基于原生 ESM 的实现原理，以及 Vue/React 的框架集成。',
    demo: V04HMR, code: V04Code, language: 'vue',
    principle: 'Vite HMR 基于原生 ESM，通过 import.meta.hot API 实现模块级热更新；Vue/React 插件自动处理状态保留。',
    flow: ['查看 HMR API 手动处理示例。', '理解 Vue SFC 的 HMR 行为。', '了解 React Fast Refresh 的工作原理。'],
    notes: ['Vue SFC 的 template 更新不丢失状态。', 'HMR 只更新变化的模块，速度极快。'],
    problem: '解决"开发时修改代码后页面刷新导致状态丢失"的问题。',
  },
{
    id: 'V_05', title: '环境变量与模式', navTitle: '环境变量', category: '配置',
    path: '/vite/v-5/env', summary: '使用 .env 文件和 import.meta.env 管理不同环境下的变量。',
    demo: V05Env, code: V05Code, language: 'vue',
    principle: 'Vite 使用 dotenv 加载 .env 文件；只有 VITE_ 前缀的变量会暴露到客户端（通过 import.meta.env 访问）。',
    flow: ['理解 .env 文件的加载优先级。', '学习在代码和配置中读取环境变量。', '掌握 VITE_ 前缀的作用和安全意义。'],
    notes: ['import.meta.env.MODE 可获取当前模式。', '敏感信息（如数据库密码）不应使用 VITE_ 前缀。'],
    problem: '解决"如何在不同环境（开发/测试/生产）中使用不同的 API 地址"的问题。',
  },
{
    id: 'V_06', title: '静态资源处理', navTitle: '静态资源', category: '资源',
    path: '/vite/v-6/assets', summary: '理解导入哈希化、public 目录和 base64 内联三种资源处理方式。',
    demo: V06Assets, code: V06Code, language: 'vue',
    principle: 'Vite 对静态资源有三种处理：导入的资源会被哈希化并复制到构建产物；public 目录的文件原样复制；小于阈值的小资源会被内联为 base64。',
    flow: ['理解显式导入的资源处理方式。', '了解 public 目录的适用场景。', '掌握 assetsInlineLimit 配置。'],
    notes: ['优先使用导入方式引用资源（可获得哈希和优化）。', 'public 目录适合不常变更的静态文件（favicon、robots.txt）。'],
    problem: '解决"静态资源在构建后路径错误，或希望控制资源哈希/内联行为"的问题。',
  },
{
    id: 'V_07', title: '依赖预构建', navTitle: '预构建', category: '性能',
    path: '/vite/v-7/pre-bundle', summary: '理解 Vite 使用 Esbuild 预构建 node_modules 依赖的原因和配置方式。',
    demo: V07PreBundle, code: V07Code, language: 'vue',
    principle: 'Vite 使用 Esbuild 将 CommonJS/大量 ESM 依赖转换为单个 ESM 文件，减少 HTTP 请求并兼容 CommonJS 模块。',
    flow: ['理解为什么需要依赖预构建。', '学习 optimizeDeps 配置。', '了解 Esbuild 在 Vite 中的其他用途。'],
    notes: ['预构建产物缓存在 node_modules/.vite/。', '删除缓存可强制重新预构建。'],
    problem: '解决"首次启动慢，或某些 CommonJS 包无法直接使用"的问题。',
  },
{
    id: 'V_08', title: '构建优化', navTitle: '构建优化', category: '构建',
    path: '/vite/v-8/build', summary: '掌握代码分割、懒加载、压缩等 Vite 生产构建优化手段。',
    demo: V08Build, code: V08Code, language: 'vue',
    principle: 'Vite 基于 Rollup 构建，支持自动代码分割（每个动态 import 生成独立 chunk）、手动分包、多种压缩策略。',
    flow: ['学习自动代码分割和手动分包配置。', '理解路由级懒加载的实现。', '掌握 esbuild/terser 压缩配置。'],
    notes: ['动态 import() 是代码分割的基础。', 'esbuild 压缩速度快，terser 压缩率高。'],
    problem: '解决"生产构建产物过大，或希望控制 chunk 分割策略"的问题。',
  },
{
    id: 'V_09', title: '多页面应用（MPA）', navTitle: 'MPA', category: '构建',
    path: '/vite/v-9/mpa', summary: '配置多个 HTML 入口，构建多页面应用。',
    demo: V09MPA, code: V09Code, language: 'vue',
    principle: 'Vite 通过 build.rollupOptions.input 配置多个 HTML 入口；每个入口是独立的页面，共享依赖会被提取为 common chunk。',
    flow: ['学习 MPA 配置方式。', '理解项目结构组织。', '对比 MPA 与 SPA 的适用场景。'],
    notes: ['每个 HTML 文件使用 <script type="module"> 引入入口 JS。', '共享依赖自动提取，不会重复打包。'],
    problem: '解决"项目需要多个独立页面（如官网+管理后台），而不想用 SPA 前端路由"的问题。',
  },
{
    id: 'V_10', title: '库模式', navTitle: '库模式', category: '构建',
    path: '/vite/v-10/lib', summary: '使用 Vite 构建可发布的 npm 包，同时输出 ESM/UMD/CJS 格式。',
    demo: V10Lib, code: V10Code, language: 'vue',
    principle: 'Vite 库模式通过 build.lib 配置，可同时输出 ESM（供现代打包器）、UMD（供 CDN）、CJS（供 Node.js）格式。',
    flow: ['学习库模式配置。', '理解构建产物结构。', '掌握发布到 npm 的完整流程。'],
    notes: ['使用 peerDependencies 声明框架依赖（如 vue）。', 'package.json 的 module/main 字段指向对应格式产物。'],
    problem: '解决"如何开发一个同时支持 ESM 和 UMD 引入的 npm 包"的问题。',
  },
{
    id: 'V_11', title: '服务端渲染（SSR）', navTitle: 'SSR', category: '进阶',
    path: '/vite/v-11/ssr', summary: '理解 Vite SSR 工作原理，以及 Nuxt 3/4 如何基于 Vite 实现 SSR。',
    demo: V11SSR, code: V11Code, language: 'vue',
    principle: 'Vite SSR 在服务器端运行 Vue 组件生成 HTML，在客户端进行 Hydration（激活）；Nuxt 3/4 内置了完整的 SSR 支持。',
    flow: ['理解 SSR 的工作原理和优势。', '学习 Vite SSR 的基础配置。', '了解 Nuxt 如何基于 Vite 实现 SSR。'],
    notes: ['SSR 有利于 SEO 和首屏速度。', '本仓库（小松鼠举栗子）就是使用 Nuxt 4 + Vite 构建的！'],
    problem: '解决"Vue 应用需要 SEO 友好，或希望提升首屏加载速度"的问题。',
  },
{
    id: 'V_12', title: 'CSS 与 PostCSS', navTitle: 'CSS处理', category: '样式',
    path: '/vite/v-12/css', summary: 'Vite 内置支持 PostCSS、Sass/Less/Stylus 预处理器和 CSS Modules。',
    demo: V12CSS, code: V12Code, language: 'vue',
    principle: 'Vite 自动检测 PostCSS 配置；安装预处理器（如 sass）后即可在 Vue SFC 中使用；CSS Modules 在 Vue SFC 中默认启用。',
    flow: ['学习 PostCSS 配置方式。', '掌握预处理器（Sass/Less）的使用。', '理解 CSS Modules 在 Vue 中的使用。'],
    notes: ['Vue SFC 的 <style scoped> 已提供组件级样式隔离。', '预处理器需要单独安装（npm install -D sass）。'],
    problem: '解决"如何在 Vite 项目中使用 Tailwind、Sass 或 CSS Modules"的问题。',
  },
{
    id: 'V_13', title: 'TypeScript 集成', navTitle: 'TypeScript', category: '类型',
    path: '/vite/v-13/typescript', summary: 'Vite 使用 Esbuild 极速转译 TypeScript，类型检查由 IDE 或 vue-tsc 单独完成。',
    demo: V13TypeScript, code: V13Code, language: 'vue',
    principle: 'Vite 使用 Esbuild 转译 TypeScript（移除类型注解，不做类型检查）；类型检查由 IDE 或单独运行 vue-tsc --noEmit 完成。',
    flow: ['理解 Vite 的 TypeScript 处理策略。', '学习 Vue SFC 中使用 TypeScript。', '掌握类型检查的最佳实践。'],
    notes: ['Vite 不负责类型检查（保证开发服务器速度）。', '建议配置 type-check 脚本在构建前运行。'],
    problem: '解决"Vite 项目中如何获得完整的 TypeScript 支持，以及类型检查应该由谁负责"的问题。',
  },
{
    id: 'V_14', title: '代理与跨域', navTitle: '代理跨域', category: '开发体验',
    path: '/vite/v-14/proxy', summary: '使用 Vite 开发服务器代理解决开发环境跨域问题。',
    demo: V14Proxy, code: V14Code, language: 'vue',
    principle: 'Vite 开发服务器的 server.proxy 配置基于 http-proxy，可将特定路径的请求代理到后端服务器，避免浏览器 CORS 限制。',
    flow: ['学习基础代理配置。', '掌握路径重写和 WebSocket 代理。', '了解 CORS 问题的其他解决方案。'],
    notes: ['changeOrigin: true 会修改请求头的 Origin。', '代理只作用于开发环境，生产环境需要后端配置 CORS 或使用 Nginx 反向代理。'],
    problem: '解决"开发环境中前端请求后端 API 遇到 CORS 错误"的问题。',
  },
{
    id: 'V_15', title: '性能分析', navTitle: '性能分析', category: '性能',
    path: '/vite/v-15/perf', summary: '使用可视化工具和最佳实践分析和优化 Vite 构建产物。',
    demo: V15Perf, code: V15Code, language: 'vue',
    principle: 'Vite 构建产物分析可使用 rollup-plugin-visualizer 可视化；性能优化包括减少依赖体积、使用 CDN、启用压缩等。',
    flow: ['学习使用 rollup-plugin-visualizer 分析产物。', '掌握 Vite 性能优化清单。', '了解如何监控构建和运行时的性能指标。'],
    notes: ['定期分析 bundle 大小，及时发现体积膨胀。', '大型库（如 lodash-es）应使用按需引入。'],
    problem: '解决"构建产物过大，或希望找到体积膨胀的原因"的问题。',
  },
{
    id: 'V_16', title: '自定义插件开发', navTitle: '插件开发', category: '进阶',
    path: '/vite/v-16/plugin-dev', summary: '理解 Vite 插件结构，动手开发一个简单的自定义插件。',
    demo: V16PluginDev, code: V16Code, language: 'vue',
    principle: 'Vite 插件是一个函数，返回一个包含钩子的对象；钩子分为 Vite 独有钩子（config、configureServer 等）和 Rollup 兼容钩子（resolveId、load、transform 等）。',
    flow: ['理解 Vite 插件的结构和钩子。', '学习自定义插件开发示例。', '掌握发布 Vite 插件到 npm 的流程。'],
    notes: ['插件命名规范：vite-plugin-xxx。', 'Vite 独有钩子以 config、configureServer 等命名。'],
    problem: '解决"现有插件无法满足需求，需要为项目定制构建行为"的问题。',
  },
{
    id: 'V_17', title: '依赖预构建与缓存优化', navTitle: '依赖预构建', category: '性能',
    path: '/vite/v-17/dependency-prebundle', summary: '理解 Vite 使用 esbuild 预构建依赖的原理，掌握缓存优化和配置。',
    demo: V17DependencyPrebundle, code: V17Code, language: 'vue',
    principle: 'Vite 在首次启动时使用 esbuild 预构建 node_modules 中的依赖，将 CommonJS/UMD 转换为 ESM，并缓存到磁盘，避免重复构建提升启动速度。',
    flow: ['首次启动 Vite 时扫描依赖并预构建。', '构建结果缓存到 node_modules/.vite。', '后续启动直接读取缓存，依赖变化时重新构建。'],
    notes: ['预构建只处理第三方依赖，源码不预构建。', 'optimizeDeps.include 可以强制预构建某些包。', '缓存失效会自动检测并重新构建。'],
    problem: '解决大量依赖下启动慢、CommonJS 模块无法直接在浏览器运行的问题。',
  },
{
    id: 'V_18', title: 'esbuild 转换与 JSX/TS 处理', navTitle: 'esbuild 转换', category: '基础',
    path: '/vite/v-18/esbuild', summary: '了解 Vite 使用 esbuild 进行极速语法转换的机制，以及 TypeScript 和 JSX 的处理策略。',
    demo: V18Esbuild, code: V18Code, language: 'vue',
    principle: 'Vite 使用 esbuild 处理 TypeScript 和 JSX 转换，esbuild 用 Go 编写比传统 JS 工具快 10-100 倍，开发环境下跳过类型检查只做语法转换。',
    flow: ['源码中的 .ts/.tsx 文件请求到达 Vite 开发服务器。', 'esbuild 进行语法转换，输出纯 JS。', '浏览器直接运行转换后的 ESM 模块。'],
    notes: ['开发环境只做语法转换，类型检查由 IDE 和构建时负责。', 'esbuild 不支持某些 TS 特性如 const enum（需配置）。', '构建时由 Rollup + TS 插件做完整的类型检查。'],
    problem: '解决传统构建工具 TS/JSX 编译速度慢、开发体验差的问题。',
  },
{
    id: 'V_19', title: 'Rollup 插件兼容与构建钩子', navTitle: 'Rollup 插件', category: '插件',
    path: '/vite/v-19/rollup-plugin', summary: '理解 Vite 与 Rollup 插件的兼容性，掌握 Vite 特有钩子和插件使用方式。',
    demo: V19RollupPlugin, code: V19Code, language: 'vue',
    principle: 'Vite 构建时基于 Rollup，兼容大部分 Rollup 插件，同时扩展了 Vite 特有的钩子如 config、configureServer、transformIndexHtml 等。',
    flow: ['在 vite.config.ts 的 plugins 数组中添加 Rollup 插件。', '开发和构建时 Vite 调用插件的不同钩子。', '使用 Vite 特有钩子扩展开发服务器等能力。'],
    notes: ['并非所有 Rollup 插件都能在开发模式下工作。', 'Vite 插件可以只在开发或构建阶段生效。', '插件执行顺序与数组顺序相关，enforce 可以调整。'],
    problem: '解决构建工具生态碎片化、需要学习多套插件 API 的问题。',
  },
{
    id: 'V_20', title: '库模式与组件打包发布', navTitle: '库模式', category: '构建',
    path: '/vite/v-20/library-mode', summary: '使用 Vite 库模式打包组件库或工具库，支持多格式输出和发布到 npm。',
    demo: V20LibraryMode, code: V20Code, language: 'vue',
    principle: 'Vite 的库模式（Library Mode）可以把项目打包成可发布的 npm 包，支持 ESM、CommonJS、UMD 等多种输出格式，并自动处理 CSS 和类型声明。',
    flow: ['在 vite.config.ts 中配置 build.lib 选项。', '指定入口文件、输出格式和包名。', '运行 vite build 生成可发布的 dist 目录。'],
    notes: ['库模式下外部化 Vue 等 peer dependencies。', '需要单独配置 d.ts 生成或使用 vite-plugin-dts。', '注意输出格式兼容性和 Tree Shaking 支持。'],
    problem: '解决组件库/工具库打包配置复杂、输出格式不统一的问题。',
  },
{
    id: 'V_21', title: '多页面应用配置与入口管理', navTitle: '多页面应用', category: '构建',
    path: '/vite/v-21/multi-page', summary: '配置 Vite 多页面应用，管理多个 HTML 入口和共享资源。',
    demo: V21MultiPage, code: V21Code, language: 'vue',
    principle: 'Vite 支持多页面应用（MPA），通过 build.rollupOptions.input 配置多个 HTML 入口，每个页面可以有独立的脚本和样式，开发服务器也支持多页面路由。',
    flow: ['在项目根目录创建多个 HTML 入口文件。', '在 vite.config.ts 中配置 build.rollupOptions.input。', '开发服务器通过路径访问不同页面，构建时输出多个 HTML。'],
    notes: ['多页面可以共享公共依赖和代码分割。', '每个页面有独立的 Vite 模块图。', '适合后台管理系统等多入口场景。'],
    problem: '解决传统 MPA 构建配置复杂、公共资源管理困难的问题。',
  }
]
