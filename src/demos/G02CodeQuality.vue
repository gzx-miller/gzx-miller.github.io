<script setup lang="ts">
import { ref } from 'vue'

const checks = ref([
  { name: 'ESLint 静态检查', passed: true },
  { name: 'Prettier 格式校验', passed: true },
  { name: 'TypeScript 类型检查', passed: false },
])

function fixTypes() {
  const item = checks.value.find((check) => check.name.includes('TypeScript'))
  if (item) item.passed = true
}
</script>

<template>
  <div class="demo-card">
    <ul class="tag-list"><li v-for="check in checks" :key="check.name">{{ check.passed ? '✓' : '×' }} {{ check.name }}</li></ul>
    <button :disabled="checks.every((check) => check.passed)" @click="fixTypes">修复类型错误</button>
  </div>
</template>
