<script setup lang="ts">
import { computed, ref } from 'vue'

const courseName = ref('Vue 3 实战')
const price = ref(99)
const seats = ref<number | null>(20)
const summary = computed(() => `${courseName.value} · ¥${price.value} · ${seats.value ?? '不限'}席`)
</script>

<template>
  <div class="demo-card">
    <label>课程名称<input v-model="courseName" /></label>
    <label>课程价格<input v-model.number="price" type="number" min="0" /></label>
    <p><strong>推导结果：</strong>{{ summary }}</p>
  </div>
</template>
