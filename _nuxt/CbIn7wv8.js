const e=`import { useDeferredValue, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

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

  return (
    <main className="app">
      <header>
        <p className="kicker">useDeferredValue</p>
        <h3>保持搜索输入优先响应</h3>
      </header>
      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder='输入"状态"或"性能"'
      />
      <section
        className="panel"
        style={{ opacity: isStale ? 0.55 : 1, transition: 'opacity 160ms' }}
        aria-busy={isStale}
      >
        <p className="muted">{isStale ? '结果正在追上最新输入...' : \`显示 \${results.length} 条结果\`}</p>
        <ul>
          {results.map((topic) => <li key={topic.id}>{topic.title}</li>)}
        </ul>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
