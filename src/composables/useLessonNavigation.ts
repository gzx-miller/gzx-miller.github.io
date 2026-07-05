import { computed, ref, watch, onMounted } from 'vue'
import { knowledgeCategories, knowledgeCategoryMap, getLessonsByCategory, getLoadedLessonsByCategory, getLessonByPath, getLessonById } from '../data/lessons'
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
    return knowledgeCategoryMap.has(category) ? category : 'vue'
  })

  const activeCategory = computed(() =>
    knowledgeCategoryMap.get(activeKnowledge.value),
  )
  const activeCategoryName = computed(() => activeCategory.value?.name ?? activeKnowledge.value)

  // 触发异步加载当前分类的课程
  onMounted(async () => {
    await getLessonsByCategory(activeKnowledge.value)
  })

  watch(activeKnowledge, async (newCategory) => {
    await getLessonsByCategory(newCategory)
  })

  // 按分类动态加载课程（使用已缓存的数据）
  const filteredLessons = computed(() =>
    getLoadedLessonsByCategory(activeKnowledge.value),
  )

  const allLessonGroups = computed(() => groupLessons(filteredLessons.value))
  const orderedLessons = computed(() => flattenLessonGroups(allLessonGroups.value))
  const lessonOrderMap = computed(() => createLessonOrderMap(orderedLessons.value))

  const currentLesson = computed(() => {
    if (route.path.startsWith('/vue/k-12/routing/')) {
      return getLessonById('K_12') ?? filteredLessons.value[0]
    }
    return getLessonByPath(route.path) ?? filteredLessons.value[0]
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
