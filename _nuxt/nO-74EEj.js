import{R as n}from"./Hhvd03iW.js";import{d as e,B as t,y as s,o as i}from"./DutfXOOr.js";const a=`import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function OnlineStatus() {
  const [status, setStatus] = useState(
    typeof navigator !== 'undefined' && navigator.onLine ? '在线' : '离线',
  )

  useEffect(() => {
    function handleOnline() { setStatus('在线') }
    function handleOffline() { setStatus('离线') }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return h('span', { className: 'badge', style: status === '在线' ? { background: '#d4edda', color: '#28744b' } : { background: '#f8d7da', color: '#a33122' } }, status)
}

function WindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return h('div', { className: 'item' },
    h('div', null,
      h('div', { className: 'muted', style: { fontSize: '12px' } }, '窗口尺寸'),
      h('div', { className: 'metric' }, \`\${size.width} × \${size.height}\`),
    ),
  )
}

function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  return h('div', { className: 'item' },
    h('div', null,
      h('div', { className: 'muted', style: { fontSize: '12px' } },
        '计时器 ',
        h(OnlineStatus),
      ),
      h('div', { className: 'metric' }, \`\${seconds}s\`),
      h('div', { className: 'toolbar', style: { marginTop: '6px' } },
        h('button', { onClick: () => setRunning((v) => !v) }, running ? '暂停' : '开始'),
        h('button', { className: 'secondary', onClick: () => { setRunning(false); setSeconds(0) } }, '重置'),
      ),
    ),
  )
}

function App() {
  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'Effect 生命周期'),
      h('h3', null, '挂载、更新与卸载的常见模式'),
    ),
    h('p', { className: 'muted' }, 'Effect 在挂载时执行，依赖变化时先清理再重新执行，卸载时执行最后一次清理。'),
    h('div', { className: 'grid' },
      h(WindowSize),
      h(Timer),
    ),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,u=e({__name:"R24EffectLifecycle",setup(o){return(r,c)=>(i(),t(n,{title:"React Effect 生命周期演示",code:s(a)},null,8,["code"]))}});export{u as default};
