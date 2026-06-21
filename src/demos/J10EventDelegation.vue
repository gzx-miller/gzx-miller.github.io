<script setup>
import { ref } from 'vue'

const selected = ref('尚未选择')
const courses = ['JavaScript', 'Node.js', 'Vue 3']
function selectCourse(event) {
  const button = event.target.closest('button[data-course]')
  if (button) selected.value = button.dataset.course
}
</script>

<template><div class="demo-card" @click="selectCourse"><div class="button-row"><button v-for="course in courses" :key="course" :data-course="course">{{ course }}</button></div><p>已选择：{{ selected }}</p><small>父容器统一处理动态子元素事件，减少重复监听器。</small></div></template>
