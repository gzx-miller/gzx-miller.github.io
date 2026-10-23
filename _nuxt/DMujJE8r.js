const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

interface Snapshot {
  id: string
  label: string
  node: string
  time: string
  messages: number
  next: string
  summary: string
}

interface Thread {
  id: string
  title: string
  checkpoints: Snapshot[]
}

const threads: Thread[] = [
  {
    id: 'course-thread-01',
    title: '线程 A：Vue3 学习路线',
    checkpoints: [
      {
        id: 'ckpt-01',
        label: '初始输入',
        node: '__start__',
        time: '10:00:01',
        messages: 1,
        next: 'agent',
        summary: '用户问：Vue3 应该怎么入门？',
      },
      {
        id: 'ckpt-02',
        label: 'agent 首轮决策',
        node: 'agent',
        time: '10:00:03',
        messages: 2,
        next: 'tools',
        summary: '识别意图，决定检索课程库',
      },
      {
        id: 'ckpt-03',
        label: '工具返回',
        node: 'tools',
        time: '10:00:05',
        messages: 3,
        next: 'agent',
        summary: '检索到 3 门候选课程',
      },
      {
        id: 'ckpt-04',
        label: '生成最终回答',
        node: 'agent',
        time: '10:00:07',
        messages: 4,
        next: 'END',
        summary: '给出「入门 → 组件通信 → 组合式 API」路线',
      },
    ],
  },
  {
    id: 'course-thread-02',
    title: '线程 B：报名表校验',
    checkpoints: [
      {
        id: 'ckpt-11',
        label: '初始输入',
        node: '__start__',
        time: '10:12:20',
        messages: 1,
        next: 'validate',
        summary: '用户提交报名信息',
      },
      {
        id: 'ckpt-12',
        label: '字段校验',
        node: 'validate',
        time: '10:12:22',
        messages: 2,
        next: 'ask',
        summary: '发现手机号格式不合法',
      },
      {
        id: 'ckpt-13',
        label: '追问补充',
        node: 'ask',
        time: '10:12:24',
        messages: 3,
        next: 'validate',
        summary: '提示用户重新填写手机号',
      },
    ],
  },
]

const activeThreadId = ref(threads[0].id)
const index = ref(threads[0].checkpoints.length - 1)

const activeThread = computed(
  () => threads.find((thread) => thread.id === activeThreadId.value) ?? threads[0],
)

const current = computed(
  () => activeThread.value.checkpoints[index.value] ?? activeThread.value.checkpoints[0],
)

const isLatest = computed(() => index.value === activeThread.value.checkpoints.length - 1)

const snapshotJson = computed(() =>
  JSON.stringify(
    {
      thread_id: activeThread.value.id,
      checkpoint_id: current.value.id,
      checkpoint_ns: '',
      values: {
        messages: \`\${current.value.messages} 条消息\`,
        summary: current.value.summary,
      },
      next: [current.value.next],
      metadata: { source: 'loop', step: index.value },
    },
    null,
    2,
  ),
)

function switchThread(id: string) {
  activeThreadId.value = id
  const thread = threads.find((item) => item.id === id) ?? threads[0]
  index.value = thread.checkpoints.length - 1
}

function prev() {
  if (index.value > 0) index.value -= 1
}

function next() {
  if (index.value < activeThread.value.checkpoints.length - 1) index.value += 1
}

function latest() {
  index.value = activeThread.value.checkpoints.length - 1
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3>会话线程时间线</h3>
      <p class="demo-desc">
        同一个 checkpointer 按 <code>thread_id</code> 隔离状态。切换线程会载入该线程的最新检查点；前后翻页是在读取历史快照，不会重新执行图。
      </p>

      <div class="tab-bar">
        <button
          v-for="thread in threads"
          :key="thread.id"
          class="tab-btn"
          :class="{ active: activeThreadId === thread.id }"
          type="button"
          @click="switchThread(thread.id)"
        >
          {{ thread.title }}
        </button>
      </div>

      <div class="controls">
        <button class="mini-btn" type="button" :disabled="index === 0" @click="prev">← 回退检查点</button>
        <button class="mini-btn" type="button" :disabled="isLatest" @click="next">前进检查点 →</button>
        <button class="mini-btn" type="button" :disabled="isLatest" @click="latest">回到最新</button>
        <span class="badge">
          {{ activeThread.id }} · {{ index + 1 }} / {{ activeThread.checkpoints.length }}
        </span>
        <span v-if="isLatest" class="badge success">getState 最新快照</span>
        <span v-else class="badge warning">历史快照（只读）</span>
      </div>

      <div class="grid-2">
        <div class="demo-panel">
          <h4>检查点时间线（getStateHistory）</h4>
          <div
            v-for="(checkpoint, i) in activeThread.checkpoints"
            :key="checkpoint.id"
            class="lg-trace"
            :class="{ active: i === index }"
            @click="index = i"
          >
            <div class="lg-trace-head">
              <span class="badge" :class="{ success: i === index }">{{ checkpoint.node }}</span>
              <strong>{{ checkpoint.id }}</strong>
              <span class="hint">{{ checkpoint.time }}</span>
            </div>
            <p class="hint">{{ checkpoint.label }} · {{ checkpoint.summary }}</p>
          </div>
        </div>

        <div class="demo-panel">
          <h4>状态快照</h4>
          <div class="prop-row"><span>thread_id</span><span><code>{{ activeThread.id }}</code></span></div>
          <div class="prop-row"><span>checkpoint</span><span><code>{{ current.id }}</code></span></div>
          <div class="prop-row"><span>next</span><span><code>{{ current.next }}</code></span></div>
          <div class="prop-row"><span>消息数</span><span>{{ current.messages }}</span></div>
          <pre class="mini-code">{{ snapshotJson }}</pre>
          <p class="hint">MemorySaver 只存在当前进程内存里，重启后这些线程与快照都会消失。</p>
        </div>
      </div>

      <div class="tips-box">
        回退到 <code>ckpt-02</code> 后再执行一次，会从该检查点分叉出新的分支；旧检查点仍然保留在历史里。生产环境需要给检查点设置保留策略，否则线程越多、快照越久，存储会无限增长。
      </div>
    </div>
  </div>
</template>
`;export{n as default};
