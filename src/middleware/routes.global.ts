import { knowledgeCategories, lessonPathMap, getLessonsByCategory } from '../data/lessons'

const categoryIds = knowledgeCategories
  .filter((category) => category.status === 'ready')
  .map((category) => category.id)

// 从 lessonPathMap 获取 fallback（lessonPathMap 包含所有路径，但它是静态导出的）
const allPaths = [...lessonPathMap.keys()]
const fallbackPath = allPaths.find((p) => p.startsWith('/vue/')) ?? '/vue/k-1/app-entry'

function firstLessonPath(category: string) {
  const catLessons = getLessonsByCategory(category)
  return catLessons[0]?.path ?? fallbackPath
}

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/') {
    return navigateTo(fallbackPath, { redirectCode: 301 })
  }

  if (to.path === '/total-vue' || to.path === '/total-vue/') {
    return navigateTo('/vue', { redirectCode: 301 })
  }

  if (to.path.startsWith('/total-vue/')) {
    const legacyPath = to.path.slice('/total-vue'.length)
    return navigateTo(legacyPath.startsWith('/vue/') ? legacyPath : '/vue', { redirectCode: 301 })
  }

  const category = categoryIds.find((id) => to.path === `/${id}`)
  if (category) {
    return navigateTo(firstLessonPath(category), { redirectCode: 301 })
  }

  const isLesson = lessonPathMap.has(to.path)
  const isRoutingDemo = to.path.startsWith('/vue/k-12/routing/')

  if (!isLesson && !isRoutingDemo) {
    return navigateTo(fallbackPath, { redirectCode: 302 })
  }
})
