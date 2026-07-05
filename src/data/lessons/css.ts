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


export const lessons: Lesson[] = [
{
    id: 'C_01', title: '选择器详解', navTitle: '选择器', category: '选择器',
    path: '/css/c-1/selectors', summary: '理解通配、类型、类、ID、属性、伪类、伪元素与组合器的匹配规则与优先级。',
    demo: C01Selectors, code: C01Code, language: 'vue',
    principle: 'CSS 选择器按"内联 > ID > 类/属性/伪类 > 类型/伪元素 > 通配 + :where"的优先级决定哪条规则生效；组合器（后代、>、+、~）表达 DOM 关系，伪类基于状态，伪元素基于"虚拟子节点"，三者一起决定能多精细地匹配元素。',
    flow: ['用课程标签筛选理解各类选择器。', '观察不同选择器的生效范围。', '理解优先级计算规则（specificity）。'],
    notes: ['!important 会破坏优先级规则，应尽量避免。', '选择器过深会影响性能与可维护性。', ':where() 优先级为 0，:is() 沿用参数最高者；用好它们能显著降低复杂度。'],
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
  }
]
