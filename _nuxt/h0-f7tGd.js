const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

const product = ref('智能笔记本')
const audience = ref('大学生')
const tone = ref('专业')

// PromptTemplate: 用 {variable} 占位，format 时注入变量值
const composedPrompt = computed(() => {
  return \`请为"\${product.value}"撰写一段面向"\${audience.value}"的\${tone.value}风格产品介绍。\`
})

// ChatPromptTemplate: 按消息角色组织提示序列
const chatMessages = computed(() => [
  { role: 'system', content: \`你是一位\${tone.value}风格的产品文案专家。\` },
  { role: 'human', content: \`请为"\${product.value}"撰写一段面向"\${audience.value}"的产品介绍。\` },
])

// partialVariables: 先填入部分变量，后续补全
const partialDemo = computed(() => {
  return {
    template: '请为"{product}"撰写一段面向"{audience}"的{tone}风格产品介绍。',
    partialResult: \`请为"\${product.value}"撰写一段面向"{audience}"的\${tone.value}风格产品介绍。\`,
    note: 'product 和 tone 已注入，audience 待补全',
  }
})
<\/script>

<template>
  <div class="demo-card">
    <h3>PromptTemplate 变量注入</h3>
    <div class="var-row">
      <label>产品 <input v-model="product" /></label>
      <label>受众 <input v-model="audience" /></label>
      <label>风格 <input v-model="tone" /></label>
    </div>
    <div class="prompt-preview">
      <h4>PromptTemplate.format()</h4>
      <pre>{{ composedPrompt }}</pre>
    </div>
    <div class="chat-preview">
      <h4>ChatPromptTemplate 消息序列</h4>
      <div v-for="msg in chatMessages" :key="msg.role" class="chat-msg" :class="msg.role">
        <span class="msg-role">{{ msg.role }}</span>
        <p>{{ msg.content }}</p>
      </div>
    </div>
    <div class="partial-preview">
      <h4>Partial Variables（部分注入）</h4>
      <div class="partial-steps">
        <div class="partial-step">
          <small>原始模板</small>
          <pre>{{ partialDemo.template }}</pre>
        </div>
        <div class="partial-arrow">→ formatPartial({ product, tone })</div>
        <div class="partial-step">
          <small>{{ partialDemo.note }}</small>
          <pre>{{ partialDemo.partialResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.var-row { display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.var-row label { display: flex; align-items: center; gap: 6px; font-size: 14px; }
.var-row input { padding: 4px 8px; border: 1px solid #d4a574; border-radius: 4px; width: 120px; }
.prompt-preview { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
.prompt-preview h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.prompt-preview pre { white-space: pre-wrap; margin: 0; font-size: 13px; line-height: 1.6; color: #5a3e2b; }
.chat-preview h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.chat-msg { padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; }
.chat-msg.system { background: #fde8d0; border-left: 3px solid #c8703c; }
.chat-msg.human { background: #fff; border-left: 3px solid #6b9e78; }
.msg-role { font-size: 11px; font-weight: bold; color: #8b5e3c; text-transform: uppercase; }
.chat-msg p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; }
.partial-preview { background: #f0f7f2; border: 1px solid #a8d5b8; border-radius: 8px; padding: 12px; }
.partial-preview h4 { margin: 0 0 8px; color: #2d5a3a; font-size: 14px; }
.partial-steps { display: flex; align-items: flex-start; gap: 8px; flex-wrap: wrap; }
.partial-step { flex: 1; min-width: 200px; }
.partial-step small { display: block; color: #6b9e78; font-size: 11px; margin-bottom: 4px; }
.partial-step pre { white-space: pre-wrap; margin: 0; font-size: 12px; line-height: 1.5; color: #2d5a3a; background: #fff; padding: 8px; border-radius: 4px; }
.partial-arrow { color: #6b9e78; font-size: 12px; padding-top: 20px; font-family: monospace; }
</style>
`;export{e as default};
