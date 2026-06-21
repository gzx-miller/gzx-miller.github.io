<script setup>
import { ref } from 'vue'

function createCartCounter(initial = 0) {
  let count = initial
  return () => ++count
}

const nextCount = createCartCounter()
const count = ref(0)
</script>

<template><div class="demo-card"><p>购物车数量：<strong>{{ count }}</strong></p><button @click="count = nextCount()">加入一件商品</button><small>返回的函数持续访问创建时的词法环境，这就是闭包。</small></div></template>
