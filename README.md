# 🐿️ 小松鼠举栗子

> 中文软件技术知识案例库 — 通过独立真实案例学习前端、多媒体、系统编程与 AI 技术

**在线浏览：[https://gzx-miller.github.io](https://gzx-miller.github.io)**

基于 **Nuxt 4 + Vue 3 + TypeScript + Pinia + Element Plus** 构建，采用静态站点生成（SSG），每个知识点都是一个可独立访问的交互式案例页面。

## 特性

- **300+ 个独立案例**，覆盖 18 个软件技术知识分类
- **交互式演示** — 每个案例包含可运行的 Demo、关键代码、原理说明、处理流程和注意事项
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
| [Vue3](https://gzx-miller.github.io/vue) | 28 | 13 | 组合式 API、组件、路由、状态管理、过渡动画、插件开发 |
| [React](https://gzx-miller.github.io/react) | 24 | 18 | Hooks、并发渲染、错误边界、Portal、自定义 Hook |
| [Next.js](https://gzx-miller.github.io/nextjs) | 24 | 12 | App Router、服务端组件、数据获取、Server Actions、部署优化 |
| [JavaScript](https://gzx-miller.github.io/javascript) | 24 | 6 | 类型系统、闭包、原型链、异步机制、迭代器、Proxy |
| [CSS](https://gzx-miller.github.io/css) | 20 | 17 | 选择器、盒模型、Flexbox/Grid、定位、动画、容器查询 |
| [Nuxt](https://gzx-miller.github.io/nuxt) | 20 | 10 | 文件路由、中间件、Nitro、SSR/SSG、模块生态 |
| [Element Plus](https://gzx-miller.github.io/element-plus) | 20 | 7 | 表单、表格、弹窗、导航、数据展示、反馈组件 |
| [LangChain](https://gzx-miller.github.io/langchain) | 18 | 11 | LLM 调用、RAG、Agent、LangGraph、流式输出、部署优化 |
| [TypeScript](https://gzx-miller.github.io/typescript) | 18 | 4 | 泛型、条件类型、映射类型、声明文件、编译器配置 |
| [Tailwind CSS](https://gzx-miller.github.io/tailwind-css) | 16 | 8 | 原子化类、响应式变体、暗色模式、容器查询、v4 CSS-first |
| [Sass](https://gzx-miller.github.io/sass) | 16 | 7 | 模块系统、Mixin、函数、内置模块、选择器进阶 |
| [工程化](https://gzx-miller.github.io/engineering) | 16 | 5 | CI/CD、E2E 测试、性能预算、Docker、微前端、i18n |
| [Node.js](https://gzx-miller.github.io/nodejs) | 16 | 8 | 模块系统、流、HTTP、Worker 线程、WebSocket、数据库 |
| [Vite](https://gzx-miller.github.io/vite) | 16 | 10 | 配置、插件、HMR、环境变量、构建优化、库模式、SSR |
| [C++](https://gzx-miller.github.io/cpp) | 24 | 12 | 内存管理、面向对象、模板、STL、现代 C++ 核心特性 |
| [Electron](https://gzx-miller.github.io/electron) | 20 | 8 | 主进程与渲染进程、IPC 通信、窗口管理、原生菜单、系统托盘 |
| [FFmpeg](https://gzx-miller.github.io/ffmpeg) | 24 | 24 | 格式转换、视频/音频处理、滤镜效果、字幕、流媒体、硬件加速 |

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
│   ├── demos/               # 案例演示组件
│   │   ├── *.vue            # Vue/Element/CSS/Nuxt 等案例
│   │   ├── js-code/         # JavaScript 纯代码案例
│   │   ├── ts-code/         # TypeScript 纯代码案例
│   │   ├── react-jsx/       # React JSX 案例
│   │   └── state-react/     # React 状态管理案例
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

## 新增案例

1. 在 `src/demos/` 对应子目录下新建演示组件
2. 在 `src/data/lessons.ts` 中注册课程（序号、标题、分类路由、说明和代码片段）
3. 确保左侧导航可完整展示短标题
4. 高风险逻辑补充测试（至少覆盖 store、composable 或组件交互中的一种）
5. 提交前运行 `pnpm type-check && pnpm test && pnpm build`

## 约定

- UI 文案和章节说明使用中文，变量名和文件名使用英文
- 路由保留知识类别层级（如 Vue3 使用 `/vue/...`）
- 每个案例只覆盖一个核心知识点，避免重复
- 视觉风格贴合秋日森林、红橙枫叶、暖光主题
- 提交前确保无无关生成物进入 Git

## 许可证

[Apache License 2.0](LICENSE)
