const n=`// ========== 1. 基本窗口创建 main.js ==========
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
})`;export{n as default};
