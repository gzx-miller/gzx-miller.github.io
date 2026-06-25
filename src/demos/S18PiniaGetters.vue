<script setup lang="ts">
import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
}

const useShopStore = defineStore('shop', () => {
  const products = ref<Product[]>([
    { id: 1, name: '枫叶红茶', price: 28, category: '饮品', stock: 50 },
    { id: 2, name: '栗子蛋糕', price: 38, category: '甜点', stock: 20 },
    { id: 3, name: '蜂蜜坚果', price: 45, category: '零食', stock: 35 },
    { id: 4, name: '南瓜浓汤', price: 32, category: '汤品', stock: 15 },
    { id: 5, name: '苹果派', price: 25, category: '甜点', stock: 40 },
    { id: 6, name: '肉桂拿铁', price: 30, category: '饮品', stock: 60 },
    { id: 7, name: '烤红薯', price: 18, category: '零食', stock: 25 },
    { id: 8, name: '蘑菇奶油汤', price: 28, category: '汤品', stock: 10 },
  ])
  const cartIds = ref<{ id: number; qty: number }[]>([])

  const totalProducts = computed(() => products.value.length)
  const averagePrice = computed(() => {
    if (products.value.length === 0) return 0
    return Math.round(products.value.reduce((sum, p) => sum + p.price, 0) / products.value.length)
  })
  const categories = computed(() => [...new Set(products.value.map(p => p.category))])
  const lowStockProducts = computed(() => products.value.filter(p => p.stock < 20))
  const cartItems = computed(() => {
    return cartIds.value.map(item => {
      const product = products.value.find(p => p.id === item.id)
      return product ? { ...product, qty: item.qty, subtotal: product.price * item.qty } : null
    }).filter((item): item is Product & { qty: number; subtotal: number } => item !== null)
  })
  const cartTotal = computed(() => cartItems.value.reduce((sum, item: any) => sum + item.subtotal, 0))
  const cartCount = computed(() => cartIds.value.reduce((sum, item) => sum + item.qty, 0))
  const productsByCategory = computed(() => {
    const map: Record<string, Product[]> = {}
    categories.value.forEach(cat => {
      map[cat] = products.value.filter(p => p.category === cat)
    })
    return map
  })

  function addToCart(id: number) {
    const existing = cartIds.value.find(item => item.id === id)
    if (existing) {
      existing.qty++
    } else {
      cartIds.value.push({ id, qty: 1 })
    }
  }
  function removeFromCart(id: number) {
    const idx = cartIds.value.findIndex(item => item.id === id)
    if (idx > -1) cartIds.value.splice(idx, 1)
  }
  function updateQty(id: number, qty: number) {
    const item = cartIds.value.find(item => item.id === id)
    if (item) item.qty = Math.max(1, qty)
  }

  return {
    products, cartIds, totalProducts, averagePrice, categories,
    lowStockProducts, cartItems, cartTotal, cartCount, productsByCategory,
    addToCart, removeFromCart, updateQty
  }
})

const store = useShopStore()
const { products, totalProducts, averagePrice, categories, lowStockProducts, cartItems, cartTotal, cartCount, productsByCategory } = storeToRefs(store)
const activeCategory = ref<string>('全部')
const showCode = ref(false)

const filteredProducts = computed(() => {
  if (activeCategory.value === '全部') return products.value
  return productsByCategory.value[activeCategory.value] || []
})
</script>

<template>
  <div class="demo-card">
    <h4>🍂 Pinia Getters 与派生状态</h4>
    <p>秋日森林小铺 — 演示 Getters 计算派生数据：统计、筛选、分组、购物车金额</p>

    <div class="stat-row">
      <div class="stat-card">
        <span class="stat-num">{{ totalProducts }}</span>
        <span class="stat-label">商品总数</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">¥{{ averagePrice }}</span>
        <span class="stat-label">均价</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ lowStockProducts.length }}</span>
        <span class="stat-label">库存告急</span>
      </div>
      <div class="stat-card cart">
        <span class="stat-num">{{ cartCount }}</span>
        <span class="stat-label">购物车</span>
      </div>
    </div>

    <div class="filter-tabs">
      <button
        v-for="cat in ['全部', ...categories]"
        :key="cat"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div class="product-grid">
      <article v-for="p in filteredProducts" :key="p.id" class="product-card" :class="{ low: p.stock < 20 }">
        <strong>{{ p.name }}</strong>
        <p class="price">¥{{ p.price }}</p>
        <small>分类: {{ p.category }} | 库存: {{ p.stock }}</small>
        <button @click="store.addToCart(p.id)" :disabled="p.stock === 0">加入购物车</button>
      </article>
    </div>

    <div v-if="cartItems.length" class="cart-box">
      <h5>🛒 购物车 ({{ cartCount }}件)</h5>
      <ul>
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <span>{{ item.name }} × {{ item.qty }}</span>
          <span>¥{{ item.subtotal }}</span>
          <button class="mini-btn" @click="store.removeFromCart(item.id)">移除</button>
        </li>
      </ul>
      <p class="cart-total">合计: <strong>¥{{ cartTotal }}</strong></p>
    </div>

    <div class="code-toggle">
      <button @click="showCode = !showCode">{{ showCode ? '收起代码' : '查看 Store 代码' }}</button>
    </div>

    <div v-if="showCode" class="code-block">
      <pre><code>// Setup Store 中的 Getters (computed)
