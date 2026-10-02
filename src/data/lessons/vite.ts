import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

// 文案需要原样显示 import.meta 环境变量令牌时用该常量拼接：直接写字面量会被 Nitro 的替换规则命中，污染预渲染 HTML 与 payload
const metaEnv = ['import', 'meta', 'env'].join('.')
const viteCodeModules = import.meta.glob<string>('../../demos/vite-code/*', { query: '?raw', import: 'default' })

function createCodeLoader(path: string) {
  const loader = viteCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const V01Core = createDemo('V01CoreArticle')
const V02Config = createDemo('V02ConfigArticle')
const V03Plugins = createDemo('V03PluginsArticle')
const V04HMR = createDemo('V04HMRArticle')
const V05Env = createDemo('V05EnvArticle')
const V06Assets = createDemo('V06AssetsArticle')
const V07PreBundle = createDemo('V07PreBundleArticle')
const V08Build = createDemo('V08BuildArticle')
const V09MPA = createDemo('V09MPAArticle')
const V10Lib = createDemo('V10LibArticle')
const V11SSR = createDemo('V11SSRArticle')
const V12CSS = createDemo('V12CSSArticle')
const V13TypeScript = createDemo('V13TypeScriptArticle')
const V14Proxy = createDemo('V14ProxyArticle')
const V15Perf = createDemo('V15PerfArticle')
const V16PluginDev = createDemo('V16PluginDevArticle')
const V17DependencyPrebundle = createDemo('V17DependencyPrebundleArticle')
const V18Esbuild = createDemo('V18EsbuildArticle')
const V19RollupPlugin = createDemo('V19RollupPluginArticle')
const V20LibraryMode = createDemo('V20LibraryModeArticle')
const V21MultiPage = createDemo('V21MultiPageArticle')

const V01Code = createCodeLoader('vite-code/V01Code.ts.txt')
const V02Code = createCodeLoader('vite-code/V02Code.ts.txt')
const V03Code = createCodeLoader('vite-code/V03Code.ts.txt')
const V04Code = createCodeLoader('vite-code/V04Code.ts.txt')
const V05Code = createCodeLoader('vite-code/V05Code.ts.txt')
const V06Code = createCodeLoader('vite-code/V06Code.ts.txt')
const V07Code = createCodeLoader('vite-code/V07Code.ts.txt')
const V08Code = createCodeLoader('vite-code/V08Code.ts.txt')
const V09Code = createCodeLoader('vite-code/V09Code.ts.txt')
const V10Code = createCodeLoader('vite-code/V10Code.ts.txt')
const V11Code = createCodeLoader('vite-code/V11Code.ts.txt')
const V12Code = createCodeLoader('vite-code/V12Code.ts.txt')
const V13Code = createCodeLoader('vite-code/V13Code.ts.txt')
const V14Code = createCodeLoader('vite-code/V14Code.ts.txt')
const V15Code = createCodeLoader('vite-code/V15Code.ts.txt')
const V16Code = createCodeLoader('vite-code/V16Code.ts.txt')
const V17Code = createCodeLoader('vite-code/V17Code.ts.txt')
const V18Code = createCodeLoader('vite-code/V18Code.ts.txt')
const V19Code = createCodeLoader('vite-code/V19Code.ts.txt')
const V20Code = createCodeLoader('vite-code/V20Code.ts.txt')
const V21Code = createCodeLoader('vite-code/V21Code.ts.txt')

export const lessons: Lesson[] = [
{
    id: 'V_01', title: 'Vite 核心概念', navTitle: '核心概念', category: '基础',
    path: '/vite/v-1/core', summary: '理解 Vite 的两个阶段：开发服务器（原生 ESM）和生产构建（Rollup）。',
    demo: V01Core, code: V01Code, language: 'typescript',
    principle: 'Vite 把工程分为开发与构建两个阶段：开发阶段利用浏览器原生 ESM 对源码做按需即时编译，无需打包成 bundle，HMR 只更新发生变化的模块；生产阶段切换 Rollup 打包，做 Tree Shaking、代码分割与压缩，输出高度优化的静态产物。',
    flow: ['通过核心概念卡片理解原生 ESM、Rollup 构建、HMR 与插件系统。', '对比 Vite 与传统打包器（Webpack）的差异。', '查看常用配置示例，了解 dev server、代理、别名与分包。', '启动一个最小项目，对比 dev 冷启动与生产构建产物的差异。'],
    notes: ['冷启动不受项目规模影响，代价是一次性的依赖预构建。', 'HMR 基于原生 ESM，只精确实时更新发生变化的模块。', '开发阶段按需加载源文件本身，生产阶段才做打包压缩优化。', 'vite preview 可在本地以生产行为预览 dist 产物，部署前先验证。'],
    problem: '解决"传统打包器冷启动慢、HMR 更新延迟、依赖图膨胀拖慢日常开发"的问题。',
  },
{
    id: 'V_02', title: 'Vite 配置文件', navTitle: '配置文件', category: '配置',
    path: '/vite/v-2/config', summary: '使用 defineConfig 获得类型提示，掌握基础配置与常用选项。',
    demo: V02Config, code: V02Code, language: 'typescript',
    principle: 'vite.config.ts 是 Vite 的项目级配置入口：用 defineConfig 包装可获得完整的类型推导与提示；既可导出静态对象，也可导出接收 { mode, command } 的函数，在函数内按环境返回不同配置，或在条件成立时动态追加插件。',
    flow: ['用 defineConfig 编写 server、build、resolve.alias 等基础配置。', '把配置改为函数形式，接收 { mode, command } 按环境返回不同配置。', '在函数内按环境变量（如 ANALYZE）条件性添加插件或调整构建选项。', '环境差异放函数式配置、敏感值放环境变量，避免把密钥或路径硬编码进配置文件。'],
    notes: ['使用 defineConfig 可获得完整类型提示，避免手写配置时字段拼错或被静默忽略。', 'resolve.alias 设置路径别名，css.preprocessorOptions 可注入全局样式。', '函数式配置的返回值会与默认配置深度合并，返回空对象也不会丢失默认行为。', '配置字段拼写错误可能被静默忽略，改动后用 vite --debug 检查最终解析结果。'],
    problem: '解决"开发/生产需要不同的 server、minify、sourcemap 等设置，手动改配置文件既繁琐又容易漏改"的问题。',
  },
{
    id: 'V_03', title: '插件系统', navTitle: '插件系统', category: '插件',
    path: '/vite/v-3/plugins', summary: '理解 Vite 插件兼容 Rollup 插件接口，掌握常用插件的使用。',
    demo: V03Plugins, code: V03Code, language: 'typescript',
    principle: '在 vite.config.ts 的 plugins 数组中注册即可扩展 Vite 功能；常用插件覆盖 Vue 支持、Vue JSX、组件与 API 自动按需引入、PWA 等，社区插件多以 vite-plugin 或 unplugin 前缀分发。',
    flow: ['在 plugins 数组中注册 vue()、vueJsx() 等基础插件。', '用 AutoImport 与 Components 配置 API 与组件的自动按需引入。', '通过 enforce: pre/post 或条件判断控制插件执行顺序与生效阶段。', '仅安装项目实际需要的插件，避免为演示性功能引入过重的依赖。'],
    notes: ['插件在 plugins 数组中按声明顺序执行，配合 enforce: pre/post 可调整先后。', 'unplugin-vue-components 与 unplugin-auto-import 可自动按需引入组件与 API。', '自动引入会生成 dts 声明文件，需加入 tsconfig 的 include，否则编辑器报变量未定义。', '插件执行出错会中断 dev server，报错信息一般带插件名，可据此快速定位。'],
    problem: '解决"每写一个组件都要手动 import，或需要按开发/构建阶段启用不同插件"的问题。',
  },
{
    id: 'V_04', title: 'HMR 热更新', navTitle: 'HMR', category: '开发体验',
    path: '/vite/v-4/hmr', summary: '理解 Vite HMR 基于原生 ESM 的实现原理，以及 Vue/React 的框架集成。',
    demo: V04HMR, code: V04Code, language: 'typescript',
    principle: 'Vite HMR 依托原生 ESM 的模块边界实现：文件修改后服务器沿 import 链向上寻找最近的“接受者”（import.meta.hot.accept 声明的模块），只替换该模块而不刷新页面；Vue/React 插件会为每个组件自动注入接受逻辑并尽量保留组件状态。',
    flow: ['在模块中用 import.meta.hot.accept 声明自身可热替换，并处理状态迁移。', '用 accept(dep, cb) 接受依赖模块更新，用 dispose 做替换前清理。', '观察 Vue SFC 中 template、script、style 分别更新时的页面行为差异。', '热替换代码要包在 if (import.meta.hot) 守卫内，生产构建中该对象不存在。'],
    notes: ['Vue SFC 的 template 与 style 更新不丢失状态，<script setup> 的逻辑变更会重建组件实例。', 'HMR 只沿模块边界替换，状态保存在 Pinia store 或模块级变量中才能跨更新存活。', '模块未声明 accept 时更新会沿依赖链冒泡，找不到边界就整页刷新。', '手动 accept 的回调里要主动应用新模块导出，否则界面不会随更新变化。'],
    problem: '解决"改一行样式页面就整页刷新、表单输入与展开状态被重置，要反复操作才能复现问题"的问题。',
  },
{
    id: 'V_05', title: '环境变量与模式', navTitle: '环境变量', category: '配置',
    path: '/vite/v-5/env', summary: `使用 .env 文件和 ${metaEnv} 管理不同环境下的变量。`,
    demo: V05Env, code: V05Code, language: 'typescript',
    principle: `Vite 内置 dotenv，按 .env → .env.local → .env.[mode] → .env.[mode].local 的优先级加载变量并以后者覆盖前者；只有 VITE_ 前缀的变量会被静态替换进客户端代码（通过 ${metaEnv} 访问），其余变量仅对配置文件的 Node 侧逻辑可见，从机制上避免密钥泄漏到浏览器。`,
    flow: ['创建 .env.development / .env.production，写入带 VITE_ 前缀的变量。', `在业务代码中用 ${metaEnv}.VITE_API_BASE_URL 读取变量。`, '在 vite.config.ts 中用 loadEnv 读取变量配置 proxy，并在 vite-env.d.ts 中补充类型声明。', '把 .env.local 与 .env.*.local 加入 .gitignore，个人覆盖与敏感值不进仓库。'],
    notes: [`${metaEnv}.MODE / DEV / PROD 等内置变量可判断当前运行模式。`, '敏感信息（如数据库密码）不应使用 VITE_ 前缀，因为它会被打进客户端产物。', '修改 .env 后需要重启开发服务器才会生效，已注入的旧值不会热更新。', '变量在构建时静态替换进代码，多环境需要各自构建，无法运行时切换。'],
    problem: '解决"开发/测试/生产需要不同的 API 地址与开关，硬编码在代码里每次发布都要手改"的问题。',
  },
{
    id: 'V_06', title: '静态资源处理', navTitle: '静态资源', category: '资源',
    path: '/vite/v-6/assets', summary: '理解导入哈希化、public 目录和 base64 内联三种资源处理方式。',
    demo: V06Assets, code: V06Code, language: 'typescript',
    principle: 'Vite 对静态资源有三条处理路径：import 导入的资源进入模块图，按内容哈希命名后输出并返回最终 URL；public 目录的文件不经过构建管线、原样复制到产物根目录；小于 assetsInlineLimit（默认 4096 字节）的资源会被内联为 base64 data URL，省去一次请求。',
    flow: ['用 import logo from "./assets/logo.png" 导入图片，观察产物文件名带内容哈希。', '把 favicon、robots.txt 放进 public 目录，用绝对路径 /favicon.ico 引用。', '调整 assetsInlineLimit 或用 ?url、?inline、?raw 后缀显式控制单个资源。', '确认 vite-env.d.ts 声明了资源模块类型，静态导入图片才有类型提示。'],
    notes: ['优先使用导入方式引用资源，可获得哈希缓存与压缩等构建优化。', 'public 目录适合不常变更的静态文件（favicon、robots.txt），引用时必须写绝对路径。', '内联为 base64 会增大约 33% 体积且无法单独缓存，大图应调低阈值避免被打进 JS/CSS。', '哈希由文件内容生成，内容不变文件名不变，可放心为产物设置长期强缓存。'],
    problem: '解决"构建后图片路径 404、小图标产生大量请求拖慢首屏，或不知该把资源放 assets 还是 public"的问题。',
  },
{
    id: 'V_07', title: '依赖预构建', navTitle: '预构建', category: '性能',
    path: '/vite/v-7/pre-bundle', summary: '理解 Vite 使用 Esbuild 预构建 node_modules 依赖的原因和配置方式。',
    demo: V07PreBundle, code: V07Code, language: 'typescript',
    principle: '首次启动时 Vite 用 Esbuild 把 node_modules 中的依赖预构建为单个 ESM 文件：既将 CommonJS/UMD 转换为浏览器可加载的 ESM，又把一个包的内部模块合并，避免开发时产生成百上千次模块请求；产物按依赖与配置的 hash 缓存在 node_modules/.vite 中复用。',
    flow: ['启动开发服务器，观察终端输出的 Pre-bundling dependencies 日志。', '把动态导入未被扫描到的依赖加入 optimizeDeps.include 强制预构建。', '修改 lockfile 或执行 vite --force，验证缓存失效后依赖重新预构建。', '用 optimizeDeps.exclude 排除已是 ESM 的大包，减少不必要的预构建开销。'],
    notes: ['预构建只处理第三方依赖，业务源码不参与，include 中不要写 src 下的路径。', '预构建产物缓存在 node_modules/.vite/ 下，删除缓存可强制重新预构建。', '动态 import 的路径若无法被静态扫描，运行时会出现 404，需要手动加入 include。', '依赖升级或行为异常时，删除 node_modules/.vite 缓存后重启可排除缓存问题。'],
    problem: '解决"依赖内部模块过多导致开发服务器卡顿，或引入 CommonJS 包时报 require is not defined"的问题。',
  },
{
    id: 'V_08', title: '构建优化', navTitle: '构建优化', category: '构建',
    path: '/vite/v-8/build', summary: '掌握代码分割、懒加载、压缩等 Vite 生产构建优化手段。',
    demo: V08Build, code: V08Code, language: 'typescript',
    principle: 'Vite 生产构建基于 Rollup：每个动态 import() 会生成独立 chunk 实现按需加载；rollupOptions.output.manualChunks 可把依赖按组拆分以获得更好的缓存复用；压缩默认用 Esbuild（速度快），可切换 Terser（压缩率更高、可配置 drop_console 等选项）。',
    flow: ['在路由中用 () => import("../views/Home.vue") 配置路由级懒加载。', '在 rollupOptions.output.manualChunks 中按框架、UI 库、工具库分组依赖。', '切换 minify 为 terser 并配置 drop_console，对比产物体积变化。', '用可视化插件查看各 chunk 的体积构成，验证分包是否达到预期。'],
    notes: ['动态 import() 是代码分割的基础，缺少它时 Rollup 只能产出单一大 chunk。', '分包不是越细越好，拆得过散会增加请求数，建议按“变更频率”归组。', 'chunkSizeWarningLimit 只影响警告阈值，不代表超过阈值的 chunk 一定需要拆分。', 'build.target 决定语法降级目标，面向现代浏览器可适当提高以减少产物体积。'],
    problem: '解决"首屏需要下载的 chunk 过大、大依赖与业务代码混在一起导致上线后缓存全部失效"的问题。',
  },
{
    id: 'V_09', title: '多页面应用（MPA）', navTitle: 'MPA', category: '构建',
    path: '/vite/v-9/mpa', summary: '配置多个 HTML 入口，构建多页面应用。',
    demo: V09MPA, code: V09Code, language: 'typescript',
    principle: 'Vite 通过 build.rollupOptions.input 声明多个 HTML 入口构建多页面应用：每个 HTML 是独立入口页，Vite 会为其分别产出 HTML 与入口 JS，同时把跨页面共享的依赖自动提取为 common chunk，避免重复打包。',
    flow: ['在 rollupOptions.input 中以 { main, admin, login } 的键值对声明多个 HTML 入口。', '按“HTML + 入口脚本 + 组件”为每个页面组织目录，把共享代码放入 shared 目录。', '执行构建，检查 dist 中每个页面的 HTML 与共享 chunk 产物结构。', '在 dev 下逐一访问各入口页面，确认脚本独立加载、互不干扰。'],
    notes: ['每个 HTML 用 <script type="module" src="..."> 引入自己的入口 JS，路径需与 input 键名对应。', '共享依赖自动提取为公共 chunk，不会在每个页面里重复打包。', 'dev 服务器下访问子页面需带尾部斜杠（/admin/）才能命中其 index.html。', '部署到子目录时统一用 base 调整各页面资源路径，避免绝对路径 404。'],
    problem: '解决"官网与管理后台需要完全隔离的独立页面，用 SPA 前端路由硬拼在一起既臃肿又不好按页发布"的问题。',
  },
{
    id: 'V_10', title: '库模式', navTitle: '库模式', category: '构建',
    path: '/vite/v-10/lib', summary: '使用 Vite 构建可发布的 npm 包，同时输出 ESM/UMD/CJS 格式。',
    demo: V10Lib, code: V10Code, language: 'typescript',
    principle: 'Vite 库模式通过 build.lib 配置一次输出多种格式：ESM 供现代打包器按需引入、UMD 供 CDN <script> 直接使用、CJS 供 Node.js require；框架依赖用 rollupOptions.external 外部化，UMD 下再通过 output.globals 映射为全局变量避免重复打包。',
    flow: ['在 build.lib 中配置 entry、name 与 formats: ["es", "cjs", "umd"]。', '用 rollupOptions.external 外部化 vue 等依赖，并配置 globals 映射。', '配置 package.json 的 module/main/exports 与 files 字段后发布到 npm。', '用 npm pack 或本地 link 在示例项目中试用产物，逐一验证各格式可用。'],
    notes: ['使用 peerDependencies 声明框架依赖（如 vue），避免打包多份 Vue 实例。', 'package.json 的 module/main/exports 字段应分别指向对应格式产物与类型声明。', '类型声明不会自动生成，需要 vite-plugin-dts 或手写，并保证与 exports 的 types 字段一致。', '库内的 CSS 会单独产出文件，需要使用者手动引入，记得在文档中说明。'],
    problem: '解决"组件库既要被 Vite 项目按 ESM import、又要能用 CDN <script> 直接引入，还要带正确的类型声明"的问题。',
  },
{
    id: 'V_11', title: '服务端渲染（SSR）', navTitle: 'SSR', category: '进阶',
    path: '/vite/v-11/ssr', summary: '理解 Vite SSR 工作原理，以及 Nuxt 3/4 如何基于 Vite 实现 SSR。',
    demo: V11SSR, code: V11Code, language: 'typescript',
    principle: 'SSR 在服务端用 renderToString 把组件渲染为完整 HTML 返回，浏览器先展示静态内容，再由客户端入口 mount 完成 Hydration（激活）绑定事件；Vite 以中间件模式与 ssrLoadModule 在同一进程转换服务端代码，并分别构建服务端与客户端两份产物，Nuxt 3/4 即基于这套机制内置了完整的 SSR 支持。',
    flow: ['用 createServer({ server: { middlewareMode: true } }) 启动 Vite 中间件并挂到 Express。', '服务端用 transformIndexHtml 与 ssrLoadModule 渲染 HTML，客户端 createSSRApp 后 mount 完成 Hydration。', '用 ssr.noExternal / external 控制哪些依赖需要打包进 SSR 产物。', '分别执行客户端与服务端构建，把两份产物一起部署到 Node 服务。'],
    notes: ['SSR 有利于 SEO 和首屏速度，但需要 Node 服务端运行环境；本仓库（小松鼠举栗子）就是 Nuxt 4 + Vite 的 SSR 应用。', '服务端与客户端首次渲染结果必须一致，否则会触发 Hydration 不匹配警告。', '依赖浏览器 API 的代码要放到 onMounted 或 ClientOnly 中，避免服务端执行报错。', '数据请求要放在支持 SSR 的加载函数中，mounted 钩子在服务端不会执行。'],
    problem: '解决"纯客户端渲染的商城首页不被搜索引擎收录、弱网设备首屏长时间白屏"的问题。',
  },
{
    id: 'V_12', title: 'CSS 与 PostCSS', navTitle: 'CSS处理', category: '样式',
    path: '/vite/v-12/css', summary: 'Vite 内置支持 PostCSS、Sass/Less/Stylus 预处理器和 CSS Modules。',
    demo: V12CSS, code: V12Code, language: 'typescript',
    principle: 'Vite 自动读取 postcss.config.js 或 css.postcss 中的插件链并应用于全部样式；安装 sass/less 后即可直接在 <style lang="scss"> 中书写预处理器语法，css.preprocessorOptions 可向每个样式文件注入共享变量；CSS Modules 在 SFC 的 <style module> 中开箱即用。',
    flow: ['在 postcss.config.js（或 css.postcss）中配置 autoprefixer、tailwindcss 等插件。', '安装 sass 后书写 <style lang="scss">，用 preprocessorOptions.additionalData 注入全局变量。', '在 <style module> 中书写样式，通过 :class="$style.xxx" 使用局部类名。', '开发阶段开启 css.devSourcemap，浏览器调试样式时可直接定位到源文件。'],
    notes: ['Vue SFC 的 <style scoped> 已提供组件级样式隔离，普通场景不必再用 CSS Modules。', '预处理器需要单独安装（npm install -D sass），Vite 不内置编译器。', 'additionalData 只能注入变量与 mixin 定义，放入实际样式会被重复输出到每个文件。', 'Tailwind 等工具链通过 PostCSS 接入即可，不必额外安装专门的 Vite 插件。'],
    problem: '解决"全局样式逐步失控、希望统一接入 Tailwind、Sass 变量与组件级样式隔离"的问题。',
  },
{
    id: 'V_13', title: 'TypeScript 集成', navTitle: 'TypeScript', category: '类型',
    path: '/vite/v-13/typescript', summary: 'Vite 使用 Esbuild 极速转译 TypeScript，类型检查由 IDE 或 vue-tsc 单独完成。',
    demo: V13TypeScript, code: V13Code, language: 'typescript',
    principle: 'Vite 用 Esbuild 转译 TypeScript：仅擦除类型注解并做目标语法降级，不做类型检查，因此类型错误不会阻断 dev 与 build；完整的类型安全由 IDE 实时提示与 vue-tsc --noEmit 在构建脚本或 CI 中把关。',
    flow: ['在 package.json 中配置 "type-check": "vue-tsc --noEmit" 并接在构建脚本前。', '在 <script setup lang="ts"> 中编写带接口、泛型的组件逻辑。', `在 vite-env.d.ts 中补充 .vue 模块与 ${metaEnv} 的类型声明。`, '把 type-check 接入 CI 流水线，类型不过就不允许合入与部署。'],
    notes: ['Vite 不负责类型检查（保证开发服务器速度），构建通过不代表类型无误。', '建议配置 type-check 脚本在构建前或 CI 中运行，拦截类型回归。', 'tsconfig.json 的 paths 别名要与 vite.config.ts 的 resolve.alias 保持一致，否则编辑器能跳转但运行时报找不到模块。', '本地 vue-tsc 报错与 IDE 不一致时，核对插件与依赖版本是否对齐。'],
    problem: '解决"Vite 项目写 TS 时类型错误不阻断构建、上线才发现问题，以及别名与环境变量缺类型提示"的问题。',
  },
{
    id: 'V_14', title: '代理与跨域', navTitle: '代理跨域', category: '开发体验',
    path: '/vite/v-14/proxy', summary: '使用 Vite 开发服务器代理解决开发环境跨域问题。',
    demo: V14Proxy, code: V14Code, language: 'typescript',
    principle: 'server.proxy 基于 http-proxy 中间件：开发服务器把匹配前缀或正则的请求转发到 target，浏览器只看到同源请求，从机制上绕开 CORS 限制；rewrite 可改写转发路径，changeOrigin 修改 Host 头，ws: true 开启 WebSocket 转发。',
    flow: ['在 server.proxy 中把 /api 转发到 http://localhost:3000 并设置 changeOrigin: true。', '用 rewrite 去掉或重写路径前缀，用 configure 钩子追加或修改请求头。', '用 ws: true 转发 WebSocket，或在函数式配置中按 loadEnv 切换不同后端地址。', '前端请求统一走相对路径（如 /api/user），后端地址切换只改代理配置。'],
    notes: ['changeOrigin: true 会把请求头的 Host 改为 target 的域名，配合虚拟主机后端时必须开启。', '代理只在 vite dev 生效，生产环境需要后端 CORS、Nginx 反向代理或同域部署。', 'rewrite 的正则作用于带前缀的完整路径，注意用 ^ 锚定避免误改其他请求。', '在 configure 回调里挂日志可看到实际转发请求，联调排错更直观。'],
    problem: '解决"本地开发时前端 5173 端口请求后端 3000 端口被 CORS 拦截，或联调时需在不同后端环境间切换"的问题。',
  },
{
    id: 'V_15', title: '性能分析', navTitle: '性能分析', category: '性能',
    path: '/vite/v-15/perf', summary: '使用可视化工具和最佳实践分析和优化 Vite 构建产物。',
    demo: V15Perf, code: V15Code, language: 'typescript',
    principle: '优化从“测量”开始：用 rollup-plugin-visualizer 生成 treemap 报告，定位占比最大的依赖；再对症下药——按需引入或替换超大依赖（如 moment 换 dayjs）、把大型库外部化交给 CDN、用 manualChunks 合理分包，同时用 server.warmup 与 optimizeDeps 缩短开发启动时间。',
    flow: ['安装 rollup-plugin-visualizer，在 ANALYZE 变量下执行构建产出 stats.html 并查看占比。', '针对报告中的体积大户改为按需引入，或替换为更轻的替代库。', '用 manualChunks 复测分包效果，并设定 chunkSizeWarningLimit 防止反弹。', '用 server.warmup 预热高频入口模块，缩短开发阶段首次访问的等待。'],
    notes: ['定期分析 bundle 大小，及时发现体积膨胀趋势。', '大型库（如 lodash-es）应使用按需引入，避免整体导入。', 'visualizer 只在分析时加入插件数组，日常构建不必生成报告以免拖慢 CI。', '优化前后各存一份报告做对比，用数据确认收益，避免凭感觉调整。'],
    problem: '解决"构建产物体积持续膨胀却找不到是哪个依赖导致，优化效果无法量化对比"的问题。',
  },
{
    id: 'V_16', title: '自定义插件开发', navTitle: '插件开发', category: '进阶',
    path: '/vite/v-16/plugin-dev', summary: '理解 Vite 插件结构，动手开发一个简单的自定义插件。',
    demo: V16PluginDev, code: V16Code, language: 'typescript',
    principle: '自定义插件是返回插件对象（含 name 与各钩子）的函数：既有 Rollup 兼容的 resolveId、load、transform，也有 Vite 独有的 config、configureServer、transformIndexHtml、handleHotUpdate，以此参与开发与构建流程。',
    flow: ['编写返回 Plugin 对象的函数，注册 name 与 transform、config、configureServer 等钩子。', '在 transform 中按文件后缀过滤并改写代码（如把 .md 内容包装成 Vue 组件）。', '用 resolveId/load 暴露虚拟模块，或在 plugins 中接入项目验证效果。', '为插件写示例或单测，验证各钩子的执行时机与产出是否符合预期。'],
    notes: ['插件命名规范为 vite-plugin-xxx，导出函数返回插件对象。', '可利用 transform 钩子改写模块代码，例如注入版本号等全局信息。', 'transform 会被高频调用，务必先按 id 过滤目标文件、快速 return null，避免拖慢开发与构建。', '调试插件可用 vite --debug 查看钩子调用日志，快速定位执行顺序问题。'],
    problem: '解决"现有插件无法满足需求，比如想直接 import .md 文件、或在构建时把版本号注入代码"的问题。',
  },
{
    id: 'V_17', title: '依赖预构建与缓存优化', navTitle: '依赖预构建', category: '性能',
    path: '/vite/v-17/dependency-prebundle', summary: '理解 Vite 使用 esbuild 预构建依赖的原理，掌握缓存优化和配置。',
    demo: V17DependencyPrebundle, code: V17Code, language: 'typescript',
    principle: 'Vite 在首次启动时用 esbuild 预构建 node_modules 中的依赖：把 CommonJS/UMD 模块统一转换成 ESM，并把一个依赖的众多内部模块合并成单个文件，避免浏览器发起成百上千次请求造成瀑布式加载。构建结果带 hash 缓存到 node_modules/.vite，依赖或配置变化才重新构建，二次启动直接复用缓存。',
    flow: ['首次启动 Vite 时扫描依赖并预构建。', '构建结果缓存到 node_modules/.vite。', '后续启动直接读取缓存，依赖变化时重新构建。', '观察启动日志中是否出现 Pre-bundling，异常时用 --force 强制重新构建。'],
    notes: ['预构建只处理第三方依赖，源码不预构建。', 'optimizeDeps.include 可以强制预构建某些包。', '缓存失效会自动检测并重新构建。', 'monorepo 本地链接的包建议加入 include 并设置 resolve.dedupe，避免多实例问题。'],
    problem: '解决"大量依赖下启动慢、CommonJS 模块无法直接在浏览器运行"的问题。',
  },
{
    id: 'V_18', title: 'esbuild 转换与 JSX/TS 处理', navTitle: 'esbuild 转换', category: '基础',
    path: '/vite/v-18/esbuild', summary: '了解 Vite 使用 esbuild 进行极速语法转换的机制，以及 TypeScript 和 JSX 的处理策略。',
    demo: V18Esbuild, code: V18Code, language: 'typescript',
    principle: 'Vite 用 esbuild 处理 TypeScript 与 JSX 的语法转换：esbuild 以 Go 编写、多核并行，速度比传统 JS 实现的工具快 10-100 倍；转换只剥离类型标注，不做类型检查，因此开发服务器能在毫秒级响应模块请求。类型检查的正确性由 vue-tsc/tsc 在构建前或 CI 中单独保证。',
    flow: ['源码中的 .ts/.tsx 文件请求到达 Vite 开发服务器。', 'esbuild 进行语法转换，输出纯 JS。', '浏览器直接运行转换后的 ESM 模块。', '构建前运行 vue-tsc --noEmit，把类型错误拦截在 CI 阶段。'],
    notes: ['开发环境与依赖预构建都由 esbuild 快速做语法转换，不做类型检查。', 'esbuild 不支持 const enum、export = 等 TS 特性，需改用兼容写法。', '完整类型检查交给 tsc 或 vue-tsc，在构建前或 CI 中执行。', 'esbuild 不支持 emitDecoratorMetadata，依赖装饰器元数据的框架需改用官方插件链。'],
    problem: '解决"传统构建工具 TS/JSX 编译速度慢，改一次代码要等数秒才看到效果"的问题。',
  },
{
    id: 'V_19', title: 'Rollup 插件兼容与构建钩子', navTitle: 'Rollup 插件', category: '插件',
    path: '/vite/v-19/rollup-plugin', summary: '理解 Vite 与 Rollup 插件的兼容性，掌握 Vite 特有钩子和插件使用方式。',
    demo: V19RollupPlugin, code: V19Code, language: 'typescript',
    principle: 'Vite 构建时基于 Rollup，因此大部分 Rollup 插件（如 visualizer、imagemin）可直接复用；同时扩展了 config、configResolved、configureServer、transformIndexHtml、handleHotUpdate 等 Vite 特有钩子，并支持 apply 字段让插件只在 serve 或 build 阶段生效。',
    flow: ['在 vite.config.ts 的 plugins 数组中添加 Rollup 插件并观察构建效果。', '用 apply: "serve" / "build" 或钩子类型区分插件在开发与构建阶段的行为。', '编写同时使用 Vite 特有钩子与 Rollup 兼容钩子的通用插件。', '评估插件对构建耗时的影响，用 apply 限定生效阶段避免波及 dev。'],
    notes: ['并非所有 Rollup 插件都能在开发模式下工作，产物类钩子主要在构建时触发。', '插件可通过 apply: "serve" | "build" 只在开发或构建阶段生效。', 'Vite 特有钩子负责开发服务器、HTML 与 HMR，Rollup 钩子负责模块解析、加载与转换。', '接入社区插件前核对兼容性与最低 Vite 版本，避免因版本错配导致构建失败。'],
    problem: '解决"构建工具生态碎片化、Rollup 与 Vite 插件 API 不一、需要学习多套体系"的问题。',
  },
{
    id: 'V_20', title: '库模式与组件打包发布', navTitle: '库模式', category: '构建',
    path: '/vite/v-20/library-mode', summary: '使用 Vite 库模式打包组件库或工具库，支持多格式输出和发布到 npm。',
    demo: V20LibraryMode, code: V20Code, language: 'typescript',
    principle: 'Vite 的库模式可以把项目打包成可发布的 npm 包：build.lib 一次输出 ESM、CJS、UMD 等多种格式，框架依赖通过 external 外部化交由使用方提供；CSS 会单独产出文件，类型声明则需借助 vite-plugin-dts 等工具生成后随包发布。',
    flow: ['在 vite.config.ts 中配置 build.lib 选项。', '指定入口文件、输出格式和 UMD 包名，并配置 external 与 exports 映射。', '运行 vite build 生成可发布的 dist 目录。', '用 npm pack 检查产物清单，确认入口、类型声明与文件齐全后再发布。'],
    notes: ['库模式下外部化 Vue 等 peer dependencies。', '需要单独配置 d.ts 生成或使用 vite-plugin-dts。', '注意输出格式兼容性和 Tree Shaking 支持。', '发布时开启 sourcemap，便于使用方在调试依赖问题时直接定位到源码。'],
    problem: '解决"组件库与工具库打包配置复杂、输出格式不统一、类型声明缺失"的问题。',
  },
{
    id: 'V_21', title: '多页面应用配置与入口管理', navTitle: '多页面应用', category: '构建',
    path: '/vite/v-21/multi-page', summary: '配置 Vite 多页面应用，管理多个 HTML 入口和共享资源。',
    demo: V21MultiPage, code: V21Code, language: 'typescript',
    principle: '多页面应用通过 build.rollupOptions.input 声明多个 HTML 入口；本课重点是动态收集入口、用 manualChunks 按页面拆分共享依赖，并规划公共目录与各页面独立模块的目录结构。入口自动化与分包策略让 MPA 在页面数量增长后依然可维护，构建结果也能按页面精准缓存。',
    flow: ['用 fast-glob 扫描 src/pages/*/index.html 动态生成入口表并传给 rollupOptions.input。', '为每个页面配置 index.html + main.ts + App.vue 的独立目录，公共代码集中到共享目录。', '用 manualChunks 提取跨页面共享依赖，构建后核对各页面 HTML 与公共 chunk。', '新增页面只需创建目录结构，入口扫描会自动纳入，无需改动配置文件。'],
    notes: ['多页面可共享公共组件、工具与状态，Vite 会提取为公共 chunk。', '每个 HTML 入口对应各自的入口脚本，可挂载到不同 DOM 节点。', '配合 manualChunks 把 vue、UI 库等共享依赖单独分包，利于缓存复用。', '入口扫描的模式要排除无关目录，避免把组件测试页等 HTML 误纳入构建。'],
    problem: '解决"传统 MPA 构建配置复杂、入口手工维护、公共资源管理困难"的问题。',
  }
]
