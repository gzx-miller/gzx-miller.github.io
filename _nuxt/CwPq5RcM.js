const e=`import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function CourseDetail({ course, onClose }) {
  if (!course) return null

  return (
    <section className="panel">
      <strong>{course.title}</strong>
      <p className="muted">难度：{course.level} · 时长：{course.duration}</p>
      <p className="muted">{course.description}</p>
      <button className="secondary" onClick={onClose}>返回列表</button>
    </section>
  )
}

function CourseList({ courses, onSelect }) {
  return (
    <div className="grid">
      {courses.map((course) => (
        <button key={course.id} className="secondary" onClick={() => onSelect(course)}>
          {course.title}
        </button>
      ))}
    </div>
  )
}

function App() {
  const courses = [
    { id: 1, title: 'React 条件渲染', level: '基础', duration: '2h', description: '掌握逻辑与、三元表达式和提前返回三种条件渲染方式。' },
    { id: 2, title: 'Hooks 深入', level: '进阶', duration: '3h', description: '理解 Hooks 规则、闭包陷阱和自定义 Hook 设计。' },
    { id: 3, title: '并发模式实战', level: '高级', duration: '4h', description: '用 Transition 和 DeferredValue 优化用户交互体验。' },
  ]

  const [selected, setSelected] = useState(null)
  const [showDiscount, setShowDiscount] = useState(false)

  return (
    <main className="app">
      <header>
        <p className="kicker">条件渲染</p>
        <h3>逻辑与、三元表达式与提前返回</h3>
      </header>
      <div className="toolbar">
        <button className="secondary" onClick={() => setShowDiscount((v) => !v)}>
          {showDiscount ? '隐藏折扣' : '显示折扣'}
        </button>
      </div>
      {showDiscount && (
        <div className="panel" style={{ background: '#fff4dd' }}>
          <strong>秋季特惠</strong>
          <p className="muted">所有课程限时八折，逻辑与 (&&) 控制此区域显示。</p>
        </div>
      )}
      {selected
        ? <CourseDetail course={selected} onClose={() => setSelected(null)} />
        : <CourseList courses={courses} onSelect={setSelected} />
      }
      <p className="muted">
        {selected ? '当前使用提前返回模式展示详情。' : '未选择课程时展示列表，选择后切换为详情。三元运算符控制两种视图。'}
      </p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
