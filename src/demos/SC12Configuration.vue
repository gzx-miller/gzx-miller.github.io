<script setup lang="ts">import { ref } from 'vue'; const radius = ref(12); const prefix = ref('forest')</script>
<template><div class="demo-card config-demo"><label>命名前缀 <input v-model="prefix"></label><label>圆角 {{ radius }}px <input v-model.number="radius" type="range" min="0" max="24"></label><button :style="{ borderRadius: `${radius}px` }">{{ prefix }}-button</button><pre>@use "library" with (
  $prefix: "{{ prefix }}",
  $radius: {{ radius }}px
);</pre><small>库变量以 !default 声明后可在首次 @use 时通过 with 配置；配置发生在模块加载前，不能在多个调用方反复改写。</small></div></template>
<style scoped>.config-demo{display:grid;gap:.6rem}.config-demo label{display:flex;gap:.6rem}.config-demo button{width:max-content;background:#b84c23;color:#fff}pre{font-size:.75rem}</style>
