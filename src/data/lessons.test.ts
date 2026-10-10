import { describe, expect, it } from 'vitest'
import { isCommentOnlySource } from './code-quality'
import { getAllLessons, getLessonsByCategory, knowledgeCategories } from './lessons'

describe('课程注册表', () => {
  it('新增专题课程按子类别形成完整章节', async () => {
    const expectedCurriculum = [
      { id: 'javascript', lessonCount: 28, groupCount: 9 },
      { id: 'typescript', lessonCount: 24, groupCount: 4 },
      { id: 'nodejs', lessonCount: 30, groupCount: 16 },
      { id: 'vue', lessonCount: 38, groupCount: 15 },
      { id: 'react', lessonCount: 35, groupCount: 22 },
      { id: 'langchain', lessonCount: 23, groupCount: 14 },
      { id: 'element-plus', lessonCount: 20, groupCount: 7 },
      { id: 'tailwind-css', lessonCount: 24, groupCount: 12 },
      { id: 'sass', lessonCount: 16, groupCount: 7 },
      { id: 'webgl', lessonCount: 20, groupCount: 7 },
      { id: 'webassembly', lessonCount: 20, groupCount: 8 },
      { id: 'uni-app', lessonCount: 15, groupCount: 10 },
    ]

    for (const expected of expectedCurriculum) {
      const categoryLessons = await getLessonsByCategory(expected.id)
      const groups = new Set(categoryLessons.map((lesson) => lesson.category))

      expect(categoryLessons).toHaveLength(expected.lessonCount)
      expect(groups.size).toBe(expected.groupCount)
    }
  }, 20000)

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
  }, 20000)

  it('每个内容都归属于已知分类，已声明源码的课程能按需读取到源码', async () => {
    const categoryIds = new Set(knowledgeCategories.map((category) => category.id))
    const allLessons = await getAllLessons()

    for (const lesson of allLessons) {
      const routeCategory = lesson.path.split('/').filter(Boolean)[0]

      expect(categoryIds.has(routeCategory)).toBe(true)
      expect(lesson.navTitle.trim()).not.toBe('')
      expect(lesson.summary.trim()).not.toBe('')
    }

    // 课程可以不声明「关键代码」（例如正文已把要点讲完，没有独立代码样本），
    // 一旦声明就必须能读到有内容的源码。
    const lessonsWithCode = allLessons.filter((lesson) => lesson.code)
    const sources = await Promise.all(lessonsWithCode.map((lesson) => lesson.code!()))

    for (const [index, source] of sources.entries()) {
      const lesson = lessonsWithCode[index]

      expect(source.trim().length, `${lesson.id} 的源码为空或过短`).toBeGreaterThan(80)

      if (lesson.language === 'vue') {
        expect(source).toContain('<script')
      }
    }
  })

  it('每段「关键代码」都必须含实际代码，不能只有注释', async () => {
    const allLessons = await getAllLessons()
    const lessonsWithCode = allLessons.filter((lesson) => lesson.code)
    const sources = await Promise.all(
      lessonsWithCode.map((lesson) => lesson.code!().then((source) => [lesson, source] as const)),
    )

    for (const [lesson, source] of sources) {
      expect(
        isCommentOnlySource(source, lesson.language),
        `${lesson.id}（${lesson.path}）的「关键代码」只剩注释，请补齐真实代码，或不要声明 code/language`,
      ).toBe(false)
    }
  })
})
