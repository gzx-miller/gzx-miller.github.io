<script setup lang="ts">
import { ref } from 'vue'

const running = ref(false)
const logs = ref<string[]>([])
const role = ref<'server' | 'client'>('server')

function simulateServer() {
  running.value = true
  logs.value = []
  logs.value.push('[Server] 创建 TCP 服务器...')
  logs.value.push('[Server] 监听端口 8080...')
  setTimeout(() => {
    logs.value.push('[Server] 服务器已启动，等待客户端连接...')
    setTimeout(() => {
      logs.value.push('[Server] 客户端已连接（socket）')
      logs.value.push('[Server] 收到数据: "Hello TCP!"')
      setTimeout(() => {
        logs.value.push('[Server] 发送响应: "Hello from Server!"')
        logs.value.push('[Server] 连接关闭')
        running.value = false
      }, 500)
    }, 800)
  }, 600)
}

function simulateClient() {
  running.value = true
  logs.value = []
  logs.value.push('[Client] 连接到服务器 127.0.0.1:8080...')
  setTimeout(() => {
    logs.value.push('[Client] 连接成功！')
    logs.value.push('[Client] 发送数据: "Hello TCP!"')
    setTimeout(() => {
      logs.value.push('[Client] 收到响应: "Hello from Server!"')
      logs.value.push('[Client] 断开连接')
      running.value = false
    }, 500)
  }, 800)
}
</script>

<template><div class="demo-card">
  <p><code>net</code> 模块提供 TCP 服务器和客户端能力，是 HTTP 模块的底层基础。</p>

  <div class="net-controls">
    <button :disabled="running" @click="simulateServer">模拟 TCP 服务器</button>
    <button :disabled="running" @click="simulateClient">模拟 TCP 客户端</button>
  </div>

  <div v-if="logs.length" class="net-log">
    <div v-for="(log, i) in logs" :key="i" :class="log.startsWith('[Server]') ? 'log-server' : 'log-client'">
      {{ log }}
    </div>
  </div>

  <div class="net-example">
    <strong>TCP 服务器示例：</strong>
    <pre class="mini-code"><code>const net = require('node:net')

const server = net.createServer((socket) => {
  console.log('客户端连接:', socket.remoteAddress)

  socket.on('data', (data) => {
    console.log('收到:', data.toString())
    socket.write('Hello from Server!')
  })

  socket.on('end', () => {
    console.log('客户端断开')
  })
})

server.listen(8080, () => {
  console.log('TCP 服务器监听 8080 端口')
})</code></pre>
  </div>

  <div class="net-example">
    <strong>TCP 客户端示例：</strong>
    <pre class="mini-code"><code>const net = require('node:net')

const client = net.createConnection({ port: 8080 }, () => {
  console.log('连接到服务器')
  client.write('Hello TCP!')
})

client.on('data', (data) => {
  console.log('收到响应:', data.toString())
  client.end()
})

client.on('end', () => {
  console.log('断开连接')
})</code></pre>
  </div>

  <small>要点：TCP 是面向连接的可靠传输协议；<code>net</code> 模块基于 Stream；HTTP 服务器底层就是 TCP 服务器。</small>
</div></template>

<style scoped>
.net-controls { display: flex; gap: 10px; margin: 0.6rem 0; }
.net-log { background: #1e1e2e; color: #cdd6f4; padding: 8px 12px; border-radius: 6px; font-size: 11px; line-height: 1.7; margin: 0.6rem 0; font-family: monospace; max-height: 200px; overflow-y: auto; }
.log-server { color: #a6e3a1; }
.log-client { color: #89b4fa; }
.net-example { margin: 0.8rem 0; }
.net-example strong { display: block; margin-bottom: 4px; color: #e8590c; }
</style>
