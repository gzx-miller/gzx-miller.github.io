<script setup lang="ts">
import { ref } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElTag, ElInput } from 'element-plus'

interface CourseRow {
  id: number
  name: string
  teacher: string
  price: number
  status: 'ongoing' | 'upcoming' | 'finished'
}

const searchKeyword = ref('')

const courses = ref<CourseRow[]>([
  { id: 1, name: 'Vue3 组合式 API 入门', teacher: '李老师', price: 299, status: 'ongoing' },
  { id: 2, name: 'TypeScript 类型编程', teacher: '王老师', price: 399, status: 'upcoming' },
  { id: 3, name: 'Element Plus 组件精讲', teacher: '张老师', price: 499, status: 'ongoing' },
  { id: 4, name: 'Pinia 状态管理', teacher: '李老师', price: 299, status: 'finished' },
  { id: 5, name: 'Vite 构建优化', teacher: '赵老师', price: 349, status: 'upcoming' },
  { id: 6, name: 'Vue3 响应式原理', teacher: '李老师', price: 399, status: 'finished' },
])

const filteredCourses = ref(courses.value)

function handleSearch() {
  const kw = searchKeyword.value.toLowerCase()
  filteredCourses.value = courses.value.filter(
    (c) => c.name.toLowerCase().includes(kw) || c.teacher.toLowerCase().includes(kw)
  )
}

function resetSearch() {
  searchKeyword.value = ''
  filteredCourses.value = courses.value
}

function formatStatus(status: CourseRow['status']) {
  const map: Record<CourseRow['status'], { text: string; type: 'success' | 'warning' | 'info' }> = {
    ongoing: { text: '进行中', type: 'success' },
    upcoming: { text: '即将开始', type: 'warning' },
    finished: { text: '已结束', type: 'info' },
  }
  return map[status]
}

function formatPrice(price: number) {
  return `¥${price.toFixed(2)}`
}
</script>

<template>
  <div class="demo-card">
    <h3>课程列表</h3>
    <div class="search-bar">
      <ElInput
        v-model="searchKeyword"
        placeholder="搜索课程名或讲师"
        clearable
        @input="handleSearch"
      />
      <ElButton @click="resetSearch">重置</ElButton>
    </div>

    <ElTable :data="filteredCourses" stripe row-key="id">
      <ElTableColumn prop="id" label="ID" width="70" />
      <ElTableColumn prop="name" label="课程名称" min-width="180" />
      <ElTableColumn prop="teacher" label="讲师" width="100" />
      <ElTableColumn prop="price" label="价格" width="120">
        <template #default="{ row }">
          <span class="price">{{ formatPrice(row.price) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="status" label="状态" width="100">
        <template #default="{ row }">
          <ElTag :type="formatStatus(row.status).type">
            {{ formatStatus(row.status).text }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="140">
        <template #default>
          <ElButton link type="primary" size="small">详情</ElButton>
          <ElButton link type="primary" size="small">报名</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <p class="table-tip">共 {{ filteredCourses.length }} 条记录</p>
  </div>
</template>

