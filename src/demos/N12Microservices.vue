<script setup lang="ts">
import { ref } from 'vue'

interface Order {
  id: number
  skuId: string
  qty: number
  status: string
}

const orderId = ref(1)
const stockLeft = ref(10)
const logs = ref<string[]>([])
const orders = ref<Order[]>([])

function delay() {
  return new Promise((r) => setTimeout(r, 400))
}

async function createOrder() {
  logs.value = []
  logs.value.push(`🛒 订单服务收到 POST /orders（clientId=${orderId.value}）`)
  logs.value.push(`📡 OrderService 通过 ClientProxy.send({ cmd: 'deduct_stock' }, { skuId: 'SKU-001', qty: 1 })`)
  logs.value.push(`   ↓ TCP 传输 → 库存服务（port 4001）`)

  await delay()
  if (stockLeft.value <= 0) {
    logs.value.push(`❌ 库存服务 @MessagePattern('deduct_stock')：库存不足，抛 BadRequestException`)
    logs.value.push(`↩️ 订单服务收到错误 → 下单失败（可触发补偿/重试策略）`)
    return
  }

  logs.value.push(`✅ 库存服务 @MessagePattern('deduct_stock')：扣减成功 → 返回 { ok: true, stock: ${stockLeft.value - 1} }`)
  logs.value.push(`   ↑ TCP 响应 → 订单服务`)
  await delay()
  stockLeft.value--
  logs.value.push(`📦 订单服务拿到库存结果，写入订单表 → 订单 #${orderId.value} 创建成功`)

  orders.value.unshift({
    id: orderId.value,
    skuId: 'SKU-001',
    qty: 1,
    status: '已创建（库存已扣）',
  })
  orderId.value++
  logs.value.push(`🔁 请求-响应模式完成：send() 返回 Observable，可 pipe(timeout/retry) 容错`)
}

const transports = [
  { name: 'TCP', desc: '默认传输，简单可靠，适合内部服务间 RPC' },
  { name: 'Redis', desc: '基于发布订阅，适合事件广播与轻量任务' },
  { name: 'gRPC', desc: '强类型契约（.proto），适合跨语言服务' },
  { name: 'Kafka / RabbitMQ', desc: '消息队列，高吞吐事件流与削峰' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 微服务下单 · TCP 请求-响应</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      点击"下单"，观察 <code>订单服务 → 库存服务</code> 之间的 TCP 消息往返（request-response 模式）：
    </p>

    <div class="ms-box">
      <div class="service-row">
        <span class="service-node order">🛒 订单服务<br /><small>port 3000</small></span>
        <span class="service-arrow">⇄ TCP :4001</span>
        <span class="service-node stock">📦 库存服务<br /><small>port 4001</small></span>
      </div>
      <p class="stock-line">库存余量：<strong>{{ stockLeft }}</strong></p>
      <button class="tab-btn active" @click="createOrder">下单（扣库存）</button>
    </div>

    <div v-if="logs.length" class="ms-log">
      <p v-for="(log, i) in logs" :key="i" class="ms-line">{{ log }}</p>
    </div>

    <div v-if="orders.length" class="order-list">
      <p v-for="order in orders" :key="order.id" class="order-line">
        订单 #{{ order.id }} · {{ order.skuId }} × {{ order.qty }} · <strong>{{ order.status }}</strong>
      </p>
    </div>

    <table>
      <thead><tr><th>传输策略</th><th>适用场景</th></tr></thead>
      <tbody>
        <tr v-for="t in transports" :key="t.name">
          <td><code>{{ t.name }}</code></td>
          <td>{{ t.desc }}</td>
        </tr>
      </tbody>
    </table>

    <p class="note">
      <strong>两种消息模式：</strong><code>send()</code> 请求-响应（等待回执），
      <code>emit()</code> 事件（发完即走，下游异步消费）。
    </p>
  </div>
</template>

<style scoped>
.ms-box {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
  margin-bottom: 10px;
}

.service-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.service-node {
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  color: #fff;
}

.service-node.order {
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
}

.service-node.stock {
  background: linear-gradient(135deg, var(--forest), #6b9a4a);
}

.service-node small {
  display: block;
  font-weight: 400;
  opacity: 0.85;
}

.service-arrow {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  font-family: Consolas, Menlo, monospace;
}

.stock-line {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--text);
}

.stock-line strong {
  color: var(--forest);
}

.ms-log {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed var(--border);
  background: var(--surface);
  margin-bottom: 10px;
}

.ms-line {
  margin: 4px 0;
  font-size: 12px;
  color: var(--text);
  font-family: Consolas, Menlo, monospace;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.order-line {
  margin: 0;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--surface-soft);
  font-size: 13px;
  color: var(--text);
}

.order-line strong {
  color: var(--forest);
}

.note {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--muted);
}
</style>
