// ═══════════════════════════════════════════
// 1. 主线程被同步计算占满
// ═══════════════════════════════════════════

import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'

function countPrimes(limit) {
  let count = 0
  for (let n = 2; n < limit; n++) {                           // 纯同步计算
    let prime = true
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) { prime = false; break }
    }
    if (prime) count++
  }
  return count                                                // 计算期间事件循环全部排队
}

// ═══════════════════════════════════════════
// 2. 把计算搬进 worker 线程
// ═══════════════════════════════════════════

if (isMainThread) {                                           // 主线程分支
  const worker = new Worker(import.meta.filename, { workerData: 500000 })
  worker.on('message', (count) => {
    console.log('素数个数', count)                            // 结果：主线程始终能响应
  })
} else {
  parentPort.postMessage(countPrimes(workerData))             // 子线程算完把结果发回主线程
}

// ═══════════════════════════════════════════
// 3. 线程不共享普通内存，只能消息传递
// ═══════════════════════════════════════════

let mainCounter = 0                                           // 主线程自己的变量
if (isMainThread) {
  const worker = new Worker(import.meta.filename)
  worker.postMessage({ type: 'tick' })                        // 想同步状态只能发消息
  worker.on('message', (msg) => { mainCounter += msg.done })  // 再接收子线程回传的增量
}

// 说明：子线程里 mainCounter += 1 改的是它自己的副本，主线程那份纹丝不动

// ═══════════════════════════════════════════
// 4. 免拷贝传递与线程池复用
// ═══════════════════════════════════════════

const buffer = new ArrayBuffer(1024 * 1024)                   // 1MB 数据块
worker.postMessage(buffer, [buffer])                          // Transferable：转移所有权，零拷贝

const shared = new Uint8Array(new SharedArrayBuffer(1024))    // 真正被多线程共享的内存
Atomics.add(shared, 0, 1)                                     // 共享写入必须走 Atomics

// 说明：高频小任务用 Piscina 之类的线程池复用线程，别每次 new Worker
// 适用边界：Worker 适合 CPU 密集，I/O 密集用异步就够了
