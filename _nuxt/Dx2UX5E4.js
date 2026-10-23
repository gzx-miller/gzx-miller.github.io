const e=`// ═══════════════════════════════════════════
// 1. 单线程与调用栈
// ═══════════════════════════════════════════

function second() { console.log('2') }
function first() { console.log('1'); second(); console.log('3') }
first()                                       // 依次输出 1 → 2 → 3（调用栈后进先出）

// ═══════════════════════════════════════════
// 2. 事件循环：先清空微任务，再取宏任务
// ═══════════════════════════════════════════

console.log('脚本开始')
setTimeout(() => console.log('宏任务 setTimeout'))            // 最后执行
queueMicrotask(() => console.log('微任务 queueMicrotask'))   // 次先执行
Promise.resolve().then(() => console.log('微任务 then'))      // 最先执行
console.log('脚本结束')
// 顺序：脚本开始 → 脚本结束 → 微任务 then → 微任务 queueMicrotask → 宏任务 setTimeout

// ═══════════════════════════════════════════
// 3. Promise 的三种状态
// ═══════════════════════════════════════════

const p = Promise.resolve('done')             // 状态只能是 pending / fulfilled / rejected
p.then(v => v)                                // 'done'   ← fulfilled 后进入 then
p.catch(e => e)                               // 未被拒绝，此回调不执行
p.finally(() => '清理')                        // 结果不变，只做收尾

// ═══════════════════════════════════════════
// 4. 组合器的差异
// ═══════════════════════════════════════════

Promise.all([Promise.resolve(1), Promise.resolve(2)])         // 全部成功 → [1, 2]
Promise.all([Promise.resolve(1), Promise.reject('err')])      // 一个拒绝 → 立即以 'err' 拒绝
Promise.allSettled([Promise.resolve(1), Promise.reject('err')])
// 结果：[{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'err' }]
Promise.race([Promise.resolve('快'), new Promise(() => {})])   // 最先落定 → '快'
Promise.any([Promise.reject('a'), Promise.resolve('b')])       // 首个成功 → 'b'
Promise.any([Promise.reject('a'), Promise.reject('b')])        // 全部失败 → 以 AggregateError 拒绝

// ═══════════════════════════════════════════
// 5. async 总返回 Promise，await 之后的时机
// ═══════════════════════════════════════════

async function f() { return 1 }
f() instanceof Promise                        // true   ← 返回值被包成 Promise
async function g() {
  console.log('await 之前同步')
  await null
  console.log('await 之后进入微任务')
}
console.log('调用 g 前'); g(); console.log('调用 g 后')
// 输出：调用 g 前 → await 之前同步 → 调用 g 后 → await 之后进入微任务

// ═══════════════════════════════════════════
// 6. 串行与并发的耗时取舍
// ═══════════════════════════════════════════

const delay = (ms) => new Promise((r) => setTimeout(r, ms))
async function serial() { for (const ms of [100, 100, 100]) await delay(ms) }   // 约 300ms
async function parallel() { await Promise.all([delay(100), delay(100), delay(100)]) } // 约 100ms

// ═══════════════════════════════════════════
// 7. 用 try/catch 处理 await 链上的拒绝
// ═══════════════════════════════════════════

async function load() {
  try { await Promise.reject(new Error('接口失败')) }
  catch (e) { e.message }                     // '接口失败'  ← await 的拒绝被当场抛出并接住
}
load()
Promise.reject(new Error('没人处理'))          // 触发 unhandledrejection 事件
window.addEventListener('unhandledrejection', (e) => {})   // 全局兜底未处理的拒绝
`;export{e as default};
