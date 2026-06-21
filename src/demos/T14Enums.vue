<script setup lang="ts">
import { ref, computed } from 'vue'

// 数字枚举：自动递增，支持反向映射
enum CourseStatus {
  Draft = 0,
  Review = 1,
  Published = 2,
  Archived = 3,
}

// 字符串枚举：无反向映射，值更明确
enum CourseLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

const status = ref<CourseStatus>(CourseStatus.Draft)
const level = ref<CourseLevel>(CourseLevel.Beginner)

// 枚举遍历（数字枚举支持反向映射）
const allStatuses = Object.entries(CourseStatus)
  .filter(([key]) => isNaN(Number(key)))
  .map(([label, value]) => ({ label, value: value as CourseStatus }))

const statusLabel = computed(() => CourseStatus[status.value])

function advance() {
  if (status.value < CourseStatus.Archived) {
    status.value++
  }
}

function reset() {
  status.value = CourseStatus.Draft
}
</script>

<template>
  <div class="demo-card">
    <h4>课程状态工作流</h4>
    <p>当前状态：{{ statusLabel }}（{{ status }}）</p>
    <p>难度：<select v-model="level">
      <option :value="CourseLevel.Beginner">入门</option>
      <option :value="CourseLevel.Intermediate">进阶</option>
      <option :value="CourseLevel.Advanced">高级</option>
    </select>（{{ level }}）</p>
    <div class="button-row">
      <button @click="advance" :disabled="status === CourseStatus.Archived">推进一步</button>
      <button @click="reset">重置为草稿</button>
    </div>
    <p>所有状态：{{ allStatuses.map(s => s.label).join(' → ') }}</p>
    <small>数字枚举支持反向映射和遍历，字符串枚举更明确；联合类型是轻量替代方案</small>
  </div>
</template>
