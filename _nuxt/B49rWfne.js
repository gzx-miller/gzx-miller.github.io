const e=`<script setup>
import { ref } from 'vue'

const state = ref('尚未请求')
const delay = (label, ms) => new Promise((resolve) => setTimeout(() => resolve(label), ms))

async function loadDashboard() {
  state.value = '并发加载中…'
  const results = await Promise.all([delay('课程', 220), delay('通知', 320), delay('进度', 160)])
  state.value = \`已加载：\${results.join('、')}\`
}
<\/script>

<template><div class="demo-card"><button @click="loadDashboard">并发加载看板</button><p role="status">{{ state }}</p></div></template>
`;export{e as default};
