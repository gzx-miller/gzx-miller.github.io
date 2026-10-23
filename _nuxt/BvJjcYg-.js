const n=`// ═══════════════════════════════════════════
// 1. 模块作用域与默认严格模式
// ═══════════════════════════════════════════

// 每个模块拥有独立作用域，顶层变量不会挂到全局对象上
// 经典脚本：var count = 0  →  window.count === 0
// 模块脚本：var count = 0  →  全局取不到这个 count

function readThis() { return this }        // 直接调用，this 为 undefined
readThis()                                 // undefined ← 严格模式生效

// 顶层 this 在模块里也不是全局对象
// 给未声明变量赋值会直接抛 ReferenceError，而不是静默写坏全局

// ═══════════════════════════════════════════
// 2. 具名导出与默认导出
// ═══════════════════════════════════════════

// // 导出方：具名导出可以有多个，默认导出通常只有一个
// export const taxRate = 0.06
// export function calcTotal(price) { return price * (1 + 0.06) }
// export default class Cart { /* 主体类 */ }

// // 导入方：花括号内取具名导出，花括号外是默认导出
// import Cart, { taxRate, calcTotal } from './cart.js'

// ═══════════════════════════════════════════
// 3. 重命名导出：两边都能改名
// ═══════════════════════════════════════════

// // 导入时重命名，避免与本地名字冲突
// import { fetchCourses as loadCourses } from './api.js'
// // 导出时重命名，对外名字与内部实现名解耦
// export { inner as outer }

// ═══════════════════════════════════════════
// 4. 导入是只读的实时绑定
// ═══════════════════════════════════════════

const state = { _n: 0 }
const counter = { get n() { return state._n } }   // 模拟模块的实时绑定
state._n = 5
counter.n                                  // 5   ← 读到的是最新值，不是快照
state._n = 9
counter.n                                  // 9   ← 绑定持续反映内部变化
// 该绑定只读：试图 counter.n = 1 会抛 TypeError，导入方不能重新赋值

// ═══════════════════════════════════════════
// 5. 静态导入便于依赖分析与 Tree Shaking
// ═══════════════════════════════════════════

// // 静态导入写在顶层，路径是字面量，打包器无需运行即可算出依赖图
// import { add } from './math.js'
// // math.js 里的 subtract 若无他处引用，打包时会被整段移除

// ═══════════════════════════════════════════
// 6. 动态 import() 返回 Promise
// ═══════════════════════════════════════════

typeof import('./charts.js')               // 'object'  ← 拿到的是 Promise
const charts = await import('./charts.js') // 兑现为模块命名空间对象
charts.default                             // 该模块的默认导出
typeof charts                              // 'object'
// 动态导入是天然的分割点，被导入的模块会拆成独立 chunk 按需拉取
// 路由懒加载就是每个页面动态导入：访问到哪条路由才加载哪段代码

// ═══════════════════════════════════════════
// 7. 顶层 await：仅模块顶层可用
// ═══════════════════════════════════════════

const me = await fetch('/api/me').then((r) => r.json())   // 模块顶层直接 await
me.name                                    // 有值  ← 模块会等它就绪后才算初始化完成
// 注意：函数内部仍要写 async 才能用 await，顶层 await 只在模块最外层生效

// ═══════════════════════════════════════════
// 8. 环形依赖的初始化陷阱
// ═══════════════════════════════════════════

// a.js 顶层 import b.js，b.js 顶层又 import a.js
// b.js 开始执行时 a.js 还没执行完，此刻从 a.js 读到的绑定尚未初始化
// 结果：拿到 undefined，且通常不报错，行为却诡异地失效

let ready = false
const readReady = () => ready        // 闭包读到的始终是绑定，而非快照
ready = true
readReady()                          // true  ← 推迟到调用时读，才拿到已初始化的值
// 规避环形依赖：把共享部分抽成第三个小模块，或把跨模块取值推迟到函数调用时
`;export{n as default};
