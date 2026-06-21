import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useCourseStore = create(subscribeWithSelector((set) => ({
  progress: 0,
  advance: () => set((state) => ({ progress: Math.min(100, state.progress + 20) })),
})))

function App() {
  const progress = useCourseStore((state) => state.progress)
  const advance = useCourseStore((state) => state.advance)
  const [events, setEvents] = useState([])
  useEffect(() => useCourseStore.subscribe((state) => state.progress, (value, previous) => {
    setEvents((items) => [`${previous}% → ${value}%`, ...items])
  }), [])
  return <main className="app"><p className="kicker">subscribeWithSelector</p><p className="metric">{progress}%</p><button onClick={advance}>完成一阶段</button><ul>{events.map((event) => <li key={event}>{event}</li>)}</ul></main>
}
createRoot(document.getElementById('root')).render(<App />)
