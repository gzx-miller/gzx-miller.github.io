<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Node } from '@vue-flow/core'

/**
 * 用 useVueFlow 拿到画布实例的响应式状态与方法：
 * 不传 v-model，初始数据用 props 传入，之后完全通过实例方法增删改查。
 */
const {
  nodes: flowNodes,
  edges: flowEdges,
  addNodes,
  updateNodeData,
  findNode,
  removeNodes,
  fitView,
} = useVueFlow()

const initialNodes: Node[] = [
  { id: 'order', type: 'input', position: { x: 0, y: 120 }, data: { label: '用户下单' } },
  { id: 'pick', position: { x: 220, y: 120 }, data: { label: '拣货打包' } },
  { id: 'done', type: 'output', position: { x: 440, y: 120 }, data: { label: '签收完成' } },
]

const initialEdges = [
  { id: 'e1', source: 'order', target: 'pick' },
  { id: 'e2', source: 'pick', target: 'done' },
]

const message = ref('用上方按钮操作画布')

const nodeCount = computed(() => flowNodes.value.length)
const edgeCount = computed(() => flowEdges.value.length)

let extraIndex = 0

function addCheckpoint() {
  extraIndex += 1
  const id = `check-${extraIndex}`
  addNodes([
    {
      id,
      position: { x: 220 + extraIndex * 30, y: 20 + extraIndex * 60 },
      data: { label: `质检环节 ${extraIndex}` },
    },
  ])
  message.value = `addNodes 新增了 ${findNode(id)?.id}`
}

function markPicked() {
  // updateNodeData 只合并 data，不触碰位置等其他字段
  updateNodeData('pick', { label: '拣货打包 ✓ 已完成' })
  message.value = 'updateNodeData 更新了「拣货打包」的 data.label'
}

function highlightOrder() {
  const node = findNode('order')
  if (!node) {
    message.value = 'findNode 没找到该节点'
    return
  }
  // findNode 返回的是 GraphNode（含 selected 字段），直接置位即可选中
  node.selected = true
  message.value = `findNode 找到 ${node.id}，给 node.selected 置 true 完成选中`
}

function removeLastCheckpoint() {
  const targets = flowNodes.value.filter((node) => node.id.startsWith('check-'))
  if (targets.length === 0) {
    message.value = '没有可删除的质检环节'
    return
  }
  removeNodes([targets[targets.length - 1].id])
  message.value = 'removeNodes 删除了最后一个质检环节'
}

async function refit() {
  await fitView({ padding: 0.2, duration: 300 })
  message.value = 'fitView 已把所有节点收进视野'
}
</script>

<template>
  <div class="demo-card">
    <h3>useVueFlow：实例化的增删改查</h3>
    <p>
      在任意组件里调用 <code>useVueFlow()</code> 就能拿到同一画布的响应式状态
      （<code>nodes / edges</code>）与方法：<code>addNodes、updateNodeData、updateNode、
      findNode、removeNodes、fitView</code>……状态与方法都能脱离模板事件，
      在业务代码（如接口回调）中直接调用。
    </p>
    <div class="vf-toolbar">
      <button @click="addCheckpoint">addNodes 加质检</button>
      <button @click="markPicked">updateNodeData 标记完成</button>
      <button @click="highlightOrder">findNode 选中下单</button>
      <button @click="removeLastCheckpoint">removeNodes 删质检</button>
      <button @click="refit">fitView 归位</button>
    </div>
    <div class="vf-canvas">
      <ClientOnly>
        <VueFlow :nodes="initialNodes" :edges="initialEdges" :fit-view-on-init="true" />
        <template #fallback>
          <div class="vf-fallback">流程图画布加载中…</div>
        </template>
      </ClientOnly>
    </div>
    <p class="vf-status">
      实例状态：{{ nodeCount }} 个节点 · {{ edgeCount }} 条连线 · {{ message }}
    </p>
  </div>
</template>

<style scoped>
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

.vf-toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.vf-status {
  color: var(--muted);
  font-size: 0.9em;
}
</style>
