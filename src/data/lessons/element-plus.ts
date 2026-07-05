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
      'ElButton 提供多种类型（primary/success/warning/danger/info）、尺寸（large/default/small）、状态（loading/disabled）和圆角变体。图标按钮通过 circle 属性快速创建。',
    flow: [
      '根据业务语义选择按钮类型，如重要操作用 primary，危险操作用 danger。',
      '根据界面密度选择尺寸，大尺寸用于主要入口，小尺寸用于紧凑布局。',
      '通过 icon 属性或 Icon 组件为按钮添加语义图标。',
    ],
    notes: [
      '按钮类型应符合操作语义，不要滥用 primary。',
      'loading 状态应同时禁用按钮，防止重复提交。',
      '图标按钮应添加 aria-label 提供无障碍支持。',
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
      'ElForm 通过 model 绑定数据，rules 定义校验规则，validate 方法执行校验。表单组件（ElInput、ElSelect 等）通过 v-model 直接关联到 form 对象的对应字段。还支持 validateField 局部校验和 scrollToField 滚动到错误字段。',
    flow: [
      '使用 reactive 定义表单数据对象，并用 rules 定义校验规则。',
      '表单组件通过 v-model 绑定到 form 对应字段，触发校验。',
      '点击提交时调用 validate，校验通过后再执行业务逻辑。',
    ],
    notes: [
      '前端校验用于即时反馈，真实提交仍必须依赖服务端校验。',
      '校验规则支持同步和异步自定义校验器。',
      'resetFields 会同时清空值和校验状态。',
      'validateField 可以只校验指定字段，适合分步表单或联动校验场景。',
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
      'ElTable 通过 data 属性传入数据数组，ElTableColumn 定义每列的渲染方式。template #default 可以自定义单元格内容，支持复杂数据和操作按钮。',
    flow: [
      '定义 columns 数组，指定每列的 prop、label 和宽度。',
      '通过 filter 方法根据搜索条件过滤数据。',
      '使用 template #default 自定义单元格渲染，如状态标签和操作按钮。',
    ],
    notes: [
      '表格列过多时应考虑固定列或横向滚动。',
      '金额、日期等格式化逻辑适合放在 computed 或工具函数中。',
      '大表格应配合分页或虚拟滚动使用。',
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
      'ElDialog 通过 v-model 控制显示状态，title 定义标题内容，default slot 放置对话框主体内容，footer slot 放置底栏按钮。',
    flow: [
      '用 ref 控制 dialogVisible 布尔值决定对话框是否显示。',
      '对话框内容通过默认 slot 传入，支持复杂布局。',
      '点击确认按钮执行业务逻辑，点击取消或关闭图标隐藏对话框。',
    ],
    notes: [
      '模态对话框会阻止用户与页面其他部分交互。',
      '对话框内容不宜过深，应保持层级扁平。',
      '移动端应考虑使用 bottom-sheet 替代居中对话框。',
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
      'ElMessage 用于轻量级操作反馈，支持 success/warning/error/info 四种类型。ElMessageBox 用于需要用户确认或输入的场景，返回 Promise 支持异步处理。',
    flow: [
      '调用 ElMessage.success/warning/error/info 显示对应类型的消息。',
      '使用 await ElMessageBox.confirm 等待用户确认。',
      '使用 await ElMessageBox.prompt 获取用户输入内容。',
    ],
    notes: [
      '消息提示自动关闭，无需手动清除。',
      '确认对话框适用于危险操作的二次确认。',
      '避免同时弹出多个消息提示。',
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
      'ElPopover 的触发方式由 trigger 属性控制（hover/click/focus/manual）。reference slot 放置触发源，默认 slot 放置气泡内容。',
    flow: [
      'hover 触发适合工具提示和快捷操作。',
      'click 触发适合需要展开详细操作的场景。',
      '气泡内容通过默认 slot 传入，支持复杂布局和交互。',
    ],
    notes: [
      '气泡卡片会被窗口边缘截断，Element Plus 会自动调整位置。',
      '嵌套内容时应避免气泡内再嵌套气泡。',
      'trigger=manual 需要手动控制显示状态。',
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
      'ElDropdown 通过 @command 事件处理菜单项点击，command 属性标识每个菜单项。dropdown slot 放置下拉菜单内容，reference slot 放置触发源。',
    flow: [
      '触发源可以是按钮或文字，点击后展开下拉菜单。',
      '点击菜单项时通过 command 参数区分不同操作。',
      '可以配合 split-button 实现下拉菜单与主按钮的组合。',
    ],
    notes: [
      '下拉菜单项过多时应考虑分组或搜索。',
      '禁用项使用 disabled 属性，防止误操作。',
      'divided 属性可以在菜单项之间加分隔线。',
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
      'ElTabs 通过 v-model 控制当前激活的标签页，每个 ElTabPane 定义一个标签页的内容。切换标签时只会渲染当前激活 pane 的内容。支持 before-leave 守卫拦截切换和 lazy 懒加载。',
    flow: [
      '使用 v-model 绑定当前激活的标签页名称。',
      '每个标签页内容放在对应的 ElTabPane 中。',
      '可以通过 @tab-click 监听标签切换事件。',
    ],
    notes: [
      '标签页数量应控制在 5-7 个以内。',
      '禁用标签页使用 disabled 属性。',
      'type=card 可以使用卡片样式的标签页。',
      'before-leave 守卫可以阻止不满足条件的切换，如未保存时提示用户。',
      'lazy 属性让标签页内容在首次激活时才渲染，减少初始加载开销。',
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
      'ElPagination 通过 v-model:current-page 和 v-model:page-size 双向绑定当前页码和每页条数。layout 属性控制显示哪些元素（total、sizes、prev、pager、next 等）。配合 computed 实现前端分页切片。',
    flow: [
      '用 computed 根据 currentPage 和 pageSize 对数据切片。',
      'ElPagination 的 current-change 和 size-change 事件更新分页状态。',
      '切换每页条数时重置到第一页，避免空页。',
    ],
    notes: [
      '前端分页适合数据量小的场景，大数据量应使用服务端分页。',
      'layout 属性灵活组合，按需显示 total、sizes、jumper 等元素。',
      '切换 pageSize 时务必重置 currentPage 为 1。',
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
      'ElUpload 支持 click 和 drag 两种上传方式。before-upload 钩子在文件上传前校验类型和大小，返回 false 阻止上传。limit 和 on-exceed 配合控制最大文件数。auto-upload 控制是否自动上传。',
    flow: [
      '用户选择或拖拽文件到上传区域。',
      'before-upload 校验文件类型和大小，不满足则阻止上传。',
      '超出 limit 限制时 on-exceed 回调提示用户。',
      'auto-upload=false 时需手动调用 submit 触发上传。',
    ],
    notes: [
      'before-upload 返回 false 可阻止上传，返回 Promise 支持异步校验。',
      '生产环境应配合后端返回文件 URL，前端只负责选择和展示。',
      '大文件上传建议使用分片上传，避免超时。',
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
      'ElCascader 通过 options 属性接收树形数据，每级包含 value、label 和 children。v-model 绑定值为各级 value 组成的路径数组。expandTrigger 控制子级展开方式（click/hover）。',
    flow: [
      '定义树形 options 数据，每级有 value、label 和 children。',
      'v-model 绑定选中路径数组，如 ["frontend", "vue", "vue3-basics"]。',
      '选择完成后显示完整路径，可通过 props.emitPath=false 只获取最后一级值。',
    ],
    notes: [
      '数据量大时考虑异步加载（props.lazy + props.lazyLoad）。',
      'emitPath=false 时 v-model 只绑定最后一级的 value。',
      '可配合 filterable 属性支持搜索过滤。',
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
      'ElTooltip 在鼠标悬停或点击时显示提示信息。placement 控制弹出方向，trigger 控制触发方式（hover/click）。content 属性用于简单文本，#content 插槽支持富内容（多行、链接等）。',
    flow: [
      '用 placement 属性设置提示方向（top/bottom/left/right）。',
      'trigger="click" 改为点击触发，适合需要用户主动查看的场景。',
      '#content 插槽放置多行或结构化内容。',
    ],
    notes: [
      'Tooltip 内容应简洁，复杂信息建议用 Popover。',
      'hide-after 控制自动隐藏延迟，设为 0 不自动隐藏。',
      'Tooltip 不会阻塞页面交互，适合辅助说明。',
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
      'ElDatePicker 通过 type 切换日期、月份和范围模式。daterange 模式的 v-model 保存开始与结束日期，shortcuts 提供常用周期，disabled-date 控制不可选日期，value-format 决定绑定值格式。',
    flow: [
      '使用 type="daterange" 让用户一次选择开始和结束日期。',
      '通过 shortcuts 配置最近 7 天、最近 30 天等常用范围。',
      'disabled-date 禁止选择未来日期，避免产生无效报表条件。',
      '根据选中范围计算统计天数并展示筛选摘要。',
    ],
    notes: [
      'value-format 会改变 v-model 的值类型，TypeScript 类型应与配置保持一致。',
      '服务端通常需要明确时区和当天起止时间，不能只传界面显示字符串。',
      '移动端日期范围组件较宽，应保证容器允许组件自适应。',
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
      'ElTree 使用树形 data 渲染层级数据，node-key 为节点提供稳定身份。show-checkbox 开启多选，filter-node-method 实现搜索过滤，组件实例提供 getCheckedKeys、setCheckedKeys 等命令式方法。',
    flow: [
      '把菜单和操作权限整理为带 children 的树形结构。',
      '通过 node-key 与 default-checked-keys 恢复已有角色权限。',
      '输入关键词时调用 filter，只保留匹配节点及其关联路径。',
      '保存时通过 getCheckedKeys 获取叶子权限编号。',
    ],
    notes: [
      '权限树应区分父节点和叶子操作，后端保存格式需要双方约定。',
      '数据量较大时可以使用 lazy 与 load 按需加载子节点。',
      '通过 ref 调用实例方法前，需要确认组件已经挂载。',
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
      'ElDrawer 从视口边缘展开，适合在保留当前列表上下文时查看详情或完成轻量编辑。v-model 控制显示，size 控制宽度，direction 控制方向，destroy-on-close 可以在关闭后销毁内部内容。',
    flow: [
      '用户在课程列表中点击查看详情，打开右侧抽屉。',
      '抽屉内展示课程信息并允许编辑运营备注。',
      '保存时进入 loading 状态，完成后关闭抽屉并反馈结果。',
      'destroy-on-close 在关闭后清理复杂表单和临时组件状态。',
    ],
    notes: [
      '抽屉适合轻量编辑，复杂多步骤任务仍应使用独立页面。',
      '关闭前有未保存内容时，应使用 before-close 提示用户确认。',
      '移动端应使用百分比尺寸，避免固定宽度超出视口。',
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
      'ElSteps 通过 active 指定当前进度索引，每个 ElStep 描述一个阶段。finish-status 控制已完成步骤的状态，process-status 控制当前步骤状态，align-center 和 direction 调整布局。',
    flow: [
      '把报名业务拆分为提交、审核、确认和开课四个稳定阶段。',
      'activeStep 与后端流程状态映射，驱动步骤条高亮。',
      '流程推进时更新 active，已完成步骤自动显示成功状态。',
      '流程结束后禁用继续按钮，也可以重置演示状态。',
    ],
    notes: [
      '步骤条用于展示有限且稳定的阶段，不适合表达复杂分支流程。',
      'active 是从 0 开始的索引，完成全部步骤时通常设为步骤数量。',
      '小屏幕下长标题应缩短，必要时改用 vertical 垂直布局。',
    ],
    problem: '解决"报名、审批、订单等多阶段流程如何清晰展示当前进度"的问题。',
  },
{
    id: 'E_17', title: '穿梭框：Transfer 数据分配', navTitle: '穿梭框', category: '数据组件',
    path: '/element-plus/e-17/transfer', summary: '用课程分类分配展示 ElTransfer 的筛选、移动和自定义渲染。',
    demo: E17Transfer, code: E17Code, language: 'vue',
    principle: 'ElTransfer 提供双列表穿梭选择，支持搜索过滤、左右移动、左右标题与自定义渲染；底层用 key-value 模型跟踪选中状态，适合"已分配 / 可分配""参与 / 候选"这类需要在两个集合之间移动条目的场景。',
    flow: ['准备带唯一 key 与可读 label 的数据源。', '配置 filterable、titles、format 与左右移动行为。', '通过 v-model 绑定右侧目标集合，自定义渲染插槽控制行内容。'],
    notes: ['数据项的 key 必须唯一且稳定，否则穿梭状态会出现错位。', '大数据量时用 filter-method 做受控过滤，注意分页或虚拟滚动。', '穿梭事件（change/left-check-change/right-check-change）可用于联动外部状态。'],
    problem: '解决"如何在两个集合之间直观地筛选、移动和确认数据项"的问题。',
  },
{
    id: 'E_18', title: '结果页：Result 操作反馈', navTitle: '结果页', category: '反馈组件',
    path: '/element-plus/e-18/result', summary: '用课程提交结果展示 ElResult 的成功、警告、错误和信息状态。',
    demo: E18Result, code: E18Code, language: 'vue',
    principle: 'ElResult 提供标准化的操作结果反馈页面，内置 success/warning/error/info 四种状态，支持自定义标题、描述和操作按钮。',
    flow: ['根据操作结果选择对应状态类型。', '设置标题和描述说明。', '在 extra 插槽中放置操作按钮。'],
    notes: ['结果页适合操作完成后的整页反馈。', '轻量反馈优先使用 ElMessage 或 ElMessageBox。'],
    problem: '解决"表单提交或操作完成后如何给出标准化反馈页面"的问题。',
  },
{
    id: 'E_19', title: '进度条：Progress 学习进度', navTitle: '进度条', category: '数据组件',
    path: '/element-plus/e-19/progress', summary: '用课程学习进度展示 ElProgress 的线形、环形和仪表盘模式。',
    demo: E19Progress, code: E19Code, language: 'vue',
    principle: 'ElProgress 用 percentage 控制进度，type 切换线形/环形/仪表盘，color 支持函数与数组形式的分段着色，stroke-width 与 width 调整外观；除展示完成度外，还能用于"状态指示"（如告警高亮）等需要强可视反馈的场景。',
    flow: ['根据业务数据计算 0-100 的百分比。', '选择展示类型、宽度与分段颜色方案。', '监听数据变化动态更新进度并处理完成/异常态。'],
    notes: ['环形进度条的 width 控制整体尺寸，不要与 stroke-width 混淆。', '多色分段可传 color={colors: [...]} 或 color 函数按值返回颜色。', '进度到达 100% 时考虑给用户下一步引导而不是静默结束。'],
    problem: '解决"如何直观展示任务完成度、操作进度或多档位状态"的问题。',
  },
{
    id: 'E_20', title: '骨架屏：Skeleton 加载占位', navTitle: '骨架屏', category: '反馈组件',
    path: '/element-plus/e-20/skeleton', summary: '用课程卡片加载态展示 ElSkeleton 的基础占位和自定义模板。',
    demo: E20Skeleton, code: E20Code, language: 'vue',
    principle: 'ElSkeleton 在数据加载期间展示占位内容，减少白屏感；loading 控制显隐，animated 添加闪光动画，template 插槽支持自定义占位结构。',
    flow: ['数据加载中显示骨架屏。', '通过 loading 属性切换骨架和内容。', '用 template 插槽定制占位结构。'],
    notes: ['骨架屏形状应尽量贴近真实内容布局。', '避免对所有组件都使用骨架屏，简单加载态可用 v-loading。'],
    problem: '解决"数据加载期间如何减少白屏感并提供更好的加载体验"的问题。',
  }
]
