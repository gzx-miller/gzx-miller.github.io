<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import type { Edge, Node, NodeMouseEvent } from '@vue-flow/core'

// 学习路径：入口 -> 两门基础课 -> 进阶课 -> 完结（output）
const nodes = ref<Node[]>([
  { id: 'start', type: 'input', position: { x: 0, y: 120 }, data: { label: '开始学习' } },
  { id: 'vue-basic', position: { x: 220, y: 40 }, data: { label: 'Vue3 基础' } },
  { id: 'ts-basic', position: { x: 220, y: 200 }, data: { label: 'TypeScript 基础' } },
  { id: 'advanced', position: { x: 440, y: 120 }, data: { label: '组件设计进阶' } },
  { id: 'done', type: 'output', position: { x: 660, y: 120 }, data: { label: '毕业啦' } },
])

const edges = ref<Edge[]>([
  { id: 'e1', source: 'start', target: 'vue-basic' },
  { id: 'e2', source: 'start', target: 'ts-basic' },
  { id: 'e3', source: 'vue-basic', target: 'advanced' },
  { id: 'e4', source: 'ts-basic', target: 'advanced' },
  { id: 'e5', source: 'advanced', target: 'done' },
])

const clicked = ref('（点击节点试试）')

// node-click 事件只传一个 NodeMouseEvent 对象：{ event, node }
function onNodeClick({ node }: NodeMouseEvent) {
  const label = (node.data as { label?: string } | undefined)?.label
  clicked.value = `当前点击：${label ?? node.id}`
}
</script>

<template>
  <div class="demo-card">
    <h3>最小可用的 Vue Flow 画布</h3>
    <p>
      只需要三件事：安装 <code>pnpm add @vue-flow/core</code>、引入
      <code>@vue-flow/core/dist/style.css</code> 与
      <code>theme-default.css</code>、准备 <code>nodes</code> 和
      <code>edges</code> 两组数据。节点用 <code>position</code> 定位（画布坐标系，非像素定位流），
      连线只写 <code>source</code> / <code>target</code> 的节点 id。
    </p>
    <div class="vf-canvas">
      <ClientOnly>
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :fit-view-on-init="true"
          :min-zoom="0.5"
          :max-zoom="1.5"
          @node-click="onNodeClick"
        />
        <template #fallback>
          <div class="vf-fallback">流程图画布加载中…</div>
        </template>
      </ClientOnly>
    </div>
    <p class="vf-status">
      节点 {{ nodes.length }} 个 · 连线 {{ edges.length }} 条 · {{ clicked }}
      （滚轮缩放，空白处拖拽平移，节点可拖动）
    </p>
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

.vf-status {
  color: var(--muted);
  font-size: 0.9em;
}
</style>
