<script setup>
import { computed, ref } from 'vue'

const keyword = ref('')
const courses = [
  { id: 1, title: 'JavaScript 基础', score: 4.8 },
  { id: 2, title: 'Node.js 服务', score: 4.6 },
  { id: 3, title: 'Vue 组件设计', score: 4.9 },
]
const results = computed(() => courses
  .filter((course) => course.title.includes(keyword.value))
  .toSorted((a, b) => b.score - a.score))
</script>

<template><div class="demo-card"><label>搜索课程<input v-model="keyword" /></label><ul><li v-for="course in results" :key="course.id">{{ course.title }} · {{ course.score }}</li></ul></div></template>
