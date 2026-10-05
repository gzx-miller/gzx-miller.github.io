const n=`// app/layout.tsx - 根布局（最外层）
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
//        └─ DashboardPage (app/dashboard/page.tsx)`;export{n as default};
