import React from 'react'
import { createRoot } from 'react-dom/client'
import { atom, useAtom, useAtomValue } from 'jotai'

const countAtom = atom(1)
const priceAtom = atom(129)
const totalAtom = atom((get) => get(countAtom) * get(priceAtom))

function App() {
  const [count, setCount] = useAtom(countAtom)
  const total = useAtomValue(totalAtom)
  return <main className="app"><p className="kicker">Jotai 原子依赖图</p><p>课程数量：<strong>{count}</strong></p><p className="metric">¥{total}</p><div className="actions"><button onClick={() => setCount((value) => value + 1)}>增加</button><button className="secondary" onClick={() => setCount((value) => Math.max(1, value - 1))}>减少</button></div></main>
}
createRoot(document.getElementById('root')).render(<App />)
