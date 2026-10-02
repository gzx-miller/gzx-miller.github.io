const n=`<script setup lang="ts">
import { ref } from 'vue'

const running = ref(false)
const logs = ref<string[]>([])
const lastDuration = ref<number | null>(null)
const wrappedResponse = ref('')

async function sendRequest() {
  if (running.value) return
  running.value = true
  logs.value = []
  const start = performance.now()

  logs.value.push('⬇️ TransformInterceptor 前置：记录开始时间')
  await new Promise((r) => setTimeout(r, 400))
  logs.value.push('▶️ 控制器处理器执行：courseService.findAll()')
  await new Promise((r) => setTimeout(r, 500))
  logs.value.push('⬆️ TransformInterceptor 后置（map）：包装响应结构')
  logs.value.push('✅ 响应已发送，统计耗时')

  lastDuration.value = Math.round(performance.now() - start)
  wrappedResponse.value = JSON.stringify(
    {
      code: 0,
      data: { list: ['NestJS 实战', 'TypeORM 进阶', 'WebSocket 课堂'], total: 3 },
      timestamp: new Date().toISOString(),
      duration: \`\${lastDuration.value}ms\`,
    },
    null,
    2,
  )
  running.value = false
}
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 请求耗时与统一响应包装（拦截器）</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      点击"发起请求"，观察 <code>TransformInterceptor</code> 在处理器前后的织入顺序与统一响应格式：
    </p>

    <div style="display: flex; gap: 8px; margin-bottom: 12px">
      <button class="tab-btn active" :disabled="running" @click="sendRequest">
        {{ running ? '请求处理中…' : '发起请求 GET /courses' }}
      </button>
    </div>

    <div v-if="logs.length" class="log-box">
      <p v-for="(log, i) in logs" :key="i" class="log-line">{{ log }}</p>
      <p v-if="lastDuration !== null" class="log-line duration">
        ⏱️ 总耗时：<strong>{{ lastDuration }}ms</strong>
      </p>
    </div>

    <pre v-if="wrappedResponse" class="code-block"><code>{{ wrappedResponse }}</code></pre>

    <table v-if="logs.length" class="flow-table">
      <thead>
        <tr><th>阶段</th><th>内容</th></tr>
      </thead>
      <tbody>
        <tr><td>前置（handle 之前）</td><td>记录开始时间、鉴权上下文准备</td></tr>
        <tr><td>处理器</td><td>控制器 → 服务 → 返回数据流</td></tr>
        <tr><td>后置（pipe(map)）</td><td>把 data 包装为 { code, data, timestamp, duration }</td></tr>
      </tbody>
    </table>

    <p class="note">
      <strong>核心 API：</strong><code>next.handle()</code> 返回 Observable，前置代码写在调用前，
      后置逻辑用 <code>map / tap</code> 处理响应流。
    </p>
  </div>
</template>

<style scoped>
.log-box {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed var(--border);
  background: var(--bg);
  margin-bottom: 10px;
}

.log-line {
  margin: 4px 0;
  font-size: 13px;
  color: var(--text);
  font-family: Consolas, Menlo, monospace;
}

.log-line.duration {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
  color: var(--accent-strong);
}

.flow-table th,
.flow-table td {
  padding: 6px 10px;
}

.note {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--muted);
}
</style>
`;export{n as default};
