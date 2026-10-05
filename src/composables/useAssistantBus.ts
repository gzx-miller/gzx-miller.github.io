import { ref } from 'vue'

/**
 * 松鼠小助手的「打开面板」信号总线。
 *
 * 背景：悬浮松鼠是每个页面都常驻的全局挂件，但它真正的对话面板依赖
 * marked / dompurify / highlight.js 语言包（合计约 118KB）。这些依赖
 * 只有用户主动提问时才会用到，不该进入首屏关键路径。
 *
 * 因此把挂件拆成两层：
 *  - SquirrelPet     轻量壳层：常驻页面，只负责画 SVG 松鼠与拖拽，体积很小；
 *  - SquirrelAssistant 重量层：marked/dompurify/hljs 与整个对话面板都在这里，
 *                     由本总线在「用户点击松鼠」时才动态 import。
 *
 * 壳层点击后把 requestOpen 置为 true，重量层加载完成读到该标记就会直接
 * 展开面板，用户感知上是一次点击即刻响应。
 */
const requestOpen = ref(false)

export function useAssistantBus() {
  /** 壳层调用：请求打开对话面板（会触发重量层加载） */
  function requestAssistantOpen() {
    requestOpen.value = true
  }

  /** 重量层调用：消费掉打开请求，返回是否应当直接展开面板 */
  function consumeOpenRequest(): boolean {
    if (!requestOpen.value) return false
    requestOpen.value = false
    return true
  }

  return { requestOpen, requestAssistantOpen, consumeOpenRequest }
}
