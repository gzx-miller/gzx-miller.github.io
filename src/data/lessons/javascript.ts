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
    path: '/javascript/j-1/types-equality', summary: '掌握 7 种原始类型与引用类型的 typeof 行为、显式转换（Number/String/Boolean）、隐式转换规则，以及 == 与 === 的经典差异。',
    demo: J01TypesEquality, code: J01Code, language: 'javascript',
    principle: 'JavaScript 是动态类型语言，运算时会按规范触发隐式类型转换。typeof 对 null 返回 "object" 是历史遗留 bug；除函数外，引用类型的 typeof 统一为 "object"，判断数组须用 Array.isArray()。显式转换用 Number()、String()、Boolean()；falsy 值共有 false、0、-0、0n、""、null、undefined、NaN 八种，其余值（含空数组、空对象）都是 truthy。== 会先做类型转换再比较，=== 要求类型与值都一致。',
    flow: ['用 typeof 识别值在运行时的类型，注意 function 与 null 两个例外。', '在输入边界显式调用 Number()/String()/Boolean() 转换，避免依赖隐式规则。', '始终用 === 与 !== 做相等比较。', '用 Number.isNaN()、Array.isArray()、Object.is() 处理特殊边界。'],
    notes: ['typeof null → "object" 是语言早期实现的遗留问题。', '全局 isNaN 会先把参数转成数字再判断，判断 NaN 须用 Number.isNaN()。', 'falsy 值包括 false、0、-0、0n、""、null、undefined、NaN，空数组和空对象都是 truthy。', 'Object.is() 认为 NaN 与自身相等，且能区分 +0 与 -0。'],
    problem: '解决"表单输入、API 参数比较时为什么出现反直觉结果，以及如何正确识别和转换 JavaScript 类型"的问题。',
  },
{
    id: 'J_02', title: '词法作用域与闭包', navTitle: '作用域与闭包', category: '语言基础',
    path: '/javascript/j-2/closure', summary: '用购物车计数器理解函数如何保留创建时的变量环境。',
    demo: J02Closure, code: J02Code, language: 'javascript',
    principle: '函数形成的作用域在定义位置确定（词法作用域），内部函数被当作返回值转交给外部后，仍能访问并持续操作创建它的词法环境中的变量；这个“内部函数 + 词法环境”的组合就是闭包，是封装私有状态的基石。',
    flow: ['外层函数在自己的词法环境中创建局部状态（如购物车计数）。', '把能够读写该状态的内部函数作为返回值交给外部。', '外部每调用一次返回的函数，都继续读写同一份词法环境。'],
    notes: ['每次调用外层函数都会创建独立的词法环境，各自的计数互不干扰。', '闭包适合封装外部无法直接读写的私有状态。', '长期被闭包持有的大对象会阻止 GC 回收，用完后应及时解除引用。'],
    problem: '解决"回调为什么能记住外层变量，以及怎样封装私有状态"的问题。',
  },
{
    id: 'J_03', title: '数组的不可变转换流水线', navTitle: '数组方法', category: '集合与数据',
    path: '/javascript/j-3/array-pipeline', summary: '用 filter 筛选课程、toSorted 排序，组合成课程的不可变搜索转换流水线。',
    demo: J03ArrayPipeline, code: J03Code, language: 'javascript',
    principle: '数组处理可拆成筛选、映射等可组合的步骤；其中 filter、toSorted 等返回新数组而不改动原数组，链式调用形成只读的转换流水线，避免通过共享引用意外修改状态，也是 React / Vue 不可变更新范式的基础。',
    flow: ['用 filter 把结果缩小到标题匹配关键词的课程。', '把筛选结果传给 toSorted，按传入的比较函数得到评分降序的新数组。', '链式组合多个返回新数组的方法，使流水线可预测且不改原数组。'],
    notes: ['toSorted 返回排序后的新数组，区别于直接修改原数组的 sort（ES2023）。', 'map 用于转换元素、forEach 用于执行副作用，不要把 map 当副作用工具。', '流水线全程不改原数组，其引用可被安全缓存与复用。'],
    problem: '解决"如何以可读、可预测的方式处理列表数据"的问题。',
  },
{
    id: 'J_04', title: '对象、解构与展开语法', navTitle: '对象操作', category: '集合与数据',
    path: '/javascript/j-4/object-operations', summary: '通过用户资料更新掌握属性访问、解构、剩余与浅拷贝。',
    demo: J04ObjectOperations, code: J04Code, language: 'javascript',
    principle: '解构按属性名提取值，剩余语法收集未被提取的字段，展开语法把原对象可枚举的自有属性复制到新对象；这三种操作都只做浅层复制，嵌套对象仍共享引用，局部更新时要按不可变路径逐层创建新对象。',
    flow: ['从源对象解构出需要的字段，用剩余语法收集其余字段。', '通过展开语法把剩余字段与新的覆盖值合并进新对象。', '保持原对象不变，用新引用承接更新结果。'],
    notes: ['浅拷贝下嵌套对象仍共享引用，深层更新需逐层创建新对象。', '同名属性按展开位置决定覆盖顺序，后展开的替换先展开的。', '需要完整深拷贝时再考虑 structuredClone，简单浅拷贝用展开即可。'],
    problem: '解决"如何清晰地读取和不可变更新对象字段"的问题。',
  },
{
    id: 'J_05', title: '函数调用方式与 this 绑定', navTitle: 'this 绑定', category: '对象模型',
    path: '/javascript/j-5/this-binding', summary: '比较方法调用、脱离对象调用与 call 显式绑定。',
    demo: J05ThisBinding, code: J05Code, language: 'javascript',
    principle: '普通函数的 this 在调用时才确定，取决于调用表达式本身（方法调用指向调用者，独立调用在严格模式下为 undefined），而箭头函数捕获定义时所在函数作用域的 this，不随调用方式改变；call、apply、bind 可显式指定普通函数的接收者。',
    flow: ['先看函数实际的调用表达式，判断是否以“对象.方法()”形式调用。', '方法一旦被脱离对象独立调用，this 就不再指向原对象。', '用 call 显式指定接收者，或在回调场景用箭头函数保持外层 this。'],
    notes: ['this 不指向函数定义时所在的“父对象”，只由调用方式决定。', '严格模式下独立调用普通函数，this 为 undefined；非严格模式会指向全局对象。', '类方法作为回调单独传参同样会丢失绑定，需用箭头函数或 bind 修正。'],
    problem: '解决"对象方法作为回调后 this 为什么变了"的问题。',
  },
{
    id: 'J_06', title: '原型链、class 与继承', navTitle: '原型与类', category: '对象模型',
    path: '/javascript/j-6/prototype-class', summary: '通过课程模型理解实例属性、共享方法与原型继承。',
    demo: J06PrototypeClass, code: J06Code, language: 'javascript',
    principle: '对象通过内部 [[Prototype]] 链接查找属性，整条链上的方法都可以被实例共享；class 提供更清晰的构造与继承语法，但底层依然是基于原型的委托机制，理解这点才能解释属性遮蔽、原型链查询与 instanceof 的工作方式。',
    flow: ['构造函数初始化实例自身的字段（如 title、hours）。', '实例方法定义在 prototype 上，被所有实例共享，节省内存。', 'extends 把子类原型链接到父类，super 调用父类同名方法。'],
    notes: ['优先组合而非过深继承，组合更灵活、副作用更少。', '私有字段可使用 #name 语法，外部无法直接访问。', 'Object.create 与 Object.setPrototypeOf 可手动操控原型关系。'],
    problem: '解决"JavaScript 对象如何共享行为以及 class 的底层机制"的问题。',
  },
{
    id: 'J_07', title: 'Promise 组合与并发请求', navTitle: 'Promise 并发', category: '异步机制',
    path: '/javascript/j-7/promise-combinators', summary: '用 Promise.all 并发加载看板数据，并比较常用组合器语义。',
    demo: J07PromiseCombinators, code: J07Code, language: 'javascript',
    principle: 'Promise 表示一个未来会落定（fulfilled 或 rejected）的结果；并发组合器并行启动多个异步任务并按不同策略聚合：Promise.all 全部成功才整体成功、allSettled 等全部结束并保留各自结果、race 取最先落定者、any 取最先成功者。',
    flow: ['把互不依赖的任务同时发起，避免串行等待。', '按业务对失败的容忍度选择 all / allSettled / any 等组合器。', '对聚合结果统一解构取值，并在失败分支处理异常。'],
    notes: ['Promise.all 在首个 reject 时立即整体拒绝，但其余任务仍会继续执行。', 'Promise.any 在全部失败时才以 AggregateError 拒绝。', '高并发仍要考虑接口限流与服务端承载能力。'],
    problem: '解决"多个异步请求如何高效并发并正确处理失败"的问题。',
  },
{
    id: 'J_08', title: '事件循环、任务与微任务', navTitle: '事件循环', category: '异步机制',
    path: '/javascript/j-8/event-loop', summary: '观察同步代码、Promise 微任务和定时器任务的执行顺序。',
    demo: J08EventLoop, code: J08Code, language: 'javascript',
    principle: '调用栈清空后，事件循环会先清空整个微任务队列（Promise.then、queueMicrotask、MutationObserver），再取出下一个宏任务（如定时器回调）执行；浏览器若到帧时机，绘制一般发生在宏任务之间，理解这一顺序才能解释异步日志为何不同于书写顺序。',
    flow: ['执行当前脚本中的同步代码，建立调用栈。', '调用栈清空后清空微任务队列中的全部回调。', '渲染（如果到了帧时机），再取出下一个宏任务执行。'],
    notes: ['大量微任务也会阻塞渲染，要控制单次微任务工作量。', 'setTimeout(fn, 0) 不代表立即执行，最小延迟受宏任务调度影响。', 'Node.js 的 process.nextTick 优先级高于 Promise 微任务。'],
    problem: '解决"异步日志顺序为何与代码书写顺序不同"的问题。',
  },
{
    id: 'J_09', title: 'ES Modules 与动态导入', navTitle: '模块化', category: '模块与浏览器',
    path: '/javascript/j-9/modules', summary: '掌握静态 import/export、模块作用域和 import() 按需加载。',
    demo: J09Modules, code: J09Code, language: 'javascript',
    principle: 'ES Module 具有独立作用域和静态依赖结构，便于打包器分析；动态 import 返回 Promise，可把低频功能拆成独立资源。',
    flow: ['用具名或默认导出声明模块的公共接口。', '对首屏必需的依赖使用静态 import，便于打包器静态分析与 tree shaking。', '对低频模块用动态 import() 按需加载，返回 Promise 并处理加载状态。'],
    notes: ['ES Module 默认运行于严格模式。', '顶层 await 只能在模块顶层使用，Node 端需为 ES Module 环境。', '注意避免环形依赖在初始化阶段读取到未定义的值。'],
    problem: '解决"如何组织模块边界并减少首屏加载代码"的问题。',
  },
{
    id: 'J_10', title: 'DOM 事件传播与事件委托', navTitle: '事件委托', category: '模块与浏览器',
    path: '/javascript/j-10/event-delegation', summary: '用课程列表理解捕获、冒泡、target 与 currentTarget。',
    demo: J10EventDelegation, code: J10Code, language: 'javascript',
    principle: 'DOM 事件经历捕获（capture）、目标（target）和冒泡（bubble）三个阶段，事件委托利用冒泡在稳定的父节点统一监听，再通过 closest() 或匹配选择器判断真实交互目标，动态列表也能高效工作。',
    flow: ['在稳定的父容器注册一个冒泡阶段的 click 监听器。', '用 event.target.closest(选择器) 从实际触发元素向上寻找匹配项。', '通过 dataset 读取 data-* 属性并执行对应分支行为。'],
    notes: ['不是所有事件都会冒泡（如 focus、blur、scroll），必要时改用捕获阶段。', 'closest 会一直向上查到 document，使用时要结合委托容器判断是否误匹配。', '委托显著减少监听器数量，且对动态增删的子节点天然生效。'],
    problem: '解决"动态列表如何减少监听器并统一处理交互"的问题。',
  },
{
    id: 'J_11', title: 'async/await 与异步流控', navTitle: 'async/await', category: '异步机制',
    path: '/javascript/j-11/async-await', summary: '用 async 函数和 await 表达串行与并发加载，掌握异步错误处理。',
    demo: J11AsyncAwait, code: J11Code, language: 'javascript',
    principle: 'async 函数总是返回 Promise，await 会暂停该函数直到 Promise 落定并取出结果；串行用 for...of 逐个 await，并发用 Promise.all 同时发起再一起等待，配合 try/catch/finally 统一处理错误与清理。',
    flow: ['用 async 声明异步函数，函数体可整体 await。', '串行需求用 for...of 逐个 await，并发热点用 Promise.all 同时发起。', '用 try/catch/finally 捕获 await 链上的拒绝并执行清理。'],
    notes: ['await 只能在 async 函数内或 ES Module 顶层使用。', '串行总耗时约为各步之和，并发约为最慢一步；实际并发仍要留意接口限流。'],
    problem: '解决"如何用同步写法组织异步流程并选择正确的并发策略"的问题。',
  },
{
    id: 'J_12', title: '迭代协议与生成器', navTitle: '迭代器与生成器', category: '集合与数据',
    path: '/javascript/j-12/iterators-generators', summary: '用生成器逐步产出课程列表，理解迭代协议和 yield 通信。',
    demo: J12IteratorsGenerators, code: J12Code, language: 'javascript',
    principle: '迭代器协议要求 next() 返回 { value, done }；生成器函数用 yield 暂停执行、下次 next() 恢复，并支持通过 next(value) 向生成器回传数据，以及用 yield* 把产出委托给其他可迭代对象。',
    flow: ['实现 [Symbol.iterator] 让对象可被 for...of 惰性消费。', '用 function* 配合 yield 创建生成器，yield 处暂停、next() 恢复。', '用 next(value) 把值回传给上一个 yield 表达式，实现双向通信。'],
    notes: ['for...of、展开语法、解构等都依赖迭代协议。', 'yield* 把当前生成器委托给另一个可迭代对象，逐个转发其产出。'],
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
    path: '/javascript/j-15/regexp', summary: '用正则匹配手机号、邮箱、价格与日期，掌握捕获组和前后断言。',
    demo: J15RegExp, code: J15Code, language: 'javascript',
    principle: '正则表达式用模式匹配字符串；字符类、量词、捕获组与前后断言组合出精确规则，test() 用于验证、exec() 提取单次匹配（含命名组）、matchAll() 与 replace() 处理所有匹配和替换。',
    flow: ['用字符类与量词描述匹配模式（如手机号 ^1[3-9] 开头加 9 位数字）。', '用捕获组与命名组（?<name>）提取子串。', '用正/负前瞻与后行断言限定上下文而不消耗字符。'],
    notes: ['带 g 标志的正则多次 exec/test 会因 lastIndex 前进产生不同结果。', '复杂校验建议拆成多个边界清晰的正则分别判断。'],
    problem: '解决"如何用声明式模式匹配和提取字符串中的结构化信息"的问题。',
  },
{
    id: 'J_16', title: '错误处理与自定义异常', navTitle: '错误处理', category: '语言基础',
    path: '/javascript/j-16/error-handling', summary: '用 try/catch/finally 和自定义 Error 类构建可恢复的错误流。',
    demo: J16ErrorHandling, code: J16Code, language: 'javascript',
    principle: 'try/catch 捕获同步异常以及 async/await 中被拒绝的 Promise，finally 无论成败都执行清理；通过继承 Error 定义携带业务字段的异常子类，并可用 cause 选项把原始错误挂到新错误上形成错误链。',
    flow: ['用 try 包裹可能抛错的代码（如 JSON.parse、网络请求）。', '在 catch 中按错误类型（或 err.name）分支处理。', '用 finally 执行必达的清理逻辑，必要时包装错误并传入 cause。'],
    notes: ['try/catch 捕获不到 setTimeout 等异步回调内部的同步抛出。', 'Error 构造器的 cause 选项（ES2022）可保留原始错误的引用。', '建议依据错误类型分支处理，而不是仅解析 message 字符串。'],
    problem: '解决"如何优雅捕获异常、区分错误类型并保留错误上下文"的问题。',
  },
{
    id: 'J_17', title: '可选链、空值合并与逻辑赋值', navTitle: '可选链与空值合并', category: '语言基础',
    path: '/javascript/j-17/optional-nullish', summary: '安全访问深层属性、处理空值默认值和逻辑赋值运算符。',
    demo: J17OptionalNullish, code: J17Code, language: 'javascript',
    principle: '可选链 ?. 在遇到 null/undefined 时短路并返回 undefined，避免抛出 TypeError；空值合并 ?? 只在左侧为 null/undefined 时取右侧；??=、||=、&&= 把“判断 + 赋值”合并成一步。',
    flow: ['用 ?. 安全访问嵌套属性、可选索引与可选函数调用。', '用 ?? 提供仅针对空值（null/undefined）的默认值。', '用逻辑赋值运算符精简条件初始化。'],
    notes: ['?? 与 || 的差别在于：|| 对空字符串和 0 等 falsy 值也会取右侧。', '?. 与 ?? 都可单独使用，?.() 可安全调用可能不存在的函数。'],
    problem: '解决"如何简洁地处理深层对象的空值和条件赋值"的问题。',
  },
{
    id: 'J_18', title: '高阶函数、柯里化与组合', navTitle: '高阶函数', category: '函数与组合',
    path: '/javascript/j-18/higher-order', summary: '用函数组合构建价格计算器，掌握柯里化、偏函数和防抖节流。',
    demo: J18HigherOrder, code: J18Code, language: 'javascript',
    principle: '高阶函数接收或返回函数；柯里化把多参函数拆为单参链，便于逐步配置；pipe/compose 把多个单步函数串联成流水线，让数据沿函数链流动；防抖和节流控制高频事件回调的执行频率，是 UI 交互和性能优化的常见工具。',
    flow: ['用柯里化把多参数函数拆为单参链，边传参边形成配置。', '用 pipe（从左到右）或 compose（从右到左）把单步函数串成处理流水线。', '用防抖/节流包一层并返回新函数，控制高频事件的执行节奏。'],
    notes: ['Array.prototype.map、filter、reduce 本身就是高阶函数。', 'pipe 从左到右执行，compose 从右到左执行，混合使用时要注意顺序保持一致。', '防抖在停手后才执行一次，节流保证一定间隔内至多执行一次。'],
    problem: '解决"如何用函数组合代替重复代码并控制执行频率"的问题。',
  },
{
    id: 'J_19', title: '模板字面量与标签模板', navTitle: '模板字面量', category: '语言基础',
    path: '/javascript/j-19/template-literals', summary: '用标签模板实现文本高亮与 HTML 转义，掌握原始字符串和 DSL 构建。',
    demo: J19TemplateLiterals, code: J19Code, language: 'javascript',
    principle: '模板字面量支持 ${} 插值与多行文本；标签模板把字符串片段与表达式值分别交给函数，函数可据此做转换输出，是构建 HTML 转义、高亮、CSS-in-JS 等 DSL 的基础。',
    flow: ['用 ${} 在模板中嵌入任意表达式。', '定义标签函数，第一个参数为字符串片段数组 strings，其余为插值 values。', '用 String.raw 得到不处理转义符的原始字符串。'],
    notes: ['标签模板中字符串片段的数量 = 插值数量 + 1。', 'graphql-tag、styled-components 等都基于标签模板实现 DSL。'],
    problem: '解决"如何在字符串中嵌入逻辑并构建领域专用语言"的问题。',
  },
{
    id: 'J_20', title: 'JSON 与结构化克隆', navTitle: 'JSON 与克隆', category: '集合与数据',
    path: '/javascript/j-20/json-clone', summary: '用 replacer/reviver 控制序列化，用 structuredClone 深拷贝。',
    demo: J20JsonClone, code: J20Code, language: 'javascript',
    principle: 'JSON.stringify 可通过 replacer（函数或数组）过滤并转换值，JSON.parse 的 reviver 在还原时重建类型；structuredClone 走结构化克隆算法，可深拷贝循环引用以及 Date、Map、Set、ArrayBuffer 等内置类型。',
    flow: ['用 replacer 函数过滤字段、把 Date 序列化为字符串，或用 toJSON 自定义输出。', '用 reviver 在解析时把日期字符串还原回 Date 实例。', '对含循环引用的对象用 structuredClone 做深拷贝。'],
    notes: ['JSON 无法表示 undefined、函数、Symbol 与循环引用，Date 会退化为字符串。', 'structuredClone 能处理循环引用，但不支持函数与 DOM 节点。'],
    problem: '解决"如何正确序列化复杂对象并实现可靠的深拷贝"的问题。',
  },
{
    id: 'J_21', title: '属性描述符与对象控制', navTitle: '属性描述符', category: '对象模型',
    path: '/javascript/j-21/property-descriptors', summary: '用 defineProperty 精确控制属性行为，用 freeze/seal 锁定对象。',
    demo: J21PropertyDescriptors, code: J21Code, language: 'javascript',
    principle: '每个自有属性的数据属性描述符含 configurable / enumerable / writable；存取属性描述符用 get / set 提供经过校验或计算的值；preventExtensions、seal、freeze 逐级收紧对对象增删改的限制。',
    flow: ['用 defineProperty 精确设置单个属性的数据或存取描述符。', '用 getter/setter 实现取值时计算与赋值校验（如拦截负数）。', '按需用 preventExtensions / seal / freeze 锁定对象，防止意外修改。'],
    notes: ['Object.freeze 只冻结一层，嵌套对象仍需递归处理。', 'Object.keys / values / entries 只覆盖可枚举的自有属性。'],
    problem: '解决"如何精确控制对象属性的可写、可枚举和可配置性"的问题。',
  },
{
    id: 'J_22', title: 'Symbol 与内置符号', navTitle: 'Symbol', category: '语言基础',
    path: '/javascript/j-22/symbol', summary: '用 Symbol 实现唯一标识和自定义迭代，理解内置符号的作用。',
    demo: J22Symbol, code: J22Code, language: 'javascript',
    principle: 'Symbol 生成唯一标识符；内置符号（Symbol.iterator、Symbol.toPrimitive 等）允许自定义对象的迭代、转换和字符串化行为。',
    flow: ['用 Symbol() 创建唯一的值，作为不冲突的属性键。', '实现 Symbol.iterator 让对象可被 for...of 和展开消费。', '用 Symbol.toPrimitive 控制对象在运算中的类型转换。'],
    notes: ['Symbol.for 在全局注册表中按描述共享，Symbol.keyFor 可反向查询。', 'Symbol.hasInstance 可自定义 instanceof 行为，Symbol.toStringTag 自定义 toString 标签。'],
    problem: '解决"如何创建不冲突的属性键并自定义对象的内置行为"的问题。',
  },
{
    id: 'J_23', title: '字符串方法与国际化', navTitle: '字符串与 Intl', category: '语言基础',
    path: '/javascript/j-23/string-intl', summary: '用字符串方法搜索和转换文本，用 Intl 格式化日期和货币。',
    demo: J23StringIntl, code: J23Code, language: 'javascript',
    principle: '这组字符串方法覆盖搜索、截取、批量替换、拆分、填充与修剪，且都返回新字符串；Intl API 提供地区感知的日期、数字、货币、排序等格式化能力，是国际化的标准方案，不必自己手写本地化逻辑。',
    flow: ['用 includes、startsWith、matchAll 搜索文本和提取匹配。', '用 replaceAll、slice、split 批量替换和拆分。', '用 Intl.DateTimeFormat/NumberFormat 格式化输出并指定 locale。'],
    notes: ['字符串是不可变的，所有方法都返回新字符串。', 'Intl.Collator 可正确排序中文等多语言文本，胜过默认 < 运算。', 'Intl.RelativeTimeFormat 输出"3 天前"等相对时间文案。'],
    problem: '解决"如何高效处理字符串搜索替换和地区化格式显示"的问题。',
  },
{
    id: 'J_24', title: '逻辑运算、位运算与权限模型', navTitle: '逻辑与位运算', category: '语言基础',
    path: '/javascript/j-24/logical-bitwise', summary: '用位运算实现权限标志模型，掌握逻辑短路和赋值运算符。',
    demo: J24LogicalBitwise, code: J24Code, language: 'javascript',
    principle: '逻辑运算符支持短路求值，&&=、||=、??= 把条件判断与赋值合并成一步；位运算把操作数当作 32 位有符号整数逐位操作，适合用独立的位来表示并组合权限标志、状态开关等场景。',
    flow: ['用 &&、||、?? 做短路取值与默认值兜底。', '用按位或 | 把多个权限标志合并进单个整数。', '用按位与 & 检查权限、按位异或 ^ 切换权限位。'],
    notes: ['??=、||=、&&= 只在条件满足时才赋值，可简化默认值写法。', '位运算以 32 位有符号整数为基准，超出范围会截断，需留意数值边界。', '权限标志可用枚举或字面量常量定义，提升可读性。'],
    problem: '解决"如何用位运算实现高效的权限和状态管理"的问题。',
  },
{
    id: 'J_25', title: 'Fetch API 与网络请求', navTitle: 'Fetch API', category: '网络与通信',
    path: '/javascript/j-25/fetch-api', summary: '用 Fetch API 替代 XMLHttpRequest，掌握请求配置、响应处理和错误处理。',
    demo: J25FetchApi, code: J25Code, language: 'javascript',
    principle: 'fetch() 返回 Promise，默认发起 GET 请求；可传 method、headers、body 等配置，也可复用 Request 对象；响应体须用 res.json() / res.text() 等方法读取，且一次 Response 只能读取一次。',
    flow: ['配置 method、headers、body 后发起请求。', '先检查 res.ok 判断状态码，非 2xx 时主动抛错。', '用 res.json() 解析响应体，并从 res.headers / res.status 读取元信息。'],
    notes: ['跨域请求默认不带 Cookie，需设置 credentials: "include"；同源请求默认携带。', 'HTTP 错误状态码不会让 fetch reject，须手动检查 res.ok 再决定是否抛错。'],
    problem: '解决"如何以现代、简洁的方式发起网络请求并处理响应"的问题。',
  },
{
    id: 'J_26', title: 'Web Storage 与 IndexedDB', navTitle: 'Web Storage', category: '存储',
    path: '/javascript/j-26/web-storage', summary: '用 localStorage/sessionStorage 存储简单键值，用 IndexedDB 存储大量结构化数据。',
    demo: J26WebStorage, code: J26Code, language: 'javascript',
    principle: 'localStorage 持久化保存、跨会话可用，sessionStorage 以标签页为单位、关闭即清除；两者都只能存字符串，存对象需 JSON 序列化；IndexedDB 提供异步的事务化大容量结构化存储与索引查询。',
    flow: ['用 localStorage 持久化跨会话的用户偏好。', '用 sessionStorage 暂存当前标签页的表单进度。', '数据量大或结构复杂时用基于事务的 IndexedDB 存取。'],
    notes: ['storage 事件只在“其他”同源标签页触发，当前页不会收到自身变更。', 'IndexedDB 是异步的、基于事务，数据放在对象仓库（object store）中。'],
    problem: '解决"浏览器端如何持久化用户数据，以及不同存储方案的适用场景"的问题。',
  },
{
    id: 'J_27', title: 'WebSocket 与实时通信', navTitle: 'WebSocket', category: '网络与通信',
    path: '/javascript/j-27/websocket', summary: '用 WebSocket 建立持久双向连接，理解与服务端推送（SSE）的差异。',
    demo: J27WebSocket, code: J27Code, language: 'javascript',
    principle: 'WebSocket 在 HTTP 升级握手后建立一条持久连接，客户端与服务端可随时双向发送数据；SSE（Server-Sent Events）则是一条普通 HTTP 长连接，通过 text/event-stream 由服务端单向推送，二者用途不同。',
    flow: ['创建 WebSocket 实例并监听 open / message / close 等事件。', '连接建立后通过 ws.send() 随时发送消息，消息经 ws.onmessage 接收。', '对比 WebSocket 的全双工与 SSE 的服务端单向推送，选择合适方案。'],
    notes: ['WebSocket 使用 ws:// 与 wss://（TLS）协议前缀。', 'onmessage 里 event.data 为字符串，JSON 数据需自行解析；回调中的 this 需要用箭头函数捕获。', '生产环境建议处理重连、心跳与消息队列。'],
    problem: '解决"如何实现服务端主动向客户端推送数据，以及实时双向通信"的问题。',
  },
{
    id: 'J_28', title: 'AbortController 与可中断操作', navTitle: 'AbortController', category: '异步控制',
    path: '/javascript/j-28/abort-controller', summary: '用 AbortController 取消进行中的 Fetch 请求、事件监听和其他可中断操作。',
    demo: J28AbortController, code: J28Code, language: 'javascript',
    principle: 'AbortController 持有 signal，异步 API 可通过 signal 订阅取消信号；调用 controller.abort() 会派发 signal 的 abort 事件并使 signal.aborted 变为 true，Fetch、addEventListener 等均已原生支持 signal。',
    flow: ['创建 AbortController 并取出其 signal。', '把 signal 传入 fetch 配置，或作为事件监听的 options.signal。', '在需要时调用 controller.abort()，fetch 会以 AbortError 拒绝、带 signal 的监听被移除。'],
    notes: ['同一个 signal 可同时关联多个请求或事件监听，一次 abort() 全部取消。', '调用 abort() 后 signal.aborted 变为 true，并触发所有订阅的 abort 监听器。'],
    problem: '解决"如何取消进行中的网络请求或事件监听，避免不必要的等待和资源浪费"的问题。',
  }
]
