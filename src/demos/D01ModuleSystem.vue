<script setup>
import { computed, ref } from 'vue'

const format = ref('esm')
const snippet = computed(() => format.value === 'esm'
  ? "import { readFile } from 'node:fs/promises'\nexport async function load() {}"
  : "const { readFile } = require('node:fs/promises')\nmodule.exports = { load }")
</script>

<template><div class="demo-card"><label>模块格式<select v-model="format"><option value="esm">ES Modules</option><option value="cjs">CommonJS</option></select></label><pre class="mini-code"><code>{{ snippet }}</code></pre></div></template>
