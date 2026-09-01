import{R as n}from"./Hhvd03iW.js";import{d as e,B as o,y as t,o as a}from"./DutfXOOr.js";const l=`import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function ConfirmDialog({ onClose }) {
  return createPortal(
    h('div', {
      role: 'presentation',
      onClick: onClose,
      style: {
        position: 'fixed', inset: 0, zIndex: 20, display: 'grid', placeItems: 'center',
        padding: '18px', background: 'rgba(50, 25, 15, .5)',
      },
    },
      h('section', {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'dialog-title',
        className: 'panel',
        onClick: (event) => event.stopPropagation(),
        style: { width: 'min(360px, 100%)', boxShadow: '0 18px 50px rgba(50, 25, 15, .3)' },
      },
        h('h3', { id: 'dialog-title' }, '确认发布课程？'),
        h('p', { className: 'muted' }, '弹窗 DOM 位于 document.body，但事件和 Context 仍沿 React 树工作。'),
        h('div', { className: 'actions' },
          h('button', { onClick: onClose }, '确认'),
          h('button', { className: 'secondary', onClick: onClose }, '取消'),
        ),
      ),
    ),
    document.body,
  )
}

function App() {
  const [open, setOpen] = useState(false)
  return h('main', { className: 'app', onClick: () => console.log('事件仍沿 React 树冒泡') },
    h('header', null,
      h('p', { className: 'kicker' }, 'createPortal'),
      h('h3', null, '把弹窗渲染到页面顶层'),
    ),
    h('div', { className: 'panel', style: { overflow: 'hidden' } },
      h('p', { className: 'muted' }, '即使触发按钮处于受 overflow 限制的容器中，Portal 弹窗也不会被裁切。'),
      h('button', { onClick: () => setOpen(true) }, '发布课程'),
    ),
    open ? h(ConfirmDialog, { onClose: () => setOpen(false) }) : null,
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,p=e({__name:"R13Portal",setup(r){return(c,s)=>(a(),o(n,{title:"React Portal 弹窗演示",code:t(l)},null,8,["code"]))}});export{p as default};