const useShopStore = defineStore('shop', () => {
  const products = ref&lt;Product[]&gt;([...])
  const cartIds = ref&lt;{ id: number; qty: number }[]&gt;([])

  // 基础统计
  const totalProducts = computed(() => products.value.length)
  const averagePrice = computed(() => {
    if (products.value.length === 0) return 0
    return Math.round(
      products.value.reduce((sum, p) => sum + p.price, 0) / products.value.length
    )
  })

  // 筛选与分组
  const categories = computed(() =>
    [...new Set(products.value.map(p => p.category))]
  )
  const lowStockProducts = computed(() =>
    products.value.filter(p => p.stock &lt; 20)
  )
  const productsByCategory = computed(() => {
    const map: Record&lt;string, Product[]&gt; = {}
    categories.value.forEach(cat => {
      map[cat] = products.value.filter(p => p.category === cat)
    })
    return map
  })

  // 组合派生
  const cartItems = computed(() =>
    cartIds.value.map(item => {
      const product = products.value.find(p => p.id === item.id)
      return product ? { ...product, qty: item.qty, subtotal: product.price * item.qty } : null
    }).filter(Boolean)
  )
  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item: any) => sum + item.subtotal, 0)
  )

  return { products, totalProducts, averagePrice, categories,
           lowStockProducts, cartItems, cartTotal, ... }
})</code></pre>
    </div>

    <div class="knowledge-points">
      <h5>💡 知识点</h5>
      <ul>
        <li><strong>Getters 即 computed</strong>：Setup Store 中直接用 <code>computed()</code> 定义，自动缓存</li>
        <li><strong>组合派生</strong>：Getters 可以引用其他 Getters，形成派生链</li>
        <li><strong>带参数访问</strong>：返回函数的 Getter 可接收参数，但不会缓存</li>
        <li><strong>性能优化</strong>：频繁访问的派生数据优先放 Store 层共享计算结果</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.stat-card {
  text-align: center;
  padding: 14px 8px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fff1d8, #ffe0ac);
  border: 1px solid #efc48d;
}
.stat-card.cart {
  background: linear-gradient(135deg, #f08a24, #d94b26);
  color: #fff;
  border-color: #b7431f;
}
.stat-num {
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: #8f2f18;
}
.stat-card.cart .stat-num { color: #fff; }
.stat-label {
  font-size: 12px;
  color: #7c563f;
}
.stat-card.cart .stat-label { color: #fff0e0; }

.filter-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.filter-tabs button {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid #efc48d;
  background: #fffaf2;
  color: #7c563f;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.filter-tabs button.active {
  background: linear-gradient(135deg, #d94b26, #f08a24);
  color: #fff;
  border-color: #b7431f;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}
.product-card {
  padding: 14px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
  display: grid;
  gap: 6px;
}
.product-card.low {
  border-color: #d94b26;
  background: linear-gradient(180deg, #fff5ee, #ffe8d8);
}
.product-card .price {
  font-size: 20px;
  font-weight: 700;
  color: #b7431f;
  margin: 0;
}
.product-card small { color: #7c563f; font-size: 12px; }

.cart-box {
  padding: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fff1d8, #ffe6c0);
  border: 1px solid #efc48d;
}
.cart-box h5 { margin: 0 0 10px; color: #7b351d; }
.cart-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px dashed #efc48d;
  font-size: 13px;
}
.cart-item span:last-of-type {
  margin-left: auto;
  font-weight: 600;
  color: #b7431f;
}
.mini-btn {
  padding: 3px 8px !important;
  font-size: 12px !important;
  background: transparent !important;
  color: #b7431f !important;
  border: 1px solid #b7431f !important;
}
.cart-total {
  margin: 10px 0 0;
  text-align: right;
  font-size: 16px;
  color: #7b351d;
}
.cart-total strong { color: #b7431f; font-size: 20px; }

.code-toggle { text-align: center; }
.code-block pre { margin: 0; }
.code-block code {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #7b351d;
}

.knowledge-points {
  padding: 14px 18px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f0f8e8, #e0eec8);
  border-left: 4px solid #4b6d33;
}
.knowledge-points h5 { margin: 0 0 8px; color: #4b6d33; }
.knowledge-points ul { margin: 0; padding-left: 20px; }
.knowledge-points li { font-size: 13px; color: #5a6d40; line-height: 1.7; }
.knowledge-points code {
  background: #fffaf2;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #b7431f;
}
</style>
