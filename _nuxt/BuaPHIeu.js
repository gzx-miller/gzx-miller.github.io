const n=`import { useState } from 'react'
import { createRoot } from 'react-dom/client'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('课程卡片渲染失败', error, info.componentStack)
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="panel">
          <strong className="error">课程卡片暂时不可用</strong>
          <p className="muted">其余页面仍可继续操作。</p>
          <button onClick={() => { this.props.onReset(); this.setState({ failed: false }) }}>重试</button>
        </section>
      )
    }
    return this.props.children
  }
}

function CourseCard({ broken }) {
  if (broken) throw new Error('模拟渲染错误')
  return (
    <section className="panel">
      <strong>React 容错设计</strong>
      <p className="muted">课程内容加载正常。</p>
    </section>
  )
}

function App() {
  const [broken, setBroken] = useState(false)
  return (
    <main className="app">
      <header>
        <p className="kicker">Error Boundary</p>
        <h3>隔离局部渲染故障</h3>
      </header>
      <button onClick={() => setBroken(true)}>模拟卡片故障</button>
      <ErrorBoundary onReset={() => setBroken(false)}>
        <CourseCard broken={broken} />
      </ErrorBoundary>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{n as default};
