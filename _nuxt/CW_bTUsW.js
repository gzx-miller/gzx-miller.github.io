const n=`// ========== 1. 安全配置基线 main.js ==========
const { app, BrowserWindow, session, ipcMain, shell } = require('electron')
const path = require('path')

function createSecureWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 开启上下文隔离（默认 true，显式声明更安全）
      contextIsolation: true,
      // 关闭 Node.js 集成（默认 false，必须关闭）
      nodeIntegration: false,
      // 启用沙箱（进一步限制渲染进程）
      sandbox: true,
      // 指定预加载脚本
      preload: path.join(__dirname, 'preload.js'),
      // 开启 Web 安全（默认 true，禁止改成 false）
      webSecurity: true,
      // 禁止混合内容（默认 false，保持关闭）
      allowRunningInsecureContent: false,
      // 禁用 <webview> 标签（如不需要）
      webviewTag: false
      // 说明: remote 模块已在 Electron 14 移除，无需也无法再配置 enableRemoteModule；
      // 新窗口统一由 setWindowOpenHandler 管控，nativeWindowOpen 选项已废弃。
    }
  })

  // 加载本地文件
  win.loadFile('index.html')

  return win
}

// ========== 2. 内容安全策略 (CSP) ==========
// 方式一: 在 HTML 的 <meta> 标签中设置
// index.html:
// <head>
//   <meta
//     http-equiv="Content-Security-Policy"
//     content="
//       default-src 'self';
//       script-src 'self';
//       style-src 'self' 'unsafe-inline';
//       img-src 'self' data:;
//       connect-src 'self' https://api.example.com;
//       font-src 'self';
//       object-src 'none';
//       base-uri 'self';
//       form-action 'self';
//       frame-ancestors 'none';
//     "
//   >
// </head>

// 方式二: 在主进程中通过 session 设置
app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
        ]
      }
    })
  })
})

// 常用 CSP 指令:
// default-src    - 默认策略
// script-src     - 脚本来源
// style-src      - 样式来源
// img-src        - 图片来源
// connect-src    - 网络请求 (XHR, WebSocket, fetch)
// font-src       - 字体来源
// object-src     - 插件来源 (通常设为 'none')
// media-src      - 音视频来源
// frame-src      - iframe 来源
// frame-ancestors - 可嵌入的父页面 (通常设为 'none')

// ========== 3. 预加载脚本安全实践 ==========
// preload.js - 正确示例
const { contextBridge, ipcRenderer } = require('electron')

// 只暴露必要的 API，不要暴露整个 ipcRenderer
contextBridge.exposeInMainWorld('electronAPI', {
  // 白名单通道，每个通道单独暴露
  getUserSettings: () => ipcRenderer.invoke('settings:get'),
  saveUserSettings: (settings) => ipcRenderer.invoke('settings:save', settings),

  // 事件监听也要有对应的移除方法
  onNotification: (callback) => {
    ipcRenderer.on('notification', (_event, data) => callback(data))
  },
  removeNotificationListener: () => {
    ipcRenderer.removeAllListeners('notification')
  }
})

// ❌ 错误做法: 直接暴露 ipcRenderer
// contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)

// ❌ 错误做法: 暴露任意通道的发送方法
// send: (channel, data) => ipcRenderer.send(channel, data)

// ========== 4. IPC 安全验证 ==========
// main.js - IPC 处理时进行参数验证和权限检查

const fs = require('fs/promises')

// 白名单通道：只注册这些通道，新增能力必须显式加进来
const ALLOWED_CHANNELS = new Set([
  'settings:get',
  'settings:save',
  'file:read',
  'file:write'
])

// 校验发送方：只接受本应用本地页面顶层 frame 发起的调用
function assertTrustedSender(event) {
  const frameUrl = event.senderFrame?.url ?? ''
  if (!frameUrl.startsWith('file://')) {
    throw new Error(\`拒绝来自不可信来源的 IPC 请求: \${frameUrl}\`)
  }
}

// 参数验证
function validateSettings(settings) {
  if (!settings || typeof settings !== 'object') return false
  if (typeof settings.theme !== 'string') return false
  if (typeof settings.autoSave !== 'boolean') return false
  return true
}

// 路径安全检查（防止路径穿越）
function safeUserDataPath(fileName) {
  const userData = app.getPath('userData')
  const resolved = path.resolve(userData, fileName)
  if (!resolved.startsWith(userData)) {
    throw new Error('路径越界: 不允许访问用户数据目录外的文件')
  }
  return resolved
}

// IPC 处理
ipcMain.handle('settings:save', async (event, settings) => {
  // 先校验来源，再校验参数
  assertTrustedSender(event)
  if (!ALLOWED_CHANNELS.has('settings:save')) {
    throw new Error('通道不在白名单内')
  }

  // 验证输入
  if (!validateSettings(settings)) {
    throw new Error('无效的设置数据')
  }

  // 安全写入
  const filePath = safeUserDataPath('settings.json')
  await fs.writeFile(filePath, JSON.stringify(settings, null, 2), 'utf-8')
  return { success: true }
})

// ========== 5. 权限请求处理 ==========
// 控制渲染进程的权限请求
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      // permission 可能值:
      // 'media' (摄像头/麦克风), 'geolocation', 'notifications',
      // 'midiSysex', 'pointerLock', 'fullscreen', 'openExternal'

      const url = webContents.getURL()

      // 只允许本地页面请求通知权限
      if (permission === 'notifications' && url.startsWith('file://')) {
        callback(true) // 允许
        return
      }

      // 默认拒绝
      callback(false)
    }
  )
})

// ========== 6. 新窗口创建拦截 ==========
// 外链只允许 https，且一律交给系统浏览器打开
function isSafeExternalUrl(target) {
  try {
    return new URL(target).protocol === 'https:'
  } catch {
    return false
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 拒绝应用内新窗口；确需打开外链时先校验协议再交给系统浏览器
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  // 拦截导航：只允许留在本应用页面内
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault()
    }
  })
}

// ========== 7. 加载远程内容的安全 ==========
// 如果必须加载远程网页，使用 <webview> 或 BrowserView
// 但要严格限制权限

// webview 示例 (不推荐，尽量避免):
// <webview
//   src="https://example.com"
//   nodeintegration="false"
//   contextisolation="true"
//   sandbox="true"
//   preload="webview-preload.js"
// ></webview>

// ========== 8. 依赖安全审计 ==========
// 定期运行:
//   npm audit
//   npm audit fix
//   npm outdated
//
// 锁定依赖版本:
//   package-lock.json 或 pnpm-lock.yaml
//   CI 中使用 npm ci 或 pnpm install --frozen-lockfile
//
// 工具:
//   snyk, dependabot, renovate

// ========== 9. 代码混淆与反调试（可选） ==========
// 注意: 这些不是真正的安全，只是增加逆向难度
//
// 代码混淆:
//   javascript-obfuscator, bytenode
//
// 反调试:
//   检测 DevTools 打开（但可以被绕过）

// ========== 10. 安全检查清单 ==========
// [ ] contextIsolation: true
// [ ] nodeIntegration: false
// [ ] 使用 contextBridge 暴露有限 API
// [ ] 设置合理的 CSP
// [ ] webSecurity: true (生产环境)
// [ ] IPC 校验 event.senderFrame 来源与参数
// [ ] 路径穿越防护
// [ ] 权限请求处理
// [ ] 依赖定期审计
// [ ] 代码签名 (macOS/Windows)
// [ ] 自动更新签名验证
// [ ] 禁用不必要的功能 (webview 等)

// ========== 11. Electron 安全官方建议 ==========
// 1. 只加载可信内容
// 2. 禁用 Node.js 集成
// 3. 启用上下文隔离
// 4. 启用进程沙箱
// 5. 设置内容安全策略
// 6. 不要禁用 webSecurity
// 7. 验证所有 IPC 消息
// 8. 使用 secure 变量处理 cookie
// 9. 限制新窗口和导航
// 10. 使用最新版 Electron`;export{n as default};
