<script setup>
import { reactive, ref } from 'vue'

const messages = ref({})
const form = reactive({})

const rules = {
  username: { test: (v) => v?.length >= 3, msg: '用户名至少 3 个字符' },
  email: { test: (v) => /^[^\s@]+@[^\s@]+$/.test(v), msg: '邮箱格式不正确' },
  age: { test: (v) => v >= 1 && v <= 150, msg: '年龄须在 1-150 之间' },
}

const handler = {
  set(target, prop, value) {
    const rule = rules[prop]
    if (rule) messages.value[prop] = rule.test(value) ? '' : rule.msg
    return Reflect.set(target, prop, value)
  },
  get(target, prop) {
    return Reflect.get(target, prop)
  },
}

const proxy = new Proxy(form, handler)
const fields = [
  { key: 'username', label: '用户名', placeholder: '输入用户名' },
  { key: 'email', label: '邮箱', placeholder: '输入邮箱' },
  { key: 'age', label: '年龄', placeholder: '输入年龄' },
]
</script>

<template><div class="demo-card"><div v-for="f in fields" :key="f.key" class="field"><label>{{ f.label }}</label><input :placeholder="f.placeholder" @input="proxy[f.key] = $event.target.value" /><span v-if="messages[f.key]" class="err">{{ messages[f.key] }}</span></div><small>Proxy 拦截属性读写，Reflect 保证默认行为正确转发。</small></div></template>
