const n=`import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function EventDemo() {
  const [clickLog, setClickLog] = useState([])

  function handleClick(event) {
    setClickLog((prev) => [...prev, \`点击类型：\${event.type}，目标：\${event.target.tagName}\`])
  }

  function handleInputChange(event) {
    setClickLog((prev) => [...prev, \`输入值：\${event.target.value}\`])
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      setClickLog((prev) => [...prev, \`按下 Enter：\${event.target.value}\`])
    }
  }

  return (
    <section className="panel">
      <strong>合成事件捕获</strong>
      <p className="muted">React 合成事件是浏览器原生事件的跨浏览器封装。</p>
      <div className="field">
        <label>课程搜索</label>
        <input placeholder="输入后按 Enter" onChange={handleInputChange} onKeyDown={handleKeyDown} />
      </div>
      <button onClick={handleClick}>点击记录事件</button>
      <div style={{ marginTop: '8px' }}>
        {clickLog.length > 0
          ? <ul>{clickLog.slice(-5).map((log, i) => <li key={i} className="muted">{log}</li>)}</ul>
          : <p className="muted">尚无事件记录。</p>
        }
      </div>
    </section>
  )
}

function PreventDefaultDemo() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <section className="panel">
      <strong>阻止默认行为</strong>
      <p className="muted">表单提交需要 preventDefault 阻止浏览器刷新。</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>课程名称</label>
          <input placeholder="输入课程名" />
        </div>
        <button type="submit">提交</button>
      </form>
      {submitted && <p className="success">表单已提交，页面未刷新！</p>}
    </section>
  )
}

function App() {
  const [tab, setTab] = useState('basic')

  return (
    <main className="app">
      <header>
        <p className="kicker">事件处理</p>
        <h3>合成事件与处理器模式</h3>
      </header>
      <div className="toolbar">
        <button className={tab === 'basic' ? '' : 'secondary'} onClick={() => setTab('basic')}>基础事件</button>
        <button className={tab === 'prevent' ? '' : 'secondary'} onClick={() => setTab('prevent')}>阻止默认</button>
      </div>
      {tab === 'basic' ? <EventDemo /> : <PreventDefaultDemo />}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{n as default};
