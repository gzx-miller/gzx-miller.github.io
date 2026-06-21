<script setup lang="ts">
import { reactive, ref } from 'vue'

interface CourseModel {
  id: number
  title: string
  teacher: string
  duration: number
  published: boolean
}

// 映射类型：将所有属性变为只读
type ReadonlyCourse = { readonly [K in keyof CourseModel]: CourseModel[K] }
// 将所有属性变为可选
type OptionalCourse = { [K in keyof CourseModel]?: CourseModel[K] }
// 键重命名：给每个属性加 get 前缀
type GetterMap = { [K in keyof CourseModel as `get${Capitalize<string & K>}`]: () => CourseModel[K] }

const form = reactive<OptionalCourse>({})
const schema = ref<keyof CourseModel>('title')

const fields: (keyof CourseModel)[] = ['id', 'title', 'teacher', 'duration', 'published']
</script>

<template>
  <div class="demo-card">
    <h4>表单 Schema 生成器</h4>
    <div v-for="field in fields" :key="field">
      <label>{{ field }}</label>
      <input v-if="field !== 'published'" v-model="form[field]" :placeholder="String(field)" />
      <input v-else type="checkbox" v-model="form[field]" />
    </div>
    <p>已填字段：{{ Object.keys(form).length }} / {{ fields.length }}</p>
    <small>映射类型 {[K in keyof T]} 遍历键生成新类型，as 可重命名键</small>
  </div>
</template>
