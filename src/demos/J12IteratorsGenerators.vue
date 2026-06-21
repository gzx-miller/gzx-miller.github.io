<script setup>
import { ref } from 'vue'

const playlist = ['Vue 基础', '组合式 API', '路由导航', 'Pinia 状态', '性能优化']
const current = ref('')
const done = ref(false)

function* lessonGenerator(items) {
  for (const item of items) yield item
}
const gen = lessonGenerator(playlist)

function nextLesson() {
  const { value, done: isDone } = gen.next()
  if (isDone) { done.value = true; current.value = '' }
  else current.value = value
}
function reset() {
  Object.assign(gen, lessonGenerator(playlist))
  current.value = ''; done.value = false
}
</script>

<template><div class="demo-card"><p v-if="current">当前课程：{{ current }}</p><p v-else-if="done">🎉 播放列表已结束</p><p v-else>点击按钮开始播放</p><div class="button-row"><button @click="nextLesson" :disabled="done">下一课</button><button @click="reset">重置</button></div><small>生成器函数 yield 逐个产出值，调用方按需拉取。</small></div></template>
