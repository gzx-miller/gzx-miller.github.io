const e=`// ═══════════════════════════════════════════
// 1. 事件循环六阶段首尾相接
// ═══════════════════════════════════════════

import { readFile } from 'node:fs'

// 一圈依次扫过六个阶段，走完再从头开始
const phases = ['timers', 'pending', 'idle,prepare', 'poll', 'check', 'close']
// timers  ：到期的 setTimeout / setInterval 回调
// pending ：上一轮遗留的系统级回调（如 TCP 错误）
// poll    ：I/O 回调，队列空时在此稍作等待
// check   ：setImmediate 回调
// close   ：socket.on('close') 等关闭回调
console.log(phases.length)                    // 结果：6

// ═══════════════════════════════════════════
// 2. 微任务分两条队列，nextTick 优先于 Promise
// ═══════════════════════════════════════════

console.log('sync start')                     // 结果：同步代码最先跑
process.nextTick(() => console.log('nextTick'))       // 结果：独立队列，最先清空
Promise.resolve().then(() => console.log('promise'))  // 结果：紧跟 nextTick 之后
console.log('sync end')                       // 结果：两个微任务排在它后面
// 输出：sync start → sync end → nextTick → promise

// ═══════════════════════════════════════════
// 3. 每阶段结束先清 nextTick 再清 Promise
// ═══════════════════════════════════════════

setTimeout(() => {
  console.log('timer')                        // 结果：宏任务，timers 阶段执行
  process.nextTick(() => console.log('timer: nextTick'))      // 结果：本阶段先清它
  Promise.resolve().then(() => console.log('timer: promise')) // 结果：紧接其后
}, 0)
// 这一组微任务会在进入下一阶段前被整体清空

// ═══════════════════════════════════════════
// 4. I/O 回调中 setImmediate 先于 setTimeout(0)
// ═══════════════════════════════════════════

readFile(import.meta.filename, () => {
  setTimeout(() => console.log('timeout'), 0)   // 结果：要再等一圈回到 timers
  setImmediate(() => console.log('immediate'))  // 结果：poll 的下一站是 check，必然更早
})

// ═══════════════════════════════════════════
// 5. 递归 nextTick 会饿死事件循环
// ═══════════════════════════════════════════

function badRecursive() {
  process.nextTick(badRecursive)              // 说明：每阶段前被反复清空，I/O 永远排不上
}

function goodRecursive() {
  setImmediate(goodRecursive)                 // 结果：Check 每轮只跑一次，让出控制权
}
`;export{e as default};
