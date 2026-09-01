import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as s,o as a}from"./DutfXOOr.js";const o=`import React, { lazy, Suspense, useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement
const CourseReport = lazy(() => new Promise((resolve) => {
  setTimeout(() => resolve({
    default: function Report() {
      return h('section', { className: 'panel' },
        h('strong', null, '学习报告已加载'),
        h('p', { className: 'muted' }, '本周完成 6 个内容，连续学习 4 天。'),
      )
    },
  }), 700)
}))

function App() {
  const [visible, setVisible] = useState(false)
  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'lazy + Suspense'),
      h('h3', null, '需要时再加载学习报告'),
    ),
    h('button', { onClick: () => setVisible(true), disabled: visible }, '查看报告'),
    visible
      ? h(Suspense, { fallback: h('p', { className: 'panel muted', role: 'status' }, '报告模块加载中...') }, h(CourseReport))
      : h('p', { className: 'muted' }, '报告模块尚未请求。'),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,m=n({__name:"R14LazySuspense",setup(l){return(r,c)=>(a(),t(e,{title:"React lazy 与 Suspense 演示",code:s(o)},null,8,["code"]))}});export{m as default};
