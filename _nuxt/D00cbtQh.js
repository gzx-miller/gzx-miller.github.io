const e=`<script setup lang="ts">
import { computed, ref } from 'vue'
const hue = ref(24)
const brand = computed(() => \`hsl(\${hue.value} 72% 46%)\`)
<\/script>

<template>
  <div class="demo-card tw-demo" :style="{ '--brand': brand }">
    <label>品牌色相 {{ hue }}° <input v-model.number="hue" type="range" min="0" max="60"></label>
    <div class="swatches"><span></span><span></span><span></span></div>
    <button class="brand-button">保存主题</button>
    <pre>@theme {
  --color-brand-500: {{ brand }};
  --font-display: "Noto Serif SC", serif;
}</pre>
    <small>v4 使用 @theme 把设计令牌映射为工具类；令牌命名应表达系统角色，避免把一次性数值包装成“变量”。</small>
  </div>
</template>

<style scoped>
label{display:flex;align-items:center;gap:.7rem}.swatches{display:flex;gap:.5rem;margin:.8rem 0}.swatches span{width:3rem;height:3rem;border-radius:.6rem;background:color-mix(in srgb,var(--brand),white 55%)}.swatches span:nth-child(2){background:var(--brand)}.swatches span:nth-child(3){background:color-mix(in srgb,var(--brand),black 25%)}.brand-button{background:var(--brand);color:white;border-color:transparent}pre{padding:.7rem;border-radius:.6rem;background:#2d211d;color:#ffe8cc;font-size:.75rem;white-space:pre-wrap}
</style>
`;export{e as default};
