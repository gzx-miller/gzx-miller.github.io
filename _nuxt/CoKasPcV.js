const n=`<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { layoutByLayers } from '../composables/useFlowAutoLayout'
import type { Edge, Node } from '@vue-flow/core'

// 故意打乱位置的发布流水线：点击"自动布局"一键归位
const nodes = ref<Node[]>([
  { id: 'code', type: 'input', position: { x: 520, y: 40 }, data: { label: '提交代码' } },
  { id: 'lint', position: { x: 60, y: 260 }, data: { label: '静态检查' } },
  { id: 'test', position: { x: 380, y: 160 }, data: { label: '跑单测' } },
  { id: 'build', position: { x: 200, y: 20 }, data: { label: '构建镜像' } },
  { id: 'deploy', type: 'output', position: { x: 640, y: 280 }, data: { label: '部署上线' } },
])

const edges = ref<Edge[]>([
  { id: 'e1', source: 'code', target: 'lint' },
  { id: 'e2', source: 'lint', target: 'test' },
  { id: 'e3', source: 'test', target: 'build' },
  { id: 'e4', source: 'build', target: 'deploy' },
])

const direction = ref<'LR' | 'TB'>('LR')
const message = ref('节点位置是故意打乱的，点「自动布局」试试')

const { updateNode, fitView } = useVueFlow()

async function applyLayout() {
  const positions = layoutByLayers(nodes.value, edges.value, {
    direction: direction.value,
    layerGap: 70,
    nodeGap: 30,
    nodeWidth: 120,
    nodeHeight: 40,
  })
  // updateNode 逐个写入新坐标，画布响应式重排
  for (const node of nodes.value) {
    const position = positions.get(node.id)
    if (position) updateNode(node.id, { position })
  }
  await fitView({ padding: 0.25, duration: 400 })
  message.value = \`已按 \${direction.value === 'LR' ? '从左到右' : '从上到下'} 分层对齐（Kahn 分层算法）\`
}
<\/script>

<template>
  <div class="demo-card">
    <h3>自动布局：分层归位</h3>
    <p>
      自动布局 = 算坐标 + 写回节点。本例的 <code>layoutByLayers</code>（见
      <code>src/composables/useFlowAutoLayout.ts</code>）用 Kahn 分层：
      入度为 0 的节点当第一层，其余节点取"最长前置路径 + 1"，环上节点沉底。
      坐标算好后用 <code>updateNode</code> 写回，再 <code>fitView</code> 收进视野。
      更复杂的图可以换成 dagre / elkjs 等图布局库，套路不变。
    </p>
    <div class="vf-toolbar">
      <button @click="applyLayout">自动布局</button>
      <button @click="direction = direction === 'LR' ? 'TB' : 'LR'">
        当前方向：{{ direction === 'LR' ? '从左到右' : '从上到下' }}（点击切换）
      </button>
    </div>
    <div class="vf-canvas">
      <ClientOnly>
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" :fit-view-on-init="true" />
        <template #fallback>
          <div class="vf-fallback">流程图画布加载中…</div>
        </template>
      </ClientOnly>
    </div>
    <p class="vf-status">{{ message }}</p>
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
`;export{n as default};
