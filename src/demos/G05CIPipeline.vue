<script setup lang="ts">
import { ref } from 'vue'

const steps = ref([
  { name: '安装依赖', state: 'waiting' },
  { name: '类型与测试', state: 'waiting' },
  { name: '静态构建', state: 'waiting' },
  { name: '发布 Pages', state: 'waiting' },
])

async function runPipeline() {
  for (const step of steps.value) {
    step.state = 'running'
    await new Promise((resolve) => setTimeout(resolve, 180))
    step.state = 'passed'
  }
}
</script>

<template>
  <div class="demo-card">
    <ol><li v-for="step in steps" :key="step.name">{{ step.state === 'passed' ? '✓' : step.state === 'running' ? '…' : '○' }} {{ step.name }}</li></ol>
    <button :disabled="steps.some((step) => step.state === 'running')" @click="runPipeline">运行流水线</button>
  </div>
</template>
