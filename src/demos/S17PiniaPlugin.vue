<script setup lang="ts">
import { useLearningStore } from '../stores/learning'

const store = useLearningStore()
const logs: string[] = []

function addLog(msg: string) {
  logs.unshift(`${new Date().toLocaleTimeString()} · ${msg}`)
  if (logs.length > 5) logs.pop()
}

function demoPlugin() {
  addLog('调用 enroll 添加新课程')
  store.enroll({ id: Date.now(), title: '插件实战', minutes: 30 })
}
</script>

<template>
  <div class="demo-card">
    <h4>🌰 Pinia 插件机制</h4>
    <p>插件通过 <code>pinia.use()</code> 注入，可为所有 Store 统一添加持久化、日志或错误处理。</p>

    <div style="margin: 12px 0">
      <button @click="demoPlugin">触发 action 并查看日志</button>
    </div>

    <div style="background:#f5f5f5;padding:8px;border-radius:4px;font-size:12px">
      <strong>插件执行日志:</strong>
      <ul style="margin:4px 0 0;padding-left:16px">
        <li v-for="log in logs" :key="log">{{ log }}</li>
        <li v-if="!logs.length" style="color:#999">点击按钮后日志显示在这里</li>
      </ul>
    </div>

    <div style="margin-top:12px;font-size:12px;color:#666">
      <strong>关键代码:</strong>
      <pre style="background:#f0f8e8;padding:8px;border-radius:4px;overflow-x:auto">
// 创建插件
const pinia = createPinia()
pinia.use(({ store }) => {
  store.$onAction(({ name, args }) => {
    console.log(`[Plugin] ${name}`, ...args)
  })
})</pre>
    </div>

    <div style="font-size:12px;color:#888;margin-top:8px">
      <strong>使用场景:</strong> 统一日志、持久化、SSR 状态同步、错误上报
    </div>
  </div>
</template>
