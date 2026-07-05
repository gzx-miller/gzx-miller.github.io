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

const X01ProjectStructure = createDemo('X01ProjectStructure')
const X01Code = createCodeLoader('X01ProjectStructure.vue')
const X02FileRouting = createDemo('X02FileRouting')
const X02Code = createCodeLoader('X02FileRouting.vue')
const X03Layouts = createDemo('X03Layouts')
const X03Code = createCodeLoader('X03Layouts.vue')
const X04DynamicRoutes = createDemo('X04DynamicRoutes')
const X04Code = createCodeLoader('X04DynamicRoutes.vue')
const X05ServerComponents = createDemo('X05ServerComponents')
const X05Code = createCodeLoader('X05ServerComponents.vue')
const X06ClientComponents = createDemo('X06ClientComponents')
const X06Code = createCodeLoader('X06ClientComponents.vue')
const X07StaticDynamic = createDemo('X07StaticDynamic')
const X07Code = createCodeLoader('X07StaticDynamic.vue')
const X08StreamingSuspense = createDemo('X08StreamingSuspense')
const X08Code = createCodeLoader('X08StreamingSuspense.vue')
const X09DataFetching = createDemo('X09DataFetching')
const X09Code = createCodeLoader('X09DataFetching.vue')
const X10ServerActions = createDemo('X10ServerActions')
const X10Code = createCodeLoader('X10ServerActions.vue')
const X11RouteHandlers = createDemo('X11RouteHandlers')
const X11Code = createCodeLoader('X11RouteHandlers.vue')
const X12Caching = createDemo('X12Caching')
const X12Code = createCodeLoader('X12Caching.vue')
const X13ParallelRoutes = createDemo('X13ParallelRoutes')
const X13Code = createCodeLoader('X13ParallelRoutes.vue')
const X14InterceptingRoutes = createDemo('X14InterceptingRoutes')
const X14Code = createCodeLoader('X14InterceptingRoutes.vue')
const X15RouteGroups = createDemo('X15RouteGroups')
const X15Code = createCodeLoader('X15RouteGroups.vue')
const X16LoadingError = createDemo('X16LoadingError')
const X16Code = createCodeLoader('X16LoadingError.vue')
const X17NextImage = createDemo('X17NextImage')
const X17Code = createCodeLoader('X17NextImage.vue')
const X18NextFont = createDemo('X18NextFont')
const X18Code = createCodeLoader('X18NextFont.vue')
const X19NextLink = createDemo('X19NextLink')
const X19Code = createCodeLoader('X19NextLink.vue')
const X20Metadata = createDemo('X20Metadata')
const X20Code = createCodeLoader('X20Metadata.vue')
const X21Middleware = createDemo('X21Middleware')
const X21Code = createCodeLoader('X21Middleware.vue')
const X22EnvConfig = createDemo('X22EnvConfig')
const X22Code = createCodeLoader('X22EnvConfig.vue')
const X23I18n = createDemo('X23I18n')
const X23Code = createCodeLoader('X23I18n.vue')
const X24Deployment = createDemo('X24Deployment')
const X24Code = createCodeLoader('X24Deployment.vue')


