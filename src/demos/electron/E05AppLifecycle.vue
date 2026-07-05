<script setup lang="ts">
import { ref } from 'vue'

const events = ref<string[]>([])
const platform = ref<'mac' | 'win' | 'linux'>('win')

function simulateLifecycle() {
  events.value = []
  const allEvents = [
    { name: 'app.whenReady()', desc: 'Electron 初始化完成' },
    { name: 'browser-window-created', desc: '创建主窗口' },
    { name: 'web-contents-created', desc: 'WebContents 创建' },
    { name: 'window-all-closed', desc: '所有窗口关闭' },
    { name: platform.value === 'mac' ? 'app.activate' : 'app.quit', desc: platform.value === 'mac' ? 'Dock 图标点击' : '退出应用' },
    { name: 'before-quit', desc: '退出前清理' },
    { name: 'will-quit', desc: '即将退出' },
    { name: 'quit', desc: '应用已退出' }
  ]

  allEvents.forEach((e, idx) => {
    setTimeout(() => {
      events.value.push(`✓ ${e.name} - ${e.desc}`)
    }, idx * 600)
  })
}
</script>

<template>
  <div class="demo-container">
    <h2>🌰 应用生命周期</h2>
    <p class="desc">掌握 app 模块的生命周期事件，实现正确的启动和退出逻辑。</p>

    <div class="platform-selector">
      <label><input type="radio" v-model="platform" value="mac" /> macOS</label>
      <label><input type="radio" v-model="platform" value="win" /> Windows</label>
      <label><input type="radio" v-model="platform" value="linux" /> Linux</label>
    </div>

    <button class="btn" @click="simulateLifecycle">模拟生命周期</button>

    <div class="events">
      <div v-for="(e, idx) in events" :key="idx" class="event">{{ e }}</div>
      <p v-if="events.length === 0" class="hint">点击按钮查看生命周期事件</p>
    </div>

    <div class="code-block">
      <h3>单例应用实现</h3>
      <pre>
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.whenReady().then(createWindow)
  app.on('second-instance', (e, argv, cwd) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}</pre>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 800px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.platform-selector { display: flex; gap: 20px; margin-bottom: 20px; }
.platform-selector label { cursor: pointer; }
.btn { background: #ff6b35; color: white; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
.events { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-family: monospace; min-height: 100px; margin-bottom: 20px; }
.event { padding: 8px; border-bottom: 1px solid #333; }
.hint { color: #666; font-style: italic; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; }
</style>
