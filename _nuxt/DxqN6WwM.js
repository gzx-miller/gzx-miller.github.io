const n=`// ═══════════════════════════════════════════
// D03 - fs/promises 异步文件操作
// ═══════════════════════════════════════════

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')

// ───────── 读取文件 ─────────

async function readFileExample() {
  try {
    // 读取文本文件，指定编码
    const content = await fs.readFile(
      path.join(dataDir, 'config.json'),
      'utf-8'
    )
    const config = JSON.parse(content)
    console.log('配置:', config)

    // 不指定编码返回 Buffer
    const buffer = await fs.readFile(path.join(dataDir, 'image.png'))
    console.log('文件大小:', buffer.length, 'bytes')
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('文件不存在')
    } else {
      console.error('读取失败:', err.message)
    }
  }
}

// ───────── 写入文件 ─────────

async function writeFileExample() {
  const outputFile = path.join(dataDir, 'output.txt')

  // 写入文本（会覆盖已有文件）
  await fs.writeFile(outputFile, 'Hello, Node.js!', 'utf-8')

  // 追加写入（flag: 'a'）
  await fs.writeFile(outputFile, '\\n追加的内容', {
    encoding: 'utf-8',
    flag: 'a'
  })

  // 写入 Buffer
  const data = Buffer.from('二进制数据', 'utf-8')
  await fs.writeFile(path.join(dataDir, 'binary.dat'), data)
}

// ───────── 目录操作 ─────────

async function directoryExample() {
  // 创建目录（recursive: true 可创建多级目录）
  await fs.mkdir(path.join(dataDir, 'logs', 'app'), { recursive: true })

  // 读取目录内容
  const files = await fs.readdir(dataDir, { withFileTypes: true })
  for (const entry of files) {
    if (entry.isDirectory()) {
      console.log('目录:', entry.name)
    } else if (entry.isFile()) {
      console.log('文件:', entry.name)
    }
  }

  // 递归删除目录（慎用！）
  // await fs.rm(path.join(dataDir, 'temp'), { recursive: true, force: true })
}

// ───────── 文件信息 ─────────

async function statExample() {
  const filePath = path.join(dataDir, 'config.json')

  try {
    const stats = await fs.stat(filePath)
    stats.isFile()          // 是否文件
    stats.isDirectory()     // 是否目录
    stats.size              // 文件大小（字节）
    stats.mtime             // 修改时间
    stats.ctime             // 创建/元数据变更时间
    stats.birthtime         // 创建时间（Windows 支持较好）

    // 检查文件是否存在（推荐用 fs.access 或 try-catch）
    await fs.access(filePath, fs.constants.R_OK)
    console.log('文件可读')
  } catch (err) {
    console.log('文件不可访问')
  }
}

// ───────── 复制、移动、重命名 ─────────

async function copyMoveExample() {
  const src = path.join(dataDir, 'source.txt')
  const dest = path.join(dataDir, 'backup.txt')

  // 复制文件
  await fs.copyFile(src, dest)

  // 重命名 / 移动
  await fs.rename(dest, path.join(dataDir, 'archive.txt'))

  // 复制目录（Node 16+）
  await fs.cp(
    path.join(dataDir, 'src'),
    path.join(dataDir, 'dist'),
    { recursive: true }
  )
}

// ───────── 常见错误码 ─────────
// ENOENT: 文件/目录不存在
// EACCES: 权限不足
// EISDIR: 对目录执行了文件操作
// ENOTDIR: 对文件执行了目录操作
// EEXIST: 目标已存在（使用 wx flag 时）

// ───────── 同步 API（不推荐在事件循环中使用） ─────────
// import fsSync from 'node:fs'
// const content = fsSync.readFileSync('file.txt', 'utf-8')
// 同步 API 会阻塞事件循环，仅在启动初始化阶段使用

// ───────── 最佳实践 ─────────
// 优先使用 fs/promises 的异步 API
// 用 try/catch 处理文件操作错误，检查 err.code
// 大文件用 Stream 而不是 readFile/writeFile
// 路径用 path 模块拼接，避免跨平台问题
// 递归操作目录用 { recursive: true } 选项
`;export{n as default};
