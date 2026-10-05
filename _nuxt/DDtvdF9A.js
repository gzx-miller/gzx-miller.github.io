const e=`import { createContext, useContext, useState } from 'react'
import { createRoot } from 'react-dom/client'

const ThemeContext = createContext(null)

function ActionPanel() {
  const theme = useContext(ThemeContext)

  if (!theme) throw new Error('ActionPanel 必须位于 ThemeContext.Provider 内')

  return (
    <section
      className="panel"
      style={{
        background: theme.mode === 'warm' ? '#fff4dd' : '#eef5f2',
        borderColor: theme.mode === 'warm' ? '#efc48d' : '#9fc9b5',
      }}
    >
      <strong>当前主题：{theme.mode === 'warm' ? '暖秋' : '森林'}</strong>
      <p className="muted">深层组件直接读取最近的 Context，无需逐层传递 props。</p>
      <button onClick={theme.toggle}>切换主题</button>
    </section>
  )
}

function App() {
  const [mode, setMode] = useState('warm')
  const value = { mode, toggle: () => setMode((current) => current === 'warm' ? 'forest' : 'warm') }

  return (
    <ThemeContext.Provider value={value}>
      <main className="app">
        <header>
          <p className="kicker">Context 跨层共享</p>
          <h3>工作台主题配置</h3>
        </header>
        <ActionPanel />
      </main>
    </ThemeContext.Provider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
