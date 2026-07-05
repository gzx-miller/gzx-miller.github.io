<script setup lang="ts">
import { ref } from 'vue'

const updateStatus = ref<string>('idle')
const updateEvents = ref<string[]>([])

function simulateCheck() {
  updateEvents.value = []
  updateStatus.value = 'checking'
  updateEvents.value.push('checking-for-update')
  
  setTimeout(() => {
    updateStatus.value = 'available'
    updateEvents.value.push('update-available: v2.0.0')
  }, 1000)
  
  setTimeout(() => {
    updateStatus.value = 'downloading'
    updateEvents.value.push('download-progress: 45%')
  }, 2000)
  
  setTimeout(() => {
    updateStatus.value = 'downloaded'
    updateEvents.value.push('update-downloaded')
    updateEvents.value.push('提示用户重启应用完成更新')
  }, 3500)
}
</script>

<template>
  <div class="demo-container">
    <h2>🌰 自动更新</h2>
    <p class="desc">使用 autoUpdater 实现应用自动更新，掌握更新事件处理。</p>

    <button class="btn" @click="simulateCheck">检查更新</button>

    <div class="status-panel">
      <div class="status" :class="updateStatus">
        状态: {{ updateStatus }}
      </div>
    </div>

    <div class="event-log">
      <h3>更新事件</h3>
      <div v-for="(event, idx) in updateEvents" :key="idx" class="event">
        {{ event }}
      </div>
      <p v-if="updateEvents.length === 0" class="hint">点击"检查更新"查看更新流程</p>
    </div>

    <div class="code-block">
      <h3>autoUpdater 事件</h3>
      <pre>
// 主进程
const { autoUpdater } = require('electron-updater')

autoUpdater.setFeedURL('https://update.example.com')

autoUpdater.on('checking-for-update', () => {
  console.log('正在检查更新...')
})

autoUpdater.on('update-available', (info) => {
  console.log('发现新版本:', info.version)
})

autoUpdater.on('download-progress', (progress) => {
  console.log('下载进度:', progress.percent)
})

autoUpdater.on('update-downloaded', () => {
  // 提示用户重启
  dialog.showMessageBox({
    type: 'info',
    title: '更新就绪',
    message: '新版本已下载，重启后生效',
    buttons: ['重启', '稍后']
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})</pre>
    </div>

    <div class="tips">
      <h3>更新服务器配置</h3>
      <ul>
        <li><strong>macOS</strong>: 需要代码签名和公证</li>
        <li><strong>Windows</strong>: 需要 Authenticode 签名</li>
        <li><strong>Linux</strong>: 使用 AppImage 或 deb/rpm</li>
        <li><strong>推荐</strong>: 使用 electron-builder 的 electron-updater</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 800px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.btn { background: #ff6b35; color: white; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
.status-panel { margin-bottom: 20px; }
.status { padding: 12px; border-radius: 8px; font-weight: bold; }
.status.idle { background: #f5f5f5; }
.status.checking { background: #fff3e0; }
.status.available { background: #e3f2fd; }
.status.downloading { background: #fff9c4; }
.status.downloaded { background: #e8f5e9; }
.event-log { background: #f9f9f9; padding: 16px; border-radius: 12px; margin-bottom: 20px; }
.event-log h3 { margin: 0 0 12px 0; }
.event { padding: 8px; background: #1e1e1e; color: #d4d4d4; border-radius: 4px; margin-bottom: 4px; font-family: monospace; font-size: 13px; }
.hint { color: #666; font-style: italic; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
.tips { background: #e3f2fd; padding: 20px; border-radius: 12px; }
.tips ul { margin: 0; padding-left: 20px; }
.tips li { margin-bottom: 8px; line-height: 1.6; }
</style>
