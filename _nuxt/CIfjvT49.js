const r=`// ═══════════════════════════════════════════
// D16 - Worker 线程 CPU 密集任务
// ═══════════════════════════════════════════

// Node.js 是单线程的，CPU 密集任务会阻塞事件循环
// Worker Threads 可以在独立线程中执行 CPU 密集任务

import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'

// ───────── 主线程 vs Worker 线程 ─────────

// isMainThread: 判断是否在主线程
// parentPort: Worker 线程中与主线程通信的端口
// workerData: 主线程传给 Worker 的数据

// ───────── 示例：计算斐波那契（CPU 密集） ─────────

// 主线程代码
// if (isMainThread) {
//   function fibonacciInWorker(n) {
//     return new Promise((resolve, reject) => {
//       const worker = new Worker(import.meta.filename, {
//         workerData: n
//       })
//
//       worker.on('message', resolve)
//       worker.on('error', reject)
//       worker.on('exit', (code) => {
//         if (code !== 0) {
//           reject(new Error(\`Worker 退出，退出码: \${code}\`))
//         }
//       })
//     })
//   }
//
//   // 并行计算多个斐波那契数
//   async function main() {
//     console.time('并行计算')
//
//     const results = await Promise.all([
//       fibonacciInWorker(40),
//       fibonacciInWorker(41),
//       fibonacciInWorker(42)
//     ])
//
//     console.timeEnd('并行计算')
//     console.log('结果:', results)
//   }
//
//   main()
// } else {
//   // Worker 线程代码
//   function fib(n) {
//     if (n <= 1) return n
//     return fib(n - 1) + fib(n - 2)
//   }
//
//   const n = workerData
//   const result = fib(n)
//   parentPort.postMessage(result)
// }

// ───────── Worker 通信 ─────────

// 主线程
// const worker = new Worker('./worker.js')
//
// // 发送消息给 Worker
// worker.postMessage({ type: 'start', data: [1, 2, 3] })
//
// // 接收 Worker 消息
// worker.on('message', (msg) => {
//   console.log('收到 Worker 消息:', msg)
// })
//
// // 终止 Worker
// worker.terminate()

// Worker 线程 (worker.js)
// parentPort.on('message', (msg) => {
//   if (msg.type === 'start') {
//     const result = processData(msg.data)
//     parentPort.postMessage({ type: 'result', data: result })
//   }
// })

// ───────── 共享内存（SharedArrayBuffer） ─────────

// 普通 postMessage 是结构化克隆（拷贝数据）
// 大数据量时用 SharedArrayBuffer 共享内存，避免拷贝开销

// 主线程
// const size = 1024 * 1024 * 10 // 10MB
// const sharedBuffer = new SharedArrayBuffer(size)
// const sharedArray = new Uint8Array(sharedBuffer)
//
// // 填充数据
// for (let i = 0; i < sharedArray.length; i++) {
//   sharedArray[i] = i % 256
// }
//
// // 传递给 Worker（共享，不是拷贝）
// worker.postMessage({ buffer: sharedBuffer })

// Worker 线程
// parentPort.on('message', (msg) => {
//   const arr = new Uint8Array(msg.buffer)
//   // 直接操作共享内存
//   // 注意：多线程同时写需要原子操作！
// })

// 原子操作（防止数据竞争）
// Atomics.add(sharedArray, index, 1)    // 原子加
// Atomics.load(sharedArray, index)      // 原子读
// Atomics.store(sharedArray, index, 5)  // 原子写
// Atomics.compareExchange(sharedArray, index, old, new) // 比较交换

// ───────── Worker 池 ─────────

// 频繁创建 Worker 有开销，可以用 Worker 池

// class WorkerPool {
//   constructor(size, workerScript) {
//     this.size = size
//     this.queue = []
//     this.workers = []
//     this.activeWorkers = 0
//
//     for (let i = 0; i < size; i++) {
//       this.workers.push(new Worker(workerScript))
//     }
//   }
//
//   execute(data) {
//     return new Promise((resolve, reject) => {
//       this.queue.push({ data, resolve, reject })
//       this.runNext()
//     })
//   }
//
//   runNext() {
//     if (this.activeWorkers >= this.size) return
//     if (this.queue.length === 0) return
//
//     const task = this.queue.shift()
//     const worker = this.workers[this.activeWorkers]
//     this.activeWorkers++
//
//     const onMessage = (result) => {
//       worker.removeListener('message', onMessage)
//       worker.removeListener('error', onError)
//       this.activeWorkers--
//       task.resolve(result)
//       this.runNext()
//     }
//
//     const onError = (err) => {
//       worker.removeListener('message', onMessage)
//       worker.removeListener('error', onError)
//       this.activeWorkers--
//       task.reject(err)
//       this.runNext()
//     }
//
//     worker.on('message', onMessage)
//     worker.on('error', onError)
//     worker.postMessage(task.data)
//   }
//
//   async close() {
//     await Promise.all(this.workers.map(w => w.terminate()))
//   }
// }

// ───────── 什么时候用 Worker Threads？ ─────────

// 适合用 Worker 的场景：
// - 图片处理、视频编码
// - 复杂数学计算（加密、哈希）
// - 大数据排序、统计
// - 机器学习、AI 推理
// - 解析大文件（不适合用 Stream 的情况）

// 不适合用 Worker 的场景：
// - I/O 密集任务（直接用异步 I/O 就行）
// - 简单任务（Worker 创建和通信有开销）
// - 需要频繁共享大量数据（同步开销大）

// ───────── Worker Threads vs Cluster vs 子进程 ─────────

// 特性          | Worker Threads    | Cluster       | child_process
// ------------- | ----------------- | ------------- | -------------
// 内存隔离      | 共享（可共享内存）| 完全隔离      | 完全隔离
// 通信开销      | 低                | 中            | 高
// 适用场景      | CPU 密集计算      | 网络服务扩展  | 执行外部命令
// 数量限制      | 受 CPU 核心数限制 | 受 CPU 核心数  | 较多
// 共享文件描述符| 是                | 是            | 可选

// ───────── 最佳实践 ─────────
// CPU 密集任务才用 Worker，I/O 任务用异步就够了
// 大量任务用 Worker 池，不要频繁创建销毁
// 传递大数据用 SharedArrayBuffer，避免拷贝
// 多线程写共享内存用 Atomics 原子操作
// 监听 Worker 的 error 和 exit 事件
// 及时 terminate 不需要的 Worker
// Worker 内也可以创建子 Worker（注意资源）
// 考虑使用 piscina 等成熟的 Worker 池库
`;export{r as default};
