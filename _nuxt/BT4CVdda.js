const e=`<script>
export default {
  data() {
    return { courses: [], page: 1, hasMore: true }
  },

  // 需在 pages.json 对应页面开启 "style": { "enablePullDownRefresh": true }
  onPullDownRefresh() {
    // 下拉刷新：重置页码，重拉第一页，完成后手动收起动画
    this.page = 1
    this.hasMore = true
    this.fetchCourses(true)
  },

  onReachBottom() {
    // 触底加载：页码 +1 追加下一页；数据耗尽则终止
    if (!this.hasMore) return
    this.page += 1
    this.fetchCourses(false)
  },

  methods: {
    async fetchCourses(reset) {
      const res = await uni.request({ url: \`/courses?page=\${this.page}\` })
      const list = res.data || []
      this.courses = reset ? list : this.courses.concat(list)
      this.hasMore = list.length > 0
      // 下拉刷新动画需手动调用 stopPullDownRefresh 收起
      if (reset) uni.stopPullDownRefresh()
    },
  },
}
<\/script>`;export{e as default};
