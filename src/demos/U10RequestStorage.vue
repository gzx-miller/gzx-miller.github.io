<script setup lang="ts">
import { ref } from 'vue'

const courses = ref<{ title: string; tag: string }[]>([])
const loading = ref(false)
const token = ref('')
const cacheHit = ref(false)

const mockData = [
  { title: 'Vue3 组合式 API 实战', tag: '入门' },
  { title: 'Pinia 状态管理', tag: '进阶' },
  { title: 'Nuxt 文件路由', tag: '工程' },
  { title: 'uni-app 跨端开发', tag: '实战' },
]

// 模拟 uni.request 封装的 Promise 请求
function request() {
  return new Promise<typeof mockData>((resolve) => {
    setTimeout(() => resolve(mockData), 700)
  })
}

async function fetchCourses() {
  loading.value = true
  cacheHit.value = courses.value.length > 0
  const list = await request()
  courses.value = list
  loading.value = false
}

function saveToken() {
  token.value = `squirrel-token-${Math.random().toString(16).slice(2, 8)}`
}
</script>

<template>
  <div class="demo-card">
    <div class="row">
      <button type="button" :disabled="loading" @click="fetchCourses">
        {{ loading ? '请求中…' : '加载课程' }}
      </button>
      <button type="button" @click="saveToken">保存登录态</button>
      <button type="button" @click="courses = []">清空列表</button>
    </div>

    <div class="panel">
      <div class="status">
        <span :class="{ live: cacheHit && !loading }">
          {{ loading ? '正在 uni.request 拉取数据…' : cacheHit ? '先读缓存秒开，再异步刷新完成' : '暂无缓存，等待首次请求' }}
        </span>
      </div>
      <ul v-if="courses.length" class="list">
        <li v-for="c in courses" :key="c.title">
          <span>{{ c.title }}</span>
          <em>{{ c.tag }}</em>
        </li>
      </ul>
    </div>

    <div class="storage">
      <span class="label">localStorage 模拟：token</span>
      <code>{{ token || '（尚未保存）' }}</code>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.panel {
  display: grid;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  padding: 14px;
}
.status span {
  color: var(--muted);
  font-size: 13px;
}
.status span.live {
  color: var(--forest);
}
.list {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.list li {
  display: flex;
  justify-content: space-between;
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 8px 12px;
  color: var(--text);
  font-size: 14px;
}
.list em {
  color: var(--accent);
  font-size: 12px;
  font-style: normal;
}
.storage {
  display: flex;
  gap: 10px;
  align-items: center;
}
.label {
  color: var(--muted);
  font-size: 13px;
  white-space: nowrap;
}
.storage code {
  overflow: hidden;
  border-radius: 6px;
  background: var(--surface-soft);
  color: var(--chestnut);
  padding: 4px 8px;
  text-overflow: ellipsis;
}
</style>