// ═══════════════════════════════════════════
// D01 - Node.js 模块系统：ESM 与 CommonJS 对比
// ═══════════════════════════════════════════

// ───────── CommonJS 风格（Node.js 默认） ─────────
// 导出：module.exports / exports
// 导入：require()
// 同步加载，运行时解析

// math.cjs (CommonJS 模块)
// function add(a, b) { return a + b }
// module.exports = { add, subtract: (a, b) => a - b }

// 导入方式
// const math = require('./math.cjs')
// const { add } = require('./math.cjs')

// ───────── ESM 风格（ECMAScript Modules） ─────────
// 导出：export / export default
// 导入：import ... from '...'
// 静态分析，编译时确定依赖，支持 Tree Shaking

// math.js (ESM 模块)
// export function add(a, b) { return a + b }
// export function subtract(a, b) { return a - b }
// export default function multiply(a, b) { return a * b }

// 导入方式
// import multiply, { add, subtract } from './math.js'
// import * as math from './math.js'

// ───────── 关键差异对比 ─────────

// 1. 加载方式
// CommonJS: 同步加载，运行时执行
// ESM: 异步加载，静态解析（支持 Top-level await）

// 2. 导出值的绑定
// CommonJS: 值拷贝（导出时快照）
// ESM: 实时绑定（引用关系，导出方变化会反映到导入方）

// 3. 文件名与 package.json 配置
// - .cjs 后缀强制 CommonJS
// - .mjs 后缀强制 ESM
// - package.json 中 "type": "module" 则 .js 默认为 ESM

// 4. 内置变量差异
// CommonJS: __dirname, __filename, require, module, exports
// ESM: 需用 import.meta.url, import.meta.dirname (Node 21+)

// ───────── 混合使用场景 ─────────

// ESM 中可以动态 import CommonJS 模块
async function loadCommonJS() {
  const cjsModule = await import('./legacy-utils.cjs')
  console.log(cjsModule.default)
}

// CommonJS 中不能直接 require ESM，需用动态 import
async function requireEsm() {
  const esmModule = await import('./modern-utils.js')
  return esmModule
}

// ───────── 最佳实践 ─────────
// 新项目推荐使用 ESM
// 库项目可同时发布两种格式（dual package）
// package.json 中 "exports" 字段定义入口点
// "exports": {
//   "import": "./dist/index.mjs",
//   "require": "./dist/index.cjs"
// }
