<script setup lang="ts">
/**
 * 🌰 Electron 架构与进程模型
 * 通过可视化图表理解 Electron 的主进程、渲染进程和预加载脚本三角色
 */
import { ref, onMounted } from 'vue'

const activeProcess = ref<string>('main')
const ipcMessages = ref<Array<{from: string, to: string, msg: string}>>([])

function sendIPC(from: string, to: string, msg: string) {
  ipcMessages.value.push({ from, to, msg })
}

function demoIPCCall() {
  ipcMessages.value = []
  sendIPC('渲染进程', '预加载脚本', 'invoke("get-app-version")')
  setTimeout(() => sendIPC('预加载脚本', '主进程', 'ipcMain.handle 调用'), 300)
  setTimeout(() => sendIPC('主进程', '预加载脚本', '返回 app.getVersion()'), 600)
  setTimeout(() => sendIPC('预加载脚本', '渲染进程', 'Promise resolve 版本号'), 900)
}

const architecture = ref({
  mainProcess: {
    name: '主进程 (Main Process)',
    responsibilities: ['应用生命周期管理', '原生 API 调用', '窗口管理', 'IPC 主进程端'],
    apis: ['app', 'BrowserWindow', 'ipcMain', 'Tray', 'Menu', 'dialog']
  },
  preloadScript: {
    name: '预加载脚本 (Preload Script)',
    responsibilities: ['上下文桥接', 'API 白名单暴露', 'Node.js 能力受限访问'],
    apis: ['contextBridge', 'ipcRenderer（受限）']
  },
  rendererProcess: {
    name: '渲染进程 (Renderer Process)',
    responsibilities: ['UI 渲染', '用户交互', '前端框架运行'],
    apis: ['DOM API', 'window.api（暴露的）', '前端框架']
  }
})
</script>

<template>
  <div class="demo-container">
    <h2>🌰 Electron 进程模型</h2>
    <p class="description">
      Electron 应用由三种进程组成：<strong>主进程</strong>管理应用生命周期和原生能力，
      <strong>渲染进程</strong>运行 Web 页面，<strong>预加载脚本</strong>在上下文隔离下安全桥接两者。
    </p>

    <div class="architecture-diagram">
      <div
        class="process-card"
        :class="{ active: activeProcess === 'main' }"
        @click="activeProcess = 'main'"
      >
        <h3>🖥️ 主进程</h3>
        <p>package.json 的 main 脚本运行在此进程</p>
        <div class="api-list">
          <span v-for="api in architecture.mainProcess.apis" :key="api" class="api-tag">{{ api }}</span>
        </div>
      </div>

      <div class="arrow">↕️ IPC</div>

      <div
        class="process-card"
        :class="{ active: activeProcess === 'preload' }"
        @click="activeProcess = 'preload'"
      >
        <h3>🔌 预加载脚本</h3>
        <p>在渲染进程加载前运行，可访问两者 API</p>
        <div class="api-list">
          <span v-for="api in architecture.preloadScript.apis" :key="api" class="api-tag">{{ api }}</span>
        </div>
      </div>

      <div class="arrow">↕️ 上下文桥接</div>

      <div
        class="process-card"
        :class="{ active: activeProcess === 'renderer' }"
        @click="activeProcess = 'renderer'"
      >
        <h3>🎨 渲染进程</h3>
        <p>每个 BrowserWindow 实例一个进程</p>
        <div class="api-list">
          <span v-for="api in architecture.rendererProcess.apis" :key="api" class="api-tag">{{ api }}</span>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>IPC 通信演示</h3>
      <button class="btn" @click="demoIPCCall">模拟 IPC 调用</button>
      <div class="ipc-log">
        <div
          v-for="(msg, idx) in ipcMessages"
          :key="idx"
          class="ipc-message"
        >
          <span class="msg-from">{{ msg.from }}</span>
          <span class="msg-arrow">→</span>
          <span class="msg-to">{{ msg.to }}</span>
          <span class="msg-content">{{ msg.msg }}</span>
        </div>
        <p v-if="ipcMessages.length === 0" class="hint">点击按钮查看 IPC 通信流程</p>
      </div>
    </div>

    <div class="key-points">
      <h3>核心要点</h3>
      <ul>
        <li><strong>主进程唯一</strong>：整个应用只有一个主进程</li>
        <li><strong>渲染进程隔离</strong>：每个窗口独立进程，崩溃不影响其他窗口</li>
        <li><strong>上下文隔离</strong>：预加载脚本和运行时的 HTML/JS 运行在不同上下文</li>
        <li><strong>安全桥接</strong>：通过 contextBridge.exposeInMainWorld 暴露受限 API</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}
.description {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}
.architecture-diagram {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}
.process-card {
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}
.process-card.active {
  border-color: #ff6b35;
  background: #fff5f0;
}
.process-card h3 {
  margin: 0 0 8px 0;
  color: #333;
}
.process-card p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}
.api-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.api-tag {
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  color: #555;
}
.arrow {
  text-align: center;
  font-size: 24px;
  color: #ff6b35;
}
.demo-section {
  margin-bottom: 32px;
}
.btn {
  background: #ff6b35;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 16px;
}
.ipc-log {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  min-height: 100px;
}
.ipc-message {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.msg-from { color: #4ec9b0; }
.msg-to { color: #569cd6; }
.msg-arrow { color: #ff6b35; }
.msg-content { color: #ce9178; margin-left: 8px; }
.hint { color: #666; font-style: italic; }
.key-points {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
}
.key-points ul {
  margin: 0;
  padding-left: 20px;
}
.key-points li {
  margin-bottom: 8px;
  line-height: 1.6;
}
</style>
