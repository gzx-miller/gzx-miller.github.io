<script setup lang="ts">
import { computed, ref } from 'vue'

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

interface PendingOrder {
  status: 'pending'
  orderId: string
  amount: number
  createdAt: Date
}

interface PaidOrder {
  status: 'paid'
  orderId: string
  amount: number
  paidAt: Date
  paymentMethod: string
}

interface ShippedOrder {
  status: 'shipped'
  orderId: string
  amount: number
  shippedAt: Date
  trackingNumber: string
}

interface DeliveredOrder {
  status: 'delivered'
  orderId: string
  amount: number
  deliveredAt: Date
  confirmed: boolean
}

interface CancelledOrder {
  status: 'cancelled'
  orderId: string
  amount: number
  cancelledAt: Date
  reason: string
}

type Order = PendingOrder | PaidOrder | ShippedOrder | DeliveredOrder | CancelledOrder

const currentStatus = ref<OrderStatus>('pending')

const mockOrders: Record<OrderStatus, Order> = {
  pending: { status: 'pending', orderId: 'ORD-202401001', amount: 299, createdAt: new Date('2024-01-15') },
  paid: { status: 'paid', orderId: 'ORD-202401002', amount: 599, paidAt: new Date('2024-01-16'), paymentMethod: '微信支付' },
  shipped: { status: 'shipped', orderId: 'ORD-202401003', amount: 899, shippedAt: new Date('2024-01-17'), trackingNumber: 'SF1234567890' },
  delivered: { status: 'delivered', orderId: 'ORD-202401004', amount: 1299, deliveredAt: new Date('2024-01-18'), confirmed: true },
  cancelled: { status: 'cancelled', orderId: 'ORD-202401005', amount: 399, cancelledAt: new Date('2024-01-19'), reason: '库存不足' },
}

const currentOrder = computed(() => mockOrders[currentStatus.value])

function getOrderSummary(order: Order): string {
  switch (order.status) {
    case 'pending':
      return `待支付订单，金额 ¥${order.amount}，创建于 ${order.createdAt.toLocaleDateString()}`
    case 'paid':
      return `已支付订单，金额 ¥${order.amount}，通过 ${order.paymentMethod} 支付`
    case 'shipped':
      return `已发货订单，运单号 ${order.trackingNumber}，发货于 ${order.shippedAt.toLocaleDateString()}`
    case 'delivered':
      return `已送达订单，${order.confirmed ? '已确认收货' : '待确认'}，送达于 ${order.deliveredAt.toLocaleDateString()}`
    case 'cancelled':
      return `已取消订单，原因：${order.reason}，取消于 ${order.cancelledAt.toLocaleDateString()}`
  }
}

function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: '#f59e0b',
    paid: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  }
  return colors[status]
}

function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消',
  }
  return labels[status]
}

const statusList: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

const activeTab = ref<'demo' | 'exhaustive' | 'patterns'>('demo')

const exhaustiveCode = `<span style="color:#7c7c99">// 可辨识联合的核心：每个类型都有一个共同的判别字段</span>
type Order = PendingOrder | PaidOrder | ShippedOrder | ...

<span style="color:#7c7c99">// 穷尽性检查：switch 必须覆盖所有情况</span>
function getOrderSummary(order: Order): string {
  switch (order.status) {
    case 'pending':
      return '待支付...'
    case 'paid':
      return '已支付...'
    case 'shipped':
      return '已发货...'
    case 'delivered':
      return '已送达...'
    case 'cancelled':
      return '已取消...'
    <span style="color:#7c7c99">// 如果新增状态而忘记处理，编译器会报错</span>
  }
}

<span style="color:#7c7c99">// 运行时安全网：never 类型确保穷尽</span>
function assertNever(x: never): never {
  throw new Error('未处理的情况: ' + x)
}

<span style="color:#7c7c99">// 在 default 分支使用，编译期+运行时双重保障</span>
switch (order.status) {
  // ... 各个 case
  default:
    return assertNever(order.status)
}`

const patterns = [
  { name: '字段判别', desc: '使用字面量类型的共同字段（如 status、type、kind）', example: 'status: "pending" | "paid" | "shipped"' },
  { name: 'switch 穷尽', desc: 'switch 语句覆盖所有分支，新增类型时编译报错', example: 'switch (x.type) { case "a": ... case "b": ... }' },
  { name: '标签联合', desc: '每个成员有独特的属性，收窄后可安全访问', example: '只有 PaidOrder 才有 paidAt 字段' },
  { name: '状态机建模', desc: '适合描述实体的状态流转和各状态的特有数据', example: '订单、支付、工作流' },
]

const orderSummary = computed(() => getOrderSummary(currentOrder.value))
</script>

