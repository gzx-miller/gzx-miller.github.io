// 深路径导入而非 `from 'element-plus'`：根入口是整库 barrel（300+ 导出），
// 会把全部组件拖进入口 chunk，破坏现有的「按分类 / 按演示组件分包」策略。
// element-plus 的 exports 显式开放了 `./es/*`，这里两个 hook 合计只有几 KB。
import { ZINDEX_INJECTION_KEY } from 'element-plus/es/hooks/use-z-index/index.mjs'
import { ID_INJECTION_KEY } from 'element-plus/es/hooks/use-id/index.mjs'

/**
 * 补齐 Element Plus 在 SSR 下必须由使用方提供的两个上下文。
 *
 * element-plus 这两种上下文库内**没有任何组件会提供**（`ElConfigProvider`
 * 只提供基础层级 `zIndexContextKey`），官方要求应用层注入，否则服务端渲染时
 * 每个相关组件都会打印告警，且水合结果与客户端不一致：
 *
 * 1. `ZINDEX_INJECTION_KEY`（z-index 计数器）
 *    [Vue warn] injection "Symbol(elZIndexContextKey)" not found
 *    [ZIndexInjection] Looks like you are using server rendering ...
 *    受影响：popper / dialog / message-box / image-viewer / tour 等，
 *    本项目 E04Dialog、E05Message、E06Popover、E07Dropdown、E11Cascader、
 *    E12Tooltip、E13DatePicker 等演示都会命中。
 *
 * 2. `ID_INJECTION_KEY`（组件 id 生成器）
 *    [IdInjection] Looks like you are using server rendering ...
 *    默认实现用 `Math.floor(Math.random() * 1e4)` 作为前缀，服务端与客户端
 *    是两个进程、必然取到不同前缀，`id` / `aria-*` / `for` 等属性随之不匹配。
 *    这里换成固定前缀，两端才稳定可复现。
 *
 * 两个计数器都从 0 起、按挂载顺序自增，水合顺序两端一致，因此每个 app 实例
 * 单独 provide 一份全新对象（而非库里模块级共享的兜底对象）即可对齐——
 * 同时也避免 SSR 长驻进程中计数器被跨请求累积。
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(ZINDEX_INJECTION_KEY, { current: 0 })
  nuxtApp.vueApp.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
})
