<script setup lang="ts">
import { ref } from 'vue'

const courses = ref(['Vue3 组合式 API', 'Pinia 状态管理', 'Nuxt 文件路由', 'uni-app 跨端开发'])
const refreshing = ref(false)
const loadingMore = ref(false)

async function onRefresh() {
  refreshing.value = true
  await new Promise((r) => setTimeout(r, 800))
  courses.value = ['最新课程：响应式原理', ...courses.value]
  refreshing.value = false
}

async function onLoadMore() {
  loadingMore.value = true
  await new Promise((r) => setTimeout(r, 600))
  courses.value.push('更多课程 · 事件循环')
  courses.value.push('更多课程 · 原型链')
  loadingMore.value = false
}
</script>

<template>
  <div class="demo-card">
    <div class="controls">
      <button type="button" :disabled="refreshing" @click="onRefresh">下拉刷新</button>
      <button type="button" :disabled="loadingMore" @click="onLoadMore">滚动到底</button>
    </div>

    <div class="screen">
      <div v-if="refreshing" class="pull">↻ 正在刷新…</div>
      <div v-for="c in courses" :key="c" class="row">{{ c }}</div>
      <div v-if="loadingMore" class="foot">加载中…</div>
      <div v-else class="foot">没有更多了</div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  gap: 10px;
}
.screen {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
}
.pull {
  padding: 10px 14px;
  text-align: center;
  color: var(--accent);
  font-size: 13px;
  animation: fadeInUp 0.25s ease-out;
}
.row {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  font-size: 14px;
}
.foot {
  padding: 10px 14px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}
</style>