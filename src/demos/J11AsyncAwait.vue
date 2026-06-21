<script setup>
import { ref } from 'vue'

const log = ref([])
const loading = ref(false)
const delay = (label, ms) => new Promise((resolve) => setTimeout(() => resolve(label), ms))

async function loadParallel() {
  loading.value = true
  log.value = ['⏳ 并发加载…']
  try {
    const [courses, notices, progress] = await Promise.all([delay('课程列表', 300), delay('通知', 400), delay('学习进度', 200)])
    log.value.push(`✅ 并发完成：${courses}、${notices}、${progress}`)
  } catch (e) {
    log.value.push(`❌ 错误：${e.message}`)
  } finally {
    loading.value = false
  }
}

async function loadSerial() {
  loading.value = true
  log.value = ['⏳ 串行加载…']
  const steps = ['课程列表', '通知', '学习进度']
  for (const step of steps) {
    const result = await delay(step, 200)
    log.value.push(`  ✓ ${result} 已加载`)
  }
  log.value.push('✅ 串行全部完成')
  loading.value = false
}
</script>

<template><div class="demo-card"><div class="button-row"><button @click="loadParallel" :disabled="loading">并发加载</button><button @click="loadSerial" :disabled="loading">串行加载</button></div><pre role="status">{{ log.join('\n') }}</pre><small>并发用 Promise.all 同时发起，串行列举 await 逐个等待。</small></div></template>
