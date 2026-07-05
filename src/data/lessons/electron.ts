import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/electron/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/electron/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    return loader()
  })
}

const E01Architecture = createDemo('E01Architecture')
const E02MainWindow = createDemo('E02MainWindow')
const E03IPC = createDemo('E03IPC')
const E04Preload = createDemo('E04Preload')
const E05AppLifecycle = createDemo('E05AppLifecycle')
const E06NativeMenu = createDemo('E06NativeMenu')
const E07Tray = createDemo('E07Tray')
const E08Dialog = createDemo('E08Dialog')
const E09Shortcuts = createDemo('E09Shortcuts')
const E10AutoUpdate = createDemo('E10AutoUpdate')
const E11Packaging = createDemo('E11Packaging')
const E12Security = createDemo('E12Security')
const E13Performance = createDemo('E13Performance')
const E14Storage = createDemo('E14Storage')
const E15MultiWindow = createDemo('E15MultiWindow')

const E01Code = () => Promise.resolve(`// ========== 1. 主进程入口 main.js ==========
// 主进程管理应用生命周期和所有原生能力
const { app, BrowserWindow } = require('electron')
const path = require('path')

// 主进程单例，负责创建窗口、管理生命周期
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

// ========== 2. 预加载脚本 preload.js ==========
// 预加载脚本在渲染进程加载前运行，可同时访问 Node.js 和 DOM API
const { contextBridge, ipcRenderer } = require('electron')

// 通过 contextBridge 安全暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  onMessage: (callback) => ipcRenderer.on('message', (_event, data) => callback(data))
})

// ========== 3. 渲染进程 renderer.js ==========
// 渲染进程运行 Web 页面，只能访问预加载脚本暴露的 API
console.log('Electron 版本:', window.electronAPI)

async function getVersion() {
  const version = await window.electronAPI.getAppVersion()
  console.log('App 版本:', version)
}

// ========== 4. 进程模型说明 ==========
// 主进程 (Main)       -> 1个，管理应用、窗口、原生 API
// 渲染进程 (Renderer)  -> 每个窗口一个，运行 Web 页面
// 预加载脚本 (Preload) -> 每个渲染进程一个，桥接主进程与渲染进程
// Utility 进程         -> 可选，运行 CPU 密集任务

// ========== 5. package.json 配置 ==========
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  }
}

// ========== 6. 进程间通信模式 ==========
// 1. invoke/handle: 渲染进程 -> 主进程（请求-响应）
// 2. send/on:       渲染进程 -> 主进程（单向）
// 3. sendToWebContents: 主进程 -> 渲染进程
// 4. MessagePort:   渲染进程之间直接通信（通过主进程中转端口）`)

const E02Code = () => Promise.resolve(`// ========== 1. 基本窗口创建 main.js ==========
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createMainWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: '我的 Electron 应用',
    icon: path.join(__dirname, 'assets/icon.png'),
    // 窗口初始位置
    x: 100,
    y: 100,
    // 是否可调整大小
    resizable: true,
    // 是否可最大化
    maximizable: true,
    // 是否可最小化
    minimizable: true,
    // 是否可关闭
    closable: true,
    // 是否聚焦
    focusable: true,
    // 透明窗口
    transparent: false,
    // 无边框窗口
    frame: true,
    // 自动隐藏菜单栏
    autoHideMenuBar: false,
    // 背景色
    backgroundColor: '#ffffff',
    webPreferences: {
      // 预加载脚本路径
      preload: path.join(__dirname, 'preload.js'),
      // 开启上下文隔离（安全，默认 true）
      contextIsolation: true,
      // 关闭 Node.js 集成（安全，默认 false）
      nodeIntegration: false,
      // 开启沙箱模式
      sandbox: false,
      // 允许使用 remote 模块（不推荐）
      enableRemoteModule: false,
      // 开启 web 安全（默认 true）
      webSecurity: true
    }
  })

  // 加载本地 HTML 文件
  mainWindow.loadFile('index.html')

  // 加载远程 URL
  // mainWindow.loadURL('https://example.com')

  // 打开开发者工具
  // mainWindow.webContents.openDevTools()

  return mainWindow
}

// ========== 2. 窗口生命周期事件 ==========
function setupWindowEvents(win) {
  // 页面加载完成
  win.webContents.on('did-finish-load', () => {
    console.log('页面加载完成')
  })

  // 窗口准备好显示时（配合 show: false 避免闪烁）
  win.once('ready-to-show', () => {
    win.show()
  })

  // 窗口获得焦点
  win.on('focus', () => {
    console.log('窗口获得焦点')
  })

  // 窗口失去焦点
  win.on('blur', () => {
    console.log('窗口失去焦点')
  })

  // 窗口最大化
  win.on('maximize', () => {
    console.log('窗口最大化')
  })

  // 窗口最小化
  win.on('minimize', () => {
    console.log('窗口最小化')
  })

  // 窗口关闭前
  win.on('close', (event) => {
    console.log('窗口即将关闭')
    // 可以阻止关闭
    // event.preventDefault()
  })

  // 窗口已关闭（释放引用）
  win.on('closed', () => {
    console.log('窗口已关闭')
    // win = null
  })
}

// ========== 3. 无边框窗口 + 自定义拖拽 ==========
// main.js 中创建无边框窗口
function createFramelessWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 无边框
    transparent: true, // 透明
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })
  return win
}

// 渲染进程中设置可拖拽区域 CSS
// .title-bar { -webkit-app-region: drag; }
// .title-bar button { -webkit-app-region: no-drag; }

// ========== 4. 窗口状态管理 ==========
function windowStateExample(win) {
  // 获取窗口位置
  const [x, y] = win.getPosition()
  console.log(\`窗口位置: \${x}, \${y}\`)

  // 获取窗口大小
  const [width, height] = win.getSize()
  console.log(\`窗口大小: \${width}x\${height}\`)

  // 最大化
  win.maximize()

  // 最小化
  win.minimize()

  // 恢复
  win.restore()

  // 全屏
  win.setFullScreen(true)

  // 始终置顶
  win.setAlwaysOnTop(true, 'screen-saver')

  // 设置进度条（任务栏）
  win.setProgressBar(0.5)
}

// ========== 5. 应用启动时创建窗口 ==========
app.whenReady().then(() => {
  const mainWindow = createMainWindow()
  setupWindowEvents(mainWindow)

  // macOS 上点击 Dock 图标且没有窗口时重新创建
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

// 所有窗口关闭时退出（Windows/Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})`)

const E03Code = () => Promise.resolve(`// ========== 1. 主进程 IPC: ipcMain.handle (推荐) ==========
// main.js
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs/promises')

// 注册 IPC 处理函数（渲染进程用 invoke 调用）
ipcMain.handle('read-user-data', async (_event, fileName) => {
  try {
    const userDataPath = app.getPath('userData')
    const filePath = path.join(userDataPath, fileName)
    const content = await fs.readFile(filePath, 'utf-8')
    return { success: true, data: content }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// 同步 IPC（不推荐，会阻塞渲染进程）
ipcMain.on('sync-message', (event, arg) => {
  console.log('收到同步消息:', arg)
  event.returnValue = '同步响应'
})

// ========== 2. 预加载脚本: 暴露 IPC API ==========
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 调用主进程方法（Promise 方式）
  readUserData: (fileName) => ipcRenderer.invoke('read-user-data', fileName),

  // 发送单向消息
  sendNotification: (message) => ipcRenderer.send('send-notification', message),

  // 监听主进程事件
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('update-available', (_event, data) => callback(data))
  },

  // 一次性监听
  onceUpdateDownloaded: (callback) => {
    ipcRenderer.once('update-downloaded', (_event, data) => callback(data))
  },

  // 移除监听器
  removeUpdateListener: () => {
    ipcRenderer.removeAllListeners('update-available')
  }
})

// ========== 3. 渲染进程调用 ==========
// renderer.js
async function loadSettings() {
  const result = await window.electronAPI.readUserData('settings.json')
  if (result.success) {
    console.log('设置:', JSON.parse(result.data))
  } else {
    console.error('读取失败:', result.error)
  }
}

// 发送单向消息
window.electronAPI.sendNotification('用户已登录')

// 监听主进程事件
window.electronAPI.onUpdateAvailable((version) => {
  console.log('发现新版本:', version)
})

// ========== 4. 主进程向渲染进程发送消息 ==========
// main.js
function sendMessageToRenderer(win, channel, data) {
  // 向指定窗口发送
  win.webContents.send(channel, data)
}

// 向所有窗口广播
function broadcastToAll(channel, data) {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach(win => {
    win.webContents.send(channel, data)
  })
}

// 示例: 发送更新通知
ipcMain.on('send-notification', (event, message) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win.webContents.send('notification-received', {
    from: 'system',
    message
  })
})

// ========== 5. 窗口间通信（通过主进程中转） ==========
// main.js
const windowMap = new Map()

// 注册窗口
ipcMain.handle('register-window', (event, windowId) => {
  windowMap.set(windowId, event.sender)
  return { success: true }
})

// 向指定窗口发送消息
ipcMain.handle('send-to-window', (_event, { targetId, message }) => {
  const target = windowMap.get(targetId)
  if (target) {
    target.send('window-message', message)
    return { success: true }
  }
  return { success: false, error: '窗口不存在' }
})

// ========== 6. MessagePort 直接通信 ==========
// preload.js
contextBridge.exposeInMainWorld('messagePort', {
  // 请求端口
  requestPort: () => ipcRenderer.invoke('request-port'),
  // 接收端口
  onPort: (callback) => {
    ipcRenderer.on('port', (event) => {
      callback(event.ports[0])
    })
  }
})

// main.js
ipcMain.handle('request-port', (event) => {
  const portPair = new MessageChannel()
  // 把 port2 发送给另一个窗口
  // anotherWin.webContents.postMessage('port', null, [portPair.port2])
  // 返回 port1 给请求方
  event.sender.postMessage('port', null, [portPair.port1])
  return { success: true }
})

// ========== 7. IPC 安全最佳实践 ==========
// 1. 不要直接暴露 ipcRenderer 整个对象
// 2. 验证参数类型和范围
// 3. 使用白名单通道
// 4. 不要返回敏感数据给不可信的渲染进程
// 5. 对于文件操作，限制在特定目录内

// 示例: 参数验证
ipcMain.handle('read-file', async (_event, filePath) => {
  // 验证参数类型
  if (typeof filePath !== 'string') {
    throw new Error('文件路径必须是字符串')
  }
  // 限制在用户数据目录内（防止路径穿越）
  const userDataPath = app.getPath('userData')
  const resolvedPath = path.resolve(userDataPath, filePath)
  if (!resolvedPath.startsWith(userDataPath)) {
    throw new Error('不允许访问该目录')
  }
  // ... 读取文件
})`)

