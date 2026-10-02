const n=`// ═══════════════════════════════════════════
// D07 - 进程环境变量与优雅退出
// ═══════════════════════════════════════════

import process from 'node:process'

// ───────── 环境变量 process.env ─────────

// 读取环境变量
// 注：写作 process.env['NODE_ENV'] 而非点号写法，是因为本文件会以 ?raw 方式内联进构建产物，
// 点号写法会被构建工具误替换导致产物语法错误；两种写法在 Node.js 中完全等价。
const nodeEnv = process.env['NODE_ENV'] || 'development'
const port = process.env.PORT || 3000
const apiKey = process.env.API_KEY

// 常见环境变量
// NODE_ENV: 'development' | 'production' | 'test'
// PORT: 服务端口
// HOME / USERPROFILE: 用户主目录
// PATH: 可执行文件搜索路径
// TZ: 时区设置

// 检查环境
if (nodeEnv === 'production') {
  console.log('生产模式：启用优化和缓存')
} else if (nodeEnv === 'development') {
  console.log('开发模式：启用热重载和调试')
}

// 从 .env 文件加载（需 dotenv 包）
// 示例 .env 文件内容：
// DATABASE_URL=postgres://user:pass@localhost:5432/mydb
// API_KEY=secret123
// DEBUG=true

// 配置校验函数
function loadConfig() {
  const required = ['DATABASE_URL', 'API_KEY']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.error('缺少必要环境变量:', missing.join(', '))
    process.exit(1)
  }

  return {
    databaseUrl: process.env.DATABASE_URL,
    apiKey: process.env.API_KEY,
    debug: process.env.DEBUG === 'true',
    port: Number(process.env.PORT) || 3000
  }
}

// ───────── 进程信息 ─────────

process.pid           // 进程 ID
process.ppid          // 父进程 ID
process.platform      // 平台: 'win32' | 'darwin' | 'linux'
process.arch          // 架构: 'x64' | 'arm64' | 'ia32'
process.version       // Node.js 版本: 'v20.0.0'
process.versions      // 各依赖版本对象
process.execPath      // node 可执行文件路径
process.cwd()         // 当前工作目录
process.title         // 进程标题（可修改）

// 命令行参数
// node script.js --mode=prod --verbose
process.argv          // 数组: [node路径, 脚本路径, ...参数]
// ['/usr/bin/node', '/app/script.js', '--mode=prod', '--verbose']

// 解析命令行参数（简单版）
function parseArgs() {
  const args = {}
  const argv = process.argv.slice(2)

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=')
      args[key] = value === undefined ? true : value
    }
  }
  return args
}

// ───────── 退出进程 ─────────

// process.exit(code)
// code 0: 正常退出
// code 非0: 异常退出（1=通用错误, 2=误用shell命令, ...）

// 正常退出
// process.exit(0)

// 错误退出
// console.error('发生致命错误')
// process.exit(1)

// 设置退出码，等事件循环清空后退出
// process.exitCode = 1

// ───────── 进程事件 ─────────

// beforeExit: 事件循环清空，即将退出前
process.on('beforeExit', (code) => {
  console.log('即将退出，退出码:', code)
  // 这里可以添加异步工作，会推迟退出
})

// exit: 进程退出时（只能做同步操作）
process.on('exit', (code) => {
  console.log('进程已退出，退出码:', code)
  // 警告：此事件中不能做异步操作！
})

// uncaughtException: 未捕获的异常
process.on('uncaughtException', (err, origin) => {
  console.error('未捕获的异常:', err.message)
  console.error('来源:', origin)
  // 未捕获异常后进程状态不稳定，应记录日志后退出
  process.exit(1)
})

// unhandledRejection: 未处理的 Promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason)
  console.error('Promise:', promise)
})

// warning: 进程警告
process.on('warning', (warning) => {
  console.warn('警告:', warning.name, warning.message)
  console.warn('堆栈:', warning.stack)
})

// ───────── 信号事件（优雅退出） ─────────

// SIGINT: Ctrl+C 触发
// SIGTERM: 系统/容器发送终止信号
// SIGUSR1/SIGUSR2: 用户自定义信号

let isShuttingDown = false

function gracefulShutdown(signal) {
  if (isShuttingDown) return
  isShuttingDown = true

  console.log(\`收到信号 \${signal}，开始优雅关闭...\`)

  // 停止接受新请求
  // server.close()

  // 关闭数据库连接
  // db.close()

  // 等待现有请求处理完成
  const timeout = setTimeout(() => {
    console.error('强制退出（超时）')
    process.exit(1)
  }, 10000)

  timeout.unref() // 不阻塞事件循环

  // 清理完成后退出
  setTimeout(() => {
    console.log('清理完成，正常退出')
    process.exit(0)
  }, 1000)
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

// ───────── 内存使用 ─────────

const memUsage = process.memoryUsage()
// {
//   rss: 常驻集大小（物理内存）
//   heapTotal: 堆总大小
//   heapUsed: 堆已用大小
//   external: 外部内存（Buffer 等）
//   arrayBuffers: ArrayBuffer 占用
// }

console.log('内存使用:')
console.log('  RSS:', Math.round(memUsage.rss / 1024 / 1024), 'MB')
console.log('  堆已用:', Math.round(memUsage.heapUsed / 1024 / 1024), 'MB')

// ───────── process.nextTick ─────────

// 将回调放入 next tick 队列（微任务，优先于 Promise）
console.log('1 - 同步代码')
process.nextTick(() => {
  console.log('3 - nextTick 回调')
})
Promise.resolve().then(() => {
  console.log('4 - Promise then')
})
console.log('2 - 同步代码结束')
// 输出顺序: 1, 2, 3, 4

// ───────── 最佳实践 ─────────
// 使用 NODE_ENV 区分环境
// 必要环境变量在启动时校验
// 监听 uncaughtException 和 unhandledRejection
// 实现优雅关闭，处理 SIGINT/SIGTERM
// 不要在 exit 事件中做异步操作
// 生产环境用 dotenv 或配置中心管理环境变量
// 敏感信息（密钥）不要硬编码在代码中
`;export{n as default};
