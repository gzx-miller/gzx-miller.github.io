<script setup lang="ts">
import { ref } from 'vue'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

const goal = '写一份《LangGraph 在多智能体编排中的应用》调研报告'
const todos = ref<TodoItem[]>([
  { id: 1, text: '调研 LangGraph 多智能体现状', done: false },
  { id: 2, text: '收集 3 个落地案例', done: false },
  { id: 3, text: '整理结论与要点', done: false },
  { id: 4, text: '撰写并保存报告 /report.md', done: false },
])
const files = ref<string[]>([])
const trail = ref<{ badge: string; text: string }[]>([])
const running = ref(false)
const report = ref('')

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  if (running.value) return
  running.value = true
  todos.value.forEach((t) => (t.done = false))
  files.value = []
  trail.value = []
  report.value = ''

  trail.value.push({ badge: '规划', text: 'write_todos：任务拆成 4 项，写入 /todos.json' })
  await sleep(700)

  trail.value.push({ badge: '委派', text: 'task(researcher)：调研 LangGraph 多智能体现状' })
  await sleep(760)
  todos.value[0].done = true
  await sleep(300)

  trail.value.push({ badge: '委派', text: 'task(researcher)：收集 3 个落地案例' })
  await sleep(780)
  files.value.push('/research/cases.md')
  todos.value[1].done = true
  await sleep(300)

  trail.value.push({ badge: '委派', text: 'task(analyst)：把调研素材整理成结论与要点' })
  await sleep(760)
  files.value.push('/research/summary.md')
  todos.value[2].done = true
  await sleep(300)

  trail.value.push({ badge: '写入', text: 'write_file(/report.md)：整合案例与结论' })
  await sleep(760)
  files.value.push('/report.md')
  todos.value[3].done = true
  await sleep(320)

  report.value =
    '# LangGraph 在多智能体编排中的应用\n\n## 结论\n1. 监督者 + 子智能体（subagents-as-tools）是当前最主流的编排模式，职责拆分的收益在工具数量增长后最明显；\n2. 并行扇出与 Send/Map-reduce 适合「同类任务批量处理」的场景，合流点的 reducer 设计是正确性关键；\n3. 需要人工审批的长流程用 interrupt + checkpointer，把不可逆决定留在人手里。\n\n## 案例\n- 课程咨询团队：调研 / 写作 / 审校三个子智能体协作；\n- 作业批改：三个维度并行审查后合并；\n- 退款审批：金额超阈值自动挂起等待人工。'
  trail.value.push({ badge: '交付', text: '任务全部完成，报告已写入虚拟文件系统，共 4 个文件' })
  running.value = false
}
</script>

<template>
  <div class="demo-card demo-container">
    <h3>Deep Agent 的规划、委派与沉淀</h3>
    <p class="demo-desc">
      Deep Agent 自带四件套：待办规划、虚拟文件系统、子智能体委派、对话记忆。点运行，看它先列计划、再派人干活、最后落文件——全程自我组织。
    </p>

    <div class="controls">
      <input :value="goal" type="text" readonly />
      <button class="btn" type="button" :disabled="running" @click="run">{{ running ? '执行中…' : '运行 Deep Agent' }}</button>
    </div>

    <div class="grid-2">
      <div class="demo-panel">
        <h4>待办清单（write_todos）</h4>
        <div v-for="todo in todos" :key="todo.id" class="lg-todo" :class="{ done: todo.done }">
          <span class="lg-check">{{ todo.done ? '✓' : '○' }}</span>
          <span>{{ todo.text }}</span>
        </div>

        <h4 style="margin-top: 14px">虚拟文件系统</h4>
        <p v-if="!files.length" class="hint">还没有产出文件。</p>
        <p v-for="(file, i) in files" :key="i" class="log-line">
          <code>{{ file }}</code>
        </p>
      </div>

      <div class="demo-panel">
        <h4>行动轨迹</h4>
        <p v-if="!trail.length" class="hint">尚未运行。</p>
        <div v-for="(item, i) in trail" :key="i" class="log-line">
          <span class="badge" :class="item.badge === '委派' ? 'action' : item.badge === '写入' ? 'observe' : 'think'">
            {{ item.badge }}
          </span>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>

    <div v-if="report" class="tips-box">
      <strong>最终产出（/report.md）：</strong>
      <pre class="mini-code">{{ report }}</pre>
    </div>
  </div>
</template>
