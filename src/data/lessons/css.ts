import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

const C01Selectors = createDemo('C01Selectors')
const C02BoxModel = createDemo('C02BoxModel')
const C03Flexbox = createDemo('C03Flexbox')
const C04Grid = createDemo('C04Grid')
const C05Position = createDemo('C05Position')
const C06Cascade = createDemo('C06Cascade')
const C07Variables = createDemo('C07Variables')
const C08Transition = createDemo('C08Transition')
const C09MediaQuery = createDemo('C09MediaQuery')
const C10Gradient = createDemo('C10Gradient')
const C11Filter = createDemo('C11Filter')
const C12MathFunctions = createDemo('C12MathFunctions')
const C13ViewportUnits = createDemo('C13ViewportUnits')
const C14ClipPath = createDemo('C14ClipPath')
const C15LogicalProperties = createDemo('C15LogicalProperties')
const C16ContainerQuery = createDemo('C16ContainerQuery')
const C17StackingContext = createDemo('C17StackingContext')
const C18FormattingContext = createDemo('C18FormattingContext')
const C19BEM = createDemo('C19BEM')
const C20Performance = createDemo('C20Performance')
const C21CascadeLayers = createDemo('C21CascadeLayers')
const C22HasSelector = createDemo('C22HasSelector')
const C23ScrollSnap = createDemo('C23ScrollSnap')
const C24AspectRatio = createDemo('C24AspectRatio')

