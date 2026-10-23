const n=`// ========== 1. 基础预加载脚本 preload.js ==========
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
// const fs = require('fs')  // 但这会带来严重安全风险`;export{n as default};
