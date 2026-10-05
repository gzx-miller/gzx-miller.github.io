const e=`import { useRef, forwardRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

const TextInput = forwardRef(function TextInput({ label, ...rest }, ref) {
  return (
    <div className="field">
      <label>{label}</label>
      <input ref={ref} {...rest} />
    </div>
  )
})

function App() {
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const [submitted, setSubmitted] = useState(null)

  function handleSubmit() {
    const name = nameRef.current?.value || ''
    const email = emailRef.current?.value || ''
    if (!name.trim() || !email.trim()) {
      nameRef.current?.focus()
      return
    }
    setSubmitted({ name, email })
  }

  function handleReset() {
    nameRef.current.value = ''
    emailRef.current.value = ''
    nameRef.current?.focus()
    setSubmitted(null)
  }

  return (
    <main className="app">
      <header>
        <p className="kicker">forwardRef</p>
        <h3>跨组件传递 Ref</h3>
      </header>
      <p className="muted">forwardRef 让自定义组件能够将 ref 转发给内部 DOM 节点，使父组件可直接操作底层元素。</p>
      <section className="panel">
        <strong>课程报名表</strong>
        <TextInput ref={nameRef} label="姓名" placeholder="请输入姓名" />
        <TextInput ref={emailRef} label="邮箱" placeholder="请输入邮箱" type="email" />
        <div className="toolbar">
          <button onClick={handleSubmit}>提交</button>
          <button className="secondary" onClick={handleReset}>重置</button>
        </div>
      </section>
      {submitted && (
        <div className="panel" style={{ background: '#eef5f2' }}>
          <strong>报名成功</strong>
          <p className="muted">姓名：{submitted.name}</p>
          <p className="muted">邮箱：{submitted.email}</p>
        </div>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
