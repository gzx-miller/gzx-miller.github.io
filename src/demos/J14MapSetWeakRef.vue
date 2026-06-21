<script setup>
import { ref, computed } from 'vue'

const allTags = ['Vue', 'React', 'TypeScript', 'Node.js', 'CSS']
const selected = ref(new Set())
const tagCount = ref(new Map(allTags.map((t) => [t, 0])))

function toggle(tag) {
  const next = new Set(selected.value)
  if (next.has(tag)) next.delete(tag)
  else next.add(tag)
  selected.value = next
}

const courses = [
  { title: 'Vue3 组合式 API', tags: ['Vue', 'TypeScript'] },
  { title: 'React Hooks 入门', tags: ['React'] },
  { title: 'Node 服务端开发', tags: ['Node.js', 'TypeScript'] },
  { title: 'CSS 动画进阶', tags: ['CSS'] },
]

const filtered = computed(() =>
  selected.value.size === 0
    ? courses
    : courses.filter((c) => c.tags.some((t) => selected.value.has(t))),
)
</script>

<template><div class="demo-card"><div class="tag-row"><button v-for="tag in allTags" :key="tag" :class="{ active: selected.has(tag) }" @click="toggle(tag)">{{ tag }}</button></div><p v-if="selected.size">已选标签：{{ [...selected].join('、') }}</p><ul><li v-for="c in filtered" :key="c.title">{{ c.title }}<span class="tags">{{ c.tags.join(', ') }}</span></li></ul><small>Set 自动去重，Map 支持任意类型键值对。</small></div></template>
