import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(() => loader())
}

const X01ProjectStructure = createDemo('X01ProjectStructure')
const X02FileRouting = createDemo('X02FileRouting')
const X03Layouts = createDemo('X03Layouts')
const X04DynamicRoutes = createDemo('X04DynamicRoutes')
const X05ServerComponents = createDemo('X05ServerComponents')
const X06ClientComponents = createDemo('X06ClientComponents')
const X07StaticDynamic = createDemo('X07StaticDynamic')
const X08StreamingSuspense = createDemo('X08StreamingSuspense')
const X09DataFetching = createDemo('X09DataFetching')
const X10ServerActions = createDemo('X10ServerActions')
const X11RouteHandlers = createDemo('X11RouteHandlers')
const X12Caching = createDemo('X12Caching')
const X13ParallelRoutes = createDemo('X13ParallelRoutes')
const X14InterceptingRoutes = createDemo('X14InterceptingRoutes')
const X15RouteGroups = createDemo('X15RouteGroups')
const X16LoadingError = createDemo('X16LoadingError')
const X17NextImage = createDemo('X17NextImage')
const X18NextFont = createDemo('X18NextFont')
const X19NextLink = createDemo('X19NextLink')
const X20Metadata = createDemo('X20Metadata')
const X21Middleware = createDemo('X21Middleware')
const X22EnvConfig = createDemo('X22EnvConfig')
const X23I18n = createDemo('X23I18n')
const X24Deployment = createDemo('X24Deployment')

