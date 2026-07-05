<script setup>
import { ref, computed } from 'vue'

const mode = ref('express')
const routes = [
  { method: 'GET', path: '/api/users', desc: '获取用户列表' },
  { method: 'POST', path: '/api/users', desc: '创建用户' },
  { method: 'GET', path: '/api/users/:id', desc: '获取单个用户' },
]

const expressCode = computed(() => {
  if (mode.value !== 'express') return ''
  return `// Express 中间件链模式
const app = express()
app.use(cors())          // 中间件 1
app.use(authenticate)    // 中间件 2
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users')
  res.json(users)
})`
})

const fastifyCode = computed(() => {
  if (mode.value !== 'fastify') return ''
  return `// Fastify Schema 验证模式
const app = fastify()
app.get('/api/users', {
  schema: {
    response: {
      200: { type: 'array', items: { $ref: 'User#' } }
    }
  },
  handler: async () => db.users.findMany()
})`
})
</script>

<template><div class="demo-card">
  <p>Express 依赖中间件链逐层处理请求；Fastify 内置 JSON Schema 验证与序列化，性能更优。</p>
  <div class="toggle-row">
    <button :class="{ active: mode === 'express' }" @click="mode = 'express'">Express</button>
    <button :class="{ active: mode === 'fastify' }" @click="mode = 'fastify'">Fastify</button>
  </div>
  <table class="route-table">
    <tbody>
      <tr v-for="r in routes" :key="r.method + r.path"><td><code>{{ r.method }}</code></td><td>{{ r.path }}</td><td>{{ r.desc }}</td></tr>
    </tbody>
  </table>
  <pre class="mini-code"><code>{{ mode === 'express' ? expressCode : fastifyCode }}</code></pre>
  <small>{{ mode === 'express' ? '中间件按注册顺序执行，每个可修改 req/res 或调用 next()。' : 'Schema 自动验证请求与响应，序列化速度比 JSON.stringify 更快。' }}</small>
</div></template>

<style scoped>
.route-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 10px;
}
.route-table th,
.route-table td {
  padding: 6px 8px;
  border: 1px solid #ddd;
  text-align: left;
}
.route-table th {
  background: #fff3e0;
}
.toggle-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.toggle-row button {
  padding: 5px 14px;
  border: 1px solid #e0a06a;
  border-radius: 4px;
  background: #fff;
  color: var(--text);
  cursor: pointer;
  font-size: 13px;
}
.toggle-row button.active {
  background: #e85d04;
  color: #fff;
  border-color: #e85d04;
}
</style>
