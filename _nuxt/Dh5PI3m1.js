const t=`<script setup lang="ts">
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
<\/script>

<template>
  <div class="demo-card">
    <h3>课程购物车</h3>
    <ul>
      <li v-for="item in cart.items" :key="item.id">
        {{ item.name }} x {{ item.count }}
      </li>
    </ul>
    <strong>总价：{{ cart.total }} 元</strong>
    <button @click="cart.addCourse">再买一份课程</button>
  </div>
</template>
`;export{t as default};
