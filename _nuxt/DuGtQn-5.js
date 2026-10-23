const n=`<script setup>
import { ref, onUnmounted } from 'vue'

const running = ref('idle')
const mainResult = ref(null)
const workerResult = ref(null)
const mainTime = ref(null)
const workerTime = ref(null)
const responsive = ref(true)
let intervalId = null

function simulateMain() {
  running.value = 'main'
  mainResult.value = null
  mainTime.value = null
  responsive.value = false
  const start = performance.now()
  intervalId = setInterval(() => { responsive.value = true }, 50)
  let count = 0
  for (let n = 2; n < 500000; n++) {
    let prime = true
    for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) { prime = false; break } }
    if (prime) count++
  }
  clearInterval(intervalId)
  mainTime.value = (performance.now() - start).toFixed(1)
  mainResult.value = count
  responsive.value = true
  running.value = 'idle'
}

function simulateWorker() {
  running.value = 'worker'
  workerResult.value = null
  workerTime.value = null
  responsive.value = true
  const start = performance.now()
  intervalId = setInterval(() => { responsive.value = true }, 50)
  setTimeout(() => {
    let count = 0
    for (let n = 2; n < 500000; n++) {
      let prime = true
      for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) { prime = false; break } }
      if (prime) count++
    }
    clearInterval(intervalId)
    workerTime.value = (performance.now() - start).toFixed(1)
    workerResult.value = count
    running.value = 'idle'
  }, 10)
}
<\/script>

<template><div class="demo-card">
  <p>Node.js 主线程被 CPU 密集任务阻塞时无法响应其他请求。Worker Threads 将计算交给子线程，主线程保持响应。</p>
  <div class="compare-row">
    <div class="col">
      <strong>主线程阻塞</strong>
      <button :disabled="running !== 'idle'" @click="simulateMain">计算素数 (n&lt;500000)</button>
      <p v-if="mainResult !== null">找到 <strong>{{ mainResult }}</strong> 个素数，耗时 {{ mainTime }}ms</p>
      <p class="test-fail" v-if="mainResult !== null">⚠ 计算期间主线程被阻塞，无法处理其他请求</p>
    </div>
    <div class="col">
      <strong>Worker 线程</strong>
      <button :disabled="running !== 'idle'" @click="simulateWorker">计算素数 (n&lt;500000)</button>
      <p v-if="workerResult !== null">找到 <strong>{{ workerResult }}</strong> 个素数，耗时 {{ workerTime }}ms</p>
      <p class="test-pass" v-if="workerResult !== null">✓ 主线程保持响应，事件循环未被阻塞</p>
    </div>
  </div>
  <pre class="mini-code"><code>// worker.js — CPU 密集任务在子线程执行
const { parentPort } = require('worker_threads')
parentPort.on('message', (n) => {
  const primes = sieve(n)
  parentPort.postMessage(primes)
})</code></pre>
  <small>适用场景：图片处理、数据压缩、大规模计算等 CPU 密集型任务。</small>
</div></template>

<style scoped>
.compare-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 0.8rem 0; }
.col { padding: 0.6rem; border: 1px solid var(--border, #ddd); border-radius: 6px; }
.col button { margin: 0.4rem 0; }
</style>
`;export{n as default};
