const e=`<script setup>
import { ref, onUnmounted } from 'vue'

const messages = ref([])
const status = ref('断开')
let timer = null

const sampleMessages = ['大家好！', '服务器已部署完毕', '收到，马上处理', '心跳检测正常']

function connect() {
  status.value = '连接中…'
  setTimeout(() => {
    status.value = '已连接'
    messages.value.push({ from: '系统', text: '握手完成，连接已建立', time: '00:00' })
    let sec = 1
    timer = setInterval(() => {
      if (messages.value.length >= 8) return disconnect()
      const isPing = messages.value.length % 3 === 2
      messages.value.push({
        from: isPing ? '系统' : '用户' + (sec % 3 + 1),
        text: isPing ? '🏓 pong' : sampleMessages[sec % sampleMessages.length],
        time: String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0')
      })
      sec++
    }, 800)
  }, 600)
}

function disconnect() {
  clearInterval(timer)
  timer = null
  status.value = '断开'
  messages.value.push({ from: '系统', text: '连接已关闭，3 秒后尝试重连…', time: '--:--' })
}

onUnmounted(() => clearInterval(timer))
<\/script>

<template><div class="demo-card">
  <p>WebSocket 提供全双工通信。此模拟演示握手、消息广播、心跳与断线重连流程。</p>
  <div class="ws-header">
    <span>状态：<strong :class="status === '已连接' ? 'ws-on' : 'ws-off'">{{ status }}</strong></span>
    <button @click="status === '已连接' ? disconnect() : connect()">{{ status === '已连接' ? '断开连接' : '建立连接' }}</button>
  </div>
  <div class="ws-log">
    <div v-for="(m, i) in messages" :key="i" :class="{ sys: m.from === '系统' }">
      <span class="ws-time">{{ m.time }}</span> <strong>{{ m.from }}：</strong>{{ m.text }}
    </div>
    <div v-if="!messages.length" class="ws-empty">点击上方按钮开始模拟连接</div>
  </div>
  <small>真实场景使用 <code>ws</code> 或 <code>socket.io</code> 库，配合心跳包和指数退避重连策略。</small>
</div></template>

<style scoped>
.ws-header { display: flex; align-items: center; gap: 1rem; margin: 0.6rem 0; }
.ws-on { color: #4caf50; }
.ws-off { color: #e53935; }
.ws-log { max-height: 160px; overflow-y: auto; border: 1px solid var(--border, #ddd); border-radius: 6px; padding: 0.5rem; font-size: 0.85rem; margin-bottom: 0.6rem; }
.ws-log .sys { color: #888; font-style: italic; }
.ws-time { color: #aaa; font-size: 0.75rem; margin-right: 0.3rem; }
.ws-empty { color: #bbb; text-align: center; padding: 1rem; }
</style>
`;export{e as default};
