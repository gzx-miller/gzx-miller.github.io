const t=`<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useLearningStore } from '../stores/learning'

const store = useLearningStore()
const events = ref<string[]>([])
const unsubscribe = store.$subscribe((mutation, state) => {
  events.value.unshift(\`\${mutation.type} · 当前 \${state.courses.length} 门课程\`)
})
onUnmounted(unsubscribe)

function patchCourses() {
  store.$patch((state) => {
    state.courses.push({ id: Date.now(), title: '新状态管理实践', minutes: 20 })
  })
}
<\/script>

<template><div class="demo-card"><button @click="patchCourses">批量更新并记录订阅</button><ul><li v-for="event in events" :key="event">{{ event }}</li></ul><small>$subscribe 适合持久化、审计和跨标签同步；业务副作用优先放在 action。</small></div></template>
`;export{t as default};
