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

const E01Button = createDemo('E01Button')
const E01Code = createCodeLoader('E01Button.vue')
const E02Form = createDemo('E02Form')
const E02Code = createCodeLoader('E02Form.vue')
const E03Table = createDemo('E03Table')
const E03Code = createCodeLoader('E03Table.vue')
const E04Dialog = createDemo('E04Dialog')
const E04Code = createCodeLoader('E04Dialog.vue')
const E05Message = createDemo('E05Message')
const E05Code = createCodeLoader('E05Message.vue')
const E06Popover = createDemo('E06Popover')
const E06Code = createCodeLoader('E06Popover.vue')
const E07Dropdown = createDemo('E07Dropdown')
const E07Code = createCodeLoader('E07Dropdown.vue')
const E08Tabs = createDemo('E08Tabs')
const E08Code = createCodeLoader('E08Tabs.vue')
const E09Pagination = createDemo('E09Pagination')
const E09Code = createCodeLoader('E09Pagination.vue')
const E10Upload = createDemo('E10Upload')
const E10Code = createCodeLoader('E10Upload.vue')
const E11Cascader = createDemo('E11Cascader')
const E11Code = createCodeLoader('E11Cascader.vue')
const E12Tooltip = createDemo('E12Tooltip')
const E12Code = createCodeLoader('E12Tooltip.vue')
const E13DatePicker = createDemo('E13DatePicker')
const E13Code = createCodeLoader('E13DatePicker.vue')
const E14Tree = createDemo('E14Tree')
const E14Code = createCodeLoader('E14Tree.vue')
const E15Drawer = createDemo('E15Drawer')
const E15Code = createCodeLoader('E15Drawer.vue')
const E16Steps = createDemo('E16Steps')
const E16Code = createCodeLoader('E16Steps.vue')
const E17Transfer = createDemo('E17Transfer')
const E17Code = createCodeLoader('E17Transfer.vue')
const E18Result = createDemo('E18Result')
const E18Code = createCodeLoader('E18Result.vue')
const E19Progress = createDemo('E19Progress')
const E19Code = createCodeLoader('E19Progress.vue')
const E20Skeleton = createDemo('E20Skeleton')
const E20Code = createCodeLoader('E20Skeleton.vue')


