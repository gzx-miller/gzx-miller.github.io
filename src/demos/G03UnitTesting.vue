<script setup lang="ts">
import { computed, ref } from 'vue'

const price = ref(100)
const rate = ref(0.8)
const expected = ref(80)
const actual = computed(() => Number((price.value * rate.value).toFixed(2)))
const passed = computed(() => actual.value === expected.value)
</script>

<template>
  <div class="demo-card">
    <label>原价<input v-model.number="price" type="number" /></label>
    <label>预期结果<input v-model.number="expected" type="number" /></label>
    <p :class="passed ? 'test-pass' : 'test-fail'">{{ passed ? '✓ 测试通过' : `× 实际得到 ${actual}` }}</p>
  </div>
</template>
