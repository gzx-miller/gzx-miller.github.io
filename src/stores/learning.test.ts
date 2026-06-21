import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLearningStore } from './learning'

describe('learning store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('去重报名并计算学习统计', () => {
    const store = useLearningStore()

    store.enroll({ id: 2, title: 'Zustand Selector', minutes: 25 })
    store.enroll({ id: 2, title: '重复课程', minutes: 99 })
    store.toggleCompleted(1)

    expect(store.courses).toHaveLength(2)
    expect(store.totalMinutes).toBe(60)
    expect(store.completionRate).toBe(50)
  })
})
