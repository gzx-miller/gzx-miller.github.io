import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    // VF 系列案例统一加载 Vue Flow 官方样式与站点双主题适配
    if (name.startsWith('VF')) await import('../../vue-flow/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const loader = vueCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到案例源码：${path}`)
  return loader
}

const VF01Demo = createDemo('VF01FirstFlow')
const VF01Code = createCodeLoader('VF01FirstFlow.vue')
const VF02Demo = createDemo('VF02NodeTypes')
const VF02Code = createCodeLoader('VF02NodeTypes.vue')
const VF03Demo = createDemo('VF03CanvasParts')
const VF03Code = createCodeLoader('VF03CanvasParts.vue')
const VF04Demo = createDemo('VF04Handles')
const VF04Code = createCodeLoader('VF04Handles.vue')
const VF05Demo = createDemo('VF05EdgeStyles')
const VF05Code = createCodeLoader('VF05EdgeStyles.vue')
const VF06Demo = createDemo('VF06CustomNodes')
const VF06Code = createCodeLoader('VF06CustomNodes.vue')
const VF07Demo = createDemo('VF07CustomEdges')
const VF07Code = createCodeLoader('VF07CustomEdges.vue')
const VF08Demo = createDemo('VF08Interactions')
const VF08Code = createCodeLoader('VF08Interactions.vue')
const VF09Demo = createDemo('VF09StateManage')
const VF09Code = createCodeLoader('VF09StateManage.vue')
const VF10Demo = createDemo('VF10DragDrop')
const VF10Code = createCodeLoader('VF10DragDrop.vue')
const VF11Demo = createDemo('VF11AutoLayout')
const VF11Code = createCodeLoader('VF11AutoLayout.vue')
const VF12Demo = createDemo('VF12ReadonlyTheme')
const VF12Code = createCodeLoader('VF12ReadonlyTheme.vue')

