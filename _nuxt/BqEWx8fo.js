const n=`<script setup>
import { ref, computed } from 'vue'

const locale = ref('zh')
const course = { name: 'Vue3 实战', hours: 36, price: 299, start: new Date(2025, 8, 1) }

// 标签模板函数：根据语言格式化
function i18n(strings, ...values) {
  const dict = {
    zh: { course: '课程', hours: '课时', price: '价格', start: '开课' },
    en: { course: 'Course', hours: 'Hours', price: 'Price', start: 'Start' },
  }
  const d = dict[locale.value]
  return strings.reduce((result, str, i) => {
    const val = values[i]
    const translated = typeof val === 'string' && d[val] ? d[val] : val
    return result + str + (translated ?? '')
  }, '')
}

const output = computed(() => {
  const c = course
  return i18n\`\${'course'}：\${c.name} | \${'hours'}：\${c.hours} | \${'price'}：¥\${c.price} | \${'start'}：\${c.start.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US')}\`
})

// String.raw 获取原始字符串
const rawDemo = ref(String.raw\`换行符不会被解析：\\n \\t \\\\\`)
<\/script>

<template><div class="demo-card">
  <div class="button-row">
    <button @click="locale = 'zh'" :class="{ active: locale === 'zh' }">中文</button>
    <button @click="locale = 'en'" :class="{ active: locale === 'en' }">English</button>
  </div>
  <p>{{ output }}</p>
  <p><code>String.raw</code>：{{ rawDemo }}</p>
  <small>标签模板接收字符串数组和插值参数，可实现 i18n、HTML 转义等 DSL。</small>
</div></template>
`;export{n as default};
