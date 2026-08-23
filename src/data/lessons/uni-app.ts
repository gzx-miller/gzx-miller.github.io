import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const uniCodeModules = import.meta.glob<string>('../../demos/uni-code/*', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const loader = path.startsWith('uni-code/')
    ? uniCodeModules[`../../demos/${path}`]
    : vueCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到案例源码：${path}`)
  return loader
}

const U01ProjectStructure = createDemo('U01ProjectStructure')
const U01Code = createCodeLoader('uni-code/U01ProjectStructure.vue.txt')
const U02ConditionalCompilation = createDemo('U02ConditionalCompilation')
const U02Code = createCodeLoader('uni-code/U02ConditionalCompilation.vue.txt')
const U03PageLifecycle = createDemo('U03PageLifecycle')
const U03Code = createCodeLoader('uni-code/U03PageLifecycle.vue.txt')
const U04DataBindingEvents = createDemo('U04DataBindingEvents')
const U04Code = createCodeLoader('uni-code/U04DataBindingEvents.vue.txt')
const U05BuiltinComponents = createDemo('U05BuiltinComponents')
const U05Code = createCodeLoader('uni-code/U05BuiltinComponents.vue.txt')
const U06ScrollSwiper = createDemo('U06ScrollSwiper')
const U06Code = createCodeLoader('uni-code/U06ScrollSwiper.vue.txt')
const U07Routing = createDemo('U07Routing')
const U07Code = createCodeLoader('uni-code/U07Routing.vue.txt')
const U08RpxUnits = createDemo('U08RpxUnits')
const U08Code = createCodeLoader('uni-code/U08RpxUnits.vue.txt')
const U09Easycom = createDemo('U09Easycom')
const U09Code = createCodeLoader('uni-code/U09Easycom.vue.txt')
const U10RequestStorage = createDemo('U10RequestStorage')
const U10Code = createCodeLoader('uni-code/U10RequestStorage.vue.txt')

export const lessons: Lesson[] = [
  {
    id: 'U_01', title: '项目结构与 pages.json 配置', navTitle: '项目结构', category: '工程基础',
    path: '/uni-app/u-1/project-structure', summary: '认识 uni-app 目录骨架，理解 pages.json 如何注册页面与配置全局窗口，以及 main.js 与 App.vue 各自职责。',
    demo: U01ProjectStructure, code: U01Code, language: 'json',
    principle: 'uni-app 项目由 pages.json 驱动：它声明页面列表、全局窗口样式（navigationBar 等）与 tabBar；main.js 负责创建应用并挂载 store/全局 API，App.vue 提供应用级生命周期与全局样式。页面通过「路径 + 文件」一一对应，静态资源与分包遵循约定目录。',
    flow: ['pages.json 的 pages 数组按顺序声明首页与各业务页。', 'globalStyle 统一导航栏标题、背景色与文字风格。', 'tabBar 声明底部 tab，且 tab 页只能用 switchTab 跳转。', 'main.js 用 createSSRApp 创建应用，为跨端兼容统一入口。'],
    notes: ['pages 数组第一项是应用启动后的首页。', 'tabBar 里声明的页面必须同时出现在 pages 数组中。', 'App.vue 里的 onLaunch 只在应用启动时执行一次。', '新增页面后需在 pages.json 注册，否则无法被路由访问。'],
    problem: '解决"多端项目骨架该如何组织、页面在哪里注册、全局配置到哪里声明"的问题。',
  },
  {
    id: 'U_02', title: '条件编译：一套代码适配多端', navTitle: '条件编译', category: '跨端能力',
    path: '/uni-app/u-2/conditional-compilation', summary: '用 #ifdef / #ifndef 按平台差异化代码，理解注释式条件编译在 js、template 与 css 中的写法。',
    demo: U02ConditionalCompilation, code: U02Code, language: 'vue',
    principle: '条件编译让同一份源码仅对目标平台生效：`#ifdef MP-WEIXIN` 只在微信小程序编译，`#ifndef H5` 表示非 H5；它同时支持 js/ts、template 和 css 三种位置，编译期直接裁剪无关分支，不会把其他平台的死代码带进产物。',
    flow: ['用 #ifdef 平台标识圈定仅某端需要的代码。', '用 #ifndef 表达"除某端之外"的反向分支。', '在 template 中同样用注释包裹差异化的 DOM。', '平台值如 H5、MP-WEIXIN、APP-PLUS 在官方文档可查。'],
    notes: ['条件编译是编译期行为，不会产生运行时判断开销。', '一页内多次出现 #ifdef 时保持注释闭合配对，避免语法错乱。', '不能跨 script 与 template 之间用一段 #ifdef 包裹。', '抽公共逻辑到外部文件再条件引入，可读性更好。'],
    problem: '解决"一套代码如何在不同平台表现不同，而不用维护多份工程"的问题。',
  },
  {
    id: 'U_03', title: '页面生命周期 onLoad 与 onShow', navTitle: '页面生命周期', category: '页面与生命周期',
    path: '/uni-app/u-3/page-lifecycle', summary: '理解 onLoad、onShow、onReady、onHide、onUnload 的触发时机，用它编排数据拉取与缓存刷新。',
    demo: U03PageLifecycle, code: U03Code, language: 'vue',
    principle: 'uni-app 页面生命周期继承小程序模型：onLoad 只在页面首次创建时触发（适合读取路由参数、初始化一次），onShow 每次页面回到前台都触发（适合刷新可能变化的数据），onReady 表示首次渲染完成，onHide/onUnload 分别对应切走与销毁。',
    flow: ['onLoad 中解析 options 参数并做一次性初始化。', 'onShow 每次可见时刷新共享状态或列表。', 'onReady 首次渲染后访问节点或第三方初始化。', 'onUnload 清理定时器、事件监听等资源。'],
    notes: ['onShow 在 onLoad 之后、以及从后台返回时都会执行。', '不要在 onLoad 里做依赖 DOM 的操作，此时尚未渲染。', '下拉刷新、上拉加载分别对应 onPullDownRefresh、onReachBottom。', 'onUnload 与 onHide 的区别：销毁页面和暂时隐藏。'],
    problem: '解决"页面在不同时机该在哪个钩子里加载与刷新数据"的问题。',
  },
  {
    id: 'U_04', title: '数据绑定与事件处理', navTitle: '数据与事件', category: '语法基础',
    path: '/uni-app/u-4/data-binding-events', summary: '用 Vue 语法在 uni-app 里做双向绑定与事件，区分 @tap、@click 与事件传参、阻止冒泡的差异。',
    demo: U04DataBindingEvents, code: U04Code, language: 'vue',
    principle: 'uni-app 复用 Vue 的数据驱动：`v-model` 完成表单双向绑定，`@tap` 是移动端触摸事件（比 @click 响应更快且无 300ms 延迟），事件传参用 `@tap="fn($event, id)"`，阻止冒泡用 `@tap.stop`。data 变更会按 Vue 响应式机制自动更新视图。',
    flow: ['在 data 中声明页面状态，用 v-model 绑定到输入组件。', '用 @tap 绑定按钮点击，通过实参传递业务 id。', '列表项用 :key 保证 diff 稳定。', '用 @tap.stop 避免父容器点击被误触发。'],
    notes: ['小程序里 onClick 事件名固定为 tap，书写时用 @tap。', '事件处理函数不要用箭头函数丢 this，需通过 bindtap 参数传参时留意作用域。', 'v-model 本质是 :value + @input 的语法糖。', '避免把复杂计算写进模板，交给 computed。'],
    problem: '解决"如何把手势与表单输入映射为可维护的页面状态，并正确处理移动端事件"的问题。',
  },
  {
    id: 'U_05', title: '内置组件 view/text/image/button/input', navTitle: '内置组件', category: '内置组件',
    path: '/uni-app/u-5/builtin-components', summary: '认识 uni-app 跨端基础组件，理解不能用 div/span 的原因，以及 image 必须设定宽高的细节。',
    demo: U05BuiltinComponents, code: U05Code, language: 'vue',
    principle: 'uni-app 用自己的一套基础组件替代 HTML 标签：view 对应 div（块级容器）、text 对应 span（行内文本，可嵌套）、image 对应 img（默认宽 320px、高 240px，需显式设尺寸或 mode 适配）、button 与 input 分别对应按钮和输入框。这些组件会被编译到各端原生等价物。',
    flow: ['用 view 划分布局容器，替代语义不明的 div。', '用 text 包裹可在小程序里正确换行/复制的文本。', 'image 使用 mode 属性控制裁剪与等比缩放。', 'button 用 size、type、loading 等属性控制形态。'],
    notes: ['H5 端虽兼容 div，但小程序端不识别，跨端务必用内置组件。', 'text 组件内才能嵌 text，view 内嵌 text 可换行。', 'image 不设宽高在小程序里会按默认尺寸渲染，容易撑破布局。', 'input 的 type 支持 text、number、digit、password 等。'],
    problem: '解决"为何不能用常用 HTML 标签，以及该如何选择跨端基础组件"的问题。',
  },
  {
    id: 'U_06', title: 'scroll-view 与 swiper 滚动容器', navTitle: '滚动与轮播', category: '内置组件',
    path: '/uni-app/u-6/scroll-swiper', summary: '用 scroll-view 做局部滚动与横向滑动，用 swiper 做轮播，理解滚动区域必须限定高度的原理。',
    demo: U06ScrollSwiper, code: U06Code, language: 'vue',
    principle: 'scroll-view 是可滚动的容器，需要显式高度或 `scroll-y` 才能滚动，支持 scroll-into-view 定位、@scroll 事件与刷新加载；swiper 是轮播容器，内联 swiper-item，通过 autoplay、circular、indicator-dots 控制自动播放与指示点，二者都把原生滚动手势封装成声明式组件。',
    flow: ['为 scroll-view 设定高度并开启 scroll-y。', '横向滚动用 scroll-x 并让子项不换行。', 'swiper 内放多个 swiper-item 组成轮播。', '用 indicator-dots 与 autoplay 控制轮播反馈。'],
    notes: ['scroll-view 若不定高，小程序里内容高度会撑开而无法滚动。', '页面级滚动与 scroll-view 局部滚动不要混用造成嵌套滚动。', 'swiper 的 indicator 颜色可通过样式定制。', '大量列表项优先考虑虚拟列表而非一次性全渲染。'],
    problem: '解决"页面内局部区域如何滚动、横向滑动与轮播展示"的问题。',
  },
  {
    id: 'U_07', title: '页面路由与导航跳转', navTitle: '路由跳转', category: '页面与路由',
    path: '/uni-app/u-7/routing', summary: '掌握 uni.navigateTo、redirectTo、switchTab、navigateBack 四类跳转，理解页面栈与 tab 页特殊规则。',
    demo: U07Routing, code: U07Code, language: 'vue',
    principle: 'uni-app 的路由基于页面栈：navigateTo 推入新页并保留当前页（可返回），redirectTo 替换当前页，switchTab 用于切换 tabBar 页面（会关闭其他非 tab 页），navigateBack 返回上一页；参数通过 URL query 传递，在目标页 onLoad 的 options 中读取。页面栈深度有限，跳转层级不宜过深。',
    flow: ['普通跳转用 navigateTo，返回到达用 navigateBack。', '登录后替换当前页用 redirectTo，避免返回登录页。', '底部 tab 之间用 switchTab，且不能用 navigateTo 跳 tab 页。', '路由参数在目标页 onLoad(options) 中解构读取。'],
    notes: ['navigateTo 不能直接跳转到 tabBar 页面，需用 switchTab。', '小程序页面栈最多 10 层，深链跳转有风险。', '跨页面传大对象建议走全局 store 或本地缓存而非 URL。', 'navigateBack 可传 delta 一次返回多层。'],
    problem: '解决"页面之间如何跳转、传参与返回，以及 tab 页跳转有什么特殊限制"的问题。',
  },
  {
    id: 'U_08', title: 'rpx 响应式单位与适配', navTitle: 'rpx 适配', category: '布局适配',
    path: '/uni-app/u-8/rpx-units', summary: '理解 750rpx 等宽设计稿的换算规则，掌握 rpx 在小程序与 H5 的表现差异及 px 场景。',
    demo: U08RpxUnits, code: U08Code, language: 'vue',
    principle: 'rpx 是 uni-app 的响应式单位，规定屏幕宽度恒为 750rpx，因此 1rpx 随设备宽度等比缩放，天然适配不同屏幕；750rpx 设计稿下 1rpx 约等于 1 物理设计像素，px 则在小程序端不缩放。H5 端 rpx 通过 rem 换算实现，App 与小程序由框架运行时解析。',
    flow: ['设计稿以 750 宽度为基准，标注值直接写 rpx。', '元素宽度用 rpx 保持跨端等比。', '需要固定物理尺寸（如边框 1px）时用 px。', '动态计算场景用 uni.upx2px 把 rpx 转 px。'],
    notes: ['rpx 的基准是小程序宽 750，大屏 H5 上同样等比缩放。', '细边框建议用 px，避免 rpx 缩放后出现小数模糊。', '百分比与 flex 仍适用，rpx 主要解决绝对尺寸适配。', 'upx2px 在编译后返回浏览器可用的 px 值。'],
    problem: '解决"同一设计稿如何在不同宽度设备上保持视觉一致"的适配问题。',
  },
  {
    id: 'U_09', title: 'easycom 组件自动注册', navTitle: 'easycom', category: '组件规范',
    path: '/uni-app/u-9/easycom', summary: '通过 components/{name}/{name}.vue 目录约定实现组件免引入，理解 easycom 的匹配规则与作用域。',
    demo: U09Easycom, code: U09Code, language: 'vue',
    principle: 'easycom 是 uni-app 的自动组件引入机制：只要组件放在 `components/组件名/组件名.vue`，页面模板中就能直接用 `<组件名>` 而无需 import 和注册；默认按目录名匹配组件名，也可在 pages.json 的 easycom 字段自定义匹配规则与正则，命中后由框架异步加载。',
    flow: ['按 components/xxx/xxx.vue 目录规范组织组件。', '模板中直接写 <xxx> 使用，免 import。', '需要自定义路径时在 easycom 配置正则规则。', '仅打包被使用到的组件，避免全量引入。'],
    notes: ['组件目录名必须与组件文件名、标签名一致才默认匹配。', 'easycom 默认覆盖 src/components 与 uni_modules 下的规范路径。', 'HBuilderX 项目也可用，规则在 pages.json 中声明。', '全局样式污染问题需靠样式规范或 scoped 避免。'],
    problem: '解决"高频复用组件每次都要手动 import 与注册"的繁琐问题。',
  },
  {
    id: 'U_10', title: 'uni.request 封装与本地存储', navTitle: '请求与存储', category: '数据与存储',
    path: '/uni-app/u-10/request-storage', summary: '把 uni.request 封装成返回 Promise 的请求层，配合 uni.setStorage/getStorage 做登录态与数据缓存。',
    demo: U10RequestStorage, code: U10Code, language: 'vue',
    principle: 'uni.request 发起网络请求，回调式 API 常被 Promise 化并以拦截器统一处理 token 与错误；本地键值存储通过 uni.setStorageSync/getStorageSync 读写，适合缓存登录态与列表数据，但同步接口在大量写入时会阻塞，需权衡。请求与缓存配合可实现「先读缓存、再异步刷新」的体验优化。',
    flow: ['封装 request 返回 Promise，统一注入 token 与 baseURL。', '拦截 401 等状态码并跳转登录或清理缓存。', '用 uni.setStorageSync 保存登录态与轻量数据。', '进入页面先展示缓存，再请求新数据覆盖。'],
    notes: ['uni.request 默认超时需按业务设 timeout 并处理失败。', '同步存储接口在大数据量下会阻塞，改为异步版本更稳。', '敏感数据不宜明文入缓存，登录态建议配合过期时间。', '跨端网络层需遵循各平台域名白名单等安全限制。'],
    problem: '解决"网络请求如何统一管理，登录态与轻量数据如何跨页面持久化"的问题。',
  },
]