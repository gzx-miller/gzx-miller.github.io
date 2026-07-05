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

const S01StateBoundaries = createDemo('S01StateBoundaries')
const S01Code = createCodeLoader('S01StateBoundaries.vue')
const S02PiniaSetupStore = createDemo('S02PiniaSetupStore')
const S02Code = createCodeLoader('S02PiniaSetupStore.vue')
const S03PiniaSubscriptions = createDemo('S03PiniaSubscriptions')
const S03Code = createCodeLoader('S03PiniaSubscriptions.vue')
const S04ZustandSelectors = createDemo('S04ZustandSelectors')
const S04Code = createCodeLoader('state-react/S04ZustandSelectors.js')
const S05ZustandMiddleware = createDemo('S05ZustandMiddleware')
const S05Code = createCodeLoader('state-react/S05ZustandMiddleware.js')
const S06JotaiAtoms = createDemo('S06JotaiAtoms')
const S06Code = createCodeLoader('state-react/S06JotaiAtoms.js')
const S07JotaiAsyncAtoms = createDemo('S07JotaiAsyncAtoms')
const S07Code = createCodeLoader('state-react/S07JotaiAsyncAtoms.js')
const S08ReduxToolkit = createDemo('S08ReduxToolkit')
const S08Code = createCodeLoader('state-react/S08ReduxToolkit.js')
const S09XStateMachine = createDemo('S09XStateMachine')
const S09Code = createCodeLoader('state-react/S09XStateMachine.js')
const S10StoreSelection = createDemo('S10StoreSelection')
const S10Code = createCodeLoader('S10StoreSelection.vue')
const S11VuexMigration = createDemo('S11VuexMigration')
const S11Code = createCodeLoader('S11VuexMigration.vue')
const S12Valtio = createDemo('S12Valtio')
const S12Code = createCodeLoader('S12Valtio.vue')
const S13TanStackQuery = createDemo('S13TanStackQuery')
const S13Code = createCodeLoader('S13TanStackQuery.vue')
const S14Signals = createDemo('S14Signals')
const S14Code = createCodeLoader('S14Signals.vue')
const S15Persistence = createDemo('S15Persistence')
const S15Code = createCodeLoader('S15Persistence.vue')
const S16Comparison = createDemo('S16Comparison')
const S16Code = createCodeLoader('S16Comparison.vue')
const S17PiniaPlugin = createDemo('S17PiniaPlugin')
const S17Code = createCodeLoader('S17PiniaPlugin.vue')
const S18PiniaGetters = createDemo('S18PiniaGetters')
const S18Code = createCodeLoader('S18PiniaGetters.vue')
const S19PiniaActions = createDemo('S19PiniaActions')
const S19Code = createCodeLoader('S19PiniaActions.vue')
const S20PiniaDevtools = createDemo('S20PiniaDevtools')
const S20Code = createCodeLoader('S20PiniaDevtools.vue')
const S21PiniaTesting = createDemo('S21PiniaTesting')
const S21Code = createCodeLoader('S21PiniaTesting.vue')
const S22Recoil = createDemo('S22Recoil')
const S22Code = createCodeLoader('S22Recoil.vue')
const S23Mobx = createDemo('S23Mobx')
const S23Code = createCodeLoader('S23Mobx.vue')
const S24Overmind = createDemo('S24Overmind')
const S24Code = createCodeLoader('S24Overmind.vue')


