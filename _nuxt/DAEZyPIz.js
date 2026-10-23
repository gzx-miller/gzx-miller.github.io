const n=`<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Edge, FlowExportObject, Node } from '@vue-flow/core'

const LIMIT = 20

const initialNodes: Node[] = [
  { id: 'intro', type: 'input', position: { x: 40, y: 110 }, data: { label: '课程介绍' } },
  { id: 'practice', position: { x: 260, y: 110 }, data: { label: '跟练示例' } },
  { id: 'summary', type: 'output', position: { x: 480, y: 110 }, data: { label: '本节小结' } },
]

const initialEdges: Edge[] = [
  { id: 'e1', source: 'intro', target: 'practice' },
  { id: 'e2', source: 'practice', target: 'summary' },
]

const {
  addNodes,
  toObject,
  fromObject,
  onNodeDragStart,
  onNodeDragStop,
} = useVueFlow()

const undoStack = ref<FlowExportObject[]>([])
const redoStack = ref<FlowExportObject[]>([])
const dragging = ref(false)
const message = ref('点「加节点」或直接拖动节点，再试撤销 / 重做')
const logs = ref<string[]>([])

let dragBefore: FlowExportObject | null = null
let dragStartPosition = { x: 0, y: 0 }
let nodeIndex = 0

const canUndo = computed(() => undoStack.value.length > 0)
const canRedo = computed(() => redoStack.value.length > 0)
const total = computed(() => undoStack.value.length + redoStack.value.length)
const pointer = computed(() => undoStack.value.length)

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function capture(): FlowExportObject {
  // 深拷贝后入栈，避免之后画布继续变更时把栈里的快照一起改掉
  return clone(toObject())
}

function remember(text: string) {
  logs.value = [text, ...logs.value].slice(0, 4)
  message.value = text
}

function pushBefore(before: FlowExportObject) {
  undoStack.value.push(before)
  if (undoStack.value.length > LIMIT) undoStack.value.shift()
  // 出现新操作后，原来的重做分支作废
  redoStack.value = []
}

function addNode() {
  nodeIndex += 1
  pushBefore(capture())
  addNodes([
    {
      id: \`extra-\${nodeIndex}\`,
      position: { x: 40 + ((nodeIndex - 1) % 3) * 220, y: 230 },
      data: { label: \`补充章节 \${nodeIndex}\` },
    },
  ])
  remember(\`新增「补充章节 \${nodeIndex}」，入栈 1 条变更前快照\`)
}

async function undo() {
  const before = undoStack.value.pop()
  if (!before) return
  redoStack.value.push(capture())
  await fromObject(clone(before))
  remember('撤销：恢复变更前快照，当前状态压入 redo 栈')
}

async function redo() {
  const next = redoStack.value.pop()
  if (!next) return
  undoStack.value.push(capture())
  await fromObject(clone(next))
  remember('重做：把 redo 栈顶快照重新写回画布')
}

onNodeDragStart(({ node }) => {
  dragging.value = true
  dragBefore = capture()
  dragStartPosition = { ...node.position }
  message.value = 'dragstart：只记一次变更前快照，拖动过程中不再入栈'
})

onNodeDragStop(({ node }) => {
  if (!dragBefore) return
  const moved =
    Math.abs(node.position.x - dragStartPosition.x) > 0.5 ||
    Math.abs(node.position.y - dragStartPosition.y) > 0.5

  if (moved) {
    pushBefore(dragBefore)
    remember('dragstop：整次拖拽合并为 1 条历史记录')
  } else {
    message.value = '位置没有变化，不写入历史'
  }

  dragging.value = false
  dragBefore = null
})
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>快照式撤销 / 重做</h4>
      <p class="demo-desc">
        每次变更前调用 <code>toObject()</code> 把整张图深拷贝进 undo 栈；撤销时用
        <code>fromObject()</code> 写回，并把当前状态压入 redo 栈。拖拽从
        <code>dragstart</code> 到 <code>dragstop</code> 只算一条记录。
      </p>

      <div class="controls">
        <button class="mini-btn" type="button" @click="addNode">加节点</button>
        <button class="mini-btn" type="button" :disabled="!canUndo" @click="undo">撤销</button>
        <button class="mini-btn" type="button" :disabled="!canRedo" @click="redo">重做</button>
        <span class="badge">undo {{ undoStack.length }}</span>
        <span class="badge">redo {{ redoStack.length }}</span>
        <span class="badge" :class="{ warning: dragging }">
          {{ dragging ? '拖拽中：尚未入栈' : '空闲' }}
        </span>
      </div>

      <div class="demo-panel" style="height: 320px; padding: 0; overflow: hidden">
        <ClientOnly>
          <VueFlow
            :nodes="initialNodes"
            :edges="initialEdges"
            :fit-view-on-init="true"
            :min-zoom="0.6"
            :max-zoom="1.6"
          />
          <template #fallback>
            <div class="vf-fallback">流程图画布加载中…</div>
          </template>
        </ClientOnly>
      </div>

      <div class="grid-2" style="margin-top: 12px">
        <div class="prop-table">
          <table>
            <thead>
              <tr>
                <th>指标</th>
                <th>当前值</th>
                <th>含义</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>undo 栈</td>
                <td>{{ undoStack.length }} / {{ LIMIT }}</td>
                <td>变更前的整图快照</td>
              </tr>
              <tr>
                <td>redo 栈</td>
                <td>{{ redoStack.length }}</td>
                <td>撤销后可重做的状态</td>
              </tr>
              <tr>
                <td>历史指针</td>
                <td>{{ pointer }} / {{ total }}</td>
                <td>已生效记录 / 历史总数</td>
              </tr>
              <tr>
                <td>拖拽合并</td>
                <td>{{ dragging ? '记录起点中' : '已合并' }}</td>
                <td>dragstart 记一次，dragstop 入栈</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="log-panel">
          <p v-if="!logs.length" class="hint">操作记录会出现在这里。</p>
          <p v-for="(log, index) in logs" :key="index" class="log-line">{{ log }}</p>
          <p class="hint">{{ message }}</p>
        </div>
      </div>

      <div class="tips-box">
        撤销后再做新操作，redo 栈会被清空——历史只剩一条新的前进路线，旧的重做分支无法再回来。
      </div>
    </div>
  </div>
</template>
`;export{n as default};
