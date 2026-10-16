const n=`<script setup>
import { ref } from 'vue'

const log = ref('')

// 位运算权限模型
const READ = 0b001    // 1
const WRITE = 0b010   // 2
const ADMIN = 0b100   // 4

const userPerm = ref(0)

function grant(flag) {
  userPerm.value |= flag   // OR：添加权限
  log.value = \`授予权限后：\${userPerm.value.toString(2).padStart(3, '0')}（\${permLabel()})\`
}

function revoke(flag) {
  userPerm.value &= ~flag  // AND NOT：移除权限
  log.value = \`移除权限后：\${userPerm.value.toString(2).padStart(3, '0')}（\${permLabel()}）\`
}

function toggle(flag) {
  userPerm.value ^= flag   // XOR：切换权限
  log.value = \`切换权限后：\${userPerm.value.toString(2).padStart(3, '0')}（\${permLabel()}）\`
}

function check(flag) {
  const has = !!(userPerm.value & flag)
  log.value = \`检查权限：\${has ? '✓ 拥有' : '✗ 没有'}\`
}

function permLabel() {
  const p = userPerm.value
  return [p & READ ? '读' : '', p & WRITE ? '写' : '', p & ADMIN ? '管理' : ''].filter(Boolean).join('+') || '无'
}
<\/script>

<template><div class="demo-card">
  <p>当前权限位：<code>{{ userPerm.toString(2).padStart(3, '0') }}</code>（{{ permLabel() }}）</p>
  <div class="button-row">
    <button @click="grant(READ)">+读</button>
    <button @click="grant(WRITE)">+写</button>
    <button @click="grant(ADMIN)">+管理</button>
    <button @click="revoke(WRITE)">-写</button>
    <button @click="toggle(ADMIN)">切换管理</button>
    <button @click="check(READ)">检查读</button>
  </div>
  <p>{{ log || '点击按钮操作权限' }}</p>
  <small>位运算用二进制位表示权限开关；OR 添加、AND 检查、XOR 切换、AND NOT 移除。</small>
</div></template>
`;export{n as default};
