// ═══════════════════════════════════════════
// 1. 无界并发：Promise.all 一次冲出去
// ═══════════════════════════════════════════

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const fetchOne = (url) => sleep(80).then(() => `数据:${url}`)  // 模拟一次 I/O 请求

const urls = ['a', 'b', 'c', 'd', 'e', 'f']

async function unbounded() {
  const results = await Promise.all(urls.map(fetchOne))       // 全部同时发起
  return results                                              // 说明：句柄/连接/下游带宽被同时占满
}

// ═══════════════════════════════════════════
// 2. 固定 worker 的拉取循环
// ═══════════════════════════════════════════

async function pool(items, limit, task) {
  const results = []
  let next = 0                                                // 下一个待领取的下标
  async function worker() {
    while (next < items.length) {                             // 取空即停
      const index = next++                                    // 完成一个再领下一个
      results[index] = await task(items[index])
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))    // 在途数恒等于 limit
  return results
}

const data = await pool(urls, 2, fetchOne)                    // 结果：任意时刻最多 2 个在跑

// ═══════════════════════════════════════════
// 3. 单个任务失败不阻塞整条流水线
// ═══════════════════════════════════════════

async function settle(task) {
  try {
    return { status: 'fulfilled', value: await task() }       // 成功：记为 fulfilled
  } catch (error) {
    return { status: 'rejected', reason: error.message }      // 失败：记为 rejected，不抛出
  }
}

const report = await pool(urls, 2, (u) => settle(() => fetchOne(u)))
const failed = report.filter((r) => r.status === 'rejected')  // 结果：毒丸任务不会让整批停摆

// ═══════════════════════════════════════════
// 4. 并发上限与适用边界
// ═══════════════════════════════════════════

const CONCURRENCY = 2                                         // 由下游容量压测出的拐点决定
await pool(urls, CONCURRENCY, fetchOne)                       // 结果：再提高并发，下游错误率反升

// 说明：这套池子适合等待型 I/O；CPU 密集任务要交给 Worker 线程，别混进来
