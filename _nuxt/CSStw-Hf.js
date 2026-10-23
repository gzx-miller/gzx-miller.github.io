const n=`import { useState } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'

function ConfirmDialog({ onClose }) {
  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 20, display: 'grid', placeItems: 'center',
        padding: '18px', background: 'rgba(50, 25, 15, .5)',
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="panel"
        onClick={(event) => event.stopPropagation()}
        style={{ width: 'min(360px, 100%)', boxShadow: '0 18px 50px rgba(50, 25, 15, .3)' }}
      >
        <h3 id="dialog-title">确认发布课程？</h3>
        <p className="muted">弹窗 DOM 位于 document.body，但事件和 Context 仍沿 React 树工作。</p>
        <div className="actions">
          <button onClick={onClose}>确认</button>
          <button className="secondary" onClick={onClose}>取消</button>
        </div>
      </section>
    </div>,
    document.body,
  )
}

function App() {
  const [open, setOpen] = useState(false)
  return (
    <main className="app" onClick={() => console.log('事件仍沿 React 树冒泡')}>
      <header>
        <p className="kicker">createPortal</p>
        <h3>把弹窗渲染到页面顶层</h3>
      </header>
      <div className="panel" style={{ overflow: 'hidden' }}>
        <p className="muted">即使触发按钮处于受 overflow 限制的容器中，Portal 弹窗也不会被裁切。</p>
        <button onClick={() => setOpen(true)}>发布课程</button>
      </div>
      {open ? <ConfirmDialog onClose={() => setOpen(false)} /> : null}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{n as default};
