import { describe, expect, it } from 'vitest'
import { createLessonOrderMap, flattenLessonGroups, groupLessons } from './lessonNavigation'

const lessons = [
  { id: '1', category: '基础' },
  { id: '2', category: '进阶' },
  { id: '3', category: '基础' },
  { id: '4', category: '工程' },
  { id: '5', category: '进阶' },
]

describe('课程导航顺序', () => {
  it('按章节首次出现顺序分组，并保持章节内部顺序', () => {
    const groups = groupLessons(lessons)

    expect(groups.map((group) => group.title)).toEqual(['基础', '进阶', '工程'])
    expect(groups.map((group) => group.lessons.map((lesson) => lesson.id))).toEqual([
      ['1', '3'],
      ['2', '5'],
      ['4'],
    ])
  })

  it('分组后的显示序号连续且稳定', () => {
    const orderedLessons = flattenLessonGroups(groupLessons(lessons))
    const orderMap = createLessonOrderMap(orderedLessons)

    expect(orderedLessons.map((lesson) => lesson.id)).toEqual(['1', '3', '2', '5', '4'])
    expect(orderedLessons.map((lesson) => orderMap.get(lesson.id))).toEqual([0, 1, 2, 3, 4])
  })
})
