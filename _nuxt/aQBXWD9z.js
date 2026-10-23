const e=`import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { atom, useAtomValue, useSetAtom } from 'jotai'

const refreshAtom = atom(0)
const coursesAtom = atom(async (get) => {
  get(refreshAtom)
  await new Promise((resolve) => setTimeout(resolve, 500))
  return ['原子化状态', '派生 Atom', '异步 Atom']
})

function Courses() {
  const courses = useAtomValue(coursesAtom)
  const refresh = useSetAtom(refreshAtom)
  return <section className="app"><ul>{courses.map((course) => <li key={course}>{course}</li>)}</ul><button onClick={() => refresh((value) => value + 1)}>重新读取</button></section>
}

function App() { return <main className="app"><p className="kicker">Jotai async atom</p><Suspense fallback={<p className="muted">异步 Atom 加载中…</p>}><Courses /></Suspense></main> }
createRoot(document.getElementById('root')).render(<App />)
`;export{e as default};
