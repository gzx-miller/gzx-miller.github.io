<script setup lang="ts">import { ref } from 'vue'; const escape = ref(true)</script>
<template><div class="demo-card root-demo"><label><input v-model="escape" type="checkbox">使用 @at-root 跳出嵌套</label><div class="selector"><code>{{ escape ? '.theme-dark .widget' : '.dashboard .panel .theme-dark .widget' }}</code></div><pre>.dashboard .panel {
  @at-root .theme-dark .widget { ... }
}</pre><small>@at-root 把规则移出当前嵌套，可通过 with/without 控制保留哪些 at-rule；它是处理生成器上下文的工具，不是修补过深嵌套的常规手段。</small></div></template>
<style scoped>.root-demo{display:grid;gap:.7rem}.selector{padding:1rem;border-radius:.6rem;background:#fff0d8;overflow-wrap:anywhere}pre{font-size:.75rem}</style>
