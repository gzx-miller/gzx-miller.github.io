const n=`<script setup lang="ts">
import { ref } from 'vue'

const modelName = ref('gpt-4o-mini')
const temperature = ref(0.7)
const maxTokens = ref(1024)
const question = ref('')
const answer = ref('')
const isStreaming = ref(false)

const mockResponses: Record<string, string> = {
  default: 'LangChain.js 是一个用于构建 LLM 应用的框架，它提供了模型调用、提示模板、链式调用、RAG 检索等核心能力，帮助开发者快速搭建智能应用。'
}

function handleSend() {
  if (!question.value.trim() || isStreaming.value) return
  isStreaming.value = true
  answer.value = ''
  const response = mockResponses.default
  let i = 0
  const timer = setInterval(() => {
    if (i < response.length) {
      answer.value += response[i]
      i++
    } else {
      clearInterval(timer)
      isStreaming.value = false
    }
  }, 30)
}
<\/script>

<template>
  <div class="demo-card">
    <h3>LLM 调用模拟器</h3>
    <div class="config-row">
      <label>模型 <input v-model="modelName" /></label>
      <label>温度 <input v-model.number="temperature" type="number" min="0" max="2" step="0.1" /></label>
      <label>maxTokens <input v-model.number="maxTokens" type="number" min="1" max="4096" step="256" /></label>
    </div>
    <div class="chat-area">
      <div class="chat-input-row">
        <input v-model="question" placeholder="输入问题，例如：什么是 LangChain？" @keyup.enter="handleSend" />
        <button :disabled="isStreaming" @click="handleSend">发送</button>
      </div>
      <div v-if="answer || isStreaming" class="chat-response">
        <span class="role-label">助手</span>
        <p>{{ answer }}<span v-if="isStreaming" class="cursor">|</span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-row { display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.config-row label { display: flex; align-items: center; gap: 6px; font-size: 14px; }
.config-row input { padding: 4px 8px; border: 1px solid #d4a574; border-radius: 4px; width: 120px; }
.chat-area { border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; background: #fef9f3; }
.chat-input-row { display: flex; gap: 8px; }
.chat-input-row input { flex: 1; padding: 8px; border: 1px solid #d4a574; border-radius: 4px; }
.chat-input-row button { padding: 8px 16px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.chat-input-row button:disabled { opacity: 0.6; cursor: not-allowed; }
.chat-response { margin-top: 12px; padding: 10px; background: #fff; border-radius: 6px; border-left: 3px solid #c8703c; }
.role-label { font-size: 12px; color: #a0623a; font-weight: bold; }
.chat-response p { margin: 4px 0 0; line-height: 1.6; }
.cursor { animation: blink 0.8s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
</style>
`;export{n as default};
