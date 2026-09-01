import{R as e}from"./Hhvd03iW.js";import{d as t,B as n,y as s,o as a}from"./DutfXOOr.js";const c=`import React, { useReducer } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement
const initialState = { step: 0, approved: false }
const steps = ['填写资料', '技术评审', '确认入组']

function reducer(state, action) {
  switch (action.type) {
    case 'next':
      return { ...state, step: Math.min(state.step + 1, steps.length - 1) }
    case 'approve':
      return { ...state, approved: true }
    case 'reset':
      return initialState
    default:
      throw new Error(\`未知 action：\${action.type}\`)
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'useReducer 状态机'),
      h('h3', null, '项目成员入组流程'),
    ),
    h('div', { className: 'grid' },
      steps.map((step, index) => h('div', { className: 'panel', key: step },
        h('span', { className: 'badge' }, index + 1),
        h('p', null, step),
        index < state.step && h('strong', { className: 'success' }, '已完成'),
        index === state.step && h('strong', null, '进行中'),
      )),
    ),
    h('div', { className: 'actions' },
      h('button', { onClick: () => dispatch({ type: 'next' }), disabled: state.step === steps.length - 1 }, '下一步'),
      h('button', { onClick: () => dispatch({ type: 'approve' }), disabled: state.approved }, '确认通过'),
      h('button', { className: 'secondary', onClick: () => dispatch({ type: 'reset' }) }, '重置'),
    ),
    state.approved && h('p', { className: 'success' }, '成员已通过入组确认'),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,l=t({__name:"R06Reducer",setup(r){return(o,p)=>(a(),n(e,{title:"React useReducer 演示",code:s(c)},null,8,["code"]))}});export{l as default};
