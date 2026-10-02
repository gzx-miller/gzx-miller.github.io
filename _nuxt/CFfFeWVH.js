const e=`// ═══════════════════════════════════════════
// D05 - Stream 流与 pipeline 背压
// ═══════════════════════════════════════════

import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline, Readable, Writable, Transform } from 'node:stream'
import { createGzip } from 'node:zlib'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ───────── 为什么用 Stream？ ─────────
// readFile 会把整个文件加载到内存
// 大文件（几GB）会导致内存溢出
// Stream 分块处理，内存占用恒定

// ───────── 4 种 Stream 类型 ─────────
// Readable: 可读流（数据源）- fs.createReadStream
// Writable: 可写流（数据目的地）- fs.createWriteStream
// Duplex: 双工流（可读可写）- net.Socket
// Transform: 转换流（读写过程中转换数据）- zlib.createGzip

// ───────── 基本用法：文件复制 ─────────

function copyFileBasic(src, dest) {
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(src, { highWaterMark: 64 * 1024 })
    const writeStream = createWriteStream(dest)

    readStream.on('data', (chunk) => {
      // 写入返回 false 表示背压：写入队列满了
      if (!writeStream.write(chunk)) {
        readStream.pause() // 暂停读取，等待写入完成
      }
    })

    writeStream.on('drain', () => {
      readStream.resume() // 写入排空，恢复读取
    })

    readStream.on('end', () => {
      writeStream.end()
    })

    writeStream.on('finish', resolve)
    readStream.on('error', reject)
    writeStream.on('error', reject)
  })
}

// ───────── pipe 方法（自动处理背压） ─────────

function copyFileWithPipe(src, dest) {
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(src)
    const writeStream = createWriteStream(dest)

    readStream
      .pipe(writeStream)  // 自动处理背压
      .on('finish', resolve)
      .on('error', reject)

    // 注意：pipe 出错时需要手动销毁所有流
    readStream.on('error', (err) => {
      readStream.destroy()
      writeStream.destroy(err)
      reject(err)
    })
  })
}

// ───────── pipeline（推荐用法） ─────────

import { promisify } from 'node:util'
const pipelinePromise = promisify(pipeline)

async function copyFileWithPipeline(src, dest) {
  // pipeline 自动处理：
  // 1. 背压控制
  // 2. 错误传播
  // 3. 流清理（出错时自动销毁所有流）
  await pipelinePromise(
    createReadStream(src),
    createGzip(),           // 中间转换流：压缩
    createWriteStream(dest)
  )
  console.log('文件压缩复制完成')
}

// Node 15+ 支持 stream/promises
// import { pipeline } from 'node:stream/promises'

// ───────── 自定义 Transform 流 ─────────

// 将文本转换为大写的转换流
class UpperCaseTransform extends Transform {
  constructor() {
    super({ encoding: 'utf-8' })
  }

  _transform(chunk, encoding, callback) {
    // chunk 是 Buffer 或字符串
    const upper = chunk.toString().toUpperCase()
    this.push(upper) // 推送转换后的数据
    callback()       // 通知转换完成
  }

  _flush(callback) {
    // 流结束时调用，可推送剩余数据
    this.push('\\n--- 文件结束 ---\\n')
    callback()
  }
}

// 使用自定义转换流
function transformFile(src, dest) {
  return pipelinePromise(
    createReadStream(src, 'utf-8'),
    new UpperCaseTransform(),
    createWriteStream(dest, 'utf-8')
  )
}

// ───────── 自定义 Readable 流 ─────────

class CounterReadable extends Readable {
  constructor(max = 10) {
    super({ objectMode: false })
    this.count = 0
    this.max = max
  }

  _read() {
    this.count++
    if (this.count > this.max) {
      this.push(null) // null 表示流结束
    } else {
      this.push(\`计数: \${this.count}\\n\`)
    }
  }
}

// ───────── 自定义 Writable 流 ─────────

class ConsoleWritable extends Writable {
  constructor() {
    super({ decodeStrings: false })
  }

  _write(chunk, encoding, callback) {
    console.log('[写入]', chunk.toString().trim())
    callback()
  }
}

// ───────── 背压原理 ─────────
// highWaterMark: 内部缓冲区大小阈值（默认 16KB）
// 写入时：缓冲区满了，write() 返回 false → 触发背压
// drain 事件：缓冲区排空后触发 → 可以继续写入
// readable.pipe(writable) 自动处理背压

// ───────── 对象模式 (Object Mode) ─────────

// 默认 Stream 处理 Buffer/字符串
// objectMode: true 可以处理任意 JS 对象

class ObjectReader extends Readable {
  constructor() {
    super({ objectMode: true })
    this.items = [{ id: 1 }, { id: 2 }, { id: 3 }]
  }

  _read() {
    const item = this.items.shift()
    this.push(item || null)
  }
}

// ───────── 常用事件 ─────────
// Readable: data, end, close, error, readable
// Writable: drain, finish, close, error, pipe, unpipe

// ───────── 最佳实践 ─────────
// 优先使用 pipeline，而不是手动 pipe
// 始终监听 error 事件，pipeline 会自动传播错误
// 大文件处理用 Stream，不要 readFile 全量加载
// 自定义流时实现 _read / _write / _transform
// 注意 objectMode 下的 highWaterMark 是对象数量
`;export{e as default};
