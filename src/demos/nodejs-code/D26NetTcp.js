// ═══════════════════════════════════════════
// 1. net.createServer 建服务器
// ═══════════════════════════════════════════

import net from 'node:net'

const server = net.createServer((socket) => {
  console.log('连接来自', socket.remoteAddress, socket.remotePort)
                                               // 结果：客户端地址与端口
  socket.setNoDelay(true)                      // 说明：关闭 Nagle，小包即时发出

  socket.on('data', (chunk) => {               // 说明：一次 data 可能是半条或几条，见第 3 节
    socket.write('收到\n')                     // 结果：向对端写回字节
  })
  socket.on('end', () => console.log('对端发来 FIN'))   // 结果：对方半关闭
  socket.on('close', () => console.log('连接关闭'))     // 结果：连接彻底结束
  socket.on('error', (err) => console.log('连接错误', err.message))
                                               // 说明：务必监听，否则异常断开可能带崩进程
  socket.setTimeout(30_000)                    // 结果：30 秒无数据触发 timeout
  socket.on('timeout', () => socket.end())
})

server.listen(8080, () => console.log('监听 8080'))      // 结果：服务器就绪

// ═══════════════════════════════════════════
// 2. net.createConnection 建客户端
// ═══════════════════════════════════════════

const client = net.createConnection({ host: '127.0.0.1', port: 8080 }, () => {
  client.write('Hello\n')                      // 结果：连接建立后发送数据
})
client.on('data', (chunk) => console.log('收到', chunk.toString()))
client.on('close', () => console.log('断开'))  // 说明：与服务器端 close 语义一致

// ═══════════════════════════════════════════
// 3. TCP 没有消息边界：粘包与拆包
// ═══════════════════════════════════════════

client.write('A')                              // 分两次写
client.write('B')                              // 结果：对端一次 data 可能收到 'AB'（粘包）
                                               // 结果：也可能拆成两次到达（拆包）
// 结论：write 次数与 data 次数没有对应关系，边界由应用层自己定义

// ═══════════════════════════════════════════
// 4. 分帧方案一：换行分隔
// ═══════════════════════════════════════════

function readLines(socket, onLine) {
  let buffer = ''                              // 说明：缓存上一块留下的残片
  socket.on('data', (chunk) => {
    buffer += chunk.toString('utf8')
    let i
    while ((i = buffer.indexOf('\n')) !== -1) {
      onLine(buffer.slice(0, i))               // 结果：切出一条完整消息
      buffer = buffer.slice(i + 1)             // 结果：剩下半条留在 buffer 等下一块
    }
  })
}

// ═══════════════════════════════════════════
// 5. 分帧方案二：长度前缀
// ═══════════════════════════════════════════

function readPackets(socket, onPacket) {
  let buffer = Buffer.alloc(0)
  socket.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk])
    while (buffer.length >= 4) {
      const len = buffer.readUInt32BE(0)       // 结果：前 4 字节是大端长度
      if (len > 64 * 1024) return socket.destroy()   // 说明：长度也要校验上限
      if (buffer.length < 4 + len) break       // 结果：数据不够，等下一次 data
      onPacket(buffer.subarray(4, 4 + len))
      buffer = buffer.subarray(4 + len)        // 结果：移除已处理的包
    }
  })
}

function writePacket(socket, text) {
  const body = Buffer.from(text, 'utf8')
  const head = Buffer.alloc(4)
  head.writeUInt32BE(body.length, 0)           // 结果：[4 字节长度][消息体]
  socket.write(Buffer.concat([head, body]))
}

// ═══════════════════════════════════════════
// 6. 明文用 net，加密用 tls；HTTP 建立在 TCP 之上
// ═══════════════════════════════════════════

// net 传输是明文，敏感数据应改用 tls.createServer / tls.connect
// http.createServer 底部就是一个处理 TCP 字节流的 net 服务器
