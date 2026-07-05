<script setup lang="ts">
/**
 * 🌰 IPC 进程间通信
 * 演示 invoke/handle 模式和事件通信
 */
import { ref } from 'vue'

const communicationMode = ref<'invoke' | 'send'>('invoke')
const logs = ref<Array<{time: string, direction: string, data: string}>>([])
const inputText = ref('')

function addLog(direction: string, data: string) {
  const time = new Date().toLocaleTimeString()
  logs.value.push({ time, direction, data })
}

function demoInvoke() {
  logs.value = []
  addLog('渲染进程 →', 'ipcRenderer.invoke("ping")')
  setTimeout(() => {
    addLog('主进程 ←', 'ipcMain.handle("ping") 处理中...')
  }, 500)
  setTimeout(() => {
    addLog('主进程 →', 'return "pong"')
  }, 1000)
  setTimeout(() => {
    addLog('渲染进程 ←', 'Promise resolve: "pong"')
  }, 1500)
}

function demoSend() {
  logs.value = []
  addLog('渲染进程 →', 'ipcRenderer.send("async-message", data)')
  setTimeout(() => {
    addLog('主进程 ←', 'ipcMain.on("async-message") 接收')
  }, 500)
  setTimeout(() => {
    addLog('主进程 →', 'event.reply("async-reply", response)')
  }, 1000)
  setTimeout(() => {
    addLog('渲染进程 ←', 'ipcRenderer.on("async-reply") 接收回复')
  }, 1500)
}

const codeExamples = {
  invoke: `// 主进程
ipcMain.handle('get-app-info', async (event, args) => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    platform: process.platform
  }
})

// 预加载脚本
contextBridge.exposeInMainWorld('api', {
  getAppInfo: () => ipcRenderer.invoke('get-app-info')
})

// 渲染进程
const info = await window.api.getAppInfo()`,
  send: `// 主进程
ipcMain.on('save-data', (event, data) => {
  fs.writeFileSync(path, JSON.stringify(data))
  event.reply('save-data-reply', { success: true })
})

// 渲染进程
ipcRenderer.send('save-data', formData)
ipcRenderer.on('save-data-reply', (event, result) => {
  console.log('保存结果:', result)
})`
}
</script>

<template>
  <div class="demo-container">
    <h2>🌰 IPC 进程间通信</h2>
    <p class="description">
      Electron 提供多种 IPC 模式：<code>invoke/handle</code>（Promise 风格，推荐）和
      <code>send/on</code>（事件风格，适合单向通信）。
    </p>

    <div class="mode-selector">
      <button
        :class="{ active: communicationMode === 'invoke' }"
        @click="communicationMode = 'invoke'"
      >invoke/handle 模式（推荐）</button>
      <button
        :class="{ active: communicationMode === 'send' }"
        @click="communicationMode = 'send'"
      >send/on 模式</button>
    </div>

    <div class="demo-section">
      <h3>通信演示</h3>
      <div class="demo-controls">
        <input
          v-model="inputText"
          placeholder="输入测试数据..."
          class="input"
        />
        <button class="btn" @click="communicationMode === 'invoke' ? demoInvoke() : demoSend()">
          发送 IPC 消息
        </button>
      </div>

      <div class="ipc-visualization">
        <div class="process renderer">
          <h4>渲染进程</h4>
          <div class="code-snippet">
            <pre v-if="communicationMode === 'invoke'">ipcRenderer.invoke('channel')</pre>
            <pre v-else>ipcRenderer.send('channel', data)</pre>
          </div>
        </div>

        <div class="ipc-arrow">↕️</div>

        <div class="process main">
          <h4>主进程</h4>
          <div class="code-snippet">
            <pre v-if="communicationMode === 'invoke'">ipcMain.handle('channel', handler)</pre>
            <pre v-else>ipcMain.on('channel', callback)</pre>
          </div>
        </div>
      </div>

      <div class="log-panel">
        <h4>通信日志</h4>
        <div class="log-entries">
          <div v-for="(log, idx) in logs" :key="idx" class="log-entry">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-direction">{{ log.direction }}</span>
            <span class="log-data">{{ log.data }}</span>
          </div>
          <p v-if="logs.length === 0" class="hint">点击"发送 IPC 消息"查看通信流程</p>
        </div>
      </div>
    </div>

    <div class="code-example">
      <h3>代码示例 - {{ communicationMode === 'invoke' ? 'invoke/handle' : 'send/on' }} 模式</h3>
      <pre><code>{{ codeExamples[communicationMode] }}</code></pre>
    </div>

    <div class="best-practices">
      <h3>最佳实践</h3>
      <ul>
        <li><strong>优先使用 invoke/handle</strong>：支持异步返回，错误处理更清晰</li>
        <li><strong>通道名使用常量</strong>：避免魔法字符串，集中管理</li>
        <li><strong>不要传递大量数据</strong>：IPC 会序列化/反序列化，大文件用路径</li>
        <li><strong>预加载脚本封装</strong>：渲染进程不直接使用 ipcRenderer</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 1000px; margin: 0 auto; }
.description { color: #666; margin-bottom: 24px; line-height:1.6; }
.mode-selector { display: flex; gap: 12px; margin-bottom: 24px; }
.mode-selector button {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}
.mode-selector button.active {
  border-color: #ff6b35;
  background: #fff5f0;
  color: #ff6b35;
}
.demo-section { margin-bottom: 24px; }
.demo-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}
.btn {
  background: #ff6b35;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.ipc-visualization {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}
.process {
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid;
}
.process.renderer {
  border-color: #4ec9b0;
  background: #4ec9b010;
}
.process.main {
  border-color: #569cd6;
  background: #569cd610;
}
.process h4 { margin: 0 0 12px 0; }
.code-snippet pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  margin: 0;
}
.ipc-arrow {
  font-size: 32px;
  color: #ff6b35;
}
.log-panel {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.log-panel h4 { margin: 0 0 12px 0; }
.log-entries {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  min-height: 80px;
  max-height: 200px;
  overflow-y: auto;
}
.log-entry {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 13px;
}
.log-time { color: #858585; }
.log-direction { color: #ff6b35; }
.log-data { color: #ce9178; }
.code-example {
  margin-bottom: 24px;
}
.code-example pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}
.best-practices {
  background: #e8f5e9;
  padding: 20px;
  border-radius: 12px;
}
.best-practices ul { margin: 0; padding-left: 20px; }
.best-practices li { margin-bottom: 8px; line-height: 1.6; }
.hint { color: #666; font-style: italic; }
</style>
