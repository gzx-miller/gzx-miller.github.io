const n=`<script setup lang="ts">
import { ref, onMounted } from 'vue'

const osInfo = ref<Record<string, string>>({})
const loading = ref(true)

onMounted(() => {
  // 模拟获取系统信息（浏览器端只能用 navigator 模拟）
  osInfo.value = {
    '操作系统': navigator.platform || '未知',
    'CPU 架构': navigator.userAgent.includes('x86') ? 'x86_64' : '未知',
    'CPU 核心数': String(navigator.hardwareConcurrency || '未知'),
    '内存大小': (() => {
      const mem = (navigator as any).deviceMemory
      return mem ? \`\${mem} GB\` : '未知'
    })(),
    '语言': navigator.language || '未知',
    'User Agent': navigator.userAgent.slice(0, 80) + '...',
  }
  loading.value = false
})

const nodeJsExample = {
  platform: ['darwin', 'linux', 'win32'],
  arch: ['x64', 'arm64', 'ia32'],
  cpus: 'Intel(R) Core(TM) i7-9750H @ 2.60GHz (12 核心)',
  memory: '16 GB',
  uptime: '15 天 3 小时 22 分钟',
}
<\/script>

<template><div class="demo-card">
  <p><code>os</code> 模块提供操作系统相关信息，用于资源监控、健康检查、平台适配等场景。</p>

  <div class="os-info">
    <h4>浏览器端可获取的系统信息（模拟）</h4>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="info-grid">
      <div v-for="(value, key) in osInfo" :key="key" class="info-item">
        <span class="info-key">{{ key }}</span>
        <span class="info-value">{{ value }}</span>
      </div>
    </div>
  </div>

  <div class="os-node">
    <h4>Node.js 中可获取的系统信息</h4>
    <pre class="mini-code"><code>const os = require('node:os')

// 平台信息
os.platform()  // 'darwin' | 'linux' | 'win32'
os.arch()      // 'x64' | 'arm64' | 'ia32'

// CPU 信息
os.cpus()      // 返回 CPU 核心详情数组
os.cpus().length  // CPU 核心数

// 内存信息
os.totalmem()  // 总内存（字节）
os.freemem()   // 空闲内存（字节）

// 系统信息
os.hostname()   // 主机名
os.type()       // 'Darwin' | 'Linux' | 'Windows_NT'
os.release()    // 操作系统版本
os.uptime()    // 系统运行时间（秒）

// 网络信息
os.networkInterfaces()  // 网络接口详情

// 家目录
os.homedir()   // 用户家目录
os.tmpdir()    // 临时文件目录</code></pre>
  </div>

  <div class="os-usecases">
    <h4>常见使用场景</h4>
    <div class="usecase-list">
      <div class="usecase-item">
        <strong>资源监控</strong>
        <p>定时采集 CPU、内存使用率，超出阈值时告警。</p>
        <pre class="mini-code"><code>setInterval(() => {
  const mem = os.freemem() / os.totalmem()
  if (mem < 0.1) console.warn('内存不足！')
}, 5000)</code></pre>
      </div>
      <div class="usecase-item">
        <strong>平台适配</strong>
        <p>根据操作系统选择不同的命令或路径分隔符。</p>
        <pre class="mini-code"><code>const pathSep = os.platform() === 'win32' ? '\\\\\\\\' : '/'
const openCmd = os.platform() === 'darwin' ? 'open' : 'xdg-open'</code></pre>
      </div>
      <div class="usecase-item">
        <strong>健康检查</strong>
        <p>提供 HTTP 接口返回系统状态，供负载均衡器探测。</p>
        <pre class="mini-code"><code>app.get('/health', (req, res) => {
  res.json({
    uptime: os.uptime(),
    memory: { total: os.totalmem(), free: os.freemem() },
    cpus: os.cpus().length,
  })
})</code></pre>
      </div>
    </div>
  </div>

  <small>要点：<code>os.cpus().length</code> 是设置 cluster 工作进程数的常用依据；<code>os.freemem()</code> 可用于实现内存告警。</small>
</div></template>

<style scoped>
.os-info { margin: 0.6rem 0; }
.os-info h4, .os-node h4, .os-usecases h4 { font-size: 13px; color: #334155; margin: 0.6rem 0 0.4rem; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; background: #f8fafc; padding: 8px 12px; border-radius: 6px; font-size: 12px; }
.info-item { display: flex; gap: 8px; padding: 3px 0; }
.info-key { color: #64748b; min-width: 80px; }
.info-value { color: #334155; font-weight: 500; }
.os-node { margin: 0.8rem 0; }
.usecase-list { display: grid; gap: 8px; margin-top: 6px; }
.usecase-item { background: #fff9f0; padding: 8px 12px; border-radius: 6px; font-size: 12px; }
.usecase-item strong { color: #e8590c; display: block; margin-bottom: 2px; }
.usecase-item p { color: #64748b; margin: 4px 0; }
</style>
`;export{n as default};
