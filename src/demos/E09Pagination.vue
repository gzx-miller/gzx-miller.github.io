<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElPagination, ElTag } from 'element-plus'

interface Course {
  id: number
  name: string
  teacher: string
  price: number
  status: 'ongoing' | 'upcoming' | 'finished'
}

const allCourses = ref<Course[]>([
  { id: 1, name: 'Vue3 组合式 API 入门', teacher: '李老师', price: 299, status: 'ongoing' },
  { id: 2, name: 'TypeScript 类型编程', teacher: '王老师', price: 399, status: 'upcoming' },
  { id: 3, name: 'Element Plus 组件精讲', teacher: '张老师', price: 499, status: 'ongoing' },
  { id: 4, name: 'Pinia 状态管理', teacher: '李老师', price: 299, status: 'finished' },
  { id: 5, name: 'Vite 构建优化', teacher: '赵老师', price: 349, status: 'upcoming' },
  { id: 6, name: 'Vue3 响应式原理', teacher: '李老师', price: 399, status: 'finished' },
  { id: 7, name: 'Node.js 后端开发', teacher: '陈老师', price: 599, status: 'ongoing' },
  { id: 8, name: 'React Hooks 实战', teacher: '周老师', price: 449, status: 'upcoming' },
  { id: 9, name: 'CSS 动画与过渡', teacher: '吴老师', price: 199, status: 'finished' },
  { id: 10, name: '前端安全实践', teacher: '郑老师', price: 349, status: 'ongoing' },
  { id: 11, name: 'Webpack 深入配置', teacher: '赵老师', price: 299, status: 'finished' },
  { id: 12, name: 'GraphQL 入门', teacher: '王老师', price: 399, status: 'upcoming' },
])

const currentPage = ref(1)
const pageSize = ref(5)

const pagedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return allCourses.value.slice(start, start + pageSize.value)
})

function formatStatus(status: Course['status']) {
  const map: Record<Course['status'], { text: string; type: 'success' | 'warning' | 'info' }> = {
    ongoing: { text: '进行中', type: 'success' },
    upcoming: { text: '即将开始', type: 'warning' },
    finished: { text: '已结束', type: 'info' },
  }
  return map[status]
}

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}
</script>

<template>
  <div class="demo-card">
    <h3>分页 Pagination</h3>
    <table class="course-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>课程名称</th>
          <th>讲师</th>
          <th>价格</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in pagedCourses" :key="course.id">
          <td>{{ course.id }}</td>
          <td>{{ course.name }}</td>
          <td>{{ course.teacher }}</td>
          <td class="price">¥{{ course.price }}</td>
          <td><ElTag :type="formatStatus(course.status).type" size="small">{{ formatStatus(course.status).text }}</ElTag></td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-row">
      <ElPagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 10]"
        :total="allCourses.length"
        layout="total, sizes, prev, pager, next"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

