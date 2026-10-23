const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

const keyword = ref('')
const courses = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  title: \`Vue3 性能课程 \${index + 1}\`,
  version: index % 3,
}))

const visibleCourses = computed(() =>
  courses.filter((course) => course.title.includes(keyword.value.trim())),
)
<\/script>

<template>
  <div class="demo-card">
    <h3>课程列表优化</h3>
    <input v-model="keyword" placeholder="过滤课程" />
    <ul class="scroll-list">
      <li v-for="course in visibleCourses" :key="course.id" v-memo="[course.version]">
        {{ course.title }}
      </li>
    </ul>
  </div>
</template>
`;export{e as default};
