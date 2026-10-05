const n=`// ═══════════════════════════════════════════
// D20 - cluster 多核利用
// ═══════════════════════════════════════════

// Node.js 单线程无法充分利用多核 CPU
// cluster 模块可以创建多个工作进程，共享端口

import cluster from 'node:cluster'
import http from 'node:http'
import os from 'node:os'

const numCPUs = os.cpus().length

// ───────── 主进程 vs 工作进程 ─────────

// cluster.isPrimary / cluster.isMaster (已废弃)
// 判断当前是主进程还是工作进程

// 主进程：
// - 负责 fork 工作进程
// - 监听端口，分发请求
// - 管理工作进程（重启、监控）

// 工作进程：
// - 处理实际的业务逻辑
// - 每个进程有独立的事件循环和内存
// - 通过 IPC 和主进程通信

// ───────── 基础示例：HTTP 服务集群 ─────────

// if (cluster.isPrimary) {
//   console.log(\`主进程 PID: \${process.pid}\`)
//   console.log(\`CPU 核心数: \${numCPUs}\`)
//
//   // 为每个 CPU 核心创建一个工作进程
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork()
//   }
//
//   // 监听工作进程退出
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(\`工作进程 \${worker.process.pid} 已退出\`)
//     console.log('启动新的工作进程...')
//     cluster.fork() // 自动重启
//   })
//
//   // 工作进程在线
//   cluster.on('online', (worker) => {
//     console.log(\`工作进程 \${worker.process.pid} 已启动\`)
//   })
//
// } else {
//   // 工作进程：创建 HTTP 服务
//   http.createServer((req, res) => {
//     res.writeHead(200)
//     res.end(\`Hello from worker \${process.pid}\\n\`)
//   }).listen(8000)
//
//   console.log(\`工作进程 \${process.pid} 启动，监听 8000 端口\`)
// }

// 工作原理：
// 主进程 listen 端口，然后通过 round-robin 策略
// 将连接分发给各个工作进程

// ───────── 进程间通信 ─────────

// if (cluster.isPrimary) {
//   const worker = cluster.fork()
//
//   // 主进程给工作进程发消息
//   worker.send({ type: 'config', data: { port: 3000 } })
//
//   // 接收工作进程的消息
//   worker.on('message', (msg) => {
//     if (msg.type === 'ready') {
//       console.log(\`工作进程 \${worker.id} 准备就绪\`)
//     }
//   })
//
// } else {
//   // 工作进程接收消息
//   process.on('message', (msg) => {
//     if (msg.type === 'config') {
//       console.log('收到配置:', msg.data)
//       process.send({ type: 'ready' })
//     }
//   })
// }

// 主进程广播消息给所有工作进程
// function broadcast(message) {
//   for (const id in cluster.workers) {
//     cluster.workers[id].send(message)
//   }
// }

// ───────── 负载均衡策略 ─────────

// cluster.schedulingPolicy
// 1. cluster.SCHED_RR  - Round-Robin（默认，除了 Windows）
//    主进程轮询分发，公平分配
// 2. cluster.SCHED_NONE - 操作系统分配（Windows 默认）
//    交给内核调度，可能不均匀

// 设置调度策略
// cluster.schedulingPolicy = cluster.SCHED_RR

// ───────── 工作进程管理 ─────────

// cluster.workers: 所有工作进程的对象 { id: worker }

// 优雅重启（零停机部署）
// async function gracefulRestart() {
//   const workerIds = Object.keys(cluster.workers)
//
//   for (const id of workerIds) {
//     const worker = cluster.workers[id]
//
//     // 启动新进程
//     const newWorker = cluster.fork()
//
//     // 等新进程就绪后，关闭旧进程
//     newWorker.on('listening', () => {
//       worker.send('shutdown')
//       // 给旧进程 30 秒处理完现有请求
//       setTimeout(() => {
//         if (!worker.isDead()) {
//           worker.kill('SIGKILL')
//         }
//       }, 30000)
//     })
//
//     // 等一个重启完再重启下一个
//     await new Promise((resolve) => {
//       worker.on('exit', resolve)
//     })
//   }
// }

// ───────── 共享状态的问题 ─────────

// 注意：每个工作进程有独立的内存
// 全局变量不共享！

// 错误示例：
// let counter = 0
// http.createServer((req, res) => {
//   counter++
//   res.end(\`Counter: \${counter}\`)
// })
// 每个工作进程有自己的 counter，计数不准确

// 解决方案：
// 1. Redis / 数据库 存共享数据
// 2. 将状态集中在主进程，工作进程通过 IPC 查询
// 3. 使用分布式锁

// 主进程集中管理状态示例：
// if (cluster.isPrimary) {
//   let counter = 0
//
//   for (let i = 0; i < numCPUs; i++) {
//     const worker = cluster.fork()
//     worker.on('message', (msg) => {
//       if (msg.type === 'incr') {
//         counter++
//         worker.send({ type: 'counter', value: counter })
//       }
//     })
//   }
// }

// ───────── Cluster vs Worker Threads ─────────

// 特性          | Cluster           | Worker Threads
// ------------- | ----------------- | -------------
// 隔离性        | 进程级，完全隔离   | 线程级，共享内存
// 内存开销      | 大（每个进程复制） | 小
// 通信开销      | 大（IPC）         | 小（共享内存）
// 稳定性        | 高（一个崩溃不影响其他） | 低（一个崩溃可能影响主进程）
// 适用场景      | 网络服务（HTTP）  | CPU 密集计算
// 端口共享      | 支持              | 不支持
// 数量建议      | CPU 核心数        | CPU 核心数

// 怎么选：
// - 提升 Web 服务吞吐量 → Cluster
// - CPU 密集计算 → Worker Threads
// - 需要稳定性（一个挂了不影响其他）→ Cluster
// - 需要共享大量数据 → Worker Threads

// ───────── PM2（生产环境推荐） ─────────

// PM2 是流行的 Node.js 进程管理器，封装了 cluster
// 功能：
// - 内置负载均衡
// - 自动重启（崩溃时）
// - 零停机重新加载
// - 日志管理
// - 监控和仪表盘
// - 启动脚本生成

// 常用命令：
// pm2 start app.js -i max       # 启动，使用最大 CPU 数
// pm2 list                       # 查看进程列表
// pm2 reload app                 # 零停机重载
// pm2 restart app                # 重启
// pm2 stop app                   # 停止
// pm2 delete app                 # 删除
// pm2 logs                       # 查看日志
// pm2 monit                      # 监控
// pm2 startup                    # 生成开机自启脚本

// ecosystem.config.js 配置文件：
// module.exports = {
//   apps: [{
//     name: 'my-app',
//     script: './app.js',
//     instances: 'max',    // 实例数（max = CPU 核心数）
//     exec_mode: 'cluster', // 集群模式
//     env: {
//       NODE_ENV: 'production'
//     },
//     max_memory_restart: '500M'  // 内存超限自动重启
//   }]
// }

// ───────── 最佳实践 ─────────
// 生产环境 Web 服务用 cluster 或 PM2
// 工作进程数约等于 CPU 核心数（不要太多）
// 工作进程是无状态的，状态存在数据库/Redis
// 实现优雅关闭和重启，避免服务中断
// 监控工作进程内存和重启次数
// 主进程只做管理，不做业务逻辑
// 工作进程崩溃要自动重启（但注意重启风暴）
// 跨进程共享数据用 Redis 等外部存储
`;export{n as default};
