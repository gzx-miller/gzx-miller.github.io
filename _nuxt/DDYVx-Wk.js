const n=`<script setup>
import { ref } from 'vue'
const url = ref('https://jsonplaceholder.typicode.com/posts')
const log = ref('')
const loading = ref(false)
let controller = null

async function fetchWithTimeout() {
  log.value = ''
  loading.value = true
  // 创建 AbortController
  controller = new AbortController()
  const signal = controller.signal

  // 3 秒后自动取消
  const timer = setTimeout(() => controller.abort(), 3000)

  try {
    log.value += '⏳ 开始请求（3秒超时）…\\n'
    const res = await fetch(url.value, { signal })
    clearTimeout(timer)
    const data = await res.json()
    log.value += \`✅ 请求成功，收到 \${Array.isArray(data) ? data.length : 1} 条数据\\n\`
  } catch (e) {
    clearTimeout(timer)
    if (e.name === 'AbortError') {
      log.value += '⚠️ 请求已取消（超时或手动取消）\\n'
    } else {
      log.value += \`❌ 错误：\${e.message}\\n\`
    }
  } finally {
    loading.value = false
  }
}

function cancel() {
  controller?.abort()
  log.value += '🛑 手动取消请求\\n'
}
<\/script>

<template>
  <div class="demo-card">
    <h4>AbortController：取消请求</h4>
    <div class="row">
      <input v-model="url" class="input" style="flex:1" />
    </div>
    <div class="row">
      <button class="btn" @click="fetchWithTimeout" :disabled="loading">发送请求（3秒超时）</button>
      <button class="btn btn-cancel" @click="cancel" :disabled="!loading">取消请求</button>
    </div>
    <pre class="output">{{ log || '（日志为空）' }}</pre>
    <p style="font-size:12px;color:#868e96">💡 AbortController 还可用于取消 addEventListener 等可中断操作</p>
  </div>
</template>

<style scoped>
.demo-card { padding: 16px; border: 1px solid #a5d8ff; border-radius: 8px; background: #e7f5ff; font-size: 13px; }
.row { display: flex; gap: 8px; margin: 8px 0; }
.input { padding: 6px 10px; border: 1px solid #a5d8ff; border-radius: 6px; font-size: 13px; flex: 1; }
.btn { padding: 6px 14px; background: #1971c2; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-cancel { background: #c92a2a; }
.output { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; min-height: 100px; white-space: pre-wrap; overflow: auto; }
</style>
`;export{n as default};
