const e=`<script setup lang="ts">
import { ref } from 'vue'
import { ElTransfer } from 'element-plus'

interface CourseItem {
  key: string
  label: string
  disabled: boolean
}

const courses = ref<CourseItem[]>([
  { key: 'vue', label: 'Vue3 组合式 API', disabled: false },
  { key: 'react', label: 'React Hooks 入门', disabled: false },
  { key: 'ts', label: 'TypeScript 类型体操', disabled: false },
  { key: 'node', label: 'Node.js 后端基础', disabled: false },
  { key: 'css', label: 'CSS 布局进阶', disabled: false },
  { key: 'test', label: '单元与 E2E 测试', disabled: false },
  { key: 'nuxt', label: 'Nuxt 全栈开发', disabled: false },
  { key: 'perf', label: '前端性能优化', disabled: false },
])

const selected = ref<string[]>([])

const filterMethod = (query: string, item: CourseItem) =>
  item.label.includes(query)
<\/script>

<template>
  <div class="demo-card">
    <p class="demo-kicker">课程分类管理</p>
    <h3>选择本期开设的课程</h3>

    <ElTransfer
      v-model="selected"
      :data="courses"
      :filter-method="filterMethod"
      filterable
      filter-placeholder="搜索课程名称"
      :titles="['可选课程', '已选课程']"
    />

    <p style="margin-top: 12px">
      已选 <strong>{{ selected.length }}</strong> 门课程：{{ selected.join('、') || '暂无' }}
    </p>
  </div>
</template>
`;export{e as default};
