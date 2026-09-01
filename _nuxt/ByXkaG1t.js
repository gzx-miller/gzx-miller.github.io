const n=`import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Card({ title, children }) {
  return (
    <section className="panel">
      <strong>{title}</strong>
      {children}
    </section>
  )
}

function StatsLayout({ title, renderStats }) {
  return (
    <section className="panel">
      <strong>{title}</strong>
      <div className="grid" style={{ marginTop: '8px' }}>
        {renderStats()}
      </div>
    </section>
  )
}

function StatItem({ label, value }) {
  return (
    <div className="item">
      <div>
        <div className="muted" style={{ fontSize: '12px' }}>{label}</div>
        <div className="metric">{value}</div>
      </div>
    </div>
  )
}

function App() {
  const [enrolled, setEnrolled] = useState(42)
  const [completed, setCompleted] = useState(18)

  return (
    <main className="app">
      <header>
        <p className="kicker">组件组合</p>
        <h3>children 与 render props</h3>
      </header>
      <Card title="children 插槽">
        <p className="muted">Card 组件通过 children 接收任意内容，父组件决定渲染什么。</p>
        <div className="toolbar">
          <button onClick={() => setEnrolled((n) => n + 1)}>新增报名</button>
          <button className="secondary" onClick={() => setCompleted((n) => n + 1)}>完成课程</button>
        </div>
      </Card>
      <StatsLayout
        title="render props 模式"
        renderStats={() => [
          <StatItem key="enrolled" label="在学人数" value={enrolled} />,
          <StatItem key="completed" label="已完成" value={completed} />,
          <StatItem key="rate" label="完成率" value={\`\${enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0}%\`} />,
        ]}
      />
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{n as default};
