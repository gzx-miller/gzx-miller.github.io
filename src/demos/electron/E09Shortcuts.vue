<script setup lang="ts">
import { ref } from 'vue'

const registeredShortcuts = ref<string[]>([])
const shortcutInput = ref('')

const commonShortcuts = [
  'CmdOrCtrl+Shift+K',
  'CmdOrCtrl+Alt+N',
  'F11',
  'CmdOrCtrl+Space'
]

function registerShortcut(shortcut: string) {
  if (registeredShortcuts.value.includes(shortcut)) {
    registeredShortcuts.value = registeredShortcuts.value.filter(s => s !== shortcut)
  } else {
    registeredShortcuts.value.push(shortcut)
  }
}

function simulateTrigger(shortcut: string) {
  alert(`快捷键触发: ${shortcut}`)
}
</script>

<template>
  <div class="demo-container">
    <h2>🌰 全局快捷键</h2>
    <p class="desc">注册全局快捷键（即使应用未聚焦）和菜单快捷键。</p>

    <div class="shortcut-list">
      <h3>常用快捷键</h3>
      <div v-for="shortcut in commonShortcuts" :key="shortcut" class="shortcut-item">
        <label>
          <input
            type="checkbox"
            :checked="registeredShortcuts.includes(shortcut)"
            @change="registerShortcut(shortcut)"
          />
          <code>{{ shortcut }}</code>
        </label>
        <button
          v-if="registeredShortcuts.includes(shortcut)"
          class="trigger-btn"
          @click="simulateTrigger(shortcut)"
        >
          模拟触发
        </button>
      </div>
    </div>

    <div class="code-block">
      <h3>globalShortcut 示例</h3>
      <pre>
// 注册全局快捷键
globalShortcut.register('CmdOrCtrl+Shift+K', () => {
  console.log('全局快捷键触发')
  mainWindow.show()
})

// 检查是否已注册
if (globalShortcut.isRegistered('CmdOrCtrl+K')) {
  console.log('快捷键已被注册')
}

// 退出时注销所有快捷键
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// 菜单快捷键（无需手动注册）
const menu = Menu.buildFromTemplate([
  {
    label: '视图',
    submenu: [
      {
        label: '开发者工具',
        accelerator: 'CmdOrCtrl+Option+I',
        click: () => mainWindow.webContents.toggleDevTools()
      }
    ]
  }
])</pre>
    </div>

    <div class="tips">
      <h3>注意事项</h3>
      <ul>
        <li>全局快捷键可能与其他应用冲突，注册前应检查</li>
        <li>macOS 的 Cmd 对应 Windows/Linux 的 Ctrl</li>
        <li>应用退出时必须调用 unregisterAll() 释放快捷键</li>
        <li>菜单快捷键通过 accelerator 属性定义，自动注册</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 800px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.shortcut-list { margin-bottom: 20px; }
.shortcut-list h3 { margin: 0 0 12px 0; }
.shortcut-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f9f9f9; border-radius: 8px; margin-bottom: 8px; }
.shortcut-item label { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.shortcut-item code { background: #e0e0e0; padding: 4px 8px; border-radius: 4px; font-size: 13px; }
.trigger-btn { background: #ff6b35; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
.tips { background: #fff3e0; padding: 20px; border-radius: 12px; }
.tips ul { margin: 0; padding-left: 20px; }
.tips li { margin-bottom: 8px; line-height: 1.6; }
</style>
