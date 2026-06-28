import NProgress from 'nprogress'

export default defineNuxtPlugin(() => {
  NProgress.configure({
    // 将进度条挂到 layout 中 top-nav 下方的专用轨道元素里，
    // 使其出现/消失与顶部导航完全解耦，互不干扰。
    parent: '.nprogress-rail',
    minimum: 0.2,
    trickleSpeed: 200,
    showSpinner: false,
    speed: 300,
    easing: 'ease-out',
  })

  const router = useRouter()

  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      NProgress.start()
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })

  router.onError(() => {
    NProgress.done()
  })
})
