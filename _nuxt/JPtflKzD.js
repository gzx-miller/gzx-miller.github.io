const n=`<script>
export default {
  methods: {
    toast() {
      // 轻提示：自动消失，icon 可选 success / error / loading / none
      uni.showToast({ title: '报名成功', icon: 'success' })
    },

    confirmDelete() {
      // 模态框：标题 + 内容 + 确认/取消，读取 res.confirm 判断
      uni.showModal({
        title: '删除课程',
        content: '删除后不可恢复，确定吗？',
        success(res) {
          if (res.confirm) uni.showToast({ title: '已删除', icon: 'none' })
        },
      })
    },

    async withLoading() {
      // 加载中：mask 阻止误操作，完成后必须手动 hideLoading
      uni.showLoading({ title: '提交中…', mask: true })
      await submitOrder()
      uni.hideLoading()
      uni.showToast({ title: '已完成' })
    },

    showSheet() {
      // 操作菜单：底部弹出选项列表，通过 tapIndex 区分选择
      uni.showActionSheet({
        itemList: ['分享海报', '复制链接', '举报'],
        success(res) {
          console.log('点击了第', res.tapIndex, '项')
        },
      })
    },
  },
}
<\/script>`;export{n as default};
