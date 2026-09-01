const e=`<script setup lang="ts">
import { ref } from 'vue'

const logs = ref<Array<{ phase: string; msg: string }>>([])
const running = ref(false)

function runTimers() {
  logs.value = []
  running.value = true
  logs.value.push({ phase: '同步', msg: '开始执行同步代码' })

  // 1. process.nextTick（优先级最高，在当前操作完成后立即执行）
  queueMicrotask(() => {
    logs.value.push({ phase: 'nextTick', msg: 'process.nextTick() 回调（微任务，优先执行）' })
  })

  // 2. Promise.then（微任务，在 nextTick 之后）
  Promise.resolve().then(() => {
    logs.value.push({ phase: 'Promise', msg: 'Promise.then() 回调（微任务）' })
  })

  // 3. setTimeout(fn, 0)（宏任务，Timer 阶段）
  setTimeout(() => {
    logs.value.push({ phase: 'setTimeout', msg: 'setTimeout(fn, 0) 回调（宏任务，Timer 阶段）' })
  }, 0)

  // 4. setImmediate（宏任务，Check 阶段，Node.js 特有）
  // 浏览器中不可用，用 setTimeout 模拟
  setTimeout(() => {
    logs.value.push({ phase: 'setImmediate', msg: 'setImmediate() 回调（宏任务，Check 阶段）' })
  }, 0)

  // 5. setInterval（宏任务，重复执行）
  let count = 0
  const intervalId = setInterval(() => {
    count++
    logs.value.push({ phase: 'setInterval', msg: \`setInterval() 第 \${count} 次执行\` })
    if (count >= 2) {
      clearInterval(intervalId)
      logs.value.push({ phase: '结束', msg: 'clearInterval() 停止定时器' })
      running.value = false
    }
  }, 100)

  logs.value.push({ phase: '同步', msg: '同步代码执行完毕，进入事件循环' })
}
<\/script>

<template><div class="demo-card">
  <p>Node.js 定时器有不同优先级和执行时机，理解它们对排查异步问题至关重要。</p>
  <button :disabled="running" @click="runTimers">运行定时器演示</button>

  <div v-if="logs.length" class="timer-log">
    <div v-for="(log, i) in logs" :key="i" :class="'log-' + log.phase">
      <span class="log-phase">{{ log.phase }}</span>
      <span class="log-msg">{{ log.msg }}</span>
    </div>
  </div>

  <div class="timer-compare">
    <div class="timer-item">
      <strong>setTimeout(fn, delay)</strong>
      <p>延迟至少 delay 毫秒后执行一次，精度受事件循环影响。</p>
      <pre class="mini-code"><code>setTimeout(() => {
  console.log('1秒后执行')
}, 1000)</code></pre>
    </div>
    <div class="timer-item">
      <strong>setInterval(fn, delay)</strong>
      <p>每隔 delay 毫秒重复执行，需注意回调执行时间可能超过间隔。</p>
      <pre class="mini-code"><code>const id = setInterval(() => {
  console.log('每秒执行')
}, 1000)
clearInterval(id)  // 停止</code></pre>
    </div>
    <div class="timer-item">
      <strong>setImmediate(fn)</strong>
      <p>在当前事件循环迭代的 Check 阶段执行，Node.js 特有。</p>
      <pre class="mini-code"><code>setImmediate(() => {
  console.log('Check 阶段执行')
})</code></pre>
    </div>
    <div class="timer-item">
      <strong>process.nextTick(fn)</strong>
      <p>优先级最高，在当前操作完成后立即执行，优于 Promise.then。</p>
      <pre class="mini-code"><code>process.nextTick(() => {
  console.log('优先执行')
})</code></pre>
    </div>
  </div>

  <small>执行顺序：同步代码 → nextTick 回调 → Promise.then 回调 → setTimeout/setInterval 回调 → setImmediate 回调</small>
</div></template>

<style scoped>
.timer-log { margin: 0.8rem 0; font-size: 12px; line-height: 1.8; }
.log-phase { display: inline-block; width: 100px; font-weight: 600; color: #e8590c; }
.log-msg { color: #475569; }
.log-nextTick, .log-Promise { background: #fff7ed; border-left: 3px solid #e8590c; padding-left: 4px; }
.log-setTimeout, .log-setInterval, .log-setImmediate { background: #f8fafc; border-left: 3px solid #6366f1; padding-left: 4px; }
.timer-compare { display: grid; gap: 8px; margin: 0.8rem 0; }
.timer-item { background: #fff9f0; padding: 8px 12px; border-radius: 6px; font-size: 12px; }
.timer-item strong { color: #e8590c; display: block; margin-bottom: 4px; }
.timer-item p { color: #64748b; margin: 4px 0; }
</style>
`;export{e as default};