const E04Code = () => Promise.resolve(`// ========== 1. 基础预加载脚本 preload.js ==========
const { contextBridge, ipcRenderer } = require('electron')

// 使用 contextBridge 安全暴露 API
// 只有在这里显式暴露的方法，渲染进程才能访问
contextBridge.exposeInMainWorld('myAPI', {
  // 暴露方法
  ping: () => ipcRenderer.invoke('ping'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // 暴露事件监听
  onCounterUpdate: (callback) => {
    ipcRenderer.on('counter-update', (_event, value) => callback(value))
  },

  // 移除监听器的方法（防止内存泄漏）
  removeCounterListener: () => {
    ipcRenderer.removeAllListeners('counter-update')
  }
})

// ========== 2. 主进程对应实现 main.js ==========
const { ipcMain } = require('electron')

ipcMain.handle('ping', () => 'pong')
ipcMain.handle('get-app-version', () => app.getVersion())

// ========== 3. 渲染进程使用 renderer.js ==========
// 调用暴露的 API
async function test() {
  const result = await window.myAPI.ping()
  console.log(result) // 'pong'

  const version = await window.myAPI.getAppVersion()
  console.log('版本:', version)
}

// 监听事件
window.myAPI.onCounterUpdate((count) => {
  console.log('计数器:', count)
})

// ========== 4. 完整示例: 文件操作 API ==========
// preload.js
contextBridge.exposeInMainWorld('fileAPI', {
  // 读取文件
  readFile: (fileName) => ipcRenderer.invoke('file:read', fileName),
  // 写入文件
  writeFile: (fileName, content) => ipcRenderer.invoke('file:write', fileName, content),
  // 删除文件
  deleteFile: (fileName) => ipcRenderer.invoke('file:delete', fileName),
  // 列出目录
  listDir: (dirPath) => ipcRenderer.invoke('file:list', dirPath)
})

// main.js - 实现文件操作（带安全限制）
const fs = require('fs/promises')
const path = require('path')

const USER_DATA_DIR = app.getPath('userData')

function safeJoin(base, target) {
  const resolved = path.resolve(base, target)
  if (!resolved.startsWith(base)) {
    throw new Error('路径越界')
  }
  return resolved
}

ipcMain.handle('file:read', async (_event, fileName) => {
  const filePath = safeJoin(USER_DATA_DIR, fileName)
  return await fs.readFile(filePath, 'utf-8')
})

ipcMain.handle('file:write', async (_event, fileName, content) => {
  const filePath = safeJoin(USER_DATA_DIR, fileName)
  await fs.writeFile(filePath, content, 'utf-8')
  return { success: true }
})

// ========== 5. 暴露 Node.js 模块的子集 ==========
// preload.js - 安全地暴露部分功能
const os = require('os')

contextBridge.exposeInMainWorld('systemInfo', {
  // 只暴露部分属性，不暴露整个 os 模块
  platform: process.platform,
  arch: process.arch,
  hostname: os.hostname(),
  totalMem: os.totalmem(),
  cpusCount: os.cpus().length,
  // 暴露方法但做包装
  getUptime: () => os.uptime()
})

// ========== 6. 多预加载脚本 ==========
// main.js 中可以使用多个 preload 脚本
// 注意: Electron 只支持一个 preload，需要手动合并
// 推荐模式: 一个主 preload，内部导入其他模块

// preload.js 内部模块化
// const apiModuleA = require('./preload/a')
// const apiModuleB = require('./preload/b')
// contextBridge.exposeInMainWorld('moduleA', apiModuleA)
// contextBridge.exposeInMainWorld('moduleB', moduleB)

// ========== 7. 上下文隔离下的类型定义 ==========
// TypeScript 环境下，需要声明全局类型
// src/global.d.ts
// export interface ElectronAPI {
//   ping: () => Promise<string>
//   getAppVersion: () => Promise<string>
//   onCounterUpdate: (callback: (value: number) => void) => void
// }
//
// declare global {
//   interface Window {
//     myAPI: ElectronAPI
//   }
// }
//
// export {}

// ========== 8. 安全最佳实践 ==========
// 1. 开启 contextIsolation: true（Electron 12+ 默认开启）
// 2. 不要直接暴露 ipcRenderer 对象
// 3. 不要暴露 require 或 Node.js 模块的原始引用
// 4. 只暴露必要的 API，遵循最小权限原则
// 5. 对所有传入参数进行验证
// 6. 提供移除监听器的方法防止内存泄漏
// 7. 不要在预加载脚本中存储敏感数据
// 8. 避免原型污染（Object.freeze 暴露的对象）

// ========== 9. 禁用 contextIsolation 的危险模式（不推荐） ==========
// webPreferences: {
//   contextIsolation: false,  // 关闭上下文隔离（不安全）
//   nodeIntegration: true,    // 开启 Node.js 集成（不安全）
// }
// 渲染进程可直接访问 Node.js
// const fs = require('fs')  // 但这会带来严重安全风险`)

const E05Code = () => Promise.resolve(`// ========== 1. 应用生命周期事件 main.js ==========
const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow = null

// 应用即将开始加载（最早的事件）
app.on('will-finish-launching', () => {
  console.log('应用即将完成启动')
  // macOS 上在此处注册 open-file / open-url 事件
})

// 应用就绪（可以创建窗口了）
app.whenReady().then(() => {
  console.log('应用已就绪')
  mainWindow = createMainWindow()
})

// 所有窗口都关闭时
app.on('window-all-closed', () => {
  console.log('所有窗口已关闭')
  // macOS 上应用通常保持运行
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// macOS 上点击 Dock 图标激活应用
app.on('activate', () => {
  console.log('应用被激活')
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow()
  }
})

// 应用即将退出（可以阻止）
app.on('before-quit', (event) => {
  console.log('应用即将退出')
  // 可以阻止退出
  // event.preventDefault()
})

// 应用所有窗口已关闭，即将退出（不能阻止）
app.on('will-quit', (event) => {
  console.log('应用将要退出')
  // 在此执行清理工作
})

// 应用已退出
app.on('quit', (event, exitCode) => {
  console.log(\`应用已退出，退出码: \${exitCode}\`)
})

// ========== 2. 单例应用 ==========
// 确保只有一个应用实例在运行
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  // 如果没拿到锁，说明已有实例在运行，直接退出
  app.quit()
} else {
  // 第二个实例启动时触发
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 聚焦已有窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
    // 可以处理第二个实例传来的参数（比如打开文件）
    console.log('第二个实例启动，命令行参数:', commandLine)
  })
}

// ========== 3. 深度链接 (自定义协议) ==========
// 注册自定义协议，如 myapp://
app.setAsDefaultProtocolClient('myapp')

// macOS: 通过 URL 打开应用
app.on('open-url', (event, url) => {
  event.preventDefault()
  console.log('通过 URL 打开:', url)
  // 解析 URL 并导航到对应页面
  // myapp://page/dashboard?tab=1
})

// macOS: 通过文件打开应用
app.on('open-file', (event, filePath) => {
  event.preventDefault()
  console.log('通过文件打开:', filePath)
})

// Windows/Linux: 在 second-instance 中处理协议
// commandLine 参数中包含 URL

// ========== 4. 启动参数解析 ==========
// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(1) // 第一个是可执行文件路径
  console.log('命令行参数:', args)

  // 查找特定参数
  const hasDevMode = args.includes('--dev')
  const hasPort = args.some(a => a.startsWith('--port='))

  return { hasDevMode, hasPort }
}

// ========== 5. 开机自启动 ==========
// 设置开机自启动
app.setLoginItemSettings({
  openAtLogin: true,
  // 启动参数
  args: ['--from-startup'],
  // macOS 隐藏启动
  openAsHidden: false
})

// 检查开机自启动状态
const loginSettings = app.getLoginItemSettings()
console.log('开机自启:', loginSettings.openAtLogin)

// ========== 6. 应用 ID 和名称 ==========
app.name = 'My Electron App'
app.setAppUserModelId('com.mycompany.myapp') // Windows 任务栏分组

// ========== 7. 优雅退出 ==========
let isQuitting = false

app.on('before-quit', (event) => {
  if (!isQuitting) {
    event.preventDefault()
    // 执行清理工作
    cleanup().then(() => {
      isQuitting = true
      app.quit()
    })
  }
})

async function cleanup() {
  console.log('执行清理...')
  // 保存数据
  // 关闭连接
  // 释放资源
  return Promise.resolve()
}

// 窗口关闭时的处理
function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  win.loadFile('index.html')

  // 窗口关闭时
  win.on('close', (event) => {
    // 如果是退出应用，直接关闭
    if (isQuitting) return

    // 否则隐藏到托盘（如果有托盘）
    event.preventDefault()
    win.hide()
  })

  return win
}

// ========== 8. 应用路径 ==========
function getAppPaths() {
  // 用户数据目录
  console.log('userData:', app.getPath('userData'))
  // 应用安装目录
  console.log('appData:', app.getPath('appData'))
  // 桌面目录
  console.log('desktop:', app.getPath('desktop'))
  // 文档目录
  console.log('documents:', app.getPath('documents'))
  // 临时目录
  console.log('temp:', app.getPath('temp'))
  // 可执行文件目录
  console.log('exe:', app.getPath('exe'))
}`)

const E06Code = () => Promise.resolve(`// ========== 1. 应用菜单 main.js ==========
const { app, BrowserWindow, Menu, MenuItem, shell } = require('electron')
const path = require('path')

// 构建菜单模板
function createMenu() {
  const template = [
    // App 菜单（macOS 专用，放在第一位）
    ...(process.platform === 'darwin' ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),

    // 文件菜单
    {
      label: '文件',
      submenu: [
        {
          label: '新建文件',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            console.log('新建文件')
          }
        },
        {
          label: '打开文件...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            // 打开文件对话框
          }
        },
        { type: 'separator' },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            console.log('保存')
          }
        },
        {
          label: '另存为...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {}
        },
        { type: 'separator' },
        // 不同平台的退出位置
        process.platform === 'darwin'
          ? { role: 'close' }
          : { role: 'quit' }
      ]
    },

    // 编辑菜单
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },      // 撤销
        { role: 'redo' },      // 重做
        { type: 'separator' },
        { role: 'cut' },       // 剪切
        { role: 'copy' },      // 复制
        { role: 'paste' },     // 粘贴
        { role: 'selectAll' }, // 全选
        { type: 'separator' },
        {
          label: '查找',
          accelerator: 'CmdOrCtrl+F',
          click: () => {}
        }
      ]
    },

    // 视图菜单
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },

    // 窗口菜单
    {
      label: '窗口',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(process.platform === 'darwin' ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },

    // 帮助菜单
    {
      label: '帮助',
      submenu: [
        {
          label: '官方文档',
          click: async () => {
            await shell.openExternal('https://www.electronjs.org/docs')
          }
        },
        {
          label: '关于',
          click: () => {
            // 显示关于对话框
          }
        }
      ]
    }
  ]

  // 构建菜单
  const menu = Menu.buildFromTemplate(template)
  // 设置为应用菜单
  Menu.setApplicationMenu(menu)

  return menu
}

// ========== 2. 动态添加菜单项 ==========
function addDynamicMenuItem() {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  const fileMenu = menu.items.find(item => item.label === '文件')
  if (fileMenu && fileMenu.submenu) {
    fileMenu.submenu.append(new MenuItem({
      label: '最近打开',
      submenu: [
        { label: 'file1.txt', click: () => {} },
        { label: 'file2.txt', click: () => {} }
      ]
    }))
    // 重新设置菜单
    Menu.setApplicationMenu(menu)
  }
}

// ========== 3. 上下文菜单（右键菜单） ==========
// 方式一: 主进程中创建，通过 IPC 调用
function showContextMenu(win, x, y) {
  const contextMenu = Menu.buildFromTemplate([
    { label: '复制', role: 'copy' },
    { label: '粘贴', role: 'paste' },
    { type: 'separator' },
    {
      label: '自定义操作',
      click: () => {
        console.log('执行自定义操作')
      }
    },
    {
      label: '在浏览器中打开链接',
      click: async () => {
        await shell.openExternal('https://example.com')
      }
    }
  ])

  contextMenu.popup({
    window: win,
    x,
    y
  })
}

// preload.js 暴露 API
// contextBridge.exposeInMainWorld('menuAPI', {
//   showContextMenu: (x, y) => ipcRenderer.invoke('show-context-menu', x, y)
// })

// main.js 处理调用
// ipcMain.handle('show-context-menu', (event, x, y) => {
//   const win = BrowserWindow.fromWebContents(event.sender)
//   showContextMenu(win, x, y)
// })

// 方式二: 渲染进程中使用 @electron/remote（不推荐）
// 推荐用 IPC 方式

// ========== 4. 菜单项类型 ==========
const menuItemTypes = [
  { type: 'normal', label: '普通菜单项' },
  { type: 'separator' }, // 分隔线
  { type: 'submenu', label: '子菜单', submenu: [] },
  { type: 'checkbox', label: '复选框', checked: true },
  { type: 'radio', label: '单选按钮' }
]

// ========== 5. 快捷键 (accelerator) ==========
// 格式: 修饰符+键名
// 修饰符: Command / Cmd, Control / Ctrl, CommandOrControl / CmdOrCtrl,
//         Alt, Option, Shift, Super (Windows键/Command键)
// 常用键: A-Z, 0-9, F1-F24, Space, Enter, Backspace, Delete,
//         Up, Down, Left, Right, Home, End, PageUp, PageDown, Escape

const acceleratorExamples = [
  'CmdOrCtrl+A',         // 全选
  'CmdOrCtrl+Shift+S',   // 另存为
  'Alt+F4',              // 关闭窗口
  'F5',                  // 刷新
  'CmdOrCtrl+Shift+I',   // 开发者工具
  'Shift+F10'            // 右键菜单
]

// ========== 6. 动态切换菜单 ==========
function updateMenuForLoginState(isLoggedIn) {
  const template = [
    {
      label: '账户',
      submenu: isLoggedIn
        ? [
            { label: '个人中心', click: () => {} },
            { label: '设置', click: () => {} },
            { type: 'separator' },
            { label: '退出登录', click: () => {} }
          ]
        : [
            { label: '登录', click: () => {} },
            { label: '注册', click: () => {} }
          ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// ========== 7. 应用启动时设置菜单 ==========
app.whenReady().then(() => {
  createMenu()
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })
  win.loadFile('index.html')
})`)

