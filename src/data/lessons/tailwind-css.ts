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

const TW01UtilityFirst = createDemo('TW01UtilityFirstArticle')
const TW01Code = createCodeLoader('style-code/TW01UtilityFirst.html')
const TW02Responsive = createDemo('TW02ResponsiveArticle')
const TW02Code = createCodeLoader('style-code/TW02Responsive.html')
const TW03StateVariants = createDemo('TW03StateVariantsArticle')
const TW03Code = createCodeLoader('style-code/TW03StateVariants.html')
const TW04DarkMode = createDemo('TW04DarkModeArticle')
const TW04Code = createCodeLoader('style-code/TW04DarkMode.html')
const TW05ThemeTokens = createDemo('TW05ThemeTokensArticle')
const TW05Code = createCodeLoader('style-code/TW05ThemeTokens.css.txt')
const TW06ArbitraryValues = createDemo('TW06ArbitraryValuesArticle')
const TW06Code = createCodeLoader('style-code/TW06ArbitraryValues.html')
const TW07Layout = createDemo('TW07LayoutArticle')
const TW07Code = createCodeLoader('style-code/TW07Layout.html')
const TW08ContainerQueries = createDemo('TW08ContainerQueriesArticle')
const TW08Code = createCodeLoader('style-code/TW08ContainerQueries.html')
const TW09Installation = createDemo('TW09InstallationArticle')
const TW09Code = createCodeLoader('style-code/TW09Installation.css.txt')
const TW10Typography = createDemo('TW10TypographyArticle')
const TW10Code = createCodeLoader('style-code/TW10Typography.html')
const TW11SizingSpacing = createDemo('TW11SizingSpacingArticle')
const TW11Code = createCodeLoader('style-code/TW11SizingSpacing.html')
const TW12BordersEffects = createDemo('TW12BordersEffectsArticle')
const TW12Code = createCodeLoader('style-code/TW12BordersEffects.html')
const TW13Motion = createDemo('TW13MotionArticle')
const TW13Code = createCodeLoader('style-code/TW13Motion.html')
const TW14Forms = createDemo('TW14FormsArticle')
const TW14Code = createCodeLoader('style-code/TW14Forms.html')
const TW15CustomUtilities = createDemo('TW15CustomUtilitiesArticle')
const TW15Code = createCodeLoader('style-code/TW15CustomUtilities.css.txt')
const TW16Production = createDemo('TW16ProductionArticle')
const TW16Code = createCodeLoader('style-code/TW16Production.css.txt')
const TW17GridLayout = createDemo('TW17GridLayoutArticle')
const TW18FlexGrid = createDemo('TW18FlexGridArticle')
const TW19Interactivity = createDemo('TW19InteractivityArticle')
const TW20Transform = createDemo('TW20TransformArticle')
const TW21Filters = createDemo('TW21FiltersArticle')
const TW22SvgIcons = createDemo('TW22SVGIconsArticle')
const TW23Plugins = createDemo('TW23PluginsArticle')
const TW24Preset = createDemo('TW24PresetArticle')


