const e=`import { useId, useState } from 'react'
import { createRoot } from 'react-dom/client'

function CourseField({ label }) {
  const id = useId()
  const hintId = \`\${id}-hint\`
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={hintId} placeholder={\`填写\${label}\`} />
      <span id={hintId} className="muted">标签、输入框和说明通过稳定 ID 建立关联。</span>
    </div>
  )
}

function App() {
  const [showSecond, setShowSecond] = useState(false)
  return (
    <main className="app">
      <header>
        <p className="kicker">useId</p>
        <h3>生成可访问性关联 ID</h3>
      </header>
      <CourseField label="课程名称" />
      {showSecond ? <CourseField label="讲师姓名" /> : null}
      <button className="secondary" onClick={() => setShowSecond((value) => !value)}>
        {showSecond ? '移除讲师字段' : '增加讲师字段'}
      </button>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
