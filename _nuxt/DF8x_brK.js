const n=`<script setup lang="ts">
import { ref } from 'vue'

interface PipelineStep {
  name: string
  type: string
  input: string
  output: string
}

const steps = ref<PipelineStep[]>([])
const isRunning = ref(false)

const fullPipeline: PipelineStep[] = [
  { name: 'ChatPromptTemplate', type: 'prompt', input: '{product: "智能手表"}', output: '请为"智能手表"撰写一段面向"科技爱好者"的产品介绍。' },
  { name: 'ChatOpenAI', type: 'model', input: '请为"智能手表"撰写一段面向"科技爱好者"的产品介绍。', output: '智能手表是一款融合前沿科技与日常佩戴的革新设备，搭载高精度健康传感器，支持血氧、心率和睡眠监测...' },
  { name: 'StringOutputParser', type: 'parser', input: 'AIMessage: 智能手表是一款融合前沿科技与日常佩戴的革新设备...', output: '智能手表是一款融合前沿科技与日常佩戴的革新设备...' },
]

const codeExample = \`// LCEL 两种写法等价
// 1. 管道操作符 (推荐)
const chain = prompt.pipe(model).pipe(parser)

// 2. RunnableSequence.from
const chain = RunnableSequence.from([
  prompt, model, parser
])

// 执行
const result = await chain.invoke({
  product: "智能手表"
})\`

async function runPipeline() {
  if (isRunning.value) return
  isRunning.value = true
  steps.value = []
  for (const step of fullPipeline) {
    await new Promise((r) => setTimeout(r, 800))
    steps.value.push(step)
  }
  isRunning.value = false
}
<\/script>

<template>
  <div class="demo-card">
    <h3>LCEL 管道执行</h3>
    <p class="desc">prompt.pipe(model).pipe(parser) — 数据依次流过每个 Runnable</p>
    <button :disabled="isRunning" class="run-btn" @click="runPipeline">{{ isRunning ? '执行中...' : '执行管道' }}</button>
    <div class="pipeline-flow">
      <template v-for="(step, i) in steps" :key="i">
        <div v-if="i > 0" class="pipe-arrow">.pipe()</div>
        <div class="pipe-step" :class="step.type">
          <span class="step-name">{{ step.name }}</span>
          <div class="step-io">
            <div class="io-item"><small>输入</small><p>{{ step.input }}</p></div>
            <div class="io-item"><small>输出</small><p>{{ step.output }}</p></div>
          </div>
        </div>
      </template>
    </div>
    <div class="code-example">
      <h4>等价写法</h4>
      <pre>{{ codeExample }}</pre>
    </div>
  </div>
</template>

<style scoped>
.desc { color: #8b5e3c; font-size: 13px; margin-bottom: 8px; }
.run-btn { padding: 6px 16px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 12px; }
.run-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.pipeline-flow { display: flex; align-items: flex-start; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.pipe-arrow { color: #c8703c; font-size: 13px; font-weight: bold; padding-top: 14px; font-family: monospace; }
.pipe-step { border-radius: 8px; padding: 10px; min-width: 200px; }
.pipe-step.prompt { background: #fde8d0; border: 1px solid #e8c9a0; }
.pipe-step.model { background: #e8f0fe; border: 1px solid #b8d4f0; }
.pipe-step.parser { background: #f0f7f2; border: 1px solid #a8d5b8; }
.step-name { font-size: 12px; font-weight: bold; color: #5a3e2b; }
.step-io { margin-top: 6px; }
.io-item { margin-bottom: 4px; }
.io-item small { color: #a0623a; font-size: 11px; }
.io-item p { margin: 2px 0 0; font-size: 12px; line-height: 1.4; color: #5a3e2b; }
.code-example { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-example h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.code-example pre { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>
`;export{n as default};
