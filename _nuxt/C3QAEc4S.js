const e=`import { lazy, Suspense, useState } from 'react'
import { createRoot } from 'react-dom/client'

const CourseReport = lazy(() => new Promise((resolve) => {
  setTimeout(() => resolve({
    default: function Report() {
      return (
        <section className="panel">
          <strong>学习报告已加载</strong>
          <p className="muted">本周完成 6 个内容，连续学习 4 天。</p>
        </section>
      )
    },
  }), 700)
}))

function App() {
  const [visible, setVisible] = useState(false)
  return (
    <main className="app">
      <header>
        <p className="kicker">lazy + Suspense</p>
        <h3>需要时再加载学习报告</h3>
      </header>
      <button onClick={() => setVisible(true)} disabled={visible}>查看报告</button>
      {visible
        ? <Suspense fallback={<p className="panel muted" role="status">报告模块加载中...</p>}><CourseReport /></Suspense>
        : <p className="muted">报告模块尚未请求。</p>
      }
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
