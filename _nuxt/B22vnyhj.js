const e=`<script setup lang="ts">
import { ref } from 'vue'
import { EdgeLabelRenderer, VueFlow, getBezierPath } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'

type ApprovalData = {
  status: 'pass' | 'reject'
}

const nodes = ref<Node[]>([
  { id: 'apply', type: 'input', position: { x: 0, y: 120 }, data: { label: '员工请假' } },
  { id: 'leader', position: { x: 260, y: 120 }, data: { label: '主管审批' } },
  { id: 'boss', position: { x: 520, y: 20 }, data: { label: '老板特批' } },
  { id: 'rest', type: 'output', position: { x: 520, y: 240 }, data: { label: '休假成功' } },
])

const edges = ref<Edge<ApprovalData>[]>([
  { id: 'e1', source: 'apply', target: 'leader', type: 'approval', data: { status: 'pass' } },
  { id: 'e2', source: 'leader', target: 'boss', type: 'approval', data: { status: 'reject' } },
  { id: 'e3', source: 'leader', target: 'rest', type: 'approval', data: { status: 'pass' } },
])

function toggleStatus(edgeId: string) {
  const edge = edges.value.find((item) => item.id === edgeId)
  if (!edge?.data) return
  edge.data.status = edge.data.status === 'pass' ? 'reject' : 'pass'
}
<\/script>

<template>
  <div class="demo-card">
    <h3>自定义连线：带状态标签的审批线</h3>
    <p>
      连线同样支持插槽接管：<code>type</code> 设为 <code>approval</code> 后用
      <code>#edge-approval</code> 渲染。插槽参数给出起止坐标
      <code>sourceX/Y、targetX/Y</code> 与方向，先调
      <code>getBezierPath</code> 生成 path，再用 <code>&lt;EdgeLabelRenderer&gt;</code>
      把 HTML 标签叠在画布上（直接写在 SVG 里无法承载复杂交互）。
    </p>
    <div class="vf-toolbar">
      <button @click="toggleStatus('e2')">切换「主管 → 老板」状态</button>
      <button @click="toggleStatus('e3')">切换「主管 → 休假」状态</button>
      <span class="vf-tip">绿色=通过，红色=驳回</span>
    </div>
    <div class="vf-canvas">
      <ClientOnly>
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" :fit-view-on-init="true">
          <template #edge-approval="edgeProps">
            <path
              :id="edgeProps.id"
              class="vue-flow__edge-path"
              :d="getBezierPath({
                sourceX: edgeProps.sourceX,
                sourceY: edgeProps.sourceY,
                sourcePosition: edgeProps.sourcePosition,
                targetX: edgeProps.targetX,
                targetY: edgeProps.targetY,
                targetPosition: edgeProps.targetPosition,
              })[0]"
              :class="{ rejected: edgeProps.data?.status === 'reject' }"
              fill="none"
            />
            <EdgeLabelRenderer>
              <div
                class="edge-label"
                :class="{ rejected: edgeProps.data?.status === 'reject' }"
                :style="{
                  position: 'absolute',
                  transform: \`translate(-50%, -50%) translate(\${(edgeProps.sourceX + edgeProps.targetX) / 2}px, \${(edgeProps.sourceY + edgeProps.targetY) / 2}px)\`,
                }"
              >
                {{ edgeProps.data?.status === 'pass' ? '通过 ✓' : '驳回 ✗' }}
              </div>
            </EdgeLabelRenderer>
          </template>
        </VueFlow>
        <template #fallback>
          <div class="vf-fallback">流程图画布加载中…</div>
        </template>
      </ClientOnly>
    </div>
    <p class="vf-status">
      标签位置用起终点的中点坐标做绝对定位；线的颜色由 edge 的 <code>data.status</code>
      驱动，业务状态一变，视图自动更新。
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
  align-items: center;
  flex-wrap: wrap;
}

.vf-tip {
  color: var(--muted);
  font-size: 0.85em;
}

.vue-flow__edge-path {
  stroke: var(--forest);
  stroke-width: 2;
}

.vue-flow__edge-path.rejected {
  stroke: var(--leaf-red);
  stroke-dasharray: 6;
}

.edge-label {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  background: var(--forest);
  color: #fff;
  pointer-events: none;
}

.edge-label.rejected {
  background: var(--leaf-red);
}

.vf-status {
  color: var(--muted);
  font-size: 0.9em;
}
</style>
`;export{e as default};
