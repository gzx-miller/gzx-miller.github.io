const e=`import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const searchRef = useRef(null)
  const submitCountRef = useRef(0)
  const [result, setResult] = useState('等待检索')

  function focusSearch() {
    searchRef.current?.focus()
  }

  function search() {
    const keyword = searchRef.current?.value.trim()
    if (!keyword) {
      focusSearch()
      setResult('请先输入课程关键词')
      return
    }
    submitCountRef.current += 1
    setResult(\`已检索"\${keyword}"，本次会话检索 \${submitCountRef.current} 次\`)
  }

  return (
    <main className="app">
      <header>
        <p className="kicker">useRef</p>
        <h3>课程检索快捷操作</h3>
        <p className="muted">Ref 保存 DOM 引用和无需驱动渲染的可变值。</p>
      </header>
      <div className="field">
        <label htmlFor="course-search">课程关键词</label>
        <input id="course-search" ref={searchRef} defaultValue="React" placeholder="例如：React" />
      </div>
      <div className="actions">
        <button onClick={search}>检索</button>
        <button className="secondary" onClick={focusSearch}>聚焦输入框</button>
      </div>
      <p className="panel" aria-live="polite">{result}</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
