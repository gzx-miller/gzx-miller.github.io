<script setup lang="ts">
import { ref } from 'vue'

interface McpTool {
  name: string
  desc: string
}

interface McpServer {
  id: string
  transport: string
  tools: McpTool[]
}

const servers: McpServer[] = [
  {
    id: 'courseDb',
    transport: 'http · https://mcp.example.com/course-db',
    tools: [{ name: 'courseDb__query', desc: '查询课程元数据：章节数、总页数、难度' }],
  },
  {
    id: 'math',
    transport: 'stdio · node ./mcp-servers/math-server.js',
    tools: [{ name: 'math__calculate', desc: '对算术表达式求值' }],
  },
]

const question = ref('《LangGraph 入门》这门课总共几章？每章平均多少页？')
const running = ref(false)
const activeServer = ref<string | null>(null)
const trail = ref<{ kind: 'agent' | 'call' | 'return'; text: string; server?: string }[]>([])
const answer = ref('')

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  if (running.value) return
  running.value = true
  trail.value = []
  answer.value = ''
  activeServer.value = null

  trail.value.push({ kind: 'agent', text: '拆解问题：需要「章节数」和「总页数」才能做除法，先查课程库。' })
  await sleep(680)

  trail.value.push({ kind: 'call', text: 'courseDb__query({ title: "LangGraph 入门" })', server: 'courseDb' })
  activeServer.value = 'courseDb'
  await sleep(700)
  trail.value.push({ kind: 'return', text: '{ chapters: 14, totalPages: 210 }', server: 'courseDb' })
  await sleep(560)

  trail.value.push({ kind: 'agent', text: '拿到 14 章、210 页。除法留给数学工具，调用第二个 Server。' })
  await sleep(680)

  trail.value.push({ kind: 'call', text: 'math__calculate({ expression: "210 / 14" })', server: 'math' })
  activeServer.value = 'math'
  await sleep(700)
  trail.value.push({ kind: 'return', text: '15', server: 'math' })
  await sleep(560)

  activeServer.value = null
  answer.value = '《LangGraph 入门》共 14 章，全书 210 页，平均每章约 15 页。'
  trail.value.push({ kind: 'agent', text: '数据齐全，生成最终回答。' })
  running.value = false
}
</script>

<template>
  <div class="demo-card demo-container">
    <h3>MCP Server 工具接入与跨服务调用</h3>
    <p class="demo-desc">
      两个 MCP Server 各自暴露工具，Agent 用同一套接口发现并调用它们。点运行，看一次提问如何跨越「课程库」与「计算器」两个服务完成。
    </p>

    <div class="controls">
      <input v-model="question" type="text" :disabled="running" />
      <button class="btn" type="button" :disabled="running" @click="run">{{ running ? '调用中…' : '运行提问' }}</button>
    </div>

    <div class="grid-2">
      <div class="demo-panel">
        <h4>已连接的 MCP Server</h4>
        <div v-for="server in servers" :key="server.id" class="lg-server" :class="{ active: activeServer === server.id }">
          <div class="lg-server-head">
            <strong>{{ server.id }}</strong>
            <span class="badge" :class="activeServer === server.id ? 'success' : 'warning'">
              {{ activeServer === server.id ? '调用中' : server.transport.split(' · ')[0] }}
            </span>
          </div>
          <p class="hint">{{ server.transport }}</p>
          <div v-for="tool in server.tools" :key="tool.name" class="lg-tool">
            <code>{{ tool.name }}</code>
            <span>{{ tool.desc }}</span>
          </div>
        </div>
        <p class="hint">工具名带 Server 前缀，一眼看出每次调用跨了哪个服务。</p>
      </div>

      <div class="demo-panel">
        <h4>调用轨迹</h4>
        <p v-if="!trail.length" class="hint">尚未运行。</p>
        <div
          v-for="(item, i) in trail"
          :key="i"
          class="log-line"
          :class="item.kind === 'agent' ? 'think' : item.kind === 'call' ? 'action' : 'observe'"
        >
          <span class="badge" :class="item.kind === 'agent' ? 'think' : item.kind === 'call' ? 'action' : 'observe'">
            {{ item.kind === 'agent' ? 'Agent' : item.kind === 'call' ? '调用' : '返回' }}
          </span>
          <span>{{ item.text }}</span>
        </div>
        <div v-if="answer" class="tips-box">
          <strong>最终回答：</strong>{{ answer }}
        </div>
      </div>
    </div>
  </div>
</template>