const E07Code = () => Promise.resolve(`// ========== 1. 系统托盘 main.js ==========
const { app, BrowserWindow, Tray, Menu, Notification, nativeImage } = require('electron')
const path = require('path')

let tray = null
let mainWindow = null

// 创建系统托盘
function createTray() {
  // 托盘图标（推荐使用 16x16 和 32x32 的 PNG）
  const iconPath = path.join(__dirname, 'assets/tray-icon.png')
  const trayIcon = nativeImage.createFromPath(iconPath)

  tray = new Tray(trayIcon)

  // 设置托盘提示文字
  tray.setToolTip('我的 Electron 应用')

  // 设置托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      label: '隐藏主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.hide()
        }
      }
    },
    { type: 'separator' },
    {
      label: '设置',
      click: () => {
        console.log('打开设置')
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  // 单击托盘图标事件
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    }
  })

  // 双击托盘图标事件
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  // 右键点击（通常显示上下文菜单，Electron 已自动处理）
  tray.on('right-click', () => {
    tray.popUpContextMenu()
  })
}

// ========== 2. 更新托盘图标 ==========
function updateTrayIcon(hasNotification) {
  if (!tray) return

  const iconName = hasNotification ? 'tray-icon-unread.png' : 'tray-icon.png'
  const iconPath = path.join(__dirname, 'assets', iconName)
  tray.setImage(nativeImage.createFromPath(iconPath))
}

// ========== 3. 系统通知 ==========
// 简单通知
function showNotification(title, body) {
  const notification = new Notification({
    title: title,
    body: body,
    // 图标
    icon: path.join(__dirname, 'assets/notification-icon.png'),
    // 声音（macOS）
    silent: false,
    // 超时时间
    timeoutType: 'default' // 'default' 或 'never'
  })

  notification.show()

  // 通知被点击
  notification.on('click', () => {
    console.log('通知被点击')
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  // 通知关闭
  notification.on('close', () => {
    console.log('通知已关闭')
  })

  // 通知操作按钮（仅部分平台支持）
  // notification.on('action', (event, index) => {
  //   console.log('点击了操作按钮:', index)
  // })
}

// 通知示例
function showDownloadComplete() {
  showNotification(
    '下载完成',
    '文件已经下载完成，点击查看'
  )
}

// ========== 4. 完整的托盘应用模式 ==========
// 关闭窗口时最小化到托盘，而不是退出
function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // 初始不显示，等 ready-to-show
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  win.loadFile('index.html')

  // 准备好再显示
  win.once('ready-to-show', () => {
    win.show()
  })

  // 窗口关闭时隐藏到托盘（不退出应用）
  win.on('close', (event) => {
    // 如果是用户主动退出应用（通过托盘菜单退出），则真的关闭
    if (app.isQuiting) {
      return
    }

    // 否则隐藏到托盘
    event.preventDefault()
    win.hide()

    // 显示通知告知用户
    showNotification('应用已最小化', '程序在系统托盘中继续运行')
  })

  return win
}

// 自定义退出方法
function quitApp() {
  app.isQuiting = true
  app.quit()
}

// ========== 5. macOS Dock 图标隐藏 ==========
// 纯托盘应用可以隐藏 Dock 图标
function setupDock() {
  if (process.platform === 'darwin') {
    // 隐藏 Dock 图标
    app.dock.hide()

    // 或者显示 Dock 图标
    // app.dock.show()

    // 设置 Dock 菜单
    const dockMenu = Menu.buildFromTemplate([
      {
        label: '新窗口',
        click: () => {}
      }
    ])
    app.dock.setMenu(dockMenu)

    // 设置 Dock 图标徽章（数字角标）
    app.dock.setBadge('5')

    // 弹跳 Dock 图标
    // app.dock.bounce('critical') // 一直弹直到点击
    // app.dock.bounce('informational') // 弹一下
  }
}

// ========== 6. Windows 任务栏气球通知 ==========
// Windows 上 Tray 也可以显示气球提示
function showTrayBalloon() {
  if (tray && process.platform === 'win32') {
    tray.displayBalloon({
      title: '通知标题',
      content: '这是气球通知内容',
      icon: path.join(__dirname, 'assets/tray-icon.png'),
      noSound: false,
      respectQuietTime: false
    })

    // 气球被点击
    tray.on('balloon-click', () => {
      console.log('气球通知被点击')
    })
  }
}

// ========== 7. 预加载脚本暴露通知 API ==========
// preload.js
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('notificationAPI', {
//   showNotification: (title, body) =>
//     ipcRenderer.invoke('notification:show', title, body),
//   updateTrayBadge: (count) =>
//     ipcRenderer.invoke('tray:update-badge', count)
// })

// main.js 对应实现
// ipcMain.handle('notification:show', (_event, title, body) => {
//   showNotification(title, body)
// })
//
// ipcMain.handle('tray:update-badge', (_event, count) => {
//   if (process.platform === 'darwin') {
//     app.dock.setBadge(count > 0 ? String(count) : '')
//   }
// })

// ========== 8. 应用启动时初始化 ==========
app.whenReady().then(() => {
  mainWindow = createMainWindow()
  createTray()
  setupDock()
})

// macOS 激活时
app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show()
  }
})`)

const E08Code = () => Promise.resolve(`// ========== 1. 文件选择对话框 main.js ==========
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')

// 打开文件选择对话框
async function showOpenDialog(win) {
  const result = await dialog.showOpenDialog(win, {
    // 对话框标题
    title: '选择文件',
    // 默认打开的目录
    defaultPath: app.getPath('documents'),
    // 文件名输入框默认值
    defaultPath: 'default.txt',
    // 文件类型过滤器
    filters: [
      { name: '文本文件', extensions: ['txt', 'md'] },
      { name: '图片', extensions: ['jpg', 'png', 'gif', 'webp'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    // 对话框属性
    properties: [
      'openFile',       // 允许选择文件
      'openDirectory',  // 允许选择目录
      'multiSelections', // 允许多选
      'showHiddenFiles' // 显示隐藏文件
    ],
    // 自定义按钮标签（macOS）
    buttonLabel: '选择'
  })

  if (!result.canceled) {
    console.log('选择的文件:', result.filePaths)
    return result.filePaths
  }
  return null
}

// ========== 2. 保存文件对话框 ==========
async function showSaveDialog(win, defaultName = 'untitled.txt') {
  const result = await dialog.showSaveDialog(win, {
    title: '保存文件',
    defaultPath: path.join(app.getPath('documents'), defaultName),
    filters: [
      { name: '文本文件', extensions: ['txt'] },
      { name: 'JSON', extensions: ['json'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    // 如果文件名已存在，是否显示确认提示（默认 true）
    showsTagField: false
  })

  if (!result.canceled && result.filePath) {
    console.log('保存到:', result.filePath)
    return result.filePath
  }
  return null
}

// ========== 3. 消息对话框 ==========
// 信息提示框
async function showInfoBox(win, title, message) {
  const result = await dialog.showMessageBox(win, {
    type: 'info',          // 'none', 'info', 'error', 'question', 'warning'
    title: title,
    message: message,
    detail: '这是详细信息',
    buttons: ['确定', '取消'],
    defaultId: 0,          // 默认按钮索引
    cancelId: 1,           // 按 ESC 时触发的按钮索引
    icon: path.join(__dirname, 'assets/icon.png'),
    // 复选框
    checkboxLabel: '不再提示',
    checkboxChecked: false
  })

  console.log('点击的按钮:', result.response)
  console.log('复选框状态:', result.checkboxChecked)
  return result
}

// 错误对话框
async function showErrorBox(title, message) {
  await dialog.showErrorBox(title, message)
}

// 确认对话框
async function showConfirmBox(win, message) {
  const result = await dialog.showMessageBox(win, {
    type: 'question',
    title: '确认',
    message: message,
    buttons: ['确定', '取消'],
    defaultId: 1,
    cancelId: 1
  })
  return result.response === 0 // 0 是确定
}

// ========== 4. 完整使用示例 ==========
async function handleFileOperations(win) {
  // 打开文件
  const filePaths = await showOpenDialog(win)
  if (filePaths && filePaths.length > 0) {
    // 读取文件内容...
  }

  // 保存文件
  const savePath = await showSaveDialog(win, 'my-file.txt')
  if (savePath) {
    // 写入文件...
  }

  // 确认退出
  const confirmed = await showConfirmBox(win, '确定要退出吗？未保存的更改将丢失。')
  if (confirmed) {
    app.quit()
  }

  // 显示错误
  // showErrorBox('操作失败', '无法连接到服务器')
}

// ========== 5. 通过 IPC 暴露给渲染进程 ==========
// main.js
ipcMain.handle('dialog:openFile', async (event, options = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const result = await dialog.showOpenDialog(win, {
    title: options.title || '选择文件',
    defaultPath: options.defaultPath || app.getPath('documents'),
    filters: options.filters || [{ name: '所有文件', extensions: ['*'] }],
    properties: options.properties || ['openFile']
  })
  return result
})

ipcMain.handle('dialog:saveFile', async (event, options = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  return await dialog.showSaveDialog(win, {
    title: options.title || '保存文件',
    defaultPath: options.defaultPath,
    filters: options.filters
  })
})

ipcMain.handle('dialog:messageBox', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  return await dialog.showMessageBox(win, options)
})

// ========== 6. preload.js 暴露 API ==========
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('dialogAPI', {
//   openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
//   saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options),
//   showMessage: (options) => ipcRenderer.invoke('dialog:messageBox', options),
//   confirm: (message) =>
//     ipcRenderer.invoke('dialog:messageBox', {
//       type: 'question',
//       title: '确认',
//       message: message,
//       buttons: ['确定', '取消'],
//       defaultId: 1,
//       cancelId: 1
//     }).then(r => r.response === 0)
// })

// ========== 7. 渲染进程使用 ==========
// async function selectAndReadFile() {
//   const result = await window.dialogAPI.openFile({
//     filters: [{ name: '文本文件', extensions: ['txt', 'md'] }],
//     properties: ['openFile']
//   })
//
//   if (!result.canceled) {
//     const filePath = result.filePaths[0]
//     // 然后通过另一个 IPC 读取文件内容
//   }
// }
//
// async function saveDocument() {
//   const confirmed = await window.dialogAPI.confirm('确定保存？')
//   if (!confirmed) return
//
//   const result = await window.dialogAPI.saveFile({
//     filters: [{ name: 'JSON', extensions: ['json'] }],
//     defaultPath: 'data.json'
//   })
//
//   if (!result.canceled && result.filePath) {
//     // 保存文件
//   }
// }

// ========== 8. 同步对话框（不推荐，会阻塞主进程） ==========
function syncDialogExample(win) {
  // showOpenDialog 同步版本
  // const result = dialog.showOpenDialogSync(win, { ... })
  // if (result) {
  //   console.log(result) // 返回文件路径数组
  // }

  // showSaveDialog 同步版本
  // const filePath = dialog.showSaveDialogSync(win, { ... })

  // showMessageBox 同步版本
  // const buttonIndex = dialog.showMessageBoxSync(win, { ... })
}

// ========== 9. 应用启动示例 ==========
app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })
  win.loadFile('index.html')
})`)

