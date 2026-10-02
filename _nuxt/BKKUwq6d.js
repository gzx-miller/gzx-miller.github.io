const n=`<script>
export default {
  data() {
    return { courseId: '', course: null }
  },

  onLoad(options) {
    // 页面首次创建：只执行一次，读取路由参数并做一次性初始化
    this.courseId = options.id
    this.fetchCourse()
  },

  onShow() {
    // 每次回到前台（含首次显示）都执行：刷新可能变化的数据
    this.refreshProgress()
  },

  onReady() {
    // 首次渲染完成：可安全访问 DOM 节点或初始化第三方 SDK
    this.initChart()
  },

  onHide() {
    // 页面被切走但未销毁：暂停轮询、倒计时等
    this.pauseCountdown()
  },

  onUnload() {
    // 页面销毁：清理定时器、事件监听，避免内存泄漏
    this.clearTimers()
  },

  methods: {
    fetchCourse() {},
    refreshProgress() {},
    initChart() {},
    pauseCountdown() {},
    clearTimers() {},
  },
}
<\/script>`;export{n as default};
