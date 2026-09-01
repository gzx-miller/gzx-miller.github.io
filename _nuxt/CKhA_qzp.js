import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as o,o as r}from"./DutfXOOr.js";const a=`import React, { createContext, useContext, useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement
const ThemeContext = createContext(null)

function ActionPanel() {
  const theme = useContext(ThemeContext)

  if (!theme) throw new Error('ActionPanel 必须位于 ThemeContext.Provider 内')

  return h('section', {
    className: 'panel',
    style: {
      background: theme.mode === 'warm' ? '#fff4dd' : '#eef5f2',
      borderColor: theme.mode === 'warm' ? '#efc48d' : '#9fc9b5',
    },
  },
    h('strong', null, \`当前主题：\${theme.mode === 'warm' ? '暖秋' : '森林'}\`),
    h('p', { className: 'muted' }, '深层组件直接读取最近的 Context，无需逐层传递 props。'),
    h('button', { onClick: theme.toggle }, '切换主题'),
  )
}

function App() {
  const [mode, setMode] = useState('warm')
  const value = { mode, toggle: () => setMode((current) => current === 'warm' ? 'forest' : 'warm') }

  return h(ThemeContext.Provider, { value },
    h('main', { className: 'app' },
      h('header', null,
        h('p', { className: 'kicker' }, 'Context 跨层共享'),
        h('h3', null, '工作台主题配置'),
      ),
      h(ActionPanel),
    ),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,h=n({__name:"R07Context",setup(c){return(m,s)=>(r(),t(e,{title:"React Context 演示",code:o(a)},null,8,["code"]))}});export{h as default};
