<script setup>
import { ref } from 'vue'

const status = ref('')
const errorDetail = ref('')

class ValidationError extends Error {
  constructor(field, message) {
    super(message, { cause: { field } })
    this.name = 'ValidationError'
  }
}
class NetworkError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NetworkError'
  }
}

async function submitForm(name, simulate) {
  status.value = '提交中…'
  errorDetail.value = ''
  try {
    if (!name || name.length < 2) {
      throw new ValidationError('name', '姓名至少 2 个字符')
    }
    if (simulate === 'network') {
      throw new NetworkError('服务器无响应 (503)')
    }
    status.value = `✅ 报名成功：${name}`
  } catch (err) {
    status.value = `❌ ${err.name}`
    const chain = err.cause ? ` → 字段：${err.cause.field}` : ''
    errorDetail.value = `${err.message}${chain}`
  } finally {
    if (!errorDetail.value && status.value.includes('❌')) {
      /* keep error visible */
    }
  }
}
</script>

<template><div class="demo-card"><div class="button-row"><button @click="submitForm('小松鼠', null)">正常提交</button><button @click="submitForm('A', null)">触发校验错误</button><button @click="submitForm('小松鼠', 'network')">模拟网络异常</button></div><p role="status">{{ status }}</p><p v-if="errorDetail" class="err">{{ errorDetail }}</p><small>自定义异常类区分错误类型，cause 属性串联错误链。</small></div></template>
