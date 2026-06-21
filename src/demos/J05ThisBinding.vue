<script setup>
import { ref } from 'vue'

const message = ref('等待调用')
const teacher = {
  name: '松松',
  introduce() { return `讲师：${this.name}` },
}

function runMethod() { message.value = teacher.introduce() }
function runDetached() {
  const detached = teacher.introduce
  message.value = detached.call({ name: '临时讲师' })
}
</script>

<template><div class="demo-card"><div class="button-row"><button @click="runMethod">作为方法调用</button><button @click="runDetached">显式绑定调用</button></div><p>{{ message }}</p></div></template>
