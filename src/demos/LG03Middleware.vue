<script setup lang="ts">
import { computed, ref } from 'vue'

interface MiddlewareItem {
  id: string
  name: string
  hook: string
  desc: string
  enabled: boolean
}

const middlewares = ref<MiddlewareItem[]>([
  { id: 'budget', name: '预算控制', hook: 'beforeModel', desc: '累计 token 超阈值就熔断，不再调模型', enabled: true },
  { id: 'trim', name: '消息截断', hook: 'wrapModelCall', desc: '只保留最近 11 条历史，防止上下文撑爆', enabled: true },
  { id: 'pii', name: 'PII 检测', hook: 'wrapModelCall', desc: '手机号、邮箱脱敏后再送给模型', enabled: true },
  { id: 'filter', name: '敏感词过滤', hook: 'afterModel', desc: '检查模型输出，命中禁用词就替换', enabled: true },
])

const userInput = ref('我的手机号是 13812345678，帮我推荐一门 Vue3 课程')
const budgetScenario = ref<'enough' | 'exhausted'>('enough')
const logs = ref<{ tag: string; text: string; state: 'success' | 'warning' | 'error' | 'dimmed' }[]>([])
const finalOutput = ref('')
const running = ref(false)
const blocked = ref(false)

const isOn = (id: string) => middlewares.value.find((m) => m.id === id)?.enabled ?? false

const maskedInput = computed(() =>
  userInput.value.replace(/(\d{3})\d{4}(\d{4})/g, '$1****$2').replace(/[\w.-]+@[\w.-]+\.\w+/g, '***@***.***'),
)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function pushLog(tag: string, text: string, state: 'success' | 'warning' | 'error' | 'dimmed', delay = 560) {
  logs.value.push({ tag, text, state })
  await sleep(delay)
}

async function run() {
  if (running.value || !userInput.value.trim()) return
  running.value = true
  logs.value = []
  finalOutput.value = ''
  blocked.value = false

  // 1. beforeModel：预算控制
  if (isOn('budget')) {
    const spent = budgetScenario.value === 'enough' ? 18432 : 21350
    if (spent > 20000) {
      await pushLog('beforeModel', `BudgetGuard：累计已用 ${spent.toLocaleString()} / 20,000 tokens，超预算 → 熔断，跳到 END，本次不再调模型。`, 'error')
      blocked.value = true
      running.value = false
      return
    }
    await pushLog('beforeModel', `BudgetGuard：累计已用 ${spent.toLocaleString()} / 20,000 tokens，未超限，放行。`, 'success')
  } else {
    await pushLog('beforeModel', '预算控制未启用，跳过。', 'dimmed', 320)
  }

  // 2. wrapModelCall：消息截断
  if (isOn('trim')) {
    await pushLog('wrapModelCall', 'TrimMessages：历史消息 1 + 14 条，超过上限 12 → 截断为 1 条系统消息 + 最近 11 条。', 'warning')
  } else {
    await pushLog('wrapModelCall', '消息截断未启用，跳过。', 'dimmed', 320)
  }

  // 3. wrapModelCall：PII 脱敏
  const hasPii = maskedInput.value !== userInput.value
  if (isOn('pii')) {
    if (hasPii) {
      await pushLog('wrapModelCall', `PiiGuard：检测到手机号，发送前已脱敏 → 「${maskedInput.value}」`, 'warning')
    } else {
      await pushLog('wrapModelCall', 'PiiGuard：未检测到手机号、邮箱等隐私信息，原样发送。', 'success')
    }
  } else {
    await pushLog('wrapModelCall', 'PII 检测未启用，原文直发（真实场景有隐私泄露风险）。', 'dimmed', 320)
  }

  // 4. 模型调用（模拟输出）
  const rawOutput = '推荐你学《Vue3 入门》，全网最低价，保证提分，学完薪资翻倍！'
  await pushLog('model', `模型输出：「${rawOutput}」`, 'success')

  // 5. afterModel：敏感词过滤
  const hitWords = ['全网最低价', '保证提分']
  if (isOn('filter')) {
    const hits = hitWords.filter((w) => rawOutput.includes(w))
    if (hits.length) {
      finalOutput.value = '推荐你学《Vue3 入门》，课程内容系统、口碑良好，适合零基础同学。'
      await pushLog('afterModel', `ContentFilter：命中禁用词「${hits.join('、')}」→ 已拦截并替换为安全话术。`, 'warning')
    } else {
      finalOutput.value = rawOutput
      await pushLog('afterModel', 'ContentFilter：未命中禁用词，放行。', 'success')
    }
  } else {
    finalOutput.value = rawOutput
    await pushLog('afterModel', '敏感词过滤未启用，跳过（不当表述会直接展示给用户）。', 'dimmed', 320)
  }

  running.value = false
}
</script>

<template>
  <div class="demo-card demo-container">
    <h3>中间件钩子链路</h3>
    <p class="demo-desc">
      四个中间件挂在模型调用的不同钩子上。点运行看它们按顺序执行；也可以逐个关掉开关对比，或把「预算状态」切到耗尽，看 beforeModel 如何直接熔断整条链。
    </p>

    <div class="controls">
      <button
        v-for="m in middlewares"
        :key="m.id"
        class="mini-btn"
        :class="{ active: m.enabled }"
        type="button"
        :disabled="running"
        @click="m.enabled = !m.enabled"
      >
        {{ m.name }}
      </button>
      <span class="hint">点按钮开关中间件</span>
    </div>

    <div class="grid-2">
      <div class="demo-panel">
        <h4>请求入口</h4>
        <div class="controls">
          <label>
            <input v-model="budgetScenario" type="radio" value="enough" :disabled="running" />
            预算充足（18,432 tokens）
          </label>
          <label>
            <input v-model="budgetScenario" type="radio" value="exhausted" :disabled="running" />
            预算耗尽（21,350 tokens）
          </label>
        </div>
        <textarea v-model="userInput" rows="3" :disabled="running" placeholder="输入用户消息…"></textarea>
        <div class="controls">
          <button class="btn" type="button" :disabled="running" @click="run">{{ running ? '执行中…' : '运行调用链' }}</button>
        </div>
        <p class="hint">
          试试输入含手机号的消息，看 PiiGuard 在「发送前」脱敏；再关掉敏感词过滤对比模型输出的变化。
        </p>
      </div>

      <div class="demo-panel">
        <h4>钩子执行日志</h4>
        <p v-if="!logs.length" class="hint">尚未运行。</p>
        <div v-for="(log, i) in logs" :key="i" class="log-line" :class="log.state">
          <code>{{ log.tag }}</code>
          <span>{{ log.text }}</span>
        </div>
      </div>
    </div>

    <div v-if="blocked" class="tips-box">
      <strong>链路被熔断：</strong>beforeModel 直接跳到了 END，模型调用、输出过滤全部没有发生——这是最省钱的一种「拒绝」。
    </div>
    <div v-else-if="finalOutput" class="tips-box">
      <strong>最终返回给用户：</strong>{{ finalOutput }}
    </div>
  </div>
</template>
