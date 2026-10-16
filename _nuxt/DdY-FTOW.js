const e=`<script setup lang="ts">
import { computed, ref } from 'vue'
const width = ref(520)
const wide = computed(() => width.value >= 448)
<\/script>

<template>
  <div class="demo-card tw-demo">
    <label>组件容器 {{ width }}px <input v-model.number="width" type="range" min="260" max="680"></label>
    <div class="container-preview" :style="{ width: \`\${width}px\` }"><article :class="{ wide }"><span>🐿️</span><div><strong>组合式函数实战</strong><p>根据自身容器而非整个视口调整布局。</p></div><button>学习</button></article></div>
    <code>@container lesson-card (width &gt;= 28rem) → @min-[28rem]:flex-row</code>
    <small>容器查询让可复用组件适应所在区域；父级需要建立查询容器，尺寸变体判断的是容器而非 viewport。</small>
  </div>
</template>

<style scoped>
label{display:flex;gap:.7rem;align-items:center;flex-wrap:wrap}.container-preview{max-width:100%;margin:.8rem 0;padding:.5rem;border:2px dashed #d69b62;border-radius:.8rem;box-sizing:border-box}.container-preview article{display:grid;gap:.5rem;padding:.9rem;border-radius:.65rem;background:#fff1d9}.container-preview article.wide{grid-template-columns:auto 1fr auto;align-items:center}.container-preview span{font-size:2rem}.container-preview p{margin:.2rem 0;color:#8e6953}.tw-demo>code{font-size:.75rem}
</style>
`;export{e as default};
