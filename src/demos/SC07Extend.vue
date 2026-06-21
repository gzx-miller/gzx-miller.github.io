<script setup lang="ts">
import { ref } from 'vue'
const kind = ref<'info'|'success'|'danger'>('info')
</script>
<template><div class="demo-card sass-demo"><div class="choices"><button v-for="item in ['info','success','danger']" :key="item" @click="kind = item as typeof kind">{{ item }}</button></div><div class="notice" :class="kind">%notice-base + .notice-{{ kind }}</div><pre>%notice-base { padding: .75rem; border-radius: .5rem; }
.notice-info { @extend %notice-base; }</pre><small>占位选择器只有被 @extend 时才输出；扩展会合并选择器，适合语义明确的同类规则，不适合跨模块的大范围组合。</small></div></template>
<style scoped>.choices{display:flex;gap:.4rem}.notice{margin:1rem 0;padding:.75rem;border-radius:.5rem}.info{background:#e5f0fb;color:#225b88}.success{background:#e6f3e6;color:#286237}.danger{background:#fae7e3;color:#8d3329}pre{font-size:.74rem;white-space:pre-wrap}</style>