const E09Code = () => Promise.resolve(`// ========== 1. 全局快捷键 main.js ==========
const { app, BrowserWindow, globalShortcut, Menu } = require('electron')
const path = require('path')

// 注册全局快捷键
function registerGlobalShortcuts() {
  // 注册单个快捷键
  const ret = globalShortcut.register('CommandOrControl+Alt+K', () => {
    console.log('用户按下了 Ctrl+Alt+K')
    // 显示/隐藏窗口
    toggleWindow()
  })

  if (!ret) {
    console.log('快捷键注册失败（可能被其他应用占用）')
  }

  // 检查快捷键是否注册成功
  console.log('快捷键已注册:', globalShortcut.isRegistered('CommandOrControl+Alt+K'))

  // 注册媒体快捷键
  globalShortcut.register('MediaPlayPause', () => {
    console.log('播放/暂停')
  })

  globalShortcut.register('MediaNextTrack', () => {
    console.log('下一首')
  })

  globalShortcut.register('MediaPreviousTrack', () => {
    console.log('上一首')
  })
}

// 切换窗口显示/隐藏
let mainWindow = null
function toggleWindow() {
  if (!mainWindow) return

  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

// ========== 2. 注销快捷键 ==========
function unregisterShortcuts() {
  // 注销单个快捷键
  globalShortcut.unregister('CommandOrControl+Alt+K')

  // 注销所有快捷键
  globalShortcut.unregisterAll()
}

// 应用退出时必须注销
app.on('will-quit', () => {
  unregisterShortcuts()
})

// ========== 3. 菜单快捷键（accelerator） ==========
// 菜单快捷键不需要手动注册，定义在 MenuItem 中即可
function createMenuWithShortcuts() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            console.log('新建文件')
          }
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: () => {}
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {}
        },
        {
          label: '另存为',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {}
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', accelerator: 'CmdOrCtrl+Z' },
        { role: 'redo', accelerator: 'CmdOrCtrl+Shift+Z' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '刷新',
          accelerator: 'F5',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reload()
            }
          }
        },
        {
          label: '开发者工具',
          accelerator: 'F12',
          // 或 accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools()
            }
          }
        },
        {
          label: '全屏',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen())
            }
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// ========== 4. 快捷键格式详解 ==========
// 修饰符（Modifier keys）:
//   Command (或 Cmd)      - macOS Command 键
//   Control (或 Ctrl)     - Control 键
//   CommandOrControl      - macOS 上是 Cmd，其他是 Ctrl（推荐跨平台）
//   Alt                   - Alt 键
//   Option                - 同 Alt（macOS 叫法）
//   Shift                 - Shift 键
//   Super                 - Windows 键 / macOS Command 键
//
// 功能键:
//   F1 - F24              - 功能键
//   Space                 - 空格键
//   Enter / Return        - 回车键
//   Backspace             - 退格键
//   Delete                - 删除键
//   Escape / Esc          - 退出键
//   Tab                   - 制表键
//
// 方向键:
//   Up, Down, Left, Right
//   Home, End, PageUp, PageDown
//
// 其他:
//   PrintScreen, ScrollLock, Pause
//   Insert
//   MediaPlayPause, MediaNextTrack, MediaPreviousTrack, MediaStop
//   VolumeUp, VolumeDown, VolumeMute

// 示例组合:
const shortcutExamples = [
  'CmdOrCtrl+A',
  'CmdOrCtrl+Shift+P',
  'Alt+Tab',
  'CmdOrCtrl+Shift+Alt+M',
  'F5',
  'Shift+F10',
  'Ctrl+Alt+Delete' // 注意：系统快捷键可能无法注册
]

// ========== 5. 渲染进程监听键盘事件 ==========
// 渲染进程可以用普通的 Web API 监听键盘事件
// 但全局快捷键必须通过主进程注册

// renderer.js 中的键盘监听
// document.addEventListener('keydown', (e) => {
//   // Ctrl+S
//   if ((e.ctrlKey || e.metaKey) && e.key === 's') {
//     e.preventDefault()
//     console.log('保存')
//   }
//
//   // F5 刷新
//   if (e.key === 'F5') {
//     e.preventDefault()
//     location.reload()
//   }
// })

// ========== 6. 通过 IPC 动态注册快捷键 ==========
// preload.js
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('shortcutAPI', {
//   register: (accelerator, actionId) =>
//     ipcRenderer.invoke('shortcut:register', accelerator, actionId),
//   unregister: (accelerator) =>
//     ipcRenderer.invoke('shortcut:unregister', accelerator),
//   onTrigger: (callback) =>
//     ipcRenderer.on('shortcut:trigger', (_event, actionId) => callback(actionId))
// })

// main.js 实现
// const shortcutHandlers = new Map()
//
// ipcMain.handle('shortcut:register', (_event, accelerator, actionId) => {
//   const success = globalShortcut.register(accelerator, () => {
//     // 触发时通知渲染进程
//     _event.sender.send('shortcut:trigger', actionId)
//   })
//   if (success) {
//     shortcutHandlers.set(accelerator, actionId)
//   }
//   return success
// })
//
// ipcMain.handle('shortcut:unregister', (_event, accelerator) => {
//   globalShortcut.unregister(accelerator)
//   shortcutHandlers.delete(accelerator)
//   return true
// })

// ========== 7. 快捷键冲突处理 ==========
function safeRegister(accelerator, callback) {
  // 先检查是否已被注册
  if (globalShortcut.isRegistered(accelerator)) {
    console.warn(\`快捷键 \${accelerator} 已被占用\`)
    return false
  }

  const success = globalShortcut.register(accelerator, callback)
  if (!success) {
    console.error(\`注册快捷键失败: \${accelerator}\`)
  }
  return success
}

// ========== 8. 应用启动时初始化 ==========
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })
  mainWindow.loadFile('index.html')

  // 注册全局快捷键
  registerGlobalShortcuts()

  // 创建菜单（菜单内的快捷键会自动生效）
  createMenuWithShortcuts()
})

// 应用失焦时（可选，看需求决定是否注销）
// app.on('browser-window-blur', () => {
//   unregisterShortcuts()
// })
//
// app.on('browser-window-focus', () => {
//   registerGlobalShortcuts()
// })`)

const E10Code = () => Promise.resolve(`// ========== 1. 原生 autoUpdater (基础) main.js ==========
const { app, autoUpdater, dialog } = require('electron')

// 配置更新服务器地址
// 服务器需要返回正确格式的更新元数据
const updateServer = 'https://your-update-server.com/updates/latest'

autoUpdater.setFeedURL({
  url: updateServer
})

// 检查更新
function checkForUpdates() {
  autoUpdater.checkForUpdates()
}

// ========== 2. autoUpdater 事件 ==========
// 正在检查更新
autoUpdater.on('checking-for-update', () => {
  console.log('正在检查更新...')
})

// 发现新版本
autoUpdater.on('update-available', (info) => {
  console.log('发现新版本:', info.version)
  console.log('发布日期:', info.releaseDate)
  // 可以通知用户
})

// 当前已是最新版本
autoUpdater.on('update-not-available', (info) => {
  console.log('当前已是最新版本')
})

// 正在下载更新
autoUpdater.on('update-downloading', (event) => {
  console.log('正在下载更新...')
  console.log('进度:', event.percent)
})

// 更新下载完成
autoUpdater.on('update-downloaded', (event) => {
  console.log('更新已下载完成')
  console.log('版本:', event.version)

  // 询问用户是否立即更新
  const dialogOpts = {
    type: 'info',
    buttons: ['立即重启', '稍后'],
    title: '应用更新',
    message: \`新版本 \${event.version} 已下载完成\`,
    detail: '点击"立即重启"安装更新'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      // 退出并安装更新
      autoUpdater.quitAndInstall()
    }
  })
})

// 更新出错
autoUpdater.on('error', (error) => {
  console.error('更新出错:', error.message)
})

// ========== 3. 使用 electron-updater (推荐, electron-builder 内置) ==========
// 安装: npm install electron-updater
// const { autoUpdater } = require('electron-updater')
//
// autoUpdater.checkForUpdatesAndNotify()
//
// autoUpdater.on('update-available', (info) => {
//   console.log('发现更新:', info.version)
// })
//
// autoUpdater.on('download-progress', (progress) => {
//   console.log(\`下载进度: \${progress.percent}%\`)
//   console.log(\`速度: \${progress.bytesPerSecond} B/s\`)
// })
//
// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// ========== 4. 更新服务器配置 (electron-builder) ==========
// package.json 中的 build 配置
// {
//   "build": {
//     "appId": "com.myapp.id",
//     "productName": "MyApp",
//     "publish": {
//       "provider": "generic",
//       "url": "https://your-server.com/updates"
//     },
//     "mac": {
//       "category": "public.app-category.productivity"
//     },
//     "win": {
//       "target": "nsis"
//     },
//     "linux": {
//       "target": "AppImage"
//     }
//   }
// }
//
// 发布到 GitHub:
// "publish": {
//   "provider": "github",
//   "owner": "username",
//   "repo": "repo-name"
// }

// ========== 5. 通过 IPC 暴露更新状态 ==========
// main.js
const { ipcMain, BrowserWindow } = require('electron')

let mainWindow = null

function sendUpdateStatus(type, data) {
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { type, data })
  }
}

autoUpdater.on('checking-for-update', () => {
  sendUpdateStatus('checking', {})
})

autoUpdater.on('update-available', (info) => {
  sendUpdateStatus('available', { version: info.version })
})

autoUpdater.on('update-not-available', () => {
  sendUpdateStatus('not-available', {})
})

autoUpdater.on('update-downloaded', (info) => {
  sendUpdateStatus('downloaded', { version: info.version })
})

autoUpdater.on('error', (error) => {
  sendUpdateStatus('error', { message: error.message })
})

// 渲染进程触发检查更新
ipcMain.handle('update:check', () => {
  autoUpdater.checkForUpdates()
})

// 渲染进程触发安装更新
ipcMain.handle('update:install', () => {
  autoUpdater.quitAndInstall()
})

// ========== 6. preload.js ==========
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('updateAPI', {
//   checkForUpdates: () => ipcRenderer.invoke('update:check'),
//   installUpdate: () => ipcRenderer.invoke('update:install'),
//   onUpdateStatus: (callback) => {
//     ipcRenderer.on('update-status', (_event, status) => {
//       callback(status)
//     })
//   }
// })

// ========== 7. 渲染进程使用 ==========
// function setupAutoUpdate() {
//   window.updateAPI.onUpdateStatus((status) => {
//     switch (status.type) {
//       case 'checking':
//         console.log('正在检查更新...')
//         break
//       case 'available':
//         console.log('发现新版本:', status.data.version)
//         break
//       case 'not-available':
//         console.log('已是最新版本')
//         break
//       case 'downloaded':
//         console.log('更新已下载，点击安装')
//         // window.updateAPI.installUpdate()
//         break
//       case 'error':
//         console.error('更新失败:', status.data.message)
//         break
//     }
//   })
//
//   // 手动检查更新
//   // window.updateAPI.checkForUpdates()
// }

// ========== 8. 手动更新检查 ==========
function manualUpdateCheck() {
  // 启动时检查
  app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: 'preload.js',
        contextIsolation: true
      }
    })
    mainWindow.loadFile('index.html')

    // 延迟一会儿再检查（避免影响启动速度）
    setTimeout(() => {
      checkForUpdates()
    }, 3000)
  })
}

// ========== 9. 更新注意事项 ==========
// 1. macOS 需要代码签名才能启用自动更新
// 2. Windows 推荐使用代码签名证书
// 3. 更新包需要放到服务器上
// 4. 不同平台的更新格式不同:
//    - macOS: .dmg, .zip
//    - Windows: .exe (NSIS), nupkg (Squirrel)
//    - Linux: AppImage, deb, rpm
// 5. 自动更新需要在打包后的应用中测试
// 6. 提供手动下载入口作为备选

// ========== 10. 版本号比较 ==========
// semver 示例: 1.2.3 < 1.2.4 < 1.3.0 < 2.0.0
// 更新服务器返回的版本号必须符合 semver 规范

// 简单版本比较
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0
    const p2 = parts2[i] || 0
    if (p1 > p2) return 1
    if (p1 < p2) return -1
  }
  return 0
}`)

