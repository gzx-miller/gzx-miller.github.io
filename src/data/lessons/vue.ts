import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import K01K02Pair from '../../demos/K01K02Pair.vue'
import K03K04Pair from '../../demos/K03K04Pair.vue'
import K05K06Pair from '../../demos/K05K06Pair.vue'
import K07K08Pair from '../../demos/K07K08Pair.vue'
import K09K10Pair from '../../demos/K09K10Pair.vue'
import K11K17Pair from '../../demos/K11K17Pair.vue'
import K12K14Pair from '../../demos/K12K14Pair.vue'
import K13K29Pair from '../../demos/K13K29Pair.vue'
import K15K19Pair from '../../demos/K15K19Pair.vue'
import K16K18Pair from '../../demos/K16K18Pair.vue'
import K20K21Pair from '../../demos/K20K21Pair.vue'
import K23K24Pair from '../../demos/K23K24Pair.vue'
import K25K26Pair from '../../demos/K25K26Pair.vue'
import K30K31Pair from '../../demos/K30K31Pair.vue'
import K22CustomVModel from '../../demos/K22CustomVModelArticle.vue'
import K27AttributeForwarding from '../../demos/K27AttributeForwardingArticle.vue'
import K28ComponentExpose from '../../demos/K28ComponentExposeArticle.vue'
import K32VuexMigration from '../../demos/S11VuexMigrationArticle.vue'
import K33PiniaPlugin from '../../demos/S17PiniaPluginArticle.vue'
import K34PiniaGetters from '../../demos/S18PiniaGettersArticle.vue'
import K35PiniaActions from '../../demos/S19PiniaActionsArticle.vue'
import K36PiniaDevtools from '../../demos/S20PiniaDevtoolsArticle.vue'
import K37PiniaTesting from '../../demos/S21PiniaTestingArticle.vue'
import K38DefineModel from '../../demos/K38DefineModelArticle.vue'
// 该分类专属的演示样式，随分类数据一起按需加载
import '../../styles/category-vue.css'

const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })

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
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const K01Code = createCodeLoader('K01AppEntry.vue')

const K03Code = createCodeLoader('K03Reactivity.vue')

const K05Code = createCodeLoader('K05ConditionList.vue')

const K07Code = createCodeLoader('K07ComponentBasics.vue')

const K09Code = createCodeLoader('K09Communication.vue')

const K11Code = createCodeLoader('K11Composable.vue')

const K12Code = createCodeLoader('K12Routing.vue')

const K13Code = createCodeLoader('K13Pinia.vue')

const K15Code = createCodeLoader('K15DynamicKeepAlive.vue')

const K16Code = createCodeLoader('K16Transition.vue')

const K20Code = createCodeLoader('K20Performance.vue')

const K22Code = createCodeLoader('K22CustomVModel.vue')

const K23Code = createCodeLoader('K23ErrorHandling.vue')

const K25Code = createCodeLoader('K25ShallowReactivity.vue')

const K27Code = createCodeLoader('K27AttributeForwarding.vue')

const K28Code = createCodeLoader('K28ComponentExpose.vue')

const K30Code = createCodeLoader('S02PiniaSetupStore.vue')

const K32Code = createCodeLoader('S11VuexMigration.vue')

const K33Code = createCodeLoader('S17PiniaPlugin.vue')

const K34Code = createCodeLoader('S18PiniaGetters.vue')

const K35Code = createCodeLoader('S19PiniaActions.vue')

const K36Code = createCodeLoader('S20PiniaDevtools.vue')

const K37Code = createCodeLoader('S21PiniaTesting.vue')

const K38Code = createCodeLoader('K38DefineModel.vue')

