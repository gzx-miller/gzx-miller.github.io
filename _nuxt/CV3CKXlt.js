const t=`<script setup lang="ts">
import { reactive, ref } from 'vue'

interface Course { id: number; title: string; teacher: string; published: boolean }
type CoursePatch = Partial<Omit<Course, 'id'>>

const course = reactive<Course>({ id: 7, title: '响应式基础', teacher: '松松', published: false })
const title = ref(course.title)

function updateCourse(patch: CoursePatch) {
  Object.assign(course, patch)
}
<\/script>

<template>
  <div class="demo-card">
    <label>新标题<input v-model="title" /></label>
    <div class="button-row">
      <button @click="updateCourse({ title })">仅更新标题</button>
      <button @click="updateCourse({ published: !course.published })">切换发布状态</button>
    </div>
    <p>{{ course.title }} · {{ course.published ? '已发布' : '草稿' }}</p>
  </div>
</template>
`;export{t as default};
