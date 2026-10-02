const n=`import React from 'react'
import { createRoot } from 'react-dom/client'
import { proxy, useSnapshot } from 'valtio'

const state = proxy({
  count: 0,
  text: '',
  user: {
    name: 'Alice',
    age: 25,
  },
})

function inc() {
  state.count++
}

function setText(text) {
  state.text = text
}

function birthday() {
  state.user.age++
}

function Counter() {
  const snap = useSnapshot(state)
  return (
    <section className="panel">
      <p className="metric">计数: {snap.count}</p>
      <button onClick={inc}>增加</button>
    </section>
  )
}

function TextInput() {
  const snap = useSnapshot(state)
  return (
    <label className="field">
      <span>输入文本（不影响计数组件）</span>
      <input value={snap.text} onChange={(e) => setText(e.target.value)} />
    </label>
  )
}

function UserProfile() {
  const snap = useSnapshot(state.user)
  return (
    <section className="panel">
      <p>{snap.name}, {snap.age} 岁</p>
      <button onClick={birthday}>过生日</button>
    </section>
  )
}

function App() {
  return (
    <main className="app">
      <p className="kicker">Valtio Proxy 响应式</p>
      <div className="grid">
        <Counter />
        <TextInput />
        <UserProfile />
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{n as default};
