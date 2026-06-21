<script setup>
import { ref } from 'vue'

const results = ref([])
function runTests() {
  const add = (a, b) => a + b
  results.value = [
    { name: '正常相加', pass: add(2, 3) === 5 },
    { name: '负数相加', pass: add(-2, 1) === -1 },
  ]
}
</script>

<template><div class="demo-card"><button @click="runTests">运行 node:test 用例</button><ul><li v-for="result in results" :key="result.name">{{ result.pass ? '✓' : '×' }} {{ result.name }}</li></ul><pre class="mini-code"><code>test('adds values', () =&gt; assert.equal(add(2, 3), 5))</code></pre></div></template>