export const lessons: Lesson[] = [
  {
    id: 'X_1', title: '项目结构与 App Router 目录约定', navTitle: '项目结构', category: '起步',
    path: '/nextjs/x-1/project-structure', summary: '了解 Next.js App Router 的目录约定、app/ 核心目录和 next.config.js 配置。',
    demo: X01ProjectStructure,
    code: () => Promise.resolve(`// app/layout.tsx - 根布局（必需）
import './globals.css'

// 根布局必须包含 html 和 body 标签
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

// ============================================

// app/page.tsx - 首页页面组件
// 只有 page.tsx 才会生成路由入口
export default function HomePage() {
  return (
    <main>
      <h1>欢迎来到 Next.js</h1>
      <p>这是首页，由 app/page.tsx 渲染</p>
    </main>
  )
}

// ============================================

// app/about/page.tsx - 关于页
// 目录层级即 URL 路径层级
export default function AboutPage() {
  return (
    <div>
      <h1>关于我们</h1>
      <p>Next.js App Router 示例</p>
    </div>
  )
}

// ============================================

// app/loading.tsx - 全局加载状态
// 路由切换时自动显示
export default function Loading() {
  return <div className="loading">加载中...</div>
}

// ============================================

// app/error.tsx - 全局错误边界
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>出错了！</h2>
      <button onClick={() => reset()}>重试</button>
    </div>
  )
}

// ============================================

// next.config.js - Next.js 配置文件
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}

module.exports = nextConfig`),
    language: 'jsx',
    principle: 'Next.js 13+ 使用 App Router（app/ 目录）组织路由：page.tsx 定义页面 UI，layout.tsx 定义共享布局，特殊文件（loading/error/not-found）约定加载、错误和 404 状态。这套约定让路由、布局和状态处理都有文件可循。',
    flow: ['认识 app/ 目录的核心文件（page/layout/loading/error）。', '理解 public/ 静态资源与 next.config.js 配置。', '掌握 Pages Router 与 App Router 的区别。'],
    notes: ['app/layout.tsx 是必需的根布局，必须包含 <html> 和 <body>。', 'Pages Router（pages/）仍兼容，但推荐迁移到 App Router。', 'middleware.ts 必须放在项目根或 src/ 下，不能在 app/ 内。'],
    problem: '解决"Next.js 项目怎么组织代码、App Router 目录里每个文件是干什么用的"入门问题。',
  },
  {
    id: 'X_2', title: '文件路由：目录即路由表', navTitle: '文件路由', category: '起步',
    path: '/nextjs/x-2/file-routing', summary: '掌握 App Router 文件路由映射规则，理解静态、动态、Catch-all、路由组和并行路由的命名约定。',
    demo: X02FileRouting,
    code: () => Promise.resolve(`// app/blog/page.tsx - 静态路由 /blog
export default function BlogPage() {
  return <h1>博客列表</h1>
}

// ============================================

// app/blog/[slug]/page.tsx - 动态路由 /blog/:slug
// 方括号表示动态参数
export default function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  return <h1>文章：{params.slug}</h1>
}

// ============================================

// app/docs/[...slug]/page.tsx - Catch-all 路由 /docs/a/b/c
// params.slug 是数组 ['a', 'b', 'c']
export default function DocsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  return <h1>文档路径：{params.slug.join(' / ')}</h1>
}

// ============================================

// app/shop/[[...slug]]/page.tsx - 可选 Catch-all
// 匹配 /shop、/shop/a、/shop/a/b 等
export default function ShopPage({
  params,
}: {
  params: { slug?: string[] }
}) {
  const path = params.slug?.join(' / ') || '首页'
  return <h1>商店：{path}</h1>
}

// ============================================

// app/(marketing)/about/page.tsx - 路由组
// URL 仍是 /about，(marketing) 不影响路径
// 可用于组织代码和独立布局
export default function AboutPage() {
  return <h1>关于我们</h1>
}

// ============================================

// app/_components/Button.tsx - 私有文件夹
// _ 前缀的文件夹不参与路由生成
// 用于存放内部组件和工具函数
'use client'

export function Button({ children }: { children: React.ReactNode }) {
  return <button className="btn">{children}</button>
}`),
    language: 'jsx',
    principle: 'App Router 基于文件系统自动生成路由：page.tsx 定义路由 UI，目录层级即 URL 层级。方括号表示动态参数，圆括号是路由组（不影响路径），@ 前缀是并行路由插槽，_ 前缀是私有文件夹（不参与路由）。',
    flow: ['理解 page.tsx 才是路由入口，目录只是路径段。', '掌握 [param]、[...slug]、(group)、@slot、_private 命名规则。', '对比 Nuxt 的文件路由，理解 Next.js 的差异。'],
    notes: ['只有 page.tsx 会生成路由，其他文件（layout/error 等）是辅助。', '[[...slug]] 是可选 Catch-all，零段也匹配。', '(folder) 路由组用于组织代码和切换布局，不改变 URL。'],
    problem: '解决"Next.js 文件名各种括号和符号代表什么、如何用文件结构表达复杂路由"的问题。',
  },
  {
    id: 'X_3', title: '布局与模板：共享 UI 的层级', navTitle: '布局模板', category: '起步',
    path: '/nextjs/x-3/layouts', summary: '理解根布局、嵌套布局、路由组布局和 template 的区别与嵌套机制。',
    demo: X03Layouts,
    code: () => Promise.resolve(`// app/layout.tsx - 根布局（最外层）
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header>全站头部</header>
        {children}
        <footer>全站底部</footer>
      </body>
    </html>
  )
}

// ============================================

// app/dashboard/layout.tsx - 嵌套布局
// 导航时保持挂载，状态不重置
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <aside>侧边栏导航</aside>
      <main>{children}</main>
    </div>
  )
}

// ============================================

// app/dashboard/page.tsx - dashboard 首页
// 被 dashboard layout 包裹
export default function DashboardPage() {
  return <h1>仪表盘首页</h1>
}

// ============================================

// app/(marketing)/layout.tsx - 路由组布局
// 同 URL 可以有不同布局（营销页 vs 后台）
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="marketing">
      <nav>营销导航栏</nav>
      {children}
    </div>
  )
}

// ============================================

// app/blog/template.tsx - 模板（每次导航重新创建）
// 与 layout 不同，template 的状态会在导航时重置
'use client'

import { useState } from 'react'

export default function BlogTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  // 每次进入新文章，这个状态都会重置
  const [views, setViews] = useState(0)

  return (
    <div className="blog-template">
      <p>浏览次数：{views}</p>
      {children}
    </div>
  )
}

// ============================================

// 布局嵌套关系示意：
// RootLayout (app/layout.tsx)
//   └─ DashboardLayout (app/dashboard/layout.tsx)
//        └─ DashboardPage (app/dashboard/page.tsx)`),
    language: 'jsx',
    principle: 'layout.tsx 在导航时保持挂载状态不重新渲染，适合放 Header/Footer 等持久 UI；template.tsx 每次导航都重新创建，适合需要重置状态的场景。布局层层嵌套，子布局套在父布局内。',
    flow: ['认识根布局（必需）与嵌套布局的层级关系。', '理解 layout 和 template 的状态保持差异。', '掌握路由组布局实现同 URL 不同布局。'],
    notes: ['根布局必须包含 <html> 和 <body>，全局样式在这里引入。', 'layout 在导航时不重新挂载，useState 会保留；template 会重置。', '路由组 (group) 配合各自 layout 可实现同路径多套布局。'],
    problem: '解决"哪些 UI 应该放 layout、layout 之间如何嵌套、什么时候用 template"的问题。',
  },
  {
    id: 'X_4', title: '动态路由与参数', navTitle: '动态路由', category: '起步',
    path: '/nextjs/x-4/dynamic-routes', summary: '掌握动态路由参数、Catch-all、可选 Catch-all，以及 params 与 searchParams 的使用。',
    demo: X04DynamicRoutes,
    code: () => Promise.resolve(`// app/products/[id]/page.tsx - 单段动态路由
// 访问 /products/123，params.id = '123'
export default function ProductPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const productId = params.id
  const utmSource = searchParams.utm_source as string | undefined

  return (
    <div>
      <h1>商品 ID: {productId}</h1>
      {utmSource && <p>来源: {utmSource}</p>}
    </div>
  )
}

// ============================================

// app/categories/[...slug]/page.tsx - Catch-all 多段
// 访问 /categories/electronics/phones，params.slug = ['electronics', 'phones']
export default function CategoryPage({
  params,
}: {
  params: { slug: string[] }
}) {
  return (
    <div>
      <h1>分类路径</h1>
      <ol>
        {params.slug.map((seg, i) => (
          <li key={i}>{seg}</li>
        ))}
      </ol>
    </div>
  )
}

// ============================================

// app/search/[[...query]]/page.tsx - 可选 Catch-all
// 匹配 /search、/search/react、/search/react/hooks
export default function SearchPage({
  params,
}: {
  params: { query?: string[] }
}) {
  const query = params.query?.join(' ') || ''

  return (
    <div>
      <h1>搜索结果</h1>
      <p>关键词: {query || '（空）'}</p>
    </div>
  )
}

// ============================================

// app/products/[id]/generateStaticParams - 预生成静态页
// 构建时预先生成已知商品的静态页面
export async function generateStaticParams() {
  const products = await fetch('https://api.example.com/products').then(res => res.json())

  return products.map((product: { id: string }) => ({
    id: product.id,
  }))
}

// ============================================

// Next.js 15+ 中 params 和 searchParams 是 Promise
// 需要使用 async/await
// app/posts/[id]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <h1>文章 {id}</h1>
}`),
    language: 'jsx',
    principle: '动态路由用方括号 [id] 捕获单段，[...slug] 捕获多段（数组），[[...slug]] 可选捕获。page 组件通过 params prop 读取路径参数，通过 searchParams 读取 URL 查询串。Next.js 15+ 中两者都是 Promise，需 await。',
    flow: ['掌握 [param] 单段与 [...slug] 多段动态路由。', '理解 params（路径段）与 searchParams（查询串）的区别。', '注意 Next.js 15+ params/searchParams 变为 Promise。'],
    notes: ['Catch-all params.slug 是数组，单段 params.id 是字符串。', 'searchParams 在服务端组件中会触发动态渲染。', 'generateStaticParams() 可预生成动态路由的静态页面。'],
    problem: '解决"如何用文件名表达带参数的 URL、在组件里怎么拿到路由参数"的问题。',
  },
  {
    id: 'X_5', title: 'Server Components 服务端组件', navTitle: 'Server组件', category: '渲染',
    path: '/nextjs/x-5/server-components', summary: '理解 Server Component 的运行环境、能力边界与默认行为。',
    demo: X05ServerComponents,
    code: () => Promise.resolve(`// app/page.tsx - 默认是 Server Component
// 无需声明，app/ 目录下所有组件默认在服务端运行
import { connectDB } from './lib/db'

// 直接 async/await 数据获取
async function getPosts() {
  // 可以直接访问数据库、文件系统、密钥
  const db = await connectDB(process.env.DATABASE_URL!)
  return db.posts.findMany()
}

export default async function HomePage() {
  // 服务端组件中直接 await 数据
  const posts = await getPosts()

  return (
    <main>
      <h1>文章列表</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  )
}

// ============================================

// Server Component 可以做的事：
// - 直接访问数据库、文件系统、API 密钥
// - 使用服务端 SDK（如 Prisma、Stripe）
// - 直接 async/await 获取数据
// - 不打包进前端 bundle，减小体积

// Server Component 不能做的事：
// - 使用 useState、useEffect 等客户端 Hooks
// - 使用 onClick、onChange 等事件处理器
// - 访问浏览器 API（window、document）
// - 使用 Context API（需要 Client Component）

// ============================================

// app/lib/data.ts - 服务端数据模块
// 只在服务端运行的代码
import fs from 'node:fs/promises'
import path from 'node:path'

export async function readMarkdownFile(slug: string) {
  // 直接读取文件系统
  const filePath = path.join(process.cwd(), 'content', \`\${slug}.md\`)
  const content = await fs.readFile(filePath, 'utf-8')
  return content
}

// ============================================

// Server Component 组合模式：
// 外层 Server Component 获取数据
// 内层 Client Component 处理交互

import { InteractiveChart } from './InteractiveChart'

// 这是 Server Component
export default async function DashboardPage() {
  const data = await fetchChartData() // 服务端获取数据

  return (
    <div>
      <h1>数据看板</h1>
      {/* 数据通过 props 传给客户端组件 */}
      <InteractiveChart initialData={data} />
    </div>
  )
}`),
    language: 'jsx',
    principle: 'App Router 中所有组件默认是 Server Component，在服务端运行，不打包进前端 bundle，可直接访问数据库、文件系统和密钥，但不能用 useState/useEffect 等客户端 Hook 和事件处理。适合数据获取和静态渲染。',
    flow: ['认识 Server Component 的服务端运行特性。', '对比 Server 与 Client Component 的能力边界。', '理解组合规则：Server 可导入 Client，反之只能传 children。'],
    notes: ['Server Component 不能用 onClick、useState、useEffect。', '直接 await 数据获取，无需 useEffect + 状态管理。', '把 "use client" 尽量下推，让更多组件留在服务端减小 bundle。'],
    problem: '解决"Server Component 到底能做什么、不能做什么、和 Client Component 怎么配合"的问题。',
  },
  {
    id: 'X_6', title: 'Client Components 客户端组件', navTitle: 'Client组件', category: '渲染',
    path: '/nextjs/x-6/client-components', summary: '掌握 "use client" 声明时机、客户端 Hooks 限制与 Server/Client 组件组合模式。',
    demo: X06ClientComponents,
    code: () => Promise.resolve(`// app/components/Counter.tsx - 客户端组件
// 文件顶部必须声明 "use client"
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        +1
      </button>
    </div>
  )
}

// ============================================

// app/components/SearchBox.tsx - 带输入交互的客户端组件
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchBox() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    // 可以使用浏览器 API
    console.log('搜索词更新:', query)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(\`/search?q=\${encodeURIComponent(query)}\`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="搜索..."
      />
      <button type="submit">搜索</button>
    </form>
  )
}

// ============================================

// Server + Client 组合模式
// app/page.tsx - Server Component（获取数据）
import { ProductCard } from './components/ProductCard'

async function getProducts() {
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <h1>商品列表</h1>
      <div className="grid">
        {products.map((product: any) => (
          // 把数据通过 props 传给客户端组件
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

// app/components/ProductCard.tsx - Client Component（交互）
'use client'

import { useState } from 'react'

export function ProductCard({ product }: { product: any }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>¥{product.price}</p>
      <button onClick={() => setLiked(!liked)}>
        {liked ? '♥' : '♡'} 收藏
      </button>
    </div>
  )
}

// ============================================

// "use client" 边界向下传递
// 只要在文件顶部声明，该文件导入的所有子组件也都是客户端组件
// 但子文件不需要再写 "use client"（除非单独使用）`),
    language: 'jsx',
    principle: '需要交互（事件、状态、生命周期、浏览器 API）的组件必须用 "use client" 声明为 Client Component。声明会向下传递：导入的子组件也变成客户端。Server 获取数据后可通过 props 传给 Client 组件接管交互。',
    flow: ['判断何时需要 "use client"（事件/状态/生命周期/浏览器 API）。', '掌握 Server 获取数据 → props 传 Client 的组合模式。', '理解 "use client" 边界向下传递的特性。'],
    notes: ['所有 React Hooks（useState/useEffect 等）只能在 Client Component 中使用。', 'Client Component 仍会在服务端预渲染 HTML，再在客户端 hydrate。', '尽量让交互组件小而独立，外层保持 Server。'],
    problem: '解决"什么组件要加 use client、Server 和 Client 组件如何组合传数据"的问题。',
  },
  {
    id: 'X_7', title: '静态与动态渲染', navTitle: '静态动态', category: '渲染',
    path: '/nextjs/x-7/static-dynamic', summary: '理解 Next.js 的静态渲染（构建时）与动态渲染（请求时）触发条件和缓存行为。',
    demo: X07StaticDynamic,
    code: () => Promise.resolve(`// 静态渲染（默认）- 构建时生成 HTML
// app/page.tsx
async function getPosts() {
  // fetch 默认 force-cache，触发静态渲染
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache', // 默认值，可以省略
  })
  return res.json()
}

export default async function HomePage() {
  const posts = await getPosts()
  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// ============================================

// 动态渲染 - 使用 cookies() 触发
// app/dashboard/page.tsx
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  // 读取 cookie 会让整个路由变为动态渲染
  const cookieStore = cookies()
  const userId = cookieStore.get('userId')?.value

  const user = await fetch(\`https://api.example.com/users/\${userId}\`, {
    cache: 'no-store', // 不缓存
  }).then(res => res.json())

  return <h1>欢迎回来，{user.name}</h1>
}

// ============================================

// 动态渲染 - 使用 headers() 触发
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = headers()
  const userAgent = headersList.get('user-agent')

  return <p>你的浏览器: {userAgent}</p>
}

// ============================================

// 动态渲染 - 使用 searchParams 触发
// app/search/page.tsx
export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  // searchParams 会触发动态渲染
  const query = searchParams.q

  return <h1>搜索: {query}</h1>
}

// ============================================

// 路由级配置：强制静态或动态
// app/blog/page.tsx

// 强制静态渲染（即使使用了动态函数也报错）
export const dynamic = 'force-static'

// 强制动态渲染（每次请求都执行）
// export const dynamic = 'force-dynamic'

// 自动（默认）- 根据使用的 API 自动判断
// export const dynamic = 'auto'

export default function BlogPage() {
  return <h1>博客</h1>
}

// ============================================

// ISR (Incremental Static Regeneration)
// 静态页面 + 定时重新生成
// app/products/[id]/page.tsx

// 每隔 60 秒重新生成页面
export const revalidate = 60

async function getProduct(id: string) {
  const res = await fetch(\`https://api.example.com/products/\${id}\`, {
    next: { revalidate: 60 }, // fetch 级别也可以配置
  })
  return res.json()
}

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)
  return <h1>{product.name}</h1>
}`),
    language: 'jsx',
    principle: 'Next.js 默认静态渲染（构建时生成 HTML），一旦组件树使用了动态函数（cookies/headers/searchParams）或 no-store fetch，整个路由转为动态渲染（每次请求执行）。静态路由可被 CDN 缓存，动态路由按需执行。',
    flow: ['理解静态（构建时）与动态（请求时）渲染的时机差异。', '掌握触发动态的信号：cookies/headers/searchParams/no-store。', '用 generateStaticParams 预生成动态路由的静态页。'],
    notes: ['只要路由树中任一组件用了动态函数，整条路由变动态。', 'fetch 默认 force-cache（静态），no-store 触发动态。', 'Partial Prerendering（PPR）实验特性允许静态壳 + 动态洞。'],
    problem: '解决"页面是构建时生成还是请求时执行、什么操作会让页面变动态"的问题。',
  },
  {
    id: 'X_8', title: 'Streaming 与 Suspense 流式渲染', navTitle: '流式渲染', category: '渲染',
    path: '/nextjs/x-8/streaming', summary: '用 Suspense 边界实现流式渲染，让慢组件不阻塞首屏，渐进式展示内容。',
    demo: X08StreamingSuspense,
    code: () => Promise.resolve(`// app/page.tsx - 使用 Suspense 包裹慢组件
import { Suspense } from 'react'
import { FastContent } from './FastContent'
import { SlowContent } from './SlowContent'
import { LoadingSkeleton } from './LoadingSkeleton'

export default function HomePage() {
  return (
    <div>
      {/* 快组件直接渲染，立即显示 */}
      <FastContent />

      {/* 慢组件用 Suspense 包裹，先显示 fallback */}
      <Suspense fallback={<LoadingSkeleton />}>
        <SlowContent />
      </Suspense>
    </div>
  )
}

// ============================================

// app/FastContent.tsx - 快速组件
async function getQuickData() {
  // 模拟快速请求
  await new Promise(resolve => setTimeout(resolve, 100))
  return { message: '快速加载完成' }
}

export async function FastContent() {
  const data = await getQuickData()
  return <div className="fast">{data.message}</div>
}

// ============================================

// app/SlowContent.tsx - 慢速组件
async function getSlowData() {
  // 模拟慢请求
  await new Promise(resolve => setTimeout(resolve, 3000))
  return { items: ['项目 A', '项目 B', '项目 C'] }
}

export async function SlowContent() {
  const data = await getSlowData()
  return (
    <div className="slow">
      <h2>慢速数据</h2>
      <ul>
        {data.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

// ============================================

// app/LoadingSkeleton.tsx - 骨架屏
export function LoadingSkeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  )
}

// ============================================

// loading.tsx - 路由级 Suspense 语法糖
// app/dashboard/loading.tsx
// 自动包裹 page.tsx，导航时显示
export default function DashboardLoading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>加载仪表盘数据...</p>
    </div>
  )
}

// ============================================

// 多个 Suspense 并行流式渲染
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { RevenueChart } from './RevenueChart'
import { UserStats } from './UserStats'
import { RecentOrders } from './RecentOrders'

export default function DashboardPage() {
  return (
    <div className="dashboard-grid">
      <Suspense fallback={<div>加载图表...</div>}>
        <RevenueChart />
      </Suspense>

      <Suspense fallback={<div>加载统计...</div>}>
        <UserStats />
      </Suspense>

      <Suspense fallback={<div>加载订单...</div>}>
        <RecentOrders />
      </Suspense>
    </div>
  )
}

// 三个组件独立加载，互不阻塞
// 哪个先准备好就先显示哪个`),
    language: 'jsx',
    principle: 'Streaming 把服务端渲染的 HTML 分块发送：遇到 Suspense 边界先返回 fallback，慢组件数据就绪后流式替换。用户无需等最慢组件就能看到骨架，loading.tsx 是路由级 Suspense 的语法糖。',
    flow: ['理解流式渲染：先返回 fallback，数据就绪后流式替换。', '用 <Suspense> 包裹慢组件，或用 loading.tsx 自动包裹。', '多个 Suspense 可并行流式，互不阻塞。'],
    notes: ['loading.tsx 等价于路由级 <Suspense>，自动包裹 page。', '流式渲染需要配合 async Server Component + await。', '首屏 LCP 优化：把慢组件用 Suspense 隔离，快速部分先出。'],
    problem: '解决"页面里有慢请求，用户要等很久才看到内容、如何渐进式展示"的问题。',
  },
  {
    id: 'X_9', title: '数据获取与 fetch 缓存', navTitle: '数据获取', category: '数据',
    path: '/nextjs/x-9/data-fetching', summary: '掌握 Server Component 中直接 await fetch 的模式，以及 Next.js 扩展的缓存选项。',
    demo: X09DataFetching,
    code: () => Promise.resolve(`// 基础数据获取 - Server Component 中直接 await
// app/page.tsx
async function getPosts() {
  // Next.js 扩展了原生 fetch
  const res = await fetch('https://api.example.com/posts')
  if (!res.ok) throw new Error('获取失败')
  return res.json()
}

export default async function HomePage() {
  // 直接 await，无需 useEffect
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// ============================================

// 缓存策略：force-cache（默认）- 构建时缓存
async function getCachedData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // 默认值，可省略
  })
  return res.json()
}

// ============================================

// 缓存策略：no-store - 不缓存，每次请求都重新获取
async function getFreshData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  })
  return res.json()
}

// ============================================

// 缓存策略：revalidate - ISR 定时刷新
async function getRevalidatedData() {
  const res = await fetch('https://api.example.com/data', {
    next: {
      revalidate: 60, // 60 秒后重新验证
    },
  })
  return res.json()
}

// ============================================

// 缓存策略：tags - 按标签缓存，可主动失效
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: {
      tags: ['posts'], // 打上标签
    },
  })
  return res.json()
}

async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    next: {
      tags: ['users'],
    },
  })
  return res.json()
}

// 在 Server Action 或 Route Handler 中主动失效
// import { revalidateTag } from 'next/cache'
// revalidateTag('posts') // 失效所有带 posts 标签的 fetch

// ============================================

// 同次渲染自动去重（Request Memoization）
// 同一个 URL 的 fetch 在同一次渲染中只执行一次
async function getPageData() {
  // 这两次调用只会真正发起一次请求
  const [posts, comments] = await Promise.all([
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
  ])
  return { posts, comments }
}

// ============================================

// 路由级 revalidate 配置
// app/blog/page.tsx

// 整个路由每 30 秒重新生成
export const revalidate = 30

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <h1>博客列表 ({posts.length})</h1>
}`),
    language: 'jsx',
    principle: 'Next.js 扩展了原生 fetch：默认 force-cache（构建时缓存）、no-store（不缓存）、revalidate（ISR 定时刷新）、tags（按标签缓存可主动失效）。同渲染周期内相同 URL 自动去重，Server Component 直接 await 即可。',
    flow: ['在 Server Component 中直接 await fetch（无需 useEffect）。', '掌握 force-cache/no-store/revalidate/tags 四种缓存策略。', '用 revalidateTag/revalidatePath 主动失效缓存。'],
    notes: ['fetch 默认缓存（force-cache），no-store 才不缓存。', 'Request Memoization：同一次渲染内相同 fetch 只执行一次。', '缓存存储在服务端跨请求共享，不是浏览器缓存。'],
    problem: '解决"在 Next.js 里怎么请求数据、fetch 的缓存怎么控制"的问题。',
  },
  {
    id: 'X_10', title: 'Server Actions 服务端操作', navTitle: 'Server Actions', category: '数据',
    path: '/nextjs/x-10/server-actions', summary: '用 "use server" 定义服务端函数，表单直接提交到服务端，无需手写 API。',
    demo: X10ServerActions,
    code: () => Promise.resolve(`// 基础 Server Action - 表单提交
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

// 声明为服务端函数
export async function createPost(formData: FormData) {
  // 这里的代码只在服务端运行
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // 可以直接操作数据库
  // await db.posts.create({ data: { title, content } })

  console.log('创建文章:', title)

  // 重新验证缓存，让页面显示最新数据
  revalidatePath('/blog')
}

// ============================================

// 表单中使用 Server Action
// app/blog/page.tsx
import { createPost } from './actions'

export default function BlogPage() {
  return (
    <div>
      <h1>写文章</h1>
      {/* form action 直接绑定 Server Action */}
      <form action={createPost}>
        <input type="text" name="title" placeholder="标题" required />
        <textarea name="content" placeholder="内容" required />
        <button type="submit">发布</button>
      </form>
    </div>
  )
}

// ============================================

// useFormState - 跟踪返回值
// app/components/PostForm.tsx
'use client'

import { useFormState } from 'react-dom'
import { createPost } from '../actions'

const initialState = { message: '', errors: {} }

export function PostForm() {
  const [state, formAction] = useFormState(createPost, initialState)

  return (
    <form action={formAction}>
      <input name="title" />
      {state.errors?.title && <p>{state.errors.title}</p>}

      <textarea name="content" />
      <button type="submit">发布</button>

      {state.message && <p>{state.message}</p>}
    </form>
  )
}

// ============================================

// useFormStatus - 跟踪提交状态
// app/components/SubmitButton.tsx
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : children}
    </button>
  )
}

// ============================================

// useOptimistic - 乐观更新
// app/components/LikeButton.tsx
'use client'

import { useOptimistic } from 'react'
import { likePost } from '../actions'

type Post = { id: string; likes: number }

export function LikeButton({ post }: { post: Post }) {
  const [optimisticPost, addOptimisticLike] = useOptimistic(
    post,
    (state) => ({ ...state, likes: state.likes + 1 })
  )

  async function handleLike() {
    addOptimisticLike()
    await likePost(post.id)
  }

  return (
    <button onClick={handleLike}>
      ♥ {optimisticPost.likes}
    </button>
  )
}

// ============================================

// 编程式调用 Server Action
'use client'

import { updateUser } from './actions'

export function UserProfile() {
  async function handleClick() {
    // 直接调用，不需要 form
    const result = await updateUser({ name: '新名字' })
    console.log(result)
  }

  return <button onClick={handleClick}>更新资料</button>
}`),
    language: 'jsx',
    principle: 'Server Action 用 "use server" 声明，函数在服务端运行，前端通过 POST 调用。配合 form action 属性原生支持，自动处理 CSRF。执行后用 revalidatePath/revalidateTag 刷新缓存，页面自动更新，无需手动 refetch。',
    flow: ['用 "use server" 定义服务端函数。', '通过 form action 或编程式调用触发。', '执行后 revalidatePath 刷新缓存，页面自动更新。'],
    notes: ['Server Action 自动 CSRF 防护，参数自动序列化。', 'useFormState 跟踪返回值，useFormStatus 跟踪提交状态。', 'useOptimistic 实现乐观更新，提升交互体验。'],
    problem: '解决"表单提交/数据变更需要写 API 吗、怎么在 Next.js 里做增删改"的问题。',
  },
  {
    id: 'X_11', title: 'Route Handlers API 路由', navTitle: 'API路由', category: '数据',
    path: '/nextjs/x-11/route-handlers', summary: '用 route.ts 定义 REST API，导出 GET/POST 等方法处理 HTTP 请求。',
    demo: X11RouteHandlers,
    code: () => Promise.resolve(`// 基础 GET 请求
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

// 导出对应 HTTP 方法的函数
export async function GET() {
  const posts = [
    { id: 1, title: '第一篇文章' },
    { id: 2, title: '第二篇文章' },
  ]

  // 返回 JSON 响应
  return NextResponse.json(posts)
}

// ============================================

// POST 请求处理
// app/api/posts/route.ts
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // 解析请求体
  const body = await request.json()

  // 处理数据...
  const newPost = {
    id: Date.now(),
    title: body.title,
    content: body.content,
  }

  // 返回 201 状态码
  return NextResponse.json(newPost, { status: 201 })
}

// ============================================

// 动态路由参数
// app/api/posts/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id

  // 根据 ID 查询数据...
  const post = { id, title: \`文章 \${id}\` }

  return NextResponse.json(post)
}

// PUT 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const body = await request.json()

  return NextResponse.json({ id, ...body })
}

// DELETE 删除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  // 删除逻辑...

  return NextResponse.json({ message: \`删除文章 \${id}\` })
}

// ============================================

// 处理查询参数
// app/api/search/route.ts
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // 从 URL 获取查询参数
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const page = searchParams.get('page') || '1'

  return NextResponse.json({
    query,
    page,
    results: [],
  })
}

// ============================================

// 设置响应头和 Cookie
// app/api/login/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // 验证用户...

  // 方式1：通过 cookies() 设置
  const cookieStore = cookies()
  cookieStore.set('session', 'token-123', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 天
  })

  // 方式2：通过 NextResponse 设置
  const response = NextResponse.json({ success: true })
  response.cookies.set('session', 'token-123')

  return response
}

// ============================================

// 自定义响应头
// app/api/data/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const data = { message: 'Hello' }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
      'X-Custom-Header': 'my-value',
    },
  })
}`),
    language: 'jsx',
    principle: 'Route Handler 在 app/api/ 下用 route.ts 定义，每个导出的 HTTP 方法（GET/POST/PUT/DELETE）对应一个处理函数，返回 NextResponse。适合构建 REST API、Webhook、第三方 API 代理，可运行在 Node 或 Edge Runtime。',
    flow: ['在 app/api/xxx/route.ts 导出 HTTP 方法。', '用 NextResponse.json 返回 JSON。', '通过 params 获取动态路由参数。'],
    notes: ['文件名固定为 route.ts，目录层级即 API 路径。', 'GET 可缓存，POST/PUT/DELETE 默认不缓存。', '与 Server Action 区别：Route Handler 是 REST API，Server Action 是表单提交。'],
    problem: '解决"Next.js 怎么写后端 API、Route Handler 和 Server Action 该用哪个"的问题。',
  },
  {
    id: 'X_12', title: '缓存与重新验证', navTitle: '缓存策略', category: '数据',
    path: '/nextjs/x-12/caching', summary: '理解 Data Cache、Full Route Cache、Router Cache、Request Memoization 四层缓存与失效机制。',
    demo: X12Caching,
    code: () => Promise.resolve(`// 1. Request Memoization（请求级去重）
// 同一次渲染中相同 URL 的 fetch 自动去重
async function getPageData() {
  // 两次调用只发一次请求
  const [data1, data2] = await Promise.all([
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
  ])
  // React 的 cache() 也可以去重非 fetch 函数
  return { data1, data2 }
}

// ============================================

// 2. Data Cache（数据缓存 - 持久化）
// fetch 默认缓存，跨请求共享

// 缓存数据
async function getCachedPosts() {
  // 默认 force-cache，数据持久缓存
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

// 定时重新验证
async function getTimedPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }, // 1 小时
  })
  return res.json()
}

// 按标签缓存
async function getTaggedPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts', 'blog'] },
  })
  return res.json()
}

// ============================================

// 主动失效缓存
// app/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

// 按路径失效
export async function revalidateBlog() {
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page') // 动态路由
}

// 按标签失效（推荐）
export async function revalidatePosts() {
  revalidateTag('posts') // 失效所有带 'posts' 标签的 fetch
}

// ============================================

// 3. Full Route Cache（路由缓存 - 构建/重新生成时）
// 静态渲染的页面 HTML 和 RSC payload 会被缓存
// app/blog/page.tsx

// 整个路由的 revalidate 配置
export const revalidate = 60

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] },
  }).then(r => r.json())

  return <h1>博客 ({posts.length} 篇)</h1>
}

// ============================================

// 4. Router Cache（客户端路由缓存）
// 用户访问过的路由在客户端会话内缓存
// app/components/Navigation.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const router = useRouter()

  function handleRefresh() {
    // 清除客户端 Router Cache 并重新请求服务端
    router.refresh()
  }

  return (
    <nav>
      <Link href="/blog">博客</Link>
      <Link href="/about">关于</Link>
      <button onClick={handleRefresh}>刷新数据</button>
    </nav>
  )
}

// ============================================

// 缓存层级关系（从快到慢）：
// 1. Request Memoization - 单次请求内，生命周期：单次渲染
// 2. Data Cache - 跨请求持久，生命周期：直到 revalidate 或失效
// 3. Full Route Cache - 构建时/ISR，生命周期：直到 revalidate
// 4. Router Cache - 客户端会话，生命周期：30s~5min

// 失效 Data Cache 会级联刷新：
// Data Cache 失效 → Full Route Cache 重新生成 → Router Cache 失效`),
    language: 'jsx',
    principle: 'Next.js 有四层缓存：Request Memoization（单次请求去重）、Data Cache（fetch 结果持久缓存）、Full Route Cache（路由 HTML/RSC 缓存）、Router Cache（客户端已访问路由缓存）。失效 Data Cache 会级联刷新上层。',
    flow: ['认识四层缓存的作用范围与生命周期。', '掌握 revalidatePath/revalidateTag 主动失效。', '理解定时 revalidate（ISR）与 no-store 跳过缓存。'],
    notes: ['Data Cache 是基础，失效它会级联刷新 Full Route 和 Router Cache。', 'Router Cache 在客户端会话内有效（30s~5min），router.refresh() 可清除。', '路由级可用 export const revalidate / dynamic 配置。'],
    problem: '解决"Next.js 到底有几层缓存、数据更新后怎么让缓存失效"的问题。',
  },
  {
    id: 'X_13', title: 'Parallel Routes 并行路由', navTitle: '并行路由', category: '路由进阶',
    path: '/nextjs/x-13/parallel-routes', summary: '用 @ 插槽在布局中并行渲染多个独立子路由，实现仪表盘等复杂布局。',
    demo: X13ParallelRoutes,
    code: () => Promise.resolve(`// 并行路由目录结构：
// app/
//   @analytics/
//     page.tsx
//   @notifications/
//     page.tsx
//   layout.tsx
//   page.tsx

// app/layout.tsx - 布局接收插槽作为 props
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  notifications: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <header>仪表盘</header>
      <div className="main">{children}</div>
      <div className="sidebar">
        {/* 两个插槽并行渲染 */}
        {analytics}
        {notifications}
      </div>
    </div>
  )
}

// ============================================

// app/page.tsx - 主页面（children）
export default function DashboardPage() {
  return <h1>欢迎回来</h1>
}

// ============================================

// app/@analytics/page.tsx - 分析插槽
async function getAnalytics() {
  await new Promise(r => setTimeout(r, 1000))
  return { views: 1234, users: 56 }
}

export default async function AnalyticsPage() {
  const data = await getAnalytics()
  return (
    <div className="analytics">
      <h3>数据分析</h3>
      <p>访问量: {data.views}</p>
      <p>用户数: {data.users}</p>
    </div>
  )
}

// ============================================

// app/@notifications/page.tsx - 通知插槽
async function getNotifications() {
  await new Promise(r => setTimeout(r, 1500))
  return [{ id: 1, text: '新消息' }, { id: 2, text: '系统更新' }]
}

export default async function NotificationsPage() {
  const notifications = await getNotifications()
  return (
    <div className="notifications">
      <h3>通知中心</h3>
      <ul>
        {notifications.map(n => (
          <li key={n.id}>{n.text}</li>
        ))}
      </ul>
    </div>
  )
}

// ============================================

// default.tsx - 插槽未匹配时的默认内容
// app/@notifications/default.tsx
export default function DefaultNotifications() {
  return <div className="notifications-default">暂无通知</div>
}

// ============================================

// loading.tsx - 每个插槽独立的加载状态
// app/@analytics/loading.tsx
export default function AnalyticsLoading() {
  return <div className="skeleton">加载分析数据...</div>
}

// ============================================

// 条件渲染插槽
// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const isModalOpen = false // 根据条件判断

  return (
    <>
      {children}
      {/* 只有条件满足时才渲染 modal 插槽 */}
      {isModalOpen && modal}
    </>
  )
}`),
    language: 'jsx',
    principle: 'Parallel Routes 用 @ 前缀目录定义插槽，插槽作为 props 传入 layout，可并行渲染多个独立子路由。每个插槽有独立的加载和错误状态，default.tsx 提供未匹配时的默认内容，适合仪表盘多面板布局。',
    flow: ['用 @folder 定义插槽，在 layout 中接收对应 prop。', '理解 default.tsx 在插槽未匹配时的兜底作用。', '配合 Intercepting Routes 实现模态框。'],
    notes: ['插槽名即 prop 名：@sidebar → layout 的 sidebar prop。', '每个插槽可独立流式加载（各自的 loading.tsx）。', '插槽不参与 URL 路径，只影响布局渲染。'],
    problem: '解决"一个布局里要同时展示多个独立数据块、怎么并行渲染"的问题。',
  },
  {
    id: 'X_14', title: 'Intercepting Routes 拦截路由', navTitle: '拦截路由', category: '路由进阶',
    path: '/nextjs/x-14/intercepting-routes', summary: '用 (.) (..) (...) 拦截路由，实现客户端导航弹窗、直接访问全屏的体验。',
    demo: X14InterceptingRoutes,
    code: () => Promise.resolve(`// 拦截路由目录结构：
// app/
//   photo/
//     [id]/
//       page.tsx    - 真实页面（直接访问时显示）
//   @modal/
//     (.)photo/
//       [id]/
//         page.tsx  - 拦截版本（客户端导航时显示）
//     default.tsx
//   layout.tsx

// app/layout.tsx - 布局包含 modal 插槽
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}

// ============================================

// app/photo/[id]/page.tsx - 真实页面（全屏）
// 直接访问 /photo/123 时显示这个
export default function PhotoPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="photo-fullscreen">
      <h1>照片 #{params.id}</h1>
      <img src={\`/photos/\${params.id}.jpg\`} alt="" />
      <p>这是全屏页面，直接访问 URL 时看到</p>
    </div>
  )
}

// ============================================

// app/@modal/(.)photo/[id]/page.tsx - 拦截版本（弹窗）
// 客户端导航到 /photo/123 时显示这个（弹窗形式）
'use client'

import { useRouter } from 'next/navigation'

export default function PhotoModal({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()

  function close() {
    router.back() // 后退，URL 恢复
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>照片 #{params.id}</h2>
        <img src={\`/photos/\${params.id}.jpg\`} alt="" />
        <button onClick={close}>关闭</button>
      </div>
    </div>
  )
}

// ============================================

// app/@modal/default.tsx - 默认不显示弹窗
export default function Default() {
  return null
}

// ============================================

// 拦截符号说明：
// (.)     - 同级拦截（同一目录下的路由）
// (..)    - 上级目录拦截
// (..)(..) - 上两级目录拦截
// (...)   - 根目录拦截

// 目录示例：
// app/
//   shop/
//     [id]/page.tsx          - /shop/123
//   @modal/
//     (.)shop/
//       [id]/page.tsx        - 拦截 /shop/123（同级）
//     (..)products/
//       [id]/page.tsx        - 拦截 /products/456（上级）

// ============================================

// 列表页 - 点击图片触发客户端导航
// app/photos/page.tsx
import Link from 'next/link'

async function getPhotos() {
  return [
    { id: '1', title: '风景' },
    { id: '2', title: '人物' },
    { id: '3', title: '建筑' },
  ]
}

export default async function PhotosPage() {
  const photos = await getPhotos()

  return (
    <div className="photo-grid">
      {photos.map(photo => (
        <Link key={photo.id} href={\`/photo/\${photo.id}\`}>
          <img src={\`/photos/\${photo.id}.jpg\`} alt={photo.title} />
          <p>{photo.title}</p>
        </Link>
      ))}
    </div>
  )
}`),
    language: 'jsx',
    principle: 'Intercepting Routes 用 (.) (..) (...) 前缀拦截其他路由：客户端导航时命中拦截版（如弹窗），直接访问 URL 时命中真实版（如全屏）。同一 URL 两种体验，既流畅又可分享，常配合 Parallel Routes 的 Modal 插槽。',
    flow: ['理解 (.) (..) (...) 拦截符号的层级含义。', '在子目录创建拦截版页面（如弹窗）。', '配合 Parallel Routes Modal 插槽实现弹窗。'],
    notes: ['(.) 同级、(..) 上级、(...) 根级拦截。', '拦截路由的 URL 与真实路由相同，刷新命中真实版。', '浏览器后退回到来源页，弹窗自动关闭。'],
    problem: '解决"点击图片想弹窗展示、直接访问又要是全屏页、怎么兼顾"的问题。',
  },
  {
    id: 'X_15', title: 'Route Groups 与私有文件夹', navTitle: '路由组', category: '路由进阶',
    path: '/nextjs/x-15/route-groups', summary: '用 (group) 路由组组织代码、切换布局，用 _folder 私有文件夹存放不参与路由的内容。',
    demo: X15RouteGroups,
    code: () => Promise.resolve(`// 路由组目录结构：
// app/
//   (marketing)/
//     layout.tsx    - 营销站布局
//     page.tsx      - /
//     about/
//       page.tsx    - /about
//   (dashboard)/
//     layout.tsx    - 后台布局
//     page.tsx      - /dashboard（注意：路由组不影响 URL）
//     settings/
//       page.tsx    - /dashboard/settings

// ============================================

// app/(marketing)/layout.tsx - 营销布局
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="marketing">
      <nav className="marketing-nav">
        <a href="/">首页</a>
        <a href="/about">关于</a>
      </nav>
      {children}
      <footer>营销页底部</footer>
    </div>
  )
}

// app/(marketing)/page.tsx - 首页（URL: /）
export default function HomePage() {
  return <h1>欢迎来到我们的产品</h1>
}

// app/(marketing)/about/page.tsx - 关于页（URL: /about）
export default function AboutPage() {
  return <h1>关于我们</h1>
}

// ============================================

// app/(dashboard)/layout.tsx - 后台布局
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <aside>
        <nav>
          <a href="/dashboard">概览</a>
          <a href="/dashboard/settings">设置</a>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  )
}

// app/(dashboard)/page.tsx - 后台首页（URL: /dashboard）
export default function DashboardPage() {
  return <h1>仪表盘</h1>
}

// app/(dashboard)/settings/page.tsx - 设置页（URL: /dashboard/settings）
export default function SettingsPage() {
  return <h1>设置</h1>
}

// ============================================

// 私有文件夹 - 存放内部组件，不生成路由
// 目录结构：
// app/
//   _components/         - 私有组件文件夹
//     Button.tsx
//     Card.tsx
//   _lib/                - 私有工具函数
//     utils.ts
//   _hooks/              - 私有 hooks
//     useTheme.ts
//   page.tsx

// ============================================

// app/_components/Button.tsx - 私有组件
'use client'

export function Button({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  )
}

// ============================================

// 在页面中使用私有组件
// app/page.tsx
import { Button } from './_components/Button'

export default function HomePage() {
  return (
    <div>
      <h1>首页</h1>
      <Button>点击我</Button>
    </div>
  )
}

// ============================================

// 命名约定总结：
// [param]     - 动态路由参数
// [...slug]   - Catch-all 动态路由
// (group)     - 路由组（不影响 URL）
// @slot       - 并行路由插槽
// _folder     - 私有文件夹（不参与路由）
// (.)folder   - 同级拦截路由`),
    language: 'jsx',
    principle: 'Route Groups 用 (folder) 圆括号目录组织代码而不影响 URL，可为一组路由指定独立 layout；私有文件夹用 _folder 下划线前缀，完全不参与路由，适合存放内部组件和工具函数。',
    flow: ['用 (group) 组织代码、切换布局且不影响 URL。', '用 _folder 存放不参与路由的内部组件/工具。', '区分 [param] 动态、@slot 并行、(group) 路由组、_private 私有。'],
    notes: ['路由组可让同一 URL 有不同布局（如营销页 vs 后台）。', '私有文件夹内的 page.tsx 不会生成路由。', '路由组不能与同名路由组冲突（会报 URL 冲突错误）。'],
    problem: '解决"怎么给一组路由单独布局而不改 URL、内部组件怎么放才不会误生成路由"的问题。',
  },
  {
    id: 'X_16', title: 'Loading 与 Error UI', navTitle: '加载错误', category: '路由进阶',
    path: '/nextjs/x-16/loading-error', summary: '用 loading.tsx / error.tsx / not-found.tsx / global-error.tsx 约定加载、错误和 404 状态。',
    demo: X16LoadingError,
    code: () => Promise.resolve(`// 1. loading.tsx - 路由级加载状态
// app/dashboard/loading.tsx
// 自动包裹 page.tsx，导航时显示
export default function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>加载中...</p>
    </div>
  )
}

// 等价于：
// <Suspense fallback={<Loading />}>
//   <Page />
// </Suspense>

// ============================================

// 2. error.tsx - 错误边界（必须是 Client Component）
// app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到监控服务
    console.error('Dashboard 错误:', error)
  }, [error])

  return (
    <div className="error-boundary">
      <h2>出错了</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>
        重试
      </button>
    </div>
  )
}

// 注意：error.tsx 不捕获同级 layout 的错误

// ============================================

// 3. not-found.tsx - 404 页面
// app/dashboard/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>页面未找到</h2>
      <p>您访问的仪表盘页面不存在</p>
      <Link href="/dashboard">返回仪表盘</Link>
    </div>
  )
}

// 全局 404
// app/not-found.tsx
import Link from 'next/link'

export default function GlobalNotFound() {
  return (
    <div className="global-404">
      <h1>404</h1>
      <p>页面走丢了</p>
      <Link href="/">返回首页</Link>
    </div>
  )
}

// ============================================

// 主动触发 404
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation'

async function getPost(id: string) {
  // 模拟数据库查询
  const posts: Record<string, any> = {
    '1': { id: '1', title: '文章一' },
    '2': { id: '2', title: '文章二' },
  }
  return posts[id] || null
}

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id)

  if (!post) {
    // 主动渲染最近的 not-found.tsx
    notFound()
  }

  return <h1>{post.title}</h1>
}

// ============================================

// 4. global-error.tsx - 全局错误兜底
// app/global-error.tsx
// 捕获根 layout 中的错误
'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('全局错误:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="global-error">
          <h2>发生了严重错误</h2>
          <button onClick={() => reset()}>刷新页面</button>
        </div>
      </body>
    </html>
  )
}

// 注意：global-error.tsx 必须自带 html 和 body 标签
// 因为根布局可能已经出错了`),
    language: 'jsx',
    principle: 'loading.tsx 自动创建 Suspense 边界包裹 page；error.tsx 捕获子组件错误（必须是 Client Component，提供 reset 重试）；not-found.tsx 处理 404；global-error.tsx 是根 layout 出错时的兜底，需自带 html/body。错误就近匹配、向上冒泡。',
    flow: ['用 loading.tsx 自动包裹路由级 Suspense。', '用 error.tsx 捕获错误并提供 reset 重试。', '理解 global-error 兜底根 layout 错误。'],
    notes: ['error.tsx 必须是 Client Component（需要 reset 交互）。', 'error.tsx 不捕获同级 layout 的错误，需 global-error.tsx。', 'not-found() 函数可主动触发 404 页面。'],
    problem: '解决"页面加载中、出错、404 时分别该显示什么、怎么用文件约定处理"的问题。',
  },
  {
    id: 'X_17', title: 'next/image 图片优化', navTitle: '图片优化', category: '优化',
    path: '/nextjs/x-17/next-image', summary: '用 next/Image 自动优化图片格式、尺寸、懒加载，消除布局抖动。',
    demo: X17NextImage,
    code: () => Promise.resolve(`// 基础用法 - 本地图片
// app/page.tsx
import Image from 'next/image'
import profilePic from './profile.jpg' // 导入本地图片

export default function Page() {
  return (
    <div>
      <h1>我的头像</h1>
      {/* 本地图片自动获取宽高，防止 CLS */}
      <Image
        src={profilePic}
        alt="头像"
        // width 和 height 会自动从导入的图片获取
        placeholder="blur" // 模糊占位
      />
    </div>
  )
}

// ============================================

// 远程图片 - 需要配置域名白名单
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig

// 使用远程图片
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://images.example.com/photos/1.jpg"
      alt="示例图片"
      width={800}
      height={600}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}

// ============================================

// fill 属性 - 填充父容器
import Image from 'next/image'

export default function Page() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Image
        src="/hero.jpg"
        alt="Hero 图片"
        fill
        style={{ objectFit: 'cover' }}
        priority // 首屏关键图片，预加载
      />
    </div>
  )
}

// ============================================

// 响应式图片 - sizes 属性
import Image from 'next/image'

export default function PhotoGallery() {
  return (
    <div className="photo-grid">
      <Image
        src="/photo.jpg"
        alt="照片"
        width={1200}
        height={800}
        // 告诉浏览器不同视口下图片的显示宽度
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="photo"
      />
    </div>
  )
}

// ============================================

// priority 属性 - 首屏 LCP 图片
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="hero">
      <Image
        src="/hero-image.jpg"
        alt="主图"
        width={1920}
        height={1080}
        priority // 优先加载，提升 LCP
        sizes="100vw"
      />
    </section>
  )
}

// ============================================

// 占位符
import Image from 'next/image'

export default function PhotoCard() {
  return (
    <Image
      src="/photo.jpg"
      alt="照片"
      width={400}
      height={300}
      placeholder="blur" // 低质量模糊占位
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // 可选：自定义 blur 图
    />
  )
}

// 本地图片导入会自动生成 blurDataURL`),
    language: 'jsx',
    principle: 'next/image 自动按设备生成合适尺寸的 WebP/AVIF，默认懒加载，通过 width/height 或 fill 防止 CLS。本地图片需 import（自带尺寸），远程图片需在 next.config.js 配置域名白名单。priority 属性用于首屏 LCP 图片预加载。',
    flow: ['本地图片用 import 引入，远程图片配置域名白名单。', '指定 width/height 或用 fill 防止布局抖动。', '首屏图片加 priority 预加载。'],
    notes: ['sizes 属性配合 srcset 生成响应式多档图片。', 'placeholder="blur" 生成低质量模糊占位符。', '远程图片不配域名会报错，需 remotePatterns。'],
    problem: '解决"图片加载慢、格式大、会抖动、怎么自动优化"的问题。',
  },
  {
    id: 'X_18', title: 'next/font 字体优化', navTitle: '字体优化', category: '优化',
    path: '/nextjs/x-18/next-font', summary: '用 next/font 自托管字体，消除布局抖动，避免第三方 CDN 请求。',
    demo: X18NextFont,
    code: () => Promise.resolve(`// Google Fonts - 自动自托管
// app/layout.tsx
import './globals.css'
import { Inter, Noto_Sans_SC } from 'next/font/google'

// 加载 Inter 字体
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// 加载思源黑体
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={\`\${inter.variable} \${notoSansSC.variable}\`}>
      <body>{children}</body>
    </html>
  )
}

// ============================================

// 在 CSS 中使用
/* app/globals.css */
// :root {
//   --font-inter: 'Inter', sans-serif;
//   --font-noto-sans-sc: 'Noto Sans SC', sans-serif;
// }
//
// body {
//   font-family: var(--font-inter), var(--font-noto-sans-sc), sans-serif;
// }

// ============================================

// 本地字体 - next/font/local
// app/layout.tsx
import './globals.css'
import localFont from 'next/font/local'

// 加载本地字体文件
const myFont = localFont({
  src: [
    {
      path: './fonts/MyFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/MyFont-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-my',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={myFont.variable}>
      <body>{children}</body>
    </html>
  )
}

// ============================================

// 在组件中使用字体类名
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export default function Page() {
  return (
    <div className={roboto.className}>
      <h1>使用 Roboto 字体</h1>
      <p>这段文字使用 Roboto 字体渲染</p>
    </div>
  )
}

// ============================================

// display 选项说明：
// - 'swap'（推荐）：先用 fallback 字体，加载完再切换
// - 'auto'：浏览器默认行为
// - 'block'：短暂隐藏文本（FOIT）
// - 'fallback'：极短隐藏期，然后 swap
// - 'optional'：极短隐藏期，加载失败用 fallback

// ============================================

// 预加载子集
// subsets 可以减小字体文件体积
import { Noto_Sans_SC } from 'next/font/google'

const notoSans = Noto_Sans_SC({
  subsets: ['latin'], // 只加载拉丁字符子集
  weight: ['400', '700'],
  display: 'swap',
})

// 完整的中文字体很大，可以考虑：
// 1. 只加载需要的字重
// 2. 使用 latin 子集 + 系统中文字体 fallback
// 3. 用第三方字体服务（如阿里巴巴普惠体）配合 next/font/local`),
    language: 'jsx',
    principle: 'next/font 在构建时下载字体并自托管，无第三方请求，用 size-adjust 消除 FOUT/FOIT 布局抖动。支持 Google Fonts 和本地字体，生成 CSS 变量方便引用，display: swap 先用 fallback 再平滑切换。',
    flow: ['用 next/font/google 或 next/font/local 加载字体。', '通过 variable 生成 CSS 变量。', '在 globals.css 中引用变量。'],
    notes: ['字体文件构建时下载自托管，不向 Google 发请求（隐私友好）。', 'display: swap 先显示 fallback 再切换，避免文字不可见。', '自动 subset 减小字体文件体积。'],
    problem: '解决"用 Google 字体向第三方泄露用户信息、字体切换导致布局抖动"的问题。',
  },
  {
    id: 'X_19', title: 'next/link 与导航', navTitle: '链接导航', category: '优化',
    path: '/nextjs/x-19/next-link', summary: '掌握 Link 客户端导航、useRouter 编程式跳转、redirect 服务端重定向等导航 API。',
    demo: X19NextLink,
    code: () => Promise.resolve(`// 基础 Link 用法
// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <nav>
      {/* 基本链接 */}
      <Link href="/about">关于我们</Link>

      {/* 动态路由 */}
      <Link href="/posts/123">文章详情</Link>

      {/* 带查询参数 */}
      <Link href="/search?q=nextjs">搜索 Next.js</Link>

      {/* 外部链接 - 用原生 a 标签 */}
      <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
        Next.js 官网
      </a>
    </nav>
  )
}

// ============================================

// Link 的高级属性
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      {/* prefetch 控制预取行为 */}
      <Link href="/dashboard" prefetch={true}>
        仪表盘（进入视口即预取）
      </Link>

      <Link href="/settings" prefetch={false}>
        设置（点击时才预取）
      </Link>

      {/* 替换当前历史记录 */}
      <Link href="/dashboard" replace>
        返回仪表盘（不留下历史记录）
      </Link>

      {/* 滚动到顶部 */}
      <Link href="/blog" scroll={true}>
        博客（默认滚动到顶部）
      </Link>
    </nav>
  )
}

// ============================================

// useRouter - 编程式导航（Client Component）
'use client'

import { useRouter } from 'next/navigation'

export function NavigationButtons() {
  const router = useRouter()

  function goToDashboard() {
    // 跳转到新页面
    router.push('/dashboard')
  }

  function replaceToSettings() {
    // 替换当前历史记录
    router.replace('/settings')
  }

  function goBack() {
    // 后退
    router.back()
  }

  function goForward() {
    // 前进
    router.forward()
  }

  function refresh() {
    // 刷新当前路由（清除 Router Cache）
    router.refresh()
  }

  return (
    <div>
      <button onClick={goToDashboard}>去仪表盘</button>
      <button onClick={replaceToSettings}>替换为设置页</button>
      <button onClick={goBack}>后退</button>
      <button onClick={goForward}>前进</button>
      <button onClick={refresh}>刷新</button>
    </div>
  )
}

// ============================================

// usePathname - 获取当前路径
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  )
}

// ============================================

// useSearchParams - 获取查询参数
'use client'

import { useSearchParams } from 'next/navigation'

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const page = searchParams.get('page') || '1'

  return (
    <div>
      <h1>搜索结果: {query}</h1>
      <p>第 {page} 页</p>
    </div>
  )
}

// ============================================

// redirect - 服务端重定向
// app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function DashboardPage() {
  const cookieStore = cookies()
  const session = cookieStore.get('session')

  if (!session) {
    // 服务端重定向到登录页
    redirect('/login')
  }

  return <h1>仪表盘</h1>
}

// ============================================

// permanentRedirect - 永久重定向（308）
import { permanentRedirect } from 'next/navigation'

export default function OldPage() {
  permanentRedirect('/new-page')
}`),
    language: 'jsx',
    principle: 'Link 实现客户端导航并自动预取目标路由 RSC payload；useRouter 提供 push/replace/back/refresh 编程式导航；redirect 在服务端重定向。App Router 的导航 API 从 next/navigation 导入（非 next/router）。',
    flow: ['用 Link 实现客户端导航 + 自动预取。', '用 useRouter 编程式跳转（需 Client Component）。', '用 redirect 服务端重定向。'],
    notes: ['Link 默认 prefetch：静态路由进视口即预取，动态路由点击时预取。', 'usePathname/useSearchParams 从 next/navigation 导入。', 'redirect 在 Server Component / Server Action / Route Handler 中可用。'],
    problem: '解决"怎么在 Next.js 里做页面跳转、编程式导航和服务端重定向"的问题。',
  },
  {
    id: 'X_20', title: 'Metadata 与 SEO', navTitle: 'Metadata', category: '优化',
    path: '/nextjs/x-20/metadata', summary: '用 Metadata API（静态 metadata + 动态 generateMetadata）管理 title、description、OG 等 SEO 元信息。',
    demo: X20Metadata,
    code: () => Promise.resolve(`// 静态 metadata - 导出 metadata 对象
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的网站',
  description: '这是一个用 Next.js 构建的网站',
  keywords: ['Next.js', 'React', 'TypeScript'],
  authors: [{ name: '作者名' }],
  openGraph: {
    title: '我的网站',
    description: '欢迎访问我的网站',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '我的网站',
    description: '欢迎访问我的网站',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

// ============================================

// 标题模板 - 子页面自动拼接父模板
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: '我的网站',
    template: '%s | 我的网站', // %s 被子页面标题替换
  },
  description: '默认描述',
}

// app/about/page.tsx
export const metadata: Metadata = {
  title: '关于我们', // 最终显示：关于我们 | 我的网站
  description: '了解我们的团队和使命',
}

// ============================================

// 动态 generateMetadata
// app/posts/[slug]/page.tsx
import type { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

// 动态生成 metadata
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const post = await fetch(\`https://api.example.com/posts/\${params.slug}\`)
    .then(res => res.json())

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const post = await fetch(\`https://api.example.com/posts/\${params.slug}\`)
    .then(res => res.json())

  return <article>{post.content}</article>
}

// ============================================

// 文件约定的元数据
// 在 app/ 目录下放置特定文件自动生成 metadata：
// - favicon.ico / favicon.png / favicon.svg
// - icon.png / icon.jpg / icon.svg (应用图标)
// - apple-icon.png / apple-icon.jpg (iOS 图标)
// - opengraph-image.png / og-image.png (OG 图)
// - twitter-image.png (Twitter 卡片图)
// - robots.txt (爬虫规则)
// - sitemap.xml (站点地图)

// ============================================

// 动态生成 sitemap
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://example.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
}

// ============================================

// 动态生成 robots.txt
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}

// ============================================

// 动态 OG 图片生成
// app/posts/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  return [
    {
      contentType: 'image/png',
      size: { width: 1200, height: 630 },
      id: params.slug,
    },
  ]
}

export default async function Image({
  params,
}: {
  params: { slug: string }
}) {
  return new ImageResponse(
    (
      <div style={{ fontSize: 60, color: 'white', background: 'black', padding: '50px' }}>
        <h1>{params.slug}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}`),
    language: 'jsx',
    principle: 'App Router 用 Metadata API 取代 Pages Router 的 next/head：导出 metadata 对象（静态）或 generateMetadata 函数（动态）。还支持文件约定（favicon/icon/opengraph-image）和 sitemap.ts/robots.ts 动态生成，子页面 metadata 覆盖父级。',
    flow: ['用 metadata 对象设置静态 title/description。', '用 generateMetadata 按参数动态生成。', '用 sitemap.ts/robots.ts 动态生成站点地图和爬虫规则。'],
    notes: ['title.template 让子页标题自动拼接父模板（如 "%s | 小松鼠"）。', 'opengraph-image.tsx 用 ImageResponse 动态生成 OG 图。', 'metadata 自动去重，子页面同名字段覆盖父级。'],
    problem: '解决"App Router 怎么管理 SEO 元信息、动态页面怎么设置 title"的问题。',
  },
  {
    id: 'X_21', title: 'Middleware 中间件', navTitle: '中间件', category: '工程',
    path: '/nextjs/x-21/middleware', summary: '用 middleware.ts 在请求到达路由前执行认证、重定向、A/B 测试等逻辑。',
    demo: X21Middleware,
    code: () => Promise.resolve(`// middleware.ts - 放在项目根目录或 src/ 下
import { NextResponse, type NextRequest } from 'next/server'

// 基础中间件 - 每个请求都会执行
export function middleware(request: NextRequest) {
  // 可以修改请求、重定向、重写、改响应头等
  console.log('请求路径:', request.nextUrl.pathname)

  // 继续执行
  return NextResponse.next()
}

// ============================================

// 认证重定向
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 获取 session cookie
  const session = request.cookies.get('session')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  // 未登录且访问需要认证的页面 → 重定向到登录页
  if (!session && !isAuthPage && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 已登录但访问登录页 → 重定向到仪表盘
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// ============================================

// A/B 测试 - 重写路径
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 只对首页做 A/B 测试
  if (request.nextUrl.pathname !== '/') {
    return NextResponse.next()
  }

  // 从 cookie 读取已分配的版本
  const variant = request.cookies.get('ab-variant')?.value

  // 新用户随机分配
  let newVariant = variant
  if (!newVariant) {
    newVariant = Math.random() < 0.5 ? 'a' : 'b'
  }

  // 重写到对应版本的页面
  const response = NextResponse.rewrite(
    new URL(\`/variant/\${newVariant}\`, request.url)
  )

  // 新用户设置 cookie
  if (!variant) {
    response.cookies.set('ab-variant', newVariant)
  }

  return response
}

// ============================================

// i18n 语言检测
import { NextResponse, type NextRequest } from 'next/server'

const locales = ['zh', 'en', 'ja']
const defaultLocale = 'zh'

function getLocale(request: NextRequest): string {
  // 优先从 cookie 读取
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // 其次从 Accept-Language 头检测
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0].toLowerCase()
    if (locales.includes(preferred)) {
      return preferred
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 检查路径是否已经包含 locale
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(\`/\${locale}\`) && pathname !== \`/\${locale}\`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(\`/\${locale}\${pathname === '/' ? '' : pathname}\`, request.url)
    )
  }

  return NextResponse.next()
}

// ============================================

// 设置请求头（供下游 Server Component 读取）
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 克隆请求头
  const requestHeaders = new Headers(request.headers)

  // 添加自定义头
  requestHeaders.set('x-custom-path', request.nextUrl.pathname)

  // 传递给下游
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Server Component 中读取
// import { headers } from 'next/headers'
// const customPath = headers().get('x-custom-path')

// ============================================

// matcher 配置 - 限定中间件执行路径
export const config = {
  // 只匹配这些路径
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
  ],
  // 或者排除静态资源
  // matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}`),
    language: 'jsx',
    principle: 'Middleware 在每个请求、缓存前运行（Edge Runtime），可重写、重定向、改请求头/响应头。文件放在项目根或 src/ 下的 middleware.ts。用 matcher 限定匹配路径提升性能，适合认证鉴权、i18n、A/B 测试、灰度发布。',
    flow: ['在项目根创建 middleware.ts。', '用 NextResponse.redirect/next 重定向或放行。', '用 matcher 限定执行路径。'],
    notes: ['Middleware 运行在 Edge Runtime，不能用 Node API，依赖需兼容 Edge。', 'matcher 排除静态资源避免无谓执行。', '可注入请求头供下游 Server Component 读取。'],
    problem: '解决"如何在路由执行前统一做鉴权、重定向、A/B 测试"的问题。',
  },
  {
    id: 'X_22', title: '环境变量与 next.config', navTitle: '环境配置', category: '工程',
    path: '/nextjs/x-22/env-config', summary: '掌握 NEXT_PUBLIC_ 前缀规则、env 文件优先级和 next.config.js 核心配置项。',
    demo: X22EnvConfig,
    code: () => Promise.resolve(`// .env.local - 本地环境变量（不提交到 git）
// 仅服务端可用的变量（无 NEXT_PUBLIC_ 前缀）
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
SECRET_KEY=your-secret-key-here
API_KEY=sk-xxxxxxxxxxxxxxxx

// 客户端可用的变量（NEXT_PUBLIC_ 前缀）
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

// ============================================

// .env.development - 开发环境
NODE_ENV=development
NEXT_PUBLIC_API_BASE=http://localhost:3000/api

// .env.production - 生产环境
NODE_ENV=production
NEXT_PUBLIC_API_BASE=https://api.example.com

// ============================================

// env 文件优先级（从高到低）：
// 1. .env.local - 本地覆盖（最高优先级）
// 2. .env.[environment] - 环境特定（development/production）
// 3. .env - 默认值（最低优先级）

// ============================================

// 服务端使用环境变量
// app/lib/db.ts
import { PrismaClient } from '@prisma/client'

// 直接使用，不会暴露到客户端
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// ============================================

// 客户端使用环境变量
// 必须有 NEXT_PUBLIC_ 前缀
'use client'

export function Analytics() {
  // NEXT_PUBLIC_ 前缀的变量可以在客户端使用
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID

  return (
    <div>
      <p>Analytics ID: {analyticsId}</p>
    </div>
  )
}

// ============================================

// next.config.js - 完整配置示例
/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 严格模式
  reactStrictMode: true,

  // 图片配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // 重写规则
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ]
  },

  // 重定向规则
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true, // 308 永久重定向
      },
    ]
  },

  // 自定义页面扩展名
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // 输出模式
  // output: 'standalone', // Node.js 自托管
  // output: 'export',     // 纯静态导出
  // output: undefined,    // 默认（Node.js 服务）

  // 压缩
  compress: true,

  // 构建指示器
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
}

module.exports = nextConfig

// ============================================

// output: 'standalone' - 独立部署
// 构建时生成最小化的 node_modules，方便 Docker 部署
// 需要手动复制静态资源和 public 目录

// output: 'export' - 纯静态导出
// 生成完全静态的 HTML 文件，可部署到任何静态托管
// 限制：不支持 Server Actions、Middleware、Image Optimization、API Routes

// ============================================

// 在 next.config.js 中使用环境变量
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // 也可以在这里定义，但推荐用 .env 文件
    CUSTOM_VAR: 'value',
  },
}

// 更推荐的方式：用 .env.local 文件管理敏感配置
// .env.local 会被 git 忽略，不要提交到仓库`),
    language: 'jsx',
    principle: '环境变量加 NEXT_PUBLIC_ 前缀则客户端可见（打包进 bundle），无前缀仅服务端可用。env 文件优先级：.env.local > .env.[环境] > .env。next.config.js 集中配置 reactStrictMode、images、rewrites、redirects、output 等。',
    flow: ['用 NEXT_PUBLIC_ 前缀区分客户端/服务端环境变量。', '理解 .env.local 覆盖优先级。', '在 next.config.js 配置图片域名、重写、导出模式。'],
    notes: ['密钥绝不加 NEXT_PUBLIC_，否则泄露到前端 bundle。', '.env.local 被 gitignore，放本地敏感配置。', 'output: "standalone" 生成独立部署包，"export" 纯静态导出。'],
    problem: '解决"环境变量怎么分客户端和服务端、next.config.js 能配什么"的问题。',
  },
  {
    id: 'X_23', title: '国际化 i18n', navTitle: '国际化', category: '工程',
    path: '/nextjs/x-23/i18n', summary: '用 App Router 的 [lang] 动态路由 + middleware 语言检测实现多语言站点。',
    demo: X23I18n,
    code: () => Promise.resolve(`// 目录结构：
// app/
//   [lang]/
//     layout.tsx
//     page.tsx
//     about/
//       page.tsx
// middleware.ts
// i18n/
//   config.ts
//   dictionaries/
//     zh.json
//     en.json

// ============================================

// i18n/config.ts - 语言配置
export const i18n = {
  defaultLocale: 'zh',
  locales: ['zh', 'en', 'ja'],
} as const

export type Locale = typeof i18n.locales[number]

// ============================================

// i18n/dictionaries/zh.json
{
  "home": {
    "title": "欢迎来到我们的网站",
    "description": "这是一个 Next.js 多语言示例"
  },
  "nav": {
    "home": "首页",
    "about": "关于",
    "contact": "联系我们"
  }
}

// i18n/dictionaries/en.json
{
  "home": {
    "title": "Welcome to our website",
    "description": "This is a Next.js i18n example"
  },
  "nav": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  }
}

// ============================================

// i18n/get-dictionary.ts - 字典加载
import 'server-only'
import type { Locale } from './config'

const dictionaries = {
  zh: () => import('./dictionaries/zh.json').then(m => m.default),
  en: () => import('./dictionaries/en.json').then(m => m.default),
  ja: () => import('./dictionaries/ja.json').then(m => m.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.zh()
}

// ============================================

// app/[lang]/layout.tsx - 布局
import type { Metadata } from 'next'
import { i18n } from '@/i18n/config'

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  )
}

// 动态 metadata
export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const titles: Record<string, string> = {
    zh: '我的网站',
    en: 'My Website',
    ja: '私のウェブサイト',
  }

  return {
    title: titles[params.lang] || titles.zh,
  }
}

// ============================================

// app/[lang]/page.tsx - 首页
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'

export default async function HomePage({
  params,
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(params.lang)

  return (
    <main>
      <h1>{dict.home.title}</h1>
      <p>{dict.home.description}</p>
    </main>
  )
}

// ============================================

// Client Component 中使用翻译
// app/[lang]/components/LanguageSwitcher.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { i18n } from '@/i18n/config'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLang = e.target.value
    // 替换路径中的语言前缀
    const segments = pathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
  }

  return (
    <select onChange={handleChange} defaultValue={pathname.split('/')[1]}>
      {i18n.locales.map(locale => (
        <option key={locale} value={locale}>
          {locale === 'zh' ? '中文' : locale === 'en' ? 'English' : '日本語'}
        </option>
      ))}
    </select>
  )
}

// ============================================

// middleware.ts - 自动语言检测
import { NextResponse, type NextRequest } from 'next/server'
import { i18n } from './i18n/config'

function getLocale(request: NextRequest): string {
  // 从 cookie 读取
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale
  }

  // 从 Accept-Language 检测
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0].slice(0, 2)
    if (i18n.locales.includes(preferred as any)) {
      return preferred
    }
  }

  return i18n.defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 检查路径是否已有 locale
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(\`/\${locale}\`) && pathname !== \`/\${locale}\`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(\`/\${locale}\${pathname === '/' ? '' : pathname}\`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}`),
    language: 'jsx',
    principle: 'App Router 推荐用 [lang] 动态路由实现 i18n：每种语言独立 URL（SEO 友好），middleware 根据 Accept-Language 自动检测重定向，字典按需 import 加载。配合 hreflang 标签和 Intl API 处理复数/日期格式。',
    flow: ['用 [lang] 动态路由为每种语言生成独立 URL。', 'middleware 根据 Accept-Language 自动重定向。', '按需 import 字典，用 Context 下发翻译函数。'],
    notes: ['每种语言独立 URL 利于 SEO，配合 hreflang 标签。', '字典按需 import 避免全量打包。', 'next-intl 是社区流行的 App Router i18n 方案。'],
    problem: '解决"App Router 怎么做多语言、怎么自动检测用户语言"的问题。',
  },
  {
    id: 'X_24', title: '部署与 Vercel', navTitle: '部署', category: '工程',
    path: '/nextjs/x-24/deployment', summary: '掌握 Vercel、Node 自托管、Docker、静态导出四种部署目标的特点与配置。',
    demo: X24Deployment,
    code: () => Promise.resolve(`// 1. Vercel 部署（推荐）
// 零配置，支持所有 Next.js 特性
// 步骤：
// 1. 连接 Git 仓库（GitHub/GitLab/Bitbucket）
// 2. 配置环境变量
// 3. 自动部署，每次 push 自动更新

// vercel.json - 可选配置
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}

// ============================================

// 2. Node.js 自托管（output: 'standalone'）
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 生成独立部署包
}

module.exports = nextConfig

// 构建命令：
// pnpm next build
// 生成的 .next/standalone/ 目录可独立运行
// 需要复制 public/ 和 .next/static/ 到对应位置

// 启动命令：
// node server.js
// 或
// node .next/standalone/server.js

// ============================================

// 3. Docker 部署
// Dockerfile
FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

# 构建
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm next build

# 运行
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制 standalone 输出
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]

// .dockerignore
node_modules
.next
.git
.env.local
.env*.local

// ============================================

// 4. 静态导出（output: 'export'）
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 纯静态导出
  images: {
    unoptimized: true, // 静态导出需要关闭图片优化
  },
}

module.exports = nextConfig

// 构建命令：
// pnpm next build
// 生成 out/ 目录，包含所有静态文件

// 部署：
// 把 out/ 目录上传到任何静态托管服务
// Vercel / Netlify / GitHub Pages / Cloudflare Pages / Nginx

// 静态导出限制：
// - 不支持 Server Components 的动态特性
// - 不支持 Server Actions
// - 不支持 Middleware
// - 不支持 Image Optimization（需 unoptimized: true）
// - 不支持 Route Handlers（API Routes）
// - 不支持 Incremental Static Regeneration

// ============================================

// 环境变量配置
// .env.production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@db:5432/mydb
SECRET_KEY=your-production-secret-key

// Vercel 上在 Settings → Environment Variables 配置
// 其他平台在对应的环境变量管理界面配置

// ============================================

// Nginx 反向代理配置（Node.js 自托管）
// server {
//   listen 80;
//   server_name yourdomain.com;
//
//   location / {
//     proxy_pass http://localhost:3000;
//     proxy_http_version 1.1;
//     proxy_set_header Upgrade $http_upgrade;
//     proxy_set_header Connection 'upgrade';
//     proxy_set_header Host $host;
//     proxy_set_header X-Real-IP $remote_addr;
//     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//     proxy_set_header X-Forwarded-Proto $scheme;
//     proxy_cache_bypass $http_upgrade;
//   }
// }

// ============================================

// 部署检查清单：
// 1. 设置正确的环境变量（生产环境值）
// 2. 配置自定义域名和 HTTPS
// 3. 设置 CDN 缓存静态资源
// 4. 配置监控和错误追踪（Sentry / LogRocket）
// 5. 设置自动回滚和健康检查
// 6. 优化图片和静态资源
// 7. 配置 robots.txt 和 sitemap.xml`),
    language: 'jsx',
    principle: 'Next.js 支持多种部署目标：Vercel（全托管零配置）、Node Server（output: standalone 自托管）、Docker（基于 standalone 构建镜像）、Static Export（output: export 纯静态）。静态导出有限制：不支持 Server Actions/Middleware/动态图片优化。',
    flow: ['根据需求选择部署目标（Vercel/Node/Docker/静态）。', '配置 output 模式和环境变量。', '设置 CDN、域名、HTTPS 和监控。'],
    notes: ['Vercel 是官方平台，零配置支持所有特性。', 'standalone 不含 node_modules，需 COPY 静态资源。', '静态导出不支持 Server Actions、Middleware、Image Optimization。'],
    problem: '解决"Next.js 项目能部署到哪里、各部署方式有什么限制"的问题。',
  },
]
