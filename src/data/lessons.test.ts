import { describe, expect, it } from 'vitest'
import { knowledgeCategories, lessons } from './lessons'

describe('课程注册表', () => {
  it('所有已上线分类都有课程，且课程标识和路由唯一', () => {
    const readyCategories = knowledgeCategories.filter((category) => category.status === 'ready')
    const lessonIds = lessons.map((lesson) => lesson.id)
    const lessonPaths = lessons.map((lesson) => lesson.path)

    expect(new Set(lessonIds).size).toBe(lessonIds.length)
    expect(new Set(lessonPaths).size).toBe(lessonPaths.length)

    for (const category of readyCategories) {
      const categoryLessons = lessons.filter((lesson) => lesson.path.startsWith(`${category.path}/`))

      expect(categoryLessons.length).toBeGreaterThanOrEqual(8)
    }
  })

  it('每个案例都归属于已知分类，并能按需读取源码', async () => {
    const categoryIds = new Set(knowledgeCategories.map((category) => category.id))

    for (const lesson of lessons) {
      const routeCategory = lesson.path.split('/').filter(Boolean)[0]

      expect(categoryIds.has(routeCategory)).toBe(true)
      expect(lesson.navTitle.trim()).not.toBe('')
      expect(lesson.summary.trim()).not.toBe('')
    }

    const sources = await Promise.all(lessons.map((lesson) => lesson.code()))

    for (const [index, source] of sources.entries()) {
      expect(source.trim().length).toBeGreaterThan(80)

      if (lessons[index].language === 'vue') {
        expect(source).toContain('<template>')
      }
    }
  })
})
