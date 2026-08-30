# 🐿️ 小松鼠举栗子

> 中文软件技术知识内容库 — 通过独立真实内容学习前端、多媒体、系统编程与 AI 技术

**在线浏览：[https://gzx-miller.github.io](https://gzx-miller.github.io)**

基于 **Nuxt 4 + Vue 3 + TypeScript + Pinia + Element Plus** 构建，采用静态站点生成（SSG），每个知识点都是一个可独立访问的交互式内容页面。

## 特性

- **500+ 个独立内容**，覆盖 22 个软件技术知识分类
- **交互式演示** — 每个内容包含可运行的 Demo、关键代码、原理说明、处理流程和注意事项
- **纯静态部署** — `nuxt generate` 预渲染全部路由，零服务端依赖
- **类型安全** — 全项目 TypeScript strict mode，Vitest 单元测试覆盖核心逻辑
- **秋日森林主题** — 红橙枫叶暖光配色，小松鼠抱栗子的视觉风格

## 技术栈

| 分类 | 技术 | 版本 |
|---|---|---|
| 框架 | Nuxt | 4.4 |
| UI 库 | Vue 3 | 3.5 |
| 语言 | TypeScript | 6.0 |
| 状态管理 | Pinia | 3.0 |
| 组件库 | Element Plus | 2.14 |
| 代码高亮 | highlight.js | 11 |
| 构建工具 | Vite (via Nuxt) | 7.3 |
| 测试 | Vitest + @vue/test-utils + jsdom | 4.1 |
| 包管理 | pnpm | 11.5 |

## 知识分类

| 分类 | 课程数 | 章节数 | 说明 |
|---|---|---|---|
| [JavaScript](https://gzx-miller.github.io/javascript) | 28 | 9 | 类型与对象模型、原型链、异步机制、模块化与浏览器事件 |
| [TypeScript](https://gzx-miller.github.io/typescript) | 24 | 4 | 类型建模、类型收窄、泛型、类型操作与 Vue 组件类型实践 |
| [Vue3](https://gzx-miller.github.io/vue) | 37 | 15 | 组合式 API、组件、路由、Pinia、过渡动画、插件开发与工程实践 |
| [Element Plus](https://gzx-miller.github.io/element-plus) | 20 | 7 | 表格、表单、弹窗、导航、数据展示与反馈等企业级组件 |
| [Vue Flow](https://gzx-miller.github.io/vue-flow) | 12 | 4 | 流程图与节点编辑器：连线校验、useVueFlow、拖拽搭建与自动布局 |
| [Nest.js](https://gzx-miller.github.io/nestjs) | 12 | 4 | 模块化架构、依赖注入、守卫鉴权、管道校验与 TypeORM |
| [Nuxt](https://gzx-miller.github.io/nuxt) | 20 | 10 | 文件路由、自动导入、SSR/SSG、Nitro 服务端 API 与模块生态 |
| [Node.js](https://gzx-miller.github.io/nodejs) | 30 | 16 | 模块、文件、事件、流、HTTP、进程、测试、安全与依赖管理 |
| [CSS](https://gzx-miller.github.io/css) | 24 | 21 | 选择器、盒模型、布局、层叠、变量、动画、容器查询与性能 |
| [Tailwind CSS](https://gzx-miller.github.io/tailwind-css) | 24 | 12 | v4 CSS-first、响应式变体、主题令牌、暗色模式与容器查询 |
| [Sass](https://gzx-miller.github.io/sass) | 24 | 9 | 模块系统、变量、嵌套、Mixin、函数与集合操作 |
| [Vite](https://gzx-miller.github.io/vite) | 21 | 10 | 配置、插件、HMR、依赖预构建、构建优化、库模式与 SSR |
| [React](https://gzx-miller.github.io/react) | 35 | 22 | Hooks、并发渲染、错误边界、逻辑复用、状态集成与性能优化 |
| [Next.js](https://gzx-miller.github.io/nextjs) | 24 | 6 | App Router、服务端组件、数据获取、Server Actions 与部署 |
| [LangChain](https://gzx-miller.github.io/langchain) | 23 | 14 | 模型调用、提示模板、链式调用、RAG 与 Agent |
| [LLM 原理](https://gzx-miller.github.io/llm-principles) | 32 | 5 | 向量、神经网络、注意力机制与 Transformer 预训练范式 |
| [C++](https://gzx-miller.github.io/cpp) | 30 | 12 | 内存管理、面向对象、模板、STL 与现代 C++ 核心特性 |
| [Electron](https://gzx-miller.github.io/electron) | 15 | 7 | 主进程与渲染进程、IPC 通信、窗口管理、系统托盘与打包分发 |
| [FFmpeg](https://gzx-miller.github.io/ffmpeg) | 24 | 1 | 格式转换、音视频处理、滤镜效果、字幕、流媒体与硬件加速 |
| [WebGL](https://gzx-miller.github.io/webgl) | 20 | 7 | 着色器、缓冲区、矩阵变换、纹理贴图、光照模型与后处理 |
| [WebAssembly](https://gzx-miller.github.io/webassembly) | 20 | 8 | WAT 指令、线性内存、JS 互操作、SIMD、多线程与工具链 |
| [uni-app](https://gzx-miller.github.io/uni-app) | 15 | 10 | 项目结构、条件编译、页面/应用生命周期、内置组件、路由与分包、rpx 适配、easycom、组合式 API 与请求存储 |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/gzx-miller/gzx-miller.github.io.git
cd gzx-miller.github.io

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

开发服务器启动后访问 `http://localhost:3000`，默认入口为 Vue3 分类。

### 路由结构

所有课程按知识分类组织，URL 保留类别层级：

```text
/                          # 首页
/vue                       # Vue3 分类首页
/vue/k-1/app-entry         # Vue3 > 工程起点 > 创建应用
/javascript/j-7/promise    # JavaScript > 异步机制 > Promise 并发
/react/r-10/memoization    # React > 性能 > 记忆化优化
```

## 项目结构

```text
├── .github/workflows/       # GitHub Actions 部署配置
├── src/
│   ├── assets/              # 静态资源（图片等）
│   ├── components/          # 页面组件（LessonPage、CodeBlock 等）
│   ├── composables/         # 可复用组合函数
│   ├── data/
│   │   ├── lessons.ts       # 课程注册表（所有分类与课程定义）
│   │   └── lessons.test.ts  # 课程注册完整性测试
│   ├── demos/               # 内容演示组件
│   │   ├── *.vue            # Vue/Element/CSS/Nuxt 等内容
│   │   ├── js-code/         # JavaScript 纯代码内容
│   │   ├── ts-code/         # TypeScript 纯代码内容
│   │   ├── react-jsx/       # React JSX 内容
│   │   └── state-react/     # React 状态管理内容
│   ├── pages/               # Nuxt 文件路由
│   │   ├── index.vue        # 首页
│   │   └── [...slug].vue    # 动态课程路由
│   ├── stores/              # Pinia Store
│   ├── utils/               # 工具函数
│   ├── style.css            # 全局样式
│   └── App.vue              # 根组件
├── nuxt.config.ts           # Nuxt 配置
├── package.json
└── tsconfig.json
```

## 验证

```bash
# 类型检查
pnpm type-check

# 运行测试
pnpm test

# 静态生成（产物输出到 .output/public）
pnpm build
```

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages。

推送代码到 `main` 分支后，CI 流程会自动执行：

1. `pnpm type-check` — 类型检查
2. `pnpm test` — 运行测试
3. `pnpm build` — 静态生成全部路由
4. 将 `.output/public` 发布到 `gh-pages` 分支

站点地址：**[https://gzx-miller.github.io](https://gzx-miller.github.io)**

### 本地预览构建产物

```bash
pnpm build
pnpm preview
```

## 新增内容

1. 在 `src/demos/` 对应子目录下新建演示组件
2. 在 `src/data/lessons.ts` 中注册课程（序号、标题、分类路由、说明和代码片段）
3. 确保左侧导航可完整展示短标题
4. 高风险逻辑补充测试（至少覆盖 store、composable 或组件交互中的一种）
5. 提交前运行 `pnpm type-check && pnpm test && pnpm build`

## 约定

- UI 文案和章节说明使用中文，变量名和文件名使用英文
- 路由保留知识类别层级（如 Vue3 使用 `/vue/...`）
- 每个内容只覆盖一个核心知识点，避免重复
- 视觉风格贴合秋日森林、红橙枫叶、暖光主题
- 提交前确保无无关生成物进入 Git

## 许可证

[Apache License 2.0](LICENSE)
