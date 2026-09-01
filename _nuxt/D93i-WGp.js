const n=`<script setup lang="ts">
import { ref } from 'vue'

interface ProcessStep {
  phase: string
  detail: string
  status: 'pending' | 'running' | 'done'
}

const question = ref('Vue3 的 Pinia 和 Vuex 有什么区别？')
const steps = ref<ProcessStep[]>([])
const finalAnswer = ref('')
const isRunning = ref(false)

const mockSteps: { phase: string; detail: string }[] = [
  { phase: 'Memory 检索', detail: '从对话历史中检索相关上下文：用户之前询问了 Vue3 状态管理相关内容' },
  { phase: 'Retriever 检索', detail: '从 VectorStore 中检索到 3 篇相关文档：\\n1. Pinia 官方迁移指南\\n2. Vuex 到 Pinia 对比\\n3. 组合式 Store 最佳实践' },
  { phase: 'Agent 推理', detail: '思考：需要从架构、API、TypeScript 支持三个维度对比 Pinia 和 Vuex' },
  { phase: '生成回答', detail: '基于检索结果和推理，生成结构化回答' },
]

const mockAnswer = \`Pinia 和 Vuex 的主要区别：

1. **架构设计**：Pinia 去除了 mutations，直接在 actions 中修改状态；Vuex 需要 mutations + actions 双层结构。

2. **TypeScript 支持**：Pinia 天然支持 TypeScript，无需额外类型声明；Vuex 需要 complex 类型包装。

3. **模块化**：Pinia 每个 Store 独立定义，无需嵌套模块；Vuex 使用 modules 嵌套，存在命名空间问题。

4. **体积**：Pinia 约 1KB，Vuex 约 6KB。

5. **组合式 API**：Pinia 完全兼容组合式 API，Vuex 主要面向选项式 API。\`

async function runQA() {
  if (isRunning.value) return
  isRunning.value = true
  steps.value = mockSteps.map((s) => ({ ...s, status: 'pending' as const }))
  finalAnswer.value = ''
  for (let i = 0; i < steps.value.length; i++) {
    steps.value[i].status = 'running'
    await new Promise((r) => setTimeout(r, 1000))
    steps.value[i].status = 'done'
  }
  finalAnswer.value = mockAnswer
  isRunning.value = false
}
<\/script>

<template>
  <div class="demo-card">
    <h3>智能问答助手</h3>
    <p class="desc">Retriever + Agent + Memory 综合应用</p>
    <div class="qa-input">
      <input v-model="question" placeholder="输入问题" @keyup.enter="runQA" />
      <button :disabled="isRunning" @click="runQA">{{ isRunning ? '处理中...' : '提问' }}</button>
    </div>
    <div class="process-steps">
      <div v-for="(step, i) in steps" :key="i" class="process-step" :class="step.status">
        <span class="phase-name">{{ step.phase }}</span>
        <pre class="phase-detail">{{ step.detail }}</pre>
      </div>
    </div>
    <div v-if="finalAnswer" class="final-answer">
      <h4>最终回答</h4>
      <p>{{ finalAnswer }}</p>
    </div>
  </div>
</template>

<style scoped>
.desc { color: #8b5e3c; font-size: 13px; margin-bottom: 8px; }
.qa-input { display: flex; gap: 8px; margin-bottom: 12px; }
.qa-input input { flex: 1; padding: 8px; border: 1px solid #d4a574; border-radius: 4px; }
.qa-input button { padding: 8px 16px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.qa-input button:disabled { opacity: 0.6; cursor: not-allowed; }
.process-steps { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.process-step { padding: 8px 12px; border-radius: 6px; border-left: 3px solid #e8c9a0; background: #fef9f3; }
.process-step.running { border-color: #c8703c; background: #fde8d0; }
.process-step.done { border-color: #6b9e78; background: #f0f7f2; }
.phase-name { font-size: 12px; font-weight: bold; color: #c8703c; }
.phase-detail { margin: 4px 0 0; font-size: 12px; line-height: 1.5; white-space: pre-wrap; color: #5a3e2b; font-family: inherit; }
.final-answer { background: #fde8d0; border: 1px solid #c8703c; border-radius: 8px; padding: 12px; }
.final-answer h4 { margin: 0 0 8px; color: #c8703c; }
.final-answer p { margin: 0; font-size: 13px; line-height: 1.7; white-space: pre-wrap; color: #5a3e2b; }
</style>
`;export{n as default};
