const e=`<script setup lang="ts">
import { computed, ref } from 'vue'
const selected = ref('warning')
const levels = { success:'#397a45', warning:'#d17b24', danger:'#b93f35' }
const color = computed(() => levels[selected.value as keyof typeof levels])
<\/script>
<template><div class="demo-card sass-demo"><div class="choices"><button v-for="(_,name) in levels" :key="name" @click="selected = name">{{ name }}</button></div><div class="alert" :style="{ borderColor: color, color }">{{ selected }}：集合驱动的状态样式</div><code>map.get($status-colors, {{ selected }}) → {{ color }}</code><small>Map 适合键值令牌，List 适合有序序列；使用 sass:map 与 sass:list API，避免依赖旧式全局函数。</small></div></template>
<style scoped>.choices{display:flex;gap:.4rem;flex-wrap:wrap}.alert{margin:1rem 0;padding:.8rem;border:2px solid;border-radius:.6rem;background:#fffaf2}.sass-demo>code{font-size:.76rem}</style>
`;export{e as default};
