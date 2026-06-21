<script setup>
import { computed, reactive } from 'vue'

const profile = reactive({ name: '小栗', city: '杭州', role: '前端开发' })
const card = computed(() => {
  const { name, ...details } = profile
  return { displayName: name.toUpperCase(), ...details }
})
</script>

<template><div class="demo-card"><label>姓名<input v-model="profile.name" /></label><p>{{ card.displayName }} · {{ card.role }} · {{ card.city }}</p><small>解构读取字段，剩余与展开语法创建新对象。</small></div></template>
