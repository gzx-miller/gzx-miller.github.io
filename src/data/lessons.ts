export interface Lesson {
  id: string
  title: string
  navTitle: string
  category: string
  path: string
  summary: string
  demo?: any // Vue 组件，使用 any 避免导入 vue
  code?: () => Promise<string> // 返回源码的函数
  language?: string
  principle?: string
  flow?: string[]
  notes?: string[]
  problem?: string
  officialUrl?: string
}

export interface KnowledgeCategory {
  id: string
  name: string
  path: string
  status: string
  intro: string
  officialUrl?: string
}

export const knowledgeCategories: KnowledgeCategory[] = [
  { id: 'javascript', name: 'JavaScript', path: '/javascript', status: 'ready', intro: 'JavaScript 是 Web 平台的核心语言。本分类从类型、函数和对象模型出发，逐步覆盖异步机制、模块化与浏览器事件。', officialUrl: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript' },
  { id: 'typescript', name: 'TypeScript', path: '/typescript', status: 'ready', intro: 'TypeScript 为 JavaScript 增加可渐进采用的静态类型系统。本分类以 Vue 3 真实业务数据为背景，覆盖建模、收窄、泛型、类型操作与组件类型实践。', officialUrl: 'https://www.typescriptlang.org/' },
  { id: 'vue', name: 'Vue3', path: '/vue', status: 'ready', intro: 'Vue3 是渐进式 JavaScript 框架。本分类用真实小业务场景拆解组合式 API、组件、路由、状态管理和工程实践。', officialUrl: 'https://vuejs.org/' },
  { id: 'element-plus', name: 'Element Plus', path: '/element-plus', status: 'ready', intro: 'Element Plus 是基于 Vue 3 的组件库，提供丰富的企业级 UI 组件，覆盖表格、表单、弹窗、导航等常见场景。', officialUrl: 'https://element-plus.org/' },
  { id: 'nestjs', name: 'Nest.js', path: '/nestjs', status: 'ready', intro: 'NestJS 是构建高效、可扩展 Node.js 服务端应用的企业级框架。本分类从模块化架构出发，覆盖依赖注入、控制器与路由、管道校验、守卫鉴权、拦截器、中间件、异常过滤器、TypeORM 数据库、WebSocket 网关、定时任务、配置管理与微服务。', officialUrl: 'https://docs.nestjs.com/' },
  { id: 'nuxt', name: 'Nuxt', path: '/nuxt', status: 'ready', intro: 'Nuxt 是基于 Vue 3 的全栈框架，内置文件路由、自动导入、SSR/SSG、服务端 API 等能力，让 Vue 项目从单页应用升级为全栈应用。', officialUrl: 'https://nuxt.com/' },
  { id: 'nodejs', name: 'Node.js', path: '/nodejs', status: 'ready', intro: 'Node.js 让 JavaScript 运行在服务端和工具链中。本分类覆盖模块、文件、事件、流、HTTP、进程、测试、安全与依赖管理。', officialUrl: 'https://nodejs.org/docs/latest/api/' },
  { id: 'css', name: 'CSS', path: '/css', status: 'ready', intro: 'CSS 是 Web 样式的核心语言。本分类从选择器、盒模型、布局系统出发，逐步覆盖定位、层叠、变量、动画、响应式、裁剪、逻辑属性、容器查询与性能优化。', officialUrl: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS' },
  { id: 'tailwind-css', name: 'Tailwind CSS', path: '/tailwind-css', status: 'ready', intro: 'Tailwind CSS 以原子化工具类直接组合界面。本分类基于 v4 的 CSS-first 模型，覆盖响应式、状态变体、主题令牌、暗色模式、任意值与容器查询。', officialUrl: 'https://tailwindcss.com/docs' },
  { id: 'sass', name: 'Sass', path: '/sass', status: 'ready', intro: 'Sass 为 CSS 增加模块、变量、嵌套、Mixin、函数与集合操作。本分类使用现代模块系统组织可维护样式，避开已弃用的 @import 工作流。', officialUrl: 'https://sass-lang.com/documentation/' },
  { id: 'vite', name: 'Vite', path: '/vite', status: 'ready', intro: 'Vite 是新一代前端构建工具，以原生 ESM 开发服务器和基于 Rollup 的生产构建为核心。本分类覆盖配置、插件、HMR、环境变量、静态资源、依赖预构建、构建优化、MPA、库模式、SSR、CSS、TypeScript、代理、性能分析与自定义插件。', officialUrl: 'https://vite.dev/' },
  { id: 'react', name: 'React', path: '/react', status: 'ready', intro: 'React 以组件和声明式渲染组织用户界面。本分类基于 React 19.2，通过浏览器 ES Module 直接引用 React，不向当前 Vue3 工程安装 React 依赖。', officialUrl: 'https://react.dev/' },
  { id: 'nextjs', name: 'Next.js', path: '/nextjs', status: 'ready', intro: 'Next.js 是基于 React 的全栈框架，以 App Router 为核心，覆盖文件路由、服务端/客户端组件、数据获取与缓存、Server Actions、Route Handlers、流式渲染、图片/字体优化、SEO、中间件与部署。', officialUrl: 'https://nextjs.org/docs' },
  { id: 'langchain', name: 'LangChain', path: '/langchain', status: 'ready', intro: 'LangChain.js 是构建 LLM 应用的开源框架，提供模型调用、提示模板、链式调用、RAG 检索增强生成等核心能力，帮助开发者快速搭建智能应用。', officialUrl: 'https://js.langchain.com/' },
  { id: 'cpp', name: 'C++', path: '/cpp', status: 'ready', intro: 'C++ 是高效、灵活的系统级编程语言，兼具面向对象与泛型编程能力。本分类从基础语法出发，逐步覆盖内存管理、面向对象、模板、STL、现代 C++（C++11/14/17/20/23）核心特性与工程实践，帮助开发者建立完整的 C++ 知识体系。', officialUrl: 'https://en.cppreference.com/' },
  { id: 'electron', name: 'Electron', path: '/electron', status: 'ready', intro: 'Electron 使用 Web 技术构建跨平台桌面应用。本分类覆盖主进程与渲染进程、IPC 通信、窗口管理、原生菜单、系统托盘、自动更新、打包分发与安全最佳实践。', officialUrl: 'https://www.electronjs.org/' },
  { id: 'ffmpeg', name: 'FFmpeg', path: '/ffmpeg', status: 'ready', intro: 'FFmpeg 是领先的多媒体框架，支持视频/音频的录制、转换、流化和编辑。本分类从容器与编解码器基础出发，覆盖格式转换、视频/音频处理、滤镜效果、字幕、流媒体、硬件加速与批量处理，帮助开发者掌握命令行多媒体处理的核心能力。', officialUrl: 'https://ffmpeg.org/' },
  { id: 'webgl', name: 'WebGL', path: '/webgl', status: 'ready', intro: 'WebGL 是浏览器中的 GPU 3D 图形 API，基于 OpenGL ES。本分类从着色器编程和缓冲区基础出发，覆盖矩阵变换、纹理贴图、光照模型、阴影映射、后处理、WebGL2 新特性、实例化渲染、粒子系统与性能优化。', officialUrl: 'https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API' },
]

// 创建分类 ID 到分类对象的映射（用于快速查找）
export const knowledgeCategoryMap = new Map<string, KnowledgeCategory>()
for (const category of knowledgeCategories) {
  knowledgeCategoryMap.set(category.id, category)
}

// 使用 import.meta.glob 预声明所有分类课程文件
// 返回: { './lessons/vue.ts': () => Promise<Module> }
const lessonGlob = import.meta.glob('./lessons/*.ts', { eager: false })

// 构建 categoryId -> loader 映射
const categoryModuleMap: Record<string, () => Promise<any>> = {}
for (const [path, loader] of Object.entries(lessonGlob)) {
  const match = path.match(/\.\/lessons\/([^/]+)\.ts$/)
  if (match) {
    categoryModuleMap[match[1]] = loader as () => Promise<any>
  }
}

// 缓存（使用普通变量，不代理）
const lessonsCache: Record<string, Lesson[]> = {}
const lessonPathMapCache: Map<string, Lesson> = new Map()
const lessonIdMapCache: Map<string, Lesson> = new Map()

// 获取分类的课程（动态加载）
export async function getLessonsByCategory(categoryId: string): Promise<Lesson[]> {
  // 如果已缓存，直接返回
  if (lessonsCache[categoryId]) {
    return lessonsCache[categoryId]
  }

  // 通过 glob 加载分类数据
  const loader = categoryModuleMap[categoryId]
  if (!loader) {
    console.warn(`No lesson module found for category: ${categoryId}`)
    return []
  }

  try {
    const module = await loader()
    const lessons = module.lessons as Lesson[]

    // 更新缓存（普通对象，不代理）
    lessonsCache[categoryId] = lessons

    // 更新映射表
    for (const lesson of lessons) {
      lessonPathMapCache.set(lesson.path, lesson)
      lessonIdMapCache.set(lesson.id, lesson)
    }

    return lessons
  } catch (error) {
    console.warn(`Failed to load lessons for category: ${categoryId}`, error)
    return []
  }
}

// 获取所有课程（按需加载所有分类）
export async function getAllLessons(): Promise<Lesson[]> {
  const allLessons: Lesson[] = []
  for (const category of knowledgeCategories) {
    const lessons = await getLessonsByCategory(category.id)
    allLessons.push(...lessons)
  }
  return allLessons
}

// 同步获取已加载的课程（用于已加载数据的场景）
export function getLoadedLessonsByCategory(categoryId: string): Lesson[] {
  return lessonsCache[categoryId] ?? []
}

// 同步获取路径映射（仅返回已加载的）
export function getLessonByPath(path: string): Lesson | undefined {
  return lessonPathMapCache.get(path)
}

// 同步获取 ID 映射（仅返回已加载的）
export function getLessonById(id: string): Lesson | undefined {
  return lessonIdMapCache.get(id)
}

// 为了兼容现有代码，导出一个空的 lessons 数组（不建议使用）
// 新代码应该使用 getLessonsByCategory 或 getAllLessons
export const lessons: Lesson[] = []
