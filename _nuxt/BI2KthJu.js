import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as l,o as a}from"./DutfXOOr.js";const o=`import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function Card({ title, children }) {
  return h('section', { className: 'panel' },
    h('strong', null, title),
    children,
  )
}

function StatsLayout({ title, renderStats }) {
  return h('section', { className: 'panel' },
    h('strong', null, title),
    h('div', { className: 'grid', style: { marginTop: '8px' } },
      renderStats(),
    ),
  )
}

function StatItem({ label, value }) {
  return h('div', { className: 'item' },
    h('div', null,
      h('div', { className: 'muted', style: { fontSize: '12px' } }, label),
      h('div', { className: 'metric' }, value),
    ),
  )
}

function App() {
  const [enrolled, setEnrolled] = useState(42)
  const [completed, setCompleted] = useState(18)

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, '组件组合'),
      h('h3', null, 'children 与 render props'),
    ),

    h(Card, { title: 'children 插槽' },
      h('p', { className: 'muted' }, 'Card 组件通过 children 接收任意内容，父组件决定渲染什么。'),
      h('div', { className: 'toolbar' },
        h('button', { onClick: () => setEnrolled((n) => n + 1) }, '新增报名'),
        h('button', { className: 'secondary', onClick: () => setCompleted((n) => n + 1) }, '完成课程'),
      ),
    ),

    h(StatsLayout, {
      title: 'render props 模式',
      renderStats: () => [
        h(StatItem, { key: 'enrolled', label: '在学人数', value: enrolled }),
        h(StatItem, { key: 'completed', label: '已完成', value: completed }),
        h(StatItem, { key: 'rate', label: '完成率', value: \`\${enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0}%\` }),
      ],
    }),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,i=n({__name:"R19Composition",setup(r){return(s,c)=>(a(),t(e,{title:"React 组件组合演示",code:l(o)},null,8,["code"]))}});export{i as default};
