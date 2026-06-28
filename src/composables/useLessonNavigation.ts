import { computed } from 'vue'
import { knowledgeCategories, lessons } from '../data/lessons'
import { createLessonOrderMap, flattenLessonGroups, groupLessons } from '../utils/lessonNavigation'

/**
 * 提供跨 layout 与 page 共享的课程导航响应式状态。
 * 顶部导航、侧边栏(layout)与正文(page)各自调用本 composable，
 * 由于都基于同一个 route，计算结果一致；computed 自带缓存，重复调用开销可忽略。
 */
export function useLessonNavigation() {
  const route = useRoute()

  const activeKnowledge = computed(() => {
    const category = route.path.split('/').filter(Boolean)[0]
    return knowledgeCategories.some((item) => item.id === category) ? category : 'vue'
  })

  const activeCategory = computed(() =>
    knowledgeCategories.find((category) => category.id === activeKnowledge.value),
  )
  const activeCategoryName = computed(() => activeCategory.value?.name ?? activeKnowledge.value)

  const filteredLessons = computed(() =>
    lessons.filter((lesson) => lesson.path.startsWith(`/${activeKnowledge.value}/`)),
  )

  const allLessonGroups = computed(() => groupLessons(filteredLessons.value))
  const orderedLessons = computed(() => flattenLessonGroups(allLessonGroups.value))
  const lessonOrderMap = computed(() => createLessonOrderMap(orderedLessons.value))

  const currentLesson = computed(() => {
    if (route.path.startsWith('/vue/k-12/routing/')) {
      return lessons.find((lesson) => lesson.id === 'K_12') ?? lessons[0]
    }
    return lessons.find((lesson) => lesson.path === route.path) ?? lessons[0]
  })

  function getLessonGroupIndex(lessonId: string): number {
    return lessonOrderMap.value.get(lessonId) ?? 0
  }

  function formatLessonId(index: number) {
    return `🌰${index + 1}`
  }

  return {
    activeKnowledge,
    activeCategory,
    activeCategoryName,
    filteredLessons,
    allLessonGroups,
    orderedLessons,
    lessonOrderMap,
    currentLesson,
    getLessonGroupIndex,
    formatLessonId,
  }
}
