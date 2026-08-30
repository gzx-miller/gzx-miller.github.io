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
  if (!loader) throw new Error(`未找到内容组件：${name}`)
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
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return loader
}

const N01ProjectStructure = createDemo('N01ProjectStructure')
const N01Code = createCodeLoader('N01ProjectStructure.vue')
const N02FileRouting = createDemo('N02FileRouting')
const N02Code = createCodeLoader('N02FileRouting.vue')
const N03DynamicRoute = createDemo('N03DynamicRoute')
const N03Code = createCodeLoader('N03DynamicRoute.vue')
const N04Layouts = createDemo('N04Layouts')
const N04Code = createCodeLoader('N04Layouts.vue')
const N05AutoImport = createDemo('N05AutoImport')
const N05Code = createCodeLoader('N05AutoImport.vue')
const N06Composables = createDemo('N06Composables')
const N06Code = createCodeLoader('N06Composables.vue')
const N07UseFetch = createDemo('N07UseFetch')
const N07Code = createCodeLoader('N07UseFetch.vue')
const N08UseAsyncData = createDemo('N08UseAsyncData')
const N08Code = createCodeLoader('N08UseAsyncData.vue')
const N09SSR = createDemo('N09SSR')
const N09Code = createCodeLoader('N09SSR.vue')
const N10ClientOnly = createDemo('N10ClientOnly')
const N10Code = createCodeLoader('N10ClientOnly.vue')
const N11Middleware = createDemo('N11Middleware')
const N11Code = createCodeLoader('N11Middleware.vue')
const N12Plugins = createDemo('N12Plugins')
const N12Code = createCodeLoader('N12Plugins.vue')
const N13UseState = createDemo('N13UseState')
const N13Code = createCodeLoader('N13UseState.vue')
const N14SEO = createDemo('N14SEO')
const N14Code = createCodeLoader('N14SEO.vue')
const N15Nitro = createDemo('N15Nitro')
const N15Code = createCodeLoader('N15Nitro.vue')
const N16ApiRoutes = createDemo('N16ApiRoutes')
const N16Code = createCodeLoader('N16ApiRoutes.vue')
const N17SSG = createDemo('N17SSG')
const N17Code = createCodeLoader('N17SSG.vue')
const N18RuntimeConfig = createDemo('N18RuntimeConfig')
const N18Code = createCodeLoader('N18RuntimeConfig.vue')
const N19ErrorHandling = createDemo('N19ErrorHandling')
const N19Code = createCodeLoader('N19ErrorHandling.vue')
const N20Modules = createDemo('N20Modules')
const N20Code = createCodeLoader('N20Modules.vue')


