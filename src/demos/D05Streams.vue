<script setup>
import { ref } from 'vue'

const chunks = ref([])
const running = ref(false)
async function streamReport() {
  running.value = true
  chunks.value = []
  for (const chunk of ['header', 'rows 1-100', 'rows 101-200', 'footer']) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    chunks.value.push(chunk)
  }
  running.value = false
}
</script>

<template><div class="demo-card"><button :disabled="running" @click="streamReport">流式导出报表</button><ul><li v-for="chunk in chunks" :key="chunk">已写入 {{ chunk }}</li></ul><small>流按块处理大数据，pipe 会协调背压。</small></div></template>
