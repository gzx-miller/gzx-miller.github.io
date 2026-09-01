import{R as t}from"./Hhvd03iW.js";import{d as n,B as e,y as c,o}from"./DutfXOOr.js";const r=`import React, { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

let globalMountCount = 0

function CounterWithEffect() {
  const mountId = useRef(++globalMountCount)
  const [count, setCount] = useState(0)
  const [log, setLog] = useState([])

  useEffect(() => {
    const entry = \`组件 #\${mountId.current} 的 Effect 执行（count=\${count}）\`
    setLog((prev) => [...prev.slice(-4), entry])
    return () => {
      const cleanup = \`组件 #\${mountId.current} 的 Effect 清理\`
      setLog((prev) => [...prev.slice(-4), cleanup])
    }
  }, [count])

  return h('section', { className: 'panel' },
    h('strong', null, 'Effect 执行日志'),
    h('p', { className: 'muted' }, 'StrictMode 在开发环境会额外执行一次 setup + cleanup，帮你暴露清理缺失的问题。'),
    h('div', { className: 'toolbar' },
      h('button', { onClick: () => setCount((c) => c + 1) }, \`计数：\${count}\`),
    ),
    h('div', { style: { marginTop: '8px' } },
      log.length > 0
        ? h('ul', null, log.map((entry, i) => h('li', { key: i, className: 'muted' }, entry)))
        : h('p', { className: 'muted' }, '点击计数查看 Effect 日志。'),
    ),
  )
}

function App() {
  const [strict, setStrict] = useState(true)

  const content = h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'StrictMode'),
      h('h3', null, '开发环境额外检查'),
    ),
    h('div', { className: 'toolbar' },
      h('button', { onClick: () => setStrict((v) => !v) }, strict ? '关闭 StrictMode' : '开启 StrictMode'),
      h('span', { className: 'muted' }, strict ? 'StrictMode 已开启' : 'StrictMode 已关闭'),
    ),
    h('p', { className: 'muted' },
      strict
        ? '开启后 Effect 会执行两次 setup + cleanup，验证清理函数是否正确。'
        : '关闭后 Effect 只执行一次，与生产环境行为一致。',
    ),
    h(CounterWithEffect),
  )

  if (strict) {
    return h(React.StrictMode, null, content)
  }
  return content
}

createRoot(document.getElementById('root')).render(h(App))
`,m=n({__name:"R23StrictMode",setup(s){return(a,u)=>(o(),e(t,{title:"React StrictMode 演示",code:c(r)},null,8,["code"]))}});export{m as default};
