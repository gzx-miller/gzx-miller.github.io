<script setup lang="ts">
import { computed, ref } from 'vue'

const javascriptKb = ref(280)
const imageKb = ref(420)
const budgetKb = 750
const total = computed(() => javascriptKb.value + imageKb.value)
const withinBudget = computed(() => total.value <= budgetKb)
</script>

<template>
  <div class="demo-card">
    <label>JavaScript（KB）<input v-model.number="javascriptKb" type="range" min="100" max="700" /></label>
    <label>图片（KB）<input v-model.number="imageKb" type="range" min="100" max="700" /></label>
    <p :class="withinBudget ? 'test-pass' : 'test-fail'">{{ total }} / {{ budgetKb }} KB · {{ withinBudget ? '预算内' : '超出预算' }}</p>
  </div>
</template>
