<script setup lang="ts">
import { ref } from 'vue'

type Phase = 'idle' | 'waiting' | 'done'

const amount = ref(880)
const phase = ref<Phase>('idle')
const logs = ref<string[]>([])
const result = ref('')
const autoApproved = ref(false)

const threadId = 'order-20261013-001'
const budget = 500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function submit() {
  if (phase.value === 'waiting') return
  phase.value = 'idle'
  logs.value = []
  result.value = ''
  autoApproved.value = false

  logs.value.push(`invoke(thread_id="${threadId}")：提交订单 A-1001，退款金额 ￥${amount.value}`)
  await sleep(600)
  logs.value.push('进入 review 节点：校验金额阈值…')
  await sleep(600)

  if (amount.value <= budget) {
    autoApproved.value = true
    logs.value.push(`金额 ￥${amount.value} ≤ ￥${budget}，阈值内自动通过，未触发 interrupt`)
    await sleep(500)
    await finish('approved')
  } else {
    logs.value.push(`金额 ￥${amount.value} > ￥${budget}，调用 interrupt() → 流程挂起，检查点已保存`)
    phase.value = 'waiting'
  }
}

async function resume(decision: 'approved' | 'rejected') {
  logs.value.push(`Command({ resume: "${decision}" })：从检查点恢复执行`)
  phase.value = 'idle'
  await sleep(650)
  await finish(decision)
}

async function finish(decision: 'approved' | 'rejected') {
  logs.value.push('进入 execute 节点：按审批结果执行')
  await sleep(600)
  result.value =
    decision === 'approved' ? `订单 A-1001 已退款 ￥${amount.value}` : '订单 A-1001 退款被驳回，已通知申请人'
  logs.value.push(`流程走向 END：${result.value}`)
  phase.value = 'done'
}
</script>

<template>
  <div class="demo-card">
    <h3>退款审批：中断与恢复</h3>
    <p class="demo-desc">
      金额超过 ￥500 的退款必须人工审批。提交后流程会停在 interrupt 处挂起——检查点里留着完整状态；你点「批准」或「驳回」，流程从断点恢复，而不是从头重跑。
    </p>

    <div class="controls">
      <label>
        <input v-model="amount" type="radio" :value="368" :disabled="phase === 'waiting'" />
        退款 ￥368（阈值内）
      </label>
      <label>
        <input v-model="amount" type="radio" :value="880" :disabled="phase === 'waiting'" />
        退款 ￥880（需审批）
      </label>
      <button class="btn" type="button" :disabled="phase === 'waiting'" @click="submit">提交退款申请</button>
    </div>

    <div class="lg-canvas">
      <div class="lg-row">
        <span class="lg-node terminator">START</span>
        <span class="lg-arrow">→</span>
        <span class="lg-node" :class="{ active: phase === 'waiting', done: phase === 'done' || autoApproved }">
          <span class="lg-node-title">review</span>
          <span class="lg-node-sub">金额校验 / interrupt</span>
        </span>
        <span class="lg-arrow">→</span>
        <span class="lg-node" :class="{ done: phase === 'done' }">
          <span class="lg-node-title">execute</span>
          <span class="lg-node-sub">按审批执行</span>
        </span>
        <span class="lg-arrow">→</span>
        <span class="lg-node terminator" :class="{ done: phase === 'done' }">END</span>
      </div>
      <p class="hint">挂起期间进程可以退出——状态存在检查点里，恢复时从 review 的下一跳继续。</p>
    </div>

    <div v-if="phase === 'waiting'" class="lg-approval">
      <div>
        <strong>⏸ 等待人工审批</strong>
        <p>订单 A-1001 申请退款 ￥{{ amount }}，是否批准？（interrupt 抛出的人工问题）</p>
      </div>
      <div class="controls">
        <button class="btn" type="button" @click="resume('approved')">批准</button>
        <button class="btn" type="button" @click="resume('rejected')">驳回</button>
      </div>
    </div>

    <div class="grid-2">
      <div class="lg-panel">
        <h4>检查点快照（thread: {{ threadId }}）</h4>
        <p class="lg-kv">next: {{ phase === 'waiting' ? "['review']" : phase === 'done' ? '[]' : '—' }}</p>
        <p class="lg-kv">amount: {{ amount }}</p>
        <p class="lg-kv">decision: {{ result ? (result.includes('已退款') ? "'approved'" : "'rejected'") : 'null' }}</p>
        <p class="hint">检查点每次状态变更都会更新；恢复时框架从此处重建状态，不需要重跑前面节点。</p>
      </div>
      <div class="lg-panel">
        <h4>执行日志</h4>
        <p v-if="!logs.length" class="hint">尚未提交申请。</p>
        <p v-for="(log, i) in logs" :key="i" class="lg-log-line">{{ log }}</p>
      </div>
    </div>

    <div v-if="result" class="tips-box">
      <strong>最终结果：</strong>{{ result }}
    </div>
  </div>
</template>
