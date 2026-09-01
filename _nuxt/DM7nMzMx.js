const e=`<script>
export default {
  data() {
    return { courses: [] }
  },

  onLoad() {
    // 先读缓存让页面秒开，再异步刷新覆盖
    const cached = uni.getStorageSync('courses')
    if (cached) this.courses = cached
    this.fetchCourses()
  },

  methods: {
    // 把 uni.request 封装成 Promise，统一注入 token 与错误处理
    request(options) {
      return new Promise((resolve, reject) => {
        const token = uni.getStorageSync('token')
        uni.request({
          url: options.url,
          method: options.method || 'GET',
          data: options.data,
          header: { Authorization: token ? \`Bearer \${token}\` : '' },
          timeout: 10000,
          success(res) {
            if (res.statusCode === 401) {
              uni.removeStorageSync('token')
              return reject(new Error('登录已过期'))
            }
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(res.data)
            } else {
              reject(new Error(\`请求失败：\${res.statusCode}\`))
            }
          },
          fail: reject,
        })
      })
    },

    async fetchCourses() {
      try {
        const list = await this.request({ url: '/courses' })
        this.courses = list
        // 数据写入本地缓存，下次进入秒开
        uni.setStorageSync('courses', list)
      } catch (e) {
        uni.showToast({ title: e.message, icon: 'none' })
      }
    },
  },
}
<\/script>`;export{e as default};
