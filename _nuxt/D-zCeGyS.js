const e=`<script setup>
import { ref, computed } from 'vue'

const keyword = ref('vue')
const courses = [
  'Vue3 入门到进阶', 'Vue3 组合式 API 详解', 'Node.js 全栈开发',
  'TypeScript 实战指南', 'Vue3 + Pinia 状态管理',
]

// 搜索并高亮匹配
const results = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return courses.map((c) => ({ text: c, highlighted: c }))
  return courses.filter((c) => c.toLowerCase().includes(kw)).map((c) => {
    // matchAll 找所有匹配位置，replaceAll 高亮
    const escaped = kw.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&')
    const highlighted = c.replaceAll(new RegExp(\`(\${escaped})\`, 'gi'), '【$1】')
    return { text: c, highlighted }
  })
})

// Intl 格式化
const price = 129900
const priceZh = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(price)
const priceEn = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price / 7.2)
const dateZh = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'full' }).format(new Date())
<\/script>

<template><div class="demo-card">
  <input v-model="keyword" placeholder="搜索课程（试试输入 vue）" />
  <ul><li v-for="r in results" :key="r.text">{{ r.highlighted }}</li></ul>
  <p>中文价格：{{ priceZh }} | 美元：{{ priceEn }}</p>
  <p>今日日期：{{ dateZh }}</p>
  <small>includes/matchAll/replaceAll 处理字符串搜索；Intl API 处理货币、日期、排序的国际化格式。</small>
</div></template>
`;export{e as default};
