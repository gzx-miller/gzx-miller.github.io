const n=`// 并行路由目录结构：
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
}`;export{n as default};
