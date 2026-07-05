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

const R01ComponentProps = createDemo('R01ComponentProps')
const R01Code = createCodeLoader('react-jsx/R01ComponentProps.jsx')
const R02StateUpdates = createDemo('R02StateUpdates')
const R02Code = createCodeLoader('react-jsx/R02StateUpdates.jsx')
const R03ListsKeys = createDemo('R03ListsKeys')
const R03Code = createCodeLoader('react-jsx/R03ListsKeys.jsx')
const R04ControlledForm = createDemo('R04ControlledForm')
const R04Code = createCodeLoader('react-jsx/R04ControlledForm.jsx')
const R05EffectSync = createDemo('R05EffectSync')
const R05Code = createCodeLoader('react-jsx/R05EffectSync.jsx')
const R06Reducer = createDemo('R06Reducer')
const R06Code = createCodeLoader('react-jsx/R06Reducer.jsx')
const R07Context = createDemo('R07Context')
const R07Code = createCodeLoader('react-jsx/R07Context.jsx')
const R08CustomHook = createDemo('R08CustomHook')
const R08Code = createCodeLoader('react-jsx/R08CustomHook.jsx')
const R09RefDom = createDemo('R09RefDom')
const R09Code = createCodeLoader('react-jsx/R09RefDom.jsx')
const R10Memoization = createDemo('R10Memoization')
const R10Code = createCodeLoader('react-jsx/R10Memoization.jsx')
const R11DeferredValue = createDemo('R11DeferredValue')
const R11Code = createCodeLoader('react-jsx/R11DeferredValue.jsx')
const R12ExternalStore = createDemo('R12ExternalStore')
const R12Code = createCodeLoader('react-jsx/R12ExternalStore.jsx')
const R13Portal = createDemo('R13Portal')
const R13Code = createCodeLoader('react-jsx/R13Portal.jsx')
const R14LazySuspense = createDemo('R14LazySuspense')
const R14Code = createCodeLoader('react-jsx/R14LazySuspense.jsx')
const R15ErrorBoundary = createDemo('R15ErrorBoundary')
const R15Code = createCodeLoader('react-jsx/R15ErrorBoundary.jsx')
const R16AccessibleId = createDemo('R16AccessibleId')
const R16Code = createCodeLoader('react-jsx/R16AccessibleId.jsx')
const R17EventHandler = createDemo('R17EventHandler')
const R17Code = createCodeLoader('react-jsx/R17EventHandler.jsx')
const R18ConditionalRender = createDemo('R18ConditionalRender')
const R18Code = createCodeLoader('react-jsx/R18ConditionalRender.jsx')
const R19Composition = createDemo('R19Composition')
const R19Code = createCodeLoader('react-jsx/R19Composition.jsx')
const R20Transition = createDemo('R20Transition')
const R20Code = createCodeLoader('react-jsx/R20Transition.jsx')
const R21ImperativeHandle = createDemo('R21ImperativeHandle')
const R21Code = createCodeLoader('react-jsx/R21ImperativeHandle.jsx')
const R22ForwardRef = createDemo('R22ForwardRef')
const R22Code = createCodeLoader('react-jsx/R22ForwardRef.jsx')
const R23StrictMode = createDemo('R23StrictMode')
const R23Code = createCodeLoader('react-jsx/R23StrictMode.jsx')
const R24EffectLifecycle = createDemo('R24EffectLifecycle')
const R24Code = createCodeLoader('react-jsx/R24EffectLifecycle.jsx')


