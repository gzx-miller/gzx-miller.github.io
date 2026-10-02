const e=`<script setup lang="ts">import { computed, ref } from 'vue'; const legacy = ref(5); const migrated = computed(() => 8 - legacy.value)<\/script>
<template><div class="demo-card diag-demo"><label>遗留 @import {{ legacy }} <input v-model.number="legacy" type="range" min="0" max="8"></label><div class="status"><span>待迁移 {{ legacy }}</span><span>已模块化 {{ migrated }}</span></div><pre>@warn "令牌即将重命名";
@debug meta.module-variables("tokens");
@error "不支持的主题";</pre><small>@debug 面向开发诊断，@warn 提示可继续的问题，@error 终止编译；迁移以编译器弃用警告和 Sass Migrator 为依据。</small></div></template>
<style scoped>label{display:flex;gap:.6rem}.status{display:flex;gap:.6rem;margin:1rem 0}.status span{padding:.6rem;border-radius:.5rem;background:#f7dfbd}pre{font-size:.73rem}</style>
`;export{e as default};
