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


export const lessons: Lesson[] = [
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
    id: 'SC_09', title: '值类型、单位与编译期计算', navTitle: '值与单位', category: '语言基础',
    path: '/sass/sc-9/values-units', summary: '理解数字、字符串、颜色、List、Map 与单位代数的行为。',
    demo: SC09ValuesUnits, code: SC09Code, language: 'scss',
    principle: 'Sass 拥有带类型的值系统：数字、字符串、颜色、布尔、null、List、Map 各自有不同的运算规则；数字还携带分子/分母单位（unit），兼容单位可换算（例如 px 与 rem），不兼容维度会在编译期就报错，避免运行时才发现样式错位。',
    flow: ['识别表达式中的 Sass 值类型。', '在计算前检查单位维度是否兼容。', '用 meta.type-of 与 math.compatible 等函数诊断边界输入。'],
    notes: ['0 也可能携带单位，10px * 0 仍是带单位结果。', '不要用插值（#{}）绕过本应失败的单位检查，会得到无法维护的字符串。', '用 list.separator、map.get 等模块函数替代反斜杠分隔符操作。'],
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
    principle: 'Sass 提供四种控制流：@if/@else 条件判断、@for 数字范围循环、@each 列表/Map 遍历、@while 条件循环；它们把模板化的 CSS 变成可编程的样式系统，让"机械重复"由编译器完成，从而避免手抄错误并保持代码可维护。',
    flow: ['用 @if/@else 决定是否输出某段样式。', '用 @for $i from 1 through n 生成序号类名。', '用 @each 遍历列表或 Map 批量生成规则。'],
    notes: ['优先使用 @each，可读性和可扩展性比 @for 更好。', '@while 较少使用，通常 @for 或 @each 都可以替代。', '循环不要嵌套过深，否则编译变慢且难以维护。'],
    problem: '解决"相似样式重复书写、批量生成规则效率低、设计令牌无法结构化"的问题。',
  },
{
    id: 'SC_22', title: 'Map 数据结构与函数', navTitle: 'Map 数据结构', category: '数据与函数',
    path: '/sass/sc-22/map-functions', summary: '使用 Sass Map 键值对数据结构，配合 map-get、map-merge、map-keys 等函数管理设计令牌、色阶系统等结构化数据。',
    demo: SC22MapFunctions, code: SC22Code, language: 'vue',
    principle: 'Sass Map 是键值对数据结构（类似 JS 对象），使用 map.get、map.merge、map.keys 等模块函数管理设计令牌、色阶、断点等结构化数据；它让"配置"和"使用"分离，配合 @each 即可批量生成样式，也支持主题扩展和深合并。',
    flow: ['用 (key1: value1, key2: value2) 语法定义 Map。', 'map.get($map, $key) 取值，map.keys 列出所有键。', 'map.merge 合并两个 Map，实现主题扩展。'],
    notes: ['Map 适合组织颜色、字号、间距等设计令牌。', '嵌套 Map 可以表达层级结构（如 color.brand.primary）。', '用 @each 遍历 Map 批量生成样式，是设计与代码同步的常用做法。'],
    problem: '解决"设计变量分散、难以结构化管理和主题扩展"的问题。',
  },
{
    id: 'SC_23', title: 'List 数据结构与函数', navTitle: 'List 数据结构', category: '数据与函数',
    path: '/sass/sc-23/list-functions', summary: '使用 Sass List 有序序列，配合 nth、length、append、join、index 等函数操作，管理间距序列、断点列表、字体栈等有序数据。',
    demo: SC23ListFunctions, code: SC23Code, language: 'vue',
    principle: 'Sass List 是有序序列（用空格或逗号分隔），通过 list.nth、list.length、list.append、list.join、list.index 等模块函数进行操作；适合管理间距序列、断点列表、字体栈等"按顺序有意义"的数据，比 Map 轻量、可读性更高。',
    flow: ['用 list.nth($list, $n) 按索引取值（索引从 1 开始）。', 'list.length 取得长度，list.append 追加新元素。', 'list.join 合并两个列表并指定分隔符。'],
    notes: ['List 索引从 1 开始，与数组常见的 0 不同，需要特别注意。', '空格分隔和逗号分隔都属于 List，调用函数时根据需要明确分隔符。', '复杂关联关系优先用 Map，List 适合简单的有序集合。'],
    problem: '解决"有序数据序列难以操作、重复索引出错"的问题。',
  },
{
    id: 'SC_24', title: '现代模块系统与 @use/@forward', navTitle: '现代模块系统', category: '工程架构',
    path: '/sass/sc-24/module-system', summary: '使用 Sass 现代模块系统 @use 替代 @import，避免命名冲突和重复加载，配合 @forward 转发成员构建清晰的分层样式架构。',
    demo: SC24ModuleSystem, code: SC24Code, language: 'vue',
    principle: 'Sass 现代模块系统用 @use 替代 @import，避免命名冲突和重复加载，配合 @forward 转发成员，可以构建清晰的分层样式架构。',
    flow: ["用 @use 'path' 加载模块，默认使用命名空间", "@use 'path' as * 可以取消命名空间", '@forward 转发其他模块的成员，构建入口文件'],
    notes: ['@import 已被官方标记为弃用', '模块只会加载一次，不会重复', '私有成员用 - 或 _ 前缀，外部不可访问'],
    problem: '解决 @import 全局污染、命名冲突、加载冗余的问题。',
  }
]
