import { knowledgeCategories, lessons, lessonPathMap } from '../data/lessons'

const categoryIds = knowledgeCategories
  .filter((category) => category.status === 'ready')
  .map((category) => category.id)
const fallbackPath = lessons.find((lesson) => lesson.path.startsWith('/vue/'))?.path ?? '/vue/k-1/app-entry'

function firstLessonPath(category: string) {
  return lessons.find((lesson) => lesson.path.startsWith(`/${category}/`))?.path ?? fallbackPath
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
