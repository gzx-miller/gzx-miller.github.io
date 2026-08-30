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
  if (!loader) throw new Error(`未找到内容组件：${name}`)
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
  if (!loader) throw new Error(`未找到内容源码：${path}`)
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
const R25ZustandSelectors = createDemo('S04ZustandSelectors')
const R25Code = createCodeLoader('state-react/S04ZustandSelectors.js')
const R26ZustandMiddleware = createDemo('S05ZustandMiddleware')
const R26Code = createCodeLoader('state-react/S05ZustandMiddleware.js')
const R27JotaiAtoms = createDemo('S06JotaiAtoms')
const R27Code = createCodeLoader('state-react/S06JotaiAtoms.js')
const R28JotaiAsyncAtoms = createDemo('S07JotaiAsyncAtoms')
const R28Code = createCodeLoader('state-react/S07JotaiAsyncAtoms.js')
const R29ReduxToolkit = createDemo('S08ReduxToolkit')
const R29Code = createCodeLoader('state-react/S08ReduxToolkit.js')
const R30XStateMachine = createDemo('S09XStateMachine')
const R30Code = createCodeLoader('state-react/S09XStateMachine.js')
const R31Valtio = createDemo('S12Valtio')
const R32TanStackQuery = createDemo('S13TanStackQuery')
const R33Recoil = createDemo('S22Recoil')
const R34Mobx = createDemo('S23Mobx')
const R35Overmind = createDemo('S24Overmind')


