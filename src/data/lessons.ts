import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'

const demoModules = import.meta.glob<Component>('../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../demos/state-react/*.js', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../demos/${name}.vue`]

  if (!loader) {
    throw new Error(`未找到案例组件：${name}`)
  }

  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../element-plus/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const modules = path.startsWith('react-jsx/')
    ? jsxCodeModules
    : path.startsWith('state-react/')
      ? stateCodeModules
      : vueCodeModules
  const loader = modules[`../demos/${path}`]

  if (!loader) {
    throw new Error(`未找到案例源码：${path}`)
  }

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
const E01Button = createDemo('E01Button')
const E01Code = createCodeLoader('E01Button.vue')
const E02Form = createDemo('E02Form')
const E02Code = createCodeLoader('E02Form.vue')
const E03Table = createDemo('E03Table')
const E03Code = createCodeLoader('E03Table.vue')
const E04Dialog = createDemo('E04Dialog')
const E04Code = createCodeLoader('E04Dialog.vue')
const E05Message = createDemo('E05Message')
const E05Code = createCodeLoader('E05Message.vue')
const E06Popover = createDemo('E06Popover')
const E06Code = createCodeLoader('E06Popover.vue')
const E07Dropdown = createDemo('E07Dropdown')
const E07Code = createCodeLoader('E07Dropdown.vue')
const E08Tabs = createDemo('E08Tabs')
const E08Code = createCodeLoader('E08Tabs.vue')
const E09Pagination = createDemo('E09Pagination')
const E09Code = createCodeLoader('E09Pagination.vue')
const E10Upload = createDemo('E10Upload')
const E10Code = createCodeLoader('E10Upload.vue')
const E11Cascader = createDemo('E11Cascader')
const E11Code = createCodeLoader('E11Cascader.vue')
const E12Tooltip = createDemo('E12Tooltip')
const E12Code = createCodeLoader('E12Tooltip.vue')
const E13DatePicker = createDemo('E13DatePicker')
const E13Code = createCodeLoader('E13DatePicker.vue')
const E14Tree = createDemo('E14Tree')
const E14Code = createCodeLoader('E14Tree.vue')
const E15Drawer = createDemo('E15Drawer')
const E15Code = createCodeLoader('E15Drawer.vue')
const E16Steps = createDemo('E16Steps')
const E16Code = createCodeLoader('E16Steps.vue')
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
const L01LLMCall = createDemo('L01LLMCall')
const L01Code = createCodeLoader('L01LLMCall.vue')
const L02PromptTemplate = createDemo('L02PromptTemplate')
const L02Code = createCodeLoader('L02PromptTemplate.vue')
const L03OutputParser = createDemo('L03OutputParser')
const L03Code = createCodeLoader('L03OutputParser.vue')
const L04LCEL = createDemo('L04LCEL')
const L04Code = createCodeLoader('L04LCEL.vue')
const L05Chains = createDemo('L05Chains')
const L05Code = createCodeLoader('L05Chains.vue')
const L06DocSplitter = createDemo('L06DocSplitter')
const L06Code = createCodeLoader('L06DocSplitter.vue')
const L07VectorRetrieval = createDemo('L07VectorRetrieval')
const L07Code = createCodeLoader('L07VectorRetrieval.vue')
const L08Agent = createDemo('L08Agent')
const L08Code = createCodeLoader('L08Agent.vue')
const L09Tools = createDemo('L09Tools')
const L09Code = createCodeLoader('L09Tools.vue')
const L10Memory = createDemo('L10Memory')
const L10Code = createCodeLoader('L10Memory.vue')
const L11Callbacks = createDemo('L11Callbacks')
const L11Code = createCodeLoader('L11Callbacks.vue')
const L12QABot = createDemo('L12QABot')
const L12Code = createCodeLoader('L12QABot.vue')
const L13Streaming = createDemo('L13Streaming')
const L13Code = createCodeLoader('L13Streaming.vue')
const L14Evaluation = createDemo('L14Evaluation')
const L14Code = createCodeLoader('L14Evaluation.vue')
const N01ProjectStructure = createDemo('N01ProjectStructure')
const N01Code = createCodeLoader('N01ProjectStructure.vue')
const N02FileRouting = createDemo('N02FileRouting')
const N02Code = createCodeLoader('N02FileRouting.vue')
const N03DynamicRoute = createDemo('N03DynamicRoute')
const N03Code = createCodeLoader('N03DynamicRoute.vue')
const N04Layouts = createDemo('N04Layouts')
const N04Code = createCodeLoader('N04Layouts.vue')
const N05AutoImport = createDemo('N05AutoImport')
const N05Code = createCodeLoader('N05AutoImport.vue')
const N06Composables = createDemo('N06Composables')
const N06Code = createCodeLoader('N06Composables.vue')
const N07UseFetch = createDemo('N07UseFetch')
const N07Code = createCodeLoader('N07UseFetch.vue')
const N08UseAsyncData = createDemo('N08UseAsyncData')
const N08Code = createCodeLoader('N08UseAsyncData.vue')
const N09SSR = createDemo('N09SSR')
const N09Code = createCodeLoader('N09SSR.vue')
const N10ClientOnly = createDemo('N10ClientOnly')
const N10Code = createCodeLoader('N10ClientOnly.vue')
const N11Middleware = createDemo('N11Middleware')
const N11Code = createCodeLoader('N11Middleware.vue')
const N12Plugins = createDemo('N12Plugins')
const N12Code = createCodeLoader('N12Plugins.vue')
const N13UseState = createDemo('N13UseState')
const N13Code = createCodeLoader('N13UseState.vue')
const N14SEO = createDemo('N14SEO')
const N14Code = createCodeLoader('N14SEO.vue')
const N15Nitro = createDemo('N15Nitro')
const N15Code = createCodeLoader('N15Nitro.vue')
const N16ApiRoutes = createDemo('N16ApiRoutes')
const N16Code = createCodeLoader('N16ApiRoutes.vue')
const N17SSG = createDemo('N17SSG')
const N17Code = createCodeLoader('N17SSG.vue')
const N18RuntimeConfig = createDemo('N18RuntimeConfig')
const N18Code = createCodeLoader('N18RuntimeConfig.vue')
const N19ErrorHandling = createDemo('N19ErrorHandling')
const N19Code = createCodeLoader('N19ErrorHandling.vue')
const N20Modules = createDemo('N20Modules')
const N20Code = createCodeLoader('N20Modules.vue')
const T01TypeInference = createDemo('T01TypeInference')
const T01Code = createCodeLoader('T01TypeInference.vue')
const T02UnionNarrowing = createDemo('T02UnionNarrowing')
const T02Code = createCodeLoader('T02UnionNarrowing.vue')
const T03ObjectModeling = createDemo('T03ObjectModeling')
const T03Code = createCodeLoader('T03ObjectModeling.vue')
const T04Generics = createDemo('T04Generics')
const T04Code = createCodeLoader('T04Generics.vue')
const T05Keyof = createDemo('T05Keyof')
const T05Code = createCodeLoader('T05Keyof.vue')
const T06UtilityTypes = createDemo('T06UtilityTypes')
const T06Code = createCodeLoader('T06UtilityTypes.vue')
const T07UnknownGuard = createDemo('T07UnknownGuard')
const T07Code = createCodeLoader('T07UnknownGuard.vue')
const T08VueTyping = createDemo('T08VueTyping')
const T08Code = createCodeLoader('T08VueTyping.vue')
const G01EnvironmentConfig = createDemo('G01EnvironmentConfig')
const G01Code = createCodeLoader('G01EnvironmentConfig.vue')
const G02CodeQuality = createDemo('G02CodeQuality')
const G02Code = createCodeLoader('G02CodeQuality.vue')
const G03UnitTesting = createDemo('G03UnitTesting')
const G03Code = createCodeLoader('G03UnitTesting.vue')
const G04ComponentTesting = createDemo('G04ComponentTesting')
const G04Code = createCodeLoader('G04ComponentTesting.vue')
const G05CIPipeline = createDemo('G05CIPipeline')
const G05Code = createCodeLoader('G05CIPipeline.vue')
const G06PerformanceBudget = createDemo('G06PerformanceBudget')
const G06Code = createCodeLoader('G06PerformanceBudget.vue')
const G07Accessibility = createDemo('G07Accessibility')
const G07Code = createCodeLoader('G07Accessibility.vue')
const G08SecurityDelivery = createDemo('G08SecurityDelivery')
const G08Code = createCodeLoader('G08SecurityDelivery.vue')
const G09BuildPlugin = createDemo('G09BuildPlugin')
const G09Code = createCodeLoader('G09BuildPlugin.vue')
const G10E2eTesting = createDemo('G10E2eTesting')
const G10Code = createCodeLoader('G10E2eTesting.vue')
const G11BundleAnalysis = createDemo('G11BundleAnalysis')
const G11Code = createCodeLoader('G11BundleAnalysis.vue')
const G12Monorepo = createDemo('G12Monorepo')
const G12Code = createCodeLoader('G12Monorepo.vue')
const J01TypesEquality = createDemo('J01TypesEquality')
const J01Code = createCodeLoader('J01TypesEquality.vue')
const J02Closure = createDemo('J02Closure')
const J02Code = createCodeLoader('J02Closure.vue')
const J03ArrayPipeline = createDemo('J03ArrayPipeline')
const J03Code = createCodeLoader('J03ArrayPipeline.vue')
const J04ObjectOperations = createDemo('J04ObjectOperations')
const J04Code = createCodeLoader('J04ObjectOperations.vue')
const J05ThisBinding = createDemo('J05ThisBinding')
const J05Code = createCodeLoader('J05ThisBinding.vue')
const J06PrototypeClass = createDemo('J06PrototypeClass')
const J06Code = createCodeLoader('J06PrototypeClass.vue')
const J07PromiseCombinators = createDemo('J07PromiseCombinators')
const J07Code = createCodeLoader('J07PromiseCombinators.vue')
const J08EventLoop = createDemo('J08EventLoop')
const J08Code = createCodeLoader('J08EventLoop.vue')
const J09Modules = createDemo('J09Modules')
const J09Code = createCodeLoader('J09Modules.vue')
const J10EventDelegation = createDemo('J10EventDelegation')
const J10Code = createCodeLoader('J10EventDelegation.vue')
const D01ModuleSystem = createDemo('D01ModuleSystem')
const D01Code = createCodeLoader('D01ModuleSystem.vue')
const D02PathUrl = createDemo('D02PathUrl')
const D02Code = createCodeLoader('D02PathUrl.vue')
const D03FileSystem = createDemo('D03FileSystem')
const D03Code = createCodeLoader('D03FileSystem.vue')
const D04EventEmitter = createDemo('D04EventEmitter')
const D04Code = createCodeLoader('D04EventEmitter.vue')
const D05Streams = createDemo('D05Streams')
const D05Code = createCodeLoader('D05Streams.vue')
const D06HttpServer = createDemo('D06HttpServer')
const D06Code = createCodeLoader('D06HttpServer.vue')
const D07ProcessEnv = createDemo('D07ProcessEnv')
const D07Code = createCodeLoader('D07ProcessEnv.vue')
const D08Concurrency = createDemo('D08Concurrency')
const D08Code = createCodeLoader('D08Concurrency.vue')
const D09ErrorLogging = createDemo('D09ErrorLogging')
const D09Code = createCodeLoader('D09ErrorLogging.vue')
const D10NodeTest = createDemo('D10NodeTest')
const D10Code = createCodeLoader('D10NodeTest.vue')
const D11Security = createDemo('D11Security')
const D11Code = createCodeLoader('D11Security.vue')
const D12PackageManagement = createDemo('D12PackageManagement')
const D12Code = createCodeLoader('D12PackageManagement.vue')
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

export interface KnowledgeCategory {
  id: string
  name: string
  path: string
  status: 'ready' | 'planned'
  intro?: string
  officialUrl?: string
}

export interface Lesson {
  id: string
  title: string
  navTitle: string
  category: string
  path: string
  summary: string
  demo: Component
  code: () => Promise<string>
  language: string
  principle: string
  flow: string[]
  notes: string[]
  problem: string
}

export const knowledgeCategories: KnowledgeCategory[] = [
  { id: 'vue', name: 'Vue3', path: '/vue', status: 'ready', intro: 'Vue3 是渐进式 JavaScript 框架。本分类用真实小业务场景拆解组合式 API、组件、路由、状态管理和工程实践。', officialUrl: 'https://vuejs.org/' },
  { id: 'javascript', name: 'JavaScript', path: '/javascript', status: 'ready', intro: 'JavaScript 是 Web 平台的核心语言。本分类从类型、函数和对象模型出发，逐步覆盖异步机制、模块化与浏览器事件。', officialUrl: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript' },
  { id: 'element-plus', name: 'Element Plus', path: '/element-plus', status: 'ready', intro: 'Element Plus 是基于 Vue 3 的组件库，提供丰富的企业级 UI 组件，覆盖表格、表单、弹窗、导航等常见场景。', officialUrl: 'https://element-plus.org/' },
  { id: 'typescript', name: 'TypeScript', path: '/typescript', status: 'ready', intro: 'TypeScript 为 JavaScript 增加可渐进采用的静态类型系统。本分类以 Vue 3 真实业务数据为背景，覆盖建模、收窄、泛型、类型操作与组件类型实践。', officialUrl: 'https://www.typescriptlang.org/' },
  { id: 'nodejs', name: 'Node.js', path: '/nodejs', status: 'ready', intro: 'Node.js 让 JavaScript 运行在服务端和工具链中。本分类覆盖模块、文件、事件、流、HTTP、进程、测试、安全与依赖管理。', officialUrl: 'https://nodejs.org/docs/latest/api/' },
  { id: 'state-management', name: '状态管理', path: '/state-management', status: 'ready', intro: '从状态归属出发，对比 Pinia、Zustand、Jotai、Redux Toolkit 与 XState 等方案的模型、粒度和适用边界。' },
  { id: 'react', name: 'React', path: '/react', status: 'ready', intro: 'React 以组件和声明式渲染组织用户界面。本分类基于 React 19.2，通过浏览器 ES Module 直接引用 React，不向当前 Vue3 工程安装 React 依赖。', officialUrl: 'https://react.dev/' },
  { id: 'engineering', name: '工程化', path: '/engineering', status: 'ready', intro: '工程化把代码质量、自动化测试、持续集成、性能、无障碍与安全发布串成可重复的交付流程，让项目在规模增长后仍然可靠。', officialUrl: 'https://vite.dev/' },
  { id: 'langchain', name: 'LangChain', path: '/langchain', status: 'ready', intro: 'LangChain.js 是构建 LLM 应用的开源框架，提供模型调用、提示模板、链式调用、RAG 检索增强生成等核心能力，帮助开发者快速搭建智能应用。', officialUrl: 'https://js.langchain.com/' },
  { id: 'nuxt', name: 'Nuxt', path: '/nuxt', status: 'ready', intro: 'Nuxt 是基于 Vue 3 的全栈框架，内置文件路由、自动导入、SSR/SSG、服务端 API 等能力，让 Vue 项目从单页应用升级为全栈应用。', officialUrl: 'https://nuxt.com/' },
]

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
      '生命周期钩子描述组件进入页面、更新和离开页面的时机；template ref 让组件在必要时访问真实 DOM 或子组件实例。onBeforeUnmount 适合提前清理副作用，onUnmounted 确认组件已完全卸载。',
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
      '异步请求不是只有"有没有数据"两种状态，还包括加载中、失败、空数据和成功等分支。显式建模这些状态，页面反馈才稳定。',
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
      '使用 include/exclude 按组件名控制缓存范围，max 限制最大缓存实例数避免内存泄漏。',
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
      '自定义指令直接作用在真实 DOM 元素上，适合封装聚焦、点击外部、权限显隐、滚动观察等低层 DOM 行为。',
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
      '异步组件把某些组件的加载延后，Suspense 为等待中的异步依赖提供统一 fallback。用户先看到占位反馈，加载完成后再看到真实内容。',
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
      '列表项使用 v-memo，根据版本号判断是否需要重新更新。',
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
  },
  // Element Plus 知识案例
  {
    id: 'E_1',
    title: '按钮：类型、尺寸、状态与图标',
    navTitle: '按钮',
    category: '基础组件',
    path: '/element-plus/e-1/button',
    summary: '用课程操作按钮展示 ElButton 的类型、尺寸、状态和图标组合用法。',
    demo: E01Button,
    code: E01Code,
    language: 'vue',
    principle:
      'ElButton 提供多种类型（primary/success/warning/danger/info）、尺寸（large/default/small）、状态（loading/disabled）和圆角变体。图标按钮通过 circle 属性快速创建。',
    flow: [
      '根据业务语义选择按钮类型，如重要操作用 primary，危险操作用 danger。',
      '根据界面密度选择尺寸，大尺寸用于主要入口，小尺寸用于紧凑布局。',
      '通过 icon 属性或 Icon 组件为按钮添加语义图标。',
    ],
    notes: [
      '按钮类型应符合操作语义，不要滥用 primary。',
      'loading 状态应同时禁用按钮，防止重复提交。',
      '图标按钮应添加 aria-label 提供无障碍支持。',
    ],
    problem: '解决"不同场景下按钮应该如何选择类型和尺寸"的问题。',
  },
  {
    id: 'E_2',
    title: '表单：数据绑定、校验与提交',
    navTitle: '表单',
    category: '表单组件',
    path: '/element-plus/e-2/form',
    summary: '用用户注册表单展示 ElForm 的双向绑定、规则校验和提交处理。',
    demo: E02Form,
    code: E02Code,
    language: 'vue',
    principle:
      'ElForm 通过 model 绑定数据，rules 定义校验规则，validate 方法执行校验。表单组件（ElInput、ElSelect 等）通过 v-model 直接关联到 form 对象的对应字段。还支持 validateField 局部校验和 scrollToField 滚动到错误字段。',
    flow: [
      '使用 reactive 定义表单数据对象，并用 rules 定义校验规则。',
      '表单组件通过 v-model 绑定到 form 对应字段，触发校验。',
      '点击提交时调用 validate，校验通过后再执行业务逻辑。',
    ],
    notes: [
      '前端校验用于即时反馈，真实提交仍必须依赖服务端校验。',
      '校验规则支持同步和异步自定义校验器。',
      'resetFields 会同时清空值和校验状态。',
      'validateField 可以只校验指定字段，适合分步表单或联动校验场景。',
    ],
    problem: '解决"表单如何进行数据绑定和客户端校验"的问题。',
  },
  {
    id: 'E_3',
    title: '表格：数据渲染、分页与筛选',
    navTitle: '表格',
    category: '数据展示',
    path: '/element-plus/e-3/table',
    summary: '用课程列表展示 ElTable 的列定义、数据绑定、筛选和自定义渲染。',
    demo: E03Table,
    code: E03Code,
    language: 'vue',
    principle:
      'ElTable 通过 data 属性传入数据数组，ElTableColumn 定义每列的渲染方式。template #default 可以自定义单元格内容，支持复杂数据和操作按钮。',
    flow: [
      '定义 columns 数组，指定每列的 prop、label 和宽度。',
      '通过 filter 方法根据搜索条件过滤数据。',
      '使用 template #default 自定义单元格渲染，如状态标签和操作按钮。',
    ],
    notes: [
      '表格列过多时应考虑固定列或横向滚动。',
      '金额、日期等格式化逻辑适合放在 computed 或工具函数中。',
      '大表格应配合分页或虚拟滚动使用。',
    ],
    problem: '解决"如何用表格展示和筛选结构化数据"的问题。',
  },
  {
    id: 'E_4',
    title: '对话框：模态与非模态',
    navTitle: '对话框',
    category: '反馈组件',
    path: '/element-plus/e-4/dialog',
    summary: '用课程创建弹窗展示 ElDialog 的显示控制、标题定制和表单集成。',
    demo: E04Dialog,
    code: E04Code,
    language: 'vue',
    principle:
      'ElDialog 通过 v-model 控制显示状态，title 定义标题内容，default slot 放置对话框主体内容，footer slot 放置底栏按钮。',
    flow: [
      '用 ref 控制 dialogVisible 布尔值决定对话框是否显示。',
      '对话框内容通过默认 slot 传入，支持复杂布局。',
      '点击确认按钮执行业务逻辑，点击取消或关闭图标隐藏对话框。',
    ],
    notes: [
      '模态对话框会阻止用户与页面其他部分交互。',
      '对话框内容不宜过深，应保持层级扁平。',
      '移动端应考虑使用 bottom-sheet 替代居中对话框。',
    ],
    problem: '解决"需要用户确认或输入时如何展示对话框"的问题。',
  },
  {
    id: 'E_5',
    title: '消息提示：ElMessage 与 ElMessageBox',
    navTitle: '消息提示',
    category: '反馈组件',
    path: '/element-plus/e-5/message',
    summary: '用操作反馈展示 ElMessage 的四种类型和 ElMessageBox 的确认与输入对话框。',
    demo: E05Message,
    code: E05Code,
    language: 'vue',
    principle:
      'ElMessage 用于轻量级操作反馈，支持 success/warning/error/info 四种类型。ElMessageBox 用于需要用户确认或输入的场景，返回 Promise 支持异步处理。',
    flow: [
      '调用 ElMessage.success/warning/error/info 显示对应类型的消息。',
      '使用 await ElMessageBox.confirm 等待用户确认。',
      '使用 await ElMessageBox.prompt 获取用户输入内容。',
    ],
    notes: [
      '消息提示自动关闭，无需手动清除。',
      '确认对话框适用于危险操作的二次确认。',
      '避免同时弹出多个消息提示。',
    ],
    problem: '解决"操作完成后如何给用户即时反馈"的问题。',
  },
  {
    id: 'E_6',
    title: '气泡卡片：悬浮触发与嵌套内容',
    navTitle: '气泡卡片',
    category: '展示组件',
    path: '/element-plus/e-6/popover',
    summary: '用快捷操作和课程列表展示 ElPopover 的触发方式和嵌套内容。',
    demo: E06Popover,
    code: E06Code,
    language: 'vue',
    principle:
      'ElPopover 的触发方式由 trigger 属性控制（hover/click/focus/manual）。reference slot 放置触发源，默认 slot 放置气泡内容。',
    flow: [
      'hover 触发适合工具提示和快捷操作。',
      'click 触发适合需要展开详细操作的场景。',
      '气泡内容通过默认 slot 传入，支持复杂布局和交互。',
    ],
    notes: [
      '气泡卡片会被窗口边缘截断，Element Plus 会自动调整位置。',
      '嵌套内容时应避免气泡内再嵌套气泡。',
      'trigger=manual 需要手动控制显示状态。',
    ],
    problem: '解决"悬浮或点击时如何展示辅助信息和快捷操作"的问题。',
  },
  {
    id: 'E_7',
    title: '下拉菜单：Dropdown 与命令处理',
    navTitle: '下拉菜单',
    category: '导航组件',
    path: '/element-plus/e-7/dropdown',
    summary: '用操作菜单和课程切换展示 ElDropdown 的菜单项和命令处理。',
    demo: E07Dropdown,
    code: E07Code,
    language: 'vue',
    principle:
      'ElDropdown 通过 @command 事件处理菜单项点击，command 属性标识每个菜单项。dropdown slot 放置下拉菜单内容，reference slot 放置触发源。',
    flow: [
      '触发源可以是按钮或文字，点击后展开下拉菜单。',
      '点击菜单项时通过 command 参数区分不同操作。',
      '可以配合 split-button 实现下拉菜单与主按钮的组合。',
    ],
    notes: [
      '下拉菜单项过多时应考虑分组或搜索。',
      '禁用项使用 disabled 属性，防止误操作。',
      'divided 属性可以在菜单项之间加分隔线。',
    ],
    problem: '解决"如何组织多个操作命令并响应用户选择"的问题。',
  },
  {
    id: 'E_8',
    title: '标签页：选项切换与内容隔离',
    navTitle: '标签页',
    category: '导航组件',
    path: '/element-plus/e-8/tabs',
    summary: '用学习面板展示 ElTabs 的标签切换和内容隔离。',
    demo: E08Tabs,
    code: E08Code,
    language: 'vue',
    principle:
      'ElTabs 通过 v-model 控制当前激活的标签页，每个 ElTabPane 定义一个标签页的内容。切换标签时只会渲染当前激活 pane 的内容。支持 before-leave 守卫拦截切换和 lazy 懒加载。',
    flow: [
      '使用 v-model 绑定当前激活的标签页名称。',
      '每个标签页内容放在对应的 ElTabPane 中。',
      '可以通过 @tab-click 监听标签切换事件。',
    ],
    notes: [
      '标签页数量应控制在 5-7 个以内。',
      '禁用标签页使用 disabled 属性。',
      'type=card 可以使用卡片样式的标签页。',
      'before-leave 守卫可以阻止不满足条件的切换，如未保存时提示用户。',
      'lazy 属性让标签页内容在首次激活时才渲染，减少初始加载开销。',
    ],
    problem: '解决"如何在同一位置展示多个面板并让用户切换"的问题。',
  },
  {
    id: 'E_9',
    title: '分页：Pagination 与表格配合',
    navTitle: '分页',
    category: '数据展示',
    path: '/element-plus/e-9/pagination',
    summary: '用课程列表展示 ElPagination 的页码切换、每页条数和总数显示。',
    demo: E09Pagination,
    code: E09Code,
    language: 'vue',
    principle:
      'ElPagination 通过 v-model:current-page 和 v-model:page-size 双向绑定当前页码和每页条数。layout 属性控制显示哪些元素（total、sizes、prev、pager、next 等）。配合 computed 实现前端分页切片。',
    flow: [
      '用 computed 根据 currentPage 和 pageSize 对数据切片。',
      'ElPagination 的 current-change 和 size-change 事件更新分页状态。',
      '切换每页条数时重置到第一页，避免空页。',
    ],
    notes: [
      '前端分页适合数据量小的场景，大数据量应使用服务端分页。',
      'layout 属性灵活组合，按需显示 total、sizes、jumper 等元素。',
      '切换 pageSize 时务必重置 currentPage 为 1。',
    ],
    problem: '解决"数据量较多时如何分页展示，避免页面过长"的问题。',
  },
  {
    id: 'E_10',
    title: '文件上传：Upload 拖拽与校验',
    navTitle: '文件上传',
    category: '表单组件',
    path: '/element-plus/e-10/upload',
    summary: '用课程资料上传展示 ElUpload 的拖拽上传、文件校验和数量限制。',
    demo: E10Upload,
    code: E10Code,
    language: 'vue',
    principle:
      'ElUpload 支持 click 和 drag 两种上传方式。before-upload 钩子在文件上传前校验类型和大小，返回 false 阻止上传。limit 和 on-exceed 配合控制最大文件数。auto-upload 控制是否自动上传。',
    flow: [
      '用户选择或拖拽文件到上传区域。',
      'before-upload 校验文件类型和大小，不满足则阻止上传。',
      '超出 limit 限制时 on-exceed 回调提示用户。',
      'auto-upload=false 时需手动调用 submit 触发上传。',
    ],
    notes: [
      'before-upload 返回 false 可阻止上传，返回 Promise 支持异步校验。',
      '生产环境应配合后端返回文件 URL，前端只负责选择和展示。',
      '大文件上传建议使用分片上传，避免超时。',
    ],
    problem: '解决"用户如何上传文件，并在上传前校验类型和大小"的问题。',
  },
  {
    id: 'E_11',
    title: '级联选择：Cascader 多级联动',
    navTitle: '级联选择',
    category: '表单组件',
    path: '/element-plus/e-11/cascader',
    summary: '用课程分类选择展示 ElCascader 的多级联动和路径显示。',
    demo: E11Cascader,
    code: E11Code,
    language: 'vue',
    principle:
      'ElCascader 通过 options 属性接收树形数据，每级包含 value、label 和 children。v-model 绑定值为各级 value 组成的路径数组。expandTrigger 控制子级展开方式（click/hover）。',
    flow: [
      '定义树形 options 数据，每级有 value、label 和 children。',
      'v-model 绑定选中路径数组，如 ["frontend", "vue", "vue3-basics"]。',
      '选择完成后显示完整路径，可通过 props.emitPath=false 只获取最后一级值。',
    ],
    notes: [
      '数据量大时考虑异步加载（props.lazy + props.lazyLoad）。',
      'emitPath=false 时 v-model 只绑定最后一级的 value。',
      '可配合 filterable 属性支持搜索过滤。',
    ],
    problem: '解决"多级分类数据如何逐级选择并显示完整路径"的问题。',
  },
  {
    id: 'E_12',
    title: '工具提示：Tooltip 方向与触发',
    navTitle: '工具提示',
    category: '展示组件',
    path: '/element-plus/e-12/tooltip',
    summary: '用课程信息提示展示 ElTooltip 的方向、触发方式和富内容插槽。',
    demo: E12Tooltip,
    code: E12Code,
    language: 'vue',
    principle:
      'ElTooltip 在鼠标悬停或点击时显示提示信息。placement 控制弹出方向，trigger 控制触发方式（hover/click）。content 属性用于简单文本，#content 插槽支持富内容（多行、链接等）。',
    flow: [
      '用 placement 属性设置提示方向（top/bottom/left/right）。',
      'trigger="click" 改为点击触发，适合需要用户主动查看的场景。',
      '#content 插槽放置多行或结构化内容。',
    ],
    notes: [
      'Tooltip 内容应简洁，复杂信息建议用 Popover。',
      'hide-after 控制自动隐藏延迟，设为 0 不自动隐藏。',
      'Tooltip 不会阻塞页面交互，适合辅助说明。',
    ],
    problem: '解决"鼠标悬停时如何显示简短辅助信息"的问题。',
  },
  {
    id: 'E_13',
    title: '日期选择：DatePicker 范围与快捷选项',
    navTitle: '日期选择',
    category: '表单组件',
    path: '/element-plus/e-13/date-picker',
    summary: '用运营报表筛选演示 ElDatePicker 的日期范围、快捷周期、格式化和禁用日期。',
    demo: E13DatePicker,
    code: E13Code,
    language: 'vue',
    principle:
      'ElDatePicker 通过 type 切换日期、月份和范围模式。daterange 模式的 v-model 保存开始与结束日期，shortcuts 提供常用周期，disabled-date 控制不可选日期，value-format 决定绑定值格式。',
    flow: [
      '使用 type="daterange" 让用户一次选择开始和结束日期。',
      '通过 shortcuts 配置最近 7 天、最近 30 天等常用范围。',
      'disabled-date 禁止选择未来日期，避免产生无效报表条件。',
      '根据选中范围计算统计天数并展示筛选摘要。',
    ],
    notes: [
      'value-format 会改变 v-model 的值类型，TypeScript 类型应与配置保持一致。',
      '服务端通常需要明确时区和当天起止时间，不能只传界面显示字符串。',
      '移动端日期范围组件较宽，应保证容器允许组件自适应。',
    ],
    problem: '解决"报表和订单查询如何快速选择有效日期范围"的问题。',
  },
  {
    id: 'E_14',
    title: '树形控件：Tree 勾选、过滤与节点操作',
    navTitle: '树形控件',
    category: '数据展示',
    path: '/element-plus/e-14/tree',
    summary: '用角色权限配置演示 ElTree 的复选框、节点过滤、默认展开和实例方法。',
    demo: E14Tree,
    code: E14Code,
    language: 'vue',
    principle:
      'ElTree 使用树形 data 渲染层级数据，node-key 为节点提供稳定身份。show-checkbox 开启多选，filter-node-method 实现搜索过滤，组件实例提供 getCheckedKeys、setCheckedKeys 等命令式方法。',
    flow: [
      '把菜单和操作权限整理为带 children 的树形结构。',
      '通过 node-key 与 default-checked-keys 恢复已有角色权限。',
      '输入关键词时调用 filter，只保留匹配节点及其关联路径。',
      '保存时通过 getCheckedKeys 获取叶子权限编号。',
    ],
    notes: [
      '权限树应区分父节点和叶子操作，后端保存格式需要双方约定。',
      '数据量较大时可以使用 lazy 与 load 按需加载子节点。',
      '通过 ref 调用实例方法前，需要确认组件已经挂载。',
    ],
    problem: '解决"菜单、组织架构和权限等层级数据如何选择与搜索"的问题。',
  },
  {
    id: 'E_15',
    title: '抽屉：Drawer 侧边详情与编辑',
    navTitle: '抽屉',
    category: '反馈组件',
    path: '/element-plus/e-15/drawer',
    summary: '用课程详情编辑演示 ElDrawer 的显示控制、尺寸、销毁策略和表单操作。',
    demo: E15Drawer,
    code: E15Code,
    language: 'vue',
    principle:
      'ElDrawer 从视口边缘展开，适合在保留当前列表上下文时查看详情或完成轻量编辑。v-model 控制显示，size 控制宽度，direction 控制方向，destroy-on-close 可以在关闭后销毁内部内容。',
    flow: [
      '用户在课程列表中点击查看详情，打开右侧抽屉。',
      '抽屉内展示课程信息并允许编辑运营备注。',
      '保存时进入 loading 状态，完成后关闭抽屉并反馈结果。',
      'destroy-on-close 在关闭后清理复杂表单和临时组件状态。',
    ],
    notes: [
      '抽屉适合轻量编辑，复杂多步骤任务仍应使用独立页面。',
      '关闭前有未保存内容时，应使用 before-close 提示用户确认。',
      '移动端应使用百分比尺寸，避免固定宽度超出视口。',
    ],
    problem: '解决"查看或编辑详情时如何保留用户当前列表位置和筛选上下文"的问题。',
  },
  {
    id: 'E_16',
    title: '步骤条：Steps 流程状态与进度',
    navTitle: '步骤条',
    category: '导航组件',
    path: '/element-plus/e-16/steps',
    summary: '用训练营报名流程演示 ElSteps 的当前步骤、完成状态和流程重置。',
    demo: E16Steps,
    code: E16Code,
    language: 'vue',
    principle:
      'ElSteps 通过 active 指定当前进度索引，每个 ElStep 描述一个阶段。finish-status 控制已完成步骤的状态，process-status 控制当前步骤状态，align-center 和 direction 调整布局。',
    flow: [
      '把报名业务拆分为提交、审核、确认和开课四个稳定阶段。',
      'activeStep 与后端流程状态映射，驱动步骤条高亮。',
      '流程推进时更新 active，已完成步骤自动显示成功状态。',
      '流程结束后禁用继续按钮，也可以重置演示状态。',
    ],
    notes: [
      '步骤条用于展示有限且稳定的阶段，不适合表达复杂分支流程。',
      'active 是从 0 开始的索引，完成全部步骤时通常设为步骤数量。',
      '小屏幕下长标题应缩短，必要时改用 vertical 垂直布局。',
    ],
    problem: '解决"报名、审批、订单等多阶段流程如何清晰展示当前进度"的问题。',
  },
  // LangChain 知识案例
  {
    id: 'L_1',
    title: 'LLM 调用：ChatOpenAI、invoke、streaming',
    navTitle: '入门调用',
    category: '基础入门',
    path: '/langchain/l-1/llm-call',
    summary: '用智能问答模拟器展示 ChatOpenAI 的基本调用、模型配置和流式输出。',
    demo: L01LLMCall,
    code: L01Code,
    language: 'vue',
    principle:
      'ChatOpenAI 是 LangChain.js 中最常用的聊天模型封装。通过构造函数传入模型名称和参数（temperature、maxTokens 等），调用 invoke 获取完整回复，调用 stream 获取逐 token 的流式输出。temperature 控制输出的随机性，maxTokens 限制输出长度。',
    flow: [
      '创建 ChatOpenAI 实例，配置 modelName、temperature 和 maxTokens。',
      '调用 invoke(messages) 获取完整回复，或调用 stream(messages) 逐 token 接收。',
      '模型返回 AIMessage 对象，通过 .content 获取文本内容。',
    ],
    notes: [
      '生产环境应通过环境变量管理 API Key，不要硬编码在代码中。',
      'streaming 适合长文本生成场景，能显著改善用户等待体验。',
      'temperature 越高输出越随机，越低越确定；代码生成建议 0-0.2，创意写作建议 0.7-1.0。',
      'maxTokens 用于控制输出长度，避免生成过长内容浪费 token。',
    ],
    problem: '解决"如何用 LangChain.js 调用 LLM 并获取回复"的入门问题。',
  },
  {
    id: 'L_2',
    title: 'Prompt Template：提示词模板与变量注入',
    navTitle: '提示模板',
    category: '提示工程',
    path: '/langchain/l-2/prompt-template',
    summary: '用产品文案生成器展示 PromptTemplate 的变量注入、ChatPromptTemplate 的消息序列和 Partial Variables。',
    demo: L02PromptTemplate,
    code: L02Code,
    language: 'vue',
    principle:
      'PromptTemplate 将提示词中的可变部分抽取为模板变量，通过 format 时传入具体值生成最终提示。ChatPromptTemplate 按消息角色（system/human/ai）组织提示序列，适合对话场景。Partial Variables 支持先填入部分变量，后续补全其余变量。',
    flow: [
      '定义模板字符串，用 {variable} 标记可变位置。',
      '调用 template.format({ variable: value }) 生成完整提示词。',
      'ChatPromptTemplate.fromMessages 按角色组织消息，formatMessages 返回消息数组。',
      'Partial Variables 允许分步注入变量，适合部分参数延迟获取的场景。',
    ],
    notes: [
      '模板变量名应语义清晰，避免使用单字母或模糊名称。',
      '复杂提示应拆分为 system 指令 + human 输入，让模型更好理解上下文。',
      '模板支持 partial 格式化，可以先填入部分变量，后续再补全。',
    ],
    problem: '解决"提示词中可变部分如何管理，避免字符串拼接"的问题。',
  },
  {
    id: 'L_3',
    title: 'Output Parsers：输出解析与结构化',
    navTitle: '输出解析',
    category: '输出处理',
    path: '/langchain/l-3/output-parser',
    summary: '用课程推荐展示 StringOutputParser 和基于 Zod 的结构化输出解析。',
    demo: L03OutputParser,
    code: L03Code,
    language: 'vue',
    principle:
      'LLM 返回的是纯文本，Output Parser 将其转换为程序可处理的结构化数据。StringOutputParser 提取纯文本，基于 Zod schema 的 StructuredOutputParser 将输出解析为带类型的 JSON 对象。LangChain.js 推荐使用 Zod 定义输出结构。',
    flow: [
      'LLM 返回 AIMessage 对象，.content 是原始文本。',
      'StringOutputParser 直接提取 .content 字符串。',
      '基于 Zod schema 的 StructuredOutputParser 将文本解析为带类型的 JSON 对象。',
    ],
    notes: [
      'StructuredOutputParser 会自动在提示词中追加格式指令，告诉模型输出格式。',
      '解析失败时应提供兜底逻辑，例如重试或返回默认值。',
      'LangChain.js 推荐使用 Zod schema 定义输出结构，类型更安全且与 TypeScript 天然集成。',
    ],
    problem: '解决"LLM 输出是自由文本，如何可靠地转换为结构化数据"的问题。',
  },
  {
    id: 'L_4',
    title: 'LCEL：LangChain Expression Language',
    navTitle: 'LCEL',
    category: '核心概念',
    path: '/langchain/l-4/lcel',
    summary: '用管道执行器展示 LCEL 的 prompt.pipe(model).pipe(parser) 链式组合和数据流转。',
    demo: L04LCEL,
    code: L04Code,
    language: 'vue',
    principle:
      'LCEL 是 LangChain 的表达式语言，通过 .pipe() 方法将 Runnable 组件串联。每个 Runnable 接收上游输出作为输入，处理后传给下游，形成声明式的数据处理管道。也可以用 RunnableSequence.from 数组形式组合。',
    flow: [
      '定义 prompt、model、parser 三个 Runnable 组件。',
      '用 .pipe() 串联：const chain = prompt.pipe(model).pipe(parser)。',
      '或用 RunnableSequence.from([prompt, model, parser]) 等价组合。',
      '调用 chain.invoke({ input }) 执行整个管道，数据依次流过每个组件。',
    ],
    notes: [
      'LCEL 是 LangChain 推荐的组件组合方式，替代了旧版 Chain 类。',
      'RunnablePassthrough 用于透传输入，RunnableParallel 用于并行执行多个分支。',
      '管道中的每个组件都支持 invoke、stream、batch 三种调用方式。',
    ],
    problem: '解决"如何声明式地组合 LLM 应用的各个处理步骤"的问题。',
  },
  {
    id: 'L_5',
    title: 'Chains：链式调用与多步处理',
    navTitle: '链式调用',
    category: '核心概念',
    path: '/langchain/l-5/chains',
    summary: '用课程大纲生成展示 LCEL 多步骤链式处理：大纲生成 → 内容展开 → 摘要提炼。',
    demo: L05Chains,
    code: L05Code,
    language: 'vue',
    principle:
      'Chain 将多个 LLM 调用和处理步骤串联成完整业务流程。前一步的输出作为后一步的输入，每步专注于单一职责，整体完成复杂任务。LangChain.js 推荐使用 LCEL 的 .pipe() 组合各步骤。',
    flow: [
      '第一步链根据主题生成课程大纲。',
      '第二步链接收大纲，展开详细内容。',
      '第三步链接收详细内容，提炼核心摘要。',
    ],
    notes: [
      '每步链应职责单一，避免在单个链中处理过多逻辑。',
      '链的中间结果可以缓存，避免重复调用 LLM。',
      'LangChain.js 推荐用 LCEL pipe 组合链，旧版 LLMChain/SequentialChain 已废弃。',
      '复杂流程可使用 LCEL 的 RunnableBranch 实现条件分支。',
    ],
    problem: '解决"复杂任务需要多步 LLM 处理，如何组织步骤间的数据传递"的问题。',
  },
  {
    id: 'L_6',
    title: 'RAG 基础：文档加载与文本切分',
    navTitle: '文档切分',
    category: 'RAG',
    path: '/langchain/l-6/doc-splitter',
    summary: '用文档切分器展示 RecursiveCharacterTextSplitter 的块大小和重叠量配置。',
    demo: L06DocSplitter,
    code: L06Code,
    language: 'vue',
    principle:
      'RAG 的第一步是将长文档切分为适合检索的小块。RecursiveCharacterTextSplitter 按字符数切分，保留块间重叠以维持上下文连续性。chunkSize 控制块大小，chunkOverlap 控制重叠量。',
    flow: [
      '加载原始文档（TextLoader、PDFLoader 等）。',
      '配置 RecursiveCharacterTextSplitter 的 chunkSize 和 chunkOverlap。',
      '调用 splitter.splitDocuments(documents) 得到切分后的文档块列表。',
    ],
    notes: [
      'chunkSize 通常在 500-1500 字符之间，太小丢失上下文，太大降低检索精度。',
      'chunkOverlap 建议设为 chunkSize 的 10%-20%。',
      '不同文档类型可使用不同的 splitter，例如代码用 Language-specific splitter。',
    ],
    problem: '解决"长文档如何切分为适合向量检索的小块"的问题。',
  },
  {
    id: 'L_7',
    title: 'RAG 进阶：向量存储与相似度检索',
    navTitle: '向量检索',
    category: 'RAG',
    path: '/langchain/l-7/vector-retrieval',
    summary: '用知识库搜索展示文档嵌入、余弦相似度计算和 Top-K 检索结果排序。',
    demo: L07VectorRetrieval,
    code: L07Code,
    language: 'vue',
    principle:
      '向量检索是 RAG 的核心。文档通过 Embedding 模型转换为高维向量（如 text-embedding-3-small 输出 1536 维），查询同样被转换为向量，通过余弦相似度等度量找到最相关的文档块。VectorStore 封装了存储和检索逻辑。',
    flow: [
      '将文档块通过 Embedding 模型转换为向量。',
      '存入 VectorStore（MemoryVectorStore、FAISS、Pinecone 等）。',
      '查询时将问题转为向量，调用 similaritySearch 返回最相关的 K 个文档块。',
    ],
    notes: [
      'Embedding 模型的选择直接影响检索质量，OpenAI 的 text-embedding-3-small 是常用选择。',
      '真实 Embedding 向量维度通常为 1536 或 3072，本 demo 用 3 维简化演示。',
      '生产环境推荐使用持久化向量数据库，如 Pinecone、Weaviate 或 Chroma。',
      '检索结果数量 K 值需要根据场景调优，通常 3-5 个即可。',
    ],
    problem: '解决"如何从大量文档中快速找到与问题最相关的内容"的问题。',
  },
  {
    id: 'L_8',
    title: 'Agent：智能代理与 ReAct 推理',
    navTitle: '智能代理',
    category: 'Agent',
    path: '/langchain/l-8/agent',
    summary: '用推理过程展示 Agent 的 ReAct 循环：思考 → 行动 → 观察 → 回答。',
    demo: L08Agent,
    code: L08Code,
    language: 'vue',
    principle:
      'Agent 是能够自主决策的 LLM 应用。ReAct 模式让 Agent 在每一步先思考需要做什么，然后选择工具执行行动，观察结果后再决定下一步，直到得出最终答案。',
    flow: [
      'Agent 接收用户问题，进入推理循环。',
      '思考阶段：分析当前信息，决定下一步行动。',
      '行动阶段：选择工具并执行，获取观察结果。',
      '重复思考和行动，直到信息足够生成最终答案。',
    ],
    notes: [
      'Agent 的推理过程不可预测，需要设置最大迭代次数防止无限循环。',
      '工具描述的清晰程度直接影响 Agent 选择工具的准确性。',
      '简单任务不需要 Agent，直接用 Chain 更可控。',
    ],
    problem: '解决"LLM 如何根据问题自主选择工具并逐步推理"的问题。',
  },
  {
    id: 'L_9',
    title: 'Tools：工具定义与调用',
    navTitle: '工具定义',
    category: 'Agent',
    path: '/langchain/l-9/tools',
    summary: '用工具注册表展示 tool 函数的定义、Zod 参数 Schema 和调用过程。',
    demo: L09Tools,
    code: L09Code,
    language: 'vue',
    principle:
      'Tool 是 Agent 与外部世界交互的接口。每个工具定义名称、描述和参数 Schema，Agent 根据描述判断何时调用哪个工具。LangChain.js 推荐使用 tool 函数配合 Zod schema 定义工具，提供类型安全的方式。',
    flow: [
      '使用 tool 函数定义工具名称、描述和 Zod 参数 Schema。',
      '实现工具的执行函数，接收参数并返回结果。',
      '将工具注册到 Agent，Agent 在推理时自动选择和调用。',
    ],
    notes: [
      '工具描述要清晰具体，说明适用场景和输入格式。',
      '工具执行应有超时和错误处理，避免阻塞 Agent 推理。',
      '参数 Schema 越精确，Agent 传参错误越少。',
      'LangChain.js 推荐使用 tool 函数 + Zod schema，旧版 DynamicTool 已不推荐。',
    ],
    problem: '解决"Agent 如何与外部系统交互，以及如何定义可被 LLM 理解的工具接口"的问题。',
  },
  {
    id: 'L_10',
    title: 'Memory：对话记忆与历史管理',
    navTitle: '对话记忆',
    category: '对话管理',
    path: '/langchain/l-10/memory',
    summary: '用对话面板展示 BufferMemory、BufferWindowMemory 和 SummaryMemory 三种记忆策略。',
    demo: L10Memory,
    code: L10Code,
    language: 'vue',
    principle:
      'Memory 让 LLM 应用记住之前的对话。BufferMemory 保留完整历史，ConversationBufferWindowMemory 只保留最近 k 轮，ConversationSummaryMemory 将历史压缩为摘要。不同策略在上下文长度和记忆完整性之间取舍。',
    flow: [
      '每次对话后将消息存入 Memory（底层使用 ChatMessageHistory）。',
      '下次调用 LLM 前从 Memory 读取历史，拼接到提示词中。',
      '根据场景选择合适的记忆策略：短对话用 Buffer，长对话用 Window 或 Summary。',
    ],
    notes: [
      '对话轮数多时 BufferMemory 会超出 token 限制，需要切换为 Window 或 Summary。',
      'SummaryMemory 需要额外的 LLM 调用来生成摘要，增加延迟和成本。',
      'ChatMessageHistory 是底层存储，支持持久化到 Redis、数据库等后端。',
      '生产环境建议使用持久化存储而非内存存储。',
    ],
    problem: '解决"LLM 应用如何记住之前的对话，并在 token 限制内保持上下文"的问题。',
  },
  {
    id: 'L_11',
    title: 'Callbacks：回调与可观测性',
    navTitle: '回调追踪',
    category: '工程实践',
    path: '/langchain/l-11/callbacks',
    summary: '用事件时间线展示 handleChainStart、handleLLMStart、handleLLMNewToken、handleLLMEnd 等回调的触发时机。',
    demo: L11Callbacks,
    code: L11Code,
    language: 'vue',
    principle:
      'Callbacks 是 LangChain 的可观测性机制。通过注册回调处理器，可以在 Runnable 执行的各个阶段（链开始、LLM 调用开始、生成 token、调用结束、出错）执行自定义逻辑，用于日志、监控、调试和流式输出。',
    flow: [
      '实现 CallbackHandler，定义 handleChainStart、handleLLMStart、handleLLMNewToken、handleLLMEnd 等方法。',
      '将 handler 传入 Runnable 的 callbacks 参数。',
      '执行过程中回调自动触发，记录每个阶段的输入输出和耗时。',
    ],
    notes: [
      '生产环境建议集成 LangSmith 或 LangFuse 进行链路追踪。',
      'handleLLMNewToken 是实现流式输出的关键回调。',
      'handleChainError 用于捕获链执行中的错误，实现错误监控和告警。',
      '回调中不要执行耗时操作，避免阻塞 LLM 调用流程。',
    ],
    problem: '解决"LLM 应用执行过程不透明，如何监控和调试"的问题。',
  },
  {
    id: 'L_12',
    title: '综合实战：Retriever + Agent + Memory 智能问答',
    navTitle: '智能问答',
    category: '综合实战',
    path: '/langchain/l-12/qa-bot',
    summary: '用智能问答助手展示 Retriever 检索、Agent 推理和对话记忆的综合应用。',
    demo: L12QABot,
    code: L12Code,
    language: 'vue',
    principle:
      '真实 LLM 应用通常需要组合多种能力。Retriever 从 VectorStore 检索相关文档，Agent 提供推理决策，Memory 提供上下文记忆。三者协同构成完整的智能问答系统：先检索相关文档，再推理生成答案，同时维护对话历史。',
    flow: [
      '从 Memory 中检索对话上下文，了解用户历史意图。',
      '通过 Retriever 从 VectorStore 检索与当前问题相关的文档片段。',
      'Agent 结合检索结果和上下文，推理生成最终答案。',
    ],
    notes: [
      '检索质量是 RAG 应用的关键瓶颈，投入精力优化文档切分和检索策略。',
      'Agent 的可靠性需要通过测试和监控持续改进。',
      '生产环境要考虑降级策略：Agent 失败时回退到简单 Chain。',
    ],
    problem: '解决"如何将 RAG、Agent、Memory 组合为完整的智能问答系统"的问题。',
  },
  {
    id: 'L_13',
    title: '流式输出深入：invoke、stream、astream_events',
    navTitle: '流式输出',
    category: '核心概念',
    path: '/langchain/l-13/streaming',
    summary: '用三种流式策略对比展示 invoke、stream 和 astream_events 的差异和适用场景。',
    demo: L13Streaming,
    code: L13Code,
    language: 'vue',
    principle:
      'LangChain.js 提供三种执行方式：invoke 等待完整响应后返回；stream 逐 token 流式返回，适合实时展示生成过程；astream_events 提供事件级流式输出，包含 run_id、tags 等元数据，适合复杂链路的细粒度监控和调试。',
    flow: [
      'invoke：调用后阻塞等待，一次性返回完整结果。适合短文本或不需要流式展示的场景。',
      'stream：返回异步迭代器，逐 token 输出。适合聊天界面等需要实时展示的场景。',
      'astream_events：返回事件流，包含链开始/结束、LLM 开始/结束、token 输出等事件。适合调试和监控。',
    ],
    notes: [
      'stream 是最常用的流式方式，API 简洁且性能好。',
      'astream_events 的 version 必须指定为 "v2"，v1 已废弃。',
      'invoke 和 stream 都支持 batch 方法（batch/abatch），用于并行处理多个输入。',
      '生产环境推荐 stream + handleLLMNewToken 回调实现流式输出。',
    ],
    problem: '解决"不同场景下如何选择合适的流式输出策略"的问题。',
  },
  {
    id: 'L_14',
    title: '评估与测试：输出质量评估',
    navTitle: '评估测试',
    category: '工程实践',
    path: '/langchain/l-14/evaluation',
    summary: '用问答质量评估展示 LLM-as-Judge 评估模式和人工评分对比。',
    demo: L14Evaluation,
    code: L14Code,
    language: 'vue',
    principle:
      'LLM 输出质量评估是生产部署的关键环节。LLM-as-Judge 模式使用另一个 LLM 对输出打分，评估相关性、准确性和完整性等维度。结合人工评分可以校准自动评估的偏差。LangChain 提供了 StringEvaluator 和 QA 评估器等工具。',
    flow: [
      '定义评估维度：相关性、准确性、完整性等。',
      '使用 LLM-as-Judge 自动评分：构造评估提示词，让 LLM 对输出打分。',
      '人工评分校准：对比自动评分和人工评分的差异，调整评估提示词。',
      '持续监控：在生产环境中定期抽样评估，追踪输出质量变化。',
    ],
    notes: [
      'LLM-as-Judge 的评估提示词需要精心设计，避免评估 LLM 的偏见。',
      '评估维度应根据业务场景定制，不同应用关注点不同。',
      '人工评分是校准自动评估的金标准，至少抽样 50-100 条。',
      'LangSmith 提供了内置的评估和追踪功能，推荐在生产环境使用。',
    ],
    problem: '解决"LLM 输出质量如何客观评估，以及如何持续监控"的问题。',
  },
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
  },
  {
    id: 'N_1',
    title: '项目结构、目录约定与自动导入',
    navTitle: '项目结构',
    category: '起步',
    path: '/nuxt/n-1/project-structure',
    summary: '了解 Nuxt 的目录约定、自动导入机制和 nuxt.config.ts 核心配置项。',
    demo: N01ProjectStructure,
    code: N01Code,
    language: 'vue',
    principle:
      'Nuxt 采用约定优于配置的理念：pages/ 自动生成路由、components/ 自动注册、composables/ 自动导入、server/ 自动注册 API。nuxt.config.ts 集中管理构建和运行时配置。这套约定减少了模板代码，让开发者聚焦业务逻辑。',
    flow: [
      'pages/ 下的 .vue 文件自动映射为路由，无需手动配置 router。',
      'components/ 和 composables/ 下的导出自动全局可用，无需手动 import。',
      'nuxt.config.ts 中声明模块、全局样式、SEO 配置等，统一管理。',
    ],
    notes: [
      'srcDir 配置可将源码移到 src/ 下，保持项目根目录整洁。',
      '自动导入基于目录扫描生成 .nuxt/ 下的类型声明，编辑器能正确提示。',
      '不在约定目录中的代码不会被自动导入，需要手动 import。',
    ],
    problem: '解决"Nuxt 项目怎么组织代码、哪些内容无需手动 import、核心配置在哪里"的入门问题。',
  },
  {
    id: 'N_2',
    title: '文件路由：目录结构即路由表',
    navTitle: '文件路由',
    category: '起步',
    path: '/nuxt/n-2/file-routing',
    summary: '掌握 Nuxt 文件路由的映射规则，理解静态路由、动态路由和嵌套路由的文件命名约定。',
    demo: N02FileRouting,
    code: N02Code,
    language: 'vue',
    principle:
      'Nuxt 基于文件系统自动生成 Vue Router 配置：pages/ 目录的层级结构直接映射为 URL 路径。文件名即路由路径，方括号表示动态参数，嵌套目录表示路由层级。这种声明式路由让路由和文件一一对应，无需维护路由配置表。',
    flow: [
      'pages/index.vue 映射根路径 /，其他 .vue 文件映射同名路径。',
      '方括号 [id].vue 创建动态路由，参数通过 useRoute().params 获取。',
      '[...slug].vue 创建 catch-all 路由，匹配所有子路径。',
    ],
    notes: [
      '文件路由只在 pages/ 目录生效，其他目录的 .vue 文件不会生成路由。',
      '动态参数在 route.params 中始终为字符串类型，需要时手动转换。',
      '路由变更后需要重启开发服务器让 Nuxt 重新扫描。',
    ],
    problem: '解决"如何通过文件结构自动生成路由，动态参数和嵌套路由怎么命名"的问题。',
  },
  {
    id: 'N_3',
    title: '动态路由与路由参数',
    navTitle: '动态路由',
    category: '路由',
    path: '/nuxt/n-3/dynamic-route',
    summary: '深入理解动态路由参数 [id] 和 catch-all [...slug] 的匹配规则与参数获取方式。',
    demo: N03DynamicRoute,
    code: N03Code,
    language: 'vue',
    principle:
      '动态路由通过文件名方括号语法定义参数：[id].vue 匹配单个路径段，[...slug].vue 匹配多个路径段。useRoute().params 返回参数对象，动态参数为字符串，catch-all 参数为字符串数组。路径校验可在 definePageMeta 的 validate 中完成。',
    flow: [
      '用户访问 /courses/3，Nuxt 匹配 [id].vue，params.id 为 "3"。',
      '访问 /docs/guide/installation，匹配 [...slug].vue，params.slug 为 ["guide","installation"]。',
      '在 definePageMeta.validate 中校验参数格式，返回 false 触发 404。',
    ],
    notes: [
      'route.params 的值都是字符串，数值比较前需要 Number() 转换。',
      'catch-all 路由可以匹配零个或多个段，优先级低于具体路由。',
      'validate 函数在 SSR 和 CSR 都会执行，需要考虑两端兼容性。',
    ],
    problem: '解决"动态路由如何匹配、参数如何获取和校验"的问题。',
  },
  {
    id: 'N_4',
    title: '布局系统：Layout 与 definePageMeta',
    navTitle: '布局系统',
    category: '路由',
    path: '/nuxt/n-4/layouts',
    summary: '掌握 layouts/ 目录创建布局模板，页面通过 definePageMeta 选择布局。',
    demo: N04Layouts,
    code: N04Code,
    language: 'vue',
    principle:
      '布局是包裹页面内容的壳：layouts/default.vue 是默认布局，包含 <slot /> 接收页面内容。页面通过 definePageMeta({ layout: "custom" }) 指定使用哪个布局。布局适合放置导航栏、侧边栏、页脚等跨页面共享的结构，避免每个页面重复编写。',
    flow: [
      '创建 layouts/xxx.vue，包含 <slot /> 作为页面内容插槽。',
      '在页面组件中调用 definePageMeta({ layout: "xxx" }) 指定布局。',
      'Nuxt 在渲染页面时，将页面内容插入布局的 slot 位置。',
    ],
    notes: [
      '不指定 layout 时默认使用 layouts/default.vue。',
      '布局变更需要重启开发服务器。',
      '布局中可以使用 <NuxtPage /> 实现嵌套布局，但通常用 <slot /> 即可。',
    ],
    problem: '解决"多页面共享导航和结构如何复用、不同页面如何使用不同布局"的问题。',
  },
  {
    id: 'N_5',
    title: '组件自动导入',
    navTitle: '自动导入',
    category: '约定',
    path: '/nuxt/n-5/auto-import',
    summary: '理解 components/、composables/、utils/ 的自动导入机制和命名规则。',
    demo: N05AutoImport,
    code: N05Code,
    language: 'vue',
    principle:
      'Nuxt 在构建时扫描约定目录，为 Vue API、Nuxt API、组件、composable 和工具函数生成自动导入声明。components/ 下的组件按路径前缀命名（如 base/Input.vue → BaseInput），composables/ 下 use 开头的函数和 utils/ 下的导出自动全局可用。',
    flow: [
      '构建时扫描 components/ 生成 .nuxt/components.d.ts 类型声明。',
      '模板中直接使用 <ComponentName />，Nuxt 自动插入 import 语句。',
      'composables/ 和 utils/ 的导出在 script 中直接使用，无需手动 import。',
    ],
    notes: [
      '嵌套目录的组件使用路径前缀：components/admin/Table.vue → AdminTable。',
      '自动导入仅在 .vue 文件的 template 和 script setup 中生效。',
      '可在 nuxt.config.ts 的 imports.dirs 中添加自定义扫描目录。',
    ],
    problem: '解决"哪些内容无需手动 import、组件命名规则是什么"的问题。',
  },
  {
    id: 'N_6',
    title: 'Composables：可复用组合式函数',
    navTitle: 'Composables',
    category: '约定',
    path: '/nuxt/n-6/composables',
    summary: '掌握 composables/ 目录的使用模式，封装和复用响应式逻辑。',
    demo: N06Composables,
    code: N06Code,
    language: 'vue',
    principle:
      'Composable 是 Vue 3 组合式 API 的核心复用单元：一个以 use 开头的函数，内部使用 ref/computed/watch 等响应式 API，返回响应式状态和操作方法。Nuxt 的 composables/ 目录让这些函数自动全局可用，无需手动 import。每个 composable 应封装单一关注点。',
    flow: [
      '在 composables/ 下创建 useXxx.ts，导出组合式函数。',
      '函数内部使用 ref、computed、watch 等 API 封装逻辑。',
      '返回响应式状态和操作方法，调用方按需解构使用。',
    ],
    notes: [
      'composable 名称必须以 use 开头才会被自动导入。',
      '返回的对象中 ref 需要用 toRefs 解构才能保持响应式。',
      'SSR 环境下 composable 中的副作用需要在 onUnmounted 中清理。',
    ],
    problem: '解决"如何封装可复用的响应式逻辑、composable 的设计模式是什么"的问题。',
  },
  {
    id: 'N_7',
    title: 'useFetch：声明式数据获取',
    navTitle: 'useFetch',
    category: '数据获取',
    path: '/nuxt/n-7/use-fetch',
    summary: '掌握 useFetch 的基本用法、参数传递、错误处理和仅客户端请求模式。',
    demo: N07UseFetch,
    code: N07Code,
    language: 'vue',
    principle:
      'useFetch 是 Nuxt 封装的数据获取组合式函数：自动从 URL 生成缓存 key、SSR 时在服务端执行请求并将结果序列化到 payload、CSR 时从 payload 恢复数据避免重复请求。它封装了 useAsyncData + $fetch，提供了 pending、error、refresh 等便捷属性。',
    flow: [
      '调用 useFetch(url) 发起请求，返回 data、pending、error、refresh。',
      'SSR 时在服务端执行请求，结果随 HTML payload 发送到客户端。',
      'CSR 时从 payload 恢复数据，不重复请求；refresh() 可手动刷新。',
    ],
    notes: [
      'useFetch 默认在 SSR 时执行，设置 server: false 可仅客户端请求。',
      'URL 中使用响应式变量时，值变化会自动重新请求。',
      '同一个 URL 的并发请求会自动去重，避免重复调用。',
    ],
    problem: '解决"如何在组件中声明式获取数据、SSR 和 CSR 如何协同"的问题。',
  },
  {
    id: 'N_8',
    title: 'useAsyncData：异步数据管理',
    navTitle: 'useAsyncData',
    category: '数据获取',
    path: '/nuxt/n-8/use-async-data',
    summary: '深入 useAsyncData 的 key 管理、去重策略、数据转换和 lazy 模式。',
    demo: N08UseAsyncData,
    code: N08Code,
    language: 'vue',
    principle:
      'useAsyncData 是 useFetch 的底层 API，需要手动指定 key 用于缓存和去重。它提供更细粒度的控制：dedupe 选项控制并发请求策略（defer 共享结果、cancel 取消重发），transform 处理服务端返回数据，default 提供初始值避免 undefined。useLazyAsyncData 不阻塞导航。',
    flow: [
      '指定唯一 key，Nuxt 用它缓存结果和避免重复请求。',
      'dedupe: "defer" 让并发请求共享结果，"cancel" 取消旧请求发新的。',
      'transform 在服务端处理数据格式，default 提供安全的初始值。',
    ],
    notes: [
      'key 在整个应用中必须唯一，重复 key 会导致数据覆盖。',
      'useLazyAsyncData 等价于 useAsyncData + immediate: false。',
      'default 函数返回的初始值类型应与最终数据一致。',
    ],
    problem: '解决"如何精细控制数据获取的缓存、去重、转换和懒加载"的问题。',
  },
  {
    id: 'N_9',
    title: '服务端渲染 SSR 原理',
    navTitle: 'SSR 原理',
    category: '渲染',
    path: '/nuxt/n-9/ssr',
    summary: '理解 SSR 请求生命周期、Hydration 过程和常见的 SSR 兼容性问题。',
    demo: N09SSR,
    code: N09Code,
    language: 'vue',
    principle:
      'Nuxt SSR 的核心流程：服务端收到请求 → 创建独立 Vue 实例 → 执行 setup 和数据获取 → 渲染为 HTML → 将 HTML + payload 发送到浏览器 → 客户端执行 Hydration 将静态 HTML 激活为响应式应用。Hydration 要求服务端和客户端的 DOM 结构一致，否则报 mismatch 警告。',
    flow: [
      '服务端执行组件 setup，运行 useFetch 获取数据，渲染完整 HTML。',
      'HTML 和 payload 数据一起发送到浏览器，用户立即看到页面内容。',
      '客户端加载 JS 后执行 Hydration，将静态 HTML 与 Vue 虚拟 DOM 关联。',
    ],
    notes: [
      '每个 SSR 请求创建独立的 Vue 实例，不会跨请求污染状态。',
      'Hydration 不是重新渲染，而是复用已有 DOM 绑定事件和状态。',
      'Date.now()、Math.random() 等在 SSR 和 CSR 结果不同，会导致 mismatch。',
    ],
    problem: '解决"SSR 是怎么工作的、Hydration 什么意思、为什么会有 mismatch 错误"的问题。',
  },
  {
    id: 'N_10',
    title: 'ClientOnly 与客户端专属渲染',
    navTitle: 'ClientOnly',
    category: '渲染',
    path: '/nuxt/n-10/client-only',
    summary: '掌握 ClientOnly 组件、import.meta.client 判断和 .client.ts 插件等客户端专属渲染方式。',
    demo: N10ClientOnly,
    code: N10Code,
    language: 'vue',
    principle:
      '某些内容只能在浏览器渲染：图表库直接操作 DOM、浏览器 API（window/navigator）、动态内容（时间/随机数）。Nuxt 提供多种方式处理：ClientOnly 组件包裹仅客户端的内容、import.meta.client 条件判断、.client.ts 文件名后缀让插件只在客户端加载、onMounted 中赋值浏览器特定数据。',
    flow: [
      '遇到不兼容 SSR 的库，用 ClientOnly 包裹并提供 fallback。',
      '需要浏览器 API 时，用 import.meta.client 判断或 onMounted 延迟赋值。',
      '第三方库 SSR 报错时，在 plugins/ 中创建 .client.ts 文件仅客户端注册。',
    ],
    notes: [
      'ClientOnly 的 fallback slot 在 SSR 时显示，客户端加载完成后替换。',
      'import.meta.client 是编译时常量，不会增加运行时开销。',
      '大量使用 ClientOnly 会削弱 SSR 的 SEO 优势，应控制使用范围。',
    ],
    problem: '解决"如何在 SSR 项目中安全使用浏览器 API 和不兼容 SSR 的第三方库"的问题。',
  },
  {
    id: 'N_11',
    title: '路由中间件',
    navTitle: '中间件',
    category: '路由控制',
    path: '/nuxt/n-11/middleware',
    summary: '掌握命名中间件、全局中间件和内联中间件的使用方式和执行顺序。',
    demo: N11Middleware,
    code: N11Code,
    language: 'vue',
    principle:
      '路由中间件在导航触发时执行，可用于权限校验、重定向、日志记录等。Nuxt 提供三种中间件：命名中间件（middleware/xxx.ts，页面通过 definePageMeta 引用）、全局中间件（.global.ts 后缀，自动对所有路由生效）、内联中间件（直接写在 definePageMeta 中的函数）。执行顺序：全局 → 命名 → 内联。',
    flow: [
      '导航触发时，Nuxt 按全局 → 命名 → 内联的顺序执行中间件。',
      '中间件返回 navigateTo() 重定向，abortNavigation() 中止导航。',
      '无返回值则放行，继续执行后续中间件和导航。',
    ],
    notes: [
      '全局中间件文件名必须带 .global 后缀，否则不会自动生效。',
      '中间件在 SSR 和 CSR 都会执行，需要注意两端兼容性。',
      '避免在中间件中执行耗时操作，会阻塞导航。',
    ],
    problem: '解决"如何在导航前进行权限校验、全局拦截和路由重定向"的问题。',
  },
  {
    id: 'N_12',
    title: '插件系统',
    navTitle: '插件',
    category: '路由控制',
    path: '/nuxt/n-12/plugins',
    summary: '掌握 plugins/ 目录的自动注册、.client.ts 后缀和 provide/inject 注入模式。',
    demo: N12Plugins,
    code: N12Code,
    language: 'vue',
    principle:
      'Nuxt 插件在应用创建时自动执行，用于注册全局能力：Vue 插件（Element Plus 等）、第三方库初始化、全局 provide 注入。plugins/ 目录下的文件按文件名字母序自动注册，.client.ts 后缀限制仅在客户端执行，.server.ts 仅服务端执行。通过 nuxtApp.provide 注入的功能在组件中用 useNuxtApp().$xxx 访问。',
    flow: [
      'Nuxt 启动时按字母序扫描 plugins/ 目录，自动注册所有插件。',
      '插件中调用 nuxtApp.vueApp.use() 注册 Vue 插件。',
      '通过 nuxtApp.provide() 注入全局方法，组件中 useNuxtApp().$xxx 使用。',
    ],
    notes: [
      '插件只执行一次，在应用创建阶段，不要在插件中访问组件实例。',
      '文件名字母序决定执行顺序，可用数字前缀控制：01-xxx.ts、02-xxx.ts。',
      'provide 的名称会自动加 $ 前缀：provide("i18n", fn) → $i18n。',
    ],
    problem: '解决"如何注册全局能力、第三方库怎么在 Nuxt 中初始化、如何注入全局方法"的问题。',
  },
  {
    id: 'N_13',
    title: 'useState：跨组件状态共享',
    navTitle: 'useState',
    category: '状态管理',
    path: '/nuxt/n-13/use-state',
    summary: '掌握 useState 轻量状态共享的用法，理解其与 Pinia 的适用场景区别。',
    demo: N13UseState,
    code: N13Code,
    language: 'vue',
    principle:
      'useState 是 Nuxt 提供的 SSR 友好状态共享方案：通过唯一 key 在不同组件间共享响应式状态。SSR 时状态随 payload 传递到客户端，Hydration 时从 payload 恢复而非重新初始化，避免客户端重复请求。适合轻量场景，复杂业务仍推荐 Pinia。',
    flow: [
      '组件 A 调用 useState("key", () => defaultValue) 创建共享状态。',
      'SSR 时状态序列化到 payload，随 HTML 发送到客户端。',
      '组件 B 调用 useState("key") 读取同一份状态，自动同步。',
    ],
    notes: [
      'key 必须全局唯一，重复 key 会共享同一份数据。',
      'useState 的初始值函数只在首次创建时执行，后续调用复用已有状态。',
      '适合主题切换、简单全局标记等场景，复杂状态逻辑用 Pinia。',
    ],
    problem: '解决"如何在组件间共享轻量状态且 SSR 安全，什么时候用 useState 而非 Pinia"的问题。',
  },
  {
    id: 'N_14',
    title: 'SEO 与 useHead',
    navTitle: 'SEO',
    category: '状态管理',
    path: '/nuxt/n-14/seo',
    summary: '掌握 useHead、useSeoMeta 管理 SEO 标签，理解响应式 SEO 和全局配置。',
    demo: N14SEO,
    code: N14Code,
    language: 'vue',
    principle:
      'Nuxt 基于 Unhead 提供 useHead 和 useSeoMeta 管理 HTML head 标签。useHead 支持响应式值（computed/ref），标题变化时自动更新 DOM。useSeoMeta 简化 OG 标签配置。全局默认在 nuxt.config.ts 的 app.head 设置，页面级用 useHead 覆盖。SSR 时 head 标签注入 HTML，CSR 时动态更新。',
    flow: [
      '在 nuxt.config.ts 的 app.head 配置全局默认 title、meta。',
      '页面组件中调用 useHead 覆盖当前页面的 head 标签。',
      '传入 computed/ref 实现响应式 SEO，状态变化时自动更新。',
    ],
    notes: [
      'useHead 中的值支持字符串、ref、computed，响应式更新无需手动操作。',
      'useSeoMeta 是 useHead 的语法糖，专门用于 OG 和 Twitter 标签。',
      '避免在 useHead 中使用复杂的异步逻辑，可能导致 SSR 渲染不完整。',
    ],
    problem: '解决"如何管理页面 SEO 标签、标题如何随状态动态变化"的问题。',
  },
  {
    id: 'N_15',
    title: 'Nitro 服务端引擎',
    navTitle: 'Nitro',
    category: '服务端',
    path: '/nuxt/n-15/nitro',
    summary: '理解 Nitro 引擎的核心特性、部署目标和混合渲染配置。',
    demo: N15Nitro,
    code: N15Code,
    language: 'vue',
    principle:
      'Nitro 是 Nuxt 的服务端引擎，提供自动代码分割、多目标部署、文件路由 API、存储层抽象等能力。它将服务端代码编译为独立产物，可部署到 Node.js、Cloudflare、Vercel 等多种平台。通过 routeRules 配置混合渲染策略：SSR、SSG、ISR、SPA 可在同一项目中混用。',
    flow: [
      'nuxt build 时 Nitro 编译 server/ 目录为独立服务端产物。',
      'API 路由自动代码分割，每个端点独立打包按需加载。',
      'routeRules 按路径配置不同渲染策略，实现混合渲染。',
    ],
    notes: [
      'nuxt generate 用于纯静态部署，nuxt build 用于需要服务端的环境。',
      'SWR（stale-while-revalidate）需要服务器运行，纯静态托管不支持 ISR。',
      'Nitro 的存储层用 useStorage() 访问，支持内存、Redis、KV 等后端。',
    ],
    problem: '解决"Nuxt 服务端怎么工作、如何选择部署目标、不同页面能否用不同渲染模式"的问题。',
  },
  {
    id: 'N_16',
    title: 'API 路由：Server Routes',
    navTitle: 'API 路由',
    category: '服务端',
    path: '/nuxt/n-16/api-routes',
    summary: '掌握 server/api/ 目录创建 RESTful API，理解请求参数获取和工具函数。',
    demo: N16ApiRoutes,
    code: N16Code,
    language: 'vue',
    principle:
      'server/api/ 下的文件自动注册为 API 路由，路径以 /api/ 开头。文件名后缀限定 HTTP 方法：.get.ts、.post.ts、.put.ts、.delete.ts。使用 h3 的工具函数处理请求：readBody 读取请求体、getQuery 获取查询参数、getRouterParam 获取路由参数、createError 抛出错误。',
    flow: [
      '创建 server/api/hello.ts，导出 defineEventHandler 处理函数。',
      'Nuxt 自动注册为 GET /api/hello 路由，返回值自动序列化为 JSON。',
      '使用 .get.ts/.post.ts 后缀限定方法，[id].ts 处理动态参数。',
    ],
    notes: [
      '不带方法后缀的文件处理所有 HTTP 方法。',
      'server/middleware/ 下的文件自动注册为服务端中间件，每个请求都经过。',
      'server/utils/ 下的函数自动导入，可在 API 路由和中间件中直接使用。',
    ],
    problem: '解决"如何在 Nuxt 中创建后端 API、如何获取请求参数和处理错误"的问题。',
  },
  {
    id: 'N_17',
    title: '静态站点生成与混合渲染',
    navTitle: 'SSG/ISR',
    category: '部署',
    path: '/nuxt/n-17/ssg',
    summary: '掌握 SSG 构建流程、ISR 增量静态再生和混合渲染配置。',
    demo: N17SSG,
    code: N17Code,
    language: 'vue',
    principle:
      'SSG 通过 nuxt generate 在构建时渲染所有页面为静态 HTML，部署到 GitHub Pages 等纯静态托管。ISR（Incremental Static Regeneration）在静态缓存基础上定时重新生成，需服务器环境。混合渲染通过 routeRules 让不同路径使用不同策略：SSG 用于内容页、SSR 用于动态页、SPA 用于后台。',
    flow: [
      'nuxt generate 遍历预渲染路由，生成 .output/public/ 下的静态文件。',
      'routeRules 配置 swr 实现 ISR：首次渲染并缓存，过期后后台重新生成。',
      '不同路径配置不同渲染模式，实现最优性能和 SEO 的平衡。',
    ],
    notes: [
      'crawlLinks: true 让 Nitro 自动爬取页面链接发现更多预渲染路由。',
      'ISR 的 swr 时间单位为秒，设置过短会增加服务器负担。',
      '纯静态部署（GitHub Pages）只能用 SSG，不支持 ISR 和 SSR。',
    ],
    problem: '解决"如何生成静态站点、如何配置增量更新、不同页面能否用不同渲染模式"的问题。',
  },
  {
    id: 'N_18',
    title: '运行时配置',
    navTitle: '运行时配置',
    category: '部署',
    path: '/nuxt/n-18/runtime-config',
    summary: '掌握 runtimeConfig 的公有/私有配置、环境变量映射和与 app.config.ts 的区别。',
    demo: N18RuntimeConfig,
    code: N18Code,
    language: 'vue',
    principle:
      'runtimeConfig 分为私有配置（仅服务端可访问，如密钥、数据库 URL）和公有配置（public 下的配置客户端也可访问，如 API Key、版本号）。环境变量通过 NUXT_ 前缀映射到配置项。app.config.ts 是编译时配置，不支持环境变量，适合主题色等不敏感的构建时常量。',
    flow: [
      '在 nuxt.config.ts 的 runtimeConfig 中定义私有和公有配置。',
      '.env 文件中的 NUXT_SECRET_KEY 映射到 config.secretKey。',
      '服务端用 useRuntimeConfig(event) 访问所有配置，客户端只能访问 public。',
    ],
    notes: [
      '绝不要把密钥放在 public 配置中，它会被打包到客户端代码。',
      'NUXT_PUBLIC_ 前缀的环境变量映射到 config.public 下的配置。',
      'runtimeConfig 的值在运行时确定，app.config.ts 的值在构建时确定。',
    ],
    problem: '解决"如何安全地管理密钥和配置、环境变量怎么映射、两种配置有何区别"的问题。',
  },
  {
    id: 'N_19',
    title: '错误处理',
    navTitle: '错误处理',
    category: '工程实践',
    path: '/nuxt/n-19/error-handling',
    summary: '掌握 error.vue 自定义错误页面、错误钩子、API 错误处理和 createError/clearError。',
    demo: N19ErrorHandling,
    code: N19Code,
    language: 'vue',
    principle:
      'Nuxt 错误处理分为三层：error.vue 自定义错误页面（接收 statusCode 和 message）、vue:error 和 app:error 钩子捕获运行时错误、useFetch 的 error 和 $fetch 的 try/catch 处理 API 错误。createError 主动触发错误，clearError 清除错误状态并导航。SSR 中的错误通过 payload 传递到客户端。',
    flow: [
      '404/500 等路由级错误由 error.vue 渲染，展示友好的错误界面。',
      'Vue 组件运行时错误由 vue:error hook 捕获，可上报监控服务。',
      'API 请求错误通过 useFetch 的 error 属性或 $fetch 的 catch 处理。',
    ],
    notes: [
      'error.vue 不是普通页面组件，不能使用布局和插件提供的功能。',
      'clearError({ redirect: "/" }) 清除错误并导航，不传参则留在当前页。',
      '生产环境应接入错误监控服务（Sentry 等），不要只依赖控制台日志。',
    ],
    problem: '解决"Nuxt 各类错误如何捕获和展示、如何自定义错误页面"的问题。',
  },
  {
    id: 'N_20',
    title: '模块系统与生态',
    navTitle: '模块生态',
    category: '工程实践',
    path: '/nuxt/n-20/modules',
    summary: '掌握常用 Nuxt 模块的安装配置、模块开发结构和生态使用指南。',
    demo: N20Modules,
    code: N20Code,
    language: 'vue',
    principle:
      'Nuxt 模块在构建时执行 setup 函数，用于扩展 Nuxt 能力：注册插件、添加组件、修改配置、钩入构建流程。模块通过 nuxt.config.ts 的 modules 数组安装，安装后自动完成配置。开发模块使用 defineNuxtModule 定义元数据和 setup 逻辑，运行时代码放在 runtime/ 目录。',
    flow: [
      'pnpm add @nuxtjs/xxx 安装模块，在 modules 数组中添加模块名。',
      '模块的 setup 函数在构建时执行，通过 Nuxt Kit API 注册能力。',
      '运行时代码（插件、composable、组件）放在模块的 runtime/ 目录。',
    ],
    notes: [
      'modules 数组顺序决定注册顺序，有依赖关系的模块需注意排序。',
      '官方模块列表在 nuxt.com/modules，优先选择官方或高星社区模块。',
      '模块配置通过 nuxt.config.ts 中与模块 configKey 同名的键设置。',
    ],
    problem: '解决"如何安装和配置 Nuxt 模块、如何开发自己的模块、生态中有哪些常用模块"的问题。',
  },
  {
    id: 'T_01', title: '类型推导与显式标注', navTitle: '类型推导', category: '类型基础',
    path: '/typescript/t-1/type-inference', summary: '从课程表单理解 TypeScript 如何推导类型，以及何时需要显式标注。',
    demo: T01TypeInference, code: T01Code, language: 'vue',
    principle: 'TypeScript 会根据初始值推导变量类型；当值可能为空、类型会变化或公共 API 需要稳定契约时，应补充显式类型标注。',
    flow: ['先让编译器从确定的初始值推导类型。', '遇到联合状态或空值时显式声明。', '在编辑器和类型检查阶段发现不合法赋值。'],
    notes: ['避免给所有局部变量重复写显而易见的类型。', '不要用 any 绕过建模问题。'],
    problem: '解决“哪些类型可以交给编译器推导、哪些边界必须显式声明”的问题。',
  },
  {
    id: 'T_02', title: '联合类型与控制流收窄', navTitle: '联合与收窄', category: '类型基础',
    path: '/typescript/t-2/union-narrowing', summary: '用订单状态机掌握字面量联合类型和条件分支收窄。',
    demo: T02UnionNarrowing, code: T02Code, language: 'vue',
    principle: '联合类型列出值的有限可能，TypeScript 会根据相等判断、typeof、in 等运行时检查逐步收窄到具体成员。',
    flow: ['用字面量联合定义合法状态。', '在条件分支中判断当前状态。', '收窄后执行该状态专属的业务逻辑。'],
    notes: ['状态值应来自一个统一类型。', '穷尽检查能在新增状态时提醒遗漏分支。'],
    problem: '解决“如何让非法业务状态无法被创建，并安全处理不同分支”的问题。',
  },
  {
    id: 'T_03', title: '对象类型与领域建模', navTitle: '对象建模', category: '类型基础',
    path: '/typescript/t-3/object-modeling', summary: '通过会员资料区分 interface、type 与对象结构约束。',
    demo: T03ObjectModeling, code: T03Code, language: 'vue',
    principle: 'interface 适合表达可扩展的对象契约，type 能组合联合、交叉和其他类型表达式；两者都遵循结构化类型系统。',
    flow: ['识别领域对象的稳定字段。', '声明字段类型和有限枚举值。', '让响应式状态遵守同一份业务契约。'],
    notes: ['公共模型应使用业务语言命名。', '可选字段只用于数据确实可能缺失的场景。'],
    problem: '解决“如何把接口返回和业务对象建模成可维护类型”的问题。',
  },
  {
    id: 'T_04', title: '泛型：复用类型关系', navTitle: '泛型', category: '类型进阶',
    path: '/typescript/t-4/generics', summary: '用通用 API 响应保留课程列表的精确数据类型。',
    demo: T04Generics, code: T04Code, language: 'vue',
    principle: '泛型把类型作为参数传递，使函数和容器既能复用实现，又能保留输入与输出之间的精确关系。',
    flow: ['找出实现中需要变化的类型。', '用类型参数表达输入输出关系。', '调用时由实参推导具体类型。'],
    notes: ['类型参数名应表达角色。', '仅使用一次且没有关系的类型参数通常没有价值。'],
    problem: '解决“如何复用 API、列表和工具函数而不丢失类型信息”的问题。',
  },
  {
    id: 'T_05', title: 'keyof 与索引访问类型', navTitle: 'keyof', category: '类型进阶',
    path: '/typescript/t-5/keyof', summary: '构建只能读取合法配置键的设置面板。',
    demo: T05Keyof, code: T05Code, language: 'vue',
    principle: 'keyof 从对象类型得到键的联合，T[K] 根据键取得对应值类型，两者结合可编写安全的动态属性访问。',
    flow: ['从对象模型提取合法键。', '让函数参数受键联合约束。', '通过索引访问获得匹配的值类型。'],
    notes: ['Object.keys 默认返回 string[]，必要时需要安全封装。', '不要用宽泛 string 索引绕过键约束。'],
    problem: '解决“动态访问对象属性时如何避免键名拼写错误”的问题。',
  },
  {
    id: 'T_06', title: '工具类型与更新模型', navTitle: '工具类型', category: '类型进阶',
    path: '/typescript/t-6/utility-types', summary: '用 Partial、Pick 和 Omit 表达课程的局部更新。',
    demo: T06UtilityTypes, code: T06Code, language: 'vue',
    principle: '内置工具类型通过映射和条件类型从已有模型派生新契约，减少新增、详情、更新模型之间的重复。',
    flow: ['先定义完整领域模型。', '按操作语义挑选或排除字段。', '用 Partial 将更新字段变为可选。'],
    notes: ['派生类型应保持来源清晰。', '深层对象的 Partial 不会自动递归。'],
    problem: '解决“创建、编辑和接口响应类型重复且容易漂移”的问题。',
  },
  {
    id: 'T_07', title: 'unknown 与自定义类型守卫', navTitle: '安全边界', category: '安全边界',
    path: '/typescript/t-7/unknown-guard', summary: '安全解析用户导入的 JSON，在使用前验证未知数据。',
    demo: T07UnknownGuard, code: T07Code, language: 'vue',
    principle: '外部输入在验证前应视为 unknown；类型守卫同时执行运行时检查，并向编译器证明检查后的精确类型。',
    flow: ['把网络或用户输入接收为 unknown。', '检查对象、字段与基本类型。', '守卫通过后再进入业务逻辑。'],
    notes: ['类型断言不会产生运行时校验。', '复杂结构可使用 schema 校验库。'],
    problem: '解决“接口或本地数据不可信时，如何避免错误断言导致运行时崩溃”的问题。',
  },
  {
    id: 'T_08', title: 'Vue 3 组件类型实践', navTitle: 'Vue 类型', category: '框架实践',
    path: '/typescript/t-8/vue-typing', summary: '掌握响应式状态、模板引用、Props 与 Emits 的类型边界。',
    demo: T08VueTyping, code: T08Code, language: 'vue',
    principle: 'Vue 3 的宏和组合式 API 能从泛型声明推导模板类型；DOM 模板引用还需要处理挂载前的 null 状态。',
    flow: ['为业务状态声明接口。', '用泛型约束 Props、Emits 或模板引用。', '在访问 DOM 或子组件前处理空值。'],
    notes: ['优先使用类型化的 defineProps 和 defineEmits。', '避免把组件实例直接声明为 any。'],
    problem: '解决“如何让 Vue 组件的输入、输出和模板引用获得完整类型检查”的问题。',
  },
  {
    id: 'G_01', title: '环境变量与运行配置', navTitle: '环境配置', category: '构建基础',
    path: '/engineering/g-1/environment-config', summary: '区分构建时环境变量、公开配置和服务端密钥。',
    demo: G01EnvironmentConfig, code: G01Code, language: 'vue',
    principle: '环境配置把同一份代码连接到不同服务；任何进入客户端产物的变量都可被用户读取，密钥必须留在服务端。',
    flow: ['定义开发、测试和生产环境差异。', '只暴露客户端确实需要的公开值。', '在构建和部署阶段注入配置。'],
    notes: ['不要把 .env 当作权限边界。', '环境变量名和默认值应形成文档。'],
    problem: '解决“多环境地址如何切换，以及密钥应该放在哪里”的问题。',
  },
  {
    id: 'G_02', title: '代码规范与自动检查', navTitle: '代码质量', category: '质量保障',
    path: '/engineering/g-2/code-quality', summary: '用格式化、Lint 和类型检查建立提交前质量门。',
    demo: G02CodeQuality, code: G02Code, language: 'vue',
    principle: '格式化统一外观，Lint 发现可疑模式，类型检查验证契约；三者职责不同，应在本地和 CI 中使用同一命令。',
    flow: ['编辑器保存时快速格式化。', '提交前运行静态检查。', 'CI 再执行一次并阻止不合格变更。'],
    notes: ['规则应服务于缺陷预防。', '不要让本地配置与 CI 配置分叉。'],
    problem: '解决“团队如何稳定保持一致风格并提前发现低级错误”的问题。',
  },
  {
    id: 'G_03', title: '单元测试与边界用例', navTitle: '单元测试', category: '质量保障',
    path: '/engineering/g-3/unit-testing', summary: '以折扣计算为例设计快速、确定且可读的单元测试。',
    demo: G03UnitTesting, code: G03Code, language: 'vue',
    principle: '单元测试隔离验证一个纯逻辑单元，重点覆盖正常值、边界值和错误输入，而不是复制实现细节。',
    flow: ['安排输入与依赖。', '执行一个明确行为。', '断言公开结果并覆盖边界。'],
    notes: ['测试名称应描述行为。', '时间和随机数需要可控替身。'],
    problem: '解决“哪些逻辑值得单测，以及怎样写出稳定断言”的问题。',
  },
  {
    id: 'G_04', title: '组件交互测试', navTitle: '组件测试', category: '质量保障',
    path: '/engineering/g-4/component-testing', summary: '从用户视角验证按钮、提示和可访问状态。',
    demo: G04ComponentTesting, code: G04Code, language: 'vue',
    principle: '组件测试应通过用户可见文本、角色和交互观察行为，避免依赖内部 ref、方法名或脆弱 DOM 层级。',
    flow: ['按角色或标签找到控件。', '触发真实点击或输入。', '断言页面呈现的结果。'],
    notes: ['优先断言可访问查询。', '只在边界处模拟网络和外部服务。'],
    problem: '解决“如何验证组件交互而不把测试绑死在实现细节上”的问题。',
  },
  {
    id: 'G_05', title: '持续集成与发布流水线', navTitle: 'CI 流水线', category: '自动化交付',
    path: '/engineering/g-5/ci-pipeline', summary: '把安装、检查、构建和发布组织成可重复流水线。',
    demo: G05CIPipeline, code: G05Code, language: 'vue',
    principle: 'CI 在干净环境重现项目验证过程，只有全部质量门通过的不可变产物才能进入发布阶段。',
    flow: ['锁定依赖并恢复缓存。', '并行运行类型检查和测试。', '构建一次并发布同一份产物。'],
    notes: ['流水线密钥使用平台 Secret。', '失败步骤应保留日志和测试报告。'],
    problem: '解决“如何让每次提交都经过一致验证并可靠发布”的问题。',
  },
  {
    id: 'G_06', title: '性能预算与持续度量', navTitle: '性能预算', category: '用户体验',
    path: '/engineering/g-6/performance-budget', summary: '给脚本、图片和总体积设置可执行的性能预算。',
    demo: G06PerformanceBudget, code: G06Code, language: 'vue',
    principle: '性能预算把“页面要快”转为可自动判断的上限，并结合真实用户指标持续观察回归。',
    flow: ['按网络和设备目标制定预算。', '构建时测量资源体积。', '超出阈值时阻止合并并定位增量。'],
    notes: ['压缩后体积和执行成本都要关注。', '实验室指标应与真实用户数据互补。'],
    problem: '解决“如何防止依赖和资源在迭代中悄悄拖慢页面”的问题。',
  },
  {
    id: 'G_07', title: '无障碍作为工程质量门', navTitle: '无障碍', category: '用户体验',
    path: '/engineering/g-7/accessibility', summary: '把语义、键盘、对比度和状态播报纳入开发流程。',
    demo: G07Accessibility, code: G07Code, language: 'vue',
    principle: '无障碍首先依赖正确 HTML 语义，再用自动扫描发现常见问题，并通过键盘与读屏人工验证关键流程。',
    flow: ['使用原生语义和关联标签。', '运行自动规则扫描。', '用键盘和读屏完成核心任务。'],
    notes: ['ARIA 不能替代原生语义。', '不要只靠颜色传递状态。'],
    problem: '解决“如何让更多用户可用，并把无障碍从补丁变成日常质量要求”的问题。',
  },
  {
    id: 'G_08', title: 'Web 安全与静态发布', navTitle: '安全发布', category: '自动化交付',
    path: '/engineering/g-8/security-delivery', summary: '检查安全响应头、依赖风险与静态资源缓存策略。',
    demo: G08SecurityDelivery, code: G08Code, language: 'vue',
    principle: '安全发布需要最小化客户端暴露、限制资源来源、持续修复依赖漏洞，并为带内容哈希的静态资源设置长期缓存。',
    flow: ['构建前扫描依赖和公开配置。', '部署时配置安全响应头。', 'HTML 短缓存、哈希资源长期不可变缓存。'],
    notes: ['CSP 应先报告再逐步收紧。', '前端校验不能替代服务端授权。'],
    problem: '解决”静态站点发布时如何兼顾安全策略与缓存性能”的问题。',
  },
  {
    id: 'G_09', title: 'Vite 构建插件与钩子机制', navTitle: '构建插件', category: '构建基础',
    path: '/engineering/g-9/build-plugin', summary: '用自定义 Vite 插件展示构建钩子、资源转换和插件执行顺序。',
    demo: G09BuildPlugin, code: G09Code, language: 'vue',
    principle: 'Vite 基于 Rollup 插件体系，通过 resolveId、transform、generateBundle 等钩子介入构建流程；插件按注册顺序执行，每个钩子负责不同阶段的资源转换。',
    flow: ['在 vite.config.ts 中注册插件并声明需要的钩子。', 'transform 钩子逐个文件处理内容替换和注入。', 'generateBundle 钩子在产物输出前执行最终优化。'],
    notes: ['插件应尽量只做一件事，避免在单个插件中混合多种职责。', 'transform 返回值可以是字符串或 { code, map } 对象，后者保留 source map。'],
    problem: '解决”如何在构建流程中介入自定义转换逻辑，以及不同钩子各自负责什么阶段”的问题。',
  },
  {
    id: 'G_10', title: '端到端测试与流程编排', navTitle: 'E2E 测试', category: '质量保障',
    path: '/engineering/g-10/e2e-testing', summary: '以报名表单流程为例，展示端到端测试的步骤编排、断言和失败定位。',
    demo: G10E2eTesting, code: G10Code, language: 'vue',
    principle: '端到端测试从用户视角验证完整业务流程，通过可访问选择器定位元素、编排操作步骤、断言可见结果，失败时自动截图并精确定位出错步骤。',
    flow: ['用 getByRole、getByLabel 等可访问查询定位元素。', '按用户操作顺序编排点击、输入和导航步骤。', '断言页面呈现的文本、状态和可访问角色。'],
    notes: ['优先使用用户可见的选择器，避免依赖 CSS 类名或 data 属性。', '测试数据应独立，每次运行前重置状态以避免用例间相互影响。', '失败截图和 trace 是定位问题的关键产物，CI 中应保留这些文件。'],
    problem: '解决”如何从用户视角验证完整业务流程，并在失败时快速定位问题”的问题。',
  },
  {
    id: 'G_11', title: '构建产物分析与拆分策略', navTitle: '产物分析', category: '用户体验',
    path: '/engineering/g-11/bundle-analysis', summary: '用可视化树状图分析构建产物组成，定位体积热点并制定拆分策略。',
    demo: G11BundleAnalysis, code: G11Code, language: 'vue',
    principle: '构建产物分析把抽象的”打包体积”变成可视化的模块树，帮助定位体积热点；超过阈值的 chunk 可通过动态导入、按需加载或提取公共模块来拆分。',
    flow: ['使用 rollup-plugin-visualizer 或 webpack-bundle-analyzer 生成产物报告。', '按模块类型分类观察 vendor、app 和资源的体积占比。', '对超出预算的模块制定拆分或替换方案。'],
    notes: ['vendor 体积优先检查是否有可替换的轻量方案。', 'tree-shaking 依赖 ESM 导出，混用 CommonJS 会导致整个模块被打包。', '动态导入让路由级组件按需加载，减少首屏所需的初始包体积。'],
    problem: '解决”构建产物为什么越来越大，以及如何系统性地控制体积”的问题。',
  },
  {
    id: 'G_12', title: 'Monorepo 工作区与多包管理', navTitle: 'Monorepo', category: '构建基础',
    path: '/engineering/g-12/monorepo', summary: '用 pnpm workspace 组织多包项目，展示依赖拓扑、版本同步和独立构建。',
    demo: G12Monorepo, code: G12Code, language: 'vue',
    principle: 'Monorepo 通过 workspace 协议把多个包放在同一仓库，共享依赖和工具链；构建按依赖拓扑排序执行，版本管理借助 changesets 实现独立发版。',
    flow: ['在根目录 pnpm-workspace.yaml 声明 packages 匹配规则。', '各包通过 workspace: 协议引用内部依赖，pnpm 自动链接。', '构建工具按拓扑顺序编译，确保被依赖包先于依赖方构建。'],
    notes: ['workspace 协议只在开发环境生效，发布后自动替换为具体版本号。', '修改一个包后，依赖它的所有包都需要重新构建和测试。', '使用 changesets 管理版本，每个变更生成一个 .md 描述文件，发版时自动计算版本号。'],
    problem: '解决”多包项目如何共享代码、统一版本并按依赖顺序可靠构建”的问题。',
  },
  {
    id: 'J_01', title: '值、类型转换与严格相等', navTitle: '类型与相等', category: '语言基础',
    path: '/javascript/j-1/types-equality', summary: '理解原始值、引用值、显式转换，以及 == 与 === 的差异。',
    demo: J01TypesEquality, code: J01Code, language: 'vue',
    principle: 'JavaScript 是动态类型语言，运算时可能发生隐式类型转换。严格相等不会转换操作数，更适合表达稳定的业务判断。',
    flow: ['识别值当前的运行时类型。', '在输入边界显式转换。', '使用严格相等比较同类型值。'],
    notes: ['typeof null 的结果是历史遗留的 object。', 'NaN 应使用 Number.isNaN 判断。'],
    problem: '解决“表单、接口参数比较时为什么会出现反直觉结果”的问题。',
  },
  {
    id: 'J_02', title: '词法作用域与闭包', navTitle: '作用域与闭包', category: '语言基础',
    path: '/javascript/j-2/closure', summary: '用购物车计数器理解函数如何保留创建时的变量环境。',
    demo: J02Closure, code: J02Code, language: 'vue',
    principle: '函数的作用域在定义位置确定；内部函数被返回后仍能访问外层变量，这个函数与词法环境的组合就是闭包。',
    flow: ['外层函数创建局部状态。', '返回访问该状态的内部函数。', '每次调用继续读取和修改同一环境。'],
    notes: ['闭包适合封装私有状态。', '长期持有的大对象可能增加内存占用。'],
    problem: '解决“回调为什么能记住外层变量，以及怎样封装私有状态”的问题。',
  },
  {
    id: 'J_03', title: '数组的不可变转换流水线', navTitle: '数组方法', category: '集合与数据',
    path: '/javascript/j-3/array-pipeline', summary: '组合 filter、map 与 toSorted 完成课程搜索和排序。',
    demo: J03ArrayPipeline, code: J03Code, language: 'vue',
    principle: '数组迭代方法把筛选、映射和聚合拆为可组合步骤；优先返回新数组能减少共享状态被意外修改。',
    flow: ['filter 缩小数据集合。', 'map 转换展示结构。', 'toSorted 在不修改原数组的前提下排序。'],
    notes: ['map 不应用来执行纯副作用。', '大数据量要关注多次遍历成本。'],
    problem: '解决“如何以可读、可预测的方式处理列表数据”的问题。',
  },
  {
    id: 'J_04', title: '对象、解构与展开语法', navTitle: '对象操作', category: '集合与数据',
    path: '/javascript/j-4/object-operations', summary: '通过用户资料更新掌握属性访问、解构、剩余与浅拷贝。',
    demo: J04ObjectOperations, code: J04Code, language: 'vue',
    principle: '解构按属性提取值，剩余语法收集未提取字段，展开语法把可枚举自有属性复制到新对象；这些复制都是浅层的。',
    flow: ['从对象中解构需要的字段。', '用剩余语法保留其他字段。', '展开生成带覆盖值的新对象。'],
    notes: ['嵌套对象仍共享引用。', '属性覆盖顺序由展开位置决定。'],
    problem: '解决“如何清晰地读取和不可变更新对象字段”的问题。',
  },
  {
    id: 'J_05', title: '函数调用方式与 this 绑定', navTitle: 'this 绑定', category: '对象模型',
    path: '/javascript/j-5/this-binding', summary: '比较方法调用、脱离对象调用与 call 显式绑定。',
    demo: J05ThisBinding, code: J05Code, language: 'vue',
    principle: '普通函数的 this 由调用方式决定，而箭头函数捕获外层 this；call、apply 与 bind 可以显式指定普通函数的接收者。',
    flow: ['先观察函数实际调用表达式。', '确定隐式或显式接收者。', '回调场景用箭头函数或 bind 保持上下文。'],
    notes: ['不要把 this 理解为函数定义时的所属对象。', '类方法作为回调传递时也可能丢失绑定。'],
    problem: '解决“对象方法作为回调后 this 为什么变了”的问题。',
  },
  {
    id: 'J_06', title: '原型链、class 与继承', navTitle: '原型与类', category: '对象模型',
    path: '/javascript/j-6/prototype-class', summary: '通过课程模型理解实例属性、共享方法与原型继承。',
    demo: J06PrototypeClass, code: J06Code, language: 'vue',
    principle: '对象通过内部原型链接查找属性；class 提供更清晰的构造与继承语法，但底层仍使用原型链共享方法。',
    flow: ['构造函数初始化实例字段。', '方法存放在 prototype 上共享。', 'extends 建立子类到父类原型的链接。'],
    notes: ['优先组合而非过深继承。', '私有字段可使用 #name 语法。'],
    problem: '解决“JavaScript 对象如何共享行为以及 class 的底层机制”的问题。',
  },
  {
    id: 'J_07', title: 'Promise 组合与并发请求', navTitle: 'Promise 并发', category: '异步机制',
    path: '/javascript/j-7/promise-combinators', summary: '用 Promise.all 并发加载看板数据，并比较常用组合器语义。',
    demo: J07PromiseCombinators, code: J07Code, language: 'vue',
    principle: 'Promise 表示未来完成或失败的结果；all、allSettled、race 与 any 用不同策略组合多个异步任务。',
    flow: ['同时启动互不依赖的任务。', '选择符合失败策略的组合器。', '统一处理结果与异常。'],
    notes: ['Promise.all 遇到首个拒绝即拒绝。', '并发任务仍需考虑接口限流。'],
    problem: '解决“多个异步请求如何高效并发并正确处理失败”的问题。',
  },
  {
    id: 'J_08', title: '事件循环、任务与微任务', navTitle: '事件循环', category: '异步机制',
    path: '/javascript/j-8/event-loop', summary: '观察同步代码、Promise 微任务和定时器任务的执行顺序。',
    demo: J08EventLoop, code: J08Code, language: 'vue',
    principle: '调用栈清空后，事件循环会先清空微任务队列，再进入下一个任务；渲染机会通常发生在任务之间。',
    flow: ['执行当前脚本中的同步代码。', '清空 Promise 等微任务。', '进入定时器等后续任务。'],
    notes: ['大量微任务也会阻塞渲染。', 'setTimeout(fn, 0) 不代表立即执行。'],
    problem: '解决“异步日志顺序为何与代码书写顺序不同”的问题。',
  },
  {
    id: 'J_09', title: 'ES Modules 与动态导入', navTitle: '模块化', category: '模块与浏览器',
    path: '/javascript/j-9/modules', summary: '掌握静态 import/export、模块作用域和 import() 按需加载。',
    demo: J09Modules, code: J09Code, language: 'vue',
    principle: 'ES Module 具有独立作用域和静态依赖结构，便于打包器分析；动态 import 返回 Promise，可把低频功能拆成独立资源。',
    flow: ['用具名或默认导出声明公共接口。', '静态导入首屏必需依赖。', '动态导入低频模块并处理加载状态。'],
    notes: ['模块默认使用严格模式。', '避免循环依赖中的初始化顺序问题。'],
    problem: '解决“如何组织模块边界并减少首屏加载代码”的问题。',
  },
  {
    id: 'J_10', title: 'DOM 事件传播与事件委托', navTitle: '事件委托', category: '模块与浏览器',
    path: '/javascript/j-10/event-delegation', summary: '用课程列表理解捕获、冒泡、target 与 currentTarget。',
    demo: J10EventDelegation, code: J10Code, language: 'vue',
    principle: 'DOM 事件经历捕获、目标和冒泡阶段；事件委托在稳定父节点监听冒泡事件，再通过 closest 判断真实交互目标。',
    flow: ['在父容器注册一个监听器。', '从 event.target 向上寻找匹配元素。', '读取 data 属性执行对应行为。'],
    notes: ['不是所有事件都会冒泡。', '用 closest 时要确认结果仍在委托容器内。'],
    problem: '解决“动态列表如何减少监听器并统一处理交互”的问题。',
  },
  {
    id: 'D_01', title: 'Node.js 运行时与模块系统', navTitle: '模块系统', category: '运行时与模块',
    path: '/nodejs/d-1/module-system', summary: '理解 Node.js 运行时、ES Modules 与 CommonJS 的边界和互操作。',
    demo: D01ModuleSystem, code: D01Code, language: 'vue',
    principle: 'Node.js 在 V8 之上提供文件、网络和进程 API。ESM 使用 import/export，CommonJS 使用 require/module.exports，项目应明确一种主模块格式。',
    flow: ['通过 package.json 的 type 确定默认格式。', '使用 node: 前缀导入核心模块。', '在边界处谨慎处理 ESM 与 CJS 互操作。'],
    notes: ['ESM 中没有原生 __dirname。', '避免在同一目录混用隐式模块格式。'],
    problem: '解决“Node 项目该选择哪种模块格式以及两者为何报错”的问题。',
  },
  {
    id: 'D_02', title: '路径、URL 与跨平台文件定位', navTitle: '路径与 URL', category: '运行时与模块',
    path: '/nodejs/d-2/path-url', summary: '使用 node:path 与 node:url 安全处理文件路径和模块位置。',
    demo: D02PathUrl, code: D02Code, language: 'vue',
    principle: '文件系统路径和 URL 是不同表示；path.resolve/join 处理平台分隔符，fileURLToPath 把 ESM 的 import.meta.url 转成文件路径。',
    flow: ['确定可信的根目录。', '规范化并拼接相对路径。', '验证最终路径仍位于允许目录。'],
    notes: ['不要手写 / 拼接跨平台路径。', '用户输入不能未经校验传给文件 API。'],
    problem: '解决“Windows 与 Linux 路径差异及 ESM 文件定位”的问题。',
  },
  {
    id: 'D_03', title: '异步文件系统操作', navTitle: '文件系统', category: '文件与事件',
    path: '/nodejs/d-3/file-system', summary: '用 fs/promises 读取配置、写入临时文件并完成原子替换。',
    demo: D03FileSystem, code: D03Code, language: 'vue',
    principle: '服务端请求路径应使用异步文件 API，避免同步 I/O 阻塞事件循环；关键写入可先写临时文件再 rename 实现原子替换。',
    flow: ['以明确编码异步读取文件。', '解析前处理不存在和权限错误。', '写临时文件后原子替换目标。'],
    notes: ['不要在热路径使用 readFileSync。', '大文件应改用流而非一次读入内存。'],
    problem: '解决“如何可靠且不阻塞地读写 Node.js 文件”的问题。',
  },
  {
    id: 'D_04', title: 'EventEmitter 与事件解耦', navTitle: '事件发布订阅', category: '文件与事件',
    path: '/nodejs/d-4/event-emitter', summary: '用订单事件连接库存和通知逻辑，理解监听器生命周期。',
    demo: D04EventEmitter, code: D04Code, language: 'vue',
    principle: 'EventEmitter 同步调用当前事件的监听器，适合同一进程内解耦模块；跨进程可靠消息需要消息队列与持久化机制。',
    flow: ['为业务事件定义稳定名称与载荷。', '订阅方注册 on 或 once 监听器。', '不再需要时 removeListener 防止泄漏。'],
    notes: ['监听器抛错会影响 emit 调用栈。', 'error 事件没有监听器时会终止进程。'],
    problem: '解决“同一进程内多个模块如何响应同一业务事件”的问题。',
  },
  {
    id: 'D_05', title: 'Stream、管道与背压', navTitle: '流与背压', category: '流与网络',
    path: '/nodejs/d-5/streams', summary: '以大报表导出理解 Readable、Writable、pipeline 与背压。',
    demo: D05Streams, code: D05Code, language: 'vue',
    principle: '流按块处理数据，避免把完整文件放入内存；背压让生产速度服从消费速度，pipeline 统一连接与错误清理。',
    flow: ['Readable 分块产生数据。', 'Transform 转换每个数据块。', 'pipeline 写入目标并传播错误。'],
    notes: ['优先使用 pipeline 而不是手工 pipe 链。', '对象模式和字节模式的 highWaterMark 含义不同。'],
    problem: '解决“大文件和网络数据如何低内存传输且不压垮消费者”的问题。',
  },
  {
    id: 'D_06', title: '原生 HTTP 服务与路由', navTitle: 'HTTP 服务', category: '流与网络',
    path: '/nodejs/d-6/http-server', summary: '从 request/response 构建最小 JSON API，理解方法、状态码与响应头。',
    demo: D06HttpServer, code: D06Code, language: 'vue',
    principle: 'node:http 提供底层流式请求与响应；服务需要显式匹配方法和路径、限制请求体、设置内容类型并统一结束响应。',
    flow: ['读取 method、URL 与请求头。', '路由到对应处理器并校验输入。', '设置状态码和响应头后发送结果。'],
    notes: ['请求体是流，必须限制最大体积。', '生产服务还需要超时、代理与优雅关闭。'],
    problem: '解决“Node.js 如何直接接收 HTTP 请求并返回规范响应”的问题。',
  },
  {
    id: 'D_07', title: '进程、环境变量与优雅退出', navTitle: '进程与配置', category: '进程与并发',
    path: '/nodejs/d-7/process-env', summary: '集中校验环境配置，并在 SIGTERM 时停止接流量和释放资源。',
    demo: D07ProcessEnv, code: D07Code, language: 'vue',
    principle: 'process 提供参数、环境、信号和退出状态；配置应在启动阶段完成校验，关闭时先停止新请求，再等待存量任务结束。',
    flow: ['启动时读取并验证环境变量。', '注册 SIGTERM/SIGINT 信号处理。', '关闭服务器和连接池后设置退出码。'],
    notes: ['不要在业务代码到处读取 process.env。', '不要用 process.exit 强行截断异步清理。'],
    problem: '解决“服务如何管理多环境配置并在部署时安全退出”的问题。',
  },
  {
    id: 'D_08', title: '异步并发控制与任务池', navTitle: '并发控制', category: '进程与并发',
    path: '/nodejs/d-8/concurrency', summary: '限制批处理并发度，避免耗尽文件句柄和下游连接。',
    demo: D08Concurrency, code: D08Code, language: 'vue',
    principle: '异步 I/O 可以并发等待，但无限 Promise.all 会同时占用外部资源；任务池以固定 worker 数限制在途任务。',
    flow: ['建立待处理任务队列。', '启动固定数量 worker。', '每个 worker 完成后领取下一任务。'],
    notes: ['CPU 密集任务考虑 Worker Threads。', '并发上限应结合下游容量压测。'],
    problem: '解决“批量异步任务如何提速又不压垮系统”的问题。',
  },
  {
    id: 'D_09', title: '错误边界与结构化日志', navTitle: '错误与日志', category: '可靠性',
    path: '/nodejs/d-9/error-logging', summary: '区分操作型错误与程序错误，并记录可检索的结构化上下文。',
    demo: D09ErrorLogging, code: D09Code, language: 'vue',
    principle: '预期的操作型错误应转换为稳定错误码和合适响应；未知程序错误应记录堆栈、请求 ID 和上下文后由进程管理器重启。',
    flow: ['在边界捕获异步错误。', '映射公开错误码与 HTTP 状态。', '以 JSON 记录请求 ID 和内部原因。'],
    notes: ['日志不得包含令牌和个人敏感信息。', 'unhandledRejection 不应只打印后继续运行。'],
    problem: '解决“服务错误如何分类、返回和排查”的问题。',
  },
  {
    id: 'D_10', title: '内置 node:test 测试运行器', navTitle: 'Node 测试', category: '可靠性',
    path: '/nodejs/d-10/node-test', summary: '使用 node:test 与 assert 编写单元测试、子测试和异步测试。',
    demo: D10NodeTest, code: D10Code, language: 'vue',
    principle: 'Node 内置测试运行器支持并发、Mock、覆盖率和多种报告格式，无需第三方框架即可验证核心模块。',
    flow: ['导入 node:test 与 strict assert。', '按行为组织测试和子测试。', '在 CI 中输出覆盖率与机器可读报告。'],
    notes: ['每个测试应可独立运行。', '不要依赖测试执行顺序和共享全局状态。'],
    problem: '解决“如何使用 Node.js 自带能力建立可靠测试套件”的问题。',
  },
  {
    id: 'D_11', title: '服务端输入与路径安全', navTitle: '输入安全', category: '安全与依赖',
    path: '/nodejs/d-11/security', summary: '防止路径穿越、注入、超大请求和敏感信息泄漏。',
    demo: D11Security, code: D11Code, language: 'vue',
    principle: '所有外部输入都不可信；服务端需要白名单校验、规范化路径、最小权限、体积限制和参数化查询等多层防护。',
    flow: ['在系统边界解析并校验输入。', '规范化后确认资源仍在允许范围。', '使用最小权限访问文件和服务。'],
    notes: ['前端校验不能替代服务端校验。', '错误响应不要暴露内部路径和堆栈。'],
    problem: '解决“Node 服务如何抵御常见输入攻击和敏感信息泄漏”的问题。',
  },
  {
    id: 'D_12', title: '包管理、SemVer 与可重复安装', navTitle: '依赖管理', category: '安全与依赖',
    path: '/nodejs/d-12/package-management', summary: '理解 package.json、锁文件、版本范围、脚本和依赖审计。',
    demo: D12PackageManagement, code: D12Code, language: 'vue',
    principle: 'package.json 声明意图，锁文件记录完整依赖图；CI 使用冻结锁文件，SemVer 范围决定允许升级的版本集合。',
    flow: ['区分运行依赖和开发依赖。', '提交并审查锁文件变更。', 'CI 冻结安装并执行依赖审计。'],
    notes: ['不要盲目自动升级主版本。', '安装脚本具有执行代码权限，需要审查来源。'],
    problem: '解决“如何让团队和 CI 安装完全一致且可审计的依赖”的问题。',
  },
  {
    id: 'S_01', title: '先判断状态归属，再选择 Store', navTitle: '状态边界', category: '设计原则',
    path: '/state-management/s-1/state-boundaries', summary: '区分组件状态、URL 状态、客户端共享状态和服务端缓存状态。',
    demo: S01StateBoundaries, code: S01Code, language: 'vue',
    principle: 'Store 只应承载需要跨组件共享、具有业务生命周期的客户端状态；局部 UI、URL 参数和远程缓存各有更合适的归属。',
    flow: ['确认状态的唯一事实来源。', '判断共享范围与生命周期。', '选择最小且匹配语义的状态工具。'],
    notes: ['全局可访问不等于应该全局存储。', '远程数据还需要缓存失效与请求去重。'],
    problem: '解决“什么状态应该进入 Store，以及什么时候根本不需要 Store”的问题。',
  },
  {
    id: 'S_02', title: 'Pinia Setup Store 与 storeToRefs', navTitle: 'Pinia Setup Store', category: 'Pinia',
    path: '/state-management/s-2/pinia-setup-store', summary: '用学习计划实现组合式 Store、派生值、Action 和响应式解构。',
    demo: S02PiniaSetupStore, code: S02Code, language: 'vue',
    principle: 'Setup Store 以 ref、computed 和函数分别表达 state、getter 与 action；storeToRefs 在解构时保留响应性，方法则直接从 Store 读取。',
    flow: ['在 defineStore 回调中声明响应式状态。', '用 computed 创建派生数据。', '组件通过 storeToRefs 安全解构状态。'],
    notes: ['不要直接解构 Store 的响应式属性。', '业务修改流程应封装为 action。'],
    problem: '解决“如何用组合式 API 组织 Pinia Store 并避免解构失去响应性”的问题。',
  },
  {
    id: 'S_03', title: 'Pinia 批量更新、订阅与副作用', navTitle: 'Pinia 订阅', category: 'Pinia',
    path: '/state-management/s-3/pinia-subscriptions', summary: '通过 $patch 和 $subscribe 记录批量状态变更。',
    demo: S03PiniaSubscriptions, code: S03Code, language: 'vue',
    principle: '$patch 可把同一业务动作中的多个修改合并表达，$subscribe 观察状态提交，适合持久化、审计和同步等基础设施副作用。',
    flow: ['用 action 或 $patch 完成一组原子修改。', '$subscribe 接收 mutation 与新状态。', '组件卸载时取消临时订阅。'],
    notes: ['订阅回调不应再次无条件修改同一状态。', 'SSR 持久化需要区分服务端和客户端。'],
    problem: '解决“如何观察 Pinia 变化并接入持久化或审计”的问题。',
  },
  {
    id: 'S_04', title: 'Zustand Store 与细粒度 Selector', navTitle: 'Zustand Selector', category: '轻量 React Store',
    path: '/state-management/s-4/zustand-selectors', summary: '用购物车 Store 展示 Hook API、Action 和 selector 订阅。',
    demo: S04ZustandSelectors, code: S04Code, language: 'jsx',
    principle: 'Zustand 创建独立于 React 树的外部 Store，组件通过 selector 订阅所需切片；切片结果不变时可以避免无关重渲染。',
    flow: ['create 定义状态和修改函数。', '组件用 selector 读取最小切片。', 'Action 通过 set 基于前一状态更新。'],
    notes: ['返回新对象的 selector 要关注相等比较。', 'Store 可以在 React 外通过 getState 使用。'],
    problem: '解决“React 中如何以很少样板代码共享状态并控制重渲染”的问题。',
  },
  {
    id: 'S_05', title: 'Zustand Middleware 与选择性订阅', navTitle: 'Zustand Middleware', category: '轻量 React Store',
    path: '/state-management/s-5/zustand-middleware', summary: '使用 subscribeWithSelector 只监听课程进度变化。',
    demo: S05ZustandMiddleware, code: S05Code, language: 'jsx',
    principle: 'Zustand middleware 包装 Store 创建器以增加持久化、DevTools、Immer 或选择性订阅等横切能力，而不改变组件消费方式。',
    flow: ['用 middleware 包装状态创建器。', '订阅特定 selector 的前后值。', '在 effect 清理阶段取消订阅。'],
    notes: ['middleware 组合顺序会影响类型和行为。', '持久化前要设计版本迁移策略。'],
    problem: '解决“如何扩展 Zustand 并监听特定状态变化”的问题。',
  },
  {
    id: 'S_06', title: 'Jotai 原子状态与派生图', navTitle: 'Jotai Atom', category: '原子化状态',
    path: '/state-management/s-6/jotai-atoms', summary: '用数量、价格和总价 Atom 理解原子组合与依赖追踪。',
    demo: S06JotaiAtoms, code: S06Code, language: 'jsx',
    principle: 'Jotai 以 atom 为最小状态单位，派生 atom 通过读取其他 atom 自动形成依赖图，只有受影响的消费者更新。',
    flow: ['创建可写基础 atom。', '读取基础 atom 构造派生 atom。', '组件用 useAtom 或专用读写 Hook 消费。'],
    notes: ['atom 配置应在组件外保持引用稳定。', '大量动态 atom 可使用 atomFamily 管理。'],
    problem: '解决“复杂页面如何把状态拆成可组合的细粒度单元”的问题。',
  },
  {
    id: 'S_07', title: 'Jotai 异步 Atom 与 Suspense', navTitle: 'Jotai 异步 Atom', category: '原子化状态',
    path: '/state-management/s-7/jotai-async-atoms', summary: '通过异步课程 Atom 展示依赖刷新、Suspense 和加载状态。',
    demo: S07JotaiAsyncAtoms, code: S07Code, language: 'jsx',
    principle: '异步 atom 的读取函数可以返回 Promise，并依赖其他 atom 触发重新计算；React Suspense 负责等待期间的界面边界。',
    flow: ['异步 atom 读取刷新依赖。', '组件读取时进入 Suspense。', '更新刷新 atom 使异步数据失效并重算。'],
    notes: ['异步 atom 适合原子依赖场景。', '复杂服务端缓存仍需专门请求库。'],
    problem: '解决“原子化状态如何表达异步依赖和重新加载”的问题。',
  },
  {
    id: 'S_08', title: 'Redux Toolkit 的 Slice 与单向数据流', navTitle: 'Redux Toolkit', category: '结构化状态',
    path: '/state-management/s-8/redux-toolkit', summary: '用报名 Slice 展示 reducer、action、selector 与 Provider。',
    demo: S08ReduxToolkit, code: S08Code, language: 'jsx',
    principle: 'Redux Toolkit 用 createSlice 同时生成 reducer 和 action，所有变更经过可追踪的 dispatch 流程，适合需要严格约束和强大工具链的团队。',
    flow: ['Slice 定义初始状态和 reducer。', 'configureStore 组合业务 Slice。', '组件通过 selector 读取并 dispatch action。'],
    notes: ['Reducer 中看似直接修改由 Immer 转为不可变更新。', '避免把所有临时 UI 状态放进 Redux。'],
    problem: '解决“大型 React 项目如何获得可预测状态流和统一调试工具”的问题。',
  },
  {
    id: 'S_09', title: 'XState 有限状态机与合法转换', navTitle: 'XState 状态机', category: '结构化状态',
    path: '/state-management/s-9/xstate-machine', summary: '用结算流程限制 editing、submitting、failure 与 success 的转换。',
    demo: S09XStateMachine, code: S09Code, language: 'jsx',
    principle: '状态机显式列举有限状态和可接受事件，使不合法转换无法发生；状态图适合结算、审批和多步骤流程。',
    flow: ['列出互斥业务状态。', '为每个状态声明可处理事件。', '组件从 snapshot 渲染并发送事件。'],
    notes: ['简单布尔值不需要状态机。', '副作用使用 actor 或 invoke 建模。'],
    problem: '解决“多个布尔值组合出非法流程状态”的问题。',
  },
  {
    id: 'S_10', title: '状态管理方案选型矩阵', navTitle: '方案选型', category: '选型与架构',
    path: '/state-management/s-10/store-selection', summary: '按框架、状态粒度、流程复杂度和团队约束比较常见方案。',
    demo: S10StoreSelection, code: S10Code, language: 'vue',
    principle: 'Pinia、Zustand、Jotai、Redux Toolkit 与 XState 解决的问题模型不同；选型应从事实来源、更新粒度、流程约束和调试需求出发。',
    flow: ['先区分客户端状态与服务端状态。', '评估框架、共享范围和更新频率。', '用最小原型验证 DevTools、SSR 和测试体验。'],
    notes: ['不要仅以包体积决定架构。', '迁移成本通常高于初始接入成本。'],
    problem: '解决“Pinia、Zustand、Jotai、Redux Toolkit 和 XState 到底如何选择”的问题。',
  },
]
