<script setup lang="ts">
import { reactive, ref } from 'vue'

interface ReviewTask {
  id: string
  label: string
  cost: number
  desc: string
}

const tasks: ReviewTask[] = [
  { id: 'grammar', label: '语法审查', cost: 1300, desc: '检查错别字与病句' },
  { id: 'logic', label: '逻辑审查', cost: 1000, desc: '检查论证链完整性' },
  { id: 'style', label: '文风审查', cost: 800, desc: '检查表述与语气' },
]

const mode = ref<'serial' | 'parallel'>('parallel')
const states = reactive<Record<string, 'idle' | 'running' | 'done'>>({
  grammar: 'idle',
  logic: 'idle',
  style: 'idle',
})
const finishTimes = reactive<Record<string, string>>({})
const mergeState = ref<'idle' | 'running' | 'done'>('idle')
const logs = ref<string[]>([])
const running = ref(false)
const elapsed = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function reset() {
  for (const task of tasks) {
    states[task.id] = 'idle'
    finishTimes[task.id] = ''
  }
  mergeState.value = 'idle'
  logs.value = []
  elapsed.value = 0
}

async function run() {
  if (running.value) return
  running.value = true
  reset()
  const start = Date.now()
  timer = setInterval(() => {
    elapsed.value = Date.now() - start
  }, 40)

  if (mode.value === 'serial') {
    logs.value.push('[串行] 三个审查依次执行，前一个完成才轮到下一个')
    for (const task of tasks) {
      states[task.id] = 'running'
      logs.value.push(`执行 ${task.label}…（预计 ${task.cost}ms）`)
      await sleep(task.cost)
      states[task.id] = 'done'
      finishTimes[task.id] = `+${Date.now() - start}ms`
      logs.value.push(`√ ${task.label} 完成于 +${Date.now() - start}ms`)
    }
  } else {
    logs.value.push('[并行] 同一条边扇出到三个节点，框架自动并发执行')
    for (const task of tasks) {
      states[task.id] = 'running'
      logs.value.push(`并发启动 ${task.label}…（各自 ${task.cost}ms）`)
    }
    await Promise.all(
      tasks.map(async (task) => {
        await sleep(task.cost)
        states[task.id] = 'done'
        finishTimes[task.id] = `+${Date.now() - start}ms`
      }),
    )
    logs.value.push('三个分支全部完成，进入 fan-in 汇总点')
  }

  mergeState.value = 'running'
  await sleep(500)
  mergeState.value = 'done'
  logs.value.push(`merge 汇总完成，总耗时 ${Date.now() - start}ms`)

  if (timer) clearInterval(timer)
  timer = null
  elapsed.value = Date.now() - start
  running.value = false
}
</script>

<template>
  <div class="demo-card demo-container">
    <h3>扇出并发与 fan-in 汇总</h3>
    <p class="demo-desc">
      一份作业三个维度审查。先跑默认的并行，再切到串行对比总耗时——三个分支互不依赖，唯一正确的等待，是等所有分支都完成后再汇总。
    </p>

    <div class="controls">
      <button class="mini-btn" :class="{ active: mode === 'parallel' }" type="button" :disabled="running" @click="mode = 'parallel'">
        并行（默认）
      </button>
      <button class="mini-btn" :class="{ active: mode === 'serial' }" type="button" :disabled="running" @click="mode = 'serial'">
        串行对比
      </button>
      <button class="btn" type="button" :disabled="running" @click="run">{{ running ? '批改中…' : '开始批改' }}</button>
      <span class="hint">总耗时：{{ running || elapsed ? `${elapsed}ms` : '—' }}</span>
    </div>

    <div class="lg-canvas">
      <div class="lg-row">
        <span class="lg-node terminator">START</span>
        <span class="lg-arrow">→</span>
        <span class="lg-node fanout">扇出</span>
        <span class="lg-arrow">→</span>
        <span class="lg-branch-col">
          <span v-for="task in tasks" :key="task.id" class="lg-node" :class="states[task.id]">
            <span class="lg-node-title">{{ task.label }}</span>
            <span class="lg-node-sub">{{ task.desc }}</span>
            <span v-if="finishTimes[task.id]" class="lg-node-tag">{{ finishTimes[task.id] }}</span>
          </span>
        </span>
        <span class="lg-arrow">→</span>
        <span class="lg-node" :class="mergeState">
          <span class="lg-node-title">merge</span>
          <span class="lg-node-sub">等全部分支完成再汇总</span>
        </span>
        <span class="lg-arrow">→</span>
        <span class="lg-node terminator" :class="{ done: mergeState === 'done' }">END</span>
      </div>
    </div>

    <div class="demo-panel">
      <h4>执行日志</h4>
      <p v-if="!logs.length" class="hint">尚未运行。默认并行模式：三个分支同时开始，总耗时接近最慢的那个。</p>
      <p v-for="(log, i) in logs" :key="i" class="log-line">{{ log }}</p>
    </div>
  </div>
</template>
