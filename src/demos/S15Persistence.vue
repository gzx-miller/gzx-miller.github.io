<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const persist = ref(true)
const username = ref('')
const cartCount = ref(0)
const hydrated = ref(false)
const mismatch = ref('')
const version = ref(1)

function save() {
  if (!persist.value) return
  localStorage.setItem('demo_state', JSON.stringify({ username: username.value, cartCount: cartCount.value, version: version.value }))
}

function loadFromStorage() {
  const raw = localStorage.getItem('demo_state')
  if (!raw) return
  try {
    const data = JSON.parse(raw)
    if (data.version !== version.value) {
      mismatch.value = `版本不匹配: 存储 v${data.version} vs 当前 v${version.value}，执行迁移`
      localStorage.removeItem('demo_state')
      return
    }
    username.value = data.username || ''
    cartCount.value = data.cartCount || 0
    hydrated.value = true
    mismatch.value = ''
  } catch { mismatch.value = '水合失败: 存储数据损坏' }
}

function clearStorage() {
  localStorage.removeItem('demo_state')
  username.value = ''
  cartCount.value = 0
  hydrated.value = false
  mismatch.value = '已清除本地存储'
}

watch([username, cartCount], save)
onMounted(loadFromStorage)
</script>

<template><div class="demo-card">
  <h4>🌰 状态持久化与水合</h4>
  <label><input type="checkbox" v-model="persist" /> 启用持久化</label>
  <p><input v-model="username" placeholder="用户名" /> | 购物车: <strong>{{ cartCount }}</strong></p>
  <button @click="cartCount++">加购</button>
  <button @click="clearStorage">清除存储</button>
  <button @click="version++">升级版本 (v{{ version }})</button>
  <p v-if="hydrated" style="color:green">✅ 水合成功</p>
  <p v-if="mismatch" style="color:orange">⚠️ {{ mismatch }}</p>
</div></template>
