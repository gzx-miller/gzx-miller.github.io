const n=`// ========== 1. 应用菜单 main.js ==========
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
})`;export{n as default};