export const lessons: Lesson[] = [
{
    id: 'S_01', title: '先判断状态归属，再选择 Store', navTitle: '状态边界', category: '设计原则',
    path: '/state-management/s-1/state-boundaries', summary: '区分组件状态、URL 状态、客户端共享状态和服务端缓存状态。',
    demo: S01StateBoundaries, code: S01Code, language: 'vue',
    principle: 'Store 只应承载需要跨组件共享、具有业务生命周期的客户端状态；表单瞬时输入、URL 参数、组件私有 UI 状态和远程缓存各有更合适的归属——把它们一股脑塞进 Pinia 会让状态臃肿、不可维护，正确做法是先画"状态归属图"再选工具。',
    flow: ['明确每段状态的唯一事实来源（组件、URL、Store、远程）。', '判断共享范围与生命周期。', '选择最小且匹配语义的状态工具。'],
    notes: ['全局可访问不等于应该全局存储，组件状态用 ref 即可。', '远程数据需要缓存失效、请求去重和重试策略，交给 Vue Query 更合适。', 'URL 状态属于"可分享的视图"，应通过 query 表达。'],
    problem: '解决"什么状态应该进入 Store，以及什么时候根本不需要 Store"的问题。',
  },
{
    id: 'S_02', title: 'Pinia Setup Store 与 storeToRefs', navTitle: 'Pinia Setup Store', category: 'Pinia',
    path: '/state-management/s-2/pinia-setup-store', summary: '用学习计划实现组合式 Store、派生值、Action 和响应式解构。',
    demo: S02PiniaSetupStore, code: S02Code, language: 'vue',
    principle: 'Setup Store 以 ref、computed 和函数分别表达 state、getter 与 action；storeToRefs 在解构时保留响应性，方法则直接从 Store 读取。',
    flow: ['在 defineStore 回调中声明响应式状态。', '用 computed 创建派生数据。', '组件通过 storeToRefs 安全解构状态。'],
    notes: ['不要直接解构 Store 的响应式属性。', '业务修改流程应封装为 action。'],
    problem: '解决"如何用组合式 API 组织 Pinia Store 并避免解构失去响应性"的问题。',
  },
{
    id: 'S_03', title: 'Pinia 批量更新、订阅与副作用', navTitle: 'Pinia 订阅', category: 'Pinia',
    path: '/state-management/s-3/pinia-subscriptions', summary: '通过 $patch 和 $subscribe 记录批量状态变更。',
    demo: S03PiniaSubscriptions, code: S03Code, language: 'vue',
    principle: '$patch 可把同一业务动作中的多个修改合并表达，$subscribe 观察状态提交，适合持久化、审计和同步等基础设施副作用。',
    flow: ['用 action 或 $patch 完成一组原子修改。', '$subscribe 接收 mutation 与新状态。', '组件卸载时取消临时订阅。'],
    notes: ['订阅回调不应再次无条件修改同一状态。', 'SSR 持久化需要区分服务端和客户端。'],
    problem: '解决"如何观察 Pinia 变化并接入持久化或审计"的问题。',
  },
{
    id: 'S_04', title: 'Zustand Store 与细粒度 Selector', navTitle: 'Zustand Selector', category: '轻量 React Store',
    path: '/state-management/s-4/zustand-selectors', summary: '用购物车 Store 展示 Hook API、Action 和 selector 订阅。',
    demo: S04ZustandSelectors, code: S04Code, language: 'jsx',
    principle: 'Zustand 创建独立于 React 树的外部 Store，组件通过 selector 订阅所需切片；切片结果不变时可以避免无关重渲染。',
    flow: ['create 定义状态和修改函数。', '组件用 selector 读取最小切片。', 'Action 通过 set 基于前一状态更新。'],
    notes: ['返回新对象的 selector 要关注相等比较。', 'Store 可以在 React 外通过 getState 使用。'],
    problem: '解决"React 中如何以很少样板代码共享状态并控制重渲染"的问题。',
  },
{
    id: 'S_05', title: 'Zustand Middleware 与选择性订阅', navTitle: 'Zustand Middleware', category: '轻量 React Store',
    path: '/state-management/s-5/zustand-middleware', summary: '使用 subscribeWithSelector 只监听课程进度变化。',
    demo: S05ZustandMiddleware, code: S05Code, language: 'jsx',
    principle: 'Zustand middleware 包装 Store 创建器以增加持久化、DevTools、Immer 或选择性订阅等横切能力，而不改变组件消费方式。',
    flow: ['用 middleware 包装状态创建器。', '订阅特定 selector 的前后值。', '在 effect 清理阶段取消订阅。'],
    notes: ['middleware 组合顺序会影响类型和行为。', '持久化前要设计版本迁移策略。'],
    problem: '解决"如何扩展 Zustand 并监听特定状态变化"的问题。',
  },
{
    id: 'S_06', title: 'Jotai 原子状态与派生图', navTitle: 'Jotai Atom', category: '原子化状态',
    path: '/state-management/s-6/jotai-atoms', summary: '用数量、价格和总价 Atom 理解原子组合与依赖追踪。',
    demo: S06JotaiAtoms, code: S06Code, language: 'jsx',
    principle: 'Jotai 以 atom 为最小状态单位，派生 atom 通过读取其他 atom 自动形成依赖图，只有受影响的消费者更新。',
    flow: ['创建可写基础 atom。', '读取基础 atom 构造派生 atom。', '组件用 useAtom 或专用读写 Hook 消费。'],
    notes: ['atom 配置应在组件外保持引用稳定。', '大量动态 atom 可使用 atomFamily 管理。'],
    problem: '解决"复杂页面如何把状态拆成可组合的细粒度单元"的问题。',
  },
{
    id: 'S_07', title: 'Jotai 异步 Atom 与 Suspense', navTitle: 'Jotai 异步 Atom', category: '原子化状态',
    path: '/state-management/s-7/jotai-async-atoms', summary: '通过异步课程 Atom 展示依赖刷新、Suspense 和加载状态。',
    demo: S07JotaiAsyncAtoms, code: S07Code, language: 'jsx',
    principle: '异步 atom 的读取函数可以返回 Promise，并依赖其他 atom 触发重新计算；React Suspense 负责等待期间的界面边界。',
    flow: ['异步 atom 读取刷新依赖。', '组件读取时进入 Suspense。', '更新刷新 atom 使异步数据失效并重算。'],
    notes: ['异步 atom 适合原子依赖场景。', '复杂服务端缓存仍需专门请求库。'],
    problem: '解决"原子化状态如何表达异步依赖和重新加载"的问题。',
  },
{
    id: 'S_08', title: 'Redux Toolkit 的 Slice 与单向数据流', navTitle: 'Redux Toolkit', category: '结构化状态',
    path: '/state-management/s-8/redux-toolkit', summary: '用报名 Slice 展示 reducer、action、selector 与 Provider。',
    demo: S08ReduxToolkit, code: S08Code, language: 'jsx',
    principle: 'Redux Toolkit 用 createSlice 同时生成 reducer 和 action，所有变更经过可追踪的 dispatch 流程，适合需要严格约束和强大工具链的团队。',
    flow: ['Slice 定义初始状态和 reducer。', 'configureStore 组合业务 Slice。', '组件通过 selector 读取并 dispatch action。'],
    notes: ['Reducer 中看似直接修改由 Immer 转为不可变更新。', '避免把所有临时 UI 状态放进 Redux。'],
    problem: '解决"大型 React 项目如何获得可预测状态流和统一调试工具"的问题。',
  },
{
    id: 'S_09', title: 'XState 有限状态机与合法转换', navTitle: 'XState 状态机', category: '结构化状态',
    path: '/state-management/s-9/xstate-machine', summary: '用结算流程限制 editing、submitting、failure 与 success 的转换。',
    demo: S09XStateMachine, code: S09Code, language: 'jsx',
    principle: '状态机显式列举有限状态和可接受事件，让不合法转换在定义阶段就被禁掉；XState 通过 createMachine 描述状态图，支持守卫、副作用（actor/invoke）、并行状态和可视化编辑，适合结算、审批、多步骤流程等业务关键路径。',
    flow: ['列出业务上互斥的状态和它们之间允许的转换。', '为每个状态声明可处理事件和守卫条件。', '组件订阅 state 快照并通过 send 触发事件。'],
    notes: ['简单布尔值用 ref 即可，不需要引入状态机。', '副作用通过 invoke 建模，组件通过 useActor 订阅快照。', '状态图可与团队业务画等号，便于产品、测试对齐认知。'],
    problem: '解决"多个布尔值或字段自由组合出现非法流程状态"的问题。',
  },
{
    id: 'S_10', title: '状态管理方案选型矩阵', navTitle: '方案选型', category: '选型与架构',
    path: '/state-management/s-10/store-selection', summary: '按框架、状态粒度、流程复杂度和团队约束比较常见方案。',
    demo: S10StoreSelection, code: S10Code, language: 'vue',
    principle: 'Pinia、Zustand、Jotai、Redux Toolkit 与 XState 解决的问题模型不同；选型应从事实来源、更新粒度、流程约束和调试需求出发。',
    flow: ['先区分客户端状态与服务端状态。', '评估框架、共享范围和更新频率。', '用最小原型验证 DevTools、SSR 和测试体验。'],
    notes: ['不要仅以包体积决定架构。', '迁移成本通常高于初始接入成本。'],
    problem: '解决"Pinia、Zustand、Jotai、Redux Toolkit 和 XState 到底如何选择"的问题。',
  },
{
    id: 'S_11', title: 'Vuex 到 Pinia 迁移指南', navTitle: 'Vuex 迁移', category: 'Vue Store',
    path: '/state-management/s-11/vuex-migration', summary: '对比 Vuex 模块与 Pinia Store 的模式差异，制定渐进迁移策略。',
    demo: S11VuexMigration, code: S11Code, language: 'vue',
    principle: 'Vuex 的 mutations/actions/getters 在 Pinia 中简化为直接的 state/action/getter；Pinia 支持多个独立 Store，无需嵌套模块，TypeScript 推导更好。',
    flow: ['先理解 Vuex 和 Pinia 的 API 映射关系。', '从最独立的模块开始逐步迁移。', '最终移除 Vuex 依赖，完成切换。'],
    notes: ['Pinia 没有 mutations，所有修改都在 action 中完成。', '可以使用 pinia-compat 在迁移期间兼容旧代码。'],
    problem: '解决"Vuex 项目如何安全地渐进迁移到 Pinia"的问题。',
  },
{
    id: 'S_12', title: 'Valtio 与 Proxy 响应式状态', navTitle: 'Valtio', category: '轻量 React Store',
    path: '/state-management/s-12/valtio', summary: '用 Valtio 的 proxy/snapshot 模式管理 React 状态，理解 Proxy 响应式原理。',
    demo: S12Valtio, code: S12Code, language: 'jsx',
    principle: 'Valtio 用 Proxy 包裹状态对象，直接修改即触发更新；snapshot 获取不可变快照用于渲染，自动追踪依赖关系避免不必要的重渲染。',
    flow: ['用 proxy 创建响应式状态。', '直接修改 proxy 对象的属性。', '用 useSnapshot 在组件中读取并追踪依赖。'],
    notes: ['Valtio 的 subscribe 可以监听任意路径变化。', 'proxy 对象不适合放在 React context 中。'],
    problem: '解决"如何用最少的样板代码实现 React 的响应式状态管理"的问题。',
  },
{
    id: 'S_13', title: 'TanStack Query 服务端状态', navTitle: 'TanStack Query', category: '服务端状态',
    path: '/state-management/s-13/tanstack-query', summary: '用缓存策略、乐观更新和后台同步管理服务端数据状态。',
    demo: S13TanStackQuery, code: S13Code, language: 'jsx',
    principle: 'TanStack Query 把服务端数据视为缓存而非状态；staleTime 和 cacheTime 控制新鲜度，useMutation 处理写入，optimistic update 提供即时反馈。',
    flow: ['用 useQuery 获取和缓存服务端数据。', '用 useMutation 处理创建和更新操作。', '配置乐观更新和回滚策略。'],
    notes: ['服务端状态和客户端状态应分开管理。', 'Query Key 的设计直接影响缓存命中率。'],
    problem: '解决"如何高效管理服务端数据的缓存、同步和乐观更新"的问题。',
  },
{
    id: 'S_14', title: 'Signals 信号响应式模式', navTitle: 'Signals', category: '设计原则',
    path: '/state-management/s-14/signals', summary: '理解 Signal 的自动追踪和细粒度更新，对比 ref 和 computed。',
    demo: S14Signals, code: S14Code, language: 'vue',
    principle: 'Signals 是响应式的基础原语：信号值变化时自动通知依赖者更新，无需手动订阅；computed 派生新信号，effect 执行副作用，三者构成完整的响应式图。',
    flow: ['创建基础信号存储原始值。', '用 computed 派生计算信号。', '用 effect 响应信号变化执行副作用。'],
    notes: ['Angular、Solid、Preact 等都采用了 Signals 模式。', 'Vue 的 ref/computed/watchEffect 本质上就是 Signals。'],
    problem: '解决"什么是 Signals 以及它与传统状态管理有何不同"的问题。',
  },
{
    id: 'S_15', title: '状态持久化与水合策略', navTitle: '持久化水合', category: '设计原则',
    path: '/state-management/s-15/persistence', summary: '设计 localStorage 同步、SSR 水合和版本迁移的可靠策略。',
    demo: S15Persistence, code: S15Code, language: 'vue',
    principle: '状态持久化需要在应用启动时从存储恢复状态；SSR 场景下水合阶段必须保证服务端和客户端状态一致；版本迁移处理数据结构随时间变化的兼容性。',
    flow: ['序列化状态到 localStorage 或 IndexedDB。', '启动时恢复状态并处理水合不匹配。', '检测版本差异并执行迁移逻辑。'],
    notes: ['敏感数据不应存入 localStorage。', 'SSR 水合不匹配会导致 UI 闪烁或功能异常。'],
    problem: '解决"如何让状态在刷新、SSR 和版本升级后正确恢复"的问题。',
  },
{
    id: 'S_16', title: '状态管理全景对比与选型', navTitle: '全景对比', category: '选型与架构',
    path: '/state-management/s-16/comparison', summary: '从包体积、学习曲线、SSR、TypeScript 等维度对比所有主流方案。',
    demo: S16Comparison, code: S16Code, language: 'vue',
    principle: '没有万能的状态管理方案；选择应基于框架生态、状态模型复杂度、团队熟悉度和运维需求；评分矩阵帮助量化比较，但最终需要用最小原型验证。',
    flow: ['列出评估维度和权重。', '对每个方案在各维度打分。', '用加权总分辅助决策并用原型验证。'],
    notes: ['评估维度应包括包体积、TypeScript、SSR、DevTools 和学习曲线。', '技术选型不应只看当前需求，还要考虑未来扩展。'],
    problem: '解决"面对众多状态管理方案如何系统化地做出最优选择"的问题。',
  },
{
    id: 'S_17', title: 'Pinia 插件：统一扩展所有 Store', navTitle: 'Pinia 插件', category: 'Pinia',
    path: '/state-management/s-17/pinia-plugin',
    summary: '用登录日志和错误追踪场景展示如何编写 Pinia 插件，统一拦截 actions 和状态变化。',
    demo: S17PiniaPlugin, code: S17Code, language: 'vue',
    principle:
      'Pinia 插件是一个接收 pinia 实例的函数，通过 $subscribe 监听状态变化、通过 $onAction 拦截 actions 调用，可以在插件内部为所有 store 统一添加持久化、日志、错误上报等横切关注点。',
    flow: [
      '创建插件函数，接收 pinia 实例参数。',
      '在插件内部使用 store.$subscribe 监听状态变化，使用 store.$onAction 拦截 action 调用。',
      '通过 pinia.use() 注册插件，所有后续创建的 store 自动获得插件能力。',
    ],
    notes: [
      '插件在 store 创建时执行，可以为每个 store 添加自定义属性或方法。',
      '$onAction 的 after 回调可以获取 action 返回值，适合做结果日志或错误处理。',
      '持久化插件通常结合 $subscribe 监听变化并写入 localStorage，结合 SSR 需要处理好水合时机。',
    ],
    problem: '解决"如何为多个 store 统一添加日志、持久化、错误处理等横切关注点"的问题。',
  },
{
    id: 'S_18', title: 'Pinia Getters 与派生状态', navTitle: 'Pinia Getters', category: 'Pinia',
    path: '/state-management/s-18/pinia-getters', summary: '理解 Pinia Getter 的计算属性本质，掌握派生状态的定义和缓存机制。',
    demo: S18PiniaGetters, code: S18Code, language: 'vue',
    principle: 'Pinia Getter 是基于 store 状态的计算属性，使用 computed 实现，会自动缓存结果，只有依赖变化时才重新计算。Setup Store 中直接用 computed 定义。',
    flow: ['在 Setup Store 中用 computed 定义 getter。', '组件中通过 store.getterName 读取，自动追踪依赖。', 'getter 可以依赖其他 getter，形成派生状态链。'],
    notes: ['getter 默认缓存，多次读取相同输入只计算一次。', 'getter 不应有副作用，保持纯函数。', '需要传参的 getter 可以返回函数，但会失去缓存。'],
    problem: '解决从 store 状态派生出复杂计算结果并自动更新的问题。',
  },
{
    id: 'S_19', title: 'Pinia Actions 与异步操作', navTitle: 'Pinia Actions', category: 'Pinia',
    path: '/state-management/s-19/pinia-actions', summary: '掌握 Pinia 中修改状态的主要方式，理解同步异步 action 与 $onAction 拦截。',
    demo: S19PiniaActions, code: S19Code, language: 'vue',
    principle: 'Actions 是 Pinia 中修改状态的主要方式，支持同步和异步操作，可以直接修改状态而不需要 mutations，配合 $onAction 可以拦截 action 调用。',
    flow: ['在 store 中定义 action 函数，直接修改 state。', '组件中调用 store.actionName() 触发。', '异步 action 返回 Promise，可以 await 等待完成。'],
    notes: ['Action 中可以调用其他 action 或外部 API。', '$onAction 可以在 action 前后执行钩子。', '复杂异步流程考虑拆分多个 action 组合使用。'],
    problem: '解决状态修改逻辑分散、异步操作难以追踪和复用的问题。',
  },
{
    id: 'S_20', title: 'Pinia DevTools 与时间旅行调试', navTitle: 'Pinia DevTools', category: 'Pinia',
    path: '/state-management/s-20/pinia-devtools', summary: '使用 Vue DevTools 查看 Pinia 状态、提交历史和时间旅行调试。',
    demo: S20PiniaDevtools, code: S20Code, language: 'vue',
    principle: 'Pinia 深度集成 Vue DevTools，支持查看 store 状态、提交历史、时间旅行调试，可以回退到任意历史状态并追踪状态变化来源。',
    flow: ['安装 Vue DevTools 浏览器扩展。', '在 Pinia 标签页查看所有 store 的当前状态。', '在时间线中选择历史状态，点击回退进行调试。'],
    notes: ['DevTools 只在开发环境启用，生产环境自动关闭。', '可以给 action 命名方便在 DevTools 中识别。', '支持导入/导出状态，便于复现 bug。'],
    problem: '解决状态变化难以追踪、bug 复现困难、调试效率低的问题。',
  },
{
    id: 'S_21', title: 'Pinia Store 单元测试', navTitle: 'Pinia 测试', category: 'Pinia',
    path: '/state-management/s-21/pinia-testing', summary: '学习如何为 Pinia Store 编写单元测试，使用独立 Pinia 实例避免状态污染。',
    demo: S21PiniaTesting, code: S21Code, language: 'vue',
    principle: 'Pinia Store 天然易于测试，Setup Store 就是普通函数，可以在测试中创建独立的 Pinia 实例并注入，使用 setActivePinia 激活后直接测试 action 和 getter。',
    flow: ['在测试中创建独立的 Pinia 实例。', '调用 setActivePinia 激活，然后创建 store。', '调用 action 修改状态，断言状态和 getter 符合预期。'],
    notes: ['每个测试用独立的 Pinia 实例，避免状态污染。', '可以用 vi.mock 模拟 API 调用测试异步 action。', '测试关注行为而非实现细节。'],
    problem: '解决状态管理逻辑难以单元测试、测试间状态互相污染的问题。',
  },
{
    id: 'S_22', title: 'Recoil 原子状态与 Selector', navTitle: 'Recoil', category: '原子化状态',
    path: '/state-management/s-22/recoil', summary: '了解 Recoil 的 Atom 与 Selector 模型，理解原子化状态管理的细粒度更新。',
    demo: S22Recoil, code: S22Code, language: 'vue',
    principle: 'Recoil 是 Facebook 推出的 React 状态管理库，以 Atom 为最小状态单元，Selector 作为派生状态，通过 atom 依赖图实现精确的组件级重渲染。',
    flow: ['使用 atom 定义原子状态并指定唯一 key。', '使用 selector 定义派生状态，依赖其他 atom/selector。', '组件通过 useRecoilState/useRecoilValue 读取状态。'],
    notes: ['Recoil 的状态图支持异步 selector 和 Suspense。', '每个 atom 独立追踪订阅，更新粒度更细。', 'Recoil 目前主要适用于 React 生态。'],
    problem: '解决大型应用中状态更新粒度过粗、不必要重渲染多的问题。',
  },
{
    id: 'S_23', title: 'MobX 响应式状态与 Observable', navTitle: 'MobX', category: '结构化状态',
    path: '/state-management/s-23/mobx', summary: '理解 MobX 的 Observable 响应式模型，掌握 action、computed 和 observer 的协作方式。',
    demo: S23Mobx, code: S23Code, language: 'vue',
    principle: 'MobX 通过 Observable 把普通对象包装为可观察的图谱，action 修改状态、computed 派生只读值、observer 组件自动追踪依赖并响应式渲染；这种"透明反应"心智模型贴近面向对象领域建模，适合复杂业务状态和大型应用。',
    flow: ['用 makeAutoObservable 把领域对象转为可观察状态。', '在 action 内统一修改状态，触发依赖收集。', 'observer 包裹的组件订阅用到的 observable 字段并自动重渲染。'],
    notes: ['MobX 响应式是隐式的，代码更简洁但需理解追踪机制。', '严格模式（configure({ enforceActions: "always" })）保证只能在 action 中修改状态。', '复杂领域模型优先用 class + makeAutoObservable 表达。'],
    problem: '解决"状态更新逻辑分散、视图与状态同步复杂"的问题。',
  },
{
    id: 'S_24', title: 'Overmind 分形状态管理', navTitle: 'Overmind', category: '结构化状态',
    path: '/state-management/s-24/overmind', summary: '了解 Overmind 的分形架构，掌握命名空间组织状态与 effects 隔离副作用。',
    demo: S24Overmind, code: S24Code, language: 'vue',
    principle: 'Overmind 是一个分形状态管理库，将状态、动作、派生值组织在命名空间中，支持状态追踪、DevTools 和效果（effects）隔离副作用。',
    flow: ['使用 createOvermind 创建 store，按命名空间组织 state/actions/effects。', '组件通过 useOvermind 获取状态和 actions。', 'actions 修改状态，effects 处理 API、存储等副作用。'],
    notes: ['Overmind 支持 Vue 和 React 等多个框架。', '状态变更追踪到具体的 action 调用。', 'effects 模式便于测试时替换副作用。'],
    problem: '解决状态管理中副作用耦合、调试困难、跨框架复用成本高的问题。',
  }
]
