const e=`// ========== 1. electron-store (配置存储) ==========
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
// 8. 提供导出/导入功能`;export{e as default};