export const lessons: Lesson[] = [
{
    id: 'E_1',
    title: '按钮：类型、尺寸、状态与图标',
    navTitle: '按钮',
    category: '基础组件',
    path: '/element-plus/e-1/button',
    summary: '用课程操作按钮展示 ElButton 的类型、尺寸、状态和图标组合用法。',
    demo: E01Button,
    code: E01Code,
    language: 'vue',
    principle:
      'ElButton 通过 type 切换 primary/success/warning/danger/info 五种语义类型；plain 生成朴素（描边）按钮，round 与 circle 分别生成圆角按钮和圆形图标按钮，size 提供 large/default/small 三档。:loading 显示加载图标并进入加载态，:icon 直接挂图标组件，ElButtonGroup 把多个按钮合并为成组布局。',
    flow: [
      '根据操作语义选 type：重要操作用 primary，删除/危险操作用 danger，普通操作用默认。',
      '局部弱化用 plain 或小尺寸，纯图标场景用 circle，按钮间有主从关系用 ElButtonGroup 成组。',
      '通过 :icon 属性或 ElIcon 插槽给按钮配图标，加载态用 :loading 绑定 true 并给出文字提示。',
    ],
    notes: [
      '按钮类型要符合操作语义，避免整页都是 primary。',
      'loading 进入加载态后应同时阻止重复点击，防止重复提交。',
      '纯图标按钮（circle）依赖图标传达语义，需配 aria-label 提供无障碍说明。',
      '成组按钮由 ElButtonGroup 负责相邻边框合并，单独加边框会叠线。',
    ],
    problem: '解决"不同场景下按钮应该如何选择类型和尺寸"的问题。',
  },
{
    id: 'E_2',
    title: '表单：数据绑定、校验与提交',
    navTitle: '表单',
    category: '表单组件',
    path: '/element-plus/e-2/form',
    summary: '用用户注册表单展示 ElForm 的双向绑定、规则校验和提交处理。',
    demo: E02Form,
    code: E02Code,
    language: 'vue',
    principle:
      'ElForm 通过 :model 提供数据对象，rules 定义校验规则，每条 ElFormItem 用 prop 关联 model 中的字段，表单控件再通过 v-model 绑定到对应字段。通过 ref 拿到 FormInstance 后可调用 validate 整体校验、validateField 局部校验、resetFields 重置为初始值；rules 支持 required、min/max、email 等内置规则和 validator 自定义校验函数。',
    flow: [
      '用 reactive 定义 form 数据对象，并为需要校验的字段编写 rules。',
      'ElInput、ElSelect、ElCheckbox、ElDatePicker 等控件通过 v-model 绑定到 form 对应字段。',
      '点击提交时调用 formRef.validate，通过后再执行业务提交并给出成功提示。',
    ],
    notes: [
      '前端校验只用于即时反馈，真实提交仍必须依赖服务端校验。',
      'trigger 决定校验时机：输入类控件用 blur，选择类控件用 change。',
      '自定义 validator 中 callback() 表示通过，callback(new Error(...)) 携带错误信息，避免漏掉失败分支。',
      'resetFields 会同时清空值并恢复初始校验状态，适合"重置表单"按钮。',
    ],
    problem: '解决"表单如何进行数据绑定、规则校验、错误提示和提交处理"的问题。',
  },
{
    id: 'E_3',
    title: '表格：数据渲染、分页与筛选',
    navTitle: '表格',
    category: '数据展示',
    path: '/element-plus/e-3/table',
    summary: '用课程列表展示 ElTable 的列定义、数据绑定、筛选和自定义渲染。',
    demo: E03Table,
    code: E03Code,
    language: 'vue',
    principle:
      'ElTable 通过 :data 传入数组渲染表格，ElTableColumn 用 prop 绑定字段、label 定义表头。单元格默认直接输出字段原文；需要格式化或加控件时用 #default 作用域插槽解构 row 自定义渲染。stripe 开启斑马纹，row-key 提供稳定行标识。',
    flow: [
      '准备表格数据数组，逐列声明 ElTableColumn 的 prop 与 label。',
      '对价格、状态等字段用 template #default="{ row }" 自定义渲染，如拼货币符号或 ElTag 状态标签。',
      '搜索框通过 @input 触发过滤逻辑，把结果更新到 :data 绑定的数组。',
    ],
    notes: [
      '自定义单元格里要访问当前行数据时，务必从作用域插槽解构 row。',
      '金额、状态映射等格式化逻辑抽成纯函数或 computed，保持模板简洁、便于复用与测试。',
      '列多时可固定列宽，长文本列用 min-width 自适应；数据量大时配合分页或虚拟滚动。',
    ],
    problem: '解决"如何用 ElTable 渲染、过滤、分页和操作结构化数据"的问题。',
  },
{
    id: 'E_4',
    title: '对话框：模态与非模态',
    navTitle: '对话框',
    category: '反馈组件',
    path: '/element-plus/e-4/dialog',
    summary: '用课程创建弹窗展示 ElDialog 的显示控制、标题定制和表单集成。',
    demo: E04Dialog,
    code: E04Code,
    language: 'vue',
    principle:
      'ElDialog 通过 v-model 控制显示状态，title 设置标题、width 设置宽度。默认插槽放主体内容，footer 插槽放底栏按钮；show-close 控制右上角关闭按钮是否显示。关闭图标或取消按钮都会把 v-model 更新为 false。',
    flow: [
      '用 ref 保存布尔值控制开关，点击打开按钮把值置为 true。',
      '把表单或提示内容放入默认插槽，底栏操作按钮放入 footer 插槽。',
      '确认按钮先校验、执行业务逻辑再关闭；取消直接置 v-model 为 false 关闭。',
    ],
    notes: [
      '模态对话框会阻止与背景内容交互，适合强打断的确认或录入场景。',
      '弹窗内容层级应保持扁平，避免过深嵌套。',
      'show-close=false 隐藏关闭图标后，必须提供明确的取消按钮作为出口。',
    ],
    problem: '解决"需要用户确认或输入时如何展示对话框"的问题。',
  },
{
    id: 'E_5',
    title: '消息提示：ElMessage 与 ElMessageBox',
    navTitle: '消息提示',
    category: '反馈组件',
    path: '/element-plus/e-5/message',
    summary: '用操作反馈展示 ElMessage 的四种类型和 ElMessageBox 的确认与输入对话框。',
    demo: E05Message,
    code: E05Code,
    language: 'vue',
    principle:
      'ElMessage 用于轻量级操作反馈，提供 success/warning/error/info 四种类型，调用后自动出现并自动消失。ElMessageBox 处理需要二次确认或用户输入的场景，confirm 和 prompt 都返回 Promise（prompt 的 resolve 值里带 value），可配合 await 与 try/catch 处理确认/取消分支。',
    flow: [
      '按结果类型调用 ElMessage.success/warning/error/info 显示轻量提示。',
      '用 await ElMessageBox.confirm 等待用户确认，并配置 confirm/cancel 按钮文案。',
      '用 await ElMessageBox.prompt 获取用户输入，resolve 的 value 即输入内容，取消会 reject。',
    ],
    notes: [
      'ElMessage、ElMessageBox 是命令式 API，无需在模板中声明，直接在脚本里调用。',
      'confirm/prompt 返回 Promise，取消（reject）分支务必用 catch 或 try/catch 处理，避免未捕获拒绝。',
      '危险操作二次确认时用 type: warning，并给出清晰的操作后果文案。',
    ],
    problem: '解决"操作完成后如何即时反馈，以及危险操作如何二次确认"的问题。',
  },
{
    id: 'E_6',
    title: '气泡卡片：悬浮触发与嵌套内容',
    navTitle: '气泡卡片',
    category: '展示组件',
    path: '/element-plus/e-6/popover',
    summary: '用快捷操作和课程列表展示 ElPopover 的触发方式和嵌套内容。',
    demo: E06Popover,
    code: E06Code,
    language: 'vue',
    principle:
      'ElPopover 通过 trigger 控制触发方式（hover/click/focus/manual），#reference 插槽放置触发源，默认插槽（content）放置气泡内容。width 设置气泡宽度，placement 控制弹出方向，title 显示顶部标题。',
    flow: [
      'hover 触发适合轻量提示，click 适合展开操作列表，focus 适合输入框旁的说明。',
      '通过 #reference 放触发元素，默认插槽放气泡内可交互内容。',
      '点击型气泡里的操作按钮处理完业务后关闭气泡，避免残留打开状态。',
    ],
    notes: [
      'focus 触发一般配合输入框使用，聚焦即展开、失焦自动收起。',
      '嵌套内容时避免气泡内再嵌套气泡，层级复杂应改用独立页面。',
      '触发方式不同会导致开合时机不同，联动显示状态用 trigger=manual 手动受控。',
    ],
    problem: '解决"悬浮或点击时如何展示辅助信息和快捷操作"的问题。',
  },
{
    id: 'E_7',
    title: '下拉菜单：Dropdown 与命令处理',
    navTitle: '下拉菜单',
    category: '导航组件',
    path: '/element-plus/e-7/dropdown',
    summary: '用操作菜单和课程切换展示 ElDropdown 的菜单项和命令处理。',
    demo: E07Dropdown,
    code: E07Code,
    language: 'vue',
    principle:
      'ElDropdown 通过 #dropdown 插槽放 ElDropdownMenu，菜单项 ElDropdownItem 用 command 标识操作、disabled 禁用、divided 加分隔线。点选菜单项触发 @command 事件，回调参数就是所选 command。split-button 把触发钮拆成主按钮和右侧下拉箭头。',
    flow: [
      '触发源（按钮或文字）放 reference 区，点击后展开下拉菜单。',
      '为每个 ElDropdownItem 定义唯一 command，在 @command 里统一分发处理。',
      '需要主操作加附加菜单时用 split-button：主按钮触发 @click，箭头展开走 @command。',
      '切换选中项场景下，用动态 disabled 标记当前选中项。',
    ],
    notes: [
      'ElDropdownItem 的 command 通过 @command 回调参数区分不同操作。',
      'divided 可在相邻菜单项之间加分隔线，disabled 禁用项能防止误操作。',
      'split-button 的主按钮与下拉分支事件不同，需分别绑定 @click 和 @command。',
    ],
    problem: '解决"如何组织多个操作命令并响应用户选择"的问题。',
  },
{
    id: 'E_8',
    title: '标签页：选项切换与内容隔离',
    navTitle: '标签页',
    category: '导航组件',
    path: '/element-plus/e-8/tabs',
    summary: '用学习面板展示 ElTabs 的标签切换和内容隔离。',
    demo: E08Tabs,
    code: E08Code,
    language: 'vue',
    principle:
      'ElTabs 通过 v-model 绑定当前激活 pane 的 name，每个 ElTabPane 用 label 设置标签文本、name 标识身份。切换标签时触发 @tab-click。disabled=true 的 pane 不可点击，type="card" 切换为卡片样式。',
    flow: [
      '用 v-model 绑定当前激活标签页的 name。',
      '把每个面板内容放在对应 ElTabPane 内，并设置 label 与 name。',
      '用 @tab-click 监听切换事件，可按需统计或联动其他状态。',
      '不可切换的页签加 disabled，顶部导航风格可用 type="card"。',
    ],
    notes: [
      '切换时只渲染当前激活 pane 的内容，各 pane 之间应保持独立、互不依赖。',
      '禁用页签用 disabled 标注，避免点到空内容占位页。',
      'type="card" 使用卡片样式，适合作为顶部导航分组。',
      '需要拦截切换（如未保存提示）时，可用 before-leave 守卫阻止不满足条件的切换。',
    ],
    problem: '解决"如何在同一位置展示多个面板并让用户切换"的问题。',
  },
{
    id: 'E_9',
    title: '分页：Pagination 与表格配合',
    navTitle: '分页',
    category: '数据展示',
    path: '/element-plus/e-9/pagination',
    summary: '用课程列表展示 ElPagination 的页码切换、每页条数和总数显示。',
    demo: E09Pagination,
    code: E09Code,
    language: 'vue',
    principle:
      'ElPagination 通过 v-model:current-page 和 v-model:page-size 双向绑定当前页码与每页条数，total 提供总条数，layout 按顺序组合 total/sizes/prev/pager/next/jumper 等区块，page-sizes 提供每页条数的候选值。数据侧用 computed 按 (currentPage-1)*pageSize 切片即可实现前端分页。',
    flow: [
      '用 computed 以 (currentPage - 1) * pageSize 为起点对数据切片。',
      '页码或每页条数变化时由 v-model 自动更新，也可监听 @current-change、@size-change。',
      '切换每页条数后把 currentPage 重置为 1，避免当前页越界成空页。',
    ],
    notes: [
      'layout 的书写顺序决定分页条从左到右的区块排布，按需组合避免过宽。',
      '前端分页适合中小数据量；数据量大时应改为服务端分页。',
      'page-sizes 提供可选的每页条数项，切换时记得联动重置页码。',
    ],
    problem: '解决"数据量较多时如何分页展示，避免页面过长"的问题。',
  },
{
    id: 'E_10',
    title: '文件上传：Upload 拖拽与校验',
    navTitle: '文件上传',
    category: '表单组件',
    path: '/element-plus/e-10/upload',
    summary: '用课程资料上传展示 ElUpload 的拖拽上传、文件校验和数量限制。',
    demo: E10Upload,
    code: E10Code,
    language: 'vue',
    principle:
      'ElUpload 支持点击选择与 drag 拖拽两种方式，auto-upload=false 时不自动发请求，文件先进入 file-list 待业务手动 submit()。before-upload 在每个文件真正上传前执行，可校验类型/大小，返回 false 或拒绝的 Promise 即阻止该文件；limit 限制最大数量，超出时触发 on-exceed。v-model:file-list 双向管理已选文件列表，on-remove 处理移除。',
    flow: [
      '用户点击或拖拽文件进入上传区域，accept 限定可选类型。',
      'before-upload 校验文件类型和大小，不满足则返回 false 阻止上传。',
      '超过 limit 上限时 on-exceed 提示用户最大可传数量。',
      'auto-upload=false 场景下，业务侧调用 submit() 手动触发真正上传。',
    ],
    notes: [
      'before-upload 返回 false 立即阻止，返回 reject 的 Promise 可做异步校验，返回 true 放行。',
      'auto-upload=false 只是暂不上传，文件已进入列表，最终仍需显式发起上传。',
      'on-remove 移除列表项时，可在此同步清理对应的文件记录。',
    ],
    problem: '解决"用户如何上传文件，并在上传前校验类型和大小"的问题。',
  },
{
    id: 'E_11',
    title: '级联选择：Cascader 多级联动',
    navTitle: '级联选择',
    category: '表单组件',
    path: '/element-plus/e-11/cascader',
    summary: '用课程分类选择展示 ElCascader 的多级联动和路径显示。',
    demo: E11Cascader,
    code: E11Code,
    language: 'vue',
    principle:
      'ElCascader 通过 options 接收多级树形数据，每级包含 value、label 和 children。v-model 绑定的是各级 value 组成的路径数组；props.expandTrigger 控制点击或 hover 展开子级，clearable 一键清空。',
    flow: [
      '把分类组织为 value/label/children 的多级树。',
      '用 v-model 绑定路径数组，选中后在界面上显示完整路径。',
      '只需末级时把 props.emitPath 设为 false，v-model 只保留最后一级的值。',
    ],
    notes: [
      '树形数据每一级的 value 都必须唯一，否则无法正确回显选中路径。',
      '数据量很大时可配合 props.lazy 与 lazyLoad 异步按需加载子级。',
      '开启 filterable 可按 label 搜索过滤，方便快速定位选项。',
    ],
    problem: '解决"多级分类数据如何逐级选择并显示完整路径"的问题。',
  },
{
    id: 'E_12',
    title: '工具提示：Tooltip 方向与触发',
    navTitle: '工具提示',
    category: '展示组件',
    path: '/element-plus/e-12/tooltip',
    summary: '用课程信息提示展示 ElTooltip 的方向、触发方式和富内容插槽。',
    demo: E12Tooltip,
    code: E12Code,
    language: 'vue',
    principle:
      'ElTooltip 在触发源悬浮或点击时显示提示。placement 控制弹出方向（top/bottom/left/right），trigger 选择触发方式（hover/click）。纯文本用 content 属性提供，#content 插槽支持多行、列表等结构化富内容。',
    flow: [
      '用 placement 设置提示方向，辅助说明默认使用 hover 触发。',
      '需要用户主动查看时改用 trigger="click"。',
      '简单文案用 content，多行/结构化内容用 #content 插槽。',
    ],
    notes: [
      '纯文本走 content，需要多行或富内容时应改用 #content 插槽。',
      'Tooltip 适合承载短文案，内容多或需交互时改用气泡卡片式弹层。',
      '可用 show-after/hide-after 微调显隐延迟，避免快速划过时频繁闪烁。',
    ],
    problem: '解决"如何为图标或陌生文案提供不打断阅读的辅助说明"的问题。',
  },
{
    id: 'E_13',
    title: '日期选择：DatePicker 范围与快捷选项',
    navTitle: '日期选择',
    category: '表单组件',
    path: '/element-plus/e-13/date-picker',
    summary: '用运营报表筛选演示 ElDatePicker 的日期范围、快捷周期、格式化和禁用日期。',
    demo: E13DatePicker,
    code: E13Code,
    language: 'vue',
    principle:
      'ElDatePicker 的 type 决定选择模式，daterange 一次选择起始与结束日期，v-model 存一个数组。value-format 把绑定值格式化成字符串（如 YYYY-MM-DD），shortcuts 提供预设周期，disabled-date 接收 Date 并返回是否需要禁用，clearable 支持一键清空。',
    flow: [
      '用 type="daterange" 让用户一次选择开始和结束日期。',
      '用 shortcuts 预置最近 7 天、最近 30 天等常用范围，一键填充。',
      '用 disabled-date 禁用未来日期，防止产生无效的报表条件。',
      '依据选中的起止日期计算统计天数并展示筛选摘要。',
    ],
    notes: [
      'value-format 会改变 v-model 的值类型，用字符串还是 Date 要在类型声明中固定，避免后续混乱。',
      '日期范围统计通常包含首尾两天，算天数时需要按业务口径决定是否 +1。',
      '服务端落库应明确时区和当天起止时刻，不能只传界面显示字符串。',
    ],
    problem: '解决"报表和订单查询如何快速选择有效日期范围"的问题。',
  },
{
    id: 'E_14',
    title: '树形控件：Tree 勾选、过滤与节点操作',
    navTitle: '树形控件',
    category: '数据展示',
    path: '/element-plus/e-14/tree',
    summary: '用角色权限配置演示 ElTree 的复选框、节点过滤、默认展开和实例方法。',
    demo: E14Tree,
    code: E14Code,
    language: 'vue',
    principle:
      'ElTree 用 data 渲染树形数据，node-key 提供节点唯一标识。show-checkbox 开启复选框多选，filter-node-method 与实例的 filter 方法配合实现关键词过滤，default-checked-keys 指定初始勾选的节点。实例方法 getCheckedKeys 取勾选 key、setCheckedKeys 回填。',
    flow: [
      '把菜单和操作权限整理为带 children 的树形结构。',
      '配置 node-key 与 show-checkbox，用 default-checked-keys 恢复已有角色权限。',
      '输入关键词时调用 treeRef.filter 并配合 filter-node-method 过滤，只保留匹配节点及其关联路径。',
      '保存时用 getCheckedKeys 取出勾选的权限编号提交后端。',
    ],
    notes: [
      'getCheckedKeys(true) 只返回叶子节点，是否包含父节点要与后端约定一致。',
      '权限树应区分父节点和叶子操作，落库格式需前后端共同约定。',
      '数据量大时可用 lazy 与 load 按需加载子节点；调用实例方法前需确认组件已挂载（可 await nextTick）。',
    ],
    problem: '解决"菜单、组织架构和权限等层级数据如何选择与搜索"的问题。',
  },
{
    id: 'E_15',
    title: '抽屉：Drawer 侧边详情与编辑',
    navTitle: '抽屉',
    category: '反馈组件',
    path: '/element-plus/e-15/drawer',
    summary: '用课程详情编辑演示 ElDrawer 的显示控制、尺寸、销毁策略和表单操作。',
    demo: E15Drawer,
    code: E15Code,
    language: 'vue',
    principle:
      'ElDrawer 从视口边缘展开（默认右侧），适合在保留当前列表上下文时查看详情或做轻量编辑。v-model 控制开关，title 设标题，size 控制宽度（支持 min(420px, 90%) 这类 CSS 值），direction 控制展开方向，destroy-on-close 在关闭时销毁内部 DOM 与状态。',
    flow: [
      '用户点击"查看并编辑"打开右侧抽屉，保持列表滚动位置不变。',
      '抽屉内用 ElDescriptions 展示详情，用 ElInput 编辑运营备注。',
      '保存时进入 loading 态，完成后关闭抽屉并给出反馈。',
      '配置 destroy-on-close，关闭时清理复杂的临时编辑状态。',
    ],
    notes: [
      '抽屉适合轻量编辑，复杂多步骤任务仍应使用独立页面。',
      'size 用固定像素或 min()/百分比，移动端避免固定宽度超出视口。',
      '需要拦截关闭确认（如未保存）时，可用 before-close 提示用户。',
    ],
    problem: '解决"查看或编辑详情时如何保留用户当前列表位置和筛选上下文"的问题。',
  },
{
    id: 'E_16',
    title: '步骤条：Steps 流程状态与进度',
    navTitle: '步骤条',
    category: '导航组件',
    path: '/element-plus/e-16/steps',
    summary: '用训练营报名流程演示 ElSteps 的当前步骤、完成状态和流程重置。',
    demo: E16Steps,
    code: E16Code,
    language: 'vue',
    principle:
      'ElSteps 通过 active 指定当前进度索引（从 0 开始），每个 ElStep 描述一个阶段。finish-status 控制已完成步骤的标记（success），process-status 控制当前步骤状态，align-center 让步骤在容器内居中，direction 切换横向/垂直排布。',
    flow: [
      '把报名业务拆成提交报名、资料审核、确认名额、开始学习四个稳定阶段，用 v-for 渲染 ElStep。',
      '用 active 映射当前进度索引，驱动步骤条高亮。',
      '推进时 active + 1，到达步骤总数即视为流程完成，同时禁用继续按钮。',
      '提供"重新开始"按钮把 active 重置为 0，恢复初始状态。',
    ],
    notes: [
      'active 是 0 起的索引，完成全部步骤时通常把值设为步骤数量。',
      '步骤条适合表达有限且固定的阶段，复杂分支流程不适合硬塞。',
      '长标题在小屏下应缩短，必要时改用 vertical 垂直布局。',
    ],
    problem: '解决"报名、审批、订单等多阶段流程如何清晰展示当前进度"的问题。',
  },
{
    id: 'E_17', title: '穿梭框：Transfer 数据分配', navTitle: '穿梭框', category: '数据组件',
    path: '/element-plus/e-17/transfer', summary: '用课程分类分配展示 ElTransfer 的筛选、移动和自定义渲染。',
    demo: E17Transfer, code: E17Code, language: 'vue',
    principle: 'ElTransfer 提供左/右两栏穿梭选择，v-model 绑定已转移到右栏的数据 key 数组，data 提供全部条目（含 key、label、disabled）。filterable 开启搜索并结合 filter-method 自定义过滤逻辑，titles 设置两栏标题。底层用 key-value 模型跟踪选中状态。',
    flow: ['准备带唯一 key 与可读 label 的数据源，并用 v-model 绑定右栏目标集合。', '开启 filterable 并用 filter-method 按 label 过滤左侧候选项。', '配置 titles 说明两栏语义（可选课程 / 已选课程）。'],
    notes: ['数据项的 key 必须唯一且稳定，否则穿梭与回显会出现错位。', 'data 里的 disabled 可锁定不可移动的条目。', '穿梭相关事件（change 等）可用于联动外部状态；大数据量注意过滤性能。'],
    problem: '解决"如何在两个集合之间直观地筛选、移动和确认数据项"的问题。',
  },
{
    id: 'E_18', title: '结果页：Result 操作反馈', navTitle: '结果页', category: '反馈组件',
    path: '/element-plus/e-18/result', summary: '用课程提交结果展示 ElResult 的成功、警告、错误和信息状态。',
    demo: E18Result, code: E18Code, language: 'vue',
    principle: 'ElResult 提供标准化的操作结果反馈页面，icon 指定 success/warning/error/info 四种状态图形，title、sub-title 展示主次文案，extra 插槽放后续操作按钮。',
    flow: ['根据操作结果选择对应 icon 状态。', '用 title、sub-title 说明发生了什么。', '在 extra 插槽中放置"继续操作 / 查看详情"等按钮。'],
    notes: ['结果页适合表单提交或流程结束后的整页反馈。', '更轻量的成功/失败反馈优先用 ElMessage 或 ElMessageBox。', 'sub-title 文案宜给出下一步建议，而不仅是状态名称。'],
    problem: '解决"表单提交或操作完成后如何给出标准化反馈页面"的问题。',
  },
{
    id: 'E_19', title: '进度条：Progress 学习进度', navTitle: '进度条', category: '数据组件',
    path: '/element-plus/e-19/progress', summary: '用课程学习进度展示 ElProgress 的线形、环形和仪表盘模式。',
    demo: E19Progress, code: E19Code, language: 'vue',
    principle: 'ElProgress 用 percentage 控制进度数值，type 切换线形/环形/仪表盘，width 控制圆形与仪表盘的整体尺寸，stroke-width 控制进度条粗细，color 支持固定颜色、按百分比分段的对象数组或返回颜色的函数。',
    flow: ['根据业务数据把进度折算为 0-100 的百分比。', '选择展示类型与尺寸，需要分段时用 color 对象数组或函数按值取色。', '监听数据变化动态更新 percentage，并处理完成/异常态。'],
    notes: ['type=dashboard（仪表盘）时 width 控制整体画布尺寸，不要与 stroke-width 混淆。', 'color 可传分段数组 [{color, percentage}] 或函数按值返回颜色。', '进度到达 100% 时给用户下一步引导，而不是静默结束。'],
    problem: '解决"如何直观展示任务完成度、操作进度或多档位状态"的问题。',
  },
{
    id: 'E_20', title: '骨架屏：Skeleton 加载占位', navTitle: '骨架屏', category: '反馈组件',
    path: '/element-plus/e-20/skeleton', summary: '用课程卡片加载态展示 ElSkeleton 的基础占位和自定义模板。',
    demo: E20Skeleton, code: E20Code, language: 'vue',
    principle: 'ElSkeleton 在 loading 为 true 时渲染骨架占位，为 false 时渲染默认插槽的真实内容；animated 开启骨架闪烁动画，#template 插槽用 ElSkeletonItem 拼出贴近真实布局的占位元素（circle、h3、text 等 variant），count 控制骨架数量。',
    flow: ['数据加载前把 loading 置为 true，展示骨架屏。', '用 #template 布置 ElSkeletonItem 占位结构，形状对齐真实内容。', '数据就绪后置 loading=false，切到 #default 的真实内容。'],
    notes: ['骨架形状应尽量贴近最终内容，减少加载完成后的跳动感。', '简短的按钮/列表加载可直接用 v-loading，避免全局滥用骨架屏。', '切换 loading 时可配合过渡动画，让内容出现更平滑。'],
    problem: '解决"数据加载期间如何减少白屏感并提供更好的加载体验"的问题。',
  }
]
