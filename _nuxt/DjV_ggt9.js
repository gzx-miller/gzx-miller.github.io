const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

const courses = ref(['Vue3 组合式 API', 'Pinia 状态管理', 'uni-app 跨端开发', 'Nuxt 文件路由'])
const keyword = ref('')
const logs = ref<string[]>([])
const loaded = ref(false)

const filtered = computed(() => courses.value.filter((c) => c.includes(keyword.value)))

function push(msg: string) {
  logs.value.unshift(msg)
  if (logs.value.length > 5) logs.value.pop()
}
function onLoad() {
  if (!loaded.value) {
    loaded.value = true
    push('onLoad(options)：读取路由参数 id=101')
  }
}
function onShow() {
  push('onShow：页面显示，刷新数据')
}
function onUnload() {
  loaded.value = false
  push('onUnload：页面销毁')
}
<\/script>

<template>
  <div class="demo-card">
    <code class="import">
      import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
    </code>

    <div class="controls">
      <button type="button" @click="onLoad">onLoad</button>
      <button type="button" @click="onShow">onShow</button>
      <button type="button" @click="onUnload">onUnload</button>
    </div>

    <div class="grid">
      <div class="panel">
        <input v-model="keyword" placeholder="用 ref 绑定搜索" />
        <ul>
          <li v-for="c in filtered" :key="c">{{ c }}</li>
        </ul>
        <p v-if="!filtered.length" class="empty">无匹配。</p>
      </div>

      <ol class="log">
        <li v-for="l in logs" :key="l">{{ l }}</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.import {
  display: block;
  overflow-x: auto;
  border-radius: 8px;
  background: var(--surface-soft);
  color: var(--accent-strong);
  padding: 10px 12px;
  font-size: 13px;
  white-space: nowrap;
}
.controls {
  display: flex;
  gap: 10px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.panel {
  display: grid;
  gap: 8px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  padding: 12px;
}
.panel input {
  width: auto;
}
.panel ul {
  margin: 0;
  padding-left: 18px;
}
.panel li {
  padding: 3px 0;
  color: var(--text);
  font-size: 14px;
}
.empty {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
.log {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.log li {
  border-radius: 8px;
  background: var(--surface);
  padding: 8px 12px;
  color: var(--text);
  font-size: 13px;
  animation: fadeInUp 0.25s ease-out;
}
@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>`;export{n as default};
