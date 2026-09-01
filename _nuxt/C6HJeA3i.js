import{R as n}from"./Hhvd03iW.js";import{d as e,B as t,y as o,o as s}from"./DutfXOOr.js";const i=`import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const connect = () => setIsOnline(true)
    const disconnect = () => setIsOnline(false)
    window.addEventListener('online', connect)
    window.addEventListener('offline', disconnect)

    return () => {
      window.removeEventListener('online', connect)
      window.removeEventListener('offline', disconnect)
    }
  }, [])

  return isOnline
}

function SaveButton() {
  const isOnline = useOnlineStatus()
  return h('button', { disabled: !isOnline }, isOnline ? '保存课程草稿' : '离线，等待恢复')
}

function StatusBadge() {
  const isOnline = useOnlineStatus()
  return h('span', { className: 'badge' }, isOnline ? '网络正常' : '当前离线')
}

function App() {
  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, '自定义 Hook'),
      h('h3', null, '在线状态复用'),
    ),
    h('div', { className: 'item' },
      h('div', null,
        h('strong', null, '课程编辑器'),
        h('p', { className: 'muted' }, '两个组件复用相同的浏览器事件订阅逻辑。'),
      ),
      h(StatusBadge),
    ),
    h(SaveButton),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,d=e({__name:"R08CustomHook",setup(c){return(a,r)=>(s(),t(n,{title:"React 自定义 Hook 演示",code:o(i)},null,8,["code"]))}});export{d as default};
