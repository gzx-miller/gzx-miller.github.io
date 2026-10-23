import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import E01Architecture from '../../demos/electron/E01ArchitectureArticle.vue'
import E02MainWindow from '../../demos/electron/E02MainWindowArticle.vue'
import E03IPC from '../../demos/electron/E03IPCArticle.vue'
import E04Preload from '../../demos/electron/E04PreloadArticle.vue'
import E05AppLifecycle from '../../demos/electron/E05AppLifecycleArticle.vue'
import E06NativeMenu from '../../demos/electron/E06NativeMenuArticle.vue'
import E07Tray from '../../demos/electron/E07TrayArticle.vue'
import E08Dialog from '../../demos/electron/E08DialogArticle.vue'
import E09Shortcuts from '../../demos/electron/E09ShortcutsArticle.vue'
import E10AutoUpdate from '../../demos/electron/E10AutoUpdateArticle.vue'
import E11Packaging from '../../demos/electron/E11PackagingArticle.vue'
import E12Security from '../../demos/electron/E12SecurityArticle.vue'
import E13Performance from '../../demos/electron/E13PerformanceArticle.vue'
import E14Storage from '../../demos/electron/E14StorageArticle.vue'
import E15MultiWindow from '../../demos/electron/E15MultiWindowArticle.vue'
// 该分类专属的演示样式，随分类数据一起按需加载
import '../../styles/category-electron.css'

const electronCodeModules = import.meta.glob<string>('../../demos/electron-code/*', { query: '?raw', import: 'default' })

