const n=`<script setup lang="ts">
import { nextTick, ref } from 'vue'

interface ChatMsg {
  role: 'user' | 'ai'
  text: string
  streaming?: boolean
}

const messages = ref<ChatMsg[]>([])
const draft = ref('推荐一点 Vue3 课程')
const running = ref(false)
const stopped = ref(false)
const stage = ref<'idle' | 'retrieving' | 'generating' | 'done'>('idle')
const events = ref<string[]>([])
const showEvents = ref(true)
const chatRef = ref<HTMLElement | null>(null)

const ANSWER =
  '推荐你从《Vue3 入门》开始：它覆盖响应式基础、组件与工程化，零基础也能跟上。学完后可以进阶《Vue3 组件通信》，理解 props / emit 与跨层数据流；如果你想深入底层，再挑战《组合式 API》与《渲染器原理》。'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function scrollBottom() {
  await nextTick()
  chatRef.value?.scrollTo({ top: chatRef.value.scrollHeight })
}

async function send() {
  if (running.value || !draft.value.trim()) return
  running.value = true
  stopped.value = false
  events.value = []
  messages.value.push({ role: 'user', text: draft.value.trim() })
  const question = draft.value.trim()
  draft.value = ''

  // updates 事件：节点级进度
  stage.value = 'retrieving'
  events.value.push('updates → node=retrieve 开始执行')
  await scrollBottom()
  await sleep(900)
  events.value.push('updates → node=retrieve 完成（检索到 3 门候选课程）')
  await sleep(320)

  // messages 事件：token 流
  stage.value = 'generating'
  events.value.push('messages → node=agent 开始输出 token 流')
  messages.value.push({ role: 'ai', text: '', streaming: true })
  // 通过数组索引读取，拿到的是 Vue 代理后的对象；直接改 push 前的原始引用不会触发视图更新
  const aiIndex = messages.value.length - 1
  await scrollBottom()

  const answer = question.includes('Vue') || question.includes('课程') ? ANSWER : '我可以帮你检索课程库并推荐学习路径，试试问我「推荐一点 Vue3 课程」。'
  let i = 0
  let tokenBatch = 0
  while (i < answer.length) {
    if (stopped.value) break
    const current = messages.value[aiIndex]
    const step = 2 + Math.floor(Math.random() * 2)
    current.text += answer.slice(i, i + step)
    i += step
    tokenBatch++
    if (tokenBatch % 12 === 0) {
      events.value.push(\`messages → 已输出 \${current.text.length} 字（token 批次 #\${tokenBatch}）\`)
    }
    await scrollBottom()
    await sleep(28)
  }

  const finalMessage = messages.value[aiIndex]
  finalMessage.streaming = false
  if (stopped.value) {
    finalMessage.text += '（已停止）'
    events.value.push('用户点击停止 → AbortController 中断流')
  } else {
    events.value.push('done → 流结束，移除停止按钮')
  }
  stage.value = 'done'
  running.value = false
}

function stop() {
  if (running.value) stopped.value = true
}
<\/script>

<template>
  <div class="demo-card demo-container">
    <h3>事件流驱动的聊天界面</h3>
    <p class="demo-desc">
      一次提问会同时产生两种事件：updates 推进节点进度条，messages 逐 token 填充气泡。生成中点「停止」可以中断流——就像真实的 SSE 断流。
    </p>

    <div class="controls">
      <label><input v-model="showEvents" type="checkbox" /> 显示事件流</label>
    </div>

    <div class="grid-2">
      <div class="demo-panel">
        <h4>对话</h4>
        <div ref="chatRef" class="lg-chat-log lg-chat-tall">
          <p v-if="!messages.length" class="hint">发送一条消息，看回答如何逐字浮现。</p>
          <div v-for="(msg, i) in messages" :key="i" class="lg-chat-msg" :class="msg.role">
            <span class="lg-chat-bubble">
              {{ msg.text }}<span v-if="msg.streaming" class="lg-cursor">▍</span>
            </span>
          </div>
        </div>

        <div class="lg-steps-bar">
          <span class="lg-step-chip" :class="{ active: stage === 'retrieving', done: stage === 'generating' || stage === 'done' }">
            检索课程库
          </span>
          <span class="lg-arrow">→</span>
          <span class="lg-step-chip" :class="{ active: stage === 'generating', done: stage === 'done' }">
            生成回答
          </span>
        </div>

        <div class="controls">
          <input v-model="draft" type="text" :disabled="running" @keydown.enter="send" />
          <button v-if="!running" class="btn" type="button" @click="send">发送</button>
          <button v-else class="btn" type="button" @click="stop">停止生成</button>
        </div>
      </div>

      <div v-if="showEvents" class="demo-panel">
        <h4>事件流（SSE）</h4>
        <p v-if="!events.length" class="hint">发送后这里会滚动两类事件：updates（节点进度）与 messages（token）。</p>
        <p v-for="(event, i) in events" :key="i" class="log-line">{{ event }}</p>
      </div>
      <div v-else class="demo-panel">
        <h4>提示</h4>
        <p class="hint">勾选「显示事件流」，观察 updates 与 messages 两类事件如何交错到达，驱动同一个界面。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 打字光标：仅本演示使用，随组件走，不进公共样式表 */
.lg-cursor {
  color: var(--demo-accent);
  animation: lg-blink 0.8s infinite;
}

@keyframes lg-blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>
`;export{n as default};
