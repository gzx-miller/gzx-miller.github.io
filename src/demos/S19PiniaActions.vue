<script setup lang="ts">
import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

interface Order {
  id: string
  items: { name: string; qty: number; price: number }[]
  total: number
  status: 'pending' | 'preparing' | 'delivering' | 'completed'
  createdAt: number
}

const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const currentOrder = ref<Order | null>(null)

  const completedOrders = computed(() => orders.value.filter(o => o.status === 'completed'))
  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
  const todayRevenue = computed(() =>
    completedOrders.value.reduce((sum, o) => sum + o.total, 0)
  )

  async function placeOrder(items: { name: string; qty: number; price: number }[]) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      const order: Order = {
        id: 'ORD-' + Date.now().toString(36).toUpperCase(),
        items,
        total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
        status: 'pending',
        createdAt: Date.now(),
      }
      orders.value.unshift(order)
      currentOrder.value = order
      return order
    } finally {
      loading.value = false
    }
  }

  async function prepareOrder(id: string) {
    await simulateDelay(800)
    const order = orders.value.find(o => o.id === id)
    if (order) order.status = 'preparing'
  }

  async function deliverOrder(id: string) {
    await simulateDelay(1000)
    const order = orders.value.find(o => o.id === id)
    if (order) order.status = 'delivering'
  }

  async function completeOrder(id: string) {
    await simulateDelay(600)
    const order = orders.value.find(o => o.id === id)
    if (order) order.status = 'completed'
  }

  async function cancelOrder(id: string) {
    const idx = orders.value.findIndex(o => o.id === id)
    if (idx > -1) {
      await simulateDelay(400)
      orders.value.splice(idx, 1)
    }
  }

  function simulateDelay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  return {
    orders, loading, currentOrder, completedOrders, pendingOrders, todayRevenue,
    placeOrder, prepareOrder, deliverOrder, completeOrder, cancelOrder
  }
})

const store = useOrderStore()
const { orders, loading, completedOrders, pendingOrders, todayRevenue } = storeToRefs(store)

const menuItems = ref([
  { name: '枫叶拿铁', price: 28 },
  { name: '栗子蛋糕', price: 38 },
  { name: '烤红薯', price: 18 },
  { name: '蜂蜜松饼', price: 32 },
  { name: '南瓜汤', price: 26 },
])
const cart = ref<{ name: string; qty: number; price: number }[]>([])
const activeTab = ref<'menu' | 'orders'>('menu')
const processingId = ref<string | null>(null)
const showCode = ref(false)

function addToCart(item: { name: string; price: number }) {
  const existing = cart.value.find(c => c.name === item.name)
  if (existing) existing.qty++
  else cart.value.push({ name: item.name, qty: 1, price: item.price })
}

function removeFromCart(name: string) {
  const idx = cart.value.findIndex(c => c.name === name)
  if (idx > -1) {
    if (cart.value[idx].qty > 1) cart.value[idx].qty--
    else cart.value.splice(idx, 1)
  }
}

const cartTotal = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.qty, 0))

async function submitOrder() {
  if (cart.value.length === 0) return
  await store.placeOrder(cart.value.map(i => ({ ...i })))
  cart.value = []
  activeTab.value = 'orders'
}

async function nextStep(order: Order) {
  processingId.value = order.id
  try {
    if (order.status === 'pending') await store.prepareOrder(order.id)
    else if (order.status === 'preparing') await store.deliverOrder(order.id)
    else if (order.status === 'delivering') await store.completeOrder(order.id)
  } finally {
    processingId.value = null
  }
}

function statusLabel(status: Order['status']) {
  const map = { pending: '⏳ 待处理', preparing: '👨‍🍳 制作中', delivering: '🚚 配送中', completed: '✅ 已完成' }
  return map[status]
}

function statusColor(status: Order['status']) {
  const map = { pending: '#d97706', preparing: '#2563eb', delivering: '#7c3aed', completed: '#16a34a' }
  return map[status]
}
</script>

