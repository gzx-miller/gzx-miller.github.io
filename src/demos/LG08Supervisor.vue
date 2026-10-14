<script setup lang="ts">
import { ref } from 'vue'

interface TeamMember {
  id: string
  name: string
  role: string
  tools: string
}

const team: TeamMember[] = [
  { id: 'supervisor', name: 'supervisor', role: '监督者：拆解目标、决定派活、汇总交付', tools: 'research_agent / writing_agent' },
  { id: 'research', name: 'research_agent', role: '研究员：收集事实与要点清单', tools: 'search_web' },
  { id: 'writer', name: 'writing_agent', role: '写作员：把要点改写成短文', tools: '（无外部工具）' },
]

const goal = '帮我写一篇 200 字的文章，说明 LangGraph 的适用场景。'
const running = ref(false)
const activeMember = ref<string | null>(null)
const trail = ref<{ from: string; text: string; badge: string }[]>([])
const deliverable = ref('')

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  if (running.value) return
  running.value = true
  trail.value = []
  deliverable.value = ''

  activeMember.value = 'supervisor'
  trail.value.push({ from: '监督者', text: '拆解目标：先收集事实，再成文。第一步派给 research_agent。', badge: '规划' })
  await sleep(700)

  activeMember.value = 'research'
  trail.value.push({ from: '监督者 → 研究员', text: 'research_agent({ task: "调研 LangGraph 的适用场景，输出要点清单" })', badge: '委派' })
  await sleep(760)
  trail.value.push({
    from: '研究员 → 监督者',
    text: '要点：① 需要分支与循环的有状态工作流；② 多智能体协作；③ 需人工审批的长流程；④ 需要检查点续跑的任务。',
    badge: '返回',
  })
  await sleep(700)

  activeMember.value = 'supervisor'
  trail.value.push({ from: '监督者', text: '要点已拿到。第二步派给 writing_agent，附上素材。', badge: '规划' })
  await sleep(680)

  activeMember.value = 'writer'
  trail.value.push({ from: '监督者 → 写作员', text: 'writing_agent({ task: "把以下要点改写成 200 字短文：…（附 4 条要点）" })', badge: '委派' })
  await sleep(800)
  deliverable.value =
    'LangGraph 适合「不是一条直线」的智能体应用：流程需要按中间结果分支、循环重试，或要多个专家分工协作时，它把工作流建模成有向状态图，让流转可观察、可复现。它同样适合需要人工审批的长流程——图可以在关键节点暂停、等人处理后再从断点恢复，检查点让服务重启也不丢现场。如果你的需求只是单轮问答或固定顺序的链式调用，用更轻的方案即可；当「状态、分支、协作、审批」成为刚需时，LangGraph 就是该上场的时候。'
  trail.value.push({ from: '写作员 → 监督者', text: '短文已生成（约 190 字）。', badge: '返回' })
  await sleep(700)

  activeMember.value = 'supervisor'
  trail.value.push({ from: '监督者', text: '交付完成：汇总各子智能体结果，输出最终文章。', badge: '交付' })
  running.value = false
}
</script>

<template>
  <div class="demo-card demo-container">
    <h3>监督者分派与子智能体接力</h3>
    <p class="demo-desc">
      监督者自己不做调研也不写文章——它拆解目标，把子任务派给「当工具的」子智能体，再汇总交付。点运行看一次完整的委派接力。
    </p>

    <div class="controls">
      <input :value="goal" type="text" readonly />
      <button class="btn" type="button" :disabled="running" @click="run">{{ running ? '团队协作中…' : '运行团队' }}</button>
    </div>

    <div class="grid-2">
      <div class="demo-panel">
        <h4>团队名册</h4>
        <div v-for="member in team" :key="member.id" class="lg-server" :class="{ active: activeMember === member.id }">
          <div class="lg-server-head">
            <strong>{{ member.name }}</strong>
            <span class="badge" :class="activeMember === member.id ? 'success' : 'warning'">
              {{ activeMember === member.id ? '工作中' : '待命' }}
            </span>
          </div>
          <p class="hint">{{ member.role }}</p>
          <p class="hint">可用工具：{{ member.tools }}</p>
        </div>
      </div>

      <div class="demo-panel">
        <h4>委派轨迹</h4>
        <p v-if="!trail.length" class="hint">尚未运行。</p>
        <div v-for="(item, i) in trail" :key="i" class="log-line">
          <span class="badge" :class="item.badge === '委派' ? 'action' : item.badge === '返回' ? 'observe' : 'think'">
            {{ item.badge }}
          </span>
          <span><strong>{{ item.from }}：</strong>{{ item.text }}</span>
        </div>
      </div>
    </div>

    <div v-if="deliverable" class="tips-box">
      <strong>最终交付（监督者汇总）：</strong>{{ deliverable }}
    </div>
  </div>
</template>