export const lessons: Lesson[] = [
{
    id: 'TW_01', title: '工具优先与原子类组合', navTitle: '工具优先', category: '核心理念',
    path: '/tailwind-css/tw-1/utility-first', summary: '用课程卡片理解工具类如何映射声明，以及何时抽取组件。',
    demo: TW01UtilityFirst, code: TW01Code, language: 'xml',
    principle: 'Tailwind 提供一组受设计令牌约束的单用途工具类，直接在标记中组合出界面：类名即声明，省去命名与样式文件间的跳转，也避免了无边界的手写 CSS。可复用性由组件边界承担——重复结构抽成组件、重复类串抽成自定义工具，而不是把长类名反复复制。',
    flow: ['把一个视觉块拆解为布局、间距、颜色、排版等维度。', '用单用途工具类逐层组合，先结构后视觉、先尺寸后装饰。', '同一组类在多处重复时抽成框架组件并暴露 Props，必要时再注册自定义工具类。', '用元素面板核对组合后的最终样式与预期一致。'],
    notes: ['不要仅为缩短 class 而滥用 @apply。', '样式共置不等于放弃组件抽象。', '工具类解决"约束与组合"，业务语义仍应由组件名与结构承担。', '类名顺序不影响样式结果，但按布局→间距→颜色统一排序可显著提升可读性。'],
    problem: '解决"手写 CSS 类名难以命名、样式与结构分离已久、风格容易失控"的问题。',
  },
{
    id: 'TW_02', title: '移动优先响应式设计', navTitle: '响应式断点', category: '响应与状态',
    path: '/tailwind-css/tw-2/responsive', summary: '从单列到多列课程网格，掌握无前缀规则与断点变体。',
    demo: TW02Responsive, code: TW02Code, language: 'xml',
    principle: '响应式变体以 min-width 媒体查询逐级增强：无前缀的工具作用于所有尺寸，sm、md、lg、xl 等前缀表示“该断点及以上生效”的覆盖，天然形成移动优先的层叠结构——先写好小屏基准，再逐级覆盖，而不是为每种设备单独写一套样式。新增断点前先确认内容真的开始拥挤，避免断点数量失控。',
    flow: ['先写出窄屏可用的基础布局，不加任何断点前缀。', '在内容开始拥挤的宽度增加断点前缀，只覆盖需要变化的工具类。', '逐级检查间距、字号与可点击尺寸在更大屏幕上的表现。', '拖动窗口宽度跨过断点，确认每一级布局按预期切换。'],
    notes: ['sm 表示小断点及以上，不是"仅手机"。', '断点应服务内容，不要为每个设备型号定制。', '前缀工具只做覆盖、不做重置：样式会从无前缀逐级叠加到当前断点。', '移动优先意味着先写小屏基准；若先写桌面端再覆盖小屏，维护成本更高。'],
    problem: '解决"同一张卡片如何在手机上单列、平板上双列、桌面上三列平滑过渡"的问题。',
  },
{
    id: 'TW_03', title: '状态、Group 与 Peer 变体', navTitle: '状态变体', category: '响应与状态',
    path: '/tailwind-css/tw-3/state-variants', summary: '处理 hover、focus-visible、disabled、父级和同级联动状态。',
    demo: TW03StateVariants, code: TW03Code, language: 'xml',
    principle: '变体把 hover、focus、active、disabled 等状态编码为前缀，编译时展开成对应的伪类选择器；group 读取祖先的标记状态向下传递，peer 依据前置兄弟的状态影响后续兄弟——规则能否命中完全取决于 DOM 结构关系。用变体前先理清目标元素与状态元素在 DOM 中的关系，能省去大量调试。',
    flow: ['先保证键盘可达：用 focus-visible 提供清晰焦点环。', '为禁用、选中、校验等状态补齐语义反馈。', '确有跨元素联动时才引入 group/peer，并控制嵌套层级。', '用键盘 Tab 走到每个控件，确认焦点环清晰可见且不被遮挡。'],
    notes: ['不能只依赖 hover 传达信息。', 'peer 只能匹配其后的同级元素，这是 CSS 后续兄弟选择器的限制。', '同页多组联动可用 group/name 与 peer/name 命名，避免互相干扰。', 'disabled 元素不触发 hover 等变体，禁用态需要单独写样式而非依赖旧状态。'],
    problem: '解决"交互状态样式重复书写、父子或兄弟元素联动效果难以直观表达"的问题。',
  },
{
    id: 'TW_04', title: '暗色模式与主题切换', navTitle: '暗色模式', category: '设计系统',
    path: '/tailwind-css/tw-4/dark-mode', summary: '为学习进度卡设计成对色彩，并处理系统主题与手动偏好。',
    demo: TW04DarkMode, code: TW04Code, language: 'xml',
    principle: 'dark 变体为暗色环境生成覆盖规则：v4 默认跟随 prefers-color-scheme 系统偏好，也可用 @custom-variant 把 dark 重新绑定到祖先类或 data-theme 属性，实现"跟随系统 + 手动切换并持久化"的完整方案。',
    flow: ['为背景、文字和边框按语义成对设计明暗两套颜色。', '决定跟随系统还是记住用户偏好，并用类或 data 属性标记当前主题。', '在首屏渲染前内联脚本应用主题标记，避免"闪白"。', '在元素面板确认 html 上的主题标记与样式选择器一致。'],
    notes: ['v4 里 dark 变体默认绑定 prefers-color-scheme；要按祖先类或 data 属性手动切换，需用 @custom-variant 重新定义 dark。', '两套主题都要单独验证文本、焦点环和禁用态的对比度，而不是简单反色。', '主题状态存在 localStorage 并打在 <html> 上，CSS 只需切换选择器，无需重建组件。', '系统偏好变化时要监听 matchMedia，跟随模式下及时同步主题。'],
    problem: '解决"如何让站点支持明暗两套主题、既跟随系统又可手动切换且不闪烁"的问题。',
  },
{
    id: 'TW_05', title: 'v4 主题变量与设计令牌', navTitle: '主题令牌', category: '设计系统',
    path: '/tailwind-css/tw-5/theme-tokens', summary: '用 @theme 定义品牌色、字体和圆角，并生成对应工具类。',
    demo: TW05ThemeTokens, code: TW05Code, language: 'css',
    principle: 'Tailwind v4 的 @theme 用带命名空间的 CSS 变量（--color-*、--font-*、--radius-*、--breakpoint-* 等）定义设计令牌：编译器据此生成对应工具类，令牌本身又保留为运行时变量，可被 var() 与 JavaScript 直接复用。',
    flow: ['从现有视觉规范中提取需要统一约束的语义令牌。', '按命名空间写入 @theme（颜色、字体、圆角、断点等）。', '用生成的工具类替换散落的魔法数值，删除重复定义。', '在产物里核对生成的工具类名与令牌命名一致。'],
    notes: ['令牌应代表稳定系统约束，而非包装每个魔法数。', '普通运行时变量不需要放进 @theme。', '新增令牌前先确认内置尺度是否够用，避免设计系统膨胀成毫无约束的数值清单。', '令牌命名用语义（如 color-brand）而非具体色值，方便整体调整品牌色。'],
    problem: '解决"品牌色、字体、圆角等规范如何变成可被工具类消费的统一令牌"的问题。',
  },
{
    id: 'TW_06', title: '任意值、任意属性与静态检测', navTitle: '任意值', category: '核心理念',
    path: '/tailwind-css/tw-6/arbitrary-values', summary: '处理精确网格、流体间距和 data 状态，同时理解类名扫描边界。',
    demo: TW06ArbitraryValues, code: TW06Code, language: 'xml',
    principle: '方括号语法（w-[327px]、[mask-type:luminance]、data-[state=open]:…）把一次性值、任意属性与自定义变体接入工具类体系；构建器把源码当纯文本扫描候选类，运行时才拼出的不完整类名不会被生成。任意值应集中评审：出现频次高的值，说明它值得提升为设计令牌。',
    flow: ['先确认该数值确实不属于既有设计令牌。', '以完整、静态可扫描的类名写入源码（含方括号与变体前缀）。', '某个任意值开始重复出现时，提升为 @theme 令牌或受控映射。', '在产物里确认方括号类名被原样生成，而非静默丢弃。'],
    notes: ['不要写 bg-${color}-600 这类碎片拼接。', '任意值过多通常意味着设计约束尚未收敛。', '任意值不是"万能逃生舱"，代码评审时应关注它的出现频率。', '动态拼接类名在扫描时不可见，应改为完整字符串或建立受控映射表。'],
    problem: '解决"如何表达特殊 CSS 约束，又不破坏构建期生成与设计一致性"的问题。',
  },
{
    id: 'TW_07', title: 'Flex、Grid 与现代布局', navTitle: 'Flex 与 Grid', category: '布局进阶',
    path: '/tailwind-css/tw-7/layout', summary: '用筛选侧栏和课程网格选择一维 Flex 与二维 Grid。',
    demo: TW07Layout, code: TW07Code, language: 'xml',
    principle: 'Flex 在一维主轴上分配与对齐子项（内容驱动尺寸），Grid 用行列轨道定义二维结构（布局驱动位置）；min-w-0 / minmax(0,1fr) 用于避免内容最小尺寸把弹性轨道撑破——这是长文本溢出的最常见原因。选择依据很清晰：内容决定排列用 Flex，位置由轨道决定用 Grid。',
    flow: ['先判断是一维流还是二维轨道，选择 Flex 或 Grid。', '建立尺寸、换行与溢出规则（min-w-0、overflow-*）。', '最后补响应式覆盖与视觉间距。', '在窄屏塞入超长单词，验证溢出行为符合预期且不撑破布局。'],
    notes: ['不要用大量 margin 模拟布局系统。', '遇到长文本时检查 min-w-0 与溢出策略。', 'Grid 负责页面与区块骨架、Flex 负责组件内部排列，二者嵌套是常态而非妥协。', 'flex-1 的简写依赖 min-width 默认值，对包含长内容的子项记得补 min-w-0。'],
    problem: '解决"复杂页面骨架该选择 Flex 还是 Grid，以及如何避免内容溢出"的问题。',
  },
{
    id: 'TW_08', title: '容器查询与可复用组件', navTitle: '容器查询', category: '布局进阶',
    path: '/tailwind-css/tw-8/container-queries', summary: '让同一课程卡根据所在容器宽度切换结构，而非依赖视口。',
    demo: TW08ContainerQueries, code: TW08Code, language: 'xml',
    principle: '@container 在父级建立查询上下文（container-type: inline-size），容器变体（@sm、@lg 或 @min-[400px]）依据"最近匹配容器"的宽度切换子元素工具类，让同一组件在侧栏、弹窗与主内容区都能按实际可用空间自适应。',
    flow: ['在承载组件的父级建立容器，必要时用 @container/name 命名。', '按内容临界点选择容器变体，而非照搬视口断点。', '嵌套多个容器时用命名容器消除匹配歧义。', '把组件放进不同宽度的侧栏，验证容器查询按实际空间响应。'],
    notes: ['容器查询补充而非取代视口媒体查询。', '查询容器必须满足相应 containment 条件。', '组件级响应式优先用容器变体，页面级整体布局仍由视口断点负责。', '容器查询的断点按内容临界点取值，不必与视口断点保持同一套数值。'],
    problem: '解决"可复用组件如何根据自身实际可用空间独立响应、而不依赖整页宽度"的问题。',
  },
{
    id: 'TW_09', title: 'v4 安装与构建工具集成', navTitle: '安装与集成', category: '工程集成',
    path: '/tailwind-css/tw-9/installation', summary: '比较 Vite、PostCSS 和 CLI 三种接入路径，建立最小 CSS 入口。',
    demo: TW09Installation, code: TW09Code, language: 'css',
    principle: 'Tailwind v4 由核心包与构建适配器协作：CSS 入口只需 @import "tailwindcss";，Vite 插件、PostCSS 插件或独立 CLI 负责扫描源码中的候选类并生成最终样式；CSS-first 配置下不再需要 tailwind.config.js。',
    flow: ['按现有构建链选择唯一的适配器（Vite 项目用 @tailwindcss/vite）。', '在全局 CSS 入口导入 Tailwind，并保持该入口唯一。', '验证开发热更新与生产构建都能正确扫描到模板源文件。', '在产物里确认样式只生成一份，没有重复编译的入口。'],
    notes: ['Vite 项目优先使用官方 Vite 插件。', '不要同时让多个适配器处理同一入口。', 'v4 默认自动检测项目源文件，非标准目录或外部包内容需用 @source 显式声明。', '升级到 v4 时先移除 PostCSS 插件链中的旧配置，避免两套机制同时生效。'],
    problem: '解决"Tailwind v4 应如何接入不同工程，并避免重复编译"的问题。',
  },
{
    id: 'TW_10', title: '排版层级、行高与可读行长', navTitle: '排版系统', category: '视觉基础',
    path: '/tailwind-css/tw-10/typography', summary: '用中文课程正文组合字号、行高、字重、字距和最大行长。',
    demo: TW10Typography, code: TW10Code, language: 'xml',
    principle: '排版由 font-size、line-height、font-weight、letter-spacing 与行长（max-w-*、ch 单位）共同决定层级；中文没有词间空格、字形更方正，正文字号与行高通常要比英文排版更宽松一些。层级之间保持可感知的差异，读者才能不费力地扫读结构。',
    flow: ['先定正文基准字号与行高。', '按信息层级定义标题尺度（字号、字重、行高逐级递减）。', '限制长文行宽（约 60-75ch）并分别检查中英文效果。', '在真实长文内容下对比两种字号的阅读节奏，再定正文基准。'],
    notes: ['中文正文通常需要更宽松行高。', '大标题也要测试窄屏换行与超长文本。', '字号与行高应成对定义（text-sm 配 leading-*），避免只改字号导致行距失衡。', '标题的行高比例要小于正文，否则大字号下的段落感会被拉散。'],
    problem: '解决"如何用工具类构建清晰、稳定且适合中文长文阅读的排版与行高体系"的问题。',
  },
{
    id: 'TW_11', title: '尺寸约束与间距比例尺', navTitle: '尺寸与间距', category: '视觉基础',
    path: '/tailwind-css/tw-11/sizing-spacing', summary: '区分 width、min/max、size、gap 与 space，并形成一致视觉节奏。',
    demo: TW11SizingSpacing, code: TW11Code, language: 'xml',
    principle: '尺寸工具描述固定、流体与边界约束（w、min-w-0、max-w-screen-md），间距工具按盒模型与布局两个维度区分：p/m 作用于盒模型内/外，gap 作用于 Flex/Grid 轨道，space-x/y 在相邻子元素之间插入等距边距；统一在设计尺度上取值，避免散落魔法数字。',
    flow: ['先决定容器是固定、流体还是受最大宽度约束。', '用设计尺度（4/8/12…）建立统一间距节奏。', '在长内容与窄屏下验证 min-w-0、overflow 等边界行为。', '用标尺核对两处间距是否都来自同一尺度，而非临时数值。'],
    notes: ['同级间距优先用 gap（作用于 Flex/Grid 轨道），比叠加相邻 margin 更不易出错。', 'min-w-0 常被忽略：不设置时默认 min-width 会让 Flex/Grid 子项按内容宽度冻结而溢出。', 'size-* 同时设置 width 与 height；max-w-* 限制整体最大宽度，min-h-* 保证最小可点击/视觉高度。', '负数与范围类（如 inset-x-0、top-1/2）也应优先从内置尺度取值。'],
    problem: '解决"页面尺寸与留白如何形成统一的尺度系统，而不是散落魔法数字"的问题。',
  },
{
    id: 'TW_12', title: '边框、轮廓、Ring 与阴影', navTitle: '边界与阴影', category: '视觉基础',
    path: '/tailwind-css/tw-12/borders-effects', summary: '为卡片层级和键盘焦点选择正确的视觉边界工具。',
    demo: TW12BordersEffects, code: TW12Code, language: 'xml',
    principle: 'border 参与盒模型、占据布局空间；outline 与 ring 绘制在元素外侧、不挤占布局，因此更适合键盘焦点；box-shadow 表达层级深度，可叠加并用透明度修饰符（如 shadow-orange-500/30）降低彩色阴影的噪声。',
    flow: ['用边框建立静态边界与分组。', '以 focus-visible 配 ring/outline 提供高对比焦点。', '仅在需要表达浮层高度时叠加阴影，并保持层级数量克制。', '用键盘焦点走查页面，确认每个可聚焦元素都有可见的焦点样式。'],
    notes: ['焦点不能只靠低对比阴影。', '过多阴影层级会削弱界面信息结构。', 'outline 不占布局空间、border 会改变尺寸计算，二者切换时要留意布局跳动。', 'ring 默认以 box-shadow 绘制，与 border 叠加时注意视觉厚度的一致性。'],
    problem: '解决"视觉分层、边界和键盘焦点应分别使用什么视觉手段来表达清楚"的问题。',
  },
{
    id: 'TW_13', title: '过渡、动画与减少动态效果', navTitle: '动画与动效', category: '交互与可访问性',
    path: '/tailwind-css/tw-13/motion', summary: '用 transition 与 motion-safe/motion-reduce 制作克制、可访问的反馈。',
    demo: TW13Motion, code: TW13Code, language: 'xml',
    principle: 'transition 工具定义参与过渡的属性、时长与缓动，animate 应用 @keyframes；motion-safe/motion-reduce 变体依据 prefers-reduced-motion 提供替代方案，让动效可被用户关闭，同时优先动画 transform 与 opacity 以保证性能。',
    flow: ['明确动效要解释的状态变化，而不是为装饰而动画。', '优先动画 transform 与 opacity，并把时长控制在 150-300ms。', '用 motion-reduce 为偏好减少动态的用户提供静态替代。', '开启系统的减少动态设置，验证动画被静态替代。'],
    notes: ['不要使用 transition-all 掩盖属性边界。', '持续闪烁和大幅位移可能引发不适。', '时长与缓动应统一在少量档位里，随意的时长会让界面显得不协调。', '大量元素同时动画会抢占主线程，注意控制并发动画的数量。'],
    problem: '解决"如何提供有意义的交互动效反馈，同时兼顾性能与运动可访问性"的问题。',
  },
{
    id: 'TW_14', title: '表单状态与无障碍语义', navTitle: '表单样式', category: '交互与可访问性',
    path: '/tailwind-css/tw-14/forms', summary: '组合输入框状态，并用原生语义连接标签、帮助和错误信息。',
    demo: TW14Forms, code: TW14Code, language: 'xml',
    principle: '表单变体可响应 focus、invalid、disabled、readonly 及 aria/data 属性，但工具类只负责外观；可访问名称（label）、描述与错误状态仍必须由语义 HTML 提供，二者缺一不可。先用原生控件与标签把语义做对，再谈样式统一，顺序不能颠倒。',
    flow: ['使用 label 与正确的 input type。', '用 aria-describedby 关联帮助与错误信息。', '为焦点、无效、禁用与只读状态分别设计视觉反馈。', '用读屏器抽查表单，确认错误信息与控件被正确关联朗读。'],
    notes: ['placeholder 不能代替 label。', '错误不能只用颜色表达。', '校验失败除样式外应给出文本错误信息，并保证其能被辅助技术读取。', 'invalid 与 aria-invalid 不是一回事：受控组件要主动同步 aria-invalid 状态。'],
    problem: '解决"表单如何同时具备一致的视觉状态、键盘体验以及辅助技术语义"的问题。',
  },
{
    id: 'TW_15', title: '自定义工具与 Cascade Layers', navTitle: '自定义扩展', category: '扩展机制',
    path: '/tailwind-css/tw-15/custom-utilities', summary: '用 @utility 和 @layer 扩展少量项目能力，并继续支持变体。',
    demo: TW15CustomUtilities, code: TW15Code, language: 'css',
    principle: '@utility 注册静态或函数式自定义工具并自动接入变体系统（可 hover:、md: 等组合使用）；@layer base/components/utilities 把普通 CSS 放入明确的级联层级，避免与工具类的优先级互相踩踏。保持单一来源，同一能力不要在裸 CSS 与工具类里各写一份。',
    flow: ['先确认内置工具与任意值无法清晰表达该能力。', '把单用途能力注册为 @utility，保持可组合、可加变体。', '按基础样式 / 组件 / 工具选择正确的 @layer 落位。', '给自定义工具加 hover: 前缀，验证变体系统自动生效。'],
    notes: ['自定义工具应保持单一职责。', '复杂业务组件仍应封装为 Vue 组件。', '@utility 定义的工具会自动获得变体支持与优先级排序，优于手写裸类样式。', '从裸 CSS 迁移时逐个替换并对照产物，确认优先级符合预期。'],
    problem: '解决"项目特有 CSS 能力如何融入 Tailwind，而不建立平行样式体系"的问题。',
  },
{
    id: 'TW_16', title: '源检测、产物优化与生产排查', navTitle: '生产优化', category: '工程集成',
    path: '/tailwind-css/tw-16/production', summary: '控制自动源检测与 @source，定位缺失类名和异常 CSS 体积。',
    demo: TW16Production, code: TW16Code, language: 'css',
    principle: 'Tailwind 从源码文本中检测完整候选类（class="..." 里完整出现的类名）并按需生成 CSS，而不是解析运行时逻辑；@source 可显式注册额外来源（模板目录、第三方库、CMS 内容）、排除目录或用 @source inline 内联候选，生产构建再负责压缩与缓存。记住“扫描的是文本、类名必须完整出现”，是排查类名缺失的关键。',
    flow: ['确认模板文件位于自动检测范围内。', '对 monorepo 外部包或特殊来源用 @source 注册明确路径。', '分析产物体积，修复动态拼接类名与过宽的内联来源。', '在产物中搜索关键类名，确认其出现在生成的 CSS 里。'],
    notes: ['动态类名应映射为完整静态字符串。', '大范围 safelist 会掩盖架构问题并膨胀产物。', '组件库源码位于 node_modules 时，需用 @source 显式纳入扫描。', '扫描范围过大时构建会变慢，可用 @source not 排除明显的无关目录。'],
    problem: '解决"生产环境出现类名缺失或 CSS 体积过大时，如何系统定位根因"的问题。',
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
    principle: 'Grid 用 grid-cols/grid-rows 声明行与列轨道，col-span/row-span 控制子项跨列跨行，grid-template-areas + grid-area 用命名区域描述整体骨架；再用 gap 设轨道间距、place-items 控制对齐，配合响应式前缀在不同尺寸下切换列数。',
    flow: ['先用 grid-cols-* 定列数、gap 定轨道间距搭建二维网格。', '用 col-span-*/row-span-* 控制跨列跨行，或 grid-cols-[...] 表达自定义比例。', '整页骨架用 grid-template-areas 加 grid-area 命名区域，改一处模板即可全局重排。', '收窄窗口验证网格列数与跨列行为按断点平滑切换。'],
    notes: ['grid-cols-[repeat(auto-fill,minmax(200px,1fr))] 可通过自动填充生成等宽卡片墙。', 'place-items-center 可快速让网格子项水平垂直居中。', '跨行跨列类（col-span-*、col-start-*）只对 Grid 容器直系子项生效。', 'auto-fill 与 auto-fit 的差异在空轨道的处理，需要卡片保持最小宽度时用 auto-fill。'],
    problem: '解决"复杂二维布局手写 CSS Grid 繁琐、响应式切换困难"的问题。',
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
    principle: 'Flexbox 是一维布局：沿主轴排列子项，尺寸与换行由内容驱动，适合导航、标签组与简单对齐；Grid 是二维布局：先定义行列轨道，再把子项放进网格，位置由布局驱动，适合卡片墙、表单栅格与页面骨架。两者不互斥——宏观骨架用 Grid 划区域、区域内部用 Flex 做流式对齐，是常见且高效的组合。',
    flow: ['一维流（导航、标签、居中）用 Flex，用 justify-*/items-* 控制主轴与交叉轴。', '二维网格（卡片墙、表单、页面骨架）用 Grid，用 grid-cols-* 与 col-span-* 控制轨道。', '大框架用 Grid、内部对齐用 Flex 组合，避免用一种布局硬撑所有场景。', '给容器临时描边，直观核对两种布局的实际轨道与对齐。'],
    notes: ['Flex 内容驱动：子项按内容换行伸缩；Grid 布局驱动：轨道决定子项排列。', '两者可嵌套，Grid 容器内子项仍可用 Flex 做细微对齐。', '单元素水平垂直居中用 flex + items-center + justify-center 即可，不必动用 Grid。', '调试布局时用 outline 类给容器加临时边界，比改背景色更直观且不影响布局。'],
    problem: '解决"布局选择困难、不知道何时用 Flex 何时用 Grid"的问题。',
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
    principle: '状态变体把 hover/focus/active/focus-visible/disabled/checked 等伪类展开为选择器规则；group 把容器状态向下传达给后代，peer 让前置兄弟的状态影响后续兄弟；此外还有 first/last/odd/even/empty/placeholder/selection 等结构性与元素伪类变体。',
    flow: ['用 hover:/active: 做直接反馈，用 focus-visible: 保住键盘焦点可见。', '父容器加 group，子元素用 group-hover: 联动，必要时用 group/name 命名以支持嵌套。', '列表间隔样式用 first:/last:/odd/even:，输入态用 placeholder:/selection:。', '用元素面板核对各变体生成的选择器与命中元素一致。'],
    notes: ['group-hover 命中的是标记链上的祖先 group，要求目标元素在 DOM 上是其后代。', 'peer 只影响其后方的兄弟元素，这是后续兄弟选择器的固有约束。', '聚焦描边优先用 focus-visible: 而非 focus:，避免鼠标点击也出现焦点圈。', '结构伪类变体依赖 DOM 顺序，增删节点后要重新核对首尾与奇偶样式。'],
    problem: '解决"交互状态的 CSS 样式重复书写、父子与兄弟联动样式复杂"的问题。',
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
    principle: 'scale/rotate/translate/skew 组合成单一 transform 且不改变布局占位；transition 声明参与过渡的属性、时长与缓动函数，animate 应用关键帧动画；配合 hover 等变体即可触发平滑的交互反馈。',
    flow: ['用 scale/rotate/translate/skew 与 origin-* 定义要呈现的变换。', '加 transition 与 duration-*/ease-* 让状态变化平滑过渡，用 hover:/active: 触发。', '循环或阶段性动效用 animate-*（内置 spin/ping/pulse/bounce）或自定义 keyframes。', '打开动画面板确认动画只涉及 transform 与 opacity，未触发重排。'],
    notes: ['优先动画 transform 与 opacity，性能最好；避免让布局属性参与昂贵动画。', '优先用 transition-transform 等明确属性，不要一律 transition-all。', 'v4 自定义动画在 CSS 里用 @theme 的 --animate-* 与 @keyframes 声明（旧式 tailwind.config 需经 @config 加载）。', '旋转与缩放组合时注意 transform 的书写顺序，顺序不同结果可能明显不同。'],
    problem: '解决"手写动画 CSS 繁琐，过渡与关键帧动画效果难以统一管理"的问题。',
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
    principle: 'filter 工具类（blur/brightness/contrast/saturate/grayscale/sepia/invert 等）作用于元素本身，backdrop-* 对其背后覆盖的内容应用滤镜，mix-blend-* 用混合模式让元素与下层背景叠加。',
    flow: ['对元素本体用 blur-*/brightness-* 等 filter 工具类，可按需求并发叠加多个效果。', '对元素背后内容用 backdrop-blur-*，配半透明背景色实现毛玻璃质感。', '文字或图层叠放用 mix-blend-* 控制与背景的混合关系。', '在元素面板核对 filter 与 backdrop-filter 的合成结果。'],
    notes: ['多个滤镜可写进同一元素的多个类里（如 blur-sm brightness-110），会合并成一条 filter 声明。', 'backdrop-filter 需配合半透明背景色或边框，才能肉眼看到毛玻璃效果。', '像素或任意档位用 blur-[8px]、brightness-[1.2] 表达，超出默认档位即可用任意值。', 'backdrop 类依赖浏览器支持 backdrop-filter，降级时记得提供纯色兜底。'],
    problem: '解决"图片处理、毛玻璃与视觉特效是否必须依赖额外的专门图片资源"的问题。',
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
    flow: ['在 SVG 内部把 fill/stroke 改为 currentColor。', '用 text-* 工具类同时控制文字与图标颜色。', '用 w-*、h-* 或父级 text-* 大小控制图标尺寸。', '切换主题色后确认图标与文字颜色同步变化。'],
    notes: ['currentColor 让图标颜色跟随上下文，主题切换零成本。', '推荐使用线性 stroke 图标，更容易变色和保持一致性。', '可以直接用 Heroicons、Lucide 等库的 currentColor 变体。', '内联 SVG 时保持 stroke-width 一致，混用不同线宽会让图标观感不齐。'],
    problem: '解决"图标颜色与文字不一致、图标库体积容易膨胀、主题切换也很困难"的问题。',
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
    principle: '插件通过 JS API（addBase/addComponents/addUtilities/addVariant/matchUtilities）扩展基础样式、组件类、工具类与变体；官方插件如 typography、forms、aspect-ratio 覆盖常见能力，除此以外更推荐先用 CSS-first 的 @utility 声明简单工具，只有动态或复杂能力才落到 plugin()。',
    flow: ['先确认是否能用内置工具、任意值或 @utility 解决，避免为简单需求引入插件。', '注册官方插件或自写 plugin() 时，按 addUtilities/addComponents/addBase/addVariant 分门别类扩展。', '需要按参数生成工具类时用 matchUtilities，配合入参和阈值生成动态值。', '在产物中核对插件注册的类名与变体能否被正常生成。'],
    notes: ['line-clamp、aspect-ratio、container-queries 等已在 v4 内置，无需再安装同名插件。', 'v4 里插件属 JS 配置能力，须在 CSS 里用 @config 显式加载 tailwind.config；简单工具优先用 @utility。', '插件可发布为 npm 包跨项目复用，但应只暴露必要 API，控制启动开销。', '升级 v4 前先盘点在用插件清单，确认哪些已内置、哪些必须保留。'],
    problem: '解决"内置工具类不够用时，重复出现的样式模式如何抽象复用并治理"的问题。',
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
    principle: '把颜色、字体、间距、圆角、动画等设计令牌抽成可复用配置，多项目共享统一视觉规范，并允许项目层覆盖或扩展：v4 推荐用 @theme 的 CSS-first 文件配合 @import 共享，旧式 JavaScript 配置则把 theme 抽成 preset，经 presets 数组在 @config 加载的配置内引用。',
    flow: ['把设计令牌从项目样式提炼为独立共享文件（CSS 的 @theme 文件，或 JS 的 preset 对象）。', '在项目里 import 该主题 CSS，或经 presets 数组引入；需要时发布成 npm 包做版本化迭代。', '项目层只覆盖或扩展差异项，保持全局一致与局部个性并存。', '在项目中覆盖一个令牌值，验证派生工具类随之变化。'],
    notes: ['v4 默认不再自动读取 tailwind.config.js，遗留 JS 配置须在 CSS 里用 @config 显式加载。', 'CSS-first 下更推荐把设计系统写成一个带 @theme 的共用 CSS，再用 @import 引入，不拆成多份独立 JS 配置。', '预设可嵌套与组合，设计令牌应由设计与开发共同定义，并用语义化版本发布。', '共享主题文件在构建时被静态内联，改造后要复核产物里的变量值。'],
    problem: '解决"多项目设计规范不统一、样式配置重复维护、设计系统难以落地"的问题。',
  }
]
