<script setup lang="ts">
import { ref } from 'vue'
import { MarkerType, VueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'

// 五种内置连线类型：default（贝塞尔）、straight、step、smoothstep、simplebezier
const edgeTypes = ['default', 'straight', 'step', 'smoothstep', 'simplebezier'] as const
const activeType = ref<(typeof edgeTypes)[number]>('smoothstep')

const nodes = ref<Node[]>([
  { id: 'order', type: 'input', position: { x: 0, y: 160 }, data: { label: '用户下单' } },
  { id: 'stock', position: { x: 240, y: 40 }, data: { label: '锁定库存' } },
  { id: 'coupon', position: { x: 240, y: 280 }, data: { label: '核销优惠券' } },
  { id: 'pack', position: { x: 480, y: 160 }, data: { label: '仓库打包' } },
  { id: 'ship', type: 'output', position: { x: 720, y: 160 }, data: { label: '发货' } },
])

const edges = ref<Edge[]>([
  { id: 'e1', source: 'order', target: 'stock' },
  {
    id: 'e2',
    source: 'order',
    target: 'coupon',
    label: '用了券',
    animated: true,
    markerEnd: MarkerType.ArrowClosed,
    style: { stroke: 'var(--leaf-red)', strokeWidth: 2 },
  },
  { id: 'e3', source: 'stock', target: 'pack' },
  { id: 'e4', source: 'coupon', target: 'pack' },
  { id: 'e5', source: 'pack', target: 'ship', markerEnd: MarkerType.ArrowClosed },
])
</script>

<template>
  <div class="demo-card">
    <h3>连线类型与样式</h3>
    <p>
      内置五种 path：<code>default</code>（贝塞尔）、<code>straight</code>（直线）、
      <code>step</code>（直角折线）、<code>smoothstep</code>（圆角折线）、
      <code>simplebezier</code>（简化贝塞尔）。单条边在 edge 对象上写
      <code>type</code> / <code>label</code> / <code>animated</code> /
      <code>markerEnd</code> / <code>style</code>，全局默认值则配
      <code>:default-edge-options</code>。
    </p>
    <div class="vf-toolbar">
      <button
        v-for="item in edgeTypes"
        :key="item"
        :class="{ active: activeType === item }"
        @click="activeType = item"
      >
        {{ item }}
      </button>
    </div>
    <div class="vf-canvas">
      <ClientOnly>
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :fit-view-on-init="true"
          :default-edge-options="{ type: activeType }"
        />
        <template #fallback>
          <div class="vf-fallback">流程图画布加载中…</div>
        </template>
      </ClientOnly>
    </div>
    <p class="vf-status">
      切换按钮改的是 <code>default-edge-options.type</code>，对新连线生效；
      "用了券"这条边单独设置了 <code>label</code>、<code>animated</code> 虚线动画、
      <code>markerEnd</code> 箭头和 <code>style</code> 描边样式（枫叶红）。
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

.vf-toolbar .active {
  border-color: var(--accent);
  color: var(--accent-strong);
  font-weight: 600;
}

.vf-status {
  color: var(--muted);
  font-size: 0.9em;
}
</style>
