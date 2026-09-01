import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as o,o as a}from"./DutfXOOr.js";const c=`import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function Clock({ timezone }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const time = new Intl.DateTimeFormat('zh-CN', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now)

  return h('div', { className: 'panel' },
    h('div', { className: 'metric' }, time),
    h('p', { className: 'muted' }, \`时区：\${timezone}\`),
  )
}

function App() {
  const [timezone, setTimezone] = useState('Asia/Shanghai')

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'useEffect 外部同步'),
      h('h3', null, '跨时区会议时钟'),
    ),
    h('select', { value: timezone, onChange: (event) => setTimezone(event.target.value) },
      h('option', { value: 'Asia/Shanghai' }, '上海'),
      h('option', { value: 'Europe/London' }, '伦敦'),
      h('option', { value: 'America/New_York' }, '纽约'),
    ),
    h(Clock, { timezone }),
    h('p', { className: 'muted' }, 'Effect 只负责订阅计时器，并在组件卸载时清理；时区格式化属于渲染计算。'),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,u=n({__name:"R05EffectSync",setup(i){return(r,s)=>(a(),t(e,{title:"React useEffect 同步演示",code:o(c)},null,8,["code"]))}});export{u as default};
