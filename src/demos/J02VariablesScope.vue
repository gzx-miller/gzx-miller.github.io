<script setup lang="ts">
import { ref } from 'vue'

const result = ref('选择一种声明方式，观察变量的可见范围。')

function runVar() {
  if (true) {
    var inner = 'var 在块内声明'
  }
  result.value =
    typeof inner === 'string'
      ? `var 只受函数作用域约束：块外仍能读到「${inner}」。`
      : 'var 被限制在块内。'
}

function runLet() {
  let label = '外层'
  if (true) {
    let label = '块内'
    void label
  }
  result.value = `let 受块作用域约束：块外读到的仍是「${label}」，块内同名变量互不影响。`
}

function runConst() {
  const config = { theme: 'autumn' }
  config.theme = 'maple'
  result.value = `const 只锁定绑定，不冻结内容：theme 已改为「${config.theme}」。`
}
</script>

<template>
  <div class="demo-card">
    <div class="button-row">
      <button @click="runVar">var 声明</button>
      <button @click="runLet">let 声明</button>
      <button @click="runConst">const 声明</button>
    </div>
    <p>{{ result }}</p>
    <small>var 是函数作用域，let / const 是块作用域；const 锁的是绑定，不是内容。</small>
  </div>
</template>
