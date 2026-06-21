<script setup>
import { ref, computed } from 'vue'

const locale = ref('zh-CN')
const count = ref(3)

const messages = {
  'zh-CN': { greeting: '你好', items: '{n} 个商品', updated: '更新于 {date}', price: '价格：{n}' },
  'en-US': { greeting: 'Hello', items: '{n} item | {n} items', updated: 'Updated on {date}', price: 'Price: {n}' }
}

const localeLabel = computed(() => locale.value === 'zh-CN' ? '中文' : 'English')

function t(key) {
  const msg = messages[locale.value]?.[key] ?? key
  if (key === 'items' && locale.value === 'en-US') {
    return msg.split(' | ')[count.value === 1 ? 0 : 1].replace('{n}', count.value)
  }
  return msg.replace('{n}', count.value)
}

const formatDate = computed(() => {
  const d = new Date()
  return locale.value === 'zh-CN'
    ? `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const formatPrice = computed(() => {
  return locale.value === 'zh-CN'
    ? `¥${(count.value * 29.9).toFixed(2)}`
    : `$${(count.value * 4.99).toFixed(2)}`
})

const namespaces = {
  common: ['greeting', 'ok', 'cancel'],
  shop: ['items', 'price', 'checkout'],
  admin: ['dashboard', 'users', 'settings']
}
</script>

<template><div class="demo-card">
  <p>国际化方案需处理多语言切换、复数规则、日期与数字格式化、以及按命名空间懒加载。</p>
  <div class="toggle-row">
    <button :class="{ active: locale === 'zh-CN' }" @click="locale = 'zh-CN'">中文 zh-CN</button>
    <button :class="{ active: locale === 'en-US' }" @click="locale = 'en-US'">English en-US</button>
  </div>
  <div class="i18n-preview">
    <p>{{ t('greeting') }}！</p>
    <label>商品数量 <input type="range" v-model.number="count" min="0" max="10" /> {{ count }}</label>
    <p>{{ t('items') }}</p>
    <p>{{ t('price') }}：{{ formatPrice }}</p>
    <p>{{ t('updated').replace('{date}', formatDate) }}</p>
  </div>
  <strong>命名空间组织</strong>
  <pre class="mini-code"><code>{{ JSON.stringify(namespaces, null, 2) }}</code></pre>
  <small>大型项目按页面或模块拆分命名空间，配合按需加载减少初始包体积。复数规则因语言而异（如英语单复数、俄语多复数形式）。</small>
</div></template>

<style scoped>
.i18n-preview { padding: 0.6rem 0.8rem; border: 1px solid var(--border, #ddd); border-radius: 6px; margin: 0.6rem 0; }
.i18n-preview p { margin: 0.3rem 0; }
</style>
