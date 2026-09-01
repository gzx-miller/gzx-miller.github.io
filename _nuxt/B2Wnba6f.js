const t=`<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLearningStore } from '../stores/learning'

const store = useLearningStore()
const { courses, totalMinutes, completionRate } = storeToRefs(store)

function enrollZustand() {
  store.enroll({ id: 2, title: 'Zustand Selector', minutes: 25 })
}
<\/script>

<template><div class="demo-card"><p><strong>{{ courses.length }}</strong> 门课程 · {{ totalMinutes }} 分钟 · 完成 {{ completionRate }}%</p><ul><li v-for="course in courses" :key="course.id"><label><input type="checkbox" @change="store.toggleCompleted(course.id)" /> {{ course.title }}</label></li></ul><button @click="enrollZustand">报名 Zustand 课程</button></div></template>
`;export{t as default};
