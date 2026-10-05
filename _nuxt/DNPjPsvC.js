const n=`<script setup lang="ts">
import { ref } from 'vue'

interface ChainStep {
  id: number
  name: string
  input: string
  output: string
  status: 'pending' | 'running' | 'done'
}

const topic = ref('Vue3 响应式原理')
const chainSteps = ref<ChainStep[]>([
  { id: 1, name: '大纲生成', input: '', output: '', status: 'pending' },
  { id: 2, name: '内容展开', input: '', output: '', status: 'pending' },
  { id: 3, name: '摘要提炼', input: '', output: '', status: 'pending' },
])
const isRunning = ref(false)

const mockOutputs = [
  '1. 响应式对象创建\\n2. 依赖收集机制\\n3. 派发更新流程\\n4. nextTick 与异步更新',
  '响应式对象通过 Proxy 拦截 get/set 操作。get 时收集当前副作用函数到依赖集合，set 时触发所有依赖重新执行。nextTick 将更新回调推入微任务队列，避免重复渲染。',
  'Vue3 响应式基于 Proxy，核心流程为：依赖收集 → 派发更新 → 异步批量渲染。理解这三步即可掌握响应式基本原理。',
]

const codeExample = \`// 用 LCEL pipe 串联多步处理
const outlineChain = outlinePrompt.pipe(model).pipe(parser)
const detailChain = detailPrompt.pipe(model).pipe(parser)
const summaryChain = summaryPrompt.pipe(model).pipe(parser)

// 顺序执行：前一步输出作为后一步输入
const outline = await outlineChain.invoke({ topic })
const detail = await detailChain.invoke({ outline })
const summary = await summaryChain.invoke({ detail })\`

async function runChain() {
  if (isRunning.value) return
  isRunning.value = true
  chainSteps.value.forEach((s) => { s.status = 'pending'; s.input = ''; s.output = '' })
  chainSteps.value[0].input = \`主题：\${topic.value}\`
  for (let i = 0; i < chainSteps.value.length; i++) {
    chainSteps.value[i].status = 'running'
    await new Promise((r) => setTimeout(r, 1000))
    chainSteps.value[i].output = mockOutputs[i]
    chainSteps.value[i].status = 'done'
    if (i + 1 < chainSteps.value.length) {
      chainSteps.value[i + 1].input = mockOutputs[i]
    }
  }
  isRunning.value = false
}
<\/script>

<template>
  <div class="demo-card">
    <h3>链式调用</h3>
    <div class="chain-input">
      <label>课程主题 <input v-model="topic" /></label>
      <button :disabled="isRunning" @click="runChain">{{ isRunning ? '执行中...' : '执行链' }}</button>
    </div>
    <div class="chain-steps">
      <div v-for="step in chainSteps" :key="step.id" class="chain-step" :class="step.status">
        <div class="step-header">
          <span class="step-num">{{ step.id }}</span>
          <span class="step-name">{{ step.name }}</span>
          <span class="step-status">{{ step.status === 'done' ? '✓' : step.status === 'running' ? '...' : '—' }}</span>
        </div>
        <div v-if="step.input" class="step-content">
          <small>输入</small>
          <p>{{ step.input }}</p>
        </div>
        <div v-if="step.output" class="step-content output">
          <small>输出</small>
          <p>{{ step.output }}</p>
        </div>
      </div>
    </div>
    <div class="code-example">
      <h4>LCEL 实现</h4>
      <pre>{{ codeExample }}</pre>
    </div>
  </div>
</template>

<style scoped>
.chain-input { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.chain-input input { padding: 6px 10px; border: 1px solid #d4a574; border-radius: 4px; flex: 1; }
.chain-input button { padding: 6px 16px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.chain-input button:disabled { opacity: 0.6; cursor: not-allowed; }
.chain-steps { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.chain-step { border-radius: 8px; padding: 10px; border: 1px solid #e8c9a0; background: #fef9f3; }
.chain-step.running { border-color: #c8703c; background: #fde8d0; }
.chain-step.done { border-color: #6b9e78; background: #f0f7f2; }
.step-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.step-num { width: 22px; height: 22px; border-radius: 50%; background: #c8703c; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
.step-name { font-weight: bold; font-size: 14px; color: #5a3e2b; }
.step-status { margin-left: auto; font-size: 14px; }
.step-content { margin-top: 4px; padding-left: 30px; }
.step-content small { color: #a0623a; font-size: 11px; }
.step-content p { margin: 2px 0; font-size: 12px; line-height: 1.5; white-space: pre-wrap; color: #5a3e2b; }
.step-content.output p { color: #2d5a3a; }
.code-example { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-example h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.code-example pre { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>
`;export{n as default};
