const n=`import { useSyncExternalStore } from 'react'
import { createRoot } from 'react-dom/client'

let snapshot = { count: 0, updatedAt: '尚未更新' }
const listeners = new Set()

const counterStore = {
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot() {
    return snapshot
  },
  increment() {
    snapshot = { count: snapshot.count + 1, updatedAt: new Date().toLocaleTimeString('zh-CN') }
    listeners.forEach((listener) => listener())
  },
}

function CounterView({ label }) {
  const current = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot)
  return (
    <div className="panel">
      <p className="muted">{label}</p>
      <strong className="metric">{current.count}</strong>
    </div>
  )
}

function App() {
  const current = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot)
  return (
    <main className="app">
      <header>
        <p className="kicker">useSyncExternalStore</p>
        <h3>订阅 React 外部的可变数据源</h3>
      </header>
      <div className="grid">
        <CounterView label="导航角标" />
        <CounterView label="工作台统计" />
      </div>
      <button onClick={counterStore.increment}>外部 Store +1</button>
      <p className="muted">最近更新：{current.updatedAt}</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{n as default};
