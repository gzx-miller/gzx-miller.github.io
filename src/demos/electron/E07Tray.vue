<script setup lang="ts">
import { ref } from 'vue'

const trayActions = ref<string[]>([])
const isTrayActive = ref(false)

function toggleTray() {
  isTrayActive.value = !isTrayActive.value
  trayActions.value.push(isTrayActive.value ? '创建托盘图标' : '移除托盘图标')
}

function simulateTrayClick() {
  if (!isTrayActive.value) return
  trayActions.value.push('托盘图标被点击 - 显示/隐藏窗口')
}

function simulateRightClick() {
  if (!isTrayActive.value) return
  trayActions.value.push('右键点击托盘 - 显示上下文菜单')
  trayActions.value.push('菜单项"显示"被点击')
}
</script>

<template>
  <div class="demo-container">
    <h2>🌰 系统托盘</h2>
    <p class="desc">创建系统托盘图标，实现托盘菜单、气泡通知和点击交互。</p>

    <div class="tray-controls">
      <button class="btn" @click="toggleTray">
        {{ isTrayActive ? '移除托盘图标' : '创建托盘图标' }}
      </button>
      <button class="btn secondary" @click="simulateTrayClick" :disabled="!isTrayActive">
        模拟左键点击
      </button>
      <button class="btn secondary" @click="simulateRightClick" :disabled="!isTrayActive">
        模拟右键点击
      </button>
    </div>

    <div class="tray-visual" :class="{ active: isTrayActive }">
      <div class="tray-icon">📌</div>
      <div class="tray-label">My Electron App</div>
    </div>

    <div class="action-log">
      <h3>操作日志</h3>
      <div v-for="(action, idx) in trayActions" :key="idx" class="log-item">
        {{ action }}
      </div>
      <p v-if="trayActions.length === 0" class="hint">点击按钮查看托盘操作</p>
    </div>

    <div class="code-block">
      <h3>托盘代码示例</h3>
      <pre>
// 主进程
const { Tray, Menu } = require('electron')
const path = require('path')

const tray = new Tray(path.join(__dirname, 'icon.png'))

const contextMenu = Menu.buildFromTemplate([
  { label: '显示', click: () => mainWindow.show() },
  { label: '关于', click: () => showAbout() },
  { type: 'separator' },
  { label: '退出', click: () => app.quit() }
])

tray.setToolTip('My Electron App')
tray.setContextMenu(contextMenu)

// 点击托盘图标切换窗口显示
tray.on('click', () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
  }
})</pre>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 800px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.tray-controls { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.btn { background: #ff6b35; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.btn.secondary { background: #666; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.tray-visual { display: flex; align-items: center; gap: 12px; padding: 16px; background: #f5f5f5; border-radius: 12px; margin-bottom: 20px; opacity: 0.3; }
.tray-visual.active { opacity: 1; background: #fff5f0; border: 2px solid #ff6b35; }
.tray-icon { font-size: 32px; }
.tray-label { font-size: 14px; color: #666; }
.action-log { background: #f9f9f9; padding: 16px; border-radius: 12px; margin-bottom: 20px; }
.action-log h3 { margin: 0 0 12px 0; }
.log-item { padding: 8px; background: #1e1e1e; color: #d4d4d4; border-radius: 4px; margin-bottom: 4px; font-family: monospace; font-size: 13px; }
.hint { color: #666; font-style: italic; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
</style>
