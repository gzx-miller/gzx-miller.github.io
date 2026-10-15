// ═══════════════════════════════════════════
// 1. 启动阶段集中读取配置
// ═══════════════════════════════════════════

import process from 'node:process'

// 环境变量在模块加载时一次性读取，业务代码不再到处 process.env
const args = process.argv.slice(2)                            // 命令行参数从下标 2 开始
const nodeEnv = process.env['NODE_ENV'] ?? 'development'      // 缺省值只写在一处
const port = Number(process.env['PORT'] ?? 3000)              // 显式转成数字，它不是字符串

export const config = {
  nodeEnv,
  port,
  logLevel: nodeEnv === 'production' ? 'info' : 'debug',      // 同一份代码按环境解析出不同值
  verbose: args.includes('--verbose'),                        // 结果：production 下日志级别为 info
}

// ═══════════════════════════════════════════
// 2. 缺少必填项时拒绝启动
// ═══════════════════════════════════════════

function loadConfig(env) {
  const required = ['DATABASE_URL', 'API_KEY']                // 必填清单集中一处
  const missing = required.filter((key) => !env[key])         // 缺项在启动时就暴露
  if (missing.length > 0) {
    throw new Error(`缺少环境变量: ${missing.join(', ')}`)     // 结果：拒绝启动，而非默默降级
  }
  return {
    databaseUrl: env.DATABASE_URL,
    apiKey: env.API_KEY,
    port: Number(env.PORT ?? 3000),
  }
}

export const runtime = loadConfig(process.env)                // 启动即校验一次

// ═══════════════════════════════════════════
// 3. 收到信号后按顺序收尾
// ═══════════════════════════════════════════

import { createServer } from 'node:http'

const server = createServer((req, res) => res.end('ok'))
const connections = new Set()                                 // 在途连接，退出时要等它们跑完

let shuttingDown = false
function shutdown(signal) {
  if (shuttingDown) return                                    // 重复信号只处理一次
  shuttingDown = true
  server.close(() => {                                        // 1. 停止接收新请求
    Promise.all([...connections].map((conn) => conn.close()))  // 2. 等待存量任务完成
      .then(() => { process.exitCode = 0 })                   // 3. 释放资源后自然退出
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))              // 容器编排发来的停止信号
process.on('SIGINT', () => shutdown('SIGINT'))                // 终端 Ctrl+C

// ═══════════════════════════════════════════
// 4. 清理超时的兜底强制退出
// ═══════════════════════════════════════════

function armDeadline(timeoutMs = 10_000) {
  const timer = setTimeout(() => {
    console.error('清理超时，强制退出')                        // 结果：退出码 1，进程不再挂起
    process.exit(1)                                           // 说明：只在兜底时才强制退出
  }, timeoutMs)
  timer.unref()                                               // 不独自拖住事件循环
  return timer
}

// 说明：优雅路径用 process.exitCode 自然退出；process.exit 会截断异步清理，只留给兜底超时
