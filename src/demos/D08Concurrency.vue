<script setup>
import { ref } from 'vue'

const active = ref(0)
const completed = ref(0)
const running = ref(false)
async function runPool() {
  running.value = true; completed.value = 0
  const jobs = Array.from({ length: 6 }, (_, index) => index)
  async function worker() {
    while (jobs.length) { jobs.shift(); active.value++; await new Promise((r) => setTimeout(r, 180)); active.value--; completed.value++ }
  }
  await Promise.all([worker(), worker()])
  running.value = false
}
</script>

<template><div class="demo-card"><button :disabled="running" @click="runPool">以并发 2 执行任务</button><p>执行中 {{ active }} · 已完成 {{ completed }} / 6</p><small>限制并发可保护数据库、文件句柄和下游服务。</small></div></template>
