const e=`import { createRoot } from 'react-dom/client'

function CourseCard({ title, level, seats }) {
  return (
    <article className="item">
      <div>
        <strong>{title}</strong>
        <p className="muted">{level} · 剩余 {seats} 个名额</p>
      </div>
      <span className="badge">{seats > 0 ? '可报名' : '已满'}</span>
    </article>
  )
}

function App() {
  const courses = [
    { id: 1, title: 'React 组件设计', level: '入门', seats: 6 },
    { id: 2, title: 'Hooks 状态管理', level: '进阶', seats: 0 },
  ]

  return (
    <main className="app">
      <header>
        <p className="kicker">组件与 Props</p>
        <h3>秋季训练营</h3>
        <p className="muted">父组件通过 props 向可复用的课程卡片传递只读数据。</p>
      </header>
      <section className="grid">
        {courses.map((course) => <CourseCard key={course.id} {...course} />)}
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
