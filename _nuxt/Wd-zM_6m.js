const e=`import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const courses = [
  { id: 'react', title: 'React 核心', level: '入门' },
  { id: 'hooks', title: 'Hooks 实战', level: '进阶' },
  { id: 'testing', title: 'React 测试', level: '进阶' },
  { id: 'design', title: '组件设计', level: '入门' },
]

function App() {
  const [keyword, setKeyword] = useState('')
  const visibleCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(keyword.trim().toLowerCase())
  )

  return (
    <main className="app">
      <header>
        <p className="kicker">列表渲染与稳定 Key</p>
        <h3>课程检索</h3>
      </header>
      <input
        value={keyword}
        placeholder="输入课程关键词"
        onChange={(event) => setKeyword(event.target.value)}
      />
      <div className="grid">
        {visibleCourses.map((course) => (
          <article className="item" key={course.id}>
            <strong>{course.title}</strong>
            <span className="badge">{course.level}</span>
          </article>
        ))}
      </div>
      <p className="muted">找到 {visibleCourses.length} 门课程；筛选结果直接在渲染阶段计算。</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
