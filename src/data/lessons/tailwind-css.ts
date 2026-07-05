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
const TW18FlexGrid = createDemo('TW18FlexGrid')
const TW19Interactivity = createDemo('TW19Interactivity')
const TW20Transform = createDemo('TW20Transform')
const TW21Filters = createDemo('TW21Filters')
const TW22SvgIcons = createDemo('TW22SVGIcons')
const TW23Plugins = createDemo('TW23Plugins')
const TW24Preset = createDemo('TW24Preset')


export const lessons: Lesson[] = [
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
    principle: '尺寸工具描述固定、流体与边界约束（w、min-w-0、max-w-screen-md），间距工具按盒模型与布局两个维度区分：p/m 作用于盒模型内/外，gap 作用于 Flex/Grid 轨道，space-x/y 在相邻子元素之间插入等距边距；统一在设计尺度上取值，避免散落魔法数字。',
    flow: ['先决定容器是固定、流体还是受最大宽度约束。', '用设计尺度（4/8/12…）建立统一间距节奏。', '在长内容与窄屏下验证 min-w-0、overflow 等边界行为。'],
    notes: ['组件内部优先 gap，减少相邻 margin 规则带来的脆弱性。', 'min-w-0 经常被忽略，但能让 Flex/Grid 子项正确收缩避免溢出。', 'space-x-* 改为 flex+gap 是更现代的写法，可读性更高。'],
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
    demo: TW17GridLayout, code: () => Promise.resolve(`<!-- 基础 3 列网格 -->
<div class="grid grid-cols-3 gap-4">
  <div class="rounded-lg bg-amber-100 p-4">1</div>
  <div class="rounded-lg bg-amber-100 p-4">2</div>
  <div class="rounded-lg bg-amber-100 p-4">3</div>
  <div class="rounded-lg bg-amber-100 p-4">4</div>
  <div class="rounded-lg bg-amber-100 p-4">5</div>
  <div class="rounded-lg bg-amber-100 p-4">6</div>
</div>

<!-- 跨列布局 -->
<div class="grid grid-cols-4 gap-3">
  <div class="col-span-2 rounded-lg bg-orange-200 p-4">跨 2 列</div>
  <div class="rounded-lg bg-orange-100 p-4">3</div>
  <div class="rounded-lg bg-orange-100 p-4">4</div>
  <div class="rounded-lg bg-orange-100 p-4">5</div>
  <div class="col-span-3 rounded-lg bg-orange-200 p-4">跨 3 列</div>
</div>

<!-- 响应式网格：移动端 1 列，平板 2 列，桌面 3 列 -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <article class="rounded-xl bg-amber-50 p-4">卡片 A</article>
  <article class="rounded-xl bg-amber-50 p-4">卡片 B</article>
  <article class="rounded-xl bg-amber-50 p-4">卡片 C</article>
</div>

<!-- 12 栅格系统 -->
<div class="grid grid-cols-12 gap-2">
  <div class="col-span-12 rounded bg-orange-300 p-2 text-center">col-span-12</div>
  <div class="col-span-6 rounded bg-orange-200 p-2 text-center">col-span-6</div>
  <div class="col-span-6 rounded bg-orange-200 p-2 text-center">col-span-6</div>
  <div class="col-span-4 rounded bg-orange-100 p-2 text-center">4</div>
  <div class="col-span-4 rounded bg-orange-100 p-2 text-center">4</div>
  <div class="col-span-4 rounded bg-orange-100 p-2 text-center">4</div>
</div>

<!-- place-items 对齐 -->
<div class="grid h-40 grid-cols-3 gap-2 rounded-lg bg-stone-100 place-items-center">
  <div class="rounded bg-amber-200 px-3 py-2">居中</div>
  <div class="rounded bg-amber-200 px-3 py-2">对齐</div>
  <div class="rounded bg-amber-200 px-3 py-2">示例</div>
</div>`), language: 'xml',
    principle: 'Tailwind 的 Grid 布局通过 grid-cols、grid-rows、gap 等工具类快速构建二维网格布局，配合 col-span、row-span 实现跨列跨行，比写 CSS Grid 更简洁高效。',
    flow: ['使用 grid 类启用 Grid 布局', '用 grid-cols-n 定义列数，gap 设置间距', '用 col-span-n 控制子元素跨列，place-items 对齐'],
    notes: ['grid-cols-12 是最常用的 12 栅格系统', '响应式断点前缀可在不同尺寸下切换列数', '配合 place-content/place-items 快速对齐'],
    problem: '解决复杂二维布局手写 CSS Grid 繁琐、响应式切换困难的问题。',
  },
{
    id: 'TW_18', title: 'Flexbox 与 Grid 布局对比选择', navTitle: 'Flex vs Grid', category: '布局与栅格',
    path: '/tailwind-css/tw-18/flex-grid', summary: '理解 Flexbox 与 Grid 的适用场景，一维布局用 Flex，二维布局用 Grid，两者可组合使用。',
    demo: TW18FlexGrid, code: () => Promise.resolve(`<!-- Flex：一维导航栏 -->
<nav class="flex items-center justify-between gap-4 rounded-lg bg-amber-100 px-4 py-3">
  <span class="font-bold text-amber-900">Logo</span>
  <div class="flex gap-3">
    <a href="#" class="text-amber-800 hover:text-amber-950">首页</a>
    <a href="#" class="text-amber-800 hover:text-amber-950">课程</a>
    <a href="#" class="text-amber-800 hover:text-amber-950">关于</a>
  </div>
</nav>

<!-- Grid：二维卡片网格 -->
<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
  <article class="rounded-xl bg-orange-100 p-4">卡片 1</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 2</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 3</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 4</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 5</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 6</article>
</div>

<!-- Flex + Grid 组合：Grid 骨架，Flex 内容对齐 -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
  <article class="flex flex-col justify-between rounded-xl bg-amber-50 p-5">
    <div>
      <h3 class="font-bold text-stone-900">Vue 入门</h3>
      <p class="mt-2 text-sm text-stone-600">基础语法与响应式原理</p>
    </div>
    <button class="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm text-white">开始学习</button>
  </article>
</div>

<!-- Flex：居中对齐 -->
<div class="flex h-24 items-center justify-center rounded-lg bg-stone-100">
  <span class="text-stone-700">Flex 水平垂直居中</span>
</div>

<!-- 选择参考：一维内容流用 Flex，二维轨道布局用 Grid -->`), language: 'xml',
    principle: 'Flexbox 适合一维布局（行或列），Grid 适合二维布局（行和列同时控制），两者可以组合使用，根据布局需求选择最合适的工具。',
    flow: ['一维内容流优先用 Flex（导航、列表、卡片行）', '二维网格布局用 Grid（仪表板、图片墙、表单布局）', 'Flex 做容器内对齐，Grid 做整体骨架，组合使用'],
    notes: ['Flex 内容优先，Grid 布局优先', '两者不互斥，Grid 容器内可以有 Flex 子项', '选择标准：一维 vs 二维、内容驱动 vs 布局驱动'],
    problem: '解决布局选择困难、不知道何时用 Flex 何时用 Grid 的问题。',
  },
{
    id: 'TW_19', title: '交互状态与组(Group)状态', navTitle: '交互状态', category: '响应与状态',
    path: '/tailwind-css/tw-19/interactivity', summary: '使用 hover、focus、active 等状态变体，配合 group 类实现父元素状态触发子元素样式变化。',
    demo: TW19Interactivity, code: () => Promise.resolve(`<!-- 基础按钮交互状态 -->
<button class="rounded-lg bg-orange-600 px-5 py-2.5 text-white transition
  hover:bg-orange-700
  active:bg-orange-800
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed">
  提交
</button>

<!-- Group：父元素悬停触发子元素变化 -->
<article class="group cursor-pointer rounded-xl bg-amber-50 p-5 transition hover:bg-amber-100">
  <h3 class="font-bold text-stone-900 transition group-hover:text-orange-700">
    Vue 性能优化实战
  </h3>
  <p class="mt-2 text-sm text-stone-600">深入理解响应式原理与渲染优化</p>
  <span class="mt-3 inline-block text-orange-600 transition group-hover:translate-x-1">
    查看详情 →
  </span>
</article>

<!-- Peer：兄弟元素状态联动 -->
<label class="flex items-center gap-2">
  <input type="checkbox" class="peer rounded border-stone-300">
  <span class="text-stone-700 peer-checked:text-orange-700 peer-checked:font-medium">
    同意服务条款
  </span>
</label>

<!-- Focus 与表单验证 -->
<input type="email" placeholder="输入邮箱"
  class="w-full rounded-lg border border-stone-300 px-4 py-2 transition
  focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200
  invalid:border-red-500 invalid:focus:ring-red-200">

<!-- 光标与用户选择 -->
<p class="select-all cursor-pointer rounded bg-stone-100 p-3 text-stone-700">
  点击可选中整段文字
</p>`), language: 'xml',
    principle: 'Tailwind 通过 hover、focus、active 等状态变体描述元素交互状态，group 类可以让父元素状态触发子元素样式变化，适合卡片悬停、菜单展开等场景。',
    flow: ['使用 hover:bg-* 定义悬停样式', '用 focus:ring-* 定义聚焦状态', '父元素加 group，子元素用 group-hover: 触发'],
    notes: ['状态变体可以叠加响应式前缀', 'group 支持嵌套，但要注意层级', 'peer 类可以实现兄弟元素状态联动'],
    problem: '解决交互状态 CSS 重复书写、父子联动样式复杂的问题。',
  },
{
    id: 'TW_20', title: '变换、过渡与动画', navTitle: '变换动画', category: '动效与过渡',
    path: '/tailwind-css/tw-20/transform', summary: '使用 transform、transition 和 animate 工具类，配合状态变体实现丰富的交互动效。',
    demo: TW20Transform, code: () => Promise.resolve(`<!-- 悬停放大效果 -->
<button class="rounded-lg bg-orange-600 px-6 py-3 text-white transition duration-200 ease-out
  hover:scale-105 hover:shadow-lg
  active:scale-95">
  点击放大
</button>

<!-- 旋转与位移 -->
<div class="flex gap-8">
  <div class="transition duration-300 hover:rotate-12 hover:scale-110">
    <div class="h-16 w-16 rounded-lg bg-amber-300"></div>
    <p class="mt-2 text-xs text-stone-600">rotate + scale</p>
  </div>
  <div class="transition duration-300 hover:-translate-y-2 hover:shadow-xl">
    <div class="h-16 w-16 rounded-lg bg-orange-400"></div>
    <p class="mt-2 text-xs text-stone-600">translate-y</p>
  </div>
  <div class="transition duration-300 hover:skew-x-6">
    <div class="h-16 w-16 rounded-lg bg-amber-500"></div>
    <p class="mt-2 text-xs text-stone-600">skew-x</p>
  </div>
</div>

<!-- 过渡曲线控制 -->
<button class="rounded-lg bg-stone-700 px-5 py-2.5 text-white transition duration-500 ease-in-out hover:bg-orange-600">
  ease-in-out 过渡
</button>

<!-- 内置关键帧动画 -->
<div class="flex items-center gap-6">
  <span class="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-orange-600"></span>
  <span class="inline-flex h-3 w-3 animate-ping rounded-full bg-orange-500"></span>
  <span class="inline-flex animate-pulse text-orange-600 font-medium">加载中...</span>
  <span class="inline-flex animate-bounce text-2xl">👋</span>
</div>

<!-- 优先动画 transform 与 opacity，性能更好 -->`), language: 'xml',
    principle: 'Tailwind 提供 transform（缩放、旋转、位移、倾斜）、transition（过渡属性）和 animate（关键帧动画）工具类，配合状态变体实现丰富的交互动效。',
    flow: ['使用 scale/rotate/translate/skew 工具类定义变换', '用 transition-all 或 transition-* 控制过渡属性', 'hover:scale-105 配合 transition 实现悬停放大效果'],
    notes: ['动画性能优先使用 transform 和 opacity', 'transition 配合 duration/ease 控制过渡曲线', 'animate 内置常用动画如 spin、ping、bounce、pulse'],
    problem: '解决手写动画 CSS 繁琐、过渡效果不统一的问题。',
  },
{
    id: 'TW_21', title: '滤镜与混合模式', navTitle: '滤镜混合', category: '视觉效果',
    path: '/tailwind-css/tw-21/filters', summary: '使用 CSS filter 和 backdrop-filter 工具类，实现模糊、亮度、对比度等滤镜效果与毛玻璃背景。',
    demo: TW21Filters, code: () => Promise.resolve(`<!-- 图片滤镜效果 -->
<div class="flex flex-wrap gap-4">
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 blur-sm"></div>
    <p class="mt-1 text-xs text-stone-600">blur-sm</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 brightness-125"></div>
    <p class="mt-1 text-xs text-stone-600">brightness-125</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 contrast-75"></div>
    <p class="mt-1 text-xs text-stone-600">contrast-75</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 saturate-200"></div>
    <p class="mt-1 text-xs text-stone-600">saturate-200</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 grayscale"></div>
    <p class="mt-1 text-xs text-stone-600">grayscale</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 sepia"></div>
    <p class="mt-1 text-xs text-stone-600">sepia</p>
  </div>
</div>

<!-- 毛玻璃效果 backdrop-blur -->
<div class="relative h-32 w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
  <div class="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-white/30 px-4 py-3">
    <p class="text-sm font-medium text-stone-800">backdrop-blur 毛玻璃效果</p>
  </div>
</div>

<!-- 组合滤镜 -->
<img class="rounded-lg transition duration-300 hover:brightness-110 hover:saturate-125 hover:shadow-xl"
  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20orange%20gradient&image_size=square"
  alt="示例图片" style="width: 160px; height: 160px; object-fit: cover;">

<!-- 混合模式 -->
<div class="relative h-24 w-48">
  <div class="absolute inset-0 bg-orange-500 rounded-lg"></div>
  <div class="absolute inset-2 bg-amber-200 rounded-lg mix-blend-multiply flex items-center justify-center">
    <span class="text-xs text-stone-800">mix-blend-multiply</span>
  </div>
</div>`), language: 'xml',
    principle: 'Tailwind 提供 CSS filter 和 backdrop-filter 工具类，支持模糊、亮度、对比度、饱和度等滤镜效果，mix-blend-* 实现元素混合模式。',
    flow: ['使用 blur-*、brightness-* 等工具类应用滤镜', 'backdrop-blur-* 实现毛玻璃背景效果', 'mix-blend-* 控制元素与下层内容的混合'],
    notes: ['滤镜可以组合使用，空格分隔', 'backdrop-filter 影响元素后面的内容', '合理使用可以提升视觉层次感'],
    problem: '解决图片处理、毛玻璃效果、视觉特效需要额外图片资源的问题。',
  },
{
    id: 'TW_22', title: 'SVG 图标与当前颜色', navTitle: 'SVG 图标', category: '视觉效果',
    path: '/tailwind-css/tw-22/svg-icons', summary: '通过 currentColor 让 SVG 继承父元素文字颜色，配合 text-* 工具类统一控制颜色和大小。',
    demo: TW22SvgIcons, code: () => Promise.resolve(`<!-- fill 图标用 currentColor -->
<button class="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700">
  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
  </svg>
  <span>查看详情</span>
</button>

<!-- stroke 线性图标用 currentColor -->
<button class="flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2 text-stone-700 hover:border-orange-500 hover:text-orange-600">
  <svg class="h-5 w-5" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
  </svg>
  <span>添加课程</span>
</button>

<!-- 图标颜色跟随文字 -->
<div class="flex items-center gap-6">
  <div class="text-orange-600">
    <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
    <p class="mt-1 text-sm font-medium">收藏</p>
  </div>
  <div class="text-stone-400">
    <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
    <p class="mt-1 text-sm font-medium">未收藏</p>
  </div>
</div>

<!-- 图标尺寸控制 -->
<div class="flex items-end gap-4">
  <svg class="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
  </svg>
  <svg class="h-6 w-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
  </svg>
  <svg class="h-8 w-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
  </svg>
</div>

<!-- currentColor 让图标颜色随父级文字变化，主题切换零成本 -->`), language: 'xml',
    principle: 'Tailwind 配合 SVG 时，把 fill 或 stroke 设为 currentColor 可让图标自动继承父元素文字色，再结合 text-* 工具类就能同时控制文字与图标颜色；使用 stroke 而不是 fill 的线性图标配色更灵活、文件更小，是图标库的最佳实践。',
    flow: ['在 SVG 内部把 fill/stroke 改为 currentColor。', '用 text-* 工具类同时控制文字与图标颜色。', '用 w-*、h-* 或父级 text-* 大小控制图标尺寸。'],
    notes: ['currentColor 让图标颜色跟随上下文，主题切换零成本。', '推荐使用线性 stroke 图标，更容易变色和保持一致性。', '可以直接用 Heroicons、Lucide 等库的 currentColor 变体。'],
    problem: '解决"图标颜色与文字不一致、图标库体积大、主题切换困难"的问题。',
  },
{
    id: 'TW_23', title: '插件系统与自定义插件开发', navTitle: '插件系统', category: '工程与定制',
    path: '/tailwind-css/tw-23/plugins', summary: '使用官方插件扩展能力，以及通过 plugin() API 开发自定义工具类和组件。',
    demo: TW23Plugins, code: () => Promise.resolve(`// tailwind.config.js
import plugin from 'tailwindcss/plugin'

export default {
  // 引入官方插件
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),

    // 自定义插件：添加基础样式
    plugin(function({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.3xl'), fontWeight: theme('fontWeight.bold') },
        'h2': { fontSize: theme('fontSize.2xl'), fontWeight: theme('fontWeight.bold') },
      })
    }),

    // 自定义插件：添加工具类
    plugin(function({ addUtilities }) {
      addUtilities({
        '.content-auto': {
          'content-visibility': 'auto',
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0,0,0,0.1)',
        },
      })
    }),

    // 自定义插件：添加组件类
    plugin(function({ addComponents, theme }) {
      addComponents({
        '.btn': {
          padding: theme('spacing.2') + ' ' + theme('spacing.4'),
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          backgroundColor: theme('colors.orange.600'),
          color: 'white',
          '&:hover': {
            backgroundColor: theme('colors.orange.700'),
          },
        },
        '.card': {
          padding: theme('spacing.5'),
          borderRadius: theme('borderRadius.xl'),
          backgroundColor: 'white',
          boxShadow: theme('boxShadow.md'),
        },
      })
    }),

    // 自定义插件：动态值工具类（matchUtilities）
    plugin(function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],

  // 为动态工具类扩展主题
  theme: {
    extend: {
      textShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        DEFAULT: '0 2px 4px rgba(0,0,0,0.1)',
        lg: '0 4px 8px rgba(0,0,0,0.15)',
      },
    },
  },
}`), language: 'javascript',
    principle: 'Tailwind 插件可以扩展工具类、组件、基础样式和主题，官方提供 typography、forms、aspect-ratio 等插件，也可以编写自定义插件满足项目特定需求。',
    flow: ['在 tailwind.config.js 的 plugins 数组中添加插件', '使用 plugin() API 添加自定义工具类或组件', '用 matchUtilities 生成动态值的工具类'],
    notes: ['官方插件覆盖大多数常见需求', '自定义插件优先考虑能否用 CSS 变量或 theme 扩展解决', '插件发布为 npm 包可以在多项目复用'],
    problem: '解决内置工具类不够用、重复模式需要抽象复用的问题。',
  },
{
    id: 'TW_24', title: '主题预设与设计系统配置', navTitle: '主题预设', category: '工程与定制',
    path: '/tailwind-css/tw-24/preset', summary: '通过 presets 机制将设计系统配置抽成可复用的预设包，多项目共享统一的视觉规范。',
    demo: TW24Preset, code: () => Promise.resolve(`// tailwind.design-system-preset.js （预设包，可发布为 npm 包）
export default {
  // 设计令牌：颜色
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },

      // 字体
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // 间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      // 圆角
      borderRadius: {
        '4xl': '2rem',
      },

      // 动画
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },

  // 预设可以嵌套其他预设
  presets: [
    // require('@company/tailwind-tokens-preset'),
  ],

  // 预设也可以包含插件
  plugins: [
    // require('@tailwindcss/typography'),
  ],
}

// ========== 项目中使用 ==========
// tailwind.config.js
import designSystemPreset from './tailwind.design-system-preset'

export default {
  // 引入设计系统预设
  presets: [designSystemPreset],

  // 项目层可以覆盖或扩展预设
  theme: {
    extend: {
      // 项目特有颜色
      colors: {
        'project-accent': '#8b5cf6',
      },
    },
  },

  // 项目特有插件
  plugins: [],

  // 内容源路径（项目级，不会被预设覆盖）
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}`), language: 'javascript',
    principle: 'Tailwind 的 presets 机制可以把设计系统配置（颜色、字体、间距、断点、动画等设计令牌）抽成独立可复用的包；多个项目通过 presets 共享统一视觉规范，项目层还能针对自身需要覆盖或扩展，让"设计系统"在工程层面真正落地。',
    flow: ['创建预设文件 export default { theme, plugins }。', '在项目 tailwind.config.js 中通过 presets 字段引用。', '项目层覆盖或扩展预设配置，确保个性与一致性并存。'],
    notes: ['预设支持嵌套引用其他预设，方便逐层组合品牌规范。', '设计令牌应与设计师共同定义，避免"代码与设计脱节"。', '预设包使用语义化版本发布，方便在多项目间迭代。'],
    problem: '解决"多项目设计不统一、样式配置重复维护、设计系统难落地"的问题。',
  }
]
