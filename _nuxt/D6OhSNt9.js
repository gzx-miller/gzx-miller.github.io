const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

type MemoryType = 'buffer' | 'window' | 'summary'

const activeMemory = ref<MemoryType>('buffer')
const inputMsg = ref('')
const messages = ref<{ role: 'human' | 'ai'; text: string }[]>([])
const windowSize = ref(2)

function sendMessage() {
  if (!inputMsg.value.trim()) return
  messages.value.push({ role: 'human', text: inputMsg.value })
  const mockReplies = [
    'Vue3 的响应式系统基于 Proxy 实现，可以拦截对象的读写操作。',
    'computed 会缓存计算结果，只有依赖变化时才重新计算。',
    'Pinia 是 Vue3 推荐的状态管理库，相比 Vuex 更轻量且支持 TypeScript。',
    'watchEffect 会自动收集依赖，适合快速建立副作用；watch 需要明确指定监听源。',
  ]
  messages.value.push({ role: 'ai', text: mockReplies[messages.value.length % mockReplies.length] })
  inputMsg.value = ''
}

// BufferMemory: 保留完整对话历史
// ConversationBufferWindowMemory: 只保留最近 k 轮对话
// ConversationSummaryMemory: 用 LLM 将历史压缩为摘要
const memoryView = computed(() => {
  if (activeMemory.value === 'buffer') {
    return messages.value.map((m) => \`[\${m.role}]: \${m.text}\`)
  }
  if (activeMemory.value === 'window') {
    return messages.value.slice(-windowSize.value * 2).map((m) => \`[\${m.role}]: \${m.text}\`)
  }
  if (messages.value.length === 0) return ['[摘要]: 暂无对话']
  const topics = [...new Set(messages.value.filter((m) => m.role === 'human').map((m) => m.text.slice(0, 10)))]
  return [\`[摘要]: 用户询问了关于\${topics.join('、')}等问题，AI 已逐一回答。\`]
})

const memoryNames: Record<MemoryType, string> = {
  buffer: 'BufferMemory',
  window: 'BufferWindowMemory',
  summary: 'SummaryMemory',
}
<\/script>

<template>
  <div class="demo-card">
    <h3>对话记忆管理</h3>
    <div class="memory-tabs">
      <button v-for="m in (['buffer', 'window', 'summary'] as MemoryType[])" :key="m" :class="{ active: activeMemory === m }" @click="activeMemory = m">
        {{ memoryNames[m] }}
      </button>
      <label v-if="activeMemory === 'window'" class="window-label">
        窗口 k=<input v-model.number="windowSize" type="number" min="1" max="5" />
      </label>
    </div>
    <div class="memory-layout">
      <div class="chat-panel">
        <div class="chat-messages">
          <div v-for="(msg, i) in messages" :key="i" class="chat-msg" :class="msg.role">
            <span>{{ msg.role === 'human' ? '用户' : 'AI' }}</span>
            <p>{{ msg.text }}</p>
          </div>
        </div>
        <div class="chat-input-row">
          <input v-model="inputMsg" placeholder="输入消息" @keyup.enter="sendMessage" />
          <button @click="sendMessage">发送</button>
        </div>
      </div>
      <div class="memory-panel">
        <h4>Memory 存储</h4>
        <div v-for="(line, i) in memoryView" :key="i" class="memory-line">{{ line }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memory-tabs { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; flex-wrap: wrap; }
.memory-tabs button { padding: 6px 12px; border: 1px solid #d4a574; border-radius: 4px; background: #fef9f3; cursor: pointer; font-size: 12px; }
.memory-tabs button.active { background: #c8703c; color: #fff; border-color: #c8703c; }
.window-label { font-size: 12px; display: flex; align-items: center; gap: 4px; color: #8b5e3c; }
.window-label input { width: 50px; padding: 4px; border: 1px solid #d4a574; border-radius: 4px; }
.memory-layout { display: flex; gap: 12px; }
.chat-panel { flex: 1; }
.chat-messages { max-height: 200px; overflow-y: auto; margin-bottom: 8px; }
.chat-msg { padding: 6px 10px; border-radius: 6px; margin-bottom: 4px; }
.chat-msg.human { background: #fde8d0; border-left: 3px solid #c8703c; }
.chat-msg.ai { background: #f0f7f2; border-left: 3px solid #6b9e78; }
.chat-msg span { font-size: 11px; font-weight: bold; color: #8b5e3c; }
.chat-msg p { margin: 2px 0 0; font-size: 13px; color: #5a3e2b; }
.chat-input-row { display: flex; gap: 6px; }
.chat-input-row input { flex: 1; padding: 6px; border: 1px solid #d4a574; border-radius: 4px; }
.chat-input-row button { padding: 6px 12px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.memory-panel { flex: 1; background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 10px; }
.memory-panel h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.memory-line { font-size: 12px; line-height: 1.6; color: #5a3e2b; padding: 2px 0; font-family: monospace; }
</style>
`;export{e as default};
