const e=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'method' | 'params'>('basic')

const apiExamples = {
  basic: {
    title: 'GET 接口',
    code: \`// server/api/hello.ts
export default defineEventHandler((event) => {
  return { message: '你好，小松鼠！' }
})

// 请求 GET /api/hello
// 响应 { "message": "你好，小松鼠！" }\`,
  },
  method: {
    title: 'RESTful 方法',
    code: \`// server/api/users/index.get.ts → GET /api/users
export default defineEventHandler(async (event) => {
  return [{ id: 1, name: '松鼠' }]
})

// server/api/users/index.post.ts → POST /api/users
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return { id: 2, ...body }
})

// server/api/users/[id].delete.ts → DELETE /api/users/:id
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return { deleted: id }
})\`,
  },
  params: {
    title: '参数与工具',
    code: \`// 路由参数
const id = getRouterParam(event, 'id')

// 查询参数
const query = getQuery(event)  // ?page=1&size=10

// 请求体
const body = await readBody(event)

// 设置响应头
setResponseHeader(event, 'Cache-Control', 'max-age=3600')

// 设置状态码
setResponseStatus(event, 201)

// 返回错误
throw createError({
  statusCode: 404,
  statusMessage: 'Not Found'
})\`,
  },
}

const demoResult = ref('')
const demoLoading = ref(false)

async function callDemoApi(type: 'hello' | 'users' | 'error') {
  demoLoading.value = true
  demoResult.value = ''

  await new Promise(r => setTimeout(r, 500))

  if (type === 'hello') {
    demoResult.value = JSON.stringify({ message: '你好，小松鼠！' }, null, 2)
  } else if (type === 'users') {
    demoResult.value = JSON.stringify([{ id: 1, name: '松鼠' }, { id: 2, name: '栗子' }], null, 2)
  } else {
    demoResult.value = JSON.stringify({ statusCode: 404, statusMessage: 'Not Found' }, null, 2)
  }
  demoLoading.value = false
}
<\/script>

<template>
  <div class="demo-card">
    <h3>API 路由：Server Routes</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button v-for="(val, key) in apiExamples" :key="key"
              :class="{ active: activeTab === key }"
              @click="activeTab = key as keyof typeof apiExamples">
        {{ val.title }}
      </button>
    </div>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <pre class="code-block">{{ apiExamples[activeTab].code }}</pre>
      </div>
      <div style="flex:1;">
        <h4>模拟 API 调用</h4>
        <div style="display:flex;gap:6px;margin-bottom:8px;">
          <button @click="callDemoApi('hello')" :disabled="demoLoading">GET /api/hello</button>
          <button @click="callDemoApi('users')" :disabled="demoLoading">GET /api/users</button>
          <button @click="callDemoApi('error')" :disabled="demoLoading">模拟 404</button>
        </div>
        <div class="result-box">
          <p v-if="demoLoading">⏳ 请求中…</p>
          <pre v-else-if="demoResult">{{ demoResult }}</pre>
          <p v-else style="color:#999;">点击按钮发起请求</p>
        </div>
      </div>
    </div>

    <div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;">
      💡 <code>server/api/</code> 下的文件自动注册为 API 路由，路径 <code>/api/</code> 前缀。文件名后缀 <code>.get.ts</code>、<code>.post.ts</code> 等限定 HTTP 方法。工具函数如 <code>readBody</code>、<code>getQuery</code> 从 <code>h3</code> 自动导入。
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
.result-box { background: #1a1a2e; color: #a5d6a7; padding: 10px; border-radius: 6px; min-height: 80px; font-size: 12px; }
.result-box pre { margin: 0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
