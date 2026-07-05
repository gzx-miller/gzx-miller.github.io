<script setup lang="ts">
/**
 * 🌰 BrowserWindow 窗口管理
 * 演示窗口配置、生命周期和安全设置
 */
import { ref } from 'vue'

const config = ref({
  width: 800,
  height: 600,
  frame: true,
  transparent: false,
  alwaysOnTop: false,
  resizable: true,
  minimizable: true,
  maximizable: true,
  show: false,
  backgroundColor: '#ffffff'
})

const lifecycleEvents = ref<string[]>([])
const currentEvent = ref('')

function simulateLifecycle() {
  lifecycleEvents.value = []
  const events = [
    'new BrowserWindow(options)',
    'ready-to-show',
    'show',
    'focus',
    'resize',
    'minimize',
    'restore',
    'close',
    'closed'
  ]

  events.forEach((event, idx) => {
    setTimeout(() => {
      lifecycleEvents.value.push(event)
      currentEvent.value = event
    }, idx * 500)
  })
}

const codeExample = ref(`// 主进程 main.js
const { BrowserWindow } = require('electron')

const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  show: false, // 先隐藏，ready-to-show 后再显示
  webPreferences: {
    nodeIntegration: false,    // 必须关闭
    contextIsolation: true,     // 必须开启
    preload: path.join(__dirname, 'preload.js')
  }
})

// 避免白屏：ready-to-show 后再显示
mainWindow.once('ready-to-show', () => {
  mainWindow.show()
})

// 关闭时释放引用（防止内存泄漏）
mainWindow.on('closed', () => {
  mainWindow = null
})`)
</script>

<template>
  <div class="demo-container">
    <h2>🌰 BrowserWindow 窗口管理</h2>
    <p class="description">
      BrowserWindow 是 Electron 创建原生窗口的核心 API。正确配置 <code>webPreferences</code> 是保障应用安全的关键。
    </p>

    <div class="config-panel">
      <h3>窗口配置</h3>
      <div class="config-grid">
        <label>
          宽度: <input type="number" v-model.number="config.width" />
        </label>
        <label>
          高度: <input type="number" v-model.number="config.height" />
        </label>
        <label>
          <input type="checkbox" v-model="config.frame" /> 显示边框
        </label>
        <label>
          <input type="checkbox" v-model="config.alwaysOnTop" /> 总是置顶
        </label>
        <label>
          <input type="checkbox" v-model="config.resizable" /> 可调整大小
        </label>
        <label>
          <input type="checkbox" v-model="config.show" /> 立即显示
        </label>
      </div>
    </div>

    <div class="lifecycle-demo">
      <h3>窗口生命周期</h3>
      <button class="btn" @click="simulateLifecycle">模拟生命周期</button>
      <div class="event-log">
        <div
          v-for="(event, idx) in lifecycleEvents"
          :key="idx"
          class="event-item"
          :class="{ active: event === currentEvent }"
        >
          <span class="event-index">{{ idx + 1 }}</span>
          <span class="event-name">{{ event }}</span>
        </div>
        <p v-if="lifecycleEvents.length === 0" class="hint">点击按钮查看窗口生命周期事件</p>
      </div>
    </div>

    <div class="code-example">
      <h3>核心代码示例</h3>
      <pre><code>{{ codeExample }}</code></pre>
    </div>

    <div class="security-notice">
      <h3>⚠️ 安全提醒</h3>
      <ul>
        <li><strong>nodeIntegration: false</strong> - 渲染进程不能直接使用 Node.js API</li>
        <li><strong>contextIsolation: true</strong> - 预加载脚本与渲染进程上下文隔离</li>
        <li><strong>preload</strong> - 通过预加载脚本安全暴露需要的 API</li>
        <li><strong>webSecurity: true</strong> - 不要设置为 false（除非本地开发）</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 900px; margin: 0 auto; }
.description { color: #666; margin-bottom: 24px; line-height:1.6; }
.config-panel, .lifecycle-demo, .code-example, .security-notice {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.config-grid label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.config-grid input[type="number"] {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
.event-log {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  min-height: 100px;
}
.event-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: background 0.3s;
}
.event-item.active {
  background: #ff6b3520;
  color: #ff6b35;
}
.event-index {
  background: #333;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
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
.security-notice {
  background: #fff3cd;
  border-color: #ffc107;
}
.security-notice h3 { color: #856404; }
.security-notice ul { margin: 0; padding-left: 20px; }
.security-notice li { margin-bottom: 8px; }
.hint { color: #666; font-style: italic; }
</style>
