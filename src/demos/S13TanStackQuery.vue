<script setup lang="ts">
import { ref, computed } from 'vue'

type CacheState = 'fresh' | 'stale' | 'fetching'

const courses = ref([
  { id: 1, title: 'Vue3 组合式 API', enrolled: 128 },
  { id: 2, title: 'TypeScript 进阶', enrolled: 86 },
  { id: 3, title: 'Nuxt 全栈开发', enrolled: 64 },
])
const cacheState = ref<CacheState>('fresh')
const staleTime = ref(5)
const fetchCount = ref(0)

function refetch() {
  cacheState.value = 'fetching'
  fetchCount.value++
  setTimeout(() => {
    courses.value = courses.value.map(c => ({ ...c, enrolled: c.enrolled + Math.floor(Math.random() * 10) }))
    cacheState.value = 'fresh'
  }, 600)
}
function markStale() { cacheState.value = 'stale' }

function optimisticEnroll(id: number) {
  const c = courses.value.find(c => c.id === id)
  if (c) c.enrolled++
}

const stateLabel = computed(() =>
  cacheState.value === 'fresh' ? '🟢 新鲜' : cacheState.value === 'stale' ? '🟡 过期' : '🔵 请求中...'
)
</script>

<template><div class="demo-card">
  <h4>🌰 TanStack Query 服务端状态</h4>
  <p>缓存状态: {{ stateLabel }} | 过期时间: {{ staleTime }}s | 请求次数: {{ fetchCount }}</p>
  <ul>
    <li v-for="c in courses" :key="c.id">
      {{ c.title }} — {{ c.enrolled }}人已报名
      <button @click="optimisticEnroll(c.id)">乐观报名</button>
    </li>
  </ul>
  <button @click="refetch">重新获取</button>
  <button @click="markStale">标记过期</button>
</div></template>
