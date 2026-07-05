import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/electron/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/electron/*.vue', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/electron/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    return loader()
  })
}

function createCodeLoader(path: string) {
  const loader = vueCodeModules[`../../demos/electron/${path}`]
  if (!loader) throw new Error(`未找到案例源码：${path}`)
  return loader
}

const E01Architecture = createDemo('E01Architecture')
const E01Code = createCodeLoader('E01Architecture.vue')
const E02MainWindow = createDemo('E02MainWindow')
const E02Code = createCodeLoader('E02MainWindow.vue')
const E03IPC = createDemo('E03IPC')
const E03Code = createCodeLoader('E03IPC.vue')
const E04Preload = createDemo('E04Preload')
const E04Code = createCodeLoader('E04Preload.vue')
const E05AppLifecycle = createDemo('E05AppLifecycle')
const E05Code = createCodeLoader('E05AppLifecycle.vue')
const E06NativeMenu = createDemo('E06NativeMenu')
const E06Code = createCodeLoader('E06NativeMenu.vue')
const E07Tray = createDemo('E07Tray')
const E07Code = createCodeLoader('E07Tray.vue')
const E08Dialog = createDemo('E08Dialog')
const E08Code = createCodeLoader('E08Dialog.vue')
const E09Shortcuts = createDemo('E09Shortcuts')
const E09Code = createCodeLoader('E09Shortcuts.vue')
const E10AutoUpdate = createDemo('E10AutoUpdate')
const E10Code = createCodeLoader('E10AutoUpdate.vue')
const E11Packaging = createDemo('E11Packaging')
const E11Code = createCodeLoader('E11Packaging.vue')
const E12Security = createDemo('E12Security')
const E12Code = createCodeLoader('E12Security.vue')
const E13Performance = createDemo('E13Performance')
const E13Code = createCodeLoader('E13Performance.vue')
const E14Storage = createDemo('E14Storage')
const E14Code = createCodeLoader('E14Storage.vue')
const E15MultiWindow = createDemo('E15MultiWindow')
const E15Code = createCodeLoader('E15MultiWindow.vue')

export const lessons: Lesson[] = [
  {
    id: 'E_01', title: 'Electron 架构与进程模型', navTitle: '架构模型', category: '基础架构',
    path: '/electron/e-1/architecture', summary: '理解 Electron 的主进程、渲染进程、预加载脚本三角色，以及 Chromium 多进程架构与 Node.js 的融合方式。',
    demo: E01Architecture, code: E01Code, language: 'vue',
    principle: 'Electron 融合 Chromium 渲染引擎与 Node.js 运行时：主进程（Main）管理应用生命周期与原生能力，渲染进程（Renderer）运行 Web 页面，预加载脚本（Preload）在上下文桥接中安全暴露 API。',
    flow: ['主进程通过 BrowserWindow 创建渲染进程。', '预加载脚本在渲染进程加载前执行，可访问 Node.js 与 Electron API。', '上下文隔离（contextIsolation）默认开启，预加载脚本通过 contextBridge 暴露受限 API。'],
    notes: ['每个窗口是一个独立渲染进程，崩溃不影响其他窗口。', '主进程崩溃会导致整个应用退出。', 'Utility 进程可运行 CPU 密集任务，不阻塞主进程。'],
    problem: '解决"Electron 应用由哪些进程组成、各进程职责是什么、以及如何安全地进行进程间通信"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/process-model',
  },
  {
    id: 'E_02', title: '主进程与 BrowserWindow', navTitle: '窗口管理', category: '基础架构',
    path: '/electron/e-2/main-window', summary: '使用 BrowserWindow 创建、配置和管理应用窗口，掌握窗口生命周期与 webPreferences 安全配置。',
    demo: E02MainWindow, code: E02Code, language: 'vue',
    principle: 'BrowserWindow 是主进程创建原生窗口的构造函数；webPreferences 控制渲染进程能力（Node.js 集成、上下文隔离、预加载脚本）；窗口生命周期事件（ready-to-show、closed）用于管理应用状态。',
    flow: ['在主进程中引入 BrowserWindow。', '配置 webPreferences（推荐：nodeIntegration: false, contextIsolation: true, preload 指定预加载脚本）。', '监听窗口生命周期事件，在 closed 时释放引用防止内存泄漏。'],
    notes: ['生产环境必须关闭 nodeIntegration，使用预加载脚本替代。', 'show: false 配合 ready-to-show 事件可避免窗口闪烁。', 'webSecurity: false 仅用于本地开发，生产环境必须开启。'],
    problem: '解决"如何创建原生桌面窗口、如何配置渲染进程安全策略、以及如何管理窗口生命周期"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/browser-window',
  },
  {
    id: 'E_03', title: 'IPC 进程间通信', navTitle: 'IPC 通信', category: '进程通信',
    path: '/electron/e-3/ipc', summary: '掌握 ipcMain、ipcRenderer 与 invoke/handle 模式，实现主进程与渲染进程的安全双向通信。',
    demo: E03IPC, code: E03Code, language: 'vue',
    principle: 'IPC（Inter-Process Communication）是 Electron 进程间通信机制：主进程通过 ipcMain.handle 暴露方法，渲染进程（通过预加载脚本）使用 ipcRenderer.invoke 调用；这种模式支持 Promise，适合请求-响应场景。',
    flow: ['主进程使用 ipcMain.handle(channel, handler) 注册可调用的 IPC 方法。', '预加载脚本通过 contextBridge.exposeInMainWorld 将调用封装为 API。', '渲染进程调用暴露的 API，获得 Promise 响应。'],
    notes: ['优先使用 invoke/handle 而非 send/on，前者支持异步返回。', 'IPC 通道名称应使用常量，避免魔法字符串。', '不要通过 IPC 传递大量数据（如整个文件内容），应使用文件路径。'],
    problem: '解决"渲染进程如何调用主进程的本地能力、主进程如何向渲染进程推送事件、以及如何避免 IPC 通信的安全风险"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/ipc',
  },
  {
    id: 'E_04', title: '预加载脚本与安全桥接', navTitle: '预加载脚本', category: '进程通信',
    path: '/electron/e-4/preload', summary: '编写预加载脚本，使用 contextBridge 安全暴露 API，理解上下文隔离的工作原理。',
    demo: E04Preload, code: E04Code, language: 'vue',
    principle: '预加载脚本在渲染进程加载前运行，可同时访问 Node.js 和 Electron API；contextBridge.exposeInMainWorld 将指定 API 注入渲染进程的 window 对象，且只暴露白名单方法，是 Electron 安全模型的核心。',
    flow: ['创建 preload.ts，导入 contextBridge 和 ipcRenderer。', '使用 contextBridge.exposeInMainWorld(apiKey, apiObject) 暴露受限 API。', '在渲染进程中通过 window.apiName 调用暴露的方法。'],
    notes: ['预加载脚本中不要直接暴露整个 ipcRenderer（安全风险）。', '暴露的方法应显式声明参数和返回值类型。', '多个预加载脚本可按需拆分，通过 webPreferences.preload 指定。'],
    problem: '解决"如何在开启上下文隔离的前提下让渲染进程安全使用 Electron API、如何避免直接暴露 Node.js 能力、以及如何设计合理的 API 边界"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/context-isolation',
  },
  {
    id: 'E_05', title: '应用生命周期与事件', navTitle: '应用生命周期', category: '应用管理',
    path: '/electron/e-5/app-lifecycle', summary: '掌握 app 模块的生命周期事件，实现启动初始化、单例锁定、协议处理和优雅退出。',
    demo: E05AppLifecycle, code: E05Code, language: 'vue',
    principle: 'app 模块控制应用生命周期：ready 事件后创建窗口，second-instance 事件实现单例应用，open-url/open-file 处理深层链接，before-quit 和 will-quit 实现优雅退出。',
    flow: ['监听 app.whenReady() 后创建主窗口。', '使用 app.requestSingleInstanceLock() 确保单例运行。', '监听窗口全部关闭事件（Windows/Linux 退出，macOS 保留 Dock 图标）。'],
    notes: ['macOS 上关闭所有窗口不会退出应用，需监听 app.activate。', 'second-instance 事件中应聚焦已有窗口而非创建新窗口。', 'before-quit 是执行清理（保存数据、关闭连接）的最后机会。'],
    problem: '解决"如何控制 Electron 应用的启动流程、如何实现单例应用、如何处理不同平台的退出行为差异、以及如何响应系统协议"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/app',
  },
  {
    id: 'E_06', title: '原生菜单与上下文菜单', navTitle: '原生菜单', category: '原生能力',
    path: '/electron/e-6/native-menu', summary: '使用 Menu 和 MenuItem 构建应用菜单、右键菜单和托盘菜单，掌握快捷键与角色（role）系统。',
    demo: E06NativeMenu, code: E06Code, language: 'vue',
    principle: 'Menu 模块构建原生菜单：应用菜单（setApplicationMenu）、上下文菜单（popup）、托盘菜单；role 属性自动绑定标准行为（undo、redo、copy、paste 等）；accelerator 定义快捷键。',
    flow: ['使用 Menu.buildFromTemplate(menuItems) 构建菜单。', '通过 Menu.setApplicationMenu(menu) 设置应用菜单。', '在渲染进程右键事件中调用 Menu.popup() 显示上下文菜单。'],
    notes: ['role 属性会自动本地化为系统语言，优先使用 role 而非手动实现。', 'macOS 的菜单栏与应用绑定，Windows/Linux 与窗口绑定。', '动态更新菜单时重建整个 Menu 实例，而非修改已有实例。'],
    problem: '解决"如何构建跨平台原生菜单、如何实现右键上下文菜单、如何通过 role 复用系统标准行为、以及如何绑定快捷键"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/menu',
  },
  {
    id: 'E_07', title: '系统托盘与通知', navTitle: '系统托盘', category: '原生能力',
    path: '/electron/e-7/tray-notification', summary: '创建系统托盘图标，实现托盘菜单、气泡通知和点击交互，掌握后台运行模式。',
    demo: E07Tray, code: E07Code, language: 'vue',
    principle: 'Tray 模块在系统托盘区创建图标；配合 Menu 实现右键菜单；Notification 模块发送系统通知；托盘应用通常隐藏 Dock 图标（macOS），通过托盘图标管理窗口显示。',
    flow: ['在主进程中创建 Tray 实例，传入图标路径。', '为 Tray 设置上下文菜单（setContextMenu）。', '监听 Tray 的 click 事件实现窗口显示/隐藏切换。'],
    notes: ['macOS 需要 22x22@2x 的模板图标（黑白，系统自动适配暗色模式）。', 'Notification 需要在 app.whenReady() 后调用。', '托盘应用应在关闭窗口时隐藏而非退出（macOS 尤其重要）。'],
    problem: '解决"如何创建系统托盘应用、如何实现最小化到托盘、如何发送系统通知、以及如何处理托盘图标的点击事件"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/tray',
  },
  {
    id: 'E_08', title: '文件对话框与系统对话框', navTitle: '文件对话框', category: '原生能力',
    path: '/electron/e-8/dialog', summary: '使用 dialog 模块打开文件选择、保存对话框和消息框，掌握异步 API 与返回值处理。',
    demo: E08Dialog, code: E08Code, language: 'vue',
    principle: 'dialog 模块提供原生系统对话框：showOpenDialog 选择文件/目录，showSaveDialog 保存文件，showMessageBox 显示消息；主进程直接使用，渲染进程通过 IPC 调用。',
    flow: ['主进程调用 dialog.showOpenDialog(mainWindow, options)。', '指定 filters 限制文件类型（如 [{ name: "Images", extensions: ["jpg", "png"] }]）。', '处理返回的 filePath（单选）或 filePaths（多选）数组。'],
    notes: ['渲染进程中可通过 ipcRenderer.invoke 调用主进程封装的对话框方法。', 'properties 数组控制对话框行为（openFile、openDirectory、multiSelections 等）。', 'macOS 支持在对话框中添加自定义按钮（buttonLabel）。'],
    problem: '解决"如何打开原生文件选择器、如何保存文件到指定位置、如何显示确认对话框、以及如何获取用户选择的路径"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/dialog',
  },
  {
    id: 'E_09', title: '全局快捷键与菜单快捷键', navTitle: '快捷键', category: '原生能力',
    path: '/electron/e-9/shortcuts', summary: '注册全局快捷键（即使应用未聚焦）和菜单快捷键，掌握快捷键冲突处理与动态注册。',
    demo: E09Shortcuts, code: E09Code, language: 'vue',
    principle: 'globalShortcut 模块注册系统级快捷键（应用未聚焦时也可触发）；MenuItem 的 accelerator 属性定义菜单快捷键；快捷键格式为平台无关的字符串（如 CmdOrCtrl+Shift+K）。',
    flow: ['使用 globalShortcut.register(accelerator, callback) 注册全局快捷键。', '在应用退出时调用 globalShortcut.unregisterAll() 释放快捷键。', '菜单快捷键通过 MenuItem 的 accelerator 属性定义，无需手动注册。'],
    notes: ['全局快捷键可能与其他应用冲突，注册前应检查是否已注册（isRegistered）。', 'macOS 的 Cmd 对应 Windows/Linux 的 Ctrl，使用 CmdOrCtrl 可跨平台。', '快捷键字符串区分大小写，Shift+A 与 Shift+a 不同。'],
    problem: '解决"如何实现全局快捷键、如何避免快捷键冲突、如何动态注册/注销快捷键、以及如何在菜单中显示快捷键提示"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/global-shortcut',
  },
  {
    id: 'E_10', title: '自动更新机制', navTitle: '自动更新', category: '分发部署',
    path: '/electron/e-10/auto-update', summary: '使用 autoUpdater 模块实现应用自动更新，掌握更新服务器配置、签名验证和更新事件处理。',
    demo: E10AutoUpdate, code: E10Code, language: 'vue',
    principle: 'autoUpdater 模块支持应用自动更新：主进程监听更新事件（checking-for-update、update-available、update-downloaded 等）；更新服务器需提供符合规范的更新元数据和签名文件；生产环境推荐使用 electron-updater（electron-builder 内置）。',
    flow: ['配置更新服务器 URL（setFeedURL）。', '监听 autoUpdater 事件处理更新流程。', '在 update-downloaded 后提示用户重启应用完成更新。'],
    notes: ['macOS 自动更新需要代码签名（codesign）和公证（notarization）。', 'Windows 需要有效的代码签名证书（Authenticode）。', 'electron-updater 支持增量更新（diff），减少下载体积。'],
    problem: '解决"如何实现桌面应用的自动更新、如何配置更新服务器、如何验证更新包完整性、以及如何处理更新失败"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/auto-updater',
  },
  {
    id: 'E_11', title: '打包与分发', navTitle: '打包分发', category: '分发部署',
    path: '/electron/e-11/packaging', summary: '使用 electron-builder 或 electron-forge 打包跨平台应用，掌握配置、代码签名、平台差异和发布流程。',
    demo: E11Packaging, code: E11Code, language: 'vue',
    principle: 'electron-builder 是主流打包工具：配置打包目标（dmg、exe、AppImage）、代码签名、自动更新和发布；不同平台有不同打包要求和依赖（如 Windows 需要 wine 打包 Windows 应用）。',
    flow: ['安装 electron-builder 并配置 package.json 的 build 字段。', '指定各平台的打包配置（mac、win、linux）。', '运行打包命令生成各平台安装包。'],
    notes: ['macOS 打包需要在 macOS 机器上完成（或使用 CI）。', 'Windows 的 NSIS 安装包支持自定义安装步骤。', 'Linux 推荐同时提供 AppImage、deb、rpm 三种格式。'],
    problem: '解决"如何打包跨平台 Electron 应用、如何处理各平台的打包差异、如何配置代码签名、以及如何自动化发布流程"的问题。',
    officialUrl: 'https://www.electron.build/',
  },
  {
    id: 'E_12', title: '安全最佳实践', navTitle: '安全实践', category: '安全与性能',
    path: '/electron/e-12/security', summary: '理解 Electron 安全模型，掌握上下文隔离、内容安全策略（CSP）、权限管理和依赖审计。',
    demo: E12Security, code: E12Code, language: 'vue',
    principle: 'Electron 安全核心原则：关闭 nodeIntegration、开启 contextIsolation、使用预加载脚本、设置 CSP、限制 webSecurity: false、审计依赖（npm audit）、启用沙箱（sandbox）。',
    flow: ['确保 webPreferences 中 nodeIntegration: false、contextIsolation: true。', '在 HTML 的 <head> 最顶部设置 Content-Security-Policy。', '仅加载可信内容，远程内容使用 <webview> 并限制权限。'],
    notes: ['永远不要使用 allowpopups 等危险权限。', 'CSP 应禁止 unsafe-inline 和 unsafe-eval。', '定期运行 npm audit 和 npm outdated 检查依赖漏洞。'],
    problem: '解决"如何防止 Electron 应用被注入恶意代码、如何限制渲染进程的 native 能力、如何防止 XSS 攻击升级为远程代码执行、以及如何管理依赖安全"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/security',
  },
  {
    id: 'E_13', title: '性能优化', navTitle: '性能优化', category: '安全与性能',
    path: '/electron/e-13/performance', summary: '优化 Electron 应用启动速度、内存占用和渲染性能，掌握 V8 堆内存调优与性能分析工具。',
    demo: E13Performance, code: E13Code, language: 'vue',
    principle: 'Electron 性能优化从三方面入手：启动优化（延迟加载、骨架屏）、内存优化（限制渲染进程数量、及时释放引用）、渲染优化（Web 性能最佳实践）；主进程可通过 --max-old-space-size 调整 V8 堆内存。',
    flow: ['使用 app.whenReady() 后再创建窗口，避免阻塞启动。', '渲染进程中懒加载非关键模块（动态 import）。', '监控内存使用（process.memoryUsage()），及时释放不需要的引用。'],
    notes: ['每个额外渲染进程约占用 30-50MB 内存。', '预加载脚本应最小化，仅暴露必要 API。', '使用 Chrome DevTools 的 Performance 面板分析渲染性能。'],
    problem: '解决"Electron 应用启动慢、内存占用高、渲染卡顿、以及如何定位性能瓶颈"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/performance',
  },
  {
    id: 'E_14', title: '本地数据存储', navTitle: '数据存储', category: '数据管理',
    path: '/electron/e-14/storage', summary: '对比 electron-store、IndexedDB、localStorage 和 SQLite，掌握 Electron 应用的本地数据存储方案。',
    demo: E14Storage, code: E14Code, language: 'vue',
    principle: 'Electron 应用有多种数据存储选择：electron-store（基于 JSON，适合配置）、IndexedDB（浏览器标准，适合结构化数据）、SQLite（关系型，适合复杂查询）；主进程可直接读写文件，渲染进程通过 IPC 调用。',
    flow: ['小配置使用 electron-store（自动处理用户数据目录）。', '结构化数据使用 IndexedDB 或 localStorage。', '复杂数据或关系型需求使用 better-sqlite3 或 sql.js。'],
    notes: ['electron-store 默认存储在 app.getPath("userData") 目录。', 'JSON 存储不适合大数据量（读写全量）。', '主进程可直接使用 Node.js fs 模块，渲染进程需通过 IPC。'],
    problem: '解决"Electron 应用应该如何存储本地数据、不同存储方案的适用场景、如何保证数据持久化、以及如何在主进程和渲染进程间共享数据"的问题。',
    officialUrl: 'https://github.com/sindresorhus/electron-store',
  },
  {
    id: 'E_15', title: '多窗口管理与通信', navTitle: '多窗口管理', category: '数据管理',
    path: '/electron/e-15/multi-window', summary: '管理多个应用窗口，实现窗口间通信、数据共享和状态同步，掌握窗口引用管理和内存泄漏预防。',
    demo: E15MultiWindow, code: E15Code, language: 'vue',
    principle: '多窗口应用需维护窗口引用数组；窗口间通信可通过主进程中转（ipcMain 转发）或共享存储（electron-store）；窗口关闭时必须释放引用（delete windowMap[id]）防止内存泄漏。',
    flow: ['使用 Map 或对象存储窗口引用（windowById）。', '新窗口通过 BrowserWindow 创建，并存入引用表。', '窗口 closed 事件中从引用表移除对应条目。'],
    notes: ['不要使用全局变量存储窗口引用，应使用集中管理的 Map。', '窗口间通信优先通过主进程中转，避免直接跨窗口访问。', 'macOS 上所有窗口关闭后应用仍运行，需单独处理。'],
    problem: '解决"如何管理多个窗口、如何实现窗口间数据传递、如何避免窗口引用导致的内存泄漏、以及如何处理多窗口应用的生命周期"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/browser-window',
  },
]
