const e=`import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { createRoot } from 'react-dom/client'

const SearchInput = forwardRef(function SearchInput(props, ref) {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')

  useImperativeHandle(ref, () => ({
    focus() { inputRef.current?.focus() },
    clear() { setQuery(''); inputRef.current?.focus() },
    getValue() { return query },
  }))

  return (
    <div className="field">
      <label>课程搜索</label>
      <input
        ref={inputRef}
        value={query}
        placeholder="输入课程关键词..."
        onChange={(event) => setQuery(event.target.value)}
      />
    </div>
  )
})

function App() {
  const searchRef = useRef(null)
  const [lastQuery, setLastQuery] = useState('')

  return (
    <main className="app">
      <header>
        <p className="kicker">useImperativeHandle</p>
        <h3>限定组件暴露的命令式接口</h3>
      </header>
      <p className="muted">父组件通过 ref 只能调用子组件显式暴露的方法，而不是整个 DOM 节点。</p>
      <SearchInput ref={searchRef} />
      <div className="toolbar">
        <button onClick={() => searchRef.current?.focus()}>聚焦搜索框</button>
        <button className="secondary" onClick={() => searchRef.current?.clear()}>清空并聚焦</button>
        <button className="secondary" onClick={() => setLastQuery(searchRef.current?.getValue() || '')}>读取当前值</button>
      </div>
      {lastQuery && (
        <div className="panel">
          <strong>当前搜索值</strong>
          <p className="muted">{lastQuery}</p>
        </div>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
