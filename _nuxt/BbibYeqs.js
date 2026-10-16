const n=`// 1. loading.tsx - 路由级加载状态
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
// 因为根布局可能已经出错了`;export{n as default};
