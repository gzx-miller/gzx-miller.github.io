<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position, VueFlow, useVueFlow } from '@vue-flow/core'
import type { Connection, Edge, Node } from '@vue-flow/core'

const log = ref<string[]>([])

function pushLog(message: string) {
  log.value = [`${message}`, ...log.value].slice(0, 6)
}

// 分流规则：小额报销走"组长"，大额报销必须走"总监"
function isValidConnection(connection: Connection | Edge): boolean {
  const { source, target, sourceHandle, targetHandle } = connection
  if (source === target) return false
  const isLarge = sourceHandle === 'large-out'
  const wantsDirector = targetHandle === 'director-in'
  // 大额单只能进总监，小额单不能进总监（演示用业务规则）
  if (isLarge && !wantsDirector) return false
  if (!isLarge && targetHandle === 'director-in') return false
  return true
}

const { onConnect, addEdges } = useVueFlow()

onConnect((connection: Connection) => {
  if (!isValidConnection(connection)) {
    pushLog('连接被 isValidConnection 拒绝')
    return
  }
  addEdges([{ ...connection, animated: true }])
  pushLog(`已连接 ${connection.sourceHandle} → ${connection.targetHandle}`)
})

const nodes = ref<Node[]>([
  {
    id: 'expense',
    type: 'expense-split',
    position: { x: 0, y: 140 },
    data: { label: '报销单' },
  },
  { id: 'lead', position: { x: 300, y: 20 }, data: { label: '组长审批（≤500）' } },
  { id: 'director', position: { x: 300, y: 260 }, data: { label: '总监审批（>500）' } },
  { id: 'paid', type: 'output', position: { x: 560, y: 140 }, data: { label: '打款' } },
])

const edges = ref<Edge[]>([])
</script>

<template>
  <div class="demo-card">
    <h3>多连接桩与定向分流</h3>
    <p>
      给 <code>&lt;Handle&gt;</code> 设置 <code>id</code> 后，连线要指定
      <code>sourceHandle</code> / <code>targetHandle</code> 才能精确对接；
      <code>isValidConnection</code> 在松手前实时校验，返回 false 的连线直接被丢弃。
      自定义节点（本例的 <code>expense-split</code>）用 <code>#node-类型名</code> 插槽渲染，
      内部可以摆放任意数量的 Handle。
    </p>
    <div class="vf-layout">
      <div class="vf-canvas">
        <ClientOnly>
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :fit-view-on-init="true"
            :is-valid-connection="isValidConnection"
          >
            <template #node-expense-split="expenseProps">
              <div class="split-node">
                <strong>报销单</strong>
                <span>按金额分流</span>
                <Handle type="source" :position="Position.Right" id="small-out" class="handle-small" />
                <Handle type="source" :position="Position.Right" id="large-out" class="handle-large" style="top: auto; bottom: 8px" />
                <span class="handle-tag tag-small">小额出</span>
                <span class="handle-tag tag-large">大额出</span>
              </div>
            </template>
          </VueFlow>
          <template #fallback>
            <div class="vf-fallback">流程图画布加载中…</div>
          </template>
        </ClientOnly>
      </div>
      <aside class="vf-log">
        <h4>连接日志</h4>
        <ol>
          <li v-for="(item, index) in log" :key="index">{{ item }}</li>
          <li v-if="log.length === 0" class="empty">从"报销单"右侧的连接桩拖线试试</li>
        </ol>
        <p class="vf-tip">规则：大额只能进总监，小额不能进总监，禁止自连。</p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.vf-layout {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 12px;
}

.vf-canvas {
  height: 340px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
}

.vf-fallback {
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--muted);
}

.split-node {
  position: relative;
  width: 150px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  display: grid;
  gap: 4px;
  font-size: 12px;
}

.handle-small {
  top: 26px;
}

.handle-tag {
  font-size: 10px;
  color: var(--muted);
}

.tag-small {
  grid-column: 1;
}

.handle-small,
.handle-large {
  width: 10px;
  height: 10px;
}

.handle-large {
  background: var(--leaf-red);
}

.vf-log {
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  padding: 10px;
  font-size: 0.85em;
  display: grid;
  gap: 8px;
  align-content: start;
}

.vf-log ol {
  margin: 0;
  padding-left: 1.2em;
  display: grid;
  gap: 4px;
  color: var(--muted);
}

.vf-log .empty {
  list-style: none;
}

.vf-tip {
  color: var(--muted);
}

@media (max-width: 720px) {
  .vf-layout {
    grid-template-columns: 1fr;
  }
}
</style>