<template>
  <div class="demo-card">
    <h4>🍁 Pinia Actions 与异步操作</h4>
    <p>秋日咖啡馆订单系统 — 演示同步/异步 Action、订单状态流转</p>

    <div class="stat-bar">
      <div class="stat-pill">
        <span class="pill-label">今日订单</span>
        <span class="pill-value">{{ orders.length }}</span>
      </div>
      <div class="stat-pill success">
        <span class="pill-label">已完成</span>
        <span class="pill-value">{{ completedOrders.length }}</span>
      </div>
      <div class="stat-pill warning">
        <span class="pill-label">处理中</span>
        <span class="pill-value">{{ pendingOrders.length }}</span>
      </div>
      <div class="stat-pill revenue">
        <span class="pill-label">营业额</span>
        <span class="pill-value">¥{{ todayRevenue }}</span>
      </div>
    </div>

    <div class="tab-row">
      <button :class="{ active: activeTab === 'menu' }" @click="activeTab = 'menu'">
        🍽️ 点餐菜单
      </button>
      <button :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
        📋 订单列表
      </button>
    </div>

    <div v-if="activeTab === 'menu'" class="menu-section">
      <div class="menu-grid">
        <div v-for="item in menuItems" :key="item.name" class="menu-card">
          <div class="menu-info">
            <strong>{{ item.name }}</strong>
            <span class="menu-price">¥{{ item.price }}</span>
          </div>
          <div class="menu-actions">
            <button class="qty-btn" @click="removeFromCart(item.name)">-</button>
            <span class="qty-num">{{ cart.find(c => c.name === item.name)?.qty || 0 }}</span>
            <button class="qty-btn" @click="addToCart(item)">+</button>
          </div>
        </div>
      </div>

      <div v-if="cart.length" class="cart-summary">
        <div class="cart-list">
          <div v-for="item in cart" :key="item.name" class="cart-line">
            <span>{{ item.name }} × {{ item.qty }}</span>
            <span>¥{{ item.price * item.qty }}</span>
          </div>
        </div>
        <div class="cart-footer">
          <span>合计: <strong>¥{{ cartTotal }}</strong></span>
          <button @click="submitOrder" :disabled="loading">
            {{ loading ? '提交中...' : '提交订单' }}
          </button>
        </div>
      </div>
      <p v-else class="empty-tip">点击 + 号添加商品到购物车</p>
    </div>

    <div v-else class="orders-section">
      <div v-if="orders.length === 0" class="empty-tip">暂无订单，快去点餐吧~</div>
      <div v-else class="order-list">
        <div
          v-for="order in orders"
          :key="order.id"
          class="order-card"
          :class="{ processing: processingId === order.id }"
        >
          <div class="order-header">
            <span class="order-id">{{ order.id }}</span>
            <span class="order-status" :style="{ color: statusColor(order.status) }">
              {{ statusLabel(order.status) }}
            </span>
          </div>
          <div class="order-items">
            <span v-for="item in order.items" :key="item.name" class="item-tag">
              {{ item.name }} ×{{ item.qty }}
            </span>
          </div>
          <div class="order-footer">
            <span class="order-total">¥{{ order.total }}</span>
            <div class="order-actions">
              <button
                v-if="order.status !== 'completed'"
                @click="nextStep(order)"
                :disabled="processingId === order.id"
                class="primary-btn"
              >
                {{ processingId === order.id ? '处理中...' : order.status === 'pending' ? '开始制作' : order.status === 'preparing' ? '开始配送' : '确认完成' }}
              </button>
              <button
                v-if="order.status === 'pending'"
                @click="store.cancelOrder(order.id)"
                class="danger-btn"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="code-toggle">
      <button @click="showCode = !showCode">{{ showCode ? '收起代码' : '查看 Action 代码' }}</button>
    </div>

    <div v-if="showCode" class="code-block">
      <pre><code>// Pinia Setup Store 中的 Actions
