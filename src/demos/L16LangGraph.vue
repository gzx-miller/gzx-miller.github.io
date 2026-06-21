<script setup>
import { ref, computed } from 'vue'

const nodes = [
  { id: 'analyze', label: '分析需求', desc: '解析用户偏好与目标领域' },
  { id: 'search',  label: '搜索课程', desc: '从知识库检索候选课程' },
  { id: 'rank',    label: '排序筛选', desc: '按匹配度与评分排序' },
  { id: 'respond', label: '生成回复', desc: '组织推荐理由与结果' },
]
const edges = [
  { from: 'analyze', to: 'search',  cond: 'has_keywords' },
  { from: 'analyze', to: 'respond', cond: 'empty_query',  dashed: true },
  { from: 'search',  to: 'rank' },
  { from: 'rank',    to: 'respond' },
]
const activeNode = ref(null)
const history = ref([])
const isRunning = ref(false)

async function runGraph() {
  if (isRunning.value) return
  isRunning.value = true
  history.value = []
  for (const node of nodes) {
    activeNode.value = node.id
    history.value.push({ node: node.label, state: `进入 ${node.id} 节点` })
    await new Promise(r => setTimeout(r, 700))
  }
  history.value.push({ node: 'END', state: '流程结束，返回推荐结果' })
  activeNode.value = null
  isRunning.value = false
}

const graphCode = `import { StateGraph, END } from '@langchain/langgraph'

const graph = new StateGraph({ channels: ['query', 'courses', 'ranked'] })
graph.addNode('analyze', analyzeNode)
graph.addNode('search',  searchNode)
graph.addNode('rank',    rankNode)
graph.addNode('respond', respondNode)

graph.addEdge('search', 'rank')
graph.addEdge('rank',   'respond')
graph.addConditionalEdges('analyze', routeByQuery, {
  has_keywords: 'search',
  empty_query:  'respond',
})
graph.addEdge('respond', END)

const app = graph.compile()
const result = await app.invoke({ query: '推荐 Vue3 入门课' })`
</script>

<template>
  <div class="demo-card">
    <h3>LangGraph 多智能体状态机</h3>
    <button class="run-btn" :disabled="isRunning" @click="runGraph">{{ isRunning ? '运行中...' : '运行状态机' }}</button>
    <div class="graph-area">
      <div class="node-row">
        <div v-for="(n, i) in nodes" :key="n.id" class="node-box" :class="{ active: activeNode === n.id }">
          <strong>{{ n.label }}</strong>
          <span class="node-id">{{ n.id }}</span>
          <span class="node-desc">{{ n.desc }}</span>
          <span v-if="i < nodes.length - 1" class="edge-arrow">→</span>
        </div>
      </div>
      <div class="cond-edge">
        <span class="cond-label">条件边：empty_query 时跳过搜索，直达回复</span>
      </div>
    </div>
    <div class="history-section" v-if="history.length">
      <h4>状态流转日志</h4>
      <div v-for="(h, i) in history" :key="i" class="log-item">
        <span class="log-node">{{ h.node }}</span>{{ h.state }}
      </div>
    </div>
    <div class="code-section">
      <h4>StateGraph 构建代码</h4>
      <pre class="code-block">{{ graphCode }}</pre>
    </div>
  </div>
</template>

<style scoped>
.run-btn { padding: 6px 16px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 12px; }
.run-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.graph-area { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
.node-row { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.node-box { position: relative; display: flex; flex-direction: column; align-items: center; padding: 10px 14px; border: 2px solid #d4a574; border-radius: 8px; background: #fff; min-width: 90px; transition: all 0.2s; }
.node-box.active { border-color: #c8703c; background: #fde8d0; box-shadow: 0 0 8px #c8703c55; }
.node-box strong { font-size: 13px; color: #5a3e2b; }
.node-id { font-size: 10px; color: #a0623a; font-family: monospace; }
.node-desc { font-size: 10px; color: #8b5e3c; margin-top: 2px; }
.edge-arrow { position: absolute; right: -14px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #c8703c; }
.cond-edge { margin-top: 10px; padding: 6px 10px; border: 1px dashed #d4a574; border-radius: 4px; background: #fff8f0; }
.cond-label { font-size: 11px; color: #a0623a; }
.history-section { margin-bottom: 12px; }
.history-section h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.log-item { font-size: 12px; color: #5a3e2b; padding: 3px 0; border-bottom: 1px solid #f5ebe0; }
.log-node { display: inline-block; min-width: 60px; font-weight: bold; color: #c8703c; font-family: monospace; margin-right: 6px; }
.code-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-section h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.code-block { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>
