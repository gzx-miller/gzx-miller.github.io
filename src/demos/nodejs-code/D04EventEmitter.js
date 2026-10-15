// ═══════════════════════════════════════════
// 1. on / once / emit / off 基本用法
// ═══════════════════════════════════════════

import { EventEmitter } from 'node:events'

const bus = new EventEmitter()

bus.on('order:paid', (order) => {          // 说明：长期监听，触发多少次执行多少次
  console.log('通知库存', order.id)
})
bus.once('app:ready', () => {              // 说明：一次性监听，触发后自动移除
  console.log('初始化一次')
})

bus.emit('order:paid', { id: 1001 })       // 结果：同步触发上面的监听器
bus.emit('app:ready')                      // 结果：触发一次
bus.emit('app:ready')                      // 结果：无输出，once 已移除

const handler = () => console.log('命中')
bus.on('tick', handler)
bus.off('tick', handler)                   // 结果：移除监听，再 emit 不再触发
bus.emit('tick')

// ═══════════════════════════════════════════
// 2. 用类继承 EventEmitter
// ═══════════════════════════════════════════

class OrderService extends EventEmitter {
  pay(id) {
    this.emit('paid', { id })              // 说明：变更方只广播事件名与载荷
  }
}

const service = new OrderService()
service.on('paid', ({ id }) => console.log('收到支付', id))  // 说明：订阅方各自订阅
service.pay(2002)                          // 结果：收到支付 2002

// ═══════════════════════════════════════════
// 3. emit 是同步派发
// ═══════════════════════════════════════════

const order = []
const sync = new EventEmitter()

sync.on('msg', () => order.push('listener'))
order.push('before')
sync.emit('msg')
order.push('after')
order.join(' > ')                          // 结果：before > listener > after，回调在栈内跑完

// 想异步处理就自己在监听器里排队
sync.on('later', (...args) => process.nextTick(() => console.log('异步', args)))

// ═══════════════════════════════════════════
// 4. 监听器抛错与 error 事件
// ═══════════════════════════════════════════

const risky = new EventEmitter()
risky.on('work', () => { throw new Error('炸了') })  // 说明：异常沿 emit 的调用栈向上抛
try {
  risky.emit('work')
} catch (err) {
  console.log('捕获', err.message)         // 结果：捕获 炸了
}

const safe = new EventEmitter()
safe.emit('error', new Error('无人处理'))  // 结果：没有监听器时直接抛出，严重时终止进程
safe.on('error', (err) => console.log('兜底', err.message))
                                           // 说明：关键组件务必注册 error 监听
safe.emit('error', new Error('已处理'))    // 结果：兜底 已处理，不再崩溃

// ═══════════════════════════════════════════
// 5. 监听器数量与泄漏排查
// ═══════════════════════════════════════════

const leaky = new EventEmitter()
for (let i = 0; i < 12; i++) leaky.on('many', () => {})
                                           // 结果：超过默认 10 个会打印告警
EventEmitter.listenerCount(leaky, 'many')  // 结果：12
leaky.listenerCount('many')                // 结果：12，实例方法同样可查

// 覆盖前先查清为什么会有这么多订阅，而不是一味抬高上限
leaky.setMaxListeners(20)                  // 说明：只是调高告警阈值，不解决泄漏
leaky.removeAllListeners('many')           // 结果：计数器归零，避免长期累积

// ═══════════════════════════════════════════
// 6. 事件名与载荷约定，events.once
// ═══════════════════════════════════════════

// 命名约定「领域 + 动作」，载荷结构固定，订阅方才有稳定契约
const EVENT = { PAID: 'order:paid', SHIPPED: 'order:shipped' }

import { once } from 'node:events'
async function waitReady(target) {
  await once(target, 'ready')              // 结果：等一次事件，返回参数数组
  console.log('服务就绪')
}
