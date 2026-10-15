// ═══════════════════════════════════════════
// 1. setTimeout / setInterval 落在 timers 阶段
// ═══════════════════════════════════════════

import { setTimeout, setInterval, clearTimeout, clearInterval, setImmediate } from 'node:timers'

const oneShot = setTimeout(() => console.log('1s 到'), 1000)   // 说明：到期后在 timers 阶段执行
clearTimeout(oneShot)                                          // 说明：取消后不再触发

let ticks = 0
const ticker = setInterval(() => {
  ticks += 1
  console.log(`第 ${ticks} 次`)                                // 结果：按间隔反复触发
  if (ticks >= 3) clearInterval(ticker)                        // 说明：达标后停表
}, 200)

// ═══════════════════════════════════════════
// 2. setImmediate 在 check 阶段，nextTick 是微任务
// ═══════════════════════════════════════════

process.nextTick(() => console.log('nextTick'))     // 结果：微任务，优先于 Promise
Promise.resolve().then(() => console.log('promise'))// 结果：紧跟 nextTick（同一批清空）
setTimeout(() => console.log('timer'), 0)           // 结果：timers 阶段执行
setImmediate(() => console.log('immediate'))        // 结果：check 阶段执行
// 顶层顺序：nextTick → promise → timer / immediate（后两者不确定）

// ═══════════════════════════════════════════
// 3. setTimeout(fn, 0) 至少按 1ms，且不保证准时
// ═══════════════════════════════════════════

const started = Date.now()
setTimeout(() => console.log(Date.now() - started), 0)  // 结果：>= 1，拥挤时更晚

// ═══════════════════════════════════════════
// 4. setInterval 会长间隔漂移，改用递归 setTimeout
// ═══════════════════════════════════════════

let rounds = 0
function repeat() {
  rounds += 1                                          // 说明：回调执行时间不再累积
  if (rounds <= 3) setTimeout(repeat, 200)             // 说明：跑完这次再排下一次
}
repeat()

// ═══════════════════════════════════════════
// 5. unref / ref 与超大延时溢出
// ═══════════════════════════════════════════

const idle = setTimeout(() => {}, 60_000)
idle.unref()                                           // 说明：不阻止进程退出
idle.ref()                                             // 说明：恢复为阻止退出

setTimeout(() => console.log('overflow'), 2 ** 31)     // 结果：溢出为 1，立即执行

// ═══════════════════════════════════════════
// 6. node:timers/promises 的 Promise 版定时器
// ═══════════════════════════════════════════

import { setTimeout as delay } from 'node:timers/promises'

async function wait() {
  await delay(500)                                     // 说明：await 风格，无需回调
  const value = await delay(200, 'done')               // 结果：200ms 后拿到值 'done'
  return value
}
