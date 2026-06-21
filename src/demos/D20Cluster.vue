<script setup>
import { ref } from 'vue'

const workerCount = ref(4)
const requests = ref([])
const logs = ref([])
const running = ref(false)
let reqId = 0

function startCluster() {
  logs.value = []
  requests.value = []
  running.value = true
  logs.value.push(`主进程 PID ${Math.floor(Math.random() * 10000) + 1000} 启动，fork ${workerCount.value} 个工作进程`)

  // 模拟创建工作进程
  const workers = []
  for (let i = 0; i < workerCount.value; i++) {
    workers.push({
      id: i + 1,
      pid: Math.floor(Math.random() * 10000) + 2000,
      status: 'online',
      handled: 0
    })
    logs.value.push(`  工作进程 ${i + 1} 启动 (PID: ${workers[i].pid})`)
  }

  // 模拟请求分发（轮询）
  logs.value.push('开始接收请求，使用轮询策略分发...')
  let currentWorker = 0
  const totalRequests = 12
  let completed = 0

  const timer = setInterval(() => {
    if (completed >= totalRequests) {
      clearInterval(timer)
      logs.value.push(`所有请求处理完成。各工作进程处理数: ${
        workers.map(w => `W${w.id}=${w.handled}`).join(', ')
      }`)
      running.value = false
      return
    }

    const wid = currentWorker % workerCount.value
    const rid = ++reqId
    const worker = workers[wid]
    worker.handled++
    const startTime = Date.now()

    requests.value = [...requests.value, {
      id: rid,
      worker: wid + 1,
      pid: worker.pid,
      status: 'processing',
      startTime
    }]

    logs.value.push(`请求 #${rid} → 工作进程 ${wid + 1} (PID: ${worker.pid})`)

    // 模拟处理完成
    setTimeout(() => {
      requests.value = requests.value.map(r =>
        r.id === rid ? { ...r, status: 'done' } : r
      )
      completed++
    }, 300 + Math.random() * 500)

    currentWorker++
  }, 400)
}
</script>

<template><div class="demo-card">
  <p>cluster 模块让 Node.js 充分利用<strong>多核 CPU</strong>。主进程负责接收连接并分发给工作进程，工作进程各自独立处理请求。</p>
  <div class="cluster-controls">
    <label>工作进程数 <input type="number" v-model.number="workerCount" min="1" max="8" /></label>
    <button :disabled="running" @click="startCluster">启动集群模拟</button>
  </div>

  <div v-if="logs.length" class="cluster-log">
    <div v-for="(log, i) in logs" :key="i" class="log-line">{{ log }}</div>
  </div>

  <div v-if="requests.length" class="req-table">
    <div class="req-header">
      <span>请求 ID</span><span>工作进程</span><span>PID</span><span>状态</span>
    </div>
    <div v-for="r in requests" :key="r.id" class="req-row" :class="'status-' + r.status">
      <span>#{{ r.id }}</span><span>W{{ r.worker }}</span><span>{{ r.pid }}</span><span>{{ r.status === 'done' ? '✓ 完成' : '⏳ 处理中' }}</span>
    </div>
  </div>

  <pre class="mini-code"><code>const cluster = require('node:cluster')
const http = require('node:http')

if (cluster.isPrimary) {
  // 主进程：fork 工作进程
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }
} else {
  // 工作进程：各自启动 HTTP 服务器
  http.createServer((req, res) => {
    res.end(\`Handled by Worker \${process.pid}\`)
  }).listen(3000)
}</code></pre>
  <small>要点：cluster 底层使用 child_process.fork()；工作进程共享同一个服务器端口；默认负载均衡策略为轮询（Round-Robin）。</small>
</div></template>

<style scoped>
.cluster-controls { display: flex; gap: 12px; align-items: center; margin: 0.6rem 0; }
.cluster-controls input { width: 50px; padding: 3px 6px; border: 1px solid #ddd; border-radius: 4px; }
.cluster-log { background: #1e1e2e; color: #cdd6f4; padding: 8px 12px; border-radius: 6px; font-size: 11px; line-height: 1.7; margin: 0.6rem 0; font-family: monospace; max-height: 180px; overflow-y: auto; }
.log-line { white-space: pre-wrap; }
.req-table { margin: 0.6rem 0; font-size: 12px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; }
.req-header, .req-row { display: grid; grid-template-columns: 80px 100px 100px 100px; padding: 4px 10px; }
.req-header { background: #f8fafc; font-weight: 600; font-size: 11px; color: #64748b; }
.req-row { border-top: 1px solid #f1f5f9; }
.status-processing { background: #fff7ed; }
.status-done { background: #f0fdf4; }
</style>
