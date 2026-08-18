<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position, VueFlow } from '@vue-flow/core'
import type { Edge, Node, NodeMouseEvent } from '@vue-flow/core'

type CourseData = {
  title: string
  teacher: string
  lessons: number
  stage: '基础' | '进阶'
}

type CourseNode = Node<CourseData>

const nodes = ref<CourseNode[]>([
  {
    id: 'c1',
    type: 'course',
    position: { x: 0, y: 100 },
    data: { title: '组合式 API', teacher: '小松鼠', lessons: 12, stage: '基础' },
  },
  {
    id: 'c2',
    type: 'course',
    position: { x: 280, y: 0 },
    data: { title: '组件通信', teacher: '刺猬老师', lessons: 10, stage: '基础' },
  },
  {
    id: 'c3',
    type: 'course',
    position: { x: 280, y: 200 },
    data: { title: 'Pinia 状态管理', teacher: '狐狸讲师', lessons: 8, stage: '进阶' },
  },
  {
    id: 'c4',
    type: 'course',
    position: { x: 560, y: 100 },
    data: { title: '自定义渲染器', teacher: '猫头鹰博士', lessons: 6, stage: '进阶' },
  },
])

const edges = ref<Edge[]>([
  { id: 'e1', source: 'c1', target: 'c2' },
  { id: 'e2', source: 'c1', target: 'c3' },
  { id: 'e3', source: 'c2', target: 'c4' },
  { id: 'e4', source: 'c3', target: 'c4' },
])

const selected = ref<CourseNode | null>(null)

// node-click 事件只传一个 NodeMouseEvent 对象：{ event, node }
function onNodeClick({ node }: NodeMouseEvent) {
  selected.value = node as CourseNode
}
</script>

<template>
  <div class="demo-card">
    <h3>自定义节点：课程卡片</h3>
    <p>
      节点 <code>type</code> 写成自定义名（如 <code>course</code>），再用
      <code>#node-course</code> 插槽接管渲染。插槽参数包含
      <code>id / data / selected / dragging</code> 等，业务样式与选中态都能自己画。
      卡片内部照常放 <code>&lt;Handle&gt;</code> 参与连线。
    </p>
    <div class="vf-layout">
      <div class="vf-canvas">
        <ClientOnly>
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :fit-view-on-init="true"
            @node-click="onNodeClick"
          >
            <template #node-course="courseProps">
              <div class="course-card" :class="{ selected: courseProps.selected }">
                <header>
                  <span class="stage" :class="{ advanced: courseProps.data.stage === '进阶' }">
                    {{ courseProps.data.stage }}
                  </span>
                  <strong>{{ courseProps.data.title }}</strong>
                </header>
                <p>{{ courseProps.data.teacher }} · {{ courseProps.data.lessons }} 节栗子</p>
                <Handle type="target" :position="Position.Left" />
                <Handle type="source" :position="Position.Right" />
              </div>
            </template>
          </VueFlow>
          <template #fallback>
            <div class="vf-fallback">流程图画布加载中…</div>
          </template>
        </ClientOnly>
      </div>
      <aside class="vf-detail">
        <h4>选中课程</h4>
        <template v-if="selected">
          <strong>{{ selected.data?.title ?? selected.id }}</strong>
          <p>讲师：{{ selected.data?.teacher ?? '未知' }}</p>
          <p>共 {{ selected.data?.lessons ?? 0 }} 节 · {{ selected.data?.stage ?? '未知' }}阶段</p>
        </template>
        <p v-else class="empty">点击画布中的课程卡片查看详情</p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.vf-layout {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 12px;
}

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

.course-card {
  width: 180px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 0 4px 12px rgba(98, 42, 18, 0.12);
  display: grid;
  gap: 6px;
  font-size: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.course-card.selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--leaf-gold);
}

.course-card header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.course-card p {
  margin: 0;
  color: var(--muted);
}

.stage {
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10px;
  background: var(--forest);
  color: #fff;
}

.stage.advanced {
  background: var(--leaf-red);
}

.vf-detail {
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  padding: 10px;
  font-size: 0.88em;
  display: grid;
  gap: 6px;
  align-content: start;
}

.vf-detail h4 {
  margin: 0;
}

.vf-detail .empty {
  color: var(--muted);
}

@media (max-width: 720px) {
  .vf-layout {
    grid-template-columns: 1fr;
  }
}
</style>