const E11Code = () => Promise.resolve(`// ========== 1. electron-builder package.json 配置 ==========
// 安装: npm install electron-builder --save-dev
//
// package.json:
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder -mw"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  },
  "build": {
    "appId": "com.company.myapp",
    "productName": "My App",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "preload.js",
      "index.html",
      "renderer.js",
      "assets/**"
    ],
    "extraResources": [
      {
        "from": "extra/",
        "to": "extra/"
      }
    ],
    "asar": true,
    "asarUnpack": [
      "assets/icons/*"
    ]
  }
}

// ========== 2. macOS 打包配置 ==========
// build.mac:
// {
//   "target": [
//     {
//       "target": "dmg",
//       "arch": ["x64", "arm64"]
//     },
//     {
//       "target": "zip",
//       "arch": ["x64", "arm64"]
//     }
//   ],
//   "category": "public.app-category.productivity",
//   "icon": "build/icon.icns",
//   "hardenedRuntime": true,
//   "gatekeeperAssess": false,
//   "entitlements": "build/entitlements.mac.plist",
//   "entitlementsInherit": "build/entitlements.mac.plist"
// }
//
// entitlements.mac.plist 内容:
// <?xml version="1.0" encoding="UTF-8"?>
// <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
//   "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
// <plist version="1.0">
// <dict>
//   <key>com.apple.security.app-sandbox</key>
//   <false/>
//   <key>com.apple.security.network.client</key>
//   <true/>
// </dict>
// </plist>

// ========== 3. Windows 打包配置 ==========
// build.win:
// {
//   "target": [
//     {
//       "target": "nsis",
//       "arch": ["x64"]
//     },
//     {
//       "target": "portable",
//       "arch": ["x64"]
//     }
//   ],
//   "icon": "build/icon.ico",
//   "artifactName": "\${productName}-\${version}-setup.\${ext}"
// }
//
// build.nsis:
// {
//   "oneClick": false,
//   "allowToChangeInstallationDirectory": true,
//   "installerIcon": "build/icon.ico",
//   "uninstallerIcon": "build/icon.ico",
//   "installerHeaderIcon": "build/icon.ico",
//   "createDesktopShortcut": true,
//   "createStartMenuShortcut": true,
//   "shortcutName": "My App"
// }

// ========== 4. Linux 打包配置 ==========
// build.linux:
// {
//   "target": [
//     { "target": "AppImage", "arch": ["x64"] },
//     { "target": "deb", "arch": ["x64"] },
//     { "target": "rpm", "arch": ["x64"] }
//   ],
//   "icon": "build/icons",
//   "category": "Utility",
//   "maintainer": "dev@company.com"
// }
//
// build.deb:
// {
//   "depends": ["libgtk-3-0", "libnotify4", "libnss3"]
// }

// ========== 5. 代码签名配置 ==========
// macOS 签名 (需要 Apple Developer 账号):
//
// 环境变量:
//   CSC_LINK=证书文件路径或名称
//   CSC_KEY_PASSWORD=证书密码
//   APPLE_ID=Apple ID 邮箱
//   APPLE_APP_SPECIFIC_PASSWORD=应用专用密码
//   APPLE_TEAM_ID=Team ID
//
// build.mac 中:
// {
//   "identity": "Developer ID Application: Your Name (TEAMID)",
//   "notarize": true
// }

// Windows 签名:
//
// 环境变量:
//   CSC_LINK=pfx 证书路径
//   CSC_KEY_PASSWORD=证书密码
//
// build.win 中:
// {
//   "certificateFile": "certificate.pfx",
//   "certificatePassword": "password"
// }

// ========== 6. 自动更新发布配置 ==========
// build.publish:
// {
//   "provider": "generic",
//   "url": "https://your-server.com/updates",
//   "channel": "latest"
// }
//
// 或发布到 GitHub:
// {
//   "provider": "github",
//   "owner": "username",
//   "repo": "repo-name",
//   "private": false
// }
//
// 环境变量 GH_TOKEN=你的 GitHub token

// ========== 7. 应用图标 ==========
// 需要准备不同尺寸的图标:
//
// macOS:
//   icon.icns (包含 16x16 到 512x512@2x)
//
// Windows:
//   icon.ico (包含 16x16 到 256x256)
//
// Linux:
//   icons/ (目录，各尺寸 png)
//
// 推荐使用 electron-icon-builder 生成:
//   npx electron-icon-builder --input=./icon.png --output=./build/icons

// ========== 8. 环境变量配置 ==========
// .env 文件示例:
//
// # 通用
// ELECTRON_CACHE=~/.cache/electron
// ELECTRON_BUILDER_CACHE=~/.cache/electron-builder
//
// # macOS 签名
// CSC_LINK=cert.p12
// CSC_KEY_PASSWORD=your-password
// APPLE_ID=your@apple.com
// APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
// APPLE_TEAM_ID=TEAMID12345
//
// # Windows 签名
// CSC_LINK=certificate.pfx
// CSC_KEY_PASSWORD=your-password
//
// # GitHub 发布
// GH_TOKEN=ghp_xxxxxxxxxxxxxxxxx

// ========== 9. CI/CD 配置 (GitHub Actions 示例) ==========
// .github/workflows/build.yml:
//
// name: Build Electron App
//
// on:
//   push:
//     tags:
//       - 'v*'
//
// jobs:
//   build:
//     runs-on: \${{ matrix.os }}
//     strategy:
//       matrix:
//         os: [macos-latest, windows-latest, ubuntu-latest]
//
//     steps:
//       - uses: actions/checkout@v4
//
//       - uses: actions/setup-node@v4
//         with:
//           node-version: '20'
//
//       - name: Install dependencies
//         run: npm ci
//
//       - name: Build
//         env:
//           GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
//           CSC_LINK: \${{ secrets.CSC_LINK }}
//           CSC_KEY_PASSWORD: \${{ secrets.CSC_KEY_PASSWORD }}
//         run: npm run build
//
//       - name: Upload artifacts
//         uses: actions/upload-artifact@v4
//         with:
//           name: \${{ runner.os }}-build
//           path: dist/

// ========== 10. 打包前检查清单 ==========
// [ ] 更新版本号 (package.json)
// [ ] 准备好应用图标 (icns, ico, png)
// [ ] 配置代码签名证书
// [ ] 测试应用在各平台运行正常
// [ ] 配置自动更新服务器 (如果需要)
// [ ] 检查 package.json 中 files 字段是否包含所有必要文件
// [ ] 确认 asar 打包不会导致问题（原生模块可能需要 asarUnpack）
// [ ] 编写更新日志 (CHANGELOG.md)

// ========== 11. 常见打包问题 ==========
// 1. 原生模块需要重新编译:
//    npm install electron-rebuild --save-dev
//    npx electron-rebuild
//
// 2. 路径问题:
//    使用 __dirname 相对于当前文件
//    使用 app.getAppPath() 获取应用根目录
//    生产环境路径可能在 asar 包内
//
// 3. 读写文件:
//    不要写入应用安装目录（可能只读）
//    使用 app.getPath('userData') 存储用户数据
//
// 4. 白屏问题:
//    检查路径是否正确
//    打开开发者工具调试
//    用 win.webContents.openDevTools()

// ========== 12. electron-forge 简介 (替代方案) ==========
// electron-forge 是另一个打包工具，封装了 electron-packager
//
// 初始化:
//   npm create electron-app@latest my-app -- --template=vite
//
// 配置在 forge.config.js 中:
// module.exports = {
//   packagerConfig: {},
//   makers: [
//     { name: '@electron-forge/maker-squirrel', config: {} },
//     { name: '@electron-forge/maker-zip', platforms: ['darwin'] },
//     { name: '@electron-forge/maker-deb', config: {} },
//     { name: '@electron-forge/maker-rpm', config: {} }
//   ]
// }`)

const E12Code = () => Promise.resolve(`// ========== 1. 安全配置基线 main.js ==========
const { app, BrowserWindow, session } = require('electron')
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
      // 开启 Web 安全（默认 true）
      webSecurity: true,
      // 禁止使用 remote 模块
      enableRemoteModule: false,
      // 禁用 <webview> 标签（如不需要）
      webviewTag: false,
      // 限制新窗口
      nativeWindowOpen: true
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

// 白名单通道
const ALLOWED_CHANNELS = new Set([
  'settings:get',
  'settings:save',
  'file:read',
  'file:write'
])

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
function createWindow() {
  const win = new BrowserWindow({...})

  // 拦截新窗口创建
  win.webContents.setWindowOpenHandler(({ url }) => {
    // 只允许打开特定域名
    try {
      const parsedUrl = new URL(url)
      if (parsedUrl.origin === 'https://trusted.com') {
        return { action: 'allow' }
      }
    } catch {}

    // 在默认浏览器中打开外部链接
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 拦截导航
  win.webContents.on('will-navigate', (event, url) => {
    // 阻止跳转到不可信的域名
    if (!url.startsWith('file://') && !url.startsWith('https://trusted.com')) {
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
// [ ] IPC 参数验证
// [ ] 路径穿越防护
// [ ] 权限请求处理
// [ ] 依赖定期审计
// [ ] 代码签名 (macOS/Windows)
// [ ] 自动更新签名验证
// [ ] 禁用不必要的功能 (webview, remote 等)

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
// 10. 使用最新版 Electron`)

const E13Code = () => Promise.resolve(`// ========== 1. 启动性能优化 main.js ==========
const { app, BrowserWindow } = require('electron')
const path = require('path')

// 优化一: 尽早创建窗口（利用 ready 之前的时间）
// 但要等 app.whenReady() 之后
let mainWindow = null

app.whenReady().then(() => {
  createMainWindow()
})

// 优化二: 使用 ready-to-show 避免白屏闪烁
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // 先不显示
    backgroundColor: '#f0f0f0', // 设置背景色，减少视觉闪烁
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      // 优化: 启用 V8 代码缓存
      // 默认已启用
    }
  })

  // 加载页面
  mainWindow.loadFile('index.html')

  // DOM 准备好后再显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  return mainWindow
}

// ========== 2. V8 内存调优 ==========
// 启动参数调整 V8 堆内存（在 package.json 或主进程中设置）
// 注意: 应在 app 就绪前设置
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096')

// 其他有用的 Chromium 开关:
// 禁用硬件加速（如果有渲染问题）
// app.disableHardwareAcceleration()
//
// 禁用 GPU 进程
// app.commandLine.appendSwitch('disable-gpu')
//
// 启用高 DPI 支持
// app.commandLine.appendSwitch('high-dpi-support', '1')

// ========== 3. 内存监控 ==========
function monitorMemory() {
  // 主进程内存
  const mem = process.memoryUsage()
  console.log('主进程内存:')
  console.log(\`  RSS: \${Math.round(mem.rss / 1024 / 1024)} MB\`)
  console.log(\`  堆总量: \${Math.round(mem.heapTotal / 1024 / 1024)} MB\`)
  console.log(\`  堆已用: \${Math.round(mem.heapUsed / 1024 / 1024)} MB\`)

  // 渲染进程内存（通过 webContents）
  // mainWindow.webContents.getProcessMemoryInfo().then(info => {
  //   console.log('渲染进程内存:', info)
  // })
}

// 定时监控
setInterval(monitorMemory, 30000) // 每 30 秒

// ========== 4. 渲染进程性能优化 ==========
// 4.1 懒加载模块
// renderer.js:
// async function loadHeavyModule() {
//   // 动态 import，首屏不加载
//   const heavyModule = await import('./heavy-module.js')
//   heavyModule.doWork()
// }

// 4.2 虚拟列表（大数据量表格/列表）
// 使用虚拟滚动，只渲染可视区域的 DOM
// 库: vue-virtual-scroller, react-window

// 4.3 减少重排重绘
// - 用 transform 代替 top/left 动画
// - 批量修改 DOM
// - 使用 will-change 提示浏览器

// ========== 5. IPC 性能优化 ==========
// 5.1 避免频繁的小消息
// ❌ 不好: 每次按键都发 IPC
// ✅ 好: 使用防抖/节流

// 5.2 大文件不要通过 IPC 传整个内容
// ❌ 不好: ipcRenderer.invoke('read-file') 返回整个文件内容
// ✅ 好: 传递文件路径，渲染进程通过其他方式（如 fetch file://）读取
//       或用流方式分片传输

// 5.3 批量操作合并
// 把多次 IPC 合并为一次
// ipcMain.handle('batch-ops', async (_event, operations) => {
//   const results = []
//   for (const op of operations) {
//     results.push(await executeOp(op))
//   }
//   return results
// })

// ========== 6. 窗口管理优化 ==========
// 6.1 及时释放窗口引用，防止内存泄漏
const windowMap = new Map()

function createWindow(id) {
  const win = new BrowserWindow({...})
  windowMap.set(id, win)

  win.on('closed', () => {
    windowMap.delete(id) // 重要: 移除引用
  })

  return win
}

// 6.2 隐藏非活动窗口而不是销毁
// （如果用户会频繁切换）
function hideWindow(win) {
  win.hide() // 隐藏，不销毁，下次显示更快
}

function showWindow(win) {
  win.show()
}

// 6.3 限制渲染进程数量
// 每个新窗口约占用 30-50MB 内存
// 考虑复用窗口或使用单窗口 + 多 Tab

// ========== 7. 主进程性能优化 ==========
// 7.1 避免主进程阻塞
// CPU 密集任务放到:
// - Utility 进程 (UtilityProcess)
// - Worker 线程 (worker_threads)
// - 子进程 (child_process)

// 7.2 使用 Utility 进程 (Electron 14+)
// const { UtilityProcess } = require('electron')
//
// function runHeavyTask(data) {
//   const child = new UtilityProcess()
//   child.start({
//     scriptPath: path.join(__dirname, 'heavy-task.js'),
//     args: [JSON.stringify(data)]
//   })
//
//   child.on('message', (result) => {
//     console.log('计算结果:', result)
//   })
// }

// 7.3 使用 Node.js Worker 线程
// const { Worker } = require('worker_threads')
//
// function runInWorker(scriptPath, data) {
//   return new Promise((resolve, reject) => {
//     const worker = new Worker(scriptPath, { workerData: data })
//     worker.on('message', resolve)
//     worker.on('error', reject)
//     worker.on('exit', (code) => {
//       if (code !== 0) reject(new Error(\`Worker 退出码: \${code}\`))
//     })
//   })
// }

// ========== 8. 性能分析工具 ==========
// 8.1 Chrome DevTools (渲染进程)
// - Performance 面板: 分析运行时性能
// - Memory 面板: 分析内存泄漏
// - Lighthouse: 网页性能审计

// 8.2 主进程调试
// 启动时加 --inspect:
//   electron --inspect=5858 .
// 然后在 chrome://inspect 中调试

// 8.3 进程内存
// 任务管理器 (开发中)
// 或: process.memoryUsage()

// 8.4 启动时间分析
// 打开 DevTools Performance 面板，勾选 Screenshots，重新加载

// ========== 9. 打包优化 ==========
// 9.1 asar 打包（默认开启，加速文件读取）
// 9.2 代码分割 (Webpack/Vite/Rollup)
// 9.3 Tree shaking
// 9.4 图片资源压缩
// 9.5 只打包需要的文件 (package.json build.files)

// ========== 10. 性能优化检查清单 ==========
// [ ] 显示骨架屏/背景色避免白屏
// [ ] 首屏只加载必要代码
// [ ] 懒加载非关键模块
// [ ] 大列表用虚拟滚动
// [ ] 避免主进程执行 CPU 密集任务
// [ ] 及时释放窗口引用
// [ ] IPC 消息防抖/节流
// [ ] 大文件不通过 IPC 传输
// [ ] 定期检查内存泄漏
// [ ] 使用最新版 Electron 和 Chromium`)

