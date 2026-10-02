const n=`<script setup lang="ts">
import { ref } from 'vue'

const stack = ref<string[]>(['首页'])
const status = ref('')

function navigateTo() {
  stack.value.push(\`课程详情 #\${stack.value.length}\`)
  status.value = 'navigateTo：推入新页，保留当前页，可返回'
}
function redirectTo() {
  stack.value[stack.value.length - 1] = \`登录页 → 首页 #\${stack.value.length - 1}\`
  status.value = 'redirectTo：替换当前页，返回时不再回到登录页'
}
function switchTab() {
  stack.value = ['首页', '我的']
  status.value = 'switchTab：切换到 tabBar 页，关闭其他非 tab 页'
}
function navigateBack() {
  if (stack.value.length > 1) stack.value.pop()
  status.value = 'navigateBack：返回上一页'
}
<\/script>

<template>
  <div class="demo-card">
    <div class="row">
      <button type="button" @click="navigateTo">navigateTo</button>
      <button type="button" @click="redirectTo">redirectTo</button>
      <button type="button" @click="switchTab">switchTab</button>
      <button type="button" :disabled="stack.length <= 1" @click="navigateBack">navigateBack</button>
    </div>

    <div class="stack">
      <div
        v-for="(p, i) in stack"
        :key="i"
        class="page"
        :style="{ height: \`\${58 + i * 22}px\` }"
      >
        <span class="no">{{ i + 1 }}</span>
        {{ p }}
      </div>
    </div>

    <p class="status">{{ status || '页面栈视图：新页叠加在旧页之上，返回则逐层弹出。' }}</p>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page {
  display: flex;
  gap: 8px;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  padding: 10px 12px;
  font-size: 13px;
  transition: height 0.25s ease;
}
.no {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 12px;
}
.status {
  margin: 0;
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--muted);
  font-size: 13px;
}
</style>`;export{n as default};
