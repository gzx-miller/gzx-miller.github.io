const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type OrderStatus = 'pending' | 'paid' | 'shipped'
const status = ref<OrderStatus>('pending')
const statusText = computed(() => ({ pending: '待付款', paid: '待发货', shipped: '运输中' })[status.value])

function advance() {
  status.value = status.value === 'pending' ? 'paid' : status.value === 'paid' ? 'shipped' : 'pending'
}
<\/script>

<template>
  <div class="demo-card">
    <p>订单状态：<strong>{{ statusText }}</strong></p>
    <button @click="advance">流转到下一状态</button>
    <small>联合类型让非法状态无法进入业务逻辑。</small>
  </div>
</template>
`;export{n as default};
