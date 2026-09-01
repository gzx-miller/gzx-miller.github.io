const e=`<script setup lang="ts">import { computed, ref } from 'vue'; const width = ref(640); const stacked = computed(() => width.value < 560)<\/script>
<template><div class="demo-card media-demo"><label>预览 {{ width }}px <input v-model.number="width" type="range" min="320" max="900"></label><div class="preview" :class="{ stacked }" :style="{ width: \`\${width}px\` }"><aside>目录</aside><main>正文</main></div><pre>.layout {
  @media (width &gt;= 35rem) { grid-template-columns: 12rem 1fr; }
}</pre><small>Sass 会把嵌套媒体查询提升并合并上下文；响应式 Mixin 应服务统一断点策略，避免隐藏大量难以追踪的媒体规则。</small></div></template>
<style scoped>label{display:flex;gap:.6rem}.preview{display:grid;grid-template-columns:120px 1fr;gap:.5rem;max-width:100%;margin:1rem 0}.preview.stacked{grid-template-columns:1fr}.preview>*{padding:.8rem;border-radius:.5rem;background:#f7dfbf}pre{font-size:.73rem}</style>
`;export{e as default};
