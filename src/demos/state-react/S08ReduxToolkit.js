import React from 'react'
import { createRoot } from 'react-dom/client'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState: { seats: 3, enrolled: 0 },
  reducers: {
    enroll(state) { if (state.seats > 0) { state.seats--; state.enrolled++ } },
    reset: () => ({ seats: 3, enrolled: 0 }),
  },
})
const store = configureStore({ reducer: { enrollment: enrollmentSlice.reducer } })

function Enrollment() {
  const state = useSelector((root) => root.enrollment)
  const dispatch = useDispatch()
  return <main className="app"><p className="kicker">Redux Toolkit slice</p><div className="grid"><div className="panel"><span>剩余名额</span><p className="metric">{state.seats}</p></div><div className="panel"><span>已报名</span><p className="metric">{state.enrolled}</p></div></div><div className="actions"><button onClick={() => dispatch(enrollmentSlice.actions.enroll())}>报名</button><button className="secondary" onClick={() => dispatch(enrollmentSlice.actions.reset())}>重置</button></div></main>
}
createRoot(document.getElementById('root')).render(<Provider store={store}><Enrollment /></Provider>)
