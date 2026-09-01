const e=`<script setup lang="ts">
import { ref } from 'vue'

type StreamMode = 'invoke' | 'stream' | 'astream_events'

const activeMode = ref<StreamMode>('stream')
const output = ref('')
const eventLog = ref<{ event: string; data: string }[]>([])
const isRunning = ref(false)
const elapsedTime = ref('')

const mockResponse = 'LangChain.js 是构建 LLM 应用的开源框架。它提供了模型调用、提示模板、链式调用、RAG 检索增强生成等核心能力，帮助开发者快速搭建智能问答、文档分析等应用。'

async function runDemo() {
  if (isRunning.value) return
  isRunning.value = true
  output.value = ''
  eventLog.value = []
  const startTime = Date.now()

  if (activeMode.value === 'invoke') {
    // invoke: 等待完整响应后一次性返回
    eventLog.value.push({ event: 'invoke 开始', data: '等待完整响应...' })
    await new Promise(r => setTimeout(r, 2000))
    output.value = mockResponse
    eventLog.value.push({ event: 'invoke 完成', data: \`返回完整文本，共 \${mockResponse.length} 字符\` })
  } else if (activeMode.value === 'stream') {
    // stream: 逐 token 返回
    eventLog.value.push({ event: 'stream 开始', data: '开始逐 token 接收' })
    let i = 0
    while (i < mockResponse.length) {
      const chunkSize = Math.floor(Math.random() * 3) + 1
      const chunk = mockResponse.slice(i, i + chunkSize)
      output.value += chunk
      i += chunkSize
      eventLog.value.push({ event: 'chunk', data: \`"\${chunk}"\` })
      await new Promise(r => setTimeout(r, 50))
    }
    eventLog.value.push({ event: 'stream 完成', data: '所有 token 接收完毕' })
  } else {
    // astream_events: 事件级别，包含 metadata
    eventLog.value.push({ event: 'start', data: 'chain: RunnableSequence' })
    await new Promise(r => setTimeout(r, 300))
    eventLog.value.push({ event: 'start', data: 'llm: ChatOpenAI' })
    await new Promise(r => setTimeout(r, 200))
    let i = 0
    while (i < mockResponse.length) {
      const chunkSize = Math.floor(Math.random() * 3) + 1
      const chunk = mockResponse.slice(i, i + chunkSize)
      output.value += chunk
      eventLog.value.push({ event: 'llm_chunk', data: \`token="\${chunk}" run_id=abc123\` })
      i += chunkSize
      await new Promise(r => setTimeout(r, 50))
    }
    eventLog.value.push({ event: 'end', data: 'llm: ChatOpenAI (5 tokens)' })
    eventLog.value.push({ event: 'end', data: 'chain: RunnableSequence' })
  }

  elapsedTime.value = \`\${((Date.now() - startTime) / 1000).toFixed(1)}s\`
  isRunning.value = false
}

const codeExamples: Record<StreamMode, string> = {
  invoke: \`// invoke: 等待完整响应
const result = await chain.invoke({ input: "..." })
console.log(result) // 完整文本\`,
  stream: \`// stream: 逐 token 流式输出
const stream = await chain.stream({ input: "..." })
for await (const chunk of stream) {
  process.stdout.write(chunk) // 逐块输出
}\`,
  astream_events: \`// astream_events: 事件级流式
const eventStream = chain.astreamEvents({
  input: "..."
}, { version: "v2" })
for await (const event of eventStream) {
  // event.name: 事件名称
  // event.data: 事件数据
  // event.tags: 标签元数据
  if (event.event === "on_llm_stream") {
    process.stdout.write(event.data.chunk)
  }
}\`,
}
<\/script>

<template>
  <div class="demo-card">
    <h3>流式输出策略对比</h3>
    <div class="mode-tabs">
      <button v-for="m in (['invoke', 'stream', 'astream_events'] as StreamMode[])" :key="m" :class="{ active: activeMode === m }" @click="activeMode = m">
        {{ m }}
      </button>
    </div>
    <button :disabled="isRunning" class="run-btn" @click="runDemo">{{ isRunning ? '运行中...' : '运行' }}</button>
    <div class="columns">
      <div class="col output-col">
        <h4>输出 <span v-if="elapsedTime" class="elapsed">{{ elapsedTime }}</span></h4>
        <div class="output-area">
          <p>{{ output }}<span v-if="isRunning && activeMode !== 'invoke'" class="cursor">|</span></p>
          <p v-if="!output && !isRunning" class="placeholder">点击"运行"查看输出</p>
        </div>
      </div>
      <div class="col event-col">
        <h4>事件日志</h4>
        <div class="event-log">
          <div v-for="(evt, i) in eventLog.slice(-8)" :key="i" class="event-item" :class="evt.event">
            <span class="event-name">{{ evt.event }}</span>
            <span class="event-data">{{ evt.data }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="code-section">
      <h4>代码示例</h4>
      <pre class="code-block">{{ codeExamples[activeMode] }}</pre>
    </div>
  </div>
</template>

<style scoped>
.mode-tabs { display: flex; gap: 8px; margin-bottom: 10px; }
.mode-tabs button { padding: 6px 14px; border: 1px solid #d4a574; border-radius: 4px; background: #fef9f3; cursor: pointer; font-size: 13px; font-family: monospace; }
.mode-tabs button.active { background: #c8703c; color: #fff; border-color: #c8703c; }
.run-btn { padding: 6px 16px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 12px; }
.run-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.columns { display: flex; gap: 12px; margin-bottom: 12px; }
.col { flex: 1; }
.col h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.elapsed { font-size: 12px; color: #6b9e78; font-weight: normal; }
.output-area { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 6px; padding: 12px; min-height: 100px; }
.output-area p { margin: 0; font-size: 13px; line-height: 1.6; color: #5a3e2b; }
.placeholder { color: #a0623a !important; font-style: italic; }
.cursor { animation: blink 0.8s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.event-log { background: #f0f7f2; border: 1px solid #a8d5b8; border-radius: 6px; padding: 8px; max-height: 160px; overflow-y: auto; }
.event-item { display: flex; gap: 6px; padding: 3px 0; font-size: 11px; border-bottom: 1px solid #d4e8d4; }
.event-name { font-weight: bold; color: #c8703c; min-width: 80px; font-family: monospace; }
.event-item.start .event-name { color: #6b8ec8; }
.event-item.end .event-name { color: #6b9e78; }
.event-item.chunk .event-name { color: #c8703c; }
.event-item.llm_chunk .event-name { color: #c8703c; }
.event-data { color: #5a3e2b; font-family: monospace; }
.code-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-section h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.code-block { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>
`;export{e as default};
