import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as o,o as s}from"./DutfXOOr.js";const c=`import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function CourseDetail({ course, onClose }) {
  if (!course) return null

  return h('section', { className: 'panel' },
    h('strong', null, course.title),
    h('p', { className: 'muted' }, \`难度：\${course.level} · 时长：\${course.duration}\`),
    h('p', { className: 'muted' }, course.description),
    h('button', { className: 'secondary', onClick: onClose }, '返回列表'),
  )
}

function CourseList({ courses, onSelect }) {
  return h('div', { className: 'grid' },
    courses.map((course) =>
      h('button', {
        key: course.id,
        className: 'secondary',
        onClick: () => onSelect(course),
      }, course.title),
    ),
  )
}

function App() {
  const courses = [
    { id: 1, title: 'React 条件渲染', level: '基础', duration: '2h', description: '掌握逻辑与、三元表达式和提前返回三种条件渲染方式。' },
    { id: 2, title: 'Hooks 深入', level: '进阶', duration: '3h', description: '理解 Hooks 规则、闭包陷阱和自定义 Hook 设计。' },
    { id: 3, title: '并发模式实战', level: '高级', duration: '4h', description: '用 Transition 和 DeferredValue 优化用户交互体验。' },
  ]

  const [selected, setSelected] = useState(null)
  const [showDiscount, setShowDiscount] = useState(false)

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, '条件渲染'),
      h('h3', null, '逻辑与、三元表达式与提前返回'),
    ),

    h('div', { className: 'toolbar' },
      h('button', {
        className: 'secondary',
        onClick: () => setShowDiscount((v) => !v),
      }, showDiscount ? '隐藏折扣' : '显示折扣'),
    ),

    showDiscount && h('div', { className: 'panel', style: { background: '#fff4dd' } },
      h('strong', null, '秋季特惠'),
      h('p', { className: 'muted' }, '所有课程限时八折，逻辑与 (&&) 控制此区域显示。'),
    ),

    selected
      ? h(CourseDetail, { course: selected, onClose: () => setSelected(null) })
      : h(CourseList, { courses, onSelect: setSelected }),

    h('p', { className: 'muted' },
      selected ? '当前使用提前返回模式展示详情。' : '未选择课程时展示列表，选择后切换为详情。三元运算符控制两种视图。',
    ),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,d=n({__name:"R18ConditionalRender",setup(l){return(r,a)=>(s(),t(e,{title:"React 条件渲染演示",code:o(c)},null,8,["code"]))}});export{d as default};
