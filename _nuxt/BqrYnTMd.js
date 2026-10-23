const t=`<script setup lang="ts">
import { reactive, ref } from 'vue'

// 模拟 Valtio 的 proxy() — Vue reactive 本身就是 Proxy
const state = reactive({ price: 99, qty: 1, name: 'Vue3 实战课' })
const snapshots = ref<{ price: number; qty: number; name: string }[]>([])

// 模拟 snapshot() — 深拷贝当前状态
function takeSnapshot() {
  snapshots.value.push(JSON.parse(JSON.stringify(state)))
}

function addQty() { state.qty++ }
function setPrice(p: number) { state.price = p }
<\/script>

<template><div class="demo-card">
  <h4>🌰 Valtio 与 Proxy 响应式</h4>
  <p>课程: {{ state.name }} | 单价: ¥{{ state.price }} | 数量: {{ state.qty }}</p>
  <p>总价: <strong>¥{{ state.price * state.qty }}</strong></p>
  <button @click="addQty">数量 +1（直接修改 proxy）</button>
  <button @click="setPrice(79)">降价到 ¥79</button>
  <button @click="setPrice(99)">恢复 ¥99</button>
  <button @click="takeSnapshot">📸 snapshot()</button>
  <div v-if="snapshots.length" style="margin-top:8px;font-size:13px">
    <p>快照记录 ({{ snapshots.length }}):</p>
    <div v-for="(s, i) in snapshots" :key="i" style="color:#888">
      #{{ i + 1 }}: 单价 ¥{{ s.price }} × {{ s.qty }}
    </div>
  </div>
</div></template>
`;export{t as default};