export const lessons: Lesson[] = [
{
    id: 'K_1',
    title: '应用创建与模板语法',
    navTitle: '应用与模板',
    category: '工程起点',
    path: '/vue/k-1/app-entry',
    summary: '从 createApp、mount 和 SFC 结构认识应用入口，再用插值、指令、条件循环与事件绑定把响应式状态映射成交互界面。',
    demo: null,
    demoComponent: K01K02Pair,
    code: K01Code,
    language: 'vue',
    principle:
      'Vue3 应用从 createApp 创建独立的应用实例开始：每个实例拥有自己的组件树、插件注册表、全局配置与挂载目标，因此同一页面可以并存多个互不干扰的 Vue 应用。SFC 把 template、script、style 三种关注点收进同一文件，配合编译器在构建期完成模板编译，让组件成为可维护、可复用的最小页面单元。模板语法进一步把这套应用变成可交互界面：插值显示文本、指令处理条件与循环、事件绑定把用户动作交回组件逻辑，全部由模板编译器和响应式系统精确更新 DOM。',
    flow: [
      '在 main.ts 中创建应用实例，导入全局样式和根组件。',
      '通过 app.use 注册 Router、Pinia 等跨页面能力，让后续组件可以读取路由和 store。',
      '调用 mount("#app") 把 Vue 接管到 index.html 的挂载点，之后页面更新交给 Vue 响应式系统处理。',
      '在浏览器控制台确认真实应用实例已挂载且插件可用。',
    ],
    notes: [
      '入口文件只放应用装配逻辑，不放具体业务流程，否则项目变大后很难定位问题。',
      'SFC 的 template 负责结构，script setup 负责状态和行为，样式尽量服务当前组件或全局布局。',
      '插件注册顺序通常不影响普通页面，但依赖注入类插件要在组件挂载前完成。',
      '多个应用实例之间互不共享全局配置，微前端场景可各自接管独立挂载点。',
    ],
    problem: '解决"Vue 项目从哪里启动、全局能力在哪里接入、页面如何被根组件接管"的入门问题。',
  },
{
    id: 'K_3',
    title: '响应式基础与计算监听',
    navTitle: '响应式计算',
    category: '响应式',
    path: '/vue/k-3/reactivity',
    summary: '用 ref、reactive 建立响应式状态，再用 computed、watch 和 watchEffect 表达派生值与副作用。',
    demo: null,
    demoComponent: K03K04Pair,
    code: K03Code,
    language: 'vue',
    principle:
      'ref 把单个值包装成响应式引用，reactive 把对象转换成响应式代理。模板读取这些状态时会自动追踪依赖，状态变化后依赖它的视图会重新渲染。reactive 的局限：不能替换整个对象（会丢失响应式），不能用于原始类型，解构会丢失响应式需用 toRefs。在此基础上，computed 负责缓存派生值，watch 监听明确来源执行副作用，watchEffect 自动收集依赖，三者共同决定状态变化后的计算与响应。',
    flow: [
      '用 ref 保存章节数量，用 reactive 保存用户资料这类对象状态。',
      '点击按钮时修改 count.value 和 profile.level。',
      '模板读取 count 和 profile，Vue 自动把最新状态同步到页面。',
      '给 reactive 对象整体重新赋值，观察响应式丢失导致视图不再更新。',
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
    id: 'K_5',
    title: '条件列表与表单绑定',
    navTitle: '列表与表单',
    category: '模板基础',
    path: '/vue/k-5/condition-list',
    summary: '用 v-if、v-show、v-for 和 key 组织列表展示，再用 v-model、修饰符与校验把用户输入同步进业务状态。',
    demo: null,
    demoComponent: K05K06Pair,
    code: K05Code,
    language: 'vue',
    principle:
      'v-if 在条件为假时不创建节点（惰性渲染、切换有开销），v-show 始终创建、仅切换 display 样式（首渲染开销高、切换成本低），v-for 根据数组在每次渲染时生成一组节点。key 是列表项的身份标识：靠它，diff 算法才能在列表增删排序时复用正确的 DOM 与组件实例，避免状态错位。当列表中的每一行需要被用户编辑时，v-model 又把表单控件与响应式状态连成双向关系，配合修饰符和 computed 校验形成完整的输入闭环。',
    flow: [
      '任务数组作为单一数据来源，模板只负责把它展示出来。',
      '勾选开关改变 showDone，已完成任务通过 v-show 控制可见性。',
      '每个任务使用 id 作为 key，保证列表更新时身份稳定。',
      '在列表头部插入一项，用元素面板确认旧节点被复用而非全部重建。',
    ],
    notes: [
      '频繁显示隐藏且 DOM 较简单时，v-show 通常更合适。',
      '真正需要销毁和重建内容时才使用 v-if，例如权限区域或昂贵组件。',
      'key 不要使用数组下标来表示会增删排序的数据。',
      'v-if 与 v-for 不要在同一元素上并用，v-if 优先级更高会拿不到循环变量。',
    ],
    problem: '解决"页面内容如何根据状态出现、隐藏，以及列表增删排序时如何稳定更新"的问题。',
  },
{
    id: 'K_7',
    title: '组件基础与插槽',
    navTitle: '组件与插槽',
    category: '组件',
    path: '/vue/k-7/component-basics',
    summary: '用 props、emits 和局部状态建立组件输入输出边界，再用默认、具名和作用域插槽把内容定制权交回使用者。',
    demo: null,
    demoComponent: K07K08Pair,
    code: K07Code,
    language: 'vue',
    principle:
      'props 是父级传入的只读输入，更新必须由父级发起；emits 是组件向外通知的事件，参数即变更载荷；局部状态承载组件自己的临时交互，例如未保存的编辑草稿。三者各司其职，组件才形成"输入 → 交互 → 输出"清晰、可预测、可复用的边界。明确边界后，组件才能被安全地组合与替换，也更容易被测试。插槽补上了内容定制这一环：组件保留外壳与行为，使用者决定标题、正文和底部按钮，作用域插槽还能把内部数据回传给父级模板。',
    flow: [
      'props 接收外部传入的初始标题。',
      '输入框修改组件内部 draft，避免直接改 props。',
      '点击保存后更新本地展示，并通过 emit 把结果通知父级。',
      '父级用 updated 事件更新真实数据，验证单向数据流闭环。',
    ],
    notes: [
      '不要在子组件中直接修改 props，这会破坏单向数据流。',
      'emits 使用 TypeScript 声明可以约束事件名和参数类型。',
      '局部草稿适合编辑场景，保存前不影响父级真实数据。',
      '需要双向绑定时改用 v-model 语法糖，其底层仍是 props 加 update 事件。',
    ],
    problem: '解决"组件如何定义可预测的输入输出边界，并让内部编辑交互保持独立"的问题。',
  },
{
    id: 'K_9',
    title: '组件通信与生命周期',
    navTitle: '通信与生命周期',
    category: '组件',
    path: '/vue/k-9/communication',
    summary: '用 props/emits 和 provide/inject 打通父子与跨层通信，再结合生命周期钩子和模板引用管理 DOM 与资源清理。',
    demo: null,
    demoComponent: K09K10Pair,
    code: K09Code,
    language: 'vue',
    principle:
      '父子之间优先用 props 向下传值、emits 向上通知，数据流单向清晰；当数据需要跨越多层中间组件、又更像“上下文能力”（主题、语言、表单上下文、组件库配置）时，由上层 provide 注入、任意深度的后代 inject 读取，中间层无需感知。注意注入值默认非响应式，传 ref 或 reactive 对象时后代才能跟随变化。组件通信解决数据如何流动，生命周期与模板引用则解决组件何时能访问真实 DOM、以及定时器和监听器应在何时随组件销毁而释放。',
    flow: [
      '上层组件维护 theme，并通过 provide 暴露给后代。',
      '后代组件通过 inject 获取同一个响应式主题。',
      '用户切换主题时，依赖该主题的后代视图自动更新。',
      '在深层后代中注入并修改主题，验证中间层组件无需任何改动。',
    ],
    notes: [
      'provide/inject 适合主题、表单上下文、组件库配置等稳定上下文。',
      '频繁变化且跨页面共享的业务状态更适合 Pinia。',
      '大型项目建议使用 Symbol 作为注入 key，避免字符串冲突。',
      'inject 的第二个参数可提供默认值，缺少提供者时后代也能安全运行。',
    ],
    problem: '解决"深层组件不想逐层传 props，但又需要读取上层上下文"的问题。',
  },
{
    id: 'K_11',
    title: '组合式函数与自定义指令',
    navTitle: '组合与指令',
    category: '复用',
    path: '/vue/k-11/composable',
    summary: '把有状态逻辑抽成可复用的 composable，再用自定义指令封装自动聚焦等底层 DOM 行为。',
    demo: null,
    demoComponent: K11K17Pair,
    code: K11Code,
    language: 'vue',
    principle:
      '组合式函数（composable）把响应式状态、派生值、方法与生命周期钩子封装进一个普通函数，借助组合式 API 的运行时上下文，函数内创建的 ref 与副作用能正确挂载到调用它的组件实例上。组件调用后获得一组可直接使用的状态与行为——复用逻辑而不复用 UI，是替代 mixin 的现代方案，同一逻辑可在多组件间甚至跨项目共享。自定义指令从另一侧补齐复用：当需求落在一个具体 DOM 节点上（如自动聚焦、点击外部关闭），用 v-xxx 声明比 composable 或组件更直接。',
    flow: [
      '组件调用 useCountdown 并传入初始秒数。',
      '组合式函数内部管理 seconds、isFinished、start 和 reset。',
      '组件只负责渲染倒计时和触发按钮动作。',
      '把该组合式函数接入第二个组件，验证逻辑无需复制即可复用。',
    ],
    notes: [
      '组合式函数通常以 use 开头，方便识别它可能使用响应式和生命周期能力。',
      '返回值要少而明确，避免把组件重新变成"大杂烩"。',
      '可复用逻辑抽出后，要优先补单元测试。',
      '组合式函数内的 ref 与生命周期钩子依赖调用上下文，须在 setup 同步阶段调用。',
    ],
    problem: '解决"多个组件需要同一段有状态业务逻辑，但 UI 不完全相同"的问题。',
  },
{
    id: 'K_12',
    title: '路由与异步加载状态',
    navTitle: '路由与异步',
    category: '路由',
    path: '/vue/k-12/routing/lee',
    summary: '用 Nuxt 文件路由、动态参数和中间件组织页面跳转，再为异步请求显式建模 loading、error、empty 与 success 状态。',
    demo: null,
    demoComponent: K12K14Pair,
    code: K12Code,
    language: 'vue',
    principle:
      '本项目的 Nuxt 文件路由把目录与文件名直接映射为 URL，页面组件无需手写路由表；动态参数（如 /vue/k-12/routing/lee 中的 slug）让同一个页面承载不同资源；路由中间件则在跳转前集中处理标题、权限、非法地址等横切逻辑，避免这些判断散落在每个页面里。页面进入后往往还要请求数据，异步状态需要显式建模 loading、error、empty 和 success，才能避免白屏、闪烁或错误被吞掉。',
    flow: [
      '用户点击 NuxtLink，地址从 lee 切换到 ming。',
      '组件通过 useRoute 读取 catch-all 路由的 slug 参数。',
      '全局路由中间件集中处理分类入口、旧地址和无效地址跳转。',
      '直接访问一个不存在的深层地址，验证中间件按预期重定向。',
    ],
    notes: [
      '当前项目路由已加 /vue 分类层，后续可扩展 /react、/typescript 等知识类别。',
      '路由参数默认是字符串，业务使用前要做必要转换和兜底。',
      '权限、登录态等全局跳转逻辑不要散落在每个页面组件里，应使用 Nuxt 路由中间件。',
      'useRoute 的参数是响应式的，监听其变化即可在同一页面内处理不同 slug。',
    ],
    problem: '解决"单页应用如何按 URL 切换页面、支持深链访问，并为知识类别预留路由层级"的问题。',
  },
{
    id: 'K_13',
    title: 'Pinia 状态管理与状态边界',
    navTitle: '状态与边界',
    category: '状态管理',
    path: '/vue/k-13/pinia-store',
    summary: '用 Pinia 的 state、getter、action 管理跨组件业务状态，并先判断状态归属，避免把组件状态和远程缓存都塞进 Store。',
    demo: null,
    demoComponent: K13K29Pair,
    code: K13Code,
    language: 'vue',
    principle:
      'Pinia 把跨组件、跨页面共享的业务状态集中到独立 store 中：state 保存原始数据，getter 用 computed 语义表达派生结果（自带缓存与类型推导），action 封装修改流程且天然支持异步，组件只需调用意图明确的 action、读取派生好的 getter，不必知道状态修改的内部细节，也让这些逻辑便于单元测试。但在建 Store 之前应先判断状态归属：组件私有状态、URL 参数和远程缓存各有更合适的工具，只有跨页面共享且具有业务生命周期的状态才值得进入 Pinia。',
    flow: [
      '组件通过 useCartStore 获取购物车 store。',
      '列表读取 cart.items，总价读取 cart.total getter。',
      '点击按钮调用 cart.addCourse，由 action 修改课程数量。',
      '在 devtools 的 Pinia 面板观察 action 触发的状态变更记录。',
    ],
    notes: [
      '只有跨组件或跨页面共享的状态才值得放入 Pinia。',
      '复杂修改流程放进 action，组件只表达用户意图。',
      'store 的 getter 和 action 很适合写单元测试。',
      '多个 store 之间可以直接互相引用，避免把全部状态塞进单个巨型 store。',
    ],
    problem: '解决"多个页面或组件需要读写同一份业务状态，且修改流程需要统一维护"的问题。',
  },
{
    id: 'K_15',
    title: '动态组件、KeepAlive 与 Suspense',
    navTitle: '动态与异步组件',
    category: '组件',
    path: '/vue/k-15/dynamic-keep-alive',
    summary: '用 component 与 KeepAlive 切换并缓存面板实例，再用 defineAsyncComponent 和 Suspense 声明组件级异步边界。',
    demo: null,
    demoComponent: K15K19Pair,
    code: K15Code,
    language: 'vue',
    principle:
      '动态组件通过 component 的 is 属性决定当前渲染哪个组件。KeepAlive 会缓存离开的组件实例，让再次切回时保留内部状态。支持 include/exclude 控制缓存范围，max 控制最大缓存数量。动态组件负责"渲染哪一个"，KeepAlive 负责"记住上一个"，两者职责分明。当被切换或延迟加载的组件本身依赖异步数据时，Suspense 把“加载中”提升为模板层面的异步边界，等待期间统一渲染 fallback。',
    flow: [
      '用户点击"笔记"或"练习"切换 currentTab。',
      'component 根据 currentTab 渲染对应面板。',
      'KeepAlive 包住动态组件，避免每次切换都重新创建面板实例。',
      '切回已缓存的"笔记"面板，验证输入内容等状态仍然保留。',
    ],
    notes: [
      '不要把所有动态组件都缓存，缓存越多内存占用越高。',
      '需要感知进入和离开缓存状态时，可以使用 activated 和 deactivated。',
      '动态组件适合工作台、标签页、配置化局部区域等场景。',
      '使用 include/exclude 按组件名控制缓存范围，max 限制最大缓存实例数，避免缓存无限增长。',
    ],
    problem: '解决"多个面板共用同一位置渲染，以及切换回来后如何保留各自状态"的问题。',
  },
{
    id: 'K_16',
    title: '过渡动画与 Teleport',
    navTitle: '动画与浮层',
    category: '体验',
    path: '/vue/k-16/transition',
    summary: '用 Transition、TransitionGroup 表达进入离开动画，再用 Teleport 把弹窗等浮层渲染到 body。',
    demo: null,
    demoComponent: K16K18Pair,
    code: K16Code,
    language: 'vue',
    principle:
      'Transition 在元素进入和离开时自动添加阶段类名，CSS 根据这些类名执行动画。TransitionGroup 则处理列表中多个元素的增删移动。也可以通过 JavaScript 钩子（@before-enter、@enter、@leave）实现更复杂的动画控制。Teleport 处理另一类体验问题：组件逻辑和响应式作用域不变，但 DOM 被渲染到 body，弹窗因此不会被父级裁剪或被层叠上下文压制。',
    flow: [
      '状态变化让提示文字进入或离开 DOM。',
      'Vue 自动添加 fade-enter、fade-leave 等阶段类。',
      'CSS transition 根据阶段类完成透明度和位移动画。',
      '用元素面板观察进入与离开阶段类名的添加与移除时机。',
    ],
    notes: [
      '动画应服务理解和反馈，不要为了装饰而拖慢操作。',
      '列表过渡必须使用稳定 key，否则 Vue 无法识别每个元素的身份。',
      '复杂动画可以交给 CSS 或动画库，但状态来源仍应保持清晰。',
      'JavaScript 钩子适合配合 GSAP、anime.js 等动画库实现物理动效。',
    ],
    problem: '解决"页面状态变化太突然，用户难以清晰感知界面到底发生了什么变化"的问题。',
  },
{
    id: 'K_20',
    title: '性能优化与测试可维护性',
    navTitle: '性能与测试',
    category: '工程实践',
    path: '/vue/k-20/performance',
    summary: '先测量再优化，用 computed、v-memo 和列表策略降低渲染成本，并把核心逻辑抽到可测试的 composable 与 store。',
    demo: null,
    demoComponent: K20K21Pair,
    code: K20Code,
    language: 'vue',
    principle:
      '性能优化的核心是减少不必要的计算、渲染与资源加载：computed 基于依赖缓存派生结果，依赖不变时不重算；v-memo 在依赖数组未变化时跳过这段子树的重渲染；大列表则考虑分页、虚拟滚动与后端过滤。所有手段都应建立在测量的基础上——先用性能工具确认瓶颈，再对症选择，过早优化只会增加复杂度。可维护性与性能同样依赖清晰边界：把业务逻辑抽到 composable 或 store，既减少组件负担，也让测试可以聚焦用户行为与业务结果。',
    flow: [
      '用户输入关键词，keyword 变化触发 visibleCourses 重新计算。',
      'computed 避免无关状态变化时重复执行过滤逻辑。',
      '列表项使用 v-memo，根据版本号判断是否需要重新渲染。',
      '对比使用 v-memo 前后的渲染次数，确认命中缓存时子树被跳过。',
    ],
    notes: [
      '先用浏览器性能工具或实际指标定位瓶颈，再决定优化手段。',
      '大列表优先考虑分页、虚拟列表和后端过滤。',
      'v-memo 是精细工具，不要在没有性能问题时大量使用。',
      '测量以生产构建为准，开发模式的耗时与真实表现差异很大。',
    ],
    problem: '解决"数据量变大或组件变重后页面响应逐渐变慢，如何定位瓶颈并治理"的问题。',
  },
{
    id: 'K_22',
    title: '自定义 v-model：组件级双向绑定',
    navTitle: '自定义v-model',
    category: '组件',
    path: '/vue/k-22/custom-v-model',
    summary: '用评分选择器展示组件级 v-model 的实现：modelValue、命名 model 和修饰符。',
    demo: null,
    demoComponent: K22CustomVModel,
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
      'defineModel 宏可替代手写 modelValue prop 与 update 事件，新代码优先使用。',
    ],
    problem: '解决"自定义组件如何像原生表单一样支持 v-model 双向绑定"的问题。',
  },
{
    id: 'K_23',
    title: '错误处理与插件开发',
    navTitle: '错误与插件',
    category: '工程实践',
    path: '/vue/k-23/error-handling',
    summary: '用 onErrorCaptured 和全局 errorHandler 捕获降级错误，再通过插件 install 统一注册全局能力。',
    demo: null,
    demoComponent: K23K24Pair,
    code: K23Code,
    language: 'vue',
    principle:
      'onErrorCaptured 在当前组件捕获后代组件抛出的错误，返回 false 可阻止错误继续冒泡。app.config.errorHandler 注册全局错误处理器，捕获所有未被 errorCaptured 拦截的错误，适合上报监控服务。插件机制则把可复用的全局能力（组件、指令、provide 注入）收进 install，在 app.use 时一次装配，错误处理与插件都服务于应用的统一治理。',
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
    problem: '解决"组件错误如何被捕获并降级展示，全局错误如何统一上报处理"的问题。',
  },
{
    id: 'K_25',
    title: '浅层响应式与作用域副作用',
    navTitle: '浅响应与作用域',
    category: '响应式进阶',
    path: '/vue/k-25/shallow-reactivity',
    summary: '用 shallowRef、triggerRef 控制大型数据的更新时机，再用 effectScope、onScopeDispose 统一启停一组副作用。',
    demo: null,
    demoComponent: K25K26Pair,
    code: K25Code,
    language: 'vue',
    principle:
      'shallowRef 只追踪 .value 被整体替换这一件事，不会把内部对象递归转换为深层响应式代理，因此省下了为海量深层字段建立代理的开销。原地修改深层数据不会触发更新，需要手动调用 triggerRef 主动通知依赖刷新，或者直接替换整个 .value；适合大型目录、第三方实例与批量更新场景。effectScope 从生命周期维度解决同类问题：把一组 watch、computed 与外部订阅收进同一作用域，调用 stop 时统一清理，避免逐个手动停止造成遗漏。',
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
      'shallowRef 包裹的数组 push 等原地操作同样不触发更新，收尾时记得 triggerRef。',
    ],
    problem: '解决"大型对象无需深层代理，如何控制更新时机并减少响应式开销"的问题。',
  },
{
    id: 'K_27',
    title: '属性透传：useAttrs、inheritAttrs',
    navTitle: '属性透传',
    category: '组件进阶',
    path: '/vue/k-27/attribute-forwarding',
    summary: '用发布按钮包装组件演示 class、事件、无障碍属性和 data-* 如何透传到真实元素。',
    demo: null,
    demoComponent: K27AttributeForwarding,
    code: K27Code,
    language: 'vue',
    principle:
      '未被 props 或 emits 声明的属性会成为透传属性。单根组件默认自动把它们落到根节点；设置 inheritAttrs: false 后，可以通过 useAttrs 或 $attrs 把属性精确转发到内部目标元素。透传保证封装组件在功能增强的同时不牺牲原生能力。',
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
      'v-bind="$attrs" 默认包含事件监听，转发时要确认不会重复绑定。',
    ],
    problem: '解决"封装基础组件后，原生属性、事件和无障碍能力如何不丢失或被拦截"的问题。',
  },
{
    id: 'K_28',
    title: '组件公开接口：defineExpose、useTemplateRef',
    navTitle: '组件公开接口',
    category: '组件进阶',
    path: '/vue/k-28/component-expose',
    summary: '用课程搜索面板演示父组件通过模板引用调用子组件明确公开的聚焦与清空能力。',
    demo: null,
    demoComponent: K28ComponentExpose,
    code: K28Code,
    language: 'vue',
    principle:
      'script setup 组件默认是封闭的，父组件不能任意访问其内部变量。子组件通过 defineExpose 明确公开少量命令式能力，父组件再用 useTemplateRef 获取类型安全的组件引用。暴露面越小，组件内部重构的余地就越大，封装边界也越清晰。',
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
      '命令式调用适合聚焦、滚动等一次性动作，持续的数据同步仍应走 props 与事件。',
    ],
    problem: '解决"父组件确实需要调用子组件命令时，如何保持类型安全和封装边界"的问题。',
  },
{
    id: 'K_30',
    title: 'Pinia Setup Store 与订阅',
    navTitle: 'Setup Store',
    category: 'Pinia 进阶',
    path: '/vue/k-30/pinia-setup-store',
    summary: '用组合式 API 组织 Setup Store 并以 storeToRefs 安全解构，再用 $patch 合并更新、$subscribe 接入持久化等副作用。',
    demo: null,
    demoComponent: K30K31Pair,
    code: K30Code,
    language: 'vue',
    principle:
      'Setup Store 用组合式 API 组织状态：ref 表达 state，computed 表达 getter，普通函数表达 action，name 参数称为 store id。Store 实例本身是响应式的，直接读取 store.courses 没问题，但解构时响应性会被切断；storeToRefs 能把 state 和 getter 解构成保留响应性的 ref，而 action 不需要也不应该用 storeToRefs 包裹。$patch 把同一业务动作中的多个修改合并成一次提交，$subscribe 则观察每次状态变更并驱动持久化、审计等基础设施副作用，记得在组件销毁时取消订阅。',
    flow: [
      'defineStore(\'learning\', () => {...}) 的回调返回 state、getter 和 action。',
      '组件调用 useLearningStore() 拿到同一个 store 实例（按 id 单例）。',
      '用 storeToRefs 解构 courses、totalMinutes、completionRate，保留模板响应性。',
      'enroll、toggleCompleted 等方法直接从 store 解构调用，无需 storeToRefs。',
    ],
    notes: [
      'storeToRefs 只包裹 state 和 getter；action 直接解构即可，方法不需要响应式代理。',
      '反例：const { courses } = store 会得到一次性快照，后续变更不再触发重渲染。',
      'Setup Store 可直接复用现有组合式函数，逻辑组织更接近组件，推荐新代码使用。',
      'store id 在应用内唯一，重复调用 useLearningStore() 返回同一个实例。',
    ],
    problem: '解决"如何用组合式 API 组织 Pinia Store，并在组件里解构时保留响应性"的问题。',
  },
{
    id: 'K_32',
    title: 'Vuex 到 Pinia 迁移指南',
    navTitle: 'Vuex 迁移',
    category: 'Pinia 进阶',
    path: '/vue/k-32/vuex-migration',
    summary: '对比 Vuex 模块与 Pinia Store 的模式差异，制定可回滚的渐进迁移策略。',
    demo: null,
    demoComponent: K32VuexMigration,
    code: K32Code,
    language: 'vue',
    principle:
      'Vuex 把改动拆成 state、mutations（同步）、actions（可异步）、getters，并用 modules + namespaced 组织大项目；Pinia 去掉 mutations，直接用 action 修改 state，用多个独立 store 替代嵌套模块，store id 天然提供命名隔离，TypeScript 推导也更完整。迁移的核心不是重写，而是做 API 映射后按模块逐个切换。',
    flow: [
      '把每个 Vuex module 映射为一个独立 Pinia store，store 之间通过 useXxxStore 互相引用。',
      '将 mutations 里的同步改动并入对应 action，把 getters 改写为 store 的 computed getter。',
      '从最独立、依赖最少的模块开始逐个迁移；迁移期间 Vuex 与 Pinia 可并存，用开关控制同一状态的读写路径。',
      '全部迁移完成后移除 Vuex 相关代码与依赖，收敛到单一状态层。',
    ],
    notes: [
      'Pinia 没有 mutations，所有状态修改都应在 action 中完成，同步修改也不例外。',
      '命名空间由 store id 承担；Vuex 里的 namespaced: true 和模块内引用在 Pinia 中不再需要。',
      '迁移期间新旧可并行运行，但要避免同一状态被 Vuex 和 Pinia 两边同时写入。',
      '危险改动应分小步提交并通过测试验证，保证任何一步都能安全回滚。',
    ],
    problem: '解决"存量 Vuex 项目如何以低风险方式逐步切换到 Pinia"的问题。',
  },
{
    id: 'K_33', title: 'Pinia 插件：统一扩展所有 Store', navTitle: 'Pinia 插件', category: 'Pinia 进阶',
    path: '/vue/k-33/pinia-plugin',
    summary: '用登录日志和错误追踪场景展示如何编写 Pinia 插件，统一拦截 actions 和状态变化。',
    demo: null,
    demoComponent: K33PiniaPlugin, code: K33Code, language: 'vue',
    principle:
      'Pinia 插件通过 pinia.use() 注册，它是一个接收 context 的函数，context 中包含 pinia、app、store 与 options。插件会在每一个 store 创建时执行一次，因此可以在其中针对该 store 调用 $subscribe 观察状态变化、调用 $onAction 拦截 action 的调用，从而为所有 store 统一注入持久化、日志、错误上报等横切关注点。',
    flow: [
      '编写插件函数，参数是从插件上下文里解构出的 pinia 实例与当前 store。',
      '在函数内调用 store.$subscribe 监听状态变化，用 store.$onAction 包裹 action 的 before、after 与 onError。',
      '在入口处用 pinia.use(plugin) 注册插件，之后创建的所有 store 都会套用同一套增强逻辑。',
      '新建一个 store，验证插件注入的日志或持久化行为自动生效。',
    ],
    notes: [
      '插件在 store 创建时对每个 store 执行一次，可据此为 store 新增自定义属性或方法。',
      '$onAction 的 after 回调能拿到 action 的返回值（含异步结果），适合做结果日志或错误处理。',
      '持久化插件常结合 $subscribe 监听变更并写入 localStorage；SSR 场景要区分服务端与客户端，水合后再回填本地状态。',
      '插件中可通过 options 读取每个 store 的配置，实现按 store 开关能力。',
    ],
    problem: '解决"如何为多个 store 统一添加日志、持久化、错误处理等横切关注点"的问题。',
  },
{
    id: 'K_34', title: 'Pinia Getters 与派生状态', navTitle: 'Pinia Getters', category: 'Pinia 进阶',
    path: '/vue/k-34/pinia-getters', summary: '理解 Pinia Getter 的计算属性本质，掌握派生状态的定义和缓存机制。',
    demo: null,
    demoComponent: K34PiniaGetters, code: K34Code, language: 'vue',
    principle: 'Pinia Getter 本质是计算属性：Setup Store 中用 computed 定义，自动缓存结果，只有依赖的状态变化时才重新计算，适合表达由状态派生出的统计、筛选、分组和金额等结果。Getter 还可以引用其他 Getter 组成派生链，但要保持为无副作用的纯计算。',
    flow: ['在 Setup Store 中用 computed 定义派生结果，例如商品总数、均价、低库存和购物车合计。', '组件通过 storeToRefs 解构或直接 store.getterName 读取，Vue 自动追踪依赖并按需缓存。', 'Getter 之间可互相引用形成派生链，例如购物车合计依赖购物车明细的再计算。', '需要按参数取值时让 Getter 返回一个函数（如按分类取列表），但这样会失去缓存。'],
    notes: ['Getter 有缓存，依赖未变化时多次读取不会重复计算，适合高频访问的派生数据。', 'Getter 应是纯函数，不要在内部发起请求或修改状态，否则破坏可预测性与缓存语义。', '返回函数的 Getter 可以接收参数，但每次访问都会重新执行，应按调用频率权衡是否使用。', 'Getter 依赖的状态变化时会自动失效重算，无需手动清除缓存。'],
    problem: '解决"如何从 store 状态派生出复杂计算结果并自动缓存更新"的问题。',
  },
{
    id: 'K_35', title: 'Pinia Actions 与异步操作', navTitle: 'Pinia Actions', category: 'Pinia 进阶',
    path: '/vue/k-35/pinia-actions', summary: '掌握 Pinia 中修改状态的主要方式，理解同步异步 action 与 $onAction 拦截。',
    demo: null,
    demoComponent: K35PiniaActions, code: K35Code, language: 'vue',
    principle: 'Action 是 Pinia 中修改状态的入口（相比 Vuex 移除了 mutations，直接改 state）。它支持同步与异步，可以用 async/await 完成请求与状态流转，加载态、失败处理也收进 action，把数据的读取与变更集中到一处。$onAction 可在 action 调用前后与出错时挂接钩子，用于日志、埋点与监控。',
    flow: ['在 store 中定义普通函数作为 action，通过赋值直接修改 state。', '异步 action 使用 async/await，在内部维护 loading 并用 finally 关闭，返回 Promise 供调用方 await。', 'action 之间可以相互调用和组合，把下单、备餐、配送、完成等步骤串成完整流程。', '组件只表达用户意图（如提交订单），由 action 负责实际的数据操作与状态更新。'],
    notes: ['相比 Vuex，Pinia 没有 mutations，同步与异步的状态修改都统一写入 action。', '$onAction 提供 before、after 与 onError 钩子，可拦截调用、读取返回值并上报异常。', '复杂业务流程拆成多个小 action 组合复用，避免单个 action 逻辑臃肿、难以测试。', '异步 action 要处理好 loading 与竞态，避免旧请求返回覆盖新状态。'],
    problem: '解决"状态修改逻辑分散、异步操作难以追踪，且流程难以复用与测试"的问题。',
  },
{
    id: 'K_36', title: 'Pinia DevTools 与时间旅行调试', navTitle: 'Pinia DevTools', category: 'Pinia 进阶',
    path: '/vue/k-36/pinia-devtools', summary: '使用 Vue DevTools 查看 Pinia 状态、提交历史和时间旅行调试。',
    demo: null,
    demoComponent: K36PiniaDevtools, code: K36Code, language: 'vue',
    principle: 'Pinia 与 Vue DevTools 深度集成，可以查看每个 store 的当前状态、action 调用记录，并基于快照做时间旅行回溯，从而定位状态在哪个 action 被改坏。其底层的"快照 + 回放"原理可以用 $subscribe 捕获变更生成快照、用 $patch 回放快照来模拟，本课 demo 正是用这两个 API 手工实现了 DevTools 的时间旅行与状态检查。',
    flow: ['通过 $subscribe 监听状态变更并保存快照，得到一份可按时间索引的历史记录。', '组件触发 addNote、setMood 等 action 时，变更被采样进时间线。', '在时间线上选择某个历史位置，用 store.$patch(快照) 回放状态，实现撤销与恢复。', '开发时结合 import.meta.hot 与 acceptHMRUpdate，修改 Store 代码不丢失现场状态。'],
    notes: ['真实调试依赖浏览器里的 Vue DevTools，可在 Pinia 面板直接查看各 store 状态与提交历史。', '时间旅行本质是"快照 + 回放"，可在业务里用 $subscribe 与 $patch 实现撤销/重做。', 'action 命名要表达业务意图，命名清晰的 action 在 DevTools 里更容易定位问题来源。', 'DevTools 主要服务开发调试阶段，生产环境的异常排查靠日志与监控接入。'],
    problem: '解决"状态变化难以追踪、bug 复现十分困难、调试效率明显低下"的问题。',
  },
{
    id: 'K_37', title: 'Pinia Store 单元测试', navTitle: 'Pinia 测试', category: 'Pinia 进阶',
    path: '/vue/k-37/pinia-testing', summary: '学习如何为 Pinia Store 编写单元测试，使用独立 Pinia 实例避免状态污染。',
    demo: null,
    demoComponent: K37PiniaTesting, code: K37Code, language: 'vue',
    principle: 'Pinia Store 很容易单元测试：先用 setActivePinia(createPinia()) 创建并激活一个独立的 Pinia 实例，再调用 useXxxStore 得到普通 store 对象，之后直接调用 action、读取 state 与 getter 并断言。由于每个用例重建实例，测试间状态互不污染，也没有框架层 mock 的负担。',
    flow: ['每个测试里用 setActivePinia(createPinia()) 创建全新的 Pinia 实例。', '调用 useTaskStore() 获取 store，先还原到初始状态保证用例独立。', '直接调用 addTask、toggleTask 等 action，随后断言 tasks、completedCount 等状态与 getter。', '对异步 action 先 await 完成再断言，确保状态已到位再校验结果。'],
    notes: ['action 与 getter 承载纯业务规则，应优先补单测；低价值快照测试要控制数量。', 'Setup Store 没有内建的 $reset 还原初始状态，需自行实现重置或在每个用例重建实例。', '异步 action 用 vi.mock 模拟 API，并 await 返回值避免竞态导致断言不稳定。', '断言应写业务结果而非内部实现，Store 重构后用例仍能复用。'],
    problem: '解决"状态管理逻辑难以单元测试、不同用例间的状态仍会互相污染数据"的问题。',
  },
{
    id: 'K_38',
    title: 'defineModel：组件 v-model 的现代化写法',
    navTitle: 'defineModel',
    category: '组件进阶',
    path: '/vue/k-38/define-model',
    summary: '用课程提醒设置对比 defineModel 宏与手写 props/emits，展示 Vue 3.4 起组件级 v-model 的简化写法。',
    demo: null,
    demoComponent: K38DefineModel,
    code: K38Code,
    language: 'vue',
    principle:
      'defineModel 是 Vue 3.4 起提供的编译器宏，把「modelValue prop + update:modelValue 事件」这套样板代码收敛成一行声明。defineModel() 返回一个可读写的 ref，内部赋值既更新本地状态又自动触发 update 事件；命名 model（defineModel(\'frequency\')）对应 v-model:frequency，解构第二个返回值还能读取修饰符。',
    flow: [
      '父组件用 v-model:enabled、v-model:frequency、v-model:label.trim 绑定子组件。',
      '子组件用 defineModel 声明同名模型，无需手写 props 和 emits。',
      '用户交互时直接给返回的 ref 赋值，Vue 自动向父组件派发 update 事件。',
      '对带修饰符的字段，从解构出的修饰符对象读取 trim 决定是否清洗输入。',
    ],
    notes: [
      'defineModel 仅在 <script setup> 中可用，且 Vue 版本需为 3.4 及以上。',
      '一个组件可声明多个 defineModel，命名须与 v-model:xxx 后缀保持一致。',
      '需要默认值、必填或本地 transform 时，通过第二个参数 options 配置。',
      '旧的 modelValue + emit 写法仍被支持，但新代码优先用 defineModel 减少样板。',
    ],
    problem: '解决"自定义组件要支持 v-model 却需手写一堆 prop 与事件样板"的问题。',
  }
]
