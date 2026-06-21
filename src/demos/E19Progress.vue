<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElProgress, ElButton } from 'element-plus'

const overall = ref(35)

interface CourseProgress {
  name: string
  percent: number
  color: string
}

const courses = ref<CourseProgress[]>([
  { name: 'Vue3 组合式 API', percent: 80, color: '#67c23a' },
  { name: 'TypeScript 类型体操', percent: 55, color: '#e6a23c' },
  { name: 'Nuxt 全栈开发', percent: 20, color: '#409eff' },
  { name: '前端性能优化', percent: 0, color: '#f56c6c' },
])

const avgPercent = computed(() =>
  Math.round(courses.value.reduce((sum, c) => sum + c.percent, 0) / courses.value.length),
)

function simulateStudy() {
  courses.value.forEach(c => {
    c.percent = Math.min(c.percent + Math.floor(Math.random() * 15 + 5), 100)
  })
  overall.value = avgPercent.value
}

function resetAll() {
  courses.value.forEach(c => { c.percent = 0 })
  overall.value = 0
}
</script>

<template>
  <div class="demo-card">
    <p class="demo-kicker">学习数据看板</p>
    <h3>课程完成进度</h3>

    <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 16px">
      <ElProgress type="dashboard" :percentage="overall" :width="100" />
      <div>
        <p style="margin: 0">总体完成度</p>
        <strong style="font-size: 1.5em">{{ overall }}%</strong>
      </div>
    </div>

    <div v-for="c in courses" :key="c.name" style="margin-bottom: 8px">
      <p style="margin: 0 0 4px">{{ c.name }}</p>
      <ElProgress :percentage="c.percent" :color="c.color" :stroke-width="14" />
    </div>

    <div class="button-row" style="margin-top: 12px">
      <ElButton type="primary" @click="simulateStudy">模拟学习推进</ElButton>
      <ElButton @click="resetAll">重置进度</ElButton>
    </div>
  </div>
</template>
