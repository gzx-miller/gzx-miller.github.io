const n=`<script setup lang="ts">
import { reactive, ref } from 'vue'

const logs = ref<string[]>([])
const global = reactive({
  launched: false,
  isLogin: false,
  userInfo: '',
})

function push(msg: string) {
  logs.value.unshift(msg)
  if (logs.value.length > 6) logs.value.pop()
}

function launch() {
  global.launched = true
  global.isLogin = true
  global.userInfo = '小松鼠 <squirrel-token>'
  push('onLaunch：读缓存初始化全局状态')
  push('onShow：应用进入前台')
}
function background() {
  push('onHide：应用进入后台，保存草稿')
}
function foreground() {
  push('onShow：从后台回前台')
}
function error() {
  push('onError：捕获未处理异常并上报')
}
<\/script>

<template>
  <div class="demo-card">
    <div class="row">
      <button type="button" :disabled="global.launched" @click="launch">启动</button>
      <button type="button" :disabled="!global.launched" @click="background">切后台</button>
      <button type="button" :disabled="!global.launched" @click="foreground">回前台</button>
      <button type="button" @click="error">触发异常</button>
    </div>

    <div class="grid">
      <div class="panel">
        <p class="cap">globalData 全局数据</p>
        <p class="kv"><span>isLogin</span><code>{{ global.isLogin }}</code></p>
        <p class="kv"><span>userInfo</span><code>{{ global.userInfo || '—' }}</code></p>
        <p class="tip">页面侧用 getApp().globalData 读取</p>
      </div>

      <ol class="log">
        <li v-for="l in logs" :key="l">{{ l }}</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.panel {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  padding: 12px;
}
.cap {
  margin: 0 0 10px;
  color: var(--text);
  font-weight: 700;
  font-size: 14px;
}
.kv {
  display: flex;
  justify-content: space-between;
  margin: 0 0 6px;
  color: var(--muted);
  font-size: 13px;
}
.kv code {
  border-radius: 5px;
  background: var(--surface-soft);
  color: var(--chestnut);
  padding: 1px 6px;
}
.tip {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 12px;
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
