const n=`// app/page.tsx - 使用 Suspense 包裹慢组件
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
// 哪个先准备好就先显示哪个`;export{n as default};
