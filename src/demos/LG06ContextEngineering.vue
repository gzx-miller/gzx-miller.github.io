<script setup lang="ts">
import { ref } from 'vue'

const grade = ref<'beginner' | 'advanced'>('beginner')
const includeContext = ref(true)
const includeStore = ref(true)
const running = ref(false)
const assembled = ref<{ role: string; text: string; origin: string }[]>([])
const output = ref('')
const logs = ref<string[]>([])

const query = '接下来该学什么？'
const viewedTopics = ['组合式 API', '响应式原理']

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  if (running.value) return
  running.value = true
  assembled.value = []
  output.value = ''
  logs.value = []

  logs.value.push(`节点读取 State：query = 「${query}」`)
  await sleep(520)

  if (includeContext.value) {
    logs.value.push(`节点读取 Context（运行时注入，只读）：grade = 「${grade.value}」`)
  } else {
    logs.value.push('Context 未注入：节点拿不到学生水平')
  }
  await sleep(520)

  const storePart: string[] = []
  if (includeStore.value) {
    logs.value.push(`节点读取 Store（跨会话档案）：viewed = [${viewedTopics.join(', ')}]`)
    storePart.push(`最近浏览：${viewedTopics.join('、')}`)
  } else {
    logs.value.push('未读取 Store：本次推荐不参考浏览历史')
  }
  await sleep(520)

  // 组装系统消息：Context 与 Store 的内容都以「文本」形式进入模型上下文
  const systemParts: string[] = []
  if (includeContext.value) systemParts.push(`学生水平：${grade.value}`)
  systemParts.push(...storePart)
  if (systemParts.length) {
    assembled.value.push({ role: 'system', text: systemParts.join('；'), origin: includeContext.value ? 'Context + Store' : 'Store' })
  }
  assembled.value.push({ role: 'human', text: query, origin: 'State' })
  logs.value.push('组装完成：SystemMessage（上下文） + HumanMessage（问题）送入模型')
  await sleep(560)

  if (!includeContext.value && !includeStore.value) {
    output.value = '建议从《Vue3 入门》开始，先建立整体认知。'
  } else if (includeContext.value && grade.value === 'advanced') {
    output.value = includeStore.value
      ? '你已经掌握组合式 API 与响应式原理，基础扎实，建议直接挑战《Vue3 渲染器原理》，深入底层实现。'
      : '你的基础不错，建议直接进入进阶课程《Vue3 渲染器原理》。'
  } else {
    output.value = includeStore.value
      ? '你浏览过组合式 API 和响应式原理，接下来建议学《Vue3 组件通信》，从 props / emit 开始循序渐进。'
      : '建议从《Vue3 入门》开始，先建立整体认知，再进入组合式 API。'
  }

  logs.value.push('模型调用完成，返回推荐结果')
  running.value = false
}
</script>

<template>
  <div class="demo-card demo-container">
    <h3>三层上下文的组装与注入</h3>
    <p class="demo-desc">
      同一个问题「接下来该学什么？」，改变注入的上下文，模型答案就不同。分别切换水平、关掉浏览历史，观察右侧「送入模型的消息」如何变化。
    </p>

    <div class="grid-2">
      <div class="demo-panel">
        <h4>① State：图内状态</h4>
        <div class="prop-row"><span>query</span><span><code>{{ query }}</code></span></div>
        <p class="hint">随本次运行存在，节点之间读写共享。</p>

        <h4 style="margin-top: 12px">② Context：运行时注入</h4>
        <div class="controls">
          <label><input v-model="grade" type="radio" value="beginner" :disabled="running" /> beginner</label>
          <label><input v-model="grade" type="radio" value="advanced" :disabled="running" /> advanced</label>
        </div>
        <div class="controls">
          <label><input v-model="includeContext" type="checkbox" :disabled="running" /> 注入学生水平</label>
        </div>

        <h4 style="margin-top: 12px">③ Store：跨会话档案</h4>
        <div class="prop-row"><span>viewed</span><span><code>{{ viewedTopics.join('、') }}</code></span></div>
        <div class="controls">
          <label><input v-model="includeStore" type="checkbox" :disabled="running" /> 读取浏览记录</label>
        </div>

        <div class="controls">
          <button class="btn" type="button" :disabled="running" @click="run">{{ running ? '组装中…' : '运行推荐节点' }}</button>
        </div>
      </div>

      <div class="demo-panel">
        <h4>送入模型的消息</h4>
        <p v-if="!assembled.length" class="hint">运行后展示每次模型调用前装配出的消息列表。</p>
        <div v-for="(msg, i) in assembled" :key="i" class="log-line">
          <code>[{{ msg.role }}]</code>
          <span>{{ msg.text }}</span>
          <span class="badge success">来自 {{ msg.origin }}</span>
        </div>
        <div v-if="output" class="tips-box">
          <strong>模型输出：</strong>{{ output }}
        </div>
      </div>
    </div>

    <div class="demo-panel" style="margin-top: 12px">
      <h4>节点读取日志</h4>
      <p v-if="!logs.length" class="hint">尚未运行。</p>
      <p v-for="(log, i) in logs" :key="i" class="log-line">{{ log }}</p>
    </div>
  </div>
</template>