export const lessons: Lesson[] = [
{
    id: 'X_1', title: '项目结构与 App Router 目录约定', navTitle: '项目结构', category: '起步',
    path: '/nextjs/x-1/project-structure', summary: '了解 Next.js App Router 的目录约定、app/ 核心目录和 next.config.js 配置。',
    demo: X01ProjectStructure, code: X01Code, language: 'vue',
    principle: 'Next.js 13+ 使用 App Router（app/ 目录）组织路由：page.tsx 定义页面 UI，layout.tsx 定义共享布局，特殊文件（loading/error/not-found）约定加载、错误和 404 状态。这套约定让路由、布局和状态处理都有文件可循。',
    flow: ['认识 app/ 目录的核心文件（page/layout/loading/error）。', '理解 public/ 静态资源与 next.config.js 配置。', '掌握 Pages Router 与 App Router 的区别。'],
    notes: ['app/layout.tsx 是必需的根布局，必须包含 <html> 和 <body>。', 'Pages Router（pages/）仍兼容，但推荐迁移到 App Router。', 'middleware.ts 必须放在项目根或 src/ 下，不能在 app/ 内。'],
    problem: '解决"Next.js 项目怎么组织代码、App Router 目录里每个文件是干什么用的"入门问题。',
  },
{
    id: 'X_2', title: '文件路由：目录即路由表', navTitle: '文件路由', category: '起步',
    path: '/nextjs/x-2/file-routing', summary: '掌握 App Router 文件路由映射规则，理解静态、动态、Catch-all、路由组和并行路由的命名约定。',
    demo: X02FileRouting, code: X02Code, language: 'vue',
    principle: 'App Router 基于文件系统自动生成路由：page.tsx 定义路由 UI，目录层级即 URL 层级。方括号表示动态参数，圆括号是路由组（不影响路径），@ 前缀是并行路由插槽，_ 前缀是私有文件夹（不参与路由）。',
    flow: ['理解 page.tsx 才是路由入口，目录只是路径段。', '掌握 [param]、[...slug]、(group)、@slot、_private 命名规则。', '对比 Nuxt 的文件路由，理解 Next.js 的差异。'],
    notes: ['只有 page.tsx 会生成路由，其他文件（layout/error 等）是辅助。', '[[...slug]] 是可选 Catch-all，零段也匹配。', '(folder) 路由组用于组织代码和切换布局，不改变 URL。'],
    problem: '解决"Next.js 文件名各种括号和符号代表什么、如何用文件结构表达复杂路由"的问题。',
  },
{
    id: 'X_3', title: '布局与模板：共享 UI 的层级', navTitle: '布局模板', category: '起步',
    path: '/nextjs/x-3/layouts', summary: '理解根布局、嵌套布局、路由组布局和 template 的区别与嵌套机制。',
    demo: X03Layouts, code: X03Code, language: 'vue',
    principle: 'layout.tsx 在导航时保持挂载状态不重新渲染，适合放 Header/Footer 等持久 UI；template.tsx 每次导航都重新创建，适合需要重置状态的场景。布局层层嵌套，子布局套在父布局内。',
    flow: ['认识根布局（必需）与嵌套布局的层级关系。', '理解 layout 和 template 的状态保持差异。', '掌握路由组布局实现同 URL 不同布局。'],
    notes: ['根布局必须包含 <html> 和 <body>，全局样式在这里引入。', 'layout 在导航时不重新挂载，useState 会保留；template 会重置。', '路由组 (group) 配合各自 layout 可实现同路径多套布局。'],
    problem: '解决"哪些 UI 应该放 layout、layout 之间如何嵌套、什么时候用 template"的问题。',
  },
{
    id: 'X_4', title: '动态路由与参数', navTitle: '动态路由', category: '起步',
    path: '/nextjs/x-4/dynamic-routes', summary: '掌握动态路由参数、Catch-all、可选 Catch-all，以及 params 与 searchParams 的使用。',
    demo: X04DynamicRoutes, code: X04Code, language: 'vue',
    principle: '动态路由用方括号 [id] 捕获单段，[...slug] 捕获多段（数组），[[...slug]] 可选捕获。page 组件通过 params prop 读取路径参数，通过 searchParams 读取 URL 查询串。Next.js 15+ 中两者都是 Promise，需 await。',
    flow: ['掌握 [param] 单段与 [...slug] 多段动态路由。', '理解 params（路径段）与 searchParams（查询串）的区别。', '注意 Next.js 15+ params/searchParams 变为 Promise。'],
    notes: ['Catch-all params.slug 是数组，单段 params.id 是字符串。', 'searchParams 在服务端组件中会触发动态渲染。', 'generateStaticParams() 可预生成动态路由的静态页面。'],
    problem: '解决"如何用文件名表达带参数的 URL、在组件里怎么拿到路由参数"的问题。',
  },
{
    id: 'X_5', title: 'Server Components 服务端组件', navTitle: 'Server组件', category: '渲染',
    path: '/nextjs/x-5/server-components', summary: '理解 Server Component 的运行环境、能力边界与默认行为。',
    demo: X05ServerComponents, code: X05Code, language: 'vue',
    principle: 'App Router 中所有组件默认是 Server Component，在服务端运行，不打包进前端 bundle，可直接访问数据库、文件系统和密钥，但不能用 useState/useEffect 等客户端 Hook 和事件处理。适合数据获取和静态渲染。',
    flow: ['认识 Server Component 的服务端运行特性。', '对比 Server 与 Client Component 的能力边界。', '理解组合规则：Server 可导入 Client，反之只能传 children。'],
    notes: ['Server Component 不能用 onClick、useState、useEffect。', '直接 await 数据获取，无需 useEffect + 状态管理。', '把 "use client" 尽量下推，让更多组件留在服务端减小 bundle。'],
    problem: '解决"Server Component 到底能做什么、不能做什么、和 Client Component 怎么配合"的问题。',
  },
{
    id: 'X_6', title: 'Client Components 客户端组件', navTitle: 'Client组件', category: '渲染',
    path: '/nextjs/x-6/client-components', summary: '掌握 "use client" 声明时机、客户端 Hooks 限制与 Server/Client 组件组合模式。',
    demo: X06ClientComponents, code: X06Code, language: 'vue',
    principle: '需要交互（事件、状态、生命周期、浏览器 API）的组件必须用 "use client" 声明为 Client Component。声明会向下传递：导入的子组件也变成客户端。Server 获取数据后可通过 props 传给 Client 组件接管交互。',
    flow: ['判断何时需要 "use client"（事件/状态/生命周期/浏览器 API）。', '掌握 Server 获取数据 → props 传 Client 的组合模式。', '理解 "use client" 边界向下传递的特性。'],
    notes: ['所有 React Hooks（useState/useEffect 等）只能在 Client Component 中使用。', 'Client Component 仍会在服务端预渲染 HTML，再在客户端 hydrate。', '尽量让交互组件小而独立，外层保持 Server。'],
    problem: '解决"什么组件要加 use client、Server 和 Client 组件如何组合传数据"的问题。',
  },
{
    id: 'X_7', title: '静态与动态渲染', navTitle: '静态动态', category: '渲染',
    path: '/nextjs/x-7/static-dynamic', summary: '理解 Next.js 的静态渲染（构建时）与动态渲染（请求时）触发条件和缓存行为。',
    demo: X07StaticDynamic, code: X07Code, language: 'vue',
    principle: 'Next.js 默认静态渲染（构建时生成 HTML），一旦组件树使用了动态函数（cookies/headers/searchParams）或 no-store fetch，整个路由转为动态渲染（每次请求执行）。静态路由可被 CDN 缓存，动态路由按需执行。',
    flow: ['理解静态（构建时）与动态（请求时）渲染的时机差异。', '掌握触发动态的信号：cookies/headers/searchParams/no-store。', '用 generateStaticParams 预生成动态路由的静态页。'],
    notes: ['只要路由树中任一组件用了动态函数，整条路由变动态。', 'fetch 默认 force-cache（静态），no-store 触发动态。', 'Partial Prerendering（PPR）实验特性允许静态壳 + 动态洞。'],
    problem: '解决"页面是构建时生成还是请求时执行、什么操作会让页面变动态"的问题。',
  },
{
    id: 'X_8', title: 'Streaming 与 Suspense 流式渲染', navTitle: '流式渲染', category: '渲染',
    path: '/nextjs/x-8/streaming', summary: '用 Suspense 边界实现流式渲染，让慢组件不阻塞首屏，渐进式展示内容。',
    demo: X08StreamingSuspense, code: X08Code, language: 'vue',
    principle: 'Streaming 把服务端渲染的 HTML 分块发送：遇到 Suspense 边界先返回 fallback，慢组件数据就绪后流式替换。用户无需等最慢组件就能看到骨架，loading.tsx 是路由级 Suspense 的语法糖。',
    flow: ['理解流式渲染：先返回 fallback，数据就绪后流式替换。', '用 <Suspense> 包裹慢组件，或用 loading.tsx 自动包裹。', '多个 Suspense 可并行流式，互不阻塞。'],
    notes: ['loading.tsx 等价于路由级 <Suspense>，自动包裹 page。', '流式渲染需要配合 async Server Component + await。', '首屏 LCP 优化：把慢组件用 Suspense 隔离，快速部分先出。'],
    problem: '解决"页面里有慢请求，用户要等很久才看到内容、如何渐进式展示"的问题。',
  },
{
    id: 'X_9', title: '数据获取与 fetch 缓存', navTitle: '数据获取', category: '数据',
    path: '/nextjs/x-9/data-fetching', summary: '掌握 Server Component 中直接 await fetch 的模式，以及 Next.js 扩展的缓存选项。',
    demo: X09DataFetching, code: X09Code, language: 'vue',
    principle: 'Next.js 扩展了原生 fetch：默认 force-cache（构建时缓存）、no-store（不缓存）、revalidate（ISR 定时刷新）、tags（按标签缓存可主动失效）。同渲染周期内相同 URL 自动去重，Server Component 直接 await 即可。',
    flow: ['在 Server Component 中直接 await fetch（无需 useEffect）。', '掌握 force-cache/no-store/revalidate/tags 四种缓存策略。', '用 revalidateTag/revalidatePath 主动失效缓存。'],
    notes: ['fetch 默认缓存（force-cache），no-store 才不缓存。', 'Request Memoization：同一次渲染内相同 fetch 只执行一次。', '缓存存储在服务端跨请求共享，不是浏览器缓存。'],
    problem: '解决"在 Next.js 里怎么请求数据、fetch 的缓存怎么控制"的问题。',
  },
{
    id: 'X_10', title: 'Server Actions 服务端操作', navTitle: 'Server Actions', category: '数据',
    path: '/nextjs/x-10/server-actions', summary: '用 "use server" 定义服务端函数，表单直接提交到服务端，无需手写 API。',
    demo: X10ServerActions, code: X10Code, language: 'vue',
    principle: 'Server Action 用 "use server" 声明，函数在服务端运行，前端通过 POST 调用。配合 form action 属性原生支持，自动处理 CSRF。执行后用 revalidatePath/revalidateTag 刷新缓存，页面自动更新，无需手动 refetch。',
    flow: ['用 "use server" 定义服务端函数。', '通过 form action 或编程式调用触发。', '执行后 revalidatePath 刷新缓存，页面自动更新。'],
    notes: ['Server Action 自动 CSRF 防护，参数自动序列化。', 'useFormState 跟踪返回值，useFormStatus 跟踪提交状态。', 'useOptimistic 实现乐观更新，提升交互体验。'],
    problem: '解决"表单提交/数据变更需要写 API 吗、怎么在 Next.js 里做增删改"的问题。',
  },
{
    id: 'X_11', title: 'Route Handlers API 路由', navTitle: 'API路由', category: '数据',
    path: '/nextjs/x-11/route-handlers', summary: '用 route.ts 定义 REST API，导出 GET/POST 等方法处理 HTTP 请求。',
    demo: X11RouteHandlers, code: X11Code, language: 'vue',
    principle: 'Route Handler 在 app/api/ 下用 route.ts 定义，每个导出的 HTTP 方法（GET/POST/PUT/DELETE）对应一个处理函数，返回 NextResponse。适合构建 REST API、Webhook、第三方 API 代理，可运行在 Node 或 Edge Runtime。',
    flow: ['在 app/api/xxx/route.ts 导出 HTTP 方法。', '用 NextResponse.json 返回 JSON。', '通过 params 获取动态路由参数。'],
    notes: ['文件名固定为 route.ts，目录层级即 API 路径。', 'GET 可缓存，POST/PUT/DELETE 默认不缓存。', '与 Server Action 区别：Route Handler 是 REST API，Server Action 是表单提交。'],
    problem: '解决"Next.js 怎么写后端 API、Route Handler 和 Server Action 该用哪个"的问题。',
  },
{
    id: 'X_12', title: '缓存与重新验证', navTitle: '缓存策略', category: '数据',
    path: '/nextjs/x-12/caching', summary: '理解 Data Cache、Full Route Cache、Router Cache、Request Memoization 四层缓存与失效机制。',
    demo: X12Caching, code: X12Code, language: 'vue',
    principle: 'Next.js 有四层缓存：Request Memoization（单次请求去重）、Data Cache（fetch 结果持久缓存）、Full Route Cache（路由 HTML/RSC 缓存）、Router Cache（客户端已访问路由缓存）。失效 Data Cache 会级联刷新上层。',
    flow: ['认识四层缓存的作用范围与生命周期。', '掌握 revalidatePath/revalidateTag 主动失效。', '理解定时 revalidate（ISR）与 no-store 跳过缓存。'],
    notes: ['Data Cache 是基础，失效它会级联刷新 Full Route 和 Router Cache。', 'Router Cache 在客户端会话内有效（30s~5min），router.refresh() 可清除。', '路由级可用 export const revalidate / dynamic 配置。'],
    problem: '解决"Next.js 到底有几层缓存、数据更新后怎么让缓存失效"的问题。',
  },
{
    id: 'X_13', title: 'Parallel Routes 并行路由', navTitle: '并行路由', category: '路由进阶',
    path: '/nextjs/x-13/parallel-routes', summary: '用 @ 插槽在布局中并行渲染多个独立子路由，实现仪表盘等复杂布局。',
    demo: X13ParallelRoutes, code: X13Code, language: 'vue',
    principle: 'Parallel Routes 用 @ 前缀目录定义插槽，插槽作为 props 传入 layout，可并行渲染多个独立子路由。每个插槽有独立的加载和错误状态，default.tsx 提供未匹配时的默认内容，适合仪表盘多面板布局。',
    flow: ['用 @folder 定义插槽，在 layout 中接收对应 prop。', '理解 default.tsx 在插槽未匹配时的兜底作用。', '配合 Intercepting Routes 实现模态框。'],
    notes: ['插槽名即 prop 名：@sidebar → layout 的 sidebar prop。', '每个插槽可独立流式加载（各自的 loading.tsx）。', '插槽不参与 URL 路径，只影响布局渲染。'],
    problem: '解决"一个布局里要同时展示多个独立数据块、怎么并行渲染"的问题。',
  },
{
    id: 'X_14', title: 'Intercepting Routes 拦截路由', navTitle: '拦截路由', category: '路由进阶',
    path: '/nextjs/x-14/intercepting-routes', summary: '用 (.) (..) (...) 拦截路由，实现客户端导航弹窗、直接访问全屏的体验。',
    demo: X14InterceptingRoutes, code: X14Code, language: 'vue',
    principle: 'Intercepting Routes 用 (.) (..) (...) 前缀拦截其他路由：客户端导航时命中拦截版（如弹窗），直接访问 URL 时命中真实版（如全屏）。同一 URL 两种体验，既流畅又可分享，常配合 Parallel Routes 的 Modal 插槽。',
    flow: ['理解 (.) (..) (...) 拦截符号的层级含义。', '在子目录创建拦截版页面（如弹窗）。', '配合 Parallel Routes Modal 插槽实现弹窗。'],
    notes: ['(.) 同级、(..) 上级、(...) 根级拦截。', '拦截路由的 URL 与真实路由相同，刷新命中真实版。', '浏览器后退回到来源页，弹窗自动关闭。'],
    problem: '解决"点击图片想弹窗展示、直接访问又要是全屏页、怎么兼顾"的问题。',
  },
{
    id: 'X_15', title: 'Route Groups 与私有文件夹', navTitle: '路由组', category: '路由进阶',
    path: '/nextjs/x-15/route-groups', summary: '用 (group) 路由组组织代码、切换布局，用 _folder 私有文件夹存放不参与路由的内容。',
    demo: X15RouteGroups, code: X15Code, language: 'vue',
    principle: 'Route Groups 用 (folder) 圆括号目录组织代码而不影响 URL，可为一组路由指定独立 layout；私有文件夹用 _folder 下划线前缀，完全不参与路由，适合存放内部组件和工具函数。',
    flow: ['用 (group) 组织代码、切换布局且不影响 URL。', '用 _folder 存放不参与路由的内部组件/工具。', '区分 [param] 动态、@slot 并行、(group) 路由组、_private 私有。'],
    notes: ['路由组可让同一 URL 有不同布局（如营销页 vs 后台）。', '私有文件夹内的 page.tsx 不会生成路由。', '路由组不能与同名路由组冲突（会报 URL 冲突错误）。'],
    problem: '解决"怎么给一组路由单独布局而不改 URL、内部组件怎么放才不会误生成路由"的问题。',
  },
{
    id: 'X_16', title: 'Loading 与 Error UI', navTitle: '加载错误', category: '路由进阶',
    path: '/nextjs/x-16/loading-error', summary: '用 loading.tsx / error.tsx / not-found.tsx / global-error.tsx 约定加载、错误和 404 状态。',
    demo: X16LoadingError, code: X16Code, language: 'vue',
    principle: 'loading.tsx 自动创建 Suspense 边界包裹 page；error.tsx 捕获子组件错误（必须是 Client Component，提供 reset 重试）；not-found.tsx 处理 404；global-error.tsx 是根 layout 出错时的兜底，需自带 html/body。错误就近匹配、向上冒泡。',
    flow: ['用 loading.tsx 自动包裹路由级 Suspense。', '用 error.tsx 捕获错误并提供 reset 重试。', '理解 global-error 兜底根 layout 错误。'],
    notes: ['error.tsx 必须是 Client Component（需要 reset 交互）。', 'error.tsx 不捕获同级 layout 的错误，需 global-error.tsx。', 'not-found() 函数可主动触发 404 页面。'],
    problem: '解决"页面加载中、出错、404 时分别该显示什么、怎么用文件约定处理"的问题。',
  },
{
    id: 'X_17', title: 'next/image 图片优化', navTitle: '图片优化', category: '优化',
    path: '/nextjs/x-17/next-image', summary: '用 next/Image 自动优化图片格式、尺寸、懒加载，消除布局抖动。',
    demo: X17NextImage, code: X17Code, language: 'vue',
    principle: 'next/image 自动按设备生成合适尺寸的 WebP/AVIF，默认懒加载，通过 width/height 或 fill 防止 CLS。本地图片需 import（自带尺寸），远程图片需在 next.config.js 配置域名白名单。priority 属性用于首屏 LCP 图片预加载。',
    flow: ['本地图片用 import 引入，远程图片配置域名白名单。', '指定 width/height 或用 fill 防止布局抖动。', '首屏图片加 priority 预加载。'],
    notes: ['sizes 属性配合 srcset 生成响应式多档图片。', 'placeholder="blur" 生成低质量模糊占位符。', '远程图片不配域名会报错，需 remotePatterns。'],
    problem: '解决"图片加载慢、格式大、会抖动、怎么自动优化"的问题。',
  },
{
    id: 'X_18', title: 'next/font 字体优化', navTitle: '字体优化', category: '优化',
    path: '/nextjs/x-18/next-font', summary: '用 next/font 自托管字体，消除布局抖动，避免第三方 CDN 请求。',
    demo: X18NextFont, code: X18Code, language: 'vue',
    principle: 'next/font 在构建时下载字体并自托管，无第三方请求，用 size-adjust 消除 FOUT/FOIT 布局抖动。支持 Google Fonts 和本地字体，生成 CSS 变量方便引用，display: swap 先用 fallback 再平滑切换。',
    flow: ['用 next/font/google 或 next/font/local 加载字体。', '通过 variable 生成 CSS 变量。', '在 globals.css 中引用变量。'],
    notes: ['字体文件构建时下载自托管，不向 Google 发请求（隐私友好）。', 'display: swap 先显示 fallback 再切换，避免文字不可见。', '自动 subset 减小字体文件体积。'],
    problem: '解决"用 Google 字体向第三方泄露用户信息、字体切换导致布局抖动"的问题。',
  },
{
    id: 'X_19', title: 'next/link 与导航', navTitle: '链接导航', category: '优化',
    path: '/nextjs/x-19/next-link', summary: '掌握 Link 客户端导航、useRouter 编程式跳转、redirect 服务端重定向等导航 API。',
    demo: X19NextLink, code: X19Code, language: 'vue',
    principle: 'Link 实现客户端导航并自动预取目标路由 RSC payload；useRouter 提供 push/replace/back/refresh 编程式导航；redirect 在服务端重定向。App Router 的导航 API 从 next/navigation 导入（非 next/router）。',
    flow: ['用 Link 实现客户端导航 + 自动预取。', '用 useRouter 编程式跳转（需 Client Component）。', '用 redirect 服务端重定向。'],
    notes: ['Link 默认 prefetch：静态路由进视口即预取，动态路由点击时预取。', 'usePathname/useSearchParams 从 next/navigation 导入。', 'redirect 在 Server Component / Server Action / Route Handler 中可用。'],
    problem: '解决"怎么在 Next.js 里做页面跳转、编程式导航和服务端重定向"的问题。',
  },
{
    id: 'X_20', title: 'Metadata 与 SEO', navTitle: 'Metadata', category: '优化',
    path: '/nextjs/x-20/metadata', summary: '用 Metadata API（静态 metadata + 动态 generateMetadata）管理 title、description、OG 等 SEO 元信息。',
    demo: X20Metadata, code: X20Code, language: 'vue',
    principle: 'App Router 用 Metadata API 取代 Pages Router 的 next/head：导出 metadata 对象（静态）或 generateMetadata 函数（动态）。还支持文件约定（favicon/icon/opengraph-image）和 sitemap.ts/robots.ts 动态生成，子页面 metadata 覆盖父级。',
    flow: ['用 metadata 对象设置静态 title/description。', '用 generateMetadata 按参数动态生成。', '用 sitemap.ts/robots.ts 动态生成站点地图和爬虫规则。'],
    notes: ['title.template 让子页标题自动拼接父模板（如 "%s | 小松鼠"）。', 'opengraph-image.tsx 用 ImageResponse 动态生成 OG 图。', 'metadata 自动去重，子页面同名字段覆盖父级。'],
    problem: '解决"App Router 怎么管理 SEO 元信息、动态页面怎么设置 title"的问题。',
  },
{
    id: 'X_21', title: 'Middleware 中间件', navTitle: '中间件', category: '工程',
    path: '/nextjs/x-21/middleware', summary: '用 middleware.ts 在请求到达路由前执行认证、重定向、A/B 测试等逻辑。',
    demo: X21Middleware, code: X21Code, language: 'vue',
    principle: 'Middleware 在每个请求、缓存前运行（Edge Runtime），可重写、重定向、改请求头/响应头。文件放在项目根或 src/ 下的 middleware.ts。用 matcher 限定匹配路径提升性能，适合认证鉴权、i18n、A/B 测试、灰度发布。',
    flow: ['在项目根创建 middleware.ts。', '用 NextResponse.redirect/next 重定向或放行。', '用 matcher 限定执行路径。'],
    notes: ['Middleware 运行在 Edge Runtime，不能用 Node API，依赖需兼容 Edge。', 'matcher 排除静态资源避免无谓执行。', '可注入请求头供下游 Server Component 读取。'],
    problem: '解决"如何在路由执行前统一做鉴权、重定向、A/B 测试"的问题。',
  },
{
    id: 'X_22', title: '环境变量与 next.config', navTitle: '环境配置', category: '工程',
    path: '/nextjs/x-22/env-config', summary: '掌握 NEXT_PUBLIC_ 前缀规则、env 文件优先级和 next.config.js 核心配置项。',
    demo: X22EnvConfig, code: X22Code, language: 'vue',
    principle: '环境变量加 NEXT_PUBLIC_ 前缀则客户端可见（打包进 bundle），无前缀仅服务端可用。env 文件优先级：.env.local > .env.[环境] > .env。next.config.js 集中配置 reactStrictMode、images、rewrites、redirects、output 等。',
    flow: ['用 NEXT_PUBLIC_ 前缀区分客户端/服务端环境变量。', '理解 .env.local 覆盖优先级。', '在 next.config.js 配置图片域名、重写、导出模式。'],
    notes: ['密钥绝不加 NEXT_PUBLIC_，否则泄露到前端 bundle。', '.env.local 被 gitignore，放本地敏感配置。', 'output: "standalone" 生成独立部署包，"export" 纯静态导出。'],
    problem: '解决"环境变量怎么分客户端和服务端、next.config.js 能配什么"的问题。',
  },
{
    id: 'X_23', title: '国际化 i18n', navTitle: '国际化', category: '工程',
    path: '/nextjs/x-23/i18n', summary: '用 App Router 的 [lang] 动态路由 + middleware 语言检测实现多语言站点。',
    demo: X23I18n, code: X23Code, language: 'vue',
    principle: 'App Router 推荐用 [lang] 动态路由实现 i18n：每种语言独立 URL（SEO 友好），middleware 根据 Accept-Language 自动检测重定向，字典按需 import 加载。配合 hreflang 标签和 Intl API 处理复数/日期格式。',
    flow: ['用 [lang] 动态路由为每种语言生成独立 URL。', 'middleware 根据 Accept-Language 自动重定向。', '按需 import 字典，用 Context 下发翻译函数。'],
    notes: ['每种语言独立 URL 利于 SEO，配合 hreflang 标签。', '字典按需 import 避免全量打包。', 'next-intl 是社区流行的 App Router i18n 方案。'],
    problem: '解决"App Router 怎么做多语言、怎么自动检测用户语言"的问题。',
  },
{
    id: 'X_24', title: '部署与 Vercel', navTitle: '部署', category: '工程',
    path: '/nextjs/x-24/deployment', summary: '掌握 Vercel、Node 自托管、Docker、静态导出四种部署目标的特点与配置。',
    demo: X24Deployment, code: X24Code, language: 'vue',
    principle: 'Next.js 支持多种部署目标：Vercel（全托管零配置）、Node Server（output: standalone 自托管）、Docker（基于 standalone 构建镜像）、Static Export（output: export 纯静态）。静态导出有限制：不支持 Server Actions/Middleware/动态图片优化。',
    flow: ['根据需求选择部署目标（Vercel/Node/Docker/静态）。', '配置 output 模式和环境变量。', '设置 CDN、域名、HTTPS 和监控。'],
    notes: ['Vercel 是官方平台，零配置支持所有特性。', 'standalone 不含 node_modules，需 COPY 静态资源。', '静态导出不支持 Server Actions、Middleware、Image Optimization。'],
    problem: '解决"Next.js 项目能部署到哪里、各部署方式有什么限制"的问题。',
  }
]
