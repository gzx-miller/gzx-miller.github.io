const n=`import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

function OnlineStatus() {
  const [status, setStatus] = useState(
    typeof navigator !== 'undefined' && navigator.onLine ? '在线' : '离线',
  )

  useEffect(() => {
    function handleOnline() { setStatus('在线') }
    function handleOffline() { setStatus('离线') }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <span
      className="badge"
      style={status === '在线' ? { background: '#d4edda', color: '#28744b' } : { background: '#f8d7da', color: '#a33122' }}
    >
      {status}
    </span>
  )
}

function WindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="item">
      <div>
        <div className="muted" style={{ fontSize: '12px' }}>窗口尺寸</div>
        <div className="metric">{size.width} × {size.height}</div>
      </div>
    </div>
  )
}

function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  return (
    <div className="item">
      <div>
        <div className="muted" style={{ fontSize: '12px' }}>
          计时器 <OnlineStatus />
        </div>
        <div className="metric">{seconds}s</div>
        <div className="toolbar" style={{ marginTop: '6px' }}>
          <button onClick={() => setRunning((v) => !v)}>{running ? '暂停' : '开始'}</button>
          <button className="secondary" onClick={() => { setRunning(false); setSeconds(0) }}>重置</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <main className="app">
      <header>
        <p className="kicker">Effect 生命周期</p>
        <h3>挂载、更新与卸载的常见模式</h3>
      </header>
      <p className="muted">Effect 在挂载时执行，依赖变化时先清理再重新执行，卸载时执行最后一次清理。</p>
      <div className="grid">
        <WindowSize />
        <Timer />
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{n as default};
