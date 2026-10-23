const n=`// 静态渲染（默认）- 构建时预渲染
// app/page.tsx
import { cacheLife } from 'next/cache'

async function getPosts() {
  // 启用 Cache Components 时用 use cache 显式声明缓存
  'use cache'
  cacheLife('hours')

  const res = await fetch('https://api.example.com/posts')
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

// 读取 Cookie - 使用异步 cookies()
// app/dashboard/page.tsx
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  // 未启用 Cache Components 时，读取 cookie 会让整条路由变为动态渲染
  // 启用后应把这段读取放进 <Suspense>，保留可预渲染的静态壳
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  const user = await fetch(\`https://api.example.com/users/\${userId}\`, {
    cache: 'no-store', // 不缓存
  }).then(res => res.json())

  return <h1>欢迎回来，{user.name}</h1>
}

// ============================================

// 读取请求头 - 使用异步 headers()
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')

  return <p>你的浏览器: {userAgent}</p>
}

// ============================================

// 读取 searchParams - 先 await 解包
// app/search/page.tsx
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  // 未启用 Cache Components 时触发动态渲染
  // 启用后把读取放进 <Suspense>，或用 use cache: private 缓存
  const { q } = await searchParams

  return <h1>搜索: {q}</h1>
}

// ============================================

// 路由级配置：旧模型（未启用 Cache Components）下的写法
// app/blog/page.tsx

// 强制静态渲染（即使使用了动态函数也报错）
export const dynamic = 'force-static'

// 强制动态渲染（每次请求都执行）
// export const dynamic = 'force-dynamic'

// 自动（默认）- 根据使用的 API 自动判断
// export const dynamic = 'auto'

// Next.js 16 启用 Cache Components 后，dynamic/revalidate/fetchCache 会被移除
// 改用 use cache 与 <Suspense> 表达静态与动态

export default function BlogPage() {
  return <h1>博客</h1>
}

// ============================================

// ISR (Incremental Static Regeneration) - 旧模型写法
// 静态页面 + 定时重新生成
// app/products/[id]/page.tsx

// 每隔 60 秒重新生成页面
// 启用 Cache Components 后改为在缓存函数中调用 cacheLife
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
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  return <h1>{product.name}</h1>
}
`;export{n as default};
