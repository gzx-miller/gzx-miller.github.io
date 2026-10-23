const n=`// ═══════════════════════════════════════════
// 1. 为什么分块：别把整份数据读进内存
// ═══════════════════════════════════════════

import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'   // 说明：Promise 版，出错自动销毁整链
import { Readable, Transform } from 'node:stream'

// readFile 会把整个文件塞进内存，2GB 日志直接顶爆进程
// createReadStream 每次只取一块，内存占用与文件大小脱钩
const source = createReadStream('/var/log/app.log', { highWaterMark: 64 * 1024 })
                                              // 结果：每次一块 64KB

// ═══════════════════════════════════════════
// 2. 四种流与各自职责
// ═══════════════════════════════════════════

const kinds = {
  Readable: '可读：数据源，如 createReadStream',
  Writable: '可写：目的地，如 createWriteStream、res',
  Duplex: '双工：可读可写，如 net.Socket、TCP 连接',
  Transform: '转换：边读边改，如 gzip、格式化每一行'
}                                             // 说明：一条链路通常读 → 转换 → 写

// ═══════════════════════════════════════════
// 3. pipeline 替掉手工 pipe
// ═══════════════════════════════════════════

class ReviewFormat extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(\`[review] \${chunk.toString().trim()}\\n\`)  // 结果：逐块加工
    callback()
  }
}

async function exportReport(src, dest) {
  await pipeline(
    createReadStream(src, 'utf8'),
    new ReviewFormat(),                       // 结果：可读 → 转换 → 可写串成一条线
    createWriteStream(dest, 'utf8')
  )                                           // 结果：任一段出错即销毁整条管道并释放资源
}

// 手工 pipe 出错时不会自动关掉上下游，句柄容易泄漏
// source.pipe(dest) 只负责接管道，不负责清理

// ═══════════════════════════════════════════
// 4. 背压：write 返回 false 就等 drain
// ═══════════════════════════════════════════

function copy(src, dest) {
  const rs = createReadStream(src)
  const ws = createWriteStream(dest)

  rs.on('data', (chunk) => {
    if (!ws.write(chunk)) rs.pause()          // 结果：返回 false 表示满了，暂停读取
  })
  ws.on('drain', () => rs.resume())           // 结果：缓冲排空后恢复读取
  rs.on('end', () => ws.end())                // 结果：读完结束写入端
}

// ═══════════════════════════════════════════
// 5. highWaterMark：字节模式 vs 对象模式
// ═══════════════════════════════════════════

createReadStream('/tmp/big', { highWaterMark: 64 * 1024 })
                                              // 说明：字节模式按字节数算缓冲上限

class Ids extends Readable {
  constructor(ids) {
    super({ objectMode: true, highWaterMark: 16 })  // 说明：对象模式按对象个数算上限
    this.ids = ids
  }
  _read() {
    this.push(this.ids.shift() || null)         // 结果：对象流可装任意 JS 对象
  }
}
`;export{n as default};
