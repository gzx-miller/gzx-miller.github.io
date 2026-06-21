<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

interface Enrollment { courseId: number; note: string }
const form = ref<Enrollment>({ courseId: 101, note: '' })
const noteInput = useTemplateRef<HTMLInputElement>('noteInput')

function focusNote() {
  noteInput.value?.focus()
}
</script>

<template>
  <div class="demo-card">
    <label>报名备注<input ref="noteInput" v-model="form.note" placeholder="希望重点学习…" /></label>
    <button @click="focusNote">聚焦备注输入框</button>
    <p>课程编号 {{ form.courseId }} · {{ form.note || '暂无备注' }}</p>
  </div>
</template>
