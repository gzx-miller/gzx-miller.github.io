<script setup>
import { ref } from 'vue'

const phone = ref('')
const email = ref('')
const idcard = ref('')

const patterns = {
  phone: { re: /^1[3-9]\d{9}$/, msg: '请输入正确的 11 位手机号' },
  email: { re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: '邮箱格式不正确' },
  idcard: { re: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, msg: '身份证号格式不正确' },
}

function validate(field) {
  const val = field === 'phone' ? phone.value : field === 'email' ? email.value : idcard.value
  const { re, msg } = patterns[field]
  return val === '' ? '' : re.test(val) ? '✓' : msg
}
</script>

<template><div class="demo-card"><div class="field"><label>手机号</label><input v-model="phone" placeholder="13800138000" /><span :class="validate('phone') === '✓' ? 'ok' : 'err'">{{ validate('phone') }}</span></div><div class="field"><label>邮箱</label><input v-model="email" placeholder="user@example.com" /><span :class="validate('email') === '✓' ? 'ok' : 'err'">{{ validate('email') }}</span></div><div class="field"><label>身份证号</label><input v-model="idcard" placeholder="110101199001011234" /><span :class="validate('idcard') === '✓' ? 'ok' : 'err'">{{ validate('idcard') }}</span></div><small>正则 test() 实时校验输入，匹配返回 true。</small></div></template>
