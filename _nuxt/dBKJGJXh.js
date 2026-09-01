const n=`<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)
const seconds = ref(0)
let timer: number | undefined

onMounted(() => {
  inputRef.value?.focus()
  timer = window.setInterval(() => {
    seconds.value += 1
  }, 1000)
})

onUnmounted(() => {
  window.clearInterval(timer)
})
<\/script>

<template>
  <div class="demo-card">
    <h3>自动聚焦计时器</h3>
    <input ref="inputRef" placeholder="页面挂载后自动聚焦" />
    <p>已停留 {{ seconds }} 秒</p>
  </div>
</template>
`;export{n as default};
