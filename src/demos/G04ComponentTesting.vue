<script setup lang="ts">
import { ref } from 'vue'

const submitted = ref(false)
const assertions = ref<string[]>([])

function runInteraction() {
  submitted.value = true
  assertions.value = ['按钮可访问', '点击事件触发一次', '成功提示已出现']
}
</script>

<template>
  <div class="demo-card">
    <button @click="runInteraction">模拟用户提交</button>
    <p v-if="submitted" role="status">报名成功</p>
    <ol><li v-for="assertion in assertions" :key="assertion">✓ {{ assertion }}</li></ol>
  </div>
</template>
