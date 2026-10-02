const n=`<script setup lang="ts">
import { ref, provide, inject, type InjectionKey, type App } from 'vue'

// ---- 模拟插件定义 ----
// 插件必须提供 install 方法，app.use() 时自动调用
const notificationLog = ref<string[]>([])

// 插件提供的全局方法（通过 provide/inject 注入）
const notifyKey: InjectionKey<(msg: string) => void> = Symbol('notify')

function createNotificationPlugin() {
  return {
    install(app: App, options?: { prefix?: string }) {
      const prefix = options?.prefix ?? '[通知]'

      // 1. 注册全局组件
      // app.component('GlobalNotification', NotificationComponent)

      // 2. 注册全局指令
      // app.directive('notify', NotifyDirective)

      // 3. 通过 provide 注入全局方法
      app.provide(notifyKey, (msg: string) => {
        notificationLog.value.unshift(\`\${prefix} \${msg} (\${new Date().toLocaleTimeString()})\`)
      })

      // 4. 添加全局属性（不推荐，推荐 provide/inject）
      // app.config.globalProperties.$notify = ...
    }
  }
}

// 模拟 app.use 安装插件（这里无法真正调用 app.use，所以手动模拟 provide）
createNotificationPlugin()
provide(notifyKey, (msg: string) => {
  notificationLog.value.unshift(\`[通知] \${msg} (\${new Date().toLocaleTimeString()})\`)
})

// 组件中通过 inject 使用插件能力
const notify = inject(notifyKey)!

function sendNotify(type: string) {
  const messages: Record<string, string> = {
    success: '课程创建成功！',
    warning: '积分即将用完',
    error: '网络请求失败',
    info: '新版本已发布',
  }
  notify(messages[type] ?? type)
}

// 插件代码展示
const pluginCode = \`// notificationPlugin.ts
import type { App, InjectionKey } from 'vue'

export const NotifyKey: InjectionKey<(msg: string) => void> =
  Symbol('notify')

export default {
  install(app: App, options?: { prefix?: string }) {
    const prefix = options?.prefix ?? '[通知]'

    // 注册全局组件
    app.component('GlobalNotify', NotifyComponent)

    // 通过 provide 注入方法
    app.provide(NotifyKey, (msg: string) => {
      showToast(prefix + ' ' + msg)
    })
  }
}

// 使用：app.use(notificationPlugin, { prefix: '🌰' })\`
<\/script>

<template>
  <div class="demo-card">
    <h3>插件开发</h3>

    <!-- 插件使用演示 -->
    <div class="demo-section">
      <h4>插件能力演示</h4>
      <div class="button-row">
        <button class="btn success" @click="sendNotify('success')">成功通知</button>
        <button class="btn warning" @click="sendNotify('warning')">警告通知</button>
        <button class="btn error" @click="sendNotify('error')">错误通知</button>
        <button class="btn info" @click="sendNotify('info')">信息通知</button>
      </div>
      <div class="notify-log">
        <div v-for="(log, i) in notificationLog.slice(0, 5)" :key="i" class="log-item">{{ log }}</div>
        <div v-if="notificationLog.length === 0" class="empty">点击按钮发送通知</div>
      </div>
    </div>

    <!-- 插件代码 -->
    <div class="code-section">
      <h4>插件定义代码</h4>
      <pre class="code-block">{{ pluginCode }}</pre>
    </div>

    <!-- 使用方式 -->
    <div class="usage-section">
      <h4>使用方式</h4>
      <pre class="code-block">// main.ts
import notificationPlugin from './plugins/notificationPlugin'
app.use(notificationPlugin, { prefix: '🌰' })

// 组件中使用
import { inject } from 'vue'
import { NotifyKey } from './plugins/notificationPlugin'
const notify = inject(NotifyKey)!
notify('课程已更新')</pre>
    </div>
  </div>
</template>

<style scoped>
.demo-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
h4 { margin: 0 0 10px; color: #8b5e3c; font-size: 14px; }
.button-row { display: flex; gap: 8px; margin-bottom: 12px; }
.btn { padding: 6px 14px; border: none; border-radius: 4px; cursor: pointer; color: #fff; font-size: 13px; }
.btn.success { background: #6b9e78; }
.btn.warning { background: #d4a574; }
.btn.error { background: #c8503c; }
.btn.info { background: #6b8ec8; }
.notify-log { background: #fff; border: 1px solid #e8c9a0; border-radius: 6px; padding: 10px; max-height: 150px; overflow-y: auto; }
.log-item { font-size: 13px; color: #5a3e2b; padding: 4px 0; border-bottom: 1px solid #f5ebe0; }
.empty { color: #a0623a; font-size: 13px; font-style: italic; }
.code-section, .usage-section { background: #f0f7f2; border: 1px solid #a8d5b8; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
.code-block { margin: 8px 0 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #2d5a3a; }
</style>
`;export{n as default};
