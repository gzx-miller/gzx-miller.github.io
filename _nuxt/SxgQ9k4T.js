const n=`// ═══════════════════════════════════════════
// D17 - 事件循环宏微任务
// ═══════════════════════════════════════════

// Node.js 事件循环是 Node.js 的核心机制
// 理解它能帮你写出更高效的代码

// ───────── 事件循环的 6 个阶段 ─────────

//  ┌───────────────────────────┐
//  │           计时器          │  timers
//  │   setTimeout/setInterval  │
//  └─────────────┬─────────────┘
//                │
//  ┌─────────────▼─────────────┐
//  │       挂起的回调          │  pending callbacks
//  │   一些系统回调（如 TCP）   │
//  └─────────────┬─────────────┘
//                │
//  ┌─────────────▼─────────────┐
//  │        空闲/准备          │  idle, prepare
//  │       内部使用             │
//  └─────────────┬─────────────┘
//                │
//  ┌─────────────▼─────────────┐
//  │         轮询             │  poll  ← 最常用、最重要
//  │  I/O 回调，定时器检测     │
//  └─────────────┬─────────────┘
//                │
//  ┌─────────────▼─────────────┐
//  │        检查              │  check
//  │     setImmediate          │
//  └─────────────┬─────────────┘
//                │
//  ┌─────────────▼─────────────┐
//  │      关闭回调             │  close callbacks
//  │  socket.on('close', ...)  │
//  └─────────────┬─────────────┘
//                │
//                └──── 循环 ────┘

// ───────── 宏任务 (Macrotasks) ─────────
// 每个阶段的回调都是宏任务
// 一个阶段执行完，才进入下一个阶段

// 常见宏任务：
// - setTimeout / setInterval     (timers 阶段)
// - setImmediate                 (check 阶段)
// - I/O 回调 (fs.readFile 等)     (poll 阶段)
// - network 请求回调
// - close 事件回调               (close 阶段)

// ───────── 微任务 (Microtasks) ─────────
// 在每个宏任务执行完后，立即执行所有微任务
// 微任务比宏任务优先级高

// 常见微任务（优先级从高到低）：
// 1. process.nextTick()         ← 最高优先级
// 2. Promise.then/catch/finally
// 3. queueMicrotask()
// 4. MutationObserver (浏览器)

// ───────── 执行顺序示例 ─────────

console.log('1. 同步代码开始')

// 微任务
process.nextTick(() => {
  console.log('3. process.nextTick 回调')
})

Promise.resolve().then(() => {
  console.log('4. Promise.then 回调')
})

queueMicrotask(() => {
  console.log('5. queueMicrotask 回调')
})

// 宏任务
setTimeout(() => {
  console.log('6. setTimeout 回调')

  process.nextTick(() => {
    console.log('8. setTimeout 内的 nextTick')
  })

  Promise.resolve().then(() => {
    console.log('9. setTimeout 内的 Promise')
  })
}, 0)

setImmediate(() => {
  console.log('7. setImmediate 回调')
})

console.log('2. 同步代码结束')

// 输出顺序（注意 setImmediate 和 setTimeout 0 的顺序可能不确定）：
// 1. 同步代码开始
// 2. 同步代码结束
// 3. process.nextTick 回调
// 4. Promise.then 回调
// 5. queueMicrotask 回调
// 6. setTimeout 回调  ← 或者 setImmediate 先，取决于事件循环时机
// 7. setImmediate 回调
// 8. setTimeout 内的 nextTick
// 9. setTimeout 内的 Promise

// 重要规则：
// - 同步代码先执行
// - 每个宏任务执行完后，清空所有微任务队列
// - nextTick 比 Promise 微任务先执行
// - 微任务中添加的微任务，也要等当前微任务队列清空后？
//   不！微任务执行过程中新加入的微任务，会在同一次清空

// ───────── nextTick vs setImmediate ─────────

// process.nextTick:
// - 在当前操作完成后，下一个事件循环阶段前执行
// - 不是事件循环的一部分
// - 优先级比 Promise 还高
// - 可以递归调用，会阻塞事件循环（要小心！）

// setImmediate:
// - 在 check 阶段执行
// - 是事件循环的一部分
// - 每次事件循环只执行一个（如果在回调中再调用，下一轮才执行）

// 危险：递归 nextTick 会阻塞
// function badRecursive() {
//   process.nextTick(badRecursive) // 永远不会到 I/O 阶段
// }

// 安全：递归 setImmediate 不会阻塞
// function goodRecursive() {
//   setImmediate(goodRecursive) // 每轮事件循环执行一次
// }

// ───────── setTimeout(0) vs setImmediate ─────────

// 注意：setTimeout(0) 实际上是 setTimeout(1)（Node.js 限制）
// 两者的执行顺序取决于当前事件循环的时机

// 在主模块中直接运行，顺序不确定
// setTimeout(() => console.log('timeout'), 0)
// setImmediate(() => console.log('immediate'))

// 在 I/O 回调中，setImmediate 总是先执行
// fs.readFile(__filename, () => {
//   setTimeout(() => console.log('timeout'), 0)
//   setImmediate(() => console.log('immediate'))
//   // 输出：immediate, timeout
//   // 因为 I/O 回调在 poll 阶段，下一个是 check 阶段
// })

// ───────── 经典面试题 ─────────

console.log('同步1')

setTimeout(() => console.log('setTimeout1'), 0)
setTimeout(() => {
  console.log('setTimeout2')
  process.nextTick(() => console.log('nextTick in setTimeout'))
  Promise.resolve().then(() => console.log('Promise in setTimeout'))
}, 0)

setImmediate(() => console.log('setImmediate1'))
setImmediate(() => {
  console.log('setImmediate2')
  process.nextTick(() => console.log('nextTick in setImmediate'))
})

Promise.resolve().then(() => {
  console.log('Promise1')
  process.nextTick(() => console.log('nextTick in Promise'))
})

process.nextTick(() => console.log('nextTick1'))
process.nextTick(() => {
  console.log('nextTick2')
  Promise.resolve().then(() => console.log('Promise in nextTick'))
})

console.log('同步2')

// 执行顺序分析：
// 同步：同步1 → 同步2
// 微任务（nextTick 先）:
//   nextTick1 → nextTick2 → Promise1 → nextTick in Promise → Promise in nextTick
// 宏任务 timers 阶段:
//   setTimeout1 → setTimeout2
//   然后清空微任务：nextTick in setTimeout → Promise in setTimeout
// 宏任务 check 阶段:
//   setImmediate1 → setImmediate2
//   然后清空微任务：nextTick in setImmediate

// ───────── 不要阻塞事件循环 ─────────

// 事件循环被阻塞的后果：
// - 无法响应新请求
// - 定时器不准时
// - 所有 I/O 回调都被延迟

// 阻塞事件循环的常见操作：
// - 大循环、复杂计算
// - JSON.parse / JSON.stringify 大对象
// - 正则表达式回溯
// - 同步文件操作（fs.readFileSync）
// - 加密解密大量数据

// 解决方案：
// - CPU 密集任务用 Worker Threads
// - 大循环拆分成多个小块（setImmediate 分片）
// - 使用异步 API，不用同步 API
// - 大文件用 Stream

// 分片处理示例
// async function processLargeArray(arr) {
//   const BATCH_SIZE = 1000
//   for (let i = 0; i < arr.length; i += BATCH_SIZE) {
//     const batch = arr.slice(i, i + BATCH_SIZE)
//     processBatch(batch)
//     // 让出事件循环
//     await new Promise(r => setImmediate(r))
//   }
// }

// ───────── 最佳实践 ─────────
// 理解宏任务和微任务的执行顺序
// 不要在事件循环中执行 CPU 密集操作
// 递归操作用 setImmediate，不要用 process.nextTick
// Promise.then 是微任务，比 setTimeout 快
// I/O 密集用异步 API，CPU 密急用 Worker
// 监控事件循环延迟，发现性能问题
// 使用 setImmediate 让出事件循环给其他回调
`;export{n as default};
