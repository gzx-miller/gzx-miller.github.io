import { beforeEach, describe, expect, it } from 'vitest'
import { useLearningProgress } from './useLearningProgress'

describe('useLearningProgress', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('markVisited 后能通过 isVisited 查询', () => {
    const { markVisited, isVisited } = useLearningProgress()

    markVisited('/vue/k-1/app-entry')

    expect(isVisited('/vue/k-1/app-entry')).toBe(true)
    expect(isVisited('/typescript/t-4/generics')).toBe(false)
  })

  it('重复标记同一路径不会重复计数', () => {
    const { visitedPaths, markVisited, visitedCount } = useLearningProgress()
    const before = visitedCount()

    markVisited('/t1/a')
    markVisited('/t1/a')
    markVisited('/t1/b')

    expect(visitedPaths.value.has('/t1/a')).toBe(true)
    expect(visitedCount()).toBe(before + 2)
  })
})