<template>
  <div class="demo-card">
    <h3>可辨识联合类型与穷尽性检查</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">订单演示</button>
      <button class="tab-btn" :class="{ active: activeTab === 'exhaustive' }" @click="activeTab = 'exhaustive'">穷尽检查</button>
      <button class="tab-btn" :class="{ active: activeTab === 'patterns' }" @click="activeTab = 'patterns'">常见模式</button>
    </div>

    <div v-if="activeTab === 'demo'">
      <h4>订单状态流转演示</h4>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
        <button
          v-for="s in statusList"
          :key="s"
          class="status-btn"
          :style="{ borderColor: getStatusColor(s), color: currentStatus === s ? '#fff' : getStatusColor(s), background: currentStatus === s ? getStatusColor(s) : '#fff' }"
          @click="currentStatus = s"
        >
          {{ getStatusLabel(s) }}
        </button>
      </div>

      <div class="result-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h4 style="margin:0;">订单详情</h4>
          <span class="status-badge" :style="{ background: getStatusColor(currentStatus) }">
            {{ getStatusLabel(currentStatus) }}
          </span>
        </div>
        <p><strong>订单号：</strong><code>{{ currentOrder.orderId }}</code></p>
        <p><strong>金额：</strong>¥{{ currentOrder.amount }}</p>
        <p><strong>摘要：</strong>{{ orderSummary }}</p>

        <div v-if="currentOrder.status === 'pending'" class="detail-row">
          <span>创建时间：</span>{{ currentOrder.createdAt.toLocaleDateString() }}
        </div>
        <div v-else-if="currentOrder.status === 'paid'" class="detail-row">
          <span>支付时间：</span>{{ currentOrder.paidAt.toLocaleDateString() }}
          <span style="margin-left:12px;">支付方式：</span>{{ currentOrder.paymentMethod }}
        </div>
        <div v-else-if="currentOrder.status === 'shipped'" class="detail-row">
          <span>发货时间：</span>{{ currentOrder.shippedAt.toLocaleDateString() }}
          <span style="margin-left:12px;">运单号：</span>{{ currentOrder.trackingNumber }}
        </div>
        <div v-else-if="currentOrder.status === 'delivered'" class="detail-row">
          <span>送达时间：</span>{{ currentOrder.deliveredAt.toLocaleDateString() }}
          <span style="margin-left:12px;">确认状态：</span>{{ currentOrder.confirmed ? '已确认' : '待确认' }}
        </div>
        <div v-else-if="currentOrder.status === 'cancelled'" class="detail-row">
          <span>取消时间：</span>{{ currentOrder.cancelledAt.toLocaleDateString() }}
          <span style="margin-left:12px;">取消原因：</span>{{ currentOrder.reason }}
        </div>
      </div>

      <div class="tips-box">
        <p><strong>💡 关键点：</strong>每个状态都有各自特有的字段（如 paidAt、trackingNumber 等），TypeScript 会根据 status 字段自动收窄类型，让你只能访问当前状态下有效的字段。</p>
      </div>
    </div>

    <div v-if="activeTab === 'exhaustive'">
      <h4>穷尽性检查</h4>
      <div class="result-box">
        <p><strong>什么是穷尽性检查？</strong></p>
        <p>当你使用 switch 处理可辨识联合时，TypeScript 会确保你处理了所有可能的分支。如果新增了一个状态而忘记在 switch 中添加对应的 case，编译器会直接报错。</p>
      </div>

      <div style="margin-top:12px;">
        <h4>实现方式</h4>
        <ol>
          <li>联合类型的每个成员都有一个判别字段（如 <code>status</code>）</li>
          <li>使用 <code>switch</code> 根据判别字段分支</li>
          <li>TypeScript 自动收窄每个分支的类型</li>
          <li>如果有遗漏，<code>default</code> 分支中的值会被收窄为 <code>never</code></li>
          <li>使用 <code>assertNever</code> 函数在编译期和运行时都保证安全</li>
        </ol>
      </div>

      <pre class="mini-code" v-html="exhaustiveCode"></pre>
    </div>

    <div v-if="activeTab === 'patterns'">
      <h4>常见应用模式</h4>
      <table>
        <thead><tr><th>模式</th><th>说明</th><th>示例</th></tr></thead>
        <tbody>
          <tr v-for="p in patterns" :key="p.name">
            <td><strong>{{ p.name }}</strong></td>
            <td>{{ p.desc }}</td>
            <td><code>{{ p.example }}</code></td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box">
        <p><strong>适用场景：</strong>订单状态、支付状态、消息类型、表单步骤、游戏状态机、API 响应（成功/失败）等具有明确状态流转的业务模型。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.result-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.status-btn { padding: 6px 14px; border: 2px solid; border-radius: 20px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.status-badge { padding: 3px 10px; border-radius: 12px; color: #fff; font-size: 12px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
.detail-row { margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e0a06a; font-size: 13px; }
.detail-row span:first-child { color: #8a6d42; }
ol { font-size: 13px; color: #5a4a32; padding-left: 20px; }
ol li { margin-bottom: 4px; }
</style>
