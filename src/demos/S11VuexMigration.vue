<script setup lang="ts">
import { ref, computed } from 'vue'

const pattern = ref<'vuex' | 'pinia'>('vuex')
const cartCount = ref(0)

const vuexCode = `// Vuex 模块
const store = {
  state: () => ({ items: [], count: 0 }),
  mutations: {
    ADD_ITEM(s, item) {
      s.items.push(item); s.count++
    }
  },
  actions: {
    async addItem({ commit }, item) {
      commit('ADD_ITEM', item)
    }
  }
}
// 使用: dispatch('addItem', course)`

const piniaCode = `// Pinia Store
const useCart = defineStore('cart', () => {
  const items = ref([])
  const count = ref(0)
  function addItem(item) {
    items.value.push(item)
    count.value++          // 直接修改！
  }
  return { items, count, addItem }
})
// 使用: cart.addItem(course)`

function addItem() {
  cartCount.value++
}
function reset() {
  cartCount.value = 0
}
</script>

<template><div class="demo-card">
  <h4>🌰 Vuex 到 Pinia 迁移</h4>
  <div style="margin-bottom:8px">
    <button @click="pattern = 'vuex'" :class="{ active: pattern === 'vuex' }">Vuex 模式</button>
    <button @click="pattern = 'pinia'" :class="{ active: pattern === 'pinia' }">Pinia 模式</button>
  </div>
  <pre class="mini-code"><code>{{ pattern === 'vuex' ? vuexCode : piniaCode }}</code></pre>
  <p>购物车数量: <strong>{{ cartCount }}</strong></p>
  <button @click="addItem">{{ pattern === 'vuex' ? "dispatch('addItem')" : 'cart.addItem()' }}</button>
  <button @click="reset">重置</button>
</div></template>
