const e=`// ═══════════════════════════════════════════
// 1. 主进程 fork 出共享端口的工作进程
// ═══════════════════════════════════════════

import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'
import { createServer } from 'node:http'

if (cluster.isPrimary) {
  for (let i = 0; i < availableParallelism(); i += 1) {
    cluster.fork()                                     // 说明：默认按 CPU 核心数 fork
  }
  console.log(\`主进程 \${process.pid} 就绪\`)            // 结果：只负责接收与分发连接
} else {
  createServer((req, res) => {
    res.end(\`Handled by \${process.pid}\`)               // 结果：请求落在不同 PID 上
  }).listen(3000)                                      // 说明：多个进程监听同一端口
}

// ═══════════════════════════════════════════
// 2. 工作进程各自独立的事件循环与内存
// ═══════════════════════════════════════════

let sessionCount = 0                                   // 说明：每个进程各有一份，不共享
function rememberUser(id) {
  sessionCount += 1                                    // 说明：应外置到 Redis 等共享存储
  return \`\${process.pid}:\${id}:\${sessionCount}\`
}

// ═══════════════════════════════════════════
// 3. 主进程按轮询把连接分给工作进程
// ═══════════════════════════════════════════

cluster.on('online', (worker) => {
  console.log(\`worker \${worker.process.pid} 上线\`)    // 说明：Round-Robin 依次分发连接
})

// ═══════════════════════════════════════════
// 4. 工作进程崩溃后主进程自动重启
// ═══════════════════════════════════════════

cluster.on('exit', (worker, code) => {
  console.log(\`worker \${worker.process.pid} 退出，code \${code}\`)  // 结果：拿到退出码
  cluster.fork()                                       // 说明：补一个进程，保持处理能力
})

// ═══════════════════════════════════════════
// 5. 优雅关闭：收到信号后逐个退出
// ═══════════════════════════════════════════

const server = createServer((req, res) => res.end('ok'))
server.listen(3000)
process.on('SIGTERM', () => {
  server.close(() => process.exit(0))                  // 说明：先处理完在途请求再退出
  setTimeout(() => process.exit(1), 5000)              // 说明：超时兜底强制退出
})
`;export{e as default};
