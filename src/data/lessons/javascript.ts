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


export const lessons: Lesson[] = [
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
    principle: '函数的作用域在定义位置确定（词法作用域），内部函数被作为返回值或回调传递后仍能访问外层变量；这个内部函数与它能看到的词法环境组合起来就是闭包，是封装私有状态和实现柯里化、防抖等模式的基础。',
    flow: ['外层函数创建局部状态和访问该状态的内部函数。', '外层函数把内部函数作为返回值交给外部代码。', '外部代码每次调用返回的函数，继续读写同一份词法环境。'],
    notes: ['闭包适合封装私有状态，模拟面向对象的私有成员。', '长期持有的大对象会阻止 GC 回收，注意及时解除引用。', '循环里创建闭包时需注意变量捕获，建议用 IIFE 或 let 块作用域隔离。'],
    problem: '解决"回调为什么能记住外层变量，以及怎样封装私有状态"的问题。',
  },
{
    id: 'J_03', title: '数组的不可变转换流水线', navTitle: '数组方法', category: '集合与数据',
    path: '/javascript/j-3/array-pipeline', summary: '组合 filter、map 与 toSorted 完成课程搜索和排序。',
    demo: J03ArrayPipeline, code: J03Code, language: 'javascript',
    principle: '数组迭代方法把筛选、映射、聚合和排序拆为可组合步骤；优先使用返回新数组的方法（map、filter、toSorted、toReversed）能减少共享状态被意外修改，也是 React/Vue 不可变更新范式的基础。',
    flow: ['filter 缩小数据集合到符合条件的元素。', 'map 转换每个元素为新的展示结构。', 'toSorted 在不修改原数组的前提下按指定规则排序。'],
    notes: ['map 不应用来执行纯副作用，那是 forEach 的职责。', '大数据量要关注多次遍历成本，必要时使用 reduce 合并步骤。', '原数组在管道中应保持不变，下游可放心缓存。'],
    problem: '解决"如何以可读、可预测的方式处理列表数据"的问题。',
  },
{
    id: 'J_04', title: '对象、解构与展开语法', navTitle: '对象操作', category: '集合与数据',
    path: '/javascript/j-4/object-operations', summary: '通过用户资料更新掌握属性访问、解构、剩余与浅拷贝。',
    demo: J04ObjectOperations, code: J04Code, language: 'javascript',
    principle: '解构按属性提取值，剩余语法收集未提取字段，展开语法把可枚举自有属性复制到新对象；这些复制都是浅层的，深层对象仍然共享引用，更新时需要明确按不可变路径创建新引用。',
    flow: ['从源对象中解构需要的字段。', '用剩余语法保留其他字段，避免漏改。', '展开语法生成带覆盖值的新对象，保持原对象不可变。'],
    notes: ['嵌套对象仍共享引用，深层更新要逐层创建新对象。', '属性覆盖顺序由展开位置决定，后展开的覆盖先展开的。', 'structuredClone 可以一次性深拷贝简单数据。'],
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
    principle: '对象通过内部 [[Prototype]] 链接查找属性，整条链上的方法都可以被实例共享；class 提供更清晰的构造与继承语法，但底层依然是基于原型的委托机制，理解这点才能解释属性遮蔽、原型链查询与 instanceof 的工作方式。',
    flow: ['构造函数初始化实例自身的字段。', '方法挂载到 prototype 上实现共享，节省内存。', 'extends 建立子类原型到父类原型的链接，实现继承。'],
    notes: ['优先组合而非过深继承，组合更灵活、副作用更少。', '私有字段可使用 #name 语法，外部无法直接访问。', 'Object.create 与 Object.setPrototypeOf 可手动操控原型关系。'],
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
    principle: '调用栈清空后，事件循环会先清空微任务队列（Promise、queueMicrotask、MutationObserver），再取出下一个宏任务执行；浏览器的渲染机会通常发生在两个宏任务之间，理解这个顺序才能解释异步日志为何与书写顺序不同。',
    flow: ['执行当前脚本中的同步代码，建立调用栈。', '调用栈清空后清空微任务队列中的全部回调。', '渲染（如果到了帧时机），再取出下一个宏任务执行。'],
    notes: ['大量微任务也会阻塞渲染，要控制单次微任务工作量。', 'setTimeout(fn, 0) 不代表立即执行，最小延迟受宏任务调度影响。', 'Node.js 的 process.nextTick 优先级高于 Promise 微任务。'],
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
    principle: 'DOM 事件经历捕获（capture）、目标（target）和冒泡（bubble）三个阶段，事件委托利用冒泡在稳定的父节点统一监听，再通过 closest() 或匹配选择器判断真实交互目标，动态列表也能高效工作。',
    flow: ['在父容器注册一个冒泡阶段的监听器。', '从 event.target 沿 DOM 树向上寻找匹配元素。', '读取 data-* 属性或键值执行对应分支行为。'],
    notes: ['不是所有事件都会冒泡（如 focus、blur），必要时用 capture 阶段。', '用 closest 时要确认结果仍在委托容器内，避免误匹配。', '委托显著减少监听器数量，也方便统一处理动态增删的子节点。'],
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
    principle: 'Proxy 用 new Proxy(target, handler) 包装目标对象并拦截 get/set/has/deleteProperty 等基本操作；Reflect 提供与 Proxy 陷阱一一对应的默认行为，转发时可以正确处理原型链、this 绑定和返回值，是实现响应式、ORM、校验库的核心原语。',
    flow: ['用 new Proxy 包装需要增强的目标对象。', '在对应的陷阱（trap）中执行自定义逻辑。', '通过 Reflect 对应的方法转发默认行为，保证语义一致。'],
    notes: ['Proxy 不能代理对象的内部槽位（如 Date 的时间戳）。', 'Vue 3 响应式系统底层就是基于 Proxy 的依赖收集与触发。', '深层代理需要递归包装，回收时也要逐层释放。'],
    problem: '解决"如何透明拦截和增强对象行为，并保持默认语义和响应式"的问题。',
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
    principle: '高阶函数接收或返回函数；柯里化把多参函数拆为单参链，便于逐步配置；pipe/compose 把多个单步函数串联成流水线，让数据沿函数链流动；防抖和节流控制高频事件回调的执行频率，是 UI 交互和性能优化的常见工具。',
    flow: ['用柯里化或偏函数把多参函数拆为可组合的小函数。', '用 pipe 或 compose 把单步函数组合成完整处理流程。', '用防抖/节流控制滚动、输入等高频事件回调的执行节奏。'],
    notes: ['Array.prototype.map、filter、reduce 本身就是高阶函数。', 'compose 从右到左执行，pipe 从左到右执行，选择时保持一致。', '防抖在最后一次触发后延迟执行，节流保证一定间隔内最多执行一次。'],
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
    principle: '字符串方法覆盖搜索、截取、替换和大小写转换；Intl API 提供地区感知的日期、数字、货币和排序格式化，是国际化的标准方案，可以避免自己写复杂的本地化逻辑。',
    flow: ['用 includes、startsWith、matchAll 搜索文本和提取匹配。', '用 replaceAll、slice、split 批量替换和拆分。', '用 Intl.DateTimeFormat/NumberFormat 格式化输出并指定 locale。'],
    notes: ['字符串是不可变的，所有方法都返回新字符串。', 'Intl.Collator 可正确排序中文等多语言文本，胜过默认 < 运算。', 'Intl.RelativeTimeFormat 输出"3 天前"等相对时间文案。'],
    problem: '解决"如何高效处理字符串搜索替换和地区化格式显示"的问题。',
  },
{
    id: 'J_24', title: '逻辑运算、位运算与权限模型', navTitle: '逻辑与位运算', category: '语言基础',
    path: '/javascript/j-24/logical-bitwise', summary: '用位运算实现权限标志模型，掌握逻辑短路和赋值运算符。',
    demo: J24LogicalBitwise, code: J24Code, language: 'javascript',
    principle: '逻辑运算符支持短路求值和条件赋值（&&、||、??、&&=、||=、??=），让默认值、守卫和链式条件更紧凑；位运算在 32 位整数层面操作二进制位，适合实现权限标志、状态压缩、哈希计算等场景。',
    flow: ['用 &&、||、?? 短路求值和默认值。', '用位运算 OR 把多个权限标志组合到一个整数。', '用 AND 检查、XOR 切换权限位。'],
    notes: ['??=、||=、&&= 只在条件满足时才赋值，可以简化默认值的写法。', '位运算对 32 位整数操作，超出范围会截断，需留意数值边界。', '权限模型可以用枚举或字面量常量定义可读性更高的标志。'],
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
  }
]