function createCodeLoader(path: string) {
  const loader = electronCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const E01Code = createCodeLoader('electron-code/E01Code.js.txt')
const E02Code = createCodeLoader('electron-code/E02Code.js.txt')
const E03Code = createCodeLoader('electron-code/E03Code.js.txt')
const E04Code = createCodeLoader('electron-code/E04Code.js.txt')
const E05Code = createCodeLoader('electron-code/E05Code.js.txt')
const E06Code = createCodeLoader('electron-code/E06Code.js.txt')
const E07Code = createCodeLoader('electron-code/E07Code.js.txt')
const E08Code = createCodeLoader('electron-code/E08Code.js.txt')
const E09Code = createCodeLoader('electron-code/E09Code.js.txt')
const E10Code = createCodeLoader('electron-code/E10Code.js.txt')
const E11Code = createCodeLoader('electron-code/E11Code.js.txt')
const E12Code = createCodeLoader('electron-code/E12Code.js.txt')
const E13Code = createCodeLoader('electron-code/E13Code.js.txt')
const E14Code = createCodeLoader('electron-code/E14Code.js.txt')
const E15Code = createCodeLoader('electron-code/E15Code.js.txt')

export const lessons: Lesson[] = [
  {
    id: 'EL_01', title: 'Electron 架构与进程模型', navTitle: '架构模型', category: '基础架构',
    path: '/electron/e-1/architecture', summary: '理解 Electron 的主进程、渲染进程、预加载脚本三个角色如何分工，以及三者之间的一条 IPC 调用链是怎样串联起来的。',
    demo: null,
    demoComponent: E01Architecture, code: E01Code, language: 'javascript',
    principle: 'Electron 把 Chromium 与 Node.js 融合进同一个桌面运行时：主进程（Main）是唯一的，负责应用生命周期、窗口创建与系统原生能力；每个 BrowserWindow 实例对应一个渲染进程（Renderer）运行 Web 页面；预加载脚本（Preload）运行在两者之间，通过 contextBridge 把受限 API 暴露给渲染进程。',
    flow: ['主进程通过 BrowserWindow 启动渲染进程并加载页面（创建于主进程、运行于渲染进程）。', '渲染进程调用预加载脚本暴露的 API，请求经 IPC 转发到主进程。', '主进程处理完成后沿同一条 IPC 通道返回结果，渲染进程拿到 Promise 响应。', '在控制台输出 process.type 或在 DevTools 中观察，确认当前代码运行在主进程还是渲染进程。'],
    notes: ['一个窗口对应一个渲染进程，窗口崩溃不影响其他窗口；但主进程一旦崩溃，整个应用会退出。', 'Electron 20 起默认启用沙箱：渲染进程与预加载脚本均运行在受限环境中，无法直接访问全部 Node.js 能力。', 'Chromium 内置的网络、GPU 等模块会以独立的 Utility/辅助进程运行，由系统自动管理，通常无需开发者介入。', '渲染进程的 Node 集成默认关闭：window.require、process 等能力需经预加载脚本按白名单提供，不要试图在页面里直接引入 Node 模块。'],
    problem: '解决"Electron 应用由哪些进程组成、各进程职责是什么、以及如何安全地进行进程间通信"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/process-model',
  },
  {
    id: 'EL_02', title: '主进程与 BrowserWindow', navTitle: '窗口管理', category: '基础架构',
    path: '/electron/e-2/main-window', summary: '用 BrowserWindow 创建、配置并管理应用窗口，掌握窗口生命周期事件顺序与 webPreferences 的安全配置。',
    demo: null,
    demoComponent: E02MainWindow, code: E02Code, language: 'javascript',
    principle: 'BrowserWindow 是主进程中创建原生窗口的构造函数，构造参数既描述外观（尺寸、边框、置顶）也可用 show: false 延迟显示；webPreferences 决定渲染进程能力，其中 nodeIntegration: false 与 contextIsolation: true 是安全基线；窗口生命周期按 ready-to-show → show → focus → close → closed 依次触发。',
    flow: ['在主进程中使用 new BrowserWindow(options) 创建窗口，并配置 webPreferences（nodeIntegration: false、contextIsolation: true、preload 指向预加载脚本）。', '用 show: false 创建窗口，在 ready-to-show 事件后再调用 show()，避免白屏闪烁。', '监听 close / closed 事件，在窗口关闭后将 JavaScript 引用置空，释放对象防止内存泄漏。', '把窗口尺寸与位置持久化到用户偏好，下次启动时读回还原，保持桌面应用的连续使用体验。'],
    notes: ['生产环境必须关闭 nodeIntegration，如需 Node 能力只能通过 preload 暴露受限 API（contextIsolation 保持开启）。', 'show: false 配合 ready-to-show 是避免首屏白屏/闪烁的常见做法。', 'webSecurity: false 只用于本地开发叠加跨域场景，生产环境必须保持为 true。', '窗口创建是重操作：多窗口应用应复用实例，创建前先检查同类窗口是否已存在，存在则聚焦而不是重复新建。'],
    problem: '解决"如何创建原生桌面窗口、如何配置渲染进程安全策略、以及如何管理窗口生命周期"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/browser-window',
  },
  {
    id: 'EL_03', title: 'IPC 进程间通信', navTitle: 'IPC 通信', category: '进程通信',
    path: '/electron/e-3/ipc', summary: '掌握 ipcMain.handle + ipcRenderer.invoke 与 ipcMain.on + ipcRenderer.send 两种 IPC 模式，理解请求-响应与单向事件的区别。',
    demo: null,
    demoComponent: E03IPC, code: E03Code, language: 'javascript',
    principle: 'IPC（进程间通信）是渲染进程与主进程交换数据的唯一通道：invoke/handle 是 Promise 风格的请求-响应（渲染进程 invoke、主进程 handle 返回值）；send/on 是单向事件，需要通过 event.reply 或 webContents.send 才能回传；所有 IPC 都要经预加载脚本封装，主进程收到的是不可信的渲染进程数据。',
    flow: ['主进程用 ipcMain.handle(channel, handler) 注册可调用的方法，或用 ipcMain.on 监听单向事件。', '预加载脚本通过 contextBridge 把 ipcRenderer.invoke/send 封装成白名单 API。', '渲染进程只调用暴露的 API：invoke 返回 Promise 拿到结果，事件回调里收到 reply。', '为每个通道约定统一的数据结构与错误信封（如 { ok, data, message }），handler 内部 try/catch 后按信封返回。'],
    notes: ['优先用 invoke/handle 处理需要返回值的请求；send/on 适合纯单向通知（如上报日志）。', '渲染进程传来的参数不可信，主进程 handler 内必须校验类型与范围，如限制目录浏览。', 'IPC 会序列化数据：不要传递整份大文件内容，宜传文件路径再由主进程读写。', '用 webContents.send 推送前先检查目标窗口是否已销毁（win.isDestroyed()），避免向已关闭窗口发送导致异常。'],
    problem: '解决"渲染进程如何调用主进程的本地能力、主进程如何向渲染进程推送事件、以及如何避免 IPC 通信的安全风险"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/ipc',
  },
  {
    id: 'EL_04', title: '预加载脚本与安全桥接', navTitle: '预加载脚本', category: '进程通信',
    path: '/electron/e-4/preload', summary: '编写预加载脚本，用 contextBridge.exposeInMainWorld 安全暴露白名单 API，理解上下文隔离与"绝不整对象暴露"的安全边界。',
    demo: null,
    demoComponent: E04Preload, code: E04Code, language: 'javascript',
    principle: '预加载脚本在渲染进程加载前运行，是唯一能同时触及受限 Node 子集与 Electron API 的地方；contextBridge.exposeInMainWorld(key, api) 只把白名单方法注入渲染进程的 window 对象，并在底层做类型隔离，成为上下文隔离下渲染进程使用原生能力的唯一入口。',
    flow: ['创建 preload 脚本，从 electron 引入 contextBridge（沙箱下无法 require 完整 Node 模块）。', '用 contextBridge.exposeInMainWorld("api", {...}) 逐一暴露需要的函数，每个函数内部封装 ipcRenderer.invoke/send。', '渲染进程中通过 window.api.xxx 调用，渲染进程自身接触不到 ipcRenderer 或 Node.js。', '按领域（文件、设置、窗口）分组命名 API，并在 preload 内对参数做第一道类型收窄。'],
    notes: ['不要直接暴露整个 ipcRenderer 或 require：否则被 XSS 攻击的渲染进程可任意调用主进程 IPC 通道。', '每个窗口的 webPreferences.preload 只能指向一个脚本；需要拆分时应在单个 preload 内手动合并模块。', '暴露对象应保持最小，必要时用 Object.freeze 固定，避免渲染进程改写接口。', 'preload 中只做通道转发与参数整形，不放业务逻辑：复杂逻辑留在主进程，便于测试与安全审计。'],
    problem: '解决"如何在开启上下文隔离的前提下让渲染进程安全使用 Electron API、如何避免直接暴露 Node.js 能力、以及如何设计合理的 API 边界"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/context-isolation',
  },
  {
    id: 'EL_05', title: '应用生命周期与事件', navTitle: '应用生命周期', category: '应用管理',
    path: '/electron/e-5/app-lifecycle', summary: '梳理 app 模块的生命周期事件先后顺序（启动、激活、退出），并据此实现单例锁定与优雅退出。',
    demo: null,
    demoComponent: E05AppLifecycle, code: E05Code, language: 'javascript',
    principle: 'app 模块驱动整个应用的生命周期：whenReady 后才可创建窗口；window-all-closed 决定退出还是驻留（macOS 驻留）；activate 在 macOS 点击 Dock 时触发；before-quit/will-quit 走退出清理；requestSingleInstanceLock 保证单实例，第二次启动触发 second-instance。',
    flow: ['依次监听 app.whenReady、browser-window-created、web-contents-created 等事件，理解启动顺序。', '在 window-all-closed 中判断：Windows/Linux 退出，macOS 保留，并在 activate 时重建最后一个窗口。', '退出链路 before-quit → will-quit → quit：在 before-quit 里做清理，并通过 requestSingleInstanceLock 实现单例。', '全局资源（托盘、快捷键、自动更新）统一在 ready 之后初始化，确保依赖 app 就绪的能力都在这时注册。'],
    notes: ['生命周期先触发后，不同平台退出行为差别很大：macOS 关窗不退出，Windows/Linux 默认退出。', 'app.requestSingleInstanceLock() 拿不到锁就应立刻 app.quit()；拿到锁后在 second-instance 中聚焦已有窗口。', 'before-quit 可被 event.preventDefault() 拦截用于保存数据，确认后再 app.quit() 完成退出。', '开发期热重载可能多次触发 ready：初始化逻辑要幂等，或借助单实例锁避免全局资源被重复注册。'],
    problem: '解决"如何控制 Electron 应用的启动流程、如何实现单例应用、如何处理不同平台的退出行为差异、以及如何响应系统协议"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/app',
  },
  {
    id: 'EL_06', title: '原生菜单与上下文菜单', navTitle: '原生菜单', category: '原生能力',
    path: '/electron/e-6/native-menu', summary: '用 Menu.buildFromTemplate 构建并挂载应用原生菜单，掌握 role 复用与 accelerator 快捷键。',
    demo: null,
    demoComponent: E06NativeMenu, code: E06Code, language: 'javascript',
    principle: 'Menu 模块负责构造原生菜单：buildFromTemplate 接收菜单项描述结构，setApplicationMenu 把它挂到应用/窗口菜单栏；标准操作（撤销、剪切、复制、粘贴、全屏、退出等）优先用 role 声明，由系统自动本地化并绑定行为；菜单项上的 accelerator 说明该动作的快捷键展示与绑定。',
    flow: ['用 Menu.buildFromTemplate([...]) 把 文件/编辑/视图/窗口/帮助 的菜单树写成模板。', '对标准动作使用 role 而非手写 click，让系统处理本地化与行为。', '通过 Menu.setApplicationMenu(menu) 挂载；需要右键菜单时用 menu.popup() 在对应位置弹出。', '菜单项 click 中先用 BrowserWindow.getFocusedWindow() 取当前窗口并判空，再执行对应动作，避免操作到错误或已销毁的窗口。'],
    notes: ['role 是首选：它给出系统标准行为的自动实现与本地化文案，避免重复造轮子。', '菜单栏归属有平台差异：macOS 与应用绑定，Windows/Linux 与窗口绑定。', '菜单更新是"重建再挂载"：改动菜单时重新 buildFromTemplate 并 setApplicationMenu，而不是修改已挂载实例。', 'accelerator 只在应用聚焦时生效，全局按键需另用 globalShortcut 注册，两者职责不要混淆。'],
    problem: '解决"如何构建跨平台原生菜单、如何实现右键上下文菜单、如何通过 role 复用系统标准行为、以及如何绑定快捷键"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/menu',
  },
  {
    id: 'EL_07', title: '系统托盘与通知', navTitle: '系统托盘', category: '原生能力',
    path: '/electron/e-7/tray-notification', summary: '创建系统托盘图标并挂上菜单，通过 click/右键交互切换窗口显示，实现后台常驻。',
    demo: null,
    demoComponent: E07Tray, code: E07Code, language: 'javascript',
    principle: 'Tray 在系统菜单栏/任务栏角落放一个常驻图标：new Tray(icon) 创建，setContextMenu 挂右键菜单，setToolTip 设悬浮提示；监听 click/double-click 切换主窗口显隐；配合 window close 事件隐藏而非退出，即可做成常驻后台的托盘应用。',
    flow: ['在主进程用 new Tray(nativeImage.createFromPath(...)) 创建托盘，并用全局变量持有实例。', '用 setToolTip 设提示、setContextMenu 挂右键菜单，再监听 click 做窗口显示/隐藏切换。', '拦截窗口 close：普通关闭只 hide 到托盘，仅在用户主动选"退出"时才真正 app.quit()。', '维护 isQuitting 标志：从托盘菜单选"退出"时先置位再关闭窗口，让 close 拦截放行真正的退出路径。'],
    notes: ['Tray/NativeImage 必须被全局引用持有，否则会被 GC 回收导致图标消失。', 'macOS 托盘图标建议用黑白 template 图（@2x），系统能自动适配深浅色模式。', '需要通知配合时，用 Notification 在 app.whenReady() 之后弹出，引导用户从托盘恢复窗口。', '窗口 close 被拦截后，window-all-closed 不再代表用户想退出；退出意图必须由显式的"退出"菜单项传递，避免应用"关不掉"。'],
    problem: '解决"如何创建系统托盘应用、如何实现最小化到托盘、如何发送系统通知、以及如何处理托盘图标的点击事件"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/tray',
  },
  {
    id: 'EL_08', title: '文件对话框与系统对话框', navTitle: '文件对话框', category: '原生能力',
    path: '/electron/e-8/dialog', summary: '使用 dialog 模块打开原生文件选择、保存对话框与消息框，掌握异步 API 的返回值结构（canceled/filePaths）。',
    demo: null,
    demoComponent: E08Dialog, code: E08Code, language: 'javascript',
    principle: 'dialog 模块提供与系统一致的原生对话框：showOpenDialog 选择文件/目录，showSaveDialog 指定保存路径，showMessageBox 弹出消息/提问；三者均为异步（返回 Promise），必须用 await 拿到结果并先判断 result.canceled。',
    flow: ['主进程调用 await dialog.showOpenDialog(win, {...}) 弹出生效对话框。', '用 filters 限定可选文件类型，用 properties 控制行为（openFile、multiSelections）。', '先判断 result.canceled 再处理返回值：打开对话框取 filePaths，保存对话框取 filePath，消息框取 response 按钮索引。', '把对话框封装成 preload 暴露的单一方法，渲染进程只拿最终路径或 null，不感知 dialog 细节。'],
    notes: ['dialog 的异步版本普遍带 canceled 标记，务必判空后再取路径；同步版本（*Sync）会阻塞主进程，应避免。', '渲染进程不能直接用 dialog，需经 preload + IPC 调用主进程封装的方法。', '消息框定位经典按钮：defaultId 设默认按钮、cancelId 设按 ESC 时命中的按钮。', '把窗口实例作为第一个参数传入对话框调用，让对话框正确附着在该窗口上（macOS 上以 sheet 形式呈现），父子关系更清晰。'],
    problem: '解决"如何打开原生文件选择器、如何保存文件到指定位置、如何显示确认对话框、以及如何获取用户选择的路径"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/dialog',
  },
  {
    id: 'EL_09', title: '全局快捷键与菜单快捷键', navTitle: '快捷键', category: '原生能力',
    path: '/electron/e-9/shortcuts', summary: '注册 globalShortcut 全局快捷键（应用未聚焦也能触发）与菜单 accelerator，掌握冲突检查与退出时的资源释放。',
    demo: null,
    demoComponent: E09Shortcuts, code: E09Code, language: 'javascript',
    principle: 'globalShortcut 注册系统级全局快捷键，renderer 未聚焦也能捕获；register 前应先 isRegistered 检查占用，成功后返回布尔值；菜单快捷键则只需在 MenuItem 上写 accelerator 即可由菜单系统自动注册。',
    flow: ['用 globalShortcut.register("CmdOrCtrl+Shift+K", callback) 注册全局快捷键，并校验注册返回值是否成功。', '对可能冲突的按键先用 globalShortcut.isRegistered() 检查是否已被别的应用占用。', '应用退出时在 will-quit 中调用 globalShortcut.unregisterAll() 释放所有注册的快捷键。', '为用户提供快捷键自定义入口：键位存入配置，启动时统一注册，改键时先注销旧绑定再注册新绑定。'],
    notes: ['全局快捷键是系统级资源，可能与其他应用冲突，注册失败时给出降级提示而不要强行覆盖。', 'accelerator 用 CmdOrCtrl 前缀实现跨平台；菜单快捷键定义在 MenuItem 的 accelerator 上，无需手动与 globalShortcut 重复注册。', '必须在应用退出前注销全局快捷键，否则残留的系统级绑定会一直占用按键。', '快捷键回调触发弹窗或聚焦窗口前，先确认窗口仍存在、必要时重建，不要假设用户切走期间窗口一直可用。'],
    problem: '解决"如何实现全局快捷键、如何避免快捷键冲突、如何动态注册/注销快捷键、以及如何在菜单中显示快捷键提示"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/global-shortcut',
  },
  {
    id: 'EL_10', title: '自动更新机制', navTitle: '自动更新', category: '分发部署',
    path: '/electron/e-10/auto-update', summary: '用 electron-updater 实现应用自动更新，掌握检查→发现→下载→提示重启的更新事件流水线。',
    demo: null,
    demoComponent: E10AutoUpdate, code: E10Code, language: 'javascript',
    principle: '生产环境推荐用 electron-builder 配套的 electron-updater：主进程依次监听 checking-for-update、update-available、download-progress、update-downloaded，最终调 quitAndInstall 重启；更新源用 setFeedURL 指向发布服务（下载对应的 latest.yml 元数据），而不像 Electron 内置的 autoUpdater 那样需要自建更新服务器。',
    flow: ['用 autoUpdater.setFeedURL(...) 指定更新服务器与发布配置。', '依次监听 checking-for-update、update-available、download-progress、update-downloaded，让更新流程按事件推进。', 'update-downloaded 后弹窗提示用户，选择"重启"时调用 autoUpdater.quitAndInstall() 完成升级。', '把 download-progress 的进度回传渲染进程展示，让长下载过程对用户可见、可感知。'],
    notes: ['macOS 发布更新前必须对安装包代码签名并做 notarization（公证），否则更新会被系统拒绝。', 'Windows 更新需有效的 Authenticode 签名，并配合 latest.yml 的 blockmap 做增量更新，减少下载量。', '与 Electron 内置 autoUpdater 的最大差异：electron-updater 覆盖自动更新服务器选择、签名验证与跨平台打包产物，落地更省事。', '自动更新只在打包后的安装版中生效：开发环境调用会直接报错，接入前先用 app.isPackaged 判断再启用。'],
    problem: '解决"如何实现桌面应用的自动更新、如何配置更新服务器、如何验证更新包完整性、以及如何处理更新失败"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/auto-updater',
  },
  {
    id: 'EL_11', title: '打包与分发', navTitle: '打包分发', category: '分发部署',
    path: '/electron/e-11/packaging', summary: '用 electron-builder 把应用打包成各平台安装包，掌握 build 配置、代码签名与平台差异。',
    demo: null,
    demoComponent: E11Packaging, code: E11Code, language: 'javascript',
    principle: 'electron-builder 读取 package.json 的 build 字段（appId、productName、mac/win/linux 各 target）后产出安装包：mac 出 dmg/zip（需签名与公证），win 出 nsis 安装程序或便携化 exe（需 Authenticode 证书），linux 出 AppImage/deb/rpm；跨平台产物无法在本机通用打包（尤其 macOS 只能在 macOS 上构建）。',
    flow: ['在 package.json 的 build 字段配置 appId、productName，并为 mac/win/linux 分别声明 target 与图标。', '在 scripts 中定义 pack（--dir 免安装包目录产物）与 dist 系列命令按平台打包。', '为发布准备签名/公证资源（macOS 证书与公证、Windows 证书），并通过 CI 自动构建各平台。', '产物本地完整走查一遍：安装、启动、升级覆盖与卸载路径，确认图标、菜单和文件关联都正确。'],
    notes: ['macOS 安装包必须在 macOS（或跑在 macOS 的 CI）上构建，跨平台交叉编译受限。', 'Windows 用 NSIS 目标出安装程序，可定制安装步骤与卸载逻辑。', 'Linux 建议同时产出 AppImage、deb、rpm，兼顾免安装与发行版安装。', 'appId、版本号与 productName 打包前就要定稳：版本号决定升级判定与 latest.yml 匹配，appId 决定系统识别与后续迁移成本。'],
    problem: '解决"如何打包跨平台 Electron 应用、如何处理各平台的打包差异、如何配置代码签名、以及如何自动化发布流程"的问题。',
    officialUrl: 'https://www.electron.build/',
  },
  {
    id: 'EL_12', title: '安全最佳实践', navTitle: '安全实践', category: '安全与性能',
    path: '/electron/e-12/security', summary: '建立 Electron 应用的安全基线：关闭 nodeIntegration、开启 contextIsolation、配置 CSP 并审计依赖，收紧渲染进程能力。',
    demo: null,
    demoComponent: E12Security, code: E12Code, language: 'javascript',
    principle: 'Electron 的安全要点是把资源最小权限落实到渲染进程：webPreferences 里 nodeIntegration: false、contextIsolation: true、sandbox 保持默认开启；用 Content-Security-Policy 限制可加载的资源，防止注入脚本；只加载可信内容并定期审计依赖，避免 XSS 升级为对主进程的远程代码执行。',
    flow: ['逐项核对 webPreferences：nodeIntegration 关闭、contextIsolation 开启、webSecurity 开启，并通过 preload 暴露所需 API。', '在页面 <head> 最顶部加入 CSP meta（default-src/script-src 都收紧为 self），限制可加载资源。', '不加载远程脚本，并对依赖执行 npm audit，及时发现并升级有已知漏洞的包。', '开发期观察 Electron 输出的安全警告（security-warnings），把不安全配置与用法尽早暴露出来。'],
    notes: ['渲染进程被认为可被攻破，因此主进程是信任边界，一切 IPC 入参都要校验。', 'CSP 至少要收紧 script-src：禁止 script 的 unsafe-inline 与 unsafe-eval（样式留个可控的 unsafe-inline 可接受）。', '不在能加载远程内容的页面放开敏感能力，并定期跑 npm audit/npm outdated 做依赖体检。', 'shell.openExternal 打开外链前必须白名单校验协议与域名，防止被注入 file:// 或自定义协议导致命令执行。'],
    problem: '解决"如何防止 Electron 应用被注入恶意代码、如何限制渲染进程的 native 能力、如何防止 XSS 攻击升级为远程代码执行、以及如何管理依赖安全"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/security',
  },
  {
    id: 'EL_13', title: '性能优化', navTitle: '性能优化', category: '安全与性能',
    path: '/electron/e-13/performance', summary: '从启动、内存、渲染三条线优化 Electron 应用，掌握延迟加载、引用释放与内存监控。',
    demo: null,
    demoComponent: E13Performance, code: E13Code, language: 'javascript',
    principle: 'Electron 性能主要看三条线：启动优化（主进程避免同步 I/O、非关键模块延迟加载、首屏骨架屏）、内存优化（控制渲染进程数量、及时释放不再需要的引用）、渲染优化（长列表虚拟滚动、事件防抖节流、CSS 硬件加速）；主进程可用 process.memoryUsage() 观察 RSS 等水位。',
    flow: ['启动阶段：在 app.whenReady() 后才创建窗口，把耗时模块放到首屏空闲后再动态加载。', '运行阶段：定时用 process.memoryUsage() 采样 RSS 水位，定位内存异常增长。', '对已知开销大的任务拆分时机或放到 WebWorker/子进程，避免阻塞 UI 与主进程。', '用 DevTools 的 Performance 面板录制启动与关键交互，先量化瓶颈位置，再决定优化手段。'],
    notes: ['每个额外打开的渲染进程都会带来几十 MB 的内存量级成本，窗口不要随意堆叠。', '窗口/WebContents 对象关闭后要主动释放引用，否则 GC 无法回收导致内存持续上涨。', '用 Chrome DevTools 的 Performance 与 Memory 面板分别定位渲染与内存瓶颈。', '首屏不必等全部数据就绪：骨架屏与渐进渲染让窗口尽快可见，比把所有启动逻辑前置更有效。'],
    problem: '解决"Electron 应用启动慢、内存占用高、渲染卡顿、以及如何定位性能瓶颈"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/tutorial/performance',
  },
  {
    id: 'EL_14', title: '本地数据存储', navTitle: '数据存储', category: '数据管理',
    path: '/electron/e-14/storage', summary: '对比 electron-store、IndexedDB、SQLite 与 localStorage 的适用场景，按数据形态选对本地存储方案。',
    demo: null,
    demoComponent: E14Storage, code: E14Code, language: 'javascript',
    principle: 'Electron 本地存储按数据形态分四路：electron-store 读写 JSON 文件、适合配置与设置；IndexedDB 是 Web 标准异步存储、适合结构化离线数据；localStorage 同步键值、只适合临时小数据；SQLite（如 better-sqlite3）关系型、承载复杂查询与筛选。',
    flow: ['配置/设置这类小对象优先用 electron-store：自动落到 userData 下的 JSON，键路径读写。', '需要异步的高结构化数据（离线缓存）用 IndexedDB；同步临时的用 localStorage。', '涉及复杂查询与多表关联再用 better-sqlite3/sql.js，按 IPC 交给主进程执行。', '把各存储方案的读写封装成主进程服务模块、经 IPC 统一对外，便于后续替换实现。'],
    notes: ['electron-store 默认落在 app.getPath("userData") 目录；但它本身并不自动加密，敏感字段需自行加密处理。', 'electron-store 是整文件读写，数据量大时效率低，不适合频繁写入的大数据。', '渲染进程里的 Web 存储（IndexedDB/localStorage）无法供主进程直接访问，共享数据要经 IPC。', 'userData 路径在 Windows 与 macOS 上不同，不要在代码里硬编码磁盘路径，统一用 app.getPath 获取。'],
    problem: '解决"Electron 应用应该如何存储本地数据、不同存储方案的适用场景、如何保证数据持久化、以及如何在主进程和渲染进程间共享数据"的问题。',
    officialUrl: 'https://github.com/sindresorhus/electron-store',
  },
  {
    id: 'EL_15', title: '多窗口管理与通信', navTitle: '多窗口管理', category: '数据管理',
    path: '/electron/e-15/multi-window', summary: '用集中式 Map 管理多个窗口，通过主进程中转与 webContents.send 实现窗口间通信并预防内存泄漏。',
    demo: null,
    demoComponent: E15MultiWindow, code: E15Code, language: 'javascript',
    principle: '多窗口应用用一个 Map 集中持有窗口引用（new BrowserWindow 后 set、closed 后 delete）；窗口间通信不互相直接触碰，而是由主进程作为中转，用 target.webContents.send(channel, data) 定向推送或用 BrowserWindow.getAllWindows() 遍历广播；closed 时清引用是防止内存泄漏的关键。',
    flow: ['在主进程维护 const windows = new Map()，创建窗口后 windows.set(win.id, { win, type })。', '需要通信时向目标窗口的 webContents.send(channel, data)，批量则遍历 getAllWindows() 广播。', '每个窗口的 closed 事件里 windows.delete(win.id)，及时释放引用，避免对象泄漏。', '为窗口类型定义清晰契约（谁是主窗口、谁负责退出），避免出现孤儿窗口或互相等待的僵局。'],
    notes: ['不要把窗口引用散落在全局变量里，统一用 Map 管理，便于查找与清理。', '窗口间通信优先走主进程中转或共享存储，避免直接跨窗口 chrome 指针操作。', 'macOS 上关掉所有窗口应用仍在运行，多窗口设计与退出策略需按平台区分处理。', '跨窗口共享数据以主进程或存储为单一事实来源，窗口只持有快照，关闭任一窗口不丢全局状态。'],
    problem: '解决"如何管理多个窗口、如何实现窗口间数据传递、如何避免窗口引用导致的内存泄漏、以及如何处理多窗口应用的生命周期"的问题。',
    officialUrl: 'https://www.electronjs.org/docs/latest/api/browser-window',
  },
]
