import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const uniCodeModules = import.meta.glob<string>('../../demos/uni-code/*', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const loader = path.startsWith('uni-code/')
    ? uniCodeModules[`../../demos/${path}`]
    : vueCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
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
const U11PullRefresh = createDemo('U11PullRefresh')
const U11Code = createCodeLoader('uni-code/U11PullRefresh.vue.txt')
const U12UiFeedback = createDemo('U12UiFeedback')
const U12Code = createCodeLoader('uni-code/U12UiFeedback.vue.txt')
const U13AppLifecycle = createDemo('U13AppLifecycle')
const U13Code = createCodeLoader('uni-code/U13AppLifecycle.vue.txt')
const U14CompositionApi = createDemo('U14CompositionApi')
const U14Code = createCodeLoader('uni-code/U14CompositionApi.vue.txt')
const U15Subpackages = createDemo('U15Subpackages')
const U15Code = createCodeLoader('uni-code/U15Subpackages.vue.txt')

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
    principle: 'uni-app 复用 Vue 的数据驱动：`v-model` 完成表单双向绑定；`@click` 与 `@tap` 都可用于绑定事件（编译到小程序时统一映射为原生 tap 事件），传参用 `@tap="fn($event, id)"`、阻止冒泡用 `@tap.stop`。ref/reactive 状态变更会按 Vue 响应式机制自动更新视图。',
    flow: ['用 v-model 把搜索框绑定到 keyword，实时过滤课程列表。', '列表项用 @click 绑定打开详情，用 $event 或实参区分来源。', '报名按钮用 @click.stop 阻止冒泡，避免误触发父级的 openCourse。', '列表项配 :key 保证 Vue diff 复用稳定。'],
    notes: ['小程序端 @click 会被编译成原生 tap 事件，两者可互换，不必刻意二选一。', '事件传参用 @tap="fn($event, id)"，$event 携带原生事件对象。', '冒泡控制：阻止继续冒泡用 .stop，阻止默认行为用 .prevent。', '下拉展示的筛选列表应交给 computed 派生，而非在模板里写复杂过滤。'],
    problem: '解决"如何把手势与表单输入映射为可维护的页面状态，并正确处理移动端事件"的问题。',
  },
  {
    id: 'U_05', title: '内置组件 view/text/image/button/input', navTitle: '内置组件', category: '内置组件',
    path: '/uni-app/u-5/builtin-components', summary: '认识 uni-app 跨端基础组件，理解不能用 div/span 的原因，以及 image 必须设定宽高的细节。',
    demo: U05BuiltinComponents, code: U05Code, language: 'vue',
    principle: 'uni-app 用自己的一套基础组件替代 HTML 标签：view 对应 div（块级容器）、text 对应 span（行内文本，可嵌套）、image 对应 img（默认宽 320px、高 240px，需显式设尺寸或 mode 适配）、button 与 input 分别对应按钮和输入框。这些组件会被编译到各端原生等价物。',
    flow: ['用 view 划分布局容器，替代语义不明的 div。', '用 text 包裹可在小程序里正确换行/复制的文本。', 'image 使用 mode 属性控制裁剪与等比缩放。', 'button 用 size、type、loading 等属性控制形态。'],
    notes: ['H5 端虽兼容 div，但小程序端不识别，跨端务必用内置组件。', 'text 内可嵌套 text 做局部样式，段落级文本外层建议用 view 包一层。', 'image 不设宽高在小程序里按默认 320×240 渲染，容易撑破布局，务必显式设定。', 'input 的 type 支持 text、number、digit、password 等场景值。'],
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
    principle: 'rpx 是 uni-app 的响应式单位，规定屏幕宽度恒为 750rpx，因此 1rpx 随设备宽度等比缩放，天然适配不同屏幕；750 宽设计稿上 1rpx 恰等于 1 个设计像素，标注可直接照抄。px 在小程序与 App 端不随屏幕缩放，用于固定物理尺寸。rpx 的具体换算：小程序/App 由框架在运行时按屏幕宽度解析，H5 端由编译器换算成 rem、vw 等响应式单位。',
    flow: ['设计稿以 750 宽度为基准，元素标注值原样写成 rpx。', '占比类尺寸用 rpx 保持跨端等比。', '需要固定物理尺寸（如 1px 细边框）时改用 px。', '动态换算场景用 uni.upx2px 把 rpx 转成 px 写入 style。'],
    notes: ['rpx 的基准是小程序宽 750，大屏 H5 上同样等比缩放。', '细边框建议用 px，避免 rpx 缩放后出现小数模糊。', '百分比与 flex 仍适用，rpx 主要解决绝对尺寸适配。', 'upx2px 在编译后返回浏览器可用的 px 值。'],
    problem: '解决"同一设计稿如何在不同宽度设备上保持视觉一致"的适配问题。',
  },
  {
    id: 'U_09', title: 'easycom 组件自动注册', navTitle: 'easycom', category: '组件规范',
    path: '/uni-app/u-9/easycom', summary: '通过 components/{name}/{name}.vue 目录约定实现组件免引入，理解 easycom 的匹配规则与作用域。',
    demo: U09Easycom, code: U09Code, language: 'vue',
    principle: 'easycom 是 uni-app 的自动组件引入机制：只要组件放在 `components/组件名/组件名.vue`，页面模板中就能直接用 `<组件名>` 而无需 import 和注册；默认按目录名匹配组件名，也可在 pages.json 的 easycom 字段自定义匹配规则与正则，命中后由框架异步加载。',
    flow: ['按 components/xxx/xxx.vue 目录规范组织组件。', '模板中直接写 <xxx> 使用，免 import。', '需要自定义路径时在 easycom 配置正则规则。', '仅打包被使用到的组件，避免全量引入。'],
    notes: ['默认仅匹配 components/组件名/组件名.vue 这种目录名=文件名=标签名的一致约定。', '其他目录结构可在 pages.json 的 easycom.custom 里用正则自定义匹配规则。', 'easycom 默认覆盖 src/components 与 uni_modules 下的规范路径，页面可免 import 直接用。', 'easycom 只解决自动引入，组件的 props/事件仍需在组件内部自行定义声明。'],
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
  {
    id: 'U_11', title: '下拉刷新与触底加载', navTitle: '下拉刷新', category: '页面与生命周期',
    path: '/uni-app/u-11/pull-refresh', summary: '用 onPullDownRefresh 实现下拉刷新、onReachBottom 实现触底加载，理解分页策略与刷新动画收尾。',
    demo: U11PullRefresh, code: U11Code, language: 'vue',
    principle: '列表页最常见的数据更新有两种：下拉刷新对应页面事件 onPullDownRefresh，触底加载对应 onReachBottom。前者需先在 pages.json 对应页面开启 enablePullDownRefresh，并在完成后调用 uni.stopPullDownRefresh 收起动画；后者在内容滚动到底部时自动触发，通常用「页码 +1 追加」的分页策略，并在数据耗尽时给出「没有更多了」的终止提示。',
    flow: ['在 pages.json 页面 style 中开启 enablePullDownRefresh。', 'onPullDownRefresh 里重置页码并请求第一页。', 'onReachBottom 里页码递增并追加下一页。', '刷新收尾调用 uni.stopPullDownRefresh 结束动画。'],
    notes: ['onReachBottom 需页面内容超出屏幕才会触发滚动。', '刷新中避免重复请求，用 loading 标志位防抖。', '分页要维护当前页码与「没有更多了」的终止状态。', '需要局部滚动时改用 scroll-view 的 @scrolltolower 触底。'],
    problem: '解决"列表页如何下拉刷新、滚动到底自动加载更多数据"的问题。',
  },
  {
    id: 'U_12', title: '交互反馈 showToast 与 showModal', navTitle: '交互反馈', category: '交互反馈',
    path: '/uni-app/u-12/ui-feedback', summary: '掌握 showToast、showModal、showLoading、showActionSheet 四类原生反馈的用法与适用场景。',
    demo: U12UiFeedback, code: U12Code, language: 'vue',
    principle: 'uni-app 提供一套跨端交互反馈 API：showToast 用于轻量提示并自动消失；showModal 用于需要用户确认/取消的模态框；showLoading 配合 hideLoading 表达进行中的阻断状态；showActionSheet 用于底部多选项操作菜单。这些 API 在小程序、H5、App 上被映射到各自原生控件，比手写弹窗更统一、也更省事。',
    flow: ['成功/失败提示用 showToast，指定 icon 与 title。', '危险操作前用 showModal 让用户确认，读取 res.confirm。', '耗时操作前 showLoading，完成后必须 hideLoading。', '多选项操作用 showActionSheet，通过 tapIndex 区分。'],
    notes: ['showToast 的 title 长度受限，过长会被截断。', 'showLoading 必须手动 hideLoading，否则会一直遮挡。', 'showModal 可同屏展示 title 与 content 两行文案。', 'showActionSheet 最多 6 项，超出会自动转列表形式。'],
    problem: '解决"如何用统一的跨端方式给用户即时、明确的交互反馈"的问题。',
  },
  {
    id: 'U_13', title: '应用生命周期与全局数据', navTitle: '应用生命周期', category: '工程基础',
    path: '/uni-app/u-13/app-lifecycle', summary: '理解 App.vue 的 onLaunch、onShow、onHide、onError 与 globalData，用 getApp 跨页面共享全局状态。',
    demo: U13AppLifecycle, code: U13Code, language: 'vue',
    principle: 'App.vue 是应用入口，承载应用级生命周期：onLaunch 仅在启动时执行一次（适合读缓存、初始化全局状态、检测版本更新），onShow/onHide 表示应用进出前台，onError 全局兜底异常。globalData 挂在应用实例上，任意页面通过 getApp().globalData 读写，适合存放用户信息、登录态等跨页面共享但非响应式的数据。',
    flow: ['onLaunch 中读取本地缓存并初始化 globalData。', 'onShow/onHide 处理切前台/后台的收尾工作。', 'onError 统一捕获未处理异常并上报。', '页面侧用 getApp().globalData 读写共享数据。'],
    notes: ['onLaunch 只执行一次，适合做一次性初始化。', 'globalData 不是响应式的，改动不会自动刷新视图。', '跨页面的高频共享状态建议用 Pinia 或全局 store。', 'appid 等应用配置在 manifest.json 中声明，而非 App.vue。'],
    problem: '解决"应用启动、进出前台该在哪处理，以及如何跨页面共享全局数据"的问题。',
  },
  {
    id: 'U_14', title: '组合式 API 与 script setup', navTitle: '组合式 API', category: '语法基础',
    path: '/uni-app/u-14/composition-api', summary: '用 Vue3 组合式 API 写 uni-app 页面，理解如何从 @dcloudio/uni-app 导入 onLoad、onShow 等页面生命周期。',
    demo: U14CompositionApi, code: U14Code, language: 'vue',
    principle: 'uni-app 支持 Vue3 组合式写法：用 `<script setup>` 组织 ref/reactive/computed，页面生命周期不再是 options 里的方法，而是从 `@dcloudio/uni-app` 导入的 onLoad、onShow、onUnload、onReachBottom 等函数，传入回调即可。它让逻辑更聚合、类型推断更好，也便于把可复用逻辑抽成 composable 在多页面间共享。',
    flow: ['用 <script setup lang="ts"> 声明响应式状态。', '从 @dcloudio/uni-app 导入所需页面生命周期。', '在回调里读取 onLoad 传入的路由参数。', '把可复用逻辑抽成 composable，供多页面调用。'],
    notes: ['组合式页面生命周期与 options 写法二选一，同一页面不要混用。', 'onLoad 回调参数为路由 options，需解构后读取参数。', '<script setup> 中变量与方法无需手动 return 即可在模板直接使用。', 'onMounted 等 Vue 自身钩子来自 vue，无需从 @dcloudio/uni-app 重复导入。'],
    problem: '解决"如何用 Vue3 组合式 API 而不是 options 来组织 uni-app 页面逻辑"的问题。',
  },
  {
    id: 'U_15', title: '分包与按需加载', navTitle: '分包加载', category: '工程基础',
    path: '/uni-app/u-15/subpackages', summary: '用 pages.json 的 subPackages 把低频页面下沉到分包，理解 preloadRule 预下载对首屏体积的优化。',
    demo: U15Subpackages, code: U15Code, language: 'json',
    principle: '当页面变多，主包体积会成为启动瓶颈。subPackages 允许把部分页面拆到独立分包，打包时与主包分开、按需下载；preloadRule 可配置在进入某页后预下载指定分包，在空闲时静默拉取，用户真正使用时已就绪。主包只保留首页与高优路径页面，能显著降低首屏加载时间。',
    flow: ['在 pages.json 用 subPackages 声明分包 root 与页面。', '分包页面路径相对 root 写，无需加根前缀。', '用 preloadRule 配置进入主包页后预下载指定分包。', '主包只保留首页与关键路径，其余下沉分包。'],
    notes: ['subPackages 与 subpackages 两种字段名均被识别。', '主包与分包不能重复声明同一个页面。', '跨分包跳转前需确保目标分包已加载。', '单个分包过大仍会卡顿，需合理拆分粒度。'],
    problem: '解决"页面较多时如何压缩首屏体积、实现按需加载分包"的问题。',
  },
]