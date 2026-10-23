const e=`<script setup lang="ts">
import { computed, ref } from 'vue'
const width = ref(720)
const columns = computed(() => width.value >= 768 ? 3 : width.value >= 480 ? 2 : 1)
<\/script>

<template>
  <div class="demo-card tw-demo">
    <label>预览容器 {{ width }}px <input v-model.number="width" type="range" min="320" max="960" step="16"></label>
    <div class="viewport" :style="{ width: \`\${Math.min(width, 760)}px\` }">
      <div class="lesson-grid" :style="{ gridTemplateColumns: \`repeat(\${columns}, 1fr)\` }">
        <article v-for="name in ['模板语法','响应式','组件通信']" :key="name"><span>🌰</span><strong>{{ name }}</strong></article>
      </div>
    </div>
    <p class="readout">当前效果：<code>grid-cols-1 {{ width >= 480 ? 'sm:grid-cols-2' : '' }} {{ width >= 768 ? 'md:grid-cols-3' : '' }}</code></p>
    <small>Tailwind 断点是移动优先：无前缀规则先应用，断点变体只在该最小宽度以上覆盖。</small>
  </div>
</template>

<style scoped>
label{display:flex;gap:.7rem;align-items:center;flex-wrap:wrap}.viewport{max-width:100%;margin:.8rem 0;padding:.65rem;border:2px dashed #e0a45f;border-radius:.8rem;transition:width .2s}.lesson-grid{display:grid;gap:.6rem}.lesson-grid article{display:grid;place-items:center;gap:.25rem;min-height:88px;border-radius:.7rem;background:#fff0d6;color:#713b25}.readout{font-size:.83rem}.readout code{overflow-wrap:anywhere}
</style>
`;export{e as default};
