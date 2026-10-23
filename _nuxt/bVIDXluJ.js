const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

interface TraceSpan {
  id: string
  name: string
  type: 'node' | 'tool'
  duration: number
  tokens?: number
  input: string
  output: string
}

const spans: TraceSpan[] = [
  {
    id: 'retrieve',
    name: 'retrieve',
    type: 'node',
    duration: 620,
    tokens: 820,
    input: '{ query: "推荐一点 Vue3 课程" }',
    output: '{ courses: ["Vue3 入门", "Vue3 组件通信", "组合式 API"] }',
  },
  {
    id: 'tool',
    name: 'search_courses',
    type: 'tool',
    duration: 240,
    input: '{ keyword: "Vue3" }',
    output: '找到 3 门课程（向量库 topK=3）',
  },
  {
    id: 'agent',
    name: 'agent',
    type: 'node',
    duration: 1840,
    tokens: 1240,
    input: '{ messages: [Human, Tool], courses: [...] }',
    output: 'AIMessage("推荐你从《Vue3 入门》开始……")',
  },
]

const visibleCount = ref(0)
const running = ref(false)
const selectedId = ref('retrieve')
const selected = computed(() => spans.find((s) => s.id === selectedId.value) ?? spans[0])
const totalMs = computed(() => 620 + 240 + 1840)
const maxDuration = Math.max(...spans.map((s) => s.duration))

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  if (running.value) return
  running.value = true
  visibleCount.value = 0
  for (let i = 1; i <= spans.length; i++) {
    visibleCount.value = i
    selectedId.value = spans[i - 1].id
    await sleep(680)
  }
  running.value = false
}
<\/script>

<template>
  <div class="demo-card demo-container">
    <h3>运行追踪面板（模拟 Studio 时间线）</h3>
    <p class="demo-desc">
      一次提问在图里实际跑过的每一步：节点耗时、token 用量、输入输出。点任一条目查看详情——这类 trace 面板是排障的第一现场。
    </p>

    <div class="controls">
      <button class="btn" type="button" :disabled="running" @click="run">{{ running ? '回放中…' : '回放一次运行' }}</button>
      <span class="hint">总耗时：{{ visibleCount === spans.length ? \`\${totalMs}ms\` : '—' }}</span>
    </div>

    <div class="grid-2">
      <div class="demo-panel">
        <h4>Trace 时间线</h4>
        <p v-if="!visibleCount" class="hint">点「回放一次运行」逐条显示。</p>
        <div
          v-for="span in spans.slice(0, visibleCount)"
          :key="span.id"
          class="lg-trace"
          :class="{ active: selectedId === span.id }"
          @click="selectedId = span.id"
        >
          <div class="lg-trace-head">
            <span class="badge" :class="span.type === 'node' ? 'think' : 'action'">
              {{ span.type === 'node' ? '节点' : '工具' }}
            </span>
            <strong>{{ span.name }}</strong>
            <span class="hint">{{ span.duration }}ms{{ span.tokens ? \` · \${span.tokens} tokens\` : '' }}</span>
          </div>
          <div class="lg-trace-bar">
            <span class="lg-trace-fill" :style="{ width: \`\${(span.duration / maxDuration) * 100}%\` }"></span>
          </div>
        </div>
      </div>

      <div class="demo-panel">
        <h4>详情：{{ selected.name }}</h4>
        <div class="prop-row"><span>类型</span><span><code>{{ selected.type === 'node' ? '图节点' : '工具调用' }}</code></span></div>
        <div class="prop-row"><span>耗时</span><span><code>{{ selected.duration }}ms</code></span></div>
        <div class="prop-row"><span>token</span><span><code>{{ selected.tokens ?? '—（工具无模型消耗）' }}</code></span></div>
        <h4 style="margin-top: 12px">输入</h4>
        <pre class="mini-code">{{ selected.input }}</pre>
        <h4>输出</h4>
        <pre class="mini-code">{{ selected.output }}</pre>
      </div>
    </div>

    <div class="demo-panel" style="margin-top: 12px">
      <h4>把这份面板搬到本地</h4>
      <pre class="mini-code">npx @langchain/langgraph-cli dev
# 打开 http://localhost:2024 —— Studio 提供同样的时间线、状态回放与「从这里重跑」</pre>
    </div>
  </div>
</template>
`;export{n as default};
