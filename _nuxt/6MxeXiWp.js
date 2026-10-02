const n=`<script setup>
import { ref } from 'vue'
const log = ref('')
const connected = ref(false)
let ws = null

function connect() {
  log.value += '正在连接…\\n'
  ws = new WebSocket('wss://echo.websocket.org')

  ws.onopen = () => {
    connected.value = true
    log.value += '✅ 已连接\\n'
  }

  ws.onmessage = (e) => {
    log.value += \`📩 收到：\${e.data}\\n\`
  }

  ws.onerror = (e) => {
    log.value += '❌ 连接出错\\n'
  }

  ws.onclose = () => {
    connected.value = false
    log.value += '🔌 连接关闭\\n'
  }
}

function send() {
  if (ws && connected.value) {
    ws.send('Hello WebSocket!')
    log.value += '📤 发送：Hello WebSocket!\\n'
  }
}

function close() {
  ws?.close()
}
<\/script>

<template>
  <div class="demo-card">
    <h4>WebSocket 实时通信</h4>
    <div class="row">
      <button class="btn" :class="{ active: connected }" @click="connect" :disabled="connected">连接</button>
      <button class="btn" @click="send" :disabled="!connected">发送消息</button>
      <button class="btn btn-close" @click="close" :disabled="!connected">关闭</button>
    </div>
    <pre class="output">{{ log || '（日志为空）' }}</pre>
    <p style="font-size:12px;color:#868e96">💡 WebSocket 建立后，服务端可主动推送消息到客户端</p>
  </div>
</template>

<style scoped>
.demo-card { padding: 16px; border: 1px solid #a5d8ff; border-radius: 8px; background: #e7f5ff; font-size: 13px; }
.row { display: flex; gap: 8px; margin: 8px 0; }
.btn { padding: 6px 14px; background: #1971c2; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn.active { background: #2b8a3e; }
.btn-close { background: #c92a2a; }
.output { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; min-height: 120px; white-space: pre-wrap; overflow: auto; }
</style>
`;export{n as default};
