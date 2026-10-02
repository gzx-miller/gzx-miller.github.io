const e=`<script setup lang="ts">
import { computed, ref } from 'vue'
const radius = ref(18)
const shadow = ref(16)
const className = computed(() => \`rounded-[\${radius.value}px] shadow-[0_\${shadow.value}px_35px_rgb(120_53_15_/_0.18)]\`)
<\/script>

<template>
  <div class="demo-card tw-demo">
    <div class="controls"><label>圆角 {{ radius }}px<input v-model.number="radius" type="range" min="0" max="36"></label><label>阴影 {{ shadow }}px<input v-model.number="shadow" type="range" min="0" max="28"></label></div>
    <div class="preview" :style="{ borderRadius: \`\${radius}px\`, boxShadow: \`0 \${shadow}px 35px rgb(120 53 15 / .18)\` }">任意值用于真正的一次性约束</div>
    <code>{{ className }}</code>
    <small>方括号语法适合无法归入令牌的精确值；高频重复值应提升为 @theme 令牌，动态拼接类名也必须保持构建器可静态发现。</small>
  </div>
</template>

<style scoped>
.controls{display:flex;gap:1rem;flex-wrap:wrap}.controls label{display:grid;font-size:.82rem}.preview{margin:1rem 0;padding:1.5rem;text-align:center;background:#fff1d8;color:#7a3a20;transition:.2s}.tw-demo>code{display:block;overflow-wrap:anywhere;font-size:.75rem;color:#91421f}
</style>
`;export{e as default};
