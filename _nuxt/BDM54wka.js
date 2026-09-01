const n=`<script>
export default {
  // globalData 挂在应用实例上，各页面通过 getApp() 读取
  globalData: {
    userInfo: null,
    isLogin: false,
  },

  onLaunch(options) {
    // 应用启动：只执行一次，读取缓存做全局初始化
    const token = uni.getStorageSync('token')
    if (token) {
      this.globalData.isLogin = true
      this.globalData.userInfo = { name: '小松鼠', token }
    }
  },

  onShow() {
    // 应用从后台切回前台（或首次进入）
    console.log('应用进入前台')
  },

  onHide() {
    // 应用进入后台，可在这里保存草稿、暂停轮询
    console.log('应用进入后台')
  },

  onError(err) {
    // 全局捕获未处理异常，上报日志
    console.error('应用异常：', err)
  },
}
<\/script>

<!-- 页面侧读取/写入全局数据：
const app = getApp()
console.log(app.globalData.userInfo)   // 读取
app.globalData.isLogin = true           // 写入（globalData 非响应式，不会自动刷新视图）
-->`;export{n as default};
