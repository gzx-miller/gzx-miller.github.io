const e=`<script setup lang="ts">
import { ref } from 'vue'

interface CallbackEvent {
  time: string
  type: string
  detail: string
  level: 'info' | 'token' | 'success' | 'error'
}

const events = ref<CallbackEvent[]>([])
const isRunning = ref(false)

const mockEvents: Omit<CallbackEvent, 'time'>[] = [
  { type: 'handleChainStart', detail: 'RunnableSequence 开始执行', level: 'info' },
  { type: 'handleLLMStart', detail: 'ChatOpenAI 开始调用', level: 'info' },
  { type: 'handleLLMNewToken', detail: 'Token: "LangChain"', level: 'token' },
  { type: 'handleLLMNewToken', detail: 'Token: " 是一个"', level: 'token' },
  { type: 'handleLLMNewToken', detail: 'Token: "强大的"', level: 'token' },
  { type: 'handleLLMNewToken', detail: 'Token: " LLM 应用"', level: 'token' },
  { type: 'handleLLMNewToken', detail: 'Token: "开发框架"', level: 'token' },
  { type: 'handleLLMEnd', detail: 'ChatOpenAI 调用完成，共 5 tokens', level: 'success' },
  { type: 'handleChainEnd', detail: 'RunnableSequence 执行完成', level: 'success' },
]

async function runCall() {
  if (isRunning.value) return
  isRunning.value = true
  events.value = []
  const startTime = Date.now()
  for (const evt of mockEvents) {
    await new Promise((r) => setTimeout(r, 400))
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    events.value.push({ ...evt, time: \`+\${elapsed}s\` })
  }
  isRunning.value = false
}
<\/script>

<template>
  <div class="demo-card">
    <h3>回调事件追踪</h3>
    <button :disabled="isRunning" class="run-btn" @click="runCall">{{ isRunning ? '执行中...' : '执行调用' }}</button>
    <div class="timeline">
      <div v-for="(evt, i) in events" :key="i" class="timeline-item" :class="evt.level">
        <span class="timeline-time">{{ evt.time }}</span>
        <span class="timeline-dot"></span>
        <div class="timeline-content">
          <strong>{{ evt.type }}</strong>
          <p>{{ evt.detail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.run-btn { padding: 6px 16px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 12px; }
.run-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; }
.timeline-time { font-size: 11px; color: #a0623a; font-family: monospace; min-width: 50px; text-align: right; }
.timeline-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.timeline-item.info .timeline-dot { background: #6b8ec8; }
.timeline-item.token .timeline-dot { background: #c8703c; }
.timeline-item.success .timeline-dot { background: #6b9e78; }
.timeline-item.error .timeline-dot { background: #c8503c; }
.timeline-content strong { font-size: 12px; color: #5a3e2b; }
.timeline-content p { margin: 2px 0 0; font-size: 12px; color: #8b5e3c; }
</style>
`;export{e as default};
