<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

// 模拟 Signal 系统：signal / computed / effect
const price = ref(49)      // signal()
const qty = ref(2)          // signal()
const total = computed(() => price.value * qty.value) // computed signal

const logs = ref<string[]>([])
let logCount = 0

// 模拟 effect() — 自动追踪依赖
watchEffect(() => {
  if (logCount > 0) {
    logs.value.push(`总价变化: ¥${price.value} × ${qty.value} = ¥${total.value}`)
  }
  logCount++
})

function addQty() { qty.value++ }
function decQty() { if (qty.value > 1) qty.value-- }
function changePrice(delta: number) { price.value = Math.max(1, price.value + delta) }
</script>

<template><div class="demo-card">
  <h4>🌰 Signals 信号响应式</h4>
  <p>单价: <strong>¥{{ price }}</strong>
    <button @click="changePrice(-10)">-10</button>
    <button @click="changePrice(10)">+10</button>
  </p>
  <p>数量: <strong>{{ qty }}</strong>
    <button @click="decQty">-</button>
    <button @click="addQty">+</button>
  </p>
  <p>总价 (computed signal): <strong>¥{{ total }}</strong></p>
  <div v-if="logs.length" style="font-size:12px;color:#888;margin-top:6px">
    <p>effect() 自动追踪日志:</p>
    <div v-for="(l, i) in logs" :key="i">{{ l }}</div>
  </div>
</div></template>
