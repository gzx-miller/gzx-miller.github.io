const n=`<script setup>
import { ref } from 'vue'

const result = ref('点击按钮查看计算结果')
const price = 200

// 柯里化：每次只接收一个参数
const applyDiscount = (rate) => (price) => price * (1 - rate)
const addTax = (rate) => (price) => price * (1 + rate)
const formatPrice = (price) => \`¥\${price.toFixed(2)}\`

// 函数组合：pipe 从左到右依次执行
const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x)

function calculate() {
  const finalPrice = pipe(applyDiscount(0.2), addTax(0.06), formatPrice)(price)
  result.value = \`原价 ¥\${price} → 打八折 → 加6%税 → \${finalPrice}\`
}

// 防抖演示
let timer = null
const debounceLog = ref('')
function onInput(e) {
  clearTimeout(timer)
  timer = setTimeout(() => { debounceLog.value = \`搜索结果：\${e.target.value}\` }, 300)
}
<\/script>

<template><div class="demo-card">
  <button @click="calculate">计算课程价格</button>
  <p>{{ result }}</p>
  <input placeholder="输入搜索（防抖300ms）" @input="onInput" />
  <p>{{ debounceLog }}</p>
  <small>高阶函数接收或返回函数；柯里化将多参函数拆为单参链；pipe 组合多步操作。</small>
</div></template>
`;export{n as default};
