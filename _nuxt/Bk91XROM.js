const n=`// ═══════════════════════════════════════════
// D28 - os 系统信息与资源监控
// ═══════════════════════════════════════════

import os from 'node:os'

// ───────── 操作系统信息 ─────────

console.log('操作系统:')
console.log('  平台:', os.platform())      // 'win32', 'darwin', 'linux'
console.log('  架构:', os.arch())          // 'x64', 'arm64', 'ia32'
console.log('  版本:', os.release())       // 操作系统版本号
console.log('  类型:', os.type())          // 'Windows_NT', 'Darwin', 'Linux'
console.log('  主机名:', os.hostname())    // 计算机名
console.log('  版本:', os.version())       // 详细版本 (Node 18+)

// ───────── CPU 信息 ─────────

const cpus = os.cpus()
console.log('\\nCPU:')
console.log('  核心数:', cpus.length)
console.log('  型号:', cpus[0].model)
console.log('  速度:', cpus[0].speed, 'MHz')

// 每个核心的详细信息
// cpus.forEach((cpu, i) => {
//   console.log(\`  CPU \${i}:\`, {
//     model: cpu.model,
//     speed: cpu.speed,
//     times: cpu.times // user, nice, sys, idle, irq
//   })
// })

// CPU 使用率计算
function getCpuUsage() {
  const startMeasure = cpuAverage()

  return new Promise((resolve) => {
    setTimeout(() => {
      const endMeasure = cpuAverage()
      const idleDifference = endMeasure.idle - startMeasure.idle
      const totalDifference = endMeasure.total - startMeasure.total
      const usage = 100 - ~~(100 * idleDifference / totalDifference)
      resolve(usage)
    }, 1000)
  })
}

function cpuAverage() {
  const cpus = os.cpus()
  let totalIdle = 0
  let totalTick = 0

  for (const cpu of cpus) {
    for (const type in cpu.times) {
      totalTick += cpu.times[type]
    }
    totalIdle += cpu.times.idle
  }

  return {
    idle: totalIdle / cpus.length,
    total: totalTick / cpus.length
  }
}

// 使用：
// const usage = await getCpuUsage()
// console.log('CPU 使用率:', usage + '%')

// ───────── 内存信息 ─────────

const totalMem = os.totalmem()
const freeMem = os.freemem()
const usedMem = totalMem - freeMem

console.log('\\n内存:')
console.log('  总内存:', formatBytes(totalMem))
console.log('  空闲内存:', formatBytes(freeMem))
console.log('  已用内存:', formatBytes(usedMem))
console.log('  使用率:', ((usedMem / totalMem) * 100).toFixed(1) + '%')

// 注意：os.freemem() 是系统空闲内存，不是 Node.js 堆内存
// Node.js 堆内存在 process.memoryUsage()

// 辅助函数：格式化字节
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

// ───────── 进程信息 ─────────

import process from 'node:process'

console.log('\\n进程:')
console.log('  PID:', process.pid)
console.log('  父 PID:', process.ppid)
console.log('  运行时间:', process.uptime().toFixed(1), '秒')
console.log('  Node 版本:', process.version)

const memUsage = process.memoryUsage()
console.log('\\nNode.js 内存:')
console.log('  RSS (常驻内存):', formatBytes(memUsage.rss))
console.log('  堆总量:', formatBytes(memUsage.heapTotal))
console.log('  堆已用:', formatBytes(memUsage.heapUsed))
console.log('  外部内存:', formatBytes(memUsage.external))

// ───────── 网络信息 ─────────

const networkInterfaces = os.networkInterfaces()
console.log('\\n网络接口:')

for (const [name, interfaces] of Object.entries(networkInterfaces)) {
  console.log(\`  \${name}:\`)
  for (const iface of interfaces) {
    if (!iface.internal) {
      console.log(\`    \${iface.family}: \${iface.address}\`)
    }
  }
}

// 常用：获取本机 IP
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return '127.0.0.1'
}

console.log('\\n本机 IP:', getLocalIP())

// ───────── 负载均衡 ─────────

// Unix 系统的负载平均值（1分钟、5分钟、15分钟）
const loadavg = os.loadavg()
console.log('\\n负载平均值:')
console.log('  1分钟:', loadavg[0].toFixed(2))
console.log('  5分钟:', loadavg[1].toFixed(2))
console.log('  15分钟:', loadavg[2].toFixed(2))

// 注意：Windows 下 loadavg 返回 [0, 0, 0]
// 负载平均值表示等待 CPU 的进程数
// 一般认为 < CPU 核心数是健康的

// ───────── 用户信息 ─────────

const userInfo = os.userInfo()
console.log('\\n用户信息:')
console.log('  用户名:', userInfo.username)
console.log('  主目录:', userInfo.homedir)
console.log('  Shell:', userInfo.shell)
console.log('  UID:', userInfo.uid)
console.log('  GID:', userInfo.gid)

// ───────── 临时目录 ─────────

console.log('\\n临时目录:', os.tmpdir())

// ───────── EOL (行尾) ─────────

console.log('系统换行符:', JSON.stringify(os.EOL))
// Windows: \\r\\n
// POSIX: \\n

// ───────── 系统运行时间 ─────────

console.log('系统运行时间:', formatUptime(os.uptime()))

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts = []
  if (days > 0) parts.push(\`\${days} 天\`)
  if (hours > 0) parts.push(\`\${hours} 小时\`)
  if (mins > 0) parts.push(\`\${mins} 分钟\`)
  parts.push(\`\${secs} 秒\`)

  return parts.join(' ')
}

// ───────── 简单的系统监控 ─────────

// 每秒采集一次系统指标
class SystemMonitor {
  constructor(interval = 1000) {
    this.interval = interval
    this.history = []
    this.maxHistory = 60 // 保留 60 条
    this.timer = null
  }

  start() {
    this.timer = setInterval(() => {
      this.collect()
    }, this.interval)
  }

  stop() {
    clearInterval(this.timer)
  }

  async collect() {
    const cpuUsage = await getCpuUsage()
    const mem = process.memoryUsage()
    const totalMem = os.totalmem()
    const freeMem = os.freemem()

    const data = {
      timestamp: Date.now(),
      cpu: cpuUsage,
      memory: {
        systemUsed: totalMem - freeMem,
        systemTotal: totalMem,
        rss: mem.rss,
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal
      },
      uptime: process.uptime()
    }

    this.history.push(data)
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }

    return data
  }

  getLatest() {
    return this.history[this.history.length - 1]
  }
}

// 使用：
// const monitor = new SystemMonitor(1000)
// monitor.start()
//
// // 一段时间后
// console.log('最新数据:', monitor.getLatest())
// monitor.stop()

// ───────── 跨平台判断 ─────────

function isWindows() {
  return os.platform() === 'win32'
}

function isMac() {
  return os.platform() === 'darwin'
}

function isLinux() {
  return os.platform() === 'linux'
}

// 路径分隔符
console.log('\\n路径分隔符:', os.platform() === 'win32' ? '\\\\' : '/')
// 其实用 path.sep 更好

// 行尾用 os.EOL，不要硬编码 \\n 或 \\r\\n

// ───────── 优先级调整 ─────────

// 调整进程优先级（需要权限）
// os.setPriority(pid, priority)
// priority: -20 (最高) 到 19 (最低)
// 默认 0

// const priority = os.getPriority(process.pid)
// console.log('进程优先级:', priority)

// ───────── 最佳实践 ─────────
// 用 os.platform() 判断系统，做跨平台兼容
// 用 os.EOL 处理换行，不要硬编码
// 内存监控用 os.totalmem/freemem 看系统，process.memoryUsage 看 Node.js
// CPU 使用率需要采样计算，不是直接获取
// Windows 下 loadavg 不可用
// 监控工具可以用 os + process 模块做基础版
// 生产环境用专业工具：PM2, Prometheus, Grafana
// 性能调优先看 CPU 和内存的瓶颈在哪里
// 大内存应用关注堆外内存（external）和 RSS
`;export{n as default};
