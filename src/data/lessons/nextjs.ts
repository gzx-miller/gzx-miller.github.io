import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import X01ProjectStructure from '../../demos/X01ProjectStructureArticle.vue'
import X02FileRouting from '../../demos/X02FileRoutingArticle.vue'
import X03Layouts from '../../demos/X03LayoutsArticle.vue'
import X04DynamicRoutes from '../../demos/X04DynamicRoutesArticle.vue'
import X05ServerComponents from '../../demos/X05ServerComponentsArticle.vue'
import X06ClientComponents from '../../demos/X06ClientComponentsArticle.vue'
import X07StaticDynamic from '../../demos/X07StaticDynamicArticle.vue'
import X08StreamingSuspense from '../../demos/X08StreamingSuspenseArticle.vue'
import X09DataFetching from '../../demos/X09DataFetchingArticle.vue'
import X10ServerActions from '../../demos/X10ServerActionsArticle.vue'
import X11RouteHandlers from '../../demos/X11RouteHandlersArticle.vue'
import X12Caching from '../../demos/X12CachingArticle.vue'
import X13ParallelRoutes from '../../demos/X13ParallelRoutesArticle.vue'
import X14InterceptingRoutes from '../../demos/X14InterceptingRoutesArticle.vue'
import X15RouteGroups from '../../demos/X15RouteGroupsArticle.vue'
import X16LoadingError from '../../demos/X16LoadingErrorArticle.vue'
import X17NextImage from '../../demos/X17NextImageArticle.vue'
import X18NextFont from '../../demos/X18NextFontArticle.vue'
import X19NextLink from '../../demos/X19NextLinkArticle.vue'
import X20Metadata from '../../demos/X20MetadataArticle.vue'
import X21Middleware from '../../demos/X21MiddlewareArticle.vue'
import X22EnvConfig from '../../demos/X22EnvConfigArticle.vue'
import X23I18n from '../../demos/X23I18nArticle.vue'
import X24Deployment from '../../demos/X24DeploymentArticle.vue'
// 该分类专属的演示样式，随分类数据一起按需加载
import '../../styles/category-nextjs.css'

const nextjsCodeModules = import.meta.glob<string>('../../demos/nextjs-code/*', { query: '?raw', import: 'default' })

