const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type Tone = 'normal' | 'success' | 'warning'

interface LogEntry {
  text: string
  depth: number
  tone: Tone
}

const parentNodes = [
  { id: 'intake', label: 'intake', desc: '拆解研究需求' },
  { id: 'research', label: 'research', desc: '子图（复用）' },
  { id: 'write', label: 'write', desc: '汇总成稿' },
]

const childNodes = [
  { id: 'plan', label: 'plan', desc: '列检索计划' },
  { id: 'search', label: 'search', desc: '检索课程库' },
  { id: 'synthesize', label: 'synthesize', desc: '归纳要点' },
]

const activeParent = ref<string | null>(null)
const activeChild = ref<string | null>(null)
const doneParent = ref<string[]>([])
const doneChild = ref<string[]>([])
const logs = ref<LogEntry[]>([])
const running = ref(false)
const finished = ref(false)

const checkpointNs = computed(() =>
  activeChild.value || doneChild.value.length
    ? 'research-01|research:8f2a'
    : 'research-01',
)

const state = computed(() => ({
  topic: 'LangGraph 子图与模块化',
  sources: doneChild.value.includes('search') ? 3 : 0,
  draft: doneParent.value.includes('write') ? '初稿 900 字' : '—',
  status: finished.value ? '完成' : running.value ? '执行中' : logs.value.length ? '已暂停' : '待运行',
}))

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  if (running.value) return
  running.value = true
  finished.value = false
  activeParent.value = null
  activeChild.value = null
  doneParent.value = []
  doneChild.value = []
  logs.value = []

  activeParent.value = 'intake'
  await sleep(720)
  logs.value.push({
    text: 'intake 把需求拆成 3 个检索问题，写入父图状态',
    depth: 0,
    tone: 'normal',
  })
  doneParent.value.push('intake')

  activeParent.value = 'research'

  activeChild.value = 'plan'
  await sleep(650)
  logs.value.push({
    text: 'plan 在子图里生成检索计划（父图看不到这一步）',
    depth: 1,
    tone: 'normal',
  })
  doneChild.value.push('plan')

  activeChild.value = 'search'
  await sleep(650)
  logs.value.push({
    text: 'search 命中 3 门课程，写入子图状态 { sources }',
    depth: 1,
    tone: 'normal',
  })
  doneChild.value.push('search')

  activeChild.value = 'synthesize'
  await sleep(650)
  logs.value.push({
    text: 'synthesize 归纳要点，子图内部产生中间结果',
    depth: 1,
    tone: 'normal',
  })
  doneChild.value.push('synthesize')

  activeChild.value = null
  await sleep(320)
  logs.value.push({
    text: 'research 子图结束：只有 { sources } 按输出 schema 映射回父图',
    depth: 0,
    tone: 'success',
  })
  doneParent.value.push('research')

  activeParent.value = 'write'
  await sleep(720)
  logs.value.push({
    text: 'write 读取父图 sources，生成 900 字初稿 → END',
    depth: 0,
    tone: 'success',
  })
  doneParent.value.push('write')

  activeParent.value = null
  running.value = false
  finished.value = true
}

function reset() {
  if (running.value) return
  activeParent.value = null
  activeChild.value = null
  doneParent.value = []
  doneChild.value = []
  logs.value = []
  finished.value = false
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3>父图 + 子图：两级执行顺序</h3>
      <p class="demo-desc">
        research 是父图里的一个节点，内部其实是一张完整的小图。点运行，观察父图如何把控制权交给子图、子图跑完后只把约定字段交还父图。
      </p>

      <div class="controls">
        <button class="btn" type="button" :disabled="running" @click="run">
          {{ running ? '运行中…' : '运行两级图' }}
        </button>
        <button class="mini-btn" type="button" :disabled="running" @click="reset">重置</button>
        <span class="badge" :class="{ success: finished }">{{ state.status }}</span>
      </div>

      <div class="lg-canvas">
        <h4>父图</h4>
        <div class="lg-row">
          <span class="lg-node terminator" :class="{ done: logs.length > 0 }">START</span>
          <span class="lg-arrow">→</span>
          <span
            v-for="node in parentNodes.slice(0, 2)"
            :key="node.id"
            class="lg-node"
            :class="{ active: activeParent === node.id, done: doneParent.includes(node.id) }"
          >
            <span class="lg-node-title">{{ node.label }}</span>
            <span class="lg-node-sub">{{ node.desc }}</span>
            <span v-if="node.id === 'research'" class="lg-node-tag">subgraph</span>
          </span>
          <span class="lg-arrow">→</span>
          <span
            class="lg-node"
            :class="{ active: activeParent === 'write', done: doneParent.includes('write') }"
          >
            <span class="lg-node-title">write</span>
            <span class="lg-node-sub">汇总成稿</span>
          </span>
          <span class="lg-arrow">→</span>
          <span class="lg-node terminator" :class="{ done: finished }">END</span>
        </div>

        <div class="demo-panel" style="margin-top: 12px">
          <h4>子图内部（独立命名空间）</h4>
          <div class="lg-row">
            <span class="lg-node terminator" :class="{ done: doneChild.length > 0 }">START</span>
            <span class="lg-arrow">→</span>
            <span
              v-for="node in childNodes"
              :key="node.id"
              class="lg-node"
              :class="{ active: activeChild === node.id, done: doneChild.includes(node.id) }"
            >
              <span class="lg-node-title">{{ node.label }}</span>
              <span class="lg-node-sub">{{ node.desc }}</span>
            </span>
            <span class="lg-arrow">→</span>
            <span class="lg-node terminator" :class="{ done: doneChild.length === childNodes.length }">END</span>
          </div>
          <p class="hint">
            子图内部的 plan / search / synthesize 中间状态不会自动出现在父图，只按输出 schema 回传。
          </p>
        </div>
      </div>

      <div class="grid-2">
        <div class="demo-panel">
          <h4>执行日志</h4>
          <p v-if="!logs.length" class="hint">点「运行两级图」查看父子节点的执行顺序。</p>
          <p v-for="(entry, i) in logs" :key="i" class="log-line" :class="entry.tone">
            <span v-if="entry.depth" class="hint">↳ </span>{{ entry.text }}
          </p>
        </div>

        <div class="demo-panel">
          <h4>状态映射与检查点</h4>
          <div class="prop-row"><span>父图字段</span><span><code>topic / sources / draft</code></span></div>
          <div class="prop-row"><span>子图输入</span><span><code>{ topic }</code></span></div>
          <div class="prop-row"><span>子图输出</span><span><code>{ sources }</code></span></div>
          <div class="prop-row"><span>父图 topic</span><span>{{ state.topic }}</span></div>
          <div class="prop-row"><span>父图 sources</span><span>{{ state.sources }} 条</span></div>
          <div class="prop-row"><span>父图 draft</span><span>{{ state.draft }}</span></div>
          <div class="prop-row"><span>checkpoint_ns</span><span><code>{{ checkpointNs }}</code></span></div>
        </div>
      </div>

      <div class="tips-box">
        子图编译后就是一张可执行图，可以直接作为父图节点；但它的检查点命名空间独立。父图用
        <code>getState</code> 只能看到映射后的 <code>{ sources }</code>，要看子图内部过程需要同时查询子图命名空间。
      </div>
    </div>
  </div>
</template>
`;export{n as default};
