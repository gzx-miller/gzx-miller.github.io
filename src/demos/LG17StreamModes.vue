<script setup lang="ts">
import { computed, ref } from 'vue'

type ModeId = 'values' | 'updates' | 'messages' | 'custom'
type Tone = 'normal' | 'success' | 'warning'

interface OutputLine {
  text: string
  tone: Tone
}

interface ModeInfo {
  id: ModeId
  label: string
  desc: string
  granularity: string
  frontend: string
  lines: OutputLine[]
}

const modes: ModeInfo[] = [
  {
    id: 'values',
    label: 'values',
    desc: '每个超步结束后，产出一份完整状态快照。字段最全，但传输量也最大。',
    granularity: '全量状态',
    frontend: '调试面板、最终结果预览',
    lines: [
      { text: '{ topic: "多智能体编排", outline: "", draft: "", summary: "" }', tone: 'normal' },
      { text: '{ topic: "多智能体编排", outline: "1. 为什么需要编排…", draft: "", summary: "" }', tone: 'normal' },
      { text: '{ topic: "多智能体编排", outline: "…", draft: "LangGraph 用状态图串起节点…（620 字）", summary: "" }', tone: 'success' },
      { text: '{ topic: "多智能体编排", outline: "…", draft: "…", summary: "状态图把节点组合成可执行流程（100 字）" }', tone: 'success' },
    ],
  },
  {
    id: 'updates',
    label: 'updates',
    desc: '每个节点执行完只产出自己写入的那部分字段，是「步骤条」最合用的粒度。',
    granularity: '节点增量',
    frontend: '执行进度、节点状态灯',
    lines: [
      { text: "{ 'outline': { outline: '1. 为什么需要编排…' } }", tone: 'normal' },
      { text: "{ 'content': { draft: 'LangGraph 用状态图串起节点…（620 字）' } }", tone: 'normal' },
      { text: "{ 'summary': { summary: '状态图把节点组合成可执行流程（100 字）' } }", tone: 'success' },
    ],
  },
  {
    id: 'messages',
    label: 'messages',
    desc: '模型每吐出一段 token 就推送一条消息块，附带 langgraph_node 元数据，用于打字机效果。',
    granularity: 'token 块',
    frontend: '对话气泡逐字输出',
    lines: [
      { text: "[outline] AIMessageChunk('## 1. 为什么')", tone: 'normal' },
      { text: "[outline] AIMessageChunk('需要编排')", tone: 'normal' },
      { text: "[content] AIMessageChunk('LangGraph')", tone: 'normal' },
      { text: "[content] AIMessageChunk(' 用状态图')", tone: 'normal' },
      { text: "[content] AIMessageChunk(' 串起节点')", tone: 'normal' },
      { text: "[summary] AIMessageChunk('状态图把')", tone: 'success' },
      { text: "[summary] AIMessageChunk('节点组合成')", tone: 'success' },
      { text: "[summary] AIMessageChunk('可执行流程')", tone: 'success' },
    ],
  },
  {
    id: 'custom',
    label: 'custom',
    desc: '节点通过 writer 主动写入业务事件，格式完全由你定义，适合进度、引用与告警。',
    granularity: '自定义事件',
    frontend: '进度环、来源引用、埋点',
    lines: [
      { text: "{ type: 'progress', node: 'outline', percent: 30 }", tone: 'normal' },
      { text: "{ type: 'citation', node: 'search', source: 'course-vue3' }", tone: 'normal' },
      { text: "{ type: 'progress', node: 'content', percent: 75 }", tone: 'normal' },
      { text: "{ type: 'done', node: 'summary', tokens: 1240 }", tone: 'success' },
    ],
  },
]

const activeMode = ref<ModeId>('values')
const visibleCount = ref(modes[0].lines.length)
const running = ref(false)

const activeInfo = computed(() => modes.find((mode) => mode.id === activeMode.value) ?? modes[0])

const visibleLines = computed(() => activeInfo.value.lines.slice(0, visibleCount.value))

const snippet = computed(() => {
  switch (activeMode.value) {
    case 'values':
      return "for await (const state of await app.stream(input, { streamMode: 'values' })) {\n  renderSnapshot(state)\n}"
    case 'updates':
      return "for await (const update of await app.stream(input, { streamMode: 'updates' })) {\n  const [node, delta] = Object.entries(update)[0]\n}"
    case 'messages':
      return "for await (const [chunk, meta] of await app.stream(input, { streamMode: 'messages' })) {\n  if (meta.langgraph_node === 'content') appendToken(chunk.content)\n}"
    case 'custom':
      return "for await (const event of await app.stream(input, { streamMode: 'custom' })) {\n  handleBusinessEvent(event)\n}"
    default:
      return ''
  }
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function selectMode(id: ModeId) {
  if (running.value) return
  activeMode.value = id
  visibleCount.value = modes.find((mode) => mode.id === id)?.lines.length ?? 0
}

async function play() {
  if (running.value) return
  running.value = true
  visibleCount.value = 0

  for (let i = 1; i <= activeInfo.value.lines.length; i++) {
    visibleCount.value = i
    await sleep(420)
  }

  running.value = false
}
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3>streamMode 切换台</h3>
      <p class="demo-desc">
        同一段「大纲 → 正文 → 摘要」的执行，换一种 streamMode 就是另一套输出行。切换页签看四种语义的差别，点「重放输出」观察事件如何逐条到达。
      </p>

      <div class="tab-bar">
        <button
          v-for="mode in modes"
          :key="mode.id"
          class="tab-btn"
          :class="{ active: activeMode === mode.id }"
          type="button"
          :disabled="running"
          @click="selectMode(mode.id)"
        >
          {{ mode.label }}
        </button>
      </div>

      <div class="controls">
        <button class="mini-btn" type="button" :disabled="running" @click="play">
          {{ running ? '推送中…' : '重放输出' }}
        </button>
        <span class="badge">{{ activeInfo.granularity }}</span>
        <span class="hint">{{ activeInfo.frontend }}</span>
      </div>

      <div class="grid-2">
        <div class="demo-panel">
          <h4>{{ activeInfo.label }} 模式的输出行</h4>
          <p class="hint">{{ activeInfo.desc }}</p>
          <p v-if="!visibleLines.length" class="hint">点「重放输出」开始接收事件。</p>
          <p
            v-for="(line, i) in visibleLines"
            :key="`${activeMode}-${i}`"
            class="log-line"
            :class="line.tone"
          >
            <code>{{ line.text }}</code>
          </p>
        </div>

        <div class="demo-panel">
          <h4>订阅方式</h4>
          <pre class="mini-code">{{ snippet }}</pre>
          <div class="prop-table" style="margin-top: 12px">
            <table>
              <thead>
                <tr>
                  <th>模式</th>
                  <th>每次产出</th>
                  <th>典型用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>values</code></td>
                  <td>完整状态</td>
                  <td>调试、结果预览</td>
                </tr>
                <tr>
                  <td><code>updates</code></td>
                  <td>节点增量</td>
                  <td>步骤条、状态灯</td>
                </tr>
                <tr>
                  <td><code>messages</code></td>
                  <td>token 块</td>
                  <td>打字机输出</td>
                </tr>
                <tr>
                  <td><code>custom</code></td>
                  <td>业务事件</td>
                  <td>进度、引用、埋点</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="tips-box">
        浏览器不能直接迭代服务端的异步迭代器。服务端把每条事件序列化成 SSE 的
        <code>data:</code> 行，前端只负责按事件类型分发——这一层边界不清，流式输出就会变成一堆无法对应到节点的字符串。
      </div>
    </div>
  </div>
</template>