function createCodeLoader(path: string) {
  const loader = nextjsCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const X1Code = createCodeLoader('nextjs-code/X1Code.jsx.txt')
const X2Code = createCodeLoader('nextjs-code/X2Code.jsx.txt')
const X3Code = createCodeLoader('nextjs-code/X3Code.jsx.txt')
const X4Code = createCodeLoader('nextjs-code/X4Code.jsx.txt')
const X5Code = createCodeLoader('nextjs-code/X5Code.jsx.txt')
const X6Code = createCodeLoader('nextjs-code/X6Code.jsx.txt')
const X7Code = createCodeLoader('nextjs-code/X7Code.jsx.txt')
const X8Code = createCodeLoader('nextjs-code/X8Code.jsx.txt')
const X9Code = createCodeLoader('nextjs-code/X9Code.jsx.txt')
const X10Code = createCodeLoader('nextjs-code/X10Code.jsx.txt')
const X11Code = createCodeLoader('nextjs-code/X11Code.jsx.txt')
const X12Code = createCodeLoader('nextjs-code/X12Code.jsx.txt')
const X13Code = createCodeLoader('nextjs-code/X13Code.jsx.txt')
const X14Code = createCodeLoader('nextjs-code/X14Code.jsx.txt')
const X15Code = createCodeLoader('nextjs-code/X15Code.jsx.txt')
const X16Code = createCodeLoader('nextjs-code/X16Code.jsx.txt')
const X17Code = createCodeLoader('nextjs-code/X17Code.jsx.txt')
const X18Code = createCodeLoader('nextjs-code/X18Code.jsx.txt')
const X19Code = createCodeLoader('nextjs-code/X19Code.jsx.txt')
const X20Code = createCodeLoader('nextjs-code/X20Code.jsx.txt')
const X21Code = createCodeLoader('nextjs-code/X21Code.jsx.txt')
const X22Code = createCodeLoader('nextjs-code/X22Code.jsx.txt')
const X23Code = createCodeLoader('nextjs-code/X23Code.jsx.txt')
const X24Code = createCodeLoader('nextjs-code/X24Code.jsx.txt')

export const lessons: Lesson[] = [
  {
    id: 'X_1', title: '项目结构与 App Router 目录约定', navTitle: '项目结构', category: '起步',
    path: '/nextjs/x-1/project-structure', summary: '了解 App Router 的目录约定、app/ 核心文件的职责，以及 public/ 与 next.config.js 在项目中的作用。',
    demo: null,
    demoComponent: X01ProjectStructure,
    code: X1Code,
    language: 'jsx',
    principle: 'Next.js App Router 以 app/ 目录组织路由：page.tsx 是唯一的路由入口，layout.tsx 定义共享布局，loading/error/not-found 分别约定加载、错误与 404 状态文件，目录层级即为 URL 层级。',
    flow: ['在 app/ 下创建 layout.tsx（含 html/body）与 page.tsx，让根路径生效。', '在 app/ 新建子目录与 page.tsx，观察目录层级如何映射为 URL。', '添加 loading.tsx 与 error.tsx，切换路由时查看加载与错误状态如何自动接管。', '在地址栏切换 URL，确认目录层级与地址栏路径一一对应。'],
    notes: ['根 layout.tsx 是必需的，必须包含 <html> 和 <body> 标签。', '只有 page.tsx 参与路由生成，其余文件是布局或状态约定。', 'pages/ 目录仍可运行但已逐步淘汰，新项目统一使用 app/。', '迁移期间 pages/ 与 app/ 可并存，但同一路径不能同时由两处定义。'],
    problem: '解决"Next.js 项目怎么组织代码、App Router 目录里每个文件是干什么用的"入门问题。',
  },
  {
    id: 'X_2', title: '文件路由：目录即路由表', navTitle: '文件路由', category: '起步',
    path: '/nextjs/x-2/file-routing', summary: '掌握 App Router 文件路由映射规则，理解静态、动态、Catch-all、路由组和并行路由的命名约定。',
    demo: null,
    demoComponent: X02FileRouting,
    code: X2Code,
    language: 'jsx',
    principle: 'App Router 基于文件系统生成路由：page.tsx 定义页面 UI，目录层级即 URL 层级。方括号 [param] 表示动态参数，[...slug] 捕获多段，[[...slug]] 可选捕获；圆括号 (group) 是路由组（不影响路径），@ 前缀是并行路由插槽，_ 前缀是私有文件夹（不参与路由）。',
    flow: ['创建 app/blog/page.tsx 与 app/blog/[slug]/page.tsx，对比静态与动态路由。', '用 [...slug] 与 [[...slug]] 分别创建 Catch-all 与可选 Catch-all 路由。', '用 (group) 与 _folder 验证路由组不改 URL、私有文件夹不生成路由。', '在地址栏逐一访问各条路由，核对生成结果与预期是否一致。'],
    notes: ['page.tsx 之外的文件（layout/loading/error 等）不直接生成路由。', '[[...slug]] 是可选 Catch-all，零个路径段也会匹配。', '(group) 只影响代码组织与布局，不改变最终 URL。', '动态段名要与页面读取的 params 字段一致，改目录名后记得同步组件代码。'],
    problem: '解决"Next.js 文件名各种括号和符号代表什么、如何用文件结构表达复杂路由"的问题。',
  },
  {
    id: 'X_3', title: '布局与模板：共享 UI 的层级', navTitle: '布局模板', category: '起步',
    path: '/nextjs/x-3/layouts', summary: '理解根布局、嵌套布局、路由组布局和 template 的区别与嵌套机制。',
    demo: null,
    demoComponent: X03Layouts,
    code: X3Code,
    language: 'jsx',
    principle: 'layout.tsx 在导航时保持挂载、状态不重置，适合放 Header/Footer 等持久 UI；template.tsx 每次导航都重新创建实例、状态会重置。布局按目录层层嵌套，子布局包裹在父布局内。需要进入动画或每次重置的副作用时选 template，其余场景默认用 layout。',
    flow: ['在 app/layout.tsx 写全局头部/底部，在 app/dashboard/layout.tsx 写嵌套侧边栏。', '在 dashboard 子页面间导航，观察嵌套布局保持挂载、状态不重置。', '用 template.tsx 对比导航时状态重置的差异，用路由组为不同路径套不同布局。', '给子布局加导航链接，验证父布局里的输入框状态在切换时不会丢失。'],
    notes: ['根布局必须含 <html> 和 <body>，全局字体与样式在此引入。', 'layout 在导航时不重新挂载，useState 等状态会保留；template 会重置。', '不同路由组可各自定义 layout，实现同路径多套外壳。', 'layout.tsx 中避免放需要按页面重跑的数据请求，此类逻辑应放在 page 或 template。'],
    problem: '解决"哪些 UI 应该放 layout、layout 之间如何嵌套、什么时候用 template"的问题。',
  },
  {
    id: 'X_4', title: '动态路由与参数', navTitle: '动态路由', category: '起步',
    path: '/nextjs/x-4/dynamic-routes', summary: '掌握动态路由参数、Catch-all、可选 Catch-all，以及 params 与 searchParams 的使用。',
    demo: null,
    demoComponent: X04DynamicRoutes,
    code: X4Code,
    language: 'jsx',
    principle: '动态路由用方括号 [id] 捕获单段，[...slug] 捕获多段（得到数组），[[...slug]] 可选捕获。page 组件通过 params 读取路径参数、通过 searchParams 读取查询串；Next.js 15+ 二者都是 Promise，需 await 解包。generateStaticParams 可在构建期预生成动态路由的静态页。',
    flow: ['用 [id] 捕获单段参数、[...slug] 捕获多段、[[...slug]] 声明可选捕获。', '在页面组件中读取 params 与 searchParams，分别打印路径段与查询串。', '在 Next.js 15+ 中用 await 解包 params/searchParams，并用 generateStaticParams 预生成页面。', '核对构建产物中的页面数量是否与 generateStaticParams 返回的列表一致。'],
    notes: ['Catch-all 的 params.slug 是数组，单段 params.id 是字符串。', '在 Server Component 中读取 searchParams 会使路由转为动态渲染。', 'generateStaticParams() 在构建时预生成动态路由的静态页面。', 'searchParams 的值可能是字符串或数组，读取前先规范化为单值再使用。'],
    problem: '解决"如何用文件名表达带参数的 URL、在组件里怎么拿到路由参数"的问题。',
  },
  {
    id: 'X_5', title: 'Server Components 服务端组件', navTitle: 'Server组件', category: '渲染',
    path: '/nextjs/x-5/server-components', summary: '理解 Server Component 的运行环境、能力边界与默认行为。',
    demo: null,
    demoComponent: X05ServerComponents,
    code: X5Code,
    language: 'jsx',
    principle: 'App Router 中组件默认是 Server Component，在服务端运行、不进入前端 bundle，可直接访问数据库、文件系统与密钥，并能直接 await 获取数据；但不能使用 useState/useEffect 等客户端 Hook、事件处理器或浏览器 API。',
    flow: ['在 app/ 页面组件里直接 async/await 访问数据库或文件系统获取数据。', '在 Server Component 中试写 useState 或 onClick，观察报错确认能力边界。', '把需要交互的部分拆成 Client 组件，用 props 接收服务端数据完成组合。', '用 console.log 观察输出来源（终端还是浏览器），验证组件运行位置。'],
    notes: ['Server Component 不能写 onClick、useState、useEffect。', '数据直接用 async/await 获取，无需 useEffect 加状态。', '把 "use client" 尽量下推到叶子组件，让更多代码留在服务端。', 'Server Component 代码不进入客户端 bundle，敏感逻辑与密钥应留在这一层。'],
    problem: '解决"Server Component 到底能做什么、不能做什么、和 Client Component 怎么配合"的问题。',
  },
  {
    id: 'X_6', title: 'Client Components 客户端组件', navTitle: 'Client组件', category: '渲染',
    path: '/nextjs/x-6/client-components', summary: '掌握 "use client" 声明时机、客户端 Hooks 限制与 Server/Client 组件组合模式。',
    demo: null,
    demoComponent: X06ClientComponents,
    code: X6Code,
    language: 'jsx',
    principle: '需要交互的组件（事件、状态、生命周期、浏览器 API）必须在文件顶部加 "use client" 声明为 Client Component；该声明会向下传递，导入的子组件也变成 Client。Server 组件可获取数据后通过 props 传给 Client 组件接管交互。',
    flow: ['在需要事件或状态的组件文件顶部添加 "use client" 声明。', '由 Server Component 获取数据，通过 props 传给 Client 组件接管交互。', '把 "use client" 边界尽量下推到叶子组件，观察客户端 bundle 的变化。', '构建后对比客户端 bundle 体积，验证边界下推带来的收益。'],
    notes: ['useState/useEffect 等客户端 Hook 只能在 Client Component 中使用。', 'Client Component 仍会在服务端先渲染 HTML，再在客户端水合（hydrate）。', '让交互组件小而独立，把更多 UI 留在服务端以减小 bundle。', '跨边界传 props 必须可序列化；函数要作为 Server Action 传入才可用。'],
    problem: '解决"什么组件要加 use client、Server 和 Client 组件如何组合传数据"的问题。',
  },
  {
    id: 'X_7', title: '静态与动态渲染', navTitle: '静态动态', category: '渲染',
    path: '/nextjs/x-7/static-dynamic', summary: '理解 Next.js 的静态渲染（构建时）与动态渲染（请求时）触发条件和缓存行为。',
    demo: null,
    demoComponent: X07StaticDynamic,
    code: X7Code,
    language: 'jsx',
    principle: 'Next.js 默认对不含动态 API 的页面做静态渲染（构建时生成 HTML）；一旦组件树使用 cookies()/headers()/searchParams 等动态函数或显式禁用缓存，整条路由转为动态渲染（每次请求执行）。静态路由可被 CDN 缓存，动态路由按需执行。',
    flow: ['用默认 fetch 构建页面，观察 HTML 在构建时生成（静态渲染）。', '在组件中调用 cookies()/headers() 或读取 searchParams，验证路由转为动态渲染。', '用 export const dynamic/revalidate 或 generateStaticParams 显式控制渲染与刷新策略。', '查看 next build 输出的路由表，确认每条路由的渲染类型符合预期。'],
    notes: ['只要组件树中任一组件用了动态函数，整条路由就变动态。', '较新版本 fetch 默认不缓存，显式缓存选项会影响路由的静态/动态判定。', 'Next.js 16 的 Cache Components（use cache）实现"静态壳 + 动态内容"。', '区分静态与动态可看构建输出的 ○ 与 λ 标记，作为排查渲染行为的入口。'],
    problem: '解决"页面是构建时生成还是请求时执行、什么操作会让页面变动态"的问题。',
  },
  {
    id: 'X_8', title: 'Streaming 与 Suspense 流式渲染', navTitle: '流式渲染', category: '渲染',
    path: '/nextjs/x-8/streaming', summary: '用 Suspense 边界实现流式渲染，让慢组件不阻塞首屏，渐进式展示内容。',
    demo: null,
    demoComponent: X08StreamingSuspense,
    code: X8Code,
    language: 'jsx',
    principle: 'Streaming 把服务端渲染的 HTML 分块发送：遇到 <Suspense> 边界先返回 fallback，慢组件数据就绪后流式替换。用户无需等待最慢的组件即可看到骨架内容；loading.tsx 是路由级 Suspense 的语法糖。',
    flow: ['用 <Suspense fallback> 包裹慢的 async 组件，观察首屏先显示骨架再流式替换。', '为路由添加 loading.tsx，验证导航期间自动显示加载状态。', '并排放置多个 Suspense 边界，验证各区块独立加载互不阻塞。', '用网络面板确认 HTML 是分块到达而非一次性返回。'],
    notes: ['loading.tsx 等价于路由级 <Suspense>，自动包裹同目录 page。', '流式渲染需要配合 async Server Component + await。', 'LCP 优化：把慢组件用 Suspense 隔离，让快速部分优先输出。', 'Suspense 边界粒度要按数据依赖划分，过细会产生大量小块增加调度开销。'],
    problem: '解决"页面里有慢请求，用户要等很久才看到内容、如何渐进式展示"的问题。',
  },
  {
    id: 'X_9', title: '数据获取与 fetch 缓存', navTitle: '数据获取', category: '数据',
    path: '/nextjs/x-9/data-fetching', summary: '掌握 Server Component 中直接 await fetch 的模式，以及 Next.js 扩展的缓存选项。',
    demo: null,
    demoComponent: X09DataFetching,
    code: X9Code,
    language: 'jsx',
    principle: 'Next.js 扩展了原生 fetch 用于服务端数据获取：可配置 no-store（不缓存，新版默认）、force-cache（持久缓存）、next.revalidate（ISR 定时刷新）或 next.tags（按标签缓存，用 revalidateTag/revalidatePath 主动失效）。同一次渲染中相同 URL 的请求自动去重，Server Component 中直接 await 即可。',
    flow: ['在 Server Component 中直接 await fetch 并渲染结果，无需 useEffect。', '分别用 cache: "no-store"、force-cache 与 next.revalidate 控制缓存策略。', '用 next.tags 标记请求，配合 revalidateTag 在数据变更后主动失效缓存。', '为数据设计稳定的标签命名（如 post-1、post-list），变更时精确失效相关标签。'],
    notes: ['较新版本（15+）fetch 默认不缓存，需要缓存时显式指定缓存项。', 'Request Memoization：同一次渲染内相同 URL 的 fetch 只执行一次。', 'Data Cache 存在服务端并跨请求共享，不是浏览器缓存。', '调试缓存行为时用日志与构建输出核对，避免凭直觉猜测命中情况。'],
    problem: '解决"Server Component 里如何请求数据、fetch 缓存何时命中何时失效"的问题。',
  },
  {
    id: 'X_10', title: 'Server Actions 服务端操作', navTitle: 'Server Actions', category: '数据',
    path: '/nextjs/x-10/server-actions', summary: '用 "use server" 定义服务端函数，表单直接提交到服务端，无需手写 API。',
    demo: null,
    demoComponent: X10ServerActions,
    code: X10Code,
    language: 'jsx',
    principle: 'Server Action 用 "use server" 声明，函数在服务端运行，前端通过 POST 调用。可配合 form action 属性实现无 JavaScript 的表单提交，并自动处理 CSRF 防护；执行后用 revalidatePath/revalidateTag 刷新缓存，页面自动更新，无需手动 refetch。',
    flow: ['用 "use server" 声明服务端函数。', '通过 form action 或程序式调用触发执行。', '执行后 revalidatePath/revalidateTag 刷新缓存，页面自动更新。', '用 useFormStatus 展示提交中的状态，避免重复点击造成重复提交。'],
    notes: ['Server Action 自动做 CSRF 防护，参数会被自动序列化。', 'React 19 用 useActionState 取代 useFormState 跟踪返回值，useFormStatus 跟踪提交状态。', 'useOptimistic 可先乐观更新界面，再等待真实执行结果。', 'Server Action 参数与返回值必须可序列化，复杂对象先转换为普通结构再传递。'],
    problem: '解决"表单提交/数据变更需要写 API 吗、怎么在 Next.js 里做增删改"的问题。',
  },
  {
    id: 'X_11', title: 'Route Handlers API 路由', navTitle: 'API路由', category: '数据',
    path: '/nextjs/x-11/route-handlers', summary: '用 route.ts 定义 REST API，导出 GET/POST 等方法处理 HTTP 请求。',
    demo: null,
    demoComponent: X11RouteHandlers,
    code: X11Code,
    language: 'jsx',
    principle: 'Route Handler 在 app/api/ 目录下用 route.ts 定义，每个导出的 HTTP 方法（GET/POST/PUT/DELETE/PATCH）对应一个处理函数，返回 NextResponse。适合构建 REST API、Webhook、第三方 API 代理，可运行在 Node 或 Edge Runtime。',
    flow: ['在 app/api/xxx/route.ts 中导出对应 HTTP 方法。', '用 NextResponse.json 返回 JSON 响应。', '通过函数第二参数 params 获取动态路由参数。', '用 curl 或 fetch 直接调用接口，核对状态码与返回结构。'],
    notes: ['文件名固定为 route.ts，目录层级即 API 路径。', 'GET 在满足静态条件时可被缓存，POST/PUT/DELETE 等写操作默认不缓存。', 'Route Handler 适合 REST API/代理，与表单场景的 Server Action 定位不同。', '对外暴露的接口要校验入参并返回合适的错误码，不能默认信任客户端数据。'],
    problem: '解决"Next.js 怎么写后端 API、Route Handler 和 Server Action 该用哪个"的问题。',
  },
  {
    id: 'X_12', title: '缓存与重新验证', navTitle: '缓存策略', category: '数据',
    path: '/nextjs/x-12/caching', summary: '理解 Data Cache、Full Route Cache、Router Cache、Request Memoization 四层缓存与失效机制。',
    demo: null,
    demoComponent: X12Caching,
    code: X12Code,
    language: 'jsx',
    principle: 'Next.js 有多个缓存层：Request Memoization（单次渲染内请求去重）、Data Cache（fetch 结果的持久缓存）、Full Route Cache（静态渲染的 HTML 与 RSC payload）、Router Cache（客户端会话内已访问的路由缓存）。按需失效 Data Cache 会级联刷新上层缓存。',
    flow: ['在同次渲染中对同一 URL 发起两次 fetch，验证 Request Memoization 只发一次请求。', '用 next.revalidate 与 next.tags 配置 Data Cache，用 revalidatePath/revalidateTag 主动失效。', '观察 Data Cache 失效后 Full Route 与 Router Cache 的级联刷新，用 router.refresh() 清客户端缓存。', '修改数据后从页面导航验证内容已更新，确认各层缓存都按预期失效。'],
    notes: ['Data Cache 是基础，失效它会级联刷新 Full Route 与 Router Cache。', 'Router Cache 在客户端会话内有效（约 30s~5min），router.refresh() 可清除。', 'Next.js 16 引入 Cache Components（use cache），让缓存更显式可控。', '排查缓存问题时逐层关闭对照：先确认 Data Cache，再看 Full Route 与 Router 层。'],
    problem: '解决"Next.js 到底有几层缓存、数据更新后怎么让缓存失效"的问题。',
  },
  {
    id: 'X_13', title: 'Parallel Routes 并行路由', navTitle: '并行路由', category: '路由进阶',
    path: '/nextjs/x-13/parallel-routes', summary: '用 @ 插槽在布局中并行渲染多个独立子路由，实现仪表盘等复杂布局。',
    demo: null,
    demoComponent: X13ParallelRoutes,
    code: X13Code,
    language: 'jsx',
    principle: 'Parallel Routes 用 @ 前缀目录定义插槽，插槽作为 props 传入 layout，可在同一布局中并行渲染多个独立子路由。每个插槽有自己的加载、错误与 default 状态，default.tsx 提供插槽未匹配时的默认内容，适合仪表盘等多面板布局。',
    flow: ['用 @analytics、@notifications 定义插槽，在 layout 中接收同名 props 并摆位。', '为插槽添加各自的 default.tsx 与 loading.tsx，验证未匹配兜底与独立加载。', '在 layout 中按条件渲染插槽，并配合拦截路由实现弹窗叠加。', '直接访问不存在的插槽路径，验证 default.tsx 兜底内容正确显示。'],
    notes: ['插槽名即 prop 名：@sidebar → layout 的 sidebar prop。', '每个插槽可独立流式加载（各自的 loading.tsx）。', '插槽不参与 URL 路径，只决定布局内的并行渲染区域。', '插槽目录名即 prop 名，重命名目录要同步修改 layout 的解构。'],
    problem: '解决"一个布局里要同时展示多个独立数据块、各自独立加载与容错"的并行渲染问题。',
  },
  {
    id: 'X_14', title: 'Intercepting Routes 拦截路由', navTitle: '拦截路由', category: '路由进阶',
    path: '/nextjs/x-14/intercepting-routes', summary: '用 (.) (..) (...) 拦截路由，实现客户端导航弹窗、直接访问全屏的体验。',
    demo: null,
    demoComponent: X14InterceptingRoutes,
    code: X14Code,
    language: 'jsx',
    principle: 'Intercepting Routes 用 (.) (..) (..)(..) (...) 前缀拦截其他路由：客户端导航时命中拦截版（如模态框弹窗），直接访问或刷新 URL 时命中真实版（如全屏页）。同一 URL 提供两种体验，既流畅又可分享，常配合 Parallel Routes 的 Modal 插槽。',
    flow: ['创建真实页面 app/photo/[id]/page.tsx 与拦截版 @modal/(.)photo/[id]/page.tsx。', '从列表页点击 Link 导航，验证命中弹窗形式的拦截版本。', '直接访问或刷新同一 URL 验证命中全屏真实版，并用 router.back() 关闭弹窗。', '用浏览器前进后退验证弹窗与页面的切换状态不出现错乱。'],
    notes: ['(.) 同级、(..) 上级、(..)(..) 上两级、(...) 根级拦截。', '拦截版与真实版共享同一 URL，直接访问/刷新命中真实版。', '浏览器后退回到来源页，弹窗随之关闭。', '拦截路由的目录层级要和真实路径对齐，前缀没写对会直接失效。'],
    problem: '解决"点击图片想弹窗展示、直接访问链接又要是全屏页，两种体验怎么兼顾"的问题。',
  },
  {
    id: 'X_15', title: 'Route Groups 与私有文件夹', navTitle: '路由组', category: '路由进阶',
    path: '/nextjs/x-15/route-groups', summary: '用 (group) 路由组组织代码、切换布局，用 _folder 私有文件夹存放不参与路由的内容。',
    demo: null,
    demoComponent: X15RouteGroups,
    code: X15Code,
    language: 'jsx',
    principle: 'Route Groups 用 (folder) 圆括号目录组织代码而不影响 URL，可为一组路由指定独立 layout；私有文件夹用 _folder 下划线前缀，完全不参与路由生成，适合存放内部组件和工具函数；路由组与私有目录都不影响 URL，是整理工程结构的两种正交手段。',
    flow: ['用 (marketing)、(dashboard) 路由组为两组页面配置独立 layout。', '用 _components、_lib 私有文件夹存放内部组件与工具，验证不生成路由。', '对照命名约定：[param] 动态、[...slug] 捕获、@slot 并行、(group) 路由组、_folder 私有。', '用 URL 访问 _components 下的文件，确认返回 404 且不生成任何路由。'],
    notes: ['路由组可让同一 URL 的不同路径使用不同布局（如营销页 vs 后台）。', '私有文件夹不生成路由，_components/_lib 等内部内容不入 URL。', '两个路由组解析到同一 URL 但 layout 不相容时会报冲突错误。', '同一路径不要同时出现在两个路由组的同名段中，冲突会在构建时暴露。'],
    problem: '解决"怎么给一组路由单独布局而不改 URL、内部组件怎么放才不会误生成路由"的问题。',
  },
  {
    id: 'X_16', title: 'Loading 与 Error UI', navTitle: '加载错误', category: '路由进阶',
    path: '/nextjs/x-16/loading-error', summary: '用 loading.tsx / error.tsx / not-found.tsx / global-error.tsx 约定加载、错误和 404 状态。',
    demo: null,
    demoComponent: X16LoadingError,
    code: X16Code,
    language: 'jsx',
    principle: 'loading.tsx 自动为页面创建 Suspense 边界；error.tsx 捕获子组件错误（必须是 Client Component，提供 reset 重试）；not-found.tsx 处理 404；global-error.tsx 是根 layout 出错时的兜底，需自带 html/body。错误就近匹配、逐层向上冒泡。',
    flow: ['用 loading.tsx 自动包裹路由级 Suspense，导航时显示。', '用 error.tsx 捕获错误并提供 reset 重试。', '用 not-found.tsx 与 global-error.tsx 兜底 404 与根布局错误。', '手动触发 notFound() 与抛错场景，验证各级兜底页面接管正确。'],
    notes: ['error.tsx 必须是 Client Component（需 reset 做交互）。', 'error.tsx 不捕获同级 layout 的错误，根布局错误需 global-error.tsx。', '用 notFound() 可在数据不存在时主动渲染最近的 404 页面。', 'error.tsx 的 reset 只重渲染该段，反复失败要考虑降级到静态提示内容。'],
    problem: '解决"页面加载中、出错、404 时分别该显示什么、怎么用文件约定处理"的问题。',
  },
  {
    id: 'X_17', title: 'next/image 图片优化', navTitle: '图片优化', category: '优化',
    path: '/nextjs/x-17/next-image', summary: '用 next/image 自动优化图片格式、尺寸、懒加载，消除布局抖动（CLS）。',
    demo: null,
    demoComponent: X17NextImage,
    code: X17Code,
    language: 'jsx',
    principle: 'next/image 的 <Image> 组件自动按设备生成合适尺寸的 AVIF/WebP，默认懒加载，通过指定 width/height 或 fill 防止 CLS。本地图片需 import（自带尺寸），远程图片需在 next.config.js 配置域名白名单；priority 用于首屏 LCP 图片预加载。',
    flow: ['本地图片用 import 引入，远程图片配置域名白名单。', '指定 width/height 或用 fill 让父容器决定尺寸，防止布局抖动。', '首屏图片加 priority 预加载提升 LCP。', '用 Lighthouse 对比优化前后图片区的加载指标，确认改进生效。'],
    notes: ['sizes 属性配合 srcset 为不同视口生成多档图片。', 'placeholder="blur" 生成低质量模糊占位，减少加载突兀。', '远程图片不配置域名白名单会在运行时报错，需 remotePatterns。', '图片尺寸按实际展示大小设置，过大的源图会产生不必要的带宽与处理开销。'],
    problem: '解决"图片加载慢、格式体积大、加载时页面抖动，怎么让它自动优化"的问题。',
  },
  {
    id: 'X_18', title: 'next/font 字体优化', navTitle: '字体优化', category: '优化',
    path: '/nextjs/x-18/next-font', summary: '用 next/font 自托管字体，消除布局抖动，避免第三方 CDN 请求。',
    demo: null,
    demoComponent: X18NextFont,
    code: X18Code,
    language: 'jsx',
    principle: 'next/font 在构建时下载字体并自托管，避免第三方 CDN 请求，用 size-adjust 消除换字体时的布局抖动。支持 next/font/google 和 next/font/local，通过 variable 生成 CSS 变量方便引用；display: swap 先用 fallback 显示再平滑切换。',
    flow: ['用 next/font/google 或 next/font/local 加载字体。', '通过 variable 生成 CSS 变量并在布局上引用。', '用 display: swap 先在文本可用时用 fallback 兜底。', '在布局上引用字体变量，核对构建产物中字体文件已自托管。'],
    notes: ['字体在构建时下载自托管，不向 Google 发请求（隐私友好）。', 'display: swap 先显示 fallback 再切换，避免文字不可见。', '通过 subsets 与 weight 限定子集/字重，减小字体体积。', '多个字体共享同一 CSS 变量族，切换主题时只改变量值即可整体换字体。'],
    problem: '解决"用 Google 字体向第三方泄露用户信息、字体切换导致布局抖动"的问题。',
  },
  {
    id: 'X_19', title: 'next/link 与导航', navTitle: '链接导航', category: '优化',
    path: '/nextjs/x-19/next-link', summary: '掌握 Link 客户端导航、useRouter 编程式跳转、redirect 服务端重定向等导航 API。',
    demo: null,
    demoComponent: X19NextLink,
    code: X19Code,
    language: 'jsx',
    principle: 'next/link 的 <Link> 实现客户端导航并自动预取目标路由的 RSC payload；useRouter 提供 push/replace/back/refresh 等程序式导航；redirect/permanentRedirect 在服务端重定向。App Router 的导航 API 一律从 next/navigation 导入（而非 next/router）。',
    flow: ['用 <Link> 实现客户端导航与自动预取。', '用 useRouter（Client Component 内）做程序式跳转。', '用 redirect 在服务端重定向（Server Component/Action/Route Handler）。', '用 usePathname 给当前导航项加高亮，验证路由状态同步。'],
    notes: ['Link 默认 prefetch：静态路由进视口时预取，动态路由点击时才预取。', 'usePathname/useSearchParams 从 next/navigation 导入。', 'redirect 抛出一个特殊异常终止渲染，应放在数据校验之后。', '不要在 try/catch 里直接调用 redirect，异常会被吞掉导致重定向失效。'],
    problem: '解决"页面跳转如何避免整页刷新、编程式导航与服务端重定向各在什么场景使用"的问题。',
  },
  {
    id: 'X_20', title: 'Metadata 与 SEO', navTitle: 'Metadata', category: '优化',
    path: '/nextjs/x-20/metadata', summary: '用 Metadata API（静态 metadata + 动态 generateMetadata）管理 title、description、OG 等 SEO 元信息。',
    demo: null,
    demoComponent: X20Metadata,
    code: X20Code,
    language: 'jsx',
    principle: 'App Router 用 Metadata API 取代 Pages Router 的 next/head：可导出静态 metadata 对象或动态 generateMetadata 函数生成 title/description/openGraph 等元信息。还支持文件约定（favicon/icon/opengraph-image）和 sitemap.ts/robots.ts 动态生成，子页面 metadata 覆盖父级。',
    flow: ['用 metadata 对象设置静态 title/description 等。', '用 generateMetadata 按路由参数动态生成元信息。', '用 sitemap.ts/robots.ts 动态生成站点地图与爬虫规则。', '用浏览器查看页面源代码，核验各 meta 标签实际渲染结果。'],
    notes: ['title.template 让子页标题自动拼接父模板（如 "%s | 小松鼠"）。', 'opengraph-image.tsx 可用 ImageResponse 动态生成分享图。', '派生并返回的 metadata 会按字段自动去重，子页面覆盖父级同名字段。', 'generateMetadata 中发起的请求与会自动去重，可放心复用同一数据源。'],
    problem: '解决"App Router 怎么管理 SEO 元信息、动态页面怎么设置 title"的问题。',
  },
  {
    id: 'X_21', title: 'Middleware 中间件', navTitle: '中间件', category: '工程',
    path: '/nextjs/x-21/middleware', summary: '用 middleware.ts 在请求到达路由前执行认证、重定向、A/B 测试等逻辑。',
    demo: null,
    demoComponent: X21Middleware,
    code: X21Code,
    language: 'jsx',
    principle: 'Middleware 在每个请求、路由渲染前运行，可重写、重定向、修改请求/响应头，适合认证鉴权、i18n 语言检测、A/B 测试、灰度发布。文件放在项目根或 src/ 下，用 config.matcher 限定匹配路径以提升性能；由于它在路由渲染前运行，逻辑要尽量轻量，避免拖慢每个请求。',
    flow: ['在项目根或 src/ 下创建 middleware.ts。', '用 NextResponse.redirect/next/rewrite 重定向或放行。', '用 config.matcher 限定中间件执行路径以提升性能。', '用日志确认中间件只在目标路径执行，未匹配的静态资源不受影响。'],
    notes: ['中间件运行在独立运行时，不能直接使用 Node 专有 API，依赖需与之兼容。', 'Next.js 16 起 middleware 已更名为 proxy.ts（原文件仍可用但已弃用）。', 'matcher 需排除 _next/static、_next/image 等静态资源避免无谓执行。', '可注入请求头供下游 Server Component 读取。'],
    problem: '解决"如何在路由执行前统一做鉴权、重定向、A/B 测试等横切逻辑"的问题。',
  },
  {
    id: 'X_22', title: '环境变量与 next.config', navTitle: '环境配置', category: '工程',
    path: '/nextjs/x-22/env-config', summary: '掌握 NEXT_PUBLIC_ 前缀规则、env 文件优先级和 next.config.js 核心配置项。',
    demo: null,
    demoComponent: X22EnvConfig,
    code: X22Code,
    language: 'jsx',
    principle: '环境变量加 NEXT_PUBLIC_ 前缀会被内联进前端 bundle（客户端可见），无前缀则仅在服务端可读。env 文件优先级：.env.local > .env.[环境] > .env。next.config.js 集中配置 reactStrictMode、images、rewrites、redirects、output 等。',
    flow: ['用 NEXT_PUBLIC_ 前缀区分客户端/服务端环境变量。', '创建 .env.local 覆盖 .env 中的同名变量，验证优先级顺序。', '在 next.config.js 配置图片域名、重写、重定向、导出模式。', '用构建产物验证环境变量已按预期替换，敏感值未出现在客户端。'],
    notes: ['密钥绝不加 NEXT_PUBLIC_ 前缀，否则会泄露到前端 bundle。', '.env.local 通常被 gitignore，用于存放本地敏感配置。', 'output: "standalone" 生成独立部署产物，"export" 做纯静态导出。', '环境变量在构建时内联：运行时再改 .env 对已构建产物无效，需重新构建。'],
    problem: '解决"环境变量怎么分客户端和服务端、next.config.js 能配什么"的问题。',
  },
  {
    id: 'X_23', title: '国际化 i18n', navTitle: '国际化', category: '工程',
    path: '/nextjs/x-23/i18n', summary: '用 App Router 的 [lang] 动态路由 + middleware 语言检测实现多语言站点。',
    demo: null,
    demoComponent: X23I18n,
    code: X23Code,
    language: 'jsx',
    principle: 'App Router 推荐用 [lang] 动态路由实现 i18n：每种语言拥有独立 URL，利于 SEO；middleware 根据 Accept-Language 或 Cookie 自动检测并重定向到对应语言前缀；字典按语言拆分并按需 import。可配合 hreflang 标签与 Intl API 处理复数、日期等本地化。',
    flow: ['用 [lang] 动态路由为每种语言生成独立 URL。', '用 middleware 根据 Accept-Language/Cookie 自动重定向。', '按需 import 字典，用 Context 下发翻译函数供组件使用。', '用不带前缀的根路径访问，验证自动重定向到默认语言。'],
    notes: ['每种语言独立 URL 利于 SEO，配合 hreflang 标签声明语言版本。', '字典按语言拆分 import，避免把所有语言全量打进 bundle。', '也可选用 next-intl 等社区方案封装 App Router 的 i18n。', '语言前缀要走动态段时注意与 API 路由区分，避免接口请求被重定向。'],
    problem: '解决"App Router 怎么做多语言、怎么自动检测用户语言"的问题。',
  },
  {
    id: 'X_24', title: '部署与 Vercel', navTitle: '部署', category: '工程',
    path: '/nextjs/x-24/deployment', summary: '掌握 Vercel、Node 自托管、Docker、静态导出四种部署目标的特点与配置。',
    demo: null,
    demoComponent: X24Deployment,
    code: X24Code,
    language: 'jsx',
    principle: 'Next.js 支持多种部署目标：Vercel（官方全托管、零配置，支持全部特性）、Node Server（output: standalone 自托管）、Docker（基于 standalone 产物构建镜像）、Static Export（output: export 纯静态）。静态导出有限制：不支持 Server Actions、Middleware、Image 优化等动态能力。',
    flow: ['按需求选择部署目标：Vercel 全托管、standalone 自托管、Docker 镜像或静态导出。', '配置 output 模式与生产环境变量。', '设置域名、HTTPS、CDN 缓存与监控告警。', '部署后跑一遍冒烟测试，核验动态能力与静态资源的实际表现。'],
    notes: ['Vercel 是官方平台，零配置支持所有 Next.js 特性。', 'standalone 产物不含 node_modules，需自行 COPY 静态资源与 public。', '静态导出不支持 Server Actions、Middleware、Image 优化与动态渲染。', '选部署方式前先梳理功能清单，凡依赖动态能力的项都不适合静态导出。'],
    problem: '解决"Next.js 项目能部署到哪里、各部署方式有什么限制"的问题。',
  },
]
