// ═══════════════════════════════════════════
// D25 - timers 定时器详解
// ═══════════════════════════════════════════

import { setTimeout, setInterval, setImmediate, clearTimeout, clearInterval, clearImmediate } from 'node:timers'
import { setTimeout as setTimeoutPromise } from 'node:timers/promises'

// ───────── setTimeout ─────────
// 在指定毫秒后执行一次回调

console.log('1. 开始')

const timer1 = setTimeout(() => {
  console.log('3. 1秒后执行')
}, 1000)

// 可以提前取消
// clearTimeout(timer1)

console.log('2. setTimeout 已设置')

// 注意：实际延迟可能比指定的长
// 原因：事件循环调度、系统负载、其他任务阻塞

// setTimeout(fn, 0) 也不是立即执行
// 会进入 timers 阶段，至少等一轮事件循环

// setTimeout(fn, 1) 和 setTimeout(fn, 0) 实际一样
// Node.js 会把 0 转为 1ms

// ───────── setInterval ─────────
// 每隔指定毫秒重复执行回调

let count = 0
const intervalId = setInterval(() => {
  count++
  console.log(`间隔执行: 第 ${count} 次`)

  if (count >= 3) {
    clearInterval(intervalId)
    console.log('停止间隔执行')
  }
}, 200)

// 注意：setInterval 的问题
// 如果回调执行时间 > 间隔时间，会出现累积
// 比如间隔 100ms，回调执行 200ms
// 结果：回调会一个接一个，没有间隔

// 更安全的方式：递归 setTimeout
function repeat(fn, interval) {
  const timer = { id: null }

  function run() {
    fn()
    timer.id = setTimeout(run, interval)
  }

  timer.id = setTimeout(run, interval)
  return () => clearTimeout(timer.id)
}

// 使用：
// const stop = repeat(() => {
//   console.log('递归 setTimeout 执行')
// }, 500)
// 之后 stop() 停止

// 好处：确保两次执行之间至少间隔指定时间
// 不会因为回调慢而累积

// ───────── setImmediate ─────────
// 在当前事件循环的 check 阶段执行

setImmediate(() => {
  console.log('setImmediate 回调')
})

// setImmediate vs setTimeout(0)
// 在主模块中，顺序不确定
// 在 I/O 回调中，setImmediate 总是先执行

import fs from 'node:fs'
import path from 'node:path'

fs.readFile(path.resolve('.'), () => {
  setTimeout(() => {
    // console.log('I/O 内的 setTimeout')
  }, 0)

  setImmediate(() => {
    // console.log('I/O 内的 setImmediate')
  })
  // 总是 setImmediate 先执行
  // 因为 I/O 回调在 poll 阶段，下一个是 check 阶段
})

// ───────── Promise 版本 (timers/promises) ─────────

// async/await 风格的定时器
async function delayExample() {
  console.log('等待 1 秒...')
  await setTimeoutPromise(1000)
  console.log('1 秒到了！')

  // 带值传递
  const result = await setTimeoutPromise(500, '完成')
  console.log('结果:', result)
}

// delayExample()

// 也可以用 AbortController 取消
// const ac = new AbortController()
// setTimeoutPromise(1000, '结果', { signal: ac.signal })
//   .then(console.log)
//   .catch(err => console.log('已取消:', err.name))
// ac.abort() // 取消

// ───────── 不精确的原因 ─────────

// 1. 事件循环阶段
//    定时器回调在 timers 阶段执行
//    如果当前正在执行其他阶段的回调，需要等

// 2. 最小延迟
//    setTimeout(fn, 0) 实际是 setTimeout(fn, 1)
//    setInterval 最小间隔约 1ms

// 3. 任务队列
//    同一时间点有多个定时器，依次执行
//    前一个慢了，后面的都会延迟

// 4. 系统负载
//    CPU 繁忙时，调度可能延迟

// 5. 嵌套定时器最小间隔
//    嵌套超过 5 层后，最小间隔变为 4ms
//    （浏览器规范，Node.js 也遵循类似规则）

// 示例：嵌套延迟
let level = 0
function nested() {
  level++
  if (level > 10) return
  const start = Date.now()
  setTimeout(() => {
    const delay = Date.now() - start
    console.log(`第 ${level} 层嵌套: 实际延迟 ${delay}ms`)
    nested()
  }, 0)
}
// nested()

// ───────── 定时器的 this 问题 ─────────

const obj = {
  name: 'test',
  delayed() {
    // 错误：setTimeout 回调中 this 不是 obj
    // setTimeout(function() {
    //   console.log(this.name) // undefined (非严格模式下是 global)
    // }, 100)

    // 正确1：箭头函数
    setTimeout(() => {
      console.log(this.name) // 'test'
    }, 100)

    // 正确2：bind
    // setTimeout(function() {
    //   console.log(this.name)
    // }.bind(this), 100)

    // 正确3：保存 this
    // const self = this
    // setTimeout(function() {
    //   console.log(self.name)
    // }, 100)
  }
}

// ───────── 常见使用模式 ─────────

// 1. 防抖 (Debounce)
//    事件停止后等待一段时间才执行
//    用于：输入框搜索、窗口 resize

function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 2. 节流 (Throttle)
//    保证在一段时间内最多执行一次
//    用于：滚动事件、按钮防重复点击

function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// 3. 超时取消
function withTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('超时'))
    }, timeoutMs)

    promise
      .then((result) => {
        clearTimeout(timer)
        resolve(result)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

// 用 AbortController 更现代
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal
    })
    return response
  } finally {
    clearTimeout(id)
  }
}

// ───────── 常见问题 ─────────

// 1. 内存泄漏
//    忘记 clearInterval / clearTimeout
//    特别是组件卸载时要清理

// 2. this 指向错误
//    用箭头函数或 bind 解决

// 3. 递归 setInterval 导致的重复执行
//    用递归 setTimeout 代替

// 4. 依赖定时器精确性
//    定时器不保证精确，不要用于高精度计时
//    高精度用 performance.now() 计算

// 5. setTimeout(fn, 0) 不立即执行
//    要立即执行用 process.nextTick 或 Promise

// ───────── 最佳实践 ─────────
// 不要依赖定时器的精确性
// 长时间间隔用 setTimeout 递归，不用 setInterval
// 组件/模块销毁时清理定时器
// 异步操作加超时机制
// 用 AbortController 统一取消（fetch, timers 都支持）
// 防抖和节流是常用模式，熟悉掌握
// 注意 this 指向问题，优先用箭头函数
// 不要在定时器回调中做 heavy computation
// 用 unref() 让定时器不阻止进程退出

// 什么是 unref()？
// const t = setTimeout(() => {}, 10000)
// t.unref() // 这个定时器不会阻止 Node.js 退出
// // 如果事件循环中只有这个定时器，进程会直接退出
//
// t.ref()  // 恢复，会阻止退出
