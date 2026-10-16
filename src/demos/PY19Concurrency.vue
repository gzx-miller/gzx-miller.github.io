<script setup lang="ts">
import { computed, ref } from 'vue'

type Workload = 'io' | 'cpu'
type Mode = 'serial' | 'thread' | 'process'

const workload = ref<Workload>('io')
const mode = ref<Mode>('serial')

const tasks = [
  { name: '任务 A', cost: 0.5 },
  { name: '任务 B', cost: 0.5 },
  { name: '任务 C', cost: 0.5 },
  { name: '任务 D', cost: 0.5 },
]

const PROCESS_OVERHEAD = 0.2

const total = computed(() => {
  const sum = tasks.reduce((acc, t) => acc + t.cost, 0)
  const longest = tasks.reduce((acc, t) => Math.max(acc, t.cost), 0)
  if (mode.value === 'serial') return sum
  if (mode.value === 'thread') {
    // I/O 密集：等待时释放 GIL，可重叠；CPU 密集：受 GIL 限制，无法真正并行
    return workload.value === 'io' ? longest : sum
  }
  return longest + PROCESS_OVERHEAD
})

const logLines = computed(() => {
  const lines: string[] = []
  if (mode.value === 'serial') {
    let t = 0
    for (const task of tasks) {
      lines.push(`${task.name} 开始于 ${t.toFixed(1)}s，结束于 ${(t + task.cost).toFixed(1)}s`)
      t += task.cost
    }
    return lines
  }
  if (mode.value === 'thread' && workload.value === 'cpu') {
    return [
      '4 个线程同时被创建',
      '同一时刻只有一个线程执行 Python 字节码（GIL）',
      '任务排队轮流计算，总耗时与串行持平',
    ]
  }
  const overhead = mode.value === 'process' ? PROCESS_OVERHEAD : 0
  for (const task of tasks) {
    lines.push(`${task.name} 并发执行，0.0s → ${(task.cost + overhead).toFixed(1)}s`)
  }
  return lines
})

const conclusion = computed(() => {
  if (mode.value === 'serial') return '一次只做一个，等待时间无法重叠。'
  if (mode.value === 'thread') {
    return workload.value === 'io'
      ? 'I/O 等待时会释放 GIL，线程可重叠，接近「最长任务」耗时。'
      : 'CPU 计算不释放 GIL，线程只能轮流跑，几乎看不到加速。'
  }
  return `进程各自独立解释器，可真正并行；但要额外付出约 ${PROCESS_OVERHEAD}s 的启动与序列化开销。`
})

const compareRows = [
  { dim: '内存', thread: '共享同一进程内存', process: '各自独立，传参需序列化' },
  { dim: '适用场景', thread: 'I/O 密集（网络、磁盘）', process: 'CPU 密集（计算）' },
  { dim: '受 GIL 限制', thread: '是，纯计算无法并行', process: '否，各进程独立解释器' },
  { dim: '通信方式', thread: '共享变量 + Lock', process: 'Queue / Pipe / 共享内存' },
  { dim: '开销', thread: '较小', process: '较大' },
]
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>线程与进程的对比与耗时模拟</h4>

      <table>
        <thead><tr><th>维度</th><th>线程 threading</th><th>进程 multiprocessing</th></tr></thead>
        <tbody>
          <tr v-for="row in compareRows" :key="row.dim">
            <td>{{ row.dim }}</td>
            <td><small>{{ row.thread }}</small></td>
            <td><small>{{ row.process }}</small></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 16px;">串行 vs 并发耗时</h4>
      <div class="row">
        <label>任务类型：</label>
        <select v-model="workload">
          <option value="io">I/O 密集（各任务等待 0.5s）</option>
          <option value="cpu">CPU 密集（各任务计算 0.5s）</option>
        </select>
        <button class="mini-btn" :class="{ active: mode === 'serial' }" @click="mode = 'serial'">串行</button>
        <button class="mini-btn" :class="{ active: mode === 'thread' }" @click="mode = 'thread'">线程并发</button>
        <button class="mini-btn" :class="{ active: mode === 'process' }" @click="mode = 'process'">进程并发</button>
      </div>

      <div class="log-panel" style="margin-top: 12px;">
        <p v-for="(line, i) in logLines" :key="i" class="log-line">{{ line }}</p>
        <p class="log-line success">总耗时：{{ total.toFixed(1) }}s</p>
      </div>
      <div class="tips-box">{{ conclusion }}</div>
    </div>
  </div>
</template>
