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
    summary: '了解 Nuxt 的目录约定、自动导入机制和 nuxt.config.ts 核心配置项。',
    demo: N01ProjectStructure,
    code: N01Code,
    language: 'vue',
    principle:
      'Nuxt 采用约定优于配置的理念：pages/ 自动生成路由、components/ 自动注册、composables/ 自动导入、server/ 自动注册 API。nuxt.config.ts 集中管理构建和运行时配置。这套约定减少了模板代码，让开发者聚焦业务逻辑。',
    flow: [
      'pages/ 下的 .vue 文件自动映射为路由，无需手动配置 router。',
      'components/ 和 composables/ 下的导出自动全局可用，无需手动 import。',
      'nuxt.config.ts 中声明模块、全局样式、SEO 配置等，统一管理。',
    ],
    notes: [
      'srcDir 配置可将源码移到 src/ 下，保持项目根目录整洁。',
      '自动导入基于目录扫描生成 .nuxt/ 下的类型声明，编辑器能正确提示。',
      '不在约定目录中的代码不会被自动导入，需要手动 import。',
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
      'Nuxt 基于文件系统自动生成 Vue Router 配置：pages/ 目录的层级结构直接映射为 URL 路径。文件名即路由路径，方括号表示动态参数，嵌套目录表示路由层级。这种声明式路由让路由和文件一一对应，无需维护路由配置表。',
    flow: [
      'pages/index.vue 映射根路径 /，其他 .vue 文件映射同名路径。',
      '方括号 [id].vue 创建动态路由，参数通过 useRoute().params 获取。',
      '[...slug].vue 创建 catch-all 路由，匹配所有子路径。',
    ],
    notes: [
      '文件路由只在 pages/ 目录生效，其他目录的 .vue 文件不会生成路由。',
      '动态参数在 route.params 中始终为字符串类型，需要时手动转换。',
      '路由变更后需要重启开发服务器让 Nuxt 重新扫描。',
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
      '动态路由通过文件名方括号语法定义参数：[id].vue 匹配单个路径段，[...slug].vue 匹配多个路径段。useRoute().params 返回参数对象，动态参数为字符串，catch-all 参数为字符串数组。路径校验可在 definePageMeta 的 validate 中完成。',
    flow: [
      '用户访问 /courses/3，Nuxt 匹配 [id].vue，params.id 为 "3"。',
      '访问 /docs/guide/installation，匹配 [...slug].vue，params.slug 为 ["guide","installation"]。',
      '在 definePageMeta.validate 中校验参数格式，返回 false 触发 404。',
    ],
    notes: [
      'route.params 的值都是字符串，数值比较前需要 Number() 转换。',
      'catch-all 路由可以匹配零个或多个段，优先级低于具体路由。',
      'validate 函数在 SSR 和 CSR 都会执行，需要考虑两端兼容性。',
    ],
    problem: '解决"动态路由如何匹配、参数如何获取和校验"的问题。',
  },
{
    id: 'N_4',
    title: '布局系统：Layout 与 definePageMeta',
    navTitle: '布局系统',
    category: '路由',
    path: '/nuxt/n-4/layouts',
    summary: '掌握 layouts/ 目录创建布局模板，页面通过 definePageMeta 选择布局。',
    demo: N04Layouts,
    code: N04Code,
    language: 'vue',
    principle:
      '布局是包裹页面内容的壳：layouts/default.vue 是默认布局，包含 <slot /> 接收页面内容。页面通过 definePageMeta({ layout: "custom" }) 指定使用哪个布局。布局适合放置导航栏、侧边栏、页脚等跨页面共享的结构，避免每个页面重复编写。',
    flow: [
      '创建 layouts/xxx.vue，包含 <slot /> 作为页面内容插槽。',
      '在页面组件中调用 definePageMeta({ layout: "xxx" }) 指定布局。',
      'Nuxt 在渲染页面时，将页面内容插入布局的 slot 位置。',
    ],
    notes: [
      '不指定 layout 时默认使用 layouts/default.vue。',
      '布局变更需要重启开发服务器。',
      '布局中可以使用 <NuxtPage /> 实现嵌套布局，但通常用 <slot /> 即可。',
    ],
    problem: '解决"多页面共享导航和结构如何复用、不同页面如何使用不同布局"的问题。',
  },
{
    id: 'N_5',
    title: '组件自动导入',
    navTitle: '自动导入',
    category: '约定',
    path: '/nuxt/n-5/auto-import',
    summary: '理解 components/、composables/、utils/ 的自动导入机制和命名规则。',
    demo: N05AutoImport,
    code: N05Code,
    language: 'vue',
    principle:
      'Nuxt 在构建时扫描约定目录，为 Vue API、Nuxt API、组件、composable 和工具函数生成自动导入声明。components/ 下的组件按路径前缀命名（如 base/Input.vue → BaseInput），composables/ 下 use 开头的函数和 utils/ 下的导出自动全局可用。',
    flow: [
      '构建时扫描 components/ 生成 .nuxt/components.d.ts 类型声明。',
      '模板中直接使用 <ComponentName />，Nuxt 自动插入 import 语句。',
      'composables/ 和 utils/ 的导出在 script 中直接使用，无需手动 import。',
    ],
    notes: [
      '嵌套目录的组件使用路径前缀：components/admin/Table.vue → AdminTable。',
      '自动导入仅在 .vue 文件的 template 和 script setup 中生效。',
      '可在 nuxt.config.ts 的 imports.dirs 中添加自定义扫描目录。',
    ],
    problem: '解决"哪些内容无需手动 import、组件命名规则是什么"的问题。',
  },
{
    id: 'N_6',
    title: 'Composables：可复用组合式函数',
    navTitle: 'Composables',
    category: '约定',
    path: '/nuxt/n-6/composables',
    summary: '掌握 composables/ 目录的使用模式，封装和复用响应式逻辑。',
    demo: N06Composables,
    code: N06Code,
    language: 'vue',
    principle:
      'Composable 是 Vue 3 组合式 API 的核心复用单元：一个以 use 开头的函数，内部使用 ref/computed/watch 等响应式 API，返回响应式状态和操作方法。Nuxt 的 composables/ 目录让这些函数自动全局可用，无需手动 import。每个 composable 应封装单一关注点。',
    flow: [
      '在 composables/ 下创建 useXxx.ts，导出组合式函数。',
      '函数内部使用 ref、computed、watch 等 API 封装逻辑。',
      '返回响应式状态和操作方法，调用方按需解构使用。',
    ],
    notes: [
      'composable 名称必须以 use 开头才会被自动导入。',
      '返回的对象中 ref 需要用 toRefs 解构才能保持响应式。',
      'SSR 环境下 composable 中的副作用需要在 onUnmounted 中清理。',
    ],
    problem: '解决"如何封装可复用的响应式逻辑、composable 的设计模式是什么"的问题。',
  },
{
    id: 'N_7',
    title: 'useFetch：声明式数据获取',
    navTitle: 'useFetch',
    category: '数据获取',
    path: '/nuxt/n-7/use-fetch',
    summary: '掌握 useFetch 的基本用法、参数传递、错误处理和仅客户端请求模式。',
    demo: N07UseFetch,
    code: N07Code,
    language: 'vue',
    principle:
      'useFetch 是 Nuxt 封装的数据获取组合式函数：自动从 URL 生成缓存 key、SSR 时在服务端执行请求并将结果序列化到 payload、CSR 时从 payload 恢复数据避免重复请求。它封装了 useAsyncData + $fetch，提供了 pending、error、refresh 等便捷属性。',
    flow: [
      '调用 useFetch(url) 发起请求，返回 data、pending、error、refresh。',
      'SSR 时在服务端执行请求，结果随 HTML payload 发送到客户端。',
      'CSR 时从 payload 恢复数据，不重复请求；refresh() 可手动刷新。',
    ],
    notes: [
      'useFetch 默认在 SSR 时执行，设置 server: false 可仅客户端请求。',
      'URL 中使用响应式变量时，值变化会自动重新请求。',
      '同一个 URL 的并发请求会自动去重，避免重复调用。',
    ],
    problem: '解决"如何在组件中声明式获取数据、SSR 和 CSR 如何协同"的问题。',
  },
{
    id: 'N_8',
    title: 'useAsyncData：异步数据管理',
    navTitle: 'useAsyncData',
    category: '数据获取',
    path: '/nuxt/n-8/use-async-data',
    summary: '深入 useAsyncData 的 key 管理、去重策略、数据转换和 lazy 模式。',
    demo: N08UseAsyncData,
    code: N08Code,
    language: 'vue',
    principle:
      'useAsyncData 是 useFetch 的底层 API，需要手动指定 key 用于缓存和去重。它提供更细粒度的控制：dedupe 选项控制并发请求策略（defer 共享结果、cancel 取消重发），transform 处理服务端返回数据，default 提供初始值避免 undefined。useLazyAsyncData 不阻塞导航。',
    flow: [
      '指定唯一 key，Nuxt 用它缓存结果和避免重复请求。',
      'dedupe: "defer" 让并发请求共享结果，"cancel" 取消旧请求发新的。',
      'transform 在服务端处理数据格式，default 提供安全的初始值。',
    ],
    notes: [
      'key 在整个应用中必须唯一，重复 key 会导致数据覆盖。',
      'useLazyAsyncData 等价于 useAsyncData + immediate: false。',
      'default 函数返回的初始值类型应与最终数据一致。',
    ],
    problem: '解决"如何精细控制数据获取的缓存、去重、转换和懒加载"的问题。',
  },
{
    id: 'N_9',
    title: '服务端渲染 SSR 原理',
    navTitle: 'SSR 原理',
    category: '渲染',
    path: '/nuxt/n-9/ssr',
    summary: '理解 SSR 请求生命周期、Hydration 过程和常见的 SSR 兼容性问题。',
    demo: N09SSR,
    code: N09Code,
    language: 'vue',
    principle:
      'Nuxt SSR 的核心流程：服务端收到请求 → 创建独立 Vue 实例 → 执行 setup 和数据获取 → 渲染为 HTML → 将 HTML + payload 发送到浏览器 → 客户端执行 Hydration 将静态 HTML 激活为响应式应用。Hydration 要求服务端和客户端的 DOM 结构一致，否则报 mismatch 警告。',
    flow: [
      '服务端执行组件 setup，运行 useFetch 获取数据，渲染完整 HTML。',
      'HTML 和 payload 数据一起发送到浏览器，用户立即看到页面内容。',
      '客户端加载 JS 后执行 Hydration，将静态 HTML 与 Vue 虚拟 DOM 关联。',
    ],
    notes: [
      '每个 SSR 请求创建独立的 Vue 实例，不会跨请求污染状态。',
      'Hydration 不是重新渲染，而是复用已有 DOM 绑定事件和状态。',
      'Date.now()、Math.random() 等在 SSR 和 CSR 结果不同，会导致 mismatch。',
    ],
    problem: '解决"SSR 是怎么工作的、Hydration 什么意思、为什么会有 mismatch 错误"的问题。',
  },
{
    id: 'N_10',
    title: 'ClientOnly 与客户端专属渲染',
    navTitle: 'ClientOnly',
    category: '渲染',
    path: '/nuxt/n-10/client-only',
    summary: '掌握 ClientOnly 组件、import.meta.client 判断和 .client.ts 插件等客户端专属渲染方式。',
    demo: N10ClientOnly,
    code: N10Code,
    language: 'vue',
    principle:
      '某些内容只能在浏览器渲染：图表库直接操作 DOM、浏览器 API（window/navigator）、动态内容（时间/随机数）。Nuxt 提供多种方式处理：ClientOnly 组件包裹仅客户端的内容、import.meta.client 条件判断、.client.ts 文件名后缀让插件只在客户端加载、onMounted 中赋值浏览器特定数据。',
    flow: [
      '遇到不兼容 SSR 的库，用 ClientOnly 包裹并提供 fallback。',
      '需要浏览器 API 时，用 import.meta.client 判断或 onMounted 延迟赋值。',
      '第三方库 SSR 报错时，在 plugins/ 中创建 .client.ts 文件仅客户端注册。',
    ],
    notes: [
      'ClientOnly 的 fallback slot 在 SSR 时显示，客户端加载完成后替换。',
      'import.meta.client 是编译时常量，不会增加运行时开销。',
      '大量使用 ClientOnly 会削弱 SSR 的 SEO 优势，应控制使用范围。',
    ],
    problem: '解决"如何在 SSR 项目中安全使用浏览器 API 和不兼容 SSR 的第三方库"的问题。',
  },
{
    id: 'N_11',
    title: '路由中间件',
    navTitle: '中间件',
    category: '路由控制',
    path: '/nuxt/n-11/middleware',
    summary: '掌握命名中间件、全局中间件和内联中间件的使用方式和执行顺序。',
    demo: N11Middleware,
    code: N11Code,
    language: 'vue',
    principle:
      '路由中间件在导航触发时执行，可用于权限校验、重定向、日志记录等。Nuxt 提供三种中间件：命名中间件（middleware/xxx.ts，页面通过 definePageMeta 引用）、全局中间件（.global.ts 后缀，自动对所有路由生效）、内联中间件（直接写在 definePageMeta 中的函数）。执行顺序：全局 → 命名 → 内联。',
    flow: [
      '导航触发时，Nuxt 按全局 → 命名 → 内联的顺序执行中间件。',
      '中间件返回 navigateTo() 重定向，abortNavigation() 中止导航。',
      '无返回值则放行，继续执行后续中间件和导航。',
    ],
    notes: [
      '全局中间件文件名必须带 .global 后缀，否则不会自动生效。',
      '中间件在 SSR 和 CSR 都会执行，需要注意两端兼容性。',
      '避免在中间件中执行耗时操作，会阻塞导航。',
    ],
    problem: '解决"如何在导航前进行权限校验、全局拦截和路由重定向"的问题。',
  },
{
    id: 'N_12',
    title: '插件系统',
    navTitle: '插件',
    category: '路由控制',
    path: '/nuxt/n-12/plugins',
    summary: '掌握 plugins/ 目录的自动注册、.client.ts 后缀和 provide/inject 注入模式。',
    demo: N12Plugins,
    code: N12Code,
    language: 'vue',
    principle:
      'Nuxt 插件在应用创建时自动执行，用于注册全局能力：Vue 插件（Element Plus 等）、第三方库初始化、全局 provide 注入。plugins/ 目录下的文件按文件名字母序自动注册，.client.ts 后缀限制仅在客户端执行，.server.ts 仅服务端执行。通过 nuxtApp.provide 注入的功能在组件中用 useNuxtApp().$xxx 访问。',
    flow: [
      'Nuxt 启动时按字母序扫描 plugins/ 目录，自动注册所有插件。',
      '插件中调用 nuxtApp.vueApp.use() 注册 Vue 插件。',
      '通过 nuxtApp.provide() 注入全局方法，组件中 useNuxtApp().$xxx 使用。',
    ],
    notes: [
      '插件只执行一次，在应用创建阶段，不要在插件中访问组件实例。',
      '文件名字母序决定执行顺序，可用数字前缀控制：01-xxx.ts、02-xxx.ts。',
      'provide 的名称会自动加 $ 前缀：provide("i18n", fn) → $i18n。',
    ],
    problem: '解决"如何注册全局能力、第三方库怎么在 Nuxt 中初始化、如何注入全局方法"的问题。',
  },
{
    id: 'N_13',
    title: 'useState：跨组件状态共享',
    navTitle: 'useState',
    category: '状态管理',
    path: '/nuxt/n-13/use-state',
    summary: '掌握 useState 轻量状态共享的用法，理解其与 Pinia 的适用场景区别。',
    demo: N13UseState,
    code: N13Code,
    language: 'vue',
    principle:
      'useState 是 Nuxt 提供的 SSR 友好状态共享方案：通过唯一 key 在不同组件间共享响应式状态。SSR 时状态随 payload 传递到客户端，Hydration 时从 payload 恢复而非重新初始化，避免客户端重复请求。适合轻量场景，复杂业务仍推荐 Pinia。',
    flow: [
      '组件 A 调用 useState("key", () => defaultValue) 创建共享状态。',
      'SSR 时状态序列化到 payload，随 HTML 发送到客户端。',
      '组件 B 调用 useState("key") 读取同一份状态，自动同步。',
    ],
    notes: [
      'key 必须全局唯一，重复 key 会共享同一份数据。',
      'useState 的初始值函数只在首次创建时执行，后续调用复用已有状态。',
      '适合主题切换、简单全局标记等场景，复杂状态逻辑用 Pinia。',
    ],
    problem: '解决"如何在组件间共享轻量状态且 SSR 安全，什么时候用 useState 而非 Pinia"的问题。',
  },
{
    id: 'N_14',
    title: 'SEO 与 useHead',
    navTitle: 'SEO',
    category: '状态管理',
    path: '/nuxt/n-14/seo',
    summary: '掌握 useHead、useSeoMeta 管理 SEO 标签，理解响应式 SEO 和全局配置。',
    demo: N14SEO,
    code: N14Code,
    language: 'vue',
    principle:
      'Nuxt 基于 Unhead 提供 useHead 和 useSeoMeta 管理 HTML head 标签。useHead 支持响应式值（computed/ref），标题变化时自动更新 DOM。useSeoMeta 简化 OG 标签配置。全局默认在 nuxt.config.ts 的 app.head 设置，页面级用 useHead 覆盖。SSR 时 head 标签注入 HTML，CSR 时动态更新。',
    flow: [
      '在 nuxt.config.ts 的 app.head 配置全局默认 title、meta。',
      '页面组件中调用 useHead 覆盖当前页面的 head 标签。',
      '传入 computed/ref 实现响应式 SEO，状态变化时自动更新。',
    ],
    notes: [
      'useHead 中的值支持字符串、ref、computed，响应式更新无需手动操作。',
      'useSeoMeta 是 useHead 的语法糖，专门用于 OG 和 Twitter 标签。',
      '避免在 useHead 中使用复杂的异步逻辑，可能导致 SSR 渲染不完整。',
    ],
    problem: '解决"如何管理页面 SEO 标签、标题如何随状态动态变化"的问题。',
  },
{
    id: 'N_15',
    title: 'Nitro 服务端引擎',
    navTitle: 'Nitro',
    category: '服务端',
    path: '/nuxt/n-15/nitro',
    summary: '理解 Nitro 引擎的核心特性、部署目标和混合渲染配置。',
    demo: N15Nitro,
    code: N15Code,
    language: 'vue',
    principle:
      'Nitro 是 Nuxt 的服务端引擎，提供自动代码分割、多目标部署、文件路由 API、存储层抽象等能力。它将服务端代码编译为独立产物，可部署到 Node.js、Cloudflare、Vercel 等多种平台。通过 routeRules 配置混合渲染策略：SSR、SSG、ISR、SPA 可在同一项目中混用。',
    flow: [
      'nuxt build 时 Nitro 编译 server/ 目录为独立服务端产物。',
      'API 路由自动代码分割，每个端点独立打包按需加载。',
      'routeRules 按路径配置不同渲染策略，实现混合渲染。',
    ],
    notes: [
      'nuxt generate 用于纯静态部署，nuxt build 用于需要服务端的环境。',
      'SWR（stale-while-revalidate）需要服务器运行，纯静态托管不支持 ISR。',
      'Nitro 的存储层用 useStorage() 访问，支持内存、Redis、KV 等后端。',
    ],
    problem: '解决"Nuxt 服务端怎么工作、如何选择部署目标、不同页面能否用不同渲染模式"的问题。',
  },
{
    id: 'N_16',
    title: 'API 路由：Server Routes',
    navTitle: 'API 路由',
    category: '服务端',
    path: '/nuxt/n-16/api-routes',
    summary: '掌握 server/api/ 目录创建 RESTful API，理解请求参数获取和工具函数。',
    demo: N16ApiRoutes,
    code: N16Code,
    language: 'vue',
    principle:
      'server/api/ 下的文件自动注册为 API 路由，路径以 /api/ 开头。文件名后缀限定 HTTP 方法：.get.ts、.post.ts、.put.ts、.delete.ts。使用 h3 的工具函数处理请求：readBody 读取请求体、getQuery 获取查询参数、getRouterParam 获取路由参数、createError 抛出错误。',
    flow: [
      '创建 server/api/hello.ts，导出 defineEventHandler 处理函数。',
      'Nuxt 自动注册为 GET /api/hello 路由，返回值自动序列化为 JSON。',
      '使用 .get.ts/.post.ts 后缀限定方法，[id].ts 处理动态参数。',
    ],
    notes: [
      '不带方法后缀的文件处理所有 HTTP 方法。',
      'server/middleware/ 下的文件自动注册为服务端中间件，每个请求都经过。',
      'server/utils/ 下的函数自动导入，可在 API 路由和中间件中直接使用。',
    ],
    problem: '解决"如何在 Nuxt 中创建后端 API、如何获取请求参数和处理错误"的问题。',
  },
{
    id: 'N_17',
    title: '静态站点生成与混合渲染',
    navTitle: 'SSG/ISR',
    category: '部署',
    path: '/nuxt/n-17/ssg',
    summary: '掌握 SSG 构建流程、ISR 增量静态再生和混合渲染配置。',
    demo: N17SSG,
    code: N17Code,
    language: 'vue',
    principle:
      'SSG 通过 nuxt generate 在构建时渲染所有页面为静态 HTML，部署到 GitHub Pages 等纯静态托管。ISR（Incremental Static Regeneration）在静态缓存基础上定时重新生成，需服务器环境。混合渲染通过 routeRules 让不同路径使用不同策略：SSG 用于内容页、SSR 用于动态页、SPA 用于后台。',
    flow: [
      'nuxt generate 遍历预渲染路由，生成 .output/public/ 下的静态文件。',
      'routeRules 配置 swr 实现 ISR：首次渲染并缓存，过期后后台重新生成。',
      '不同路径配置不同渲染模式，实现最优性能和 SEO 的平衡。',
    ],
    notes: [
      'crawlLinks: true 让 Nitro 自动爬取页面链接发现更多预渲染路由。',
      'ISR 的 swr 时间单位为秒，设置过短会增加服务器负担。',
      '纯静态部署（GitHub Pages）只能用 SSG，不支持 ISR 和 SSR。',
    ],
    problem: '解决"如何生成静态站点、如何配置增量更新、不同页面能否用不同渲染模式"的问题。',
  },
{
    id: 'N_18',
    title: '运行时配置',
    navTitle: '运行时配置',
    category: '部署',
    path: '/nuxt/n-18/runtime-config',
    summary: '掌握 runtimeConfig 的公有/私有配置、环境变量映射和与 app.config.ts 的区别。',
    demo: N18RuntimeConfig,
    code: N18Code,
    language: 'vue',
    principle:
      'runtimeConfig 分为私有配置（仅服务端可访问，如密钥、数据库 URL）和公有配置（public 下的配置客户端也可访问，如 API Key、版本号）。环境变量通过 NUXT_ 前缀映射到配置项。app.config.ts 是编译时配置，不支持环境变量，适合主题色等不敏感的构建时常量。',
    flow: [
      '在 nuxt.config.ts 的 runtimeConfig 中定义私有和公有配置。',
      '.env 文件中的 NUXT_SECRET_KEY 映射到 config.secretKey。',
      '服务端用 useRuntimeConfig(event) 访问所有配置，客户端只能访问 public。',
    ],
    notes: [
      '绝不要把密钥放在 public 配置中，它会被打包到客户端代码。',
      'NUXT_PUBLIC_ 前缀的环境变量映射到 config.public 下的配置。',
      'runtimeConfig 的值在运行时确定，app.config.ts 的值在构建时确定。',
    ],
    problem: '解决"如何安全地管理密钥和配置、环境变量怎么映射、两种配置有何区别"的问题。',
  },
{
    id: 'N_19',
    title: '错误处理',
    navTitle: '错误处理',
    category: '工程实践',
    path: '/nuxt/n-19/error-handling',
    summary: '掌握 error.vue 自定义错误页面、错误钩子、API 错误处理和 createError/clearError。',
    demo: N19ErrorHandling,
    code: N19Code,
    language: 'vue',
    principle:
      'Nuxt 错误处理分为三层：error.vue 自定义错误页面（接收 statusCode 和 message）、vue:error 和 app:error 钩子捕获运行时错误、useFetch 的 error 和 $fetch 的 try/catch 处理 API 错误。createError 主动触发错误，clearError 清除错误状态并导航。SSR 中的错误通过 payload 传递到客户端。',
    flow: [
      '404/500 等路由级错误由 error.vue 渲染，展示友好的错误界面。',
      'Vue 组件运行时错误由 vue:error hook 捕获，可上报监控服务。',
      'API 请求错误通过 useFetch 的 error 属性或 $fetch 的 catch 处理。',
    ],
    notes: [
      'error.vue 不是普通页面组件，不能使用布局和插件提供的功能。',
      'clearError({ redirect: "/" }) 清除错误并导航，不传参则留在当前页。',
      '生产环境应接入错误监控服务（Sentry 等），不要只依赖控制台日志。',
    ],
    problem: '解决"Nuxt 各类错误如何捕获和展示、如何自定义错误页面"的问题。',
  },
{
    id: 'N_20',
    title: '模块系统与生态',
    navTitle: '模块生态',
    category: '工程实践',
    path: '/nuxt/n-20/modules',
    summary: '掌握常用 Nuxt 模块的安装配置、模块开发结构和生态使用指南。',
    demo: N20Modules,
    code: N20Code,
    language: 'vue',
    principle:
      'Nuxt 模块在构建时执行 setup 函数，用于扩展 Nuxt 能力：注册插件、添加组件、修改配置、钩入构建流程。模块通过 nuxt.config.ts 的 modules 数组安装，安装后自动完成配置。开发模块使用 defineNuxtModule 定义元数据和 setup 逻辑，运行时代码放在 runtime/ 目录。',
    flow: [
      'pnpm add @nuxtjs/xxx 安装模块，在 modules 数组中添加模块名。',
      '模块的 setup 函数在构建时执行，通过 Nuxt Kit API 注册能力。',
      '运行时代码（插件、composable、组件）放在模块的 runtime/ 目录。',
    ],
    notes: [
      'modules 数组顺序决定注册顺序，有依赖关系的模块需注意排序。',
      '官方模块列表在 nuxt.com/modules，优先选择官方或高星社区模块。',
      '模块配置通过 nuxt.config.ts 中与模块 configKey 同名的键设置。',
    ],
    problem: '解决"如何安装和配置 Nuxt 模块、如何开发自己的模块、生态中有哪些常用模块"的问题。',
  }
]
