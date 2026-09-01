import{R as t}from"./Hhvd03iW.js";import{d as e,B as n,y as a,o as c}from"./DutfXOOr.js";const i=`import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement
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

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'useState 与不可变更新'),
      h('h3', null, '栗子小铺购物车'),
    ),
    ...cart.map((item) => h('div', { className: 'item', key: item.id },
      h('div', null, h('strong', null, item.name), h('div', { className: 'muted' }, \`¥\${item.price} × \${item.count}\`)),
      h('div', { className: 'actions' },
        h('button', { className: 'secondary', onClick: () => changeCount(item.id, -1) }, '−'),
        h('button', { onClick: () => changeCount(item.id, 1) }, '+'),
      ),
    )),
    h('div', { className: 'panel' }, '合计：', h('span', { className: 'metric' }, \`¥\${total}\`)),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,l=e({__name:"R02StateUpdates",setup(o){return(m,s)=>(c(),n(t,{title:"React useState 与不可变更新演示",code:a(i)},null,8,["code"]))}});export{l as default};
