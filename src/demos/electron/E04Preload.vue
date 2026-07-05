<script setup lang="ts">
/**
 * 🌰 预加载脚本与安全桥接
 * 演示 contextBridge 的正确使用方式
 */
import { ref } from 'vue'

const unsafeMode = ref(false)
const logs = ref<string[]>([])

function demonstrateSafe() {
  logs.value = []
  logs.value.push('✅ 预加载脚本中:')
  logs.value.push('contextBridge.exposeInMainWorld("api", {')
  logs.value.push('  getVersion: () => ipcRenderer.invoke("get-version"),')
  logs.value.push('  saveFile: (data) => ipcRenderer.invoke("save-file", data),')
  logs.value.push('  // 只暴露需要的方法，不暴露整个 ipcRenderer')
  logs.value.push('})')
  logs.value.push('')
  logs.value.push('✅ 渲染进程中:')
  logs.value.push('const version = await window.api.getVersion()')
  logs.value.push('await window.api.saveFile(data)')
}

function demonstrateUnsafe() {
  logs.value = []
  logs.value.push('❌ 危险做法:')
  logs.value.push('contextBridge.exposeInMainWorld("api", {')
  logs.value.push('  ipcRenderer: ipcRenderer  // 暴露整个 ipcRenderer!')
  logs.value.push('})')
  logs.value.push('')
  logs.value.push('❌ 攻击者可:')
  logs.value.push('window.api.ipcRenderer.invoke("evil-channel", data)')
  logs.value.push('// 可调用任意 IPC 通道，甚至执行系统命令')
}

const preloadCode = ref(`// preload.js - 安全写法
const { contextBridge, ipcRenderer } = require('electron')

// ✅ 只暴露需要的方法
contextBridge.exposeInMainWorld('api', {
  // 应用信息
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getPlatform: () => process.platform,

  // 文件操作
  saveFile: (data) => ipcRenderer.invoke('file:save', data),
  openFile: () => ipcRenderer.invoke('file:open'),

  // 窗口操作
  minimize: () => ipcRenderer.send('window:minimize'),
  close: () => ipcRenderer.send('window:close')
})

// ❌ 危险写法 - 不要这样做!
// contextBridge.exposeInMainWorld('electron', {
//   ipcRenderer: ipcRenderer  // 暴露整个 ipcRenderer
// })
`)
</script>

<template>
  <div class="demo-container">
    <h2>🌰 预加载脚本与安全桥接</h2>
    <p class="description">
      预加载脚本在渲染进程加载前运行，是唯一能同时访问 Node.js 和 Electron API 的地方。
      通过 <code>contextBridge</code> 安全暴露 API 是 Electron 安全模型的核心。
    </p>

    <div class="comparison">
      <div class="mode-card safe">
        <h3>✅ 安全写法</h3>
        <p>只暴露白名单方法</p>
        <button class="btn safe-btn" @click="demonstrateSafe">查看安全示例</button>
      </div>
      <div class="mode-card unsafe">
        <h3>❌ 危险写法</h3>
        <p>暴露整个 API 对象</p>
        <button class="btn unsafe-btn" @click="demonstrateUnsafe">查看危险示例</button>
      </div>
    </div>

    <div class="code-panel">
      <h3>预加载脚本示例</h3>
      <pre><code>{{ preloadCode }}</code></pre>
    </div>

    <div class="log-panel" v-if="logs.length > 0">
      <h3>代码示例</h3>
      <div class="log-entries">
        <div v-for="(log, idx) in logs" :key="idx" class="log-entry" :class="{ error: log.includes('❌'), success: log.includes('✅') }">
          {{ log }}
        </div>
      </div>
    </div>

    <div class="explanation">
      <h3>核心概念</h3>
      <div class="concept-grid">
        <div class="concept">
          <h4>上下文隔离 (Context Isolation)</h4>
          <p>预加载脚本和运行在 renderer 中的 JavaScript 运行在不同的上下文。这意味着预加载脚本访问的 <code>window</code> 对象与渲染进程访问的 <code>window</code> 对象不同。</p>
        </div>
        <div class="concept">
          <h4>contextBridge</h4>
          <p>唯一能在隔离上下文之间安全传递数据的方式。通过 <code>exposeInMainWorld</code> 暴露的 API 会自动处理数据类型转换，防止原型链污染攻击。</p>
        </div>
        <div class="concept">
          <h4>为什么不能直接暴露 ipcRenderer?</h4>
          <p>如果暴露整个 <code>ipcRenderer</code>，渲染进程（可能被 XSS 攻击）可以调用任意 IPC 通道，甚至触发主进程的敏感操作（如删除文件、执行命令）。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 1000px; margin: 0 auto; }
.description { color: #666; margin-bottom: 24px; line-height:1.6; }
.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}
.mode-card {
  padding: 24px;
  border-radius: 12px;
  border: 2px solid;
}
.mode-card.safe {
  border-color: #4caf50;
  background: #4caf5010;
}
.mode-card.unsafe {
  border-color: #f44336;
  background: #f4433610;
}
.mode-card h3 { margin: 0 0 8px 0; }
.mode-card p { margin: 0 0 16px 0; color: #666; }
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
}
.safe-btn { background: #4caf50; color: white; }
.unsafe-btn { background: #f44336; color: white; }
.code-panel {
  margin-bottom: 24px;
}
.code-panel pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}
.log-panel {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.log-panel h3 { margin: 0 0 12px 0; }
.log-entries {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  max-height: 300px;
  overflow-y: auto;
}
.log-entry {
  margin-bottom: 4px;
  font-size: 13px;
  white-space: pre-wrap;
}
.log-entry.success { color: #4caf50; }
.log-entry.error { color: #f44336; }
.explanation {
  background: #e3f2fd;
  padding: 20px;
  border-radius: 12px;
}
.concept-grid {
  display: grid;
  gap: 16px;
}
.concept {
  background: white;
  padding: 16px;
  border-radius: 8px;
}
.concept h4 { margin: 0 0 8px 0; color: #1976d2; }
.concept p { margin: 0; color: #666; line-height: 1.6; }
.concept code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
</style>
