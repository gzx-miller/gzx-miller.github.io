<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Node } from '@vue-flow/core'

// 物料面板：拖到画布上按"画布坐标"落点
type MaterialKind = 'start' | 'approval' | 'cc' | 'end'

const materials: { kind: MaterialKind; label: string; hint: string }[] = [
  { kind: 'start', label: '开始', hint: 'input 节点' },
  { kind: 'approval', label: '审批', hint: 'default 节点' },
  { kind: 'cc', label: '抄送', hint: 'default 节点' },
  { kind: 'end', label: '结束', hint: 'output 节点' },
]

const { screenToFlowCoordinate, addNodes } = useVueFlow()

const droppedCount = ref(0)
const message = ref('把左侧物料拖进右侧画布')

function onDragStart(event: DragEvent, kind: MaterialKind) {
  event.dataTransfer?.setData('application/vue-flow-material', kind)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDrop(event: DragEvent) {
  const kind = event.dataTransfer?.getData('application/vue-flow-material') as MaterialKind | ''
  if (!kind) return

  // 关键一步：屏幕坐标 -> 画布坐标（含缩放与平移），否则缩放后落点会飘
  const position = screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY,
  })

  droppedCount.value += 1
  const node: Node = {
    id: `${kind}-${droppedCount.value}`,
    type: kind === 'start' ? 'input' : kind === 'end' ? 'output' : 'default',
    position,
    data: { label: `${materials.find((m) => m.kind === kind)?.label ?? kind} ${droppedCount.value}` },
  }
  addNodes([node])
  message.value = `在画布坐标 (${Math.round(position.x)}, ${Math.round(position.y)}) 放置了节点`
}
</script>

<template>
  <div class="demo-card">
    <h3>拖拽添加节点（低代码画布的核心交互）</h3>
    <p>
      浏览器拖放事件给的是<b>屏幕坐标</b>，而画布可能已被缩放和平移。
      <code>screenToFlowCoordinate</code> 负责换算成画布坐标系，再交给
      <code>addNodes</code> 落点才准确。物料类型通过 <code>dataTransfer</code> 携带。
    </p>
    <div class="vf-layout">
      <aside class="vf-palette">
        <h4>物料区</h4>
        <div
          v-for="material in materials"
          :key="material.kind"
          class="material"
          draggable="true"
          @dragstart="onDragStart($event, material.kind)"
        >
          <strong>{{ material.label }}</strong>
          <span>{{ material.hint }}</span>
        </div>
        <p class="vf-tip">按住拖到右侧画布任意位置松手</p>
      </aside>
      <div
        class="vf-canvas"
        @drop="onDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <ClientOnly>
          <VueFlow :nodes="[]" :edges="[]" :fit-view-on-init="true" />
          <template #fallback>
            <div class="vf-fallback">流程图画布加载中…</div>
          </template>
        </ClientOnly>
      </div>
    </div>
    <p class="vf-status">已放置 {{ droppedCount }} 个节点 · {{ message }}</p>
  </div>
</template>

<style scoped>
.vf-layout {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 12px;
}

.vf-palette {
  display: grid;
  gap: 8px;
  align-content: start;
  font-size: 0.85em;
}

.vf-palette h4 {
  margin: 0;
}

.material {
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: grab;
  display: grid;
  gap: 2px;
  user-select: none;
}

.material:active {
  cursor: grabbing;
  border-color: var(--accent);
}

.material span {
  color: var(--muted);
  font-size: 0.85em;
}

.vf-canvas {
  height: 340px;
  border: 1px dashed var(--border);
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

.vf-tip {
  color: var(--muted);
}

.vf-status {
  color: var(--muted);
  font-size: 0.9em;
}

@media (max-width: 720px) {
  .vf-layout {
    grid-template-columns: 1fr;
  }
}
</style>
