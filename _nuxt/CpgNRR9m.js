const n=`// tsconfig 编译配置：用类型理解核心选项的影响

// ── strict 模式：启用所有严格类型检查选项 ──
// strict: true 等价于启用以下所有选项：
// - noImplicitAny: 禁止隐式 any
// - noImplicitThis: 禁止 this 隐式 any
// - strictNullChecks: 严格空值检查
// - strictFunctionTypes: 严格函数类型
// - strictBindCallApply: 严格 bind/call/apply
// - strictPropertyInitialization: 严格属性初始化
// - alwaysStrict: 始终使用严格模式

// noImplicitAny 示例：开启后下面代码会报错
// function add(a, b) {  // 错误：参数 a、b 隐式具有 any 类型
//   return a + b
// }
function add(a: number, b: number): number {  // 正确：显式标注类型
  return a + b
}

// strictNullChecks 示例：开启后 null/undefined 不能赋值给其他类型
// let name: string = null  // 错误：不能将 null 赋值给 string
let name: string | null = null  // 正确：显式声明联合类型
name = 'TypeScript'

// strictNullChecks 下的可选链与空值合并
interface User {
  profile?: {
    address?: {
      city?: string
    }
  }
}

const user: User = {}
const city = user.profile?.address?.city ?? '未知'
// city 类型为 string | undefined → 经 ?? 后为 string

// ── target：编译输出的 JavaScript 版本 ──
// target 影响可用的语法和内置类型
// ES5 → 不支持 Promise、Map、Set 等（需 polyfill）
// ES2015/ES6 → 支持 Promise、类、箭头函数等
// ES2020 → 支持可选链、空值合并、BigInt 等
// ESNext → 最新特性

// target 为 ES5 时，下面的语法会被转译
const greet = (name: string): string => \`Hello, \${name}!\`
// 会转译为：function greet(name) { return "Hello, " + name + "!"; }

// ── module：模块系统 ──
// module 决定编译后的模块格式
// - CommonJS: Node.js 传统格式 (require/module.exports)
// - ES2015/ESNext: ES 模块 (import/export)
// - AMD: 浏览器端异步模块
// - UMD: 通用模块定义（兼容浏览器+Node.js）

// 模块解析策略
// - classic: 旧版解析方式
// - node: Node.js 风格解析
// - bundler: 适合 Vite、Webpack 等打包工具

// ── paths 与 baseUrl：模块别名 ──
// 配合 baseUrl 和 paths 可以配置路径别名
// 例如：
// {
//   "baseUrl": ".",
//   "paths": {
//     "@/*": ["src/*"],
//     "@components/*": ["src/components/*"]
//   }
// }

// 配置后可以这样导入：
// import Button from '@/components/Button'
// 而不是：
// import Button from '../../components/Button'

// ── lib：编译时可用的内置库类型 ──
// lib 决定哪些全局类型可用
// - ES2020: ES2020 标准库类型
// - DOM: 浏览器 DOM 类型（document、window 等）
// - DOM.Iterable: DOM 可迭代类型
// - WebWorker: Web Worker 类型

// 例如：node 环境项目通常不需要 DOM 类型
// { "lib": ["ES2020"] }
// 前端项目通常需要 DOM 类型
// { "lib": ["ES2020", "DOM", "DOM.Iterable"] }

// ── declaration 与 declarationDir ──
// declaration: true → 生成 .d.ts 声明文件
// declarationDir → 声明文件输出目录
// 适合开发库时使用，让使用者获得类型提示

// ── skipLibCheck：跳过库文件类型检查 ──
// skipLibCheck: true → 跳过 .d.ts 文件的类型检查
// 可以加快编译速度，避免第三方库类型冲突

console.log('tsconfig 配置演示完成')
`;export{n as default};
