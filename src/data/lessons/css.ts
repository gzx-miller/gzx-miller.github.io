import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import C01Selectors from '../../demos/C01SelectorsArticle.vue'
import C02BoxModel from '../../demos/C02BoxModelArticle.vue'
import C03Flexbox from '../../demos/C03FlexboxArticle.vue'
import C04Grid from '../../demos/C04GridArticle.vue'
import C05Position from '../../demos/C05PositionArticle.vue'
import C06Cascade from '../../demos/C06CascadeArticle.vue'
import C07Variables from '../../demos/C07VariablesArticle.vue'
import C08Transition from '../../demos/C08TransitionArticle.vue'
import C09MediaQuery from '../../demos/C09MediaQueryArticle.vue'
import C10Gradient from '../../demos/C10GradientArticle.vue'
import C11Filter from '../../demos/C11FilterArticle.vue'
import C12MathFunctions from '../../demos/C12MathFunctionsArticle.vue'
import C13ViewportUnits from '../../demos/C13ViewportUnitsArticle.vue'
import C14ClipPath from '../../demos/C14ClipPathArticle.vue'
import C15LogicalProperties from '../../demos/C15LogicalPropertiesArticle.vue'
import C16ContainerQuery from '../../demos/C16ContainerQueryArticle.vue'
import C17StackingContext from '../../demos/C17StackingContextArticle.vue'
import C18FormattingContext from '../../demos/C18FormattingContextArticle.vue'
import C19BEM from '../../demos/C19BEMArticle.vue'
import C20Performance from '../../demos/C20PerformanceArticle.vue'
import C21CascadeLayers from '../../demos/C21CascadeLayersArticle.vue'
import C22HasSelector from '../../demos/C22HasSelectorArticle.vue'
import C23ScrollSnap from '../../demos/C23ScrollSnapArticle.vue'
import C24AspectRatio from '../../demos/C24AspectRatioArticle.vue'
// 该分类专属的演示样式，随分类数据一起按需加载
import '../../styles/category-css.css'

const cssCodeModules = import.meta.glob<string>('../../demos/css-code/*', { query: '?raw', import: 'default' })

