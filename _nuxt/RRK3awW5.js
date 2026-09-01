const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

const keyword = ref('拿铁')
const orders = ['冰拿铁', '燕麦拿铁', '美式', '手冲']
const filteredOrders = computed(() => orders.filter((order) => order.includes(keyword.value)))

function clearKeyword() {
  keyword.value = ''
}
<\/script>

<template>
  <div class="demo-card">
    <h3>{{ keyword || '全部' }} 订单搜索</h3>
    <input v-model="keyword" placeholder="输入饮品名" />
    <button :disabled="!keyword" @click="clearKeyword">清空</button>
    <p v-if="filteredOrders.length">找到 {{ filteredOrders.length }} 个订单。</p>
    <p v-else>暂无匹配订单。</p>
    <ul>
      <li v-for="order in filteredOrders" :key="order">{{ order }}</li>
    </ul>
  </div>
</template>
`;export{e as default};
