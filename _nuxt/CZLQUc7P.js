import{R as n}from"./Hhvd03iW.js";import{d as e,B as t,y as a,o as l}from"./DutfXOOr.js";const o=`import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function EventDemo() {
  const [clickLog, setClickLog] = useState([])

  function handleClick(event) {
    setClickLog((prev) => [...prev, \`点击类型：\${event.type}，目标：\${event.target.tagName}\`])
  }

  function handleInputChange(event) {
    setClickLog((prev) => [...prev, \`输入值：\${event.target.value}\`])
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      setClickLog((prev) => [...prev, \`按下 Enter：\${event.target.value}\`])
    }
  }

  return h('section', { className: 'panel' },
    h('strong', null, '合成事件捕获'),
    h('p', { className: 'muted' }, 'React 合成事件是浏览器原生事件的跨浏览器封装。'),
    h('div', { className: 'field' },
      h('label', null, '课程搜索'),
      h('input', {
        placeholder: '输入后按 Enter',
        onChange: handleInputChange,
        onKeyDown: handleKeyDown,
      }),
    ),
    h('button', { onClick: handleClick }, '点击记录事件'),
    h('div', { style: { marginTop: '8px' } },
      clickLog.length > 0
        ? h('ul', null, clickLog.slice(-5).map((log, i) => h('li', { key: i, className: 'muted' }, log)))
        : h('p', { className: 'muted' }, '尚无事件记录。'),
    ),
  )
}

function App() {
  const [tab, setTab] = useState('basic')

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, '事件处理'),
      h('h3', null, '合成事件与处理器模式'),
    ),
    h('div', { className: 'toolbar' },
      h('button', {
        className: tab === 'basic' ? '' : 'secondary',
        onClick: () => setTab('basic'),
      }, '基础事件'),
      h('button', {
        className: tab === 'prevent' ? '' : 'secondary',
        onClick: () => setTab('prevent'),
      }, '阻止默认'),
    ),
    tab === 'basic'
      ? h(EventDemo)
      : h(PreventDefaultDemo),
  )
}

function PreventDefaultDemo() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return h('section', { className: 'panel' },
    h('strong', null, '阻止默认行为'),
    h('p', { className: 'muted' }, '表单提交需要 preventDefault 阻止浏览器刷新。'),
    h('form', { onSubmit: handleSubmit },
      h('div', { className: 'field' },
        h('label', null, '课程名称'),
        h('input', { placeholder: '输入课程名' }),
      ),
      h('button', { type: 'submit' }, '提交'),
    ),
    submitted && h('p', { className: 'success' }, '表单已提交，页面未刷新！'),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,m=e({__name:"R17EventHandler",setup(s){return(c,r)=>(l(),t(n,{title:"React 事件处理演示",code:a(o)},null,8,["code"]))}});export{m as default};
