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

const G01EnvironmentConfig = createDemo('G01EnvironmentConfig')
const G01Code = createCodeLoader('G01EnvironmentConfig.vue')
const G02CodeQuality = createDemo('G02CodeQuality')
const G02Code = createCodeLoader('G02CodeQuality.vue')
const G03UnitTesting = createDemo('G03UnitTesting')
const G03Code = createCodeLoader('G03UnitTesting.vue')
const G04ComponentTesting = createDemo('G04ComponentTesting')
const G04Code = createCodeLoader('G04ComponentTesting.vue')
const G05CIPipeline = createDemo('G05CIPipeline')
const G05Code = createCodeLoader('G05CIPipeline.vue')
const G06PerformanceBudget = createDemo('G06PerformanceBudget')
const G06Code = createCodeLoader('G06PerformanceBudget.vue')
const G07Accessibility = createDemo('G07Accessibility')
const G07Code = createCodeLoader('G07Accessibility.vue')
const G08SecurityDelivery = createDemo('G08SecurityDelivery')
const G08Code = createCodeLoader('G08SecurityDelivery.vue')
const G09BuildPlugin = createDemo('G09BuildPlugin')
const G09Code = createCodeLoader('G09BuildPlugin.vue')
const G10E2eTesting = createDemo('G10E2eTesting')
const G10Code = createCodeLoader('G10E2eTesting.vue')
const G11BundleAnalysis = createDemo('G11BundleAnalysis')
const G11Code = createCodeLoader('G11BundleAnalysis.vue')
const G12Monorepo = createDemo('G12Monorepo')
const G12Code = createCodeLoader('G12Monorepo.vue')
const G13Docker = createDemo('G13Docker')
const G13Code = createCodeLoader('G13Docker.vue')
const G14GitWorkflow = createDemo('G14GitWorkflow')
const G14Code = createCodeLoader('G14GitWorkflow.vue')
const G15I18n = createDemo('G15I18n')
const G15Code = createCodeLoader('G15I18n.vue')
const G16MicroFrontend = createDemo('G16MicroFrontend')
const G16Code = createCodeLoader('G16MicroFrontend.vue')
const G17PnpmWorkspaces = createDemo('G17PnpmWorkspaces')
const G17Code = createCodeLoader('G17PnpmWorkspaces.vue')
const G18Turborepo = createDemo('G18Turborepo')
const G18Code = createCodeLoader('G18Turborepo.vue')
const G19Changesets = createDemo('G19Changesets')
const G19Code = createCodeLoader('G19Changesets.vue')
const G20Storybook = createDemo('G20Storybook')
const G20Code = createCodeLoader('G20Storybook.vue')
const G21Chromatic = createDemo('G21Chromatic')
const G21Code = createCodeLoader('G21Chromatic.vue')
const G22Playwright = createDemo('G22Playwright')
const G22Code = createCodeLoader('G22Playwright.vue')
const G23VitestConfig = createDemo('G23VitestConfig')
const G23Code = createCodeLoader('G23VitestConfig.vue')
const G24NxWorkspace = createDemo('G24NxWorkspace')
const G24Code = createCodeLoader('G24NxWorkspace.vue')
const G25BundleAnalyzer = createDemo('G25BundleAnalyzer')
const G25Code = createCodeLoader('G25BundleAnalyzer.vue')
const G26Pwa = createDemo('G26Pwa')
const G26Code = createCodeLoader('G26Pwa.vue')


