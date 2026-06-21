<script setup>
import { computed, ref } from 'vue'

const fileName = ref('reports/2026-summary.json')
const normalized = computed(() => fileName.value.replaceAll('\\', '/').replace(/\.\.+/g, ''))
</script>

<template><div class="demo-card"><label>相对文件名<input v-model="fileName" /></label><p>安全拼接：<code>/app/data/{{ normalized }}</code></p><pre class="mini-code"><code>resolve(dataDir, fileName)</code></pre></div></template>
