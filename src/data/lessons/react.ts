import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import R01ComponentProps from '../../demos/R01ComponentPropsArticle.vue'
import R02R06Pair from '../../demos/R02R06Pair.vue'
import R03R18Pair from '../../demos/R03R18Pair.vue'
import R04ControlledForm from '../../demos/R04ControlledFormArticle.vue'
import R05R24Pair from '../../demos/R05R24Pair.vue'
import R07Context from '../../demos/R07ContextArticle.vue'
import R08CustomHook from '../../demos/R08CustomHookArticle.vue'
import R09RefDom from '../../demos/R09RefDomArticle.vue'
import R10Memoization from '../../demos/R10MemoizationArticle.vue'
import R11R20Pair from '../../demos/R11R20Pair.vue'
import R12ExternalStore from '../../demos/R12ExternalStoreArticle.vue'
import R13Portal from '../../demos/R13PortalArticle.vue'
import R14R15Pair from '../../demos/R14R15Pair.vue'
import R16AccessibleId from '../../demos/R16AccessibleIdArticle.vue'
import R17EventHandler from '../../demos/R17EventHandlerArticle.vue'
import R19Composition from '../../demos/R19CompositionArticle.vue'
import R21R22Pair from '../../demos/R21R22Pair.vue'
import R23StrictMode from '../../demos/R23StrictModeArticle.vue'
import R25R26Pair from '../../demos/R25R26Pair.vue'
import R27R33Pair from '../../demos/R27R33Pair.vue'
import R28JotaiAsyncAtoms from '../../demos/S07JotaiAsyncAtomsArticle.vue'
import R29R30R35Pair from '../../demos/R29R30R35Pair.vue'
import R31R34Pair from '../../demos/R31R34Pair.vue'
import R32TanStackQuery from '../../demos/S13TanStackQueryArticle.vue'

const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })
const reactCodeModules = import.meta.glob<string>('../../demos/react-code/*', { query: '?raw', import: 'default' })

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
            : path.startsWith('react-code/')
              ? reactCodeModules
            : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const R01Code = createCodeLoader('react-jsx/R01ComponentProps.jsx')

const R02Code = createCodeLoader('react-jsx/R02StateUpdates.jsx')

const R03Code = createCodeLoader('react-jsx/R03ListsKeys.jsx')

const R04Code = createCodeLoader('react-jsx/R04ControlledForm.jsx')

const R05Code = createCodeLoader('react-jsx/R05EffectSync.jsx')

const R07Code = createCodeLoader('react-jsx/R07Context.jsx')

const R08Code = createCodeLoader('react-jsx/R08CustomHook.jsx')

const R09Code = createCodeLoader('react-jsx/R09RefDom.jsx')

const R10Code = createCodeLoader('react-jsx/R10Memoization.jsx')

const R11Code = createCodeLoader('react-jsx/R11DeferredValue.jsx')

const R12Code = createCodeLoader('react-jsx/R12ExternalStore.jsx')

const R13Code = createCodeLoader('react-jsx/R13Portal.jsx')

const R14Code = createCodeLoader('react-jsx/R14LazySuspense.jsx')

const R16Code = createCodeLoader('react-jsx/R16AccessibleId.jsx')

const R17Code = createCodeLoader('react-jsx/R17EventHandler.jsx')

const R19Code = createCodeLoader('react-jsx/R19Composition.jsx')

const R21Code = createCodeLoader('react-jsx/R21ImperativeHandle.jsx')

const R23Code = createCodeLoader('react-jsx/R23StrictMode.jsx')

const R25Code = createCodeLoader('state-react/S04ZustandSelectors.js')

const R27Code = createCodeLoader('state-react/S06JotaiAtoms.js')

const R28Code = createCodeLoader('state-react/S07JotaiAsyncAtoms.js')

const R29Code = createCodeLoader('state-react/S08ReduxToolkit.js')

const R31Code = createCodeLoader('react-code/R31Code.jsx.txt')
const R32Code = createCodeLoader('react-code/R32Code.jsx.txt')

