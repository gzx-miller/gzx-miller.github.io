import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import J01SyntaxStatements from '../../demos/J01SyntaxStatementsArticle.vue'
import J02VariablesScope from '../../demos/J02VariablesScopeArticle.vue'
import J03TypesEquality from '../../demos/J03TypesEqualityArticle.vue'
import J04Operators from '../../demos/J04OperatorsArticle.vue'
import J05ControlFlow from '../../demos/J05ControlFlowArticle.vue'
import J06FunctionsThis from '../../demos/J06FunctionsThisArticle.vue'
import J07Closure from '../../demos/J07ClosureArticle.vue'
import J08HigherOrder from '../../demos/J08HigherOrderArticle.vue'
import J09ObjectOperations from '../../demos/J09ObjectOperationsArticle.vue'
import J10PrototypeClass from '../../demos/J10PrototypeClassArticle.vue'
import J11ArrayPipeline from '../../demos/J11ArrayPipelineArticle.vue'
import J12StringTemplateIntl from '../../demos/J12StringTemplateIntlArticle.vue'
import J13NumberDate from '../../demos/J13NumberDateArticle.vue'
import J14CollectionsIteration from '../../demos/J14CollectionsIterationArticle.vue'
import J15RegExp from '../../demos/J15RegExpArticle.vue'
import J16ErrorHandling from '../../demos/J16ErrorHandlingArticle.vue'
import J17JsonClone from '../../demos/J17JsonCloneArticle.vue'
import J18AsyncProgramming from '../../demos/J18AsyncProgrammingArticle.vue'
import J19EventDelegation from '../../demos/J19EventDelegationArticle.vue'
import J20FetchAbort from '../../demos/J20FetchAbortArticle.vue'
import J21Modules from '../../demos/J21ModulesArticle.vue'
import J22StorageRealtime from '../../demos/J22StorageRealtimeArticle.vue'

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

const J01Code = createCodeLoader('js-code/J01SyntaxStatements.js')

const J02Code = createCodeLoader('js-code/J02VariablesScope.js')

const J03Code = createCodeLoader('js-code/J03TypesEquality.js')

const J04Code = createCodeLoader('js-code/J04Operators.js')

const J05Code = createCodeLoader('js-code/J05ControlFlow.js')

const J06Code = createCodeLoader('js-code/J06FunctionsThis.js')

const J07Code = createCodeLoader('js-code/J07Closure.js')

const J08Code = createCodeLoader('js-code/J08HigherOrder.js')

const J09Code = createCodeLoader('js-code/J09ObjectOperations.js')

const J10Code = createCodeLoader('js-code/J10PrototypeClass.js')

const J11Code = createCodeLoader('js-code/J11ArrayPipeline.js')

const J12Code = createCodeLoader('js-code/J12StringTemplateIntl.js')

const J13Code = createCodeLoader('js-code/J13NumberDate.js')

const J14Code = createCodeLoader('js-code/J14CollectionsIteration.js')

const J15Code = createCodeLoader('js-code/J15RegExp.js')

const J16Code = createCodeLoader('js-code/J16ErrorHandling.js')

const J17Code = createCodeLoader('js-code/J17JsonClone.js')

const J18Code = createCodeLoader('js-code/J18AsyncProgramming.js')

const J19Code = createCodeLoader('js-code/J19EventDelegation.js')

const J20Code = createCodeLoader('js-code/J20FetchAbort.js')

const J21Code = createCodeLoader('js-code/J21Modules.js')

const J22Code = createCodeLoader('js-code/J22StorageRealtime.js')

