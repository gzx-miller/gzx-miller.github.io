import{R as n}from"./Hhvd03iW.js";import{d as e,B as r,y as t,o}from"./DutfXOOr.js";const a=`import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('课程卡片渲染失败', error, info.componentStack)
  }

  render() {
    if (this.state.failed) {
      return h('section', { className: 'panel' },
        h('strong', { className: 'error' }, '课程卡片暂时不可用'),
        h('p', { className: 'muted' }, '其余页面仍可继续操作。'),
        h('button', {
          onClick: () => {
            this.props.onReset()
            this.setState({ failed: false })
          },
        }, '重试'),
      )
    }
    return this.props.children
  }
}

function CourseCard({ broken }) {
  if (broken) throw new Error('模拟渲染错误')
  return h('section', { className: 'panel' }, h('strong', null, 'React 容错设计'), h('p', { className: 'muted' }, '课程内容加载正常。'))
}

function App() {
  const [broken, setBroken] = useState(false)
  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'Error Boundary'),
      h('h3', null, '隔离局部渲染故障'),
    ),
    h('button', { onClick: () => setBroken(true) }, '模拟卡片故障'),
    h(ErrorBoundary, { onReset: () => setBroken(false) }, h(CourseCard, { broken })),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,u=e({__name:"R15ErrorBoundary",setup(s){return(c,l)=>(o(),r(n,{title:"React 错误边界演示",code:t(a)},null,8,["code"]))}});export{u as default};
