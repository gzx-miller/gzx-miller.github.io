const n=`<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'

// 报销审批流：input 只出不进，output 只进不出，中间 default 双向
const nodes = ref<Node[]>([
  { id: 'submit', type: 'input', position: { x: 0, y: 160 }, data: { label: '提交报销单' } },
  { id: 'lead', position: { x: 220, y: 160 }, data: { label: '组长审批' } },
  { id: 'finance', position: { x: 440, y: 60 }, data: { label: '财务初审' } },
  { id: 'cashier', position: { x: 440, y: 260 }, data: { label: '出纳打款' } },
  { id: 'archived', type: 'output', position: { x: 660, y: 160 }, data: { label: '归档结束' } },
])

const edges = ref<Edge[]>([
  { id: 'e1', source: 'submit', target: 'lead' },
  { id: 'e2', source: 'lead', target: 'finance' },
  { id: 'e3', source: 'finance', target: 'cashier' },
  { id: 'e4', source: 'cashier', target: 'archived' },
])
<\/script>

<template>
  <div class="demo-card">
    <h3>三种内置节点类型</h3>
    <ul class="vf-legend">
      <li><span class="dot dot-input"></span><code>input</code>：只有输出连接桩，流程的起点（如"提交报销单"）。</li>
      <li><span class="dot dot-default"></span><code>default</code>（缺省值）：既有输入又有输出连接桩，流程的中间环节。</li>
      <li><span class="dot dot-output"></span><code>output</code>：只有输入连接桩，流程的终点（如"归档结束"）。</li>
    </ul>
    <p>
      类型由节点的 <code>type</code> 字段决定，不写就是 <code>default</code>。
      三种类型只是连接桩数量的差别，样式主色在 theme-default 中分别定义为蓝/黑/粉，
      本站已在 <code>src/vue-flow/theme.css</code> 中改为森林绿/栗棕/枫叶红以贴合主题。
    </p>
    <div class="vf-canvas">
      <ClientOnly>
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" :fit-view-on-init="true" />
        <template #fallback>
          <div class="vf-fallback">流程图画布加载中…</div>
        </template>
      </ClientOnly>
    </div>
    <p class="vf-status">试试从"组长审批"的右侧连接桩拖一根线到"出纳打款"。</p>
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

.vf-legend {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 1.2em;
  color: var(--muted);
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot-input {
  background: var(--forest);
}

.dot-default {
  background: var(--chestnut);
}

.dot-output {
  background: var(--leaf-red);
}

.vf-status {
  color: var(--muted);
  font-size: 0.9em;
}
</style>
`;export{n as default};
