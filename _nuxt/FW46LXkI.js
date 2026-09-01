const n=`<script>
export default {
  methods: {
    openCourse(id) {
      // 推入新页：保留当前页，可 navigateBack 返回
      uni.navigateTo({ url: \`/pages/course/course?id=\${id}\` })
    },

    finishLogin() {
      // 替换当前页：返回时不再回到登录页（登录成功后常用）
      uni.redirectTo({ url: '/pages/home/home' })
    },

    switchTab() {
      // 切换底部 tab 页：会关闭所有非 tab 页面
      uni.switchTab({ url: '/pages/mine/mine' })
    },

    goBack() {
      // 返回上一页：delta 可一次返回多层
      uni.navigateBack({ delta: 1 })
    },
  },
}
<\/script>`;export{n as default};
