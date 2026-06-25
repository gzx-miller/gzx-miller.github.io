<script setup lang="ts">
import { computed, ref } from 'vue'

declare const __brand: unique symbol
type Brand<T, B> = T & { [__brand]: B }

type UserId = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>
type ProductId = Brand<string, 'ProductId'>
type Email = Brand<string, 'Email'>

function createUserId(id: string): UserId {
  return id as UserId
}

function createOrderId(id: string): OrderId {
  return id as OrderId
}

function createProductId(id: string): ProductId {
  return id as ProductId
}

function createEmail(email: string): Email {
  return email as Email
}

function getUserById(id: UserId) {
  return { id, name: '张三', role: '管理员' }
}

function getOrderById(id: OrderId) {
  return { id, amount: 299, status: '已支付' }
}

const activeTab = ref<'basic' | 'scenario' | 'benefits'>('basic')

const userIdInput = ref('user_001')
const orderIdInput = ref('order_1001')
const productIdInput = ref('prod_5001')
const emailInput = ref('zhangsan@example.com')

const userId = computed(() => createUserId(userIdInput.value))
const orderId = computed(() => createOrderId(orderIdInput.value))
const productId = computed(() => createProductId(productIdInput.value))
const email = computed(() => createEmail(emailInput.value))

const user = computed(() => getUserById(userId.value))
const order = computed(() => getOrderById(orderId.value))

const brandExamples = [
  { name: '用户ID', type: 'UserId', example: 'user_001', desc: '标识系统中的唯一用户' },
  { name: '订单ID', type: 'OrderId', example: 'order_1001', desc: '标识唯一订单，避免与用户ID混淆' },
  { name: '商品ID', type: 'ProductId', example: 'prod_5001', desc: '标识唯一商品' },
  { name: '邮箱', type: 'Email', example: 'a@b.com', desc: '经过格式验证的邮箱地址' },
]

const codeExample = `<span style="color:#7c7c99">// 品牌类型定义</span>
declare const __brand: unique symbol
type Brand&lt;T, B&gt; = T &amp; { [__brand]: B }

<span style="color:#7c7c99">// 创建不同的品牌类型</span>
type UserId = Brand&lt;string, 'UserId'&gt;
type OrderId = Brand&lt;string, 'OrderId'&gt;

<span style="color:#7c7c99">// 构造函数（运行时无额外开销）</span>
function createUserId(id: string): UserId {
  return id as UserId
}

<span style="color:#7c7c99">// 函数参数使用品牌类型</span>
function getUserById(id: UserId) { ... }
function getOrderById(id: OrderId) { ... }

<span style="color:#7c7c99">// ✅ 正确使用</span>
const userId = createUserId('user_001')
getUserById(userId)

<span style="color:#7c7c99">// ❌ 错误：不能将 OrderId 传给 UserId 参数</span>
const orderId = createOrderId('order_1001')
getUserById(orderId)  <span style="color:#dc2626">// 类型错误！</span>`

const benefits = [
  { title: '防止参数混淆', desc: '不同业务ID即使底层都是字符串，也不能互相传递' },
  { title: '零运行时开销', desc: '只在编译期存在，运行时就是原始类型' },
  { title: '代码自文档化', desc: '看到 UserId 就知道是用户ID，比 string 更有语义' },
  { title: '渐进式采用', desc: '可以逐步为现有代码添加品牌类型' },
  { title: '验证边界', desc: '在系统入口处验证并打上品牌标记' },
  { title: '重构友好', desc: '修改类型时编译器会帮你找出所有相关处' },
]
</script>

<template>
  <div class="demo-card">
    <h3>品牌类型 (Branded Types)</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础概念</button>
      <button class="tab-btn" :class="{ active: activeTab === 'scenario' }" @click="activeTab = 'scenario'">业务场景</button>
      <button class="tab-btn" :class="{ active: activeTab === 'benefits' }" @click="activeTab = 'benefits'">优势总结</button>
    </div>

    <div v-if="activeTab === 'basic'">
      <h4>什么是品牌类型？</h4>
      <div class="result-box">
        <p>品牌类型通过给原始类型添加一个唯一的"品牌标记"，让 TypeScript 将其视为不同的类型。</p>
        <p><strong>核心思想：</strong>即使底层都是 string，但 UserId 和 OrderId 是不同的类型，不能混用。</p>
      </div>

      <h4 style="margin-top:12px;">常见品牌类型</h4>
      <table>
        <thead><tr><th>名称</th><th>类型</th><th>示例</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="b in brandExamples" :key="b.type">
            <td><strong>{{ b.name }}</strong></td>
            <td><code class="type">{{ b.type }}</code></td>
            <td><code>{{ b.example }}</code></td>
            <td><small>{{ b.desc }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'scenario'">
      <h4>电商系统演示</h4>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
        <label>用户ID<input v-model="userIdInput" /></label>
        <label>订单ID<input v-model="orderIdInput" /></label>
        <label>商品ID<input v-model="productIdInput" /></label>
        <label>邮箱<input v-model="emailInput" /></label>
      </div>

      <div class="result-box">
        <p><strong>用户信息查询：</strong></p>
        <p>用户ID：<code>{{ user.id }}</code> → 姓名：{{ user.name }}，角色：{{ user.role }}</p>
        <p class="muted"><small>getUserById 只接受 UserId 类型，传入 OrderId 会编译报错</small></p>
      </div>

      <div class="result-box" style="margin-top:8px;">
        <p><strong>订单信息查询：</strong></p>
        <p>订单ID：<code>{{ order.id }}</code> → 金额：¥{{ order.amount }}，状态：{{ order.status }}</p>
        <p class="muted"><small>getOrderById 只接受 OrderId 类型</small></p>
      </div>

      <div class="tips-box">
        <p><strong>💡 场景思考：</strong>想象一个函数同时接收 userId 和 orderId，没有品牌类型时很容易传反，编译器也不会报错。有了品牌类型，这种错误在编译阶段就能被发现。</p>
      </div>
    </div>

    <div v-if="activeTab === 'benefits'">
      <h4>品牌类型的六大优势</h4>
      <div class="benefits-grid">
        <div v-for="b in benefits" :key="b.title" class="benefit-card">
          <h5>{{ b.title }}</h5>
          <p><small>{{ b.desc }}</small></p>
        </div>
      </div>

      <div class="tips-box">
        <p><strong>与类型别名的区别：</strong><code>type UserId = string</code> 只是别名，仍然可以和任意 string 互换。品牌类型是真正的"名义类型"，只有显式标记的才能通过。</p>
      </div>
    </div>

    <h4>代码示例</h4>
    <pre class="mini-code" v-html="codeExample"></pre>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.result-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
input { padding: 4px 8px; border: 1px solid #e0a06a; border-radius: 4px; width: 140px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
code.type { color: #0891b2; font-weight: bold; }
small { color: #8a6d42; }
label { display: flex; flex-direction: column; font-size: 12px; gap: 2px; }
.benefits-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px; }
.benefit-card { background: #fff8f0; padding: 10px; border-radius: 6px; border: 1px solid #f0c8a0; }
.benefit-card h5 { margin: 0 0 4px 0; color: #e85d04; }
.benefit-card p { margin: 0; }
.muted { opacity: 0.7; }
</style>
