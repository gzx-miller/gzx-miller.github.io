<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  name: string
  cron: string
  desc: string
  next: string
}

const tasks: Task[] = [
  { name: 'generateDailyReport', cron: '0 0 8 * * *', desc: '每天 08:00:00 生成昨日订单日报表', next: '明天 08:00:00' },
  { name: 'heartbeat', cron: '*/5 * * * *', desc: '每 5 分钟上报一次服务健康状态', next: '5 分钟后' },
  { name: 'cleanupSessions', cron: '0 3 * * *', desc: '每天凌晨 03:00 清理过期会话', next: '明天 03:00:00' },
  { name: 'weeklySummary', cron: '0 9 * * 1', desc: '每周一 09:00 生成周报', next: '下周一 09:00:00' },
]

const runLogs = ref<string[]>([])
const runAllLogs = ref<string[]>([])

function delay() {
  return new Promise((r) => setTimeout(r, 300))
}

async function runTask(task: Task) {
  runLogs.value = []
  runLogs.value.push(`⏰ 触发 ${task.name}（cron: ${task.cron}）`)
  runLogs.value.push(`→ 匹配到下次执行时间：${task.next}`)
  await delay()
  runLogs.value.push(`✅ 执行完成：${task.desc}`)
}

async function runAll() {
  runAllLogs.value = []
  for (const task of tasks) {
    runAllLogs.value.push(`▶️ 调度器触发 ${task.name}`)
    await delay()
    runAllLogs.value.push(`✔️ ${task.name} 完成`)
  }
  runAllLogs.value.push('🏁 本轮调度扫描结束，等待下一个 cron 触发点')
}

const cronFields = [
  { pos: '秒', rule: '0', note: '第 0 秒' },
  { pos: '分', rule: '0', note: '第 0 分' },
  { pos: '时', rule: '8', note: '早上 8 点' },
  { pos: '日', rule: '*', note: '每天' },
  { pos: '月', rule: '*', note: '每月' },
  { pos: '周', rule: '*', note: '不指定' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 定时任务 · @Cron 调度</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      查看任务计划表，点击"运行一次"模拟触发，或"模拟一轮调度"观察调度器工作方式：
    </p>

    <table class="task-table">
      <thead>
        <tr><th>任务</th><th>cron 表达式</th><th>说明</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.name">
          <td><code>{{ task.name }}</code></td>
          <td><code class="cron-code">{{ task.cron }}</code></td>
          <td class="task-desc">{{ task.desc }}</td>
          <td><button class="tab-btn active" @click="runTask(task)">运行一次</button></td>
        </tr>
      </tbody>
    </table>

    <div style="display: flex; gap: 8px; margin: 12px 0">
      <button class="tab-btn" @click="runAll">模拟一轮调度</button>
    </div>

    <div v-if="runLogs.length" class="cron-log">
      <p v-for="(log, i) in runLogs" :key="i" class="cron-line">{{ log }}</p>
    </div>
    <div v-if="runAllLogs.length" class="cron-log">
      <p v-for="(log, i) in runAllLogs" :key="i" class="cron-line">{{ log }}</p>
    </div>

    <h4 style="margin: 14px 0 8px">📐 cron 表达式六段结构</h4>
    <div class="cron-fields">
      <div v-for="field in cronFields" :key="field.pos" class="cron-field">
        <code class="cron-value">{{ field.rule }}</code>
        <span class="cron-pos">{{ field.pos }}</span>
        <span class="cron-note">{{ field.note }}</span>
      </div>
    </div>
    <p class="note">
      示例 <code>0 0 8 * * *</code> = 每天 08:00:00。<code>*</code> 任意值、<code>*/5</code> 每 5 单位、
      <code>1</code> 周一、<code>?</code> 不指定。
    </p>
  </div>
</template>

<style scoped>
.task-table th,
.task-table td {
  padding: 6px 8px;
  vertical-align: middle;
}

.task-desc {
  font-size: 12px;
  color: var(--muted);
}

.cron-code {
  white-space: nowrap;
}

.cron-log {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed var(--border);
  background: var(--surface);
  margin-bottom: 8px;
}

.cron-line {
  margin: 4px 0;
  font-size: 12px;
  color: var(--text);
  font-family: Consolas, Menlo, monospace;
}

.cron-fields {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.cron-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  border-radius: 10px;
  background: var(--surface-soft);
}

.cron-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent-strong);
}

.cron-pos {
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
}

.cron-note {
  font-size: 10px;
  color: var(--muted);
}

.note {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}
</style>
