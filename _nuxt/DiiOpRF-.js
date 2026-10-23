const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type JobStatus = 'waiting' | 'active' | 'retrying' | 'completed' | 'failed'
type LogLevel = 'info' | 'success' | 'warning' | 'error'
type Filter = 'all' | 'waiting' | 'finished' | 'dead'

interface QueueJob {
  id: string
  name: string
  payload: string
  attemptsMade: number
  attempts: number
  failTimes: number
  status: JobStatus
  nextRun: string
}

interface LogItem {
  text: string
  level: LogLevel
}

const statusText: Record<JobStatus, string> = {
  waiting: '等待中',
  active: '执行中',
  retrying: '待重试',
  completed: '已完成',
  failed: '死信',
}

const tabs: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'waiting', label: '队列中' },
  { value: 'finished', label: '已完成' },
  { value: 'dead', label: '死信' },
]

function createInitialJobs(): QueueJob[] {
  return [
    {
      id: 'job-1',
      name: 'send-receipt',
      payload: '订单 A1024 回执',
      attemptsMade: 0,
      attempts: 3,
      failTimes: 0,
      status: 'waiting',
      nextRun: '立即执行',
    },
    {
      id: 'job-2',
      name: 'send-receipt',
      payload: '订单 A1025 回执',
      attemptsMade: 0,
      attempts: 3,
      failTimes: 2,
      status: 'waiting',
      nextRun: '立即执行',
    },
  ]
}

const jobs = ref<QueueJob[]>(createInitialJobs())
const logs = ref<LogItem[]>([
  { text: '消费者已连接 mail 队列，等待任务…', level: 'info' },
])
const filter = ref<Filter>('all')

let sequence = 3

const filteredJobs = computed(() => {
  if (filter.value === 'all') return jobs.value
  if (filter.value === 'waiting') {
    return jobs.value.filter(job => job.status === 'waiting' || job.status === 'retrying' || job.status === 'active')
  }
  if (filter.value === 'finished') return jobs.value.filter(job => job.status === 'completed')
  return jobs.value.filter(job => job.status === 'failed')
})

const counts = computed(() => ({
  waiting: jobs.value.filter(job => job.status === 'waiting' || job.status === 'retrying').length,
  finished: jobs.value.filter(job => job.status === 'completed').length,
  dead: jobs.value.filter(job => job.status === 'failed').length,
}))

function writeLog(text: string, level: LogLevel) {
  logs.value = [...logs.value.slice(-6), { text, level }]
}

