const n=`<script setup>
import { ref } from 'vue'
const url = ref('https://jsonplaceholder.typicode.com/posts/1')
const method = ref('GET')
const result = ref('')
const loading = ref(false)
const error = ref('')

async function sendRequest() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const opts = method.value !== 'GET' ? { method: method.value } : {}
    const res = await fetch(url.value, opts)
    if (!res.ok) throw new Error(\`\${res.status} \${res.statusText}\`)
    const data = await res.json()
    result.value = JSON.stringify(data, null, 2)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
<\/script>

<template>
  <div class="demo-card">
    <h4>Fetch API 请求演示</h4>
    <div class="row">
      <select v-model="method" class="input">
        <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
      </select>
      <input v-model="url" class="input" style="flex:1" />
      <button class="btn" @click="sendRequest" :disabled="loading">发送</button>
    </div>
    <p v-if="error" class="err">❌ {{ error }}</p>
    <pre v-if="result" class="output">{{ result }}</pre>
    <p v-if="loading">请求中…</p>
  </div>
</template>

<style scoped>
.demo-card { padding: 16px; border: 1px solid #a5d8ff; border-radius: 8px; background: #e7f5ff; }
.row { display: flex; gap: 8px; margin: 8px 0; }
.input { padding: 6px 10px; border: 1px solid #a5d8ff; border-radius: 6px; font-size: 13px; }
.btn { padding: 6px 16px; background: #1971c2; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
.btn:disabled { opacity: 0.5; }
.err { color: #c92a2a; font-size: 13px; }
.output { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow: auto; max-height: 200px; }
</style>
`;export{n as default};
