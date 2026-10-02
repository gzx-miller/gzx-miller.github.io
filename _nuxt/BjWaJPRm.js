const e=`<script setup lang="ts">
import { ref } from 'vue'
const namespace = ref(true)
<\/script>
<template><div class="demo-card sass-demo"><button @click="namespace = !namespace">{{ namespace ? '使用命名空间' : '全局展开（谨慎）' }}</button><div class="module-flow"><code>_tokens.scss</code><span>→ @use →</span><code>card.scss</code><span>→ CSS</span></div><pre>{{ namespace ? '@use "tokens";\\ncolor: tokens.$brand;' : '@use "tokens" as *;\\ncolor: $brand;' }}</pre><small>@use 每个模块只加载一次且成员默认带命名空间；私有成员以 - 或 _ 开头，不暴露给使用方。</small></div></template>
<style scoped>.module-flow{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin:1rem 0}.module-flow code{padding:.55rem;border-radius:.45rem;background:#f8dfbd}.module-flow span{color:#a4532e}pre{padding:.7rem;background:#2b211e;color:#ffe4c2;border-radius:.5rem}</style>
`;export{e as default};
