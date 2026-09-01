const n=`<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'

const price = ref(39)
const count = ref(2)
const log = ref<string[]>([])
const total = computed(() => price.value * count.value)

watch(total, (value) => {
  log.value.unshift(\`订单金额变为 \${value} 元\`)
})

watchEffect(() => {
  if (count.value >= 5) {
    log.value.unshift('数量达到批量优惠门槛')
  }
})
<\/script>

<template>
  <div class="demo-card">
    <h3>购物车金额</h3>
    <label>单价 <input v-model.number="price" type="number" /></label>
    <label>数量 <input v-model.number="count" type="number" /></label>
    <strong>合计：{{ total }} 元</strong>
    <ul>
      <li v-for="item in log.slice(0, 3)" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
`;export{n as default};