export const lessons: Lesson[] = [
{
    id: 'G_01', title: '环境变量与运行配置', navTitle: '环境配置', category: '构建基础',
    path: '/engineering/g-1/environment-config', summary: '区分构建时环境变量、公开配置和服务端密钥。',
    demo: G01EnvironmentConfig, code: G01Code, language: 'vue',
    principle: '环境配置把同一份代码连接到不同服务；任何进入客户端产物的变量都可被用户读取，密钥必须留在服务端并通过 API 转发，公开值需要明确前缀（如 VITE_）以避免误暴露。',
    flow: ['定义开发、测试、预发和生产环境差异，列出每套配置需要的键。', '只把 VITE_ 前缀等公开值暴露给客户端，敏感密钥留在服务端。', '在构建和部署阶段注入配置，并在启动时打印关键值便于排查。'],
    notes: ['不要把 .env 当作权限边界，它只是注入途径，真正的隔离在服务端。', '环境变量名和默认值应形成文档，避免新成员重复猜测。', 'CI 应使用平台的 Secret 注入，不要把密钥写入 yaml 或日志。'],
    problem: '解决"多环境地址如何切换，以及密钥应该放在哪里"的问题。',
  },
{
    id: 'G_02', title: '代码规范与自动检查', navTitle: '代码质量', category: '质量保障',
    path: '/engineering/g-2/code-quality', summary: '用格式化、Lint 和类型检查建立提交前质量门。',
    demo: G02CodeQuality, code: G02Code, language: 'vue',
    principle: '格式化统一外观，Lint 发现可疑模式，类型检查验证契约；三者职责不同，应在本地和 CI 中使用同一份配置和命令，避免"我这里能跑"的分叉。',
    flow: ['编辑器保存时自动格式化，提交前再由 lint-staged 兜底。', '提交前运行静态检查（lint、type-check、test）。', 'CI 再执行一次同样的检查并阻止不合格变更合入。'],
    notes: ['规则应服务于缺陷预防和一致性，不要引入无法维护的复杂配置。', '不要让本地配置与 CI 配置分叉，配置文件必须提交到仓库。', '把核心脚本写成 pnpm lint / pnpm type-check 这样的统一入口。'],
    problem: '解决"团队如何稳定保持一致风格并提前发现低级错误"的问题。',
  },
{
    id: 'G_03', title: '单元测试与边界用例', navTitle: '单元测试', category: '质量保障',
    path: '/engineering/g-3/unit-testing', summary: '以折扣计算为例设计快速、确定且可读的单元测试。',
    demo: G03UnitTesting, code: G03Code, language: 'vue',
    principle: '单元测试隔离验证一个纯逻辑单元，重点覆盖正常值、边界值和错误输入，而不是复制实现细节；测试名要描述业务行为，断言要稳定可读。',
    flow: ['准备被测函数的输入和依赖替身（Fake、Stub、Mock）。', '执行一个明确行为，捕获返回或副作用。', '断言公开结果，覆盖正常路径、边界值和异常输入。'],
    notes: ['测试名称应描述行为，例如"满 200 减 50 后金额正确"。', '时间、随机数、远程调用需要可控替身，避免用例偶发失败。', '断言越接近业务越好，避免对内部实现细节做假设。'],
    problem: '解决"哪些逻辑值得单测，以及怎样写出稳定断言"的问题。',
  },
{
    id: 'G_04', title: '组件交互测试', navTitle: '组件测试', category: '质量保障',
    path: '/engineering/g-4/component-testing', summary: '从用户视角验证按钮、提示和可访问状态。',
    demo: G04ComponentTesting, code: G04Code, language: 'vue',
    principle: '组件测试应通过用户可见文本、role 和可访问属性观察行为，避免依赖内部 ref、私有方法名或脆弱 DOM 层级，让测试在重构后仍然能跑。',
    flow: ['按 role、label、placeholder 等可访问查询找到控件。', '触发真实的 click、input、change 等用户事件。', '断言页面呈现的可见结果，而不是实现细节。'],
    notes: ['优先断言可访问查询，这样标签文案变化时测试也会同步失效。', '只在边界处模拟网络和外部服务，业务分支走真实组件。', '不要断言内部状态或样式细节，那是实现而非行为。'],
    problem: '解决"如何验证组件交互而不把测试绑死在实现细节上"的问题。',
  },
{
    id: 'G_05', title: '持续集成与发布流水线', navTitle: 'CI 流水线', category: '自动化交付',
    path: '/engineering/g-5/ci-pipeline', summary: '把安装、检查、构建和发布组织成可重复流水线。',
    demo: G05CIPipeline, code: G05Code, language: 'vue',
    principle: 'CI 在干净环境重现项目验证过程，只有全部质量门通过的不可变产物才能进入发布阶段；流水线应当快速失败、并行执行、可重放，避免"在我机器上能跑"的玄学问题。',
    flow: ['锁定依赖（pnpm install --frozen-lockfile）并恢复缓存。', '并行运行类型检查、Lint、测试和构建。', '构建一次并把同一份产物用于多环境发布。'],
    notes: ['流水线密钥必须使用平台 Secret 注入，不要写入文件或日志。', '失败步骤应保留日志、覆盖率报告和测试 trace 便于排查。', '用矩阵策略覆盖多 Node 版本或多操作系统。'],
    problem: '解决"如何让每次提交都经过一致验证并可靠发布"的问题。',
  },
{
    id: 'G_06', title: '性能预算与持续度量', navTitle: '性能预算', category: '用户体验',
    path: '/engineering/g-6/performance-budget', summary: '给脚本、图片和总体积设置可执行的性能预算。',
    demo: G06PerformanceBudget, code: G06Code, language: 'vue',
    principle: '性能预算把"页面要快"这一模糊目标转为可自动判断的上限（JS 体积、首屏 LCP、TBT 等），构建时测量并在超标时拦截，线上再结合 RUM 数据持续观察回归。',
    flow: ['按目标网络和设备档次制定各项预算（JS、CSS、图片、字体）。', '构建时使用 size-limit 等工具测量资源体积。', '超出阈值时阻止合并并定位增量来源。'],
    notes: ['压缩后体积和执行成本都要关注，gzip 后的数字不能完全代表运行时开销。', '实验室指标应与真实用户数据（RUM）互补，前者抓回归后者看分布。', '预算应分等级：核心路由 vs 普通页面，避免一刀切。'],
    problem: '解决"如何防止依赖和资源在迭代中悄悄拖慢页面"的问题。',
  },
{
    id: 'G_07', title: '无障碍作为工程质量门', navTitle: '无障碍', category: '用户体验',
    path: '/engineering/g-7/accessibility', summary: '把语义、键盘、对比度和状态播报纳入开发流程。',
    demo: G07Accessibility, code: G07Code, language: 'vue',
    principle: '无障碍首先依赖正确的 HTML 语义（button、label、heading、list），再用 axe-core 等自动扫描发现常见问题，最后通过键盘与读屏软件对关键流程做人工验证，三层缺一不可。',
    flow: ['使用原生语义元素和正确的标签关联。', '运行自动规则扫描（axe-core、eslint-plugin-jsx-a11y）。', '用键盘和读屏软件完成核心任务，确认焦点顺序和播报。'],
    notes: ['ARIA 不能替代原生语义，能用 button 就不要写 role="button" 的 div。', '不要只靠颜色传递状态，配合图标、文字或纹理。', '焦点环不要随意去掉，要给出可识别的可见替代。'],
    problem: '解决"如何让更多用户可用，并把无障碍从补丁变成日常质量要求"的问题。',
  },
{
    id: 'G_08', title: 'Web 安全与静态发布', navTitle: '安全发布', category: '自动化交付',
    path: '/engineering/g-8/security-delivery', summary: '检查安全响应头、依赖风险与静态资源缓存策略。',
    demo: G08SecurityDelivery, code: G08Code, language: 'vue',
    principle: '安全发布需要最小化客户端暴露（CSP、密钥隔离）、限制资源来源（SRI、跨域策略）、持续修复依赖漏洞（npm audit、Dependabot），并为带内容哈希的静态资源设置长期缓存，让性能与安全同时落地。',
    flow: ['构建前扫描依赖和公开配置，移除调试入口。', '部署时配置 CSP、X-Frame-Options、Referrer-Policy 等响应头。', 'HTML 短缓存、内容哈希资源长期不可变缓存。'],
    notes: ['CSP 应先 report-only 观察再逐步收紧，避免直接拦截正常功能。', '前端校验不能替代服务端授权，关键操作必须由服务端把关。', '依赖升级应当纳入常规迭代，重大版本升级单独排期。'],
    problem: '解决"静态站点发布时如何兼顾安全策略与缓存性能"的问题。',
  },
{
    id: 'G_09', title: 'Vite 构建插件与钩子机制', navTitle: '构建插件', category: '构建基础',
    path: '/engineering/g-9/build-plugin', summary: '用自定义 Vite 插件展示构建钩子、资源转换和插件执行顺序。',
    demo: G09BuildPlugin, code: G09Code, language: 'vue',
    principle: 'Vite 基于 Rollup 插件体系，通过 resolveId、transform、generateBundle 等钩子介入构建流程；插件按注册顺序执行，每个钩子负责不同阶段的资源转换。',
    flow: ['在 vite.config.ts 中注册插件并声明需要的钩子。', 'transform 钩子逐个文件处理内容替换和注入。', 'generateBundle 钩子在产物输出前执行最终优化。'],
    notes: ['插件应尽量只做一件事，避免在单个插件中混合多种职责。', 'transform 返回值可以是字符串或 { code, map } 对象，后者保留 source map。'],
    problem: '解决"如何在构建流程中介入自定义转换逻辑，以及不同钩子各自负责什么阶段"的问题。',
  },
{
    id: 'G_10', title: '端到端测试与流程编排', navTitle: 'E2E 测试', category: '质量保障',
    path: '/engineering/g-10/e2e-testing', summary: '以报名表单流程为例，展示端到端测试的步骤编排、断言和失败定位。',
    demo: G10E2eTesting, code: G10Code, language: 'vue',
    principle: '端到端测试从用户视角验证完整业务流程，通过可访问选择器定位元素、编排操作步骤、断言可见结果，失败时自动截图并精确定位出错步骤。',
    flow: ['用 getByRole、getByLabel 等可访问查询定位元素。', '按用户操作顺序编排点击、输入和导航步骤。', '断言页面呈现的文本、状态和可访问角色。'],
    notes: ['优先使用用户可见的选择器，避免依赖 CSS 类名或 data 属性。', '测试数据应独立，每次运行前重置状态以避免用例间相互影响。', '失败截图和 trace 是定位问题的关键产物，CI 中应保留这些文件。'],
    problem: '解决"如何从用户视角验证完整业务流程，并在失败时快速定位问题"的问题。',
  },
{
    id: 'G_11', title: '构建产物分析与拆分策略', navTitle: '产物分析', category: '用户体验',
    path: '/engineering/g-11/bundle-analysis', summary: '用可视化树状图分析构建产物组成，定位体积热点并制定拆分策略。',
    demo: G11BundleAnalysis, code: G11Code, language: 'vue',
    principle: '构建产物分析把抽象的"打包体积"变成可视化的模块树，帮助定位体积热点；超过阈值的 chunk 可通过动态导入、按需加载或提取公共模块来拆分。',
    flow: ['使用 rollup-plugin-visualizer 或 webpack-bundle-analyzer 生成产物报告。', '按模块类型分类观察 vendor、app 和资源的体积占比。', '对超出预算的模块制定拆分或替换方案。'],
    notes: ['vendor 体积优先检查是否有可替换的轻量方案。', 'tree-shaking 依赖 ESM 导出，混用 CommonJS 会导致整个模块被打包。', '动态导入让路由级组件按需加载，减少首屏所需的初始包体积。'],
    problem: '解决"构建产物为什么越来越大，以及如何系统性地控制体积"的问题。',
  },
{
    id: 'G_12', title: 'Monorepo 工作区与多包管理', navTitle: 'Monorepo', category: '构建基础',
    path: '/engineering/g-12/monorepo', summary: '用 pnpm workspace 组织多包项目，展示依赖拓扑、版本同步和独立构建。',
    demo: G12Monorepo, code: G12Code, language: 'vue',
    principle: 'Monorepo 通过 workspace 协议把多个包放在同一仓库，共享依赖和工具链；构建按依赖拓扑排序执行，版本管理借助 changesets 实现独立发版。',
    flow: ['在根目录 pnpm-workspace.yaml 声明 packages 匹配规则。', '各包通过 workspace: 协议引用内部依赖，pnpm 自动链接。', '构建工具按拓扑顺序编译，确保被依赖包先于依赖方构建。'],
    notes: ['workspace 协议只在开发环境生效，发布后自动替换为具体版本号。', '修改一个包后，依赖它的所有包都需要重新构建和测试。', '使用 changesets 管理版本，每个变更生成一个 .md 描述文件，发版时自动计算版本号。'],
    problem: '解决"多包项目如何共享代码、统一版本并按依赖顺序可靠构建"的问题。',
  },
{
    id: 'G_13', title: 'Docker 容器化与多阶段构建', navTitle: 'Docker', category: '部署与运维',
    path: '/engineering/g-13/docker', summary: '用多阶段 Dockerfile 构建 Node.js 应用镜像，掌握层缓存和镜像瘦身。',
    demo: G13Docker, code: G13Code, language: 'vue',
    principle: 'Docker 把应用和依赖打包为不可变镜像；多阶段构建分离编译和运行环境，最终镜像只包含运行时必要文件，减小体积和攻击面。',
    flow: ['选择合适的基础镜像。', '按变更频率排列层以利用缓存。', '多阶段构建分离构建和运行阶段。'],
    notes: ['不要把 node_modules 和 .env 打进镜像。', '非 root 用户运行容器提高安全性。'],
    problem: '解决"如何可靠地将应用打包并部署到不同环境"的问题。',
  },
{
    id: 'G_14', title: 'Git 工作流与提交规范', navTitle: 'Git 工作流', category: '质量保障',
    path: '/engineering/g-14/git-workflow', summary: '对比 Git Flow、GitHub Flow 和 Trunk-Based，掌握 Conventional Commits。',
    demo: G14GitWorkflow, code: G14Code, language: 'vue',
    principle: '分支策略决定团队协作方式；Conventional Commits 用结构化提交信息驱动自动版本号计算和 CHANGELOG 生成，husky + lint-staged 在提交时执行检查。',
    flow: ['根据团队规模选择分支策略。', '使用 Conventional Commits 规范提交信息。', '用 husky 和 lint-staged 在提交时自动检查。'],
    notes: ['小团队适合 GitHub Flow 或 Trunk-Based。', 'commitlint 可以强制校验提交信息格式。'],
    problem: '解决"团队如何统一分支策略和提交规范以提高协作效率"的问题。',
  },
{
    id: 'G_15', title: '国际化 i18n 方案实践', navTitle: 'i18n', category: '用户体验',
    path: '/engineering/g-15/i18n', summary: '用 vue-i18n 实现多语言切换，掌握复数规则、日期格式化和消息懒加载。',
    demo: G15I18n, code: G15Code, language: 'vue',
    principle: 'i18n 把可翻译文本抽取为消息文件，运行时根据 locale 选择对应翻译；复数规则、日期/数字格式化和消息懒加载是生产级国际化的关键。',
    flow: ['抽取文本为消息 JSON 文件。', '配置 locale 切换和回退策略。', '按需加载语言包减少首屏体积。'],
    notes: ['翻译键使用业务语义命名而非页面位置。', 'RTL 语言需要额外的布局适配。'],
    problem: '解决"如何让应用支持多语言并高效管理翻译资源"的问题。',
  },
{
    id: 'G_16', title: '微前端架构与模块联邦', navTitle: '微前端', category: '部署与运维',
    path: '/engineering/g-16/micro-frontend', summary: '对比 Module Federation、qiankun 和 iframe 三种微前端方案。',
    demo: G16MicroFrontend, code: G16Code, language: 'vue',
    principle: '微前端把大型应用拆分为独立开发部署的子应用；Module Federation 共享依赖最高效，qiankun 兼容性最好，iframe 隔离性最强但集成成本最高。',
    flow: ['评估团队和应用的拆分需求。', '选择合适的微前端方案。', '配置路由协调和依赖共享策略。'],
    notes: ['微前端引入复杂度，仅在团队和应用确实需要独立部署时采用。', '共享依赖版本冲突是最常见的运行时问题。'],
    problem: '解决"大型前端应用如何拆分为可独立开发和部署的子应用"的问题。',
  },
{
    id: 'G_17', title: 'pnpm workspace 工作区与依赖管理', navTitle: 'pnpm workspace', category: '构建基础',
    path: '/engineering/g-17/pnpm-workspaces', summary: '使用 pnpm workspace 管理 Monorepo 多包项目依赖。',
    demo: G17PnpmWorkspaces, code: G17Code, language: 'vue',
    principle: 'pnpm workspace 通过 pnpm-workspace.yaml 定义多包项目结构，所有包共享同一个 node_modules 和 lockfile，提升安装速度并保证依赖一致性。',
    flow: ['在根目录创建 pnpm-workspace.yaml 声明工作区范围', '各包在 package.json 中使用 workspace: 协议引用内部包', 'pnpm install 自动建立软链接并提升公共依赖'],
    notes: ['避免幽灵依赖，pnpm 默认使用严格的 node_modules 结构', '使用 pnpm -r 递归执行各包的脚本', 'pnpm publish 时会自动将 workspace: 转换为真实版本号'],
    problem: '解决多包 Monorepo 项目中依赖安装慢、版本不一致、幽灵依赖等问题。',
  },
{
    id: 'G_18', title: 'Turborepo 构建缓存与任务编排', navTitle: 'Turborepo', category: '构建基础',
    path: '/engineering/g-18/turborepo', summary: '使用 Turborepo 加速 Monorepo 构建并编排任务依赖。',
    demo: G18Turborepo, code: G18Code, language: 'vue',
    principle: 'Turborepo 通过任务依赖图和远程缓存加速 Monorepo 构建，它记录每个任务的输入输出哈希，相同输入直接复用缓存结果。',
    flow: ['在 turbo.json 中定义任务及其依赖关系', '运行 turbo build 时自动按拓扑顺序执行任务', '命中缓存的任务直接跳过，未命中的执行并缓存结果'],
    notes: ['远程缓存可在 CI 和团队成员间共享构建结果', '使用 --filter 只运行受影响包的任务', '合理配置 inputs/outputs 才能保证缓存正确性'],
    problem: '解决 Monorepo 中重复构建、构建顺序复杂、CI 速度慢的问题。',
  },
{
    id: 'G_19', title: 'Changesets 版本管理与发布流程', navTitle: 'Changesets', category: '质量保障',
    path: '/engineering/g-19/changesets', summary: '使用 Changesets 管理 Monorepo 多包版本和 CHANGELOG。',
    demo: G19Changesets, code: G19Code, language: 'vue',
    principle: 'Changesets 是一套版本管理工具，每个功能变更生成一个独立的 changeset 文件记录变更类型和说明，发布时自动汇总并更新版本号和 CHANGELOG。',
    flow: ['开发者运行 changeset add 创建变更记录文件', 'changeset version 汇总所有变更并更新版本号', 'changeset publish 发布更新后的包并生成 CHANGELOG'],
    notes: ['changeset 文件应与功能代码一起提交到版本库', '支持 major/minor/patch 三级语义化版本', '可与 GitHub Actions 集成实现自动化发布'],
    problem: '解决 Monorepo 多包版本管理混乱、CHANGELOG 维护困难的问题。',
  },
{
    id: 'G_20', title: 'Storybook 组件文档与可视化测试', navTitle: 'Storybook', category: '质量保障',
    path: '/engineering/g-20/storybook', summary: '使用 Storybook 构建组件文档和可视化测试环境。',
    demo: G20Storybook, code: G20Code, language: 'vue',
    principle: 'Storybook 是一个组件开发和文档工具，通过 Stories 展示组件的各种状态，支持交互测试、可访问性检查和视觉回归测试。',
    flow: ['为每个组件编写 .stories.ts 文件定义不同状态', '在 Storybook UI 中浏览和交互测试组件', '使用 addon 扩展文档、可访问性、设计稿对比等能力'],
    notes: ['Stories 也是组件使用示例的活文档', '支持与 Figma 设计稿对比验证实现一致性', '可通过 Chromatic 进行云端视觉回归测试'],
    problem: '解决组件文档缺失、状态覆盖不全、视觉回归难以检测的问题。',
  },
{
    id: 'G_21', title: 'Chromatic 视觉回归测试与 UI 审查', navTitle: 'Chromatic', category: '质量保障',
    path: '/engineering/g-21/chromatic', summary: '使用 Chromatic 进行视觉回归测试和团队 UI 审查。',
    demo: G21Chromatic, code: G21Code, language: 'vue',
    principle: 'Chromatic 是 Storybook 官方的视觉回归测试服务，通过像素级对比检测 UI 变化，并提供在线 UI 审查流程让团队确认设计变更。',
    flow: ['每次 CI 构建时 Chromatic 抓取所有 Story 的快照', '与基准快照对比，自动检测视觉差异', '团队成员在 Chromatic 平台上审查并接受/拒绝变更'],
    notes: ['可以检测到肉眼容易忽略的细微样式变化', '支持多浏览器和视口尺寸的快照测试', '与 GitHub PR 集成，UI 变更直接在 PR 中审查'],
    problem: '解决 UI 样式变更难以通过单元测试检测、设计走查效率低的问题。',
  },
{
    id: 'G_22', title: 'Playwright E2E 测试与元素定位', navTitle: 'Playwright', category: '质量保障',
    path: '/engineering/g-22/playwright', summary: '使用 Playwright 编写稳定可靠的端到端测试。',
    demo: G22Playwright, code: G22Code, language: 'vue',
    principle: 'Playwright 是微软推出的端到端测试框架，支持 Chromium、WebKit、Firefox 多浏览器并行执行，提供自动等待、网络拦截、追踪录制等高级能力，通过浏览器自动化协议直接驱动浏览器内核。',
    flow: ['编写测试脚本，使用 page.goto 访问目标页面。', '通过 getByRole、getByLabel 等可访问定位器找到元素。', '执行点击、输入等交互操作并断言页面状态符合预期。'],
    notes: ['优先使用角色定位器（getByRole），最接近真实用户使用方式。', 'Playwright 自动等待元素可交互，不需要手动 sleep。', 'trace viewer 可以回放完整测试过程用于调试失败用例。'],
    problem: '解决"E2E 测试不稳定、调试困难、多浏览器兼容性测试成本高"的问题。',
  },
{
    id: 'G_23', title: 'Vitest 高级配置与覆盖率报告', navTitle: 'Vitest 高级配置', category: '质量保障',
    path: '/engineering/g-23/vitest-config', summary: '深入配置 Vitest 提升测试速度和报告质量。',
    demo: G23VitestConfig, code: G23Code, language: 'vue',
    principle: 'Vitest 支持丰富的配置项来定制测试环境、覆盖率、Mock 行为、并行策略等，合理的配置可以显著提升测试速度和报告质量，让持续集成与本地开发都更顺畅。',
    flow: ['在 vitest.config.ts 中配置测试环境（jsdom/happy-dom）、覆盖率阈值、别名。', '使用 --coverage 参数运行测试并生成 v8/istanbul 报告。', '根据报告优化测试用例，确保核心业务逻辑被充分覆盖。'],
    notes: ['覆盖率不是越高越好，重点关注核心业务逻辑和易回归模块。', '使用 --watch 模式配合 UI 界面提升调试效率。', '合理设置 test.include/exclude 避免运行不必要的文件。'],
    problem: '解决"测试配置不合理导致速度慢、覆盖率统计不准确、报告不直观"的问题。',
  },
{
    id: 'G_24', title: 'Nx 工作区与受影响项目检测', navTitle: 'Nx 工作区', category: '构建基础',
    path: '/engineering/g-24/nx-workspace', summary: '使用 Nx 智能构建系统管理大型 Monorepo。',
    demo: G24NxWorkspace, code: G24Code, language: 'vue',
    principle: 'Nx 是一个智能构建系统，通过项目图分析和计算缓存加速 Monorepo 任务执行，它能自动检测受变更影响的项目，只运行必要的任务。',
    flow: ['Nx 自动构建项目依赖图（project graph）', 'nx affected:build 根据 Git 变更计算受影响项目', '只构建和测试受影响的包，大幅节省时间'],
    notes: ['Nx Cloud 提供分布式任务执行和远程缓存', 'Nx 插件为不同框架提供预设和生成器', '模块边界约束防止架构腐化'],
    problem: '解决大型 Monorepo 中全量构建慢、依赖关系不清晰、架构约束缺失的问题。',
  },
{
    id: 'G_25', title: '打包体积分析与代码分割策略', navTitle: '体积分析', category: '用户体验',
    path: '/engineering/g-25/bundle-analyzer', summary: '分析打包体积并优化代码分割策略。',
    demo: G25BundleAnalyzer, code: G25Code, language: 'vue',
    principle: '构建产物分析工具将打包后的模块按大小可视化，帮助识别体积过大的依赖和可优化的代码分割点，配合路由懒加载和按需导入减小首屏体积。',
    flow: ['使用 rollup-plugin-visualizer 生成体积分析报告', '识别大体积依赖，考虑替换或按需导入', '配合动态 import 实现路由级和组件级代码分割'],
    notes: ['第三方库是常见的体积大户，优先检查', 'Tree Shaking 依赖 ES Module，避免全量导入', 'gzip/br 压缩后体积才是实际传输大小'],
    problem: '解决首屏加载慢、白屏时间长、打包体积失控的性能问题。',
  },
{
    id: 'G_26', title: 'PWA 离线应用与 Service Worker', navTitle: 'PWA 离线应用', category: '用户体验',
    path: '/engineering/g-26/pwa', summary: '使用 Service Worker 和 manifest 构建 PWA 离线应用。',
    demo: G26Pwa, code: G26Code, language: 'vue',
    principle: 'PWA（渐进式 Web 应用）通过 Service Worker 实现离线访问、后台同步和推送通知，结合 manifest.json 让网页可以安装到桌面。',
    flow: ['注册 Service Worker 并定义缓存策略', 'manifest.json 配置应用名称、图标、启动 URL', '用户访问时提示安装，离线时从缓存提供服务'],
    notes: ['注意缓存更新策略，避免用户永远看到旧版本', 'Workbox 库可以简化 Service Worker 编写', 'PWA 不是要替代原生应用，而是增强 Web 体验'],
    problem: '解决弱网环境下页面无法访问、用户留存低、无法像原生应用一样安装的问题。',
  }
]
