import { knowledgeCategories, getLessonsByCategory, getLessonByPath } from '../data/lessons'

const categoryIds = knowledgeCategories
  .filter((category) => category.status === 'ready')
  .map((category) => category.id)

// 默认 fallback 路径
const DEFAULT_FALLBACK = '/vue/k-1/app-entry'

async function firstLessonPath(category: string): Promise<string> {
  const catLessons = await getLessonsByCategory(category)
  return catLessons[0]?.path ?? DEFAULT_FALLBACK
}

export default defineNuxtRouteMiddleware(async (to) => {
  // 确保当前路径相关的分类数据已加载
  const pathCategory = to.path.split('/').filter(Boolean)[0]
  if (pathCategory) {
    await getLessonsByCategory(pathCategory)
  }

  // 使用同步函数检查路径（仅检查已加载的）
  const isLesson = getLessonByPath(to.path) !== undefined

  // 确定 fallback 路径（从已加载的数据中获取）
  let fallbackPath = DEFAULT_FALLBACK
  const vueLessons = await getLessonsByCategory('vue')
  if (vueLessons.length > 0) {
    fallbackPath = vueLessons[0].path
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
    const firstPath = await firstLessonPath(category)
    return navigateTo(firstPath, { redirectCode: 301 })
  }

  // 首页由 pages/index.vue 正常渲染，不参与课程路由兜底
  if (to.path === '/') return

  const isRoutingDemo = to.path.startsWith('/vue/k-12/routing/')

  if (!isLesson && !isRoutingDemo) {
    return navigateTo(fallbackPath, { redirectCode: 302 })
  }
})
