import { describe, expect, it } from 'vitest'
import { getAllLessons, getLessonsByCategory, knowledgeCategories } from './lessons'

describe('课程注册表', () => {
  it('新增专题课程按子类别形成完整章节', async () => {
    const expectedCurriculum = [
      { id: 'javascript', lessonCount: 28, groupCount: 9 },
      { id: 'typescript', lessonCount: 24, groupCount: 4 },
      { id: 'nodejs', lessonCount: 30, groupCount: 16 },
      { id: 'vue', lessonCount: 37, groupCount: 15 },
      { id: 'react', lessonCount: 35, groupCount: 22 },
      { id: 'engineering', lessonCount: 30, groupCount: 8 },
      { id: 'langchain', lessonCount: 23, groupCount: 14 },
      { id: 'element-plus', lessonCount: 20, groupCount: 7 },
      { id: 'tailwind-css', lessonCount: 24, groupCount: 12 },
      { id: 'sass', lessonCount: 24, groupCount: 9 },
    ]

    for (const expected of expectedCurriculum) {
      const categoryLessons = await getLessonsByCategory(expected.id)
      const groups = new Set(categoryLessons.map((lesson) => lesson.category))

      expect(categoryLessons).toHaveLength(expected.lessonCount)
      expect(groups.size).toBe(expected.groupCount)
    }
  })

  it('所有已上线分类都有课程，且课程标识和路由唯一', async () => {
    const readyCategories = knowledgeCategories.filter((category) => category.status === 'ready')
    const allLessons = await getAllLessons()
    const lessonIds = allLessons.map((lesson) => lesson.id)
    const lessonPaths = allLessons.map((lesson) => lesson.path)

    expect(new Set(lessonIds).size).toBe(lessonIds.length)
    expect(new Set(lessonPaths).size).toBe(lessonPaths.length)

    for (const category of readyCategories) {
      const categoryLessons = allLessons.filter((lesson) => lesson.path.startsWith(`${category.path}/`))

      expect(categoryLessons.length).toBeGreaterThanOrEqual(8)
    }
  })

  it('每个案例都归属于已知分类，并能按需读取源码', async () => {
    const categoryIds = new Set(knowledgeCategories.map((category) => category.id))
    const allLessons = await getAllLessons()

    for (const lesson of allLessons) {
      const routeCategory = lesson.path.split('/').filter(Boolean)[0]

      expect(categoryIds.has(routeCategory)).toBe(true)
      expect(lesson.navTitle.trim()).not.toBe('')
      expect(lesson.summary.trim()).not.toBe('')
    }

    const sources = await Promise.all(
      allLessons.map((lesson) => (lesson.code ? lesson.code() : Promise.resolve('')))
    )

    for (const [index, source] of sources.entries()) {
      expect(source.trim().length, `${allLessons[index].id} 的源码为空或过短`).toBeGreaterThan(80)

      if (allLessons[index].language === 'vue') {
        expect(source).toContain('<template>')
      }
    }
  })
})
