const n=`<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'

const GROUP_ID = 'basics'
const TRACKED_ID = 'js'

function groupStyle(width: number, height: number): Record<string, string> {
  return {
    width: \`\${width}px\`,
    height: \`\${height}px\`,
    border: '1px dashed var(--demo-border)',
    borderRadius: '10px',
    background: 'var(--demo-surface-soft)',
    boxSizing: 'border-box',
  }
}

const nodes = ref<Node[]>([
  {
    id: GROUP_ID,
    type: 'group',
    position: { x: 20, y: 20 },
    style: groupStyle(300, 220),
    data: { label: '模块一 · 前端基础' },
  },
  {
    id: 'html',
    parentNode: GROUP_ID,
    extent: 'parent',
    position: { x: 24, y: 56 },
    data: { label: 'HTML 语义' },
  },
  {
    id: 'css',
    parentNode: GROUP_ID,
    extent: 'parent',
    position: { x: 160, y: 56 },
    data: { label: 'CSS 布局' },
  },
  {
    id: TRACKED_ID,
    parentNode: GROUP_ID,
    extent: 'parent',
    position: { x: 24, y: 140 },
    data: { label: 'JavaScript 基础' },
  },
  {
    id: 'engineering',
    type: 'group',
    position: { x: 380, y: 20 },
    style: groupStyle(280, 220),
    data: { label: '模块二 · 工程化' },
  },
  {
    id: 'vite',
    parentNode: 'engineering',
    extent: 'parent',
    position: { x: 24, y: 56 },
    data: { label: '构建与打包' },
  },
  {
    id: 'test',
    parentNode: 'engineering',
    extent: 'parent',
    position: { x: 140, y: 140 },
    data: { label: '单元测试' },
  },
])

const edges = ref<Edge[]>([])

const nodesByGroup = ['html', 'css', TRACKED_ID, 'vite', 'test']

const groupTall = ref(false)
const message = ref('拖拽子节点：它只能在父分组内移动；拖动空白处可整体搬动分组')

const trackedNode = computed(() => nodes.value.find((node) => node.id === TRACKED_ID))
const isDetached = computed(() => !trackedNode.value?.parentNode)

const coordRows = computed(() =>
  nodesByGroup.map((id) => {
    const node = nodes.value.find((item) => item.id === id)
    return {
      id,
      label: String(node?.data?.label ?? id),
      parent: node?.parentNode ?? '无（画布绝对）',
      x: Math.round(node?.position.x ?? 0),
      y: Math.round(node?.position.y ?? 0),
      scope: node?.parentNode ? '相对父节点左上角' : '画布绝对坐标',
    }
  }),
)

function toggleDetach() {
  const child = nodes.value.find((node) => node.id === TRACKED_ID)
  const group = nodes.value.find((node) => node.id === GROUP_ID)
  if (!child || !group) return

  if (child.parentNode) {
    // 脱离前先把相对坐标换算成画布绝对坐标，避免节点位置突变
    child.position = {
      x: group.position.x + child.position.x,
      y: group.position.y + child.position.y,
    }
    child.parentNode = undefined
    child.extent = undefined
    message.value = '已脱离分组：position 变成画布绝对坐标，可以拖到任意位置'
    return
  }

  child.parentNode = GROUP_ID
  child.extent = 'parent'
  child.position = { x: 24, y: 140 }
  message.value = '已重新归组：position 重新按父节点左上角计量，拖动被限制在分组内'
}

function toggleGroupHeight() {
  const group = nodes.value.find((node) => node.id === GROUP_ID)
  if (!group) return
  groupTall.value = !groupTall.value
  group.style = groupStyle(300, groupTall.value ? 280 : 220)
  message.value = groupTall.value
    ? '父分组加高后，子节点的 position 原封不动，并不会自动重新排布'
    : '父分组恢复原高度，子节点仍停在原来的相对坐标'
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>课程模块分组：父子归属与相对坐标</h4>
      <p class="demo-desc">
        两个分组框是父节点，课程卡片通过 <code>parentNode</code> 归属其中，<code>position</code>
        相对父节点左上角计量；再加 <code>extent: 'parent'</code>，拖动就被关在分组内。
      </p>

      <div class="controls">
        <button class="mini-btn" type="button" @click="toggleDetach">
          {{ isDetached ? '重新归组' : '脱离分组' }}
        </button>
        <button class="mini-btn" type="button" @click="toggleGroupHeight">
          {{ groupTall ? '还原父分组高度' : '加高父分组' }}
        </button>
        <span class="badge" :class="{ warning: isDetached }">
          {{ isDetached ? 'JavaScript 基础：自由拖动' : 'JavaScript 基础：约束在父容器内' }}
        </span>
      </div>

      <div class="demo-panel" style="height: 380px; padding: 0; overflow: hidden">
        <ClientOnly>
          <VueFlow
            v-model:nodes="nodes"
            :edges="edges"
            :fit-view-on-init="true"
            :min-zoom="0.6"
            :max-zoom="1.4"
            :elevate-nodes-on-select="false"
          >
            <template #node-group="{ data, id }">
              <div
                :style="{
                  padding: '8px 10px',
                  color: 'var(--demo-text-muted)',
                  fontSize: '12px',
                  pointerEvents: 'none',
                }"
              >
                <strong>{{ data.label }}</strong>
                <span> · {{ id }}</span>
              </div>
            </template>
          </VueFlow>
          <template #fallback>
            <div class="vf-fallback">流程图画布加载中…</div>
          </template>
        </ClientOnly>
      </div>

      <div class="prop-table">
        <table>
          <thead>
            <tr>
              <th>节点</th>
              <th>parentNode</th>
              <th>position.x / y</th>
              <th>坐标口径</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in coordRows" :key="row.id">
              <td>{{ row.label }}</td>
              <td><code>{{ row.parent }}</code></td>
              <td>{{ row.x }} / {{ row.y }}</td>
              <td>{{ row.scope }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="hint">{{ message }}</p>
    </div>
  </div>
</template>
`;export{n as default};
