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


export const lessons: Lesson[] = [
{
    id: 'SC_01', title: '变量、作用域与安全嵌套', navTitle: '变量与嵌套', category: '语言基础',
    path: '/sass/sc-1/variables-nesting', summary: '为课程卡提取编译期变量，并建立浅层、可维护的选择器结构。',
    demo: SC01VariablesNesting, code: SC01Code, language: 'scss',
    principle: 'Sass 变量在编译期求值并受词法作用域约束，只在写它的嵌套块内可见；嵌套把选择器写成父子上下文，编译后仍是普通 CSS，层数越深通常特异性和结构耦合越高。',
    flow: ['把稳定的颜色和圆角提取为顶层变量。', '用 &__子元素与状态伪类表达组件内部关系。', '运行时才切换的主题值交给 CSS 自定义属性。'],
    notes: ['Sass 变量不会像 CSS 变量一样在浏览器运行时更新。', '避免按完整 DOM 树逐层嵌套。'],
    problem: '解决"何时使用 Sass 变量，以及如何避免嵌套造成选择器失控"的问题。',
  },
{
    id: 'SC_02', title: '模块系统：@use 与 @forward', navTitle: '模块系统', category: '模块复用',
    path: '/sass/sc-2/modules', summary: '拆分令牌和组件模块，以命名空间与公共 API 管理依赖。',
    demo: SC02Modules, code: SC02Code, language: 'scss',
    principle: '@use 只加载每个模块一次并通过命名空间访问成员，用 - 前缀声明私有成员；@forward 重新导出经过筛选或配置的成员，用于构造样式库的公共 API。',
    flow: ['把令牌与组件拆成独立 partial。', '用 @use 加命名空间引用其它模块成员。', '把内部辅助变量以 $- 前缀隐藏起来。'],
    notes: ['@import 已弃用，新代码使用模块系统。', 'as * 会移除命名空间，只有在成员明确且无冲突时使用。'],
    problem: '解决"多文件样式如何避免全局污染、重复输出和隐式依赖"的问题。',
  },
{
    id: 'SC_03', title: 'Mixin、参数与 @content', navTitle: 'Mixin', category: '模块复用',
    path: '/sass/sc-3/mixins', summary: '封装按钮尺寸规则，通过参数和内容块保留调用方扩展能力。',
    demo: SC03Mixins, code: SC03Code, language: 'scss',
    principle: '@mixin 定义可带位置参数、关键字参数与默认值的声明生成器，@content 让调用方在 @include 位置注入额外声明；@include 在调用处展开为最终 CSS。',
    flow: ['确认复用目标是一组声明而非单个值。', '为可变化维度设计位置或关键字参数。', '调用方需注入自定义内容时在 @include 中写 @content 块。'],
    notes: ['Mixin 每次 include 都会复制声明，需留意产物体积。', '简单复用优先普通类或 CSS 自定义属性。'],
    problem: '解决"可配置样式片段如何复用而不复制维护逻辑"的问题。',
  },
{
    id: 'SC_04', title: '函数、控制流与内置模块', navTitle: '函数与控制流', category: '编程能力',
    path: '/sass/sc-4/functions', summary: '编写间距函数并用 sass:math、sass:color 完成可验证计算。',
    demo: SC04Functions, code: SC04Code, language: 'scss',
    principle: '@function 接收参数并返回单个 Sass 值，可内嵌 @if、@return 等控制流；现代内置能力通过 sass:math、sass:color 等 sass:* 模块提供，来源与名称更清晰。',
    flow: ['用 math.is-unitless 等校验输入单位。', '在 @function 内用 @error 拒绝非法参数。', '复用 sass:math、sass:color 完成计算与颜色转换。'],
    notes: ['函数不应产生 CSS 声明。', '除法使用 math.div，避免已弃用的斜杠除法语义。'],
    problem: '解决"设计计算如何集中、校验并在编译期复用"的问题。',
  },
{
    id: 'SC_05', title: 'Map、List 与批量生成', navTitle: '集合与循环', category: '编程能力',
    path: '/sass/sc-5/collections', summary: '从状态颜色 Map 批量生成通知样式，掌握集合 API 与 @each。',
    demo: SC05Collections, code: SC05Code, language: 'scss',
    principle: 'Sass Map 以键值对表达配置数据，List 表达有序数据；@each 遍历集合并配合 #{} 插值生成规则，sass:map 与 sass:list 模块负责查询与转换。',
    flow: ['用 Map 维护状态名到颜色的键值配置。', '用 @each 解构键与值并插值生成类名。', '用 map.get 单独读取某个成员。'],
    notes: ['不要用循环生成大量实际不会使用的组合。', '业务数据不应进入 Sass，样式配置才适合集合。'],
    problem: '解决"有限设计变体如何由单一配置源批量生成"的问题。',
  },
{
    id: 'SC_06', title: '父选择器、插值与选择器构造', navTitle: '选择器构造', category: '语言基础',
    path: '/sass/sc-6/selectors', summary: '使用 & 表达状态和 BEM 后缀，并理解插值的能力与维护成本。',
    demo: SC06Selectors, code: SC06Code, language: 'scss',
    principle: '& 引用当前外层复合选择器，可拼入 :hover、:focus-visible、BEM 修饰符或反向位置（如 [dir="rtl"] &）；插值 #{} 把 Sass 表达式嵌入选择器或属性名。',
    flow: ['用 & 承接 .lesson-card 上的状态与变体。', '在需要生成标识符的位置使用 #{} 插值。', '关注编译后的选择器是否简短且可预测。'],
    notes: ['& 的结果取决于完整外层选择器。', '动态选择器会降低全文搜索、静态分析和重构能力。'],
    problem: '解决"如何在不重复组件类名的前提下构造状态与修饰选择器"的问题。',
  },
{
    id: 'SC_07', title: '占位选择器与 @extend 边界', navTitle: '@extend', category: '模块复用',
    path: '/sass/sc-7/extend', summary: '用 %placeholder 合并同类通知选择器，并与 Mixin 的复制语义对比。',
    demo: SC07Extend, code: SC07Code, language: 'scss',
    principle: '%placeholder 自身不输出任何 CSS，只有被 @extend 引用时才把扩展方并入该语义集合的选择器列表；@extend 表达"同一语义类型"，而 Mixin 复制一组声明。',
    flow: ['把公共声明放进 %placeholder 占位选择器。', '用 @extend 让具体类并入同一语义集合。', '对照 @extend 合并结果与 Mixin 复制声明的差异。'],
    notes: ['@extend 不能跨 @media 上下文任意工作。', '只想共享声明时 Mixin 通常更直观。'],
    problem: '解决"何时用选择器合并复用样式，以及何时应该复制声明"的问题。',
  },
{
    id: 'SC_08', title: '样式架构、构建与迁移', navTitle: '架构与构建', category: '工程架构',
    path: '/sass/sc-8/architecture', summary: '组织 abstracts、components、pages 和入口文件，并建立现代构建门禁。',
    demo: SC08Architecture, code: SC08Code, language: 'scss',
    principle: 'Sass 工程以模块依赖图而非隐式全局顺序组织：入口只装配模块，partial 用 _index.scss 的 @forward 定义公共 API，编译命令负责压缩并产出 Source Map。',
    flow: ['按令牌、工具、组件与页面职责拆分目录。', '用 @forward 在 _index.scss 汇总库的公共 API。', '应用入口只 @use 装配模块，交由编译器压缩。'],
    notes: ['不要照搬目录模板，规模小的项目保持扁平更好。', '迁移旧项目时先运行 Sass Migrator，再逐步收紧模块边界。'],
    problem: '解决"样式规模增长后如何保持依赖清晰、产物可控并持续升级"的问题。',
  },
{
    id: 'SC_09', title: '值类型、单位与编译期计算', navTitle: '值与单位', category: '语言基础',
    path: '/sass/sc-9/values-units', summary: '理解数字、字符串、颜色、List、Map 与单位代数的行为。',
    demo: SC09ValuesUnits, code: SC09Code, language: 'scss',
    principle: 'Sass 拥有带类型的值系统：数字、字符串、颜色、布尔、null、List、Map 各自有不同的运算规则；数字还携带单位（如 px、rem、ms、s），兼容维度可在运算中换算，不兼容维度在编译期就报错，避免运行时才暴露错位。',
    flow: ['用 meta.type-of 识别表达式的实际值类型。', '判断参与运算的单位维度是否兼容。', '借助 math.compatible 等函数在求值前验证单位。'],
    notes: ['0 也可能携带单位，10px * 0 仍是带单位结果。', '不要用插值（#{}）绕过本应失败的单位检查，会得到无法维护的字符串。', 'px 与 rem 同属长度维度可相加换算，长度加时间则直接在编译期报错。'],
    problem: '解决"Sass 计算为什么有时能换算单位、有时会报维度错误"的问题。',
  },
{
    id: 'SC_10', title: 'sass:math 与单位安全计算', navTitle: '数学模块', category: '内置模块',
    path: '/sass/sc-10/math', summary: '计算网格列宽，掌握 math.div、舍入和单位兼容边界。',
    demo: SC10Math, code: SC10Code, language: 'scss',
    principle: 'sass:math 提供明确除法、幂、舍入、最值与单位检查函数；Sass 只处理编译期已知量，依赖浏览器上下文的内容（如 100%）应保留为 CSS calc。',
    flow: ['在函数入口用 @error 校验输入约束。', '用 math.div 执行明确的数据除法。', '无法编译期确定的百分比关系交给 calc。'],
    notes: ['斜杠除法已被弃用。', '浮点结果需要依据 CSS 需求决定是否舍入。'],
    problem: '解决"如何进行可靠的设计数学计算，并保留浏览器应负责的部分"的问题。',
  },
{
    id: 'SC_11', title: 'sass:color 与配色派生', navTitle: '颜色模块', category: '内置模块',
    path: '/sass/sc-11/color', summary: '从品牌色派生悬浮和柔和背景，并区分 adjust、scale 与 mix。',
    demo: SC11Color, code: SC11Code, language: 'scss',
    principle: 'sass:color 在明确颜色空间中读取与转换通道；color.scale 在有限的色显空间内缩放，color.mix 按权重混合两种颜色，adjust 则增减固定通道量。',
    flow: ['以单一品牌色令牌为来源。', '用 color.scale 控制明度、color.mix 混合出柔和色。', '对派生结果执行实际对比度验证。'],
    notes: ['数学派生不能保证视觉可访问性。', '优先现代模块 API，避免已弃用全局颜色函数。'],
    problem: '解决"如何从有限品牌令牌可靠派生状态颜色，并理解不同函数语义"的问题。',
  },
{
    id: 'SC_12', title: '模块配置、!default 与 with', navTitle: '模块配置', category: '模块复用',
    path: '/sass/sc-12/configuration', summary: '让样式库暴露有限配置项，并在首次 @use 时完成定制。',
    demo: SC12Configuration, code: SC12Code, language: 'scss',
    principle: '模块用 !default 声明可被覆盖的顶层变量，调用方在首次 @use 的 with 子句中传值完成定制；模块只加载一次，因而配置必须唯一且先于其它加载发生。',
    flow: ['用 !default 为可配置顶层变量提供默认值。', '在应用入口首次 @use 的 with 子句传入配置。', '配置驱动选择器前缀或令牌，产出期望样式。'],
    notes: ['不要把所有内部变量都做成配置项。', '复杂配置可用 Mixin 替代 with 的单次加载限制。'],
    problem: '解决"可复用 Sass 库如何允许主题定制又保护内部实现"的问题。',
  },
{
    id: 'SC_13', title: '@at-root 与嵌套上下文控制', navTitle: '@at-root', category: '选择器进阶',
    path: '/sass/sc-13/at-root', summary: '从生成器或深层上下文中输出根级规则，并精确保留 at-rule。',
    demo: SC13AtRoot, code: SC13Code, language: 'scss',
    principle: '@at-root 默认移除当前普通选择器上下文，把规则输出到文档顶层；with/without 查询可精确控制保留或剥离 media、supports 等 at-rule，适合高级选择器生成。',
    flow: ['确认规则不应继承当前组件选择器。', '用普通 @at-root 指定新的根级选择器。', '仅需保留 at-rule 时用 (without: media) 精确控制。'],
    notes: ['不要用 @at-root 掩盖糟糕的深层架构。', '涉及复杂选择器时可配合 sass:selector 模块。'],
    problem: '解决"嵌套内部如何有控制地生成外层或根级规则"的问题。',
  },
{
    id: 'SC_14', title: '媒体查询冒泡与响应式 Mixin', navTitle: '媒体查询', category: '选择器进阶',
    path: '/sass/sc-14/media-queries', summary: '在组件附近声明响应式覆盖，并理解 Sass 的冒泡与查询合并。',
    demo: SC14MediaQueries, code: SC14Code, language: 'scss',
    principle: 'media、supports 等 at-rule 在嵌套时会冒泡到可输出位置，Sass 还会合并可组合的外层查询；断点可用变量定义，并优先用 CSS 范围语法表达。',
    flow: ['以内容临界点定义少量断点变量。', '把组件覆盖规则写在其基础规则旁。', '用 (width >= 值) 的范围语法表达临界点。'],
    notes: ['断点 Mixin 不应隐藏复杂业务判断。', 'Sass 会合并目标一致的外层媒体查询。'],
    problem: '解决"组件响应式样式如何共置，同时保持最终媒体查询清晰"的问题。',
  },
{
    id: 'SC_15', title: 'CSS 自定义属性与 Sass 插值', navTitle: 'CSS 变量协作', category: 'CSS 协作',
    path: '/sass/sc-15/custom-properties', summary: '把编译期令牌写入运行时 CSS 变量，并正确保留字符串。',
    demo: SC15CustomProperties, code: SC15Code, language: 'scss',
    principle: '自定义属性的值可以是任意 CSS 文本，因此写 Sass 值到 :root 时需要 #{} 插值；带引号字符串（如字体栈）需用 meta.inspect 保留其引号表示。',
    flow: ['区分编译期常量与运行时主题值。', '用插值写初始自定义属性，必要时配合 meta.inspect。', '浏览器端通过级联、继承或脚本覆盖变量。'],
    notes: ['插值通常会移除字符串引号。', '运行时切换不应重新依赖 Sass 编译。'],
    problem: '解决"Sass 令牌如何安全进入浏览器可切换的 CSS 变量体系"的问题。',
  },
{
    id: 'SC_16', title: '诊断指令、弃用与自动迁移', navTitle: '诊断与迁移', category: '工程架构',
    path: '/sass/sc-16/diagnostics', summary: '使用 @debug、@warn、@error 建立反馈，并依据弃用信息迁移旧代码。',
    demo: SC16Diagnostics, code: SC16Code, language: 'scss',
    principle: '@debug 输出开发期诊断值，@warn 报告仍可继续的隐患，@error 中断非法构建；编译器弃用警告配合 Sass Migrator 共同支撑模块与语法体系的持续升级。',
    flow: ['在公共函数与 Mixin 边界用 @error/@warn 校验入参。', '用 @debug 输出生成进度等诊断信息。', '依据弃用警告运行 Sass Migrator 完成机械迁移。'],
    notes: ['不要在正常构建中制造高噪声 debug。', '自动迁移后仍需测试视觉回归与 CSS 体积。'],
    problem: '解决"Sass 代码如何在错误时快速失败，并持续摆脱已弃用语法"的问题。',
  },
]
