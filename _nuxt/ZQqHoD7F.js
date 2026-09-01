const r=`<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref<'error-page' | 'on-error' | 'api-error'>('error-page')

const errorPageCode = \`<!-- error.vue（项目根目录或 src/ 下） -->
<script setup lang="ts">
const props = defineProps<{
  error: {
    url: string
    statusCode: number
    statusMessage: string
    message: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
<\\/script>

<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage || '出错了' }}</p>
    <button @click="handleError">返回首页</button>
  </div>
</template>\`

const onErrorCode = \`// plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error('Vue 错误：', error)
    // 上报错误到监控服务
  })
  
  nuxtApp.hook('app:error', (error) => {
    console.error('应用错误：', error)
  })
})

// server/api/ 中抛出错误
export default defineEventHandler(() => {
  throw createError({
    statusCode: 404,
    statusMessage: '资源不存在',
  })
})\`

const apiErrorCode = \`// useFetch 错误处理
const { data, error, pending } = await useFetch('/api/users')

// 模板中
// <div v-if="error">{{ error.message }}</div>
// <div v-else-if="pending">加载中…</div>
// <div v-else>{{ data }}</div>

// 手动抛出错误
try {
  await $fetch('/api/submit', { method: 'POST', body: formData })
} catch (err) {
  // 处理请求错误
  console.error(err)
}

// showLoadingError 自动处理
const { data, error } = await useFetch('/api/data', {
  onRequestError({ error }) {
    console.error('请求错误：', error)
  },
  onResponseError({ response }) {
    console.error('响应错误：', response.status)
  },
})\`

const errorTypes = [
  { type: '404', desc: '页面不存在', handler: 'error.vue + 中间件' },
  { type: '500', desc: '服务端渲染错误', handler: 'error.vue + app:error hook' },
  { type: 'API Error', desc: '接口请求错误', handler: 'useFetch error + $fetch try/catch' },
  { type: 'Hydration Mismatch', desc: 'SSR/CSR 不一致', handler: '修复不一致或用 ClientOnly' },
  { type: 'Vue Runtime Error', desc: '组件运行时错误', handler: 'vue:error hook + ErrorBoundary' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>错误处理</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeSection === 'error-page' }" @click="activeSection='error-page'">错误页面</button>
      <button :class="{ active: activeSection === 'on-error' }" @click="activeSection='on-error'">错误钩子</button>
      <button :class="{ active: activeSection === 'api-error' }" @click="activeSection='api-error'">API 错误</button>
    </div>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <pre class="code-block" v-if="activeSection === 'error-page'">{{ errorPageCode }}</pre>
        <pre class="code-block" v-if="activeSection === 'on-error'">{{ onErrorCode }}</pre>
        <pre class="code-block" v-if="activeSection === 'api-error'">{{ apiErrorCode }}</pre>
      </div>
      <div style="flex:1;">
        <h4>错误类型速查</h4>
        <table style="width:100%;">
          <thead><tr><th>类型</th><th>说明</th><th>处理方式</th></tr></thead>
          <tbody>
            <tr v-for="item in errorTypes" :key="item.type">
              <td><code>{{ item.type }}</code></td>
              <td>{{ item.desc }}</td>
              <td>{{ item.handler }}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;">
          💡 <code>clearError()</code> 可清除错误状态并导航；<code>createError()</code> 可主动触发错误。SSR 中的错误会通过 payload 传递到客户端。
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
table { border-collapse: collapse; }
th, td { padding: 5px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{r as default};
