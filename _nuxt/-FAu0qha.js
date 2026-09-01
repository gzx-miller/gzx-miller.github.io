import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as s,o}from"./DutfXOOr.js";const r=`import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement
const courses = [
  { id: 'react', title: 'React 核心', level: '入门' },
  { id: 'hooks', title: 'Hooks 实战', level: '进阶' },
  { id: 'testing', title: 'React 测试', level: '进阶' },
  { id: 'design', title: '组件设计', level: '入门' },
]

function App() {
  const [keyword, setKeyword] = useState('')
  const visibleCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(keyword.trim().toLowerCase())
  )

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, '列表渲染与稳定 Key'),
      h('h3', null, '课程检索'),
    ),
    h('input', {
      value: keyword,
      placeholder: '输入课程关键词',
      onChange: (event) => setKeyword(event.target.value),
    }),
    h('div', { className: 'grid' },
      visibleCourses.map((course) => h('article', { className: 'item', key: course.id },
        h('strong', null, course.title),
        h('span', { className: 'badge' }, course.level),
      )),
    ),
    h('p', { className: 'muted' }, \`找到 \${visibleCourses.length} 门课程；筛选结果直接在渲染阶段计算。\`),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,d=n({__name:"R03ListsKeys",setup(a){return(c,l)=>(o(),t(e,{title:"React 列表与 Key 演示",code:s(r)},null,8,["code"]))}});export{d as default};