function createCodeLoader(path: string) {
  const loader = cssCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const C01Code = createCodeLoader('css-code/C01Code.css.txt')
const C02Code = createCodeLoader('css-code/C02Code.css.txt')
const C03Code = createCodeLoader('css-code/C03Code.css.txt')
const C04Code = createCodeLoader('css-code/C04Code.css.txt')
const C05Code = createCodeLoader('css-code/C05Code.css.txt')
const C06Code = createCodeLoader('css-code/C06Code.css.txt')
const C07Code = createCodeLoader('css-code/C07Code.css.txt')
const C08Code = createCodeLoader('css-code/C08Code.css.txt')
const C09Code = createCodeLoader('css-code/C09Code.css.txt')
const C10Code = createCodeLoader('css-code/C10Code.css.txt')
const C11Code = createCodeLoader('css-code/C11Code.css.txt')
const C12Code = createCodeLoader('css-code/C12Code.css.txt')
const C13Code = createCodeLoader('css-code/C13Code.css.txt')
const C14Code = createCodeLoader('css-code/C14Code.css.txt')
const C15Code = createCodeLoader('css-code/C15Code.css.txt')
const C16Code = createCodeLoader('css-code/C16Code.css.txt')
const C17Code = createCodeLoader('css-code/C17Code.css.txt')
const C18Code = createCodeLoader('css-code/C18Code.css.txt')
const C19Code = createCodeLoader('css-code/C19Code.css.txt')
const C20Code = createCodeLoader('css-code/C20Code.css.txt')
const C21Code = createCodeLoader('css-code/C21Code.css.txt')
const C22Code = createCodeLoader('css-code/C22Code.css.txt')
const C23Code = createCodeLoader('css-code/C23Code.css.txt')
const C24Code = createCodeLoader('css-code/C24Code.css.txt')

export const lessons: Lesson[] = [
{
    id: 'C_01', title: '选择器详解', navTitle: '选择器', category: '选择器',
    path: '/css/c-1/selectors', summary: '理解通配、类型、类、ID、属性、伪类、伪元素与组合器的匹配差异与特异性。',
    demo: null,
    demoComponent: C01Selectors,
    code: C01Code,
    language: 'css',
    principle: '选择器决定匹配对象：通配匹配全部、类型匹配标签名、类/ID 匹配 class/id、属性匹配特性、伪类匹配状态、伪元素匹配元素的"虚拟部分"，组合器（后代、>、+、~）则表达元素间的结构关系。它们各具特异性（specificity），命中同一元素时以特异性大小决定胜负。',
    flow: ['点击标签按钮逐类查看对应选择器命中了哪些元素。', '观察每类选择器的生效范围与遗漏。', '结合特异性规律理解样式覆盖顺序。', '用开发者工具查看命中元素的实际生效规则，验证覆盖来源。'],
    notes: ['特异性大致为 ID > 类/属性/伪类 > 类型/伪元素，是覆盖顺序的关键。', '伪元素以 ::before、::first-letter 等命中盒子上的"虚拟位置"，可插入内容或局部排版。', '选择器不宜嵌套过深，否则可维护性与匹配效率都会下降。', '调试样式时先用开发者工具定位胜出的规则，再决定改选择器还是调顺序。'],
    problem: '解决"如何精准选中目标元素，并在多条规则竞争时看懂样式覆盖顺序"的问题。',
  },
{
    id: 'C_02', title: '盒模型与尺寸计算', navTitle: '盒模型', category: '基础模型',
    path: '/css/c-2/box-model', summary: '理解 content-box 与 border-box 的尺寸差异，以及外边距折叠现象。',
    demo: null,
    demoComponent: C02BoxModel,
    code: C02Code,
    language: 'css',
    principle: 'box-sizing 决定 width 是否计入 padding 与 border：content-box 的 width 只含内容区，实际总宽要另加 padding 与 border；border-box 把内容区压缩以包含二者，width 即最终外围宽度。外边距折叠指普通文档流中垂直相邻的块级盒，外边距合并取较大值。',
    flow: ['切换 content-box / border-box 观察内容区与总宽度的变化。', '对照尺寸计算表看 content/padding/border 三者如何分摊。', '切换外边距折叠，确认 30px 与 20px 合并为 30px。', '用开发者工具的盒模型面板核对元素的实际占位尺寸。'],
    notes: ['全局统一 * { box-sizing: border-box } 可避免"设了宽度实际更宽"的困扰，是通用做法。', '外边距折叠只发生在垂直方向，横向外边距从不折叠。', '父子的上下外边距在无 padding/border/BFC 隔离时也会折叠，用 padding 或 display: flow-root 可阻断。', '排查间距异常时先怀疑外边距折叠，再考虑是否真的需要 margin。'],
    problem: '解决"设置 width: 200px 但元素实际更宽，以及相邻元素间距不符合预期"的问题。',
  },
{
    id: 'C_03', title: 'Flexbox 弹性布局', navTitle: 'Flexbox', category: '布局系统',
    path: '/css/c-3/flexbox', summary: '用课程卡片列表理解主轴、交叉轴对齐与弹性伸缩。',
    demo: null,
    demoComponent: C03Flexbox,
    code: C03Code,
    language: 'css',
    principle: 'Flexbox 是一维布局模型：主轴由 flex-direction 决定（row/column），交叉轴垂直于主轴；justify-content 负责主轴对齐，align-items 负责交叉轴对齐，flex-wrap 决定超宽时是否换行，gap 设置项目间距，order 调整显示顺序。',
    flow: ['切换 flex-direction 观察主轴方向如何改变排列。', '分别调整 justify-content 与 align-items 对比两轴对齐。', '拖动 gap 滑块并选择 flex-wrap 观察间距与换行。', '把 flex: 1 加到多个子项上，确认剩余空间被均分。'],
    notes: ['justify-content 管主轴、align-items 管交叉轴，二者不可混用。', 'flex: 1 是 flex-grow:1 flex-shrink:1 flex-basis:0% 的简写，用于均分剩余空间。', 'Flexbox 适合一维组件内部排列，二维整体布局交给 Grid。', '主轴对齐无效时先检查 flex-direction，方向不同轴的含义随之互换。'],
    problem: '解决"如何让子元素在主轴与交叉轴上灵活对齐，并合理处理剩余空间分配"的问题。',
  },
{
    id: 'C_04', title: 'Grid 二维网格布局', navTitle: 'Grid', category: '布局系统',
    path: '/css/c-4/grid', summary: '用课程仪表盘理解列轨道定义、gap 与 grid-template-areas 区域布局。',
    demo: null,
    demoComponent: C04Grid,
    code: C04Code,
    language: 'css',
    principle: 'Grid 是二维布局模型：grid-template-columns/rows 定义轨道，fr 分配可用空间比例，repeat() 简化重复、auto-fill+minmax() 实现自动填充；grid-template-areas 通过命名区域语义化描述页面骨架，子元素用 grid-area 归位。',
    flow: ['切换列轨道（等列/固定弹性固定/自动填充）观察列数变化。', '拖动 gap 滑块查看轨道间距。', '开启 grid-area 查看"页头/侧栏/内容/页脚"区域布局。', '调整窗口宽度验证 auto-fill 列数自动增减。'],
    notes: ['1fr 表示占据剩余可用空间的一份，可和固定像素轨道混用。', 'repeat(auto-fill, minmax(120px, 1fr)) 让列数随宽度自动增减。', 'Grid 负责二维整体布局，一维的组件内部仍交给 Flexbox。', '列宽用 fr 混搭固定像素时先想清楚哪些维度该伸缩、哪些该锁死。'],
    problem: '解决"如何同时控制行和列的布局，并用语义化的区域命名描述页面结构"的问题。',
  },
{
    id: 'C_05', title: '定位机制', navTitle: '定位', category: '定位与布局',
    path: '/css/c-5/position', summary: '理解 static / relative / absolute / fixed / sticky 的偏移基准与文档流行为。',
    demo: null,
    demoComponent: C05Position,
    code: C05Code,
    language: 'css',
    principle: 'position 决定偏移参考系与是否脱离文档流：static 不定位；relative 相对自身原位置偏移且保留占位；absolute 脱离文档流、相对最近的非 static 祖先定位；fixed 脱离文档流、相对视口固定；sticky 越过阈值前保留原位、越过阈值后像 fixed 一样吸顶（须给定 top/bottom/left/right）。',
    flow: ['依次切换五种定位值观察盒子位置与占位的变化。', '对照表格确认每种取值是否脱离文档流。', '滚动容器观察 sticky 的阈值吸顶与 fixed 的始终固定。', '给祖先加 transform 验证 fixed 的包含块被改变。'],
    notes: ['absolute 必须依托一个非 static 祖先作参考，否则会一路向上到视口/格式化上下文。', 'sticky 需要同时设置 top/bottom/left/right 之一才会触发。', 'fixed 默认相对视口，但会被祖先的 transform/filter 等属性当作包含块限制。', 'sticky 在父容器高度用尽后会随容器滚出视口，不是永久吸顶。'],
    problem: '解决"元素应该相对谁偏移、是否应脱离正常文档流，以及吸顶为何失效"的问题。',
  },
{
    id: 'C_06', title: '层叠与继承', navTitle: '层叠', category: '层叠与继承',
    path: '/css/c-6/cascade', summary: '理解选择器特异性的高低排序，以及继承与 initial、unset 的作用。',
    demo: null,
    demoComponent: C06Cascade,
    code: C06Code,
    language: 'css',
    principle: '命中同一元素的多个规则按特异性比较：ID > 类 > 元素（及伪元素），同特异性时后声明的覆盖；!important 能越过所有普通声明。另一个维度是继承——color 等大部分文本类属性默认向下继承，margin/padding/border 不继承。',
    flow: ['在"层叠优先级"页看元素/类/ID 三条规则谁胜出。', '切到 !important 页理解其对优先级的越权行为。', '在继承页验证可继承与不可继承属性，并用 initial/unset 显式重置。', '写下同特异性的两条规则，验证后声明者胜出。'],
    notes: ['特异性可写成三元组（ID、类/属性/伪类、类型/伪元素），逐位比较大者胜。', 'inherit 强制继承、initial 取初始值、unset 按"可继承则继承、否则初始值"二选一。', '!important 会打乱全部优先级，应仅作兜底谨慎使用。', '重构选择器降低特异性，通常比不断加 !important 更能解决覆盖困局。'],
    problem: '解决"为什么写的样式不生效（被覆盖），以及如何正确控制优先级"的问题。',
  },
{
    id: 'C_07', title: 'CSS 变量（自定义属性）', navTitle: 'CSS 变量', category: '变量与主题',
    path: '/css/c-7/variables', summary: '用暖/冷主题与间距滑块理解自定义属性的声明、读取、继承与运行时更新。',
    demo: null,
    demoComponent: C07Variables,
    code: C07Code,
    language: 'css',
    principle: '自定义属性以 --name 声明、var(--name, fallback) 读取；它可继承，运行时可通过 element.style.setProperty() 动态改写，从而驱动整套主题切换与间距调整。定义在 :root 的变量全局可用，局部重声明即可实现作用域内的主题覆盖。',
    flow: ['切换暖/冷主题观察 var(--primary) 驱动的配色整体变化。', '拖动滑块通过 JS 更新 --spacing，观察间距即时生效。', '对照表格理解声明、读取、JS 访问、继承四种用法。', '在开发者工具中查看变量解析后的实际值，排查继承链问题。'],
    notes: ['自定义属性不能直接参与动画插值，须配合 var() 在 calc() 或具体属性的值中使用。', 'fallback 只在变量未定义或无效时生效。', '把色板、间距、圆角等"设计令牌"集中在 :root 便于统一维护与替换主题。', '变量命名用语义（--color-primary）而非外观（--blue），换主题时语义不变。'],
    problem: '解决"如何在运行时动态切换主题，并让多个属性共享同一设计令牌"的问题。',
  },
{
    id: 'C_08', title: '过渡与动画', navTitle: '过渡动画', category: '动画与过渡',
    path: '/css/c-8/transition-animation', summary: '用卡片交互动效对比 transition 与 animation 的触发方式与适用场景。',
    demo: null,
    demoComponent: C08Transition,
    code: C08Code,
    language: 'css',
    principle: 'transition 只能响应状态变化（如 :hover），在两个状态值之间补间过渡；animation 通过 @keyframes 定义关键帧，可自动播放、循环（infinite）、反向（alternate）与中途暂停，适合无需用户触发的持续动效。',
    flow: ['切换 transition / animation 观察触发方式的差别。', '下拉选择要过渡的属性，或拖动时长滑块感受缓动节奏。', '对照表格对比关键帧、循环、暂停等能力差异。', '调慢 animation-duration 逐步观察关键帧的补间过程。'],
    notes: ['优先过渡 transform 与 opacity，它们走合成器、开销低且不触发重排。', 'transition 只做两个状态的渐变，多阶段关键帧需用 @keyframes 动画。', '动画时长与缓动函数（ease/linear 等）决定观感的流畅与节奏。', '为动效提供 prefers-reduced-motion 降级，尊重用户的减弱动态偏好。'],
    problem: '解决"哪种动画方式更适合当前交互场景，以及如何避免动画性能问题"的问题。',
  },
{
    id: 'C_09', title: '媒体查询与响应式', navTitle: '媒体查询', category: '响应式',
    path: '/css/c-9/media-query', summary: '拖动滑块模拟视口宽度，理解移动优先的断点与 min-width 写法。',
    demo: null,
    demoComponent: C09MediaQuery,
    code: C09Code,
    language: 'css',
    principle: '@media 依据视口尺寸与设备特性条件性地应用规则；移动优先指先写小屏默认样式，再用 @media (min-width: …) 逐级增强，让手机优先并渐进升级到平板、桌面，避免桌面优先的 max-width 反复覆盖。移动优先的样式表天然以最简布局起步，向上增强而非向下裁剪。',
    flow: ['拖动滑块放大视口宽度，观察卡片列数从 1 → 2 → 4。', '对照代码块理解 min-width 断点（640/1024）的递增写法。', '参考断点表 sm/md/lg/xl 的典型取值与用途。', '用开发者工具的设备模拟切换宽度，核对每档断点的命中效果。'],
    notes: ['移动优先统一用 min-width，从已写好的小屏样式向上增强。', '可叠加 prefers-color-scheme、prefers-reduced-motion 等媒体特性做暗色与无障碍适配。', '不要把断点绑死在具体设备型号上，应依据内容开始"不好看"的临界宽度定义断点。', '断点数量保持精简，2-3 档覆盖主要形态即可，减少维护成本。'],
    problem: '解决"同一套 HTML 如何在手机、平板、桌面上呈现不同布局"的问题。',
  },
{
    id: 'C_10', title: '渐变与背景', navTitle: '渐变背景', category: '视觉效果',
    path: '/css/c-10/gradient-bg', summary: '用课程卡片背景理解 linear / radial / conic-gradient 的语法与色标控制。',
    demo: null,
    demoComponent: C10Gradient,
    code: C10Code,
    language: 'css',
    principle: '渐变色属于 CSS <image> 类型：linear-gradient 沿指定角度或 to 方向过渡，radial-gradient 从中心沿半径向外辐射，conic-gradient 绕中心沿角度渐变；每个色标可指定位置（如 50%），多个渐变用逗号叠加成多重背景。',
    flow: ['切换三种渐变类型观察过渡形态的差异。', '拖动角度滑块调整 linear-gradient 的方向。', '从预设区看渐变在卡片、遮罩、色轮中的典型应用。', '拖动色标位置验证硬边的形成条件与预期一致。'],
    notes: ['角度 0deg 垂直向上并随角度顺时针旋转，也可以用 to right 等方向关键字。', '相邻两个色标位置相同时会形成硬边（条纹），可用于分段色块。', '背景叠加时先写的渐变位于上层，可做出多层渐变效果。', '渐变动画性能开销大，大面积渐变建议用静态图或合成层属性替代。'],
    problem: '解决"如何用纯 CSS 实现丰富的背景效果，避免为渐变单独切图"的问题。',
  },
{
    id: 'C_11', title: '滤镜与混合模式', navTitle: '滤镜混合', category: '视觉效果',
    path: '/css/c-11/filter-blend', summary: '用课程封面图理解 filter 视觉效果与 mix-blend-mode 色彩混合。',
    demo: null,
    demoComponent: C11Filter,
    code: C11Code,
    language: 'css',
    principle: 'filter 对元素整体施加模糊、灰度、亮度、饱和度、色相、反相与阴影等效果，可多个叠加；mix-blend-mode 决定元素与下方内容之间的像素色彩混合；backdrop-filter 则只对元素后方区域做滤镜，常用于毛玻璃。三者的作用对象不同：filter 改元素本身、mix-blend-mode 与下方混合、backdrop-filter 只处理后区域。',
    flow: ['下拉切换不同 filter 观察图片的视觉变化。', '切换 mix-blend-mode 看文字如何与渐变背景融合。', '对照属性表区分 filter / backdrop-filter / mix-blend-mode 的作用对象。', '给毛玻璃卡片加文字，验证 backdrop-filter 效果与内容共存。'],
    notes: ['filter 会创建新的层叠上下文与包含块，可能影响内部的 fixed 定位。', 'mix-blend-mode 依赖下方不透明内容来体现混色，注意文字可读性。', 'backdrop-filter 仅作用于元素后方的背景，不改变元素自身。', '滤镜与混合模式同样可能创建层叠上下文，定位异常时要纳入排查范围。'],
    problem: '解决"如何为图片添加视觉效果，或让文字与背景图片产生自然的色彩融合"的问题。',
  },
{
    id: 'C_12', title: 'CSS 数学函数', navTitle: '数学函数', category: '函数与计算',
    path: '/css/c-12/math-functions', summary: '用卡片宽度动态计算理解 calc / min / max / clamp 的语法与典型场景。',
    demo: null,
    demoComponent: C12MathFunctions,
    code: C12Code,
    language: 'css',
    principle: 'calc() 支持混合单位的四则运算，常用于"100% 减去固定值"；min() 取所有参数的较小者，天然担任容器的宽度上限；max() 取较大者，实现最小值的响应式字号；clamp(min, ideal, max) 本质是上下界约束，把理想值限定在区间内。',
    flow: ['切换四种函数观察盒子宽度如何随参数变化。', '拖动滑块对比 calc 的"相减"与 clamp 的"区间"差异。', '对照表格记住每类函数的典型场景。', '把固定宽度换成 clamp，观察不同视口下的收缩与钳制行为。'],
    notes: ['calc() 中 + - 两侧必须留空格，* / 则没有此项限制。', 'clamp 的理想值通常用视口单位（如 vw），上下界用固定值。', '这些函数可与 CSS 变量组合，写出更灵活的自适应尺寸。', '在开发者工具中确认 calc 结果被解析为计算值，公式错误时通常是单位不匹配。'],
    problem: '解决"如何让尺寸在不同屏幕下自适应，同时把结果的上下限控制在合理范围内"的问题。',
  },
{
    id: 'C_13', title: '视口与容器单位', navTitle: '视口单位', category: '单位与尺寸',
    path: '/css/c-13/viewport-units', summary: '理解 vw / vh / dvh / cqw / rem / ch 的基准与适用场景。',
    demo: null,
    demoComponent: C13ViewportUnits,
    code: C13Code,
    language: 'css',
    principle: 'vw/vh 以视口宽/高为基准（各占 1%）；dvh 是动态视口高度，跟随移动端工具栏的收起/展开而变化，比固定的 vh 更贴近可见区域；cqw 以最近的容器查询容器为基准；rem 相对根字号，ch 约等于字符 0 的宽度，二者分别适合可缩放的全局尺寸与定字符宽的输入框。',
    flow: ['逐项切换单位按钮观察盒子的实际尺寸。', '对比 vw 与 cqw 的基准差异（视口 vs 容器）。', '对照基准表记住每个单位的参考对象与典型用途。', '在嵌套容器中对比 vw 与 cqw，验证容器单位不随视口变化。'],
    notes: ['移动端全屏建议用 dvh 代替 vh，避免被地址栏/工具条遮挡。', 'rem 依赖于根元素 font-size，改 :root 即可整体缩放。', '用 ch 做输入框宽度可恰好容纳指定字符数。', '绝对单位避免用于字号与间距，缩放与用户偏好场景会让布局失去弹性。'],
    problem: '解决"如何选择最合适的 CSS 单位，让布局在不同设备和容器中都能自适应"的问题。',
  },
{
    id: 'C_14', title: '形状与裁剪', navTitle: '裁剪形状', category: '视觉效果',
    path: '/css/c-14/clip-path-mask', summary: '用封面裁剪理解 clip-path 的几何形状与 mask 的透明度遮罩。',
    demo: null,
    demoComponent: C14ClipPath,
    code: C14Code,
    language: 'css',
    principle: 'clip-path 用 circle/ellipse/polygon/inset/path 等几何形状把元素的可渲染区域裁剪成非矩形，保留布局空间但只裁剪可见与可交互部分；mask 则依据图片或渐变的 alpha 通道决定可见性，实现按透明度渐隐。',
    flow: ['切换圆形/椭圆/三角形/内嵌矩形/路径观察裁剪外形。', '切到 mask 遮罩，理解它按透明度渐隐而非按几何裁剪。', '对照表格确认 clip-path/mask/border-radius/overflow 各自保留布局空间。', '点击被裁掉但仍在布局中的区域，验证交互可达性。'],
    notes: ['clip-path 会创建新的层叠上下文，被裁剪区域之外的点击不可达。', 'mask 已获得主流浏览器无前缀支持，-webkit-mask 仅作旧版兼容。', 'clip-path 可配合 transition 做形状动效，各顶点需保持可补间的数量与顺序。', 'polygon 顶点坐标基于元素百分比，换尺寸时形状随之缩放而非固定。'],
    problem: '解决"如何把元素裁剪成非矩形，或用渐变实现复杂的图片遮罩效果"的问题。',
  },
{
    id: 'C_15', title: '逻辑属性', navTitle: '逻辑属性', category: '逻辑属性',
    path: '/css/c-15/logical-properties', summary: '用中英文/rtl 布局理解物理属性与逻辑属性的差异，以及书写模式适配。',
    demo: null,
    demoComponent: C15LogicalProperties,
    code: C15Code,
    language: 'css',
    principle: '物理属性（left/right/top/bottom）固定方向，RTL 下不会自动翻转；逻辑属性用 start/end 描述文本流向——inline 对应行内走向、block 对应块向——inline-start/end 与 block-start/end 会随 LTR/RTL 及书写模式自动换向，一套代码即可适配多种语言。',
    flow: ['切换 LTR/RTL 观察"热门"角标与文本间距的镜像变化。', '对比左右两张卡片：物理属性固定、逻辑属性自动翻转。', '对照映射表记住常见物理→逻辑属性的对应关系。', '把模块整体切到 RTL，逐项核对哪些偏差来自残留的物理属性。'],
    notes: ['margin-inline-start 在 LTR 中是 margin-left，在 RTL 中是 margin-right。', 'width 对应 inline-size、height 对应 block-size，会随书写方向换向。', '面向多语言（含阿拉伯语 RTL）的国际化项目应优先采用逻辑属性。', '与设计协作时先约定"内外边距的方向语义"，落地时直接写逻辑属性。'],
    problem: '解决"如何让布局自动适配不同书写方向（如阿拉伯语 RTL），而不用手动切换 left/right"的问题。',
  },
{
    id: 'C_16', title: '容器查询', navTitle: '容器查询', category: '响应式进阶',
    path: '/css/c-16/container-query', summary: '拖动滑块改变容器宽度，理解基于容器尺寸（而非视口）的响应式布局。',
    demo: null,
    demoComponent: C16ContainerQuery,
    code: C16Code,
    language: 'css',
    principle: '容器查询先在生产容器上用 container-type: inline-size（必要时 container-name 命名）声明，再用 @container (min-width: …) 依据"祖先容器"的尺寸应用样式；它与以视口为基准的 @media 互补，让同一组件在任意宽度宿主中都能自适应。',
    flow: ['拖动滑块改变容器宽度，观察卡片内部布局的切换。', '注意断点发生在容器宽度 400px 而非视口。', '对照表格理清 container-type / container-name / @container / cqw-cqh。', '把同一组件放进宽窄不同的宿主，验证样式随容器独立切换。'],
    notes: ['container-type: inline-size 只追踪宽度，查询高度需用 size 并给容器定高。', '@container 适合组件级响应式，@media 仍负责页面级整体断点。', 'cqw/cqh 是以命名容器宽/高为基准的容器查询单位。', '组件库应默认自带容器查询适配，宿主宽窄变化时无需外部干预。'],
    problem: '解决"组件在不同宽度的容器中应如何自适应，而不是只根据视口宽度响应"的问题。',
  },
{
    id: 'C_17', title: '层叠上下文', navTitle: '层叠上下文', category: '层叠与 z-index',
    path: '/css/c-17/stacking-context', summary: '理解 z-index 失效的原因：层叠上下文的创建条件与层级隔离。',
    demo: null,
    demoComponent: C17StackingContext,
    code: C17Code,
    language: 'css',
    principle: 'z-index 只在定位元素上生效，且比较范围被限定在同一个层叠上下文内；opacity<1、transform≠none、filter≠none、isolation:isolate、flex/grid 子项带 z-index 等都会创建新的层叠上下文。父元素创建上下文后，子元素再大的 z-index 也无法越过上下文边界与外部元素比较。',
    flow: ['先在默认模式确认 z-index 999 > 2 > 1 的正常排序。', '给 B 的父元素加 opacity<1 或 transform，观察其内部层级与外界隔离。', '对照创建条件表记住常见的层叠上下文触发属性。', '逐条开关 opacity/transform/filter，观察层级归属的切换。'],
    notes: ['isolation: isolate 是最干净的"主动建上下文"手段，无视觉副作用。', 'transform/filter/opacity 在动画中很常见，极易无意引入层级 bug。', '比较 z-index 时只应比较同一上下文内的兄弟及其后代。', '弹层组件尽量挂到 body 下渲染，规避祖先层叠上下文造成的覆盖失效。'],
    problem: '解决"为什么设置了很高的 z-index 仍然被其他元素覆盖"的问题。',
  },
{
    id: 'C_18', title: '格式化上下文', navTitle: '格式化上下文', category: '布局原理',
    path: '/css/c-18/formatting-context', summary: '理解 BFC / IFC / FFC / GFC 的创建方式与布局影响。',
    demo: null,
    demoComponent: C18FormattingContext,
    code: C18Code,
    language: 'css',
    principle: '格式化上下文规定盒子内部元素的布局规则：BFC（块格式化上下文）可包裹浮动、阻断外边距折叠；IFC（行内格式化上下文）决定一行内 inline 元素的排列与基线对齐；display:flex / grid 分别建立 FFC 与 GFC，各自接管主轴与网格布局。',
    flow: ['对比"有 BFC"与"无 BFC"两个盒子里浮动的包裹差异。', '在 IFC 演示中观察行内元素在同一行内按基线排列。', '在外边距折叠页确认 BFC 可阻止相邻盒的 margin 合并。', '用 display: flow-root 替换 overflow: hidden 对比副作用差异。'],
    notes: ['创建 BFC 的常见方式：overflow 非 visible、display:flow-root、float 非 none、绝对定位、flex/grid 容器。', 'display:flow-root 是建立 BFC 又无副作用的首选。', 'FFC/GFC 本质就是 flex/grid 容器内部默认建立的格式化上下文。', 'float 元素会脱离常规流，父容器包不住时用 BFC 包裹是经典解法。'],
    problem: '解决"浮动元素溢出容器、外边距异常折叠、行内元素对不齐"等经典 CSS 布局问题。',
  },
{
    id: 'C_19', title: 'CSS 架构方法论', navTitle: 'CSS 架构', category: '工程架构',
    path: '/css/c-19/architecture', summary: '用课程卡片组件理解 BEM / OOCSS / SMACSS 的命名与组织思路。',
    demo: null,
    demoComponent: C19BEM,
    code: C19Code,
    language: 'css',
    principle: 'BEM 用 Block__Element--Modifier 约束命名，类名语义化、可预测且不嵌套；OOCSS 主张把"结构"（布局类）与"皮肤"（视觉类）拆成可复用的小类；SMACSS 按 Base/Layout/Module/State/Theme 角色分类选择器；在现代工程中还可结合 CSS Modules 的哈希局部作用域从机制上隔离冲突。',
    flow: ['在 BEM 页看"块-元素-修饰符"如何为一个组件命名。', '切到 OOCSS 页观察结构与皮肤类如何组合复用。', '在 SMACSS 页对照按角色前缀的命名约定，并理解 CSS Modules 局部作用域。', '给一个组件补齐 BEM 命名，核对类名是否层级清晰。'],
    notes: ['BEM 类名偏长、HTML 略重，但换来大型项目的可预测性。', 'OOCSS 通过组合细粒度类避免重复声明。', '现代工程多用 CSS Modules 让类名哈希化，从根本上隔离样式冲突。', '命名规范要写进团队约定并配 lint 校验，否则难以长期执行。'],
    problem: '解决"大型项目中 CSS 如何组织，才能避免样式冲突、提高可维护性"的问题。',
  },
{
    id: 'C_20', title: 'CSS 性能优化', navTitle: 'CSS 性能', category: '性能优化',
    path: '/css/c-20/performance', summary: '理解图层提升、content-visibility、渲染阻塞与动画性能的优化手段。',
    demo: null,
    demoComponent: C20Performance,
    code: C20Code,
    language: 'css',
    principle: 'CSS 性能的抓手是减少重排/重绘与渲染阻塞：动画尽量只用合成层友好的 transform/opacity；will-change 可提前声明将变化的属性以提升图层；content-visibility:auto 配合 contain-intrinsic-size 跳过离屏元素的渲染；同时避免 @import 与过度嵌套选择器以降低阻塞与匹配成本。',
    flow: ['在 will-change 与图层提升页理解"提升图层 vs 滥用"的取舍。', '在 content-visibility 页看离屏跳过渲染与预留尺寸的配合。', '在最佳实践页对照高性能与低性能的动画/选择器写法。', '用性能面板录制滚动过程，确认主要耗时不在样式重算上。'],
    notes: ['will-change 不要大面积滥用，会浪费 GPU 内存。', 'content-visibility:auto 需配 contain-intrinsic-size，避免滚动条跳动。', '避免动画 width/height/margin 等触发重排的属性，也避免频繁读写布局属性（强同步布局）。', '长列表离屏内容用 content-visibility 跳过渲染，但要先测量收益再全站推广。'],
    problem: '解决"页面滚动卡顿、动画不流畅、首次渲染慢"等影响体验的 CSS 性能问题。',
  },
{
    id: 'C_21', title: 'CSS 层叠层（@layer）', navTitle: '层叠层', category: '层叠与架构',
    path: '/css/c-21/cascade-layers', summary: '用 @layer 显式声明层顺序，解决多来源样式的优先级管理。',
    demo: null,
    demoComponent: C21CascadeLayers,
    code: C21Code,
    language: 'css',
    principle: '普通规则只靠书写顺序难以掌控后续升级与第三方样式的覆盖；@layer 先统一声明层顺序（靠后声明的层优先级更高），使 reset < base < components < utilities 的层级始终成立——只要把工具类放进 utilities 层，就能稳定压过前置层，与书写先后无关。',
    flow: ['先对照默认模式看无 @layer 时多条规则的覆盖。', '启用 @layer 后观察 utilities 层的颜色始终胜出。', '对照特性表理解层声明顺序、跨文件引用与未分层样式优先级。', '调整 @layer 声明顺序，验证同层规则的相对优先级不变。'],
    notes: ['未被纳入任何 @layer 的样式优先级高于所有分层样式，常被组件内样式利用。', '@import url(...) layer(name) 可把第三方库归入指定层。', '层内的 !important 仍会提升优先级，须谨慎使用。', '把第三方库整体归入 vendor 层，业务代码就不必再靠权重硬拼。'],
    problem: '解决"多来源样式（重置样式、组件样式、工具类）如何有序管理优先级"的问题。',
  },
{
    id: 'C_22', title: 'CSS :has() 选择器', navTitle: ':has() 选择器', category: '选择器进阶',
    path: '/css/c-22/has-selector', summary: '用 :has() 实现"父元素选择器"效果，根据子元素状态样式化容器。',
    demo: null,
    demoComponent: C22HasSelector,
    code: C22Code,
    language: 'css',
    principle: ':has() 让一条选择器以"当前元素是否包含某些后代/符合条件的兄弟"为条件来匹配，从而能根据子元素状态（.error、:checked、:focus 等）反选父容器；它支持与 :not()、嵌套及相邻兄弟组合器搭配，把过去需要 JS 判断的逻辑收敛到纯 CSS。',
    flow: ['点"启用 :has() 高亮"，观察含 .error 徽章的卡片被高亮。', '对照内嵌样式理解 :has(.error) 选中含错误的容器范围。', '从选择器表了解 :not(:has())、:has(+ p) 等扩展用法。', '组合 :has 与 :not，验证复杂条件的匹配结果符合预期。'],
    notes: [':has() 已获得主流浏览器基线支持（2023 年起）。', '它不仅能按子元素选中父级，还能通过 :has(+ 兄弟) 影响前面的元素。', '尽量避免大量嵌套的 :has()，这类选择器相对昂贵。', '样式依赖的 DOM 结构变化时要同步检查 :has 条件，防止匹配意外失效。'],
    problem: '解决"如何根据子元素状态样式化父容器，而不依赖 JavaScript"的问题。',
  },
{
    id: 'C_23', title: 'Scroll Snap 滚动定位', navTitle: 'Scroll Snap', category: '滚动与交互',
    path: '/css/c-23/scroll-snap', summary: '用 scroll-snap 实现精准的滚动定位，适合轮播、图片画廊和分页滚动。',
    demo: null,
    demoComponent: C23ScrollSnap,
    code: C23Code,
    language: 'css',
    principle: 'scroll-snap-type 在滚动容器上声明滚动轴与对齐严格度（x/y + mandatory/proximity），scroll-snap-align 在子项上设置对齐点（start/center/end）；mandatory 强制停靠各对齐点、proximity 仅在接近时吸附，用于构建无需 JS 的原生轮播、画廊与分页。',
    flow: ['依次切换水平强制/水平接近/垂直强制观察滚动吸附的差异。', '注意子项的 scroll-snap-align:center 决定停靠点。', '对照属性表了解 scroll-snap-stop、scroll-padding 的用途。', '为吸顶导航设置 scroll-padding，验证对齐点不被遮挡。'],
    notes: ['scroll-snap 不会自行创建滚动容器，需配合 overflow:auto/scroll 才有滚动。', 'mandatory 会让内容强停靠，若某子项比容器高可能无法停留，需斟酌。', 'scroll-padding 可为吸顶导航预留偏移，避免对齐的子项被遮挡。', '轮播滚动条视觉隐藏可用 scrollbar-width: none，功能不受影响。'],
    problem: '解决"如何实现原生、流畅的滚动定位效果（如轮播、分页），而不依赖 JavaScript"的问题。',
  },
{
    id: 'C_24', title: 'aspect-ratio 与 object-fit', navTitle: '宽高比与填充', category: '尺寸与媒体',
    path: '/css/c-24/aspect-ratio', summary: '用 aspect-ratio 控制元素宽高比防止布局偏移，用 object-fit 控制图片/视频的填充方式。',
    demo: null,
    demoComponent: C24AspectRatio,
    code: C24Code,
    language: 'css',
    principle: 'aspect-ratio 直接由宽度推导高度（如 16/9），浏览器在布局阶段即确定尺寸，避免图片未就绪引发布局偏移（CLS）；object-fit 决定替换元素在给定盒内的填充方式——cover 裁剪铺满、contain 完整保留留白、fill 拉伸改比例、none 不缩放、scale-down 取 none/contain 的较小者。',
    flow: ['点"显示比值演示"看各宽高比在固定宽度下的高度推导。', '切换 fill/contain/cover/none/scale-down 观察图片在盒内的填充。', '留意 object-position 与固定容器尺寸对显示位置的影响。', '拖动容器宽度，验证高度随 aspect-ratio 自动推导且无跳动。'],
    notes: ['为图片预留 aspect-ratio（如 16/9）可显著降低 CLS。', 'object-fit 需给 img 设定明确的 width/height 才生效，通常给 width/height 100%。', 'fill 是默认值，能铺满但可能拉伸变形；常用 cover 兼顾裁剪与比例。', 'aspect-ratio 只约束显示比例，图片本身没裁切，配合 object-fit 才真正裁剪。'],
    problem: '解决"图片/视频如何在不同尺寸容器中正确显示，以及如何在加载前预留正确空间"的问题。',
  }
]
