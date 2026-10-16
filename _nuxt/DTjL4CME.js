const t=`import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const initialCart = [
  { id: 1, name: '板栗拿铁', price: 22, count: 1 },
  { id: 2, name: '枫糖曲奇', price: 16, count: 2 },
]

function App() {
  const [cart, setCart] = useState(initialCart)

  function changeCount(id, step) {
    setCart((items) => items.map((item) =>
      item.id === id ? { ...item, count: Math.max(0, item.count + step) } : item
    ))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.count, 0)

  return (
    <main className="app">
      <header>
        <p className="kicker">useState 与不可变更新</p>
        <h3>栗子小铺购物车</h3>
      </header>
      {cart.map((item) => (
        <div className="item" key={item.id}>
          <div><strong>{item.name}</strong><div className="muted">¥{item.price} × {item.count}</div></div>
          <div className="actions">
            <button className="secondary" onClick={() => changeCount(item.id, -1)}>−</button>
            <button onClick={() => changeCount(item.id, 1)}>+</button>
          </div>
        </div>
      ))}
      <div className="panel">合计：<span className="metric">¥{total}</span></div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{t as default};
