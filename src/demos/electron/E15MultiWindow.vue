<script setup lang="ts">
import { ref } from 'vue'

const windows = ref([
  { id: 1, title: '主窗口', type: 'main', status: 'open' },
  { id: 2, title: '设置窗口', type: 'settings', status: 'closed' },
  { id: 3, title: '关于窗口', type: 'about', status: 'closed' }
])

function openWindow(id: number) {
  const win = windows.value.find(w => w.id === id)
  if (win) win.status = 'open'
}

function closeWindow(id: number) {
  const win = windows.value.find(w => w.id === id)
  if (win) win.status = 'closed'
}

function broadcast() {
  alert('向所有窗口发送消息: "refresh-data"')
}
</script>

<template>
  <div class="demo-container">
    <h2>🌰 多窗口管理</h2>
    <p class="desc">管理多个应用窗口，实现窗口间通信、数据共享和状态同步。</p>

    <div class="windows-grid">
      <div v-for="win in windows" :key="win.id" class="window-card" :class="{ open: win.status === 'open' }">
        <h3>{{ win.title }}</h3>
        <p>类型: {{ win.type }}</p>
        <p>状态: {{ win.status === 'open' ? '✅ 打开' : '❌ 关闭' }}</p>
        <div class="window-actions">
          <button v-if="win.status === 'closed'" class="btn" @click="openWindow(win.id)">打开</button>
          <button v-if="win.status === 'open'" class="btn danger" @click="closeWindow(win.id)">关闭</button>
        </div>
      </div>
    </div>

    <button class="btn broadcast" @click="broadcast">广播消息到所有窗口</button>

    <div class="code-block">
      <h3>多窗口管理代码示例</h3>
      <pre>
// 主进程 - 窗口管理
const windows = new Map()

function createWindow(type: string) {
  const win = new BrowserWindow({...})
  windows.set(win.id, { window: win, type })
  
  win.on('closed', () => {
    windows.delete(win.id) // 释放引用
  })
  
  return win
}

// 窗口间通信
function broadcastToAll(channel: string, data: any) {
  windows.forEach(({ window }) => {
    window.webContents.send(channel, data)
  })
}

// 渲染进程 - 接收广播
ipcRenderer.on('refresh-data', (event, data) => {
  console.log('收到广播:', data)
})</pre>
    </div>

    <div class="tips">
      <h3>多窗口管理要点</h3>
      <ul>
        <li><strong>窗口引用管理</strong>: 使用 Map 或对象存储窗口引用</li>
        <li><strong>内存泄漏预防</strong>: 窗口 closed 事件中释放引用</li>
        <li><strong>窗口间通信</strong>: 通过主进程中转或共享存储</li>
        <li><strong>macOS 特殊处理</strong>: 所有窗口关闭后应用仍运行</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 900px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.windows-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-bottom: 20px; }
.window-card { background: #f9f9f9; padding: 20px; border-radius: 12px; border: 2px solid #e0e0e0; }
.window-card.open { border-color: #4caf50; background: #4caf5010; }
.window-card h3 { margin: 0 0 8px 0; }
.window-card p { margin: 0 0 8px 0; color: #666; font-size: 14px; }
.window-actions { display: flex; gap: 8px; }
.btn { background: #ff6b35; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; }
.btn.danger { background: #f44336; }
.broadcast { background: #2196f3; margin-bottom: 20px; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
.tips { background: #fff3e0; padding: 20px; border-radius: 12px; }
.tips ul { margin: 0; padding-left: 20px; }
.tips li { margin-bottom: 8px; line-height: 1.6; }
</style>