export const lessons: Lesson[] = [
{
    id: 'R_1',
    title: 'createRoot、函数组件与 Props',
    navTitle: '组件与 Props',
    category: '组件基础',
    path: '/react/r-1/component-props',
    summary: '用课程卡片理解 React 根节点挂载、函数组件组合、单向数据流和只读 Props。',
    demo: R01ComponentProps,
    code: R01Code,
    language: 'jsx',
    principle:
      'React 组件是返回界面描述的 JavaScript 函数。createRoot 为指定 DOM 容器创建 React 根节点，render 再把组件树交给 React 管理。父组件通过 Props 向子组件传值，子组件应把 Props 视为只读输入；需要变化的数据应提升为状态，而不是直接修改 Props。',
    flow: [
      '使用 createRoot 获取页面中的根容器，并渲染 App 根组件。',
      'App 保存课程数据，通过 map 组合多个 CourseCard。',
      'CourseCard 根据 Props 生成界面，同一组件可用于不同课程数据。',
    ],
    notes: [
      '组件名称必须以大写字母开头，否则 React 会把它当作原生 HTML 标签。',
      'Props 是组件调用时的输入快照，不要在子组件中直接修改。',
      '展示代码使用常规 JSX 语法；运行环境通过浏览器 ES Module 直接加载，由 iframe 沙箱执行。',
    ],
    problem: '解决"React 应用如何挂载，以及如何用组件和 Props 拆分可复用界面"的问题。',
  },
{
    id: 'R_2',
    title: 'useState 与对象、数组的不可变更新',
    navTitle: '状态更新',
    category: '状态管理',
    path: '/react/r-2/state-updates',
    summary: '用购物车数量调整演示 useState、函数式更新和数组对象的不可变替换。',
    demo: R02StateUpdates,
    code: R02Code,
    language: 'jsx',
    principle:
      'useState 为组件保存跨渲染的状态快照。调用 setter 会请求下一次渲染，而不会立即改写当前变量。对象和数组状态应创建新引用；React 使用 Object.is 比较新旧状态，原地修改既破坏状态快照，也可能让更新被跳过。',
    flow: [
      'useState 保存购物车数组，并在每次渲染中计算总价。',
      '点击加减按钮后使用函数式 setter，确保基于最新状态计算。',
      'map 只替换目标商品对象，其余对象保持原引用。',
    ],
    notes: [
      '下一状态依赖上一状态时优先使用 setState(current => next) 形式。',
      '不要使用 push、splice 或直接修改 item.count 更新 React 状态。',
      '总价可由购物车直接推导，不需要额外 state 或 Effect。',
    ],
    problem: '解决"复杂状态如何可靠更新，并保持 React 状态快照和渲染一致"的问题。',
  },
{
    id: 'R_3',
    title: '条件列表、稳定 Key 与派生数据',
    navTitle: '列表与 Key',
    category: '渲染模式',
    path: '/react/r-3/lists-keys',
    summary: '用课程检索展示列表映射、稳定 Key，以及在渲染阶段计算筛选结果。',
    demo: R03ListsKeys,
    code: R03Code,
    language: 'jsx',
    principle:
      'React 使用 key 区分同级列表项在多次渲染间的身份。稳定的业务 ID 能帮助 React 正确复用节点并保留对应状态；数组索引在插入、删除或排序时会改变身份。能从 Props 或 State 得到的数据应在渲染阶段直接计算，避免冗余状态。',
    flow: [
      '输入框更新唯一的 keyword 状态。',
      '组件每次渲染时根据 keyword 过滤课程数组。',
      'map 使用课程 ID 作为 key，生成当前可见的课程卡片。',
    ],
    notes: [
      'key 只需在当前同级列表内唯一，不会作为普通 Props 自动传给组件。',
      '列表会重排时不要使用数组索引作为 key。',
      '筛选结果不是独立事实，不应通过 Effect 再同步到另一份 state。',
    ],
    problem: '解决"动态列表如何保持项目身份，以及如何避免派生状态不同步"的问题。',
  },
{
    id: 'R_4',
    title: '受控表单、统一字段更新与提交校验',
    navTitle: '受控表单',
    category: '用户输入',
    path: '/react/r-4/controlled-form',
    summary: '用训练营报名表展示 value、onChange、表单提交和即时校验。',
    demo: R04ControlledForm,
    code: R04Code,
    language: 'jsx',
    principle:
      '受控表单由 React State 作为输入值的唯一来源。value 决定界面显示内容，onChange 把用户输入写回 State，提交处理器通过 preventDefault 接管浏览器默认提交。表单对象更新时应保留未变化字段。',
    flow: [
      '使用一个对象状态保存姓名和学习方向。',
      '统一的 change 处理器根据 input 的 name 更新对应字段。',
      '提交前阻止默认刷新并校验数据，通过后生成提交反馈。',
    ],
    notes: [
      '受控输入的 value 不应在 undefined 和字符串之间切换。',
      '即时可推导的校验结果可以直接在渲染中计算。',
      '提交按钮禁用只改善交互，提交处理器仍需执行最终校验。',
    ],
    problem: '解决"React 如何统一管理输入值、校验状态和表单提交"的问题。',
  },
{
    id: 'R_5',
    title: 'useEffect：与外部系统同步和清理订阅',
    navTitle: 'Effect 同步',
    category: '副作用',
    path: '/react/r-5/effect-sync',
    summary: '用跨时区时钟说明 Effect 的适用边界、依赖数组与清理函数。',
    demo: R05EffectSync,
    code: R05Code,
    language: 'jsx',
    principle:
      'Effect 用于让组件与 React 之外的系统同步，例如定时器、浏览器事件、网络连接或第三方组件。React 在提交界面后运行 Effect，并在重新运行或卸载前调用清理函数。纯粹的数据转换不属于 Effect，应留在渲染阶段。',
    flow: [
      '组件挂载后创建 setInterval，定期更新当前时间。',
      'Effect 返回清理函数，在组件卸载时取消计时器。',
      '选择时区只改变格式化参数，不需要重新创建计时器。',
    ],
    notes: [
      'Effect 依赖必须包含其中读取的响应式值，不能靠遗漏依赖控制执行次数。',
      '开发环境 Strict Mode 可能额外执行一次 setup 和 cleanup，用于暴露清理缺陷。',
      '筛选、排序、格式化等纯计算通常不需要 Effect。',
    ],
    problem: '解决"何时应使用 Effect，以及如何避免订阅泄漏和重复同步"的问题。',
  },
{
    id: 'R_6',
    title: 'useReducer：集中管理复杂状态转换',
    navTitle: 'Reducer',
    category: '状态管理',
    path: '/react/r-6/reducer',
    summary: '用成员入组流程展示 reducer、action 和可预测的状态转换。',
    demo: R06Reducer,
    code: R06Code,
    language: 'jsx',
    principle:
      'useReducer 把状态转换从事件处理器集中到纯 reducer 函数。事件通过 dispatch 描述发生了什么，reducer 根据当前状态和 action 返回下一状态。它适合字段关联较多、更新路径复杂或需要审计状态变化的场景。',
    flow: [
      '定义初始状态和 reducer 支持的 action 类型。',
      '用户操作只 dispatch 语义明确的 action。',
      'reducer 返回新状态，组件根据状态渲染当前流程。',
    ],
    notes: [
      'reducer 必须保持纯函数，不要在其中请求接口或修改外部变量。',
      '未知 action 主动抛错有助于尽早发现调用错误。',
      '简单独立值优先 useState，不必为所有状态引入 reducer。',
    ],
    problem: '解决"多个事件共同修改关联状态时，更新逻辑分散且难以追踪"的问题。',
  },
{
    id: 'R_7',
    title: 'Context：跨层共享与 Provider 边界',
    navTitle: 'Context',
    category: '组件通信',
    path: '/react/r-7/context',
    summary: '用工作台主题演示 createContext、Provider 和深层组件订阅。',
    demo: R07Context,
    code: R07Code,
    language: 'jsx',
    principle:
      'Context 让组件读取上层最近 Provider 提供的值，适合主题、当前用户、地区等树级共享信息。Context 值变化时，读取该 Context 的组件会重新渲染。它解决跨层传递问题，但不替代正常的 Props 组合和局部状态。',
    flow: [
      'createContext 定义共享通道和无 Provider 时的默认值。',
      '上层组件用 Provider 提供当前主题和切换函数。',
      '深层组件通过 useContext 读取并订阅最近的 Provider。',
    ],
    notes: [
      '没有合理默认值时可使用 null，并在自定义读取函数中校验 Provider。',
      'Provider value 每次创建新对象会触发消费者更新，性能敏感时需评估对象稳定性。',
      '只在 Props 需要穿过很多不关心它的中间层时考虑 Context。',
    ],
    problem: '解决"共享数据需要跨越多层组件传递，产生 Props 逐层透传"的问题。',
  },
{
    id: 'R_8',
    title: '自定义 Hook：复用有状态逻辑',
    navTitle: '自定义 Hook',
    category: '逻辑复用',
    path: '/react/r-8/custom-hook',
    summary: '用在线状态订阅展示自定义 Hook 的命名、组合与独立状态。',
    demo: R08CustomHook,
    code: R08Code,
    language: 'jsx',
    principle:
      '自定义 Hook 是以 use 开头、可调用其他 Hook 的函数，用于复用状态逻辑而不是共享同一份状态。每次调用都有独立的 State 与 Effect；当多个调用订阅同一外部来源时，它们会得到一致结果，但生命周期仍由各自组件管理。',
    flow: [
      'useOnlineStatus 初始化浏览器当前在线状态。',
      'Effect 订阅 online 和 offline 事件，并在卸载时清理。',
      '状态徽标和保存按钮分别调用 Hook，复用同一套同步逻辑。',
    ],
    notes: [
      '自定义 Hook 名称必须以 use 开头，才能应用 Hooks 规则和 lint 检查。',
      'Hook 只能在 React 组件或其他 Hook 顶层调用，不能放在条件分支和循环中。',
      '复用 Hook 逻辑不等于共享状态；共享状态应提升或使用外部状态源。',
    ],
    problem: '解决"多个组件需要相同的状态订阅和清理逻辑，如何避免重复实现"的问题。',
  },
{
    id: 'R_9',
    title: 'useRef：DOM 引用与非渲染数据',
    navTitle: 'Ref 与 DOM',
    category: '命令式协作',
    path: '/react/r-9/ref-dom',
    summary: '用课程检索演示 useRef 如何聚焦输入框，并保存不需要触发渲染的会话计数。',
    demo: R09RefDom,
    code: R09Code,
    language: 'jsx',
    principle:
      'useRef 在多次渲染间返回同一个可变对象。把 Ref 传给 DOM 节点后，React 会维护 current 指向对应节点，适合聚焦、滚动和媒体控制等命令式操作。修改 current 不会触发重新渲染，因此只应存放不参与界面输出的数据；凡是需要显示并随变化更新的值仍应使用 State。',
    flow: [
      'searchRef 关联搜索输入框，按钮通过 current 调用原生 focus。',
      'submitCountRef 记录会话内检索次数，变化本身不请求渲染。',
      'result State 保存需要显示的反馈，并触发界面更新。',
    ],
    notes: [
      '不要在渲染过程中随意读写 ref.current，初始化除外。',
      'DOM 操作应保持小而明确，不要绕过 React 手动维护 React 已管理的节点结构。',
      '非受控输入可从 Ref 读取当前值，但复杂表单通常仍适合受控状态。',
    ],
    problem: '解决"组件如何操作 DOM，以及如何保存无需驱动渲染的可变数据"的问题。',
  },
{
    id: 'R_10',
    title: 'memo、useMemo 与 useCallback：有依据地减少重复工作',
    navTitle: '记忆化优化',
    category: '性能',
    path: '/react/r-10/memoization',
    summary: '用课程筛选和无关外观更新演示组件、计算结果与回调引用的记忆化边界。',
    demo: R10Memoization,
    code: R10Code,
    language: 'jsx',
    principle:
      'memo 可在 Props 未变化时跳过子组件重新渲染，useMemo 缓存计算结果，useCallback 缓存函数定义。三者都是性能优化而非正确性工具，只有重复渲染确实昂贵、依赖能够保持稳定且性能测量证实存在瓶颈时才值得使用。React Compiler 启用后还能自动完成许多记忆化工作。',
    flow: [
      'useMemo 只在筛选级别改变时重新计算可见课程。',
      'useCallback 保持选择课程函数的引用稳定。',
      'memo 让课程列表在无关外观计数变化时跳过渲染。',
    ],
    notes: [
      '先用 React DevTools Profiler 定位瓶颈，再添加记忆化。',
      '每次新建的对象或函数会让浅比较失效，依赖设计比机械包裹更重要。',
      '组件逻辑若离开记忆化就不正确，应先修复状态和 Effect 设计。',
    ],
    problem: '解决"父组件频繁更新时，如何避免昂贵子树和计算做无意义重复工作"的问题。',
  },
{
    id: 'R_11',
    title: 'useDeferredValue：延后非关键界面更新',
    navTitle: '延迟值',
    category: '并发渲染',
    path: '/react/r-11/deferred-value',
    summary: '用大列表搜索演示输入立即更新，而结果区域以较低优先级追赶最新关键词。',
    demo: R11DeferredValue,
    code: R11Code,
    language: 'jsx',
    principle:
      'useDeferredValue 返回一个可以落后于最新值的版本，让 React 优先提交输入等紧急更新，再在后台尝试渲染较慢的内容。后台渲染可被新的输入中断，因此能改善交互响应；它不会减少网络请求，也不是固定时长的防抖。旧值与新值不一致时可以降低结果区域视觉强调，明确表示内容正在更新。',
    flow: [
      '受控输入同步更新 keyword，保证键入即时可见。',
      'deferredKeyword 在后台追赶 keyword，并驱动结果筛选。',
      '两个值不一致时用 aria-busy 和透明度提示结果暂时陈旧。',
    ],
    notes: [
      '不要把控制文本输入的 State 更新放进 Transition，输入必须同步更新。',
      'useDeferredValue 不会自动阻止请求；请求去重和防抖仍需单独设计。',
      '只有结果渲染明显较慢时才有收益，小列表无需使用。',
    ],
    problem: '解决"昂贵结果区域更新时，如何让文本输入仍保持流畅"的问题。',
  },
{
    id: 'R_12',
    title: 'useSyncExternalStore：一致地订阅外部状态',
    navTitle: '外部 Store',
    category: '状态集成',
    path: '/react/r-12/external-store',
    summary: '用独立计数 Store 演示 subscribe、getSnapshot 和多个消费者的一致更新。',
    demo: R12ExternalStore,
    code: R12Code,
    language: 'jsx',
    principle:
      'useSyncExternalStore 是 React 读取外部可变数据源的标准接口。subscribe 注册变化监听并返回取消函数，getSnapshot 返回当前不可变快照；只要数据没有变化，快照就必须保持 Object.is 相等。React 通过这份契约在并发渲染中获得一致视图，适用于状态库、浏览器 API 和框架级缓存。',
    flow: [
      '外部 Store 在 React 组件之外保存快照和监听器集合。',
      '两个视图通过同一 subscribe 与 getSnapshot 订阅 Store。',
      'Store 替换快照并通知监听器，所有消费者得到一致结果。',
    ],
    notes: [
      'getSnapshot 不应每次都创建新对象，否则会导致无限更新。',
      'subscribe 函数最好定义在组件外，避免每次渲染重新订阅。',
      '服务端渲染时应提供 getServerSnapshot，确保水合初始内容一致。',
    ],
    problem: '解决"React 如何可靠读取自身状态系统之外、会随时间变化的数据"的问题。',
  },
{
    id: 'R_13',
    title: 'createPortal：跨 DOM 层级渲染弹窗',
    navTitle: 'Portal',
    category: 'DOM 协作',
    path: '/react/r-13/portal',
    summary: '用发布确认弹窗演示内容脱离受裁切容器渲染，同时仍属于原 React 组件树。',
    demo: R13Portal,
    code: R13Code,
    language: 'jsx',
    principle:
      'createPortal 可把 React 子节点放到另一个 DOM 容器中，常用于弹窗、浮层和 Tooltip。Portal 只改变 DOM 放置位置，不改变 React 树中的父子关系，因此 Context 仍可读取，事件也按照 React 树冒泡。可访问弹窗还需要 dialog 语义、焦点管理和关闭策略。',
    flow: [
      '触发按钮位于 overflow 容器中，点击后更新 open State。',
      'ConfirmDialog 使用 createPortal 把遮罩和弹窗渲染到 document.body。',
      '点击遮罩或操作按钮关闭弹窗，内部点击阻止遮罩关闭。',
    ],
    notes: [
      'Portal 事件按照 React 树而非 DOM 树冒泡，外层事件处理器仍可能收到事件。',
      '生产弹窗应补充焦点陷阱、Escape 关闭和关闭后的焦点恢复。',
      '目标 DOM 节点必须已经存在，改变目标节点会重新创建 Portal 内容。',
    ],
    problem: '解决"弹窗如何逃离 overflow、层叠上下文等 DOM 布局限制"的问题。',
  },
{
    id: 'R_14',
    title: 'lazy 与 Suspense：按需加载组件代码',
    navTitle: '懒加载',
    category: '加载体验',
    path: '/react/r-14/lazy-suspense',
    summary: '用延迟出现的学习报告演示 lazy 组件首次渲染时挂起，以及 Suspense 后备界面。',
    demo: R14LazySuspense,
    code: R14Code,
    language: 'jsx',
    principle:
      'lazy 延迟调用加载函数，直到组件第一次需要渲染；加载函数及其解析结果会被 React 缓存。组件等待代码时会挂起，最近的 Suspense 边界显示 fallback，加载完成后再切换到真实内容。实际工程通常把 lazy 与动态 import 配合，让构建工具生成独立代码块。',
    flow: [
      '初始页面不渲染报告组件，因此加载函数尚未运行。',
      '点击查看报告后首次渲染 Lazy 组件，Suspense 立即显示后备状态。',
      'Promise 解析为 default 组件后，React 用真实报告替换 fallback。',
    ],
    notes: [
      'lazy 声明应放在组件外，避免每次渲染重建组件并重置状态。',
      'Suspense 不会捕获 Effect 或普通事件处理器中的数据请求。',
      '加载 Promise 拒绝时，错误会交给最近的错误边界。',
    ],
    problem: '解决"不常用的大型功能如何延后加载，并在等待期间提供稳定反馈"的问题。',
  },
{
    id: 'R_15',
    title: 'Error Boundary：隔离渲染错误并提供降级界面',
    navTitle: '错误边界',
    category: '容错',
    path: '/react/r-15/error-boundary',
    summary: '用故障课程卡片演示错误边界如何保护页面其他区域并显示可恢复的后备内容。',
    demo: R15ErrorBoundary,
    code: R15Code,
    language: 'jsx',
    principle:
      '错误边界捕获其子树在渲染、生命周期和构造过程中抛出的错误。static getDerivedStateFromError 用于切换后备界面，componentDidCatch 适合记录错误信息。React 目前仍需要类组件实现错误边界；边界不能捕获自身错误、普通事件处理器错误、服务端渲染错误和大多数异步回调错误。',
    flow: [
      '模拟按钮让课程卡片在下一次渲染中抛出错误。',
      '错误边界捕获子树错误并渲染局部降级内容。',
      '重试按钮清除边界失败状态，使子树再次尝试渲染。',
    ],
    notes: [
      '错误边界应按功能区域布置，既避免整页崩溃，也不要细碎到难以维护。',
      'componentDidCatch 中可接入监控服务，但不要记录敏感用户数据。',
      '事件处理器应使用正常的 try/catch 和错误状态，而不是依赖错误边界。',
    ],
    problem: '解决"局部组件渲染失败时，如何避免整个 React 根节点失去界面"的问题。',
  },
{
    id: 'R_16',
    title: 'useId：稳定连接标签与可访问性说明',
    navTitle: '可访问 ID',
    category: '可访问性',
    path: '/react/r-16/accessible-id',
    summary: '用动态课程字段演示 useId 为 label、input 和辅助说明生成稳定且唯一的关联标识。',
    demo: R16AccessibleId,
    code: R16Code,
    language: 'jsx',
    principle:
      'useId 为组件实例生成稳定且唯一的 ID，适合连接 label 与表单控件、aria-describedby 与说明内容，并兼容服务端渲染和水合。它不是列表 Key 的来源；列表 Key 应来自数据本身，因为 Key 表示业务项目身份，而 useId 表示当前组件树中的可访问性关联。',
    flow: [
      '每个 CourseField 调用 useId 获得自己的稳定前缀。',
      'label 的 htmlFor 与 input 的 id 建立可点击标签关系。',
      'aria-describedby 连接输入框和辅助说明，新增字段也不会冲突。',
    ],
    notes: [
      '不要用 useId 生成列表 Key，Key 应来自数据库 ID 等稳定业务数据。',
      '同一组件需要多个关联 ID 时，可基于一个 useId 返回值添加后缀。',
      '应用存在多个 React 根节点时可配置 identifierPrefix 避免跨根冲突。',
    ],
    problem: '解决"可复用表单组件如何生成唯一、稳定且适合水合的关联 ID"的问题。',
  },
{
    id: 'R_17',
    title: '事件处理：合成事件与处理器模式',
    navTitle: '事件处理',
    category: '用户交互',
    path: '/react/r-17/event-handler',
    summary: '用课程搜索和表单提交演示合成事件对象、preventDefault 和事件处理器设计。',
    demo: R17EventHandler,
    code: R17Code,
    language: 'jsx',
    principle:
      'React 使用合成事件系统统一浏览器原生事件接口。事件处理器接收合成事件对象，它拥有与原生事件相同的接口，但由 React 事件委托机制在根节点统一管理。表单提交等场景需要调用 preventDefault 阻止浏览器默认行为；事件处理器可以直接引用闭包变量，无需额外绑定。',
    flow: [
      '点击和输入事件通过 React 合成事件对象获取类型和目标信息。',
      '表单提交使用 preventDefault 阻止浏览器刷新，由 React 状态驱动界面。',
      '键盘事件可通过 event.key 过滤特定按键，如 Enter 触发搜索。',
    ],
    notes: [
      'React 事件采用事件委托，所有监听器挂在根节点而非 DOM 元素本身。',
      '合成事件对象在回调结束后会被回收复用，异步访问属性需先调用 persist 或提前提取值。',
      '事件处理器应保持简洁，复杂逻辑可拆分为独立函数。',
    ],
    problem: '解决"React 如何统一处理浏览器事件，以及何时需要阻止默认行为"的问题。',
  },
{
    id: 'R_18',
    title: '条件渲染：逻辑与、三元表达式与提前返回',
    navTitle: '条件渲染',
    category: '渲染模式',
    path: '/react/r-18/conditional-render',
    summary: '用课程列表与详情切换演示 &&、三元运算符和提前返回三种条件渲染方式。',
    demo: R18ConditionalRender,
    code: R18Code,
    language: 'jsx',
    principle:
      'React 没有模板指令，条件渲染完全依赖 JavaScript 表达式。逻辑与 (&&) 适合"有则显示、无则不渲染"的场景；三元运算符适合二选一；提前返回适合分支后剩余逻辑较多时简化嵌套。选择哪种方式取决于可读性和具体场景，不需要固定规则。',
    flow: [
      '折扣区域用 && 控制显示隐藏，showDiscount 为 false 时不渲染。',
      '课程列表与详情用三元运算符切换，选择课程后展示详情。',
      'CourseDetail 内部使用提前返回，未传入课程时直接返回 null。',
    ],
    notes: [
      '&& 左侧为 0 时会渲染数字 0，应使用三元运算符或显式布尔转换。',
      '不要在条件渲染中使用 if/else 语句，它们不是表达式，无法嵌入 JSX。',
      '条件分支过多时考虑拆分为独立子组件，保持每个组件职责单一。',
    ],
    problem: '解决"React 没有模板指令，如何用 JavaScript 表达式实现条件渲染"的问题。',
  },
{
    id: 'R_19',
    title: '组件组合：children 与 render props 模式',
    navTitle: '组件组合',
    category: '组件设计',
    path: '/react/r-19/composition',
    summary: '用课程卡片和统计面板演示 children 插槽和 render props 两种组合方式。',
    demo: R19Composition,
    code: R19Code,
    language: 'jsx',
    principle:
      '组件组合优先于继承是 React 的核心设计理念。children 是最简单的组合方式，父组件通过 props.children 接收子元素；render props 则让父组件通过函数类型的 prop 决定子组件的渲染内容，适合需要根据父组件状态动态生成子元素的场景。两种模式都能避免深层 Props 透传。',
    flow: [
      'Card 通过 children 接收按钮和文本，父组件控制内容布局。',
      'StatsLayout 通过 renderStats 函数 prop 获取统计项，父组件决定渲染哪些数据。',
      '两种模式都让容器关注布局和结构，内容交由调用方决定。',
    ],
    notes: [
      'children 适合简单的插槽场景，render props 适合需要父组件状态参与渲染的场景。',
      'render props 函数不要在渲染中新建，可能影响子组件 memo 效果。',
      'Hooks 解决了大部分状态逻辑复用需求，render props 的使用频率已降低。',
    ],
    problem: '解决"如何让容器组件灵活接收和动态生成子内容"的问题。',
  },
{
    id: 'R_20',
    title: 'useTransition：标记非紧急状态更新',
    navTitle: '过渡更新',
    category: '并发渲染',
    path: '/react/r-20/transition',
    summary: '用大列表搜索演示 startTransition 将筛选标记为过渡更新，保持输入流畅响应。',
    demo: R20Transition,
    code: R20Code,
    language: 'jsx',
    principle:
      'useTransition 返回一个待决状态和 startTransition 函数。在 startTransition 中包裹的状态更新会被 React 标记为非紧急的过渡更新；如果此时有更紧急的更新（如输入框同步），React 会中断过渡更新优先处理紧急更新。它适用于由用户交互触发但结果渲染较慢的场景。',
    flow: [
      '输入框的值同步更新，保证键入即时可见。',
      '列表筛选在 startTransition 中执行，被标记为可中断的过渡更新。',
      'isPending 在过渡期间为 true，可用于展示加载指示。',
    ],
    notes: [
      '控制文本输入的 setState 不要放在 startTransition 中，输入必须同步更新。',
      'useDeferredValue 是 useTransition 的声明式替代，适合没有明确更新时机的场景。',
      '过渡更新可被中断但不会被丢弃，React 保证最终状态一致。',
    ],
    problem: '解决"用户输入触发昂贵渲染时，如何保持输入流畅"的问题。',
  },
{
    id: 'R_21',
    title: 'useImperativeHandle：限定组件暴露的命令式接口',
    navTitle: '命令式接口',
    category: '命令式协作',
    path: '/react/r-21/imperative-handle',
    summary: '用搜索框演示 useImperativeHandle 限定父组件通过 ref 能调用的方法。',
    demo: R21ImperativeHandle,
    code: R21Code,
    language: 'jsx',
    principle:
      'useImperativeHandle 配合 forwardRef 使用，可以精确控制父组件通过 ref 能访问到的方法。默认情况下 ref 指向 DOM 节点，useImperativeHandle 将 ref 重定向为自定义对象，只暴露必要的命令式操作。这样既保持封装性，又允许父组件在特定场景下调用子组件方法。',
    flow: [
      'SearchInput 使用 forwardRef 接收来自父组件的 ref。',
      'useImperativeHandle 定义 focus、clear 和 getValue 三个方法。',
      '父组件通过 searchRef.current.focus() 等方式调用，无法直接操作内部 DOM。',
    ],
    notes: [
      'useImperativeHandle 的第二个参数工厂函数应返回稳定对象，避免不必要更新。',
      '命令式操作应作为最后手段，优先用声明式 Props 和 State 驱动界面。',
      '与 forwardRef 搭配时，TypeScript 中需要定义 Ref 接口类型。',
    ],
    problem: '解决"父组件如何调用子组件方法，同时不暴露内部实现细节"的问题。',
  },
{
    id: 'R_22',
    title: 'forwardRef：跨组件传递 Ref',
    navTitle: '转发 Ref',
    category: '命令式协作',
    path: '/react/r-22/forward-ref',
    summary: '用报名表单演示 forwardRef 让自定义输入组件将 ref 转发给内部 DOM 节点。',
    demo: R22ForwardRef,
    code: R22Code,
    language: 'jsx',
    principle:
      'forwardRef 让组件能够将接收到的 ref 转发给子节点。默认情况下函数组件无法接收 ref 属性，因为 ref 不是普通 prop。forwardRef 包裹组件后，第二个参数接收 ref 并可传递给内部元素。它适用于需要聚焦、测量或与第三方库集成等必须直接操作 DOM 的场景。',
    flow: [
      'TextInput 使用 forwardRef 将 ref 转发给内部 input 元素。',
      '父组件通过 nameRef 和 emailRef 分别引用两个输入框。',
      '提交时通过 ref.current 获取值，重置时直接操作 DOM。',
    ],
    notes: [
      'ref 转发链可以多层传递，但中间组件也需要使用 forwardRef。',
      '与 useImperativeHandle 搭配时，可自定义 ref 暴露的内容而非整个 DOM 节点。',
      '高阶组件转发 ref 时需注意 displayName 丢失问题。',
    ],
    problem: '解决"自定义组件如何让父组件获取内部 DOM 节点引用"的问题。',
  },
{
    id: 'R_23',
    title: 'StrictMode：开发环境额外检查',
    navTitle: '严格模式',
    category: '开发体验',
    path: '/react/r-23/strict-mode',
    summary: '用 Effect 执行日志演示 StrictMode 双重调用机制如何暴露清理缺失。',
    demo: R23StrictMode,
    code: R23Code,
    language: 'jsx',
    principle:
      'StrictMode 是开发环境的辅助工具，不渲染任何可见界面。它会让组件函数体、useState 初始化函数、useEffect 和 useMemo 等额外执行一次，帮助发现不纯的渲染、缺少清理的 Effect 和过时的 ref 用法。双重调用只在开发环境发生，生产构建不受影响。',
    flow: [
      '包裹在 StrictMode 中的组件的 Effect 会执行两次 setup + cleanup。',
      '对比开启和关闭 StrictMode 时 Effect 日志的差异。',
      '清理函数缺失或不完整的问题会在双重调用中暴露。',
    ],
    notes: [
      'StrictMode 不影响生产构建，只用于开发阶段的早期问题检测。',
      '如果 Effect 出现双重执行，说明 React 正在帮你验证清理函数是否正确。',
      '不要为了消除双重调用而移除 StrictMode，应修复根本问题。',
    ],
    problem: '解决"如何在开发阶段尽早发现不纯渲染和 Effect 清理缺失"的问题。',
  },
{
    id: 'R_24',
    title: 'useEffect 生命周期：挂载、更新与卸载的常见模式',
    navTitle: 'Effect 生命周期',
    category: '副作用',
    path: '/react/r-24/effect-lifecycle',
    summary: '用窗口尺寸、计时器和在线状态演示 Effect 的挂载、依赖更新和清理卸载模式。',
    demo: R24EffectLifecycle,
    code: R24Code,
    language: 'jsx',
    principle:
      'Effect 在组件挂载后执行，依赖数组变化时先执行清理函数再重新执行，卸载时执行最后一次清理。空依赖数组的 Effect 只在挂载和卸载时执行；有依赖的 Effect 在依赖变化时同步外部系统；条件性 Effect 可以提前返回或用条件语句控制。',
    flow: [
      'WindowSize 的 Effect 只在挂载时添加 resize 监听，卸载时移除。',
      'Timer 的 Effect 依赖 running 状态，切换时清理旧定时器再创建新的。',
      'OnlineStatus 的 Effect 在挂载时添加网络状态监听，卸载时移除。',
    ],
    notes: [
      '挂载时执行的 Effect 依赖数组为空，但不能省略数组本身。',
      '清理函数在组件卸载和依赖变化重新执行前都会调用。',
      '多个不相关的副作用应拆分为独立 Effect，而不是合并到一个中。',
    ],
    problem: '解决"Effect 在组件生命周期各阶段如何正确同步外部系统"的问题。',
  }
]
