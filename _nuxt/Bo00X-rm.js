const e=`<script setup lang="ts">
import { ref } from 'vue'

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const mockData = ref<any>(null)
const errorMessage = ref('')

// 模拟 useFetch 行为
async function mockFetch() {
  status.value = 'loading'
  mockData.value = null
  errorMessage.value = ''

  await new Promise(r => setTimeout(r, 1200))

  // 模拟成功
  mockData.value = {
    users: [
      { id: 1, name: '小松鼠', role: '前端' },
      { id: 2, name: '大栗子', role: '后端' },
      { id: 3, name: '花栗鼠', role: '全栈' },
    ]
  }
  status.value = 'success'
}

async function mockFetchError() {
  status.value = 'loading'
  mockData.value = null
  errorMessage.value = ''

  await new Promise(r => setTimeout(r, 800))
  errorMessage.value = '网络请求失败：404 Not Found'
  status.value = 'error'
}

function mockRefresh() {
  mockFetch()
}

const codeExample = \`// 基本 useFetch
const { data, pending, error, refresh } = 
  await useFetch('/api/users')

// 带参数的 useFetch
const { data } = await useFetch('/api/users', {
  query: { page: 1, size: 10 },
  method: 'GET',
})

// 动态 URL（参数变化自动重新请求）
const id = ref(1)
const { data } = await useFetch(\\\`/api/users/\\\${id.value}\\\`)

// 只在客户端请求
const { data } = await useFetch('/api/chart', {
  server: false,
})\`
<\/script>

<template>
  <div class="demo-card">
    <h3>useFetch：声明式数据获取</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button @click="mockFetch" :disabled="status === 'loading'">获取数据</button>
      <button @click="mockFetchError" :disabled="status === 'loading'">模拟错误</button>
      <button @click="mockRefresh" :disabled="status !== 'success'">刷新 refresh()</button>
    </div>

    <div class="status-bar" :class="status">
      状态：{{ { idle: '等待请求', loading: '⏳ 请求中…', success: '✅ 成功', error: '❌ 失败' }[status] }}
    </div>

    <div v-if="status === 'success' && mockData" style="margin-top:8px;">
      <table>
        <thead><tr><th>ID</th><th>姓名</th><th>角色</th></tr></thead>
        <tbody>
          <tr v-for="user in mockData.users" :key="user.id">
            <td>{{ user.id }}</td><td>{{ user.name }}</td><td>{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="status === 'error'" style="margin-top:8px;color:#c62828;">
      {{ errorMessage }}
    </div>

    <h4 style="margin-top:12px;">useFetch 用法</h4>
    <pre class="code-block">{{ codeExample }}</pre>

    <div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;">
      💡 <code>useFetch</code> 是 Nuxt 封装的数据获取组合式函数，自动生成请求 key、处理 SSR/CSR 双端请求、去重和缓存。等价于 <code>useAsyncData(key, () => $fetch(...))</code> 的语法糖。
    </div>
  </div>
</template>

<style scoped>
.status-bar { padding: 8px; border-radius: 6px; font-weight: bold; }
.status-bar.idle { background: #f5f5f5; }
.status-bar.loading { background: #e3f2fd; color: #1565c0; }
.status-bar.success { background: #e8f5e9; color: #2e7d32; }
.status-bar.error { background: #fbe9e7; color: #c62828; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 6px 10px; border: 1px solid #ddd; font-size: 13px; }
th { background: #fff3e0; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
