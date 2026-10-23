<script setup lang="ts">
import { computed, ref } from 'vue'

type Tone = 'normal' | 'warning' | 'success' | 'error'

interface PathStep {
  node: string
  note: string
  tone: Tone
}

const recursionLimit = 3

const attempts = ref(0)
const path = ref<PathStep[]>([])
const activeNode = ref<string | null>(null)
const running = ref(false)
const finished = ref(false)
const nextNode = ref('outline')

const visited = computed(() => new Set(path.value.map((step) => step.node)))
const lastTone = computed<Tone>(() => path.value.at(-1)?.tone ?? 'normal')

const status = computed(() => {
  if (running.value) return '执行中'
  if (!path.value.length) return '待运行'
  if (finished.value && lastTone.value === 'error') return '已终止：触发递归上限'
  if (finished.value) return '已完成：质检通过'
  return '待重新质检'
})

const routeSnippet = computed(() => {
  const target = finished.value ? 'END' : nextNode.value === 'content' ? 'content' : 'review'
  return [
    'function routeAfterReview(state) {',
    "  if (state.passed) return 'summary'",
    `  if (state.attempts >= ${recursionLimit}) return END`,
    "  return 'content'",
    '}',
    '',
    `// 当前下一跳：${target}`,
    `// attempts：${attempts.value} / recursionLimit：${recursionLimit}`,
  ].join('\n')
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function enter(node: string, delay = 620) {
  activeNode.value = node
  await sleep(delay)
}

async function inspect(passed: boolean) {
  if (running.value || finished.value) return
  running.value = true

  if (!path.value.length) {
    await enter('outline')
    path.value.push({ node: 'outline', note: '拆出质检项：事实、结构、长度', tone: 'normal' })

    await enter('content')
    path.value.push({ node: 'content', note: '产出草稿（第 1 稿）', tone: 'normal' })
  } else if (nextNode.value === 'content') {
    await enter('content')
    path.value.push({
      node: 'content',
      note: `按质检意见重写（第 ${attempts.value + 1} 稿）`,
      tone: 'normal',
    })
  }

  await enter('review')

  if (passed) {
    path.value.push({
      node: 'review',
      note: "通过 → 路由函数返回 'summary'",
      tone: 'success',
    })
    await enter('summary')
    path.value.push({ node: 'summary', note: '压缩成 100 字摘要 → 走向 END', tone: 'success' })
    await enter('END')
    finished.value = true
    nextNode.value = 'END'
  } else {
    attempts.value += 1

    if (attempts.value >= recursionLimit) {
      path.value.push({
        node: 'review',
        note: `第 ${attempts.value} 次不通过；attempts 触顶，路由到 END 强制收尾`,
        tone: 'error',
      })
      await enter('END')
      finished.value = true
      nextNode.value = 'END'
    } else {
      path.value.push({
        node: 'review',
        note: `不通过 → 条件边回到 content，循环 ${attempts.value} / ${recursionLimit}`,
        tone: 'warning',
      })
      nextNode.value = 'content'
    }
  }

  activeNode.value = null
  running.value = false
}

function reset() {
  if (running.value) return
  attempts.value = 0
  path.value = []
  activeNode.value = null
  finished.value = false
  nextNode.value = 'outline'
}
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3>内容质检：条件路由与循环</h3>
      <p class="demo-desc">
        每个节点只负责干活，去向交给路由函数决定。先选一次「质检通过」或「质检不通过」，观察 review 的下一跳、循环次数，以及次数触顶后如何被强制收尾。
      </p>

      <div class="controls">
        <button class="mini-btn" type="button" :disabled="running || finished" @click="inspect(true)">
          质检通过，放行
        </button>
        <button class="mini-btn" type="button" :disabled="running || finished" @click="inspect(false)">
          质检不通过，打回
        </button>
        <button class="mini-btn" type="button" :disabled="running" @click="reset">重置</button>
        <span class="badge" :class="{ success: finished && lastTone !== 'error', error: finished && lastTone === 'error' }">
          {{ status }}
        </span>
      </div>

      <div class="lg-canvas">
        <div class="lg-row">
          <span class="lg-node terminator" :class="{ done: path.length > 0 }">START</span>
          <span class="lg-arrow">→</span>
          <span
            class="lg-node"
            :class="{ active: activeNode === 'outline', done: visited.has('outline') }"
          >
            <span class="lg-node-title">outline</span>
            <span class="lg-node-sub">生成质检项</span>
          </span>
          <span class="lg-arrow">→</span>
          <span
            class="lg-node"
            :class="{ active: activeNode === 'content', done: visited.has('content') }"
          >
            <span class="lg-node-title">content</span>
            <span class="lg-node-sub">写正文</span>
          </span>
          <span class="lg-arrow">→</span>
          <span
            class="lg-node"
            :class="{ active: activeNode === 'review', done: visited.has('review') }"
          >
            <span class="lg-node-title">review</span>
            <span class="lg-node-sub">质检判定</span>
          </span>
          <span class="lg-arrow">→</span>
          <span
            class="lg-node"
            :class="{ active: activeNode === 'summary', done: visited.has('summary') }"
          >
            <span class="lg-node-title">summary</span>
            <span class="lg-node-sub">压缩摘要</span>
          </span>
          <span class="lg-arrow">→</span>
          <span class="lg-node terminator" :class="{ done: finished }">END</span>
        </div>

        <div class="lg-edge-note" :class="{ hit: lastTone === 'warning' }">
          <span class="badge warning">条件边</span>
          review 不通过 → 回到 content（循环 {{ attempts }} / {{ recursionLimit }} 次）
        </div>
        <div class="lg-edge-note" :class="{ hit: lastTone === 'success' }">
          <span class="badge success">条件边</span>
          review 通过 → 前往 summary
        </div>
      </div>

      <div class="grid-2">
        <div class="demo-panel">
          <h4>路由函数的判定结果</h4>
          <pre class="mini-code">{{ routeSnippet }}</pre>
          <div class="prop-row"><span>当前等待</span><span><code>{{ nextNode }}</code></span></div>
          <div class="prop-row"><span>循环次数</span><span><strong>{{ attempts }}</strong></span></div>
          <div class="prop-row"><span>状态</span><span>{{ status }}</span></div>
        </div>

        <div class="demo-panel">
          <h4>节点跳转路径</h4>
          <p v-if="!path.length" class="hint">尚未运行。选一种质检结果开始。</p>
          <p v-for="(step, i) in path" :key="i" class="log-line" :class="step.tone">
            {{ i + 1 }}. {{ step.node }} — {{ step.note }}
          </p>
        </div>
      </div>

      <div class="tips-box">
        同一个决策换一种写法：节点里直接
        <code>return new Command({ goto: 'content', update: { attempts: 1 } })</code>，路由就从边挪进了节点内部。两种方式只能选其一，混用会让图的走向难以推理。
      </div>
    </div>
  </div>
</template>
