const t=`import { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

let globalMountCount = 0

function CounterWithEffect() {
  const mountId = useRef(++globalMountCount)
  const [count, setCount] = useState(0)
  const [log, setLog] = useState([])

  useEffect(() => {
    const entry = \`组件 #\${mountId.current} 的 Effect 执行（count=\${count}）\`
    setLog((prev) => [...prev.slice(-4), entry])
    return () => {
      const cleanup = \`组件 #\${mountId.current} 的 Effect 清理\`
      setLog((prev) => [...prev.slice(-4), cleanup])
    }
  }, [count])

  return (
    <section className="panel">
      <strong>Effect 执行日志</strong>
      <p className="muted">StrictMode 在开发环境会额外执行一次 setup + cleanup，帮你暴露清理缺失的问题。</p>
      <div className="toolbar">
        <button onClick={() => setCount((c) => c + 1)}>计数：{count}</button>
      </div>
      <div style={{ marginTop: '8px' }}>
        {log.length > 0
          ? <ul>{log.map((entry, i) => <li key={i} className="muted">{entry}</li>)}</ul>
          : <p className="muted">点击计数查看 Effect 日志。</p>
        }
      </div>
    </section>
  )
}

function App() {
  const [strict, setStrict] = useState(true)

  const content = (
    <main className="app">
      <header>
        <p className="kicker">StrictMode</p>
        <h3>开发环境额外检查</h3>
      </header>
      <div className="toolbar">
        <button onClick={() => setStrict((v) => !v)}>{strict ? '关闭 StrictMode' : '开启 StrictMode'}</button>
        <span className="muted">{strict ? 'StrictMode 已开启' : 'StrictMode 已关闭'}</span>
      </div>
      <p className="muted">
        {strict
          ? '开启后 Effect 会执行两次 setup + cleanup，验证清理函数是否正确。'
          : '关闭后 Effect 只执行一次，与生产环境行为一致。'}
      </p>
      <CounterWithEffect />
    </main>
  )

  if (strict) {
    return <React.StrictMode>{content}</React.StrictMode>
  }
  return content
}

createRoot(document.getElementById('root')).render(<App />)
`;export{t as default};
