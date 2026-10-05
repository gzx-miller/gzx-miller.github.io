const n=`// app/layout.tsx - 根布局（必需）
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

module.exports = nextConfig`;export{n as default};
