const n=`// ═══════════════════════════════════════════
// D08 - 异步并发控制与任务池
// ═══════════════════════════════════════════

// ───────── Promise 并发方法 ─────────

// 模拟异步任务
function delay(ms, value, shouldReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(new Error(\`任务 \${value} 失败\`))
      } else {
        resolve(value)
      }
    }, ms)
  })
}

// 1. Promise.all - 全部成功才成功，一个失败就失败
async function allExample() {
  const results = await Promise.all([
    delay(100, 'A'),
    delay(200, 'B'),
    delay(150, 'C')
  ])
  console.log('Promise.all:', results) // ['A', 'B', 'C']
  // 总耗时约 200ms（并行执行）
}

// 2. Promise.allSettled - 等待全部完成，不管成功失败
async function allSettledExample() {
  const results = await Promise.allSettled([
    delay(100, 'A'),
    delay(200, 'B', true), // 这个会失败
    delay(150, 'C')
  ])
  console.log('Promise.allSettled:', results)
  // [
  //   { status: 'fulfilled', value: 'A' },
  //   { status: 'rejected', reason: Error },
  //   { status: 'fulfilled', value: 'C' }
  // ]
}

// 3. Promise.race - 第一个完成的（成功或失败）
async function raceExample() {
  const result = await Promise.race([
    delay(100, '快速'),
    delay(500, '慢速')
  ])
  console.log('Promise.race:', result) // '快速'
}

// 4. Promise.any - 第一个成功的（全部失败才失败）
async function anyExample() {
  const result = await Promise.any([
    delay(100, 'A', true),  // 失败
    delay(200, 'B'),        // 成功
    delay(150, 'C', true)   // 失败
  ])
  console.log('Promise.any:', result) // 'B'
}

// ───────── 并发限制：为什么需要？ ─────────
// 1000 个请求同时发出可能导致：
// - 目标服务器被打崩（429 Too Many Requests）
// - 本地内存耗尽
// - 文件描述符用尽
// 解决方案：限制并发数（如同时最多 10 个）

// ───────── 手写并发控制器 ─────────

async function asyncPool(concurrency, tasks) {
  const results = []
  let index = 0

  // 创建初始 worker
  async function worker() {
    while (index < tasks.length) {
      const currentIndex = index++
      try {
        const task = tasks[currentIndex]
        const result = await task()
        results[currentIndex] = result
      } catch (err) {
        results[currentIndex] = err
      }
    }
  }

  // 启动 concurrency 个 worker
  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => worker()
  )

  await Promise.all(workers)
  return results
}

// 使用示例
async function poolExample() {
  const tasks = Array.from({ length: 10 }, (_, i) => {
    return () => delay(Math.random() * 100, \`任务\${i + 1}\`)
  })

  const results = await asyncPool(3, tasks) // 最多同时 3 个
  console.log('并发池结果:', results)
}

// ───────── 带失败重试的任务池 ─────────

class TaskPool {
  constructor(concurrency = 10, retries = 3) {
    this.concurrency = concurrency
    this.retries = retries
    this.queue = []
    this.activeCount = 0
    this.results = []
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject, attempts: 0 })
      this.runNext()
    })
  }

  async runNext() {
    if (this.activeCount >= this.concurrency) return
    if (this.queue.length === 0) return

    const item = this.queue.shift()
    this.activeCount++

    try {
      const result = await item.task()
      this.activeCount--
      item.resolve(result)
    } catch (err) {
      item.attempts++
      if (item.attempts < this.retries) {
        this.queue.push(item) // 重新入队重试
      } else {
        item.reject(err) // 重试耗尽，失败
      }
      this.activeCount--
    }

    this.runNext() // 启动下一个
  }
}

// 使用 TaskPool
async function taskPoolExample() {
  const pool = new TaskPool(2, 3) // 并发 2，重试 3 次

  const results = await Promise.allSettled(
    Array.from({ length: 5 }, (_, i) => {
      return pool.add(() => delay(100, \`任务\${i + 1}\`, i === 2))
    })
  )

  console.log('TaskPool 结果:', results)
}

// ───────── 实际场景：批量下载图片 ─────────

async function downloadWithConcurrency(urls, maxConcurrency = 5) {
  const results = []
  let index = 0

  async function worker() {
    while (index < urls.length) {
      const i = index++
      try {
        // 模拟下载
        await delay(100 + Math.random() * 200, i)
        results[i] = { url: urls[i], success: true }
      } catch (err) {
        results[i] = { url: urls[i], success: false, error: err.message }
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(maxConcurrency, urls.length) },
    () => worker()
  )

  await Promise.all(workers)
  return results
}

// ───────── 限流 (Rate Limiting) ─────────

// 令牌桶算法
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity     // 桶容量（最大令牌数）
    this.refillRate = refillRate // 每秒补充速率
    this.tokens = capacity
    this.lastRefill = Date.now()
  }

  _refill() {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000
    const newTokens = elapsed * this.refillRate
    this.tokens = Math.min(this.capacity, this.tokens + newTokens)
    this.lastRefill = now
  }

  tryAcquire(tokens = 1) {
    this._refill()
    if (this.tokens >= tokens) {
      this.tokens -= tokens
      return true
    }
    return false
  }

  async waitForToken(tokens = 1) {
    while (!this.tryAcquire(tokens)) {
      // 等待 100ms 再试
      await new Promise((r) => setTimeout(r, 100))
    }
  }
}

// ───────── 最佳实践 ─────────
// 用 Promise.all 并行执行，但要考虑并发数量
// 不确定是否全部成功时用 Promise.allSettled
// 超时控制用 Promise.race 配合超时 Promise
// 大量任务用并发池限制同时执行的数量
// 第三方 API 调用考虑限流（令牌桶/漏桶算法）
// 关键任务添加失败重试机制
// 常用库：p-limit, p-queue, bottleneck
`;export{n as default};
