// ═══════════════════════════════════════════
// 1. fs/promises：发起不阻塞的读取
// ═══════════════════════════════════════════

import fs from 'node:fs/promises'   // 说明：Promise 版，等待磁盘时事件循环不被阻塞
import path from 'node:path'

const dir = '/app/config'

async function readConfig() {
  const text = await fs.readFile(path.join(dir, 'app.json'), 'utf8')
  return JSON.parse(text)           // 结果：传 'utf8' 才拿到文本，否则是 Buffer
}

// 不带编码拿到的是原始字节 Buffer，适合图片、压缩包
async function readBinary() {
  const buf = await fs.readFile(path.join(dir, 'logo.png'))  // 结果：Buffer
  return buf.length                                          // 结果：字节数
}

// ═══════════════════════════════════════════
// 2. 写文件：覆盖还是追加要显式选
// ═══════════════════════════════════════════

async function writeLog(line) {
  const file = path.join(dir, 'run.log')
  await fs.writeFile(file, line + '\n')            // 结果：覆盖旧内容（flag 默认 'w'）
  await fs.appendFile(file, line + '\n', 'utf8')   // 结果：追加到末尾，不丢历史
}

// 目录不存在时 writeFile 会抛 ENOENT，先保证目录在
async function writeWithDir() {
  await fs.mkdir(path.join(dir, 'logs'), { recursive: true })
                                                   // 结果：多级目录一次建好，已存在不报错
  await fs.writeFile(path.join(dir, 'logs', 'a.log'), 'hi')
                                                   // 结果：目录已存在，写入成功
}

// 想「只新建不覆盖」，用 'wx' 标志；目标已存在会抛 EEXIST
async function createOnly(target) {
  await fs.writeFile(target, 'x', { flag: 'wx' })  // 结果：已存在则 EEXIST
}

// ═══════════════════════════════════════════
// 3. 遍历目录与查看文件信息
// ═══════════════════════════════════════════

async function listDir() {
  const entries = await fs.readdir(dir, { withFileTypes: true })
                                                   // 结果：Dirent 列表，无需再逐项 stat
  for (const e of entries) {
    if (e.isDirectory()) console.log('目录：', e.name)  // 结果：目录名
    else if (e.isFile()) console.log('文件：', e.name)  // 结果：文件名
  }
}

async function fileInfo(target) {
  const stats = await fs.stat(target)   // 结果：文件的元信息
  stats.isFile()                        // 结果：true / false
  stats.size                            // 结果：字节数
  stats.mtime                           // 结果：最后修改时间
}

// ═══════════════════════════════════════════
// 4. 复制 / 移动 / 删除
// ═══════════════════════════════════════════

async function archive() {
  await fs.copyFile(path.join(dir, 'a.txt'), path.join(dir, 'a.bak'))
                                                   // 结果：单文件复制
  await fs.rename(path.join(dir, 'a.bak'), path.join(dir, 'a.txt'))
                                                   // 结果：改名或移动
  await fs.cp(path.join(dir, 'src'), path.join(dir, 'dist'), { recursive: true })
                                                   // 结果：整目录复制（Node 16+）
  await fs.rm(path.join(dir, 'tmp'), { recursive: true, force: true })
                                                   // 结果：递归删除，force 忽略不存在
}

// ═══════════════════════════════════════════
// 5. 按 err.code 分支处理失败
// ═══════════════════════════════════════════

async function loadOrFallback() {
  try {
    return await fs.readFile(path.join(dir, 'app.json'), 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return '{}'          // 结果：文件不存在，用默认值兜底
    if (err.code === 'EACCES') throw new Error('检查目录权限')
                                                    // 结果：权限不足，给出可操作提示
    throw err                                       // 说明：其余情况向上抛，别吞掉
  }
}

// ═══════════════════════════════════════════
// 6. 并发读取与同步 API 的分水岭
// ═══════════════════════════════════════════

async function readMany(names) {
  const contents = await Promise.all(
    names.map((name) => fs.readFile(path.join(dir, name), 'utf8'))
  )
  return contents.length   // 说明：一起发起统一收口，总耗时接近最慢那个
}

import fsSync from 'node:fs'
fsSync.readFileSync('/app/config/boot.json', 'utf8')
                           // 说明：同步 API 会阻塞事件循环，只留给启动初始化阶段