export const lessons: Lesson[] = [
  {
    id: 'VF_1',
    title: '第一个流程图：nodes、edges 与样式引入',
    navTitle: '第一个流程图',
    category: '基础入门',
    path: '/vue-flow/vf-1/first-flow',
    summary: '用课程学习路径图跑通 Vue Flow 最小闭环：安装、样式、节点与连线数据模型。',
    demo: VF01Demo,
    code: VF01Code,
    language: 'vue',
    principle:
      'Vue Flow 用两组数据描述流程图：nodes（id、position、data、type）与 edges（id、source、target）。节点位置是画布坐标，渲染由 VueFlow 组件接管；两条官方 CSS（style.css 结构 + theme-default.css 配色）必须引入，否则画布不可用。',
    flow: [
      '安装 @vue-flow/core 并引入 style.css 与 theme-default.css。',
      '准备 nodes/edges 数组，用 v-model:nodes、v-model:edges 双向绑定。',
      '设置 fit-view-on-init 让画布初次渲染即自适应视口，配 min-zoom/max-zoom 限制缩放。',
    ],
    notes: [
      '不引入官方 CSS 是新手最常见的"画布一片空白/错位"原因。',
      'edge 只需要 source/target 的节点 id，路径由库自动计算。',
      '画布容器必须有确定高度，否则渲染区高度为 0。',
    ],
    problem: '解决"如何在 Vue3 项目里最快画出一个可拖拽、可缩放的流程图"的问题。',
    officialUrl: 'https://vueflow.dev/guide/',
  },
  {
    id: 'VF_2',
    title: '内置节点类型：input、default 与 output',
    navTitle: '节点类型',
    category: '基础入门',
    path: '/vue-flow/vf-2/node-types',
    summary: '用报销审批流演示三种内置节点类型的连接桩差异与适用位置。',
    demo: VF02Demo,
    code: VF02Code,
    language: 'vue',
    principle:
      '内置三种节点类型的差别只在连接桩：input 只有 source 桩（流程起点）、default 兼有 source 与 target 桩（中间环节）、output 只有 target 桩（终点）。type 缺省即 default。三者的主色在 theme-default 中分别定义，可用 CSS 变量覆盖。',
    flow: [
      '流程起点声明 type: "input"，终点声明 type: "output"。',
      '中间环节不用写 type，缺省为 default。',
      '在 theme.css 中覆盖 --vf-node-color 系列，统一节点配色。',
    ],
    notes: [
      'input/output 节点拖不出/接不进对应方向的连线是类型特性，不是 bug。',
      '类型只约束连接桩方向，不限制业务含义，复杂卡片请用自定义节点。',
    ],
    problem: '解决"起点为什么连不进来、终点为什么连不出去"的入门疑惑。',
    officialUrl: 'https://vueflow.dev/guide/node.html',
  },
  {
    id: 'VF_3',
    title: '画布三件套：Background、Controls 与 MiniMap',
    navTitle: '画布三件套',
    category: '基础入门',
    path: '/vue-flow/vf-3/canvas-parts',
    summary: '给流程图装配背景网格、缩放控制条与小地图，并让网格颜色跟随双主题。',
    demo: VF03Demo,
    code: VF03Code,
    language: 'vue',
    principle:
      '附加组件拆成独立小包按需安装：@vue-flow/background 提供圆点/网格线/十字三种 pattern；@vue-flow/controls 提供缩放、归位、锁定按钮；@vue-flow/minimap 提供可拖动可缩放的缩略图，node-color 支持函数按节点上色。Controls 与 MiniMap 需要单独引入各自的 style.css。',
    flow: [
      '按需安装三个附加包，并引入 controls/minimap 的样式。',
      'Background 的 variant 在 dots/lines/cross 间切换，pattern-color 绑定主题色。',
      'MiniMap 的 node-color 传函数，按节点 data 定制缩略图色块。',
    ],
    notes: [
      'pattern-color 建议绑定 useTheme() 的计算属性，深浅主题各配一色。',
      'MiniMap 的 pannable/zoomable 开启后可直接在缩略图上导航主画布。',
    ],
    problem: '解决"大画布缺参照物：看不到边界、缩放失控、找不到节点"的问题。',
    officialUrl: 'https://vueflow.dev/components/background.html',
  },
  {
    id: 'VF_4',
    title: 'Handle 连接桩：定向分流与连接校验',
    navTitle: '连接桩与校验',
    category: '节点与连线',
    path: '/vue-flow/vf-4/handles',
    summary: '用报销单按金额分流演示多连接桩 id 匹配与 isValidConnection 业务校验。',
    demo: VF04Demo,
    code: VF04Code,
    language: 'vue',
    principle:
      'Handle 是节点上的连接点，type 区分 target（进）/source（出），position 决定停靠边。同一个节点可以摆多个 Handle，用 id 区分；此时 edge/connection 要带 sourceHandle、targetHandle 才能精确对接。isValidConnection 在拖线过程中实时调用，返回 false 的连线松手即被丢弃。',
    flow: [
      '在自定义节点模板中摆放多个带 id 的 Handle。',
      '用 isValidConnection 编码业务规则（如金额上限、禁止自连）。',
      '在 onConnect 里读取 sourceHandle/targetHandle 做分流落账。',
    ],
    notes: [
      'Handle 一旦设置 id，连线就必须显式指定对应 handle id。',
      '校验逻辑放 isValidConnection 而不是 onConnect，能在拖线时就给出反馈。',
    ],
    problem: '解决"一个节点多个出口/入口时连线乱接、业务规则拦不住"的问题。',
    officialUrl: 'https://vueflow.dev/guide/handle.html',
  },
  {
    id: 'VF_5',
    title: '连线类型与样式：五种路径、标签与箭头',
    navTitle: '连线类型',
    category: '节点与连线',
    path: '/vue-flow/vf-5/edge-styles',
    summary: '对比五种内置连线路径，掌握 label、animated、markerEnd 与自定义描边。',
    demo: VF05Demo,
    code: VF05Code,
    language: 'vue',
    principle:
      '内置五种边路径：default（贝塞尔）、straight（直线）、step（直角折线）、smoothstep（圆角折线）、simplebezier（简化贝塞尔）。edge 对象可配置 type、label（文字标签）、animated（流动虚线）、markerEnd（箭头，配 MarkerType 枚举）、style（内联描边样式）；default-edge-options 为新连线提供全局默认值。',
    flow: [
      '按信息密度选路径：正交系统用 smoothstep，自由画布用 default。',
      '重点链路用 animated + 彩色 style 突出，节点流向用 markerEnd 表达。',
      '全局默认形态配 default-edge-options，个别边再单独覆盖。',
    ],
    notes: [
      'style 中的颜色可使用 CSS 变量，天然适配双主题。',
      'label 渲染在 SVG 文本层，复杂标签请用自定义连线 + EdgeLabelRenderer。',
    ],
    problem: '解决"连线形态单一、看不出主次流向"的表达问题。',
    officialUrl: 'https://vueflow.dev/guide/edge.html',
  },
  {
    id: 'VF_6',
    title: '自定义节点：课程卡片插槽',
    navTitle: '自定义节点',
    category: '节点与连线',
    path: '/vue-flow/vf-6/custom-nodes',
    summary: '用 #node-course 插槽把默认小方块升级为带徽标、讲师与课时的课程卡片。',
    demo: VF06Demo,
    code: VF06Code,
    language: 'vue',
    principle:
      '给节点 type 起自定义名（如 course），VueFlow 会寻找同名插槽 #node-course 接管渲染。插槽参数携带 id、data、selected、dragging 等，业务数据全部走 node.data，选中态直接绑定 class。卡片内部仍用 Handle 声明连接点，与内置节点行为一致。',
    flow: [
      '节点数据建模放 data 字段，UI 在插槽模板里消费。',
      '用 selected 插槽参数渲染选中态（描边、阴影）。',
      'Handle 照常放在卡片边缘，position 控制进出方向。',
    ],
    notes: [
      'data 必须是对象且可序列化，便于持久化与撤销重做。',
      '大量节点时插槽内容要克制，复杂卡片考虑虚拟化或降级为内置节点。',
    ],
    problem: '解决"默认节点只有一行文字，承载不了业务信息"的问题。',
    officialUrl: 'https://vueflow.dev/guide/custom-node.html',
  },
  {
    id: 'VF_7',
    title: '自定义连线：状态标签与路径算法',
    navTitle: '自定义连线',
    category: '节点与连线',
    path: '/vue-flow/vf-7/custom-edges',
    summary: '用 #edge-approval 插槽配合 getBezierPath 与 EdgeLabelRenderer 画带通过/驳回状态的审批线。',
    demo: VF07Demo,
    code: VF07Code,
    language: 'vue',
    principle:
      '自定义连线用 #edge-类型名 插槽接管。插槽参数提供 sourceX/Y、targetX/Y 与方向枚举，调用 getBezierPath（或 getSmoothStepPath 等）生成 SVG path 的 d 属性；HTML 标签通过 EdgeLabelRenderer 挂载到画布上层，用起终点中点坐标绝对定位。线的样式与文案由 edge.data 驱动。',
    flow: [
      'edge.type 设为自定义名，data 携带业务状态（如 pass/reject）。',
      'path 的 d 用路径算法函数计算，fill 必须为 none。',
      '标签定位取 (sourceX+targetX)/2、(sourceY+targetY)/2 加 transform。',
    ],
    notes: [
      'SVG 里放不了复杂 HTML，标签一律走 EdgeLabelRenderer。',
      '更新 edge.data 即可让线色与文案响应式变化，无需手动重绘。',
    ],
    problem: '解决"连线只有一根线，看不出审批通过与驳回"的表达问题。',
    officialUrl: 'https://vueflow.dev/guide/custom-edge.html',
  },
  {
    id: 'VF_8',
    title: '交互编排：连接、框选与删除',
    navTitle: '交互编排',
    category: '交互与状态',
    path: '/vue-flow/vf-8/interactions',
    summary: '用任务编排板演示 onConnect 去重建线、Shift 框选多选与键盘删除。',
    demo: VF08Demo,
    code: VF08Code,
    language: 'vue',
    principle:
      '连线松手触发 connect 事件（模板 @connect 或 useVueFlow().onConnect），业务上在此去重、补默认样式后 addEdges。按住 selection-key-code（默认 Shift）拖空白区可框选多个元素，选中态落在 node.selected/edge.selected；delete-key-code 配置删除键（默认 Backspace）。删除节点前先清理相邻边，避免悬空连线。',
    flow: [
      'onConnect 里先查重（source+target+handle 四元组），再 addEdges。',
      '用 computed 聚合 selected 节点与边，驱动工具栏按钮状态。',
      '批量删除时同步移除选中边与选中节点的相邻边。',
    ],
    notes: [
      'v-model 绑定时选中/删除产生的 changes 会自动同步回数组。',
      '业务删除建议走按钮 + 确认，键盘删除留给快捷操作。',
    ],
    problem: '解决"画布能看不能编：连线重复、多选困难、删不干净"的问题。',
    officialUrl: 'https://vueflow.dev/guide/interactions.html',
  },
  {
    id: 'VF_9',
    title: 'useVueFlow：画布实例的响应式操作',
    navTitle: '状态管理',
    category: '交互与状态',
    path: '/vue-flow/vf-9/state-manage',
    summary: '在业务代码里用 useVueFlow 增删节点、更新数据、查找选中并 fitView。',
    demo: VF09Demo,
    code: VF09Code,
    language: 'vue',
    principle:
      'useVueFlow() 返回当前画布的响应式实例：nodes/edges 是实时状态（GraphNode/GraphEdge），addNodes/addEdges 增、removeNodes/removeEdges 删、updateNode/updateNodeData 改（后者只合并 data）、findNode/findEdge 查，fitView 控制视口。初始数据用 props 传入后，可完全脱离模板事件在任意回调中操作画布。',
    flow: [
      '初始 nodes/edges 用 props 传入，后续全走实例方法。',
      '列表渲染直接绑定实例的 nodes/edges，天然响应式。',
      '接口回调里 addNodes/updateNodeData，再 fitView 收拢视野。',
    ],
    notes: [
      'props 传入与 v-model 绑定是两种模式：前者由实例托管，后者由外部数组托管。',
      '同一页面多画布时用 useVueFlow({ id }) 区分实例。',
    ],
    problem: '解决"画布状态散落在模板事件里，业务代码插不上手"的问题。',
    officialUrl: 'https://vueflow.dev/composables/useVueFlow.html',
  },
  {
    id: 'VF_10',
    title: '拖拽添加节点：物料面板与坐标换算',
    navTitle: '拖拽添加',
    category: '交互与状态',
    path: '/vue-flow/vf-10/drag-drop',
    summary: '把物料从左侧面板拖进画布，用 screenToFlowCoordinate 精准落点。',
    demo: VF10Demo,
    code: VF10Code,
    language: 'vue',
    principle:
      '浏览器拖放事件给出的是屏幕坐标，而画布经过缩放平移后坐标系早已偏移。drop 处理中必须用 useVueFlow 的 screenToFlowCoordinate 把 clientX/clientY 换算成画布坐标，再 addNodes 放置。物料类型通过 dataTransfer.setData 携带，dragover/dragenter 需 preventDefault 才能触发 drop。',
    flow: [
      '物料 draggable=true，dragstart 时把类型写进 dataTransfer。',
      '画布容器监听 drop，preventDefault 后读取物料类型。',
      'screenToFlowCoordinate 换算坐标，addNodes 落点。',
    ],
    notes: [
      '不做坐标换算时，缩放后拖放的落点会明显偏离鼠标位置。',
      '旧代码里的 project() 已被 screenToFlowCoordinate 取代。',
    ],
    problem: '解决"低代码平台如何从物料区拖组件到画布并放在鼠标位置"的问题。',
    officialUrl: 'https://vueflow.dev/guide/drag-and-drop.html',
  },
  {
    id: 'VF_11',
    title: '自动布局：Kahn 分层与坐标写回',
    navTitle: '自动布局',
    category: '进阶能力',
    path: '/vue-flow/vf-11/auto-layout',
    summary: '自实现分层布局算法：按依赖分层计算坐标，updateNode 写回后 fitView。',
    demo: VF11Demo,
    code: VF11Code,
    language: 'vue',
    principle:
      '自动布局 = 纯函数算坐标 + 写回节点。layoutByLayers 用 Kahn 分层：入度为 0 的节点作第一层，其余节点层号取所有前置层最大值 + 1（最长路径），环上节点统一沉底保证终止；层内按出现顺序沿垂直方向堆叠。坐标经 updateNode 写回后 fitView 展示。更复杂的图可换 dagre/elkjs，数据流不变。',
    flow: [
      'assignLayers 按连线的 source→target 关系分层。',
      '层号映射主轴坐标（x 或 y），层内序号映射副轴坐标。',
      'updateNode 逐个写入 position，fitView 带动画收拢。',
    ],
    notes: [
      '布局函数保持纯函数，方便单元测试与切换布局引擎。',
      '环是流程图常态，算法必须显式处理（沉底或忽略）防死循环。',
    ],
    problem: '解决"手工摆节点乱成一团，想按依赖关系一键对齐"的问题。',
    officialUrl: 'https://vueflow.dev/guide/layouting.html',
  },
  {
    id: 'VF_12',
    title: '只读展示与双主题适配',
    navTitle: '只读与主题',
    category: '进阶能力',
    path: '/vue-flow/vf-12/readonly-theme',
    summary: '用组织架构图演示交互开关组合与跟随站点深浅主题的画布配色方案。',
    demo: VF12Demo,
    code: VF12Code,
    language: 'vue',
    principle:
      '展示型场景用交互开关收敛能力：nodes-draggable、nodes-connectable、edges-updatable、pane-movable 分别控制拖拽、连线、改线与平移。双主题适配两层下手：把官方 CSS 变量（--vf-node-bg、--vf-handle 等）映射到站点变量，边线等硬编码样式用 [data-theme] 选择器覆盖；背景 pattern-color 等属性层配色绑定 useTheme() 计算属性。Panel 组件可挂画布内浮层。',
    flow: [
      '按场景组合交互开关，编辑态与只读态一套代码切换。',
      'CSS 变量映射走站点主题变量，选择器级覆盖处理硬编码颜色。',
      '属性配色（网格、遮罩）绑定 isDark 计算属性。',
    ],
    notes: [
      'SSR 环境画布组件包在 ClientOnly 里，预渲染不会报错。',
      '主题切换无需重建画布，改 data-theme 即全画布响应。',
    ],
    problem: '解决"流程图在深色主题下刺眼、在展示页被误拖乱"的问题。',
    officialUrl: 'https://vueflow.dev/guide/theming.html',
  },
]
