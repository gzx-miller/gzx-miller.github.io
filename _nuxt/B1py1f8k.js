import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as c,o as s}from"./DutfXOOr.js";const a=`import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function App() {
  const searchRef = useRef(null)
  const submitCountRef = useRef(0)
  const [result, setResult] = useState('等待检索')

  function focusSearch() {
    searchRef.current?.focus()
  }

  function search() {
    const keyword = searchRef.current?.value.trim()
    if (!keyword) {
      focusSearch()
      setResult('请先输入课程关键词')
      return
    }
    submitCountRef.current += 1
    setResult(\`已检索“\${keyword}”，本次会话检索 \${submitCountRef.current} 次\`)
  }

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'useRef'),
      h('h3', null, '课程检索快捷操作'),
      h('p', { className: 'muted' }, 'Ref 保存 DOM 引用和无需驱动渲染的可变值。'),
    ),
    h('div', { className: 'field' },
      h('label', { htmlFor: 'course-search' }, '课程关键词'),
      h('input', { id: 'course-search', ref: searchRef, defaultValue: 'React', placeholder: '例如：React' }),
    ),
    h('div', { className: 'actions' },
      h('button', { onClick: search }, '检索'),
      h('button', { className: 'secondary', onClick: focusSearch }, '聚焦输入框'),
    ),
    h('p', { className: 'panel', 'aria-live': 'polite' }, result),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,m=n({__name:"R09RefDom",setup(r){return(o,u)=>(s(),t(e,{title:"React useRef 与 DOM 演示",code:c(a)},null,8,["code"]))}});export{m as default};
