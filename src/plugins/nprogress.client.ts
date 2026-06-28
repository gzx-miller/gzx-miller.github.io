import NProgress from 'nprogress'

// 仅在导航耗时超过该阈值时才显示进度条。
// 同分类内的快速 SPA 导航不会触发，避免顶部出现“瞬时闪烁”；
// 真正耗时的导航（如首次加载新分类的重型 demo）超过阈值后仍会显示，保留加载反馈。
const PROGRESS_START_DELAY = 200

export default defineNuxtPlugin(() => {
  NProgress.configure({
    minimum: 0.2,
    trickleSpeed: 200,
    showSpinner: false,
    speed: 300,
    easing: 'ease-out',
  })

  const router = useRouter()
  let progressTimer: ReturnType<typeof setTimeout> | undefined

  function clearProgressTimer() {
    if (progressTimer) {
      clearTimeout(progressTimer)
      progressTimer = undefined
    }
  }

  router.beforeEach((to, from) => {
    if (to.path === from.path) return
    clearProgressTimer()
    progressTimer = setTimeout(() => {
      NProgress.start()
    }, PROGRESS_START_DELAY)
  })

  router.afterEach(() => {
    clearProgressTimer()
    NProgress.done()
  })

  router.onError(() => {
    clearProgressTimer()
    NProgress.done()
  })
})
