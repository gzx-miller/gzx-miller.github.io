const n=`<script setup lang="ts">
import { ref } from 'vue'

interface FlowNode {
  id: string
  label: string
  desc: string
}

const flowNodes: FlowNode[] = [
  { id: 'outline', label: 'outline', desc: '生成大纲' },
  { id: 'content', label: 'content', desc: '展开正文' },
  { id: 'review', label: 'review', desc: '质检把关' },
  { id: 'summary', label: 'summary', desc: '压缩摘要' },
]

const activeNode = ref<string | null>(null)
const passed = ref(false)
const logs = ref<string[]>([])
const running = ref(false)
const state = ref({
  outline: '—',
  content: '—',
  attempts: 0,
  status: '未开始',
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function enterNode(id: string, delay = 700) {
  activeNode.value = id
  await sleep(delay)
}

async function run() {
  if (running.value) return
  running.value = true
  logs.value = []
  passed.value = false
  state.value = { outline: '—', content: '—', attempts: 0, status: '运行中' }

  await enterNode('outline')
  logs.value.push('outline → 更新 { outline: 《LangGraph 入门》三级大纲 }')
  state.value.outline = '《LangGraph 入门》三级大纲'
  await sleep(320)

  await enterNode('content')
  logs.value.push('content → 更新 { content: 280 字（草稿） }')
  state.value.content = '280 字（草稿）'
  state.value.attempts = 1
  await sleep(320)

  await enterNode('review')
  logs.value.push('review → 条件边判定：280 字 < 500 字，不通过 → 下一跳 content')
  state.value.status = '质检不通过，打回重写'
  await sleep(520)

  await enterNode('content')
  logs.value.push('content → 重写：更新 { content: 620 字, attempts: +1 }')
  state.value.content = '620 字（重写稿）'
  state.value.attempts = 2
  await sleep(320)

  await enterNode('review')
  logs.value.push('review → 条件边判定：620 字 ≥ 500 字，通过 → 下一跳 summary')
  passed.value = true
  state.value.status = '质检通过'
  await sleep(520)

  await enterNode('summary')
  logs.value.push('summary → 更新 { summary: 100 字摘要 } → 走向 END')
  state.value.status = '完成'
  await sleep(320)

  activeNode.value = null
  running.value = false
}
<\/script>

<template>
  <div class="demo-card demo-container">
    <h3>状态图执行与条件边回环</h3>
    <p class="demo-desc">
      「内容生产线」被画成一张图：节点干活、边管流转。点运行看 review 质检节点如何用条件边把不合格的稿子打回 content——这条回环正是线性链表达不了的。
    </p>

    <div class="controls">
      <button class="btn" type="button" :disabled="running" @click="run">
        {{ running ? '运行中…' : '运行状态图' }}
      </button>
    </div>

    <div class="lg-canvas">
      <div class="lg-row">
        <span class="lg-node terminator">START</span>
        <span class="lg-arrow">→</span>
        <span
          v-for="node in flowNodes.slice(0, 3)"
          :key="node.id"
          class="lg-node"
          :class="{ active: activeNode === node.id, done: logs.some((l) => l.startsWith(\`\${node.id} \`)) }"
        >
          <span class="lg-node-title">{{ node.label }}</span>
          <span class="lg-node-sub">{{ node.desc }}</span>
        </span>
        <span class="lg-arrow">→</span>
        <span
          class="lg-node"
          :class="{ active: activeNode === 'summary', done: logs.some((l) => l.startsWith('summary ')) }"
        >
          <span class="lg-node-title">summary</span>
          <span class="lg-node-sub">压缩摘要</span>
        </span>
        <span class="lg-arrow">→</span>
        <span class="lg-node terminator" :class="{ done: state.status === '完成' }">END</span>
      </div>
      <div class="lg-edge-note" :class="{ hit: !passed && state.attempts === 1 }">
        <span class="badge warning">条件边</span>
        review 不通过 → 沿虚线回到 content（改到合格为止）
      </div>
      <div class="lg-edge-note" :class="{ hit: passed }">
        <span class="badge success">条件边</span>
        review 通过 → 直达 summary
      </div>
    </div>

    <div class="grid-2">
      <div class="demo-panel">
        <h4>状态快照（随节点更新）</h4>
        <div class="prop-row"><span>outline</span><span><strong>{{ state.outline }}</strong></span></div>
        <div class="prop-row"><span>content</span><span><strong>{{ state.content }}</strong></span></div>
        <div class="prop-row"><span>attempts</span><span><strong>{{ state.attempts }}</strong></span></div>
        <div class="prop-row"><span>status</span><span><strong>{{ state.status }}</strong></span></div>
      </div>
      <div class="demo-panel">
        <h4>节点执行日志</h4>
        <p v-if="!logs.length" class="hint">尚未运行。</p>
        <p v-for="(log, i) in logs" :key="i" class="log-line">{{ log }}</p>
      </div>
    </div>
  </div>
</template>
`;export{n as default};