export const lessons: Lesson[] = [
{
    id: 'J_01', title: '语法、语句与注释', navTitle: '语法与语句', category: '语言基础',
    path: '/javascript/j-1/syntax-statements', summary: '从标识符命名、语句与表达式、分号推断到注释与严格模式，打牢写代码前必须一致的语法约定。',
    demo: null,
    demoComponent: J01SyntaxStatements, code: J01Code, language: 'javascript',
    principle: 'JavaScript 用标识符承载数据，名字必须以字母、下划线或 $ 开头，区分大小写且不能占用保留字。语句执行动作、本身不产生值；表达式一定求出一个值，二者可用「能否写进 const x = ___ 的右侧」来区分。省略分号时依赖引擎的自动分号插入，它只在换行处、且仅当补上分号能让语法成立时才补，于是 return 后换行、行首出现 ( 或 [ 都会触发反直觉的推断。注释不参与执行且块注释不能嵌套；严格模式通过顶部的 \'use strict\' 开启（模块与 class 内部默认严格），让未声明赋值抛错、独立调用函数的 this 变为 undefined。',
    flow: ['给标识符起合法名字：首字符用字母、_ 或 $，避开保留字，注意大小写敏感。', '把每一步区分成语句还是表达式，表达式放进赋值右侧或函数实参，语句用来改变状态。', '在 return 与行首 ( [ 反引号这两处关键换行显式补分号，不依赖自动分号插入。', '用 // 与 /* */ 写注释并避免嵌套块注释，需要时用严格模式把隐藏错误暴露出来。'],
    notes: ['自动分号插入只发生在换行处，且只在补上分号能让语法成立时生效。', 'return 后紧跟换行会让函数返回 undefined，返回值应与 return 同行。', '块注释不能嵌套，用注释临时禁用含块注释的代码常会失效。', 'ES Module 与 class 内部默认就是严格模式，无需显式声明。'],
    problem: '解决"为什么一句看起来正常的代码会返回 undefined，以及命名、分号、注释与严格模式各自在约束什么"的问题。',
  },
{
    id: 'J_02', title: '变量声明与作用域', navTitle: '变量与作用域', category: '语言基础',
    path: '/javascript/j-2/variables-scope', summary: '理解 var、let、const 的声明提升、块级作用域与暂时性死区，让变量的可见范围可预期。',
    demo: null,
    demoComponent: J02VariablesScope, code: J02Code, language: 'javascript',
    principle: 'var 只有函数作用域，会被提升到函数顶部且初始值为 undefined；let 与 const 是块级作用域，声明之前访问会落入暂时性死区并抛 ReferenceError。const 锁定的是绑定——不能重新赋值，但对象内容仍可修改。未声明就赋值会在非严格模式下创建隐式全局变量，是作用域污染的主要来源。',
    flow: ['按生命周期与是否重新赋值选择声明：优先 const，需要重新赋值时用 let，尽量避免 var。', '用块级作用域把变量的可见范围限制在使用它的代码块内。', '识别声明提升与暂时性死区，不在声明之前访问 let / const 变量。', '为循环变量使用 let，让每轮获得独立绑定，避免 var 造成的共享。'],
    notes: ['var 声明提升后值为 undefined；let / const 声明前访问抛 ReferenceError。', 'const 只锁定绑定，对象与数组的内容仍可增删改。', '非严格模式下未声明就赋值会创建隐式全局变量。', '同一作用域内 let / const 不能重复声明，var 可以重复声明但会互相覆盖。'],
    problem: '解决"变量为什么在声明前就可用、块外为什么访问不到、const 到底锁住了什么"的问题。',
  },
{
    id: 'J_03', title: '数据类型、转换与相等判断', navTitle: '类型与相等', category: '语言基础',
    path: '/javascript/j-3/types-equality', summary: '掌握 7 种原始类型与引用类型的 typeof 行为、显式转换、隐式转换规则，以及 == 与 === 的经典差异。',
    demo: null,
    demoComponent: J03TypesEquality, code: J03Code, language: 'javascript',
    principle: 'JavaScript 是动态类型语言，运算时会按规范触发隐式类型转换。typeof 对 null 返回 "object" 是历史遗留问题；除函数外，引用类型的 typeof 统一为 "object"，判断数组须用 Array.isArray()。显式转换用 Number()、String()、Boolean()；falsy 值共有 false、0、-0、0n、""、null、undefined、NaN 八种，其余值（含空数组、空对象）都是 truthy。== 会先做类型转换再比较，=== 要求类型与值都一致。',
    flow: ['用 typeof 识别值在运行时的类型，注意 function 与 null 两个例外。', '在输入边界显式调用 Number() / String() / Boolean() 转换，避免依赖隐式规则。', '始终用 === 与 !== 做相等比较。', '用 Number.isNaN()、Array.isArray()、Object.is() 处理特殊边界。'],
    notes: ['typeof null 返回 "object" 是语言早期实现的遗留问题。', '全局 isNaN 会先把参数转成数字再判断，判断 NaN 须用 Number.isNaN()。', 'falsy 值包括 false、0、-0、0n、""、null、undefined、NaN，空数组和空对象都是 truthy。', 'Object.is() 认为 NaN 与自身相等，且能区分 +0 与 -0。'],
    problem: '解决"表单输入、API 参数比较时为什么出现反直觉结果，以及如何正确识别和转换 JavaScript 类型"的问题。',
  },
{
    id: 'J_04', title: '运算符与表达式', navTitle: '运算符', category: '语言基础',
    path: '/javascript/j-4/operators-expressions', summary: '梳理算术、比较、逻辑、空值合并、可选链、逻辑赋值与位运算，掌握短路求值与权限位模型。',
    demo: null,
    demoComponent: J04Operators, code: J04Code, language: 'javascript',
    principle: '运算符在求值时会按规范转换操作数。逻辑运算符 &&、||、?? 在结果已确定时立即短路，且返回的不是布尔值而是参与运算的原始操作数；?? 只在左侧为 null / undefined 时取右侧，与 || 对 0 和空字符串的处理不同。可选链 ?. 在遇到 null / undefined 时短路返回 undefined。位运算把操作数转成 32 位有符号整数后逐位计算，因此可用一个整数的不同二进制位并行编码多项权限：按位或 | 授予、按位与 & 检查、按位与非 &~ 撤销。',
    flow: ['分清算术与比较运算符的转换规则，注意 % 取余与 ** 幂运算。', '用 &&、||、?? 做短路取值与默认值兜底，注意它们返回的是操作数本身。', '用 ?. 安全访问可能为空的属性或调用可能不存在的函数。', '用 2 的幂常量与位运算 | & ^ 建模并维护多项权限标志。'],
    notes: ['逻辑运算返回的是操作数本身，不是 true / false。', '?? 只在 null / undefined 时取右侧；|| 对 0、空字符串等 falsy 值也会取右侧。', '位运算以 32 位有符号整数为基准，超出范围的数值会被截断。', '权限常量用 2 的幂定义，读代码时按二进制展开即可对上每一位。'],
    problem: '解决"默认值到底该用 || 还是 ??、深层属性怎么安全读取，以及多项权限如何合并进一个整数高效判断"的问题。',
  },
{
    id: 'J_05', title: '流程控制：条件、循环与跳转', navTitle: '流程控制', category: '语言基础',
    path: '/javascript/j-5/control-flow', summary: '用 if/else、switch、三种循环与 continue/break 组织分支与重复，厘清 for...of 与 for...in 的区别。',
    demo: null,
    demoComponent: J05ControlFlow, code: J05Code, language: 'javascript',
    principle: '条件分支依赖真假值判断，if/else 逐条落空直到命中，switch 用严格相等比较并因缺 break 而穿透。循环提供三种形态：for 适合已知次数，while 适合条件驱动，do...while 至少执行一次；for...of 迭代可迭代对象的值，for...in 遍历可枚举的键（含继承来的）。continue 跳过本轮，break 结束整个循环，必要时可用标签跳出多层。',
    flow: ['按「单一条件」「多路等值分支」「区间判断」分别选择 if、switch 与条件表达式。', '依据次数已知、条件驱动或至少执行一次，选择 for、while 或 do...while。', '遍历值时用 for...of，需要键名时用 for...in 并注意它含继承属性。', '用 continue 跳过本轮、break 提前结束，避免用标志变量硬扛。'],
    notes: ['switch 使用严格相等比较，且 case 后忘记 break 会穿透到下一个分支。', 'do...while 至少执行一次循环体，适合「先做再判断」的场景。', 'for...in 会遍历到原型链上可枚举的键，遍历数组通常用 for...of。', 'continue 只跳过本轮，break 结束整个循环，二者作用不同。'],
    problem: '解决"多路条件与各种循环该如何选型，以及遍历时该取值还是取键"的问题。',
  },
{
    id: 'J_06', title: '函数声明、参数与 this 绑定', navTitle: '函数与 this', category: '函数与组合',
    path: '/javascript/j-6/functions-this', summary: '比较函数声明、函数表达式与箭头函数，掌握默认参数、剩余参数以及 this 的四种绑定规则。',
    demo: null,
    demoComponent: J06FunctionsThis, code: J06Code, language: 'javascript',
    principle: '普通函数的 this 在调用时才确定，取决于调用表达式本身：方法调用指向调用者（隐式绑定），独立调用在严格模式下为 undefined（默认绑定），call / apply / bind 可显式指定接收者，new 调用则指向新创建的实例；箭头函数没有自己的 this，捕获定义处外层函数的 this，且无法被 call / apply 改变。函数声明会提升，函数表达式与箭头函数赋值给变量后不提升。',
    flow: ['根据是否需要提升与是否要自定义 this，选择函数声明、函数表达式或箭头函数。', '用默认参数与剩余参数表达可选入参，替代手工处理 arguments。', '把方法交给回调前，用箭头函数或 bind 固定 this，避免丢失调用者。', '用 call / apply 显式指定接收者，用 new 判断是否作为构造器调用。'],
    notes: ['this 由调用方式决定，不指向函数定义时所在的「父对象」。', '严格模式下独立调用普通函数 this 为 undefined，非严格模式指向全局对象。', '箭头函数的 this 在定义时锁定，无法再用 call / apply 改变。', '函数声明会提升，函数表达式与箭头函数赋给变量后不会提升。'],
    problem: '解决"方法作为回调传出去后 this 为什么变了，以及参数默认值与剩余参数该怎么写"的问题。',
  },
{
    id: 'J_07', title: '作用域链与闭包', navTitle: '作用域与闭包', category: '函数与组合',
    path: '/javascript/j-7/closure', summary: '用购物车计数器理解作用域链的查找过程，以及闭包如何跨过函数返回封装私有状态。',
    demo: null,
    demoComponent: J07Closure, code: J07Code, language: 'javascript',
    principle: '函数能访问哪些变量由代码书写位置决定，而不是调用位置，这就是词法作用域；内部函数被当作返回值转交到外部后，仍持有对创建它的词法环境的引用，因此能继续访问并修改其中的变量，这个「内部函数 + 词法环境」的组合就是闭包。被闭包捕获的变量不在函数返回时释放，而是随引用存活在内存中，这正是它能封装私有状态的原因。',
    flow: ['外层函数在自己的词法环境中创建局部状态（如购物车计数）。', '把能够读写该状态的内部函数作为返回值交给外部。', '外部每调用一次返回的函数，都继续读写同一份词法环境。', '在浏览器内存面板确认被闭包引用的数据持续存活。'],
    notes: ['每次调用外层函数都会创建独立的词法环境，各自的计数互不干扰。', '闭包适合封装外部无法直接读写的私有状态。', '长期被闭包持有的大对象会阻止 GC 回收，用完后应及时解除引用。', '循环中用 var 注册回调会共享同一个变量，改用 let 或闭包工厂为每轮保存独立副本。'],
    problem: '解决"事件回调为什么还能读到外层函数早已返回的变量，以及如何用它封装只暴露接口、不暴露数据的私有状态"的问题。',
  },
{
    id: 'J_08', title: '高阶函数、柯里化与函数组合', navTitle: '高阶函数', category: '函数与组合',
    path: '/javascript/j-8/higher-order', summary: '用函数组合构建价格计算器，掌握柯里化、偏函数、pipe/compose 与防抖节流。',
    demo: null,
    demoComponent: J08HigherOrder, code: J08Code, language: 'javascript',
    principle: '高阶函数接收或返回函数；柯里化把多参函数拆为单参链，便于逐步配置；pipe / compose 把多个单步函数串联成流水线，让数据沿函数链流动；防抖和节流控制高频事件回调的执行频率，是 UI 交互与性能优化的常见工具。这几类函数本身不改变数据，只是重新组织函数的调度与组合方式。',
    flow: ['用柯里化把多参数函数拆为单参链，边传参边形成配置。', '用 pipe（从左到右）或 compose（从右到左）把单步函数串成处理流水线。', '用闭包实现 once、memoize 等带记忆的工具函数。', '用防抖 / 节流包一层并返回新函数，控制高频事件的执行节奏。'],
    notes: ['Array.prototype.map、filter、reduce 本身就是高阶函数。', 'pipe 从左到右执行，compose 从右到左执行，混合使用时顺序要一致。', '防抖在停手后才执行一次，节流保证一定间隔内至多执行一次。', '防抖与节流都返回新函数；需要取消时记得保存返回值并调用其 cancel。'],
    problem: '解决"如何用函数组合替代重复代码，并用防抖节流控制高频事件的执行频率"的问题。',
  },
{
    id: 'J_09', title: '对象、解构、展开与可选链', navTitle: '对象操作', category: '集合与数据',
    path: '/javascript/j-9/object-operations', summary: '通过用户资料更新掌握属性访问、解构、剩余与展开，并厘清浅拷贝与逐层展开的边界。',
    demo: null,
    demoComponent: J09ObjectOperations, code: J09Code, language: 'javascript',
    principle: '解构按属性名或数组位置提取值，剩余语法把未被提取的字段收集进新对象，展开语法则把原对象可枚举的自有属性逐一复制到新对象。三者都只做浅层操作：只有第一层是新的，嵌套对象仍与被复制对象共享引用，因此局部更新时必须沿更新路径逐层用展开语法创建新对象，才能保证原数据不被意外修改。',
    flow: ['从源对象解构出需要的字段，用剩余语法收集其余字段。', '通过展开语法把剩余字段与新的覆盖值合并进新对象。', '保持原对象不变，用新引用承接更新结果。', '更新嵌套字段时沿路径逐层展开，并用 ?. 与 ?? 安全读取深层字段。'],
    notes: ['浅拷贝下嵌套对象仍共享引用，深层更新需逐层创建新对象。', '同名属性按展开位置决定覆盖顺序，后展开的替换先展开的。', '需要完整深拷贝时用 structuredClone，简单浅拷贝用展开即可。', '?. 只保证读取安全；链末端是方法时记得带上调用括号 ?.()。'],
    problem: '解决"局部更新用户资料时如何安全读取字段，并在不修改原对象的前提下得到更新结果"的问题。',
  },
{
    id: 'J_10', title: '原型链、class 与继承', navTitle: '原型与类', category: '对象模型',
    path: '/javascript/j-10/prototype-class', summary: '通过课程模型理解实例属性、共享方法与原型继承，搞清 class 背后的原型机制。',
    demo: null,
    demoComponent: J10PrototypeClass, code: J10Code, language: 'javascript',
    principle: '对象通过内部 [[Prototype]] 链接查找属性，整条链上的方法都可以被实例共享；class 提供更清晰的构造与继承语法，但底层依然是基于原型的委托机制，理解这点才能解释属性遮蔽、原型链查询与 instanceof 的工作方式。把方法放在原型上共享、把字段留成实例自己的，是使用对象时的基本分工。',
    flow: ['构造函数初始化实例自身的字段（如 title、hours）。', '实例方法定义在 prototype 上，被所有实例共享，节省内存。', 'extends 把子类原型链接到父类，super 调用父类同名方法。', '用 Object.create 或 class 建立原型关系，并用 instanceof 验证。'],
    notes: ['优先组合而非过深继承，组合更灵活、副作用更少。', '私有字段使用 #name 语法，外部无法直接访问。', 'new 的四步：创建新对象、链接原型、绑定 this 执行构造器、返回该对象。', '调试时可用 Object.getPrototypeOf 沿链向上确认方法定义在哪一层。'],
    problem: '解决"JavaScript 对象如何共享行为以及 class 的底层机制"的问题。',
  },
{
    id: 'J_11', title: '数组与不可变方法流水线', navTitle: '数组方法', category: '集合与数据',
    path: '/javascript/j-11/array-pipeline', summary: '用 filter 筛选课程、toSorted 排序，组合成不改动原数组的数组转换流水线。',
    demo: null,
    demoComponent: J11ArrayPipeline, code: J11Code, language: 'javascript',
    principle: '数组处理可拆成筛选、映射等可组合的步骤；其中 filter、toSorted 等返回新数组而不改动原数组，链式调用形成只读的转换流水线，避免通过共享引用意外修改状态，也是 React / Vue 不可变更新范式的基础。掌握 filter、map、toSorted 等非破坏性方法的边界，是不变数据实践的第一步。',
    flow: ['用 filter 把结果缩小到标题匹配关键词的课程。', '把筛选结果传给 toSorted，按传入的比较函数得到评分降序的新数组。', '链式组合多个返回新数组的方法，使流水线可预测且不改原数组。', '对比 sort 与 toSorted，确认原数组在后者调用后保持不变。'],
    notes: ['toSorted 返回排序后的新数组，区别于直接修改原数组的 sort（ES2023）。', 'map 用于转换元素、forEach 用于执行副作用，不要把 map 当副作用工具。', 'reduce 适合把多条处理步骤收敛为单个结果，嵌套过深时拆成多步更可读。', 'flat 与 flatMap 可摊平嵌套数组，注意默认只摊平一层。'],
    problem: '解决"列表搜索、筛选、排序时如何组合出可读且不改动原始数据的处理流水线"的问题。',
  },
{
    id: 'J_12', title: '字符串、模板字面量与国际化', navTitle: '字符串与模板', category: '语言基础',
    path: '/javascript/j-12/string-template-intl', summary: '用字符串方法搜索与转换文本，用模板字面量与标签模板组织插值，用 Intl 格式化输出。',
    demo: null,
    demoComponent: J12StringTemplateIntl, code: J12Code, language: 'javascript',
    principle: '字符串方法覆盖搜索（includes、startsWith、matchAll）、截取（slice、at）、批量替换（replaceAll）、拆分（split）与填充修剪，且全部返回新字符串而不改动原串。模板字面量用反引号书写，支持 ${} 插值与多行文本；标签模板把「字符串片段」与「插值结果」分离后交给标签函数，函数可在拼接前对插值转义或包装，是 HTML 转义、文本高亮、CSS-in-JS 等 DSL 的实现基础。Intl API 提供地区感知的日期、数字、货币与排序格式化，无需自己维护本地化词表。',
    flow: ['用 includes、startsWith 与 matchAll 搜索与提取文本。', '用 replaceAll、slice、split 与 trim / padStart 批量替换、拆分与填充。', '用模板字面量的 ${} 插值书写多行文本，用标签模板做转义或高亮。', '用 Intl.DateTimeFormat / NumberFormat 格式化输出并指定 locale。'],
    notes: ['字符串是不可变的，所有方法都返回新字符串。', '标签模板中字符串片段的数量 = 插值数量 + 1，可用 strings.raw 取原始片段。', 'Intl.Collator 可正确排序中文等多语言文本，胜过默认的 < 比较。', 'matchAll 需要带 g 标志的正则，返回的是迭代器而非数组。'],
    problem: '解决"文本搜索与批量替换该用什么方法，以及日期、货币的地区化格式如何标准化输出"的问题。',
  },
{
    id: 'J_13', title: '数字、Math 与日期格式化', navTitle: '数字与日期', category: '语言基础',
    path: '/javascript/j-13/number-date', summary: '掌握浮点精度、安全整数、Math 常用方法与日期时间戳，用 Intl 做地区化格式化。',
    demo: null,
    demoComponent: J13NumberDate, code: J13Code, language: 'javascript',
    principle: 'JavaScript 只有一种数字类型 number，采用 IEEE 754 双精度浮点，因此 0.1 + 0.2 不等于 0.3，能精确表示的整数上限是 Number.MAX_SAFE_INTEGER。NaN 与 Infinity 是特殊值，NaN 不等于任何值须用 Number.isNaN 判断。日期内部以毫秒时间戳表示，Date 对象的月份从 0 开始，直接解析字符串存在时区与格式差异。数值与日期的展示统一交给 Intl，按 locale 输出货币、千分位与地区化日期。',
    flow: ['留意浮点精度与安全整数范围，比较金额时先规整到整数最小单位。', '用 toFixed、toPrecision 与 Intl.NumberFormat 控制数值与货币的呈现。', '用 Math 的 round / trunc / floor / ceil / max / min / random 处理取整与随机。', '用 new Date 与时间戳互转，并用 Intl.DateTimeFormat 做地区化输出。'],
    notes: ['0.1 + 0.2 !== 0.3，浮点误差来自二进制无法精确表示十进制小数。', 'Number.MAX_SAFE_INTEGER 之外的整数运算可能丢失精度。', 'Date 的月份从 0 开始，getMonth 返回 0 表示一月。', '用 Date 解析字符串存在时区差异，优先用时间戳或显式年月日构造。'],
    problem: '解决"金额与日期为什么算得不准、显示不对，以及如何用 Math 与 Intl 正确处理与格式化"的问题。',
  },
{
    id: 'J_14', title: '集合：Map/Set/WeakMap 与迭代协议', navTitle: '集合与迭代', category: '集合与数据',
    path: '/javascript/j-14/collections-iteration', summary: '用 Set 去重、Map 关联数据、WeakMap 绑定元数据，并从迭代协议理解 for...of 与生成器。',
    demo: null,
    demoComponent: J14CollectionsIteration, code: J14Code, language: 'javascript',
    principle: 'Map 允许任意类型做键且保持插入顺序，Set 保证值唯一，都提供了普通对象和数组不具备的语义；WeakMap / WeakSet 的键是弱引用，键被回收时条目自动消失，不会阻止垃圾回收，适合给 DOM 节点或实例关联临时元数据，但不支持遍历与 size。迭代器协议要求 next() 返回 { value, done }；生成器用 yield 暂停执行、下次 next() 恢复，并支持通过 next(value) 向生成器回传数据，以及用 yield* 把产出委托给其他可迭代对象。',
    flow: ['用 Set 收集不重复标签，用 Map 建立对象到数据的映射。', '用 WeakMap 给 DOM 元素附加私有数据，避免内存泄漏。', '为对象实现 [Symbol.iterator]，让它可被 for...of 惰性消费。', '用 function* 配合 yield 创建生成器，用 yield* 委托产出。'],
    notes: ['WeakMap 的键不可枚举，仅在键没有其他强引用时才允许回收。', 'GC 时机不可预测，不适合用弱引用承载关键业务逻辑。', 'Map 以对象为键时不会把键字符串化，因此不会互相覆盖。', '生成器调用后函数体不会立即执行，只有第一次 next() 才运行到第一个 yield。'],
    problem: '解决"何时用 Map/Set 替代对象和数组、如何用弱引用字典避免内存泄漏，以及自定义对象如何接入 for...of"的问题。',
  },
{
    id: 'J_15', title: '正则表达式', navTitle: '正则表达式', category: '语言基础',
    path: '/javascript/j-15/regexp', summary: '用正则匹配手机号、邮箱、价格与日期，掌握捕获组、前后断言与匹配方法。',
    demo: null,
    demoComponent: J15RegExp, code: J15Code, language: 'javascript',
    principle: '正则表达式用模式匹配字符串；字符类、量词、捕获组与前后断言组合出精确规则，test() 用于验证、exec() 提取单次匹配（含命名组）、matchAll() 与 replace() 处理所有匹配和替换。修饰符（g、i、m、s、u）控制匹配范围，带 g 的正则还会在 lastIndex 上保留上次匹配位置。',
    flow: ['用字符类与量词描述匹配模式（如手机号以 1 开头、第二位 3-9、后接 9 位数字）。', '用捕获组与命名组提取子串。', '用正 / 负前瞻与后行断言限定上下文而不消耗字符。', '一次性用 matchAll 提取全部匹配，注意带 g 的正则的 lastIndex 状态。'],
    notes: ['带 g 标志的正则多次 exec / test 会因 lastIndex 前进产生不同结果。', '复杂校验建议拆成多个边界清晰的正则分别判断。', '把用户输入拼接进正则模式前必须转义特殊字符。', '量词尽量写得具体，避免 .* 在大文本上回溯爆炸。'],
    problem: '解决"手机号、邮箱、日期等字符串如何用声明式模式校验，并提取其中的结构化字段"的问题。',
  },
{
    id: 'J_16', title: '错误处理与自定义异常', navTitle: '错误处理', category: '语言基础',
    path: '/javascript/j-16/error-handling', summary: '用 try/catch/finally 和自定义 Error 子类构建可恢复的错误流，并用 cause 保留错误链。',
    demo: null,
    demoComponent: J16ErrorHandling, code: J16Code, language: 'javascript',
    principle: 'try/catch 捕获同步异常以及 async/await 中被拒绝的 Promise，finally 无论成败都执行清理；通过继承 Error 定义携带业务字段的异常子类，并可用 cause 选项把原始错误挂到新错误上形成错误链。同步与异步边界的失败统一汇入 try/catch 后，错误处理才能作为一等的设计对象。',
    flow: ['用 try 包裹可能抛错的代码（如 JSON.parse、网络请求）。', '在 catch 中按错误类型（或 err.name）分支处理。', '用 finally 执行必达的清理逻辑，必要时包装错误并传入 cause。', '构造一个自定义错误实例，验证 instanceof 能正确识别其类型。'],
    notes: ['try/catch 捕获不到 setTimeout 等异步回调内部的同步抛出。', 'Error 构造器的 cause 选项（ES2022）可保留原始错误的引用。', 'finally 中的 return 会覆盖 try/catch 的返回值，避免在其中写 return。', '未处理的拒绝要配置全局监听（unhandledrejection）兜底。'],
    problem: '解决"如何在系统边界捕获异常、按错误类型分流处理，并用 cause 保留原始错误的上下文"的问题。',
  },
{
    id: 'J_17', title: 'JSON、克隆与序列化', navTitle: 'JSON 与克隆', category: '集合与数据',
    path: '/javascript/j-17/json-clone', summary: '用 replacer/reviver 控制序列化，用 structuredClone 深拷贝循环引用与内置类型。',
    demo: null,
    demoComponent: J17JsonClone, code: J17Code, language: 'javascript',
    principle: 'JSON.stringify 可通过 replacer（函数或数组）过滤并转换值，JSON.parse 的 reviver 在还原时重建类型；structuredClone 走结构化克隆算法，可深拷贝循环引用以及 Date、Map、Set、ArrayBuffer 等内置类型。',
    flow: ['用 replacer 过滤字段、把 Date 序列化为字符串，或用 toJSON 自定义输出。', '用 reviver 在解析时把日期字符串还原回 Date 实例。', '对含循环引用的对象用 structuredClone 做深拷贝。', '序列化前用 replacer 过滤密码、令牌等敏感字段。'],
    notes: ['JSON 无法表示 undefined、函数、Symbol 与循环引用，Date 会退化为字符串。', 'structuredClone 能处理循环引用，但不支持函数与 DOM 节点。', 'stringify 遇到 undefined、函数与 Symbol 属性会直接跳过，数组中则变成 null。', '展开语法只是浅拷贝，嵌套对象仍共享引用。'],
    problem: '解决"含 Date、循环引用的复杂对象如何正确序列化与深拷贝，并顺手过滤敏感字段"的问题。',
  },
{
    id: 'J_18', title: '异步编程：事件循环、Promise 与 async/await', navTitle: '异步编程', category: '异步机制',
    path: '/javascript/j-18/async-programming', summary: '从事件循环与微任务出发，串起 Promise 组合器与 async/await 的串行并发取舍。',
    demo: null,
    demoComponent: J18AsyncProgramming, code: J18Code, language: 'javascript',
    principle: '调用栈清空后，事件循环会先清空整个微任务队列（Promise.then、queueMicrotask），再取出下一个宏任务（如定时器回调）执行；Promise 表示一个未来会落定（fulfilled 或 rejected）的结果，组合器并行启动多个异步任务并按不同策略聚合：all 全部成功才成功、allSettled 等全部结束并保留各自结果、race 取最先落定者、any 取最先成功者。async 函数总是返回 Promise，await 之前的代码同步执行，await 之后的部分进入微任务。',
    flow: ['理解同步代码、微任务与宏任务的执行顺序，解释异步日志为何不同于书写顺序。', '按业务对失败的容忍度选择 all / allSettled / any 等组合器。', '按依赖关系选择串行 for...of + await 或并发 Promise.all。', '用 try/catch/finally 处理 await 链上的拒绝并执行清理。'],
    notes: ['大量微任务也会阻塞渲染，要控制单次微任务工作量。', 'Promise.all 在首个 reject 时立即整体拒绝，但其余任务仍会继续执行。', 'async 函数中 await 之前的代码同步执行，await 之后的部分进入微任务。', '未处理的拒绝会触发 unhandledrejection 事件。'],
    problem: '解决"多个互不依赖的异步请求如何并发发起，以及同步日志、Promise.then 与 setTimeout 的输出顺序为何与书写顺序不一致"的问题。',
  },
{
    id: 'J_19', title: 'DOM 事件传播与事件委托', navTitle: '事件与委托', category: '模块与浏览器',
    path: '/javascript/j-19/event-delegation', summary: '用课程列表理解捕获、冒泡、target 与 currentTarget，并用事件委托统一管理动态列表。',
    demo: null,
    demoComponent: J19EventDelegation, code: J19Code, language: 'javascript',
    principle: 'DOM 事件经历捕获（capture）、目标（target）和冒泡（bubble）三个阶段，事件委托利用冒泡在稳定的父节点统一监听，再通过 closest() 或匹配选择器判断真实交互目标，动态列表也能高效工作。相比为每个子节点单独绑定，委托把监听器数量从 N 降到 1，新增节点也无需重新挂载。',
    flow: ['在稳定的父容器注册一个冒泡阶段的 click 监听器。', '用 event.target.closest(选择器) 从实际触发元素向上寻找匹配项。', '通过 dataset 读取 data-* 属性并执行对应分支行为。', '为列表动态插入新行，验证无需重新绑定即可响应点击。'],
    notes: ['不是所有事件都会冒泡（如 focus、blur、scroll），必要时改用捕获阶段。', 'closest 会一直向上查到 document，使用时要结合委托容器判断是否误匹配。', '委托显著减少监听器数量，且对动态增删的子节点天然生效。', 'preventDefault 阻止默认行为，stopPropagation 阻止继续传播，二者作用不同。'],
    problem: '解决"列表项频繁增删时如何减少监听器数量，并让新增节点自动拥有交互能力"的问题。',
  },
{
    id: 'J_20', title: '网络请求与可中断操作', navTitle: '网络与中断', category: '网络与通信',
    path: '/javascript/j-20/fetch-abort', summary: '用 Fetch API 发起请求并检查 res.ok，配合 AbortController 取消过期请求与监听。',
    demo: null,
    demoComponent: J20FetchAbort, code: J20Code, language: 'javascript',
    principle: 'fetch() 返回 Promise，默认发起 GET 请求；可传 method、headers、body 等配置，也可复用 Request 对象；响应体须用 res.json() / res.text() 等方法读取，且一次 Response 只能读取一次，二次读取需先 clone。HTTP 错误状态码不会让 fetch reject，须手动检查 res.ok。AbortController 持有 signal，调用 controller.abort() 会派发 abort 事件并使 fetch 以 AbortError 拒绝、带 signal 的监听被移除。',
    flow: ['配置 method、headers、body 后发起请求，按需设置 credentials。', '先检查 res.ok 判断状态码，非 2xx 时主动抛错。', '用 res.json() 解析响应体，并从 res.headers / res.status 读取元信息。', '用 AbortController 取消过期请求，并把 AbortError 与真实网络失败区分开。'],
    notes: ['HTTP 错误状态码不会让 fetch reject，须手动检查 res.ok。', 'fetch 没有内置超时，需要配合 AbortController 或超时竞速实现。', '响应体只能读取一次，需要二次读取时先 clone。', '同一个 signal 可同时关联多个请求或监听，一次 abort() 全部取消。'],
    problem: '解决"如何以现代方式发起网络请求、区分 HTTP 错误与网络失败，并取消过期请求避免旧结果覆盖新结果"的问题。',
  },
{
    id: 'J_21', title: 'ES Modules 模块化与动态导入', navTitle: '模块化', category: '模块与浏览器',
    path: '/javascript/j-21/modules', summary: '掌握静态 import/export、模块作用域与实时绑定，用 import() 按需加载拆分首屏。',
    demo: null,
    demoComponent: J21Modules, code: J21Code, language: 'javascript',
    principle: 'ES Module 具有独立作用域与静态依赖结构：import/export 在编译期就确定依赖图，导出是实时绑定，打包器据此做 Tree Shaking；动态 import() 返回 Promise，把低频功能拆成独立 chunk 按需拉取，是路由懒加载与首屏优化的标准手段。',
    flow: ['用具名或默认导出声明模块的公共接口。', '对首屏必需的依赖使用静态 import，便于打包器静态分析与 tree shaking。', '对低频模块用动态 import() 按需加载，返回 Promise 并处理加载状态。', '用打包分析工具确认动态 import() 的模块被拆成独立 chunk。'],
    notes: ['ES Module 默认运行于严格模式，顶层变量不会挂到全局对象。', 'import 是只读绑定：模块内导出的变量更新后，导入方能看到最新值，但不能重新赋值。', '顶层 await 只能在模块顶层使用。', '注意避免环形依赖在初始化阶段读取到未定义的值。'],
    problem: '解决"项目模块边界混乱、打包体积膨胀时，如何用静态 import 划定依赖、用动态 import() 把低频功能拆出首屏"的问题。',
  },
{
    id: 'J_22', title: '浏览器存储与实时通信', navTitle: '存储与实时', category: '存储',
    path: '/javascript/j-22/storage-realtime', summary: '对比 localStorage/sessionStorage 与 IndexedDB 的选型，用 WebSocket 建立持久双向连接。',
    demo: null,
    demoComponent: J22StorageRealtime, code: J22Code, language: 'javascript',
    principle: 'localStorage 持久化保存、跨会话可用，sessionStorage 以标签页为单位、关闭即清除；两者都只能存字符串，存对象需 JSON 序列化；IndexedDB 提供异步的事务化大容量结构化存储与索引查询。选型时按「生命周期、容量、同步性」三个维度对照即可快速决策。WebSocket 在 HTTP 升级握手后建立一条持久连接，客户端与服务端可随时双向发送数据；SSE（Server-Sent Events）则是一条普通 HTTP 长连接，通过 text/event-stream 由服务端单向推送。',
    flow: ['用 localStorage 持久化跨会话的用户偏好。', '用 sessionStorage 暂存当前标签页的表单进度。', '数据量大或结构复杂时用基于事务的 IndexedDB 存取。', '用 WebSocket 建立持久连接并监听 open / message / close 事件。'],
    notes: ['storage 事件只在「其他」同源标签页触发，当前页不会收到自身变更。', '写入超出存储配额会抛出 QuotaExceededError，写入前应估算体积并处理该异常。', 'localStorage 同步读写会阻塞主线程，大批量数据应改用 IndexedDB。', 'WebSocket 生产环境需自行实现重连与心跳；SSE 的 EventSource 自带断线重连。'],
    problem: '解决"浏览器端如何持久化用户偏好与表单进度、不同存储方案各自适用什么场景，以及如何实现服务端主动推送"的问题。',
  },
]
