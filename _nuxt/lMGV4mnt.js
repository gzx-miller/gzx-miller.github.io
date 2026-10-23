const n=`// 当前模型：Cache Components（Next.js 16 推荐）
// 以函数/组件为缓存单位，用 cacheLife 控制生命周期、cacheTag 打标签
import { cacheLife, cacheTag, revalidatePath, revalidateTag, updateTag } from 'next/cache'

async function getPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('posts')

  // 数据库查询或 fetch 都可以被缓存
  // return db.posts.findMany()
}

// 主动失效：Server Action 中立即读到新数据
// app/actions.ts
'use server'

export async function publishPost() {
  // await db.posts.create(...)

  updateTag('posts') // 下一次请求等待新数据
  // 或 revalidateTag('posts', 'max')：先返回旧内容，后台刷新
  revalidatePath('/blog')
}

// 未缓存的运行时读取放进 <Suspense>，静态壳先返回，动态内容后流式到达
// app/blog/page.tsx
import { Suspense } from 'react'

export default function BlogPage() {
  return (
    <main>
      <h1>博客</h1>
      <Suspense fallback={<p>加载中...</p>}>
        <PostList />
      </Suspense>
    </main>
  )
}

// ============================================

// 旧模型：Request Memoization（请求级去重）
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

// 旧模型：Data Cache（数据缓存 - 持久化）
// fetch 默认 auto no cache，需要缓存时显式开启

async function getCachedPosts() {
  // 显式 force-cache，数据跨请求持久缓存
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache',
  })
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

// 旧模型：主动失效缓存
// app/actions.ts
'use server'

// 按路径失效
export async function revalidateBlog() {
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page') // 动态路由
}

// 按标签失效（需传第二个参数）
export async function revalidatePosts() {
  revalidateTag('posts', 'max') // 后台刷新，期间继续提供旧内容
}

// ============================================

// 旧模型：Full Route Cache（路由缓存 - 构建/重新生成时）
// 静态渲染的页面 HTML 和 RSC payload 会被缓存
// app/blog/page.tsx

// 整个路由的 revalidate 配置；启用 Cache Components 后改用 cacheLife
export const revalidate = 60

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] },
  }).then(r => r.json())

  return <h1>博客 ({posts.length} 篇)</h1>
}

// ============================================

// 旧模型：Router Cache（客户端路由缓存）
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

// 旧模型缓存层级关系（从快到慢）：
// 1. Request Memoization - 单次请求内，生命周期：单次渲染
// 2. Data Cache - 跨请求持久，生命周期：直到 revalidate 或失效
// 3. Full Route Cache - 构建时/ISR，生命周期：直到 revalidate
// 4. Router Cache - 客户端会话，静态页面默认约 5 分钟，动态页面默认不缓存

// 失效 Data Cache 会级联刷新：
// Data Cache 失效 → Full Route Cache 重新生成 → Router Cache 失效
`;export{n as default};
