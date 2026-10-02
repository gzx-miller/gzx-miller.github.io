const t=`import React from 'react'
import { createRoot } from 'react-dom/client'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/react'

const checkoutMachine = createMachine({
  id: 'checkout',
  initial: 'editing',
  states: {
    editing: { on: { SUBMIT: 'submitting' } },
    submitting: { on: { RESOLVE: 'success', REJECT: 'failure' } },
    failure: { on: { RETRY: 'submitting', EDIT: 'editing' } },
    success: { type: 'final' },
  },
})

function App() {
  const [snapshot, send] = useMachine(checkoutMachine)
  const state = snapshot.value
  return <main className="app"><p className="kicker">XState 有限状态机</p><p className="metric">{state}</p><div className="actions">{state === 'editing' && <button onClick={() => send({ type: 'SUBMIT' })}>提交</button>}{state === 'submitting' && <><button onClick={() => send({ type: 'RESOLVE' })}>成功</button><button className="secondary" onClick={() => send({ type: 'REJECT' })}>失败</button></>}{state === 'failure' && <><button onClick={() => send({ type: 'RETRY' })}>重试</button><button className="secondary" onClick={() => send({ type: 'EDIT' })}>修改</button></>}</div></main>
}
createRoot(document.getElementById('root')).render(<App />)
`;export{t as default};
