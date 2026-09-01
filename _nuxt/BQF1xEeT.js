const a=`<script setup lang="ts">
import { ref } from 'vue'
const active = ref(false)
<\/script>
<template><div class="demo-card sass-demo"><button class="lesson-card" :class="{ active }" @click="active = !active"><span>🌰</span><strong>父选择器 &amp;</strong><small>{{ active ? '已选中' : '点击选中' }}</small></button><pre>.lesson-card {
  &amp;:hover { ... }
  &amp;--featured { ... }
  [dir="rtl"] &amp; { ... }
}</pre><small>&amp; 代表当前复合选择器，可生成伪类、BEM 后缀或上下文规则；插值适合生成名称，但过度动态化会降低可搜索性。</small></div></template>
<style scoped>.lesson-card{display:grid;grid-template-columns:auto 1fr;gap:.2rem .7rem;width:100%;margin-bottom:.8rem;padding:1rem;text-align:left;background:#fff1d8}.lesson-card span{grid-row:span 2}.lesson-card.active{outline:3px solid #c65b2d;background:#ffe4ba}.lesson-card small{color:#8a6049}pre{font-size:.76rem}</style>
`;export{a as default};