export const lessons: Lesson[] = [
{
    id: 'N_1',
    title: '项目结构、目录约定与自动导入',
    navTitle: '项目结构',
    category: '起步',
    path: '/nuxt/n-1/project-structure',
    summary: '了解 Nuxt 的目录约定、自动导入机制和 nuxt.config.ts 中的核心配置项。',
    demo: N01ProjectStructure,
    code: N01Code,
    language: 'vue',
    principle:
      'Nuxt 以约定优于配置组织代码：pages/ 下的 .vue 文件自动映射为路由，components/ 下的组件自动全局注册（模板中直接使用），composables/ 与 utils/ 下的导出自动导入，layouts/、plugins/、middleware/、server/ 则按约定分别承载布局、插件、路由中间件与 Nitro 服务端逻辑。nuxt.config.ts 集中声明模块、全局样式、app.head、nitro 与 runtimeConfig 等核心配置。',
    flow: [
      'pages/ 下的 .vue 文件自动映射为路由，无需手动配置 router。',
      'components/ 组件自动注册，composables/ 与 utils/ 的导出自动完成 import。',
      'server/ 目录由 Nitro 扫描，api/ 与 routes/ 自动注册为服务端路由。',
      'nuxt.config.ts 统一管理 modules、css、app.head、nitro、runtimeConfig 等配置。',
    ],
    notes: [
      'srcDir: "src/" 可将源码统一移到 src/ 下，其余目录结构与默认约定保持一致。',
      '自动导入在构建时扫描约定目录，生成 .nuxt/ 下的类型声明供编辑器提示。',
      'assets/ 中的资源需经构建处理，通过 ~/assets/ 引用；public/ 下文件直接以根路径访问。',
    ],
    problem: '解决"Nuxt 项目怎么组织代码、哪些内容无需手动 import、核心配置在哪里"的入门问题。',
  },
{
    id: 'N_2',
    title: '文件路由：目录结构即路由表',
    navTitle: '文件路由',
    category: '起步',
    path: '/nuxt/n-2/file-routing',
    summary: '掌握 Nuxt 文件路由的映射规则，理解静态路由、动态路由和嵌套路由的文件命名约定。',
    demo: N02FileRouting,
    code: N02Code,
    language: 'vue',
    principle:
      'Nuxt 基于文件系统自动生成 Vue Router 配置：pages/ 目录的层级结构直接映射为 URL 路径。普通文件映射为静态路由，方括号包裹的文件名映射为动态路由参数，嵌套目录映射为嵌套路由。路由与文件一一对应，无需维护独立的路由配置表。',
    flow: [
      'pages/index.vue 映射根路径 /，其他 .vue 文件映射同名路径。',
      '嵌套目录映射为层级路径，如 pages/users/[id].vue 映射 /users/:id。',
      '方括号 [id].vue 创建动态路由，[...slug].vue 创建 catch-all 路由。',
    ],
    notes: [
      '文件路由仅在 pages/ 目录生效，其他目录中的 .vue 文件不会生成路由。',
      '动态参数经 useRoute().params 获取，值始终为字符串类型，需要时手动转换。',
      '开发模式下新增或重命名 pages/ 文件会被自动监听并重建路由，无需手动重启。',
    ],
    problem: '解决"如何通过文件结构自动生成路由，动态参数和嵌套路由怎么命名"的问题。',
  },
{
    id: 'N_3',
    title: '动态路由与路由参数',
    navTitle: '动态路由',
    category: '路由',
    path: '/nuxt/n-3/dynamic-route',
    summary: '深入理解动态路由参数 [id] 和 catch-all [...slug] 的匹配规则与参数获取方式。',
    demo: N03DynamicRoute,
    code: N03Code,
    language: 'vue',
    principle:
      '动态路由通过文件名方括号语法声明：单个参数 [id].vue 匹配一个路径段，catch-all [...slug].vue 匹配余下的全部路径段。useRoute().params 返回参数对象，单个参数为字符串，catch-all 参数为字符串数组。可在 definePageMeta 的 validate 函数中校验参数，返回 false 时导航到错误页。',
    flow: [
      '访问 /courses/3 时匹配 [id].vue，经 useRoute().params.id 得到字符串 "3"。',
      '访问 /docs/guide/installation 时匹配 [...slug].vue，params.slug 为数组 ["guide","installation"]。',
      '在 definePageMeta.validate 中校验参数格式，返回 false 会使匹配失效并转交错误处理。',
    ],
    notes: [
      'route.params 中的值均为字符串，数值比较或计算前需用 Number() 转换。',
      'catch-all 路由的优先级低于更具体的静态与动态路由。',
      'validate 在服务端渲染与客户端导航上都会执行，逻辑需两端一致。',
    ],
    problem: '解决"动态路由如何匹配、参数如何获取和校验"的问题。',
  },
{
    id: 'N_4',
    title: '布局系统：Layout 与 definePageMeta',
    navTitle: '布局系统',
    category: '路由',
    path: '/nuxt/n-4/layouts',
    summary: '掌握 layouts/ 目录创建布局模板，页面通过 definePageMeta 指定布局。',
    demo: N04Layouts,
    code: N04Code,
    language: 'vue',
    principle:
      '布局是包裹页面内容的壳组件：layouts/default.vue 为默认布局，内部用 <slot /> 接收页面内容。页面通过 definePageMeta({ layout: "custom" }) 选择布局，方便把导航栏、侧边栏、页脚等跨页面结构抽离复用到不同页面。',
    flow: [
      '在 layouts/ 下创建布局文件，结构中使用 <slot /> 作为页面内容的插槽。',
      '页面组件调用 definePageMeta({ layout: "custom" }) 指定使用 custom 布局。',
      'Nuxt 渲染时把页面内容填充到布局的 <slot /> 位置，共同组成最终页面。',
    ],
    notes: [
      '未显式指定 layout 时，Nuxt 默认使用 layouts/default.vue 作为布局壳。',
      '为特定页签选择 .client 布局时用后缀命名（如 custom.client.vue），仅客户端使用该布局。',
      '布局的 <slot /> 承载页面内容，而 <NuxtPage /> 用于呈现当前匹配的路由页面，二者职责不同。',
    ],
    problem: '解决"多页面共享导航和结构如何复用、不同页面如何使用不同布局"的问题。',
  },
{
    id: 'N_5',
    title: '组件自动导入',
    navTitle: '自动导入',
    category: '约定',
    path: '/nuxt/n-5/auto-import',
    summary: '理解 components/、composables/、utils/ 的自动导入机制与组件命名规则。',
    demo: N05AutoImport,
    code: N05Code,
    language: 'vue',
    principle:
      'Nuxt 在构建时扫描约定目录，为 Vue/Nuxt 内置 API、组件、composable 与工具函数批量生成自动导入声明。components/ 下的组件按路径前缀命名并在模板中直接使用，composables/ 下以 use 开头的函数和 utils/ 下的具名导出，则无需 import 即可在脚本中使用。生成的声明落在 .nuxt/ 供类型提示。',
    flow: [
      '构建时扫描 components/，生成 .nuxt/components.d.ts 等自动导入类型声明。',
      '模板中直接使用 <ComponentName />，Nuxt 自动插入对应的 import 语句。',
      'composables/ 与 utils/ 的导出在 script 中直接调用，无需手动 import。',
    ],
    notes: [
      '嵌套目录的组件使用路径前缀命名，如 components/admin/Table.vue → <AdminTable />。',
      '自动导入默认覆盖 .vue、.ts、.js 等可编译文件，并可通过 imports.dirs 添加自定义目录。',
      '目录约定之外的文件不会被自动导入，需显式 import 使用。',
    ],
    problem: '解决"哪些内容无需手动 import、组件命名规则是什么"的问题。',
  },
{
    id: 'N_6',
    title: 'Composables：可复用组合式函数',
    navTitle: 'Composables',
    category: '约定',
    path: '/nuxt/n-6/composables',
    summary: '掌握 composables/ 目录的使用模式，封装与复用可复用的响应式逻辑。',
    demo: N06Composables,
    code: N06Code,
    language: 'vue',
    principle:
      'Composable 是以 use 开头的函数，内部封装 Vue 响应式逻辑并返回可用的状态与操作方法，实现逻辑复用。以计数器、开关、本地存储这类例子为代表：内部用 ref/computed 建立状态，通过返回的函数暴露增删改等行为。Nuxt 会把 composables/ 下的此类函数自动导入，免去手动 import。',
    flow: [
      '在 composables/ 下新建 useXxx，导出以 use 开头的组合式函数。',
      '函数内用 ref、computed 等响应式 API 封装状态，并返回状态与方法。',
      '调用方直接解构使用返回的响应式状态和操作函数即可。',
    ],
    notes: [
      'composable 需以 use 开头才会被自动导入到项目上下文中。',
      '返回对象中解构 ref 需借助 toRefs，直接对象解构会丢失响应性。',
      '访问浏览器 API 时需判断运行环境（浏览器态 / 服务端态）或用 onMounted 推迟赋值，保证 SSR 下不报错。',
    ],
    problem: '解决"如何封装可复用的响应式逻辑、composable 的设计模式是什么"的问题。',
  },
{
    id: 'N_7',
    title: 'useFetch：声明式数据获取',
    navTitle: 'useFetch',
    category: '数据获取',
    path: '/nuxt/n-7/use-fetch',
    summary: '掌握 useFetch 的声明式数据获取、参数传递、错误处理与仅客户端请求模式。',
    demo: N07UseFetch,
    code: N07Code,
    language: 'vue',
    principle:
      'useFetch 是 Nuxt 封装的数据获取组合式函数，语法上是 useAsyncData 加 $fetch 的封装：自动从 URL 生成缓存 key，SSR 时在服务端发起请求并把结果写入 payload，CSR 时直接从 payload 恢复数据而不会重复请求。它返回 data、pending、error、refresh 等属性，配合 query、method、server: false 与响应式 URL 即可覆盖常见请求场景。',
    flow: [
      '调用 useFetch(url) 发起请求，返回 data、pending、error、refresh。',
      '传入 query 或 method 等选项组合请求参数，URL 内使用 ref 时值变化会自动重发。',
      'SSR 端请求结果写入 payload，客户端从 payload 恢复；refresh() 手动刷新数据。',
      '需要仅在浏览器请求时，设置 server: false 以跳过服务端执行。',
    ],
    notes: [
      'useFetch 默认在 SSR 阶段执行，server: false 可改为仅客户端请求。',
      'key 按请求 URL 自动生成，同一 URL 的请求会在服务端与客户端之间共享结果，避免重复调用。',
      '响应式 URL 或 query 变化时组件会自动重新请求，无需手动触发。',
    ],
    problem: '解决"如何在组件中声明式获取数据、SSR 和 CSR 如何协同"的问题。',
  },
{
    id: 'N_8',
    title: 'useAsyncData：异步数据管理',
    navTitle: 'useAsyncData',
    category: '数据获取',
    path: '/nuxt/n-8/use-async-data',
    summary: '深入 useAsyncData 的 key 管理、去重策略、数据转换与 lazy 模式。',
    demo: N08UseAsyncData,
    code: N08Code,
    language: 'vue',
    principle:
      'useAsyncData 是更底层的异步数据 API，需要手动指定 key 用于缓存与去重。相比 useFetch 提供更细粒度控制：dedupe 决定并发请求的共享或取消策略，transform 对拿到原始数据做转换后再写入 data，default 提供安全的初始值避免 undefined，而 useLazyAsyncData 以 lazy: true 调用则不会阻塞路由导航。',
    flow: [
      '为一次数据获取指定全局唯一的 key，Nuxt 据此做结果缓存与请求去重。',
      'dedupe: "defer" 让并发的同 key 请求共享结果，"cancel" 则取消前一个而发起新请求。',
      'transform 对原始响应做转换后赋值给 data，类型随之变化；default 提供初始值。',
      'useLazyAsyncData 以懒加载方式获取，请求期间不阻塞导航。',
    ],
    notes: [
      'key 在应用中必须全局唯一，重复的 key 会相互覆盖数据。',
      'useLazyAsyncData 等价于设置 lazy: true 的 useAsyncData，而 immediate: false 另指跳过首次执行，二者含义不同。',
      'default 返回的初始值类型应与最终数据保持兼容，避免模板中出现 undefined。',
    ],
    problem: '解决"如何精细控制数据获取的缓存、去重、转换和懒加载"的问题。',
  },
{
    id: 'N_9',
    title: '服务端渲染 SSR 原理',
    navTitle: 'SSR 原理',
    category: '渲染',
    path: '/nuxt/n-9/ssr',
    summary: '理解 SSR 的请求生命周期、Hydration 过程与常见 SSR 兼容性问题。',
    demo: N09SSR,
    code: N09Code,
    language: 'vue',
    principle:
      'Nuxt 的 SSR 流程包含服务端与客户端两个渲染上下文：服务端收到请求后创建独立的 Vue 实例，执行组件 setup 与数据获取，将其渲染为 HTML 字符串，连同 payload 一起发给浏览器；浏览器先展示 HTML，再加载 JS 执行 Hydration，把静态 DOM 激活为响应式应用。Hydration 要求两端首次渲染的结构一致，否则会触发 mismatch 警告。',
    flow: [
      '服务端为每个请求创建独立 Vue 实例，执行 setup 与 useFetch 等数据获取。',
      '服务端把组件树渲染为 HTML，并连同获取到的数据 payload 一并发送。',
      '浏览器立即呈现 HTML 首屏，随后执行 Hydration，把现有 DOM 与 Vue 实例关联。',
      'Hydration 复用的已有 DOM；若服务端与客户端输出不同则产生 mismatch 警告。',
    ],
    notes: [
      '每个 SSR 请求使用各自独立的 Vue 实例，状态不会在请求之间互相污染。',
      'Hydration 并非重新渲染，而是为已渲染的 DOM 绑定事件与响应式状态。',
      'Date.now()、Math.random()、window 访问等会因运行环境不同导致两端输出不一致，需用客户端专属方式处理。',
    ],
    problem: '解决"SSR 是怎么工作的、Hydration 什么意思、为什么会有 mismatch 错误"的问题。',
  },
{
    id: 'N_10',
    title: 'ClientOnly 与客户端专属渲染',
    navTitle: 'ClientOnly',
    category: '渲染',
    path: '/nuxt/n-10/client-only',
    summary: '掌握 ClientOnly 组件、import.meta.client 判断与 .client.ts 后缀等客户端专属渲染方式。',
    demo: N10ClientOnly,
    code: N10Code,
    language: 'vue',
    principle:
      '部分内容只能在浏览器中渲染：直接操作 DOM 的图表库、依赖 window/navigator 的浏览器 API、以及时间/随机数等动态内容。Nuxt 提供多种客户端专属方案：用 <ClientOnly> 包裹仅在客户端渲染的子树并给出 fallback，用 import.meta.client 做编译时的端侧分支，用 onMounted 在挂载后再写入浏览器特有数据，或用 .client.ts 后缀让插件只在客户端加载。',
    flow: [
      '遇到不兼容 SSR 的组件，用 <ClientOnly> 包裹，并在 #fallback 提供服务端占位。',
      '需要访问浏览器 API 时，用 import.meta.client 分支或用 onMounted 在客户端赋值。',
      '需要在整个端侧初始化第三方库时，把插件命名为 *.client.ts 使其仅客户端注册。',
    ],
    notes: [
      '<ClientOnly> 的默认插槽仅客户端渲染，#fallback 插槽用于服务端渲染期间的占位内容。',
      'import.meta.client 是编译期替换为 true/false 的常量，不会带来运行时判断开销。',
      '过度使用客户端专属方案会削弱 SSR 的 SEO 与首屏性能，应仅针对确有必要的部分使用。',
    ],
    problem: '解决"如何在 SSR 项目中安全使用浏览器 API 和不兼容 SSR 的第三方库"的问题。',
  },
{
    id: 'N_11',
    title: '路由中间件',
    navTitle: '中间件',
    category: '路由控制',
    path: '/nuxt/n-11/middleware',
    summary: '掌握命名中间件、全局中间件与内联中间件的定义方式和执行顺序。',
    demo: N11Middleware,
    code: N11Code,
    language: 'vue',
    principle:
      '路由中间件在页面导航触发时执行，用于权限校验、重定向、日志统计等。Nuxt 提供三类中间件：命名中间件放在 middleware/ 下并在页面的 definePageMeta 中引用做局部生效；带 .global 后缀的全局中间件对所有路由自动生效；内联中间件则把函数直接写在 definePageMeta 里。执行顺序为全局、命名（按数组顺序）、内联。',
    flow: [
      '导航触发时，按全局中间件 → 命名中间件 → 内联中间件的顺序依次执行。',
      '中间件内返回 navigateTo() 执行重定向，调用 abortNavigation() 中止当前导航。',
      '无任何返回值则放行，继续后续中间件与正式的导航流程。',
    ],
    notes: [
      '命名中间件默认只对声明了它的页面生效，文件须放在 middleware/ 目录下。',
      '全局中间件文件名需带 .global 后缀（如 stats.global.ts）才会对全路由自动生效。',
      '中间件在服务端渲染与客户端导航中都会执行，逻辑需保证两端一致。',
    ],
    problem: '解决"如何在导航前进行权限校验、全局拦截和路由重定向"的问题。',
  },
{
    id: 'N_12',
    title: '插件系统',
    navTitle: '插件',
    category: '路由控制',
    path: '/nuxt/n-12/plugins',
    summary: '掌握 plugins/ 目录的自动注册、.client.ts 端侧限制与 provide 注入模式。',
    demo: N12Plugins,
    code: N12Code,
    language: 'vue',
    principle:
      'Nuxt 插件在应用启动阶段执行，用于注册全局能力：通过 nuxtApp.vueApp.use() 安装 Vue 插件、初始化只在一端需要的第三方库、用 nuxtApp.provide() 注入全局可用函数。plugins/ 下的文件按文件名字母序自动注册，.client.ts / .server.ts 后缀分别限制仅在客户端或服务端加载。注入的能力在组件中通过 useNuxtApp().$xxx 访问。',
    flow: [
      'Nuxt 启动时按文件名字母序扫描并执行 plugins/ 下各插件的安装函数。',
      '插件内调用 nuxtApp.vueApp.use() 注册 Vue 插件，或用 provide 注入全局能力。',
      '以 .client.ts / .server.ts 结尾的插件仅在对应端加载，避免在另一端报错。',
      '组件中通过 useNuxtApp().$xxx 读取插件注入的全局能力。',
    ],
    notes: [
      '插件在整个应用生命周期只初始化一次，不要在插件里访问或依赖某个特定组件实例。',
      '可借助数字前缀控制执行顺序，例如 01-setup.ts、02-analytics.ts。',
      'provide 注入的键会自动带 $ 前缀：provide("i18n", fn) → $i18n。',
    ],
    problem: '解决"如何注册全局能力、第三方库怎么在 Nuxt 中初始化、如何注入全局方法"的问题。',
  },
{
    id: 'N_13',
    title: 'useState：跨组件状态共享',
    navTitle: 'useState',
    category: '状态管理',
    path: '/nuxt/n-13/use-state',
    summary: '掌握 useState 的轻量状态共享用法，理解其与 Pinia 的适用场景区别。',
    demo: N13UseState,
    code: N13Code,
    language: 'vue',
    principle:
      'useState 是 Nuxt 提供的 SSR 安全的状态共享方案：通过全局唯一的 key，让不同组件访问到同一份响应式状态。SSR 阶段初始化值并随 payload 传递到客户端，Hydration 时从 payload 恢复而非重新初始化，从而保证服务端获取的数据被复用。它足够轻量，适合主题、简单标记等场景；复杂业务状态仍推荐使用 Pinia。',
    flow: [
      '组件 A 调用 useState("key", () => defaultValue) 首次创建并初始化状态。',
      'SSR 阶段状态被序列化进 payload，随 HTML 一起发送给客户端。',
      '组件 B 用 useState("key") 读取到同一份状态，payload 恢复后自动保持一致。',
    ],
    notes: [
      'key 必须全局唯一，使用相同 key 的不同调用会共享同一份状态。',
      'useState 的初始值函数只在首次创建时执行，后续按 key 复用已有状态。',
      '适用于主题切换、全局标记等轻量场景；复杂状态逻辑、异步 action 等交给 Pinia。',
    ],
    problem: '解决"如何在组件间共享轻量状态且 SSR 安全，什么时候用 useState 而非 Pinia"的问题。',
  },
{
    id: 'N_14',
    title: 'SEO 与 useHead',
    navTitle: 'SEO',
    category: '状态管理',
    path: '/nuxt/n-14/seo',
    summary: '掌握 useHead、useSeoMeta 管理 SEO 标签，理解响应式 SEO 与全局 head 配置。',
    demo: N14SEO,
    code: N14Code,
    language: 'vue',
    principle:
      'Nuxt 基于 Unhead 提供 useHead 与 useSeoMeta 来管理 HTML head。useHead 可传入字符串、ref 或 computed，标题等随状态自动更新；useSeoMeta 以更简短的键名生成搜索引擎与社交分享所需的 meta 标签。全局默认值在 nuxt.config.ts 的 app.head 中设置，页面级再通过 useHead 就地覆盖。SSR 时 head 注入返回的 HTML，CSR 时同步更新 DOM。',
    flow: [
      '在 nuxt.config.ts 的 app.head 中配置全局默认 title、meta 等标签。',
      '页面组件内调用 useHead 就地设置或覆盖当前页面的 head 内容。',
      '传入 ref/computed 实现响应式 SEO，状态变化时自动更新标签。',
    ],
    notes: [
      'useHead 的字段支持普通值、ref 或 computed，响应式更新无需手动触发。',
      'useSeoMeta 简化搜索引擎与分享卡片的 meta 配置，可用 ogTitle、twitterCard 等键名。',
      '避免在 useHead 中放入异步副作用，以免影响服务端渲染完成性。',
    ],
    problem: '解决"如何管理页面 SEO 标签、标题如何随状态动态变化"的问题。',
  },
{
    id: 'N_15',
    title: 'Nitro 服务端引擎',
    navTitle: 'Nitro',
    category: '服务端',
    path: '/nuxt/n-15/nitro',
    summary: '理解 Nitro 引擎的核心特性、部署预设与基于 routeRules 的混合渲染。',
    demo: N15Nitro,
    code: N15Code,
    language: 'vue',
    principle:
      'Nitro 是 Nuxt 的服务端引擎：将 server/ 目录编译为独立产物，提供自动代码分割、多目标部署预设、文件路由 API、服务端中间件与统一存储抽象等能力。开发时可面向同一种代码分别构建到 Node.js、Cloudflare、Vercel、Deno 等平台。通过 routeRules 可按路径配置不同渲染策略，实现 SSR、SSG、ISR、SPA 的混合使用。',
    flow: [
      'nuxt build 时 Nitro 把 server/ 编译为可独立运行的服务端产物。',
      '按部署目标选择对应 preset（node-server、cloudflare-pages、vercel 等）。',
      'routeRules 按路径声明不同渲染策略，从而在同一项目中混合 SSR、SSG、ISR 与 SPA。',
    ],
    notes: [
      '需要服务端运行能力时用 nuxt build 产出服务端产物；纯静态站点用 nuxt generate。',
      'swr 等增量再生策略依赖持续运行的服务器，纯静态托管无法执行。',
      'Nitro 以 useStorage() 提供统一存储 API，可对接内存、Redis、Cloudflare KV 等后端。',
    ],
    problem: '解决"Nuxt 服务端怎么工作、如何选择部署目标、不同页面能否用不同渲染模式"的问题。',
  },
{
    id: 'N_16',
    title: 'API 路由：Server Routes',
    navTitle: 'API 路由',
    category: '服务端',
    path: '/nuxt/n-16/api-routes',
    summary: '掌握 server/api/ 目录创建 API 路由，理解方法后缀与请求参数的获取。',
    demo: N16ApiRoutes,
    code: N16Code,
    language: 'vue',
    principle:
      'server/api/ 下的文件会被自动注册为路径前缀为 /api/ 的接口，映射关系与 pages 路由一致。文件名后缀可限定 HTTP 方法：.get.ts、.post.ts、.put.ts、.delete.ts 等，不带后缀则响应所有方法。处理函数内使用 h3 提供的工具：readBody 读取请求体、getQuery 读取查询参数、getRouterParam 读取动态路径参数，并用 createError 创建错误响应。',
    flow: [
      '在 server/api/ 下创建文件并导出 defineEventHandler 处理函数，自动注册为 /api/ 接口。',
      '用 .get.ts /.post.ts 等后缀限定 HTTP 方法，用 [id].ts 承接动态参数。',
      '在处理器中用 readBody、getQuery、getRouterParam 提取参数，返回的值自动序列化为 JSON。',
      '需要报错时用 createError 抛出带状态码的错误。',
    ],
    notes: [
      '不带方法后缀的处理文件会对各种 HTTP 方法都做出响应。',
      'server/middleware/ 下文件自动注册为服务端中间件，对每个服务端请求生效，可用于鉴权等。',
      'server/utils/ 下导出的函数自动导入，可在 API 处理器与服务端中间件中复用。',
    ],
    problem: '解决"如何在 Nuxt 中创建后端 API、如何获取请求参数和处理错误"的问题。',
  },
{
    id: 'N_17',
    title: '静态站点生成与混合渲染',
    navTitle: 'SSG/ISR',
    category: '部署',
    path: '/nuxt/n-17/ssg',
    summary: '掌握 SSG 构建流程、ISR 增量静态再生与基于 routeRules 的混合渲染。',
    demo: N17SSG,
    code: N17Code,
    language: 'vue',
    principle:
      'SSG 通过 nuxt generate 在构建阶段把预渲染路由输出为静态 HTML 到 .output/public/，可部署到 GitHub Pages 等纯静态托管。ISR（Incremental Static Regeneration）在首次请求时渲染并缓存结果，swr 过期后在后台重新生成。借助 routeRules 可在同一项目中让内容页走 SSG、动态页走 SSR、后台页走纯客户端 SPA。',
    flow: [
      'nuxt generate 在构建时执行内部 SSR，遍历预渲染路由并生成 .output/public/ 下的静态文件。',
      '配置 nitro.prerender 的 routes 手动补充列表，crawlLinks: true 则自动从链接发现更多路由。',
      '在 routeRules 中为路径设置 prerender / swr / ssr: false 等，实现 SSG、ISR、SPA 的混合。',
    ],
    notes: [
      'crawlLinks: true 会让 Nitro 沿页面内链接自动发现并预渲染更多路由。',
      'swr 的时间以秒为单位，值过小会造成频繁的后台重新生成，增加服务器压力。',
      'GitHub Pages 等纯静态托管只支持 SSG；ISR 与 SSR 必须运行在带服务器的环境。',
    ],
    problem: '解决"如何生成静态站点、如何配置增量更新、不同页面能否用不同渲染模式"的问题。',
  },
{
    id: 'N_18',
    title: '运行时配置',
    navTitle: '运行时配置',
    category: '部署',
    path: '/nuxt/n-18/runtime-config',
    summary: '掌握 runtimeConfig 的公有/私有配置、环境变量映射及与 app.config.ts 的区别。',
    demo: N18RuntimeConfig,
    code: N18Code,
    language: 'vue',
    principle:
      'runtimeConfig 把配置分为两类：私有配置（如密钥、数据库地址）只能被服务端访问；public 下的公有配置则会暴露给客户端（如公钥、版本号）。配合 NUXT_ 前缀的环境变量可在不同环境覆盖默认值，适合运行时决定。而 app.config.ts 中的配置在构建期确定、不读环境变量，适合主题色等不敏感且不随环境变化的常量。',
    flow: [
      '在 nuxt.config.ts 的 runtimeConfig 中分别声明私有配置与 public 下的公有配置。',
      '用 NUXT_SECRET_KEY、NUXT_PUBLIC_API_KEY 等环境变量在各环境覆盖对应值。',
      '服务端用 useRuntimeConfig(event) 读取全部配置，客户端用 useRuntimeConfig() 只能读到 public。',
      '构建期常量放 app.config.ts，通过 useAppConfig() 读取，运行期不可改动。',
    ],
    notes: [
      '不要把密钥放入 public 配置，它会被打包并暴露到客户端代码中。',
      'NUXT_PUBLIC_ 前缀的变量映射到 config.public 下，NUXT_ 前缀映射到顶层私有配置。',
      'runtimeConfig 的值在运行时确定，app.config.ts 的值在构建时确定，二者定位不同。',
    ],
    problem: '解决"如何安全地管理密钥和配置、环境变量怎么映射、两种配置有何区别"的问题。',
  },
{
    id: 'N_19',
    title: '错误处理',
    navTitle: '错误处理',
    category: '工程实践',
    path: '/nuxt/n-19/error-handling',
    summary: '掌握 error.vue 自定义错误页面、错误钩子、API 错误处理及 createError/clearError。',
    demo: N19ErrorHandling,
    code: N19Code,
    language: 'vue',
    principle:
      'Nuxt 的错误处理分层进行：error.vue 用作自定义错误页面，接收包含 statusCode、statusMessage 与 url 的 error；vue:error 与 app:error 等 hooks 可捕获组件运行时与应用级错误并上报；接口层面的错误则由 useFetch 的 error 或 $fetch 的 try/catch 处理，也可在 server 端用 createError 抛出，配合 onRequestError / onResponseError 回调。clearError 则负责清除错误状态并导航。',
    flow: [
      '路由级 404/500 等错误统一交给 error.vue 渲染友好界面。',
      '组件运行时错误经 vue:error hook 捕获，可在其中上报监控服务。',
      '接口请求错误通过 useFetch 的 error 属性或 $fetch 的 try/catch 就地处理。',
      '需要主动报错时用 createError 指定状态码，结束时用 clearError 清除并可选重定向。',
    ],
    notes: [
      'error.vue 不经过常规布局渲染，应自行组织页面所需的布局结构。',
      'clearError 可传 redirect 指定导航回退地址，不传则留在当前页面。',
      '生产环境建议接入 Sentry 等监控服务，而不只依赖控制台日志。',
    ],
    problem: '解决"Nuxt 各类错误如何捕获和展示、如何自定义错误页面"的问题。',
  },
{
    id: 'N_20',
    title: '模块系统与生态',
    navTitle: '模块生态',
    category: '工程实践',
    path: '/nuxt/n-20/modules',
    summary: '掌握常用 Nuxt 模块的安装配置、模块开发结构与生态使用要点。',
    demo: N20Modules,
    code: N20Code,
    language: 'vue',
    principle:
      'Nuxt 模块在构建期执行 setup 逻辑，借助 Nuxt Kit API 扩展能力：注册插件、添加组件、写入构建钩子、注入运行时配置等。安装方式是把模块加入 nuxt.config.ts 的 modules 数组，按序注册。开发模块时用 defineNuxtModule 声明元数据与 setup，将仅运行时需要的插件、composable 与组件放在模块的 runtime/ 目录。',
    flow: [
      '安装模块依赖后，在 nuxt.config.ts 的 modules 数组中按需排列注册顺序。',
      '模块的 setup 在构建期运行，可通过 addPlugin、addComponent、hook 等 Kit API 扩展 Nuxt。',
      '需要随应用运行的功能（插件、composable、组件）放到模块的 runtime/ 目录中。',
      '模块选项写在 nuxt.config.ts 中与模块 configKey 同名的配置项下。',
    ],
    notes: [
      'modules 数组的顺序决定注册先后，存在依赖关系的模块需注意排序。',
      '优先在 nuxt.com/modules 选取官方或高星的社区模块。',
      '本地模块可用 modulesDir 或直接引用本地路径的方式加载，便于调试。',
    ],
    problem: '解决"如何安装和配置 Nuxt 模块、如何开发自己的模块、生态中有哪些常用模块"的问题。',
  }
]
