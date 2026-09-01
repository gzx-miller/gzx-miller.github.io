const n=`<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loading = ref(false)
const error = ref('')
const lessons = ref<string[]>([])

async function loadLessons() {
  loading.value = true
  error.value = ''
  lessons.value = []

  try {
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    lessons.value = ['组合式 API', '路由守卫', 'Pinia 状态管理']
  } catch {
    error.value = '课程列表加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(loadLessons)
<\/script>

<template>
  <div class="demo-card">
    <h3>异步课程列表</h3>
    <button @click="loadLessons">重新加载</button>
    <p v-if="loading">加载中...</p>
    <p v-else-if="error">{{ error }}</p>
    <ul v-else>
      <li v-for="lesson in lessons" :key="lesson">{{ lesson }}</li>
    </ul>
  </div>
</template>
`;export{n as default};
