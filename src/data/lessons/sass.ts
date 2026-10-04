import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import SC01VariablesNesting from '../../demos/SC01VariablesNestingArticle.vue'
import SC02Modules from '../../demos/SC02ModulesArticle.vue'
import SC03Mixins from '../../demos/SC03MixinsArticle.vue'
import SC04Functions from '../../demos/SC04FunctionsArticle.vue'
import SC05Collections from '../../demos/SC05CollectionsArticle.vue'
import SC06Selectors from '../../demos/SC06SelectorsArticle.vue'
import SC07Extend from '../../demos/SC07ExtendArticle.vue'
import SC08Architecture from '../../demos/SC08ArchitectureArticle.vue'
import SC09ValuesUnits from '../../demos/SC09ValuesUnitsArticle.vue'
import SC10Math from '../../demos/SC10MathArticle.vue'
import SC11Color from '../../demos/SC11ColorArticle.vue'
import SC12Configuration from '../../demos/SC12ConfigurationArticle.vue'
import SC13AtRoot from '../../demos/SC13AtRootArticle.vue'
import SC14MediaQueries from '../../demos/SC14MediaQueriesArticle.vue'
import SC15CustomProperties from '../../demos/SC15CustomPropertiesArticle.vue'
import SC16Diagnostics from '../../demos/SC16DiagnosticsArticle.vue'

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

const SC01Code = createCodeLoader('style-code/SC01VariablesNesting.scss.txt')

const SC02Code = createCodeLoader('style-code/SC02Modules.scss.txt')

const SC03Code = createCodeLoader('style-code/SC03Mixins.scss.txt')

const SC04Code = createCodeLoader('style-code/SC04Functions.scss.txt')

const SC05Code = createCodeLoader('style-code/SC05Collections.scss.txt')

const SC06Code = createCodeLoader('style-code/SC06Selectors.scss.txt')

const SC07Code = createCodeLoader('style-code/SC07Extend.scss.txt')

const SC08Code = createCodeLoader('style-code/SC08Architecture.scss.txt')

const SC09Code = createCodeLoader('style-code/SC09ValuesUnits.scss.txt')

const SC10Code = createCodeLoader('style-code/SC10Math.scss.txt')

const SC11Code = createCodeLoader('style-code/SC11Color.scss.txt')

const SC12Code = createCodeLoader('style-code/SC12Configuration.scss.txt')

const SC13Code = createCodeLoader('style-code/SC13AtRoot.scss.txt')

const SC14Code = createCodeLoader('style-code/SC14MediaQueries.scss.txt')

const SC15Code = createCodeLoader('style-code/SC15CustomProperties.scss.txt')

const SC16Code = createCodeLoader('style-code/SC16Diagnostics.scss.txt')

