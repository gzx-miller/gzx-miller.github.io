<script setup lang="ts">
import { reactive, ref } from 'vue'

interface LogItem {
  hook: string
  desc: string
}

const logs = ref<LogItem[]>([])
let seq = 0

const state = reactive({
  loaded: false,
  shown: false,
})

function push(hook: string, desc: string) {
  logs.value.unshift({ hook, desc })
  if (logs.value.length > 8) logs.value.pop()
}

function enter() {
  state.loaded = true
  state.shown = true
  push('onLoad', '页面首次创建，读取路由参数并初始化')
  push('onShow', '页面进入前台，刷新数据')
}
function show() {
  state.shown = true
  push('onShow', '从后台返回前台，重新可见')
}
function hide() {
  state.shown = false
  push('onHide', '页面切走但未销毁，暂停计时/轮询')
}
function unload() {
  state.loaded = false
  state.shown = false
  push('onUnload', '页面销毁，清理定时器与监听')
  logs.value = []
}
</script>

<template>
  <div class="demo-card">
    <div class="row">
      <button type="button" @click="enter">进入页面</button>
      <button type="button" :disabled="!state.loaded" @click="show">返回前台</button>
      <button type="button" :disabled="!state.shown" @click="hide">切走后</button>
      <button type="button" :disabled="!state.loaded" @click="unload">退出页面</button>
    </div>

    <div class="status" :class="{ hidden: !state.shown }">
      {{ state.shown ? '页面在前台，数据可见' : '页面已隐藏' }}
    </div>

    <ol class="log">
      <li v-for="item in logs" :key="item.desc">
        <code>{{ item.hook }}</code>
        <span>{{ item.desc }}</span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.status {
  border-radius: 10px;
  background: rgba(123, 181, 86, 0.16);
  color: var(--forest);
  padding: 10px 14px;
  font-size: 14px;
}
.status.hidden {
  background: var(--surface-soft);
  color: var(--muted);
}
.log {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.log li {
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 8px;
  background: var(--surface);
  padding: 8px 12px;
  animation: fadeInUp 0.25s ease-out;
}
.log code {
  min-width: 76px;
  border-radius: 6px;
  background: var(--surface-soft);
  color: var(--accent-strong);
  padding: 2px 6px;
  font-size: 12px;
}
.log span {
  color: var(--muted);
  font-size: 13px;
}
</style>