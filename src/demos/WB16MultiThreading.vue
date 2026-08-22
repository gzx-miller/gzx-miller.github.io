<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getWasmBytes } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const workers = ref(4)
const iters = ref(1000)
const finalCount = ref<number | null>(null)
const workerLogs = ref<string[]>([])
const running = ref(false)
const supported = ref(false)
const status = ref('')

let moduleBytes: ArrayBuffer | null = null
let sab: SharedArrayBuffer | null = null
let pool: Worker[] = []

// Worker 内脚本：实例化 atomic 模块，对共享内存做原子自增
const WORKER_SRC = `
self.onmessage = async (e) => {
  const { bytes, iters } = e.data
  const { instance } = await WebAssembly.instantiate(bytes)
  const add = instance.exports.atomicAdd
  for (let i = 0; i < iters; i++) add(0)
  self.postMessage('done')
}
`

onMounted(async () => {
  supported.value = typeof window !== 'undefined' && window.crossOriginIsolated === true
  try {
    moduleBytes = getWasmBytes('atomic').slice().buffer as ArrayBuffer
    // 借助同一模块先拿一份共享内存实例（仅用于获得 SharedArrayBuffer）
    const result = (await WebAssembly.instantiate(moduleBytes.slice(0))) as
      | WebAssembly.Instance
      | { instance: WebAssembly.Instance }
    const inst = 'instance' in result ? result.instance : result
    sab = (inst.exports.memory as WebAssembly.Memory).buffer as unknown as SharedArrayBuffer
    new Int32Array(sab)[0] = 0
    status.value = '共享内存就绪，可启动多个 Worker 并发补货'
  } catch (e) {
    status.value = `初始化失败：${(e as Error).message}`
  }
})

function run() {
  if (!sab || !moduleBytes || running.value) return
  running.value = true
  workerLogs.value = []
  finalCount.value = null
  new Int32Array(sab)[0] = 0

  const n = Math.max(1, Math.min(8, workers.value | 0))
  const k = Math.max(1, Math.min(100000, iters.value | 0))
  const done = new Array(n).fill(false)

  for (let i = 0; i < n; i++) {
    const worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' })))
    worker.onmessage = () => {
      done[i] = true
      workerLogs.value.push(`店员 ${i + 1} 完成 ${k} 次补货`)
      worker.terminate()
      if (done.every(Boolean)) {
        const view = new Int32Array(sab!)
        finalCount.value = view[0]
        running.value = false
        status.value = `预期 ${n * k}，实际 ${view[0]} —— 原子操作保证并发不丢更新`
      }
    }
    worker.onerror = (e) => {
      status.value = `Worker 错误：${e.message}`
      running.value = false
    }
    worker.postMessage({ bytes: moduleBytes, iters: k })
    pool.push(worker)
  }
}

onUnmounted(() => {
  pool.forEach((w) => w.terminate())
  pool = []
})

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>多线程与 Worker：四个店员并发补货</h3>
    <p class="desc">
      Wasm 单线程无法并行，但配合 Web Worker 和共享内存就能真正利用多核。下面启动多个
      Worker，各自对共享内存执行 <code>atomicAdd</code>——若不用原子指令，结果会因竞态丢失。
    </p>

    <div class="toolbar">
      <label class="input-line">
        店员数（1~8）
        <input v-model.number="workers" type="number" min="1" max="8" />
      </label>
      <label class="input-line">
        每人补货次数
        <input v-model.number="iters" type="number" min="1" max="100000" />
      </label>
      <button :disabled="running || !supported" @click="run">
        {{ running ? '补货中…' : '🚀 并发补货' }}
      </button>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div v-if="!supported" class="warn">
      ⚠️ 当前页面未启用跨源隔离（COOP/COEP），SharedArrayBuffer 不可用，并发演示无法运行。
      本地开发可在服务端返回对应响应头后重试。
    </div>

    <div class="result-box">
      <div class="count">
        <span>共享库存最终值</span>
        <code>{{ finalCount ?? '…' }}</code>
      </div>
      <ul class="logs">
        <li v-for="(line, i) in workerLogs" :key="i">{{ line }}</li>
        <li v-if="workerLogs.length === 0" class="empty">等待 Worker 回报…</li>
      </ul>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>Web Worker 提供并行执行，Wasm 模块在其中实例化即可</li>
        <li>共享内存让多个线程操作同一份数据，原子指令防竞态</li>
        <li>计算密集任务放 Worker 可避免阻塞 UI 主线程</li>
        <li>开发环境需在响应头配置 <code>Cross-Origin-Opener-Policy</code> 等</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.desc {
  color: var(--muted);
  line-height: 1.7;
}

.toolbar {
  display: flex;
  align-items: end;
  gap: 12px;
  flex-wrap: wrap;
}

.input-line {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}

.input-line input {
  width: 110px;
}

.warn {
  border-radius: 8px;
  background: rgba(217, 75, 38, 0.12);
  color: var(--leaf-red);
  padding: 10px 14px;
  font-size: 13px;
}

.result-box {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 16px;
  display: grid;
  gap: 12px;
}

.count {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.count span {
  color: var(--muted);
}

.count code {
  color: var(--accent-strong);
  font-size: 34px;
  font-weight: 800;
}

.logs {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.logs li {
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 6px 10px;
  color: var(--text);
  font-size: 12px;
}

.logs .empty {
  color: var(--muted);
  background: none;
  font-size: 13px;
}

.status {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.tips-box {
  border-radius: 8px;
  background: rgba(255, 218, 159, 0.24);
  padding: 12px 16px;
}

.tips-box ul {
  margin: 6px 0 0;
  padding-left: 20px;
  color: var(--muted);
  line-height: 1.8;
}
</style>
