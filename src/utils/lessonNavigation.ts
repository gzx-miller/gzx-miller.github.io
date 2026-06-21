export interface GroupableLesson {
  id: string
  category: string
}

export interface LessonGroup<T extends GroupableLesson> {
  title: string
  lessons: T[]
}

export function groupLessons<T extends GroupableLesson>(lessons: readonly T[]): LessonGroup<T>[] {
  const groups = new Map<string, T[]>()

  for (const lesson of lessons) {
    const group = groups.get(lesson.category) ?? []
    group.push(lesson)
    groups.set(lesson.category, group)
  }

  return Array.from(groups, ([title, groupLessons]) => ({ title, lessons: groupLessons }))
}

export function flattenLessonGroups<T extends GroupableLesson>(groups: readonly LessonGroup<T>[]): T[] {
  return groups.flatMap((group) => group.lessons)
}

export function createLessonOrderMap<T extends GroupableLesson>(lessons: readonly T[]): ReadonlyMap<string, number> {
  return new Map(lessons.map((lesson, index) => [lesson.id, index]))
}
