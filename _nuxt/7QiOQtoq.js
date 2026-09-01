const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'demo' | 'awaited' | 'patterns'>('demo')

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  avatar: string
}

interface Order {
  id: string
  amount: number
  status: string
  createdAt: Date
  items: { name: string; price: number; quantity: number }[]
}

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
}

const loadingState = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const dataType = ref<'user' | 'order' | 'product'>('user')
const resultData = ref<UserProfile | Order | Product | null>(null)
const errorMsg = ref('')

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchUser(id: number): Promise<UserProfile> {
  await delay(800)
  return {
    id,
    name: '钱七',
    email: 'qianqi@example.com',
    role: '管理员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qianqi',
  }
}

async function fetchOrder(orderId: string): Promise<Order> {
  await delay(1000)
  return {
    id: orderId,
    amount: 899,
    status: '已发货',
    createdAt: new Date('2024-01-20'),
    items: [
      { name: '机械键盘', price: 399, quantity: 1 },
      { name: '无线鼠标', price: 199, quantity: 2 },
      { name: '鼠标垫', price: 99, quantity: 1 },
    ],
  }
}

async function fetchProduct(productId: number): Promise<Product> {
  await delay(600)
  return {
    id: productId,
    name: '秋日限定奶茶',
    price: 28,
    category: '饮品',
    stock: 156,
  }
}

async function loadData() {
  loadingState.value = 'loading'
  errorMsg.value = ''
  resultData.value = null
  try {
    if (dataType.value === 'user') {
      resultData.value = await fetchUser(1001)
    } else if (dataType.value === 'order') {
      resultData.value = await fetchOrder('ORD-2024-88888')
    } else {
      resultData.value = await fetchProduct(5001)
    }
    loadingState.value = 'success'
  } catch (e) {
    errorMsg.value = '加载失败，请稍后重试'
    loadingState.value = 'error'
  }
}

type FetchUserReturn = Awaited<ReturnType<typeof fetchUser>>
type FetchOrderReturn = Awaited<ReturnType<typeof fetchOrder>>
type FetchProductReturn = Awaited<ReturnType<typeof fetchProduct>>

const awaitedExamples = [
  { input: 'Promise<string>', output: 'string', desc: '单层 Promise 解包' },
  { input: 'Promise<Promise<number>>', output: 'number', desc: '嵌套 Promise 递归解包' },
  { input: 'Promise<User | null>', output: 'User | null', desc: '联合类型也能正确解包' },
  { input: 'Awaited<ReturnType<typeof fn>>', output: 'fn 的返回值类型', desc: '组合使用：获取 async 函数真实返回类型' },
]

const patterns = [
  {
    title: '获取 async 函数返回值',
    code: "async function getUser(): Promise<User> { ... }\\ntype UserResult = Awaited<ReturnType<typeof getUser>>\\n// → User",
    desc: '最常用模式：从 async 函数中提取返回的真实数据类型',
  },
  {
    title: '通用 API 响应封装',
    code: "interface ApiResponse<T> { data: T; code: number; msg: string }\\nasync function request<T>(url: string): Promise<ApiResponse<T>> { ... }\\n// Awaited<ReturnType<typeof request<User>>> → ApiResponse<User>",
    desc: '封装统一的 API 响应结构，Awaited 用于推导完整响应类型',
  },
  {
    title: 'Promise.all 的类型推导',
    code: "const results = await Promise.all([fetchUser(), fetchOrder()])\\n// results: [User, Order]\\n// TS 自动推导元组类型",
    desc: 'TypeScript 自动推导 Promise.all 的结果为元组类型',
  },
  {
    title: '类型守卫与异步',
    code: "async function isAdmin(userId: number): Promise<boolean> {\\n  const user = await fetchUser(userId)\\n  return user.role === 'admin'\\n}\\n// ReturnType<typeof isAdmin> → Promise<boolean>\\n// Awaited<...> → boolean",
    desc: '异步判断函数的返回值需要用 Awaited 解包',
  },
]

