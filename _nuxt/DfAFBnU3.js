import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as o,o as s}from"./DutfXOOr.js";const l=`import React, { memo, useCallback, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement
const courses = [
  { id: 1, title: 'React 状态设计', level: '进阶' },
  { id: 2, title: '组件组合实践', level: '基础' },
  { id: 3, title: '并发渲染思维', level: '进阶' },
  { id: 4, title: '可访问表单', level: '基础' },
]
let listRenderCount = 0

const CourseList = memo(function CourseList({ items, onChoose }) {
  listRenderCount += 1
  return h('section', { className: 'panel' },
    h('strong', null, \`列表渲染次数：\${listRenderCount}\`),
    h('div', { className: 'grid', style: { marginTop: '10px' } },
      items.map((course) => h('button', {
        className: 'secondary',
        key: course.id,
        onClick: () => onChoose(course.title),
      }, course.title)),
    ),
  )
})

function App() {
  const [level, setLevel] = useState('全部')
  const [themeCount, setThemeCount] = useState(0)
  const [chosen, setChosen] = useState('尚未选择')
  const visibleCourses = useMemo(
    () => level === '全部' ? courses : courses.filter((course) => course.level === level),
    [level],
  )
  const chooseCourse = useCallback((title) => setChosen(title), [])

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'memo + useMemo + useCallback'),
      h('h3', null, '只优化已经确认的重复工作'),
    ),
    h('div', { className: 'toolbar' },
      h('select', { value: level, onChange: (event) => setLevel(event.target.value), style: { maxWidth: '150px' } },
        ['全部', '基础', '进阶'].map((item) => h('option', { key: item }, item)),
      ),
      h('button', { className: 'secondary', onClick: () => setThemeCount((count) => count + 1) }, \`刷新外观 \${themeCount}\`),
    ),
    h(CourseList, { items: visibleCourses, onChoose: chooseCourse }),
    h('p', { className: 'muted' }, \`当前选择：\${chosen}。刷新外观不会让列表重复渲染。\`),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,m=n({__name:"R10Memoization",setup(c){return(a,r)=>(s(),t(e,{title:"React 记忆化优化演示",code:o(l)},null,8,["code"]))}});export{m as default};
