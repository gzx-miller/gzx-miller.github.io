const e=`<script setup>
import { ref } from 'vue'

const loaded = ref(false)
async function loadChart() {
  await new Promise((resolve) => setTimeout(resolve, 260))
  loaded.value = true
}
<\/script>

<template><div class="demo-card"><p><code>import('./charts.js')</code></p><button :disabled="loaded" @click="loadChart">按需加载图表模块</button><p>{{ loaded ? '模块已加载，可开始渲染' : '首屏暂不下载图表代码' }}</p></div></template>
`;export{e as default};
