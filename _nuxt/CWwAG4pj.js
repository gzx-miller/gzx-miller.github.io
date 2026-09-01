const e=`<script setup lang="ts">
import { ref } from 'vue'

const middlewareType = ref<'named' | 'global' | 'page'>('named')

const middlewareData = {
  named: {
    title: '命名中间件',
    code: \`// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = false // 模拟判断
  if (!isLoggedIn && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
})\`,
    usage: \`// 页面中使用
definePageMeta({
  middleware: 'auth'
  // 或多个: middleware: ['auth', 'admin']
})\`,
  },
  global: {
    title: '全局中间件',
    code: \`// middleware/stats.global.ts
// 文件名带 .global 后缀自动全局生效
export default defineNuxtRouteMiddleware((to, from) => {
  console.log('页面访问：', to.path)
  // 每次 navigation 都会执行
})\`,
    usage: \`// 无需在页面中声明
// .global.ts 后缀使中间件
// 对所有路由自动生效\`,
  },
  page: {
    title: '页面内联中间件',
    code: \`// 直接在页面组件中定义
definePageMeta({
  middleware: [
    (to, from) => {
      if (to.params.id === 'forbidden') {
        return navigateTo('/')
      }
    }
  ]
})\`,
    usage: \`// 适合简单逻辑
// 不需要单独文件
// 直接写在页面组件中\`,
  },
}

const redirectActions = [
  { method: 'navigateTo', desc: '重定向到新路由', usage: "navigateTo('/login')" },
  { method: 'abortNavigation', desc: '中止当前导航', usage: "abortNavigation()" },
  { method: 'abortNavigation(error)', desc: '中止并抛出错误', usage: "abortNavigation(new Error('无权限'))" },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>路由中间件</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button v-for="(val, key) in middlewareData" :key="key"
              :class="{ active: middlewareType === key }"
              @click="middlewareType = key as keyof typeof middlewareData">
        {{ val.title }}
      </button>
    </div>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <h4>中间件定义</h4>
        <pre class="code-block">{{ middlewareData[middlewareType].code }}</pre>
      </div>
      <div style="flex:1;">
        <h4>使用方式</h4>
        <pre class="code-block">{{ middlewareData[middlewareType].usage }}</pre>
      </div>
    </div>

    <h4 style="margin-top:12px;">导航控制方法</h4>
    <table style="width:100%;">
      <thead><tr><th>方法</th><th>说明</th><th>用法</th></tr></thead>
      <tbody>
        <tr v-for="item in redirectActions" :key="item.method">
          <td><code>{{ item.method }}</code></td>
          <td>{{ item.desc }}</td>
          <td><code>{{ item.usage }}</code></td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;">
      💡 中间件执行顺序：全局中间件 → 页面定义的命名中间件（按数组顺序）→ 内联中间件。中间件在 SSR 和 CSR 都会执行。
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
table { border-collapse: collapse; width: 100%; }
th, td { padding: 6px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
