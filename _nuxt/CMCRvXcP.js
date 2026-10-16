const e=`<script setup lang="ts">import { ref } from 'vue'; const lines = ref(3)<\/script>
<template><div class="demo-card utility-demo"><label>截断行数 {{ lines }} <input v-model.number="lines" type="range" min="1" max="5"></label><p :style="{ WebkitLineClamp: lines }">自定义工具应表达能跨组件复用的单一能力。这个长段落演示多行截断，并说明自定义工具仍可配合 hover、响应式等变体使用。</p><pre>@utility line-clamp-* {
  -webkit-line-clamp: --value(integer);
}</pre><small>v4 用 @utility 注册可参与变体的自定义工具；组件样式放 @layer components，基础默认值放 @layer base。</small></div></template>
<style scoped>label{display:flex;gap:.6rem}.utility-demo p{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;padding:.8rem;background:#fff0d7;border-radius:.6rem;line-height:1.6}pre{font-size:.75rem}</style>
`;export{e as default};
