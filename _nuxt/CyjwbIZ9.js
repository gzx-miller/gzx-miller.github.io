const e=`import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

function Clock({ timezone }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const time = new Intl.DateTimeFormat('zh-CN', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now)

  return (
    <div className="panel">
      <div className="metric">{time}</div>
      <p className="muted">时区：{timezone}</p>
    </div>
  )
}

function App() {
  const [timezone, setTimezone] = useState('Asia/Shanghai')

  return (
    <main className="app">
      <header>
        <p className="kicker">useEffect 外部同步</p>
        <h3>跨时区会议时钟</h3>
      </header>
      <select value={timezone} onChange={(event) => setTimezone(event.target.value)}>
        <option value="Asia/Shanghai">上海</option>
        <option value="Europe/London">伦敦</option>
        <option value="America/New_York">纽约</option>
      </select>
      <Clock timezone={timezone} />
      <p className="muted">Effect 只负责订阅计时器，并在组件卸载时清理；时区格式化属于渲染计算。</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
