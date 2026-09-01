const o=`<script setup>
import { ref } from 'vue'

const logs = ref([])
function run() {
  logs.value = ['1. 同步任务']
  setTimeout(() => logs.value.push('4. 宏任务 setTimeout'), 0)
  Promise.resolve().then(() => logs.value.push('3. 微任务 Promise'))
  logs.value.push('2. 同步任务结束')
}
<\/script>

<template><div class="demo-card"><button @click="run">观察执行顺序</button><ol><li v-for="log in logs" :key="log">{{ log }}</li></ol></div></template>
`;export{o as default};
