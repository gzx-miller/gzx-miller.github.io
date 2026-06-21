<script setup lang="ts">
import { ref } from 'vue'

// 条件类型：根据 T 的形状提取成功 / 失败数据
interface ApiSuccess<T> { ok: true; data: T }
interface ApiError { ok: false; error: string }
type ApiResponse<T> = ApiSuccess<T> | ApiError

// 用 infer 从联合响应中提取成功数据类型
type UnwrapSuccess<R> = R extends ApiSuccess<infer D> ? D : never

interface Course { id: number; title: string }

const response = ref<ApiResponse<Course[]>>({
  ok: true,
  data: [{ id: 1, title: '条件类型入门' }, { id: 2, title: 'infer 关键字' }],
})

const display = ref('点击加载课程')

function handleResponse() {
  const res = response.value
  display.value = res.ok
    ? `共 ${res.data.length} 门课程：${res.data.map(c => c.title).join('、')}`
    : `加载失败：${res.error}`
}

function simulateError() {
  response.value = { ok: false, error: '网络超时' }
  display.value = '点击加载课程'
}
</script>

<template>
  <div class="demo-card">
    <button @click="handleResponse">解析响应</button>
    <button @click="simulateError">模拟错误</button>
    <p>{{ display }}</p>
    <small>条件类型 T extends U ? X : Y 在类型层面做分支判断，infer 可提取嵌套类型</small>
  </div>
</template>
