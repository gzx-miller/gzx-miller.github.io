import NProgress from 'nprogress'

export default defineNuxtPlugin(() => {
  NProgress.configure({
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
