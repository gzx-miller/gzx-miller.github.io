import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const modules = path.startsWith('react-jsx/')
    ? jsxCodeModules
    : path.startsWith('state-react/')
      ? stateCodeModules
      : path.startsWith('js-code/')
        ? jsCodeModules
        : path.startsWith('ts-code/')
          ? tsCodeModules
          : path.startsWith('style-code/')
            ? styleCodeModules
            : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到案例源码：${path}`)
  return loader
}

const K01AppEntry = createDemo('K01AppEntry')
const K01Code = createCodeLoader('K01AppEntry.vue')
const K02TemplateSyntax = createDemo('K02TemplateSyntax')
const K02Code = createCodeLoader('K02TemplateSyntax.vue')
const K03Reactivity = createDemo('K03Reactivity')
const K03Code = createCodeLoader('K03Reactivity.vue')
const K04ComputedWatch = createDemo('K04ComputedWatch')
const K04Code = createCodeLoader('K04ComputedWatch.vue')
const K05ConditionList = createDemo('K05ConditionList')
const K05Code = createCodeLoader('K05ConditionList.vue')
const K06FormModel = createDemo('K06FormModel')
const K06Code = createCodeLoader('K06FormModel.vue')
const K07ComponentBasics = createDemo('K07ComponentBasics')
const K07Code = createCodeLoader('K07ComponentBasics.vue')
const K08Slots = createDemo('K08Slots')
const K08Code = createCodeLoader('K08Slots.vue')
const K09Communication = createDemo('K09Communication')
const K09Code = createCodeLoader('K09Communication.vue')
const K10LifecycleRef = createDemo('K10LifecycleRef')
const K10Code = createCodeLoader('K10LifecycleRef.vue')
const K11Composable = createDemo('K11Composable')
const K11Code = createCodeLoader('K11Composable.vue')
const K12Routing = createDemo('K12Routing')
const K12Code = createCodeLoader('K12Routing.vue')
const K13Pinia = createDemo('K13Pinia')
const K13Code = createCodeLoader('K13Pinia.vue')
const K14AsyncState = createDemo('K14AsyncState')
const K14Code = createCodeLoader('K14AsyncState.vue')
const K15DynamicKeepAlive = createDemo('K15DynamicKeepAlive')
const K15Code = createCodeLoader('K15DynamicKeepAlive.vue')
const K16Transition = createDemo('K16Transition')
const K16Code = createCodeLoader('K16Transition.vue')
const K17Directive = createDemo('K17Directive')
const K17Code = createCodeLoader('K17Directive.vue')
const K18Teleport = createDemo('K18Teleport')
const K18Code = createCodeLoader('K18Teleport.vue')
const K19Suspense = createDemo('K19Suspense')
const K19Code = createCodeLoader('K19Suspense.vue')
const K20Performance = createDemo('K20Performance')
const K20Code = createCodeLoader('K20Performance.vue')
const K21TestingMaintainability = createDemo('K21TestingMaintainability')
const K21Code = createCodeLoader('K21TestingMaintainability.vue')
const K22CustomVModel = createDemo('K22CustomVModel')
const K22Code = createCodeLoader('K22CustomVModel.vue')
const K23ErrorHandling = createDemo('K23ErrorHandling')
const K23Code = createCodeLoader('K23ErrorHandling.vue')
const K24PluginDev = createDemo('K24PluginDev')
const K24Code = createCodeLoader('K24PluginDev.vue')
const K25ShallowReactivity = createDemo('K25ShallowReactivity')
const K25Code = createCodeLoader('K25ShallowReactivity.vue')
const K26EffectScope = createDemo('K26EffectScope')
const K26Code = createCodeLoader('K26EffectScope.vue')
const K27AttributeForwarding = createDemo('K27AttributeForwarding')
const K27Code = createCodeLoader('K27AttributeForwarding.vue')
const K28ComponentExpose = createDemo('K28ComponentExpose')
const K28Code = createCodeLoader('K28ComponentExpose.vue')

export const lessons: Lesson[] = [
{
    id: 'K_1',
    title: '应用创建、入口挂载、SFC 基础结构',
    navTitle: '应用',
    category: '工程起点',
    path: '/vue/k-1/app-entry',
    summary: '从入口文件理解 Vue 应用实例、插件注册、根组件挂载和单文件组件的基本组成。',
    demo: K01AppEntry,
    code: K01Code,
    language: 'vue',
    principle:
      'Vue3 应用从 createApp 创建独立应用实例开始。应用实例负责承载根组件、全局插件、全局配置和挂载目标；SFC 则把逻辑、模板和样式放在同一个组件文件里，让组件成为可维护的最小页面单元。',
    flow: [
      '在 main.ts 中创建应用实例，导入全局样式和根组件。',
      '通过 app.use 注册 Router、Pinia 等跨页面能力，让后续组件可以读取路由和 store。',
      '调用 mount("#app") 把 Vue 接管到 index.html 的挂载点，之后页面更新交给 Vue 响应式系统处理。',
    ],
    notes: [
      '入口文件只放应用装配逻辑，不放具体业务流程，否则项目变大后很难定位问题。',
      'SFC 的 template 负责结构，script setup 负责状态和行为，样式尽量服务当前组件或全局布局。',
      '插件注册顺序通常不影响普通页面，但依赖注入类插件要在组件挂载前完成。',
    ],
    problem: '解决"Vue 项目从哪里启动、全局能力在哪里接入、页面如何被根组件接管"的入门问题。',
  },
{
    id: 'K_2',
    title: '模板语法、插值、指令、事件绑定',
    navTitle: '模板语法',
    category: '模板基础',
    path: '/vue/k-2/template-syntax',
    summary: '用订单搜索展示插值、v-model、v-if、v-for、属性绑定和事件绑定如何协作。',
    demo: K02TemplateSyntax,
    code: K02Code,
    language: 'vue',
    principle:
      'Vue 模板是一层声明式视图描述：状态是什么，页面就应该长什么样。插值负责显示文本，指令负责常见 DOM 行为，事件绑定负责把用户动作交回组件逻辑。',
    flow: [
      '输入框通过 v-model 把关键词同步到响应式状态。',
      'computed 根据关键词过滤订单列表，避免在模板中写复杂表达式。',
      '模板根据过滤结果使用 v-if/v-else 显示反馈，并通过 v-for 渲染列表。',
    ],
    notes: [
      '模板里可以写表达式，但复杂判断应移到 computed 或函数中，让模板保持可读。',
      'v-for 的 key 要稳定且能代表数据身份，不要使用随机数。',
      '事件处理函数只处理本次交互，不要在模板中堆叠过多内联逻辑。',
    ],
    problem: '解决"如何把用户输入、条件判断、列表展示和点击事件组织成一个可读交互"的问题。',
  },
{
    id: 'K_3',
    title: '响应式基础：ref、reactive、模板自动解包',
    navTitle: '响应式',
    category: '响应式',
    path: '/vue/k-3/reactivity',
    summary: '用学习进度展示 ref 与 reactive 的适用边界，以及模板自动解包的阅读方式。',
    demo: K03Reactivity,
    code: K03Code,
    language: 'vue',
    principle:
      'ref 把单个值包装成响应式引用，reactive 把对象转换成响应式代理。模板读取这些状态时会自动追踪依赖，状态变化后依赖它的视图会重新渲染。reactive 的局限：不能替换整个对象（会丢失响应式），不能用于原始类型，解构会丢失响应式需用 toRefs。',
    flow: [
      '用 ref 保存章节数量，用 reactive 保存用户资料这类对象状态。',
      '点击按钮时修改 count.value 和 profile.level。',
      '模板读取 count 和 profile，Vue 自动把最新状态同步到页面。',
    ],
    notes: [
      'script 中读取或修改 ref 要使用 .value，模板中会自动解包。',
      'reactive 对象不要随意解构；如果需要解构并保留响应式，使用 toRefs。',
      '单个原始值优先 ref，结构化对象优先 reactive 或多个 ref，按可读性选择。',
      'reactive 对象不能直接重新赋值（如 obj = newObj），应逐个属性修改或用 Object.assign。',
    ],
    problem: '解决"数据变化后页面为什么会自动更新，以及 ref/reactive 应该怎么选"的问题。',
  },
{
    id: 'K_4',
    title: '计算与监听：computed、watch、watchEffect',
    navTitle: '计算监听',
    category: '响应式',
    path: '/vue/k-4/computed-watch',
    summary: '用购物车金额展示派生数据、精确监听和自动依赖收集的区别。',
    demo: K04ComputedWatch,
    code: K04Code,
    language: 'vue',
    principle:
      'computed 适合描述可缓存的派生值；watch 适合监听明确来源并执行副作用，支持 deep 和 immediate 选项；watchEffect 会自动收集同步读取到的依赖，适合快速建立依赖驱动的副作用。',
    flow: [
      '单价或数量变化后，total 自动重新计算。',
      'watch 监听 total，把金额变化写入日志。',
      'watchEffect 根据数量阈值给出批量优惠提示。',
    ],
    notes: [
      '能用 computed 表达的状态不要用 watch 手动同步，避免出现两份数据不一致。',
      'watch 的回调适合请求、日志、本地存储和与外部系统同步。',
      'watchEffect 依赖收集更隐式，复杂场景下 watch 的可读性通常更好。',
      'watch 监听对象属性时需要 deep: true 才能检测嵌套变化；immediate: true 可在初始化时立即执行一次。',
    ],
    problem: '解决"派生值和状态变化后的副作用应该如何分工"的问题。',
  },
{
    id: 'K_5',
    title: '条件与列表渲染：v-if、v-show、v-for、key',
    navTitle: '条件列表',
    category: '模板基础',
    path: '/vue/k-5/condition-list',
    summary: '用任务看板展示条件渲染、显示切换和列表身份维护。',
    demo: K05ConditionList,
    code: K05Code,
    language: 'vue',
    principle:
      'v-if 控制节点是否创建，v-show 控制节点是否显示，v-for 根据数组生成多个节点。key 是列表项的身份标识，帮助 Vue 在更新时复用正确的 DOM 和组件实例。',
    flow: [
      '任务数组作为单一数据来源，模板只负责把它展示出来。',
      '勾选开关改变 showDone，已完成任务通过 v-show 控制可见性。',
      '每个任务使用 id 作为 key，保证列表更新时身份稳定。',
    ],
    notes: [
      '频繁显示隐藏且 DOM 较简单时，v-show 通常更合适。',
      '真正需要销毁和重建内容时才使用 v-if，例如权限区域或昂贵组件。',
      'key 不要使用数组下标来表示会增删排序的数据。',
    ],
    problem: '解决"页面内容如何根据状态出现、隐藏，以及列表如何稳定更新"的问题。',
  },
{
    id: 'K_6',
    title: '表单处理：v-model、修饰符、基础校验',
    navTitle: '表单处理',
    category: '用户输入',
    path: '/vue/k-6/form-model',
    summary: '用活动报名表展示双向绑定、输入清洗和提交条件控制。',
    demo: K06FormModel,
    code: K06Code,
    language: 'vue',
    principle:
      'v-model 把表单控件和响应式状态连接成双向关系；修饰符在同步前处理常见输入细节；校验逻辑通常用 computed 表达，让按钮状态和提示文案自动更新。',
    flow: [
      '用户填写姓名、邮箱并勾选同意项。',
      'v-model.trim 把输入同步到 form，同时去掉首尾空格。',
      'canSubmit 根据表单状态计算是否允许提交。',
    ],
    notes: [
      '前端校验用于即时反馈，真实提交仍必须依赖服务端校验。',
      '表单字段多且属于同一业务对象时，reactive 对象更便于组织。',
      '不要只通过禁用按钮表达错误，必要时应给出明确提示。',
    ],
    problem: '解决"用户输入如何进入业务状态，并驱动提交按钮和校验反馈"的问题。',
  },
{
    id: 'K_7',
    title: '组件基础：props、emits、局部状态',
    navTitle: '组件基础',
    category: '组件',
    path: '/vue/k-7/component-basics',
    summary: '用可编辑卡片展示组件输入、内部草稿和事件输出的边界。',
    demo: K07ComponentBasics,
    code: K07Code,
    language: 'vue',
    principle:
      'props 是父级传入的只读输入，emits 是组件向外通知的事件，局部状态用于承载组件自己的临时交互。三者分开后，组件边界才清晰。',
    flow: [
      'props 接收外部传入的初始标题。',
      '输入框修改组件内部 draft，避免直接改 props。',
      '点击保存后更新本地展示，并通过 emit 把结果通知父级。',
    ],
    notes: [
      '不要在子组件中直接修改 props，这会破坏单向数据流。',
      'emits 使用 TypeScript 声明可以约束事件名和参数类型。',
      '局部草稿适合编辑场景，保存前不影响父级真实数据。',
    ],
    problem: '解决"组件如何定义可预测的输入输出，并保持内部交互独立"的问题。',
  },
{
    id: 'K_8',
    title: '插槽：默认插槽、具名插槽、作用域插槽',
    navTitle: '插槽',
    category: '组件',
    path: '/vue/k-8/slots',
    summary: '用课程卡片展示组件提供结构，使用者定制内容的模式。',
    demo: K08Slots,
    code: K08Code,
    language: 'vue',
    principle:
      '插槽让组件保留自己的外壳、布局和行为，同时把某些内容区域开放给使用者。作用域插槽还能把组件内部数据传给外部模板，让定制内容更灵活。',
    flow: [
      'CourseCard 负责卡片结构，声明 header、default、footer 三个内容位置。',
      '父级在使用组件时填入课程名、说明和价格。',
      '作用域插槽把 product 交给父级，让父级决定如何展示这条数据。',
    ],
    notes: [
      '插槽适合内容定制，不适合承担复杂状态通信。',
      '具名插槽越多，组件使用成本越高，应保持命名直接。',
      '作用域插槽传出的数据要稳定，不要暴露太多内部实现细节。',
    ],
    problem: '解决"组件结构相同但局部内容经常变化"的复用问题。',
  },
{
    id: 'K_9',
    title: '组件通信：父子通信、provide/inject',
    navTitle: '组件通信',
    category: '组件',
    path: '/vue/k-9/communication',
    summary: '用课程主题同步展示跨层级依赖注入的基本方式。',
    demo: K09Communication,
    code: K09Code,
    language: 'vue',
    principle:
      '父子之间优先使用 props 和 emits；当数据需要跨过多层组件传递，并且它更像上下文能力时，可以由上层 provide，再由后代 inject 读取。',
    flow: [
      '上层组件维护 theme，并通过 provide 暴露给后代。',
      '后代组件通过 inject 获取同一个响应式主题。',
      '用户切换主题时，依赖该主题的后代视图自动更新。',
    ],
    notes: [
      'provide/inject 适合主题、表单上下文、组件库配置等稳定上下文。',
      '频繁变化且跨页面共享的业务状态更适合 Pinia。',
      '大型项目建议使用 Symbol 作为注入 key，避免字符串冲突。',
    ],
    problem: '解决"深层组件不想逐层传 props，但又需要读取上层上下文"的问题。',
  },
{
    id: 'K_10',
    title: '生命周期与 DOM 引用',
    navTitle: '生命周期',
    category: '组件',
    path: '/vue/k-10/lifecycle-ref',
    summary: '用自动聚焦计时器展示挂载、卸载和 template ref。',
    demo: K10LifecycleRef,
    code: K10Code,
    language: 'vue',
    principle:
      '生命周期钩子描述组件进入页面、更新和离开页面的时机；template ref 让组件在必要时访问真实 DOM 或子组件实例。onBeforeUnmount 适合在组件完全卸载前清理副作用，onUnmounted 确认组件已完全卸载。',
    flow: [
      '组件挂载后，inputRef 才能拿到真实输入框并执行 focus。',
      'onMounted 中启动计时器，页面持续更新停留时间。',
      'onUnmounted 中清理计时器，避免组件离开后仍然执行回调。',
    ],
    notes: [
      'DOM 相关操作必须等到 onMounted 之后。',
      '定时器、事件监听、订阅和第三方实例都应在 onBeforeUnmount 或 onUnmounted 中释放。',
      '能通过声明式状态完成的事情，不要优先使用 DOM 操作。',
    ],
    problem: '解决"组件什么时候能访问 DOM，以及外部资源如何随组件销毁而清理"的问题。',
  },
{
    id: 'K_11',
    title: '组合式函数：可复用 composable',
    navTitle: '组合函数',
    category: '复用',
    path: '/vue/k-11/composable',
    summary: '用验证码倒计时展示如何把有状态逻辑抽成可复用函数。',
    demo: K11Composable,
    code: K11Code,
    language: 'vue',
    principle:
      '组合式函数把响应式状态、派生值、方法和生命周期封装到普通函数中。组件调用它后获得一组可直接使用的状态和行为，从而复用逻辑而不是复用 UI。',
    flow: [
      '组件调用 useCountdown 并传入初始秒数。',
      '组合式函数内部管理 seconds、isFinished、start 和 reset。',
      '组件只负责渲染倒计时和触发按钮动作。',
    ],
    notes: [
      '组合式函数通常以 use 开头，方便识别它可能使用响应式和生命周期能力。',
      '返回值要少而明确，避免把组件重新变成"大杂烩"。',
      '可复用逻辑抽出后，要优先补单元测试。',
    ],
    problem: '解决"多个组件需要同一段有状态业务逻辑，但 UI 不完全相同"的问题。',
  },
{
    id: 'K_12',
    title: '路由：动态参数、导航守卫',
    navTitle: '路由',
    category: '路由',
    path: '/vue/k-12/routing/lee',
    summary: '用成员详情展示 NuxtLink、动态参数和全局路由中间件。',
    demo: K12Routing,
    code: K12Code,
    language: 'vue',
    principle:
      'Vue Router 把 URL 映射到组件。动态参数让同一个页面承载不同资源；导航守卫则适合集中处理标题、权限、埋点等横切逻辑。',
    flow: [
      '用户点击 NuxtLink，地址从 lee 切换到 ming。',
      '组件通过 useRoute 读取 catch-all 路由的 slug 参数。',
      '全局路由中间件集中处理分类入口、旧地址和无效地址跳转。',
    ],
    notes: [
      '当前项目路由已加 /vue 分类层，后续可扩展 /react、/typescript 等知识类别。',
      '路由参数默认是字符串，业务使用前要做必要转换和兜底。',
      '权限、登录态等全局跳转逻辑不要散落在每个页面组件里，应使用 Nuxt 路由中间件。',
    ],
    problem: '解决"单页应用如何按 URL 切换页面、支持深链访问，并为知识类别预留路由层级"的问题。',
  },
{
    id: 'K_13',
    title: 'Pinia 状态管理：store、getter、action',
    navTitle: 'Pinia',
    category: '状态管理',
    path: '/vue/k-13/pinia-store',
    summary: '用课程购物车展示全局 store 的状态、派生值和业务动作。',
    demo: K13Pinia,
    code: K13Code,
    language: 'vue',
    principle:
      'Pinia 把跨组件共享的业务状态集中到 store。state 保存数据，getter 表达派生结果，action 封装修改流程，让组件不用知道状态修改细节。',
    flow: [
      '组件通过 useCartStore 获取购物车 store。',
      '列表读取 cart.items，总价读取 cart.total getter。',
      '点击按钮调用 cart.addCourse，由 action 修改课程数量。',
    ],
    notes: [
      '只有跨组件或跨页面共享的状态才值得放入 Pinia。',
      '复杂修改流程放进 action，组件只表达用户意图。',
      'store 的 getter 和 action 很适合写单元测试。',
    ],
    problem: '解决"多个页面或组件需要共享同一份业务状态"的问题。',
  },
{
    id: 'K_14',
    title: '异步请求与加载状态',
    navTitle: '异步状态',
    category: '异步',
    path: '/vue/k-14/async-state',
    summary: '用异步课程列表展示 loading、error、success 三态。',
    demo: K14AsyncState,
    code: K14Code,
    language: 'vue',
    principle:
      '异步请求不是只有"有没有数据"两种状态，还包括加载中（loading）、失败（error）、空数据（empty）和成功（success）等分支。显式建模这些状态，配合模板分支和错误边界，页面反馈才能稳定可靠，避免出现"白屏""闪烁""错误吞掉"等体验问题。',
    flow: [
      '触发加载时打开 loading，并清空旧错误和旧数据。',
      '异步完成后写入课程列表；失败时写入用户可读的错误文案。',
      'finally 中关闭 loading，确保成功和失败都能结束加载态。',
    ],
    notes: [
      '真实接口要处理重复请求、取消请求和过期响应覆盖新数据的问题。',
      '错误提示应该面向用户，不要只依赖 console.error。',
      '加载态、空态、错误态应在 UI 上有明确区别。',
    ],
    problem: '解决"接口请求期间页面该显示什么，以及失败时如何恢复"的问题。',
  },
{
    id: 'K_15',
    title: '动态组件与缓存：component、KeepAlive',
    navTitle: '动态组件',
    category: '组件',
    path: '/vue/k-15/dynamic-keep-alive',
    summary: '用学习工作台展示按状态切换组件并缓存实例。',
    demo: K15DynamicKeepAlive,
    code: K15Code,
    language: 'vue',
    principle:
      '动态组件通过 component 的 is 属性决定当前渲染哪个组件。KeepAlive 会缓存离开的组件实例，让再次切回时保留内部状态。支持 include/exclude 控制缓存范围，max 控制最大缓存数量。',
    flow: [
      '用户点击"笔记"或"练习"切换 currentTab。',
      'component 根据 currentTab 渲染对应面板。',
      'KeepAlive 包住动态组件，避免每次切换都重新创建面板实例。',
    ],
    notes: [
      '不要把所有动态组件都缓存，缓存越多内存占用越高。',
      '需要感知进入和离开缓存状态时，可以使用 activated 和 deactivated。',
      '动态组件适合工作台、标签页、配置化局部区域等场景。',
      '使用 include/exclude 按组件名控制缓存范围，max 限制最大缓存实例数，避免缓存无限增长。',
    ],
    problem: '解决"多个面板共用同一位置渲染，并且切换回来希望保留状态"的问题。',
  },
{
    id: 'K_16',
    title: '过渡动画：Transition、TransitionGroup',
    navTitle: '过渡动画',
    category: '体验',
    path: '/vue/k-16/transition',
    summary: '用学习提醒展示单元素和列表元素的进入离开动画。',
    demo: K16Transition,
    code: K16Code,
    language: 'vue',
    principle:
      'Transition 在元素进入和离开时自动添加阶段类名，CSS 根据这些类名执行动画。TransitionGroup 则处理列表中多个元素的增删移动。也可以通过 JavaScript 钩子（@before-enter、@enter、@leave）实现更复杂的动画控制。',
    flow: [
      '状态变化让提示文字进入或离开 DOM。',
      'Vue 自动添加 fade-enter、fade-leave 等阶段类。',
      'CSS transition 根据阶段类完成透明度和位移动画。',
    ],
    notes: [
      '动画应服务理解和反馈，不要为了装饰而拖慢操作。',
      '列表过渡必须使用稳定 key，否则 Vue 无法识别每个元素的身份。',
      '复杂动画可以交给 CSS 或动画库，但状态来源仍应保持清晰。',
      'JavaScript 钩子适合配合 GSAP、anime.js 等动画库实现物理动效。',
    ],
    problem: '解决"页面状态变化太突然，用户难以感知发生了什么"的问题。',
  },
{
    id: 'K_17',
    title: '自定义指令',
    navTitle: '自定义指令',
    category: '复用',
    path: '/vue/k-17/directive',
    summary: '用自动聚焦搜索框展示指令如何封装底层 DOM 行为。',
    demo: K17Directive,
    code: K17Code,
    language: 'vue',
    principle:
      '自定义指令直接作用在真实 DOM 元素上，适合封装"低层 DOM 行为"——比如自动聚焦、点击外部关闭、权限显隐、滚动观察、拖拽、长按等场景，这些需求用组件或组合式函数表达都不如指令直接；当业务能落到一个具体 DOM 节点时，指令比组件更轻量。',
    flow: [
      '定义 vFocus 指令，并在 mounted 阶段接收绑定的 DOM 元素。',
      '元素挂载后调用 el.focus()。',
      '组件中用 v-focus 声明这个 DOM 行为，不再重复写 onMounted 和 ref。',
    ],
    notes: [
      '业务状态和 UI 结构优先用组件或组合式函数表达。',
      '指令应尽量小而专注，只封装 DOM 级行为。',
      '涉及事件监听的指令要在 unmounted 中清理监听器。',
    ],
    problem: '解决"多个元素需要同一种 DOM 行为，重复写 ref/onMounted 很啰嗦"的问题。',
  },
{
    id: 'K_18',
    title: 'Teleport：弹窗与全局层',
    navTitle: 'Teleport',
    category: '体验',
    path: '/vue/k-18/teleport',
    summary: '用确认弹窗展示组件内容如何渲染到 body。',
    demo: K18Teleport,
    code: K18Code,
    language: 'vue',
    principle:
      'Teleport 让组件逻辑仍然写在当前组件中，但把实际 DOM 渲染到另一个目标节点。弹窗因此不会被父级 overflow、transform 或 z-index 限制。',
    flow: [
      '组件内部用 open 控制弹窗是否显示。',
      'Teleport to="body" 把弹窗 DOM 移到 body 下。',
      '点击关闭按钮后修改 open，弹窗从 body 中移除。',
    ],
    notes: [
      '弹窗、通知、下拉浮层和全局抽屉都常用 Teleport。',
      '真实产品还要处理焦点陷阱、Esc 关闭、滚动锁定和无障碍标签。',
      'Teleport 改变 DOM 位置，不改变组件的响应式作用域。',
    ],
    problem: '解决"浮层被父容器裁剪或层级压住，无法自然覆盖全局页面"的问题。',
  },
{
    id: 'K_19',
    title: 'Suspense 与异步组件',
    navTitle: 'Suspense',
    category: '异步',
    path: '/vue/k-19/suspense',
    summary: '用异步学习报告展示 fallback 和延迟加载组件。',
    demo: K19Suspense,
    code: K19Code,
    language: 'vue',
    principle:
      '异步组件把某些组件的加载延迟，Suspense 为等待中的异步依赖提供统一 fallback。用户先看到占位反馈，加载完成后再看到真实内容。',
    flow: [
      'defineAsyncComponent 返回一个延迟解析的组件。',
      'Suspense 捕获异步等待阶段并展示 fallback 插槽。',
      '组件解析完成后，fallback 被替换为真实学习报告。',
    ],
    notes: [
      '异步边界要控制粒度，过细会增加复杂度，过粗会拖慢可见内容。',
      '关键首屏内容不宜全部异步化，否则用户会长时间只看到占位。',
      '异步失败时应提供错误兜底，本案例聚焦成功路径和等待态。',
    ],
    problem: '解决"重组件或远程依赖加载期间页面空白、不知道是否还在加载"的问题。',
  },
{
    id: 'K_20',
    title: '性能与工程实践',
    navTitle: '性能实践',
    category: '工程实践',
    path: '/vue/k-20/performance',
    summary: '用课程列表展示过滤、v-memo 和列表渲染的基础优化思路。',
    demo: K20Performance,
    code: K20Code,
    language: 'vue',
    principle:
      '性能优化的核心是减少不必要的计算、渲染和资源加载。computed 缓存过滤结果，v-memo 在依赖未变化时跳过局部更新，但真正优化前应先确认瓶颈。',
    flow: [
      '用户输入关键词，keyword 变化触发 visibleCourses 重新计算。',
      'computed 避免无关状态变化时重复执行过滤逻辑。',
      '列表项使用 v-memo，根据版本号判断是否需要重新渲染。',
    ],
    notes: [
      '先用浏览器性能工具或实际指标定位瓶颈，再决定优化手段。',
      '大列表优先考虑分页、虚拟列表和后端过滤。',
      'v-memo 是精细工具，不要在没有性能问题时大量使用。',
    ],
    problem: '解决"数据量变大或组件变重后，页面响应逐渐变慢"的问题。',
  },
{
    id: 'K_21',
    title: '测试与可维护性',
    navTitle: '测试维护',
    category: '工程实践',
    path: '/vue/k-21/testing-maintainability',
    summary: '用检查清单说明哪些 Vue3 代码适合被单测覆盖。',
    demo: K21TestingMaintainability,
    code: K21Code,
    language: 'vue',
    principle:
      '可维护代码通常拥有清晰输入输出。组件测试关注用户行为和渲染结果，组合式函数测试关注状态变化，store 测试关注 action 和 getter 的业务规则。',
    flow: [
      '把纯业务逻辑抽到 composable 或 store，降低组件测试难度。',
      '用测试描述用户行为，例如输入、点击、提交后的可见结果。',
      '持续运行 type-check、test 和 build，把回归尽早暴露出来。',
    ],
    notes: [
      '测试应关注业务结果，不要过度绑定内部实现细节。',
      '测试名称要像规格说明，让以后的人能理解为什么要保留它。',
      '高风险逻辑优先测试，低价值快照不要大量堆积。',
    ],
    problem: '解决"项目变大后修改缺少信心、回归难以及时发现、知识案例难以长期维护"的问题。',
  },
{
    id: 'K_22',
    title: '自定义 v-model：组件级双向绑定',
    navTitle: '自定义v-model',
    category: '组件',
    path: '/vue/k-22/custom-v-model',
    summary: '用评分选择器展示组件级 v-model 的实现：modelValue、命名 model 和修饰符。',
    demo: K22CustomVModel,
    code: K22Code,
    language: 'vue',
    principle:
      '组件级 v-model 的本质是 modelValue prop + update:modelValue emit 的语法糖。命名 model（如 v-model:title）使用对应 prop 名和 update: 事件。modelModifiers 允许组件内部处理修饰符逻辑（如 .trim、.number）。',
    flow: [
      '父组件通过 v-model="rating" 传入值，等价于 :modelValue="rating" @update:modelValue="rating = $event"。',
      '子组件接收 modelValue prop，修改时 emit update:modelValue 通知父级。',
      '命名 model 使用 v-model:title，子组件接收 title prop 并 emit update:title。',
      'modelModifiers 对象让子组件感知修饰符，自行处理 .trim 等逻辑。',
    ],
    notes: [
      'Vue3 的 v-model 默认绑定名为 modelValue，Vue2 是 value，注意迁移差异。',
      '一个组件可以同时使用多个 v-model，如 v-model="data" v-model:title="name"。',
      'modelModifiers 只在组件内部使用，不会影响父组件的绑定行为。',
    ],
    problem: '解决"自定义组件如何像原生表单一样支持 v-model 双向绑定"的问题。',
  },
{
    id: 'K_23',
    title: '错误处理：errorCaptured、全局错误处理',
    navTitle: '错误处理',
    category: '工程实践',
    path: '/vue/k-23/error-handling',
    summary: '用错误边界展示 onErrorCaptured 捕获后代错误和 app.config.errorHandler 全局兜底。',
    demo: K23ErrorHandling,
    code: K23Code,
    language: 'vue',
    principle:
      'onErrorCaptured 在当前组件捕获后代组件抛出的错误，返回 false 可阻止错误继续冒泡。app.config.errorHandler 注册全局错误处理器，捕获所有未被 errorCaptured 拦截的错误，适合上报监控服务。',
    flow: [
      '后代组件渲染或生命周期中抛出错误。',
      'onErrorCaptured 捕获错误，展示降级 UI 并记录日志。',
      '返回 false 阻止错误冒泡到全局；不返回则继续传播到 errorHandler。',
      '全局 errorHandler 作为最终兜底，处理未捕获的错误。',
    ],
    notes: [
      'errorCaptured 只能捕获后代组件的错误，不能捕获自身错误。',
      '返回 false 阻止冒泡，返回 true 或不返回则继续传播。',
      '全局 errorHandler 适合上报错误到监控服务（如 Sentry）。',
      '异步错误（setTimeout、Promise）需要用 window.onerror 或 window.addEventListener 捕获。',
    ],
    problem: '解决"组件错误如何被捕获和降级，全局错误如何统一处理"的问题。',
  },
{
    id: 'K_24',
    title: '插件开发：app.use、全局能力注册',
    navTitle: '插件开发',
    category: '工程实践',
    path: '/vue/k-24/plugin-dev',
    summary: '用通知插件展示 Vue 插件的 install 方法、全局组件注册和 provide/inject 注入。',
    demo: K24PluginDev,
    code: K24Code,
    language: 'vue',
    principle:
      'Vue 插件是一个带有 install 方法的对象，app.use() 时自动调用。install 接收 app 实例和可选配置，可以注册全局组件、指令，或通过 app.provide 注入全局能力。组件中通过 inject 获取插件提供的方法。',
    flow: [
      '定义插件对象，实现 install(app, options) 方法。',
      'install 中注册全局组件、指令或通过 app.provide 注入方法。',
      'main.ts 中调用 app.use(plugin, options) 安装插件。',
      '组件中通过 inject(key) 获取插件提供的能力。',
    ],
    notes: [
      '优先使用 provide/inject 而非 app.config.globalProperties，前者类型更安全。',
      'InjectionKey 确保 provide 和 inject 的类型一致。',
      '插件配置通过 install 的第二个参数传入，支持默认值。',
      '第三方库（Router、Pinia、Element Plus）都是通过插件机制注册的。',
    ],
    problem: '解决"如何封装可复用的全局能力，让多个项目或组件共享"的问题。',
  },
{
    id: 'K_25',
    title: '浅层响应式：shallowRef、triggerRef',
    navTitle: '浅层响应式',
    category: '响应式进阶',
    path: '/vue/k-25/shallow-reactivity',
    summary: '用门店库存工作台演示大型数据只追踪顶层变化，以及批量修改后主动刷新视图。',
    demo: K25ShallowReactivity,
    code: K25Code,
    language: 'vue',
    principle:
      'shallowRef 只追踪 .value 的替换，不会把内部对象递归转换成深层响应式。深层数据原地修改后可以调用 triggerRef 主动通知依赖更新，也可以直接替换整个顶层值。',
    flow: [
      '把较大的商品目录放入 shallowRef，避免为每个深层字段建立响应式代理。',
      '批量修改商品库存时只更新普通对象，界面暂不重新渲染。',
      '批处理完成后调用 triggerRef，一次性通知所有依赖刷新。',
      '服务端返回新目录时直接替换 products.value，自动触发更新。',
    ],
    notes: [
      '普通业务表单仍优先使用 ref 或 reactive，不要为了浅层响应式牺牲可理解性。',
      'shallowRef 适合大型不可变数据、第三方实例、图表对象和批量更新场景。',
      '使用 triggerRef 前要明确深层修改已经完成，避免界面展示中间状态。',
    ],
    problem: '解决"大型对象无需深层代理，如何控制更新时机并减少响应式开销"的问题。',
  },
{
    id: 'K_26',
    title: '作用域副作用：effectScope、onScopeDispose',
    navTitle: '副作用作用域',
    category: '响应式进阶',
    path: '/vue/k-26/effect-scope',
    summary: '用工作台订阅演示将监听器和定时器放进同一作用域，并在退出业务模块时统一清理。',
    demo: K26EffectScope,
    code: K26Code,
    language: 'vue',
    principle:
      'effectScope 可以收集其内部创建的 computed、watch 和 watchEffect，调用 stop 后统一停止这些响应式副作用。onScopeDispose 用于注册同一作用域内的额外清理逻辑。',
    flow: [
      '进入工作台时创建一个 effectScope。',
      '在 scope.run 中启动工作区监听和后台同步定时器。',
      '切换工作区时，watchEffect 自动响应并记录新的订阅目标。',
      '退出工作台时调用 scope.stop，监听器与 onScopeDispose 清理逻辑一起停止。',
    ],
    notes: [
      '组件 setup 本身已经运行在作用域中，effectScope 更适合组件外的服务和可复用状态模块。',
      '定时器、WebSocket 和第三方订阅仍需通过 onScopeDispose 显式释放。',
      '已经停止的 scope 不应重复运行，重新进入业务模块时应创建新作用域。',
    ],
    problem: '解决"一组相关监听和外部订阅如何统一启停，避免遗漏清理造成泄漏"的问题。',
  },
{
    id: 'K_27',
    title: '属性透传：useAttrs、inheritAttrs',
    navTitle: '属性透传',
    category: '组件进阶',
    path: '/vue/k-27/attribute-forwarding',
    summary: '用发布按钮包装组件演示 class、事件、无障碍属性和 data-* 如何透传到真实元素。',
    demo: K27AttributeForwarding,
    code: K27Code,
    language: 'vue',
    principle:
      '未被 props 或 emits 声明的属性会成为透传属性。单根组件默认自动把它们落到根节点；设置 inheritAttrs: false 后，可以通过 useAttrs 或 $attrs 把属性精确转发到内部目标元素。',
    flow: [
      '父组件给包装组件传入 class、disabled、aria-label、data-* 和点击事件。',
      '包装组件关闭默认继承，避免属性落到错误的外层容器。',
      '通过 useAttrs 读取透传属性，并绑定到内部真实 button。',
      '父组件的事件和无障碍语义继续按原方式工作。',
    ],
    notes: [
      '$attrs 不是深层响应式业务状态，不应通过监听它驱动复杂逻辑。',
      '在 emits 中声明事件后，对应监听器不会继续出现在 $attrs 中。',
      '多根节点组件不会自动透传，必须明确把 $attrs 绑定到目标节点。',
    ],
    problem: '解决"封装基础组件后，原生属性、事件和无障碍能力如何不丢失"的问题。',
  },
{
    id: 'K_28',
    title: '组件公开接口：defineExpose、useTemplateRef',
    navTitle: '组件公开接口',
    category: '组件进阶',
    path: '/vue/k-28/component-expose',
    summary: '用课程搜索面板演示父组件通过模板引用调用子组件明确公开的聚焦与清空能力。',
    demo: K28ComponentExpose,
    code: K28Code,
    language: 'vue',
    principle:
      'script setup 组件默认是封闭的，父组件不能任意访问其内部变量。子组件通过 defineExpose 明确公开少量命令式能力，父组件再用 useTemplateRef 获取类型安全的组件引用。',
    flow: [
      '子组件维护输入值和内部 DOM 引用。',
      '通过 defineExpose 只公开 focusSearch 与 clearSearch 方法。',
      '父组件使用 useTemplateRef 获取模板中的子组件实例。',
      '用户点击外部工具按钮时，父组件调用公开方法完成聚焦或清空。',
    ],
    notes: [
      '优先使用 props 和 emits 进行声明式通信，只在聚焦、滚动、播放等命令式场景使用组件引用。',
      'defineExpose 应保持接口最小，不要把全部内部状态暴露给父组件。',
      'useTemplateRef 是 Vue 3.5 提供的模板引用 API，引用值在组件挂载前为 null。',
    ],
    problem: '解决"父组件确实需要调用子组件命令时，如何保持类型安全和封装边界"的问题。',
  }
]
