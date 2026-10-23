const n=`<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Edge, Node, NodeMouseEvent } from '@vue-flow/core'

const COLUMNS = 10
const NODE_WIDTH = 130
const NODE_HEIGHT = 56
const SIZES = [50, 200, 800]

const size = ref(50)
const onlyVisible = ref(true)
const mounted = ref(false)

const { nodes: flowNodes, viewport, dimensions, setViewport } = useVueFlow()

function buildNodes(total: number): Node[] {
  return Array.from({ length: total }, (_, index) => ({
    id: \`task-\${index + 1}\`,
    position: {
      x: (index % COLUMNS) * 150,
      y: Math.floor(index / COLUMNS) * 92,
    },
    data: { label: \`任务 \${index + 1}\` },
  }))
}

// 只保留少量跨行连线，把注意力留给节点渲染成本本身
function buildEdges(total: number): Edge[] {
  const edges: Edge[] = []
  for (let index = 0; index + COLUMNS < total; index += COLUMNS) {
    edges.push({
      id: \`link-\${index}\`,
      source: \`task-\${index + 1}\`,
      target: \`task-\${index + COLUMNS + 1}\`,
      type: 'smoothstep',
    })
  }
  return edges
}

const nodes = ref<Node[]>(buildNodes(50))
const edges = ref<Edge[]>(buildEdges(50))

const rebuildCost = ref('—')
const clickCost = ref('—')
const lastAction = ref('尚未交互：点击任意节点试试')

const renderedCount = computed(() => {
  if (!onlyVisible.value) return flowNodes.value.length
  if (!mounted.value) return 0
  const { x, y, zoom } = viewport.value
  const width = dimensions.value.width || 640
  const height = dimensions.value.height || 340
  return flowNodes.value.filter((node) => {
    const left = node.position.x * zoom + x
    const top = node.position.y * zoom + y
    return (
      left + NODE_WIDTH * zoom > 0 &&
      left < width &&
      top + NODE_HEIGHT * zoom > 0 &&
      top < height
    )
  }).length
})

const renderedLabel = computed(() =>
  onlyVisible.value && !mounted.value ? '—' : String(renderedCount.value),
)

const responseHint = computed(() => {
  if (!mounted.value) return '画布初始化后会实时统计视口内实际渲染的节点数。'
  if (!onlyVisible.value) {
    return size.value >= 800
      ? '视口裁剪关闭：800 个节点全部留在 DOM 中，拖拽与缩放会明显变慢。'
      : \`视口裁剪关闭：\${size.value} 个节点全部渲染，规模继续增大会更明显。\`
  }
  return \`视口裁剪开启：当前只渲染视野内的 \${renderedCount.value} 个节点，视野外节点等滚入后再挂载。\`
})

onMounted(() => {
  mounted.value = true
})

async function setSize(next: number) {
  const start = performance.now()
  size.value = next
  nodes.value = buildNodes(next)
  edges.value = buildEdges(next)
  await nextTick()
  rebuildCost.value = \`\${(performance.now() - start).toFixed(1)} ms\`
  // 固定一个可观察的缩放层级，避免大图 fitView 后缩到看不清
  await setViewport({ x: 20, y: 20, zoom: 0.6 })
  lastAction.value = \`切换到 \${next} 个节点\`
}

async function refit() {
  await setViewport({ x: 20, y: 20, zoom: 0.6 })
  lastAction.value = '已复位视口'
}

function onNodeClick({ node }: NodeMouseEvent) {
  const start = performance.now()
  lastAction.value = \`点击了「\${String(node.data?.label ?? node.id)}」\`
  clickCost.value = \`\${(performance.now() - start).toFixed(2)} ms\`
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>大图性能：视口裁剪与节点规模</h4>
      <p class="hint">
        切换节点规模，再开关注口裁剪，然后拖动或缩放画布，观察实际渲染节点数如何变化。
        容器固定高度，画布才能在有限面积内正确计算可见范围。
      </p>

      <div class="tab-bar" style="margin-top: 12px">
        <button
          v-for="item in SIZES"
          :key="item"
          class="tab-btn"
          :class="{ active: size === item }"
          @click="setSize(item)"
        >
          {{ item }} 节点
        </button>
      </div>

      <div class="controls">
        <label class="row">
          <input v-model="onlyVisible" type="checkbox">
          仅渲染可见元素
        </label>
        <button class="mini-btn" @click="refit">复位视口</button>
      </div>

      <div
        class="vf-canvas"
        style="height: 320px; border: 1px solid var(--demo-border); border-radius: 8px; overflow: hidden; background: var(--demo-surface)"
      >
        <ClientOnly>
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :fit-view-on-init="true"
            :only-render-visible-elements="onlyVisible"
            :min-zoom="0.3"
            :max-zoom="1.5"
            @node-click="onNodeClick"
          />
          <template #fallback>
            <div class="vf-fallback">流程图画布加载中…</div>
          </template>
        </ClientOnly>
      </div>

      <div class="prop-table" style="margin-top: 12px">
        <table>
          <tbody>
            <tr>
              <th>总节点数</th>
              <td>{{ size }}</td>
            </tr>
            <tr>
              <th>实际渲染节点数</th>
              <td>
                <span class="badge" :class="{ success: onlyVisible, warning: !onlyVisible }">
                  {{ renderedLabel }}
                </span>
              </td>
            </tr>
            <tr>
              <th>当前视口缩放</th>
              <td>{{ viewport.zoom.toFixed(2) }}×</td>
            </tr>
            <tr>
              <th>重建提交耗时</th>
              <td>{{ rebuildCost }}</td>
            </tr>
            <tr>
              <th>最近交互</th>
              <td>{{ lastAction }}</td>
            </tr>
            <tr>
              <th>点击处理耗时</th>
              <td>{{ clickCost }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tips-box">
        {{ responseHint }}
      </div>
    </div>
  </div>
</template>
`;export{n as default};
