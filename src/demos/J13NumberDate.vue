<script setup lang="ts">
import { ref } from 'vue'

const result = ref('点按钮，看看金额与日期怎么被格式化。')

function formatCurrency() {
  const amount = 1299.5
  const text = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount)
  result.value = `货币格式化：${text}（也可用 toFixed(2) 得到 ${amount.toFixed(2)}）。`
}

function formatDate() {
  const date = new Date(2026, 9, 14, 9, 30)
  const text = new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date)
  result.value = `日期格式化：${text}。`
}

function showMath() {
  result.value = `Math 取整：Math.round(2.5) = ${Math.round(2.5)}，Math.trunc(-2.7) = ${Math.trunc(-2.7)}，Math.max(1, 7, 3) = ${Math.max(1, 7, 3)}。`
}
</script>

<template>
  <div class="demo-card">
    <div class="button-row">
      <button @click="formatCurrency">格式化金额</button>
      <button @click="formatDate">格式化日期</button>
      <button @click="showMath">Math 取整</button>
    </div>
    <p>{{ result }}</p>
    <small>金额与日期交给 Intl 按地区格式化，数值计算交给 Math。</small>
  </div>
</template>
