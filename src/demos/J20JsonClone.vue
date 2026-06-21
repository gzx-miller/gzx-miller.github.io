<script setup>
import { ref } from 'vue'

const output = ref('')
const courseData = {
  name: 'Vue3 进阶', price: 399, date: new Date(2025, 9, 15),
  students: [{ id: 1, name: '小明', enrolled: true }],
}

// 自定义 replacer：过滤敏感字段、格式化日期
function exportJson() {
  const json = JSON.stringify(courseData, (key, value) => {
    if (key === 'id') return undefined          // 移除 id
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    return value
  }, 2)
  output.value = json
}

// 自定义 reviver：还原日期字符串
function importJson() {
  const json = output.value
  const restored = JSON.parse(json, (key, value) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(value)
    return value
  })
  output.value = `还原后 date 类型：${typeof restored.date} → ${restored.date.constructor.name}`
}

// structuredClone：支持循环引用
function deepCopy() {
  const obj = { name: '课程A', tags: ['热门'] }
  obj.self = obj  // 循环引用
  const copy = structuredClone(obj)
  output.value = `深拷贝成功：self 引用 ${copy.self === copy ? '正确' : '错误'}，tags 独立 ${copy.tags !== obj.tags}`
}
</script>

<template><div class="demo-card">
  <div class="button-row">
    <button @click="exportJson">导出 JSON</button>
    <button @click="importJson">导入还原</button>
    <button @click="deepCopy">深拷贝（含循环引用）</button>
  </div>
  <pre class="code-block">{{ output || '点击按钮查看结果' }}</pre>
  <small>JSON.stringify/parse 通过 replacer/reviver 自定义序列化；structuredClone 支持循环引用深拷贝。</small>
</div></template>
