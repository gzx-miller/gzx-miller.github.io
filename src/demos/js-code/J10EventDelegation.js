// 事件委托：在父元素上统一处理子元素事件
document.querySelector('.course-list').addEventListener('click', (event) => {
  // closest 向上查找最近的匹配元素
  const button = event.target.closest('button[data-course]')
  if (!button) return

  // 通过 dataset 读取 data-* 属性
  console.log(`选择了：${button.dataset.course}`)
})

// 优势：
// - 动态添加的子元素自动生效，无需重新绑定
// - 减少事件监听器数量，降低内存占用
// - 统一管理，方便移除和调试
