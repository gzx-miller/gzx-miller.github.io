const e=`import { memo, useCallback, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

const courses = [
  { id: 1, title: 'React 状态设计', level: '进阶' },
  { id: 2, title: '组件组合实践', level: '基础' },
  { id: 3, title: '并发渲染思维', level: '进阶' },
  { id: 4, title: '可访问表单', level: '基础' },
]
let listRenderCount = 0

const CourseList = memo(function CourseList({ items, onChoose }) {
  listRenderCount += 1
  return (
    <section className="panel">
      <strong>列表渲染次数：{listRenderCount}</strong>
      <div className="grid" style={{ marginTop: '10px' }}>
        {items.map((course) => (
          <button className="secondary" key={course.id} onClick={() => onChoose(course.title)}>
            {course.title}
          </button>
        ))}
      </div>
    </section>
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

  return (
    <main className="app">
      <header>
        <p className="kicker">memo + useMemo + useCallback</p>
        <h3>只优化已经确认的重复工作</h3>
      </header>
      <div className="toolbar">
        <select value={level} onChange={(event) => setLevel(event.target.value)} style={{ maxWidth: '150px' }}>
          {['全部', '基础', '进阶'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <button className="secondary" onClick={() => setThemeCount((count) => count + 1)}>
          刷新外观 {themeCount}
        </button>
      </div>
      <CourseList items={visibleCourses} onChoose={chooseCourse} />
      <p className="muted">当前选择：{chosen}。刷新外观不会让列表重复渲染。</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
