// ═══════════════════════════════════════════
// 1. CommonJS：同步 require，值拷贝导出
// ═══════════════════════════════════════════

// counter.cjs —— 模块内部维护一个自增计数器
let count = 0                                  // 模块作用域变量，不污染全局
function increment() { count += 1 }            // 每次调用把 count 加一
const counterModule = { count, increment }     // 导出那一刻的 count 被快照成值

counterModule.increment()                      // 模拟引用方调用模块内部自增
console.log(counterModule.count)               // 结果：0，值拷贝拿不到后续变化

// ═══════════════════════════════════════════
// 2. ES Modules：静态 import，实时绑定导出
// ═══════════════════════════════════════════

// counter.mjs —— 同样的自增逻辑
// export let count = 0
// export function increment() { count += 1 }
// app.mjs —— 引用方
// import { count, increment } from './counter.mjs'
// increment()
// console.log(count)                          // 结果：1，实时绑定读到最新值

// ═══════════════════════════════════════════
// 3. 模块格式由扩展名与 type 字段决定
// ═══════════════════════════════════════════

// package.json
// { "type": "module" }                        // .js 按 ESM 解释；缺省则按 CommonJS
const esmExtensions = ['.mjs', '.mts']         // .mjs 恒为 ESM
const cjsExtensions = ['.cjs', '.cts']         // .cjs 恒为 CommonJS
console.log(esmExtensions.length + cjsExtensions.length)   // 结果：4，两类强制后缀

// ═══════════════════════════════════════════
// 4. 跨格式互操作：默认导出即 module.exports
// ═══════════════════════════════════════════

// utils.cjs —— 老模块用 CommonJS 导出
// const { join } = require('node:path')
// module.exports = { greet: (name) => `Hello, ${name}` }
// app.mjs —— ESM 导入 CommonJS，default 即 module.exports
// import utils from './utils.cjs'
// console.log(utils.greet('栗子'))            // 结果：Hello, 栗子
// legacy.cjs —— CommonJS 只能异步动态 import 一个 ESM
// const { greet } = await import('./app.mjs')

// ═══════════════════════════════════════════
// 5. 双格式发布：exports 字段分设入口
// ═══════════════════════════════════════════

// package.json
// "exports": {
//   "import": "./dist/index.mjs",             // ESM 走这里
//   "require": "./dist/index.cjs"             // CommonJS 走这里
// }
const moduleEntryKeys = ['import', 'require']  // 一份源码，两套入口
console.log(moduleEntryKeys.join(' / '))       // 结果：import / require
