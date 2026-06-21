// 事件循环：同步 → 微任务 → 宏任务
const logs = []

logs.push('1. 同步任务')

setTimeout(() => {
  logs.push('4. 宏任务 setTimeout')
}, 0)

Promise.resolve().then(() => {
  logs.push('3. 微任务 Promise')
})

logs.push('2. 同步任务结束')

// 同步代码执行完毕后，输出：
// 1. 同步任务
// 2. 同步任务结束

// 微任务队列先于宏任务：
// 3. 微任务 Promise
// 4. 宏任务 setTimeout