const E14Code = () => Promise.resolve(`// ========== 1. electron-store (配置存储) ==========
// 安装: npm install electron-store
// 特点: 简单 JSON 文件存储，适合配置项

// 方式一: 主进程中使用
// main.js
const Store = require('electron-store')

// 初始化 store
const store = new Store({
  // 配置项
  name: 'config',        // 文件名 (默认 config)
  defaults: {            // 默认值
    window: {
      width: 800,
      height: 600
    },
    theme: 'light',
    autoSave: true,
    lastOpenFiles: []
  },
  // 加密 (可选，敏感数据)
  // encryptionKey: 'your-secret-key'
})

// 读取
function getSettings() {
  const theme = store.get('theme')
  const windowSize = store.get('window')
  const isAutoSave = store.get('autoSave', true) // 带默认值
  return { theme, windowSize, isAutoSave }
}

// 写入
function saveSettings(settings) {
  store.set('theme', settings.theme)
  store.set('window', settings.window)
  // 或批量设置
  // store.set({ theme: 'dark', autoSave: false })
}

// 删除
function resetSettings() {
  store.delete('theme')
  // 清空所有
  // store.clear()
}

// 监听变化
store.onDidChange('theme', (newValue, oldValue) => {
  console.log(\`主题从 \${oldValue} 变为 \${newValue}\`)
})

// 文件位置
console.log('配置文件路径:', store.path)

// ========== 2. IndexedDB (渲染进程，结构化数据) ==========
// renderer.js - 浏览器标准 API，适合大量结构化数据

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyAppDB', 1)

    // 数据库升级（首次或版本变更）
    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // 创建对象仓库（类似表）
      if (!db.objectStoreNames.contains('notes')) {
        const notesStore = db.createObjectStore('notes', { keyPath: 'id' })
        // 创建索引
        notesStore.createIndex('title', 'title', { unique: false })
        notesStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
    }

    request.onsuccess = (event) => resolve(event.target.result)
    request.onerror = (event) => reject(event.target.error)
  })
}

// 添加/更新数据
async function saveNote(db, note) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['notes'], 'readwrite')
    const store = transaction.objectStore('notes')
    const request = store.put(note) // put = insert or update
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 查询数据
async function getAllNotes(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['notes'], 'readonly')
    const store = transaction.objectStore('notes')
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 按索引查询
async function getNoteByTitle(db, title) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['notes'], 'readonly')
    const store = transaction.objectStore('notes')
    const index = store.index('title')
    const request = index.get(title)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 删除数据
async function deleteNote(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['notes'], 'readwrite')
    const store = transaction.objectStore('notes')
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// ========== 3. localStorage (简单键值对) ==========
// renderer.js - 同步 API，适合小数据量

// 存储
localStorage.setItem('username', 'john')
localStorage.setItem('lastVisit', Date.now().toString())

// 读取
const username = localStorage.getItem('username')
const lastVisit = localStorage.getItem('lastVisit')

// 删除
localStorage.removeItem('lastVisit')

// 清空
// localStorage.clear()

// 注意事项:
// - 容量限制约 5MB
// - 同步 API，大量数据会阻塞
// - 只存储字符串（对象需 JSON.stringify）

// ========== 4. SQLite (关系型数据) ==========
// 方案 A: better-sqlite3 (同步 API，性能好，主进程使用)
// 安装: npm install better-sqlite3
//
// main.js:
// const Database = require('better-sqlite3')
// const path = require('path')
//
// function initDatabase() {
//   const dbPath = path.join(app.getPath('userData'), 'app.db')
//   const db = new Database(dbPath)
//
//   // 创建表
//   db.exec(\`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       email TEXT UNIQUE,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   \`)
//
//   return db
// }
//
// function addUser(db, name, email) {
//   const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
//   const result = stmt.run(name, email)
//   return result.lastInsertRowid
// }
//
// function getUser(db, id) {
//   const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
//   return stmt.get(id)
// }
//
// function listUsers(db) {
//   const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC')
//   return stmt.all()
// }

// 方案 B: sql.js (纯 JS，不需要原生编译，渲染进程也能用)
// 安装: npm install sql.js
// 适合: 不需要很高性能，避免原生模块编译问题

// ========== 5. 主进程文件存储 (Node.js fs) ==========
// main.js - 完全控制，适合自定义格式
const fs = require('fs/promises')

async function saveDataToFile(filename, data) {
  const userData = app.getPath('userData')
  const filePath = path.join(userData, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

async function loadDataFromFile(filename) {
  const userData = app.getPath('userData')
  const filePath = path.join(userData, filename)
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null // 文件不存在
    }
    throw error
  }
}

// ========== 6. 存储方案对比 ==========
//
// | 方案          | 位置       | 容量    | 适用场景               | 同步/异步 |
// |---------------|------------|---------|------------------------|-----------|
// | electron-store| 主进程     | 无限制  | 配置项、小型数据       | 同步      |
// | IndexedDB     | 渲染进程   | 很大    | 大量结构化数据         | 异步      |
// | localStorage  | 渲染进程   | ~5MB    | 简单键值对、临时数据   | 同步      |
// | SQLite        | 主进程     | 很大    | 复杂查询、关系型数据   | 同步/异步 |
// | fs 直接读写   | 主进程     | 无限制  | 自定义格式、大文件     | 异步      |
// | sessionStorage| 渲染进程   | ~5MB    | 会话级临时数据         | 同步      |

// ========== 7. 通过 IPC 暴露存储 API ==========
// preload.js
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('storageAPI', {
//   // 配置存储
//   getConfig: (key) => ipcRenderer.invoke('config:get', key),
//   setConfig: (key, value) => ipcRenderer.invoke('config:set', key, value),
//
//   // 数据库操作
//   addItem: (item) => ipcRenderer.invoke('db:add', item),
//   listItems: () => ipcRenderer.invoke('db:list'),
//   deleteItem: (id) => ipcRenderer.invoke('db:delete', id)
// })

// main.js
// ipcMain.handle('config:get', (_event, key) => store.get(key))
// ipcMain.handle('config:set', (_event, key, value) => store.set(key, value))

// ========== 8. 数据存储最佳实践 ==========
// 1. 用户数据存在 app.getPath('userData') 目录
// 2. 不要存在应用安装目录（可能只读）
// 3. 重要数据定期备份
// 4. 敏感数据加密存储
// 5. 大文件用文件系统，不要塞 JSON
// 6. JSON 存储不适合频繁写入（每次全量读写）
// 7. 数据库迁移（Schema 变更时）
// 8. 提供导出/导入功能`)

