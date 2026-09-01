const e=`<script setup>
import { ref } from 'vue'

const logs = ref([])
const running = ref(false)

function runEventLoop() {
  logs.value = []
  running.value = true
  logs.value.push({ phase: '开始', msg: '--- 事件循环开始 ---' })

  // 1. nextTick（微任务，优先级最高）
  queueMicrotask(() => {
    logs.value.push({ phase: 'nextTick', msg: 'process.nextTick() 执行（微任务，优先于 Promise）' })
  })

  // 2. Promise.then（微任务）
  Promise.resolve().then(() => {
    logs.value.push({ phase: 'Promise', msg: 'Promise.then() 执行（微任务）' })
  })

  // 3. setTimeout（宏任务，下一轮）
  setTimeout(() => {
    logs.value.push({ phase: 'setTimeout', msg: 'setTimeout(fn, 0) 执行（宏任务，Timer 阶段）' })
    // 在 setTimeout 回调中再添加一个 nextTick
    queueMicrotask(() => {
      logs.value.push({ phase: 'nextTick²', msg: 'setTimeout 回调中的 process.nextTick() 执行' })
    })
    Promise.resolve().then(() => {
      logs.value.push({ phase: 'Promise²', msg: 'setTimeout 回调中的 Promise.then() 执行' })
    })
    setTimeout(() => {
      logs.value.push({ phase: '结束', msg: '--- 事件循环结束 ---' })
      running.value = false
    }, 0)
  }, 0)

  // 4. setImmediate（宏任务，Check 阶段，仅 Node.js）
  // 浏览器中不可用，用 setTimeout(fn, 0) 模拟
  setTimeout(() => {
    logs.value.push({ phase: 'setImmediate', msg: 'setImmediate() 执行（Check 阶段，Node.js 特有）' })
  }, 0)

  logs.value.push({ phase: '同步', msg: '同步代码执行完毕，进入事件循环' })
}
<\/script>

<template><div class="demo-card">
  <p>Node.js 事件循环分为<strong>微任务</strong>（nextTick、Promise）和<strong>宏任务</strong>（setTimeout、setImmediate、I/O）。微任务优先于宏任务执行。</p>
  <button :disabled="running" @click="runEventLoop">运行事件循环演示</button>
  <div v-if="logs.length" class="loop-log">
    <div v-for="(log, i) in logs" :key="i" :class="'log-' + log.phase">
      <span class="log-phase">{{ log.phase }}</span>
      <span class="log-msg">{{ log.msg }}</span>
    </div>
  </div>
  <pre class="mini-code"><code>// Node.js 事件循环执行顺序
process.nextTick(() => console.log('1. nextTick'))
Promise.resolve().then(() => console.log('2. Promise'))
setTimeout(() => console.log('3. setTimeout'))
setImmediate(() => console.log('4. setImmediate'))
// 输出顺序：1 → 2 → 3 → 4（大多数情况）</code></pre>
  <small>要点：每次宏任务执行完后，都会清空所有微任务，再进入下一阶段。</small>
</div></template>

<style scoped>
.loop-log { margin: 0.8rem 0; font-size: 12px; line-height: 1.8; }
.log-phase { display: inline-block; width: 90px; font-weight: 600; color: #e8590c; }
.log-msg { color: #475569; }
.log-nextTick, .log-nextTick² { background: #fff7ed; border-left: 3px solid #e8590c; padding-left: 4px; }
.log-Promise, .log-Promise² { background: #f0fdf4; border-left: 3px solid #16a34a; padding-left: 4px; }
.log-setTimeout, .log-setImmediate { background: #f8fafc; border-left: 3px solid #6366f1; padding-left: 4px; }
</style>
`;export{e as default};
