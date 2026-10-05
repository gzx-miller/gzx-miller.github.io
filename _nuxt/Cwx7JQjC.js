const e=`import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const [form, setForm] = useState({ name: '', direction: 'frontend' })
  const [submitted, setSubmitted] = useState('')
  const nameError = form.name.trim().length > 0 && form.name.trim().length < 2

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (form.name.trim().length < 2) return
    setSubmitted(\`\${form.name} 已报名 \${form.direction === 'frontend' ? '前端' : '全栈'}方向\`)
  }

  return (
    <form className="app" onSubmit={submit}>
      <header>
        <p className="kicker">受控表单</p>
        <h3>训练营报名</h3>
      </header>
      <div className="field">
        <label htmlFor="name">姓名</label>
        <input id="name" name="name" value={form.name} onChange={updateField} placeholder="至少输入 2 个字" />
        {nameError && <span className="error">姓名至少需要 2 个字</span>}
      </div>
      <div className="field">
        <label htmlFor="direction">学习方向</label>
        <select id="direction" name="direction" value={form.direction} onChange={updateField}>
          <option value="frontend">前端</option>
          <option value="fullstack">全栈</option>
        </select>
      </div>
      <button type="submit" disabled={form.name.trim().length < 2}>提交报名</button>
      {submitted && <p className="success" role="status">{submitted}</p>}
    </form>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