export const lessons: Lesson[] = [
{
    id: 'C_01', title: '选择器详解', navTitle: '选择器', category: '选择器',
    path: '/css/c-1/selectors', summary: '理解通配、类型、类、ID、属性、伪类、伪元素与组合器的匹配差异与特异性。',
    demo: C01Selectors,
    code: () => Promise.resolve(`/* 通配选择器：匹配所有元素 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 类型选择器：匹配指定标签 */
p {
  line-height: 1.6;
  color: #333;
}

/* 类选择器：匹配 class 包含指定值的元素 */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

/* ID 选择器：匹配 id 等于指定值的元素 */
#header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 属性选择器：匹配拥有指定属性的元素 */
input[type="text"] {
  border: 1px solid #ddd;
  padding: 6px 10px;
}

/* 伪类选择器：匹配处于特定状态的元素 */
a:hover {
  color: #e8590c;
  text-decoration: underline;
}

/* 伪元素选择器：匹配元素的某个部分 */
p::first-letter {
  font-size: 2em;
  font-weight: bold;
  float: left;
  margin-right: 4px;
}

/* 组合器：子元素选择器 */
.nav > li {
  display: inline-block;
  margin: 0 8px;
}`),
    language: 'css',
    principle: '选择器决定匹配对象：通配匹配全部、类型匹配标签名、类/ID 匹配 class/id、属性匹配特性、伪类匹配状态、伪元素匹配元素的"虚拟部分"，组合器（后代、>、+、~）则表达元素间的结构关系。它们各具特异性（specificity），命中同一元素时以特异性大小决定胜负。',
    flow: ['点击标签按钮逐类查看对应选择器命中了哪些元素。', '观察每类选择器的生效范围与遗漏。', '结合特异性规律理解样式覆盖顺序。'],
    notes: ['特异性大致为 ID > 类/属性/伪类 > 类型/伪元素，是覆盖顺序的关键。', '伪元素以 ::before、::first-letter 等命中盒子上的"虚拟位置"，可插入内容或局部排版。', '选择器不宜嵌套过深，否则可维护性与匹配效率都会下降。'],
    problem: '解决"如何精准选中目标元素，并理解样式覆盖顺序"的问题。',
  },
{
    id: 'C_02', title: '盒模型与尺寸计算', navTitle: '盒模型', category: '基础模型',
    path: '/css/c-2/box-model', summary: '理解 content-box 与 border-box 的尺寸差异，以及外边距折叠现象。',
    demo: C02BoxModel,
    code: () => Promise.resolve(`/* content-box：width 只包含内容区 */
.box-content {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 2px solid #e8590c;
  /* 实际总宽度 = 200 + 40 + 4 = 244px */
}

/* border-box：width 包含内容 + padding + border */
.box-border {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 2px solid #e8590c;
  /* 实际总宽度 = 200px */
}

/* 全局设置 border-box（推荐做法） */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 外边距折叠：垂直相邻块级元素的 margin 会合并 */
.card-top {
  margin-bottom: 20px;
}
.card-bottom {
  margin-top: 20px;
  /* 实际间距是 20px，不是 40px */
}

/* padding 内边距示例 */
.card-padding {
  padding: 16px 24px;
  /* 上下 16px，左右 24px */
}

/* border 边框示例 */
.card-border {
  border: 1px solid #ddd;
  border-radius: 8px;
  border-left: 4px solid #e8590c;
}`),
    language: 'css',
    principle: 'box-sizing 决定 width 是否计入 padding 与 border：content-box 的 width 只含内容区，实际总宽要另加 padding 与 border；border-box 把内容区压缩以包含二者，width 即最终外围宽度。外边距折叠指普通文档流中垂直相邻的块级盒，外边距合并取较大值。',
    flow: ['切换 content-box / border-box 观察内容区与总宽度的变化。', '对照尺寸计算表看 content/padding/border 三者如何分摊。', '切换外边距折叠，确认 30px 与 20px 合并为 30px。'],
    notes: ['全局统一 * { box-sizing: border-box } 可避免"设了宽度实际更宽"的困扰，是通用做法。', '外边距折叠仅发生在垂直方向、相邻块级盒之间，不进子元素内部。'],
    problem: '解决"设置 width: 200px 但元素实际更宽，以及相邻元素间距不符合预期"的问题。',
  },
{
    id: 'C_03', title: 'Flexbox 弹性布局', navTitle: 'Flexbox', category: '布局系统',
    path: '/css/c-3/flexbox', summary: '用课程卡片列表理解主轴、交叉轴对齐与弹性伸缩。',
    demo: C03Flexbox,
    code: () => Promise.resolve(`/* Flex 容器：启用弹性布局 */
.flex-container {
  display: flex;
  gap: 12px;
}

/* 主轴对齐方式 */
.justify-center {
  justify-content: center;
  /* 主轴居中 */
}
.justify-between {
  justify-content: space-between;
  /* 两端对齐，中间均匀分布 */
}
.justify-around {
  justify-content: space-around;
  /* 每个项目两侧间距相等 */
}

/* 交叉轴对齐方式 */
.align-center {
  align-items: center;
  /* 交叉轴居中 */
}
.align-stretch {
  align-items: stretch;
  /* 拉伸填满容器高度（默认） */
}
.align-baseline {
  align-items: baseline;
  /* 基线对齐 */
}

/* 换行设置 */
.flex-wrap {
  flex-wrap: wrap;
  /* 空间不足时换行 */
}

/* Flex 项目：弹性增长 */
.flex-grow {
  flex-grow: 1;
  /* 平分剩余空间 */
}

/* 改变排列顺序 */
.order-first {
  order: -1;
  /* 排在最前面 */
}

/* 简写：flex: grow shrink basis */
.flex-1 {
  flex: 1 1 0%;
  /* 常用简写：可伸缩 */
}`),
    language: 'css',
    principle: 'Flexbox 是一维布局模型：主轴由 flex-direction 决定（row/column），交叉轴垂直于主轴；justify-content 负责主轴对齐，align-items 负责交叉轴对齐，flex-wrap 决定超宽时是否换行，gap 设置项目间距，order 调整显示顺序。',
    flow: ['切换 flex-direction 观察主轴方向如何改变排列。', '分别调整 justify-content 与 align-items 对比两轴对齐。', '拖动 gap 滑块并选择 flex-wrap 观察间距与换行。'],
    notes: ['justify-content 管主轴、align-items 管交叉轴，二者不可混用。', 'flex: 1 是 flex-grow:1 flex-shrink:1 flex-basis:0% 的简写，用于均分剩余空间。', 'Flexbox 适合一维组件内部排列，二维整体布局交给 Grid。'],
    problem: '解决"如何让子元素在主轴/交叉轴上灵活对齐，并处理空间分配"的问题。',
  },
{
    id: 'C_04', title: 'Grid 二维网格布局', navTitle: 'Grid', category: '布局系统',
    path: '/css/c-4/grid', summary: '用课程仪表盘理解列轨道定义、gap 与 grid-template-areas 区域布局。',
    demo: C04Grid,
    code: () => Promise.resolve(`/* Grid 容器：启用网格布局 */
.grid-container {
  display: grid;
  gap: 16px;
}

/* 定义列轨道 */
.grid-cols-3 {
  grid-template-columns: 1fr 1fr 1fr;
  /* 三等分列 */
}
.grid-cols-auto {
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  /* 每列最小 100px，最大平分 */
}

/* 定义行轨道 */
.grid-rows-2 {
  grid-template-rows: auto 1fr;
  /* 第一行自适应，第二行占剩余 */
}

/* 区域命名布局 */
.grid-areas {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.grid-areas .header { grid-area: header; }
.grid-areas .sidebar { grid-area: sidebar; }
.grid-areas .main { grid-area: main; }
.grid-areas .footer { grid-area: footer; }

/* 网格线放置项目 */
.item-span {
  grid-column: 1 / 3;
  /* 从第 1 列线到第 3 列线（跨 2 列） */
  grid-row: span 2;
  /* 跨 2 行 */
}

/* 自动填充 */
.grid-auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* 自动填充，每列至少 200px */
}`),
    language: 'css',
    principle: 'Grid 是二维布局模型：grid-template-columns/rows 定义轨道，fr 分配可用空间比例，repeat() 简化重复、auto-fill+minmax() 实现自动填充；grid-template-areas 通过命名区域语义化描述页面骨架，子元素用 grid-area 归位。',
    flow: ['切换列轨道（等列/固定弹性固定/自动填充）观察列数变化。', '拖动 gap 滑块查看轨道间距。', '开启 grid-area 查看"页头/侧栏/内容/页脚"区域布局。'],
    notes: ['1fr 表示占据剩余可用空间的一份，可和固定像素轨道混用。', 'repeat(auto-fill, minmax(120px, 1fr)) 让列数随宽度自动增减。', 'Grid 负责二维整体布局，一维的组件内部仍交给 Flexbox。'],
    problem: '解决"如何同时控制行和列的布局，并用语义化方式描述页面结构"的问题。',
  },
{
    id: 'C_05', title: '定位机制', navTitle: '定位', category: '定位与布局',
    path: '/css/c-5/position', summary: '理解 static / relative / absolute / fixed / sticky 的偏移基准与文档流行为。',
    demo: C05Position,
    code: () => Promise.resolve(`/* static：默认定位，正常文档流 */
.static-box {
  position: static;
  /* top/right/bottom/left 不生效 */
}

/* relative：相对自身原位置偏移 */
.relative-box {
  position: relative;
  top: 10px;
  left: 20px;
  /* 相对原位置向下 10px，向右 20px */
  /* 仍占据原文档流位置 */
}

/* absolute：相对最近的非 static 祖先定位 */
.absolute-box {
  position: absolute;
  top: 0;
  right: 0;
  /* 相对于最近定位祖先的右上角 */
  /* 脱离文档流，不占空间 */
}

/* 父容器设置 relative 作为定位参考 */
.parent-relative {
  position: relative;
}

/* fixed：相对于视口定位 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* 固定在视口顶部 */
  /* 脱离文档流 */
  z-index: 1000;
}

/* sticky：滚动时切换 fixed */
.sticky-nav {
  position: sticky;
  top: 0;
  /* 滚动到顶部时吸顶 */
  /* 必须指定 top/left 等才生效 */
  background: #fff;
}`),
    language: 'css',
    principle: 'position 决定偏移参考系与是否脱离文档流：static 不定位；relative 相对自身原位置偏移且保留占位；absolute 脱离文档流、相对最近的非 static 祖先定位；fixed 脱离文档流、相对视口固定；sticky 越过阈值前保留原位、越过阈值后像 fixed 一样吸顶（须给定 top/bottom/left/right）。',
    flow: ['依次切换五种定位值观察盒子位置与占位的变化。', '对照表格确认每种取值是否脱离文档流。', '滚动容器观察 sticky 的阈值吸顶与 fixed 的始终固定。'],
    notes: ['absolute 必须依托一个非 static 祖先作参考，否则会一路向上到视口/格式化上下文。', 'sticky 需要同时设置 top/bottom/left/right 之一才会触发。', 'fixed 默认相对视口，但会被祖先的 transform/filter 等属性当作包含块限制。'],
    problem: '解决"元素应该相对谁偏移，以及是否应脱离正常文档流"的问题。',
  },
{
    id: 'C_06', title: '层叠与继承', navTitle: '层叠', category: '层叠与继承',
    path: '/css/c-6/cascade', summary: '理解选择器特异性的高低排序，以及继承与 initial、unset 的作用。',
    demo: C06Cascade,
    code: () => Promise.resolve(`/* 优先级从低到高 */

/* 类型选择器：优先级 0,0,1 */
p {
  color: #333;
}

/* 类选择器：优先级 0,1,0 */
.text-primary {
  color: #e8590c;
}

/* ID 选择器：优先级 1,0,0 */
#title {
  color: #1971c2;
}

/* 内联样式：优先级 1,0,0,0（最高，除了 !important） */
/* <p style="color: green">内联样式</p> */

/* !important：覆盖所有优先级（慎用） */
.important-text {
  color: #000 !important;
}

/* 组合选择器优先级叠加 */
/* .card .title 优先级：0,2,0 */
.card .title {
  font-size: 18px;
}

/* 可继承属性示例 */
.parent {
  font-family: system-ui, sans-serif;
  color: #333;
  line-height: 1.6;
  /* 这些属性会被子元素继承 */
}

/* 显式控制继承 */
.inherit-value {
  color: inherit;
  /* 继承父元素的值 */
}
.initial-value {
  all: initial;
  /* 重置为初始值 */
}
.unset-value {
  color: unset;
  /* 可继承则继承，否则初始值 */
}`),
    language: 'css',
    principle: '命中同一元素的多个规则按特异性比较：ID > 类 > 元素（及伪元素），同特异性时后声明的覆盖；!important 能越过所有普通声明。另一个维度是继承——color 等大部分文本类属性默认向下继承，margin/padding/border 不继承。',
    flow: ['在"层叠优先级"页看元素/类/ID 三条规则谁胜出。', '切到 !important 页理解其对优先级的越权行为。', '在继承页验证可继承与不可继承属性，并用 initial/unset 显式重置。'],
    notes: ['特异性可写成三元组（ID、类/属性/伪类、类型/伪元素），逐位比较大者胜。', 'inherit 强制继承、initial 取初始值、unset 按"可继承则继承、否则初始值"二选一。', '!important 会打乱全部优先级，应仅作兜底谨慎使用。'],
    problem: '解决"为什么写的样式不生效（被覆盖），以及如何正确控制优先级"的问题。',
  },
{
    id: 'C_07', title: 'CSS 变量（自定义属性）', navTitle: 'CSS 变量', category: '变量与主题',
    path: '/css/c-7/variables', summary: '用暖/冷主题与间距滑块理解自定义属性的声明、读取、继承与运行时更新。',
    demo: C07Variables,
    code: () => Promise.resolve(`/* 在 :root 声明全局变量 */
:root {
  --primary-color: #e8590c;
  --primary-light: #fff4e6;
  --border-color: #ffd8a8;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --font-size-base: 14px;
  --border-radius: 6px;
}

/* 读取变量：var(变量名, 备用值) */
.btn {
  background: var(--primary-color);
  color: #fff;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
}

/* 局部变量：只在当前选择器及后代生效 */
.card {
  --card-padding: 20px;
  padding: var(--card-padding);
  border: 1px solid var(--border-color);
}

/* 备用值：变量不存在时使用 */
.text {
  color: var(--text-color, #333);
  /* --text-color 未定义时用 #333 */
}

/* 主题切换示例：冷色主题 */
.theme-cool {
  --primary-color: #1971c2;
  --primary-light: #e7f5ff;
  --border-color: #a5d8ff;
}

/* 计算中使用变量 */
.layout {
  --gutter: 16px;
  --cols: 3;
  --col-width: calc((100% - var(--gutter) * 2) / var(--cols));
}

/* JavaScript 动态修改变量 */
/* element.style.setProperty('--primary-color', '#000'); */`),
    language: 'css',
    principle: '自定义属性以 --name 声明、var(--name, fallback) 读取；它可继承，运行时可通过 element.style.setProperty() 动态改写，从而驱动整套主题切换与间距调整。',
    flow: ['切换暖/冷主题观察 var(--primary) 驱动的配色整体变化。', '拖动滑块通过 JS 更新 --spacing，观察间距即时生效。', '对照表格理解声明、读取、JS 访问、继承四种用法。'],
    notes: ['自定义属性不能直接参与动画插值，须配合 var() 在 calc() 或具体属性的值中使用。', 'fallback 只在变量未定义或无效时生效。', '把色板、间距、圆角等"设计令牌"集中在 :root 便于统一维护与替换主题。'],
    problem: '解决"如何在运行时动态切换主题，并让多个属性共享同一设计令牌"的问题。',
  },
{
    id: 'C_08', title: '过渡与动画', navTitle: '过渡动画', category: '动画与过渡',
    path: '/css/c-8/transition-animation', summary: '用卡片交互动效对比 transition 与 animation 的触发方式与适用场景。',
    demo: C08Transition,
    code: () => Promise.resolve(`/* transition 过渡：需要状态变化触发 */
.btn {
  background: #e8590c;
  transition: background 0.3s ease, transform 0.2s ease-out;
  /* 过渡属性 + 时长 + 缓动函数 */
}
.btn:hover {
  background: #d9480f;
  transform: translateY(-2px);
}

/* transition 简写：property duration timing-function delay */
.card {
  transition: all 0.3s ease-in-out 0.1s;
}

/* 常用缓动函数 */
.ease-linear { transition-timing-function: linear; }
.ease-in { transition-timing-function: ease-in; }
.ease-out { transition-timing-function: ease-out; }
.ease-in-out { transition-timing-function: ease-in-out; }

/* @keyframes 关键帧动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 使用动画 */
.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
  /* 动画名 + 时长 + 缓动 + 填充模式 */
}

/* animation 完整属性 */
.spinner {
  animation: spin 1s linear infinite;
  /* 无限循环旋转 */
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 多阶段关键帧 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}`),
    language: 'css',
    principle: 'transition 只能响应状态变化（如 :hover），在两个状态值之间补间过渡；animation 通过 @keyframes 定义关键帧，可自动播放、循环（infinite）、反向（alternate）与中途暂停，适合无需用户触发的持续动效。',
    flow: ['切换 transition / animation 观察触发方式的差别。', '下拉选择要过渡的属性，或拖动时长滑块感受缓动节奏。', '对照表格对比关键帧、循环、暂停等能力差异。'],
    notes: ['优先过渡 transform 与 opacity，它们走合成器、开销低且不触发重排。', 'transition 只做两个状态的渐变，多阶段关键帧需用 @keyframes 动画。', '动画时长与缓动函数（ease/linear 等）决定观感的流畅与节奏。'],
    problem: '解决"哪种动画方式更适合当前交互场景，以及如何避免动画性能问题"的问题。',
  },
{
    id: 'C_09', title: '媒体查询与响应式', navTitle: '媒体查询', category: '响应式',
    path: '/css/c-9/media-query', summary: '拖动滑块模拟视口宽度，理解移动优先的断点与 min-width 写法。',
    demo: C09MediaQuery,
    code: () => Promise.resolve(`/* 移动优先：先写小屏样式 */
.card-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* 平板：>= 768px */
@media (min-width: 768px) {
  .card-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面：>= 1024px */
@media (min-width: 1024px) {
  .card-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 大屏：>= 1280px */
@media (min-width: 1280px) {
  .card-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 最大宽度（桌面优先） */
@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
}

/* 媒体特性：深色模式 */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #fff;
  }
}

/* 媒体特性：减少动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* 组合条件 */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 仅平板尺寸 */
  .container {
    padding: 0 24px;
  }
}

/* 横屏 */
@media (orientation: landscape) {
  .hero {
    height: 80vh;
  }
}`),
    language: 'css',
    principle: '@media 依据视口尺寸与设备特性条件性地应用规则；移动优先指先写小屏默认样式，再用 @media (min-width: …) 逐级增强，让手机优先并渐进升级到平板、桌面，避免桌面优先的 max-width 反复覆盖。',
    flow: ['拖动滑块放大视口宽度，观察卡片列数从 1 → 2 → 4。', '对照代码块理解 min-width 断点（640/1024）的递增写法。', '参考断点表 sm/md/lg/xl 的典型取值与用途。'],
    notes: ['移动优先统一用 min-width，从已写好的小屏样式向上增强。', '可叠加 prefers-color-scheme、prefers-reduced-motion 等媒体特性做暗色与无障碍适配。'],
    problem: '解决"同一套 HTML 如何在手机、平板、桌面上呈现不同布局"的问题。',
  },
{
    id: 'C_10', title: '渐变与背景', navTitle: '渐变背景', category: '视觉效果',
    path: '/css/c-10/gradient-bg', summary: '用课程卡片背景理解 linear / radial / conic-gradient 的语法与色标控制。',
    demo: C10Gradient,
    code: () => Promise.resolve(`/* 线性渐变：沿直线方向过渡 */
.gradient-linear {
  background: linear-gradient(135deg, #e8590c, #d9480f);
  /* 角度 + 起始色 + 结束色 */
}

/* 线性渐变：多个色标 */
.gradient-multi {
  background: linear-gradient(
    to right,
    #e8590c 0%,
    #ff922b 50%,
    #ffd43b 100%
  );
}

/* 线性渐变：硬边（色标位置相同） */
.gradient-stripes {
  background: linear-gradient(
    to bottom,
    #e8590c 0%,
    #e8590c 50%,
    #fff4e6 50%,
    #fff4e6 100%
  );
}

/* 径向渐变：从中心向外辐射 */
.gradient-radial {
  background: radial-gradient(circle at center, #fff4e6, #e8590c);
  /* 形状 + 位置 + 色标 */
}

/* 锥形渐变：围绕中心旋转 */
.gradient-conic {
  background: conic-gradient(from 0deg, #e8590c, #ffd43b, #e8590c);
}

/* 多重渐变叠加 */
.gradient-multi-layer {
  background:
    linear-gradient(135deg, rgba(232,89,12,0.8), transparent),
    radial-gradient(circle at top right, #ffd43b, transparent);
}

/* 渐变 + background-size 实现图案 */
.gradient-pattern {
  background: linear-gradient(45deg, #e8590c 25%, transparent 25%) 0 0 / 20px 20px,
              linear-gradient(-45deg, #e8590c 25%, transparent 25%) 0 0 / 20px 20px;
}

/* background 属性简写 */
.bg-full {
  background: #fff url('bg.png') no-repeat center / cover;
  /* 颜色 图片 重复 位置 / 尺寸 */
}`),
    language: 'css',
    principle: '渐变色属于 CSS <image> 类型：linear-gradient 沿指定角度或 to 方向过渡，radial-gradient 从中心沿半径向外辐射，conic-gradient 绕中心沿角度渐变；每个色标可指定位置（如 50%），多个渐变用逗号叠加成多重背景。',
    flow: ['切换三种渐变类型观察过渡形态的差异。', '拖动角度滑块调整 linear-gradient 的方向。', '从预设区看渐变在卡片、遮罩、色轮中的典型应用。'],
    notes: ['角度 0deg 垂直向上并随角度顺时针旋转，也可以用 to right 等方向关键字。', '相邻两个色标位置相同时会形成硬边（条纹），可用于分段色块。', '背景叠加时先写的渐变位于上层，可做出多层渐变效果。'],
    problem: '解决"如何用纯 CSS 实现丰富的背景效果，避免切图"的问题。',
  },
{
    id: 'C_11', title: '滤镜与混合模式', navTitle: '滤镜混合', category: '视觉效果',
    path: '/css/c-11/filter-blend', summary: '用课程封面图理解 filter 视觉效果与 mix-blend-mode 色彩混合。',
    demo: C11Filter,
    code: () => Promise.resolve(`/* filter 滤镜：模糊 */
.img-blur {
  filter: blur(4px);
}

/* filter 滤镜：灰度 */
.img-grayscale {
  filter: grayscale(100%);
}

/* filter 滤镜：亮度 */
.img-brightness {
  filter: brightness(1.2);
}

/* filter 滤镜：对比度 */
.img-contrast {
  filter: contrast(1.5);
}

/* filter 滤镜：饱和度 */
.img-saturate {
  filter: saturate(2);
}

/* filter 滤镜：色相旋转 */
.img-hue-rotate {
  filter: hue-rotate(90deg);
}

/* filter 滤镜：反色 */
.img-invert {
  filter: invert(100%);
}

/* filter 滤镜：不透明度 */
.img-opacity {
  filter: opacity(50%);
}

/* filter 滤镜：阴影（不同于 box-shadow，可应用于透明图片） */
.img-drop-shadow {
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));
}

/* 多个滤镜叠加 */
.img-multi-filter {
  filter: brightness(1.1) contrast(1.1) saturate(1.2);
}

/* mix-blend-mode 混合模式 */
.blend-multiply {
  mix-blend-mode: multiply;
  /* 正片叠底 */
}
.blend-screen {
  mix-blend-mode: screen;
  /* 滤色 */
}
.blend-overlay {
  mix-blend-mode: overlay;
  /* 叠加 */
}
.blend-difference {
  mix-blend-mode: difference;
  /* 差值 */
}

/* backdrop-filter：背景模糊（毛玻璃效果） */
.glass-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.7);
}`),
    language: 'css',
    principle: 'filter 对元素整体施加模糊、灰度、亮度、饱和度、色相、反相与阴影等效果，可多个叠加；mix-blend-mode 决定元素与下方内容之间的像素色彩混合；backdrop-filter 则只对元素后方区域做滤镜，常用于毛玻璃。',
    flow: ['下拉切换不同 filter 观察图片的视觉变化。', '切换 mix-blend-mode 看文字如何与渐变背景融合。', '对照属性表区分 filter / backdrop-filter / mix-blend-mode 的作用对象。'],
    notes: ['filter 会创建新的层叠上下文与包含块，可能影响内部的 fixed 定位。', 'mix-blend-mode 依赖下方不透明内容来体现混色，注意文字可读性。', 'backdrop-filter 仅作用于元素后方的背景，不改变元素自身。'],
    problem: '解决"如何为图片添加视觉效果，或让文字与背景图片产生自然的色彩融合"的问题。',
  },
{
    id: 'C_12', title: 'CSS 数学函数', navTitle: '数学函数', category: '函数与计算',
    path: '/css/c-12/math-functions', summary: '用卡片宽度动态计算理解 calc / min / max / clamp 的语法与典型场景。',
    demo: C12MathFunctions,
    code: () => Promise.resolve(`/* calc()：四则运算，支持混合单位 */
.calc-width {
  width: calc(100% - 32px);
  /* 父容器宽度减去 32px 内边距 */
}

/* calc()：变量运算 */
:root {
  --gap: 16px;
  --cols: 3;
}
.calc-col {
  width: calc((100% - var(--gap) * (var(--cols) - 1)) / var(--cols));
}

/* min()：取最小值（相当于 max-width） */
.min-width {
  width: min(90%, 1200px);
  /* 小屏用 90%，大屏最大 1200px */
}

/* max()：取最大值（相当于 min-width） */
.max-font {
  font-size: max(14px, 1.5vw);
  /* 最小 14px，随视口增长 */
}

/* clamp()：最小值、理想值、最大值 */
.clamp-font {
  font-size: clamp(14px, 2vw, 24px);
  /* 最小 14px，理想 2vw，最大 24px */
}

/* clamp() 响应式间距 */
.clamp-spacing {
  padding: clamp(16px, 4vw, 48px);
}

/* 嵌套使用 */
.nested-math {
  width: min(max(300px, 50%), 600px);
  /* 最小 300px，理想 50%，最大 600px */
}

/* 与 CSS 变量配合 */
.dynamic-layout {
  --content-max: 80ch;
  --content-width: min(100% - 2rem, var(--content-max));
  width: var(--content-width);
  margin-inline: auto;
}`),
    language: 'css',
    principle: 'calc() 支持混合单位的四则运算，常用于"100% 减去固定值"；min() 取所有参数的较小者，天然担任容器的宽度上限；max() 取较大者，实现最小值的响应式字号；clamp(min, ideal, max) 本质是上下界约束，把理想值限定在区间内。',
    flow: ['切换四种函数观察盒子宽度如何随参数变化。', '拖动滑块对比 calc 的"相减"与 clamp 的"区间"差异。', '对照表格记住每类函数的典型场景。'],
    notes: ['calc() 中 + - 两侧必须留空格，* / 则没有此项限制。', 'clamp 的理想值通常用视口单位（如 vw），上下界用固定值。', '这些函数可与 CSS 变量组合，写出更灵活的自适应尺寸。'],
    problem: '解决"如何让尺寸在不同屏幕下自适应，同时限制最小和最大值"的问题。',
  },
{
    id: 'C_13', title: '视口与容器单位', navTitle: '视口单位', category: '单位与尺寸',
    path: '/css/c-13/viewport-units', summary: '理解 vw / vh / dvh / cqw / rem / ch 的基准与适用场景。',
    demo: C13ViewportUnits,
    code: () => Promise.resolve(`/* vw：视口宽度的百分比 */
.vw-full {
  width: 100vw;
  /* 始终等于视口宽度 */
}

/* vh：视口高度的百分比 */
.vh-full {
  height: 100vh;
  /* 注意：移动端工具栏会导致问题 */
}

/* dvh：动态视口高度（推荐移动端使用） */
.dvh-full {
  height: 100dvh;
  /* 工具栏收起/展开时动态调整，更准确 */
}

/* svh / lvh：最小/最大视口高度 */
.svh-height {
  height: 100svh;
  /* 小视口高度（工具栏展开时） */
}

/* vmin / vmax：视口较小/较大边的百分比 */
.vmin-square {
  width: 50vmin;
  height: 50vmin;
  /* 正方形，随视口较小边缩放 */
}

/* rem：相对于根元素字体大小 */
.rem-size {
  font-size: 1.5rem;
  /* 1.5 * 根字号（通常 16px = 24px） */
}
:root {
  font-size: 16px;
  /* 修改根字号可全局缩放 */
}

/* em：相对于当前元素字体大小 */
.em-padding {
  font-size: 16px;
  padding: 1em;
  /* 1em = 16px */
}

/* ch：字符 0 的宽度（约等于一个汉字宽度） */
.ch-measure {
  width: 60ch;
  /* 最佳阅读宽度约 60-75ch */
}

/* cqw / cqh：容器查询单位（相对于容器宽度/高度） */
/* 需配合 container-type 使用 */
.container {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card {
    font-size: 2cqw;
    /* 容器宽度的 2% */
  }
}

/* ex：x 高度（小写字母 x 的高度） */
.ex-valign {
  height: 2ex;
}`),
    language: 'css',
    principle: 'vw/vh 以视口宽/高为基准（各占 1%）；dvh 是动态视口高度，跟随移动端工具栏的收起/展开而变化，比固定的 vh 更贴近可见区域；cqw 以最近的容器查询容器为基准；rem 相对根字号，ch 约等于字符 0 的宽度，二者分别适合可缩放的全局尺寸与定字符宽的输入框。',
    flow: ['逐项切换单位按钮观察盒子的实际尺寸。', '对比 vw 与 cqw 的基准差异（视口 vs 容器）。', '对照基准表记住每个单位的参考对象与典型用途。'],
    notes: ['移动端全屏建议用 dvh 代替 vh，避免被地址栏/工具条遮挡。', 'rem 依赖于根元素 font-size，改 :root 即可整体缩放。', '用 ch 做输入框宽度可恰好容纳指定字符数。'],
    problem: '解决"如何选择最合适的 CSS 单位，让布局在不同设备和容器中都能自适应"的问题。',
  },
{
    id: 'C_14', title: '形状与裁剪', navTitle: '裁剪形状', category: '视觉效果',
    path: '/css/c-14/clip-path-mask', summary: '用封面裁剪理解 clip-path 的几何形状与 mask 的透明度遮罩。',
    demo: C14ClipPath,
    code: () => Promise.resolve(`/* clip-path：圆形裁剪 */
.clip-circle {
  clip-path: circle(50% at center);
  /* 半径 50%，中心为圆心 */
}

/* clip-path：椭圆裁剪 */
.clip-ellipse {
  clip-path: ellipse(50% 40% at 50% 50%);
  /* 水平半径 50%，垂直半径 40% */
}

/* clip-path：多边形裁剪（三角形） */
.clip-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  /* 顶点坐标列表 */
}

/* clip-path：多边形裁剪（六边形） */
.clip-hexagon {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

/* clip-path：圆角矩形（inset） */
.clip-inset {
  clip-path: inset(10px round 8px);
  /* 四周内边距 + 圆角 */
}

/* 动画 clip-path */
.clip-anim {
  clip-path: circle(10% at center);
  transition: clip-path 0.5s ease;
}
.clip-anim:hover {
  clip-path: circle(50% at center);
}

/* mask 遮罩：用图像/渐变的透明度决定可见性 */
.mask-gradient {
  -webkit-mask: linear-gradient(to bottom, black 0%, transparent 100%);
  mask: linear-gradient(to bottom, black 0%, transparent 100%);
  /* 顶部不透明，底部渐隐 */
}

/* mask：径向渐变遮罩 */
.mask-radial {
  -webkit-mask: radial-gradient(circle, black 60%, transparent 100%);
  mask: radial-gradient(circle, black 60%, transparent 100%);
  /* 中心显示，边缘渐隐 */
}

/* 注意：clip-path 裁剪区域无法接收点击事件 */
/* mask 需要 -webkit-mask 前缀兼容 Safari */`),
    language: 'css',
    principle: 'clip-path 用 circle/ellipse/polygon/inset/path 等几何形状把元素的可渲染区域裁剪成非矩形，保留布局空间但只裁剪可见与可交互部分；mask 则依据图片或渐变的 alpha 通道决定可见性，实现按透明度渐隐。',
    flow: ['切换圆形/椭圆/三角形/内嵌矩形/路径观察裁剪外形。', '切到 mask 遮罩，理解它按透明度渐隐而非按几何裁剪。', '对照表格确认 clip-path/mask/border-radius/overflow 各自保留布局空间。'],
    notes: ['clip-path 会创建新的层叠上下文，被裁剪区域之外的点击不可达。', 'mask 已获得主流浏览器无前缀支持，-webkit-mask 仅作旧版兼容。', 'clip-path 可配合 transition 做形状动效，各顶点需保持可补间的数量与顺序。'],
    problem: '解决"如何把元素裁剪成非矩形，或用渐变实现复杂的图片遮罩效果"的问题。',
  },
{
    id: 'C_15', title: '逻辑属性', navTitle: '逻辑属性', category: '逻辑属性',
    path: '/css/c-15/logical-properties', summary: '用中英文/rtl 布局理解物理属性与逻辑属性的差异，以及书写模式适配。',
    demo: C15LogicalProperties,
    code: () => Promise.resolve(`/* 物理属性（left/right/top/bottom） */
.physical-box {
  margin-left: 16px;
  padding-right: 24px;
  border-left: 4px solid #e8590c;
  text-align: left;
  width: 200px;
  height: 100px;
}

/* 逻辑属性：margin-inline / margin-block */
.logical-margin {
  margin-inline-start: 16px;
  /* LTR: margin-left，RTL: margin-right */
  margin-inline-end: 16px;
  margin-block-start: 8px;
  /* 相当于 margin-top */
  margin-block-end: 8px;
}

/* 简写：margin-inline / margin-block */
.logical-margin-shorthand {
  margin-inline: 16px;
  /* 左右（逻辑）各 16px */
  margin-block: 8px 12px;
  /* 上 8px，下 12px（逻辑） */
}

/* padding 逻辑属性 */
.logical-padding {
  padding-inline: 24px;
  padding-block: 16px;
}

/* border 逻辑属性 */
.logical-border {
  border-inline-start: 4px solid #e8590c;
  border-block-end: 2px solid #ddd;
  border-start-start-radius: 8px;
  /* 左上角（LTR）*/
}

/* 尺寸逻辑属性 */
.logical-size {
  inline-size: 200px;
  /* LTR: width，垂直书写模式: height */
  block-size: 100px;
  /* LTR: height，垂直书写模式: width */
  min-inline-size: 100px;
  max-block-size: 200px;
}

/* 定位逻辑属性 */
.logical-position {
  position: absolute;
  inset-inline-start: 0;
  /* LTR: left: 0 */
  inset-block-start: 0;
  /* top: 0 */
  inset: 0;
  /* 等价于 top:0; right:0; bottom:0; left:0 */
}

/* 文本对齐逻辑属性 */
.logical-text {
  text-align: start;
  /* LTR: left，RTL: right */
}`),
    language: 'css',
    principle: '物理属性（left/right/top/bottom）固定方向，RTL 下不会自动翻转；逻辑属性用 start/end 描述文本流向——inline 对应行内走向、block 对应块向——inline-start/end 与 block-start/end 会随 LTR/RTL 及书写模式自动换向，一套代码即可适配多种语言。',
    flow: ['切换 LTR/RTL 观察"热门"角标与文本间距的镜像变化。', '对比左右两张卡片：物理属性固定、逻辑属性自动翻转。', '对照映射表记住常见物理→逻辑属性的对应关系。'],
    notes: ['margin-inline-start 在 LTR 中是 margin-left，在 RTL 中是 margin-right。', 'width 对应 inline-size、height 对应 block-size，会随书写方向换向。', '面向多语言（含阿拉伯语 RTL）的国际化项目应优先采用逻辑属性。'],
    problem: '解决"如何让布局自动适配不同书写方向（如阿拉伯语 RTL），而不用手动切换 left/right"的问题。',
  },
{
    id: 'C_16', title: '容器查询', navTitle: '容器查询', category: '响应式进阶',
    path: '/css/c-16/container-query', summary: '拖动滑块改变容器宽度，理解基于容器尺寸（而非视口）的响应式布局。',
    demo: C16ContainerQuery,
    code: () => Promise.resolve(`/* 声明容器：允许查询内联尺寸（宽度） */
.card-container {
  container-type: inline-size;
  container-name: card;
  /* 可选：命名容器 */
}

/* 基于容器宽度的响应式 */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 16px;
  }
}

/* 容器查询断点：小容器 */
@container (max-width: 299px) {
  .card-title {
    font-size: 14px;
  }
  .card-desc {
    display: none;
  }
}

/* 容器查询断点：中容器 */
@container (min-width: 300px) and (max-width: 499px) {
  .card-title {
    font-size: 16px;
  }
}

/* 容器查询断点：大容器 */
@container (min-width: 500px) {
  .card-title {
    font-size: 18px;
  }
  .card-desc {
    display: block;
  }
}

/* 容器查询单位：cqw 容器宽度百分比 */
@container (min-width: 400px) {
  .card-title {
    font-size: 4cqw;
    /* 容器宽度的 4% */
  }
}

/* 容器查询单位：cqh 容器高度百分比 */
.card-icon {
  font-size: 10cqh;
  /* 容器高度的 10% */
}

/* 其他容器单位 */
/* cqi / cqb：容器 inline / block 尺寸百分比 */
/* cqmin / cqmax：较小/较大边的百分比 */

/* 容器查询与 @media 的区别：
   @media 基于视口，适合页面级布局
   @container 基于祖先容器，适合组件级响应式 */`),
    language: 'css',
    principle: '容器查询先在生产容器上用 container-type: inline-size（必要时 container-name 命名）声明，再用 @container (min-width: …) 依据"祖先容器"的尺寸应用样式；它与以视口为基准的 @media 互补，让同一组件在任意宽度宿主中都能自适应。',
    flow: ['拖动滑块改变容器宽度，观察卡片内部布局的切换。', '注意断点发生在容器宽度 400px 而非视口。', '对照表格理清 container-type / container-name / @container / cqw-cqh。'],
    notes: ['container-type: inline-size 只追踪宽度，查询高度需用 size 并给容器定高。', '@container 适合组件级响应式，@media 仍负责页面级整体断点。', 'cqw/cqh 是以命名容器宽/高为基准的容器查询单位。'],
    problem: '解决"组件在不同宽度的容器中应如何自适应，而不是只根据视口宽度响应"的问题。',
  },
{
    id: 'C_17', title: '层叠上下文', navTitle: '层叠上下文', category: '层叠与 z-index',
    path: '/css/c-17/stacking-context', summary: '理解 z-index 失效的原因：层叠上下文的创建条件与层级隔离。',
    demo: C17StackingContext,
    code: () => Promise.resolve(`/* z-index 基础：只在定位元素上生效 */
.box-relative {
  position: relative;
  z-index: 10;
  /* 需要 position 非 static 才生效 */
}

/* 创建层叠上下文的常见方式 */

/* 方式 1：z-index + position */
.context-1 {
  position: relative;
  z-index: 1;
  /* 创建新的层叠上下文 */
}

/* 方式 2：opacity < 1 */
.context-opacity {
  opacity: 0.99;
  /* 小于 1 创建新上下文 */
}

/* 方式 3：transform */
.context-transform {
  transform: translateZ(0);
  /* 非 none 创建新上下文 */
}

/* 方式 4：filter */
.context-filter {
  filter: blur(0);
  /* 非 none 创建新上下文 */
}

/* 方式 5：isolation: isolate */
.context-isolate {
  isolation: isolate;
  /* 专门创建上下文，无视觉副作用 */
}

/* 方式 6：will-change */
.context-willchange {
  will-change: transform;
  /* 声明即将变化的属性 */
}

/* 层叠顺序（从低到高）：
   1. 背景和边框
   2. 负 z-index
   3. block 级元素
   4. 浮动元素
   5. inline/inline-block 元素
   6. z-index: 0 或 auto
   7. 正 z-index
*/

/* 经典问题：子元素 z-index 再高也无法超过父上下文外的元素 */
.parent {
  position: relative;
  z-index: 1;
  /* 创建了层叠上下文 */
}
.child {
  position: relative;
  z-index: 9999;
  /* 只能在 parent 上下文内比较 */
}
.sibling {
  position: relative;
  z-index: 2;
  /* 兄弟元素 z-index 更高，child 再高也没用 */
}`),
    language: 'css',
    principle: 'z-index 只在定位元素上生效，且比较范围被限定在同一个层叠上下文内；opacity<1、transform≠none、filter≠none、isolation:isolate、flex/grid 子项带 z-index 等都会创建新的层叠上下文。父元素创建上下文后，子元素再大的 z-index 也无法越过上下文边界与外部元素比较。',
    flow: ['先在默认模式确认 z-index 999 > 2 > 1 的正常排序。', '给 B 的父元素加 opacity<1 或 transform，观察其内部层级与外界隔离。', '对照创建条件表记住常见的层叠上下文触发属性。'],
    notes: ['isolation: isolate 是最干净的"主动建上下文"手段，无视觉副作用。', 'transform/filter/opacity 在动画中很常见，极易无意引入层级 bug。', '比较 z-index 时只应比较同一上下文内的兄弟及其后代。'],
    problem: '解决"为什么设置了很高的 z-index 仍然被其他元素覆盖"的问题。',
  },
{
    id: 'C_18', title: '格式化上下文', navTitle: '格式化上下文', category: '布局原理',
    path: '/css/c-18/formatting-context', summary: '理解 BFC / IFC / FFC / GFC 的创建方式与布局影响。',
    demo: C18FormattingContext,
    code: () => Promise.resolve(`/* BFC：块级格式化上下文 */

/* 创建 BFC 的方式 */

/* 方式 1：overflow 非 visible */
.bfc-overflow {
  overflow: hidden;
  /* 创建 BFC */
}

/* 方式 2：display: flow-root（推荐，无副作用） */
.bfc-flow-root {
  display: flow-root;
  /* 专门创建 BFC */
}

/* 方式 3：浮动 */
.bfc-float {
  float: left;
  /* 创建 BFC */
}

/* 方式 4：绝对定位 */
.bfc-absolute {
  position: absolute;
  /* 创建 BFC */
}

/* BFC 作用 1：包含浮动（清除浮动） */
.clearfix {
  display: flow-root;
  /* 子元素浮动不会溢出容器 */
}

/* BFC 作用 2：防止外边距折叠 */
.no-collapse {
  display: flow-root;
  /* 子元素 margin 不会与外部 margin 折叠 */
}
.no-collapse p {
  margin: 16px 0;
  /* 不会与外部 margin 折叠 */
}

/* BFC 作用 3：阻止文字环绕浮动 */
.two-column {
  overflow: hidden;
  /* 创建 BFC，不与浮动重叠 */
}
.sidebar {
  float: left;
  width: 200px;
}
.content {
  display: flow-root;
  /* 自适应剩余宽度 */
}

/* IFC：行内格式化上下文 */
.ifc-text {
  line-height: 1.6;
  vertical-align: middle;
  /* 行内元素基线对齐 */
}

/* FFC：Flex 格式化上下文 */
.ffc-flex {
  display: flex;
  /* 创建 FFC */
}

/* GFC：Grid 格式化上下文 */
.gfc-grid {
  display: grid;
  /* 创建 GFC */
}`),
    language: 'css',
    principle: '格式化上下文规定盒子内部元素的布局规则：BFC（块格式化上下文）可包裹浮动、阻断外边距折叠；IFC（行内格式化上下文）决定一行内 inline 元素的排列与基线对齐；display:flex / grid 分别建立 FFC 与 GFC，各自接管主轴与网格布局。',
    flow: ['对比"有 BFC"与"无 BFC"两个盒子里浮动的包裹差异。', '在 IFC 演示中观察行内元素在同一行内按基线排列。', '在外边距折叠页确认 BFC 可阻止相邻盒的 margin 合并。'],
    notes: ['创建 BFC 的常见方式：overflow 非 visible、display:flow-root、float 非 none、绝对定位、flex/grid 容器。', 'display:flow-root 是建立 BFC 又无副作用的首选。', 'FFC/GFC 本质就是 flex/grid 容器内部默认建立的格式化上下文。'],
    problem: '解决"浮动元素溢出容器、外边距异常折叠"等经典 CSS 布局问题。',
  },
{
    id: 'C_19', title: 'CSS 架构方法论', navTitle: 'CSS 架构', category: '工程架构',
    path: '/css/c-19/architecture', summary: '用课程卡片组件理解 BEM / OOCSS / SMACSS 的命名与组织思路。',
    demo: C19BEM,
    code: () => Promise.resolve(`/* BEM：Block-Element-Modifier */

/* Block：块（组件） */
.card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

/* Element：元素（块的子部分，用 __ 连接） */
.card__header {
  margin-bottom: 12px;
}
.card__title {
  font-size: 18px;
  font-weight: 600;
}
.card__body {
  color: #666;
  line-height: 1.6;
}
.card__footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

/* Modifier：修饰符（状态/变体，用 -- 连接） */
.card--featured {
  border-color: #e8590c;
  background: #fff4e6;
}
.card--large {
  padding: 24px;
}
.card__title--highlight {
  color: #e8590c;
}

/* OOCSS：面向对象 CSS，分离结构与皮肤 */

/* 结构（布局） */
.media {
  display: flex;
  gap: 12px;
}
.media__img {
  flex-shrink: 0;
}
.media__body {
  flex: 1;
}

/* 皮肤（视觉） */
.media--dark {
  background: #333;
  color: #fff;
}
.media--bordered {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
}

/* SMACSS：分类组织 */

/* Base：基础样式（重置、默认） */
/*
body { margin: 0; }
a { color: #e8590c; }
*/

/* Layout：布局（前缀 l-） */
.l-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
.l-grid {
  display: grid;
  gap: 16px;
}

/* Module：模块（组件） */
/* .btn { ... } */

/* State：状态（前缀 is-） */
.is-active {
  display: block;
}
.is-hidden {
  display: none;
}
.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Theme：主题 */
/* .theme-dark { ... } */`),
    language: 'css',
    principle: 'BEM 用 Block__Element--Modifier 约束命名，类名语义化、可预测且不嵌套；OOCSS 主张把"结构"（布局类）与"皮肤"（视觉类）拆成可复用的小类；SMACSS 按 Base/Layout/Module/State/Theme 角色分类选择器；在现代工程中还可结合 CSS Modules 的哈希局部作用域从机制上隔离冲突。',
    flow: ['在 BEM 页看"块-元素-修饰符"如何为一个组件命名。', '切到 OOCSS 页观察结构与皮肤类如何组合复用。', '在 SMACSS 页对照按角色前缀的命名约定，并理解 CSS Modules 局部作用域。'],
    notes: ['BEM 类名偏长、HTML 略重，但换来大型项目的可预测性。', 'OOCSS 通过组合细粒度类避免重复声明。', '现代工程多用 CSS Modules 让类名哈希化，从根本上隔离样式冲突。'],
    problem: '解决"大型项目中 CSS 如何组织，才能避免样式冲突、提高可维护性"的问题。',
  },
{
    id: 'C_20', title: 'CSS 性能优化', navTitle: 'CSS 性能', category: '性能优化',
    path: '/css/c-20/performance', summary: '理解图层提升、content-visibility、渲染阻塞与动画性能的优化手段。',
    demo: C20Performance,
    code: () => Promise.resolve(`/* 动画性能：优先使用 GPU 加速属性 */

/* 高性能动画：transform + opacity */
.smooth-animation {
  transition: transform 0.3s ease, opacity 0.3s ease;
  /* 只触发合成，不触发重排/重绘 */
}
.smooth-animation:hover {
  transform: translateY(-4px) scale(1.02);
  opacity: 0.9;
}

/* 避免在动画中使用这些属性（会触发重排） */
/*
.bad-anim {
  transition: width 0.3s, height 0.3s, margin 0.3s, top 0.3s;
}
*/

/* will-change：提前告知浏览器哪些属性会变化 */
.will-change {
  will-change: transform, opacity;
  /* 不要滥用，会增加 GPU 内存 */
}

/* content-visibility：跳过离屏元素渲染 */
.long-list-item {
  content-visibility: auto;
  /* 离屏时跳过渲染，大幅提升长列表性能 */
  contain-intrinsic-size: 200px;
  /* 预估高度，避免滚动条跳动 */
}

/* contain：限制渲染范围 */
.contain-strict {
  contain: strict;
  /* 等价于 size layout style paint */
  /* 告诉浏览器这个元素的变化不影响外部 */
}

/* 减少渲染阻塞 */
/* <link rel="preload" href="critical.css" as="style"> */
/* <link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'"> */

/* 选择器优化：避免过深嵌套 */
/* 不好：嵌套过深 */
/*
.page .content .list .item .link { ... }
*/
/* 好：直接用类名 */
.list-item__link {
  color: #e8590c;
}

/* 避免使用通配选择器和属性选择器作为关键选择器 */
/* 不好 */
/* div [class*="btn"] { ... } */
/* 好 */
.btn {
  padding: 8px 16px;
}

/* 减少重排：批量修改样式 */
/* 用 class 切换代替逐属性修改 */
.box {
  transition: all 0.3s;
}
.box--active {
  width: 200px;
  padding: 20px;
  margin: 10px;
}

/* 使用 font-display 避免 FOIT */
/*
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}
*/`),
    language: 'css',
    principle: 'CSS 性能的抓手是减少重排/重绘与渲染阻塞：动画尽量只用合成层友好的 transform/opacity；will-change 可提前声明将变化的属性以提升图层；content-visibility:auto 配合 contain-intrinsic-size 跳过离屏元素的渲染；同时避免 @import 与过度嵌套选择器以降低阻塞与匹配成本。',
    flow: ['在 will-change 与图层提升页理解"提升图层 vs 滥用"的取舍。', '在 content-visibility 页看离屏跳过渲染与预留尺寸的配合。', '在最佳实践页对照高性能与低性能的动画/选择器写法。'],
    notes: ['will-change 不要大面积滥用，会浪费 GPU 内存。', 'content-visibility:auto 需配 contain-intrinsic-size，避免滚动条跳动。', '避免动画 width/height/margin 等触发重排的属性，也避免频繁读写布局属性（强同步布局）。'],
    problem: '解决"页面滚动卡顿、动画不流畅、首次渲染慢"等 CSS 性能问题。',
  },
{
    id: 'C_21', title: 'CSS 层叠层（@layer）', navTitle: '层叠层', category: '层叠与架构',
    path: '/css/c-21/cascade-layers', summary: '用 @layer 显式声明层顺序，解决多来源样式的优先级管理。',
    demo: C21CascadeLayers,
    code: () => Promise.resolve(`/* 声明层顺序：越靠后优先级越高 */
@layer reset, base, components, utilities;

/* reset 层：优先级最低 */
@layer reset {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

/* base 层：基础样式 */
@layer base {
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    color: #333;
  }
  a {
    color: #e8590c;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
}

/* components 层：组件样式 */
@layer components {
  .btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }
  .btn-primary {
    background: #e8590c;
    color: #fff;
  }
  .btn-secondary {
    background: #f1f3f5;
    color: #333;
  }
}

/* utilities 层：工具类（优先级最高的层） */
@layer utilities {
  .text-center {
    text-align: center;
  }
  .font-bold {
    font-weight: 700;
  }
  .m-0 {
    margin: 0;
  }
  .p-0 {
    padding: 0;
  }
}

/* 未分层的样式：优先级高于所有 @layer */
.override {
  color: #000;
  /* 即使在 utilities 层之后声明，也比 utilities 层优先级低？不！
     未分层的样式优先级最高 */
}

/* 嵌套层 */
@layer components {
  @layer button {
    .btn {
      /* 内部嵌套层 */
    }
  }
}

/* @import 引入第三方样式并归入指定层 */
/* @import 'reset.css' layer(reset); */
/* @import 'third-party-ui.css' layer(vendor); */

/* 层内的 !important 仍会提升优先级 */
/* 但层间优先级仍按声明顺序 */`),
    language: 'css',
    principle: '普通规则只靠书写顺序难以掌控后续升级与第三方样式的覆盖；@layer 先统一声明层顺序（靠后声明的层优先级更高），使 reset < base < components < utilities 的层级始终成立——只要把工具类放进 utilities 层，就能稳定压过前置层，与书写先后无关。',
    flow: ['先对照默认模式看无 @layer 时多条规则的覆盖。', '启用 @layer 后观察 utilities 层的颜色始终胜出。', '对照特性表理解层声明顺序、跨文件引用与未分层样式优先级。'],
    notes: ['未被纳入任何 @layer 的样式优先级高于所有分层样式，常被组件内样式利用。', '@import url(...) layer(name) 可把第三方库归入指定层。', '层内的 !important 仍会提升优先级，须谨慎使用。'],
    problem: '解决"多来源样式（重置样式、组件样式、工具类）如何有序管理优先级"的问题。',
  },
{
    id: 'C_22', title: 'CSS :has() 选择器', navTitle: ':has() 选择器', category: '选择器进阶',
    path: '/css/c-22/has-selector', summary: '用 :has() 实现"父元素选择器"效果，根据子元素状态样式化容器。',
    demo: C22HasSelector,
    code: () => Promise.resolve(`/* :has() 基本用法：选择包含特定后代的元素 */

/* 选择含有 .error 子元素的表单 */
.form:has(.error) {
  border-color: #fa5252;
  background: #fff5f5;
}

/* 选择含有 img 的文章卡片 */
.article-card:has(img) {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
}

/* 选择含有 :checked 的标签 */
.label:has(input:checked) {
  background: #e8590c;
  color: #fff;
  border-color: #e8590c;
}

/* 组合使用：选择不含有图片的卡片 */
.card:not(:has(img)) {
  padding: 16px;
}

/* 选择含有必填字段的表单组 */
.form-group:has([required]) label::after {
  content: ' *';
  color: #fa5252;
}

/* 选择后面跟着特定兄弟元素的元素（选择前面的兄弟） */
.title:has(+ .subtitle) {
  margin-bottom: 4px;
}
.subtitle {
  color: #868e96;
  font-size: 14px;
}

/* 选择含有聚焦输入的容器 */
.input-wrapper:has(input:focus) {
  border-color: #e8590c;
  box-shadow: 0 0 0 3px rgba(232, 89, 12, 0.1);
}

/* 选择含有 hover 子元素的父容器 */
.nav-item:has(a:hover) {
  background: #fff4e6;
}

/* 嵌套使用：含有含有... */
/* .container:has(.card:has(.active)) { ... } */

/* 注意：:has() 不能在 :has() 内部使用（浏览器限制）*/
/* 注意：性能考虑，避免过度使用复杂的 :has() 选择器 */`),
    language: 'css',
    principle: ':has() 让一条选择器以"当前元素是否包含某些后代/符合条件的兄弟"为条件来匹配，从而能根据子元素状态（.error、:checked、:focus 等）反选父容器；它支持与 :not()、嵌套及相邻兄弟组合器搭配，把过去需要 JS 判断的逻辑收敛到纯 CSS。',
    flow: ['点"启用 :has() 高亮"，观察含 .error 徽章的卡片被高亮。', '对照内嵌样式理解 :has(.error) 选中含错误的容器范围。', '从选择器表了解 :not(:has())、:has(+ p) 等扩展用法。'],
    notes: [':has() 已获得主流浏览器基线支持（2023 年起）。', '它不仅能按子元素选中父级，还能通过 :has(+ 兄弟) 影响前面的元素。', '尽量避免大量嵌套的 :has()，这类选择器相对昂贵。'],
    problem: '解决"如何根据子元素状态样式化父容器，而不依赖 JavaScript"的问题。',
  },
{
    id: 'C_23', title: 'Scroll Snap 滚动定位', navTitle: 'Scroll Snap', category: '滚动与交互',
    path: '/css/c-23/scroll-snap', summary: '用 scroll-snap 实现精准的滚动定位，适合轮播、图片画廊和分页滚动。',
    demo: C23ScrollSnap,
    code: () => Promise.resolve(`/* Scroll Snap 容器设置 */

/* 水平滚动 + 强制对齐 */
.snap-x-mandatory {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  /* x: 水平方向，mandatory: 强制对齐 */
  gap: 16px;
  scrollbar-width: none;
}
.snap-x-mandatory::-webkit-scrollbar {
  display: none;
}

/* 垂直滚动 + 接近时对齐 */
.snap-y-proximity {
  overflow-y: auto;
  scroll-snap-type: y proximity;
  /* y: 垂直方向，proximity: 接近时才对齐 */
  height: 400px;
}

/* 子项：对齐到起始位置 */
.snap-item-start {
  scroll-snap-align: start;
  /* 对齐到容器起始位置 */
}

/* 子项：居中对齐 */
.snap-item-center {
  scroll-snap-align: center;
  /* 对齐到容器中心 */
  flex: 0 0 100%;
}

/* 子项：对齐到结束位置 */
.snap-item-end {
  scroll-snap-align: end;
  /* 对齐到容器结束位置 */
}

/* scroll-padding：处理固定导航栏遮挡 */
.snap-container {
  scroll-padding-top: 80px;
  /* 顶部留出 80px 给固定导航 */
  scroll-snap-type: y mandatory;
}

/* scroll-margin：子项的边距调整 */
.snap-item {
  scroll-margin: 16px;
  /* 对齐时的边距 */
}

/* 全屏分页滚动 */
.fullpage {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}
.fullpage section {
  height: 100vh;
  scroll-snap-align: start;
}

/* 轮播图效果 */
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}
.carousel-item {
  flex: 0 0 100%;
  scroll-snap-align: center;
}

/* 注意：scroll-snap 不会创建滚动容器，需配合 overflow 使用 */
/* 注意：mandatory 强制对齐可能导致内容无法停留，需谨慎使用 */`),
    language: 'css',
    principle: 'scroll-snap-type 在滚动容器上声明滚动轴与对齐严格度（x/y + mandatory/proximity），scroll-snap-align 在子项上设置对齐点（start/center/end）；mandatory 强制停靠各对齐点、proximity 仅在接近时吸附，用于构建无需 JS 的原生轮播、画廊与分页。',
    flow: ['依次切换水平强制/水平接近/垂直强制观察滚动吸附的差异。', '注意子项的 scroll-snap-align:center 决定停靠点。', '对照属性表了解 scroll-snap-stop、scroll-padding 的用途。'],
    notes: ['scroll-snap 不会自行创建滚动容器，需配合 overflow:auto/scroll 才有滚动。', 'mandatory 会让内容强停靠，若某子项比容器高可能无法停留，需斟酌。', 'scroll-padding 可为吸顶导航预留偏移，避免对齐的子项被遮挡。'],
    problem: '解决"如何实现原生、流畅的滚动定位效果（如轮播、分页），而不依赖 JavaScript"的问题。',
  },
{
    id: 'C_24', title: 'aspect-ratio 与 object-fit', navTitle: '宽高比与填充', category: '尺寸与媒体',
    path: '/css/c-24/aspect-ratio', summary: '用 aspect-ratio 控制元素宽高比防止布局偏移，用 object-fit 控制图片/视频的填充方式。',
    demo: C24AspectRatio,
    code: () => Promise.resolve(`/* aspect-ratio：固定宽高比 */

/* 16:9 宽屏比例 */
.ratio-16-9 {
  aspect-ratio: 16 / 9;
  width: 100%;
  /* 高度自动计算，保持 16:9 */
}

/* 1:1 正方形 */
.ratio-square {
  aspect-ratio: 1 / 1;
}

/* 4:3 传统比例 */
.ratio-4-3 {
  aspect-ratio: 4 / 3;
}

/* 21:9 超宽屏 */
.ratio-ultrawide {
  aspect-ratio: 21 / 9;
}

/* 与 min-width/max-width 配合 */
.responsive-ratio {
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 800px;
}

/* 旧版 hack（不推荐，用 aspect-ratio 替代） */
/*
.ratio-old {
  position: relative;
  padding-top: 56.25%;
}
.ratio-old > * {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}
*/

/* object-fit：替换元素的填充方式 */

/* cover：裁剪填满（保持比例） */
.img-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 图片填满容器，超出部分裁剪 */
}

/* contain：完整显示（可能留白） */
.img-contain {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* 图片完整显示，可能有留白 */
}

/* fill：拉伸填满（变形） */
.img-fill {
  width: 100%;
  height: 100%;
  object-fit: fill;
  /* 拉伸填满，可能变形（默认值） */
}

/* none：保持原始尺寸 */
.img-none {
  width: 100%;
  height: 100%;
  object-fit: none;
  /* 不缩放，保持原始尺寸 */
}

/* scale-down：取 none 或 contain 中较小的 */
.img-scale-down {
  object-fit: scale-down;
}

/* object-position：调整显示位置 */
.img-position {
  object-fit: cover;
  object-position: center top;
  /* 居中顶部 */
}

/* 防止 CLS（布局偏移）最佳实践 */
.img-cls {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  /* 图片加载前就预留好空间 */
}`),
    language: 'css',
    principle: 'aspect-ratio 直接由宽度推导高度（如 16/9），浏览器在布局阶段即确定尺寸，避免图片未就绪引发布局偏移（CLS）；object-fit 决定替换元素在给定盒内的填充方式——cover 裁剪铺满、contain 完整保留留白、fill 拉伸改比例、none 不缩放、scale-down 取 none/contain 的较小者。',
    flow: ['点"显示比值演示"看各宽高比在固定宽度下的高度推导。', '切换 fill/contain/cover/none/scale-down 观察图片在盒内的填充。', '留意 object-position 与固定容器尺寸对显示位置的影响。'],
    notes: ['为图片预留 aspect-ratio（如 16/9）可显著降低 CLS。', 'object-fit 需给 img 设定明确的 width/height 才生效，通常给 width/height 100%。', 'fill 是默认值，能铺满但可能拉伸变形；常用 cover 兼顾裁剪与比例。'],
    problem: '解决"图片/视频如何在不同尺寸容器中正确显示，以及如何在加载前预留正确空间"的问题。',
  }
]