const E15Code = () => Promise.resolve(`// ========== 1. 多窗口管理器 main.js ==========
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// 窗口引用管理（使用 Map，不要用全局变量）
const windowManager = {
  windows: new Map(), // id -> window
  nextId: 1,

  // 创建窗口
  create(type, options = {}) {
    const id = \`\${type}-\${this.nextId++}\`

    const win = new BrowserWindow({
      width: options.width || 800,
      height: options.height || 600,
      title: options.title || '新窗口',
      x: options.x,
      y: options.y,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true
      },
      ...options.windowOptions
    })

    // 存储窗口元数据
    win.data = {
      id,
      type,
      createdAt: Date.now()
    }

    // 加载对应页面
    const pageMap = {
      main: 'index.html',
      editor: 'editor.html',
      preview: 'preview.html',
      settings: 'settings.html'
    }
    win.loadFile(pageMap[type] || 'index.html')

    // 窗口关闭时移除引用
    win.on('closed', () => {
      this.windows.delete(id)
      console.log(\`窗口 \${id} 已关闭，剩余 \${this.windows.size} 个窗口\`)
    })

    this.windows.set(id, win)
    console.log(\`创建窗口 \${id}，共 \${this.windows.size} 个窗口\`)

    return { id, win }
  },

  // 获取窗口
  get(id) {
    return this.windows.get(id)
  },

  // 获取所有窗口
  getAll() {
    return Array.from(this.windows.values())
  },

  // 按类型获取窗口
  getByType(type) {
    return Array.from(this.windows.values()).filter(w => w.data.type === type)
  },

  // 关闭所有窗口
  closeAll() {
    this.getAll().forEach(win => win.close())
  },

  // 广播消息给所有窗口
  broadcast(channel, data, excludeId = null) {
    this.windows.forEach((win, id) => {
      if (id !== excludeId) {
        win.webContents.send(channel, data)
      }
    })
  }
}

// ========== 2. 窗口间通信（通过主进程中转） ==========
// 模式一: 广播消息
ipcMain.handle('window:broadcast', (event, { channel, data }) => {
  const senderWin = BrowserWindow.fromWebContents(event.sender)
  const senderId = senderWin?.data?.id
  windowManager.broadcast(channel, data, senderId)
  return { success: true }
})

// 模式二: 发送给指定窗口
ipcMain.handle('window:sendTo', (event, { targetId, channel, data }) => {
  const targetWin = windowManager.get(targetId)
  if (targetWin) {
    targetWin.webContents.send(channel, {
      from: event.sender.data?.id,
      data
    })
    return { success: true }
  }
  return { success: false, error: '目标窗口不存在' }
})

// 模式三: 获取窗口列表
ipcMain.handle('window:list', () => {
  return windowManager.getAll().map(win => ({
    id: win.data.id,
    type: win.data.type,
    title: win.getTitle(),
    isFocused: win.isFocused()
  }))
})

// ========== 3. 创建子窗口示例 ==========
// 方式一: 从主进程创建
ipcMain.handle('window:create', (event, { type, options }) => {
  const { id, win } = windowManager.create(type, options)
  return { id }
})

// 方式二: window.open (渲染进程)
// 注意: 需要 nativeWindowOpen: true
// renderer.js:
// const newWindow = window.open('editor.html', '_blank', 'width=600,height=400')

// ========== 4. 预加载脚本暴露窗口管理 API ==========
// preload.js
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('windowAPI', {
//   // 创建新窗口
//   createWindow: (type, options) =>
//     ipcRenderer.invoke('window:create', { type, options }),
//
//   // 获取窗口列表
//   listWindows: () => ipcRenderer.invoke('window:list'),
//
//   // 广播消息
//   broadcast: (channel, data) =>
//     ipcRenderer.invoke('window:broadcast', { channel, data }),
//
//   // 发送给指定窗口
//   sendTo: (targetId, channel, data) =>
//     ipcRenderer.invoke('window:sendTo', { targetId, channel, data }),
//
//   // 接收消息
//   onWindowMessage: (channel, callback) => {
//     ipcRenderer.on(channel, (_event, data) => callback(data))
//   },
//
//   // 关闭当前窗口
//   close: () => window.close(),
//
//   // 最小化
//   minimize: () => ipcRenderer.invoke('window:minimize'),
//
//   // 最大化/还原
//   toggleMaximize: () => ipcRenderer.invoke('window:toggle-maximize')
// })

// main.js 对应实现
// ipcMain.handle('window:minimize', (event) => {
//   const win = BrowserWindow.fromWebContents(event.sender)
//   win?.minimize()
// })
//
// ipcMain.handle('window:toggle-maximize', (event) => {
//   const win = BrowserWindow.fromWebContents(event.sender)
//   if (!win) return
//   if (win.isMaximized()) {
//     win.unmaximize()
//   } else {
//     win.maximize()
//   }
// })

// ========== 5. 渲染进程使用示例 ==========
// async function openEditor() {
//   const result = await window.windowAPI.createWindow('editor', {
//     title: '编辑器',
//     width: 1000,
//     height: 700
//   })
//   console.log('新窗口 ID:', result.id)
// }
//
// async function sendMessageToAll() {
//   await window.windowAPI.broadcast('chat-message', {
//     from: 'user1',
//     text: '大家好！'
//   })
// }
//
// // 监听消息
// window.windowAPI.onWindowMessage('chat-message', (msg) => {
//   console.log(\`收到 \${msg.from} 的消息: \${msg.text}\`)
// })

// ========== 6. 父子窗口 (BrowserWindow parent) ==========
function createChildWindow(parentWin) {
  const childWin = new BrowserWindow({
    width: 400,
    height: 300,
    parent: parentWin, // 父窗口
    modal: true,        // 模态窗口（阻塞父窗口）
    webPreferences: {
      contextIsolation: true
    }
  })
  childWin.loadFile('dialog.html')
  return childWin
}

// ========== 7. 窗口位置记忆 ==========
const Store = require('electron-store')
const store = new Store({ name: 'window-state' })

function createWindowWithState() {
  const savedState = store.get('mainWindow') || {}

  const win = new BrowserWindow({
    width: savedState.width || 1200,
    height: savedState.height || 800,
    x: savedState.x,
    y: savedState.y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  // 如果之前是最大化，恢复最大化
  if (savedState.isMaximized) {
    win.maximize()
  }

  win.loadFile('index.html')

  // 关闭时保存状态
  win.on('close', () => {
    if (!win.isMaximized()) {
      const [x, y] = win.getPosition()
      const [width, height] = win.getSize()
      store.set('mainWindow', { x, y, width, height, isMaximized: false })
    } else {
      store.set('mainWindow.isMaximized', true)
    }
  })

  return win
}

// ========== 8. 内存泄漏预防 ==========
// 1. 窗口关闭后一定要从 Map 中删除引用
// 2. 移除所有事件监听器
// 3. 清除定时器
// 4. 断开 IPC 连接

// 错误示例 ❌
// const windows = [] // 全局数组
// function createWin() {
//   const win = new BrowserWindow()
//   windows.push(win) // 只加不删 -> 内存泄漏
// }

// 正确示例 ✅
// const windows = new Map()
// function createWin(id) {
//   const win = new BrowserWindow()
//   windows.set(id, win)
//   win.on('closed', () => {
//     windows.delete(id) // 关闭时删除
//   })
// }

// ========== 9. 多窗口应用的启动逻辑 ==========
app.whenReady().then(() => {
  // 创建主窗口
  windowManager.create('main', {
    title: '主窗口',
    width: 1200,
    height: 800
  })

  // macOS 激活时
  app.on('activate', () => {
    if (windowManager.windows.size === 0) {
      windowManager.create('main')
    }
  })
})

// 所有窗口关闭时
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ========== 10. 多窗口数据共享方案 ==========
// 方案 1: 主进程作为数据源 (推荐)
// - 所有数据存储在主进程
// - 渲染进程通过 IPC 读写
// - 数据变更时主进程广播通知
//
// 方案 2: 共享存储 (electron-store / SQLite)
// - 多个窗口读写同一个存储
// - 需要处理数据同步和冲突
//
// 方案 3: MessageChannel (直接通信)
// - 性能好，但建立连接麻烦
// - 适合高频大量数据传输
//
// 方案 4: BroadcastChannel (同源渲染进程)
// - 浏览器标准 API
// - 简单易用，但只能在同源页面间使用`)

