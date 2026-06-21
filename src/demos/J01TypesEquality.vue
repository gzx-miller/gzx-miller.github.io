<script setup>
import { computed, ref } from 'vue'

const left = ref('0')
const right = ref(0)
const loose = computed(() => left.value == right.value)
const strict = computed(() => left.value === right.value)
</script>

<template><div class="demo-card"><p><code>'0' == 0</code>：{{ loose }}</p><p><code>'0' === 0</code>：{{ strict }}</p><small>业务判断优先使用严格相等，显式完成类型转换。</small></div></template>
