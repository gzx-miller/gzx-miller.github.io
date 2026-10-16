const t=`import React from 'react'
import { createRoot } from 'react-dom/client'
import { create } from 'zustand'

const useCartStore = create((set) => ({
  items: 1,
  coupon: '',
  addItem: () => set((state) => ({ items: state.items + 1 })),
  setCoupon: (coupon) => set({ coupon }),
}))

function CartCount() {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  return <section className="panel"><p className="metric">{items} 件</p><button onClick={addItem}>加入课程</button></section>
}

function Coupon() {
  const coupon = useCartStore((state) => state.coupon)
  const setCoupon = useCartStore((state) => state.setCoupon)
  return <label className="field"><span>优惠码（不会让计数组件重渲染）</span><input value={coupon} onChange={(event) => setCoupon(event.target.value)} /></label>
}

function App() { return <main className="app"><p className="kicker">Zustand selector</p><div className="grid"><CartCount /><Coupon /></div></main> }
createRoot(document.getElementById('root')).render(<App />)
`;export{t as default};