export const lessons: Lesson[] = [
  {
    id: 'EL_01', title: 'Electron 架构与进程模型', navTitle: '架构模型', category: '基础架构',
    path: '/electron/e-1/architecture', summary: '理解 Electron 的主进程、渲染进程、预加载脚本三角色，以及 Chromium 多进程架构与 Node.js 的融合方式。',
    demo: E01Architecture, code: E01Code, language: 'javascript',
    principle: 'Electron 融合 Chromium 渲染引擎与 Node.js 运行时：主进程（Main）管理应用生命周期与原生能力，渲染进程（Renderer）运行 Web 页面，预加载脚本（Preload）在上下文桥接中安全暴露 API。',
    flow: ['主进程通过 BrowserWindow 创建渲染进程。', '预加载脚本在渲染进程加载前执行，可访问 Node.js 与 Electron API。', '上下文隔离（contextIsolation）默认开启，预加载脚本通过 contextBridge 暴露受限 API。'],
    notes: ['每个窗口是一个独立渲染进程，崩溃不影响其他窗口。', '主进程崩溃会导致整个应用退出。', 'Utility 进程可运行 CPU 密集任务，不阻塞主进程。'],
    problem: '解决"Electron 应用由哪些进程组成、各进程职责是什么、以及如何安全地进行进程间通信"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/process-model',
  },
  {
    id: 'EL_02', title: '主进程与 BrowserWindow', navTitle: '窗口管理', category: '基础架构',
    path: '/electron/e-2/main-window', summary: '使用 BrowserWindow 创建、配置和管理应用窗口，掌握窗口生命周期与 webPreferences 安全配置。',
    demo: E02MainWindow, code: E02Code, language: 'javascript',
    principle: 'BrowserWindow 是主进程创建原生窗口的构造函数；webPreferences 控制渲染进程能力（Node.js 集成、上下文隔离、预加载脚本）；窗口生命周期事件（ready-to-show、closed）用于管理应用状态。',
    flow: ['在主进程中引入 BrowserWindow。', '配置 webPreferences（推荐：nodeIntegration: false, contextIsolation: true, preload 指定预加载脚本）。', '监听窗口生命周期事件，在 closed 时释放引用防止内存泄漏。'],
    notes: ['生产环境必须关闭 nodeIntegration，使用预加载脚本替代。', 'show: false 配合 ready-to-show 事件可避免窗口闪烁。', 'webSecurity: false 仅用于本地开发，生产环境必须开启。'],
    problem: '解决"如何创建原生桌面窗口、如何配置渲染进程安全策略、以及如何管理窗口生命周期"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/browser-window',
  },
  {
    id: 'EL_03', title: 'IPC 进程间通信', navTitle: 'IPC 通信', category: '进程通信',
    path: '/electron/e-3/ipc', summary: '掌握 ipcMain、ipcRenderer 与 invoke/handle 模式，实现主进程与渲染进程的安全双向通信。',
    demo: E03IPC, code: E03Code, language: 'javascript',
    principle: 'IPC（Inter-Process Communication）是 Electron 进程间通信机制：主进程通过 ipcMain.handle 暴露方法，渲染进程（通过预加载脚本）使用 ipcRenderer.invoke 调用；这种模式支持 Promise，适合请求-响应场景。',
    flow: ['主进程使用 ipcMain.handle(channel, handler) 注册可调用的 IPC 方法。', '预加载脚本通过 contextBridge.exposeInMainWorld 将调用封装为 API。', '渲染进程调用暴露的 API，获得 Promise 响应。'],
    notes: ['优先使用 invoke/handle 而非 send/on，前者支持异步返回。', 'IPC 通道名称应使用常量，避免魔法字符串。', '不要通过 IPC 传递大量数据（如整个文件内容），应使用文件路径。'],
    problem: '解决"渲染进程如何调用主进程的本地能力、主进程如何向渲染进程推送事件、以及如何避免 IPC 通信的安全风险"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/ipc',
  },
  {
    id: 'EL_04', title: '预加载脚本与安全桥接', navTitle: '预加载脚本', category: '进程通信',
    path: '/electron/e-4/preload', summary: '编写预加载脚本，使用 contextBridge 安全暴露 API，理解上下文隔离的工作原理。',
    demo: E04Preload, code: E04Code, language: 'javascript',
    principle: '预加载脚本在渲染进程加载前运行，可同时访问 Node.js 和 Electron API；contextBridge.exposeInMainWorld 将指定 API 注入渲染进程的 window 对象，且只暴露白名单方法，是 Electron 安全模型的核心。',
    flow: ['创建 preload.ts，导入 contextBridge 和 ipcRenderer。', '使用 contextBridge.exposeInMainWorld(apiKey, apiObject) 暴露受限 API。', '在渲染进程中通过 window.apiName 调用暴露的方法。'],
    notes: ['预加载脚本中不要直接暴露整个 ipcRenderer（安全风险）。', '暴露的方法应显式声明参数和返回值类型。', '多个预加载脚本可按需拆分，通过 webPreferences.preload 指定。'],
    problem: '解决"如何在开启上下文隔离的前提下让渲染进程安全使用 Electron API、如何避免直接暴露 Node.js 能力、以及如何设计合理的 API 边界"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/context-isolation',
  },
  {
    id: 'EL_05', title: '应用生命周期与事件', navTitle: '应用生命周期', category: '应用管理',
    path: '/electron/e-5/app-lifecycle', summary: '掌握 app 模块的生命周期事件，实现启动初始化、单例锁定、协议处理和优雅退出。',
    demo: E05AppLifecycle, code: E05Code, language: 'javascript',
    principle: 'app 模块控制应用生命周期：ready 事件后创建窗口，second-instance 事件实现单例应用，open-url/open-file 处理深层链接，before-quit 和 will-quit 实现优雅退出。',
    flow: ['监听 app.whenReady() 后创建主窗口。', '使用 app.requestSingleInstanceLock() 确保单例运行。', '监听窗口全部关闭事件（Windows/Linux 退出，macOS 保留 Dock 图标）。'],
    notes: ['macOS 上关闭所有窗口不会退出应用，需监听 app.activate。', 'second-instance 事件中应聚焦已有窗口而非创建新窗口。', 'before-quit 是执行清理（保存数据、关闭连接）的最后机会。'],
    problem: '解决"如何控制 Electron 应用的启动流程、如何实现单例应用、如何处理不同平台的退出行为差异、以及如何响应系统协议"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/app',
  },
  {
    id: 'EL_06', title: '原生菜单与上下文菜单', navTitle: '原生菜单', category: '原生能力',
    path: '/electron/e-6/native-menu', summary: '使用 Menu 和 MenuItem 构建应用菜单、右键菜单和托盘菜单，掌握快捷键与角色（role）系统。',
    demo: E06NativeMenu, code: E06Code, language: 'javascript',
    principle: 'Menu 模块构建原生菜单：应用菜单（setApplicationMenu）、上下文菜单（popup）、托盘菜单；role 属性自动绑定标准行为（undo、redo、copy、paste 等）；accelerator 定义快捷键。',
    flow: ['使用 Menu.buildFromTemplate(menuItems) 构建菜单。', '通过 Menu.setApplicationMenu(menu) 设置应用菜单。', '在渲染进程右键事件中调用 Menu.popup() 显示上下文菜单。'],
    notes: ['role 属性会自动本地化为系统语言，优先使用 role 而非手动实现。', 'macOS 的菜单栏与应用绑定，Windows/Linux 与窗口绑定。', '动态更新菜单时重建整个 Menu 实例，而非修改已有实例。'],
    problem: '解决"如何构建跨平台原生菜单、如何实现右键上下文菜单、如何通过 role 复用系统标准行为、以及如何绑定快捷键"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/menu',
  },
  {
    id: 'EL_07', title: '系统托盘与通知', navTitle: '系统托盘', category: '原生能力',
    path: '/electron/e-7/tray-notification', summary: '创建系统托盘图标，实现托盘菜单、气泡通知和点击交互，掌握后台运行模式。',
    demo: E07Tray, code: E07Code, language: 'javascript',
    principle: 'Tray 模块在系统托盘区创建图标；配合 Menu 实现右键菜单；Notification 模块发送系统通知；托盘应用通常隐藏 Dock 图标（macOS），通过托盘图标管理窗口显示。',
    flow: ['在主进程中创建 Tray 实例，传入图标路径。', '为 Tray 设置上下文菜单（setContextMenu）。', '监听 Tray 的 click 事件实现窗口显示/隐藏切换。'],
    notes: ['macOS 需要 22x22@2x 的模板图标（黑白，系统自动适配暗色模式）。', 'Notification 需要在 app.whenReady() 后调用。', '托盘应用应在关闭窗口时隐藏而非退出（macOS 尤其重要）。'],
    problem: '解决"如何创建系统托盘应用、如何实现最小化到托盘、如何发送系统通知、以及如何处理托盘图标的点击事件"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/tray',
  },
  {
    id: 'EL_08', title: '文件对话框与系统对话框', navTitle: '文件对话框', category: '原生能力',
    path: '/electron/e-8/dialog', summary: '使用 dialog 模块打开文件选择、保存对话框和消息框，掌握异步 API 与返回值处理。',
    demo: E08Dialog, code: E08Code, language: 'javascript',
    principle: 'dialog 模块提供原生系统对话框：showOpenDialog 选择文件/目录，showSaveDialog 保存文件，showMessageBox 显示消息；主进程直接使用，渲染进程通过 IPC 调用。',
    flow: ['主进程调用 dialog.showOpenDialog(mainWindow, options)。', '指定 filters 限制文件类型（如 [{ name: "Images", extensions: ["jpg", "png"] }]）。', '处理返回的 filePath（单选）或 filePaths（多选）数组。'],
    notes: ['渲染进程中可通过 ipcRenderer.invoke 调用主进程封装的对话框方法。', 'properties 数组控制对话框行为（openFile、openDirectory、multiSelections 等）。', 'macOS 支持在对话框中添加自定义按钮（buttonLabel）。'],
    problem: '解决"如何打开原生文件选择器、如何保存文件到指定位置、如何显示确认对话框、以及如何获取用户选择的路径"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/dialog',
  },
  {
    id: 'EL_09', title: '全局快捷键与菜单快捷键', navTitle: '快捷键', category: '原生能力',
    path: '/electron/e-9/shortcuts', summary: '注册全局快捷键（即使应用未聚焦）和菜单快捷键，掌握快捷键冲突处理与动态注册。',
    demo: E09Shortcuts, code: E09Code, language: 'javascript',
    principle: 'globalShortcut 模块注册系统级快捷键（应用未聚焦时也可触发）；MenuItem 的 accelerator 属性定义菜单快捷键；快捷键格式为平台无关的字符串（如 CmdOrCtrl+Shift+K）。',
    flow: ['使用 globalShortcut.register(accelerator, callback) 注册全局快捷键。', '在应用退出时调用 globalShortcut.unregisterAll() 释放快捷键。', '菜单快捷键通过 MenuItem 的 accelerator 属性定义，无需手动注册。'],
    notes: ['全局快捷键可能与其他应用冲突，注册前应检查是否已注册（isRegistered）。', 'macOS 的 Cmd 对应 Windows/Linux 的 Ctrl，使用 CmdOrCtrl 可跨平台。', '快捷键字符串区分大小写，Shift+A 与 Shift+a 不同。'],
    problem: '解决"如何实现全局快捷键、如何避免快捷键冲突、如何动态注册/注销快捷键、以及如何在菜单中显示快捷键提示"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/global-shortcut',
  },
  {
    id: 'EL_10', title: '自动更新机制', navTitle: '自动更新', category: '分发部署',
    path: '/electron/e-10/auto-update', summary: '使用 autoUpdater 模块实现应用自动更新，掌握更新服务器配置、签名验证和更新事件处理。',
    demo: E10AutoUpdate, code: E10Code, language: 'javascript',
    principle: 'autoUpdater 模块支持应用自动更新：主进程监听更新事件（checking-for-update、update-available、update-downloaded 等）；更新服务器需提供符合规范的更新元数据和签名文件；生产环境推荐使用 electron-updater（electron-builder 内置）。',
    flow: ['配置更新服务器 URL（setFeedURL）。', '监听 autoUpdater 事件处理更新流程。', '在 update-downloaded 后提示用户重启应用完成更新。'],
    notes: ['macOS 自动更新需要代码签名（codesign）和公证（notarization）。', 'Windows 需要有效的代码签名证书（Authenticode）。', 'electron-updater 支持增量更新（diff），减少下载体积。'],
    problem: '解决"如何实现桌面应用的自动更新、如何配置更新服务器、如何验证更新包完整性、以及如何处理更新失败"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/auto-updater',
  },
  {
    id: 'EL_11', title: '打包与分发', navTitle: '打包分发', category: '分发部署',
    path: '/electron/e-11/packaging', summary: '使用 electron-builder 或 electron-forge 打包跨平台应用，掌握配置、代码签名、平台差异和发布流程。',
    demo: E11Packaging, code: E11Code, language: 'javascript',
    principle: 'electron-builder 是主流打包工具：配置打包目标（dmg、exe、AppImage）、代码签名、自动更新和发布；不同平台有不同打包要求和依赖（如 Windows 需要 wine 打包 Windows 应用）。',
    flow: ['安装 electron-builder 并配置 package.json 的 build 字段。', '指定各平台的打包配置（mac、win、linux）。', '运行打包命令生成各平台安装包。'],
    notes: ['macOS 打包需要在 macOS 机器上完成（或使用 CI）。', 'Windows 的 NSIS 安装包支持自定义安装步骤。', 'Linux 推荐同时提供 AppImage、deb、rpm 三种格式。'],
    problem: '解决"如何打包跨平台 Electron 应用、如何处理各平台的打包差异、如何配置代码签名、以及如何自动化发布流程"的问题。',
    officialUrl: 'https://www.electron.build/',
  },
  {
    id: 'EL_12', title: '安全最佳实践', navTitle: '安全实践', category: '安全与性能',
    path: '/electron/e-12/security', summary: '理解 Electron 安全模型，掌握上下文隔离、内容安全策略（CSP）、权限管理和依赖审计。',
    demo: E12Security, code: E12Code, language: 'javascript',
    principle: 'Electron 安全核心原则：关闭 nodeIntegration、开启 contextIsolation、使用预加载脚本、设置 CSP、限制 webSecurity: false、审计依赖（npm audit）、启用沙箱（sandbox）。',
    flow: ['确保 webPreferences 中 nodeIntegration: false、contextIsolation: true。', '在 HTML 的 <head> 最顶部设置 Content-Security-Policy。', '仅加载可信内容，远程内容使用 <webview> 并限制权限。'],
    notes: ['永远不要使用 allowpopups 等危险权限。', 'CSP 应禁止 unsafe-inline 和 unsafe-eval。', '定期运行 npm audit 和 npm outdated 检查依赖漏洞。'],
    problem: '解决"如何防止 Electron 应用被注入恶意代码、如何限制渲染进程的 native 能力、如何防止 XSS 攻击升级为远程代码执行、以及如何管理依赖安全"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/security',
  },
  {
    id: 'EL_13', title: '性能优化', navTitle: '性能优化', category: '安全与性能',
    path: '/electron/e-13/performance', summary: '优化 Electron 应用启动速度、内存占用和渲染性能，掌握 V8 堆内存调优与性能分析工具。',
    demo: E13Performance, code: E13Code, language: 'javascript',
    principle: 'Electron 性能优化从三方面入手：启动优化（延迟加载、骨架屏）、内存优化（限制渲染进程数量、及时释放引用）、渲染优化（Web 性能最佳实践）；主进程可通过 --max-old-space-size 调整 V8 堆内存。',
    flow: ['使用 app.whenReady() 后再创建窗口，避免阻塞启动。', '渲染进程中懒加载非关键模块（动态 import）。', '监控内存使用（process.memoryUsage()），及时释放不需要的引用。'],
    notes: ['每个额外渲染进程约占用 30-50MB 内存。', '预加载脚本应最小化，仅暴露必要 API。', '使用 Chrome DevTools 的 Performance 面板分析渲染性能。'],
    problem: '解决"Electron 应用启动慢、内存占用高、渲染卡顿、以及如何定位性能瓶颈"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/performance',
  },
  {
    id: 'EL_14', title: '本地数据存储', navTitle: '数据存储', category: '数据管理',
    path: '/electron/e-14/storage', summary: '对比 electron-store、IndexedDB、localStorage 和 SQLite，掌握 Electron 应用的本地数据存储方案。',
    demo: E14Storage, code: E14Code, language: 'javascript',
    principle: 'Electron 应用有多种数据存储选择：electron-store（基于 JSON，适合配置）、IndexedDB（浏览器标准，适合结构化数据）、SQLite（关系型，适合复杂查询）；主进程可直接读写文件，渲染进程通过 IPC 调用。',
    flow: ['小配置使用 electron-store（自动处理用户数据目录）。', '结构化数据使用 IndexedDB 或 localStorage。', '复杂数据或关系型需求使用 better-sqlite3 或 sql.js。'],
    notes: ['electron-store 默认存储在 app.getPath("userData") 目录。', 'JSON 存储不适合大数据量（读写全量）。', '主进程可直接使用 Node.js fs 模块，渲染进程需通过 IPC。'],
    problem: '解决"Electron 应用应该如何存储本地数据、不同存储方案的适用场景、如何保证数据持久化、以及如何在主进程和渲染进程间共享数据"的问题。',
    officialUrl: 'https://github.com/sindresorhus/electron-store',
  },
  {
    id: 'EL_15', title: '多窗口管理与通信', navTitle: '多窗口管理', category: '数据管理',
    path: '/electron/e-15/multi-window', summary: '管理多个应用窗口，实现窗口间通信、数据共享和状态同步，掌握窗口引用管理和内存泄漏预防。',
    demo: E15MultiWindow, code: E15Code, language: 'javascript',
    principle: '多窗口应用需维护窗口引用数组；窗口间通信可通过主进程中转（ipcMain 转发）或共享存储（electron-store）；窗口关闭时必须释放引用（delete windowMap[id]）防止内存泄漏。',
    flow: ['使用 Map 或对象存储窗口引用（windowById）。', '新窗口通过 BrowserWindow 创建，并存入引用表。', '窗口 closed 事件中从引用表移除对应条目。'],
    notes: ['不要使用全局变量存储窗口引用，应使用集中管理的 Map。', '窗口间通信优先通过主进程中转，避免直接跨窗口访问。', 'macOS 上所有窗口关闭后应用仍运行，需单独处理。'],
    problem: '解决"如何管理多个窗口、如何实现窗口间数据传递、如何避免窗口引用导致的内存泄漏、以及如何处理多窗口应用的生命周期"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/browser-window',
  },
]
