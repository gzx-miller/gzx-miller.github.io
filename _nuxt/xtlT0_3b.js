import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as a,o as s}from"./DutfXOOr.js";const o=`import React, { useState, useTransition } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

const courses = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  title: \`课程 \${String(i + 1).padStart(3, '0')}：\${['React 基础', 'Hooks 入门', '状态管理', '路由设计', '并发渲染'][i % 5]}\`,
  level: ['基础', '进阶', '高级'][i % 3],
}))

function App() {
  const [keyword, setKeyword] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = courses.filter((c) =>
    c.title.includes(keyword) || c.level.includes(keyword),
  )

  function handleChange(event) {
    const value = event.target.value
    setKeyword(value)
  }

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'useTransition'),
      h('h3', null, '标记非紧急状态更新'),
    ),
    h('p', { className: 'muted' }, '输入立即更新，列表筛选作为过渡更新在后台执行，不会阻塞输入。'),
    h('div', { className: 'toolbar' },
      h('input', {
        placeholder: '搜索课程...',
        value: keyword,
        onChange: handleChange,
        style: { maxWidth: '220px' },
      }),
      h('span', { className: 'muted' }, \`\${filtered.length} / \${courses.length} 门课程\`),
    ),
    h('section', {
      className: 'panel',
      style: isPending ? { opacity: 0.6 } : undefined,
    },
      h('strong', null, isPending ? '正在更新列表...' : '课程列表'),
      h('div', { style: { maxHeight: '180px', overflow: 'auto', marginTop: '8px' } },
        filtered.slice(0, 30).map((course) =>
          h('div', { key: course.id, className: 'muted', style: { padding: '2px 0' } }, course.title),
        ),
      ),
      filtered.length > 30 && h('p', { className: 'muted' }, \`还有 \${filtered.length - 30} 门课程...\`),
    ),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,u=n({__name:"R20Transition",setup(r){return(i,l)=>(s(),t(e,{title:"React useTransition 演示",code:a(o)},null,8,["code"]))}});export{u as default};
