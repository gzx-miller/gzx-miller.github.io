import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as r,o}from"./DutfXOOr.js";const a=`import React, { useDeferredValue, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement
const topics = Array.from({ length: 800 }, (_, index) => ({
  id: index + 1,
  title: \`\${['状态', '组件', '性能', '表单'][index % 4]}练习 \${index + 1}\`,
}))

function App() {
  const [keyword, setKeyword] = useState('')
  const deferredKeyword = useDeferredValue(keyword)
  const results = useMemo(
    () => topics.filter((topic) => topic.title.includes(deferredKeyword)).slice(0, 12),
    [deferredKeyword],
  )
  const isStale = keyword !== deferredKeyword

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'useDeferredValue'),
      h('h3', null, '保持搜索输入优先响应'),
    ),
    h('input', {
      value: keyword,
      onChange: (event) => setKeyword(event.target.value),
      placeholder: '输入“状态”或“性能”',
    }),
    h('section', {
      className: 'panel',
      style: { opacity: isStale ? 0.55 : 1, transition: 'opacity 160ms' },
      'aria-busy': isStale,
    },
      h('p', { className: 'muted' }, isStale ? '结果正在追上最新输入...' : \`显示 \${results.length} 条结果\`),
      h('ul', null, results.map((topic) => h('li', { key: topic.id }, topic.title))),
    ),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,u=n({__name:"R11DeferredValue",setup(s){return(c,l)=>(o(),t(e,{title:"React useDeferredValue 演示",code:r(a)},null,8,["code"]))}});export{u as default};
