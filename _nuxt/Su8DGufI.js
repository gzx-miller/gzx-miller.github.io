const n=`import { useState, useTransition } from 'react'
import { createRoot } from 'react-dom/client'

const courses = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  title: \`课程 \${String(i + 1).padStart(3, '0')}：\${['React 基础', 'Hooks 入门', '状态管理', '路由设计', '并发渲染'][i % 5]}\`,
  level: ['基础', '进阶', '高级'][i % 3],
}))

function App() {
  const [keyword, setKeyword] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = courses.filter((c) =>
    c.title.includes(keyword) || c.level.includes(keyword),
  )

  function handleChange(event) {
    const value = event.target.value
    setKeyword(value)
  }

  return (
    <main className="app">
      <header>
        <p className="kicker">useTransition</p>
        <h3>标记非紧急状态更新</h3>
      </header>
      <p className="muted">输入立即更新，列表筛选作为过渡更新在后台执行，不会阻塞输入。</p>
      <div className="toolbar">
        <input
          placeholder="搜索课程..."
          value={keyword}
          onChange={handleChange}
          style={{ maxWidth: '220px' }}
        />
        <span className="muted">{filtered.length} / {courses.length} 门课程</span>
      </div>
      <section className="panel" style={isPending ? { opacity: 0.6 } : undefined}>
        <strong>{isPending ? '正在更新列表...' : '课程列表'}</strong>
        <div style={{ maxHeight: '180px', overflow: 'auto', marginTop: '8px' }}>
          {filtered.slice(0, 30).map((course) => (
            <div key={course.id} className="muted" style={{ padding: '2px 0' }}>{course.title}</div>
          ))}
        </div>
        {filtered.length > 30 && <p className="muted">还有 {filtered.length - 30} 门课程...</p>}
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{n as default};
