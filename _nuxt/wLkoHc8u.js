const e=`<script setup lang="ts">
import { computed, ref } from 'vue'
const steps = ref(4)
const spacing = computed(() => steps.value * 4)
<\/script>
<template><div class="demo-card sass-demo"><label>间距步数 {{ steps }} <input v-model.number="steps" type="range" min="1" max="10"></label><div class="spacing-preview" :style="{ gap: \`\${spacing}px\` }"><i v-for="n in 4" :key="n"></i></div><code>@function space($step) { @return $step * 0.25rem; } → {{ spacing }}px</code><small>函数用于返回计算值，Mixin 用于输出声明；现代 Sass 的内置函数优先通过 sass:math、sass:color 等模块调用。</small></div></template>
<style scoped>.spacing-preview{display:flex;margin:1rem 0}.spacing-preview i{width:2rem;height:2rem;border-radius:.4rem;background:#cf6738}.sass-demo>code{font-size:.76rem}</style>
`;export{e as default};
