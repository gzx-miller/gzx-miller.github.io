const e=`<script setup>
import { ref, watch } from 'vue'
const key = ref('course_progress')
const value = ref('')
const stored = ref('')
const storageType = ref('localStorage')

function save() {
  if (storageType.value === 'localStorage') {
    localStorage.setItem(key.value, value.value)
  } else {
    sessionStorage.setItem(key.value, value.value)
  }
  read()
}

function read() {
  if (storageType.value === 'localStorage') {
    stored.value = localStorage.getItem(key.value) ?? '（无）'
  } else {
    stored.value = sessionStorage.getItem(key.value) ?? '（无）'
  }
}

function remove() {
  if (storageType.value === 'localStorage') {
    localStorage.removeItem(key.value)
  } else {
    sessionStorage.removeItem(key.value)
  }
  read()
}

function clearAll() {
  if (storageType.value === 'localStorage') {
    localStorage.clear()
  } else {
    sessionStorage.clear()
  }
  read()
}

// 监听 storage 事件（仅其他标签页触发）
window.addEventListener('storage', (e) => {
  if (e.key === key.value) read()
})
<\/script>

<template>
  <div class="demo-card">
    <h4>Web Storage：localStorage &amp; sessionStorage</h4>
    <div class="row">
      <label><input type="radio" v-model="storageType" value="localStorage" /> localStorage（持久）</label>
      <label><input type="radio" v-model="storageType" value="sessionStorage" /> sessionStorage（会话）</label>
    </div>
    <div class="row">
      <input v-model="key" class="input" placeholder="键名" />
      <input v-model="value" class="input" placeholder="值" style="flex:1" />
    </div>
    <div class="row">
      <button class="btn btn-save" @click="save">保存</button>
      <button class="btn btn-read" @click="read">读取</button>
      <button class="btn btn-del" @click="remove">删除</button>
      <button class="btn btn-clear" @click="clearAll">清空</button>
    </div>
    <p>当前值：<code>{{ stored }}</code></p>
    <p style="font-size:12px;color:#868e96">💡 打开控制台 Application 面板可查看存储内容</p>
  </div>
</template>

<style scoped>
.demo-card { padding: 16px; border: 1px solid #a5d8ff; border-radius: 8px; background: #e7f5ff; font-size: 13px; }
.row { display: flex; gap: 8px; margin: 8px 0; align-items: center; }
.input { padding: 6px 10px; border: 1px solid #a5d8ff; border-radius: 6px; font-size: 13px; }
.btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; color: #fff; }
.btn-save { background: #1971c2; }
.btn-read { background: #2b8a3e; }
.btn-del { background: #c92a2a; }
.btn-clear { background: #868e96; }
code { background: #fff3bf; padding: 2px 6px; border-radius: 4px; }
</style>
`;export{e as default};
