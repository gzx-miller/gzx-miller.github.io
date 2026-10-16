const e=`<script setup lang="ts">
import { ref } from 'vue'

interface AgentStep {
  type: 'thought' | 'action' | 'observation' | 'answer'
  content: string
  tool?: string
}

const question = ref('Vue3 的 ref 和 reactive 有什么区别？')
const steps = ref<AgentStep[]>([])
const isRunning = ref(false)

const agentSteps: AgentStep[] = [
  { type: 'thought', content: '我需要查找 Vue3 中 ref 和 reactive 的区别，先搜索相关文档。' },
  { type: 'action', content: '搜索 "Vue3 ref reactive 区别"', tool: 'search' },
  { type: 'observation', content: '找到文档：ref 用于基本类型的响应式包装，reactive 用于对象类型的深度响应式转换。ref 需要通过 .value 访问，reactive 可以直接访问属性。' },
  { type: 'thought', content: '我已经获得了关键信息，可以总结两者的区别了。' },
  { type: 'answer', content: 'ref 和 reactive 的主要区别：\\n1. ref 适合基本类型（string/number/boolean），reactive 适合对象类型\\n2. ref 在 script 中需要 .value 访问，模板中自动解包\\n3. reactive 直接访问属性，但不能替换整个对象\\n4. ref 可以替换整个值，reactive 不行' },
]

async function runAgent() {
  if (isRunning.value) return
  isRunning.value = true
  steps.value = []
  for (const step of agentSteps) {
    await new Promise((r) => setTimeout(r, 800))
    steps.value.push(step)
  }
  isRunning.value = false
}
<\/script>

<template>
  <div class="demo-card">
    <h3>Agent 推理过程</h3>
    <div class="agent-input">
      <input v-model="question" placeholder="输入问题" />
      <button :disabled="isRunning" @click="runAgent">{{ isRunning ? '推理中...' : '开始推理' }}</button>
    </div>
    <div class="agent-steps">
      <div v-for="(step, i) in steps" :key="i" class="agent-step" :class="step.type">
        <span class="step-type">{{ step.type === 'thought' ? '思考' : step.type === 'action' ? '行动' : step.type === 'observation' ? '观察' : '回答' }}</span>
        <span v-if="step.tool" class="step-tool">🔧 {{ step.tool }}</span>
        <p>{{ step.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-input { display: flex; gap: 8px; margin-bottom: 12px; }
.agent-input input { flex: 1; padding: 6px 10px; border: 1px solid #d4a574; border-radius: 4px; }
.agent-input button { padding: 6px 16px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.agent-input button:disabled { opacity: 0.6; cursor: not-allowed; }
.agent-steps { display: flex; flex-direction: column; gap: 6px; }
.agent-step { padding: 8px 12px; border-radius: 6px; border-left: 3px solid; }
.agent-step.thought { background: #fef9f3; border-color: #e8c9a0; }
.agent-step.action { background: #e8f0fe; border-color: #6b8ec8; }
.agent-step.observation { background: #f0f7f2; border-color: #6b9e78; }
.agent-step.answer { background: #fde8d0; border-color: #c8703c; }
.step-type { font-size: 11px; font-weight: bold; color: #8b5e3c; text-transform: uppercase; }
.step-tool { font-size: 11px; margin-left: 8px; color: #6b8ec8; }
.agent-step p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; white-space: pre-wrap; color: #5a3e2b; }
</style>
`;export{e as default};
