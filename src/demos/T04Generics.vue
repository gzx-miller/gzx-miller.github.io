<script setup lang="ts">
import { ref } from 'vue'

interface Course { id: number; title: string }
interface ApiResult<T> { data: T; message: string }

function success<T>(data: T): ApiResult<T> {
  return { data, message: '读取成功' }
}

const courses: Course[] = [
  { id: 1, title: '组合式 API' },
  { id: 2, title: '组件通信' },
]
const result = ref(success(courses))
</script>

<template>
  <div class="demo-card">
    <p><strong>{{ result.message }}</strong>，共 {{ result.data.length }} 门课程</p>
    <ul><li v-for="course in result.data" :key="course.id">{{ course.title }}</li></ul>
  </div>
</template>
