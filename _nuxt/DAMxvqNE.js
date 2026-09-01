const e=`<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Connection, Edge, Node } from '@vue-flow/core'

// v-model 同步回来的节点/连线会带上 Vue Flow 内部的 selected 状态，
// 但 Node/Edge 公开类型不含该字段，这里补一个可选声明
type SelectableNode = Node & { selected?: boolean }
type SelectableEdge = Edge & { selected?: boolean }

// 任务编排板：可自由连线（去重）、框选、键盘删除
const nodes = ref<SelectableNode[]>([
  { id: 'trigger', type: 'input', position: { x: 0, y: 120 }, data: { label: '定时触发' } },
  { id: 'fetch', position: { x: 220, y: 30 }, data: { label: '抓取数据' } },
  { id: 'clean', position: { x: 220, y: 220 }, data: { label: '清洗数据' } },
  { id: 'report', position: { x: 460, y: 120 }, data: { label: '生成报表' } },
])

const edges = ref<SelectableEdge[]>([
  { id: 'e1', source: 'trigger', target: 'fetch' },
  { id: 'e2', source: 'trigger', target: 'clean' },
  { id: 'e3', source: 'fetch', target: 'report' },
])

const message = ref('')

const { onConnect, addEdges } = useVueFlow()

onConnect((connection: Connection) => {
  // 去重：同源同目标（含连接桩）的线只保留一条
  const duplicated = edges.value.some(
    (edge) =>
      edge.source === connection.source &&
      edge.target === connection.target &&
      edge.sourceHandle === connection.sourceHandle &&
      edge.targetHandle === connection.targetHandle,
  )
  if (duplicated) {
    message.value = '这条线已经存在，跳过'
    return
  }
  addEdges([{ ...connection, markerEnd: undefined }])
  message.value = \`新增任务依赖：\${connection.source} → \${connection.target}\`
})

const selectedNodes = computed(() => nodes.value.filter((node) => node.selected))
const selectedEdges = computed(() => edges.value.filter((edge) => edge.selected))

function removeSelected() {
  const nodeIds = new Set(selectedNodes.value.map((node) => node.id))
  // 先删除与选中节点相连的线，再删选中节点，避免留下悬空连线
  edges.value = edges.value.filter(
    (edge) => !selectedEdges.value.includes(edge) && !nodeIds.has(edge.source) && !nodeIds.has(edge.target),
  )
  nodes.value = nodes.value.filter((node) => !node.selected)
  message.value = '已删除选中元素'
}
<\/script>

<template>
  <div class="demo-card">
    <h3>连接、框选与删除</h3>
    <p>
      <code>@connect</code>（或 <code>onConnect</code>）在松手连线时触发，业务上通常在这里
      去重、补默认样式后再 <code>addEdges</code>。按住 <kbd>Shift</kbd> 空白拖拽可框选，
      选中后按 <kbd>Backspace</kbd> / <kbd>Delete</kbd> 删除；删除键由
      <code>:delete-key-code</code> 配置。
    </p>
    <div class="vf-toolbar">
      <button :disabled="selectedNodes.length + selectedEdges.length === 0" @click="removeSelected">
        删除选中（{{ selectedNodes.length }} 节点 / {{ selectedEdges.length }} 连线）
      </button>
      <span class="vf-tip">{{ message || '提示：节点间拖线建立依赖，Shift+拖拽框选' }}</span>
    </div>
    <div class="vf-canvas">
      <ClientOnly>
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :fit-view-on-init="true"
          :delete-key-code="['Backspace', 'Delete']"
          :selection-key-code="'Shift'"
        />
        <template #fallback>
          <div class="vf-fallback">流程图画布加载中…</div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.vf-canvas {
  height: 360px;
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
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.vf-tip {
  color: var(--muted);
  font-size: 0.85em;
}

kbd {
  padding: 1px 5px;
  border: 1px solid var(--border);
  border-bottom-width: 2px;
  border-radius: 4px;
  font-size: 0.85em;
  background: var(--surface);
}
</style>
`;export{e as default};
