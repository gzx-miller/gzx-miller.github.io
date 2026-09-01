import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as s,o}from"./DutfXOOr.js";const a=`import React from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function CourseCard({ title, level, seats }) {
  return h('article', { className: 'item' },
    h('div', null,
      h('strong', null, title),
      h('p', { className: 'muted' }, \`\${level} · 剩余 \${seats} 个名额\`),
    ),
    h('span', { className: 'badge' }, seats > 0 ? '可报名' : '已满'),
  )
}

function App() {
  const courses = [
    { id: 1, title: 'React 组件设计', level: '入门', seats: 6 },
    { id: 2, title: 'Hooks 状态管理', level: '进阶', seats: 0 },
  ]

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, '组件与 Props'),
      h('h3', null, '秋季训练营'),
      h('p', { className: 'muted' }, '父组件通过 props 向可复用的课程卡片传递只读数据。'),
    ),
    h('section', { className: 'grid' },
      courses.map((course) => h(CourseCard, { key: course.id, ...course })),
    ),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,i=n({__name:"R01ComponentProps",setup(r){return(c,l)=>(o(),t(e,{title:"React 组件与 Props 演示",code:s(a)},null,8,["code"]))}});export{i as default};
