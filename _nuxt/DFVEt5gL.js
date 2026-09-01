const e=`<script setup lang="ts">
import { ref } from 'vue'
const mode = ref<'grid' | 'flex'>('grid')
<\/script>

<template>
  <div class="demo-card tw-demo">
    <div class="toolbar"><button :class="{ active: mode === 'grid' }" @click="mode = 'grid'">Grid</button><button :class="{ active: mode === 'flex' }" @click="mode = 'flex'">Flex</button></div>
    <div class="layout" :class="mode"><aside>筛选</aside><main><article v-for="n in 4" :key="n">课程 {{ n }}</article></main></div>
    <code>{{ mode === 'grid' ? 'grid grid-cols-[12rem_minmax(0,1fr)] gap-4' : 'flex flex-wrap gap-4 [&>*]:grow' }}</code>
    <small>Flex 适合一维排列与内容驱动分配，Grid 适合二维轨道；先按布局关系选模型，再组合对齐与间距工具类。</small>
  </div>
</template>

<style scoped>
.toolbar{display:flex;gap:.4rem;margin-bottom:.8rem}.toolbar .active{background:#b95126;color:#fff}.layout{gap:.7rem}.layout.grid{display:grid;grid-template-columns:minmax(90px,1fr) 3fr}.layout.flex{display:flex;flex-wrap:wrap}.layout.flex aside{flex:1 1 120px}.layout.flex main{flex:3 1 280px}.layout aside{padding:1rem;border-radius:.6rem;background:#ead3b4}.layout main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}.layout article{padding:1rem;border-radius:.6rem;background:#fff2dc}.tw-demo>code{display:block;margin-top:.8rem;font-size:.75rem}
</style>
`;export{e as default};
