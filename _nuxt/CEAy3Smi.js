import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as r,o}from"./DutfXOOr.js";const c=`import React, { useSyncExternalStore } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement
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
  return h('div', { className: 'panel' },
    h('p', { className: 'muted' }, label),
    h('strong', { className: 'metric' }, current.count),
  )
}

function App() {
  const current = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot)
  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'useSyncExternalStore'),
      h('h3', null, '订阅 React 外部的可变数据源'),
    ),
    h('div', { className: 'grid' },
      h(CounterView, { label: '导航角标' }),
      h(CounterView, { label: '工作台统计' }),
    ),
    h('button', { onClick: counterStore.increment }, '外部 Store +1'),
    h('p', { className: 'muted' }, \`最近更新：\${current.updatedAt}\`),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,m=n({__name:"R12ExternalStore",setup(s){return(a,l)=>(o(),t(e,{title:"React 外部 Store 订阅演示",code:r(c)},null,8,["code"]))}});export{m as default};
