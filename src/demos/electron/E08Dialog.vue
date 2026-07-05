<script setup lang="ts">
import { ref } from 'vue'

const lastResult = ref('')
const dialogType = ref<'open' | 'save' | 'message'>('open')

function simulateOpenDialog() {
  lastResult.value = '已选择文件: /Users/xxx/Documents/report.pdf'
}

function simulateSaveDialog() {
  lastResult.value = '保存位置: /Users/xxx/Desktop/output.json'
}

function simulateMessageDialog() {
  lastResult.value = '用户点击了: OK'
}
</script>

<template>
  <div class="demo-container">
    <h2>🌰 文件对话框</h2>
    <p class="desc">使用 dialog 模块打开文件选择、保存对话框和消息框。</p>

    <div class="dialog-types">
      <button :class="{ active: dialogType === 'open' }" @click="dialogType = 'open'">打开文件</button>
      <button :class="{ active: dialogType === 'save' }" @click="dialogType = 'save'">保存文件</button>
      <button :class="{ active: dialogType === 'message' }" @click="dialogType = 'message'">消息框</button>
    </div>

    <div class="demo-buttons">
      <button class="btn" @click="simulateOpenDialog" v-if="dialogType === 'open'">打开文件对话框</button>
      <button class="btn" @click="simulateSaveDialog" v-if="dialogType === 'save'">打开保存对话框</button>
      <button class="btn" @click="simulateMessageDialog" v-if="dialogType === 'message'">显示消息框</button>
    </div>

    <div class="result" v-if="lastResult">
      {{ lastResult }}
    </div>

    <div class="code-block">
      <h3>Dialog API 示例</h3>
      <pre v-if="dialogType === 'open'">
// 打开文件对话框
const result = await dialog.showOpenDialog(mainWindow, {
  title: '选择文件',
  defaultPath: app.getPath('documents'),
  filters: [
    { name: 'JSON', extensions: ['json'] },
    { name: '所有文件', extensions: ['*'] }
  ],
  properties: ['openFile', 'multiSelections']
})

if (!result.canceled) {
  console.log(result.filePaths)
}</pre>
      <pre v-if="dialogType === 'save'">
// 保存文件对话框
const result = await dialog.showSaveDialog(mainWindow, {
  title: '保存文件',
  defaultPath: 'output.json',
  filters: [
    { name: 'JSON', extensions: ['json'] }
  ]
})

if (!result.canceled) {
  fs.writeFileSync(result.filePath, data)
}</pre>
      <pre v-if="dialogType === 'message'">
// 消息框
const result = await dialog.showMessageBox(mainWindow, {
  type: 'question',
  title: '确认',
  message: '是否保存更改?',
  buttons: ['保存', '不保存', '取消'],
  defaultId: 0,
  cancelId: 2
})

console.log(result.response) // 0, 1, 2</pre>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 800px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.dialog-types { display: flex; gap: 12px; margin-bottom: 20px; }
.dialog-types button { padding: 10px 20px; border: 2px solid #e0e0e0; background: white; border-radius: 8px; cursor: pointer; }
.dialog-types button.active { border-color: #ff6b35; color: #ff6b35; }
.demo-buttons { margin-bottom: 20px; }
.btn { background: #ff6b35; color: white; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; }
.result { background: #e8f5e9; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
</style>