export const lessons: Lesson[] = [
{
    id: 'SC_01', title: '变量、作用域与安全嵌套', navTitle: '变量与嵌套', category: '语言基础',
    path: '/sass/sc-1/variables-nesting', summary: '为课程卡提取编译期变量，并建立浅层、可维护的选择器结构。',
    demo: null,
    demoComponent: SC01VariablesNesting, code: SC01Code, language: 'scss',
    principle: 'Sass 变量在编译期求值并受词法作用域约束，只在声明它的嵌套块内可见，同名内层变量会遮蔽外层同名变量；嵌套把选择器写成父子上下文，编译产物仍是普通 CSS 后代选择器，但层数越深，生成的选择器越长、特异性越高、与 DOM 结构的耦合也越紧，重构时牵一发而动全身。',
    flow: ['把稳定的颜色和圆角提取为顶层变量。', '用 &__子元素与状态伪类表达组件内部关系。', '运行时才切换的主题值交给 CSS 自定义属性。', '在编译产物中复查选择器长度与嵌套深度，避免结构性失控。'],
    notes: ['Sass 变量不会像 CSS 变量一样在浏览器运行时更新。', '避免按完整 DOM 树逐层嵌套。', '!default 让变量可被外部覆盖，!global 会把局部赋值提升到全局作用域，后者慎用以免作用域混乱。', '嵌套建议控制在三层以内，再深就改用独立类名或 @at-root 拉平结构。'],
    problem: '解决"何时使用 Sass 变量，以及如何避免嵌套造成选择器失控"的问题。',
  },
{
    id: 'SC_02', title: '模块系统：@use 与 @forward', navTitle: '模块系统', category: '模块复用',
    path: '/sass/sc-2/modules', summary: '拆分令牌和组件模块，以命名空间与公共 API 管理依赖。',
    demo: null,
    demoComponent: SC02Modules, code: SC02Code, language: 'scss',
    principle: '@use 让每个模块只加载一次，成员经“命名空间.成员”访问，不污染全局；以 - 或 _ 开头的成员视为私有，外部不可引用；@forward 把其他模块的成员筛选后重新导出，并可配合 show/hide 与配置项，用来搭建样式库稳定的公共 API，把过去 @import 时代的隐式全局依赖变成显式的模块图。',
    flow: ['把令牌与组件拆成独立 partial。', '用 @use 加命名空间引用其它模块成员。', '把内部辅助变量以 $- 前缀隐藏起来。', '用 @forward 在 _index.scss 汇总公共 API，应用侧只 @use 入口文件。'],
    notes: ['@import 已弃用，新代码使用模块系统。', 'as * 会移除命名空间，只有在成员明确且无冲突时使用。', '@use 必须写在其它规则之前，且每个模块只被加载一次；需要别名时可用 as 指定命名空间。', '只想引入部分成员时用 show/hide 收窄导出，减少命名空间污染与误用。'],
    problem: '解决"多文件样式如何避免全局污染、重复输出，并让依赖关系显式可查"的问题。',
  },
{
    id: 'SC_03', title: 'Mixin、参数与 @content', navTitle: 'Mixin', category: '模块复用',
    path: '/sass/sc-3/mixins', summary: '封装按钮尺寸规则，通过参数和内容块保留调用方扩展能力。',
    demo: null,
    demoComponent: SC03Mixins, code: SC03Code, language: 'scss',
    principle: '@mixin 定义可带位置参数、关键字参数与默认值的声明生成器，@content 让调用方在 @include 位置注入额外声明；每次 @include 都会把声明复制到调用处，因此适合复用"一组声明"而非单个值。若只复用一个值，应优先使用变量或函数，避免无谓地放大产物。',
    flow: ['确认复用目标是一组声明而非单个值。', '为可变化维度设计位置或关键字参数。', '调用方需注入自定义内容时在 @include 中写 @content 块。', '编译后在产物中核对每个 @include 展开的声明是否符合预期。'],
    notes: ['Mixin 每次 include 都会复制声明，需留意产物体积。', '简单复用优先普通类或 CSS 自定义属性。', '可在 Mixin 内用 @if + @error 校验入参，让非法参数在编译期直接失败。', '@content 适合少量定制；注入规则过多说明抽象层次错了，应考虑拆成两个 Mixin。'],
    problem: '解决"按钮等可配置样式片段如何复用，而不用复制整段声明、分别维护"的问题。',
  },
{
    id: 'SC_04', title: '函数、控制流与内置模块', navTitle: '函数与控制流', category: '编程能力',
    path: '/sass/sc-4/functions', summary: '编写间距函数并用 sass:math、sass:color 完成可验证计算。',
    demo: null,
    demoComponent: SC04Functions, code: SC04Code, language: 'scss',
    principle: '@function 接收参数并返回单个 Sass 值，可内嵌 @if、@return 等控制流；现代内置能力通过 sass:math、sass:color 等 sass:* 模块提供。函数只做计算，不应产生 CSS 声明；需要输出声明时应改用 Mixin，职责边界要分清楚。',
    flow: ['用 math.is-unitless 等校验输入单位。', '在 @function 内用 @error 拒绝非法参数。', '复用 sass:math、sass:color 完成计算与颜色转换。', '把计算函数集中到 _functions.scss，供令牌与组件共同复用。'],
    notes: ['函数不应产生 CSS 声明。', '除法使用 math.div，避免已弃用的斜杠除法语义。', '自定义函数名应与内置函数区分，复杂计算拆成小函数组合更易测试与复用。', '函数返回值应可预测：同样参数在任何调用位置都产出同样的值，避免依赖全局状态。'],
    problem: '解决"间距、比例等设计计算如何集中定义、带校验地在编译期复用"的问题。',
  },
{
    id: 'SC_05', title: 'Map、List 与批量生成', navTitle: '集合与循环', category: '编程能力',
    path: '/sass/sc-5/collections', summary: '从状态颜色 Map 批量生成通知样式，掌握集合 API 与 @each。',
    demo: null,
    demoComponent: SC05Collections, code: SC05Code, language: 'scss',
    principle: 'Sass Map 以键值对表达配置数据，List 表达有序数据；@each 遍历集合并配合 #{} 插值生成规则，sass:map 与 sass:list 模块负责查询与转换，把设计变体收敛为单一配置源。新增变体时只改配置数据，生成规则会自动同步，避免手写规则遗漏或命名不一致。',
    flow: ['用 Map 维护状态名到颜色的键值配置。', '用 @each 解构键与值并插值生成类名。', '用 map.get 单独读取某个成员。', '新增状态只补充配置项，重新编译后核对生成的类名与样式。'],
    notes: ['不要用循环生成大量实际不会使用的组合。', '业务数据不应进入 Sass，样式配置才适合集合。', 'map.merge/map.set 返回新的 Map，不改变源 Map，更新配置时要接收返回值。', '嵌套较深的配置建议用 map.get 逐层取值，或拆成多个浅 Map，可读性更好。'],
    problem: '解决"状态色等有限设计变体如何从单一配置源批量生成，避免手写重复"的问题。',
  },
{
    id: 'SC_06', title: '父选择器、插值与选择器构造', navTitle: '选择器构造', category: '语言基础',
    path: '/sass/sc-6/selectors', summary: '使用 & 表达状态和 BEM 后缀，并理解插值的能力与维护成本。',
    demo: null,
    demoComponent: SC06Selectors, code: SC06Code, language: 'scss',
    principle: '& 引用当前外层复合选择器，可拼入 :hover、:focus-visible、BEM 修饰符或反向位置（如 [dir="rtl"] &）；插值 #{} 把 Sass 表达式嵌入选择器或属性名。二者都很灵活，但过度动态会削弱可搜索与可重构性，生成的规则应尽量浅显直观。',
    flow: ['用 & 承接 .lesson-card 上的状态与变体。', '在需要生成标识符的位置使用 #{} 插值。', '关注编译后的选择器是否简短且可预测。', '把动态程度控制在状态与变体上，选择器主体保持静态可搜索。'],
    notes: ['& 的结果取决于完整外层选择器。', '动态选择器会降低全文搜索、静态分析和重构能力。', '需要更精细的组合时可用 sass:selector 模块的 selector.append/nest/unify 等 API。', '& 拼伪类时要写在伪类前（如 &:hover），写在后面会解析成不同语义的选择器。'],
    problem: '解决"如何在不重复组件类名的前提下，构造清晰可搜索的状态与修饰选择器"的问题。',
  },
{
    id: 'SC_07', title: '占位选择器与 @extend 边界', navTitle: '@extend', category: '模块复用',
    path: '/sass/sc-7/extend', summary: '用 %placeholder 合并同类通知选择器，并与 Mixin 的复制语义对比。',
    demo: null,
    demoComponent: SC07Extend, code: SC07Code, language: 'scss',
    principle: '%placeholder 自身不输出任何 CSS，只有被 @extend 引用时，编译器才把扩展方的选择器并入该占位符的选择器列表，最终合并成一条规则；@extend 表达“同一语义类型的不同变体”，适合表单控件这类天然同族的元素，而 Mixin 是把一组声明复制进调用处，两者语义不同，混用会让选择器结构失控。',
    flow: ['把公共声明放进 %placeholder 占位选择器。', '用 @extend 让具体类并入同一语义集合。', '对照 @extend 合并结果与 Mixin 复制声明的差异。', '检查最终 CSS：确认被扩展选择器确实并入了同一条规则而非各自复制。'],
    notes: ['@extend 不能跨 @media 上下文任意工作。', '只想共享声明时 Mixin 通常更直观。', '占位选择器自身永不产出 CSS，只有被 @extend 时才并入选择器列表，不会产生冗余体积。', '@extend 在大型项目中容易影响非预期的选择器，确定性要求高时优先选 Mixin。'],
    problem: '解决"何时用 @extend 做选择器合并复用样式，何时应该改用 Mixin 复制声明"的问题。',
  },
{
    id: 'SC_08', title: '样式架构、构建与迁移', navTitle: '架构与构建', category: '工程架构',
    path: '/sass/sc-8/architecture', summary: '组织 abstracts、components、pages 和入口文件，并建立现代构建门禁。',
    demo: null,
    demoComponent: SC08Architecture, code: SC08Code, language: 'scss',
    principle: 'Sass 工程以模块依赖图而非隐式全局顺序组织：入口只装配模块，partial 用 _index.scss 的 @forward 定义公共 API，编译命令负责压缩并产出 Source Map，让依赖方向与产物都保持可控。目录结构按职责分层，任何文件都不依赖上层的具体页面样式。',
    flow: ['按令牌、工具、组件与页面职责拆分目录。', '用 @forward 在 _index.scss 汇总库的公共 API。', '应用入口只 @use 装配模块，交由编译器压缩。', '在 CI 中固定编译命令参数，保证本地与流水线产物一致。'],
    notes: ['不要照搬目录模板，规模小的项目保持扁平更好。', '迁移旧项目时先运行 Sass Migrator，再逐步收紧模块边界。', '入口文件不要声明具体样式，只负责 @use/@forward 装配，保证依赖方向单一。', '把编译命令固化为 npm script，避免本地与 CI 使用不同的压缩与 Source Map 参数。'],
    problem: '解决"样式规模增长后如何保持模块依赖清晰、编译产物可控并持续升级"的问题。',
  },
{
    id: 'SC_09', title: '值类型、单位与编译期计算', navTitle: '值与单位', category: '语言基础',
    path: '/sass/sc-9/values-units', summary: '理解数字、字符串、颜色、List、Map 与单位代数的行为。',
    demo: null,
    demoComponent: SC09ValuesUnits, code: SC09Code, language: 'scss',
    principle: 'Sass 拥有带类型的值系统：数字、字符串、颜色、布尔、null、List、Map 各自有不同的运算规则；数字还携带单位（如 px、rem、ms、s），兼容维度可在运算中换算，不兼容维度在编译期就报错，避免运行时才暴露错位。类型判断可用 meta.type-of，必要时用 meta.inspect 打印实际值排查。',
    flow: ['用 meta.type-of 识别表达式的实际值类型。', '判断参与运算的单位维度是否兼容。', '借助 math.compatible 等函数在求值前验证单位。', '对不兼容的运算结果做断言，让错误在编译期而非线上暴露。'],
    notes: ['0 也可能携带单位，10px * 0 仍是带单位结果。', '不要用插值（#{}）绕过本应失败的单位检查，会得到无法维护的字符串。', 'px 与 rem 同属长度维度可相加换算，长度加时间则直接在编译期报错。', 'meta.inspect 输出值的字面表示，适合在 @debug 中排查类型与单位问题。'],
    problem: '解决"Sass 计算为什么有时能自动换算单位、有时却报维度错误"的疑惑问题。',
  },
{
    id: 'SC_10', title: 'sass:math 与单位安全计算', navTitle: '数学模块', category: '内置模块',
    path: '/sass/sc-10/math', summary: '计算网格列宽，掌握 math.div、舍入和单位兼容边界。',
    demo: null,
    demoComponent: SC10Math, code: SC10Code, language: 'scss',
    principle: 'sass:math 提供明确的除法 math.div、幂、舍入 round/ceil/floor、最值 min/max 与单位检查 compatible 等函数，统一处理数字运算与单位安全；Sass 只能处理编译期已知量，任何依赖浏览器运行上下文的值（如 100%、vw、env()、var()）都无法参与编译期计算，应保留为 CSS calc() 表达式交给浏览器求值。',
    flow: ['在函数入口用 @error 校验输入约束。', '用 math.div 执行明确的数据除法。', '无法编译期确定的百分比关系交给 calc。', '为常用换算沉淀成函数，避免在业务样式中散落魔法数字。'],
    notes: ['斜杠除法已被弃用。', '浮点结果需要依据 CSS 需求决定是否舍入。', '百分比与单位的换算规则以 sass:math 文档为准，尽量不要凭直觉手写转换系数。', 'calc() 内可以混用 Sass 变量，编译后变量替换为字面量，浏览器负责最终求值。'],
    problem: '解决"如何进行可靠的设计数学计算，并把浏览器运行时才负责的部分留给 calc"的问题。',
  },
{
    id: 'SC_11', title: 'sass:color 与配色派生', navTitle: '颜色模块', category: '内置模块',
    path: '/sass/sc-11/color', summary: '从品牌色派生悬浮和柔和背景，并区分 adjust、scale 与 mix。',
    demo: null,
    demoComponent: SC11Color, code: SC11Code, language: 'scss',
    principle: 'sass:color 在明确的颜色空间中读取与转换通道：color.scale 在色显空间内按比例缩放，color.mix 按权重混合两种颜色，color.adjust 增减固定通道量；派生结果仍需人工验证对比度。现代颜色函数都基于 sass:color 模块，旧的全局颜色函数已进入弃用流程。',
    flow: ['以单一品牌色令牌为来源。', '用 color.scale 控制明度、color.mix 混合出柔和色。', '对派生结果执行实际对比度验证。', '把通过验证的派生色固化为令牌，避免每次使用都重新计算。'],
    notes: ['数学派生不能保证视觉可访问性。', '优先现代模块 API，避免已弃用全局颜色函数。', 'color.adjust 与 color.scale 语义不同（固定增减 vs 按比例缩放），混用会产生难以解释的色差。', '深浅色模式下的派生色要分别验证，同一算法在深色底上的对比度并不等价。'],
    problem: '解决"如何从有限品牌令牌可靠派生状态颜色，并理解不同函数语义"的问题。',
  },
{
    id: 'SC_12', title: '模块配置、!default 与 with', navTitle: '模块配置', category: '模块复用',
    path: '/sass/sc-12/configuration', summary: '让样式库暴露有限配置项，并在首次 @use 时完成定制。',
    demo: null,
    demoComponent: SC12Configuration, code: SC12Code, language: 'scss',
    principle: '模块用 !default 声明“可被覆盖”的顶层变量——若变量已有值则保留原值，否则赋默认值；调用方在首次 @use 的 with 子句中传值即可完成定制。由于模块只加载一次且配置在第一次加载时冻结，同一模块的配置必须唯一，且必须发生在任何其他加载之前，否则会被忽略并报错。',
    flow: ['用 !default 为可配置顶层变量提供默认值。', '在应用入口首次 @use 的 with 子句传入配置。', '配置驱动选择器前缀或令牌，产出期望样式。', '把所有可配置项写成文档表格，说明类型、默认值与影响范围，方便使用者对照。'],
    notes: ['不要把所有内部变量都做成配置项。', '复杂配置可用 Mixin 替代 with 的单次加载限制。', '配置项在首次 @use 的 with 中确定后无法二次修改，运行时可变主题应交给 CSS 自定义属性。', 'with 传值失败通常是因为该模块在此之前已被其他文件加载，排查时要检查整个依赖链的加载顺序。'],
    problem: '解决"可复用 Sass 库如何既允许使用方做主题定制、又保护内部实现不被破坏"的问题。',
  },
{
    id: 'SC_13', title: '@at-root 与嵌套上下文控制', navTitle: '@at-root', category: '选择器进阶',
    path: '/sass/sc-13/at-root', summary: '从生成器或深层上下文中输出根级规则，并精确保留 at-rule。',
    demo: null,
    demoComponent: SC13AtRoot, code: SC13Code, language: 'scss',
    principle: '@at-root 默认移除当前普通选择器上下文，把规则输出到文档顶层；with/without 查询可精确控制保留或剥离 media、supports 等 at-rule，适合在深层嵌套中生成独立规则。它解决的是输出位置问题，而不应被当作掩盖糟糕嵌套结构的捷径。',
    flow: ['确认规则不应继承当前组件选择器。', '用普通 @at-root 指定新的根级选择器。', '仅需保留 at-rule 时用 (without: media) 精确控制。', '对比编译产物，确认规则输出位置与预期一致再合入。'],
    notes: ['不要用 @at-root 掩盖糟糕的深层架构。', '涉及复杂选择器时可配合 sass:selector 模块。', '在 @at-root 内使用 & 时先确认展开结果，复杂场景建议对比编译产物再定稿。', '嵌套深到需要 @at-root 时先反思结构本身，多数场景拆类名比拉平更简单。'],
    problem: '解决"深层嵌套内部如何有控制地生成外层或根级规则，而不脱离组件结构"的问题。',
  },
{
    id: 'SC_14', title: '媒体查询冒泡与响应式 Mixin', navTitle: '媒体查询', category: '选择器进阶',
    path: '/sass/sc-14/media-queries', summary: '在组件附近声明响应式覆盖，并理解 Sass 的冒泡与查询合并。',
    demo: null,
    demoComponent: SC14MediaQueries, code: SC14Code, language: 'scss',
    principle: 'media、supports 等 at-rule 在嵌套时会冒泡到可输出位置，Sass 还会合并可组合的外层查询；断点可用变量集中定义，并优先用 CSS 范围语法（width >= 值）表达临界条件。把响应式规则写在组件规则旁边，能让组件在何种条件下变化一目了然。',
    flow: ['以内容临界点定义少量断点变量。', '把组件覆盖规则写在其基础规则旁。', '用 (width >= 值) 的范围语法表达临界点。', '编译后检查媒体查询是否按预期合并、没有重复输出。'],
    notes: ['断点 Mixin 不应隐藏复杂业务判断。', 'Sass 会合并目标一致的外层媒体查询。', '范围语法（width >= 768px）更直观，但要注意与项目浏览器兼容目标保持一致。', '断点数量控制在 2-3 个常用值，每多一个断点都会成倍增加需要验证的组合。'],
    problem: '解决"组件响应式样式如何就近共置，同时保持最终输出的媒体查询清晰不重复"的问题。',
  },
{
    id: 'SC_15', title: 'CSS 自定义属性与 Sass 插值', navTitle: 'CSS 变量协作', category: 'CSS 协作',
    path: '/sass/sc-15/custom-properties', summary: '把编译期令牌写入运行时 CSS 变量，并正确保留字符串。',
    demo: null,
    demoComponent: SC15CustomProperties, code: SC15Code, language: 'scss',
    principle: '自定义属性的值可以是任意 CSS 文本，因此写 Sass 值到 :root 时需要 #{} 插值；带引号字符串（如字体栈）需用 meta.inspect 保留其引号表示，否则插值会剥掉引号导致声明无效。自定义属性在运行时参与级联与继承，Sass 变量则只存在于编译期，两者职责要区分。',
    flow: ['区分编译期常量与运行时主题值。', '用插值写初始自定义属性，必要时配合 meta.inspect。', '浏览器端通过级联、继承或脚本覆盖变量。', '用浏览器开发者工具验证自定义属性在运行时的最终值。'],
    notes: ['插值通常会移除字符串引号。', '运行时切换不应重新依赖 Sass 编译。', '自定义属性名大小写敏感（--Main 与 --main 不同），主题切换只改值、不需要重新编译 Sass。', '在 :root 上声明的是全局默认值；组件作用域内重声明同名变量可实现局部主题覆盖。'],
    problem: '解决"Sass 令牌如何安全进入浏览器可切换的 CSS 变量体系"的问题。',
  },
{
    id: 'SC_16', title: '诊断指令、弃用与自动迁移', navTitle: '诊断与迁移', category: '工程架构',
    path: '/sass/sc-16/diagnostics', summary: '使用 @debug、@warn、@error 建立反馈，并依据弃用信息迁移旧代码。',
    demo: null,
    demoComponent: SC16Diagnostics, code: SC16Code, language: 'scss',
    principle: '@debug 输出开发期诊断值并在命令行可见，@warn 报告“可以继续但有隐患”的问题（如超出预期范围的参数），@error 直接中断构建、阻止非法样式上线；三者构成从提示到熔断的分级反馈。编译器的弃用警告（deprecation warning）配合 Sass Migrator 工具，支持模块系统与语法在版本间平滑迁移。',
    flow: ['在公共函数与 Mixin 边界用 @error/@warn 校验入参。', '用 @debug 输出生成进度等诊断信息。', '依据弃用警告运行 Sass Migrator 完成机械迁移。', '在 CI 中把弃用警告视为错误，让新语法问题无法悄然进入主分支。'],
    notes: ['不要在正常构建中制造高噪声 debug。', '自动迁移后仍需测试视觉回归与 CSS 体积。', '把 @warn/@error 用在公共 API 的入口做参数校验，让问题在编译期暴露而不是样式静默出错。', '@debug 输出会在构建日志中累积，排查完成后及时移除以免淹没真正重要的警告。'],
    problem: '解决"Sass 代码如何在错误时快速失败，并持续摆脱已弃用语法"的问题。',
  },
]
