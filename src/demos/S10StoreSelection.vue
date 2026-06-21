<script setup lang="ts">
const solutions = [
  { name: 'Pinia', model: '集中 Store', fit: 'Vue / Nuxt 业务状态' },
  { name: 'Zustand', model: 'Hook + 外部 Store', fit: 'React 轻量共享状态' },
  { name: 'Jotai', model: '原子依赖图', fit: '细粒度组合状态' },
  { name: 'Redux Toolkit', model: '单向数据流', fit: '大型团队与严格约束' },
  { name: 'XState', model: '状态机', fit: '流程和状态转换复杂' },
]
</script>

<template><div class="demo-card"><div class="comparison-grid"><article v-for="solution in solutions" :key="solution.name" class="mini-card"><strong>{{ solution.name }}</strong><p>{{ solution.model }}</p><small>{{ solution.fit }}</small></article></div><p>先判断状态归属和复杂度，再选择工具；不要因为“全局”就默认引入 Store。</p></div></template>
