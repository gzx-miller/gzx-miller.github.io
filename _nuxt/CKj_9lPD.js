const n=`// 静态渲染（默认）- 构建时生成 HTML
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
}`;export{n as default};
