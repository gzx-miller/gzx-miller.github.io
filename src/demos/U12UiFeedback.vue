<script setup lang="ts">
import { ref } from 'vue'

const toast = ref('')
const modalOpen = ref(false)
const loading = ref(false)
const sheetOpen = ref(false)
const result = ref('')

const sheetItems = ['分享海报', '复制链接', '举报']

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 1400)
}

async function submit() {
  loading.value = true
  await new Promise((r) => setTimeout(r, 1200))
  loading.value = false
  showToast('已完成')
}

function pick(i: number) {
  result.value = sheetItems[i]
  sheetOpen.value = false
}

function confirmDelete() {
  modalOpen.value = false
  result.value = '确认删除'
  showToast('已删除')
}
</script>

<template>
  <div class="demo-card">
    <div class="row">
      <button type="button" @click="showToast('报名成功')">轻提示</button>
      <button type="button" @click="modalOpen = true">删除确认</button>
      <button type="button" @click="submit">提交订单</button>
      <button type="button" @click="sheetOpen = true">更多操作</button>
    </div>

    <p class="result">{{ result || '点击上方按钮，体验各类交互反馈。' }}</p>

    <div v-if="toast" class="toast">{{ toast }}</div>

    <div v-if="modalOpen" class="overlay" @click.self="modalOpen = false">
      <div class="dialog">
        <h4>删除课程</h4>
        <p>删除后不可恢复，确定吗？</p>
        <div class="actions">
          <button type="button" class="ghost" @click="modalOpen = false">取消</button>
          <button type="button" @click="confirmDelete">确定</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="overlay">
      <div class="spinner-box">
        <span class="spinner" />
        <p>提交中…</p>
      </div>
    </div>

    <div v-if="sheetOpen" class="sheet-mask" @click.self="sheetOpen = false">
      <div class="sheet">
        <button v-for="(it, i) in sheetItems" :key="it" type="button" @click="pick(i)">{{ it }}</button>
        <button type="button" class="cancel" @click="sheetOpen = false">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.result {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  border-radius: 8px;
  background: rgba(50, 25, 15, 0.9);
  color: #fff;
  padding: 9px 16px;
  font-size: 14px;
}
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.35);
}
.dialog {
  width: min(320px, 88vw);
  border-radius: 14px;
  background: var(--surface);
  padding: 20px;
}
.dialog h4 {
  margin: 0 0 8px;
  color: var(--text);
}
.dialog p {
  margin: 0 0 16px;
  color: var(--muted);
  font-size: 14px;
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.ghost {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
}
.spinner-box {
  display: grid;
  gap: 12px;
  justify-items: center;
  border-radius: 12px;
  background: var(--surface);
  padding: 24px 32px;
}
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.spinner-box p {
  margin: 0;
  color: var(--muted);
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.sheet-mask {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.35);
}
.sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 14px 14px 0 0;
  background: var(--surface);
}
.sheet button {
  text-align: center;
}
.sheet .cancel {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
}
</style>