export const lessons: Lesson[] = [
{
    id: 'R_1',
    title: 'createRoot、函数组件与 Props',
    navTitle: '组件与 Props',
    category: '组件基础',
    path: '/react/r-1/component-props',
    summary: '用训练营课程卡片理解 createRoot 挂载、函数组件组合、单向数据流与只读 Props。',
    demo: R01ComponentProps,
    code: R01Code,
    language: 'jsx',
    principle:
      'React 组件是返回界面描述（JSX）的普通函数。createRoot 为页面中的指定 DOM 容器创建 React 根，render 把根组件挂进该容器并接管其后的所有更新。父组件通过 Props 向子组件传值，数据沿组件树单向向下流动；子组件应把 Props 视为只读输入快照，需要变化的数据应提升为 State，而不是就地改写 Props。',
    flow: [
      'createRoot 拿到 #root 容器，render(<App />) 把根组件挂载进页面。',
      'App 用数组保存课程，通过 map 展开为多个 CourseCard。',
      'CourseCard 读取 Props 渲染名称、级别、剩余名额和报名徽章，同一组件复用于不同课程。',
    ],
    notes: [
      '组件名必须以大写字母开头，小写名称会被当作原生 HTML 标签而非组件。',
      'Props 是组件调用时的输入快照，不要在子组件中直接修改。',
      '展示代码用浏览器 ES Module 直接加载 React 19，由 iframe 沙箱执行。',
    ],
    problem: '解决"React 应用如何挂载，以及如何用组件和 Props 拆分可复用界面"的问题。',
  },
{
    id: 'R_2',
    title: 'useState 与对象、数组的不可变更新',
    navTitle: '状态更新',
    category: '状态管理',
    path: '/react/r-2/state-updates',
    summary: '用购物车数量调整演示 useState、函数式更新以及数组、对象的不可变替换。',
    demo: R02StateUpdates,
    code: R02Code,
    language: 'jsx',
    principle:
      'useState 为组件保存跨渲染的状态快照，调用 setter 只表示"请求下一次渲染"，不会立即改写当前变量。对象与数组状态必须用新引用整体替换旧值：React 依赖 Object.is 比较新旧状态，原地修改既破坏状态快照，也可能让更新被 React 跳过。',
    flow: [
      'useState 保存购物车数组，总价在每次渲染时由数组实时推导。',
      '点击加减按钮通过函数式 setter 更新，确保基于最新状态计算。',
      'map 只替换目标商品条目，其余条目保持原引用不动。',
    ],
    notes: [
      '下一状态依赖上一状态时优先写 setState(current => next)。',
      '不要用 push、splice 或直接改 item.count 的方式更新 React 状态。',
      '总价可由购物车推导，不需要额外 state 或 Effect。',
    ],
    problem: '解决"复杂状态如何可靠更新，并保持 React 状态快照和渲染一致"的问题。',
  },
{
    id: 'R_3',
    title: '条件列表、稳定 Key 与派生数据',
    navTitle: '列表与 Key',
    category: '渲染模式',
    path: '/react/r-3/lists-keys',
    summary: '用课程检索展示列表映射、稳定 key，以及在渲染阶段直接计算筛选结果。',
    demo: R03ListsKeys,
    code: R03Code,
    language: 'jsx',
    principle:
      'React 依赖 key 在多次渲染间区分同级列表项的"身份"。稳定的业务 ID（如课程 id）让 React 能正确复用节点并保留各项目的挂载状态；数组索引在插入、删除或重排时会改变身份，容易造成状态错位。能从 Props 或 State 推导出的数据应在渲染阶段直接计算，避免用 Effect 维护一份可能不同步的冗余 State。',
    flow: [
      '输入框把关键词写入唯一的 keyword 状态。',
      '组件每次渲染时用 keyword 过滤课程数组，得到 visibleCourses。',
      'map 以课程 ID 作为 key 渲染当前可见的课程卡片。',
    ],
    notes: [
      'key 只需在当前同级列表内唯一，并不会作为普通 Props 传给组件。',
      '列表顺序会变化时不要用数组索引作为 key，否则节点可能被错误复用。',
      '筛选结果不是独立事实，不应再用 Effect 同步到另一份 State。',
    ],
    problem: '解决"动态列表如何保持项目身份，以及如何避免派生状态不同步"的问题。',
  },
{
    id: 'R_4',
    title: '受控表单、统一字段更新与提交校验',
    navTitle: '受控表单',
    category: '用户输入',
    path: '/react/r-4/controlled-form',
    summary: '用训练营报名表展示受控表单的 value、onChange、统一字段更新与提交校验。',
    demo: R04ControlledForm,
    code: R04Code,
    language: 'jsx',
    principle:
      '受控表单把 React State 作为输入值唯一的事实来源：value 决定界面显示什么，onChange 把用户输入写回 State，提交处理器用 preventDefault 接管浏览器的默认刷新。表单通常用一个对象 State 保存，更新时展开旧值再覆盖目标字段，保留未变化字段。校验结果若能由数据即时推导，就直接在渲染中计算，无需额外 State。',
    flow: [
      '用一个对象 State 保存姓名和学习方向，输入值全部来自它。',
      '统一的 change 处理器根据 input 的 name 用计算属性键更新对应字段。',
      '提交前用 preventDefault 阻止刷新并校验姓名，通过后写入提交反馈。',
    ],
    notes: [
      '受控输入的 value 不要在 undefined 与字符串之间来回切换，避免输入框失去控制。',
      '可即时推导的校验错误可直接在渲染中计算，不必复制到 State。',
      '禁用提交按钮只改善体验，最终校验仍需在提交处理器中执行。',
    ],
    problem: '解决"React 如何统一管理输入值、校验状态和表单提交"的问题。',
  },
{
    id: 'R_5',
    title: 'useEffect：与外部系统同步和清理订阅',
    navTitle: 'Effect 同步',
    category: '副作用',
    path: '/react/r-5/effect-sync',
    summary: '用跨时区时钟说明 useEffect 的适用边界、依赖数组与清理函数。',
    demo: R05EffectSync,
    code: R05Code,
    language: 'jsx',
    principle:
      'useEffect 只用于让组件与 React 之外的系统保持同步，例如定时器、浏览器事件、网络连接或第三方组件。React 在界面提交到 DOM 后运行 Effect，并在重新运行前或组件卸载时调用其返回的清理函数。纯粹基于数据派生界面的计算不属于 Effect，应留在渲染阶段。',
    flow: [
      '组件挂载后 Effect 创建 setInterval，每秒更新 now 状态。',
      'Effect 返回 clearInterval 清理函数，组件卸载时取消计时器。',
      '切换时区只改变格式化参数，格式化在渲染阶段完成，不需要重建计时器。',
    ],
    notes: [
      '依赖数组必须包含 Effect 里读取的响应式值，不要靠"漏写依赖"来控制执行次数。',
      '开发环境 StrictMode 会额外跑一次 setup + cleanup 以暴露清理缺陷。',
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
    summary: '用项目入组流程展示 reducer、action 与可预测的有限状态转换。',
    demo: R06Reducer,
    code: R06Code,
    language: 'jsx',
    principle:
      'useReducer 把"状态如何变化"从事件处理器中抽离，集中到纯 reducer 函数。事件处理器只 dispatch 语义明确的 action；reducer 接收当前状态与该 action，返回下一个状态。当字段彼此关联、多个更新路径交织、或状态变化需要集中审计时，它是比散落多个 useState 更清晰的建模方式。',
    flow: [
      '定义初始状态与 reducer 支持的 next/approve/reset 三种 action。',
      '按钮点击只 dispatch 对应 action，由 reducer 决定状态如何转移。',
      '组件按 state 渲染当前进度：step 决定步骤高亮，approved 控制确认文案。',
    ],
    notes: [
      'reducer 必须保持纯函数，不要在内部请求接口或修改外部变量。',
      '对未知 action 主动抛错，有助于尽早发现调用错误。',
      '彼此独立的简单状态优先用 useState，不必为所有状态引入 reducer。',
    ],
    problem: '解决"多个事件共同修改关联状态时，更新逻辑分散且难以追踪"的问题。',
  },
{
    id: 'R_7',
    title: 'Context：跨层共享与 Provider 边界',
    navTitle: 'Context',
    category: '组件通信',
    path: '/react/r-7/context',
    summary: '用工作台主题演示 createContext、Provider 与深层组件订阅。',
    demo: R07Context,
    code: R07Code,
    language: 'jsx',
    principle:
      'Context 让深层组件直接读取上方最近的 Provider 提供的值，常用于主题、当前用户、地区等树级共享信息。Provider 的 value 变化时，读取该 Context 的组件会重新渲染。它解决逐层透传 Props 的问题，但不替代正常的 Props 组合与局部 State。',
    flow: [
      'createContext(null) 定义共享通道及其无 Provider 时的默认值。',
      'App 在 Provider 中提供当前主题 mode 与切换函数 toggle。',
      '深层组件 ActionPanel 用 useContext 读取最近的 Provider 并据此换肤。',
    ],
    notes: [
      '没有合理默认值时可给出 null，并在自定义读取函数里校验 Provider 是否存在。',
      'Provider 的 value 每次渲染若新建对象会触发所有消费者更新，性能敏感时需保持对象稳定。',
      '只在 Props 需要穿过很多不关心它的中间层时才考虑 Context。',
    ],
    problem: '解决"共享数据需要跨越多层组件传递，产生 Props 逐层透传"的问题。',
  },
{
    id: 'R_8',
    title: '自定义 Hook：复用有状态逻辑',
    navTitle: '自定义 Hook',
    category: '逻辑复用',
    path: '/react/r-8/custom-hook',
    summary: '用浏览器在线状态订阅展示自定义 Hook 的命名、组合与每次调用的独立状态。',
    demo: R08CustomHook,
    code: R08Code,
    language: 'jsx',
    principle:
      '自定义 Hook 是以 use 开头、内部可调用其他 Hook 的普通函数，用于复用"有状态逻辑"而非共享同一份状态。每次调用它都会创建独立且隔离的 State 与 Effect，其内部 Hooks 状态由调用方组件独立管理。当多个组件同时订阅同一外部来源（如在线事件）时，它们各自订阅、各自清理。',
    flow: [
      'useOnlineStatus 用 useState 初始化当前在线状态。',
      '其内部的 Effect 订阅 online/offline 事件，并在卸载时移除监听。',
      '状态徽标与保存按钮分别调用该 Hook，复用同一套订阅逻辑但互不共享状态。',
    ],
    notes: [
      '自定义 Hook 名称必须以 use 开头，Hooks 规则和 lint 检查才会正确生效。',
      'Hook 只能在组件或其他 Hook 的顶层调用，不能放进条件分支和循环。',
      '复用 Hook 逻辑不等于共享状态；要共享状态需提升位置或改用外部状态源。',
    ],
    problem: '解决"多个组件需要相同的状态订阅和清理逻辑，如何避免重复实现"的问题。',
  },
{
    id: 'R_9',
    title: 'useRef：DOM 引用与非渲染数据',
    navTitle: 'Ref 与 DOM',
    category: '命令式协作',
    path: '/react/r-9/ref-dom',
    summary: '用课程检索演示 useRef 聚焦输入框，以及保存不触发渲染的会话计数。',
    demo: R09RefDom,
    code: R09Code,
    language: 'jsx',
    principle:
      'useRef 在多次渲染间返回同一个可变对象。把 ref 对象传给 DOM 元素后，React 会维护其 current 指向对应节点，适合聚焦、滚动等命令式操作。修改 ref.current 不会触发重新渲染，因此它只应存放不参与界面输出的数据；凡是需要显示并随变化更新的值仍应放进 State。',
    flow: [
      'searchRef 关联搜索输入框，按钮通过 current 调用原生 focus。',
      'submitCountRef 记录本次会话的检索次数，变化本身不请求重渲染。',
      'result State 保存需要显示的反馈文案，由它驱动界面更新。',
    ],
    notes: [
      '不要在渲染过程中随意读写 ref.current，初始化除外。',
      'DOM 层面的命令式操作应保持小而明确，不要绕过 React 手动维护组件已声明的节点结构。',
      '非受控输入可从 Ref 读取当前值，但复杂表单通常仍更适合受控 State。',
    ],
    problem: '解决"组件如何操作 DOM，以及如何保存无需驱动渲染的可变数据"的问题。',
  },
{
    id: 'R_10',
    title: 'memo、useMemo 与 useCallback：有依据地减少重复工作',
    navTitle: '记忆化优化',
    category: '性能',
    path: '/react/r-10/memoization',
    summary: '用课程筛选与无关外观更新演示组件、计算结果与回调引用的记忆化边界。',
    demo: R10Memoization,
    code: R10Code,
    language: 'jsx',
    principle:
      'memo 在 Props 未变时跳过子组件重渲染，useMemo 缓存计算结果，useCallback 缓存函数引用。三者都是性能优化而非正确性工具：只有重渲染确实昂贵、依赖能保持稳定、且经过测量确认存在瓶颈时才值得引入。先让状态与 Effect 设计正确，再针对实测热点做记忆化。',
    flow: [
      'useMemo 只在 level 改变时重算可见课程列表。',
      'useCallback 让选择课程的函数引用保持稳定。',
      'CourseList 用 memo 包裹后，点击"刷新外观"不触发列表重渲染。',
    ],
    notes: [
      '先用 React DevTools Profiler 定位瓶颈，再决定是否记忆化。',
      '每次新建的对象或函数会让浅比较(===)失效，依赖的稳定性比机械包裹更重要。',
      '如果去掉记忆化组件逻辑就不正确，应先修复状态与 Effect 的设计。',
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
      'useDeferredValue 返回一个可落后于最新值的版本，让 React 优先提交输入这类紧急更新，再在后台"追赶"较慢的结果渲染；后台渲染可被新的输入中断。它改善的是交互流畅度而非减少计算量，也不会减少网络请求，更不是固定时长的防抖。旧值与新值不一致时，可弱化结果区域的视觉强调，明确提示内容正在更新。',
    flow: [
      '受控输入同步更新 keyword，保证键入即时可见。',
      'deferredKeyword 由 useDeferredValue(keyword) 在后台追赶，并驱动结果筛选与 useMemo 重算。',
      '两值不同时用 isStale 置 aria-busy 并降低结果区域透明度。',
    ],
    notes: [
      '不要把控制文本输入的 State 更新放进 Transition，键入必须同步更新。',
      'useDeferredValue 不会自动阻止请求；请求去重与防抖仍需单独处理。',
      '只有当结果渲染明显较慢时才有收益，小列表不值得使用。',
    ],
    problem: '解决"昂贵结果区域更新时，如何让文本输入仍保持流畅"的问题。',
  },
{
    id: 'R_12',
    title: 'useSyncExternalStore：一致地订阅外部状态',
    navTitle: '外部 Store',
    category: '状态集成',
    path: '/react/r-12/external-store',
    summary: '用独立计数 Store 演示 subscribe、getSnapshot 与多个消费者的一致更新。',
    demo: R12ExternalStore,
    code: R12Code,
    language: 'jsx',
    principle:
      'useSyncExternalStore 是 React 读取外部可变数据源的标准接口。subscribe 注册变化监听并返回取消函数，getSnapshot 返回当前不可变快照；只要数据未变，快照就必须保持 Object.is 相等，否则会触发无限循环。React 依据这份契约在并发渲染中拿到一致视图，适用于状态库、浏览器 API 与框架级缓存等场景。',
    flow: [
      '外部 Store 在 React 之外保存快照与监听器集合。',
      '两个 CounterView 通过同一组 subscribe/getSnapshot 订阅 Store。',
      'increment 替换快照并通知所有监听器，各消费者得到一致结果。',
    ],
    notes: [
      'getSnapshot 不应每次都创建新对象，否则等价性破坏会引发无限更新。',
      'subscribe 函数最好定义在组件外，避免每次渲染后重新订阅。',
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
      'createPortal 能把 React 子节点渲染到另一个 DOM 容器中，常用于弹窗、浮层和 Tooltip。Portal 只改变 DOM 的放置位置，不改变 React 树中的父子关系，因此 Context 依然可读取，事件也沿 React 树而非 DOM 树冒泡。可访问的弹窗还需要 dialog 语义、焦点管理与关闭策略。',
    flow: [
      '触发按钮位于 overflow 受限的容器中，点击更新 open 状态。',
      'ConfirmDialog 用 createPortal 把遮罩与弹窗渲染到 document.body，从而不被裁切。',
      '点击遮罩或确认/取消关闭弹窗，弹窗内部点击用 stopPropagation 阻止误关。',
    ],
    notes: [
      'Portal 事件按 React 树而非 DOM 树冒泡，外层的事件处理器仍会收到事件。',
      '生产级弹窗应补充焦点陷阱、Escape 关闭与关闭后的焦点恢复。',
      '目标 DOM 节点须已存在；改变目标节点会重新创建 Portal 内容。',
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
      'lazy 把函数组件的加载函数延后到组件第一次需要渲染时才调用，并把结果缓存，避免重复执行。组件在等待代码加载时会"挂起"(suspend)，最近的 Suspense 边界随即显示 fallback，加载完成后切换到真实内容。实际工程通常把 lazy 与动态 import 配合，让构建工具拆分出独立代码块。',
    flow: [
      '初始不渲染报告组件，因此 lazy 的加载函数尚未被调用。',
      '点击"查看报告"后首次渲染 Lazy 组件，Suspense 立即显示后备状态。',
      '返回的 Promise 解析出 default 组件后，React 用真实报告替换 fallback。',
    ],
    notes: [
      'lazy 声明应放在组件外部，避免每次渲染重建组件并意外重置其状态。',
      'Suspense 不捕获 Effect 或普通事件处理器中的常规数据请求。',
      '加载 Promise 被拒绝时，错误会交给最近的错误边界。',
    ],
    problem: '解决"不常用的大型功能如何延后加载，并在等待期间提供稳定反馈"的问题。',
  },
{
    id: 'R_15',
    title: 'Error Boundary：隔离渲染错误并提供降级界面',
    navTitle: '错误边界',
    category: '容错',
    path: '/react/r-15/error-boundary',
    summary: '用故障课程卡片演示错误边界如何保护页面其他区域并提供可恢复的后备内容。',
    demo: R15ErrorBoundary,
    code: R15Code,
    language: 'jsx',
    principle:
      '类组件通过 static getDerivedStateFromError 在子树渲染出错时切换到后备界面，componentDidCatch 用于记录错误信息。React 目前仍要求用类组件实现错误边界；边界不能捕获自身错误、普通事件处理器中的错误、服务端渲染错误以及大多数异步回调里的错误。',
    flow: [
      '点击"模拟故障"让课程卡片在下一次渲染中抛出错误。',
      '错误边界捕获子树错误并渲染局部降级内容，其余页面保持可用。',
      '重试按钮先重置触发故障的状态，再清除边界的失败标记使子树恢复。',
    ],
    notes: [
      '错误边界应按功能区域布置，避免整页崩溃，也不宜细碎到难以维护。',
      'componentDidCatch 可接入监控上报，但不要记录敏感用户数据。',
      '事件处理器中的错误应使用 try/catch 加错误状态处理，而不是依赖错误边界。',
    ],
    problem: '解决"局部组件渲染失败时，如何避免整个 React 根节点失去界面"的问题。',
  },
{
    id: 'R_16',
    title: 'useId：稳定连接标签与可访问性说明',
    navTitle: '可访问 ID',
    category: '可访问性',
    path: '/react/r-16/accessible-id',
    summary: '用动态课程字段演示 useId 为 label、input 与辅助说明生成稳定且唯一的关联标识。',
    demo: R16AccessibleId,
    code: R16Code,
    language: 'jsx',
    principle:
      'useId 为组件实例生成稳定且唯一的 ID，适合连接 label 与表单控件、用 aria-describedby 指向说明文字，并兼容服务端渲染与水合。它不是列表 Key 的来源：Key 表达业务项目身份，应由数据本身提供；而 useId 表示当前组件树中用于可访问性关联的标识。',
    flow: [
      '每个 CourseField 调用 useId 得到自己的稳定前缀。',
      'label 的 htmlFor 与 input 的 id 指向同一值，建立可点击标签关系。',
      'aria-describedby 用 `${id}-hint` 连接输入框与辅助说明，新增字段也不会冲突。',
    ],
    notes: [
      '不要用 useId 生成列表 Key，Key 应来自数据库 ID 等稳定业务数据。',
      '同一组件需要多个关联 ID 时，可基于一个 useId 返回的值拼接后缀。',
      '页面存在多个 React 根时可配置 identifierPrefix，避免跨根冲突。',
    ],
    problem: '解决"可复用表单组件如何生成唯一、稳定且适合水合的关联 ID"的问题。',
  },
{
    id: 'R_17',
    title: '事件处理：合成事件与处理器模式',
    navTitle: '事件处理',
    category: '用户交互',
    path: '/react/r-17/event-handler',
    summary: '用课程搜索和表单提交演示合成事件对象、preventDefault 与事件处理器设计。',
    demo: R17EventHandler,
    code: R17Code,
    language: 'jsx',
    principle:
      'React 的合成事件对象 (SyntheticEvent) 统一了浏览器原生事件的接口。React 17 起事件委托到根容器统一分发；事件处理器直接接收合成事件对象，可读取 type、target 等字段。表单提交等场景需调用 preventDefault 阻止浏览器默认行为；事件处理器通过闭包直接访问组件状态，无需手动绑定 this。',
    flow: [
      '点击与输入事件通过合成事件对象读取类型和作用目标信息。',
      '表单提交调用 preventDefault 阻止浏览器刷新，改由提交处理器驱动界面更新。',
      '键盘事件通过 event.key 过滤特定按键，例如 Enter 触发记录。',
    ],
    notes: [
      'React 关闭了早期的合成事件池化，不必再调用 persist；异步读取事件字段也安全。',
      '事件委托挂在根容器上，因此不必担心为大量元素逐个绑定监听器。',
      '事件处理器应保持简洁，复杂逻辑可拆为独立函数或调用组件方法。',
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
      'React 没有模板指令，条件渲染完全依赖 JavaScript 表达式。逻辑与 (&&) 表达"满足则显示、否则不渲染"；三元运算符表达二选一；提前返回则用于分支后剩余逻辑较多时提前退出当前组件。具体选用哪种由可读性与场景决定，没有唯一的标准答案。',
    flow: [
      '折扣区域用 && 控制显示：showDiscount 为 false 时不渲染任何内容。',
      'selected 用三元运算符在课程列表与详情之间二选一渲染。',
      'CourseDetail 内部用提前返回，未传入课程时直接 return null。',
    ],
    notes: [
      '&& 左侧为 0 等假值表达式时会渲染出 0，应改用三元运算符或显式布尔转换。',
      'if/else 是语句而非表达式，不能直接嵌入 JSX 条件渲染。',
      '分支过多时应拆分为独立子组件，让每个组件保持单一职责。',
    ],
    problem: '解决"React 没有模板指令，如何用 JavaScript 表达式实现条件渲染"的问题。',
  },
{
    id: 'R_19',
    title: '组件组合：children 与 render props 模式',
    navTitle: '组件组合',
    category: '组件设计',
    path: '/react/r-19/composition',
    summary: '用课程卡片与统计面板演示 children 插槽和 render props 两种组合方式。',
    demo: R19Composition,
    code: R19Code,
    language: 'jsx',
    principle:
      '"组合优于继承"是 React 组件设计的核心理念。children 是最直接的组合方式，父组件通过 props.children 接收并放置子元素；render props 则通过函数类型的 prop 让调用方决定子组件的渲染内容，适合需要把父组件的数据或状态传回子内容进行渲染的场景。两者都能减少深层 Props 透传。',
    flow: [
      'Card 通过 children 接收按钮与说明文字，父组件决定具体内容。',
      'StatsLayout 通过 renderStats 函数 prop 获取统计项数组，由调用方决定渲染哪些指标。',
      '两种容器组件都只管布局与结构，内容完全交给调用方。',
    ],
    notes: [
      'children 适合简单插槽，render props 适合需要父组件状态参与渲染的场景。',
      'render props 函数不要在渲染中每次新建，以免连累子组件的 memo 判断。',
      'Hooks 已解决多数状态逻辑复用需求，render props 的适用场景相应收窄。',
    ],
    problem: '解决"如何让容器组件灵活接收和动态生成子内容"的问题。',
  },
{
    id: 'R_20',
    title: 'useTransition：标记非紧急状态更新',
    navTitle: '过渡更新',
    category: '并发渲染',
    path: '/react/r-20/transition',
    summary: '用大列表搜索演示 useTransition 的 isPending 与将筛选标记为可中断过渡更新的思路。',
    demo: R20Transition,
    code: R20Code,
    language: 'jsx',
    principle:
      'useTransition 返回 [isPending, startTransition]。把非紧急的状态更新（如大列表筛选）放进 startTransition，React 就会把它标记为低优先级的过渡更新；一旦有更紧急的更新（例如输入框同步），React 会中断过渡更新、优先推进紧急更新。它应作用于"用户交互触发但结果渲染较慢"的更新。',
    flow: [
      '输入框 onChange 同步更新 keyword，保证键入即时可见。',
      'filtered 在渲染阶段按 keyword 实时计算，结果区域据此展示。',
      'useTransition 返回的 isPending 用于在过渡进行时弱化列表区域。',
    ],
    notes: [
      '真正昂贵的列表更新应整体包裹进 startTransition；控制文本输入的 setState 必须保持紧急同步，不放入 Transition。',
      'useDeferredValue 是 useTransition 的声明式替代，适合不需要显式控制触发时机的场景。',
      '过渡更新可被中断但不会被丢弃，React 会保证最终提交一致的状态。',
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
      'useImperativeHandle 与 forwardRef 搭配，可精确限定父组件通过 ref 能访问到的方法。默认 ref 指向组件内部的某个 DOM 节点；useImperativeHandle 会把它重定向为自定义对象，只暴露必要的命令式操作，从而保留封装。React 19 还把 ref 变成了函数组件的普通 prop，不再强制使用 forwardRef。',
    flow: [
      'SearchInput 接收 ref，并在内部用另一个 ref 指向真实 input 元素。',
      'useImperativeHandle 只暴露 focus、clear、getValue 三个方法。',
      '父组件经 searchRef.current 调用这些方法，无法触碰内部 DOM 结构。',
    ],
    notes: [
      'useImperativeHandle 的工厂函数应返回稳定对象，避免给父组件造成不必要的变化。',
      '命令式接口应作为最后手段；能用声明式 Props 与 State 表达的需求优先声明式解决。',
      'React 19 中 ref 可作为函数组件普通 prop 直接接收，配合 useImperativeHandle 使用同样成立。',
    ],
    problem: '解决"父组件如何调用子组件方法，同时不暴露内部实现细节"的问题。',
  },
{
    id: 'R_22',
    title: 'forwardRef：跨组件传递 Ref',
    navTitle: '转发 Ref',
    category: '命令式协作',
    path: '/react/r-22/forward-ref',
    summary: '用报名表单演示 forwardRef 让自定义输入组件把 ref 转发给内部 DOM 节点。',
    demo: R22ForwardRef,
    code: R22Code,
    language: 'jsx',
    principle:
      'forwardRef 让自定义组件把接收到的 ref 转发给内部的 DOM 节点，方便聚焦、测量或与第三方库集成这类必须直接操作元素的场景。它包裹组件后，第二个参数就是外部传入的 ref。React 19 更新：ref 现在可以作为函数组件的普通 prop 被直接接收，forwardRef 仍是广为兼容的写法。',
    flow: [
      'TextInput 用 forwardRef 把传入的 ref 转发到内部 input 元素。',
      '父组件分别用 nameRef 与 emailRef 引用两个输入框。',
      '提交时通过 ref.current 读取当前值，重置时直接清空 DOM 元素。',
    ],
    notes: [
      'ref 转发可以跨多层组件链连续传递，但每一层都需要转发一步。',
      '配合 useImperativeHandle 可自定义 ref 暴露的内容，而不仅是整个 DOM 节点。',
      'React 19 也可把 ref 作普通 prop 传给函数组件，forwardRef 用于保持传统写法与兼容旧代码。',
    ],
    problem: '解决"自定义组件如何让父组件获取内部 DOM 节点引用"的问题。',
  },
{
    id: 'R_23',
    title: 'StrictMode：开发环境额外检查',
    navTitle: '严格模式',
    category: '开发体验',
    path: '/react/r-23/strict-mode',
    summary: '用 Effect 执行日志演示 StrictMode 的双重调用机制如何暴露清理缺失。',
    demo: R23StrictMode,
    code: R23Code,
    language: 'jsx',
    principle:
      'StrictMode 是仅用于开发环境的检查工具，本身不渲染任何可见内容。它会让组件函数体、useState 初始化函数、reducer 以及 Effect 的 setup/cleanup 各额外执行一次，从而暴露不纯的渲染、缺少清理的订阅和不合规的 ref 用法。双重调用只在开发构建生效，不影响生产环境。',
    flow: [
      '开启 StrictMode 后，Effect 会执行两次 setup + cleanup 的完整配对。',
      '通过日志对比开启与关闭 StrictMode 时 Effect 的执行次数差异。',
      '清理函数缺失或不够完整的问题，会在第二次 setup 前被暴露出来。',
    ],
    notes: [
      'StrictMode 只作用于开发阶段，生产构建不会产生双重调用。',
      '看到 Effect 重复执行，说明 React 正在帮你验证清理函数是否写对。',
      '不要为了消除双重调用而移除 StrictMode，应修复触发问题的根本代码。',
    ],
    problem: '解决"如何在开发阶段尽早发现不纯渲染和 Effect 清理缺失"的问题。',
  },
{
    id: 'R_24',
    title: 'useEffect 生命周期：挂载、更新与卸载的常见模式',
    navTitle: 'Effect 生命周期',
    category: '副作用',
    path: '/react/r-24/effect-lifecycle',
    summary: '用窗口尺寸、计时器与在线状态演示 Effect 的挂载、依赖更新与清理卸载模式。',
    demo: R24EffectLifecycle,
    code: R24Code,
    language: 'jsx',
    principle:
      'Effect 在组件挂载后执行；依赖变化时会先跑一次清理、再重新 setup；组件卸载时执行最后一次清理。空依赖数组让 Effect 只在挂载与卸载时运行；带依赖的 Effect 在依赖变化时重新与外部系统同步；需要按条件启停时（如 onlyIf 运行）可提前 return，让不满足条件时保持干净。',
    flow: [
      'WindowSize 的 Effect 用空依赖，只在挂载时添加 resize 监听、卸载时移除。',
      'Timer 的 Effect 依赖 running：切换开关时先清旧计时器再按状态决定是否新建。',
      'OnlineStatus 的 Effect 在挂载时订阅网络事件、卸载时解除订阅。',
    ],
    notes: [
      '只挂载/卸载执行时依赖数组写空，但不能省略第二个参数本身。',
      '清理函数会在"依赖变化重新执行前"和"组件卸载时"各跑一次。',
      '互不相关的副作用应拆成独立 Effect，而不是塞进一个 Effect 里。',
    ],
    problem: '解决"Effect 在组件生命周期各阶段如何正确同步外部系统"的问题。',
  },
{
    id: 'R_25', title: 'Zustand Store 与细粒度 Selector', navTitle: 'Zustand Selector', category: '轻量 Store',
    path: '/react/r-25/zustand-selectors', summary: '用购物车 Store 展示超越 useState 的 Hook API、Action 与细粒度 selector 订阅。',
    demo: R25ZustandSelectors, code: R25Code, language: 'jsx',
    principle: 'Zustand 用 create 在 React 树之外构建独立 Store，通过 useStore 的 Hook API 暴露给组件。每个 selector 把状态投影成最小切片；切片引用不变时组件就不会重渲染，从而把无关更新的影响隔离在真正读取它的组件内。',
    flow: ['create((set) => (…)) 定义状态与修改函数。', '组件用多个 selector 分别取 items、coupon 等最小切片。', 'action 用 set 合并新状态，只有读取相关切片的组件响应更新。'],
    notes: ['selector 若返回新对象（如每次新建数组），需要关注相等比较是否导致无限重渲染。', 'Store 不依赖 React 树，可在组件外直接调用 getState().action 操作。', '不读取的状态切片变化不会让该组件重渲染。'],
    problem: '解决"React 中如何以很少样板代码共享状态并精确控制组件重渲染"的问题。',
  },
{
    id: 'R_26', title: 'Zustand Middleware 与选择性订阅', navTitle: 'Zustand Middleware', category: '轻量 Store',
    path: '/react/r-26/zustand-middleware', summary: '用课程进度演示 subscribeWithSelector 中间件的选择性订阅。',
    demo: R26ZustandMiddleware, code: R26Code, language: 'jsx',
    principle: 'Zustand 中间件包裹 create 的创建器，为其追加持久化、DevTools、Immer 或 subscribeWithSelector 等横切能力，而组件的消费方式保持不变。subscribeWithSelector 让 store.subscribe 能按 selector 订阅并同时拿到变化前后的值。',
    flow: ['用 subscribeWithSelector 创建启用选择性订阅的 Store。', '经 subscribe 指定 selector 订阅 progress，读取变化前后两个值。', '订阅返回取消函数，在 effect 清理阶段取消以求不留订阅泄漏。'],
    notes: ['不同中间件的组合顺序会影响类型推导与行为。', '持久化等中间件需要用常量的存储 Key，且要规划好版本迁移。', '订阅了 selector 后只有该切片变化时回调才被触发。'],
    problem: '解决"如何扩展 Zustand 能力，并在不引发整树更新的前提下监听特定状态变化"的问题。',
  },
{
    id: 'R_27', title: 'Jotai 原子状态与派生图', navTitle: 'Jotai Atom', category: '原子化状态',
    path: '/react/r-27/jotai-atoms', summary: '用数量、价格与总价 Atom 理解原子组合和依赖追踪。',
    demo: R27JotaiAtoms, code: R27Code, language: 'jsx',
    principle: 'Jotai 以 atom 为最小状态单元：基础 atom 直接持有值，派生(derived) atom 通过读取其他 atom 自动建立依赖图。某个原子变化时，只有依赖链路上真正受影响的消费者会被触发更新，从而实现细粒度的按需重渲染。',
    flow: ['创建 countAtom、priceAtom 两个可写基础原子。', '用 totalAtom = atom((get) => …) 读取二者构造派生原子。', '组件用 useAtom 读写基础原子、useAtomValue 只读派生值，驱动界面显示总价。'],
    notes: ['atom 应在组件外部定义以保持引用稳定，避免每次渲染重建。', '需要动态创建大量原子时可引入 atomFamily 管理。', '派生原子本身不可直写，其值始终来自依赖原子的当前状态。'],
    problem: '解决"复杂页面如何把状态拆成可组合、可追踪的细粒度原子单元"的问题。',
  },
{
    id: 'R_28', title: 'Jotai 异步 Atom 与 Suspense', navTitle: 'Jotai 异步 Atom', category: '原子化状态',
    path: '/react/r-28/jotai-async-atoms', summary: '用异步课程 Atom 演示依赖驱动的刷新与 Suspense 等待边界。',
    demo: R28JotaiAsyncAtoms, code: R28Code, language: 'jsx',
    principle: 'Jotai 的读取函数可以返回 Promise，从而定义"异步原子"；它一旦被读取就会执行，执行中的 Promise 会触发 useAtomValue 所在的组件进入挂起(suspend)状态，由外层 Suspense 展示后备界面。当异步 atom 读取了某个刷新原子时，只要刷新原子变化，异步 atom 就会失效并重新计算。',
    flow: ['refreshAtom 作为刷新依赖，异步 coursesAtom 读取它以建立重算关系。', '组件读取异步 atom 时会挂起，外层 Suspense 显示"加载中"后备。', '点击"重新读取"更新 refreshAtom，使异步 atom 失效并重新拉取课程。'],
    notes: ['异步 atom 适合以原子为依赖、天然可组合的加载场景。', '并发取消、去重等更复杂的服务端缓存语义，仍需交给专门请求库。', '同一异步 atom 被多个组件读取时，结果会被共享缓存，避免重复执行。'],
    problem: '解决"原子化状态如何表达异步数据及其重新加载"的问题。',
  },
{
    id: 'R_29', title: 'Redux Toolkit 的 Slice 与单向数据流', navTitle: 'Redux Toolkit', category: '结构化状态',
    path: '/react/r-29/redux-toolkit', summary: '用报名 Slice 展示 Redux Toolkit 的 reducer、action、selector 与 Provider。',
    demo: R29ReduxToolkit, code: R29Code, language: 'jsx',
    principle: 'Redux Toolkit 用 createSlice 把初始状态与 reducer 放在一起，同时自动生成对应的 action；configureStore 再组合成单一 store。所有改动都必须经过 dispatch 走一遍可追踪的单向数据流，配合 DevTools 可回溯每一次变更，适合状态规则严格、需要统一调试工具的团队。',
    flow: ['createSlice 定义初始状态与 enroll/reset 等 reducer，并自动生成 actions.enroll 等对象。', 'configureStore 组合业务 Slice，用 Provider 把 store 提供给组件树。', '组件用 useSelector 读取名额与报名数，用 useDispatch 发起 action。'],
    notes: ['reducer 里"看似直接修改"的写法由 Immer 自动转成不可变更新，无需手写 spread。', '不要把光标位置、临时输入等短暂 UI 状态塞进全局 Store。', 'selector 应返回最稳定的最小切片，避免不必要的全局重渲染。'],
    problem: '解决"大型 React 项目如何获得可预测的状态流与统一调试工具"的问题。',
  },
{
    id: 'R_30', title: 'XState 有限状态机与合法转换', navTitle: 'XState 状态机', category: '结构化状态',
    path: '/react/r-30/xstate-machine', summary: '用结算流程限制 editing、submitting、failure 与 success 的合法转换。',
    demo: R30XStateMachine, code: R30Code, language: 'jsx',
    principle: '有限状态机把互斥的状态与可接受的事件显式列举出来，使非法转换在建模阶段就被排除。XState 用 createMachine 描述状态图：每个状态声明它响应的事件与目标，并支持守卫(guard)、副作用(invoke/actor)、并行状态等，适合结算、审批等多步骤关键流程。',
    flow: ['枚举业务互斥的状态：editing、submitting、failure、success(event 驱动的 final 态)。', '为每个状态声明允许转换的事件，如 editing 只接受 SUBMIT。', '组件用 useMachine 订阅状态快照 snapshot，并通过 send 触发事件推动流程。'],
    notes: ['简单布尔或极少状态用 useState 即可，不必引入状态机。', '副作用应用 invoke/actor 建模，组件经 useActor/useMachine 订阅快照。', '状态图可直接对齐产品与测试认知，减少"非法组合"类缺陷。'],
    problem: '解决"多个布尔值或多个字段自由组合时出现非法流程状态"的问题。',
  },
{
    id: 'R_31', title: 'Valtio 与 Proxy 响应式状态', navTitle: 'Valtio', category: '轻量 Store',
    path: '/react/r-31/valtio', summary: '用 Valtio 的 proxy/snapshot 模式管理 React 状态，理解 Proxy 响应式原理。',
    demo: R31Valtio, code: () => Promise.resolve(`import React from 'react'
import { createRoot } from 'react-dom/client'
import { proxy, useSnapshot } from 'valtio'

const state = proxy({
  count: 0,
  text: '',
  user: {
    name: 'Alice',
    age: 25,
  },
})

function inc() {
  state.count++
}

function setText(text) {
  state.text = text
}

function birthday() {
  state.user.age++
}

function Counter() {
  const snap = useSnapshot(state)
  return (
    <section className="panel">
      <p className="metric">计数: {snap.count}</p>
      <button onClick={inc}>增加</button>
    </section>
  )
}

function TextInput() {
  const snap = useSnapshot(state)
  return (
    <label className="field">
      <span>输入文本（不影响计数组件）</span>
      <input value={snap.text} onChange={(e) => setText(e.target.value)} />
    </label>
  )
}

function UserProfile() {
  const snap = useSnapshot(state.user)
  return (
    <section className="panel">
      <p>{snap.name}, {snap.age} 岁</p>
      <button onClick={birthday}>过生日</button>
    </section>
  )
}

function App() {
  return (
    <main className="app">
      <p className="kicker">Valtio Proxy 响应式</p>
      <div className="grid">
        <Counter />
        <TextInput />
        <UserProfile />
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`), language: 'jsx',
    principle: 'Valtio 用 Proxy 包裹状态对象，直接赋值属性即触发更新；组件再用 useSnapshot 取到不可变快照用于渲染，快照层会自动追踪组件实际读到的路径，从而把重渲染收敛到真正依赖它的组件。',
    flow: ['用 proxy 创建响应式状态对象，跨组件共享引用。', '在组件或动作里直接修改 proxy 的属性（如 state.count++）。', '组件用 useSnapshot 读取并渲染，系统按所读路径自动收集依赖。'],
    notes: ['Valtio 提供 subscribe 订阅任意路径的变化，便于接入调试或持久化。', '不要把 proxy 对象整体放进 React Context，快照隔离更适合组件消费。', 'useSnapshot 的可变性对象不宜作 props 长期保存，尽量保持组件使用模式一致。'],
    problem: '解决"如何以最少样板代码获得 React 的响应式状态管理"的问题。',
  },
{
    id: 'R_32', title: 'TanStack Query 服务端状态', navTitle: 'TanStack Query', category: '服务端状态',
    path: '/react/r-32/tanstack-query', summary: '用缓存策略、乐观更新和后台同步管理服务端数据状态。',
    demo: R32TanStackQuery, code: () => Promise.resolve(`import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

// 模拟 API
const fetchCourses = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve([
      { id: 1, title: 'Vue 3 进阶', students: 120 },
      { id: 2, title: 'React Hooks 实战', students: 85 },
    ]), 500)
  )

const addCourse = (course) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ id: Date.now(), ...course }), 300)
  )

function CourseList() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  const mutation = useMutation({
    mutationFn: addCourse,
    onMutate: async (newCourse) => {
      await queryClient.cancelQueries({ queryKey: ['courses'] })
      const previousCourses = queryClient.getQueryData(['courses'])
      queryClient.setQueryData(['courses'], (old) => [
        ...old,
        { id: Date.now(), ...newCourse },
      ])
      return { previousCourses }
    },
    onError: (err, newCourse, context) => {
      queryClient.setQueryData(['courses'], context.previousCourses)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })

  if (isLoading) return <div>加载中...</div>
  if (isError) return <div>错误: {error.message}</div>

  return (
    <section className="panel">
      <h3>课程列表</h3>
      <ul>
        {data.map((course) => (
          <li key={course.id}>
            {course.title} - {course.students} 人
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          mutation.mutate({ title: '新课程', students: 0 })
        }
      >
        {mutation.isLoading ? '添加中...' : '添加课程（乐观更新）'}
      </button>
    </section>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="app">
        <p className="kicker">TanStack Query 服务端状态</p>
        <CourseList />
      </main>
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`), language: 'jsx',
    principle: 'TanStack Query 把"服务端数据"看作缓存而非组件本地状态：staleTime 决定数据在多久内视为新鲜、期间不重复请求，gcTime 控制不再使用后的回收时机。useQuery 负责读取与缓存，useMutation 负责写入，配合乐观更新可在请求完成前先更新界面、失败时回滚。',
    flow: ['用 QueryClient 统一配置 staleTime、gcTime 与窗口聚焦时是否重取。', 'useQuery 以 courses 作为 queryKey 获取并缓存课程列表。', 'useMutation 上传新课程：onMutate 先写入乐观值，onError 回滚，onSettled 使缓存失效以对齐服务端。'],
    notes: ['服务端状态与本地 UI 状态分开管理，避免重复当"事实来源"。', 'queryKey 的结构直接决定缓存命中与失效粒度，需稳定且能标识查询语义。', 'staleTime 控制请求频率，gcTime 控制缓存保留时长；均需针对数据特性取值。'],
    problem: '解决"如何高效管理服务端数据的缓存、新鲜度、同步与乐观更新"的问题。',
  },
{
    id: 'R_33', title: 'Recoil 原子状态与 Selector', navTitle: 'Recoil', category: '原子化状态',
    path: '/react/r-33/recoil', summary: '了解 Recoil 的 Atom 与 Selector 模型，理解原子化状态管理的细粒度更新。',
    demo: R33Recoil, code: () => Promise.resolve(`import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'

const textState = atom({
  key: 'textState',
  default: '',
})

const charCountState = selector({
  key: 'charCountState',
  get: ({ get }) => {
    const text = get(textState)
    return text.length
  },
})

const todoListState = atom({
  key: 'todoListState',
  default: [
    { id: 1, text: '学习 Recoil', isComplete: false },
    { id: 2, text: '理解 Atom', isComplete: true },
  ],
})

const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({ get }) => {
    const todoList = get(todoListState)
    const totalNum = todoList.length
    const totalCompletedNum = todoList.filter((item) => item.isComplete).length
    const totalUncompletedNum = totalNum - totalCompletedNum
    const percentCompleted = totalNum === 0 ? 0 : (totalCompletedNum / totalNum) * 100
    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted,
    }
  },
})

function TextInput() {
  const [text, setText] = useRecoilState(textState)
  const count = useRecoilValue(charCountState)

  return (
    <section className="panel">
      <label className="field">
        <span>输入文本</span>
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <p>字符数: {count}</p>
    </section>
  )
}

function TodoListStats() {
  const stats = useRecoilValue(todoListStatsState)
  return (
    <section className="panel">
      <p>总数: {stats.totalNum}</p>
      <p>已完成: {stats.totalCompletedNum}</p>
      <p>未完成: {stats.totalUncompletedNum}</p>
      <p>完成率: {stats.percentCompleted.toFixed(1)}%</p>
    </section>
  )
}

function App() {
  return (
    <RecoilRoot>
      <main className="app">
        <p className="kicker">Recoil 原子状态</p>
        <div className="grid">
          <TextInput />
          <TodoListStats />
        </div>
      </main>
    </RecoilRoot>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`), language: 'jsx',
    principle: 'Recoil 以 Atom 为最小状态单元，Selector 是从一个或多个 atom 推导出的派生状态。组件用 useRecoilState/useRecoilValue 读写，每个 atom 独立追踪订阅；只有读取了变化原子或其派生链的组件才会更新，从而实现细粒度的组件级重渲染。',
    flow: ['用 atom 定义原始状态并指定全局唯一的 key。', '用 selector 的 get 读取依赖的 atom 构造派生值，如字符数、完成率。', '组件经 useRecoilState 读写 atom、useRecoilValue 订阅派生 selector 展示统计。'],
    notes: ['Recoil 的状态图也支持异步 selector，并能配合 Suspense 使用。', '每个 atom/selector 独立维护订阅，更新粒度较其他全局 store 更细。', 'Recoil 与 React 生态深度绑定，主要面向 React 项目。'],
    problem: '解决"大型应用中状态更新粒度过粗、引发不必要重渲染"的问题。',
  },
{
    id: 'R_34', title: 'MobX 响应式状态与 Observable', navTitle: 'MobX', category: '结构化状态',
    path: '/react/r-34/mobx', summary: '理解 MobX 的 Observable 响应式模型，掌握 action、computed 和 observer 的协作方式。',
    demo: R34Mobx, code: () => Promise.resolve(`import { makeAutoObservable, runInAction, configure } from 'mobx'

configure({ enforceActions: 'always' })

// Store 定义
class TodoStore {
  todos = []
  filter = 'all'

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get completedTodos() {
    return this.todos.filter((todo) => todo.completed)
  }

  get activeTodos() {
    return this.todos.filter((todo) => !todo.completed)
  }

  get filteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.activeTodos
      case 'completed':
        return this.completedTodos
      default:
        return this.todos
    }
  }

  get completedCount() {
    return this.completedTodos.length
  }

  addTodo(text) {
    this.todos.push({
      id: Date.now(),
      text,
      completed: false,
    })
  }

  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  setFilter(filter) {
    this.filter = filter
  }

  async loadTodos() {
    const response = await fetch('/api/todos')
    const data = await response.json()
    runInAction(() => {
      this.todos = data
    })
  }
}

// 使用示例
const store = new TodoStore()

console.log('初始 todos:', store.todos.length)

store.addTodo('学习 MobX')
store.addTodo('理解 Observable')

console.log('添加后 todos:', store.todos.length)
console.log('已完成数量:', store.completedCount)

store.toggleTodo(store.todos[0].id)
console.log('切换后已完成数量:', store.completedCount)

store.setFilter('active')
console.log('活跃 todos:', store.filteredTodos.length)

// autorun 示例
import { autorun } from 'mobx'

autorun(() => {
  console.log('当前已完成:', store.completedCount, '/', store.todos.length)
})

store.addTodo('autorun 测试')
store.toggleTodo(store.todos[2].id)
`), language: 'javascript',
    principle: 'MobX 用 Observable 把普通对象（如 class 实例）包装成可观察图谱：action 在组件之外统一修改状态，computed（getter）派生只读值并缓存，observer 包裹的组件会记录渲染时用到的 observable 字段并随其变化自动重渲染。这种"透明反应"心智模型贴近面向对象领域建模，适合复杂业务状态。',
    flow: ['用 makeAutoObservable 让类字段自动可观察，并把修改方法标为 action。', '在 action 内统一变更状态，触发依赖收集与通知。', 'observer 组件渲染时用到哪些字段，就只订阅这些字段，变化时自动更新。'],
    notes: ['MobX 的响应式是隐式收集的，代码更简洁，但需要理解"谁被追踪、何时重跑"。', 'configure({ enforceActions: "always" }) 保证状态只能在 action 中被修改。', '复杂领域模型优先用 class 搭配 makeAutoObservable 表达。'],
    problem: '解决"状态更新逻辑分散、视图与状态同步复杂、难以追踪"的问题。',
  },
{
    id: 'R_35', title: 'Overmind 分形状态管理', navTitle: 'Overmind', category: '结构化状态',
    path: '/react/r-35/overmind', summary: '了解 Overmind 的分形架构，掌握命名空间组织状态与 effects 隔离副作用。',
    demo: R35Overmind, code: () => Promise.resolve(`// Overmind 状态管理 - 分形架构

import { createOvermind } from 'overmind'
import { createHook } from 'overmind-react'

// 定义状态、动作和 effects
const config = {
  state: {
    user: {
      isLoggedIn: false,
      name: '',
      token: '',
    },
    todos: [],
    filter: 'all',
  },
  actions: {
    setUser: ({ state }, user) => {
      state.user = { ...user, isLoggedIn: true }
    },
    logout: ({ state }) => {
      state.user = {
        isLoggedIn: false,
        name: '',
        token: '',
      }
    },
    addTodo: ({ state }, text) => {
      state.todos.push({
        id: Date.now(),
        text,
        completed: false,
      })
    },
    toggleTodo: ({ state }, id) => {
      const todo = state.todos.find((t) => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    setFilter: ({ state }, filter) => {
      state.filter = filter
    },
    async loadTodos({ state, effects }) {
      const todos = await effects.api.getTodos()
      state.todos = todos
    },
  },
  effects: {
    api: {
      async getTodos() {
        const response = await fetch('/api/todos')
        return response.json()
      },
      async addTodo(text) {
        const response = await fetch('/api/todos', {
          method: 'POST',
          body: JSON.stringify({ text }),
        })
        return response.json()
      },
    },
    storage: {
      saveToken(token) {
        localStorage.setItem('token', token)
      },
      getToken() {
        return localStorage.getItem('token')
      },
    },
  },
  // 派生值 (getters)
  derived: {
    completedTodos: ({ state }) =>
      state.todos.filter((todo) => todo.completed),
    activeTodos: ({ state }) =>
      state.todos.filter((todo) => !todo.completed),
    filteredTodos: ({ state }) => {
      switch (state.filter) {
        case 'active':
          return state.activeTodos
        case 'completed':
          return state.completedTodos
        default:
          return state.todos
      }
    },
  },
}

// 创建 Overmind 实例
export const overmind = createOvermind(config)

// React Hook
export const useOvermind = createHook()

// 使用示例
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'overmind-react'

function TodoList() {
  const { state, actions } = useOvermind()

  return (
    <section className="panel">
      <h3>Todo 列表</h3>
      <ul>
        {state.filteredTodos.map((todo) => (
          <li key={todo.id} onClick={() => actions.toggleTodo(todo.id)}>
            {todo.completed ? '✓ ' : '○ '}{todo.text}
          </li>
        ))}
      </ul>
      <button onClick={() => actions.addTodo('新任务')}>添加</button>
    </section>
  )
}

function App() {
  return (
    <Provider value={overmind}>
      <main className="app">
        <p className="kicker">Overmind 分形状态</p>
        <TodoList />
      </main>
    </Provider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`), language: 'javascript',
    principle: 'Overmind 以"分形"方式组织全局状态：state、actions、derived 与 effects 按命名空间聚合，天然支持状态追踪、DevTools 与时间旅行调试。核心约定是 actions 只改 state，网络、存储等副作用一律放进 effects，让 UI 层保持纯净、便于替换与测试。',
    flow: ['用 createOvermind 依配置创建 store，按命名空间放好 state、actions 与 effects。', '组件经 useOvermind 解构出 state 与 actions 使用。', 'actions 直接修改 state，需要的外部能力（如 fetch）从 effects 注入。'],
    notes: ['Overmind 同时支持 Vue、React 等框架，同一份逻辑可跨端复用。', '状态变更都能回溯到具体 action 调用，极大地方便调试与审计。', 'effects 独立成层，测试时可用替身注入，避免真实网络与存储。'],
    problem: '解决"状态管理中副作用耦合、调试困难、跨框架复用成本高"的问题。',
  }
]
