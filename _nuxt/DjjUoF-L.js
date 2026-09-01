const e=`import { useReducer } from 'react'
import { createRoot } from 'react-dom/client'

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

  return (
    <main className="app">
      <header>
        <p className="kicker">useReducer 状态机</p>
        <h3>项目成员入组流程</h3>
      </header>
      <div className="grid">
        {steps.map((step, index) => (
          <div className="panel" key={step}>
            <span className="badge">{index + 1}</span>
            <p>{step}</p>
            {index < state.step && <strong className="success">已完成</strong>}
            {index === state.step && <strong>进行中</strong>}
          </div>
        ))}
      </div>
      <div className="actions">
        <button onClick={() => dispatch({ type: 'next' })} disabled={state.step === steps.length - 1}>下一步</button>
        <button onClick={() => dispatch({ type: 'approve' })} disabled={state.approved}>确认通过</button>
        <button className="secondary" onClick={() => dispatch({ type: 'reset' })}>重置</button>
      </div>
      {state.approved && <p className="success">成员已通过入组确认</p>}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
