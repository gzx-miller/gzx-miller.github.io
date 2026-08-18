<script setup lang="ts">
import { computed, ref } from 'vue'
import { Panel, PanelPosition, VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { useTheme } from '../composables/useTheme'
import type { Edge, Node } from '@vue-flow/core'

// 组织架构图：只读展示模式 + 双主题联动
const readonly = ref(true)
const { theme, isDark, toggleTheme } = useTheme()

const modeLabel = computed(() => (readonly.value ? '只读展示' : '编辑模式'))

const patternColor = computed(() => (isDark.value ? '#6b5238' : '#d9a05f'))

const nodes = ref<Node[]>([
  { id: 'ceo', type: 'input', position: { x: 240, y: 0 }, data: { label: '园长 · 松果董事长' } },
  { id: 'dev', position: { x: 80, y: 140 }, data: { label: '前端组' } },
  { id: 'design', position: { x: 400, y: 140 }, data: { label: '设计组' } },
  { id: 'vue', position: { x: 0, y: 280 }, data: { label: 'Vue 小队' } },
  { id: 'react', position: { x: 160, y: 280 }, data: { label: 'React 小队' } },
  { id: 'ui', position: { x: 330, y: 280 }, data: { label: 'UI 小队' } },
  { id: 'illu', position: { x: 490, y: 280 }, data: { label: '插画小队' } },
])

const edges = ref<Edge[]>([
  { id: 'e1', source: 'ceo', target: 'dev' },
  { id: 'e2', source: 'ceo', target: 'design' },
  { id: 'e3', source: 'dev', target: 'vue', type: 'smoothstep' },
  { id: 'e4', source: 'dev', target: 'react', type: 'smoothstep' },
  { id: 'e5', source: 'design', target: 'ui', type: 'smoothstep' },
  { id: 'e6', source: 'design', target: 'illu', type: 'smoothstep' },
])
</script>

<template>
  <div class="demo-card">
    <h3>只读模式与双主题适配</h3>
    <p>
      展示型场景（组织架构、架构图）应关闭编辑能力：<code>nodes-draggable、
      nodes-connectable、edges-updatable、pane-movable</code> 等开关按需组合。
      双主题则靠 <code>src/vue-flow/theme.css</code> 把官方配色映射到站点 CSS 变量，
      再叠加 <code>&lt;html data-theme&gt;</code> 选择器——点下面按钮实时切换观察。
    </p>
    <div class="vf-toolbar">
      <button @click="readonly = !readonly">
        切换模式：{{ modeLabel }}
      </button>
      <button @click="toggleTheme">
        切换主题：当前{{ theme === 'light' ? '浅色 🍂' : '深色 🌙' }}
      </button>
    </div>
    <div class="vf-canvas">
      <ClientOnly>
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :fit-view-on-init="true"
          :nodes-draggable="!readonly"
          :nodes-connectable="!readonly"
          :edges-updatable="!readonly"
          :pane-movable="!readonly"
        >
          <Background variant="dots" :pattern-color="patternColor" :gap="22" />
          <Panel :position="PanelPosition.TopLeft" class="vf-mode-panel">
            {{ modeLabel }} · {{ theme === 'light' ? '秋日暖阳' : '夜森林' }}
          </Panel>
        </VueFlow>
        <template #fallback>
          <div class="vf-fallback">流程图画布加载中…</div>
        </template>
      </ClientOnly>
    </div>
    <p class="vf-status">
      Panel 是官方提供的画布内浮层组件（core 包自带），适合放模式徽标、图例或操作按钮。
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

.vf-toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.vf-mode-panel {
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--muted);
  font-size: 12px;
}

.vf-status {
  color: var(--muted);
  font-size: 0.9em;
}
</style>
