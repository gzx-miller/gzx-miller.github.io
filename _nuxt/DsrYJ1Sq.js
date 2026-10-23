const n=`// ========== 1. 应用生命周期事件 main.js ==========
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
}`;export{n as default};
