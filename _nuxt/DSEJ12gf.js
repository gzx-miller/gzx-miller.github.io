const n=`// app/page.tsx - 默认是 Server Component
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
}`;export{n as default};