const useOrderStore = defineStore('order', () =&gt; {
  const orders = ref&lt;Order[]&gt;([])
  const loading = ref(false)

  // 异步 Action：下单
  async function placeOrder(items: OrderItem[]) {
    loading.value = true
    try {
      await api.createOrder(items) // 模拟 API 调用
      const order = { id: genId(), items, status: 'pending', ... }
      orders.value.unshift(order)
      return order
    } finally {
      loading.value = false
    }
  }

  // 同步 Action：更新状态
  function cancelOrder(id: string) {
    const idx = orders.value.findIndex(o =&gt; o.id === id)
    if (idx &gt; -1) orders.value.splice(idx, 1)
  }

  // Action 组合：调用其他 Action
  async function fullProcess(id: string) {
    await prepareOrder(id)
    await deliverOrder(id)
    await completeOrder(id)
  }

  return { orders, loading, placeOrder, cancelOrder, ... }
})</code></pre>
    </div>

    <div class="knowledge-points">
      <h5>💡 知识点</h5>
      <ul>
        <li><strong>Actions 即函数</strong>：Setup Store 中普通函数就是 Action，支持同步/异步</li>
        <li><strong>async/await</strong>：Action 中直接用 async/await 处理异步逻辑</li>
        <li><strong>Action 组合</strong>：Action 可以互相调用，构建复杂业务流程</li>
        <li><strong>$onAction</strong>：可监听 Action 调用，用于日志、埋点、错误监控</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.stat-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.stat-pill {
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fff1d8, #ffe6c0);
  border: 1px solid #efc48d;
  text-align: center;
}
.stat-pill.success { background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-color: #86efac; }
.stat-pill.warning { background: linear-gradient(135deg, #fef3c7, #fde68a); border-color: #fcd34d; }
.stat-pill.revenue { background: linear-gradient(135deg, #f08a24, #d94b26); color: #fff; border-color: #b7431f; }
.pill-label { display: block; font-size: 12px; color: #7c563f; margin-bottom: 4px; }
.stat-pill.revenue .pill-label { color: #fff0e0; }
.pill-value { font-size: 20px; font-weight: 800; color: #8f2f18; }
.stat-pill.revenue .pill-value { color: #fff; }

.tab-row {
  display: flex;
  gap: 8px;
}
.tab-row button {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #efc48d;
  background: #fffaf2;
  color: #7c563f;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.tab-row button.active {
  background: linear-gradient(135deg, #d94b26, #f08a24);
  color: #fff;
  border-color: #b7431f;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
.menu-card {
  padding: 14px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.menu-info strong { color: #7b351d; font-size: 15px; }
.menu-price { display: block; color: #b7431f; font-weight: 700; margin-top: 4px; }
.menu-actions { display: flex; align-items: center; gap: 8px; }
.qty-btn {
  width: 28px; height: 28px;
  border-radius: 50% !important;
  padding: 0 !important;
  display: grid;
  place-items: center;
  font-size: 16px !important;
}
.qty-num { font-weight: 700; color: #7b351d; min-width: 20px; text-align: center; }

.cart-summary {
  margin-top: 14px;
  padding: 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fff1d8, #ffe6c0);
  border: 1px solid #efc48d;
}
.cart-list { display: grid; gap: 6px; margin-bottom: 10px; }
.cart-line { display: flex; justify-content: space-between; font-size: 14px; color: #7b351d; }
.cart-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px dashed #efc48d; }
.cart-footer strong { color: #b7431f; font-size: 18px; }

.order-list { display: grid; gap: 10px; }
.order-card {
  padding: 14px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
  transition: all 0.3s;
}
.order-card.processing {
  border-color: #f08a24;
  background: linear-gradient(180deg, #fff5ee, #ffe8d8);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.order-id { font-family: ui-monospace, monospace; font-size: 13px; color: #7c563f; }
.order-status { font-weight: 700; font-size: 13px; }
.order-items { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.item-tag {
  padding: 3px 10px;
  border-radius: 999px;
  background: #fff1d8;
  font-size: 12px;
  color: #7b351d;
}
.order-footer { display: flex; justify-content: space-between; align-items: center; }
.order-total { font-size: 18px; font-weight: 800; color: #b7431f; }
.order-actions { display: flex; gap: 6px; }
.primary-btn {
  padding: 6px 14px !important;
  font-size: 13px !important;
}
.danger-btn {
  padding: 6px 14px !important;
  font-size: 13px !important;
  background: #fff !important;
  color: #dc2626 !important;
  border: 1px solid #dc2626 !important;
}

.empty-tip { text-align: center; color: #9c7a5f; padding: 30px 0; }

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