const codeExample = \`<span style="color:#7c7c99">// 1. Awaited 的基本用法</span>
type UserPromise = Promise&lt;User&gt;
type User = Awaited&lt;UserPromise&gt;  <span style="color:#8a8a3a">// User</span>

<span style="color:#7c7c99">// 2. 递归解包嵌套 Promise</span>
type Deep = Promise&lt;Promise&lt;string&gt;&gt;
type Value = Awaited&lt;Deep&gt;  <span style="color:#8a8a3a">// string</span>

<span style="color:#7c7c99">// 3. 与 ReturnType 组合获取 async 函数返回值</span>
async function fetchUser(id: number): Promise&lt;User&gt; { ... }
type UserResult = Awaited&lt;ReturnType&lt;typeof fetchUser&gt;&gt;
<span style="color:#8a8a3a">// User（而不是 Promise&lt;User&gt;）</span>

<span style="color:#7c7c99">// 4. 手动实现 Awaited（理解原理）</span>
type MyAwaited&lt;T&gt; =
  T extends PromiseLike&lt;infer U&gt; ? MyAwaited&lt;U&gt; : T

<span style="color:#7c7c99">// 5. 实战：定义 API 工具函数</span>
type ApiResult&lt;T&gt; = { success: true; data: T } | { success: false; error: string }

async function apiGet&lt;T&gt;(url: string): Promise&lt;ApiResult&lt;T&gt;&gt; {
  try {
    const res = await fetch(url)
    return { success: true, data: await res.json() }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}\`

const selectedPattern = ref(0)
<\/script>

<template>
  <div class="demo-card">
    <h3>异步返回类型与 Awaited</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">API 加载演示</button>
      <button class="tab-btn" :class="{ active: activeTab === 'awaited' }" @click="activeTab = 'awaited'">Awaited 详解</button>
      <button class="tab-btn" :class="{ active: activeTab === 'patterns' }" @click="activeTab = 'patterns'">常用模式</button>
    </div>

    <div v-if="activeTab === 'demo'">
      <h4>模拟 API 异步数据加载</h4>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
        <label>数据类型：
          <select v-model="dataType">
            <option value="user">用户信息</option>
            <option value="order">订单详情</option>
            <option value="product">商品信息</option>
          </select>
        </label>
        <button class="load-btn" @click="loadData" :disabled="loadingState === 'loading'">
          {{ loadingState === 'loading' ? '加载中...' : '加载数据' }}
        </button>
      </div>

      <div v-if="loadingState === 'idle'" class="result-box idle">
        <p>👆 点击上方按钮加载数据</p>
        <p><small>三个 async 函数返回不同的 Promise 类型</small></p>
      </div>

      <div v-if="loadingState === 'loading'" class="result-box loading">
        <p>⏳ 正在加载数据...</p>
        <p><small>模拟网络请求延迟，体验异步过程</small></p>
      </div>

      <div v-if="loadingState === 'success' && resultData" class="result-box success">
        <div v-if="dataType === 'user' && 'name' in resultData && 'role' in resultData && 'email' in resultData && 'avatar' in resultData">
          <h4 style="margin:0 0 8px 0;">👤 用户信息</h4>
          <div style="display:flex;gap:12px;align-items:center;">
            <img :src="resultData.avatar" style="width:48px;height:48px;border-radius:50%;background:#fff3e0;" />
            <div>
              <p style="margin:0;"><strong>{{ resultData.name }}</strong>（ID: {{ resultData.id }}）</p>
              <p style="margin:0;font-size:12px;color:#8a6d42;">{{ resultData.email }} · {{ resultData.role }}</p>
            </div>
          </div>
          <p style="margin-top:8px;font-size:12px;"><code>Awaited&lt;ReturnType&lt;typeof fetchUser&gt;&gt; → UserProfile</code></p>
        </div>

        <div v-else-if="dataType === 'order' && 'items' in resultData">
          <h4 style="margin:0 0 8px 0;">📦 订单详情</h4>
          <p style="margin:0;">订单号：<code>{{ resultData.id }}</code></p>
          <p style="margin:4px 0;">金额：<strong>¥{{ resultData.amount }}</strong> · 状态：{{ resultData.status }}</p>
          <p style="margin:4px 0;font-size:12px;color:#8a6d42;">下单时间：{{ resultData.createdAt.toLocaleDateString() }}</p>
          <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #e0a06a;">
            <p style="margin:0 0 4px 0;"><strong>商品清单：</strong></p>
            <ul style="margin:0;padding-left:20px;font-size:12px;">
              <li v-for="(item, i) in resultData.items" :key="i">
                {{ item.name }} × {{ item.quantity }} - ¥{{ item.price * item.quantity }}
              </li>
            </ul>
          </div>
          <p style="margin-top:8px;font-size:12px;"><code>Awaited&lt;ReturnType&lt;typeof fetchOrder&gt;&gt; → Order</code></p>
        </div>

        <div v-else-if="dataType === 'product' && 'stock' in resultData">
          <h4 style="margin:0 0 8px 0;">🧋 商品信息</h4>
          <p style="margin:0;"><strong>{{ resultData.name }}</strong></p>
          <p style="margin:4px 0;">价格：<strong style="color:#e85d04;">¥{{ resultData.price }}</strong> · 分类：{{ resultData.category }}</p>
          <p style="margin:4px 0;font-size:12px;color:#8a6d42;">库存：{{ resultData.stock }} 件</p>
          <p style="margin-top:8px;font-size:12px;"><code>Awaited&lt;ReturnType&lt;typeof fetchProduct&gt;&gt; → Product</code></p>
        </div>
      </div>

      <div v-if="loadingState === 'error'" class="result-box error">
        <p>❌ {{ errorMsg }}</p>
      </div>
    </div>

    <div v-if="activeTab === 'awaited'">
      <h4>Awaited 工具类型</h4>
      <div class="result-box">
        <p><strong>作用：</strong>递归地解包 Promise 类型，获取最内层的真实数据类型。</p>
        <p><strong>出现版本：</strong>TypeScript 4.5</p>
        <p><strong>为什么需要它？</strong>async 函数返回的总是 Promise，但我们通常关心的是 Promise 里面的数据类型。</p>
      </div>

      <h4 style="margin-top:12px;">示例</h4>
      <table>
        <thead><tr><th>输入类型</th><th>输出类型</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="e in awaitedExamples" :key="e.input">
            <td><code>{{ e.input }}</code></td>
            <td><code class="type">{{ e.output }}</code></td>
            <td><small>{{ e.desc }}</small></td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box">
        <p><strong>💡 记忆技巧：</strong><code>Awaited</code> = "await 之后的类型"。就像代码里写 <code>await promise</code> 拿到的是里面的值，类型层面写 <code>Awaited&lt;PromiseType&gt;</code> 拿到的是里面的类型。</p>
      </div>
    </div>

    <div v-if="activeTab === 'patterns'">
      <h4>常用模式与最佳实践</h4>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
        <button
          v-for="(p, i) in patterns"
          :key="i"
          class="mini-btn"
          :class="{ active: selectedPattern === i }"
          @click="selectedPattern = i"
        >
          {{ p.title }}
        </button>
      </div>

      <div class="result-box">
        <h5 style="margin:0 0 8px 0;color:#e85d04;">{{ patterns[selectedPattern].title }}</h5>
        <pre class="mini-code small">{{ patterns[selectedPattern].code }}</pre>
        <p style="margin-top:8px;"><small>{{ patterns[selectedPattern].desc }}</small></p>
      </div>
    </div>

    <h4>综合代码示例</h4>
    <pre class="mini-code" v-html="codeExample"></pre>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.mini-code.small { font-size: 11px; padding: 6px; margin: 0; }
.result-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.result-box.idle { background: #fafafa; border-left-color: #aaa; }
.result-box.loading { background: #fff8e1; border-left-color: #f59e0b; }
.result-box.success { background: #f0fdf4; border-left-color: #10b981; }
.result-box.error { background: #fef2f2; border-left-color: #ef4444; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.mini-btn { padding: 4px 12px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; }
.mini-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.load-btn { padding: 6px 18px; background: #e85d04; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; }
.load-btn:disabled { background: #f0c8a0; cursor: not-allowed; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
code.type { color: #0891b2; font-weight: bold; }
small { color: #8a6d42; }
label { display: flex; flex-direction: column; font-size: 12px; gap: 2px; }
select { padding: 4px 8px; border: 1px solid #e0a06a; border-radius: 4px; }
</style>
`;export{e as default};
