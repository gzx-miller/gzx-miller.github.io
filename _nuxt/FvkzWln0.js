const n=`import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const connect = () => setIsOnline(true)
    const disconnect = () => setIsOnline(false)
    window.addEventListener('online', connect)
    window.addEventListener('offline', disconnect)

    return () => {
      window.removeEventListener('online', connect)
      window.removeEventListener('offline', disconnect)
    }
  }, [])

  return isOnline
}

function SaveButton() {
  const isOnline = useOnlineStatus()
  return <button disabled={!isOnline}>{isOnline ? '保存课程草稿' : '离线，等待恢复'}</button>
}

function StatusBadge() {
  const isOnline = useOnlineStatus()
  return <span className="badge">{isOnline ? '网络正常' : '当前离线'}</span>
}

function App() {
  return (
    <main className="app">
      <header>
        <p className="kicker">自定义 Hook</p>
        <h3>在线状态复用</h3>
      </header>
      <div className="item">
        <div>
          <strong>课程编辑器</strong>
          <p className="muted">两个组件复用相同的浏览器事件订阅逻辑。</p>
        </div>
        <StatusBadge />
      </div>
      <SaveButton />
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{n as default};
