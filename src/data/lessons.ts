import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'

const demoModules = import.meta.glob<Component>('../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../demos/style-code/*', { query: '?raw', import: 'default' })

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
      : path.startsWith('js-code/')
        ? jsCodeModules
        : path.startsWith('ts-code/')
          ? tsCodeModules
          : path.startsWith('style-code/')
            ? styleCodeModules
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
const E17Transfer = createDemo('E17Transfer')
const E17Code = createCodeLoader('E17Transfer.vue')
const E18Result = createDemo('E18Result')
const E18Code = createCodeLoader('E18Result.vue')
const E19Progress = createDemo('E19Progress')
const E19Code = createCodeLoader('E19Progress.vue')
const E20Skeleton = createDemo('E20Skeleton')
const E20Code = createCodeLoader('E20Skeleton.vue')
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
const L15StructuredOutput = createDemo('L15StructuredOutput')
const L15Code = createCodeLoader('L15StructuredOutput.vue')
const L16LangGraph = createDemo('L16LangGraph')
const L16Code = createCodeLoader('L16LangGraph.vue')
const L17VectorStore = createDemo('L17VectorStore')
const L17Code = createCodeLoader('L17VectorStore.vue')
const L18Deploy = createDemo('L18Deploy')
const L18Code = createCodeLoader('L18Deploy.vue')
const L19RagPipeline = createDemo('L19RagPipeline')
const L19Code = createCodeLoader('L19RagPipeline.vue')
const L20MultiModal = createDemo('L20MultiModal')
const L20Code = createCodeLoader('L20MultiModal.vue')
const L21FunctionCalling = createDemo('L21FunctionCalling')
const L21Code = createCodeLoader('L21FunctionCalling.vue')
const L22PromptEngineering = createDemo('L22PromptEngineering')
const L22Code = createCodeLoader('L22PromptEngineering.vue')
const L23Guardrails = createDemo('L23Guardrails')
const L23Code = createCodeLoader('L23Guardrails.vue')
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
const T01Code = createCodeLoader('ts-code/T01TypeInference.ts')
const T02UnionNarrowing = createDemo('T02UnionNarrowing')
const T02Code = createCodeLoader('ts-code/T02UnionNarrowing.ts')
const T03ObjectModeling = createDemo('T03ObjectModeling')
const T03Code = createCodeLoader('ts-code/T03ObjectModeling.ts')
const T04Generics = createDemo('T04Generics')
const T04Code = createCodeLoader('ts-code/T04Generics.ts')
const T05Keyof = createDemo('T05Keyof')
const T05Code = createCodeLoader('ts-code/T05Keyof.ts')
const T06UtilityTypes = createDemo('T06UtilityTypes')
const T06Code = createCodeLoader('ts-code/T06UtilityTypes.ts')
const T07UnknownGuard = createDemo('T07UnknownGuard')
const T07Code = createCodeLoader('ts-code/T07UnknownGuard.ts')
const T08VueTyping = createDemo('T08VueTyping')
const T08Code = createCodeLoader('T08VueTyping.vue')
const T09IntersectionMixin = createDemo('T09IntersectionMixin')
const T09Code = createCodeLoader('ts-code/T09IntersectionMixin.ts')
const T10Conditional = createDemo('T10Conditional')
const T10Code = createCodeLoader('ts-code/T10Conditional.ts')
const T11Mapped = createDemo('T11Mapped')
const T11Code = createCodeLoader('ts-code/T11Mapped.ts')
const T12TemplateLiteral = createDemo('T12TemplateLiteral')
const T12Code = createCodeLoader('ts-code/T12TemplateLiteral.ts')
const T13FunctionTypes = createDemo('T13FunctionTypes')
const T13Code = createCodeLoader('ts-code/T13FunctionTypes.ts')
const T14Enums = createDemo('T14Enums')
const T14Code = createCodeLoader('ts-code/T14Enums.ts')
const T15DeclarationMerging = createDemo('T15DeclarationMerging')
const T15Code = createCodeLoader('ts-code/T15DeclarationMerging.ts')
const T16CompilerOptions = createDemo('T16CompilerOptions')
const T16Code = createCodeLoader('T16CompilerOptions.vue')
const T17DeclarationFiles = createDemo('T17DeclarationFiles')
const T17Code = createCodeLoader('T17DeclarationFiles.vue')
const T18Namespace = createDemo('T18Namespace')
const T18Code = createCodeLoader('T18Namespace.vue')
const T19BrandedTypes = createDemo('T19BrandedTypes')
const T19Code = createCodeLoader('T19BrandedTypes.vue')
const T20DiscriminatedUnion = createDemo('T20DiscriminatedUnion')
const T20Code = createCodeLoader('T20DiscriminatedUnion.vue')
const T21InferKeyword = createDemo('T21InferKeyword')
const T21Code = createCodeLoader('T21InferKeyword.vue')
const T22RecursiveTypes = createDemo('T22RecursiveTypes')
const T22Code = createCodeLoader('T22RecursiveTypes.vue')
const T23TypeLevelProgramming = createDemo('T23TypeLevelProgramming')
const T23Code = createCodeLoader('T23TypeLevelProgramming.vue')
const T24AsyncReturnType = createDemo('T24AsyncReturnType')
const T24Code = createCodeLoader('T24AsyncReturnType.vue')
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
const G13Docker = createDemo('G13Docker')
const G13Code = createCodeLoader('G13Docker.vue')
const G14GitWorkflow = createDemo('G14GitWorkflow')
const G14Code = createCodeLoader('G14GitWorkflow.vue')
const G15I18n = createDemo('G15I18n')
const G15Code = createCodeLoader('G15I18n.vue')
const G16MicroFrontend = createDemo('G16MicroFrontend')
const G16Code = createCodeLoader('G16MicroFrontend.vue')
const G17PnpmWorkspaces = createDemo('G17PnpmWorkspaces')
const G17Code = createCodeLoader('G17PnpmWorkspaces.vue')
const G18Turborepo = createDemo('G18Turborepo')
const G18Code = createCodeLoader('G18Turborepo.vue')
const G19Changesets = createDemo('G19Changesets')
const G19Code = createCodeLoader('G19Changesets.vue')
const G20Storybook = createDemo('G20Storybook')
const G20Code = createCodeLoader('G20Storybook.vue')
const G21Chromatic = createDemo('G21Chromatic')
const G21Code = createCodeLoader('G21Chromatic.vue')
const G22Playwright = createDemo('G22Playwright')
const G22Code = createCodeLoader('G22Playwright.vue')
const G23VitestConfig = createDemo('G23VitestConfig')
const G23Code = createCodeLoader('G23VitestConfig.vue')
const G24NxWorkspace = createDemo('G24NxWorkspace')
const G24Code = createCodeLoader('G24NxWorkspace.vue')
const G25BundleAnalyzer = createDemo('G25BundleAnalyzer')
const G25Code = createCodeLoader('G25BundleAnalyzer.vue')
const G26Pwa = createDemo('G26Pwa')
const G26Code = createCodeLoader('G26Pwa.vue')
const J01TypesEquality = createDemo('J01TypesEquality')
const J01Code = createCodeLoader('js-code/J01TypesEquality.js')
const J02Closure = createDemo('J02Closure')
const J02Code = createCodeLoader('js-code/J02Closure.js')
const J03ArrayPipeline = createDemo('J03ArrayPipeline')
const J03Code = createCodeLoader('js-code/J03ArrayPipeline.js')
const J04ObjectOperations = createDemo('J04ObjectOperations')
const J04Code = createCodeLoader('js-code/J04ObjectOperations.js')
const J05ThisBinding = createDemo('J05ThisBinding')
const J05Code = createCodeLoader('js-code/J05ThisBinding.js')
const J06PrototypeClass = createDemo('J06PrototypeClass')
const J06Code = createCodeLoader('js-code/J06PrototypeClass.js')
const J07PromiseCombinators = createDemo('J07PromiseCombinators')
const J07Code = createCodeLoader('js-code/J07PromiseCombinators.js')
const J08EventLoop = createDemo('J08EventLoop')
const J08Code = createCodeLoader('js-code/J08EventLoop.js')
const J09Modules = createDemo('J09Modules')
const J09Code = createCodeLoader('js-code/J09Modules.js')
const J10EventDelegation = createDemo('J10EventDelegation')
const J10Code = createCodeLoader('js-code/J10EventDelegation.js')
const J11AsyncAwait = createDemo('J11AsyncAwait')
const J11Code = createCodeLoader('js-code/J11AsyncAwait.js')
const J12IteratorsGenerators = createDemo('J12IteratorsGenerators')
const J12Code = createCodeLoader('js-code/J12IteratorsGenerators.js')
const J13ProxyReflect = createDemo('J13ProxyReflect')
const J13Code = createCodeLoader('js-code/J13ProxyReflect.js')
const J14MapSetWeakRef = createDemo('J14MapSetWeakRef')
const J14Code = createCodeLoader('js-code/J14MapSetWeakRef.js')
const J15RegExp = createDemo('J15RegExp')
const J15Code = createCodeLoader('js-code/J15RegExp.js')
const J16ErrorHandling = createDemo('J16ErrorHandling')
const J16Code = createCodeLoader('js-code/J16ErrorHandling.js')
const J17OptionalNullish = createDemo('J17OptionalNullish')
const J17Code = createCodeLoader('js-code/J17OptionalNullish.js')
const J18HigherOrder = createDemo('J18HigherOrder')
const J18Code = createCodeLoader('js-code/J18HigherOrder.js')
const J19TemplateLiterals = createDemo('J19TemplateLiterals')
const J19Code = createCodeLoader('js-code/J19TemplateLiterals.js')
const J20JsonClone = createDemo('J20JsonClone')
const J20Code = createCodeLoader('js-code/J20JsonClone.js')
const J21PropertyDescriptors = createDemo('J21PropertyDescriptors')
const J21Code = createCodeLoader('js-code/J21PropertyDescriptors.js')
const J22Symbol = createDemo('J22Symbol')
const J22Code = createCodeLoader('js-code/J22Symbol.js')
const J23StringIntl = createDemo('J23StringIntl')
const J23Code = createCodeLoader('js-code/J23StringIntl.js')
const J24LogicalBitwise = createDemo('J24LogicalBitwise')
const J24Code = createCodeLoader('js-code/J24LogicalBitwise.js')
const J25FetchApi = createDemo('J25FetchApi')
const J25Code = createCodeLoader('js-code/J25FetchApi.js')
const J26WebStorage = createDemo('J26WebStorage')
const J26Code = createCodeLoader('js-code/J26WebStorage.js')
const J27WebSocket = createDemo('J27WebSocket')
const J27Code = createCodeLoader('js-code/J27WebSocket.js')
const J28AbortController = createDemo('J28AbortController')
const J28Code = createCodeLoader('js-code/J28AbortController.js')
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
const D13ExpressFastify = createDemo('D13ExpressFastify')
const D13Code = createCodeLoader('D13ExpressFastify.vue')
const D14WebSocket = createDemo('D14WebSocket')
const D14Code = createCodeLoader('D14WebSocket.vue')
const D15Database = createDemo('D15Database')
const D15Code = createCodeLoader('D15Database.vue')
const D16WorkerThreads = createDemo('D16WorkerThreads')
const D16Code = createCodeLoader('D16WorkerThreads.vue')
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
const TW01UtilityFirst = createDemo('TW01UtilityFirst')
const TW01Code = createCodeLoader('style-code/TW01UtilityFirst.html')
const TW02Responsive = createDemo('TW02Responsive')
const TW02Code = createCodeLoader('style-code/TW02Responsive.html')
const TW03StateVariants = createDemo('TW03StateVariants')
const TW03Code = createCodeLoader('style-code/TW03StateVariants.html')
const TW04DarkMode = createDemo('TW04DarkMode')
const TW04Code = createCodeLoader('style-code/TW04DarkMode.html')
const TW05ThemeTokens = createDemo('TW05ThemeTokens')
const TW05Code = createCodeLoader('style-code/TW05ThemeTokens.css.txt')
const TW06ArbitraryValues = createDemo('TW06ArbitraryValues')
const TW06Code = createCodeLoader('style-code/TW06ArbitraryValues.html')
const TW07Layout = createDemo('TW07Layout')
const TW07Code = createCodeLoader('style-code/TW07Layout.html')
const TW08ContainerQueries = createDemo('TW08ContainerQueries')
const TW08Code = createCodeLoader('style-code/TW08ContainerQueries.html')
const TW09Installation = createDemo('TW09Installation')
const TW09Code = createCodeLoader('style-code/TW09Installation.css.txt')
const TW10Typography = createDemo('TW10Typography')
const TW10Code = createCodeLoader('style-code/TW10Typography.html')
const TW11SizingSpacing = createDemo('TW11SizingSpacing')
const TW11Code = createCodeLoader('style-code/TW11SizingSpacing.html')
const TW12BordersEffects = createDemo('TW12BordersEffects')
const TW12Code = createCodeLoader('style-code/TW12BordersEffects.html')
const TW13Motion = createDemo('TW13Motion')
const TW13Code = createCodeLoader('style-code/TW13Motion.html')
const TW14Forms = createDemo('TW14Forms')
const TW14Code = createCodeLoader('style-code/TW14Forms.html')
const TW15CustomUtilities = createDemo('TW15CustomUtilities')
const TW15Code = createCodeLoader('style-code/TW15CustomUtilities.css.txt')
const TW16Production = createDemo('TW16Production')
const TW16Code = createCodeLoader('style-code/TW16Production.css.txt')
const TW17GridLayout = createDemo('TW17GridLayout')
const TW17Code = createCodeLoader('TW17GridLayout.vue')
const TW18FlexGrid = createDemo('TW18FlexGrid')
const TW18Code = createCodeLoader('TW18FlexGrid.vue')
const TW19Interactivity = createDemo('TW19Interactivity')
const TW19Code = createCodeLoader('TW19Interactivity.vue')
const TW20Transform = createDemo('TW20Transform')
const TW20Code = createCodeLoader('TW20Transform.vue')
const TW21Filters = createDemo('TW21Filters')
const TW21Code = createCodeLoader('TW21Filters.vue')
const TW22SvgIcons = createDemo('TW22SVGIcons')
const TW22Code = createCodeLoader('TW22SVGIcons.vue')
const TW23Plugins = createDemo('TW23Plugins')
const TW23Code = createCodeLoader('TW23Plugins.vue')
const TW24Preset = createDemo('TW24Preset')
const TW24Code = createCodeLoader('TW24Preset.vue')
const SC01VariablesNesting = createDemo('SC01VariablesNesting')
const SC01Code = createCodeLoader('style-code/SC01VariablesNesting.scss.txt')
const SC02Modules = createDemo('SC02Modules')
const SC02Code = createCodeLoader('style-code/SC02Modules.scss.txt')
const SC03Mixins = createDemo('SC03Mixins')
const SC03Code = createCodeLoader('style-code/SC03Mixins.scss.txt')
const SC04Functions = createDemo('SC04Functions')
const SC04Code = createCodeLoader('style-code/SC04Functions.scss.txt')
const SC05Collections = createDemo('SC05Collections')
const SC05Code = createCodeLoader('style-code/SC05Collections.scss.txt')
const SC06Selectors = createDemo('SC06Selectors')
const SC06Code = createCodeLoader('style-code/SC06Selectors.scss.txt')
const SC07Extend = createDemo('SC07Extend')
const SC07Code = createCodeLoader('style-code/SC07Extend.scss.txt')
const SC08Architecture = createDemo('SC08Architecture')
const SC08Code = createCodeLoader('style-code/SC08Architecture.scss.txt')
const SC09ValuesUnits = createDemo('SC09ValuesUnits')
const SC09Code = createCodeLoader('style-code/SC09ValuesUnits.scss.txt')
const SC10Math = createDemo('SC10Math')
const SC10Code = createCodeLoader('style-code/SC10Math.scss.txt')
const SC11Color = createDemo('SC11Color')
const SC11Code = createCodeLoader('style-code/SC11Color.scss.txt')
const SC12Configuration = createDemo('SC12Configuration')
const SC12Code = createCodeLoader('style-code/SC12Configuration.scss.txt')
const SC13AtRoot = createDemo('SC13AtRoot')
const SC13Code = createCodeLoader('style-code/SC13AtRoot.scss.txt')
const SC14MediaQueries = createDemo('SC14MediaQueries')
const SC14Code = createCodeLoader('style-code/SC14MediaQueries.scss.txt')
const SC15CustomProperties = createDemo('SC15CustomProperties')
const SC15Code = createCodeLoader('style-code/SC15CustomProperties.scss.txt')
const SC16Diagnostics = createDemo('SC16Diagnostics')
const SC16Code = createCodeLoader('style-code/SC16Diagnostics.scss.txt')
const SC17Interpolation = createDemo('SC17Interpolation')
const SC17Code = createCodeLoader('SC17Interpolation.vue')
const SC18Placeholders = createDemo('SC18Placeholders')
const SC18Code = createCodeLoader('SC18Placeholders.vue')
const SC19ErrorHandling = createDemo('SC19ErrorHandling')
const SC19Code = createCodeLoader('SC19ErrorHandling.vue')
const SC20ContentBlocks = createDemo('SC20ContentBlocks')
const SC20Code = createCodeLoader('SC20ContentBlocks.vue')
const SC21ControlFlow = createDemo('SC21ControlFlow')
const SC21Code = createCodeLoader('SC21ControlFlow.vue')
const SC22MapFunctions = createDemo('SC22MapFunctions')
const SC22Code = createCodeLoader('SC22MapFunctions.vue')
const SC23ListFunctions = createDemo('SC23ListFunctions')
const SC23Code = createCodeLoader('SC23ListFunctions.vue')
const SC24ModuleSystem = createDemo('SC24ModuleSystem')
const SC24Code = createCodeLoader('SC24ModuleSystem.vue')
const C01Selectors = createDemo('C01Selectors')
const C01Code = createCodeLoader('C01Selectors.vue')
const C02BoxModel = createDemo('C02BoxModel')
const C02Code = createCodeLoader('C02BoxModel.vue')
const C03Flexbox = createDemo('C03Flexbox')
const C03Code = createCodeLoader('C03Flexbox.vue')
const C04Grid = createDemo('C04Grid')
const C04Code = createCodeLoader('C04Grid.vue')
const C05Position = createDemo('C05Position')
const C05Code = createCodeLoader('C05Position.vue')
const C06Cascade = createDemo('C06Cascade')
const C06Code = createCodeLoader('C06Cascade.vue')
const C07Variables = createDemo('C07Variables')
const C07Code = createCodeLoader('C07Variables.vue')
const C08Transition = createDemo('C08Transition')
const C08Code = createCodeLoader('C08Transition.vue')
const C09MediaQuery = createDemo('C09MediaQuery')
const C09Code = createCodeLoader('C09MediaQuery.vue')
const C10Gradient = createDemo('C10Gradient')
const C10Code = createCodeLoader('C10Gradient.vue')
const C11Filter = createDemo('C11Filter')
const C11Code = createCodeLoader('C11Filter.vue')
const C12MathFunctions = createDemo('C12MathFunctions')
const C12Code = createCodeLoader('C12MathFunctions.vue')
const C13ViewportUnits = createDemo('C13ViewportUnits')
const C13Code = createCodeLoader('C13ViewportUnits.vue')
const C14ClipPath = createDemo('C14ClipPath')
const C14Code = createCodeLoader('C14ClipPath.vue')
const C15LogicalProperties = createDemo('C15LogicalProperties')
const C15Code = createCodeLoader('C15LogicalProperties.vue')
const C16ContainerQuery = createDemo('C16ContainerQuery')
const C16Code = createCodeLoader('C16ContainerQuery.vue')
const C17StackingContext = createDemo('C17StackingContext')
const C17Code = createCodeLoader('C17StackingContext.vue')
const C18FormattingContext = createDemo('C18FormattingContext')
const C18Code = createCodeLoader('C18FormattingContext.vue')
const C19BEM = createDemo('C19BEM')
const C19Code = createCodeLoader('C19BEM.vue')
const C20Performance = createDemo('C20Performance')
const C20Code = createCodeLoader('C20Performance.vue')
const C21CascadeLayers = createDemo('C21CascadeLayers')
const C21Code = createCodeLoader('C21CascadeLayers.vue')
const C22HasSelector = createDemo('C22HasSelector')
const C22Code = createCodeLoader('C22HasSelector.vue')
const C23ScrollSnap = createDemo('C23ScrollSnap')
const C23Code = createCodeLoader('C23ScrollSnap.vue')
const C24AspectRatio = createDemo('C24AspectRatio')
const C24Code = createCodeLoader('C24AspectRatio.vue')
const V01Core = createDemo('V01Core')
const V01Code = createCodeLoader('V01Core.vue')
const V02Config = createDemo('V02Config')
const V02Code = createCodeLoader('V02Config.vue')
const V03Plugins = createDemo('V03Plugins')
const V03Code = createCodeLoader('V03Plugins.vue')
const V04HMR = createDemo('V04HMR')
const V04Code = createCodeLoader('V04HMR.vue')
const V05Env = createDemo('V05Env')
const V05Code = createCodeLoader('V05Env.vue')
const V06Assets = createDemo('V06Assets')
const V06Code = createCodeLoader('V06Assets.vue')
const V07PreBundle = createDemo('V07PreBundle')
const V07Code = createCodeLoader('V07PreBundle.vue')
const V08Build = createDemo('V08Build')
const V08Code = createCodeLoader('V08Build.vue')
const V09MPA = createDemo('V09MPA')
const V09Code = createCodeLoader('V09MPA.vue')
const V10Lib = createDemo('V10Lib')
const V10Code = createCodeLoader('V10Lib.vue')
const V11SSR = createDemo('V11SSR')
const V11Code = createCodeLoader('V11SSR.vue')
const V12CSS = createDemo('V12CSS')
const V12Code = createCodeLoader('V12CSS.vue')
const V13TypeScript = createDemo('V13TypeScript')
const V13Code = createCodeLoader('V13TypeScript.vue')
const V14Proxy = createDemo('V14Proxy')
const V14Code = createCodeLoader('V14Proxy.vue')
const V15Perf = createDemo('V15Perf')
const V15Code = createCodeLoader('V15Perf.vue')
const V16PluginDev = createDemo('V16PluginDev')
const V16Code = createCodeLoader('V16PluginDev.vue')
const V17DependencyPrebundle = createDemo('V17DependencyPrebundle')
const V17Code = createCodeLoader('V17DependencyPrebundle.vue')
const V18Esbuild = createDemo('V18Esbuild')
const V18Code = createCodeLoader('V18Esbuild.vue')
const V19RollupPlugin = createDemo('V19RollupPlugin')
const V19Code = createCodeLoader('V19RollupPlugin.vue')
const V20LibraryMode = createDemo('V20LibraryMode')
const V20Code = createCodeLoader('V20LibraryMode.vue')
const V21MultiPage = createDemo('V21MultiPage')
const V21Code = createCodeLoader('V21MultiPage.vue')
const D17EventLoop = createDemo('D17EventLoop')
const D17Code = createCodeLoader('D17EventLoop.vue')
const D18Buffer = createDemo('D18Buffer')
const D18Code = createCodeLoader('D18Buffer.vue')
const D19ChildProcess = createDemo('D19ChildProcess')
const D19Code = createCodeLoader('D19ChildProcess.vue')
const D20Cluster = createDemo('D20Cluster')
const D20Code = createCodeLoader('D20Cluster.vue')
const D21Crypto = createDemo('D21Crypto')
const D21Code = createCodeLoader('D21Crypto.vue')
const D22PerfHooks = createDemo('D22PerfHooks')
const D22Code = createCodeLoader('D22PerfHooks.vue')
const D23Https = createDemo('D23Https')
const D23Code = createCodeLoader('D23Https.vue')
const D24Cli = createDemo('D24Cli')
const D24Code = createCodeLoader('D24Cli.vue')
const D25Timers = createDemo('D25Timers')
const D25Code = createCodeLoader('D25Timers.vue')
const D26NetTcp = createDemo('D26NetTcp')
const D26Code = createCodeLoader('D26NetTcp.vue')
const D27Zlib = createDemo('D27Zlib')
const D27Code = createCodeLoader('D27Zlib.vue')
const D28Os = createDemo('D28Os')
const D28Code = createCodeLoader('D28Os.vue')
const D29Dns = createDemo('D29Dns')
const D29Code = createCodeLoader('D29Dns.vue')
const D30Readline = createDemo('D30Readline')
const D30Code = createCodeLoader('D30Readline.vue')
const X01ProjectStructure = createDemo('X01ProjectStructure')
const X01Code = createCodeLoader('X01ProjectStructure.vue')
const X02FileRouting = createDemo('X02FileRouting')
const X02Code = createCodeLoader('X02FileRouting.vue')
const X03Layouts = createDemo('X03Layouts')
const X03Code = createCodeLoader('X03Layouts.vue')
const X04DynamicRoutes = createDemo('X04DynamicRoutes')
const X04Code = createCodeLoader('X04DynamicRoutes.vue')
const X05ServerComponents = createDemo('X05ServerComponents')
const X05Code = createCodeLoader('X05ServerComponents.vue')
const X06ClientComponents = createDemo('X06ClientComponents')
const X06Code = createCodeLoader('X06ClientComponents.vue')
const X07StaticDynamic = createDemo('X07StaticDynamic')
const X07Code = createCodeLoader('X07StaticDynamic.vue')
const X08StreamingSuspense = createDemo('X08StreamingSuspense')
const X08Code = createCodeLoader('X08StreamingSuspense.vue')
const X09DataFetching = createDemo('X09DataFetching')
const X09Code = createCodeLoader('X09DataFetching.vue')
const X10ServerActions = createDemo('X10ServerActions')
const X10Code = createCodeLoader('X10ServerActions.vue')
const X11RouteHandlers = createDemo('X11RouteHandlers')
const X11Code = createCodeLoader('X11RouteHandlers.vue')
const X12Caching = createDemo('X12Caching')
const X12Code = createCodeLoader('X12Caching.vue')
const X13ParallelRoutes = createDemo('X13ParallelRoutes')
const X13Code = createCodeLoader('X13ParallelRoutes.vue')
const X14InterceptingRoutes = createDemo('X14InterceptingRoutes')
const X14Code = createCodeLoader('X14InterceptingRoutes.vue')
const X15RouteGroups = createDemo('X15RouteGroups')
const X15Code = createCodeLoader('X15RouteGroups.vue')
const X16LoadingError = createDemo('X16LoadingError')
const X16Code = createCodeLoader('X16LoadingError.vue')
const X17NextImage = createDemo('X17NextImage')
const X17Code = createCodeLoader('X17NextImage.vue')
const X18NextFont = createDemo('X18NextFont')
const X18Code = createCodeLoader('X18NextFont.vue')
const X19NextLink = createDemo('X19NextLink')
const X19Code = createCodeLoader('X19NextLink.vue')
const X20Metadata = createDemo('X20Metadata')
const X20Code = createCodeLoader('X20Metadata.vue')
const X21Middleware = createDemo('X21Middleware')
const X21Code = createCodeLoader('X21Middleware.vue')
const X22EnvConfig = createDemo('X22EnvConfig')
const X22Code = createCodeLoader('X22EnvConfig.vue')
const X23I18n = createDemo('X23I18n')
const X23Code = createCodeLoader('X23I18n.vue')
const X24Deployment = createDemo('X24Deployment')
const X24Code = createCodeLoader('X24Deployment.vue')

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
  { id: 'javascript', name: 'JavaScript', path: '/javascript', status: 'ready', intro: 'JavaScript 是 Web 平台的核心语言。本分类从类型、函数和对象模型出发，逐步覆盖异步机制、模块化与浏览器事件。', officialUrl: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript' },
  { id: 'typescript', name: 'TypeScript', path: '/typescript', status: 'ready', intro: 'TypeScript 为 JavaScript 增加可渐进采用的静态类型系统。本分类以 Vue 3 真实业务数据为背景，覆盖建模、收窄、泛型、类型操作与组件类型实践。', officialUrl: 'https://www.typescriptlang.org/' },
  { id: 'vue', name: 'Vue3', path: '/vue', status: 'ready', intro: 'Vue3 是渐进式 JavaScript 框架。本分类用真实小业务场景拆解组合式 API、组件、路由、状态管理和工程实践。', officialUrl: 'https://vuejs.org/' },
  { id: 'element-plus', name: 'Element Plus', path: '/element-plus', status: 'ready', intro: 'Element Plus 是基于 Vue 3 的组件库，提供丰富的企业级 UI 组件，覆盖表格、表单、弹窗、导航等常见场景。', officialUrl: 'https://element-plus.org/' },
  { id: 'state-management', name: '状态管理', path: '/state-management', status: 'ready', intro: '从状态归属出发，对比 Pinia、Zustand、Jotai、Redux Toolkit 与 XState 等方案的模型、粒度和适用边界。' },
  { id: 'nuxt', name: 'Nuxt', path: '/nuxt', status: 'ready', intro: 'Nuxt 是基于 Vue 3 的全栈框架，内置文件路由、自动导入、SSR/SSG、服务端 API 等能力，让 Vue 项目从单页应用升级为全栈应用。', officialUrl: 'https://nuxt.com/' },
  { id: 'nodejs', name: 'Node.js', path: '/nodejs', status: 'ready', intro: 'Node.js 让 JavaScript 运行在服务端和工具链中。本分类覆盖模块、文件、事件、流、HTTP、进程、测试、安全与依赖管理。', officialUrl: 'https://nodejs.org/docs/latest/api/' },
  { id: 'engineering', name: '工程化', path: '/engineering', status: 'ready', intro: '工程化把代码质量、自动化测试、持续集成、性能、无障碍与安全发布串成可重复的交付流程，让项目在规模增长后仍然可靠。', officialUrl: 'https://vite.dev/' },
  { id: 'css', name: 'CSS', path: '/css', status: 'ready', intro: 'CSS 是 Web 样式的核心语言。本分类从选择器、盒模型、布局系统出发，逐步覆盖定位、层叠、变量、动画、响应式、裁剪、逻辑属性、容器查询与性能优化。', officialUrl: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS' },
  { id: 'tailwind-css', name: 'Tailwind CSS', path: '/tailwind-css', status: 'ready', intro: 'Tailwind CSS 以原子化工具类直接组合界面。本分类基于 v4 的 CSS-first 模型，覆盖响应式、状态变体、主题令牌、暗色模式、任意值与容器查询。', officialUrl: 'https://tailwindcss.com/docs' },
  { id: 'sass', name: 'Sass', path: '/sass', status: 'ready', intro: 'Sass 为 CSS 增加模块、变量、嵌套、Mixin、函数与集合操作。本分类使用现代模块系统组织可维护样式，避开已弃用的 @import 工作流。', officialUrl: 'https://sass-lang.com/documentation/' },
  { id: 'vite', name: 'Vite', path: '/vite', status: 'ready', intro: 'Vite 是新一代前端构建工具，以原生 ESM 开发服务器和基于 Rollup 的生产构建为核心。本分类覆盖配置、插件、HMR、环境变量、静态资源、依赖预构建、构建优化、MPA、库模式、SSR、CSS、TypeScript、代理、性能分析与自定义插件。', officialUrl: 'https://vite.dev/' },
  { id: 'react', name: 'React', path: '/react', status: 'ready', intro: 'React 以组件和声明式渲染组织用户界面。本分类基于 React 19.2，通过浏览器 ES Module 直接引用 React，不向当前 Vue3 工程安装 React 依赖。', officialUrl: 'https://react.dev/' },
  { id: 'nextjs', name: 'Next.js', path: '/nextjs', status: 'ready', intro: 'Next.js 是基于 React 的全栈框架，以 App Router 为核心，覆盖文件路由、服务端/客户端组件、数据获取与缓存、Server Actions、Route Handlers、流式渲染、图片/字体优化、SEO、中间件与部署。', officialUrl: 'https://nextjs.org/docs' },
  { id: 'langchain', name: 'LangChain', path: '/langchain', status: 'ready', intro: 'LangChain.js 是构建 LLM 应用的开源框架，提供模型调用、提示模板、链式调用、RAG 检索增强生成等核心能力，帮助开发者快速搭建智能应用。', officialUrl: 'https://js.langchain.com/' },
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
  {
    id: 'E_17', title: '穿梭框：Transfer 数据分配', navTitle: '穿梭框', category: '数据组件',
    path: '/element-plus/e-17/transfer', summary: '用课程分类分配展示 ElTransfer 的筛选、移动和自定义渲染。',
    demo: E17Transfer, code: E17Code, language: 'vue',
    principle: 'ElTransfer 提供双列表穿梭选择，支持搜索过滤、自定义渲染和左右面板标题，适合需要在两个集合间移动数据的场景。',
    flow: ['准备带 key/label 的数据源。', '配置筛选和自定义渲染。', '通过 v-model 获取右侧选中项。'],
    notes: ['数据项的 key 必须唯一。', '大数据量时注意 filter-method 性能。'],
    problem: '解决"如何在两个集合之间直观地分配和移动数据项"的问题。',
  },
  {
    id: 'E_18', title: '结果页：Result 操作反馈', navTitle: '结果页', category: '反馈组件',
    path: '/element-plus/e-18/result', summary: '用课程提交结果展示 ElResult 的成功、警告、错误和信息状态。',
    demo: E18Result, code: E18Code, language: 'vue',
    principle: 'ElResult 提供标准化的操作结果反馈页面，内置 success/warning/error/info 四种状态，支持自定义标题、描述和操作按钮。',
    flow: ['根据操作结果选择对应状态类型。', '设置标题和描述说明。', '在 extra 插槽中放置操作按钮。'],
    notes: ['结果页适合操作完成后的整页反馈。', '轻量反馈优先使用 ElMessage 或 ElMessageBox。'],
    problem: '解决"表单提交或操作完成后如何给出标准化反馈页面"的问题。',
  },
  {
    id: 'E_19', title: '进度条：Progress 学习进度', navTitle: '进度条', category: '数据组件',
    path: '/element-plus/e-19/progress', summary: '用课程学习进度展示 ElProgress 的线形、环形和仪表盘模式。',
    demo: E19Progress, code: E19Code, language: 'vue',
    principle: 'ElProgress 通过 percentage 控制进度，type 切换线形和环形，color 支持分段着色，stroke-width 调整粗细，适合展示任务完成度。',
    flow: ['根据业务数据计算百分比。', '选择合适的展示类型和颜色方案。', '动态更新进度并处理完成状态。'],
    notes: ['环形进度条的 width 控制整体尺寸。', '多色分段用数组形式的 color 属性。'],
    problem: '解决"如何直观展示任务完成度或操作进度"的问题。',
  },
  {
    id: 'E_20', title: '骨架屏：Skeleton 加载占位', navTitle: '骨架屏', category: '反馈组件',
    path: '/element-plus/e-20/skeleton', summary: '用课程卡片加载态展示 ElSkeleton 的基础占位和自定义模板。',
    demo: E20Skeleton, code: E20Code, language: 'vue',
    principle: 'ElSkeleton 在数据加载期间展示占位内容，减少白屏感；loading 控制显隐，animated 添加闪光动画，template 插槽支持自定义占位结构。',
    flow: ['数据加载中显示骨架屏。', '通过 loading 属性切换骨架和内容。', '用 template 插槽定制占位结构。'],
    notes: ['骨架屏形状应尽量贴近真实内容布局。', '避免对所有组件都使用骨架屏，简单加载态可用 v-loading。'],
    problem: '解决"数据加载期间如何减少白屏感并提供更好的加载体验"的问题。',
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
    id: 'L_15', title: '结构化输出与 Zod Schema', navTitle: '结构化输出', category: '输出控制',
    path: '/langchain/l-15/structured-output', summary: '用 Zod Schema 约束 LLM 输出为结构化数据，对比 JSON Mode 和函数调用。',
    demo: L15StructuredOutput, code: L15Code, language: 'vue',
    principle: '结构化输出通过 Schema 定义强制 LLM 返回指定格式的数据；JSON Mode 适合简单结构，函数调用（withStructuredOutput）提供更可靠的格式保证和校验。',
    flow: ['用 Zod 定义输出数据的 Schema。', '选择 JSON Mode 或函数调用模式。', '验证并解析返回的结构化结果。'],
    notes: ['函数调用模式的格式可靠性高于 JSON Mode。', 'Zod Schema 同时提供运行时校验和类型推导。'],
    problem: '解决"如何让 LLM 稳定返回可解析的结构化数据而非自由文本"的问题。',
  },
  {
    id: 'L_16', title: 'LangGraph 多智能体编排', navTitle: 'LangGraph', category: '智能体',
    path: '/langchain/l-16/langgraph', summary: '用状态图编排课程推荐智能体，掌握节点、边和条件路由。',
    demo: L16LangGraph, code: L16Code, language: 'vue',
    principle: 'LangGraph 把智能体工作流建模为有向图：节点执行计算，边定义转移，条件边根据状态动态路由；状态在节点间共享并支持检查点和回溯。',
    flow: ['定义状态接口和节点函数。', '用条件边连接节点形成工作流。', '编译图并传入初始状态执行。'],
    notes: ['LangGraph 支持检查点，可暂停和恢复执行。', '条件边使工作流能根据中间结果动态分支。'],
    problem: '解决"如何把复杂智能体工作流建模为可控、可调试的状态图"的问题。',
  },
  {
    id: 'L_17', title: '向量存储与检索策略', navTitle: '向量存储', category: 'RAG',
    path: '/langchain/l-17/vector-store', summary: '比较 Chroma、FAISS、Pinecone 和 pgvector 的适用场景与检索策略。',
    demo: L17VectorStore, code: L17Code, language: 'vue',
    principle: '向量存储把文本嵌入为高维向量并按相似度检索；不同后端在规模、延迟、混合搜索和部署复杂度上各有取舍，检索策略需结合关键词和语义。',
    flow: ['选择合适的向量数据库。', '配置嵌入模型和相似度度量。', '结合关键词过滤实现混合检索。'],
    notes: ['小规模实验用 Chroma/FAISS，生产环境考虑 Pinecone/pgvector。', '混合检索（向量+关键词）通常比纯向量效果更好。'],
    problem: '解决"如何选择合适的向量存储并设计高效的 RAG 检索策略"的问题。',
  },
  {
    id: 'L_18', title: '部署优化与语义缓存', navTitle: '部署优化', category: '工程实践',
    path: '/langchain/l-18/deploy', summary: '掌握 LLM 应用的缓存、流式输出、Token 预算和成本控制策略。',
    demo: L18Deploy, code: L18Code, language: 'vue',
    principle: 'LLM 应用部署需要关注延迟（语义缓存、流式输出）、成本（Token 预算、模型选择）和可靠性（重试、降级），优化策略直接影响用户体验和运营成本。',
    flow: ['实现语义缓存减少重复调用。', '使用 SSE 流式输出降低感知延迟。', '设置 Token 预算和成本监控。'],
    notes: ['语义缓存的相似度阈值需要调优。', '流式输出需要前端配合逐块渲染。'],
    problem: '解决"LLM 应用如何优化延迟、控制成本并保证生产可靠性"的问题。',
  },
  {
    id: 'L_19', title: 'RAG 完整流水线实现', navTitle: 'RAG 流水线', category: 'RAG',
    path: '/langchain/l-19/rag-pipeline', summary: '端到端实现文档加载、切分、向量化、存储、检索、重排、生成的完整 RAG 流水线。',
    demo: L19RagPipeline, code: L19Code, language: 'vue',
    principle: 'RAG（检索增强生成）完整流水线包括文档加载、切分、向量化、存储、检索、重排、生成七个环节，每个环节的质量都会影响最终回答效果，需要端到端优化。',
    flow: ['文档加载和清洗，去除无效内容', '按语义切分文档块，控制大小和重叠', '向量化后存入向量数据库', '用户提问时检索相关文档，重排后送给 LLM 生成回答'],
    notes: ['文档切分策略对检索质量影响很大', '检索结果不是越多越好，要精准', '加入重排（rerank）可以显著提升相关性'],
    problem: '解决 LLM 知识过时、无法访问私有数据、回答不准确的问题。',
  },
  {
    id: 'L_20', title: '多模态模型与视觉理解', navTitle: '多模态', category: '模型能力',
    path: '/langchain/l-20/multi-modal', summary: '使用多模态模型同时理解文本和图像，实现图像描述、图表分析、OCR 等视觉任务。',
    demo: L20MultiModal, code: L20Code, language: 'vue',
    principle: '多模态模型可以同时理解文本和图像，LangChain 通过 ChatMessage 中的 image_url 内容类型支持视觉理解，适合图像描述、图表分析、OCR 等场景。',
    flow: ['使用支持多模态的模型（如 GPT-4V、Claude 3）', '构建包含 text 和 image_url 的消息内容', '模型理解图像后返回文本描述或分析结果'],
    notes: ['图像可以是 URL 或 base64 编码', '图像清晰度和提示词质量影响理解效果', '适合截图分析、图表解读、照片描述等场景'],
    problem: '解决传统 LLM 只能处理文本、无法理解视觉信息的问题。',
  },
  {
    id: 'L_21', title: '函数调用与工具扩展', navTitle: '函数调用', category: '工具与代理',
    path: '/langchain/l-21/function-calling', summary: '通过 Function Calling 让 LLM 调用外部工具，扩展实时数据获取和操作执行能力。',
    demo: L21FunctionCalling, code: L21Code, language: 'vue',
    principle: '函数调用（Function Calling）让 LLM 可以调用外部工具获取实时数据或执行操作，LangChain 通过 Tool 抽象统一管理工具，Agent 自动决定何时调用哪个工具。',
    flow: ['定义工具的名称、描述和参数 schema', '将工具注册给模型或 Agent', '模型判断需要调用工具时返回工具调用指令', '执行工具后将结果返回给模型继续生成'],
    notes: ['工具描述的清晰度直接影响模型调用的准确性', '工具参数用 Zod schema 定义可以做运行时校验', '常用工具：搜索、计算器、数据库查询、API 调用'],
    problem: '解决 LLM 知识有截止日期、无法访问实时数据和外部系统的问题。',
  },
  {
    id: 'L_22', title: '提示词工程最佳实践', navTitle: '提示词工程', category: '提示工程',
    path: '/langchain/l-22/prompt-engineering', summary: '掌握角色设定、清晰指令、示例引导、思维链、结构化输出等提示词工程核心技巧。',
    demo: L22PromptEngineering, code: L22Code, language: 'vue',
    principle: '提示词工程是通过设计高质量输入来引导 LLM 产出更好结果的技术，核心原则包括：角色设定、清晰指令、示例引导、思维链、结构化输出等。',
    flow: ['明确角色定位，让模型进入对应领域专家状态', '给出清晰的任务描述和输出格式要求', '提供少量示例（Few-shot）帮助模型理解意图', '用思维链（CoT）引导模型分步推理'],
    notes: ['提示词需要迭代优化，不要期望一次就完美', '好的提示词应该具体、可评估、可复用', '温度参数控制随机性，事实类任务调低温度'],
    problem: '解决模型输出质量不稳定、回答不符合预期、格式不统一的问题。',
  },
  {
    id: 'L_23', title: '输出护栏与安全验证', navTitle: '输出护栏', category: '安全与治理',
    path: '/langchain/l-23/guardrails', summary: '在 LLM 输出前后进行验证和修正，确保输出符合业务规则、格式要求和安全政策。',
    demo: L23Guardrails, code: L23Code, language: 'vue',
    principle: '输出护栏（Guardrails）在 LLM 输出前后进行验证和修正，确保输出符合业务规则、格式要求和安全政策，避免有害内容、格式错误和越权回答。',
    flow: ['定义验证规则：格式校验、内容安全、业务约束', '输入护栏检查用户提问是否合法', '输出护栏校验模型回答，不通过则重试或修正', '记录所有拦截和修正用于审计'],
    notes: ['护栏不是越多越好，平衡安全和用户体验', '结构化输出配合 Zod 校验是最常用的护栏', '敏感领域（医疗、法律）需要更严格的护栏'],
    problem: '解决 LLM 输出不可控、格式不稳定、可能产生有害内容的安全风险问题。',
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
    demo: T01TypeInference, code: T01Code, language: 'typescript',
    principle: 'TypeScript 会根据初始值推导变量类型；当值可能为空、类型会变化或公共 API 需要稳定契约时，应补充显式类型标注。',
    flow: ['先让编译器从确定的初始值推导类型。', '遇到联合状态或空值时显式声明。', '在编辑器和类型检查阶段发现不合法赋值。'],
    notes: ['避免给所有局部变量重复写显而易见的类型。', '不要用 any 绕过建模问题。'],
    problem: '解决"哪些类型可以交给编译器推导、哪些边界必须显式声明"的问题。',
  },
  {
    id: 'T_02', title: '联合类型与控制流收窄', navTitle: '联合与收窄', category: '类型基础',
    path: '/typescript/t-2/union-narrowing', summary: '用订单状态机掌握字面量联合类型和条件分支收窄。',
    demo: T02UnionNarrowing, code: T02Code, language: 'typescript',
    principle: '联合类型列出值的有限可能，TypeScript 会根据相等判断、typeof、in 等运行时检查逐步收窄到具体成员。',
    flow: ['用字面量联合定义合法状态。', '在条件分支中判断当前状态。', '收窄后执行该状态专属的业务逻辑。'],
    notes: ['状态值应来自一个统一类型。', '穷尽检查能在新增状态时提醒遗漏分支。'],
    problem: '解决"如何让非法业务状态无法被创建，并安全处理不同分支"的问题。',
  },
  {
    id: 'T_03', title: '对象类型与领域建模', navTitle: '对象建模', category: '类型基础',
    path: '/typescript/t-3/object-modeling', summary: '通过会员资料区分 interface、type 与对象结构约束。',
    demo: T03ObjectModeling, code: T03Code, language: 'typescript',
    principle: 'interface 适合表达可扩展的对象契约，type 能组合联合、交叉和其他类型表达式；两者都遵循结构化类型系统。',
    flow: ['识别领域对象的稳定字段。', '声明字段类型和有限枚举值。', '让响应式状态遵守同一份业务契约。'],
    notes: ['公共模型应使用业务语言命名。', '可选字段只用于数据确实可能缺失的场景。'],
    problem: '解决"如何把接口返回和业务对象建模成可维护类型"的问题。',
  },
  {
    id: 'T_04', title: '泛型：复用类型关系', navTitle: '泛型', category: '类型进阶',
    path: '/typescript/t-4/generics', summary: '用通用 API 响应保留课程列表的精确数据类型。',
    demo: T04Generics, code: T04Code, language: 'typescript',
    principle: '泛型把类型作为参数传递，使函数和容器既能复用实现，又能保留输入与输出之间的精确关系。',
    flow: ['找出实现中需要变化的类型。', '用类型参数表达输入输出关系。', '调用时由实参推导具体类型。'],
    notes: ['类型参数名应表达角色。', '仅使用一次且没有关系的类型参数通常没有价值。'],
    problem: '解决"如何复用 API、列表和工具函数而不丢失类型信息"的问题。',
  },
  {
    id: 'T_05', title: 'keyof 与索引访问类型', navTitle: 'keyof', category: '类型进阶',
    path: '/typescript/t-5/keyof', summary: '构建只能读取合法配置键的设置面板。',
    demo: T05Keyof, code: T05Code, language: 'typescript',
    principle: 'keyof 从对象类型得到键的联合，T[K] 根据键取得对应值类型，两者结合可编写安全的动态属性访问。',
    flow: ['从对象模型提取合法键。', '让函数参数受键联合约束。', '通过索引访问获得匹配的值类型。'],
    notes: ['Object.keys 默认返回 string[]，必要时需要安全封装。', '不要用宽泛 string 索引绕过键约束。'],
    problem: '解决"动态访问对象属性时如何避免键名拼写错误"的问题。',
  },
  {
    id: 'T_06', title: '工具类型与更新模型', navTitle: '工具类型', category: '类型进阶',
    path: '/typescript/t-6/utility-types', summary: '用 Partial、Pick 和 Omit 表达课程的局部更新。',
    demo: T06UtilityTypes, code: T06Code, language: 'typescript',
    principle: '内置工具类型通过映射和条件类型从已有模型派生新契约，减少新增、详情、更新模型之间的重复。',
    flow: ['先定义完整领域模型。', '按操作语义挑选或排除字段。', '用 Partial 将更新字段变为可选。'],
    notes: ['派生类型应保持来源清晰。', '深层对象的 Partial 不会自动递归。'],
    problem: '解决"创建、编辑和接口响应类型重复且容易漂移"的问题。',
  },
  {
    id: 'T_07', title: 'unknown 与自定义类型守卫', navTitle: '安全边界', category: '安全边界',
    path: '/typescript/t-7/unknown-guard', summary: '安全解析用户导入的 JSON，在使用前验证未知数据。',
    demo: T07UnknownGuard, code: T07Code, language: 'typescript',
    principle: '外部输入在验证前应视为 unknown；类型守卫同时执行运行时检查，并向编译器证明检查后的精确类型。',
    flow: ['把网络或用户输入接收为 unknown。', '检查对象、字段与基本类型。', '守卫通过后再进入业务逻辑。'],
    notes: ['类型断言不会产生运行时校验。', '复杂结构可使用 schema 校验库。'],
    problem: '解决"接口或本地数据不可信时，如何避免错误断言导致运行时崩溃"的问题。',
  },
  {
    id: 'T_08', title: 'Vue 3 组件类型实践', navTitle: 'Vue 类型', category: '框架实践',
    path: '/typescript/t-8/vue-typing', summary: '掌握响应式状态、模板引用、Props 与 Emits 的类型边界。',
    demo: T08VueTyping, code: T08Code, language: 'vue',
    principle: 'Vue 3 的宏和组合式 API 能从泛型声明推导模板类型；DOM 模板引用还需要处理挂载前的 null 状态。',
    flow: ['为业务状态声明接口。', '用泛型约束 Props、Emits 或模板引用。', '在访问 DOM 或子组件前处理空值。'],
    notes: ['优先使用类型化的 defineProps 和 defineEmits。', '避免把组件实例直接声明为 any。'],
    problem: '解决"如何让 Vue 组件的输入、输出和模板引用获得完整类型检查"的问题。',
  },
  {
    id: 'T_09', title: '交叉类型与 Mixin 模式', navTitle: '交叉与 Mixin', category: '类型进阶',
    path: '/typescript/t-9/intersection-mixin', summary: '用交叉类型组合多个能力片段，用 Mixin 函数叠加行为。',
    demo: T09IntersectionMixin, code: T09Code, language: 'typescript',
    principle: '交叉类型 & 把多个接口合并为一个，要求同时满足所有成员；Mixin 用函数在运行时组合行为，提供比继承更灵活的复用方式。',
    flow: ['定义独立的能力接口。', '用 & 组合成交叉类型。', 'Mixin 函数在运行时叠加方法。'],
    notes: ['交叉类型中同名属性取交集。', 'Mixin 组合注意方法冲突。'],
    problem: '解决"如何灵活组合多个能力而不依赖继承层级"的问题。',
  },
  {
    id: 'T_10', title: '条件类型与类型推导', navTitle: '条件类型', category: '类型进阶',
    path: '/typescript/t-10/conditional', summary: '用条件类型和 infer 从联合响应中提取精确类型。',
    demo: T10Conditional, code: T10Code, language: 'typescript',
    principle: '条件类型根据 extends 关系选择分支；infer 可在 extends 子句中捕获并复用未知类型，是构建高级工具类型的核心机制。',
    flow: ['用 T extends U ? X : Y 描述类型分支。', '用 infer 捕获嵌套或返回类型。', '组合条件类型实现复杂推导。'],
    notes: ['裸类型参数上的条件类型会自动分发。', 'ReturnType 和 Parameters 的底层就是 infer。'],
    problem: '解决"如何从复杂泛型中自动提取和转换子类型"的问题。',
  },
  {
    id: 'T_11', title: '映射类型与键转换', navTitle: '映射类型', category: '类型进阶',
    path: '/typescript/t-11/mapped', summary: '用映射类型批量转换属性，掌握修饰符和键重命名。',
    demo: T11Mapped, code: T11Code, language: 'typescript',
    principle: '映射类型遍历已有类型的键并生成新类型，可添加 readonly/可选修饰符，也可通过 as 子句重命名或过滤键。',
    flow: ['从已有模型遍历键。', '添加或移除修饰符。', '用 as 重命名或排除键。'],
    notes: ['Partial 和 Readonly 的底层就是映射类型。', '-? 可以移除可选修饰符。'],
    problem: '解决"如何从一个模型批量派生只读、可选或重命名版本"的问题。',
  },
  {
    id: 'T_12', title: '模板字面量类型', navTitle: '模板字面量', category: '类型进阶',
    path: '/typescript/t-12/template-literal', summary: '构建类型安全的事件名、路由路径和 CSS 类名。',
    demo: T12TemplateLiteral, code: T12Code, language: 'typescript',
    principle: '模板字面量类型把字符串拼接提升到类型层面，配合 Uppercase 等内置工具可构造精确的字符串约束。',
    flow: ['用 `${T}${U}` 拼接字面量类型。', '用 Capitalize 等转换大小写。', '结合条件类型提取字符串片段。'],
    notes: ['模板字面量类型会产生联合展开。', '配合 infer 可以从字符串类型中解析结构。'],
    problem: '解决"如何让事件名、路由和 CSS 类名在编译期就保证正确性"的问题。',
  },
  {
    id: 'T_13', title: '函数类型、重载与断言函数', navTitle: '函数类型', category: '类型进阶',
    path: '/typescript/t-13/function-types', summary: '为 API 编写重载签名，用断言函数做运行时类型守卫。',
    demo: T13FunctionTypes, code: T13Code, language: 'typescript',
    principle: '函数类型表达式描述签名，重载让同一函数名对不同输入返回不同类型；断言函数在运行时校验后收窄调用方的类型。',
    flow: ['声明函数类型表达式。', '编写重载签名覆盖多种调用方式。', '用 asserts 签名做运行时守卫。'],
    notes: ['重载签名必须从最具体到最宽泛排列。', '断言函数返回值是 void 而非 boolean。'],
    problem: '解决"同一函数如何根据输入返回不同类型，以及如何安全收窄 unknown"的问题。',
  },
  {
    id: 'T_14', title: '枚举、常量枚举与字面量映射', navTitle: '枚举与映射', category: '类型进阶',
    path: '/typescript/t-14/enums', summary: '比较枚举与联合字面量在状态建模中的差异和适用场景。',
    demo: T14Enums, code: T14Code, language: 'typescript',
    principle: '枚举提供运行时值，其中数字枚举还会生成反向映射；联合字面量配合 as const 对象可实现类似效果，通常产物更轻、组合更灵活。',
    flow: ['用枚举定义有限状态集合。', '对比 const enum 的编译产物。', '用 as const + Record 实现无枚举映射。'],
    notes: ['数字枚举有反向映射，字符串枚举没有。', 'const enum 会内联成员，但在库声明和独立转译流程中应谨慎使用。'],
    problem: '解决"有限状态集合应该用枚举还是联合字面量来建模"的问题。',
  },
  {
    id: 'T_15', title: '声明合并与模块扩展', navTitle: '声明合并', category: '类型进阶',
    path: '/typescript/t-15/declaration-merging', summary: '扩展第三方库类型，掌握接口合并和模块增强。',
    demo: T15DeclarationMerging, code: T15Code, language: 'typescript',
    principle: '同名 interface 自动合并，namespace 可与 class/function 合并；declare module 可为第三方包追加类型声明。',
    flow: ['声明同名接口触发合并。', '用 declare module 扩展已有模块。', '在 .d.ts 文件中放置全局类型增强。'],
    notes: ['class 不能与 class 合并。', '模块增强必须在模块作用域中使用。'],
    problem: '解决"如何在不修改源码的前提下为第三方库补充类型"的问题。',
  },
  {
    id: 'T_16', title: 'tsconfig 编译配置详解', navTitle: 'tsconfig', category: '类型进阶',
    path: '/typescript/t-16/compiler-options', summary: '理解 strict、target、module 等核心编译选项对类型检查行为的影响。',
    demo: T16CompilerOptions, code: T16Code, language: 'vue',
    principle: 'tsconfig.json 控制 TypeScript 编译行为；strict 系列决定类型安全等级，target 决定输出 JS 版本，module/moduleResolution 决定模块系统。',
    flow: ['从 strict: true 开始获得最严格的类型检查。', '根据运行环境选择 target 和 module。', '用 paths 和 baseUrl 配置模块别名。'],
    notes: ['新项目建议直接启用 strict。', 'moduleResolution 的 bundler 模式适合 Vite 项目。'],
    problem: '解决"tsconfig 选项太多，如何理解和配置核心编译选项"的问题。',
  },
  {
    id: 'T_17', title: '声明文件与全局类型增强', navTitle: '声明文件', category: '类型进阶',
    path: '/typescript/t-17/declaration-files', summary: '掌握 .d.ts 声明文件的编写模式、全局增强和第三方库类型补充。',
    demo: T17DeclarationFiles, code: T17Code, language: 'vue',
    principle: '声明文件 (.d.ts) 为 JavaScript 代码提供类型信息；ambient 声明用 declare 关键字，全局增强通过 declare global，模块声明用 declare module。',
    flow: ['为无类型的 JS 库编写 declare module。', '用 declare global 扩展 Window 等全局对象。', '在项目中组织 .d.ts 文件的引用路径。'],
    notes: ['DefinitelyTyped 是社区维护的类型声明仓库。', '声明文件不包含实现代码。'],
    problem: '解决"如何为 JavaScript 库和全局环境补充 TypeScript 类型声明"的问题。',
  },
  {
    id: 'T_18', title: '命名空间与模块模式对比', navTitle: '命名空间', category: '类型进阶',
    path: '/typescript/t-18/namespace', summary: '比较 namespace 与 ES Module 在类型组织中的差异和适用场景。',
    demo: T18Namespace, code: T18Code, language: 'vue',
    principle: 'namespace 是 TypeScript 早期的模块组织方式，支持声明合并；ES Module 是现代标准，两者不应混用。新项目应优先使用 ES Module。',
    flow: ['了解 namespace 的声明合并能力。', '对比 namespace 与 ES Module 的产物差异。', '确定项目中统一使用 ES Module。'],
    notes: ['namespace 主要存在于旧代码和声明文件中。', '不要在同一项目中混用 namespace 和 ES Module。'],
    problem: '解决"何时使用 namespace、何时使用 ES Module 来组织类型"的问题。',
  },
  {
    id: 'T_19', title: '品牌类型(Branded Types)与名义类型', navTitle: '品牌类型', category: '类型进阶',
    path: '/typescript/t-19/branded-types', summary: '通过品牌类型模拟名义类型，让结构相同但语义不同的类型不能互相赋值。',
    demo: T19BrandedTypes, code: T19Code, language: 'vue',
    principle: 'TypeScript 默认是结构化类型系统，但通过品牌类型（Branded Types）可以模拟名义类型，让结构相同但语义不同的类型（如 UserId 和 OrderId）不能互相赋值，提升类型安全。',
    flow: ['使用交叉类型 & { readonly __brand: \'TypeName\' } 创建品牌类型', '通过类型断言或构造函数创建品牌类型的值', '函数参数使用品牌类型，传参时自动校验身份'],
    notes: ['品牌类型在运行时没有额外开销', '__brand 是约定俗成的属性名，也可以用 symbol', '适合 ID、金额、邮箱等有业务语义的原始类型'],
    problem: '解决结构相同但语义不同的类型无法区分、传参错误难以发现的问题。',
  },
  {
    id: 'T_20', title: '可辨识联合类型与穷尽性检查', navTitle: '可辨识联合', category: '类型进阶',
    path: '/typescript/t-20/discriminated-union', summary: '通过共同的判别属性区分联合类型成员，配合穷尽性检查安全处理所有分支。',
    demo: T20DiscriminatedUnion, code: T20Code, language: 'vue',
    principle: '可辨识联合（Discriminated Union）通过一个共同的字面量类型属性（tag）区分联合类型的成员，配合类型收窄和穷尽性检查，可以安全地处理所有可能的分支。',
    flow: ['为每种状态定义接口，添加相同名字的判别属性（如 type）', '将所有状态类型组成联合类型', '在 switch/case 中根据判别属性收窄类型'],
    notes: ['判别属性应该是字面量类型，便于 TypeScript 区分', 'default 分支用 never 类型做穷尽性检查', '适合状态机、订单状态、消息类型等场景'],
    problem: '解决联合类型分支处理不全、状态转换不清晰的问题。',
  },
  {
    id: 'T_21', title: 'infer 关键字与类型推断', navTitle: 'infer 关键字', category: '类型进阶',
    path: '/typescript/t-21/infer-keyword', summary: '在条件类型中使用 infer 声明待推断的类型变量，从上下文提取函数返回类型、参数类型等。',
    demo: T21InferKeyword, code: T21Code, language: 'vue',
    principle: 'infer 关键字在条件类型中声明一个待推断的类型变量，让 TypeScript 从上下文推断出类型，常用于提取函数返回类型、参数类型、Promise 内部类型等。',
    flow: ['在条件类型的 extends 子句中使用 infer 声明类型变量', 'TypeScript 根据实际类型推断 infer 变量的值', '在条件为 true 的分支中使用推断出的类型'],
    notes: ['ReturnType、Parameters 等工具类型内部都用 infer 实现', 'infer 只能在条件类型中使用', '同一位置可以有多个 infer 变量'],
    problem: '解决需要从已有类型中提取部分类型但无法直接访问的问题。',
  },
  {
    id: 'T_22', title: '递归类型与深嵌套对象', navTitle: '递归类型', category: '类型进阶',
    path: '/typescript/t-22/recursive-types', summary: '利用递归类型描述树形结构和深嵌套对象，实现 DeepReadonly、DeepPartial 等深度转换。',
    demo: T22RecursiveTypes, code: T22Code, language: 'vue',
    principle: '递归类型是在类型定义中引用自身的类型，常用于描述树形结构、深嵌套对象（如 DeepReadonly、DeepPartial），TypeScript 4.1+ 对递归类型有更好的支持。',
    flow: ['定义接口或类型别名时在内部引用自身', '配合条件类型和映射类型实现深度转换', '用递归类型描述目录树、JSON 等嵌套结构'],
    notes: ['递归类型要注意终止条件，避免无限递归', '深度映射类型可以统一处理嵌套对象', 'TypeScript 有递归深度限制，过深会报错'],
    problem: '解决嵌套结构类型描述复杂、深度转换需要逐层手写的问题。',
  },
  {
    id: 'T_23', title: '类型级编程与类型体操', navTitle: '类型级编程', category: '类型进阶',
    path: '/typescript/t-23/type-level-programming', summary: '利用条件类型、映射类型、模板字面量类型等在类型层面实现计算和逻辑。',
    demo: T23TypeLevelProgramming, code: T23Code, language: 'vue',
    principle: '类型级编程利用 TypeScript 的条件类型、映射类型、模板字面量类型、递归类型等能力，在类型层面实现计算和逻辑，让类型系统表达更丰富的约束和推导。',
    flow: ['使用条件类型实现类型层面的 if-else', '用映射类型遍历键并转换值类型', '结合模板字面量类型操作字符串类型'],
    notes: ['类型体操是手段不是目的，优先考虑可读性', '业务代码中适度使用，库代码可以更激进', '复杂类型建议加注释说明意图'],
    problem: '解决类型系统表达能力不足、需要运行时校验才能保证安全的问题。',
  },
  {
    id: 'T_24', title: '异步返回类型与 Awaited', navTitle: '异步返回类型', category: '类型进阶',
    path: '/typescript/t-24/async-return-type', summary: '使用 Awaited 解包 Promise 嵌套，精确获取异步函数的返回值类型。',
    demo: T24AsyncReturnType, code: T24Code, language: 'vue',
    principle: 'TypeScript 的 Awaited 工具类型用于解包 Promise 嵌套，获取最终的 resolve 值类型，配合 ReturnType 等可以精确获取异步函数的返回值类型。',
    flow: ['使用 Awaited<T> 解包 Promise 类型', 'ReturnType<typeof fn> 获取函数返回类型', '组合 Awaited<ReturnType<typeof fn>> 获取异步函数 resolve 类型'],
    notes: ['Awaited 会递归解包嵌套的 Promise', 'async 函数返回值自动包装为 Promise', '处理 Promise.all 等并发组合时很有用'],
    problem: '解决 Promise 嵌套类型难以解包、异步函数返回值类型不清晰的问题。',
  },
  {
    id: 'G_01', title: '环境变量与运行配置', navTitle: '环境配置', category: '构建基础',
    path: '/engineering/g-1/environment-config', summary: '区分构建时环境变量、公开配置和服务端密钥。',
    demo: G01EnvironmentConfig, code: G01Code, language: 'vue',
    principle: '环境配置把同一份代码连接到不同服务；任何进入客户端产物的变量都可被用户读取，密钥必须留在服务端。',
    flow: ['定义开发、测试和生产环境差异。', '只暴露客户端确实需要的公开值。', '在构建和部署阶段注入配置。'],
    notes: ['不要把 .env 当作权限边界。', '环境变量名和默认值应形成文档。'],
    problem: '解决"多环境地址如何切换，以及密钥应该放在哪里"的问题。',
  },
  {
    id: 'G_02', title: '代码规范与自动检查', navTitle: '代码质量', category: '质量保障',
    path: '/engineering/g-2/code-quality', summary: '用格式化、Lint 和类型检查建立提交前质量门。',
    demo: G02CodeQuality, code: G02Code, language: 'vue',
    principle: '格式化统一外观，Lint 发现可疑模式，类型检查验证契约；三者职责不同，应在本地和 CI 中使用同一命令。',
    flow: ['编辑器保存时快速格式化。', '提交前运行静态检查。', 'CI 再执行一次并阻止不合格变更。'],
    notes: ['规则应服务于缺陷预防。', '不要让本地配置与 CI 配置分叉。'],
    problem: '解决"团队如何稳定保持一致风格并提前发现低级错误"的问题。',
  },
  {
    id: 'G_03', title: '单元测试与边界用例', navTitle: '单元测试', category: '质量保障',
    path: '/engineering/g-3/unit-testing', summary: '以折扣计算为例设计快速、确定且可读的单元测试。',
    demo: G03UnitTesting, code: G03Code, language: 'vue',
    principle: '单元测试隔离验证一个纯逻辑单元，重点覆盖正常值、边界值和错误输入，而不是复制实现细节。',
    flow: ['安排输入与依赖。', '执行一个明确行为。', '断言公开结果并覆盖边界。'],
    notes: ['测试名称应描述行为。', '时间和随机数需要可控替身。'],
    problem: '解决"哪些逻辑值得单测，以及怎样写出稳定断言"的问题。',
  },
  {
    id: 'G_04', title: '组件交互测试', navTitle: '组件测试', category: '质量保障',
    path: '/engineering/g-4/component-testing', summary: '从用户视角验证按钮、提示和可访问状态。',
    demo: G04ComponentTesting, code: G04Code, language: 'vue',
    principle: '组件测试应通过用户可见文本、角色和交互观察行为，避免依赖内部 ref、方法名或脆弱 DOM 层级。',
    flow: ['按角色或标签找到控件。', '触发真实点击或输入。', '断言页面呈现的结果。'],
    notes: ['优先断言可访问查询。', '只在边界处模拟网络和外部服务。'],
    problem: '解决"如何验证组件交互而不把测试绑死在实现细节上"的问题。',
  },
  {
    id: 'G_05', title: '持续集成与发布流水线', navTitle: 'CI 流水线', category: '自动化交付',
    path: '/engineering/g-5/ci-pipeline', summary: '把安装、检查、构建和发布组织成可重复流水线。',
    demo: G05CIPipeline, code: G05Code, language: 'vue',
    principle: 'CI 在干净环境重现项目验证过程，只有全部质量门通过的不可变产物才能进入发布阶段。',
    flow: ['锁定依赖并恢复缓存。', '并行运行类型检查和测试。', '构建一次并发布同一份产物。'],
    notes: ['流水线密钥使用平台 Secret。', '失败步骤应保留日志和测试报告。'],
    problem: '解决"如何让每次提交都经过一致验证并可靠发布"的问题。',
  },
  {
    id: 'G_06', title: '性能预算与持续度量', navTitle: '性能预算', category: '用户体验',
    path: '/engineering/g-6/performance-budget', summary: '给脚本、图片和总体积设置可执行的性能预算。',
    demo: G06PerformanceBudget, code: G06Code, language: 'vue',
    principle: '性能预算把"页面要快"转为可自动判断的上限，并结合真实用户指标持续观察回归。',
    flow: ['按网络和设备目标制定预算。', '构建时测量资源体积。', '超出阈值时阻止合并并定位增量。'],
    notes: ['压缩后体积和执行成本都要关注。', '实验室指标应与真实用户数据互补。'],
    problem: '解决"如何防止依赖和资源在迭代中悄悄拖慢页面"的问题。',
  },
  {
    id: 'G_07', title: '无障碍作为工程质量门', navTitle: '无障碍', category: '用户体验',
    path: '/engineering/g-7/accessibility', summary: '把语义、键盘、对比度和状态播报纳入开发流程。',
    demo: G07Accessibility, code: G07Code, language: 'vue',
    principle: '无障碍首先依赖正确 HTML 语义，再用自动扫描发现常见问题，并通过键盘与读屏人工验证关键流程。',
    flow: ['使用原生语义和关联标签。', '运行自动规则扫描。', '用键盘和读屏完成核心任务。'],
    notes: ['ARIA 不能替代原生语义。', '不要只靠颜色传递状态。'],
    problem: '解决"如何让更多用户可用，并把无障碍从补丁变成日常质量要求"的问题。',
  },
  {
    id: 'G_08', title: 'Web 安全与静态发布', navTitle: '安全发布', category: '自动化交付',
    path: '/engineering/g-8/security-delivery', summary: '检查安全响应头、依赖风险与静态资源缓存策略。',
    demo: G08SecurityDelivery, code: G08Code, language: 'vue',
    principle: '安全发布需要最小化客户端暴露、限制资源来源、持续修复依赖漏洞，并为带内容哈希的静态资源设置长期缓存。',
    flow: ['构建前扫描依赖和公开配置。', '部署时配置安全响应头。', 'HTML 短缓存、哈希资源长期不可变缓存。'],
    notes: ['CSP 应先报告再逐步收紧。', '前端校验不能替代服务端授权。'],
    problem: '解决"静态站点发布时如何兼顾安全策略与缓存性能"的问题。',
  },
  {
    id: 'G_09', title: 'Vite 构建插件与钩子机制', navTitle: '构建插件', category: '构建基础',
    path: '/engineering/g-9/build-plugin', summary: '用自定义 Vite 插件展示构建钩子、资源转换和插件执行顺序。',
    demo: G09BuildPlugin, code: G09Code, language: 'vue',
    principle: 'Vite 基于 Rollup 插件体系，通过 resolveId、transform、generateBundle 等钩子介入构建流程；插件按注册顺序执行，每个钩子负责不同阶段的资源转换。',
    flow: ['在 vite.config.ts 中注册插件并声明需要的钩子。', 'transform 钩子逐个文件处理内容替换和注入。', 'generateBundle 钩子在产物输出前执行最终优化。'],
    notes: ['插件应尽量只做一件事，避免在单个插件中混合多种职责。', 'transform 返回值可以是字符串或 { code, map } 对象，后者保留 source map。'],
    problem: '解决"如何在构建流程中介入自定义转换逻辑，以及不同钩子各自负责什么阶段"的问题。',
  },
  {
    id: 'G_10', title: '端到端测试与流程编排', navTitle: 'E2E 测试', category: '质量保障',
    path: '/engineering/g-10/e2e-testing', summary: '以报名表单流程为例，展示端到端测试的步骤编排、断言和失败定位。',
    demo: G10E2eTesting, code: G10Code, language: 'vue',
    principle: '端到端测试从用户视角验证完整业务流程，通过可访问选择器定位元素、编排操作步骤、断言可见结果，失败时自动截图并精确定位出错步骤。',
    flow: ['用 getByRole、getByLabel 等可访问查询定位元素。', '按用户操作顺序编排点击、输入和导航步骤。', '断言页面呈现的文本、状态和可访问角色。'],
    notes: ['优先使用用户可见的选择器，避免依赖 CSS 类名或 data 属性。', '测试数据应独立，每次运行前重置状态以避免用例间相互影响。', '失败截图和 trace 是定位问题的关键产物，CI 中应保留这些文件。'],
    problem: '解决"如何从用户视角验证完整业务流程，并在失败时快速定位问题"的问题。',
  },
  {
    id: 'G_11', title: '构建产物分析与拆分策略', navTitle: '产物分析', category: '用户体验',
    path: '/engineering/g-11/bundle-analysis', summary: '用可视化树状图分析构建产物组成，定位体积热点并制定拆分策略。',
    demo: G11BundleAnalysis, code: G11Code, language: 'vue',
    principle: '构建产物分析把抽象的"打包体积"变成可视化的模块树，帮助定位体积热点；超过阈值的 chunk 可通过动态导入、按需加载或提取公共模块来拆分。',
    flow: ['使用 rollup-plugin-visualizer 或 webpack-bundle-analyzer 生成产物报告。', '按模块类型分类观察 vendor、app 和资源的体积占比。', '对超出预算的模块制定拆分或替换方案。'],
    notes: ['vendor 体积优先检查是否有可替换的轻量方案。', 'tree-shaking 依赖 ESM 导出，混用 CommonJS 会导致整个模块被打包。', '动态导入让路由级组件按需加载，减少首屏所需的初始包体积。'],
    problem: '解决"构建产物为什么越来越大，以及如何系统性地控制体积"的问题。',
  },
  {
    id: 'G_12', title: 'Monorepo 工作区与多包管理', navTitle: 'Monorepo', category: '构建基础',
    path: '/engineering/g-12/monorepo', summary: '用 pnpm workspace 组织多包项目，展示依赖拓扑、版本同步和独立构建。',
    demo: G12Monorepo, code: G12Code, language: 'vue',
    principle: 'Monorepo 通过 workspace 协议把多个包放在同一仓库，共享依赖和工具链；构建按依赖拓扑排序执行，版本管理借助 changesets 实现独立发版。',
    flow: ['在根目录 pnpm-workspace.yaml 声明 packages 匹配规则。', '各包通过 workspace: 协议引用内部依赖，pnpm 自动链接。', '构建工具按拓扑顺序编译，确保被依赖包先于依赖方构建。'],
    notes: ['workspace 协议只在开发环境生效，发布后自动替换为具体版本号。', '修改一个包后，依赖它的所有包都需要重新构建和测试。', '使用 changesets 管理版本，每个变更生成一个 .md 描述文件，发版时自动计算版本号。'],
    problem: '解决"多包项目如何共享代码、统一版本并按依赖顺序可靠构建"的问题。',
  },
  {
    id: 'G_13', title: 'Docker 容器化与多阶段构建', navTitle: 'Docker', category: '部署与运维',
    path: '/engineering/g-13/docker', summary: '用多阶段 Dockerfile 构建 Node.js 应用镜像，掌握层缓存和镜像瘦身。',
    demo: G13Docker, code: G13Code, language: 'vue',
    principle: 'Docker 把应用和依赖打包为不可变镜像；多阶段构建分离编译和运行环境，最终镜像只包含运行时必要文件，减小体积和攻击面。',
    flow: ['选择合适的基础镜像。', '按变更频率排列层以利用缓存。', '多阶段构建分离构建和运行阶段。'],
    notes: ['不要把 node_modules 和 .env 打进镜像。', '非 root 用户运行容器提高安全性。'],
    problem: '解决"如何可靠地将应用打包并部署到不同环境"的问题。',
  },
  {
    id: 'G_14', title: 'Git 工作流与提交规范', navTitle: 'Git 工作流', category: '质量保障',
    path: '/engineering/g-14/git-workflow', summary: '对比 Git Flow、GitHub Flow 和 Trunk-Based，掌握 Conventional Commits。',
    demo: G14GitWorkflow, code: G14Code, language: 'vue',
    principle: '分支策略决定团队协作方式；Conventional Commits 用结构化提交信息驱动自动版本号计算和 CHANGELOG 生成，husky + lint-staged 在提交时执行检查。',
    flow: ['根据团队规模选择分支策略。', '使用 Conventional Commits 规范提交信息。', '用 husky 和 lint-staged 在提交时自动检查。'],
    notes: ['小团队适合 GitHub Flow 或 Trunk-Based。', 'commitlint 可以强制校验提交信息格式。'],
    problem: '解决"团队如何统一分支策略和提交规范以提高协作效率"的问题。',
  },
  {
    id: 'G_15', title: '国际化 i18n 方案实践', navTitle: 'i18n', category: '用户体验',
    path: '/engineering/g-15/i18n', summary: '用 vue-i18n 实现多语言切换，掌握复数规则、日期格式化和消息懒加载。',
    demo: G15I18n, code: G15Code, language: 'vue',
    principle: 'i18n 把可翻译文本抽取为消息文件，运行时根据 locale 选择对应翻译；复数规则、日期/数字格式化和消息懒加载是生产级国际化的关键。',
    flow: ['抽取文本为消息 JSON 文件。', '配置 locale 切换和回退策略。', '按需加载语言包减少首屏体积。'],
    notes: ['翻译键使用业务语义命名而非页面位置。', 'RTL 语言需要额外的布局适配。'],
    problem: '解决"如何让应用支持多语言并高效管理翻译资源"的问题。',
  },
  {
    id: 'G_16', title: '微前端架构与模块联邦', navTitle: '微前端', category: '部署与运维',
    path: '/engineering/g-16/micro-frontend', summary: '对比 Module Federation、qiankun 和 iframe 三种微前端方案。',
    demo: G16MicroFrontend, code: G16Code, language: 'vue',
    principle: '微前端把大型应用拆分为独立开发部署的子应用；Module Federation 共享依赖最高效，qiankun 兼容性最好，iframe 隔离性最强但集成成本最高。',
    flow: ['评估团队和应用的拆分需求。', '选择合适的微前端方案。', '配置路由协调和依赖共享策略。'],
    notes: ['微前端引入复杂度，仅在团队和应用确实需要独立部署时采用。', '共享依赖版本冲突是最常见的运行时问题。'],
    problem: '解决"大型前端应用如何拆分为可独立开发和部署的子应用"的问题。',
  },
  {
    id: 'G_17', title: 'pnpm workspace 工作区与依赖管理', navTitle: 'pnpm workspace', category: '构建基础',
    path: '/engineering/g-17/pnpm-workspaces', summary: '使用 pnpm workspace 管理 Monorepo 多包项目依赖。',
    demo: G17PnpmWorkspaces, code: G17Code, language: 'vue',
    principle: 'pnpm workspace 通过 pnpm-workspace.yaml 定义多包项目结构，所有包共享同一个 node_modules 和 lockfile，提升安装速度并保证依赖一致性。',
    flow: ['在根目录创建 pnpm-workspace.yaml 声明工作区范围', '各包在 package.json 中使用 workspace: 协议引用内部包', 'pnpm install 自动建立软链接并提升公共依赖'],
    notes: ['避免幽灵依赖，pnpm 默认使用严格的 node_modules 结构', '使用 pnpm -r 递归执行各包的脚本', 'pnpm publish 时会自动将 workspace: 转换为真实版本号'],
    problem: '解决多包 Monorepo 项目中依赖安装慢、版本不一致、幽灵依赖等问题。',
  },
  {
    id: 'G_18', title: 'Turborepo 构建缓存与任务编排', navTitle: 'Turborepo', category: '构建基础',
    path: '/engineering/g-18/turborepo', summary: '使用 Turborepo 加速 Monorepo 构建并编排任务依赖。',
    demo: G18Turborepo, code: G18Code, language: 'vue',
    principle: 'Turborepo 通过任务依赖图和远程缓存加速 Monorepo 构建，它记录每个任务的输入输出哈希，相同输入直接复用缓存结果。',
    flow: ['在 turbo.json 中定义任务及其依赖关系', '运行 turbo build 时自动按拓扑顺序执行任务', '命中缓存的任务直接跳过，未命中的执行并缓存结果'],
    notes: ['远程缓存可在 CI 和团队成员间共享构建结果', '使用 --filter 只运行受影响包的任务', '合理配置 inputs/outputs 才能保证缓存正确性'],
    problem: '解决 Monorepo 中重复构建、构建顺序复杂、CI 速度慢的问题。',
  },
  {
    id: 'G_19', title: 'Changesets 版本管理与发布流程', navTitle: 'Changesets', category: '质量保障',
    path: '/engineering/g-19/changesets', summary: '使用 Changesets 管理 Monorepo 多包版本和 CHANGELOG。',
    demo: G19Changesets, code: G19Code, language: 'vue',
    principle: 'Changesets 是一套版本管理工具，每个功能变更生成一个独立的 changeset 文件记录变更类型和说明，发布时自动汇总并更新版本号和 CHANGELOG。',
    flow: ['开发者运行 changeset add 创建变更记录文件', 'changeset version 汇总所有变更并更新版本号', 'changeset publish 发布更新后的包并生成 CHANGELOG'],
    notes: ['changeset 文件应与功能代码一起提交到版本库', '支持 major/minor/patch 三级语义化版本', '可与 GitHub Actions 集成实现自动化发布'],
    problem: '解决 Monorepo 多包版本管理混乱、CHANGELOG 维护困难的问题。',
  },
  {
    id: 'G_20', title: 'Storybook 组件文档与可视化测试', navTitle: 'Storybook', category: '质量保障',
    path: '/engineering/g-20/storybook', summary: '使用 Storybook 构建组件文档和可视化测试环境。',
    demo: G20Storybook, code: G20Code, language: 'vue',
    principle: 'Storybook 是一个组件开发和文档工具，通过 Stories 展示组件的各种状态，支持交互测试、可访问性检查和视觉回归测试。',
    flow: ['为每个组件编写 .stories.ts 文件定义不同状态', '在 Storybook UI 中浏览和交互测试组件', '使用 addon 扩展文档、可访问性、设计稿对比等能力'],
    notes: ['Stories 也是组件使用示例的活文档', '支持与 Figma 设计稿对比验证实现一致性', '可通过 Chromatic 进行云端视觉回归测试'],
    problem: '解决组件文档缺失、状态覆盖不全、视觉回归难以检测的问题。',
  },
  {
    id: 'G_21', title: 'Chromatic 视觉回归测试与 UI 审查', navTitle: 'Chromatic', category: '质量保障',
    path: '/engineering/g-21/chromatic', summary: '使用 Chromatic 进行视觉回归测试和团队 UI 审查。',
    demo: G21Chromatic, code: G21Code, language: 'vue',
    principle: 'Chromatic 是 Storybook 官方的视觉回归测试服务，通过像素级对比检测 UI 变化，并提供在线 UI 审查流程让团队确认设计变更。',
    flow: ['每次 CI 构建时 Chromatic 抓取所有 Story 的快照', '与基准快照对比，自动检测视觉差异', '团队成员在 Chromatic 平台上审查并接受/拒绝变更'],
    notes: ['可以检测到肉眼容易忽略的细微样式变化', '支持多浏览器和视口尺寸的快照测试', '与 GitHub PR 集成，UI 变更直接在 PR 中审查'],
    problem: '解决 UI 样式变更难以通过单元测试检测、设计走查效率低的问题。',
  },
  {
    id: 'G_22', title: 'Playwright E2E 测试与元素定位', navTitle: 'Playwright', category: '质量保障',
    path: '/engineering/g-22/playwright', summary: '使用 Playwright 编写稳定可靠的端到端测试。',
    demo: G22Playwright, code: G22Code, language: 'vue',
    principle: 'Playwright 是微软推出的端到端测试框架，支持多浏览器并行测试，提供自动等待、网络拦截、追踪录制等高级能力。',
    flow: ['编写测试脚本，使用 page.goto 访问页面', '通过 getByRole/getByLabel 等定位器找到元素', '执行交互操作并断言页面状态符合预期'],
    notes: ['优先使用角色定位器（getByRole），最接近用户使用方式', 'Playwright 自动等待元素可交互，不需要手动 sleep', 'trace viewer 可以回放完整测试过程用于调试'],
    problem: '解决 E2E 测试不稳定、调试困难、多浏览器兼容性测试成本高的问题。',
  },
  {
    id: 'G_23', title: 'Vitest 高级配置与覆盖率报告', navTitle: 'Vitest 高级配置', category: '质量保障',
    path: '/engineering/g-23/vitest-config', summary: '深入配置 Vitest 提升测试速度和报告质量。',
    demo: G23VitestConfig, code: G23Code, language: 'vue',
    principle: 'Vitest 支持丰富的配置项来定制测试环境、覆盖率、Mock 行为等，合理的配置可以提升测试速度和报告质量。',
    flow: ['在 vitest.config.ts 中配置测试环境、覆盖率阈值、别名等', '使用 --coverage 参数运行测试并生成报告', '根据报告优化测试用例，确保核心逻辑被充分覆盖'],
    notes: ['覆盖率不是越高越好，重点关注核心业务逻辑', '使用 --watch 模式配合 UI 界面提升调试效率', '合理设置 test.include/exclude 避免运行不必要的文件'],
    problem: '解决测试配置不合理导致速度慢、覆盖率统计不准确、报告不直观的问题。',
  },
  {
    id: 'G_24', title: 'Nx 工作区与受影响项目检测', navTitle: 'Nx 工作区', category: '构建基础',
    path: '/engineering/g-24/nx-workspace', summary: '使用 Nx 智能构建系统管理大型 Monorepo。',
    demo: G24NxWorkspace, code: G24Code, language: 'vue',
    principle: 'Nx 是一个智能构建系统，通过项目图分析和计算缓存加速 Monorepo 任务执行，它能自动检测受变更影响的项目，只运行必要的任务。',
    flow: ['Nx 自动构建项目依赖图（project graph）', 'nx affected:build 根据 Git 变更计算受影响项目', '只构建和测试受影响的包，大幅节省时间'],
    notes: ['Nx Cloud 提供分布式任务执行和远程缓存', 'Nx 插件为不同框架提供预设和生成器', '模块边界约束防止架构腐化'],
    problem: '解决大型 Monorepo 中全量构建慢、依赖关系不清晰、架构约束缺失的问题。',
  },
  {
    id: 'G_25', title: '打包体积分析与代码分割策略', navTitle: '体积分析', category: '用户体验',
    path: '/engineering/g-25/bundle-analyzer', summary: '分析打包体积并优化代码分割策略。',
    demo: G25BundleAnalyzer, code: G25Code, language: 'vue',
    principle: '构建产物分析工具将打包后的模块按大小可视化，帮助识别体积过大的依赖和可优化的代码分割点，配合路由懒加载和按需导入减小首屏体积。',
    flow: ['使用 rollup-plugin-visualizer 生成体积分析报告', '识别大体积依赖，考虑替换或按需导入', '配合动态 import 实现路由级和组件级代码分割'],
    notes: ['第三方库是常见的体积大户，优先检查', 'Tree Shaking 依赖 ES Module，避免全量导入', 'gzip/br 压缩后体积才是实际传输大小'],
    problem: '解决首屏加载慢、白屏时间长、打包体积失控的性能问题。',
  },
  {
    id: 'G_26', title: 'PWA 离线应用与 Service Worker', navTitle: 'PWA 离线应用', category: '用户体验',
    path: '/engineering/g-26/pwa', summary: '使用 Service Worker 和 manifest 构建 PWA 离线应用。',
    demo: G26Pwa, code: G26Code, language: 'vue',
    principle: 'PWA（渐进式 Web 应用）通过 Service Worker 实现离线访问、后台同步和推送通知，结合 manifest.json 让网页可以安装到桌面。',
    flow: ['注册 Service Worker 并定义缓存策略', 'manifest.json 配置应用名称、图标、启动 URL', '用户访问时提示安装，离线时从缓存提供服务'],
    notes: ['注意缓存更新策略，避免用户永远看到旧版本', 'Workbox 库可以简化 Service Worker 编写', 'PWA 不是要替代原生应用，而是增强 Web 体验'],
    problem: '解决弱网环境下页面无法访问、用户留存低、无法像原生应用一样安装的问题。',
  },
  {
    id: 'J_01', title: '原始类型、引用类型与类型转换', navTitle: '类型与相等', category: '语言基础',
    path: '/javascript/j-1/types-equality', summary: '掌握 7 种原始类型与引用类型的 typeof 行为、显式转换（Number/String/Boolean）、5 个 falsy 值、隐式转换规则，以及 == 与 === 的经典差异。',
    demo: J01TypesEquality, code: J01Code, language: 'javascript',
    principle: 'JavaScript 是动态类型语言，运算时可能发生隐式类型转换。typeof 对 null 返回 object 是历史遗留；引用类型的 typeof 统一为 object（函数除外）。显式转换用 Number()、String()、Boolean()，只有 ""、0、NaN、null、undefined 五个 falsy 值。== 会先转换再比较，=== 不转换类型。',
    flow: ['用 typeof 识别值的运行时类型。', '在输入边界显式转换而非依赖隐式规则。', '始终使用 === 严格相等。', '用 Number.isNaN() 和 Array.isArray() 处理特殊判断。'],
    notes: ['typeof null → object 是语言早期设计的 bug。', 'NaN 不等于任何值（包括自身），须用 Number.isNaN() 判断。', '空数组 [] 和空对象 {} 都是 truthy。', 'Object.is() 可区分 NaN 和 -0 的边界场景。'],
    problem: '解决"表单输入、API 参数比较时为什么出现反直觉结果，以及如何正确识别和转换 JavaScript 类型"的问题。',
  },
  {
    id: 'J_02', title: '词法作用域与闭包', navTitle: '作用域与闭包', category: '语言基础',
    path: '/javascript/j-2/closure', summary: '用购物车计数器理解函数如何保留创建时的变量环境。',
    demo: J02Closure, code: J02Code, language: 'javascript',
    principle: '函数的作用域在定义位置确定；内部函数被返回后仍能访问外层变量，这个函数与词法环境的组合就是闭包。',
    flow: ['外层函数创建局部状态。', '返回访问该状态的内部函数。', '每次调用继续读取和修改同一环境。'],
    notes: ['闭包适合封装私有状态。', '长期持有的大对象可能增加内存占用。'],
    problem: '解决"回调为什么能记住外层变量，以及怎样封装私有状态"的问题。',
  },
  {
    id: 'J_03', title: '数组的不可变转换流水线', navTitle: '数组方法', category: '集合与数据',
    path: '/javascript/j-3/array-pipeline', summary: '组合 filter、map 与 toSorted 完成课程搜索和排序。',
    demo: J03ArrayPipeline, code: J03Code, language: 'javascript',
    principle: '数组迭代方法把筛选、映射和聚合拆为可组合步骤；优先返回新数组能减少共享状态被意外修改。',
    flow: ['filter 缩小数据集合。', 'map 转换展示结构。', 'toSorted 在不修改原数组的前提下排序。'],
    notes: ['map 不应用来执行纯副作用。', '大数据量要关注多次遍历成本。'],
    problem: '解决"如何以可读、可预测的方式处理列表数据"的问题。',
  },
  {
    id: 'J_04', title: '对象、解构与展开语法', navTitle: '对象操作', category: '集合与数据',
    path: '/javascript/j-4/object-operations', summary: '通过用户资料更新掌握属性访问、解构、剩余与浅拷贝。',
    demo: J04ObjectOperations, code: J04Code, language: 'javascript',
    principle: '解构按属性提取值，剩余语法收集未提取字段，展开语法把可枚举自有属性复制到新对象；这些复制都是浅层的。',
    flow: ['从对象中解构需要的字段。', '用剩余语法保留其他字段。', '展开生成带覆盖值的新对象。'],
    notes: ['嵌套对象仍共享引用。', '属性覆盖顺序由展开位置决定。'],
    problem: '解决"如何清晰地读取和不可变更新对象字段"的问题。',
  },
  {
    id: 'J_05', title: '函数调用方式与 this 绑定', navTitle: 'this 绑定', category: '对象模型',
    path: '/javascript/j-5/this-binding', summary: '比较方法调用、脱离对象调用与 call 显式绑定。',
    demo: J05ThisBinding, code: J05Code, language: 'javascript',
    principle: '普通函数的 this 由调用方式决定，而箭头函数捕获外层 this；call、apply 与 bind 可以显式指定普通函数的接收者。',
    flow: ['先观察函数实际调用表达式。', '确定隐式或显式接收者。', '回调场景用箭头函数或 bind 保持上下文。'],
    notes: ['不要把 this 理解为函数定义时的所属对象。', '类方法作为回调传递时也可能丢失绑定。'],
    problem: '解决"对象方法作为回调后 this 为什么变了"的问题。',
  },
  {
    id: 'J_06', title: '原型链、class 与继承', navTitle: '原型与类', category: '对象模型',
    path: '/javascript/j-6/prototype-class', summary: '通过课程模型理解实例属性、共享方法与原型继承。',
    demo: J06PrototypeClass, code: J06Code, language: 'javascript',
    principle: '对象通过内部原型链接查找属性；class 提供更清晰的构造与继承语法，但底层仍使用原型链共享方法。',
    flow: ['构造函数初始化实例字段。', '方法存放在 prototype 上共享。', 'extends 建立子类到父类原型的链接。'],
    notes: ['优先组合而非过深继承。', '私有字段可使用 #name 语法。'],
    problem: '解决"JavaScript 对象如何共享行为以及 class 的底层机制"的问题。',
  },
  {
    id: 'J_07', title: 'Promise 组合与并发请求', navTitle: 'Promise 并发', category: '异步机制',
    path: '/javascript/j-7/promise-combinators', summary: '用 Promise.all 并发加载看板数据，并比较常用组合器语义。',
    demo: J07PromiseCombinators, code: J07Code, language: 'javascript',
    principle: 'Promise 表示未来完成或失败的结果；all、allSettled、race 与 any 用不同策略组合多个异步任务。',
    flow: ['同时启动互不依赖的任务。', '选择符合失败策略的组合器。', '统一处理结果与异常。'],
    notes: ['Promise.all 遇到首个拒绝即拒绝。', '并发任务仍需考虑接口限流。'],
    problem: '解决"多个异步请求如何高效并发并正确处理失败"的问题。',
  },
  {
    id: 'J_08', title: '事件循环、任务与微任务', navTitle: '事件循环', category: '异步机制',
    path: '/javascript/j-8/event-loop', summary: '观察同步代码、Promise 微任务和定时器任务的执行顺序。',
    demo: J08EventLoop, code: J08Code, language: 'javascript',
    principle: '调用栈清空后，事件循环会先清空微任务队列，再进入下一个任务；渲染机会通常发生在任务之间。',
    flow: ['执行当前脚本中的同步代码。', '清空 Promise 等微任务。', '进入定时器等后续任务。'],
    notes: ['大量微任务也会阻塞渲染。', 'setTimeout(fn, 0) 不代表立即执行。'],
    problem: '解决"异步日志顺序为何与代码书写顺序不同"的问题。',
  },
  {
    id: 'J_09', title: 'ES Modules 与动态导入', navTitle: '模块化', category: '模块与浏览器',
    path: '/javascript/j-9/modules', summary: '掌握静态 import/export、模块作用域和 import() 按需加载。',
    demo: J09Modules, code: J09Code, language: 'javascript',
    principle: 'ES Module 具有独立作用域和静态依赖结构，便于打包器分析；动态 import 返回 Promise，可把低频功能拆成独立资源。',
    flow: ['用具名或默认导出声明公共接口。', '静态导入首屏必需依赖。', '动态导入低频模块并处理加载状态。'],
    notes: ['模块默认使用严格模式。', '避免循环依赖中的初始化顺序问题。'],
    problem: '解决"如何组织模块边界并减少首屏加载代码"的问题。',
  },
  {
    id: 'J_10', title: 'DOM 事件传播与事件委托', navTitle: '事件委托', category: '模块与浏览器',
    path: '/javascript/j-10/event-delegation', summary: '用课程列表理解捕获、冒泡、target 与 currentTarget。',
    demo: J10EventDelegation, code: J10Code, language: 'javascript',
    principle: 'DOM 事件经历捕获、目标和冒泡阶段；事件委托在稳定父节点监听冒泡事件，再通过 closest 判断真实交互目标。',
    flow: ['在父容器注册一个监听器。', '从 event.target 向上寻找匹配元素。', '读取 data 属性执行对应行为。'],
    notes: ['不是所有事件都会冒泡。', '用 closest 时要确认结果仍在委托容器内。'],
    problem: '解决"动态列表如何减少监听器并统一处理交互"的问题。',
  },
  {
    id: 'J_11', title: 'async/await 与异步流控', navTitle: 'async/await', category: '异步机制',
    path: '/javascript/j-11/async-await', summary: '用 async 函数和 await 表达串行与并发加载，掌握异步错误处理。',
    demo: J11AsyncAwait, code: J11Code, language: 'javascript',
    principle: 'async 函数返回 Promise，await 暂停执行直到 Promise 解决；串行用 for...of 逐个等待，并发用 Promise.all 同时发起。',
    flow: ['用 async 声明异步函数。', '用 await 等待 Promise 结果。', '选择串行或并发策略并处理异常。'],
    notes: ['await 只能在 async 函数或模块顶层使用。', '并发任务仍需考虑接口限流。'],
    problem: '解决"如何用同步写法组织异步流程并选择正确的并发策略"的问题。',
  },
  {
    id: 'J_12', title: '迭代协议与生成器', navTitle: '迭代器与生成器', category: '集合与数据',
    path: '/javascript/j-12/iterators-generators', summary: '用生成器逐步产出课程列表，理解迭代协议和 yield 通信。',
    demo: J12IteratorsGenerators, code: J12Code, language: 'javascript',
    principle: '迭代协议规定 next() 返回 {value, done}；生成器函数用 yield 暂停和恢复，支持双向通信和委托 yield*。',
    flow: ['实现 [Symbol.iterator] 让对象可迭代。', '用 function* 和 yield 创建生成器。', '通过 next(value) 向生成器传入数据。'],
    notes: ['for...of 和展开语法都依赖迭代协议。', 'yield* 可委托给另一个可迭代对象。'],
    problem: '解决"如何惰性产出序列并实现自定义可迭代对象"的问题。',
  },
  {
    id: 'J_13', title: 'Proxy 与 Reflect', navTitle: 'Proxy 与 Reflect', category: '对象模型',
    path: '/javascript/j-13/proxy-reflect', summary: '用 Proxy 拦截对象操作实现响应式验证和数据追踪。',
    demo: J13ProxyReflect, code: J13Code, language: 'javascript',
    principle: 'Proxy 创建对象代理，拦截 get/set/has 等基本操作；Reflect 提供与 Proxy 陷阱对应的默认行为，保证原型链和 this 正确。',
    flow: ['用 new Proxy 包装目标对象。', '在陷阱中执行自定义逻辑。', '用 Reflect 转发默认操作。'],
    notes: ['Proxy 不能代理内部槽位（如 Date 的 [[DateValue]]）。', 'Vue 3 响应式的底层就是 Proxy。'],
    problem: '解决"如何透明地拦截和增强对象行为"的问题。',
  },
  {
    id: 'J_14', title: 'Map、Set 与弱引用', navTitle: 'Map/Set/WeakRef', category: '集合与数据',
    path: '/javascript/j-14/map-set-weakref', summary: '用 Set 去重、Map 关联数据、WeakMap 绑定 DOM 元数据。',
    demo: J14MapSetWeakRef, code: J14Code, language: 'javascript',
    principle: 'Map 允许任意类型做键，Set 保证值唯一；WeakMap/WeakSet 的键是弱引用，不阻止垃圾回收，适合关联临时元数据。',
    flow: ['用 Set 收集不重复标签。', '用 Map 建立对象到数据的映射。', '用 WeakMap 给 DOM 元素附加私有数据。'],
    notes: ['WeakMap 的键不可枚举，且仅在键没有其他强引用时才允许回收。', 'GC 时机不可预测，WeakRef 与 FinalizationRegistry 不适合承载关键业务逻辑。'],
    problem: '解决"何时用 Map/Set 替代对象和数组，以及如何避免内存泄漏"的问题。',
  },
  {
    id: 'J_15', title: '正则表达式与模式匹配', navTitle: '正则表达式', category: '语言基础',
    path: '/javascript/j-15/regexp', summary: '用正则验证手机号、邮箱和身份证号，掌握分组和断言。',
    demo: J15RegExp, code: J15Code, language: 'javascript',
    principle: '正则表达式描述字符串的匹配模式；字符类、量词、分组和断言组合出精确规则，test 验证、exec 提取、matchAll 遍历所有匹配。',
    flow: ['用字符类和量词描述模式。', '用分组和命名组提取子串。', '用 lookahead/lookbehind 限定上下文。'],
    notes: ['全局正则的 lastIndex 会影响多次 test 结果。', '复杂验证建议拆成多个正则组合。'],
    problem: '解决"如何用声明式模式匹配和提取字符串中的结构化信息"的问题。',
  },
  {
    id: 'J_16', title: '错误处理与自定义异常', navTitle: '错误处理', category: '语言基础',
    path: '/javascript/j-16/error-handling', summary: '用 try/catch/finally 和自定义 Error 类构建可恢复的错误流。',
    demo: J16ErrorHandling, code: J16Code, language: 'javascript',
    principle: 'try/catch 捕获同步和异步错误，finally 保证清理逻辑执行；自定义 Error 子类携带业务语义，cause 属性建立错误链。',
    flow: ['try 包裹可能出错的代码。', 'catch 按错误类型分支处理。', 'finally 执行清理，不论成功失败。'],
    notes: ['catch 无法捕获异步回调中的同步抛出。', 'Error.cause（ES2022）可追溯原始错误。'],
    problem: '解决"如何优雅捕获异常、区分错误类型并保留错误上下文"的问题。',
  },
  {
    id: 'J_17', title: '可选链、空值合并与逻辑赋值', navTitle: '可选链与空值合并', category: '语言基础',
    path: '/javascript/j-17/optional-nullish', summary: '安全访问深层属性、处理空值默认值和逻辑赋值运算符。',
    demo: J17OptionalNullish, code: J17Code, language: 'javascript',
    principle: '?. 在 null/undefined 处短路返回 undefined；?? 只在左侧为 null/undefined 时取右侧值；??= ||= &&= 把判断和赋值合并为一步。',
    flow: ['用 ?. 安全访问嵌套属性。', '用 ?? 提供空值默认值。', '用逻辑赋值运算符简化条件初始化。'],
    notes: ['?? 和 || 的区别：|| 对空字符串和 0 也取右侧。', '?.() 可安全调用可能不存在的函数。'],
    problem: '解决"如何简洁地处理深层对象的空值和条件赋值"的问题。',
  },
  {
    id: 'J_18', title: '高阶函数、柯里化与组合', navTitle: '高阶函数', category: '函数与组合',
    path: '/javascript/j-18/higher-order', summary: '用函数组合构建价格计算器，掌握柯里化、偏函数和防抖节流。',
    demo: J18HigherOrder, code: J18Code, language: 'javascript',
    principle: '高阶函数接收或返回函数；柯里化把多参函数转为单参链；pipe 把多个单步函数串联为流水线；防抖和节流控制执行频率。',
    flow: ['用柯里化拆解多参函数。', '用 pipe 组合单步转换为流水线。', '用防抖/节流控制高频事件回调。'],
    notes: ['Array.prototype.map/filter/reduce 本身就是高阶函数。', 'compose 从右到左，pipe 从左到右。'],
    problem: '解决"如何用函数组合代替重复代码并控制执行频率"的问题。',
  },
  {
    id: 'J_19', title: '模板字面量与标签模板', navTitle: '模板字面量', category: '语言基础',
    path: '/javascript/j-19/template-literals', summary: '用标签模板实现国际化系统，掌握原始字符串和 DSL 构建。',
    demo: J19TemplateLiterals, code: J19Code, language: 'javascript',
    principle: '模板字面量支持插值和多行文本；标签模板把字符串片段和表达式值分别传给函数，可构建 DSL、HTML 转义和 CSS-in-JS。',
    flow: ['用 ${} 嵌入表达式。', '定义标签函数处理 strings 和 values。', '用 String.raw 获取未转义的原始文本。'],
    notes: ['标签函数的第一个参数是字符串数组，其余参数是插值。', 'graphql-tag 和 styled-components 都基于标签模板。'],
    problem: '解决"如何在字符串中嵌入逻辑并构建领域专用语言"的问题。',
  },
  {
    id: 'J_20', title: 'JSON 与结构化克隆', navTitle: 'JSON 与克隆', category: '集合与数据',
    path: '/javascript/j-20/json-clone', summary: '用 replacer/reviver 控制序列化，用 structuredClone 深拷贝。',
    demo: J20JsonClone, code: J20Code, language: 'javascript',
    principle: 'JSON.stringify/parse 通过 replacer 和 reviver 控制转换；structuredClone 能处理循环引用和更多内置类型，是真正的深拷贝。',
    flow: ['用 replacer 函数过滤或转换字段。', '用 reviver 在解析时还原类型。', '用 structuredClone 处理循环引用。'],
    notes: ['JSON 不支持 undefined、函数、Symbol、循环引用。', 'structuredClone 不支持 DOM 节点和函数。'],
    problem: '解决"如何正确序列化复杂对象并实现可靠的深拷贝"的问题。',
  },
  {
    id: 'J_21', title: '属性描述符与对象控制', navTitle: '属性描述符', category: '对象模型',
    path: '/javascript/j-21/property-descriptors', summary: '用 defineProperty 精确控制属性行为，用 freeze/seal 锁定对象。',
    demo: J21PropertyDescriptors, code: J21Code, language: 'javascript',
    principle: '每个属性有 configurable/enumerable/writable 描述符；getter/setter 提供计算属性；freeze/seal/preventExtensions 逐级限制对象修改。',
    flow: ['用 defineProperty 设置单个属性描述符。', '用 getter/setter 创建计算属性。', '用 freeze 冻结对象防止任何修改。'],
    notes: ['Object.freeze 是浅层的，嵌套对象需递归冻结。', 'Object.keys/values/entries 只返回可枚举自有属性。'],
    problem: '解决"如何精确控制对象属性的可写、可枚举和可配置性"的问题。',
  },
  {
    id: 'J_22', title: 'Symbol 与内置符号', navTitle: 'Symbol', category: '语言基础',
    path: '/javascript/j-22/symbol', summary: '用 Symbol 实现唯一标识和自定义迭代，理解内置符号的作用。',
    demo: J22Symbol, code: J22Code, language: 'javascript',
    principle: 'Symbol 生成唯一标识符；内置符号（Symbol.iterator、Symbol.toPrimitive 等）允许自定义对象的迭代、转换和字符串化行为。',
    flow: ['用 Symbol() 创建唯一键。', '实现 Symbol.iterator 让对象可迭代。', '用 Symbol.toPrimitive 自定义类型转换。'],
    notes: ['Symbol.for 在全局注册表中共享。', 'Symbol.hasInstance 可自定义 instanceof 行为。'],
    problem: '解决"如何创建不冲突的属性键并自定义对象的内置行为"的问题。',
  },
  {
    id: 'J_23', title: '字符串方法与国际化', navTitle: '字符串与 Intl', category: '语言基础',
    path: '/javascript/j-23/string-intl', summary: '用字符串方法搜索和转换文本，用 Intl 格式化日期和货币。',
    demo: J23StringIntl, code: J23Code, language: 'javascript',
    principle: '字符串方法覆盖搜索、截取和替换；Intl API 提供地区感知的日期、数字和排序格式化，是国际化的标准方案。',
    flow: ['用 includes/matchAll 搜索文本。', '用 replaceAll 批量替换。', '用 Intl.DateTimeFormat/NumberFormat 格式化输出。'],
    notes: ['字符串是不可变的，方法都返回新字符串。', 'Intl.Collator 可正确排序中文等多语言文本。'],
    problem: '解决"如何高效处理字符串搜索替换和地区化格式显示"的问题。',
  },
  {
    id: 'J_24', title: '逻辑运算、位运算与权限模型', navTitle: '逻辑与位运算', category: '语言基础',
    path: '/javascript/j-24/logical-bitwise', summary: '用位运算实现权限标志模型，掌握逻辑短路和赋值运算符。',
    demo: J24LogicalBitwise, code: J24Code, language: 'javascript',
    principle: '逻辑运算符支持短路求值和条件赋值；位运算在整数层面操作二进制位，适合实现权限标志、状态压缩等场景。',
    flow: ['用 && || 短路求值简化条件。', '用位运算 OR 组合权限标志。', '用 AND 检查、XOR 切换权限位。'],
    notes: ['??= ||= &&= 只在条件满足时赋值。', '位运算对 32 位整数操作，超出范围会截断。'],
    problem: '解决"如何用位运算实现高效的权限和状态管理"的问题。',
  },
  {
    id: 'J_25', title: 'Fetch API 与网络请求', navTitle: 'Fetch API', category: '网络与通信',
    path: '/javascript/j-25/fetch-api', summary: '用 Fetch API 替代 XMLHttpRequest，掌握请求配置、响应处理和错误处理。',
    demo: J25FetchApi, code: J25Code, language: 'javascript',
    principle: 'fetch() 返回 Promise，默认 GET 请求；通过 Request 对象可复用配置；响应需通过 .json()/.text() 等方法读取，且只能读取一次。',
    flow: ['配置 method、headers、body 发起请求。', '检查 res.ok 判断状态码。', '用 .json() 解析响应体。'],
    notes: ['fetch 默认不携带 Cookie，需设置 credentials: "include"。', 'fetch 不会因 HTTP 错误状态码 reject，需手动检查 res.ok。'],
    problem: '解决"如何以现代、简洁的方式发起网络请求并处理响应"的问题。',
  },
  {
    id: 'J_26', title: 'Web Storage 与 IndexedDB', navTitle: 'Web Storage', category: '存储',
    path: '/javascript/j-26/web-storage', summary: '用 localStorage/sessionStorage 存储简单键值，用 IndexedDB 存储大量结构化数据。',
    demo: J26WebStorage, code: J26Code, language: 'javascript',
    principle: 'localStorage 持久化存储（跨会话），sessionStorage 会话级存储（关闭标签页清除）；两者只能存字符串，对象需 JSON 序列化；IndexedDB 支持大容量结构化存储和索引查询。',
    flow: ['用 localStorage 持久化用户偏好。', '用 sessionStorage 暂存表单进度。', '用 IndexedDB 存储离线数据。'],
    notes: ['Storage 事件可监听其他标签页的变更（同源）。', 'IndexedDB 操作是异步的，基于事务和对象仓库。'],
    problem: '解决"浏览器端如何持久化用户数据，以及不同存储方案的适用场景"的问题。',
  },
  {
    id: 'J_27', title: 'WebSocket 与实时通信', navTitle: 'WebSocket', category: '网络与通信',
    path: '/javascript/j-27/websocket', summary: '用 WebSocket 建立持久双向连接，理解与服务端推送（SSE）的差异。',
    demo: J27WebSocket, code: J27Code, language: 'javascript',
    principle: 'WebSocket 建立后，客户端和服务端可随时互相发送数据；SSE（Server-Sent Events）是单向的（服务端→客户端）；两者都基于 HTTP 升级，但用途不同。',
    flow: ['创建 WebSocket 连接并监听事件。', '通过 ws.send() 发送消息。', '对比 WebSocket 与 SSE 的适用场景。'],
    notes: ['WebSocket 协议以 ws:// 或 wss:// 开头。', '生产环境需要处理重连、心跳和消息队列。'],
    problem: '解决"如何实现服务端主动向客户端推送数据，以及实时双向通信"的问题。',
  },
  {
    id: 'J_28', title: 'AbortController 与可中断操作', navTitle: 'AbortController', category: '异步控制',
    path: '/javascript/j-28/abort-controller', summary: '用 AbortController 取消进行中的 Fetch 请求、事件监听和其他可中断操作。',
    demo: J28AbortController, code: J28Code, language: 'javascript',
    principle: 'AbortController 通过 signal 与异步操作关联；调用 abort() 会触发 signal 的 abort 事件；Fetch、addEventListener 等 API 已原生支持 signal。',
    flow: ['创建 AbortController 并获取 signal。', '将 signal 传入 fetch 配置。', '在需要时调用 controller.abort() 取消请求。'],
    notes: ['一个 signal 可同时关联多个操作（如多个并发请求）。', 'abort() 只能调用一次，调用后 signal.aborted 变为 true。'],
    problem: '解决"如何取消进行中的网络请求或事件监听，避免不必要的等待和资源浪费"的问题。',
  },
  {
    id: 'D_01', title: 'Node.js 运行时与模块系统', navTitle: '模块系统', category: '运行时与模块',
    path: '/nodejs/d-1/module-system', summary: '理解 Node.js 运行时、ES Modules 与 CommonJS 的边界和互操作。',
    demo: D01ModuleSystem, code: D01Code, language: 'vue',
    principle: 'Node.js 在 V8 之上提供文件、网络和进程 API。ESM 使用 import/export，CommonJS 使用 require/module.exports，项目应明确一种主模块格式。',
    flow: ['通过 package.json 的 type 确定默认格式。', '使用 node: 前缀导入核心模块。', '在边界处谨慎处理 ESM 与 CJS 互操作。'],
    notes: ['ESM 中没有原生 __dirname。', '避免在同一目录混用隐式模块格式。'],
    problem: '解决"Node 项目该选择哪种模块格式以及两者为何报错"的问题。',
  },
  {
    id: 'D_02', title: '路径、URL 与跨平台文件定位', navTitle: '路径与 URL', category: '运行时与模块',
    path: '/nodejs/d-2/path-url', summary: '使用 node:path 与 node:url 安全处理文件路径和模块位置。',
    demo: D02PathUrl, code: D02Code, language: 'vue',
    principle: '文件系统路径和 URL 是不同表示；path.resolve/join 处理平台分隔符，fileURLToPath 把 ESM 的 import.meta.url 转成文件路径。',
    flow: ['确定可信的根目录。', '规范化并拼接相对路径。', '验证最终路径仍位于允许目录。'],
    notes: ['不要手写 / 拼接跨平台路径。', '用户输入不能未经校验传给文件 API。'],
    problem: '解决"Windows 与 Linux 路径差异及 ESM 文件定位"的问题。',
  },
  {
    id: 'D_03', title: '异步文件系统操作', navTitle: '文件系统', category: '文件与事件',
    path: '/nodejs/d-3/file-system', summary: '用 fs/promises 读取配置、写入临时文件并完成原子替换。',
    demo: D03FileSystem, code: D03Code, language: 'vue',
    principle: '服务端请求路径应使用异步文件 API，避免同步 I/O 阻塞事件循环；关键写入可先写临时文件再 rename 实现原子替换。',
    flow: ['以明确编码异步读取文件。', '解析前处理不存在和权限错误。', '写临时文件后原子替换目标。'],
    notes: ['不要在热路径使用 readFileSync。', '大文件应改用流而非一次读入内存。'],
    problem: '解决"如何可靠且不阻塞地读写 Node.js 文件"的问题。',
  },
  {
    id: 'D_04', title: 'EventEmitter 与事件解耦', navTitle: '事件发布订阅', category: '文件与事件',
    path: '/nodejs/d-4/event-emitter', summary: '用订单事件连接库存和通知逻辑，理解监听器生命周期。',
    demo: D04EventEmitter, code: D04Code, language: 'vue',
    principle: 'EventEmitter 同步调用当前事件的监听器，适合同一进程内解耦模块；跨进程可靠消息需要消息队列与持久化机制。',
    flow: ['为业务事件定义稳定名称与载荷。', '订阅方注册 on 或 once 监听器。', '不再需要时 removeListener 防止泄漏。'],
    notes: ['监听器抛错会影响 emit 调用栈。', 'error 事件没有监听器时会终止进程。'],
    problem: '解决"同一进程内多个模块如何响应同一业务事件"的问题。',
  },
  {
    id: 'D_05', title: 'Stream、管道与背压', navTitle: '流与背压', category: '流与网络',
    path: '/nodejs/d-5/streams', summary: '以大报表导出理解 Readable、Writable、pipeline 与背压。',
    demo: D05Streams, code: D05Code, language: 'vue',
    principle: '流按块处理数据，避免把完整文件放入内存；背压让生产速度服从消费速度，pipeline 统一连接与错误清理。',
    flow: ['Readable 分块产生数据。', 'Transform 转换每个数据块。', 'pipeline 写入目标并传播错误。'],
    notes: ['优先使用 pipeline 而不是手工 pipe 链。', '对象模式和字节模式的 highWaterMark 含义不同。'],
    problem: '解决"大文件和网络数据如何低内存传输且不压垮消费者"的问题。',
  },
  {
    id: 'D_06', title: '原生 HTTP 服务与路由', navTitle: 'HTTP 服务', category: '流与网络',
    path: '/nodejs/d-6/http-server', summary: '从 request/response 构建最小 JSON API，理解方法、状态码与响应头。',
    demo: D06HttpServer, code: D06Code, language: 'vue',
    principle: 'node:http 提供底层流式请求与响应；服务需要显式匹配方法和路径、限制请求体、设置内容类型并统一结束响应。',
    flow: ['读取 method、URL 与请求头。', '路由到对应处理器并校验输入。', '设置状态码和响应头后发送结果。'],
    notes: ['请求体是流，必须限制最大体积。', '生产服务还需要超时、代理与优雅关闭。'],
    problem: '解决"Node.js 如何直接接收 HTTP 请求并返回规范响应"的问题。',
  },
  {
    id: 'D_07', title: '进程、环境变量与优雅退出', navTitle: '进程与配置', category: '进程与并发',
    path: '/nodejs/d-7/process-env', summary: '集中校验环境配置，并在 SIGTERM 时停止接流量和释放资源。',
    demo: D07ProcessEnv, code: D07Code, language: 'vue',
    principle: 'process 提供参数、环境、信号和退出状态；配置应在启动阶段完成校验，关闭时先停止新请求，再等待存量任务结束。',
    flow: ['启动时读取并验证环境变量。', '注册 SIGTERM/SIGINT 信号处理。', '关闭服务器和连接池后设置退出码。'],
    notes: ['不要在业务代码到处读取 process.env。', '不要用 process.exit 强行截断异步清理。'],
    problem: '解决"服务如何管理多环境配置并在部署时安全退出"的问题。',
  },
  {
    id: 'D_08', title: '异步并发控制与任务池', navTitle: '并发控制', category: '进程与并发',
    path: '/nodejs/d-8/concurrency', summary: '限制批处理并发度，避免耗尽文件句柄和下游连接。',
    demo: D08Concurrency, code: D08Code, language: 'vue',
    principle: '异步 I/O 可以并发等待，但无限 Promise.all 会同时占用外部资源；任务池以固定 worker 数限制在途任务。',
    flow: ['建立待处理任务队列。', '启动固定数量 worker。', '每个 worker 完成后领取下一任务。'],
    notes: ['CPU 密集任务考虑 Worker Threads。', '并发上限应结合下游容量压测。'],
    problem: '解决"批量异步任务如何提速又不压垮系统"的问题。',
  },
  {
    id: 'D_09', title: '错误边界与结构化日志', navTitle: '错误与日志', category: '可靠性',
    path: '/nodejs/d-9/error-logging', summary: '区分操作型错误与程序错误，并记录可检索的结构化上下文。',
    demo: D09ErrorLogging, code: D09Code, language: 'vue',
    principle: '预期的操作型错误应转换为稳定错误码和合适响应；未知程序错误应记录堆栈、请求 ID 和上下文后由进程管理器重启。',
    flow: ['在边界捕获异步错误。', '映射公开错误码与 HTTP 状态。', '以 JSON 记录请求 ID 和内部原因。'],
    notes: ['日志不得包含令牌和个人敏感信息。', 'unhandledRejection 不应只打印后继续运行。'],
    problem: '解决"服务错误如何分类、返回和排查"的问题。',
  },
  {
    id: 'D_10', title: '内置 node:test 测试运行器', navTitle: 'Node 测试', category: '可靠性',
    path: '/nodejs/d-10/node-test', summary: '使用 node:test 与 assert 编写单元测试、子测试和异步测试。',
    demo: D10NodeTest, code: D10Code, language: 'vue',
    principle: 'Node 内置测试运行器支持并发、Mock、覆盖率和多种报告格式，无需第三方框架即可验证核心模块。',
    flow: ['导入 node:test 与 strict assert。', '按行为组织测试和子测试。', '在 CI 中输出覆盖率与机器可读报告。'],
    notes: ['每个测试应可独立运行。', '不要依赖测试执行顺序和共享全局状态。'],
    problem: '解决"如何使用 Node.js 自带能力建立可靠测试套件"的问题。',
  },
  {
    id: 'D_11', title: '服务端输入与路径安全', navTitle: '输入安全', category: '安全与依赖',
    path: '/nodejs/d-11/security', summary: '防止路径穿越、注入、超大请求和敏感信息泄漏。',
    demo: D11Security, code: D11Code, language: 'vue',
    principle: '所有外部输入都不可信；服务端需要白名单校验、规范化路径、最小权限、体积限制和参数化查询等多层防护。',
    flow: ['在系统边界解析并校验输入。', '规范化后确认资源仍在允许范围。', '使用最小权限访问文件和服务。'],
    notes: ['前端校验不能替代服务端校验。', '错误响应不要暴露内部路径和堆栈。'],
    problem: '解决"Node 服务如何抵御常见输入攻击和敏感信息泄漏"的问题。',
  },
  {
    id: 'D_12', title: '包管理、SemVer 与可重复安装', navTitle: '依赖管理', category: '安全与依赖',
    path: '/nodejs/d-12/package-management', summary: '理解 package.json、锁文件、版本范围、脚本和依赖审计。',
    demo: D12PackageManagement, code: D12Code, language: 'vue',
    principle: 'package.json 声明意图，锁文件记录完整依赖图；CI 使用冻结锁文件，SemVer 范围决定允许升级的版本集合。',
    flow: ['区分运行依赖和开发依赖。', '提交并审查锁文件变更。', 'CI 冻结安装并执行依赖审计。'],
    notes: ['不要盲目自动升级主版本。', '安装脚本具有执行代码权限，需要审查来源。'],
    problem: '解决"如何让团队和 CI 安装完全一致且可审计的依赖"的问题。',
  },
  {
    id: 'D_13', title: 'Express 与 Fastify 路由对比', navTitle: 'Express/Fastify', category: 'Web 框架',
    path: '/nodejs/d-13/express-fastify', summary: '对比 Express 中间件链和 Fastify Schema 验证两种路由模式。',
    demo: D13ExpressFastify, code: D13Code, language: 'vue',
    principle: 'Express 用洋葱模型中间件链处理请求，灵活但缺乏约束；Fastify 用 JSON Schema 验证输入输出，启动时编译路由性能更高，适合需要严格接口契约的场景。',
    flow: ['理解 Express 的 middleware 链式调用。', '了解 Fastify 的 Schema 验证和序列化。', '根据项目需求选择合适的框架。'],
    notes: ['Express 生态最大，Fastify 性能更好。', 'Fastify 的 Schema 验证同时生成类型和运行时校验。'],
    problem: '解决"Node.js Web 框架如何选择，以及路由和验证的最佳实践"的问题。',
  },
  {
    id: 'D_14', title: 'WebSocket 实时通信', navTitle: 'WebSocket', category: 'Web 框架',
    path: '/nodejs/d-14/websocket', summary: '用 WebSocket 实现实时聊天，掌握连接、心跳、广播和重连策略。',
    demo: D14WebSocket, code: D14Code, language: 'vue',
    principle: 'WebSocket 提供双向持久连接，服务端可主动推送消息；心跳检测连接活性，断线重连保证可用性，广播将消息分发给所有连接的客户端。',
    flow: ['建立 WebSocket 连接并完成握手。', '定时发送心跳检测连接状态。', '断线后指数退避重连。'],
    notes: ['WebSocket 连接是持久资源，需要管理连接池。', '生产环境通常需要 Redis Pub/Sub 实现多实例广播。'],
    problem: '解决"如何实现服务端主动推送的双向实时通信"的问题。',
  },
  {
    id: 'D_15', title: '数据库连接与迁移', navTitle: '数据库', category: '数据与存储',
    path: '/nodejs/d-15/database', summary: '比较原生 SQL、查询构建器和 ORM，掌握数据库迁移工作流。',
    demo: D15Database, code: D15Code, language: 'vue',
    principle: '数据库访问有三种层次：原生 SQL 最灵活，查询构建器平衡灵活与安全，ORM 提供对象映射但隐藏复杂度；迁移脚本管理 Schema 变更，支持向上和向下操作。',
    flow: ['配置连接池控制并发。', '选择适合项目的数据访问层。', '用迁移脚本管理 Schema 版本。'],
    notes: ['连接池大小要根据并发和数据库限制调整。', '迁移脚本必须可重复执行且幂等。'],
    problem: '解决"Node.js 项目如何选择数据访问层并管理数据库 Schema 变更"的问题。',
  },
  {
    id: 'D_16', title: 'Worker 线程与 CPU 密集任务', navTitle: 'Worker 线程', category: '进程与并发',
    path: '/nodejs/d-16/worker-threads', summary: '用 Worker 线程卸载 CPU 密集计算，保持事件循环响应。',
    demo: D16WorkerThreads, code: D16Code, language: 'vue',
    principle: 'Node.js 的事件循环是单线程的，CPU 密集任务会阻塞其他请求；Worker Threads 在独立线程中执行计算，通过 MessageChannel 与主线程通信，保持事件循环畅通。',
    flow: ['识别 CPU 密集型瓶颈。', '将计算逻辑移到 Worker 线程。', '通过消息传递返回计算结果。'],
    notes: ['Worker 适合 CPU 密集，不适合 I/O 密集。', ' Piscina 等库提供 Worker 池管理。'],
    problem: '解决"CPU 密集任务如何避免阻塞 Node.js 事件循环"的问题。',
  },
  /***** Node.js 补全案例 D_17 ~ D_30 *****/
  {
    id: 'D_17', title: '事件循环与宏微任务', navTitle: '事件循环', category: '事件循环',
    path: '/nodejs/d-17/event-loop', summary: '理解 Node.js 事件循环的六个阶段，以及微任务（nextTick、Promise）和宏任务（setTimeout、setImmediate）的执行顺序。',
    demo: D17EventLoop, code: D17Code, language: 'vue',
    principle: 'Node.js 事件循环分为六个阶段（Timers、Pending、Idle/Prepare、Poll、Check、Close），微任务（process.nextTick、Promise.then）在每个阶段结束后优先执行。',
    flow: ['理解事件循环的六个阶段。', '掌握微任务和宏任务的执行顺序。', '学会使用 nextTick 和 setImmediate。'],
    notes: ['process.nextTick 优先级高于 Promise.then。', 'setImmediate 在 Check 阶段执行，Node.js 特有。'],
    problem: '解决"异步代码执行顺序不符合预期，以及定时器回调为什么不按时执行"的问题。',
  },
  {
    id: 'D_18', title: 'Buffer 与二进制数据处理', navTitle: 'Buffer', category: '二进制',
    path: '/nodejs/d-18/buffer', summary: '理解 Buffer 的创建、编码转换、拼接和截取，掌握二进制数据处理的基本操作。',
    demo: D18Buffer, code: D18Code, language: 'vue',
    principle: 'Buffer 是 Uint8Array 的子类，用于表示固定长度的字节序列；Node.js 中文件 I/O、网络传输、加密等操作都以 Buffer 为纽带。',
    flow: ['学习 Buffer 的创建方式（from、alloc、allocUnsafe）。', '掌握不同编码（utf8、hex、base64）的转换。', '理解 Buffer 拼接和截取的最佳实践。'],
    notes: ['优先使用 Buffer.from() 而非 new Buffer()。', '拼接多个 Buffer 时使用 Buffer.concat() 避免内存碎片。'],
    problem: '解决"如何处理二进制数据、文件内容编码转换、以及 Stream 数据拼接"的问题。',
  },
  {
    id: 'D_19', title: 'child_process 子进程', navTitle: '子进程', category: '多进程',
    path: '/nodejs/d-19/child-process', summary: '对比 spawn、fork、exec 三种创建子进程的方式，掌握多进程架构的基础。',
    demo: D19ChildProcess, code: D19Code, language: 'vue',
    principle: 'child_process 提供三种创建子进程的方式：spawn（流式输出，适合大数据量）、fork（Node.js 脚本，支持 IPC）、exec（一次性输出，适合简单命令）。',
    flow: ['对比 spawn、fork、exec 的适用场景。', '学习子进程通信（IPC、stdout/stderr）。', '掌握子进程生命周期管理。'],
    notes: ['大数据量用 spawn（流式）。', 'Node.js 脚本用 fork（IPC 通信）。', '简单命令用 exec（一次性输出）。'],
    problem: '解决"如何在 Node.js 中执行外部命令、利用多核 CPU、以及隔离崩溃风险"的问题。',
  },
  {
    id: 'D_20', title: 'cluster 多核利用', navTitle: 'cluster', category: '多进程',
    path: '/nodejs/d-20/cluster', summary: '使用 cluster 模块创建多进程架构，充分利用多核 CPU，提高应用吞吐量和可靠性。',
    demo: D20Cluster, code: D20Code, language: 'vue',
    principle: 'cluster 模块基于 child_process.fork()，主进程负责接收连接并分发给工作进程，工作进程各自独立运行，共享服务器端口；默认负载均衡策略为轮询。',
    flow: ['理解 cluster 的主从架构。', '学习工作进程的创建和生命周期管理。', '掌握负载均衡和优雅退出策略。'],
    notes: ['工作进程数通常设置为 CPU 核心数。', '工作进程崩溃后主进程应自动 fork 新进程。'],
    problem: '解决"单线程 Node.js 无法充分利用多核 CPU，以及单点故障导致整个应用不可用"的问题。',
  },
  {
    id: 'D_21', title: 'crypto 加密实践', navTitle: '加密', category: '安全',
    path: '/nodejs/d-21/crypto', summary: '使用 crypto 模块进行哈希、HMAC、对称加密等操作，掌握密码存储和数据签名的最佳实践。',
    demo: D21Crypto, code: D21Code, language: 'vue',
    principle: 'Node.js 内置 crypto 模块提供哈希（SHA、MD5）、HMAC、对称加密（AES）、非对称加密（RSA）、签名等功能；密码存储推荐使用 bcrypt 或 scrypt。',
    flow: ['学习哈希算法（SHA-256、SHA-512）的使用。', '掌握 HMAC 和 AES 加密。', '理解密码存储的最佳实践（bcrypt）。'],
    notes: ['不要使用 MD5 存储密码（已不安全）。', '使用 crypto.timingSafeEqual() 防止时序攻击。'],
    problem: '解决"用户密码如何安全存储、API 请求如何防篡改、以及敏感数据如何加密传输"的问题。',
  },
  {
    id: 'D_22', title: 'perf_hooks 性能分析', navTitle: '性能分析', category: '性能',
    path: '/nodejs/d-22/perf-hooks', summary: '使用 perf_hooks 模块进行性能打点和测量，定位函数级别的性能瓶颈。',
    demo: D22PerfHooks, code: D22Code, language: 'vue',
    principle: 'perf_hooks 提供与浏览器 performance API 兼容的接口；通过 performance.mark() 打点、performance.measure() 测量区间、PerformanceObserver 监听性能条目。',
    flow: ['学习 performance.mark() 和 measure() 的使用。', '掌握 PerformanceObserver 监听性能条目。', '了解如何配合 clinic.js 做专业性能分析。'],
    notes: ['perf_hooks 是内置模块，无需安装。', '生产环境应采样性能数据，避免全量收集影响性能。'],
    problem: '解决"如何定位 Node.js 应用的性能瓶颈，以及函数执行时间是否符合预期"的问题。',
  },
  {
    id: 'D_23', title: 'HTTPS 与 TLS 配置', navTitle: 'HTTPS', category: '网络',
    path: '/nodejs/d-23/https', summary: '理解 HTTPS 的原理，掌握 Node.js HTTPS 服务器的创建和 TLS 配置。',
    demo: D23Https, code: D23Code, language: 'vue',
    principle: 'HTTPS 基于 TLS/SSL 协议，需要证书和私钥；Node.js 使用 https 模块（基于 OpenSSL）创建安全服务器；生产环境应使用 Let\'s Encrypt 等免费证书。',
    flow: ['理解 HTTPS 和 TLS/SSL 的基本原理。', '学习使用 OpenSSL 创建自签名证书。', '掌握 Node.js HTTPS 服务器的配置。'],
    notes: ['生产环境务必使用 HTTPS。', 'TLS 1.2 是最低版本要求，推荐 TLS 1.3。'],
    problem: '解决"如何启用 HTTPS、如何选择合适的 TLS 版本和加密套件、以及证书如何申请和管理"的问题。',
  },
  {
    id: 'D_24', title: 'CLI 参数与命令行工具', navTitle: 'CLI', category: 'CLI',
    path: '/nodejs/d-24/cli', summary: '解析命令行参数，使用 commander 等库构建专业的命令行工具。',
    demo: D24Cli, code: D24Code, language: 'vue',
    principle: 'process.argv 提供原始命令行参数；实际项目使用 commander、yargs 等库解析参数、生成帮助信息、支持子命令；Vue CLI、Vite 等都基于 commander。',
    flow: ['理解 process.argv 的结构。', '学习使用 commander 构建 CLI 工具。', '掌握子命令、选项、参数等高级用法。'],
    notes: ['process.argv[0] 是 node 路径，argv[1] 是脚本路径。', '生产级 CLI 工具推荐使用 commander 或 cac。'],
    problem: '解决"如何解析命令行参数、如何生成帮助信息、以及如何构建交互式 CLI 工具"的问题。',
  },
  {
    id: 'D_25', title: 'timers 定时器详解', navTitle: '定时器', category: '事件循环',
    path: '/nodejs/d-25/timers', summary: '深入理解 setTimeout、setInterval、setImmediate、process.nextTick 的语义差异和执行时机。',
    demo: D25Timers, code: D25Code, language: 'vue',
    principle: 'setTimeout/setInterval 在 Timers 阶段执行；setImmediate 在 Check 阶段执行；process.nextTick 是微任务，在当前操作完成后立即执行（优先于 Promise.then）。',
    flow: ['对比四种定时器的执行时机。', '理解延迟时间的不确定性（受事件循环影响）。', '掌握定时器清除和防内存泄漏。'],
    notes: ['setTimeout(fn, 0) 的实际延迟至少 1ms。', '在 I/O 回调中，setImmediate 先于 setTimeout 执行。'],
    problem: '解决"定时器回调执行时间不符合预期，以及在特定场景下应该选择哪种定时器"的问题。',
  },
  {
    id: 'D_26', title: 'net TCP 网络编程', navTitle: 'TCP', category: '网络',
    path: '/nodejs/d-26/net-tcp', summary: '使用 net 模块创建 TCP 服务器和客户端，理解 Node.js 网络编程的底层基础。',
    demo: D26NetTcp, code: D26Code, language: 'vue',
    principle: 'net 模块提供 TCP 服务器和客户端能力；TCP 是面向连接的可靠传输协议；HTTP 服务器底层就是 TCP 服务器；socket 是双向通信的端点。',
    flow: ['学习创建 TCP 服务器（net.createServer）。', '学习创建 TCP 客户端（net.createConnection）。', '理解 socket 事件（data、end、error）。'],
    notes: ['TCP 服务器适合实时通信、长连接场景。', '记得处理 socket 的 error 事件，避免进程崩溃。'],
    problem: '解决"如何构建实时通信应用、如何实现自定义协议、以及 HTTP 模块的底层是如何工作的"的问题。',
  },
  {
    id: 'D_27', title: 'zlib 压缩与解压', navTitle: '压缩', category: '性能',
    path: '/nodejs/d-27/zlib', summary: '使用 zlib 模块压缩和解压数据，减少网络传输大小和文件存储体积。',
    demo: D27Zlib, code: D27Code, language: 'vue',
    principle: 'zlib 模块提供 Gzip、Deflate、Brotli 等压缩算法；支持流式压缩（pipe），内存占用小；HTTP 响应压缩是 zlib 最常见的用途。',
    flow: ['学习 gzip/deflate/brotli 的压缩率和速度对比。', '掌握流式压缩（pipe）和一次性压缩。', '了解 HTTP 响应压缩的配置。'],
    notes: ['Brotli 压缩率最高但压缩速度较慢。', 'Node.js 18+ 支持流式压缩，内存占用小。'],
    problem: '解决"如何减少网络传输大小、如何提高页面加载速度、以及大文件如何压缩存储"的问题。',
  },
  {
    id: 'D_28', title: 'os 系统信息与资源监控', navTitle: '系统信息', category: '系统',
    path: '/nodejs/d-28/os', summary: '使用 os 模块获取操作系统信息，实现资源监控、健康检查和平台适配。',
    demo: D28Os, code: D28Code, language: 'vue',
    principle: 'os 模块提供平台、架构、CPU、内存、网络接口等系统信息；常用于资源监控（CPU/内存使用率）、健康检查（/health 接口）、平台适配（path.sep）。',
    flow: ['学习获取 CPU、内存、平台等系统信息。', '掌握资源监控和健康检查的实现。', '了解如何根据平台选择不同的命令或路径。'],
    notes: ['os.cpus().length 是设置 cluster 工作进程数的常用依据。', 'os.freemem() 可用于实现内存告警。'],
    problem: '解决"如何监控 Node.js 应用的资源使用、如何提供健康检查接口、以及如何适配不同操作系统"的问题。',
  },
  {
    id: 'D_29', title: 'dns 域名解析', navTitle: 'DNS', category: '网络',
    path: '/nodejs/d-29/dns', summary: '使用 dns 模块解析域名，查询各类 DNS 记录（A、AAAA、CNAME、MX、TXT、NS）。',
    demo: D29Dns, code: D29Code, language: 'vue',
    principle: 'dns 模块提供域名解析功能；dns.lookup() 使用系统配置（如 /etc/hosts），dns.resolve() 直接使用 DNS 服务器；支持反向解析（IP → 域名）。',
    flow: ['学习查询各类 DNS 记录（A、AAAA、MX 等）。', '理解 dns.lookup() 和 dns.resolve() 的差异。', '掌握反向解析和 DNS 缓存。'],
    notes: ['dns.lookup() 会受系统配置影响。', 'dns.resolve() 直接使用 DNS 服务器，更可靠。'],
    problem: '解决"如何根据域名获取 IP 地址、如何查询邮件服务器配置、以及如何实现自定义 DNS 解析逻辑"的问题。',
  },
  {
    id: 'D_30', title: 'readline 交互式输入', navTitle: 'readline', category: 'CLI',
    path: '/nodejs/d-30/readline', summary: '使用 readline 模块实现逐行读取和交互式命令行工具。',
    demo: D30Readline, code: D30Code, language: 'vue',
    principle: 'readline 模块提供逐行读取流数据的能力；常用于实现交互式 CLI 工具（逐行提问）、逐行处理大文件；现代 CLI 工具推荐使用 inquirer 或 prompts 库。',
    flow: ['学习逐行读取文件（createInterface + line 事件）。', '掌握交互式提问（question 方法）。', '了解 readline/promises 的现代用法。'],
    notes: ['readline 是低级 API，复杂交互推荐使用 inquirer。', '记得在完成后调用 rl.close() 释放资源。'],
    problem: '解决"如何实现交互式命令行工具、如何逐行处理大文件、以及如何优雅地读取用户输入"的问题。',
  },
  {
    id: 'S_01', title: '先判断状态归属，再选择 Store', navTitle: '状态边界', category: '设计原则',
    path: '/state-management/s-1/state-boundaries', summary: '区分组件状态、URL 状态、客户端共享状态和服务端缓存状态。',
    demo: S01StateBoundaries, code: S01Code, language: 'vue',
    principle: 'Store 只应承载需要跨组件共享、具有业务生命周期的客户端状态；局部 UI、URL 参数和远程缓存各有更合适的归属。',
    flow: ['确认状态的唯一事实来源。', '判断共享范围与生命周期。', '选择最小且匹配语义的状态工具。'],
    notes: ['全局可访问不等于应该全局存储。', '远程数据还需要缓存失效与请求去重。'],
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
    principle: '状态机显式列举有限状态和可接受事件，使不合法转换无法发生；状态图适合结算、审批和多步骤流程。',
    flow: ['列出互斥业务状态。', '为每个状态声明可处理事件。', '组件从 snapshot 渲染并发送事件。'],
    notes: ['简单布尔值不需要状态机。', '副作用使用 actor 或 invoke 建模。'],
    problem: '解决"多个布尔值组合出非法流程状态"的问题。',
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
    principle: 'MobX 通过可观察对象（Observable）实现透明的响应式更新，使用 action 修改状态，computed 计算派生值，自动追踪依赖并触发视图更新。',
    flow: ['使用 makeAutoObservable 把普通对象变成可观察的。', '在 action 中修改 observable 状态。', 'observer 包裹的组件自动追踪依赖并响应更新。'],
    notes: ['MobX 的响应式是隐式的，代码更简洁但需要理解其追踪机制。', '严格模式下必须在 action 中修改状态。', '适合中大型应用的复杂领域模型。'],
    problem: '解决状态更新逻辑分散、视图与状态同步复杂的问题。',
  },
  {
    id: 'S_24', title: 'Overmind 分形状态管理', navTitle: 'Overmind', category: '结构化状态',
    path: '/state-management/s-24/overmind', summary: '了解 Overmind 的分形架构，掌握命名空间组织状态与 effects 隔离副作用。',
    demo: S24Overmind, code: S24Code, language: 'vue',
    principle: 'Overmind 是一个分形状态管理库，将状态、动作、派生值组织在命名空间中，支持状态追踪、DevTools 和效果（effects）隔离副作用。',
    flow: ['使用 createOvermind 创建 store，按命名空间组织 state/actions/effects。', '组件通过 useOvermind 获取状态和 actions。', 'actions 修改状态，effects 处理 API、存储等副作用。'],
    notes: ['Overmind 支持 Vue 和 React 等多个框架。', '状态变更追踪到具体的 action 调用。', 'effects 模式便于测试时替换副作用。'],
    problem: '解决状态管理中副作用耦合、调试困难、跨框架复用成本高的问题。',
  },
  {
    id: 'TW_01', title: '工具优先与原子类组合', navTitle: '工具优先', category: '核心理念',
    path: '/tailwind-css/tw-1/utility-first', summary: '用课程卡片理解工具类如何映射声明，以及何时抽取组件。',
    demo: TW01UtilityFirst, code: TW01Code, language: 'xml',
    principle: 'Tailwind 工具类把有限的设计约束直接组合在标记中，减少命名和样式文件间跳转；可复用性主要由组件边界承担，而不是复制长串类名。',
    flow: ['把视觉拆成布局、间距、颜色和排版。', '用单用途工具类逐层组合。', '重复业务结构抽成 Vue 组件并保留可配置 Props。'],
    notes: ['不要仅为缩短 class 而滥用 @apply。', '样式共置不等于放弃组件抽象。'],
    problem: '解决"如何用受约束的工具类快速构建一致界面，并控制重复"的问题。',
  },
  {
    id: 'TW_02', title: '移动优先响应式设计', navTitle: '响应式断点', category: '响应与状态',
    path: '/tailwind-css/tw-2/responsive', summary: '从单列到多列课程网格，掌握无前缀规则与断点变体。',
    demo: TW02Responsive, code: TW02Code, language: 'xml',
    principle: '响应式变体以 min-width 媒体查询逐步增强：无前缀工具覆盖最小尺寸，sm、md、lg 等前缀在对应断点及以上覆盖。',
    flow: ['先完成窄屏基础布局。', '在内容开始拥挤时增加断点。', '同时检查间距、字号和交互目标尺寸。'],
    notes: ['sm 表示小断点以上，不是"仅手机"。', '断点应服务内容，不要为每个设备型号定制。'],
    problem: '解决"同一组件如何从手机到桌面逐步增强布局"的问题。',
  },
  {
    id: 'TW_03', title: '状态、Group 与 Peer 变体', navTitle: '状态变体', category: '响应与状态',
    path: '/tailwind-css/tw-3/state-variants', summary: '处理 hover、focus-visible、disabled、父级和同级联动状态。',
    demo: TW03StateVariants, code: TW03Code, language: 'xml',
    principle: '变体把条件编码为前缀并生成对应选择器；group 读取标记父级状态，peer 读取前置同级状态，结构关系决定规则能否命中。',
    flow: ['先实现键盘可见的聚焦状态。', '为禁用和校验状态添加语义反馈。', '用 group/peer 表达必要的跨元素联动。'],
    notes: ['不能只依赖 hover 传达信息。', 'peer 只能匹配其后的同级元素，这是 CSS 后续兄弟选择器的限制。'],
    problem: '解决"复杂交互状态如何保持声明式、可访问且无需额外脚本"的问题。',
  },
  {
    id: 'TW_04', title: '暗色模式与主题切换', navTitle: '暗色模式', category: '设计系统',
    path: '/tailwind-css/tw-4/dark-mode', summary: '为学习进度卡设计成对色彩，并处理系统主题与手动偏好。',
    demo: TW04DarkMode, code: TW04Code, language: 'xml',
    principle: 'dark 变体为暗色环境生成覆盖规则；可以跟随 prefers-color-scheme，也可用自定义变体绑定祖先类或 data 属性实现手动切换。',
    flow: ['为背景、文字和边框成对选色。', '决定跟随系统还是保存用户偏好。', '在首屏渲染前应用主题以避免闪烁。'],
    notes: ['暗色主题不是简单反色。', '两套主题都要验证文本、焦点环和禁用态对比度。'],
    problem: '解决"如何构建稳定、无闪烁且可访问的明暗主题"的问题。',
  },
  {
    id: 'TW_05', title: 'v4 主题变量与设计令牌', navTitle: '主题令牌', category: '设计系统',
    path: '/tailwind-css/tw-5/theme-tokens', summary: '用 @theme 定义品牌色、字体和圆角，并生成对应工具类。',
    demo: TW05ThemeTokens, code: TW05Code, language: 'css',
    principle: 'Tailwind v4 的 @theme 使用 CSS 变量命名空间定义设计令牌，编译器据此生成颜色、字体、断点等工具类，并允许令牌在运行时作为自定义属性复用。',
    flow: ['从现有视觉规范提取语义令牌。', '放入正确的 @theme 命名空间。', '用生成的工具类替换散落数值。'],
    notes: ['令牌应代表稳定系统约束，而非包装每个魔法数。', '普通运行时变量不需要放进 @theme。'],
    problem: '解决"品牌规范如何成为可复用、可约束的 Tailwind 设计系统"的问题。',
  },
  {
    id: 'TW_06', title: '任意值、任意属性与静态检测', navTitle: '任意值', category: '核心理念',
    path: '/tailwind-css/tw-6/arbitrary-values', summary: '处理精确网格、流体间距和 data 状态，同时理解类名扫描边界。',
    demo: TW06ArbitraryValues, code: TW06Code, language: 'xml',
    principle: '方括号语法允许一次性值、属性和变体进入工具类体系；构建器把源码视为纯文本检测候选类，因此运行时拼接的不完整类名不会可靠生成 CSS。',
    flow: ['确认数值确实不属于设计令牌。', '以完整静态类名写入源码。', '重复出现后提升为主题令牌或受控映射。'],
    notes: ['不要写 bg-${color}-600 这类碎片拼接。', '任意值过多通常意味着设计约束尚未收敛。'],
    problem: '解决"如何表达特殊 CSS 约束，又不破坏构建期生成与设计一致性"的问题。',
  },
  {
    id: 'TW_07', title: 'Flex、Grid 与现代布局', navTitle: 'Flex 与 Grid', category: '布局进阶',
    path: '/tailwind-css/tw-7/layout', summary: '用筛选侧栏和课程网格选择一维 Flex 与二维 Grid。',
    demo: TW07Layout, code: TW07Code, language: 'xml',
    principle: 'Flex 负责主轴上的一维分配和对齐，Grid 负责行列二维轨道；minmax(0, 1fr) 可避免内容的最小尺寸把弹性轨道撑破。',
    flow: ['判断布局是一维流还是二维轨道。', '建立尺寸、换行和溢出规则。', '最后添加响应式覆盖与视觉间距。'],
    notes: ['不要用大量 margin 模拟布局系统。', '遇到长文本时检查 min-w-0 与溢出策略。'],
    problem: '解决"复杂页面骨架该选择 Flex 还是 Grid，以及如何避免内容溢出"的问题。',
  },
  {
    id: 'TW_08', title: '容器查询与可复用组件', navTitle: '容器查询', category: '布局进阶',
    path: '/tailwind-css/tw-8/container-queries', summary: '让同一课程卡根据所在容器宽度切换结构，而非依赖视口。',
    demo: TW08ContainerQueries, code: TW08Code, language: 'xml',
    principle: '@container 在父级建立查询上下文，容器尺寸变体根据最近匹配容器切换子元素工具类，使组件在侧栏、弹窗和主内容区都能自适应。',
    flow: ['在承载组件的父级建立容器。', '以内容临界点选择容器尺寸变体。', '嵌套场景用命名容器消除歧义。'],
    notes: ['容器查询补充而非取代视口媒体查询。', '查询容器必须满足相应 containment 条件。'],
    problem: '解决"可复用组件如何根据实际可用空间独立响应"的问题。',
  },
  {
    id: 'SC_01', title: '变量、作用域与安全嵌套', navTitle: '变量与嵌套', category: '语言基础',
    path: '/sass/sc-1/variables-nesting', summary: '为课程卡提取编译期变量，并建立浅层、可维护的选择器结构。',
    demo: SC01VariablesNesting, code: SC01Code, language: 'scss',
    principle: 'Sass 变量在编译时参与计算并受词法作用域约束；嵌套表达选择器上下文，但输出仍是普通 CSS，层级越深通常特异性和结构耦合越高。',
    flow: ['提取编译期稳定的颜色和尺寸。', '让嵌套只表达组件直接关系。', '运行时主题值保留为 CSS 自定义属性。'],
    notes: ['Sass 变量不会像 CSS 变量一样在浏览器运行时更新。', '避免按完整 DOM 树逐层嵌套。'],
    problem: '解决"何时使用 Sass 变量，以及如何避免嵌套造成选择器失控"的问题。',
  },
  {
    id: 'SC_02', title: '模块系统：@use 与 @forward', navTitle: '模块系统', category: '模块复用',
    path: '/sass/sc-2/modules', summary: '拆分令牌和组件模块，以命名空间与公共 API 管理依赖。',
    demo: SC02Modules, code: SC02Code, language: 'scss',
    principle: '@use 只加载模块一次并通过命名空间访问成员；@forward 重新导出经过筛选或配置的成员，用于构造样式库公共 API。',
    flow: ['按职责拆分 partial 文件。', '消费方通过 @use 显式声明依赖。', '聚合入口用 @forward 控制公开成员。'],
    notes: ['@import 已弃用，新代码使用模块系统。', 'as * 会移除命名空间，只有在成员明确且无冲突时使用。'],
    problem: '解决"多文件样式如何避免全局污染、重复输出和隐式依赖"的问题。',
  },
  {
    id: 'SC_03', title: 'Mixin、参数与 @content', navTitle: 'Mixin', category: '模块复用',
    path: '/sass/sc-3/mixins', summary: '封装按钮尺寸规则，通过参数和内容块保留调用方扩展能力。',
    demo: SC03Mixins, code: SC03Code, language: 'scss',
    principle: '@mixin 定义可带位置参数、关键字参数和 @content 内容块的声明生成器，@include 在调用位置展开最终 CSS。',
    flow: ['确认复用目标是一组声明而不是一个值。', '为变化维度设计具名参数与默认值。', '需要调用方注入规则时提供 @content。'],
    notes: ['Mixin 每次 include 都会复制声明，需留意产物体积。', '简单复用优先普通类或 CSS 自定义属性。'],
    problem: '解决"可配置样式片段如何复用而不复制维护逻辑"的问题。',
  },
  {
    id: 'SC_04', title: '函数、控制流与内置模块', navTitle: '函数与控制流', category: '编程能力',
    path: '/sass/sc-4/functions', summary: '编写间距函数并用 sass:math、sass:color 完成可验证计算。',
    demo: SC04Functions, code: SC04Code, language: 'scss',
    principle: '@function 返回 Sass 值并可使用 @if、@each 等控制流；现代内置能力通过 sass:* 模块提供，名称与依赖来源更清晰。',
    flow: ['明确函数输入单位和返回类型。', '用 @error 拒绝非法参数。', '通过模块化内置函数执行数学或颜色转换。'],
    notes: ['函数不应产生 CSS 声明。', '除法使用 math.div，避免已弃用的斜杠除法语义。'],
    problem: '解决"设计计算如何集中、校验并在编译期复用"的问题。',
  },
  {
    id: 'SC_05', title: 'Map、List 与批量生成', navTitle: '集合与循环', category: '编程能力',
    path: '/sass/sc-5/collections', summary: '从状态颜色 Map 批量生成通知样式，掌握集合 API 与 @each。',
    demo: SC05Collections, code: SC05Code, language: 'scss',
    principle: 'Sass Map 表达键值配置，List 表达有序数据；@each 遍历集合生成规则，sass:map 与 sass:list 模块负责查询和转换。',
    flow: ['用 Map 建模有限且稳定的设计配置。', '通过 @each 解构键和值。', '对生成的选择器数量和最终体积做审查。'],
    notes: ['不要用循环生成大量实际不会使用的组合。', '业务数据不应进入 Sass，样式配置才适合集合。'],
    problem: '解决"有限设计变体如何由单一配置源批量生成"的问题。',
  },
  {
    id: 'SC_06', title: '父选择器、插值与选择器构造', navTitle: '选择器构造', category: '语言基础',
    path: '/sass/sc-6/selectors', summary: '使用 & 表达状态和 BEM 后缀，并理解插值的能力与维护成本。',
    demo: SC06Selectors, code: SC06Code, language: 'scss',
    principle: '& 表示当前外层复合选择器，可放入伪类、后缀和上下文位置；插值 #{} 把 Sass 表达式嵌入选择器、属性名或字符串。',
    flow: ['用 & 连接组件状态与修饰符。', '只在确需生成标识符时使用插值。', '检查编译后的选择器是否简短且可预测。'],
    notes: ['& 的结果取决于完整外层选择器。', '动态选择器会降低全文搜索、静态分析和重构能力。'],
    problem: '解决"如何在不重复组件类名的前提下构造状态与修饰选择器"的问题。',
  },
  {
    id: 'SC_07', title: '占位选择器与 @extend 边界', navTitle: '@extend', category: '模块复用',
    path: '/sass/sc-7/extend', summary: '用 %placeholder 合并同类通知选择器，并与 Mixin 的复制语义对比。',
    demo: SC07Extend, code: SC07Code, language: 'scss',
    principle: '%placeholder 自身不输出 CSS，只有被 @extend 时才参与选择器合并；extend 表达"这个选择器属于同一语义集合"，Mixin 则复制声明。',
    flow: ['确认扩展方确实是被扩展类型的一种。', '优先扩展占位选择器而非具体类。', '检查编译结果，避免跨模块形成巨大选择器列表。'],
    notes: ['@extend 不能跨 @media 上下文任意工作。', '只想共享声明时 Mixin 通常更直观。'],
    problem: '解决"何时用选择器合并复用样式，以及何时应该复制声明"的问题。',
  },
  {
    id: 'SC_08', title: '样式架构、构建与迁移', navTitle: '架构与构建', category: '工程架构',
    path: '/sass/sc-8/architecture', summary: '组织 abstracts、components、pages 和入口文件，并建立现代构建门禁。',
    demo: SC08Architecture, code: SC08Code, language: 'scss',
    principle: 'Sass 工程以模块依赖图而非隐式全局顺序组织：入口只装配模块，@forward 定义公共 API，编译器负责压缩、Source Map 与弃用诊断。',
    flow: ['按令牌、工具、组件和页面职责拆分。', '建立少量明确入口与单向依赖。', '在 CI 编译并把弃用警告纳入迁移计划。'],
    notes: ['不要照搬目录模板，规模小的项目保持扁平更好。', '迁移旧项目时先运行 Sass Migrator，再逐步收紧模块边界。'],
    problem: '解决"样式规模增长后如何保持依赖清晰、产物可控并持续升级"的问题。',
  },
  {
    id: 'TW_09', title: 'v4 安装与构建工具集成', navTitle: '安装与集成', category: '工程集成',
    path: '/tailwind-css/tw-9/installation', summary: '比较 Vite、PostCSS 和 CLI 三种接入路径，建立最小 CSS 入口。',
    demo: TW09Installation, code: TW09Code, language: 'css',
    principle: 'Tailwind v4 由核心包和构建适配器协作：CSS 入口导入 tailwindcss，Vite 插件、PostCSS 插件或 CLI 负责扫描候选类并生成最终 CSS。',
    flow: ['按现有构建链选择唯一适配器。', '在全局样式入口导入 Tailwind。', '验证开发热更新与生产压缩都读取正确源文件。'],
    notes: ['Vite 项目优先使用官方 Vite 插件。', '不要同时让多个适配器处理同一入口。'],
    problem: '解决"Tailwind v4 应如何接入不同工程，并避免重复编译"的问题。',
  },
  {
    id: 'TW_10', title: '排版层级、行高与可读行长', navTitle: '排版系统', category: '视觉基础',
    path: '/tailwind-css/tw-10/typography', summary: '用中文课程正文组合字号、行高、字重、字距和最大行长。',
    demo: TW10Typography, code: TW10Code, language: 'xml',
    principle: '排版工具类分别控制 font-size、line-height、font-weight、letter-spacing 和文本宽度；视觉层级来自这些维度的稳定组合。',
    flow: ['建立正文基准字号与行高。', '按信息层级定义标题尺度。', '限制长文行宽并分别检查中英文效果。'],
    notes: ['中文正文通常需要更宽松行高。', '大标题也要测试窄屏换行与超长文本。'],
    problem: '解决"如何用工具类构建清晰、稳定且适合中文阅读的排版体系"的问题。',
  },
  {
    id: 'TW_11', title: '尺寸约束与间距比例尺', navTitle: '尺寸与间距', category: '视觉基础',
    path: '/tailwind-css/tw-11/sizing-spacing', summary: '区分 width、min/max、size、gap 与 space，并形成一致视觉节奏。',
    demo: TW11SizingSpacing, code: TW11Code, language: 'xml',
    principle: '尺寸工具描述固定、流体与边界约束；p/m 作用于盒模型，gap 作用于布局轨道，space 在相邻子元素间添加间距。',
    flow: ['先决定容器是固定、流体还是受最大宽度约束。', '用间距尺度建立节奏。', '在长内容与窄屏下验证最小尺寸和溢出。'],
    notes: ['组件内部优先 gap，减少相邻 margin 规则。', 'min-w-0 常用于允许 Flex/Grid 子项正确收缩。'],
    problem: '解决"页面尺寸与留白如何形成系统，而不是散落魔法数字"的问题。',
  },
  {
    id: 'TW_12', title: '边框、轮廓、Ring 与阴影', navTitle: '边界与阴影', category: '视觉基础',
    path: '/tailwind-css/tw-12/borders-effects', summary: '为卡片层级和键盘焦点选择正确的视觉边界工具。',
    demo: TW12BordersEffects, code: TW12Code, language: 'xml',
    principle: 'border 参与盒模型，outline 和 ring 可在不占布局空间时强调焦点，box-shadow 表达层级；透明度修饰符能降低彩色阴影的视觉噪声。',
    flow: ['用边框建立静态边界。', '以 focus-visible 提供高对比焦点。', '仅在需要表达浮层高度时添加阴影。'],
    notes: ['焦点不能只靠低对比阴影。', '过多阴影层级会削弱界面信息结构。'],
    problem: '解决"视觉分层、边界和键盘焦点应分别使用什么效果"的问题。',
  },
  {
    id: 'TW_13', title: '过渡、动画与减少动态效果', navTitle: '动画与动效', category: '交互与可访问性',
    path: '/tailwind-css/tw-13/motion', summary: '用 transition 与 motion-safe/motion-reduce 制作克制、可访问的反馈。',
    demo: TW13Motion, code: TW13Code, language: 'xml',
    principle: 'transition 工具定义参与属性、时长和缓动，animate 工具应用关键帧；运动偏好变体根据 prefers-reduced-motion 提供替代。',
    flow: ['明确动效要解释的状态变化。', '优先动画 transform 与 opacity。', '为减少动态偏好禁用或简化非必要运动。'],
    notes: ['不要使用 transition-all 掩盖属性边界。', '持续闪烁和大幅位移可能引发不适。'],
    problem: '解决"如何提供有意义的交互反馈，同时控制性能与运动可访问性"的问题。',
  },
  {
    id: 'TW_14', title: '表单状态与无障碍语义', navTitle: '表单样式', category: '交互与可访问性',
    path: '/tailwind-css/tw-14/forms', summary: '组合输入框状态，并用原生语义连接标签、帮助和错误信息。',
    demo: TW14Forms, code: TW14Code, language: 'xml',
    principle: '表单变体可响应 focus、invalid、disabled 和 aria/data 属性，但工具类只负责外观；可访问名称、描述和状态仍由语义 HTML 提供。',
    flow: ['使用 label 和正确输入类型。', '把帮助或错误信息通过 aria-describedby 关联。', '设计焦点、无效、禁用和只读状态。'],
    notes: ['placeholder 不能代替 label。', '错误不能只用颜色表达。'],
    problem: '解决"表单如何同时具备一致视觉状态、键盘体验和辅助技术语义"的问题。',
  },
  {
    id: 'TW_15', title: '自定义工具与 Cascade Layers', navTitle: '自定义扩展', category: '扩展机制',
    path: '/tailwind-css/tw-15/custom-utilities', summary: '用 @utility 和 @layer 扩展少量项目能力，并继续支持变体。',
    demo: TW15CustomUtilities, code: TW15Code, language: 'css',
    principle: '@utility 注册静态或函数式工具并接入变体系统；@layer base、components、utilities 把自定义规则放入明确级联层级。',
    flow: ['先确认内置工具与任意值无法清晰表达。', '把单用途能力注册为 @utility。', '按默认值、组件或工具选择正确 layer。'],
    notes: ['自定义工具应保持单一职责。', '复杂业务组件仍应封装为 Vue 组件。'],
    problem: '解决"项目特有 CSS 能力如何融入 Tailwind，而不建立平行样式体系"的问题。',
  },
  {
    id: 'TW_16', title: '源检测、产物优化与生产排查', navTitle: '生产优化', category: '工程集成',
    path: '/tailwind-css/tw-16/production', summary: '控制自动源检测与 @source，定位缺失类名和异常 CSS 体积。',
    demo: TW16Production, code: TW16Code, language: 'css',
    principle: 'Tailwind 从源码文本检测完整候选类并按需生成 CSS；@source 可显式注册、排除或内联候选，生产构建再负责压缩和缓存。',
    flow: ['确认模板文件位于自动检测范围。', '外部包用 @source 注册明确路径。', '分析产物并修复动态拼接或过宽内联来源。'],
    notes: ['动态类名应映射为完整静态字符串。', '大范围 safelist 会掩盖架构问题并膨胀产物。'],
    problem: '解决"生产环境类名缺失或 CSS 过大时如何系统定位"的问题。',
  },
  {
    id: 'TW_17', title: 'Grid 网格布局与 Grid Template', navTitle: 'Grid 布局', category: '布局与栅格',
    path: '/tailwind-css/tw-17/grid-layout', summary: '通过 grid-cols、grid-rows、gap 等工具类快速构建二维网格布局，配合 col-span、row-span 实现跨列跨行。',
    demo: TW17GridLayout, code: TW17Code, language: 'vue',
    principle: 'Tailwind 的 Grid 布局通过 grid-cols、grid-rows、gap 等工具类快速构建二维网格布局，配合 col-span、row-span 实现跨列跨行，比写 CSS Grid 更简洁高效。',
    flow: ['使用 grid 类启用 Grid 布局', '用 grid-cols-n 定义列数，gap 设置间距', '用 col-span-n 控制子元素跨列，place-items 对齐'],
    notes: ['grid-cols-12 是最常用的 12 栅格系统', '响应式断点前缀可在不同尺寸下切换列数', '配合 place-content/place-items 快速对齐'],
    problem: '解决复杂二维布局手写 CSS Grid 繁琐、响应式切换困难的问题。',
  },
  {
    id: 'TW_18', title: 'Flexbox 与 Grid 布局对比选择', navTitle: 'Flex vs Grid', category: '布局与栅格',
    path: '/tailwind-css/tw-18/flex-grid', summary: '理解 Flexbox 与 Grid 的适用场景，一维布局用 Flex，二维布局用 Grid，两者可组合使用。',
    demo: TW18FlexGrid, code: TW18Code, language: 'vue',
    principle: 'Flexbox 适合一维布局（行或列），Grid 适合二维布局（行和列同时控制），两者可以组合使用，根据布局需求选择最合适的工具。',
    flow: ['一维内容流优先用 Flex（导航、列表、卡片行）', '二维网格布局用 Grid（仪表板、图片墙、表单布局）', 'Flex 做容器内对齐，Grid 做整体骨架，组合使用'],
    notes: ['Flex 内容优先，Grid 布局优先', '两者不互斥，Grid 容器内可以有 Flex 子项', '选择标准：一维 vs 二维、内容驱动 vs 布局驱动'],
    problem: '解决布局选择困难、不知道何时用 Flex 何时用 Grid 的问题。',
  },
  {
    id: 'TW_19', title: '交互状态与组(Group)状态', navTitle: '交互状态', category: '响应与状态',
    path: '/tailwind-css/tw-19/interactivity', summary: '使用 hover、focus、active 等状态变体，配合 group 类实现父元素状态触发子元素样式变化。',
    demo: TW19Interactivity, code: TW19Code, language: 'vue',
    principle: 'Tailwind 通过 hover、focus、active 等状态变体描述元素交互状态，group 类可以让父元素状态触发子元素样式变化，适合卡片悬停、菜单展开等场景。',
    flow: ['使用 hover:bg-* 定义悬停样式', '用 focus:ring-* 定义聚焦状态', '父元素加 group，子元素用 group-hover: 触发'],
    notes: ['状态变体可以叠加响应式前缀', 'group 支持嵌套，但要注意层级', 'peer 类可以实现兄弟元素状态联动'],
    problem: '解决交互状态 CSS 重复书写、父子联动样式复杂的问题。',
  },
  {
    id: 'TW_20', title: '变换、过渡与动画', navTitle: '变换动画', category: '动效与过渡',
    path: '/tailwind-css/tw-20/transform', summary: '使用 transform、transition 和 animate 工具类，配合状态变体实现丰富的交互动效。',
    demo: TW20Transform, code: TW20Code, language: 'vue',
    principle: 'Tailwind 提供 transform（缩放、旋转、位移、倾斜）、transition（过渡属性）和 animate（关键帧动画）工具类，配合状态变体实现丰富的交互动效。',
    flow: ['使用 scale/rotate/translate/skew 工具类定义变换', '用 transition-all 或 transition-* 控制过渡属性', 'hover:scale-105 配合 transition 实现悬停放大效果'],
    notes: ['动画性能优先使用 transform 和 opacity', 'transition 配合 duration/ease 控制过渡曲线', 'animate 内置常用动画如 spin、ping、bounce、pulse'],
    problem: '解决手写动画 CSS 繁琐、过渡效果不统一的问题。',
  },
  {
    id: 'TW_21', title: '滤镜与混合模式', navTitle: '滤镜混合', category: '视觉效果',
    path: '/tailwind-css/tw-21/filters', summary: '使用 CSS filter 和 backdrop-filter 工具类，实现模糊、亮度、对比度等滤镜效果与毛玻璃背景。',
    demo: TW21Filters, code: TW21Code, language: 'vue',
    principle: 'Tailwind 提供 CSS filter 和 backdrop-filter 工具类，支持模糊、亮度、对比度、饱和度等滤镜效果，mix-blend-* 实现元素混合模式。',
    flow: ['使用 blur-*、brightness-* 等工具类应用滤镜', 'backdrop-blur-* 实现毛玻璃背景效果', 'mix-blend-* 控制元素与下层内容的混合'],
    notes: ['滤镜可以组合使用，空格分隔', 'backdrop-filter 影响元素后面的内容', '合理使用可以提升视觉层次感'],
    problem: '解决图片处理、毛玻璃效果、视觉特效需要额外图片资源的问题。',
  },
  {
    id: 'TW_22', title: 'SVG 图标与当前颜色', navTitle: 'SVG 图标', category: '视觉效果',
    path: '/tailwind-css/tw-22/svg-icons', summary: '通过 currentColor 让 SVG 继承父元素文字颜色，配合 text-* 工具类统一控制颜色和大小。',
    demo: TW22SvgIcons, code: TW22Code, language: 'vue',
    principle: 'Tailwind 配合 SVG 使用时，通过 currentColor 让 SVG 继承父元素文字颜色，实现图标颜色与文字一致，配合 text-* 工具类统一控制颜色和大小。',
    flow: ['SVG 中 fill 或 stroke 设置为 currentColor', '用 text-* 工具类同时控制文字和图标颜色', '用 w-* 和 h-* 控制图标尺寸'],
    notes: ['currentColor 让图标颜色跟随上下文', '推荐使用 stroke 的线性图标更灵活', '可以配合 Heroicons 等图标库直接使用'],
    problem: '解决图标颜色与文字不一致、图标库体积大的问题。',
  },
  {
    id: 'TW_23', title: '插件系统与自定义插件开发', navTitle: '插件系统', category: '工程与定制',
    path: '/tailwind-css/tw-23/plugins', summary: '使用官方插件扩展能力，以及通过 plugin() API 开发自定义工具类和组件。',
    demo: TW23Plugins, code: TW23Code, language: 'vue',
    principle: 'Tailwind 插件可以扩展工具类、组件、基础样式和主题，官方提供 typography、forms、aspect-ratio 等插件，也可以编写自定义插件满足项目特定需求。',
    flow: ['在 tailwind.config.js 的 plugins 数组中添加插件', '使用 plugin() API 添加自定义工具类或组件', '用 matchUtilities 生成动态值的工具类'],
    notes: ['官方插件覆盖大多数常见需求', '自定义插件优先考虑能否用 CSS 变量或 theme 扩展解决', '插件发布为 npm 包可以在多项目复用'],
    problem: '解决内置工具类不够用、重复模式需要抽象复用的问题。',
  },
  {
    id: 'TW_24', title: '主题预设与设计系统配置', navTitle: '主题预设', category: '工程与定制',
    path: '/tailwind-css/tw-24/preset', summary: '通过 presets 机制将设计系统配置抽成可复用的预设包，多项目共享统一的视觉规范。',
    demo: TW24Preset, code: TW24Code, language: 'vue',
    principle: 'Tailwind 的 presets 机制可以将设计系统配置抽成可复用的预设包，包含颜色、字号、间距、断点等设计令牌，多项目共享统一的视觉规范。',
    flow: ['创建预设文件，导出 theme、plugins 等配置', '在项目 tailwind.config.js 中通过 presets 引用', '项目可以覆盖或扩展预设中的配置'],
    notes: ['预设可以嵌套引用其他预设', '设计令牌应该与设计师共同定义', '版本化的预设包便于设计系统迭代'],
    problem: '解决多项目设计不统一、样式配置重复维护的问题。',
  },
  {
    id: 'SC_09', title: '值类型、单位与编译期计算', navTitle: '值与单位', category: '语言基础',
    path: '/sass/sc-9/values-units', summary: '理解数字、字符串、颜色、List、Map 与单位代数的行为。',
    demo: SC09ValuesUnits, code: SC09Code, language: 'scss',
    principle: 'Sass 拥有带类型的值系统；数字携带分子和分母单位，兼容单位可转换，不兼容维度会在编译期报错。',
    flow: ['识别表达式中的 Sass 值类型。', '在计算前检查单位维度。', '用 meta.type-of 等函数诊断边界输入。'],
    notes: ['0 也可能携带单位。', '不要用插值绕过本应失败的单位检查。'],
    problem: '解决"Sass 计算为什么有时能换算单位、有时会报维度错误"的问题。',
  },
  {
    id: 'SC_10', title: 'sass:math 与单位安全计算', navTitle: '数学模块', category: '内置模块',
    path: '/sass/sc-10/math', summary: '计算网格列宽，掌握 math.div、舍入和单位兼容边界。',
    demo: SC10Math, code: SC10Code, language: 'scss',
    principle: 'sass:math 提供明确除法、幂、舍入、最值和单位检查；Sass 可处理编译期已知量，浏览器上下文相关计算应保留 CSS calc。',
    flow: ['声明输入单位契约。', '用 math.div 执行明确除法。', '无法在编译期确定的百分比关系交给 calc。'],
    notes: ['斜杠除法已被弃用。', '浮点结果需要依据 CSS 需求决定是否舍入。'],
    problem: '解决"如何进行可靠的设计数学计算，并保留浏览器应负责的部分"的问题。',
  },
  {
    id: 'SC_11', title: 'sass:color 与配色派生', navTitle: '颜色模块', category: '内置模块',
    path: '/sass/sc-11/color', summary: '从品牌色派生悬浮和柔和背景，并区分 adjust、scale 与 mix。',
    demo: SC11Color, code: SC11Code, language: 'scss',
    principle: 'sass:color 在明确颜色空间中读取和转换通道；adjust 增加固定通道量，scale 按剩余范围缩放，mix 按权重混合颜色。',
    flow: ['选定来源颜色与颜色空间。', '按设计意图选择调整或缩放。', '对派生结果执行实际对比度验证。'],
    notes: ['数学派生不能保证视觉可访问性。', '优先现代模块 API，避免已弃用全局颜色函数。'],
    problem: '解决"如何从有限品牌令牌可靠派生状态颜色，并理解不同函数语义"的问题。',
  },
  {
    id: 'SC_12', title: '模块配置、!default 与 with', navTitle: '模块配置', category: '模块复用',
    path: '/sass/sc-12/configuration', summary: '让样式库暴露有限配置项，并在首次 @use 时完成定制。',
    demo: SC12Configuration, code: SC12Code, language: 'scss',
    principle: '模块可用 !default 声明可配置顶层变量，调用方在首次 @use 的 with 子句传值；模块只加载一次，因此配置必须唯一且先于其他加载。',
    flow: ['只公开确有稳定契约的变量。', '为配置提供合理默认值。', '在应用入口首次加载时统一传入配置。'],
    notes: ['不要把所有内部变量都做成配置项。', '复杂配置可用 Mixin 替代 with 的单次加载限制。'],
    problem: '解决"可复用 Sass 库如何允许主题定制又保护内部实现"的问题。',
  },
  {
    id: 'SC_13', title: '@at-root 与嵌套上下文控制', navTitle: '@at-root', category: '选择器进阶',
    path: '/sass/sc-13/at-root', summary: '从生成器或深层上下文中输出根级规则，并精确保留 at-rule。',
    demo: SC13AtRoot, code: SC13Code, language: 'scss',
    principle: '@at-root 默认移除普通选择器上下文，并可用 with/without 查询控制保留 media、supports 等 at-rule，适合高级选择器生成。',
    flow: ['确认输出规则不应继承当前选择器。', '决定需要保留的 at-rule 上下文。', '检查编译结果是否产生预期根级选择器。'],
    notes: ['不要用 @at-root 掩盖糟糕的深层架构。', '涉及复杂选择器时可配合 sass:selector 模块。'],
    problem: '解决"嵌套内部如何有控制地生成外层或根级规则"的问题。',
  },
  {
    id: 'SC_14', title: '媒体查询冒泡与响应式 Mixin', navTitle: '媒体查询', category: '选择器进阶',
    path: '/sass/sc-14/media-queries', summary: '在组件附近声明响应式覆盖，并理解 Sass 的冒泡与查询合并。',
    demo: SC14MediaQueries, code: SC14Code, language: 'scss',
    principle: 'media、supports 等 at-rule 在嵌套时会冒泡到可输出位置，Sass 还会合并可组合的外层查询；Mixin 可统一断点契约。',
    flow: ['以内容临界点定义少量断点。', '让组件的覆盖规则靠近基础规则。', '审查编译后查询是否重复或组合爆炸。'],
    notes: ['断点 Mixin 不应隐藏复杂业务判断。', '现代范围语法可直接表达 width >= 值。'],
    problem: '解决"组件响应式样式如何共置，同时保持最终媒体查询清晰"的问题。',
  },
  {
    id: 'SC_15', title: 'CSS 自定义属性与 Sass 插值', navTitle: 'CSS 变量协作', category: 'CSS 协作',
    path: '/sass/sc-15/custom-properties', summary: '把编译期令牌写入运行时 CSS 变量，并正确保留字符串。',
    demo: SC15CustomProperties, code: SC15Code, language: 'scss',
    principle: 'Sass 值写入自定义属性时需要插值，因为属性值可能是任意 CSS 文本；meta.inspect 可在插值时保留带引号字符串表示。',
    flow: ['区分编译期常量与运行时主题值。', '用插值输出初始自定义属性。', '浏览器端通过级联、继承或脚本覆盖变量。'],
    notes: ['插值通常会移除字符串引号。', '运行时切换不应重新依赖 Sass 编译。'],
    problem: '解决"Sass 令牌如何安全进入浏览器可切换的 CSS 变量体系"的问题。',
  },
  {
    id: 'SC_16', title: '诊断指令、弃用与自动迁移', navTitle: '诊断与迁移', category: '工程架构',
    path: '/sass/sc-16/diagnostics', summary: '使用 @debug、@warn、@error 建立反馈，并依据弃用信息迁移旧代码。',
    demo: SC16Diagnostics, code: SC16Code, language: 'scss',
    principle: '@debug 输出开发值，@warn 报告可继续问题，@error 中断非法构建；编译器弃用警告与 Sass Migrator 共同支撑模块和语法升级。',
    flow: ['在公共函数与 Mixin 边界验证参数。', '保留带调用栈的弃用警告。', '用 Migrator 机械迁移后审查模块 API 和产物。'],
    notes: ['不要在正常构建中制造高噪声 debug。', '自动迁移后仍需测试视觉回归与 CSS 体积。'],
    problem: '解决"Sass 代码如何在错误时快速失败，并持续摆脱已弃用语法"的问题。',
  },
  {
    id: 'SC_17', title: '插值语法与动态选择器', navTitle: '插值语法', category: '进阶语法',
    path: '/sass/sc-17/interpolation', summary: '使用 #{} 插值语法在选择器、属性名、字符串等位置插入变量值，实现动态生成的 CSS 规则。',
    demo: SC17Interpolation, code: SC17Code, language: 'vue',
    principle: 'Sass 的 #{} 插值语法可以在选择器、属性名、字符串、URL 等位置插入变量值，实现动态生成的 CSS 规则，常用于主题切换和批量生成类名。',
    flow: ['使用 #{$variable} 在选择器或属性中插入变量', '配合 @each 循环批量生成一系列相似的类', '插值在 mixin 中可以根据参数动态生成选择器'],
    notes: ['插值结果不会进行计算，是纯文本替换', '属性名中的插值要放在冒号前面', '大多数情况用变量就够了，不要过度使用插值'],
    problem: '解决选择器和属性名不能使用变量、重复模式难以抽象的问题。',
  },
  {
    id: 'SC_18', title: '占位符选择器与 @extend 进阶', navTitle: '占位符选择器', category: '进阶语法',
    path: '/sass/sc-18/placeholders', summary: '使用 % 前缀的占位符选择器配合 @extend 继承，避免产生无用的 CSS 规则，让样式复用更干净。',
    demo: SC18Placeholders, code: SC18Code, language: 'vue',
    principle: '占位符选择器（%前缀）是一种不会被编译输出的选择器，专门用于 @extend 继承，比普通选择器的 @extend 更干净，避免产生无用的 CSS 规则。',
    flow: ['用 %placeholder-name 定义占位符选择器', '在需要的选择器中使用 @extend %placeholder-name', '编译后只有使用了 extend 的选择器会输出'],
    notes: ['占位符不会单独出现在 CSS 输出中', '比 mixin 更适合静态样式的复用', '过度使用 @extend 会导致选择器膨胀'],
    problem: '解决 @extend 产生多余选择器、样式复用不够干净的问题。',
  },
  {
    id: 'SC_19', title: '错误处理与调试指令', navTitle: '调试指令', category: '进阶语法',
    path: '/sass/sc-19/error-handling', summary: '使用 @debug、@warn、@error 三个调试指令输出日志、警告和抛出错误，帮助在 mixin 和函数中校验参数和排查问题。',
    demo: SC19ErrorHandling, code: SC19Code, language: 'vue',
    principle: 'Sass 提供 @debug、@warn、@error 三个调试指令，分别用于输出日志、警告和抛出错误，帮助在 mixin 和函数中校验参数和排查问题。',
    flow: ['@debug 在编译控制台输出调试信息', '@warn 输出警告但不中断编译', '@error 抛出错误并中断编译，用于参数校验'],
    notes: ['公共 mixin 和函数应该加参数校验', '@warn 和 @error 可以帮助使用者正确使用 API', '生产构建时注意过滤调试输出'],
    problem: '解决 Sass 代码调试困难、参数错误不易发现的问题。',
  },
  {
    id: 'SC_20', title: '@content 与 Mixin 内容块', navTitle: '内容块', category: '进阶语法',
    path: '/sass/sc-20/content-blocks', summary: '使用 @content 指令在 mixin 中预留内容位置，调用时通过 {} 传入额外样式内容，让 mixin 更灵活。',
    demo: SC20ContentBlocks, code: SC20Code, language: 'vue',
    principle: '@content 指令可以在 mixin 中预留内容位置，调用时通过 {} 传入额外的样式内容，让 mixin 更灵活，适合媒体查询封装和主题定制。',
    flow: ['在 @mixin 中使用 @content 标记内容插入点', '调用 mixin 时在大括号中写入额外样式', '额外样式会替换 @content 的位置输出'],
    notes: ['@content 可以接收参数（@content(...)）', '适合封装媒体查询、作用域上下文等模式', '比单纯的属性 mixin 更灵活'],
    problem: '解决 mixin 只能插入固定属性、无法灵活扩展内容的问题。',
  },
  {
    id: 'SC_21', title: '控制流：@if/@for/@each/@while', navTitle: '控制流语句', category: '进阶语法',
    path: '/sass/sc-21/control-flow', summary: '使用 @if 条件判断、@for 数字循环、@each 列表/Map 遍历、@while 条件循环四种控制流批量生成样式。',
    demo: SC21ControlFlow, code: SC21Code, language: 'vue',
    principle: 'Sass 提供 @if 条件判断、@for 数字循环、@each 列表/Map 遍历、@while 条件循环四种控制流，用于批量生成样式和条件性输出。',
    flow: ['@if/@else 根据条件输出不同样式', '@for $i from 1 through n 生成序号类名', '@each 遍历列表或 Map 批量生成规则'],
    notes: ['优先用 @each，可读性比 @for 好', '@while 用得少，通常 @for/@each 可以替代', '循环不要嵌套过深，否则编译变慢且难维护'],
    problem: '解决相似样式重复书写、批量生成规则效率低的问题。',
  },
  {
    id: 'SC_22', title: 'Map 数据结构与函数', navTitle: 'Map 数据结构', category: '数据与函数',
    path: '/sass/sc-22/map-functions', summary: '使用 Sass Map 键值对数据结构，配合 map-get、map-merge、map-keys 等函数管理设计令牌、色阶系统等结构化数据。',
    demo: SC22MapFunctions, code: SC22Code, language: 'vue',
    principle: 'Sass Map 是键值对数据结构，类似 JavaScript 对象，配合 map-get、map-merge、map-keys 等函数可以管理设计令牌、色阶系统等结构化数据。',
    flow: ['用 (key1: value1, key2: value2) 语法定义 Map', 'map-get($map, $key) 获取值，map-keys 获取所有键', 'map-merge 合并两个 Map，适合主题扩展'],
    notes: ['Map 适合组织颜色、字号等设计令牌', '嵌套 Map 可以表示层级结构', '用 @each 遍历 Map 批量生成样式'],
    problem: '解决设计变量分散、难以结构化管理和遍历的问题。',
  },
  {
    id: 'SC_23', title: 'List 数据结构与函数', navTitle: 'List 数据结构', category: '数据与函数',
    path: '/sass/sc-23/list-functions', summary: '使用 Sass List 有序序列，配合 nth、length、append、join、index 等函数操作，管理间距序列、断点列表、字体栈等有序数据。',
    demo: SC23ListFunctions, code: SC23Code, language: 'vue',
    principle: 'Sass List 是有序序列，用空格或逗号分隔，配合 nth、length、append、join、index 等函数操作，适合管理间距序列、断点列表、字体栈等有序数据。',
    flow: ['用 nth($list, $n) 按索引取值', 'length($list) 获取长度，append 添加元素', 'join($list1, $list2) 合并两个列表'],
    notes: ['List 索引从 1 开始，不是 0', '空格分隔和逗号分隔都是 List', '比 Map 轻量，适合简单的有序集合'],
    problem: '解决有序数据序列难以操作、重复索引的问题。',
  },
  {
    id: 'SC_24', title: '现代模块系统与 @use/@forward', navTitle: '现代模块系统', category: '工程架构',
    path: '/sass/sc-24/module-system', summary: '使用 Sass 现代模块系统 @use 替代 @import，避免命名冲突和重复加载，配合 @forward 转发成员构建清晰的分层样式架构。',
    demo: SC24ModuleSystem, code: SC24Code, language: 'vue',
    principle: 'Sass 现代模块系统用 @use 替代 @import，避免命名冲突和重复加载，配合 @forward 转发成员，可以构建清晰的分层样式架构。',
    flow: ["用 @use 'path' 加载模块，默认使用命名空间", "@use 'path' as * 可以取消命名空间", '@forward 转发其他模块的成员，构建入口文件'],
    notes: ['@import 已被官方标记为弃用', '模块只会加载一次，不会重复', '私有成员用 - 或 _ 前缀，外部不可访问'],
    problem: '解决 @import 全局污染、命名冲突、加载冗余的问题。',
  },

  /***** CSS 核心知识 *****/
  {
    id: 'C_01', title: '选择器详解', navTitle: '选择器', category: '选择器',
    path: '/css/c-1/selectors', summary: '理解通配、类型、类、ID、属性、伪类、伪元素与组合器的匹配规则与优先级。',
    demo: C01Selectors, code: C01Code, language: 'vue',
    principle: 'CSS 选择器按优先级（内联 > ID > 类 > 元素 > 通配）决定哪条规则生效；组合器可表达父子、兄弟等关系。',
    flow: ['用课程标签筛选理解各类选择器。', '观察不同选择器的生效范围。', '理解优先级计算规则。'],
    notes: ['!important 会破坏优先级规则，应尽量避免。', '选择器过深会影响性能与可维护性。'],
    problem: '解决"如何精准选中目标元素，并理解样式覆盖顺序"的问题。',
  },
  {
    id: 'C_02', title: '盒模型与尺寸计算', navTitle: '盒模型', category: '基础模型',
    path: '/css/c-2/box-model', summary: '理解 content-box 与 border-box 的尺寸差异，以及外边距折叠现象。',
    demo: C02BoxModel, code: C02Code, language: 'vue',
    principle: 'box-sizing 决定 width/height 是否包含 padding 和 border；border-box 更符合直觉。外边距折叠发生在垂直相邻的块级元素之间。',
    flow: ['切换 box-sizing 观察总宽度变化。', '查看尺寸计算表。', '切换外边距折叠演示。'],
    notes: ['全局设置 * { box-sizing: border-box } 是常见做法。', '外边距折叠只发生在垂直方向，且只影响普通文档流。'],
    problem: '解决"设置 width: 200px 但元素实际更宽，以及相邻元素间距不符合预期"的问题。',
  },
  {
    id: 'C_03', title: 'Flexbox 弹性布局', navTitle: 'Flexbox', category: '布局系统',
    path: '/css/c-3/flexbox', summary: '用课程卡片列表理解主轴、交叉轴对齐与弹性伸缩。',
    demo: C03Flexbox, code: C03Code, language: 'vue',
    principle: 'Flexbox 是一维布局模型：主轴由 flex-direction 决定，交叉轴垂直于主轴；justify-content 控制主轴对齐，align-items 控制交叉轴对齐。',
    flow: ['调整主轴对齐方式。', '调整交叉轴对齐方式。', '观察 order 属性对排列顺序的影响。'],
    notes: ['Flexbox 适合组件内或一维排列。', 'flex: 1 是 flex-grow:1 flex-shrink:1 flex-basis:0% 的简写。'],
    problem: '解决"如何让子元素在主轴/交叉轴上灵活对齐，并处理空间分配"的问题。',
  },
  {
    id: 'C_04', title: 'Grid 二维网格布局', navTitle: 'Grid', category: '布局系统',
    path: '/css/c-4/grid', summary: '用课程仪表盘理解轨道定义、区域命名与网格线放置。',
    demo: C04Grid, code: C04Code, language: 'vue',
    principle: 'Grid 是二维布局模型：通过 grid-template-columns/rows 定义轨道，通过 grid-area 或 grid-column/row 放置项目；还支持 grid-template-areas 语义化布局。',
    flow: ['切换列轨道定义方式。', '启用 grid-area 区域布局。', '观察网格线编号规律。'],
    notes: ['Grid 适合整体页面布局；Flexbox 适合一维排列。', 'fr 单位表示可用空间的分配比例。'],
    problem: '解决"如何同时控制行和列的布局，并用语义化方式描述页面结构"的问题。',
  },
  {
    id: 'C_05', title: '定位机制', navTitle: '定位', category: '定位与布局',
    path: '/css/c-5/position', summary: '理解 static / relative / absolute / fixed / sticky 的偏移基准与文档流行为。',
    demo: C05Position, code: C05Code, language: 'vue',
    principle: 'position 决定元素的定位参考系：static（默认）、relative（相对原位置）、absolute（相对最近定位祖先）、fixed（相对视口）、sticky（滚动时切换 fixed）。',
    flow: ['切换五种定位值。', '观察是否脱离文档流。', '理解 sticky 的阈值触发条件。'],
    notes: ['absolute 定位需要最近的非 static 祖先作为参考。', 'sticky 必须指定 top/bottom/left/right 才会生效。'],
    problem: '解决"元素应该相对谁偏移，以及是否应脱离正常文档流"的问题。',
  },
  {
    id: 'C_06', title: '层叠与继承', navTitle: '层叠', category: '层叠与继承',
    path: '/css/c-6/cascade', summary: '理解 CSS 层叠优先级（!important > 内联 > ID > 类 > 元素）与属性继承规则。',
    demo: C06Cascade, code: C06Code, language: 'vue',
    principle: '层叠通过来源（作者/用户/浏览器）、重要性（!important）、专用性（#id > .class > 元素）和出现顺序决定最终值；继承让某些属性自动从父元素获取值。',
    flow: ['观察不同专用性选择器的覆盖关系。', '理解 !important 的破坏力。', '区分可继承与不可继承属性。'],
    notes: ['专用性计算：内联 1000，ID 100，类 10，元素 1。', 'inherit、initial、unset、revert 可精细控制继承行为。'],
    problem: '解决"为什么写的样式不生效（被覆盖），以及如何正确控制优先级"的问题。',
  },
  {
    id: 'C_07', title: 'CSS 变量（自定义属性）', navTitle: 'CSS 变量', category: '变量与主题',
    path: '/css/c-7/variables', summary: '用主题切换理解自定义属性的声明、读取、继承与动态更新。',
    demo: C07Variables, code: C07Code, language: 'vue',
    principle: '自定义属性以 --name 声明，用 var(--name, fallback) 读取；它们可继承，可在运行时通过 JS 修改，是实现主题切换的核心机制。',
    flow: ['切换暖色/冷色主题观察变量变化。', '拖动滑块改变间距变量。', '理解 fallback 的作用。'],
    notes: ['自定义属性有继承性，与普通 CSS 属性不同。', ':root 上声明的变量全局可用，组件内声明则局部覆盖。'],
    problem: '解决"如何在运行时动态切换主题，并让多个属性共享同一设计令牌"的问题。',
  },
  {
    id: 'C_08', title: '过渡与动画', navTitle: '过渡动画', category: '动画与过渡',
    path: '/css/c-8/transition-animation', summary: '用课程卡片交互动效理解 transition 与 animation 的差异与适用场景。',
    demo: C08Transition, code: C08Code, language: 'vue',
    principle: 'transition 需要状态变化触发，适合简单过渡；animation 通过 @keyframes 定义关键帧，可自动播放、循环、暂停，适合复杂动画。',
    flow: ['对比 transition 与 animation 的触发方式。', '调整动画时长观察效果。', '理解 @keyframes 的关键帧定义。'],
    notes: ['优先使用 transform 和 opacity 做动画（由 GPU 合成，不触发重排）。', 'animation-fill-mode 可控制动画前后的样式保持。'],
    problem: '解决"哪种动画方式更适合当前交互场景，以及如何避免动画性能问题"的问题。',
  },
  {
    id: 'C_09', title: '媒体查询与响应式', navTitle: '媒体查询', category: '响应式',
    path: '/css/c-9/media-query', summary: '用课程卡片列表理解移动优先（mobile-first）的断点与媒体查询写法。',
    demo: C09MediaQuery, code: C09Code, language: 'vue',
    principle: '媒体查询通过 @media 根据视口尺寸、设备特性等条件应用不同样式；移动优先指先写小屏样式，再用 min-width 逐步增强大屏。',
    flow: ['拖动滑块模拟不同视口宽度。', '观察课程卡片列数的响应式变化。', '理解移动优先的断点编写顺序。'],
    notes: ['移动优先的断点用 min-width（从小屏开始写）。', 'prefers-color-scheme、prefers-reduced-motion 等媒体特性可实现无障碍适配。'],
    problem: '解决"同一套 HTML 如何在手机、平板、桌面上呈现不同布局"的问题。',
  },
  {
    id: 'C_10', title: '渐变与背景', navTitle: '渐变背景', category: '视觉效果',
    path: '/css/c-10/gradient-bg', summary: '用课程卡片背景理解 linear / radial / conic-gradient 的语法与色标控制。',
    demo: C10Gradient, code: C10Code, language: 'vue',
    principle: 'CSS 渐变是 image 类型：linear-gradient 沿直线过渡，radial-gradient 沿半径过渡，conic-gradient 沿角度过渡；色标可指定位置百分比。',
    flow: ['切换三种渐变类型。', '调整线性渐变角度。', '观察预设渐变效果。'],
    notes: ['渐变可叠加（逗号分隔多个 gradient）。', 'background-size 可控制背景图的尺寸，实现平铺渐变。'],
    problem: '解决"如何用纯 CSS 实现丰富的背景效果，避免切图"的问题。',
  },
  {
    id: 'C_11', title: '滤镜与混合模式', navTitle: '滤镜混合', category: '视觉效果',
    path: '/css/c-11/filter-blend', summary: '用课程封面图理解 filter 视觉效果与 mix-blend-mode 色彩混合。',
    demo: C11Filter, code: C11Code, language: 'vue',
    principle: 'filter 对元素整体应用模糊、灰度等视觉效果；mix-blend-mode 决定元素与背景（或兄弟元素）的色彩混合方式；backdrop-filter 只对元素后方区域应用滤镜。',
    flow: ['切换不同滤镜效果。', '切换混合模式观察色彩变化。', '理解 backdrop-filter 与 filter 的区别。'],
    notes: ['filter 可能影响性能，动画中需谨慎使用。', 'mix-blend-mode 在重叠元素间生效，需注意可读性。'],
    problem: '解决"如何为图片添加视觉效果，或让文字与背景图片产生自然的色彩融合"的问题。',
  },
  {
    id: 'C_12', title: 'CSS 数学函数', navTitle: '数学函数', category: '函数与计算',
    path: '/css/c-12/math-functions', summary: '用课程卡片自适应宽度理解 calc / min / max / clamp 的语法与典型场景。',
    demo: C12MathFunctions, code: C12Code, language: 'vue',
    principle: 'calc() 支持混合单位的四则运算；min() 取最小值（适合 max-width）；max() 取最大值（适合响应式字体）；clamp() 提供最小值-理想值-最大值的区间限制。',
    flow: ['切换四种数学函数。', '观察容器宽度的动态计算。', '理解 clamp 在响应式排版中的价值。'],
    notes: ['clamp(min, val, max) 的 val 通常用相对单位（如 2vw）。', '这些函数可嵌套使用，非常灵活。'],
    problem: '解决"如何让尺寸在不同屏幕下自适应，同时限制最小和最大值"的问题。',
  },
  {
    id: 'C_13', title: '视口与容器单位', navTitle: '视口单位', category: '单位与尺寸',
    path: '/css/c-13/viewport-units', summary: '理解 vw / vh / dvh / cqw / rem / ch 的基准与适用场景。',
    demo: C13ViewportUnits, code: C13Code, language: 'vue',
    principle: 'vw/vh 相对于视口尺寸；dvh 会在移动端工具栏收起/展开时动态调整（比 vh 更准确）；cqw/cqh 相对于容器尺寸（配合容器查询）；rem 相对于根字号；ch 相当于字符 0 的宽度。',
    flow: ['切换不同 CSS 单位观察效果。', '理解各单位的参考基准。', '对比 vh 与 dvh 在移动端的差异。'],
    notes: ['移动端推荐用 dvh 替代 vh 避免工具栏问题。', 'rem 适合可缩放的全局间距/字号；px 适合边框等固定值。'],
    problem: '解决"如何选择最合适的 CSS 单位，让布局在不同设备和容器中都能自适应"的问题。',
  },
  {
    id: 'C_14', title: '形状与裁剪', navTitle: '裁剪形状', category: '视觉效果',
    path: '/css/c-14/clip-path-mask', summary: '用课程封面图理解 clip-path 裁剪区域与 mask 遮罩的差异。',
    demo: C14ClipPath, code: C14Code, language: 'vue',
    principle: 'clip-path 通过几何形状裁剪元素的可见区域（保留布局空间）；mask 通过图像或渐变的透明度决定可见性；两者都可做动画。',
    flow: ['切换 clip-path 形状（圆形、椭圆、三角形等）。', '对比 mask 遮罩效果。', '理解两者是否保留交互区域。'],
    notes: ['clip-path 裁剪的区域无法接收点击事件。', 'mask 需要 -webkit-mask 前缀以兼容 Safari。'],
    problem: '解决"如何把元素裁剪成非矩形，或用渐变实现复杂的图片遮罩效果"的问题。',
  },
  {
    id: 'C_15', title: '逻辑属性', navTitle: '逻辑属性', category: '逻辑属性',
    path: '/css/c-15/logical-properties', summary: '用中英文/rtl 布局理解物理属性与逻辑属性的差异，以及书写模式适配。',
    demo: C15LogicalProperties, code: C15Code, language: 'vue',
    principle: '逻辑属性用 start/end 替代物理方向（left/right/top/bottom），自动适配 LTR/RTL 书写模式；inline 对应文本流向，block 对应块流向。',
    flow: ['切换 LTR/RTL 书写方向。', '对比物理属性与逻辑属性的表现。', '理解 inline-size 替代 width 的意义。'],
    notes: ['逻辑属性是国际化（i18n）适配的最佳实践。', 'inset-inline-start 等价于 LTR 下的 left 或 RTL 下的 right。'],
    problem: '解决"如何让布局自动适配不同书写方向（如阿拉伯语 RTL），而不用手动切换 left/right"的问题。',
  },
  {
    id: 'C_16', title: '容器查询', navTitle: '容器查询', category: '响应式进阶',
    path: '/css/c-16/container-query', summary: '用课程卡片理解基于容器尺寸（而非视口）的响应式布局。',
    demo: C16ContainerQuery, code: C16Code, language: 'vue',
    principle: '容器查询通过 @container 根据祖先容器的尺寸应用样式（而非视口尺寸）；需要先通过 container-type 声明容器；cqw/cqh 是相对于容器尺寸的单位。',
    flow: ['拖动滑块改变容器宽度。', '观察卡片内部布局如何响应容器变化。', '理解 @container 与 @media 的区别。'],
    notes: ['容器查询适合组件级响应式（卡片、侧边栏等）。', '@media 仍适合页面级响应式（整体布局断点）。'],
    problem: '解决"组件在不同宽度的容器中应如何自适应，而不是只根据视口宽度响应"的问题。',
  },
  {
    id: 'C_17', title: '层叠上下文', navTitle: '层叠上下文', category: '层叠与 z-index',
    path: '/css/c-17/stacking-context', summary: '理解 z-index 失效的原因：层叠上下文的创建条件与层级隔离。',
    demo: C17StackingContext, code: C17Code, language: 'vue',
    principle: '层叠上下文是一个独立的渲染层级；子元素的 z-index 只在当前上下文内比较；当父元素创建了新上下文，子元素再高的 z-index 也无法覆盖上下文外的元素。',
    flow: ['观察默认情况下 z-index 的生效方式。', '触发 opacity < 1 创建新层叠上下文。', '触发 transform 创建新层叠上下文。'],
    notes: ['常见创建层叠上下文的属性：opacity<1、transform≠none、filter≠none、isolation:isolate。', 'isolation: isolate 可专门创建上下文而不影响视觉。'],
    problem: '解决"为什么设置了很高的 z-index 仍然被其他元素覆盖"的问题。',
  },
  {
    id: 'C_18', title: '格式化上下文', navTitle: '格式化上下文', category: '布局原理',
    path: '/css/c-18/formatting-context', summary: '理解 BFC / IFC / FFC / GFC 的创建方式与布局影响。',
    demo: C18FormattingContext, code: C18Code, language: 'vue',
    principle: '格式化上下文决定浏览器如何布局子元素：BFC（块级）隔离浮动、防止外边距折叠；IFC（行内级）控制行盒排列与基线对齐；FFC/GFC 分别对应 Flex/Grid 布局。',
    flow: ['对比 BFC 创建前后的浮动包裹行为。', '观察 IFC 内行内元素的基线对齐。', '理解外边距折叠与 BFC 的关系。'],
    notes: ['overflow≠visible、float≠none、display:flow-root 都可创建 BFC。', 'display:flow-root 是创建 BFC 且不副作用的最佳方式。'],
    problem: '解决"浮动元素溢出容器、外边距异常折叠"等经典 CSS 布局问题。',
  },
  {
    id: 'C_19', title: 'CSS 架构方法论', navTitle: 'CSS 架构', category: '工程架构',
    path: '/css/c-19/architecture', summary: '用课程卡片组件理解 BEM / OOCSS / SMACSS 的命名与组织思路。',
    demo: C19BEM, code: C19Code, language: 'vue',
    principle: 'BEM（Block__Element--Modifier）通过严格的命名约定实现组件化；OOCSS 分离结构与皮肤；SMACSS 按角色（布局/模块/状态/主题）分类选择器；现代项目多用 CSS Modules 或 CSS-in-JS 实现局部作用域。',
    flow: ['对比三种方法论的命名方式。', '理解各自适用场景。', '结合现代工程化工具选择方案。'],
    notes: ['BEM 类名较长但在大型项目中可预测性强。', '现代构建工具（Vite/webpack）的 CSS Modules 可自动哈希类名，实现真正的局部作用域。'],
    problem: '解决"大型项目中 CSS 如何组织，才能避免样式冲突、提高可维护性"的问题。',
  },
  {
    id: 'C_20', title: 'CSS 性能优化', navTitle: 'CSS 性能', category: '性能优化',
    path: '/css/c-20/performance', summary: '理解渲染阻塞、图层提升、动画性能与 content-visibility 等优化手段。',
    demo: C20Performance, code: C20Code, language: 'vue',
    principle: 'CSS 性能优化核心：减少阻塞渲染（尽早加载关键 CSS）、使用 GPU 加速属性（transform/opacity）、避免强制同步布局、利用 content-visibility 跳过离屏渲染、控制选择器复杂度。',
    flow: ['理解 will-change 与图层提升的关系。', '学习 content-visibility 跳过离屏渲染。', '掌握 CSS 性能最佳实践。'],
    notes: ['动画优先用 transform 和 opacity（合成层，不触发重排/重绘）。', 'will-change 不要滥用，会增加 GPU 内存占用。', 'content-visibility: auto 可大幅提升长列表渲染性能。'],
    problem: '解决"页面滚动卡顿、动画不流畅、首次渲染慢"等 CSS 性能问题。',
  },
  {
    id: 'C_21', title: 'CSS 层叠层（@layer）', navTitle: '层叠层', category: '层叠与架构',
    path: '/css/c-21/cascade-layers', summary: '用 @layer 显式控制样式优先级，解决第三方样式覆盖和复杂项目的层叠管理问题。',
    demo: C21CascadeLayers, code: C21Code, language: 'vue',
    principle: '@layer 允许开发者声明多个层，并指定层的优先级顺序（靠后声明的层优先级更高）；未分层的样式优先级高于所有 @layer；通过 @import 可将第三方样式归入特定层。',
    flow: ['声明层顺序：@layer reset, components, utilities。', '在不同层中定义同一选择器的样式。', '观察层顺序如何决定最终样式。'],
    notes: ['@layer 是现代 CSS 架构的重要工具，可替代 !important  hack。', '未分层的样式（如组件内 style）优先级最高。'],
    problem: '解决"多来源样式（重置样式、组件样式、工具类）如何有序管理优先级"的问题。',
  },
  {
    id: 'C_22', title: 'CSS :has() 选择器', navTitle: ':has() 选择器', category: '选择器进阶',
    path: '/css/c-22/has-selector', summary: '用 :has() 实现"父元素选择器"效果，根据子元素状态样式化容器。',
    demo: C22HasSelector, code: C22Code, language: 'vue',
    principle: ':has() 是 CSS 选择器的一部分，用于选择"包含某些后代"的元素；它打破了 CSS 只能向下选择（不能向上选择父元素）的限制；支持与其他选择器组合使用。',
    flow: ['用 :has(.error) 选择含有错误提示的表单。', '用 :has(img) 选择含有图片的文章。', '结合 :not() 实现更复杂的选择逻辑。'],
    notes: [':has() 目前主流浏览器均已支持（2023+）。', ':has() 不仅可选择父元素，还可选择前面的兄弟元素。'],
    problem: '解决"如何根据子元素状态样式化父容器，而不依赖 JavaScript"的问题。',
  },
  {
    id: 'C_23', title: 'Scroll Snap 滚动定位', navTitle: 'Scroll Snap', category: '滚动与交互',
    path: '/css/c-23/scroll-snap', summary: '用 scroll-snap 实现精准的滚动定位，适合轮播、图片画廊和分页滚动。',
    demo: C23ScrollSnap, code: C23Code, language: 'vue',
    principle: 'scroll-snap-type 在容器上声明滚动方向和对齐严格度；scroll-snap-align 在子项上声明对齐点（start/center/end）；mandatory 强制对齐，proximity 只在接近时对齐。',
    flow: ['在容器设置 scroll-snap-type: x mandatory。', '在子项设置 scroll-snap-align: center。', '滚动时观察自动对齐效果。'],
    notes: ['scroll-snap 不会创建滚动容器，需配合 overflow 使用。', 'scroll-padding 可处理固定导航栏遮挡问题。'],
    problem: '解决"如何实现原生、流畅的滚动定位效果（如轮播、分页），而不依赖 JavaScript"的问题。',
  },
  {
    id: 'C_24', title: 'aspect-ratio 与 object-fit', navTitle: '宽高比与填充', category: '尺寸与媒体',
    path: '/css/c-24/aspect-ratio', summary: '用 aspect-ratio 控制元素宽高比防止布局偏移，用 object-fit 控制图片/视频的填充方式。',
    demo: C24AspectRatio, code: C24Code, language: 'vue',
    principle: 'aspect-ratio 指定元素的理想宽高比（如 16/9），浏览器会自动计算高度防止布局偏移；object-fit 控制替换元素（img/video）在其容器内的填充方式（cover/contain/fill 等）。',
    flow: ['用 aspect-ratio 固定卡片封面比例。', '用 object-fit: cover 裁剪图片填满容器。', '用 object-fit: contain 完整显示图片（可能留白）。'],
    notes: ['aspect-ratio 是防止 CLS（布局偏移）的关键属性。', 'img 需设置 width:100%; height:100% 后 object-fit 才生效。'],
    problem: '解决"图片/视频如何在不同尺寸容器中正确显示，以及如何在加载前预留正确空间"的问题。',
  },

  /***** Vite 核心知识 *****/
  {
    id: 'V_01', title: 'Vite 核心概念', navTitle: '核心概念', category: '基础',
    path: '/vite/v-1/core', summary: '理解 Vite 的两个阶段：开发服务器（原生 ESM）和生产构建（Rollup）。',
    demo: V01Core, code: V01Code, language: 'vue',
    principle: 'Vite 开发阶段使用原生 ESM 按需加载，无需打包；生产阶段使用 Rollup 构建优化后的静态资源。',
    flow: ['理解原生 ESM 开发的优势。', '对比 Vite 与传统打包器（Webpack）的差异。', '了解 Vite 的插件系统。'],
    notes: ['Vite 的冷启动速度不受项目规模影响。', 'HMR 只更新变化的模块，速度极快。'],
    problem: '解决"传统打包器冷启动慢、HMR 更新慢"的问题。',
  },
  {
    id: 'V_02', title: 'Vite 配置文件', navTitle: '配置文件', category: '配置',
    path: '/vite/v-2/config', summary: '使用 defineConfig 获得类型提示，掌握基础配置与常用选项。',
    demo: V02Config, code: V02Code, language: 'vue',
    principle: 'vite.config.ts 使用 defineConfig 包装以获得类型推导；支持通过 VITE_ 前缀的环境变量动态配置。',
    flow: ['查看基础配置示例。', '查看高级配置（别名、CSS、构建选项）。', '理解环境变量在不同模式下的加载。'],
    notes: ['使用 defineConfig 可获得完整的类型提示。', '配置文件支持导出函数，接收 { mode, command } 参数。'],
    problem: '解决"如何组织 Vite 配置，以及不同环境下如何切换配置"的问题。',
  },
  {
    id: 'V_03', title: '插件系统', navTitle: '插件系统', category: '插件',
    path: '/vite/v-3/plugins', summary: '理解 Vite 插件兼容 Rollup 插件接口，掌握常用插件的使用。',
    demo: V03Plugins, code: V03Code, language: 'vue',
    principle: 'Vite 插件兼容 Rollup 插件接口，同时提供 Vite 独有钩子（config、configureServer、transformIndexHtml 等）。',
    flow: ['浏览常用插件列表。', '理解插件在 vite.config.ts 中的注册方式。', '了解插件执行顺序。'],
    notes: ['插件按数组顺序执行。', 'Vite 独有钩子以 config、configureServer 等命名。'],
    problem: '解决"如何扩展 Vite 功能，以及选择合适的插件"的问题。',
  },
  {
    id: 'V_04', title: 'HMR 热更新', navTitle: 'HMR', category: '开发体验',
    path: '/vite/v-4/hmr', summary: '理解 Vite HMR 基于原生 ESM 的实现原理，以及 Vue/React 的框架集成。',
    demo: V04HMR, code: V04Code, language: 'vue',
    principle: 'Vite HMR 基于原生 ESM，通过 import.meta.hot API 实现模块级热更新；Vue/React 插件自动处理状态保留。',
    flow: ['查看 HMR API 手动处理示例。', '理解 Vue SFC 的 HMR 行为。', '了解 React Fast Refresh 的工作原理。'],
    notes: ['Vue SFC 的 template 更新不丢失状态。', 'HMR 只更新变化的模块，速度极快。'],
    problem: '解决"开发时修改代码后页面刷新导致状态丢失"的问题。',
  },
  {
    id: 'V_05', title: '环境变量与模式', navTitle: '环境变量', category: '配置',
    path: '/vite/v-5/env', summary: '使用 .env 文件和 import.meta.env 管理不同环境下的变量。',
    demo: V05Env, code: V05Code, language: 'vue',
    principle: 'Vite 使用 dotenv 加载 .env 文件；只有 VITE_ 前缀的变量会暴露到客户端（通过 import.meta.env 访问）。',
    flow: ['理解 .env 文件的加载优先级。', '学习在代码和配置中读取环境变量。', '掌握 VITE_ 前缀的作用和安全意义。'],
    notes: ['import.meta.env.MODE 可获取当前模式。', '敏感信息（如数据库密码）不应使用 VITE_ 前缀。'],
    problem: '解决"如何在不同环境（开发/测试/生产）中使用不同的 API 地址"的问题。',
  },
  {
    id: 'V_06', title: '静态资源处理', navTitle: '静态资源', category: '资源',
    path: '/vite/v-6/assets', summary: '理解导入哈希化、public 目录和 base64 内联三种资源处理方式。',
    demo: V06Assets, code: V06Code, language: 'vue',
    principle: 'Vite 对静态资源有三种处理：导入的资源会被哈希化并复制到构建产物；public 目录的文件原样复制；小于阈值的小资源会被内联为 base64。',
    flow: ['理解显式导入的资源处理方式。', '了解 public 目录的适用场景。', '掌握 assetsInlineLimit 配置。'],
    notes: ['优先使用导入方式引用资源（可获得哈希和优化）。', 'public 目录适合不常变更的静态文件（favicon、robots.txt）。'],
    problem: '解决"静态资源在构建后路径错误，或希望控制资源哈希/内联行为"的问题。',
  },
  {
    id: 'V_07', title: '依赖预构建', navTitle: '预构建', category: '性能',
    path: '/vite/v-7/pre-bundle', summary: '理解 Vite 使用 Esbuild 预构建 node_modules 依赖的原因和配置方式。',
    demo: V07PreBundle, code: V07Code, language: 'vue',
    principle: 'Vite 使用 Esbuild 将 CommonJS/大量 ESM 依赖转换为单个 ESM 文件，减少 HTTP 请求并兼容 CommonJS 模块。',
    flow: ['理解为什么需要依赖预构建。', '学习 optimizeDeps 配置。', '了解 Esbuild 在 Vite 中的其他用途。'],
    notes: ['预构建产物缓存在 node_modules/.vite/。', '删除缓存可强制重新预构建。'],
    problem: '解决"首次启动慢，或某些 CommonJS 包无法直接使用"的问题。',
  },
  {
    id: 'V_08', title: '构建优化', navTitle: '构建优化', category: '构建',
    path: '/vite/v-8/build', summary: '掌握代码分割、懒加载、压缩等 Vite 生产构建优化手段。',
    demo: V08Build, code: V08Code, language: 'vue',
    principle: 'Vite 基于 Rollup 构建，支持自动代码分割（每个动态 import 生成独立 chunk）、手动分包、多种压缩策略。',
    flow: ['学习自动代码分割和手动分包配置。', '理解路由级懒加载的实现。', '掌握 esbuild/terser 压缩配置。'],
    notes: ['动态 import() 是代码分割的基础。', 'esbuild 压缩速度快，terser 压缩率高。'],
    problem: '解决"生产构建产物过大，或希望控制 chunk 分割策略"的问题。',
  },
  {
    id: 'V_09', title: '多页面应用（MPA）', navTitle: 'MPA', category: '构建',
    path: '/vite/v-9/mpa', summary: '配置多个 HTML 入口，构建多页面应用。',
    demo: V09MPA, code: V09Code, language: 'vue',
    principle: 'Vite 通过 build.rollupOptions.input 配置多个 HTML 入口；每个入口是独立的页面，共享依赖会被提取为 common chunk。',
    flow: ['学习 MPA 配置方式。', '理解项目结构组织。', '对比 MPA 与 SPA 的适用场景。'],
    notes: ['每个 HTML 文件使用 <script type="module"> 引入入口 JS。', '共享依赖自动提取，不会重复打包。'],
    problem: '解决"项目需要多个独立页面（如官网+管理后台），而不想用 SPA 前端路由"的问题。',
  },
  {
    id: 'V_10', title: '库模式', navTitle: '库模式', category: '构建',
    path: '/vite/v-10/lib', summary: '使用 Vite 构建可发布的 npm 包，同时输出 ESM/UMD/CJS 格式。',
    demo: V10Lib, code: V10Code, language: 'vue',
    principle: 'Vite 库模式通过 build.lib 配置，可同时输出 ESM（供现代打包器）、UMD（供 CDN）、CJS（供 Node.js）格式。',
    flow: ['学习库模式配置。', '理解构建产物结构。', '掌握发布到 npm 的完整流程。'],
    notes: ['使用 peerDependencies 声明框架依赖（如 vue）。', 'package.json 的 module/main 字段指向对应格式产物。'],
    problem: '解决"如何开发一个同时支持 ESM 和 UMD 引入的 npm 包"的问题。',
  },
  {
    id: 'V_11', title: '服务端渲染（SSR）', navTitle: 'SSR', category: '进阶',
    path: '/vite/v-11/ssr', summary: '理解 Vite SSR 工作原理，以及 Nuxt 3/4 如何基于 Vite 实现 SSR。',
    demo: V11SSR, code: V11Code, language: 'vue',
    principle: 'Vite SSR 在服务器端运行 Vue 组件生成 HTML，在客户端进行 Hydration（激活）；Nuxt 3/4 内置了完整的 SSR 支持。',
    flow: ['理解 SSR 的工作原理和优势。', '学习 Vite SSR 的基础配置。', '了解 Nuxt 如何基于 Vite 实现 SSR。'],
    notes: ['SSR 有利于 SEO 和首屏速度。', '本仓库（小松鼠举栗子）就是使用 Nuxt 4 + Vite 构建的！'],
    problem: '解决"Vue 应用需要 SEO 友好，或希望提升首屏加载速度"的问题。',
  },
  {
    id: 'V_12', title: 'CSS 与 PostCSS', navTitle: 'CSS处理', category: '样式',
    path: '/vite/v-12/css', summary: 'Vite 内置支持 PostCSS、Sass/Less/Stylus 预处理器和 CSS Modules。',
    demo: V12CSS, code: V12Code, language: 'vue',
    principle: 'Vite 自动检测 PostCSS 配置；安装预处理器（如 sass）后即可在 Vue SFC 中使用；CSS Modules 在 Vue SFC 中默认启用。',
    flow: ['学习 PostCSS 配置方式。', '掌握预处理器（Sass/Less）的使用。', '理解 CSS Modules 在 Vue 中的使用。'],
    notes: ['Vue SFC 的 <style scoped> 已提供组件级样式隔离。', '预处理器需要单独安装（npm install -D sass）。'],
    problem: '解决"如何在 Vite 项目中使用 Tailwind、Sass 或 CSS Modules"的问题。',
  },
  {
    id: 'V_13', title: 'TypeScript 集成', navTitle: 'TypeScript', category: '类型',
    path: '/vite/v-13/typescript', summary: 'Vite 使用 Esbuild 极速转译 TypeScript，类型检查由 IDE 或 vue-tsc 单独完成。',
    demo: V13TypeScript, code: V13Code, language: 'vue',
    principle: 'Vite 使用 Esbuild 转译 TypeScript（移除类型注解，不做类型检查）；类型检查由 IDE 或单独运行 vue-tsc --noEmit 完成。',
    flow: ['理解 Vite 的 TypeScript 处理策略。', '学习 Vue SFC 中使用 TypeScript。', '掌握类型检查的最佳实践。'],
    notes: ['Vite 不负责类型检查（保证开发服务器速度）。', '建议配置 type-check 脚本在构建前运行。'],
    problem: '解决"Vite 项目中如何获得完整的 TypeScript 支持，以及类型检查应该由谁负责"的问题。',
  },
  {
    id: 'V_14', title: '代理与跨域', navTitle: '代理跨域', category: '开发体验',
    path: '/vite/v-14/proxy', summary: '使用 Vite 开发服务器代理解决开发环境跨域问题。',
    demo: V14Proxy, code: V14Code, language: 'vue',
    principle: 'Vite 开发服务器的 server.proxy 配置基于 http-proxy，可将特定路径的请求代理到后端服务器，避免浏览器 CORS 限制。',
    flow: ['学习基础代理配置。', '掌握路径重写和 WebSocket 代理。', '了解 CORS 问题的其他解决方案。'],
    notes: ['changeOrigin: true 会修改请求头的 Origin。', '代理只作用于开发环境，生产环境需要后端配置 CORS 或使用 Nginx 反向代理。'],
    problem: '解决"开发环境中前端请求后端 API 遇到 CORS 错误"的问题。',
  },
  {
    id: 'V_15', title: '性能分析', navTitle: '性能分析', category: '性能',
    path: '/vite/v-15/perf', summary: '使用可视化工具和最佳实践分析和优化 Vite 构建产物。',
    demo: V15Perf, code: V15Code, language: 'vue',
    principle: 'Vite 构建产物分析可使用 rollup-plugin-visualizer 可视化；性能优化包括减少依赖体积、使用 CDN、启用压缩等。',
    flow: ['学习使用 rollup-plugin-visualizer 分析产物。', '掌握 Vite 性能优化清单。', '了解如何监控构建和运行时的性能指标。'],
    notes: ['定期分析 bundle 大小，及时发现体积膨胀。', '大型库（如 lodash-es）应使用按需引入。'],
    problem: '解决"构建产物过大，或希望找到体积膨胀的原因"的问题。',
  },
  {
    id: 'V_16', title: '自定义插件开发', navTitle: '插件开发', category: '进阶',
    path: '/vite/v-16/plugin-dev', summary: '理解 Vite 插件结构，动手开发一个简单的自定义插件。',
    demo: V16PluginDev, code: V16Code, language: 'vue',
    principle: 'Vite 插件是一个函数，返回一个包含钩子的对象；钩子分为 Vite 独有钩子（config、configureServer 等）和 Rollup 兼容钩子（resolveId、load、transform 等）。',
    flow: ['理解 Vite 插件的结构和钩子。', '学习自定义插件开发示例。', '掌握发布 Vite 插件到 npm 的流程。'],
    notes: ['插件命名规范：vite-plugin-xxx。', 'Vite 独有钩子以 config、configureServer 等命名。'],
    problem: '解决"现有插件无法满足需求，需要为项目定制构建行为"的问题。',
  },
  {
    id: 'V_17', title: '依赖预构建与缓存优化', navTitle: '依赖预构建', category: '性能',
    path: '/vite/v-17/dependency-prebundle', summary: '理解 Vite 使用 esbuild 预构建依赖的原理，掌握缓存优化和配置。',
    demo: V17DependencyPrebundle, code: V17Code, language: 'vue',
    principle: 'Vite 在首次启动时使用 esbuild 预构建 node_modules 中的依赖，将 CommonJS/UMD 转换为 ESM，并缓存到磁盘，避免重复构建提升启动速度。',
    flow: ['首次启动 Vite 时扫描依赖并预构建。', '构建结果缓存到 node_modules/.vite。', '后续启动直接读取缓存，依赖变化时重新构建。'],
    notes: ['预构建只处理第三方依赖，源码不预构建。', 'optimizeDeps.include 可以强制预构建某些包。', '缓存失效会自动检测并重新构建。'],
    problem: '解决大量依赖下启动慢、CommonJS 模块无法直接在浏览器运行的问题。',
  },
  {
    id: 'V_18', title: 'esbuild 转换与 JSX/TS 处理', navTitle: 'esbuild 转换', category: '基础',
    path: '/vite/v-18/esbuild', summary: '了解 Vite 使用 esbuild 进行极速语法转换的机制，以及 TypeScript 和 JSX 的处理策略。',
    demo: V18Esbuild, code: V18Code, language: 'vue',
    principle: 'Vite 使用 esbuild 处理 TypeScript 和 JSX 转换，esbuild 用 Go 编写比传统 JS 工具快 10-100 倍，开发环境下跳过类型检查只做语法转换。',
    flow: ['源码中的 .ts/.tsx 文件请求到达 Vite 开发服务器。', 'esbuild 进行语法转换，输出纯 JS。', '浏览器直接运行转换后的 ESM 模块。'],
    notes: ['开发环境只做语法转换，类型检查由 IDE 和构建时负责。', 'esbuild 不支持某些 TS 特性如 const enum（需配置）。', '构建时由 Rollup + TS 插件做完整的类型检查。'],
    problem: '解决传统构建工具 TS/JSX 编译速度慢、开发体验差的问题。',
  },
  {
    id: 'V_19', title: 'Rollup 插件兼容与构建钩子', navTitle: 'Rollup 插件', category: '插件',
    path: '/vite/v-19/rollup-plugin', summary: '理解 Vite 与 Rollup 插件的兼容性，掌握 Vite 特有钩子和插件使用方式。',
    demo: V19RollupPlugin, code: V19Code, language: 'vue',
    principle: 'Vite 构建时基于 Rollup，兼容大部分 Rollup 插件，同时扩展了 Vite 特有的钩子如 config、configureServer、transformIndexHtml 等。',
    flow: ['在 vite.config.ts 的 plugins 数组中添加 Rollup 插件。', '开发和构建时 Vite 调用插件的不同钩子。', '使用 Vite 特有钩子扩展开发服务器等能力。'],
    notes: ['并非所有 Rollup 插件都能在开发模式下工作。', 'Vite 插件可以只在开发或构建阶段生效。', '插件执行顺序与数组顺序相关，enforce 可以调整。'],
    problem: '解决构建工具生态碎片化、需要学习多套插件 API 的问题。',
  },
  {
    id: 'V_20', title: '库模式与组件打包发布', navTitle: '库模式', category: '构建',
    path: '/vite/v-20/library-mode', summary: '使用 Vite 库模式打包组件库或工具库，支持多格式输出和发布到 npm。',
    demo: V20LibraryMode, code: V20Code, language: 'vue',
    principle: 'Vite 的库模式（Library Mode）可以把项目打包成可发布的 npm 包，支持 ESM、CommonJS、UMD 等多种输出格式，并自动处理 CSS 和类型声明。',
    flow: ['在 vite.config.ts 中配置 build.lib 选项。', '指定入口文件、输出格式和包名。', '运行 vite build 生成可发布的 dist 目录。'],
    notes: ['库模式下外部化 Vue 等 peer dependencies。', '需要单独配置 d.ts 生成或使用 vite-plugin-dts。', '注意输出格式兼容性和 Tree Shaking 支持。'],
    problem: '解决组件库/工具库打包配置复杂、输出格式不统一的问题。',
  },
  {
    id: 'V_21', title: '多页面应用配置与入口管理', navTitle: '多页面应用', category: '构建',
    path: '/vite/v-21/multi-page', summary: '配置 Vite 多页面应用，管理多个 HTML 入口和共享资源。',
    demo: V21MultiPage, code: V21Code, language: 'vue',
    principle: 'Vite 支持多页面应用（MPA），通过 build.rollupOptions.input 配置多个 HTML 入口，每个页面可以有独立的脚本和样式，开发服务器也支持多页面路由。',
    flow: ['在项目根目录创建多个 HTML 入口文件。', '在 vite.config.ts 中配置 build.rollupOptions.input。', '开发服务器通过路径访问不同页面，构建时输出多个 HTML。'],
    notes: ['多页面可以共享公共依赖和代码分割。', '每个页面有独立的 Vite 模块图。', '适合后台管理系统等多入口场景。'],
    problem: '解决传统 MPA 构建配置复杂、公共资源管理困难的问题。',
  },
  {
    id: 'X_1', title: '项目结构与 App Router 目录约定', navTitle: '项目结构', category: '起步',
    path: '/nextjs/x-1/project-structure', summary: '了解 Next.js App Router 的目录约定、app/ 核心目录和 next.config.js 配置。',
    demo: X01ProjectStructure, code: X01Code, language: 'vue',
    principle: 'Next.js 13+ 使用 App Router（app/ 目录）组织路由：page.tsx 定义页面 UI，layout.tsx 定义共享布局，特殊文件（loading/error/not-found）约定加载、错误和 404 状态。这套约定让路由、布局和状态处理都有文件可循。',
    flow: ['认识 app/ 目录的核心文件（page/layout/loading/error）。', '理解 public/ 静态资源与 next.config.js 配置。', '掌握 Pages Router 与 App Router 的区别。'],
    notes: ['app/layout.tsx 是必需的根布局，必须包含 <html> 和 <body>。', 'Pages Router（pages/）仍兼容，但推荐迁移到 App Router。', 'middleware.ts 必须放在项目根或 src/ 下，不能在 app/ 内。'],
    problem: '解决"Next.js 项目怎么组织代码、App Router 目录里每个文件是干什么用的"入门问题。',
  },
  {
    id: 'X_2', title: '文件路由：目录即路由表', navTitle: '文件路由', category: '起步',
    path: '/nextjs/x-2/file-routing', summary: '掌握 App Router 文件路由映射规则，理解静态、动态、Catch-all、路由组和并行路由的命名约定。',
    demo: X02FileRouting, code: X02Code, language: 'vue',
    principle: 'App Router 基于文件系统自动生成路由：page.tsx 定义路由 UI，目录层级即 URL 层级。方括号表示动态参数，圆括号是路由组（不影响路径），@ 前缀是并行路由插槽，_ 前缀是私有文件夹（不参与路由）。',
    flow: ['理解 page.tsx 才是路由入口，目录只是路径段。', '掌握 [param]、[...slug]、(group)、@slot、_private 命名规则。', '对比 Nuxt 的文件路由，理解 Next.js 的差异。'],
    notes: ['只有 page.tsx 会生成路由，其他文件（layout/error 等）是辅助。', '[[...slug]] 是可选 Catch-all，零段也匹配。', '(folder) 路由组用于组织代码和切换布局，不改变 URL。'],
    problem: '解决"Next.js 文件名各种括号和符号代表什么、如何用文件结构表达复杂路由"的问题。',
  },
  {
    id: 'X_3', title: '布局与模板：共享 UI 的层级', navTitle: '布局模板', category: '起步',
    path: '/nextjs/x-3/layouts', summary: '理解根布局、嵌套布局、路由组布局和 template 的区别与嵌套机制。',
    demo: X03Layouts, code: X03Code, language: 'vue',
    principle: 'layout.tsx 在导航时保持挂载状态不重新渲染，适合放 Header/Footer 等持久 UI；template.tsx 每次导航都重新创建，适合需要重置状态的场景。布局层层嵌套，子布局套在父布局内。',
    flow: ['认识根布局（必需）与嵌套布局的层级关系。', '理解 layout 和 template 的状态保持差异。', '掌握路由组布局实现同 URL 不同布局。'],
    notes: ['根布局必须包含 <html> 和 <body>，全局样式在这里引入。', 'layout 在导航时不重新挂载，useState 会保留；template 会重置。', '路由组 (group) 配合各自 layout 可实现同路径多套布局。'],
    problem: '解决"哪些 UI 应该放 layout、layout 之间如何嵌套、什么时候用 template"的问题。',
  },
  {
    id: 'X_4', title: '动态路由与参数', navTitle: '动态路由', category: '起步',
    path: '/nextjs/x-4/dynamic-routes', summary: '掌握动态路由参数、Catch-all、可选 Catch-all，以及 params 与 searchParams 的使用。',
    demo: X04DynamicRoutes, code: X04Code, language: 'vue',
    principle: '动态路由用方括号 [id] 捕获单段，[...slug] 捕获多段（数组），[[...slug]] 可选捕获。page 组件通过 params prop 读取路径参数，通过 searchParams 读取 URL 查询串。Next.js 15+ 中两者都是 Promise，需 await。',
    flow: ['掌握 [param] 单段与 [...slug] 多段动态路由。', '理解 params（路径段）与 searchParams（查询串）的区别。', '注意 Next.js 15+ params/searchParams 变为 Promise。'],
    notes: ['Catch-all params.slug 是数组，单段 params.id 是字符串。', 'searchParams 在服务端组件中会触发动态渲染。', 'generateStaticParams() 可预生成动态路由的静态页面。'],
    problem: '解决"如何用文件名表达带参数的 URL、在组件里怎么拿到路由参数"的问题。',
  },
  {
    id: 'X_5', title: 'Server Components 服务端组件', navTitle: 'Server组件', category: '渲染',
    path: '/nextjs/x-5/server-components', summary: '理解 Server Component 的运行环境、能力边界与默认行为。',
    demo: X05ServerComponents, code: X05Code, language: 'vue',
    principle: 'App Router 中所有组件默认是 Server Component，在服务端运行，不打包进前端 bundle，可直接访问数据库、文件系统和密钥，但不能用 useState/useEffect 等客户端 Hook 和事件处理。适合数据获取和静态渲染。',
    flow: ['认识 Server Component 的服务端运行特性。', '对比 Server 与 Client Component 的能力边界。', '理解组合规则：Server 可导入 Client，反之只能传 children。'],
    notes: ['Server Component 不能用 onClick、useState、useEffect。', '直接 await 数据获取，无需 useEffect + 状态管理。', '把 "use client" 尽量下推，让更多组件留在服务端减小 bundle。'],
    problem: '解决"Server Component 到底能做什么、不能做什么、和 Client Component 怎么配合"的问题。',
  },
  {
    id: 'X_6', title: 'Client Components 客户端组件', navTitle: 'Client组件', category: '渲染',
    path: '/nextjs/x-6/client-components', summary: '掌握 "use client" 声明时机、客户端 Hooks 限制与 Server/Client 组件组合模式。',
    demo: X06ClientComponents, code: X06Code, language: 'vue',
    principle: '需要交互（事件、状态、生命周期、浏览器 API）的组件必须用 "use client" 声明为 Client Component。声明会向下传递：导入的子组件也变成客户端。Server 获取数据后可通过 props 传给 Client 组件接管交互。',
    flow: ['判断何时需要 "use client"（事件/状态/生命周期/浏览器 API）。', '掌握 Server 获取数据 → props 传 Client 的组合模式。', '理解 "use client" 边界向下传递的特性。'],
    notes: ['所有 React Hooks（useState/useEffect 等）只能在 Client Component 中使用。', 'Client Component 仍会在服务端预渲染 HTML，再在客户端 hydrate。', '尽量让交互组件小而独立，外层保持 Server。'],
    problem: '解决"什么组件要加 use client、Server 和 Client 组件如何组合传数据"的问题。',
  },
  {
    id: 'X_7', title: '静态与动态渲染', navTitle: '静态动态', category: '渲染',
    path: '/nextjs/x-7/static-dynamic', summary: '理解 Next.js 的静态渲染（构建时）与动态渲染（请求时）触发条件和缓存行为。',
    demo: X07StaticDynamic, code: X07Code, language: 'vue',
    principle: 'Next.js 默认静态渲染（构建时生成 HTML），一旦组件树使用了动态函数（cookies/headers/searchParams）或 no-store fetch，整个路由转为动态渲染（每次请求执行）。静态路由可被 CDN 缓存，动态路由按需执行。',
    flow: ['理解静态（构建时）与动态（请求时）渲染的时机差异。', '掌握触发动态的信号：cookies/headers/searchParams/no-store。', '用 generateStaticParams 预生成动态路由的静态页。'],
    notes: ['只要路由树中任一组件用了动态函数，整条路由变动态。', 'fetch 默认 force-cache（静态），no-store 触发动态。', 'Partial Prerendering（PPR）实验特性允许静态壳 + 动态洞。'],
    problem: '解决"页面是构建时生成还是请求时执行、什么操作会让页面变动态"的问题。',
  },
  {
    id: 'X_8', title: 'Streaming 与 Suspense 流式渲染', navTitle: '流式渲染', category: '渲染',
    path: '/nextjs/x-8/streaming', summary: '用 Suspense 边界实现流式渲染，让慢组件不阻塞首屏，渐进式展示内容。',
    demo: X08StreamingSuspense, code: X08Code, language: 'vue',
    principle: 'Streaming 把服务端渲染的 HTML 分块发送：遇到 Suspense 边界先返回 fallback，慢组件数据就绪后流式替换。用户无需等最慢组件就能看到骨架，loading.tsx 是路由级 Suspense 的语法糖。',
    flow: ['理解流式渲染：先返回 fallback，数据就绪后流式替换。', '用 <Suspense> 包裹慢组件，或用 loading.tsx 自动包裹。', '多个 Suspense 可并行流式，互不阻塞。'],
    notes: ['loading.tsx 等价于路由级 <Suspense>，自动包裹 page。', '流式渲染需要配合 async Server Component + await。', '首屏 LCP 优化：把慢组件用 Suspense 隔离，快速部分先出。'],
    problem: '解决"页面里有慢请求，用户要等很久才看到内容、如何渐进式展示"的问题。',
  },
  {
    id: 'X_9', title: '数据获取与 fetch 缓存', navTitle: '数据获取', category: '数据',
    path: '/nextjs/x-9/data-fetching', summary: '掌握 Server Component 中直接 await fetch 的模式，以及 Next.js 扩展的缓存选项。',
    demo: X09DataFetching, code: X09Code, language: 'vue',
    principle: 'Next.js 扩展了原生 fetch：默认 force-cache（构建时缓存）、no-store（不缓存）、revalidate（ISR 定时刷新）、tags（按标签缓存可主动失效）。同渲染周期内相同 URL 自动去重，Server Component 直接 await 即可。',
    flow: ['在 Server Component 中直接 await fetch（无需 useEffect）。', '掌握 force-cache/no-store/revalidate/tags 四种缓存策略。', '用 revalidateTag/revalidatePath 主动失效缓存。'],
    notes: ['fetch 默认缓存（force-cache），no-store 才不缓存。', 'Request Memoization：同一次渲染内相同 fetch 只执行一次。', '缓存存储在服务端跨请求共享，不是浏览器缓存。'],
    problem: '解决"在 Next.js 里怎么请求数据、fetch 的缓存怎么控制"的问题。',
  },
  {
    id: 'X_10', title: 'Server Actions 服务端操作', navTitle: 'Server Actions', category: '数据',
    path: '/nextjs/x-10/server-actions', summary: '用 "use server" 定义服务端函数，表单直接提交到服务端，无需手写 API。',
    demo: X10ServerActions, code: X10Code, language: 'vue',
    principle: 'Server Action 用 "use server" 声明，函数在服务端运行，前端通过 POST 调用。配合 form action 属性原生支持，自动处理 CSRF。执行后用 revalidatePath/revalidateTag 刷新缓存，页面自动更新，无需手动 refetch。',
    flow: ['用 "use server" 定义服务端函数。', '通过 form action 或编程式调用触发。', '执行后 revalidatePath 刷新缓存，页面自动更新。'],
    notes: ['Server Action 自动 CSRF 防护，参数自动序列化。', 'useFormState 跟踪返回值，useFormStatus 跟踪提交状态。', 'useOptimistic 实现乐观更新，提升交互体验。'],
    problem: '解决"表单提交/数据变更需要写 API 吗、怎么在 Next.js 里做增删改"的问题。',
  },
  {
    id: 'X_11', title: 'Route Handlers API 路由', navTitle: 'API路由', category: '数据',
    path: '/nextjs/x-11/route-handlers', summary: '用 route.ts 定义 REST API，导出 GET/POST 等方法处理 HTTP 请求。',
    demo: X11RouteHandlers, code: X11Code, language: 'vue',
    principle: 'Route Handler 在 app/api/ 下用 route.ts 定义，每个导出的 HTTP 方法（GET/POST/PUT/DELETE）对应一个处理函数，返回 NextResponse。适合构建 REST API、Webhook、第三方 API 代理，可运行在 Node 或 Edge Runtime。',
    flow: ['在 app/api/xxx/route.ts 导出 HTTP 方法。', '用 NextResponse.json 返回 JSON。', '通过 params 获取动态路由参数。'],
    notes: ['文件名固定为 route.ts，目录层级即 API 路径。', 'GET 可缓存，POST/PUT/DELETE 默认不缓存。', '与 Server Action 区别：Route Handler 是 REST API，Server Action 是表单提交。'],
    problem: '解决"Next.js 怎么写后端 API、Route Handler 和 Server Action 该用哪个"的问题。',
  },
  {
    id: 'X_12', title: '缓存与重新验证', navTitle: '缓存策略', category: '数据',
    path: '/nextjs/x-12/caching', summary: '理解 Data Cache、Full Route Cache、Router Cache、Request Memoization 四层缓存与失效机制。',
    demo: X12Caching, code: X12Code, language: 'vue',
    principle: 'Next.js 有四层缓存：Request Memoization（单次请求去重）、Data Cache（fetch 结果持久缓存）、Full Route Cache（路由 HTML/RSC 缓存）、Router Cache（客户端已访问路由缓存）。失效 Data Cache 会级联刷新上层。',
    flow: ['认识四层缓存的作用范围与生命周期。', '掌握 revalidatePath/revalidateTag 主动失效。', '理解定时 revalidate（ISR）与 no-store 跳过缓存。'],
    notes: ['Data Cache 是基础，失效它会级联刷新 Full Route 和 Router Cache。', 'Router Cache 在客户端会话内有效（30s~5min），router.refresh() 可清除。', '路由级可用 export const revalidate / dynamic 配置。'],
    problem: '解决"Next.js 到底有几层缓存、数据更新后怎么让缓存失效"的问题。',
  },
  {
    id: 'X_13', title: 'Parallel Routes 并行路由', navTitle: '并行路由', category: '路由进阶',
    path: '/nextjs/x-13/parallel-routes', summary: '用 @ 插槽在布局中并行渲染多个独立子路由，实现仪表盘等复杂布局。',
    demo: X13ParallelRoutes, code: X13Code, language: 'vue',
    principle: 'Parallel Routes 用 @ 前缀目录定义插槽，插槽作为 props 传入 layout，可并行渲染多个独立子路由。每个插槽有独立的加载和错误状态，default.tsx 提供未匹配时的默认内容，适合仪表盘多面板布局。',
    flow: ['用 @folder 定义插槽，在 layout 中接收对应 prop。', '理解 default.tsx 在插槽未匹配时的兜底作用。', '配合 Intercepting Routes 实现模态框。'],
    notes: ['插槽名即 prop 名：@sidebar → layout 的 sidebar prop。', '每个插槽可独立流式加载（各自的 loading.tsx）。', '插槽不参与 URL 路径，只影响布局渲染。'],
    problem: '解决"一个布局里要同时展示多个独立数据块、怎么并行渲染"的问题。',
  },
  {
    id: 'X_14', title: 'Intercepting Routes 拦截路由', navTitle: '拦截路由', category: '路由进阶',
    path: '/nextjs/x-14/intercepting-routes', summary: '用 (.) (..) (...) 拦截路由，实现客户端导航弹窗、直接访问全屏的体验。',
    demo: X14InterceptingRoutes, code: X14Code, language: 'vue',
    principle: 'Intercepting Routes 用 (.) (..) (...) 前缀拦截其他路由：客户端导航时命中拦截版（如弹窗），直接访问 URL 时命中真实版（如全屏）。同一 URL 两种体验，既流畅又可分享，常配合 Parallel Routes 的 Modal 插槽。',
    flow: ['理解 (.) (..) (...) 拦截符号的层级含义。', '在子目录创建拦截版页面（如弹窗）。', '配合 Parallel Routes Modal 插槽实现弹窗。'],
    notes: ['(.) 同级、(..) 上级、(...) 根级拦截。', '拦截路由的 URL 与真实路由相同，刷新命中真实版。', '浏览器后退回到来源页，弹窗自动关闭。'],
    problem: '解决"点击图片想弹窗展示、直接访问又要是全屏页、怎么兼顾"的问题。',
  },
  {
    id: 'X_15', title: 'Route Groups 与私有文件夹', navTitle: '路由组', category: '路由进阶',
    path: '/nextjs/x-15/route-groups', summary: '用 (group) 路由组组织代码、切换布局，用 _folder 私有文件夹存放不参与路由的内容。',
    demo: X15RouteGroups, code: X15Code, language: 'vue',
    principle: 'Route Groups 用 (folder) 圆括号目录组织代码而不影响 URL，可为一组路由指定独立 layout；私有文件夹用 _folder 下划线前缀，完全不参与路由，适合存放内部组件和工具函数。',
    flow: ['用 (group) 组织代码、切换布局且不影响 URL。', '用 _folder 存放不参与路由的内部组件/工具。', '区分 [param] 动态、@slot 并行、(group) 路由组、_private 私有。'],
    notes: ['路由组可让同一 URL 有不同布局（如营销页 vs 后台）。', '私有文件夹内的 page.tsx 不会生成路由。', '路由组不能与同名路由组冲突（会报 URL 冲突错误）。'],
    problem: '解决"怎么给一组路由单独布局而不改 URL、内部组件怎么放才不会误生成路由"的问题。',
  },
  {
    id: 'X_16', title: 'Loading 与 Error UI', navTitle: '加载错误', category: '路由进阶',
    path: '/nextjs/x-16/loading-error', summary: '用 loading.tsx / error.tsx / not-found.tsx / global-error.tsx 约定加载、错误和 404 状态。',
    demo: X16LoadingError, code: X16Code, language: 'vue',
    principle: 'loading.tsx 自动创建 Suspense 边界包裹 page；error.tsx 捕获子组件错误（必须是 Client Component，提供 reset 重试）；not-found.tsx 处理 404；global-error.tsx 是根 layout 出错时的兜底，需自带 html/body。错误就近匹配、向上冒泡。',
    flow: ['用 loading.tsx 自动包裹路由级 Suspense。', '用 error.tsx 捕获错误并提供 reset 重试。', '理解 global-error 兜底根 layout 错误。'],
    notes: ['error.tsx 必须是 Client Component（需要 reset 交互）。', 'error.tsx 不捕获同级 layout 的错误，需 global-error.tsx。', 'not-found() 函数可主动触发 404 页面。'],
    problem: '解决"页面加载中、出错、404 时分别该显示什么、怎么用文件约定处理"的问题。',
  },
  {
    id: 'X_17', title: 'next/image 图片优化', navTitle: '图片优化', category: '优化',
    path: '/nextjs/x-17/next-image', summary: '用 next/Image 自动优化图片格式、尺寸、懒加载，消除布局抖动。',
    demo: X17NextImage, code: X17Code, language: 'vue',
    principle: 'next/image 自动按设备生成合适尺寸的 WebP/AVIF，默认懒加载，通过 width/height 或 fill 防止 CLS。本地图片需 import（自带尺寸），远程图片需在 next.config.js 配置域名白名单。priority 属性用于首屏 LCP 图片预加载。',
    flow: ['本地图片用 import 引入，远程图片配置域名白名单。', '指定 width/height 或用 fill 防止布局抖动。', '首屏图片加 priority 预加载。'],
    notes: ['sizes 属性配合 srcset 生成响应式多档图片。', 'placeholder="blur" 生成低质量模糊占位符。', '远程图片不配域名会报错，需 remotePatterns。'],
    problem: '解决"图片加载慢、格式大、会抖动、怎么自动优化"的问题。',
  },
  {
    id: 'X_18', title: 'next/font 字体优化', navTitle: '字体优化', category: '优化',
    path: '/nextjs/x-18/next-font', summary: '用 next/font 自托管字体，消除布局抖动，避免第三方 CDN 请求。',
    demo: X18NextFont, code: X18Code, language: 'vue',
    principle: 'next/font 在构建时下载字体并自托管，无第三方请求，用 size-adjust 消除 FOUT/FOIT 布局抖动。支持 Google Fonts 和本地字体，生成 CSS 变量方便引用，display: swap 先用 fallback 再平滑切换。',
    flow: ['用 next/font/google 或 next/font/local 加载字体。', '通过 variable 生成 CSS 变量。', '在 globals.css 中引用变量。'],
    notes: ['字体文件构建时下载自托管，不向 Google 发请求（隐私友好）。', 'display: swap 先显示 fallback 再切换，避免文字不可见。', '自动 subset 减小字体文件体积。'],
    problem: '解决"用 Google 字体向第三方泄露用户信息、字体切换导致布局抖动"的问题。',
  },
  {
    id: 'X_19', title: 'next/link 与导航', navTitle: '链接导航', category: '优化',
    path: '/nextjs/x-19/next-link', summary: '掌握 Link 客户端导航、useRouter 编程式跳转、redirect 服务端重定向等导航 API。',
    demo: X19NextLink, code: X19Code, language: 'vue',
    principle: 'Link 实现客户端导航并自动预取目标路由 RSC payload；useRouter 提供 push/replace/back/refresh 编程式导航；redirect 在服务端重定向。App Router 的导航 API 从 next/navigation 导入（非 next/router）。',
    flow: ['用 Link 实现客户端导航 + 自动预取。', '用 useRouter 编程式跳转（需 Client Component）。', '用 redirect 服务端重定向。'],
    notes: ['Link 默认 prefetch：静态路由进视口即预取，动态路由点击时预取。', 'usePathname/useSearchParams 从 next/navigation 导入。', 'redirect 在 Server Component / Server Action / Route Handler 中可用。'],
    problem: '解决"怎么在 Next.js 里做页面跳转、编程式导航和服务端重定向"的问题。',
  },
  {
    id: 'X_20', title: 'Metadata 与 SEO', navTitle: 'Metadata', category: '优化',
    path: '/nextjs/x-20/metadata', summary: '用 Metadata API（静态 metadata + 动态 generateMetadata）管理 title、description、OG 等 SEO 元信息。',
    demo: X20Metadata, code: X20Code, language: 'vue',
    principle: 'App Router 用 Metadata API 取代 Pages Router 的 next/head：导出 metadata 对象（静态）或 generateMetadata 函数（动态）。还支持文件约定（favicon/icon/opengraph-image）和 sitemap.ts/robots.ts 动态生成，子页面 metadata 覆盖父级。',
    flow: ['用 metadata 对象设置静态 title/description。', '用 generateMetadata 按参数动态生成。', '用 sitemap.ts/robots.ts 动态生成站点地图和爬虫规则。'],
    notes: ['title.template 让子页标题自动拼接父模板（如 "%s | 小松鼠"）。', 'opengraph-image.tsx 用 ImageResponse 动态生成 OG 图。', 'metadata 自动去重，子页面同名字段覆盖父级。'],
    problem: '解决"App Router 怎么管理 SEO 元信息、动态页面怎么设置 title"的问题。',
  },
  {
    id: 'X_21', title: 'Middleware 中间件', navTitle: '中间件', category: '工程',
    path: '/nextjs/x-21/middleware', summary: '用 middleware.ts 在请求到达路由前执行认证、重定向、A/B 测试等逻辑。',
    demo: X21Middleware, code: X21Code, language: 'vue',
    principle: 'Middleware 在每个请求、缓存前运行（Edge Runtime），可重写、重定向、改请求头/响应头。文件放在项目根或 src/ 下的 middleware.ts。用 matcher 限定匹配路径提升性能，适合认证鉴权、i18n、A/B 测试、灰度发布。',
    flow: ['在项目根创建 middleware.ts。', '用 NextResponse.redirect/next 重定向或放行。', '用 matcher 限定执行路径。'],
    notes: ['Middleware 运行在 Edge Runtime，不能用 Node API，依赖需兼容 Edge。', 'matcher 排除静态资源避免无谓执行。', '可注入请求头供下游 Server Component 读取。'],
    problem: '解决"如何在路由执行前统一做鉴权、重定向、A/B 测试"的问题。',
  },
  {
    id: 'X_22', title: '环境变量与 next.config', navTitle: '环境配置', category: '工程',
    path: '/nextjs/x-22/env-config', summary: '掌握 NEXT_PUBLIC_ 前缀规则、env 文件优先级和 next.config.js 核心配置项。',
    demo: X22EnvConfig, code: X22Code, language: 'vue',
    principle: '环境变量加 NEXT_PUBLIC_ 前缀则客户端可见（打包进 bundle），无前缀仅服务端可用。env 文件优先级：.env.local > .env.[环境] > .env。next.config.js 集中配置 reactStrictMode、images、rewrites、redirects、output 等。',
    flow: ['用 NEXT_PUBLIC_ 前缀区分客户端/服务端环境变量。', '理解 .env.local 覆盖优先级。', '在 next.config.js 配置图片域名、重写、导出模式。'],
    notes: ['密钥绝不加 NEXT_PUBLIC_，否则泄露到前端 bundle。', '.env.local 被 gitignore，放本地敏感配置。', 'output: "standalone" 生成独立部署包，"export" 纯静态导出。'],
    problem: '解决"环境变量怎么分客户端和服务端、next.config.js 能配什么"的问题。',
  },
  {
    id: 'X_23', title: '国际化 i18n', navTitle: '国际化', category: '工程',
    path: '/nextjs/x-23/i18n', summary: '用 App Router 的 [lang] 动态路由 + middleware 语言检测实现多语言站点。',
    demo: X23I18n, code: X23Code, language: 'vue',
    principle: 'App Router 推荐用 [lang] 动态路由实现 i18n：每种语言独立 URL（SEO 友好），middleware 根据 Accept-Language 自动检测重定向，字典按需 import 加载。配合 hreflang 标签和 Intl API 处理复数/日期格式。',
    flow: ['用 [lang] 动态路由为每种语言生成独立 URL。', 'middleware 根据 Accept-Language 自动重定向。', '按需 import 字典，用 Context 下发翻译函数。'],
    notes: ['每种语言独立 URL 利于 SEO，配合 hreflang 标签。', '字典按需 import 避免全量打包。', 'next-intl 是社区流行的 App Router i18n 方案。'],
    problem: '解决"App Router 怎么做多语言、怎么自动检测用户语言"的问题。',
  },
  {
    id: 'X_24', title: '部署与 Vercel', navTitle: '部署', category: '工程',
    path: '/nextjs/x-24/deployment', summary: '掌握 Vercel、Node 自托管、Docker、静态导出四种部署目标的特点与配置。',
    demo: X24Deployment, code: X24Code, language: 'vue',
    principle: 'Next.js 支持多种部署目标：Vercel（全托管零配置）、Node Server（output: standalone 自托管）、Docker（基于 standalone 构建镜像）、Static Export（output: export 纯静态）。静态导出有限制：不支持 Server Actions/Middleware/动态图片优化。',
    flow: ['根据需求选择部署目标（Vercel/Node/Docker/静态）。', '配置 output 模式和环境变量。', '设置 CDN、域名、HTTPS 和监控。'],
    notes: ['Vercel 是官方平台，零配置支持所有特性。', 'standalone 不含 node_modules，需 COPY 静态资源。', '静态导出不支持 Server Actions、Middleware、Image Optimization。'],
    problem: '解决"Next.js 项目能部署到哪里、各部署方式有什么限制"的问题。',
  },
]

export const lessonIdMap: ReadonlyMap<string, Lesson> = new Map(
  lessons.map((lesson) => [lesson.id, lesson]),
)

export const lessonPathMap: ReadonlyMap<string, Lesson> = new Map(
  lessons.map((lesson) => [lesson.path, lesson]),
)

export const knowledgeCategoryMap: ReadonlyMap<string, KnowledgeCategory> = new Map(
  knowledgeCategories.map((category) => [category.id, category]),
)
