import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(async () => {
    // VF 系列内容统一加载 Vue Flow 官方样式与站点双主题适配
    if (name.startsWith('VF')) await import('../../vue-flow/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const loader = vueCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
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
    summary: '用课程学习路径图跑通 Vue Flow 最小闭环：安装独立包、引入官方样式、用 nodes/edges 数据模型渲染出可拖拽缩放的画布。',
    demo: VF01Demo,
    code: VF01Code,
    language: 'vue',
    principle:
      'Vue Flow 用两组数据描述流程图：nodes（id、position、data，type 决定渲染形式）与 edges（id、source、target）。position 是画布坐标，节点拖拽、连线折线、缩放平移都由 VueFlow 组件接管，业务方只改数据。两套官方样式必须同时引入：style.css（结构布局）+ theme-default.css（默认配色），缺一画布不可用。',
    flow: [
      '安装 @vue-flow/core，并在入口引入 style.css 与 theme-default.css。',
      '数组声明 nodes/edges，用 v-model:nodes、v-model:edges 双向绑定；节点至少给 id、position、data.label。',
      '配 fit-view-on-init 让首帧自适应视口，用 min-zoom/max-zoom 限制缩放范围（本课为 0.5~1.5）。',
    ],
    notes: [
      '漏引官方 CSS 是画布"一片空白或节点错位"最常见的原因，先查这一条。',
      'edge 只需 source/target 对应的节点 id，连线路径由库按节点位置自动计算。',
      '@node-click 等事件的参数是单个事件对象（含 event 与 node），业务字段从 node.data 取。',
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
    summary: '用报销审批流演示三种内置节点类型在连接桩方向上的差异，以及 type 缺省即 default 的规则。',
    demo: VF02Demo,
    code: VF02Code,
    language: 'vue',
    principle:
      '内置三种节点类型的差别只在连接桩：input 只有 source 桩（流程起点，只能连出）、output 只有 target 桩（流程终点，只能连入）、default 同时带 source 与 target 桩（中间环节）。type 不写即 default。default 的 target 桩默认停靠上边、source 桩默认停靠下边。三者的主色由各自的 --vf-node-color 定义，站内用 CSS 变量覆盖为森林绿/栗棕/枫叶红。',
    flow: [
      '起点节点声明 type: "input"，终点节点声明 type: "output"，中间环节省略 type。',
      '实测约束：从"组长审批"的 source 桩拖线到"出纳打款"，体会 default 可发可收。',
      '需要统一样式时，在 theme.css 分别覆盖 .vue-flow__node-input/default/output 的 --vf-node-color。',
    ],
    notes: [
      'input 拖不出连线、output 接不进连线，是类型只约束连接桩方向的结果，不是 bug。',
      '类型仅定连接桩方向，不含业务语义；要承载富信息卡片请用自定义节点。',
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
    summary: '给流程图装配背景网格、缩放控制条与小地图三个附加包，并让网格配色跟随站点深浅主题。',
    demo: VF03Demo,
    code: VF03Code,
    language: 'vue',
    principle:
      '附加组件拆成独立小包按需安装，样式需各自引入：@vue-flow/background 提供圆点（dots）与网格线（lines）两种图案（旧版 Cross 十字已移除）；@vue-flow/controls 提供缩放、归位与锁定缩放按钮；@vue-flow/minimap 提供可拖动可缩放的缩略图，node-color 支持函数按节点 data 上色，mask-color 控制视口遮罩色。',
    flow: [
      '按需安装三个附加包，并在统一样式入口引入 controls/minimap 各自的 dist/style.css。',
      'Background 的 variant 在 dots/lines 间切换，pattern-color 绑定站点主题色，gap/size 控制网格密度。',
      'MiniMap 传 node-color 函数按节点 data.color 上色，开启 pannable/zoomable 便于在缩略图上导航。',
    ],
    notes: [
      'pattern-color 建议绑 useTheme() 的计算属性，深浅主题各配一色，切换即时生效。',
      'Controls/MiniMap 用 position 定到四角；深色主题下 controls 按钮样式要在 theme.css 里反色。',
      'pattern-color、bg-color 属于旧 props，当前版本新增的 color 是新写法（演示用旧名也能跑）。',
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
    summary: '用报销单按金额分流演示自定义节点内多 Handle 的 id 匹配，与 isValidConnection 的实时业务校验。',
    demo: VF04Demo,
    code: VF04Code,
    language: 'vue',
    principle:
      'Handle 是节点上的连接点：type 区分 target（进）/source（出），position 决定停靠边，id 用于在同一节点上区分多个桩。一旦 Handle 设了 id，新建连线就必须在 connection 里带 sourceHandle/targetHandle 才能精确对接。isValidConnection 在拖线过程中实时触发，返回 false 的连线松手即被丢弃；校验通过后再在 onConnect 里读取 handle id 落账。',
    flow: [
      '自定义节点模板（#node-expense-split）里摆两个 source Handle，分别给 id: small-out 与 large-out。',
      'isValidConnection 依据 sourceHandle/targetHandle 编码业务规则（大额只能进"总监"、禁止自连）。',
      'onConnect 里先验 valid 再 addEdges，并记录 sourceHandle → targetHandle 便于分流日志。',
    ],
    notes: [
      'Handle 一旦设置 id，连线就必须显式携带对应 handle id，否则对接不上。',
      '校验放 isValidConnection 而不是 onConnect，可以在拖线过程中就给出拒绝反馈。',
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
    summary: '对比五种内置连线路径的差异，掌握 type、label、animated、markerEnd、style 与 default-edge-options 的用法。',
    demo: VF05Demo,
    code: VF05Code,
    language: 'vue',
    principle:
      '内置五种边路径：default（贝塞尔）、straight（直线）、step（直角折线）、smoothstep（圆角折线）、simplebezier（简化贝塞尔）。单条边的形态写在 edge 对象上：type 选路径、label 放文字、animated 加流动虚线、markerEnd 配 MarkerType 枚举出箭头、style 覆盖描边；全局默认形态由 :default-edge-options 提供，个别边再单独覆盖（如本课"用了券"边）。',
    flow: [
      '用按钮切换 default-edge-options.type，直观对比五种路径的视觉差异（对新连线生效）。',
      '重点链路加 animated + style（本课"用了券"边用枫叶红 2px 描边）突出流向主次。',
      '表达方向时给 markerEnd 配 MarkerType.ArrowClosed 收尾箭头。',
    ],
    notes: [
      'style 里的 stroke 可用 CSS 变量，天然适配双主题。',
      '默认边的 label 渲染在 SVG 文本层，纯文本场景够用；复杂标签要自定义连线 + EdgeLabelRenderer。',
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
    summary: '用 #node-course 插槽把默认节点升级为带阶段徽标、讲师与课时的课程卡片，并用插槽参数处理选中态。',
    demo: VF06Demo,
    code: VF06Code,
    language: 'vue',
    principle:
      '给节点 type 起自定义名（如 course），VueFlow 就按同名插槽 #node-course 接管该类型节点的渲染。插槽参数携带 id、data、selected、dragging 等：业务信息全放 node.data 供模板读取，选中态用 selected 绑定 class，背景卡片由我们自己画。卡片内部照常放 Handle 声明连接点，连接行为与内置节点一致。',
    flow: [
      '节点 data 用类型化对象建模（title/teacher/lessons/stage），插槽里按字段渲染卡片。',
      '用 selected 插槽参数给卡片加选中描边与高亮，配合 @node-click 驱动右侧详情栏。',
      '在卡片左右边缘放 target/source 两个 Handle，参与既有连线的读取与新建。',
    ],
    notes: [
      'data 建议为可序列化的普通对象，便于保存、持久化与快照回放。',
      'Handle 要放在卡片外缘并给足尺寸，避免被文字遮住影响连线命中。',
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
    summary: '用 #edge-approval 插槽配合 getBezierPath 生成路径、EdgeLabelRenderer 挂载 HTML 标签，画出带通过/驳回状态的审批线。',
    demo: VF07Demo,
    code: VF07Code,
    language: 'vue',
    principle:
      '自定义连线用 #edge-类型名 插槽接管渲染。插槽参数给出来自起点、落在终点的 sourceX/sourceY、targetX/targetY 与源/目标方位，先调 getBezierPath 算出 SVG path 的 d 属性（返回 [path, labelX, labelY]，本课取首项），线段充当真实 SVG 元素。要叠 HTML 标签就用 EdgeLabelRenderer，它悬在画布上层，标签用起终点中点坐标做绝对定位。线的颜色、文案由 edge.data 里的业务状态驱动。',
    flow: [
      'edge.type 设为自定义名 approval，data 放 { status: pass | reject } 等业务字段。',
      'path 的 d 交给 getBezierPath 计算，元素保持 fill="none" 并带上 vue-flow__edge-path 类以便接入官方样式。',
      'EdgeLabelRenderer 内用起终点中点坐标定位标签，class 由 data.status 切换，无需手动重绘。',
    ],
    notes: [
      'SVG 里承载不了交互型 HTML，复杂标签一律走 EdgeLabelRenderer。',
      '只改 edge.data 即可让线色与文案响应式更新，符合"改数据即改图"的范式。',
      '自定义连线元素要保留官方 class 与内联属性，否则选中高亮、拖拽连线等特性会失效。',
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
    summary: '用任务编排板演示 onConnect 查重后重建连线、Shift 空白框选多元素与键盘删除并清理悬空连线。',
    demo: VF08Demo,
    code: VF08Code,
    language: 'vue',
    principle:
      '连线松手触发 connect 事件（模板 @connect 或 useVueFlow().onConnect），业务通常在此先查重、补默认样式，再 addEdges。按住 selection-key-code（默认 Shift）拖空白区可框选多元素，选中态落在 node.selected / edge.selected；delete-key-code 配置删除键（默认 Backspace，本课加配 Delete 键）。删除节点前要先清掉与它相连的边，避免悬空连线。',
    flow: [
      'onConnect 里用 source+target+sourceHandle+targetHandle 四元组查重，命中则跳过并提示。',
      '用 computed 过滤 nodes/edges 里的 selected，得到选中集合驱动按钮计数与删除状态。',
      '批量删除时同删选中边、选中节点及选中节点的相邻边，保证图结构完整。',
    ],
    notes: [
      '选中时拖空白处是框选、拖节点本身是移动，二者由 selection-key-code 区分。',
      '业务删除建议走按钮+确认；键盘删除适合高频快捷清场。',
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
    summary: '在业务代码里用 useVueFlow 拿到画布实例，用 addNodes、updateNodeData、findNode、removeNodes、fitView 直接增删改查。',
    demo: VF09Demo,
    code: VF09Code,
    language: 'vue',
    principle:
      'useVueFlow() 返回当前画布的响应式实例：nodes/edges 是实时状态（运行态为 GraphNode/GraphEdge），addNodes/addEdges 增、removeNodes/removeEdges 删、updateNode 可改 position 等任意字段、updateNodeData 只合并 data、findNode/findEdge 查、fitView 收拢视口。初始数据用 :nodes/:edges 传入后，实例状态即接管，可在接口回调等任意位置直接用这些方法操作画布，不必再经模板事件转手。',
    flow: [
      '不传 v-model，初始 nodes/edges 用 props 传入，之后全走实例方法。',
      '节点/连线计数直接读实例的 flowNodes/flowEdges，天然响应式；findNode 返回带 selected 的 GraphNode，可置位完成选中。',
      '接口回调里 addNodes 加质检、updateNodeData 标记完成，再 await fitView({ padding, duration }) 带动画收拢。',
    ],
    notes: [
      'props 传入与 v-model 是两种托管模式：一个归实例、一个归外部数组，勿混用。',
      'updateNodeData 只浅合并 data，不触碰 position 等其他字段，适合纯业务状态更新。',
      '同页多画布时用 useVueFlow({ id }) 指定实例。',
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
    summary: '把物料从左侧面板拖进画布，用 screenToFlowCoordinate 把屏幕坐标换算成画布坐标后再 addNodes 落点。',
    demo: VF10Demo,
    code: VF10Code,
    language: 'vue',
    principle:
      '浏览器拖放给到的是屏幕坐标（clientX/clientY），而画布经缩放平移后坐标系已偏移。drop 处理里必须用 useVueFlow 的 screenToFlowCoordinate 把屏幕坐标换算为画布坐标，再 addNodes 放置，节点才会落在鼠标所指处。物料类型在 dragstart 时用 dataTransfer.setData 写入、drop 里 getData 读出；画布容器需对 dragover/dragenter preventDefault 才能触发 drop。',
    flow: [
      '物料 draggable=true，dragstart 把类型写入 dataTransfer，并置 effectAllowed="move"。',
      '画布容器监听 drop，preventDefault 后 getData 读类型，决定建 input/default/output 哪种节点。',
      'screenToFlowCoordinate({ x: clientX, y: clientY }) 换算坐标，addNodes 放置并在状态栏提示落点坐标。',
    ],
    notes: [
      '不做坐标换算，缩放后拖放的落点会明显偏离鼠标位置，这是最常见的坑。',
      '旧版用于坐标换算的 project() 已被 screenToFlowCoordinate 取代，勿再使用。',
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
    summary: '自实现分层布局：用 Kahn 算法按依赖分派层号、层内堆叠计算坐标，updateNode 写回后 fitView 收拢。',
    demo: VF11Demo,
    code: VF11Code,
    language: 'vue',
    principle:
      '自动布局 = 纯函数算坐标 + 写回节点。layoutByLayers 用 Kahn 分层：入度为 0 的节点放第一层，其余节点层号取"所有前置节点层最大值 + 1"（最长路径），环上节点统一沉底保证算法可终止；层内按数组出现顺序沿副轴堆叠，主轴由层号推进。算出的 position 用 updateNode 逐节点写回，最后 fitView 收拢视野。更复杂的图可换 dagre/elkjs，写回的数据流不变。',
    flow: [
      'assignLayers 按 source→target 建图统计入度，输出 id→层号映射。',
      '主轴坐标 = 层号 ×（节点尺寸+层间距），副轴 = 层内序号 ×（节点尺寸+节点间距）。',
      '遍历 nodes 用 updateNode(id, { position }) 写回，再 await fitView 带动画收拢。',
    ],
    notes: [
      '布局函数保持纯函数、返回 Map，方便单元测试与切换 dagre 等布局引擎。',
      '环是流程图常态，算法必须显式处理（沉底或忽略），否则会死循环。',
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
    summary: '用组织架构图演示只读/编辑开关组合，并通过变量映射与 data-theme 选择器让画布跟随站点深浅主题。',
    demo: VF12Demo,
    code: VF12Code,
    language: 'vue',
    principle:
      '展示型场景用交互开关收敛能力：nodes-draggable、nodes-connectable、edges-updatable、pane-movable 分别关掉拖拽、连线、改线与平移，一套代码在两个模式间切换。双主题两层下手：把官方 CSS 变量（--vf-node-bg、--vf-handle、--vf-edge 等）映射到站点变量，深色分支用 [data-theme="dark"] 选择器覆盖 controls 等硬编码颜色；属性层配色（如 Background 的 pattern-color）绑定 useTheme() 计算属性。Panel 是 core 自带组件，可往画布四角放浮层。',
    flow: [
      'nodes-draggable 等四个开关按 !readonly 绑定，只读/编辑一键切换。',
      'theme.css 里用变量映射改节点/连线/连接桩配色，深色分支用 [data-theme="dark"] 覆盖 controls 按钮。',
      'pattern-color 等属性配色绑定 isDark 计算属性，随站点主题即时换色。',
    ],
    notes: [
      '主题只改 <html data-theme> 即可，无需重建画布，全画布响应。',
      'SSR/静态预渲染下画布组件包在 ClientOnly 里，避免服务端渲染报错。',
      'Panel 适合放模式徽标、图例或操作区，用 position/PanelPosition 定位到四角。',
    ],
    problem: '解决"流程图在深色主题下刺眼、在展示页被误拖乱"的问题。',
    officialUrl: 'https://vueflow.dev/guide/theming.html',
  },
]
