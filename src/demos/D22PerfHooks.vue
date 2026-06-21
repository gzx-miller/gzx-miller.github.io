<script setup lang="ts">
import { ref } from 'vue'

const marks: Array<{ name: string; time: number }> = []
const measures: Array<{ name: string; duration: number }> = []
const running = ref(false)
const phase = ref('')

function runBenchmark() {
  running.value = true
  marks.length = 0
  measures.length = 0
  phase.value = '准备'

  // 模拟 performance.mark 和 measure
  const steps = [
    { name: '开始解析 JSON', fn: () => JSON.parse('{"data":' + JSON.stringify(Array(1000).fill(1)) + '}') },
    { name: '开始排序', fn: () => Array(10000).fill(0).map((_, i) => Math.random()).sort() },
    { name: '开始字符串拼接', fn: () => Array(5000).fill('hello').join('-') },
    { name: '开始正则匹配', fn: () => /[a-z]+/.test('hello-world-123') },
  ]

  let i = 0
  const startTime = performance.now()

  function nextStep() {
    if (i >= steps.length) {
      const total = (performance.now() - startTime).toFixed(1)
      phase.value = `完成！总耗时 ${total}ms`
      running.value = false
      return
    }

    const step = steps[i]
    const markStart = `mark_${i}_start`
    const markEnd = `mark_${i}_end`

    phase.value = step.name
    const t0 = performance.now()
    step.fn()
    const t1 = performance.now()
    const duration = (t1 - t0).toFixed(1)

    marks.push({ name: step.name, time: t0 })
    measures.push({ name: step.name, duration: parseFloat(duration) })

    phase.value = `${step.name} 完成，耗时 ${duration}ms`
    i++
    setTimeout(nextStep, 300)
  }

  nextStep()
}

const totalTime = computed(() => {
  return measures.reduce((sum, m) => sum + m.duration, 0).toFixed(1)
})
</script>

<template><div class="demo-card">
  <p><code>perf_hooks</code> 模块提供 Node.js 性能打点能力，类似浏览器 <code>performance</code> API。</p>
  <button :disabled="running" @click="runBenchmark">运行性能基准测试</button>
  <div v-if="phase" class="perf-phase">{{ phase }}</div>

  <div v-if="measures.length" class="perf-results">
    <div class="perf-header">
      <span>操作</span><span>耗时 (ms)</span><span>占比</span>
    </div>
    <div v-for="(m, i) in measures" :key="i" class="perf-row">
      <span>{{ m.name }}</span>
      <span class="perf-dur">{{ m.duration.toFixed(1) }}</span>
      <span class="perf-bar" :style="{ width: (m.duration / Math.max(...measures.map(m=>m.duration)) * 100) + '%' }"></span>
    </div>
    <div class="perf-total">总耗时：{{ totalTime }}ms</div>
  </div>

  <pre class="mini-code"><code>const { performance, PerformanceObserver } = require('node:perf_hooks')

// 打点
performance.mark('A')
doSomething()
performance.mark('B')
performance.measure('A到B', 'A', 'B')

// 监听性能条目
const obs = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(\`\${entry.name}: \${entry.duration.toFixed(2)}ms\`)
  })
})
obs.observe({ entryTypes: ['measure'] })</code></pre>
  <small>要点：<code>perf_hooks</code> 是 Node.js 内置模块，无需安装；适合定位函数级别的性能瓶颈；配合 <code>clinic.js</code> 可做更专业的性能分析。</small>
</div></template>

<style scoped>
.perf-phase { margin: 0.6rem 0; padding: 6px 10px; background: #fff7ed; border-radius: 4px; font-size: 13px; color: #e8590c; }
.perf-results { margin: 0.6rem 0; font-size: 12px; }
.perf-header, .perf-row { display: grid; grid-template-columns: 1fr 80px 100px; padding: 4px 8px; }
.perf-header { background: #f8fafc; font-weight: 600; color: #64748b; font-size: 11px; border-radius: 4px 4px 0 0; }
.perf-row { border-bottom: 1px solid #f1f5f9; }
.perf-dur { font-family: monospace; color: #e8590c; font-weight: 600; }
.perf-bar { display: inline-block; height: 6px; background: linear-gradient(90deg, #e8590c, #f97316); border-radius: 3px; vertical-align: middle; }
.perf-total { padding: 6px 8px; font-weight: 600; color: #334155; border-top: 1px solid #e2e8f0; margin-top: 4px; }
</style>
