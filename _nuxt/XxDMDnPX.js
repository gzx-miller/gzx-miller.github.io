const n=`<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Edge, FlowExportObject, Node } from '@vue-flow/core'

interface Snapshot {
  schemaVersion: number
  updatedAt: string
  nodeTypes: string[]
  flow: FlowExportObject
}

// 当前应用支持的快照结构版本，破坏性调整结构时必须递增
const SCHEMA_VERSION = 3
const FALLBACK_TYPE = 'default'

// 旧类型名 → 当前类型名；表里没有的未知类型统一降级为 default
const TYPE_MAP: Record<string, string> = {
  input: 'input',
  default: 'default',
  output: 'output',
  approval: 'default',
}

const { nodes: flowNodes, toObject, fromObject, setViewport, fitView } = useVueFlow()

const initialNodes: Node[] = [
  { id: 'order', type: 'input', position: { x: 0, y: 120 }, data: { label: '用户下单' } },
  { id: 'review', position: { x: 210, y: 120 }, data: { label: '风控审核' } },
  { id: 'ship', position: { x: 420, y: 120 }, data: { label: '仓库发货' } },
  { id: 'done', type: 'output', position: { x: 630, y: 120 }, data: { label: '买家签收' } },
]

const initialEdges: Edge[] = [
  { id: 'e1', source: 'order', target: 'review' },
  { id: 'e2', source: 'review', target: 'ship' },
  { id: 'e3', source: 'ship', target: 'done' },
]

const lastSaved = ref<Snapshot | null>(null)
const logs = ref<string[]>([
  '尚未操作：保存后可以看到导出的 nodes / edges / viewport，以及版本号与节点类型清单。',
])

const hasSnapshot = computed(() => lastSaved.value !== null)
const nodeCount = computed(() => flowNodes.value.length)
const savedTypes = computed(() => lastSaved.value?.nodeTypes ?? [])
const savedAtLabel = computed(() =>
  lastSaved.value
    ? new Date(lastSaved.value.updatedAt).toLocaleString('zh-CN', { hour12: false })
    : '尚未保存',
)
const viewportLabel = computed(() => {
  const viewport = lastSaved.value?.flow.viewport
  if (!viewport) return '尚未保存'
  return \`x=\${viewport.x.toFixed(0)} · y=\${viewport.y.toFixed(0)} · zoom=\${viewport.zoom.toFixed(2)}\`
})
const jsonPreview = computed(() => {
  if (!lastSaved.value) return '点击「保存快照」生成 JSON。'
  return truncate(JSON.stringify(lastSaved.value, null, 2), 900)
})

function truncate(text: string, limit: number) {
  return text.length > limit ? \`\${text.slice(0, limit)}\\n…（已截断）\` : text
}

function saveSnapshot() {
  const flow = toObject()
  lastSaved.value = {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    nodeTypes: [...new Set(flow.nodes.map((node) => node.type ?? 'default'))],
    flow,
  }
  logs.value = [
    \`已导出 \${flow.nodes.length} 个节点、\${flow.edges.length} 条连线，视口缩放 \${flow.viewport.zoom.toFixed(2)}。\`,
    '导出结果只保留纯数据，函数、组件实例与 DOM 引用都不应进入 node.data。',
  ]
}

function restoreSnapshot() {
  if (lastSaved.value) applySnapshot(lastSaved.value)
}

async function applySnapshot(snapshot: Snapshot) {
  if (typeof snapshot.schemaVersion !== 'number') {
    logs.value = ['快照缺少 schemaVersion，无法判断结构，已拒绝载入。']
    return
  }
  if (snapshot.schemaVersion > SCHEMA_VERSION) {
    logs.value = [
      \`快照版本 v\${snapshot.schemaVersion} 高于当前支持的 v\${SCHEMA_VERSION}，请先升级应用，已拒绝载入。\`,
    ]
    return
  }

  const flow = snapshot.flow
  if (!flow || !Array.isArray(flow.nodes) || !Array.isArray(flow.edges)) {
    logs.value = ['快照缺少 nodes / edges，结构不完整，已拒绝载入。']
    return
  }

  const notes: string[] = []
  if (snapshot.schemaVersion < SCHEMA_VERSION) {
    notes.push(\`快照为旧版本 v\${snapshot.schemaVersion}，按 v\${SCHEMA_VERSION} 结构迁移。\`)
  }

  const nodeIds = new Set(flow.nodes.map((node) => node.id))
  const nodes = flow.nodes.map((node) => {
    const original = node.type ?? 'default'
    const mapped = TYPE_MAP[original]
    if (!mapped) {
      notes.push(\`节点「\${node.id}」的 type「\${original}」未知，已降级为「\${FALLBACK_TYPE}」。\`)
      return { ...node, type: FALLBACK_TYPE }
    }
    if (mapped !== original) {
      notes.push(\`节点「\${node.id}」的 type「\${original}」已映射为「\${mapped}」。\`)
    }
    return { ...node, type: mapped }
  })

  const edges = flow.edges.filter((edge) => {
    const valid = nodeIds.has(edge.source) && nodeIds.has(edge.target)
    if (!valid) notes.push(\`连线「\${edge.id}」引用了不存在的节点，已丢弃。\`)
    return valid
  })

  try {
    const accepted = await fromObject({ nodes, edges, viewport: flow.viewport })
    if (!accepted) {
      notes.push('fromObject 返回 false，画布未接受该快照。')
      logs.value = notes
      return
    }
  } catch {
    notes.push('fromObject 解析失败，快照结构可能已损坏。')
    logs.value = notes
    return
  }

  if (flow.viewport && Number.isFinite(flow.viewport.zoom)) {
    await setViewport(flow.viewport, { duration: 200 })
    notes.push('已用 setViewport 把视口复位到保存时的位置与缩放。')
  } else {
    await fitView({ padding: 0.2, duration: 200 })
    notes.push('快照没有有效视口，改用 fitView 收拢全部节点。')
  }

  notes.push(\`恢复完成：\${nodes.length} 个节点、\${edges.length} 条连线。\`)
  logs.value = notes
}

async function loadLegacySnapshot() {
  const base = lastSaved.value?.flow ?? toObject()
  const legacyNodes = base.nodes.map((node) => {
    if (node.id === 'review') return { ...node, type: 'approval' }
    if (node.id === 'ship') return { ...node, type: 'legacy-ship' }
    return { ...node }
  })
  const snapshot: Snapshot = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    nodeTypes: [...new Set(legacyNodes.map((node) => node.type ?? 'default'))],
    flow: {
      ...base,
      nodes: legacyNodes,
      edges: base.edges.map((edge) => ({ ...edge })),
    },
  }
  lastSaved.value = snapshot
  logs.value = ['已构造一份 v2 旧快照，并注入旧类型与未知类型，准备执行校验与降级。']
  await applySnapshot(snapshot)
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>快照保存与版本化恢复</h4>
      <p class="hint">
        先把画布拖一拖、缩放一下，再保存快照；随后恢复，观察 viewport 是否回到保存时的状态。
        「载入旧版快照」会注入旧类型名与未知类型，用来演练类型映射与降级。
      </p>

      <div class="controls" style="margin-top: 12px">
        <button class="mini-btn" @click="saveSnapshot">保存快照</button>
        <button class="mini-btn" :disabled="!hasSnapshot" @click="restoreSnapshot">恢复快照</button>
        <button class="mini-btn" @click="loadLegacySnapshot">载入旧版快照</button>
      </div>

      <div
        class="vf-canvas"
        style="height: 280px; border: 1px solid var(--demo-border); border-radius: 8px; overflow: hidden; background: var(--demo-surface)"
      >
        <ClientOnly>
          <VueFlow
            :nodes="initialNodes"
            :edges="initialEdges"
            :fit-view-on-init="true"
            :min-zoom="0.4"
            :max-zoom="1.6"
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
              <th>schemaVersion</th>
              <td><span class="badge success">v{{ SCHEMA_VERSION }}</span></td>
            </tr>
            <tr>
              <th>最近保存</th>
              <td>{{ savedAtLabel }}</td>
            </tr>
            <tr>
              <th>节点类型清单</th>
              <td>
                <span
                  v-for="type in savedTypes"
                  :key="type"
                  class="badge"
                  style="margin-right: 6px"
                >{{ type }}</span>
                <span v-if="savedTypes.length === 0" class="hint">尚未保存</span>
              </td>
            </tr>
            <tr>
              <th>保存时视口</th>
              <td>{{ viewportLabel }}</td>
            </tr>
            <tr>
              <th>当前节点数</th>
              <td>{{ nodeCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mini-code" style="margin-top: 12px; max-height: 180px; overflow: auto">{{ jsonPreview }}</div>

      <div class="tips-box">
        <strong>恢复日志：</strong>
        <ul>
          <li v-for="(line, index) in logs" :key="index">{{ line }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
`;export{n as default};
