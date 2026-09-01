const n=`<script setup lang="ts">
import { ref } from 'vue'

const logs = ref<string[]>([])
const pending = ref(false)

function addLog(msg: string) {
  logs.value.push(msg)
}

function simulate() {
  logs.value = []
  pending.value = true
  const steps = [
    '用户点击"提交"',
    '浏览器 POST 到当前路由（无需写 API）',
    'Server Action 在服务端执行',
    'revalidatePath("/todos") 清缓存',
    '返回新数据，页面自动刷新',
  ]
  let i = 0
  const timer = setInterval(() => {
    if (i < steps.length) {
      addLog(\`[\${i + 1}] \${steps[i]}\`)
      i++
    } else {
      clearInterval(timer)
      pending.value = false
      addLog('✓ 完成，无需手动 refetch')
    }
  }, 600)
}

const codeExample = \`<span style="color:#8a8a3a">// app/actions.ts</span>
<span style="color:#e85d04">'use server'</span>
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function addTodo(formData: FormData) {
  const text = formData.get('text') as string
  await db.todo.create({ data: { text } })
  revalidatePath('/todos')  <span style="color:#7c7c99">// 刷新该路由缓存</span>
}

<span style="color:#8a8a3a">// app/todos/page.tsx — 调用</span>
import { addTodo } from '@/app/actions'

export default function Todos() {
  return (
    &lt;form action={addTodo}&gt;
      &lt;input name="text" /&gt;
      &lt;button&gt;添加&lt;/button&gt;
    &lt;/form&gt;
  )
}\`

const features = [
  '无需手写 API 端点，直接在服务端运行',
  'form action 属性原生支持',
  '自动处理 CSRF 防护',
  '配合 revalidatePath / revalidateTag 刷新缓存',
  '支持 useFormState / useFormStatus 跟踪状态',
  '可用 useOptimistic 实现乐观更新',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>Server Actions：服务端操作</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>执行流程</h4>
        <button class="btn" :disabled="pending" @click="simulate">
          {{ pending ? '执行中...' : '▶ 模拟 Server Action' }}
        </button>
        <div class="log-box">
          <p v-for="(log, i) in logs" :key="i" class="log-line">{{ log }}</p>
        </div>

        <h4 style="margin-top:12px;">核心特性</h4>
        <ul>
          <li v-for="(f, i) in features" :key="i"><small>{{ f }}</small></li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>关键：</strong>文件顶部 "use server" 声明，函数即变成服务端可调用。</p>
          <p><strong>注意：</strong>Server Action 通过 POST 调用，参数自动序列化。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.btn { background: #e85d04; color: #fff; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; }
.btn:disabled { opacity: 0.6; cursor: wait; }
.log-box { background: #1e1e2e; color: #a0e0a0; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 12px; margin-top: 8px; min-height: 120px; }
.log-line { margin: 2px 0; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
`;export{n as default};