export const lessons: Lesson[] = [
{
    id: 'R_1',
    title: 'createRoot、函数组件与 Props',
    navTitle: '组件与 Props',
    category: '组件与渲染',
    path: '/react/r-1/component-props',
    summary: '用训练营课程卡片理解 createRoot 挂载、函数组件组合、单向数据流与只读 Props。',
    demo: null,
    demoComponent: R01ComponentProps,
    code: R01Code,
    language: 'jsx',
    principle:
      'React 组件是返回界面描述（JSX）的普通函数。createRoot 为页面中的指定 DOM 容器创建 React 根，render 把根组件挂进该容器并接管其后的所有更新。父组件通过 Props 向子组件传值，数据沿组件树单向向下流动；子组件应把 Props 视为只读输入快照，需要变化的数据应提升为 State，而不是就地改写 Props。',
    flow: [
      'createRoot 拿到 #root 容器，render(<App />) 把根组件挂载进页面。',
      'App 用数组保存课程，通过 map 展开为多个 CourseCard。',
      'CourseCard 读取 Props 渲染名称、级别、剩余名额和报名徽章，同一组件复用于不同课程。',
      '在组件树面板确认子组件只接收渲染所需的 Props。',
    ],
    notes: [
      '组件名必须以大写字母开头，小写名称会被当作原生 HTML 标签而非组件。',
      'Props 是组件调用时的输入快照，不要在子组件中直接修改。',
      '展示代码用浏览器 ES Module 直接加载 React 19，由 iframe 沙箱执行。',
      'Props 在调用处是只读输入，需要变更的数据应上提为 State 并向下传递。',
    ],
    problem: '解决"界面重复代码多、组件间数据流向混乱，子组件误改 Props 导致状态来源失控"的问题。',
  },
{
    id: 'R_2',
    title: 'useState 与 useReducer：状态更新与复杂状态转换',
    navTitle: '状态与 Reducer',
    category: '状态与副作用',
    path: '/react/r-2/state-updates',
    summary: '用购物车数量调整与项目入组流程演示 useState 的函数式更新、不可变替换，以及 useReducer 集中管理相互关联的状态转换。',
    demo: null,
    demoComponent: R02R06Pair,
    code: R02Code,
    language: 'jsx',
    principle:
      'useState 为组件保存跨渲染的状态快照，调用 setter 只表示"请求下一次渲染"，不会立即改写当前变量。对象与数组状态必须用新引用整体替换旧值：React 依赖 Object.is 比较新旧状态，原地修改既破坏状态快照，也可能让更新被 React 跳过。当多个字段彼此关联、更新路径交织时，可用 useReducer 把状态转移集中到纯 reducer，由 dispatch 的 action 驱动。',
    flow: [
      'useState 保存购物车数组，总价在每次渲染时由数组实时推导。',
      '点击加减按钮通过函数式 setter 更新，确保基于最新状态计算。',
      'map 只替换目标商品条目，其余条目保持原引用不动。',
      '把入组流程的 next/approve/reset 交给 reducer，确认每个 action 只对应一种合法转移。',
    ],
    notes: [
      '下一状态依赖上一状态时优先写 setState(current => next)。',
      '不要用 push、splice 或直接改 item.count 的方式更新 React 状态。',
      '总价可由购物车推导，不需要额外 state 或 Effect。',
      'reducer 必须保持纯函数，彼此独立的简单状态仍优先用 useState。',
    ],
    problem: '解决"复杂状态如何可靠更新，以及在字段相互关联时如何集中管理状态转换"的问题。',
  },
{
    id: 'R_3',
    title: '条件列表、稳定 Key 与条件渲染',
    navTitle: '列表与条件渲染',
    category: '组件与渲染',
    path: '/react/r-3/lists-keys',
    summary: '用课程检索与列表/详情切换演示列表映射、稳定 key，以及 &&、三元运算符和提前返回三种条件渲染写法。',
    demo: null,
    demoComponent: R03R18Pair,
    code: R03Code,
    language: 'jsx',
    principle:
      'React 依赖 key 在多次渲染间区分同级列表项的"身份"。稳定的业务 ID（如课程 id）让 React 能正确复用节点并保留各项目的挂载状态；数组索引在插入、删除或重排时会改变身份，容易造成状态错位。能从 Props 或 State 推导出的数据应在渲染阶段直接计算，避免用 Effect 维护一份可能不同步的冗余 State。条件渲染没有模板指令：&& 表达"满足才渲染"，三元运算符表达二选一，提前返回用于剩余逻辑较多时退出组件。',
    flow: [
      '输入框把关键词写入唯一的 keyword 状态。',
      '组件每次渲染时用 keyword 过滤课程数组，得到 visibleCourses。',
      'map 以课程 ID 作为 key 渲染当前可见的课程卡片。',
      '折扣区、列表与详情分别用 &&、三元与提前返回渲染，确认假值 0 不会意外出现在页面上。',
    ],
    notes: [
      'key 只需在当前同级列表内唯一，并不会作为普通 Props 传给组件。',
      '列表顺序会变化时不要用数组索引作为 key，否则节点可能被错误复用。',
      '渲染中能算出的值就不要存进 State，避免引入需要同步的第二个来源。',
      '&& 左侧为 0 等假值时会渲染出 0，应改用三元运算符或显式布尔转换。',
    ],
    problem: '解决"动态列表如何保持项目身份，以及条件分支写法不统一、可选内容意外渲染出 0"的问题。',
  },
{
    id: 'R_4',
    title: '受控表单、统一字段更新与提交校验',
    navTitle: '受控表单',
    category: '组件与渲染',
    path: '/react/r-4/controlled-form',
    summary: '用训练营报名表展示受控表单的 value、onChange、统一字段更新与提交校验。',
    demo: null,
    demoComponent: R04ControlledForm,
    code: R04Code,
    language: 'jsx',
    principle:
      '受控表单把 React State 作为输入值唯一的事实来源：value 决定界面显示什么，onChange 把用户输入写回 State，提交处理器用 preventDefault 接管浏览器的默认刷新。表单通常用一个对象 State 保存，更新时展开旧值再覆盖目标字段，保留未变化字段。校验结果若能由数据即时推导，就直接在渲染中计算，无需额外 State。',
    flow: [
      '用一个对象 State 保存姓名和学习方向，输入值全部来自它。',
      '统一的 change 处理器根据 input 的 name 用计算属性键更新对应字段。',
      '提交前用 preventDefault 阻止刷新并校验姓名，通过后写入提交反馈。',
      '用 React 开发者工具确认输入时 State 与界面同步更新。',
    ],
    notes: [
      '受控输入的 value 不要在 undefined 与字符串之间来回切换，避免输入框失去控制。',
      '可即时推导的校验错误可直接在渲染中计算，不必复制到 State。',
      '禁用提交按钮只改善体验，最终校验仍需在提交处理器中执行。',
      '受控组件从 value 到 onChange 的链路要闭环，出现只读警告时先检查两者是否配对。',
    ],
    problem: '解决"多个输入框各自维护状态导致校验分散、提交后页面意外刷新"的问题。',
  },
{
    id: 'R_5',
    title: 'useEffect：外部同步、清理与生命周期',
    navTitle: 'Effect 同步与清理',
    category: '状态与副作用',
    path: '/react/r-5/effect-sync',
    summary: '用跨时区时钟、窗口尺寸与计时器演示 useEffect 的适用边界、依赖数组、清理函数以及挂载、更新、卸载的生命周期模式。',
    demo: null,
    demoComponent: R05R24Pair,
    code: R05Code,
    language: 'jsx',
    principle:
      'useEffect 只用于让组件与 React 之外的系统保持同步，例如定时器、浏览器事件、网络连接或第三方组件。React 在界面提交到 DOM 后运行 Effect，并在重新运行前或组件卸载时调用其返回的清理函数。空依赖只在挂载与卸载时运行，带依赖的 Effect 在依赖变化时先清理再重新同步；纯粹基于数据派生界面的计算不属于 Effect，应留在渲染阶段。',
    flow: [
      '组件挂载后 Effect 创建 setInterval，每秒更新 now 状态。',
      'Effect 返回 clearInterval 清理函数，组件卸载时取消计时器。',
      '切换时区只改变格式化参数，格式化在渲染阶段完成，不需要重建计时器。',
      '窗口尺寸与计时器 Effect 分别在依赖变化、卸载时执行清理，确认 setup 与 cleanup 成对出现。',
    ],
    notes: [
      '依赖数组必须包含 Effect 里读取的响应式值，不要靠"漏写依赖"来控制执行次数。',
      '开发环境 StrictMode 会额外跑一次 setup + cleanup 以暴露清理缺陷。',
      '筛选、排序、格式化等纯计算通常不需要 Effect。',
      '互不相关的副作用应拆成独立 Effect，只做挂载清理时依赖数组写空但不要省略第二个参数。',
    ],
    problem: '解决"何时应使用 Effect，以及如何避免订阅泄漏、旧同步逻辑残留"的问题。',
  },
{
    id: 'R_7',
    title: 'Context：跨层共享与 Provider 边界',
    navTitle: 'Context',
    category: '状态与副作用',
    path: '/react/r-7/context',
    summary: '用工作台主题演示 createContext、Provider 与深层组件订阅。',
    demo: null,
    demoComponent: R07Context,
    code: R07Code,
    language: 'jsx',
    principle:
      'Context 让深层组件直接读取上方最近的 Provider 提供的值，常用于主题、当前用户、地区等树级共享信息。Provider 的 value 变化时，读取该 Context 的组件会重新渲染。它解决逐层透传 Props 的问题，但不替代正常的 Props 组合与局部 State。',
    flow: [
      'createContext(null) 定义共享通道及其无 Provider 时的默认值。',
      'App 在 Provider 中提供当前主题 mode 与切换函数 toggle。',
      '深层组件 ActionPanel 用 useContext 读取最近的 Provider 并据此换肤。',
      '在没有 Provider 的场景下验证默认值路径是否安全。',
    ],
    notes: [
      '没有合理默认值时可给出 null，并在自定义读取函数里校验 Provider 是否存在。',
      'Provider 的 value 每次渲染若新建对象会触发所有消费者更新，性能敏感时需保持对象稳定。',
      '只在 Props 需要穿过很多不关心它的中间层时才考虑 Context。',
      'Context 适合低频变化的树级信息，高频变化的共享状态应交给专用状态库。',
    ],
    problem: '解决"共享数据需要跨越多层组件传递，产生 Props 逐层透传"的问题。',
  },
{
    id: 'R_8',
    title: '自定义 Hook：复用有状态逻辑',
    navTitle: '自定义 Hook',
    category: '状态与副作用',
    path: '/react/r-8/custom-hook',
    summary: '用浏览器在线状态订阅展示自定义 Hook 的命名、组合与每次调用的独立状态。',
    demo: null,
    demoComponent: R08CustomHook,
    code: R08Code,
    language: 'jsx',
    principle:
      '自定义 Hook 是以 use 开头、内部可调用其他 Hook 的普通函数，用于复用"有状态逻辑"而非共享同一份状态。每次调用它都会创建独立且隔离的 State 与 Effect，其内部 Hooks 状态由调用方组件独立管理。当多个组件同时订阅同一外部来源（如在线事件）时，它们各自订阅、各自清理。',
    flow: [
      'useOnlineStatus 用 useState 初始化当前在线状态。',
      '其内部的 Effect 订阅 online/offline 事件，并在卸载时移除监听。',
      '状态徽标与保存按钮分别调用该 Hook，复用同一套订阅逻辑但互不共享状态。',
      '两个组件各自渲染，确认它们的状态互不影响。',
    ],
    notes: [
      '自定义 Hook 名称必须以 use 开头，Hooks 规则和 lint 检查才会正确生效。',
      'Hook 只能在组件或其他 Hook 的顶层调用，不能放进条件分支和循环。',
      '复用 Hook 逻辑不等于共享状态；要共享状态需提升位置或改用外部状态源。',
      'Hook 内可以组合其他 Hook，但调用链上的每个 Hook 都受同样的规则约束。',
    ],
    problem: '解决"多个组件需要相同的状态订阅和清理逻辑，如何避免重复实现"的问题。',
  },
{
    id: 'R_9',
    title: 'useRef：DOM 引用与非渲染数据',
    navTitle: 'Ref 与 DOM',
    category: 'DOM 与命令式',
    path: '/react/r-9/ref-dom',
    summary: '用课程检索演示 useRef 聚焦输入框，以及保存不触发渲染的会话计数。',
    demo: null,
    demoComponent: R09RefDom,
    code: R09Code,
    language: 'jsx',
    principle:
      'useRef 在多次渲染间返回同一个可变对象。把 ref 对象传给 DOM 元素后，React 会维护其 current 指向对应节点，适合聚焦、滚动等命令式操作。修改 ref.current 不会触发重新渲染，因此它只应存放不参与界面输出的数据；凡是需要显示并随变化更新的值仍应放进 State。',
    flow: [
      'searchRef 关联搜索输入框，按钮通过 current 调用原生 focus。',
      'submitCountRef 记录本次会话的检索次数，变化本身不请求重渲染。',
      'result State 保存需要显示的反馈文案，由它驱动界面更新。',
      '对比 ref 与 state：一个静默更新，一个驱动重渲染。',
    ],
    notes: [
      '不要在渲染过程中随意读写 ref.current，初始化除外。',
      'DOM 层面的命令式操作应保持小而明确，不要绕过 React 手动维护组件已声明的节点结构。',
      '非受控输入可从 Ref 读取当前值，但复杂表单通常仍更适合受控 State。',
      '需要把 ref 传给自定义组件时，使用 React 19 的 ref prop 或 forwardRef。',
    ],
    problem: '解决"组件如何操作 DOM，以及如何保存无需驱动渲染的可变数据"的问题。',
  },
{
    id: 'R_10',
    title: 'memo、useMemo 与 useCallback：有依据地减少重复工作',
    navTitle: '记忆化优化',
    category: '并发与性能',
    path: '/react/r-10/memoization',
    summary: '用课程筛选与无关外观更新演示组件、计算结果与回调引用的记忆化边界。',
    demo: null,
    demoComponent: R10Memoization,
    code: R10Code,
    language: 'jsx',
    principle:
      'memo 在 Props 未变时跳过子组件重渲染，useMemo 缓存计算结果，useCallback 缓存函数引用。三者都是性能优化而非正确性工具：只有重渲染确实昂贵、依赖能保持稳定、且经过测量确认存在瓶颈时才值得引入。先让状态与 Effect 设计正确，再针对实测热点做记忆化。',
    flow: [
      'useMemo 只在 level 改变时重算可见课程列表。',
      'useCallback 让选择课程的函数引用保持稳定。',
      'CourseList 用 memo 包裹后，点击"刷新外观"不触发列表重渲染。',
      '用 Profiler 记录包裹前后提交耗时，量化优化收益。',
    ],
    notes: [
      '先用 React DevTools Profiler 定位瓶颈，再决定是否记忆化。',
      '每次新建的对象或函数会让浅比较(===)失效，依赖的稳定性比机械包裹更重要。',
      '如果去掉记忆化组件逻辑就不正确，应先修复状态与 Effect 的设计。',
      'memo 默认做浅比较，拆分 Props 传原始值比传打包对象更容易命中缓存。',
    ],
    problem: '解决"父组件频繁更新时，如何避免昂贵子树和计算做无意义重复工作"的问题。',
  },
{
    id: 'R_11',
    title: 'useDeferredValue 与 useTransition：延后非关键更新',
    navTitle: '延迟与过渡更新',
    category: '并发与性能',
    path: '/react/r-11/deferred-value',
    summary: '用大列表搜索演示 useDeferredValue 的后台追赶，以及 useTransition 的 isPending 与可中断过渡更新。',
    demo: null,
    demoComponent: R11R20Pair,
    code: R11Code,
    language: 'jsx',
    principle:
      'useDeferredValue 返回一个可落后于最新值的版本，让 React 优先提交输入这类紧急更新，再在后台"追赶"较慢的结果渲染；后台渲染可被新的输入中断。useTransition 返回 [isPending, startTransition]，把结果渲染这类非紧急更新放进 startTransition 即可被更紧急的输入中断。两者改善的是交互流畅度而非减少计算量，旧值与新值不一致时可弱化结果区域的视觉强调。',
    flow: [
      '受控输入同步更新 keyword，保证键入即时可见。',
      'deferredKeyword 由 useDeferredValue(keyword) 在后台追赶，并驱动结果筛选与 useMemo 重算。',
      '两值不同时用 isStale 置 aria-busy 并降低结果区域透明度。',
      '需要显式控制触发时机时改用 startTransition 包裹筛选更新，并用 isPending 弱化结果区域。',
    ],
    notes: [
      '不要把控制文本输入的 State 更新放进 Transition，键入必须同步更新。',
      'useDeferredValue 与 useTransition 都不会自动阻止请求；请求去重与防抖仍需单独处理。',
      '只有当结果渲染明显较慢时才有收益，小列表不值得使用。',
      '过渡更新可被中断但不会被丢弃，最终仍会提交一致的状态。',
    ],
    problem: '解决"昂贵的结果区域重新渲染时，如何让文本输入始终保持流畅响应"的问题。',
  },
{
    id: 'R_12',
    title: 'useSyncExternalStore：一致地订阅外部状态',
    navTitle: '外部 Store',
    category: '并发与性能',
    path: '/react/r-12/external-store',
    summary: '用独立计数 Store 演示 subscribe、getSnapshot 与多个消费者的一致更新。',
    demo: null,
    demoComponent: R12ExternalStore,
    code: R12Code,
    language: 'jsx',
    principle:
      'useSyncExternalStore 是 React 读取外部可变数据源的标准接口。subscribe 注册变化监听并返回取消函数，getSnapshot 返回当前不可变快照；只要数据未变，快照就必须保持 Object.is 相等，否则会触发无限循环。React 依据这份契约在并发渲染中拿到一致视图，适用于状态库、浏览器 API 与框架级缓存等场景。',
    flow: [
      '外部 Store 在 React 之外保存快照与监听器集合。',
      '两个 CounterView 通过同一组 subscribe/getSnapshot 订阅 Store。',
      'increment 替换快照并通知所有监听器，各消费者得到一致结果。',
      '人为让 getSnapshot 返回新对象，观察无限循环警告。',
    ],
    notes: [
      'getSnapshot 不应每次都创建新对象，否则等价性破坏会引发无限更新。',
      'subscribe 函数最好定义在组件外，避免每次渲染后重新订阅。',
      '服务端渲染时应提供 getServerSnapshot，确保水合初始内容一致。',
      '外部订阅的取消函数要真正生效，组件卸载后不再收到通知。',
    ],
    problem: '解决"React 如何可靠读取自身状态系统之外、会随时间变化的数据"的问题。',
  },
{
    id: 'R_13',
    title: 'createPortal：跨 DOM 层级渲染弹窗',
    navTitle: 'Portal',
    category: 'DOM 与命令式',
    path: '/react/r-13/portal',
    summary: '用发布确认弹窗演示内容脱离受裁切容器渲染，同时仍属于原 React 组件树。',
    demo: null,
    demoComponent: R13Portal,
    code: R13Code,
    language: 'jsx',
    principle:
      'createPortal 能把 React 子节点渲染到另一个 DOM 容器中，常用于弹窗、浮层和 Tooltip。Portal 只改变 DOM 的放置位置，不改变 React 树中的父子关系，因此 Context 依然可读取，事件也沿 React 树而非 DOM 树冒泡。可访问的弹窗还需要 dialog 语义、焦点管理与关闭策略。',
    flow: [
      '触发按钮位于 overflow 受限的容器中，点击更新 open 状态。',
      'ConfirmDialog 用 createPortal 把遮罩与弹窗渲染到 document.body，从而不被裁切。',
      '点击遮罩或确认/取消关闭弹窗，弹窗内部点击用 stopPropagation 阻止误关。',
      '用元素面板确认弹窗节点挂在 body 下、React 树结构不变。',
    ],
    notes: [
      'Portal 事件按 React 树而非 DOM 树冒泡，外层的事件处理器仍会收到事件。',
      '生产级弹窗应补充焦点陷阱、Escape 关闭与关闭后的焦点恢复。',
      '目标 DOM 节点须已存在；改变目标节点会重新创建 Portal 内容。',
      'Portal 内的键盘与焦点行为要单独测试，DOM 位置改变不影响事件冒泡路径。',
    ],
    problem: '解决"弹窗如何逃离 overflow、层叠上下文等 DOM 布局限制"的问题。',
  },
{
    id: 'R_14',
    title: 'lazy、Suspense 与 Error Boundary：加载与容错',
    navTitle: '懒加载与容错',
    category: '加载与容错',
    path: '/react/r-14/lazy-suspense',
    summary: '用延迟出现的学习报告与故障卡片演示 lazy 按需加载、Suspense 后备界面，以及错误边界隔离局部渲染错误。',
    demo: null,
    demoComponent: R14R15Pair,
    code: R14Code,
    language: 'jsx',
    principle:
      'lazy 把函数组件的加载函数延后到组件第一次需要渲染时才调用，并把结果缓存，避免重复执行。组件在等待代码加载时会"挂起"(suspend)，最近的 Suspense 边界随即显示 fallback，加载完成后切换到真实内容。加载 Promise 被拒绝时错误会交给最近的错误边界；类组件通过 getDerivedStateFromError 切换到后备界面，componentDidCatch 用于记录错误信息。',
    flow: [
      '初始不渲染报告组件，因此 lazy 的加载函数尚未被调用。',
      '点击"查看报告"后首次渲染 Lazy 组件，Suspense 立即显示后备状态。',
      '返回的 Promise 解析出 default 组件后，React 用真实报告替换 fallback。',
      '模拟课程卡片渲染抛错，确认错误边界只替换故障区域并保留重试路径。',
    ],
    notes: [
      'lazy 声明应放在组件外部，避免每次渲染重建组件并意外重置其状态。',
      'Suspense 不捕获 Effect 或普通事件处理器中的常规数据请求。',
      '错误边界应按功能区域布置，避免整页崩溃，也不宜细碎到难以维护。',
      '错误边界捕获不到事件处理器与大多数异步回调中的错误，这些场景需 try/catch 兜底。',
    ],
    problem: '解决"不常用功能如何延后加载，以及局部组件渲染失败时如何避免整页变白"的问题。',
  },
{
    id: 'R_16',
    title: 'useId：稳定连接标签与可访问性说明',
    navTitle: '可访问 ID',
    category: '可访问性与开发体验',
    path: '/react/r-16/accessible-id',
    summary: '用动态课程字段演示 useId 为 label、input 与辅助说明生成稳定且唯一的关联标识。',
    demo: null,
    demoComponent: R16AccessibleId,
    code: R16Code,
    language: 'jsx',
    principle:
      'useId 为组件实例生成稳定且唯一的 ID，适合连接 label 与表单控件、用 aria-describedby 指向说明文字，并兼容服务端渲染与水合。它不是列表 Key 的来源：Key 表达业务项目身份，应由数据本身提供；而 useId 表示当前组件树中用于可访问性关联的标识。',
    flow: [
      '每个 CourseField 调用 useId 得到自己的稳定前缀。',
      'label 的 htmlFor 与 input 的 id 指向同一值，建立可点击标签关系。',
      'aria-describedby 用 `${id}-hint` 连接输入框与辅助说明，新增字段也不会冲突。',
      '在辅助技术中验证每个输入都能读出关联的说明文字。',
    ],
    notes: [
      '不要用 useId 生成列表 Key，Key 应来自数据库 ID 等稳定业务数据。',
      '同一组件需要多个关联 ID 时，可基于一个 useId 返回的值拼接后缀。',
      '页面存在多个 React 根时可配置 identifierPrefix，避免跨根冲突。',
      'useId 生成的值只保证稳定与唯一，不要解析其内部格式。',
    ],
    problem: '解决"可复用表单组件如何生成唯一、稳定且适合水合的关联 ID"的问题。',
  },
{
    id: 'R_17',
    title: '事件处理：合成事件与处理器模式',
    navTitle: '事件处理',
    category: '组件与渲染',
    path: '/react/r-17/event-handler',
    summary: '用课程搜索和表单提交演示合成事件对象、preventDefault 与事件处理器设计。',
    demo: null,
    demoComponent: R17EventHandler,
    code: R17Code,
    language: 'jsx',
    principle:
      'React 的合成事件对象 (SyntheticEvent) 统一了浏览器原生事件的接口。React 17 起事件委托到根容器统一分发；事件处理器直接接收合成事件对象，可读取 type、target 等字段。表单提交等场景需调用 preventDefault 阻止浏览器默认行为；事件处理器通过闭包直接访问组件状态，无需手动绑定 this。',
    flow: [
      '点击与输入事件通过合成事件对象读取类型和作用目标信息。',
      '表单提交调用 preventDefault 阻止浏览器刷新，改由提交处理器驱动界面更新。',
      '键盘事件通过 event.key 过滤特定按键，例如 Enter 触发记录。',
      '在事件处理器中打印 event.type 与 event.target，核对来源。',
    ],
    notes: [
      'React 关闭了早期的合成事件池化，不必再调用 persist；异步读取事件字段也安全。',
      '事件委托挂在根容器上，因此不必担心为大量元素逐个绑定监听器。',
      '事件处理器应保持简洁，复杂逻辑可拆为独立函数或调用组件方法。',
      '需要访问原生事件时用 event.nativeEvent，但多数场景合成事件已足够。',
    ],
    problem: '解决"表单提交导致整页刷新、事件信息读取方式在浏览器间不统一"的问题。',
  },
{
    id: 'R_19',
    title: '组件组合：children 与 render props 模式',
    navTitle: '组件组合',
    category: '组件与渲染',
    path: '/react/r-19/composition',
    summary: '用课程卡片与统计面板演示 children 插槽和 render props 两种组合方式。',
    demo: null,
    demoComponent: R19Composition,
    code: R19Code,
    language: 'jsx',
    principle:
      '"组合优于继承"是 React 组件设计的核心理念。children 是最直接的组合方式，父组件通过 props.children 接收并放置子元素；render props 则通过函数类型的 prop 让调用方决定子组件的渲染内容，适合需要把父组件的数据或状态传回子内容进行渲染的场景。两者都能减少深层 Props 透传。',
    flow: [
      'Card 通过 children 接收按钮与说明文字，父组件决定具体内容。',
      'StatsLayout 通过 renderStats 函数 prop 获取统计项数组，由调用方决定渲染哪些指标。',
      '两种容器组件都只管布局与结构，内容完全交给调用方。',
      '用同一容器分别传入不同内容，验证外壳无需改动。',
    ],
    notes: [
      'children 适合简单插槽，render props 适合需要父组件状态参与渲染的场景。',
      'render props 函数不要在渲染中每次新建，以免连累子组件的 memo 判断。',
      'Hooks 已解决多数状态逻辑复用需求，render props 的适用场景相应收窄。',
      '组合方案要与具体数据解耦，容器只负责结构、内容与数据都由调用方提供。',
    ],
    problem: '解决"容器外壳相似而内容各异时，每换一种内容就要复制一份容器组件"的问题。',
  },
{
    id: 'R_21',
    title: 'useImperativeHandle 与 forwardRef：命令式 Ref 接口',
    navTitle: 'Ref 命令式接口',
    category: 'DOM 与命令式',
    path: '/react/r-21/imperative-handle',
    summary: '用搜索框与报名表单演示 useImperativeHandle 限定父组件能调用的方法，以及 forwardRef 把 ref 转发给内部 DOM 节点。',
    demo: null,
    demoComponent: R21R22Pair,
    code: R21Code,
    language: 'jsx',
    principle:
      'useImperativeHandle 与 forwardRef 搭配，可精确限定父组件通过 ref 能访问到的方法。默认 ref 指向组件内部的某个 DOM 节点；useImperativeHandle 会把它重定向为自定义对象，只暴露必要的命令式操作，从而保留封装。forwardRef 让自定义组件把接收到的 ref 转发给内部的 DOM 节点。React 19 还把 ref 变成了函数组件的普通 prop，不再强制使用 forwardRef。',
    flow: [
      'SearchInput 接收 ref，并在内部用另一个 ref 指向真实 input 元素。',
      'useImperativeHandle 只暴露 focus、clear、getValue 三个方法。',
      '父组件经 searchRef.current 调用这些方法，无法触碰内部 DOM 结构。',
      '自定义输入组件用 forwardRef 把 ref 转发到内部 input，父组件经 ref.current 聚焦或读取值。',
    ],
    notes: [
      'useImperativeHandle 的工厂函数应返回稳定对象，避免给父组件造成不必要的变化。',
      '命令式接口应作为最后手段；能用声明式 Props 与 State 表达的需求优先声明式解决。',
      'ref 转发跨多层组件时每一层都要转发一步，React 19 也可把 ref 当作普通 prop。',
      '暴露的方法命名以使用意图为准（focus、clear），不要泄露内部实现细节。',
    ],
    problem: '解决"父组件如何调用子组件的命令式方法，同时不暴露内部实现细节"的问题。',
  },
{
    id: 'R_23',
    title: 'StrictMode：开发环境额外检查',
    navTitle: '严格模式',
    category: '可访问性与开发体验',
    path: '/react/r-23/strict-mode',
    summary: '用 Effect 执行日志演示 StrictMode 的双重调用机制如何暴露清理缺失。',
    demo: null,
    demoComponent: R23StrictMode,
    code: R23Code,
    language: 'jsx',
    principle:
      'StrictMode 是仅用于开发环境的检查工具，本身不渲染任何可见内容。它会让组件函数体、useState 初始化函数、reducer 以及 Effect 的 setup/cleanup 各额外执行一次，从而暴露不纯的渲染、缺少清理的订阅和不合规的 ref 用法。双重调用只在开发构建生效，不影响生产环境。',
    flow: [
      '开启 StrictMode 后，Effect 会执行两次 setup + cleanup 的完整配对。',
      '通过日志对比开启与关闭 StrictMode 时 Effect 的执行次数差异。',
      '清理函数缺失或不够完整的问题，会在第二次 setup 前被暴露出来。',
      '修复清理逻辑后，确认双重执行不再产生可见副作用。',
    ],
    notes: [
      'StrictMode 只作用于开发阶段，生产构建不会产生双重调用。',
      '看到 Effect 重复执行，说明 React 正在帮你验证清理函数是否写对。',
      '不要为了消除双重调用而移除 StrictMode，应修复触发问题的根本代码。',
      '初始化顺序问题也可用 StrictMode 暴露：依赖副作用顺序的代码通常是设计问题。',
    ],
    problem: '解决"如何在开发阶段尽早发现不纯渲染和 Effect 清理缺失"的问题。',
  },
{
    id: 'R_25',
    title: 'Zustand：细粒度 Selector 与 Middleware',
    navTitle: 'Zustand 订阅与中间件',
    category: '状态库',
    path: '/react/r-25/zustand-selectors',
    summary: '用购物车 Store 与课程进度演示 Zustand 的细粒度 selector 订阅，以及 subscribeWithSelector 中间件的选择性订阅。',
    demo: null,
    demoComponent: R25R26Pair,
    code: R25Code,
    language: 'jsx',
    principle: 'Zustand 用 create 在 React 树之外构建独立 Store，通过 useStore 的 Hook API 暴露给组件。每个 selector 把状态投影成最小切片；切片引用不变时组件就不会重渲染，从而把无关更新的影响隔离在真正读取它的组件内。中间件包裹 create 的创建器，为其追加持久化、DevTools 或 subscribeWithSelector 等横切能力，而组件的消费方式保持不变。',
    flow: ['create((set) => (…)) 定义状态与修改函数。', '组件用多个 selector 分别取 items、coupon 等最小切片。', 'action 用 set 合并新状态，只有读取相关切片的组件响应更新。', '用 subscribeWithSelector 按 selector 订阅 progress，回调同时拿到变化前后的值并在清理阶段取消订阅。'],
    notes: ['selector 若返回新对象（如每次新建数组），需要关注相等比较是否导致无限重渲染。', 'Store 不依赖 React 树，可在组件外直接调用 getState().action 操作。', '不读取的状态切片变化不会让该组件重渲染。', '不同中间件的组合顺序会影响类型推导，持久化要用固定存储 Key 并规划 migrate。'],
    problem: '解决"如何以很少样板代码共享状态、精确控制重渲染，并按切片监听变化"的问题。',
  },
{
    id: 'R_27',
    title: 'Jotai 与 Recoil：原子状态与派生图',
    navTitle: '原子状态',
    category: '状态库',
    path: '/react/r-27/jotai-atoms',
    summary: '用数量、价格与总价 Atom 演示 Jotai 的原子组合与依赖追踪，并用 Recoil 的 Atom/Selector 理解细粒度派生更新。',
    demo: null,
    demoComponent: R27R33Pair,
    code: R27Code,
    language: 'jsx',
    principle: 'Jotai 以 atom 为最小状态单元：基础 atom 直接持有值，派生(derived) atom 通过读取其他 atom 自动建立依赖图。某个原子变化时，只有依赖链路上真正受影响的消费者会被触发更新，从而实现细粒度的按需重渲染。Recoil 同样以 Atom 为最小状态单元、Selector 为派生状态，组件只订阅自己读取的原子及其派生链。',
    flow: ['创建 countAtom、priceAtom 两个可写基础原子。', '用 totalAtom = atom((get) => …) 读取二者构造派生原子。', '组件用 useAtom 读写基础原子、useAtomValue 只读派生值，驱动界面显示总价。', '用 Recoil 的 atom/selector 定义原始状态与完成率，只更新一个 atom 验证未依赖它的组件不重渲染。'],
    notes: ['atom 应在组件外部定义以保持引用稳定，避免每次渲染重建。', '需要动态创建大量原子时可引入 atomFamily 管理。', '派生原子本身不可直写，其值始终来自依赖原子的当前状态。', 'Recoil 与 React 生态深度绑定，选型时需评估其维护活跃度与替代方案。'],
    problem: '解决"复杂页面如何把状态拆成可组合、可追踪、按需更新的细粒度原子单元"的问题。',
  },
{
    id: 'R_28',
    title: 'Jotai 异步 Atom 与 Suspense',
    navTitle: 'Jotai 异步 Atom',
    category: '状态库',
    path: '/react/r-28/jotai-async-atoms',
    summary: '用异步课程 Atom 演示依赖驱动的刷新与 Suspense 等待边界。',
    demo: null,
    demoComponent: R28JotaiAsyncAtoms,
    code: R28Code,
    language: 'jsx',
    principle: 'Jotai 的读取函数可以返回 Promise，从而定义"异步原子"；它一旦被读取就会执行，执行中的 Promise 会触发 useAtomValue 所在的组件进入挂起(suspend)状态，由外层 Suspense 展示后备界面。当异步 atom 读取了某个刷新原子时，只要刷新原子变化，异步 atom 就会失效并重新计算。',
    flow: ['refreshAtom 作为刷新依赖，异步 coursesAtom 读取它以建立重算关系。', '组件读取异步 atom 时会挂起，外层 Suspense 显示"加载中"后备。', '点击"重新读取"更新 refreshAtom，使异步 atom 失效并重新拉取课程。', '验证多个组件同时读取同一异步原子时只发起一次请求。'],
    notes: ['异步 atom 适合以原子为依赖、天然可组合的加载场景。', '并发取消、去重等更复杂的服务端缓存语义，仍需交给专门请求库。', '同一异步 atom 被多个组件读取时，结果会被共享缓存，避免重复执行。', '异步原子需要失败兜底：出错时可转交错误边界或展示重试入口。'],
    problem: '解决"原子化状态如何以可组合的方式表达异步数据及其重新加载流程"的问题。',
  },
{
    id: 'R_29',
    title: 'Redux Toolkit、XState 与 Overmind：集中式与结构化状态',
    navTitle: '集中式状态',
    category: '状态库',
    path: '/react/r-29/redux-toolkit',
    summary: '用报名 Slice、结算状态机与分形 Store 演示 Redux Toolkit 的单向数据流、XState 的合法状态转换与 Overmind 的命名空间组织。',
    demo: null,
    demoComponent: R29R30R35Pair,
    code: R29Code,
    language: 'jsx',
    principle: 'Redux Toolkit 用 createSlice 把初始状态与 reducer 放在一起，同时自动生成对应的 action；configureStore 再组合成单一 store。所有改动都必须经过 dispatch 走一遍可追踪的单向数据流，配合 DevTools 可回溯每一次变更。XState 用 createMachine 显式列举互斥状态与可接受事件，使非法转换在建模阶段就被排除；Overmind 则以命名空间聚合 state、actions、derived 与 effects，让副作用独立成层。',
    flow: ['createSlice 定义初始状态与 enroll/reset 等 reducer，并自动生成 actions.enroll 等对象。', 'configureStore 组合业务 Slice，用 Provider 把 store 提供给组件树。', '组件用 useSelector 读取名额与报名数，用 useDispatch 发起 action。', '结算流程用状态机声明 editing/submitting/failure/success 的合法转换，非法事件被拒绝而不是产生组合态。'],
    notes: ['reducer 里"看似直接修改"的写法由 Immer 自动转成不可变更新，无需手写 spread。', '不要把光标位置、临时输入等短暂 UI 状态塞进全局 Store。', '简单布尔或极少状态不必引入状态机，应按流程复杂度选型。', 'Overmind 的 actions 只改 state，网络、存储等副作用一律放进 effects。'],
    problem: '解决"大型项目如何获得可预测、可回溯且能排除非法组合的集中式状态流"的问题。',
  },
{
    id: 'R_31',
    title: 'Valtio 与 MobX：Proxy 与 Observable 响应式状态',
    navTitle: '响应式状态',
    category: '状态库',
    path: '/react/r-31/valtio',
    summary: '用 Valtio 的 proxy/snapshot 与 MobX 的 Observable/observer 理解自动追踪依赖的响应式状态管理。',
    demo: null,
    demoComponent: R31R34Pair,
    code: R31Code,
    language: 'jsx',
    principle: 'Valtio 用 Proxy 包裹状态对象，直接赋值属性即触发更新，无需 Provider 与 reducer 样板代码；组件再用 useSnapshot 取到不可变快照用于渲染，快照层会自动追踪组件实际读到的路径，从而把重渲染收敛到真正依赖它的组件。MobX 用 makeAutoObservable 把类字段变为 observable，action 统一修改状态、computed 派生只读值并缓存、observer 组件按实际读取的字段自动订阅。',
    flow: ['用 proxy 创建响应式状态对象，跨组件共享引用。', '在组件或动作里直接修改 proxy 的属性（如 state.count++）。', '组件用 useSnapshot 读取并渲染，系统按所读路径自动收集依赖。', '在 MobX 中把批量修改包进 action/runInAction，确认统计值只重算一次、列表只重渲染一轮。'],
    notes: ['Valtio 提供 subscribe 订阅任意路径的变化，便于接入调试或持久化。', '不要把 proxy 对象整体放进 React Context，快照隔离更适合组件消费。', 'useSnapshot 的可变性对象不宜作 props 长期保存，尽量保持组件使用模式一致。', 'MobX 的依赖是隐式收集的，可配合 enforceActions 保证状态只在 action 中被修改。'],
    problem: '解决"如何用最少样板代码获得自动追踪依赖的响应式状态，并让变更链路可追踪"的问题。',
  },
{
    id: 'R_32',
    title: 'TanStack Query 服务端状态',
    navTitle: 'TanStack Query',
    category: '状态库',
    path: '/react/r-32/tanstack-query',
    summary: '用缓存策略、乐观更新和后台同步管理服务端数据状态。',
    demo: null,
    demoComponent: R32TanStackQuery,
    code: R32Code,
    language: 'jsx',
    principle: 'TanStack Query 把"服务端数据"看作缓存而非组件本地状态：staleTime 决定数据在多久内视为新鲜、期间不重复请求，gcTime 控制不再使用后的回收时机。useQuery 负责读取与缓存，useMutation 负责写入，配合乐观更新可在请求完成前先更新界面、失败时回滚。',
    flow: ['用 QueryClient 统一配置 staleTime、gcTime 与窗口聚焦时是否重取。', 'useQuery 以 courses 作为 queryKey 获取并缓存课程列表。', 'useMutation 上传新课程：onMutate 先写入乐观值，onError 回滚，onSettled 使缓存失效以对齐服务端。', '断网后提交，验证乐观更新被回滚且提示可重试。'],
    notes: ['服务端状态与本地 UI 状态分开管理，避免重复当"事实来源"。', 'queryKey 的结构直接决定缓存命中与失效粒度，需稳定且能标识查询语义。', 'staleTime 控制请求频率，gcTime 控制缓存保留时长；均需针对数据特性取值。', '失效策略按数据变化频率设计，频繁失效会让缓存形同虚设。'],
    problem: '解决"如何高效管理服务端数据的缓存、新鲜度、同步以及乐观更新体验"的问题。',
  }
]
