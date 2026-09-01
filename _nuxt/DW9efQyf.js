const n=`<script setup lang="ts">
import { ref, shallowRef, triggerRef } from 'vue'

interface Product {
  id: number
  name: string
  stock: number
}

const products = shallowRef<Product[]>([
  { id: 1, name: '板栗拿铁', stock: 12 },
  { id: 2, name: '枫糖曲奇', stock: 8 },
  { id: 3, name: '松果蛋糕', stock: 5 },
])
const selectedId = ref(1)

function editStock() {
  const product = products.value.find((item) => item.id === selectedId.value)
  if (!product || product.stock === 0) return

  product.stock -= 1
}

function refreshView() {
  triggerRef(products)
}

function replaceCatalog() {
  products.value = products.value.map((product) => ({
    ...product,
    stock: product.stock + 10,
  }))
}
<\/script>

<template>
  <div class="demo-card inventory-demo">
    <div class="demo-heading">
      <div>
        <p class="demo-kicker">大列表更新策略</p>
        <h3>门店库存工作台</h3>
      </div>
      <span class="change-count">选择商品后批量更新</span>
    </div>

    <div class="product-list">
      <button
        v-for="product in products"
        :key="product.id"
        class="product-row"
        :class="{ selected: product.id === selectedId }"
        @click="selectedId = product.id"
      >
        <span>{{ product.name }}</span>
        <strong>库存 {{ product.stock }}</strong>
      </button>
    </div>

    <div class="button-row">
      <button @click="editStock">只修改深层数据</button>
      <button class="secondary" @click="refreshView">triggerRef 刷新视图</button>
      <button class="secondary" @click="replaceCatalog">替换整个列表</button>
    </div>

    <p class="demo-note">
      深层修改不会触发 shallowRef 更新；适合批量完成后统一刷新，或直接替换顶层值。
    </p>
  </div>
</template>

<style scoped>
.inventory-demo {
  display: grid;
  gap: 14px;
}

.demo-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.demo-heading h3,
.demo-kicker,
.demo-note {
  margin: 0;
}

.demo-kicker {
  color: #8f2f18;
  font-size: 12px;
  font-weight: 700;
}

.change-count {
  color: #7c563f;
  font-size: 13px;
}

.product-list {
  display: grid;
  gap: 6px;
}

.product-row {
  display: flex;
  justify-content: space-between;
  border-color: #efc48d;
  background: #fffaf2;
  color: #32190f;
  text-align: left;
}

.product-row:hover,
.product-row.selected {
  background: #ffe6c0;
}

.secondary {
  border-color: #b7431f;
  background: transparent;
  color: #8f2f18;
}

.secondary:hover {
  background: #ffe6c0;
}

.demo-note {
  color: #7c563f;
  font-size: 13px;
  line-height: 1.6;
}
</style>
`;export{n as default};