function enqueue(withFailure: boolean) {
  const id = \`job-\${sequence}\`
  const orderNo = 1023 + sequence
  sequence += 1
  jobs.value.push({
    id,
    name: 'send-receipt',
    payload: \`订单 A\${orderNo} 回执\`,
    attemptsMade: 0,
    attempts: 3,
    failTimes: withFailure ? 2 : 0,
    status: 'waiting',
    nextRun: '立即执行',
  })
  writeLog(\`生产者 add \${id}（attempts=3，\${withFailure ? '模拟前两次失败' : '预计一次成功'}）\`, 'info')
}

function processNext() {
  const job = jobs.value.find(item => item.status === 'waiting' || item.status === 'retrying')
  if (!job) {
    writeLog('队列中没有待消费任务，消费者继续等待', 'warning')
    return
  }

  job.status = 'active'
  job.attemptsMade += 1

  if (job.failTimes > 0) {
    job.failTimes -= 1
    if (job.attemptsMade >= job.attempts) {
      job.status = 'failed'
      job.nextRun = '已进入死信队列'
      writeLog(\`任务 \${job.id} 第 \${job.attemptsMade} 次失败，达到最大尝试次数，转入死信队列\`, 'error')
      return
    }
    const delay = 2 ** (job.attemptsMade - 1) * 200
    job.status = 'retrying'
    job.nextRun = \`\${delay}ms 后重试\`
    writeLog(\`任务 \${job.id} 第 \${job.attemptsMade} 次执行失败，指数退避 \${delay}ms 后重试\`, 'warning')
    return
  }

  job.status = 'completed'
  job.nextRun = '—'
  writeLog(\`任务 \${job.id} 第 \${job.attemptsMade} 次执行成功，写入业务唯一键并完成任务\`, 'success')
}

function drain() {
  let guard = 0
  while (guard < 20 && jobs.value.some(item => item.status === 'waiting' || item.status === 'retrying')) {
    processNext()
    guard += 1
  }
}

function reset() {
  jobs.value = createInitialJobs()
  logs.value = [{ text: '队列已重置，消费者重新连接 mail 队列', level: 'info' }]
  filter.value = 'all'
  sequence = 3
}

function badgeClass(status: JobStatus) {
  if (status === 'completed') return 'success'
  if (status === 'failed') return 'error'
  if (status === 'active' || status === 'retrying') return 'warning'
  return ''
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3 class="demo-title">🌰 任务队列、重试与死信</h3>
      <p class="demo-desc">
        投递任务后逐个消费。失败任务会按指数退避重试，超过最大尝试次数后进入死信队列。
      </p>

      <div class="controls">
        <button class="mini-btn" @click="enqueue(false)">投递成功任务</button>
        <button class="mini-btn" @click="enqueue(true)">投递易失败任务</button>
        <button class="mini-btn" @click="processNext">处理下一个</button>
        <button class="mini-btn" @click="drain">处理全部</button>
        <button class="mini-btn" @click="reset">重置</button>
      </div>

      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: filter === tab.value }"
          @click="filter = tab.value"
        >
          {{ tab.label }}
        </button>
        <span class="badge">队列中 {{ counts.waiting }}</span>
        <span class="badge success">已完成 {{ counts.finished }}</span>
        <span class="badge error">死信 {{ counts.dead }}</span>
      </div>

      <div class="grid-2">
        <div class="demo-panel">
          <h4>mail 队列</h4>
          <div class="prop-table">
            <table>
              <thead>
                <tr>
                  <th>任务</th>
                  <th>载荷</th>
                  <th>尝试</th>
                  <th>状态</th>
                  <th>下次执行</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in filteredJobs" :key="job.id">
                  <td><code>{{ job.id }}</code></td>
                  <td>{{ job.payload }}</td>
                  <td>{{ job.attemptsMade }} / {{ job.attempts }}</td>
                  <td>
                    <span class="badge" :class="badgeClass(job.status)">{{ statusText[job.status] }}</span>
                  </td>
                  <td class="hint">{{ job.nextRun }}</td>
                </tr>
                <tr v-if="filteredJobs.length === 0">
                  <td colspan="5" class="hint">当前筛选下没有任务。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="demo-panel">
          <h4>消费者日志</h4>
          <div class="log-panel">
            <p v-for="(item, index) in logs" :key="index" class="log-line" :class="item.level">
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>

      <h4 style="margin-top: 16px">生产与消费的关键调用</h4>
      <pre class="mini-code"><code>// 生产者：注入 Queue，把耗时工作交给队列
await mailQueue.add('send-receipt', { orderId }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 200 },
})

// 消费者：WorkerHost 只负责处理，不关心请求上下文
@Processor('mail')
export class MailProcessor extends WorkerHost {
  async process(job: Job&lt;SendReceiptPayload&gt;) {
    return this.mailService.sendReceipt(job.data.orderId)
  }
}</code></pre>

      <div class="tips-box">
        <strong>至少一次投递：</strong>消费者处理完成但还没来得及确认时进程崩溃，任务会被再次投递。
        因此消费者必须先查业务唯一键（如 <code>orderId</code>）再执行，重复执行也要得到同一结果。
        <code>jobId</code> 只能在任务记录保留期间去重，不能替代业务幂等。
      </div>
    </div>
  </div>
</template>
`;export{n as default};
