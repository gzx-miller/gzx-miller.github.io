const e=`<script setup lang="ts">
import { reactive } from 'vue'

// 用交叉类型组合多个能力片段
interface WithId { id: number }
interface Timestamped { createdAt: Date; updatedAt: Date }
interface Publishable { published: boolean; publishDate: Date | null }

type CourseCard = WithId & Timestamped & Publishable & {
  title: string
  teacher: string
}

const card = reactive<CourseCard>({
  id: 1,
  title: 'Vue3 组合式 API',
  teacher: '松松',
  published: false,
  publishDate: null,
  createdAt: new Date('2025-09-01'),
  updatedAt: new Date('2025-09-10'),
})

// Mixin 模式：函数接收基础对象，返回叠加了新行为的对象
function withPublish<T extends object>(base: T) {
  return { ...base, publish() { /* 发布逻辑 */ } }
}

function togglePublish() {
  card.published = !card.published
  card.publishDate = card.published ? new Date() : null
  card.updatedAt = new Date()
}
<\/script>

<template>
  <div class="demo-card">
    <h4>{{ card.title }}</h4>
    <p>讲师：{{ card.teacher }} · ID {{ card.id }}</p>
    <p>状态：{{ card.published ? '已发布' : '草稿' }}</p>
    <button @click="togglePublish">{{ card.published ? '取消发布' : '发布课程' }}</button>
    <small>交叉类型 & 将多个接口合并为一个，Mixin 用函数组合行为，优于多层继承</small>
  </div>
</template>
`;export{e as default};
