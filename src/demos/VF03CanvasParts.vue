<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background, BackgroundVariant } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { useTheme } from '../composables/useTheme'
import type { Edge, Node } from '@vue-flow/core'

const { isDark } = useTheme()

// 网格配色跟随站点主题：浅色用暖棕点阵，深色用暗金点阵
const patternColor = computed(() => (isDark.value ? '#6b5238' : '#d9a05f'))

// 本版本 BackgroundVariant 只提供 Dots / Lines（Cross 已移除），字符串值同样可用
const variants = [
  { label: '圆点', value: BackgroundVariant.Dots },
  { label: '网格线', value: BackgroundVariant.Lines },
] as const
const activeVariant = ref<(typeof variants)[number]['value']>(BackgroundVariant.Dots)

// 小地图节点配色函数：按节点 data.color 上色，未设置时用暖橙
function miniMapNodeColor(node: Node): string {
  return typeof node.data?.color === 'string' ? node.data.color : '#f08a24'
}

const nodes = ref<Node[]>([
  { id: 'collect', type: 'input', position: { x: 0, y: 140 }, data: { label: '收集需求' } },
  { id: 'design', position: { x: 200, y: 40 }, data: { label: '视觉设计', color: '#d94b26' } },
  { id: 'frontend', position: { x: 200, y: 240 }, data: { label: '前端开发', color: '#4b6d33' } },
  { id: 'review', position: { x: 420, y: 140 }, data: { label: '验收联调' } },
  { id: 'release', type: 'output', position: { x: 620, y: 140 }, data: { label: '发布上线' } },
])

const edges = ref<Edge[]>([
  { id: 'e1', source: 'collect', target: 'design' },
  { id: 'e2', source: 'collect', target: 'frontend' },
  { id: 'e3', source: 'design', target: 'review' },
  { id: 'e4', source: 'frontend', target: 'review' },
  { id: 'e5', source: 'review', target: 'release' },
])
</script>

<template>
  <div class="demo-card">
    <h3>三件套附加组件</h3>
    <p>
      这三个组件来自独立的小包，按需安装：<code>@vue-flow/background</code>（背景网格）、
      <code>@vue-flow/controls</code>（缩放控制条）、<code>@vue-flow/minimap</code>（小地图）。
      控制条和小地图需要各自引入 <code>dist/style.css</code>（本站已统一在
      <code>src/vue-flow/styles.ts</code> 中处理）。
    </p>
    <div class="vf-toolbar">
      <button
        v-for="item in variants"
        :key="item.value"
        :class="{ active: activeVariant === item.value }"
        @click="activeVariant = item.value"
      >
        {{ item.label }}
      </button>
      <span class="vf-tip">右上角是 Controls，右下角是 MiniMap（可拖动/缩放）</span>
    </div>
    <div class="vf-canvas">
      <ClientOnly>
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" :fit-view-on-init="true">
          <Background
            :variant="activeVariant"
            :pattern-color="patternColor"
            :gap="24"
            :size="1.6"
          />
          <Controls position="top-right" />
          <MiniMap
            position="bottom-right"
            :node-color="miniMapNodeColor"
            mask-color="rgba(120, 80, 40, 0.18)"
            pannable
            zoomable
          />
        </VueFlow>
        <template #fallback>
          <div class="vf-fallback">流程图画布加载中…</div>
        </template>
      </ClientOnly>
    </div>
    <p class="vf-status">
      背景网格颜色 <code>pattern-color</code> 绑定了 <code>useTheme()</code> 的计算属性，
      切换站点深浅主题时网格会同步换色——这就是双主题画布的关键做法之一。
    </p>
  </div>
</template>

<style scoped>
.vf-canvas {
  height: 380px;
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
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.vf-toolbar .active {
  border-color: var(--accent);
  color: var(--accent-strong);
  font-weight: 600;
}

.vf-tip {
  color: var(--muted);
  font-size: 0.85em;
}

.vf-status {
  color: var(--muted);
  font-size: 0.9em;
}
</style>
