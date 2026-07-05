// ═══════════════════════════════════════════
// D04 - EventEmitter 事件发布订阅
// ═══════════════════════════════════════════

import { EventEmitter } from 'node:events'

// ───────── 基本用法 ─────────

// 创建事件发射器实例
const emitter = new EventEmitter()

// 监听事件（on = addListener）
emitter.on('greet', (name) => {
  console.log(`你好, ${name}!`)
})

// 只监听一次（触发后自动移除）
emitter.once('welcome', (name) => {
  console.log(`欢迎, ${name}！（只显示一次）`)
})

// 触发事件
emitter.emit('greet', 'Alice')
emitter.emit('greet', 'Bob')
emitter.emit('welcome', 'Charlie')
emitter.emit('welcome', 'Dave') // 不会触发，因为 once

// ───────── 自定义事件类 ─────────

class MyService extends EventEmitter {
  constructor() {
    super()
    this.data = []
  }

  addItem(item) {
    this.data.push(item)
    this.emit('itemAdded', item, this.data.length)
  }

  removeItem(index) {
    if (index >= 0 && index < this.data.length) {
      const removed = this.data.splice(index, 1)[0]
      this.emit('itemRemoved', removed)
      return removed
    } else {
      this.emit('error', new Error('索引超出范围'))
    }
  }
}

const service = new MyService()

service.on('itemAdded', (item, count) => {
  console.log(`添加了 ${item}，当前共 ${count} 项`)
})

service.on('itemRemoved', (item) => {
  console.log(`移除了 ${item}`)
})

service.on('error', (err) => {
  console.error('发生错误:', err.message)
})

service.addItem('苹果')
service.addItem('香蕉')
service.removeItem(0)
service.removeItem(99) // 触发 error 事件

// ───────── 事件监听管理 ─────────

const handler = () => console.log('事件触发')

emitter.on('test', handler)
emitter.emit('test')       // 触发
emitter.off('test', handler) // 移除监听
emitter.emit('test')       // 不再触发

// 移除所有监听
emitter.removeAllListeners('test')

// 获取监听器数量
emitter.on('a', () => {})
emitter.on('a', () => {})
EventEmitter.listenerCount(emitter, 'a') // 2
emitter.listenerCount('a')               // 2

// 获取事件名列表
emitter.eventNames() // ['greet', 'welcome', 'test', 'a', ...]

// ───────── 同步 vs 异步 ─────────

// EventEmitter 是同步触发的！
const syncEmitter = new EventEmitter()
let order = []

syncEmitter.on('sync-event', () => {
  order.push('listener')
})

order.push('before')
syncEmitter.emit('sync-event')
order.push('after')
// order: ['before', 'listener', 'after']
// 监听函数在 emit 调用栈内同步执行

// 如需异步，手动用 setImmediate / process.nextTick
syncEmitter.on('async-event', (...args) => {
  process.nextTick(() => {
    console.log('异步处理:', args)
  })
})

// ───────── error 事件的特殊性 ─────────

// 如果 EventEmitter 触发 'error' 事件且没有监听器，会抛出异常并终止进程
const badEmitter = new EventEmitter()
// badEmitter.emit('error', new Error('没人处理我！')) // 会崩溃

// 最佳实践：始终为 EventEmitter 添加 error 监听
const safeEmitter = new EventEmitter()
safeEmitter.on('error', (err) => {
  console.error('捕获到错误:', err.message)
})
safeEmitter.emit('error', new Error('安全处理')) // 不会崩溃

// ───────── 最大监听器数量 ─────────

// 默认每个事件最多 10 个监听器（防止内存泄漏警告）
const manyEmitter = new EventEmitter()
for (let i = 0; i < 15; i++) {
  manyEmitter.on('many', () => {})
}
manyEmitter.emit('many')
// 会输出警告: MaxListenersExceededWarning

// 设置最大监听器数
manyEmitter.setMaxListeners(20) // 单个实例
EventEmitter.defaultMaxListeners = 50 // 全局默认

// ───────── 常见应用场景 ─────────
// 1. HTTP 服务的 request/response 事件
// 2. Stream 的 data/end/error 事件
// 3. 进程的 signal/exit 事件
// 4. 自定义业务事件总线

// ───────── 最佳实践 ─────────
// 用类继承 EventEmitter，而不是直接使用实例
// 始终监听 error 事件，避免进程崩溃
// 注意事件触发是同步的，不要在监听器中做阻塞操作
// 及时移除不再需要的监听器，防止内存泄漏
// 使用 prependListener / prependOnceListener 调整监听顺序
