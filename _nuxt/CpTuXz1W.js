const e=`<script setup lang="ts">import { ref } from 'vue'; const runtime = ref('#c45125')<\/script>
<template><div class="demo-card property-demo"><label>运行时品牌色 <input v-model="runtime" type="color"></label><article :style="{ '--brand': runtime }"><strong>浏览器中的 CSS 变量</strong><p>Sass 负责生成变量声明，浏览器负责继承和切换。</p></article><code>--brand: #&#123;$brand&#125;;　color: var(--brand);</code><small>Sass 在自定义属性值中要求插值才能注入 Sass 值；插值会去除引号，字符串场景可用 meta.inspect 保留表示。</small></div></template>
<style scoped>.property-demo label{display:flex;gap:.6rem}.property-demo article{margin:1rem 0;padding:1rem;border-left:4px solid var(--brand);background:#fff2dc}.property-demo article strong{color:var(--brand)}.property-demo>code{font-size:.75rem}</style>
`;export{e as default};
