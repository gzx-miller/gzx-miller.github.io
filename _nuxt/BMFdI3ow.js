const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type Mode = 'serial' | 'gather' | 'timeout'

const mode = ref<Mode>('serial')
const TIMEOUT = 0.45

const tasks = [
  { name: '请求 A', duration: 0.3 },
  { name: '请求 B', duration: 0.5 },
  { name: '请求 C', duration: 0.4 },
]

const total = computed(() => {
  const sum = tasks.reduce((acc, t) => acc + t.duration, 0)
  const max = tasks.reduce((acc, t) => Math.max(acc, t.duration), 0)
  if (mode.value === 'serial') return sum
  if (mode.value === 'gather') return max
  return TIMEOUT
})

const logLines = computed(() => {
  const lines: { text: string; state: string }[] = []
  if (mode.value === 'serial') {
    let t = 0
    for (const task of tasks) {
      lines.push({ text: \`await \${task.name}：\${t.toFixed(2)}s 开始 → \${(t + task.duration).toFixed(2)}s 完成\`, state: '' })
      t += task.duration
    }
    return lines
  }

  if (mode.value === 'gather') {
    for (const task of tasks) {
      lines.push({ text: \`\${task.name} 在 0.00s 被交给事件循环，挂起 await asyncio.sleep(\${task.duration})\`, state: '' })
    }
    const finished = [...tasks].sort((a, b) => a.duration - b.duration)
    for (const task of finished) {
      lines.push({ text: \`\${task.name} 在 \${task.duration.toFixed(2)}s 被唤醒，事件循环切回它继续执行\`, state: 'success' })
    }
    return lines
  }

  // wait_for 超时：超出 TIMEOUT 的任务被取消
  for (const task of tasks) {
    const over = task.duration > TIMEOUT
    lines.push({
      text: over
        ? \`\${task.name} 需要 \${task.duration.toFixed(2)}s，超过 \${TIMEOUT}s，被 asyncio.TimeoutError 取消\`
        : \`\${task.name} 在 \${task.duration.toFixed(2)}s 内完成，正常返回\`,
      state: over ? 'error' : 'success',
    })
  }
  return lines
})

const note = computed(() => {
  if (mode.value === 'serial') return '逐个 await，前一个不返回，后一个就不会开始，总耗时是各任务相加。'
  if (mode.value === 'gather') return 'gather 把所有协程同时交给事件循环，某个任务在 sleep 时，循环先切去跑别的，总耗时接近最慢的那个。'
  return \`wait_for 给等待设了上限 \${TIMEOUT}s，超时的协程会被取消，避免无限期卡住。\`
})
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>事件循环调度：串行、gather 与超时</h4>

      <div class="tab-bar">
        <button class="mini-btn" :class="{ active: mode === 'serial' }" @click="mode = 'serial'">逐个 await</button>
        <button class="mini-btn" :class="{ active: mode === 'gather' }" @click="mode = 'gather'">asyncio.gather</button>
        <button class="mini-btn" :class="{ active: mode === 'timeout' }" @click="mode = 'timeout'">wait_for 超时</button>
      </div>

      <div class="log-panel">
        <p v-for="(line, i) in logLines" :key="i" class="log-line" :class="line.state">{{ line.text }}</p>
        <p class="log-line warning">总耗时：{{ total.toFixed(2) }}s</p>
      </div>
      <div class="tips-box">{{ note }}</div>
      <div class="detail-box">
        <pre class="mini-code">async def fetch(name, delay):
    await asyncio.sleep(delay)      # 挂起当前协程，把控制权交回事件循环
    return name

results = await asyncio.gather(     # 三个请求同时开始等待
    fetch("A", 0.3), fetch("B", 0.5), fetch("C", 0.4),
)</pre>
      </div>
    </div>
  </div>
</template>
`;export{n as default};
