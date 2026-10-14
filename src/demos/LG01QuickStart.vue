<script setup lang="ts">
import { ref } from 'vue'

type StepKind = 'think' | 'action' | 'observe' | 'answer'

interface Step {
  kind: StepKind
  title: string
  detail: string
}

const kindLabel: Record<StepKind, string> = {
  think: '思考',
  action: '行动',
  observe: '观察',
  answer: '回答',
}

const quickQuestions = [
  '有没有适合入门的 Vue3 课程？',
  '帮我推荐一门讲组件通信的课',
  '你好呀',
]

const question = ref(quickQuestions[0])
const steps = ref<Step[]>([])
const answer = ref('')
const messageTrail = ref<string[]>([])
const running = ref(false)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function pushStep(step: Step, delay = 620) {
  steps.value.push(step)
  await sleep(delay)
}

async function run() {
  if (running.value || !question.value.trim()) return
  running.value = true
  steps.value = []
  answer.value = ''
  messageTrail.value = ['HumanMessage']

  const q = question.value.trim()
  const keyword = /Vue/i.test(q) ? 'Vue3' : q.slice(0, 8)
  const needTool = /课程|课|推荐|Vue|学/i.test(q)

  await pushStep({
    kind: 'think',
    title: '模型第一轮推理',
    detail: `用户想了解课程信息。我有一条 search_courses 工具，先检索「${keyword}」再作答。`,
  })

  if (needTool) {
    await pushStep({ kind: 'action', title: '决定调用工具', detail: `search_courses({ keyword: "${keyword}" })` })
    messageTrail.value.push('AIMessage(tool_calls)')
    await pushStep({
      kind: 'observe',
      title: '工具执行完成',
      detail: '返回 3 门课程：《Vue3 入门》（零基础）、《Vue3 组件通信》、《Vue3 组合式 API》',
    })
    messageTrail.value.push('ToolMessage')
    await pushStep({ kind: 'think', title: '模型第二轮推理', detail: '工具结果已拿到，信息足够，可以组织最终回答了。' })
    answer.value = '推荐先学《Vue3 入门》打好基础，再学《Vue3 组件通信》深入组件间数据传递。两门课都已在课程库中，前者零基础可入门。'
  } else {
    answer.value = '你好！我是课程助手，可以按关键词帮你检索课程库，试试问我「推荐 Vue3 课程」。'
  }

  messageTrail.value.push('AIMessage(最终回答)')
  await pushStep({ kind: 'answer', title: '生成最终回答', detail: answer.value })
  running.value = false
}
</script>

<template>
  <div class="demo-card demo-container">
    <h3>ReAct 智能体运行轨迹</h3>
    <p class="demo-desc">
      输入问题或点快捷问题，观察智能体在「思考 → 行动 → 观察」之间的循环——数据不够时它自己决定调用工具，够用就直接回答。
    </p>

    <div class="controls">
      <input v-model="question" type="text" :disabled="running" placeholder="问点什么…" @keydown.enter="run" />
      <button class="btn" type="button" :disabled="running" @click="run">
        {{ running ? '运行中…' : '运行智能体' }}
      </button>
    </div>
    <div class="controls">
      <button v-for="q in quickQuestions" :key="q" class="mini-btn" type="button" :disabled="running" @click="question = q">
        {{ q }}
      </button>
    </div>

    <ol v-if="steps.length" class="lg-timeline">
      <li v-for="(s, i) in steps" :key="i" class="lg-timeline-item" :class="s.kind">
        <span class="badge" :class="s.kind">{{ kindLabel[s.kind] }}</span>
        <div class="lg-timeline-body">
          <strong>{{ s.title }}</strong>
          <p>{{ s.detail }}</p>
        </div>
      </li>
    </ol>

    <div v-if="messageTrail.length > 1" class="demo-panel">
      <h4>消息序列</h4>
      <p class="hint"><code>{{ messageTrail.join(' → ') }}</code></p>
      <p class="hint">每次工具调用都会追加两条消息，ReAct 循环靠这份消息历史自我衔接。</p>
    </div>
  </div>
</template>
