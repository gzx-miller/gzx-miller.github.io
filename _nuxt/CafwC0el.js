const n=`// ═══════════════════════════════════════════
// D26 - net TCP 网络编程
// ═══════════════════════════════════════════

import net from 'node:net'

// ───────── TCP 服务器 ─────────

// 创建 TCP 服务器
const server = net.createServer((socket) => {
  // 新的客户端连接
  console.log('客户端连接:', socket.remoteAddress + ':' + socket.remotePort)

  // 设置编码
  socket.setEncoding('utf-8')

  // 接收数据
  socket.on('data', (data) => {
    console.log('收到数据:', data.toString().trim())

    // 回显数据
    socket.write(\`服务器收到: \${data}\`)

    // 如果收到 bye，关闭连接
    if (data.toString().trim().toLowerCase() === 'bye') {
      socket.end('再见！\\n')
    }
  })

  // 连接关闭
  socket.on('close', () => {
    console.log('客户端断开连接')
  })

  // 连接错误
  socket.on('error', (err) => {
    console.error('连接错误:', err.message)
  })

  // 超时
  socket.setTimeout(30000) // 30 秒无数据则超时
  socket.on('timeout', () => {
    console.log('连接超时，关闭')
    socket.end('超时断开\\n')
  })
})

// 监听端口
// server.listen(3000, '127.0.0.1', () => {
//   console.log('TCP 服务器监听端口 3000')
//   console.log('可以用: telnet localhost 3000 测试')
// })

// 服务器事件
server.on('connection', (socket) => {
  // 新连接（和 createServer 的回调一样）
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('端口 3000 已被占用')
  } else {
    console.error('服务器错误:', err)
  }
})

// 关闭服务器
// server.close(() => {
//   console.log('服务器已关闭')
// })

// ───────── TCP 客户端 ─────────

// 创建 TCP 连接
// const client = net.createConnection({
//   host: '127.0.0.1',
//   port: 3000
// }, () => {
//   console.log('已连接到服务器')
//
//   // 发送数据
//   client.write('Hello, Server!\\n')
// })
//
// // 接收数据
// client.on('data', (data) => {
//   console.log('服务器响应:', data.toString().trim())
// })
//
// // 连接关闭
// client.on('close', () => {
//   console.log('连接已关闭')
// })
//
// // 连接错误
// client.on('error', (err) => {
//   console.error('连接错误:', err.message)
// })

// 用 telnet 测试:
// telnet localhost 3000
// 输入文字，服务器会回显
// 输入 bye 断开

// ───────── TCP vs HTTP ─────────

// HTTP 是在 TCP 之上的应用层协议
// HTTP 有请求-响应模式、头部、方法、状态码等
// TCP 只是字节流，没有格式约定

// TCP 适合：
// - 自定义协议
// - 长连接实时通信
// - 高性能场景
// - 游戏服务器
// - IoT 设备通信

// HTTP 适合：
// - Web 应用
// - REST API
// - 浏览器兼容
// - 缓存、代理等生态

// ───────── TCP 粘包问题 ─────────

// TCP 是流协议，没有包边界
// 发送: "hello" + "world"
// 接收可能是: "helloworld" 或 "he" "lloworld" 等

// 解决方案：
// 1. 固定长度的包
// 2. 特殊分隔符（如换行符）
// 3. 长度前缀（前 N 字节表示包长度）

// 方案1：换行符分隔（简单文本协议）
function readLines(socket, callback) {
  let buffer = ''

  socket.on('data', (data) => {
    buffer += data.toString()

    // 找到所有完整的行
    let newlineIndex
    while ((newlineIndex = buffer.indexOf('\\n')) !== -1) {
      const line = buffer.slice(0, newlineIndex)
      buffer = buffer.slice(newlineIndex + 1)
      callback(line)
    }
  })
}

// 使用
// server.on('connection', (socket) => {
//   readLines(socket, (line) => {
//     console.log('收到一行:', line)
//   })
// })

// 方案2：长度前缀（二进制协议，更可靠）
// 格式: [4字节长度][数据]

function readPackets(socket, callback) {
  let buffer = Buffer.alloc(0)

  socket.on('data', (data) => {
    buffer = Buffer.concat([buffer, data])

    while (buffer.length >= 4) {
      // 读取包长度（前4字节，大端）
      const packetLength = buffer.readUInt32BE(0)

      // 数据还不够，等下一次
      if (buffer.length < 4 + packetLength) break

      // 提取完整包
      const packet = buffer.slice(4, 4 + packetLength)

      // 移除已处理的数据
      buffer = buffer.slice(4 + packetLength)

      callback(packet)
    }
  })
}

// 发送长度前缀的包
function writePacket(socket, data) {
  const dataBuf = Buffer.from(data, 'utf-8')
  const lengthBuf = Buffer.alloc(4)
  lengthBuf.writeUInt32BE(dataBuf.length, 0)
  socket.write(Buffer.concat([lengthBuf, dataBuf]))
}

// ───────── Socket 对象 ─────────

// 常用属性
// socket.remoteAddress   客户端 IP
// socket.remotePort      客户端端口
// socket.localAddress    本地 IP
// socket.localPort       本地端口
// socket.bytesRead       已读取字节数
// socket.bytesWritten    已写入字节数

// 常用方法
// socket.write(data)     写入数据
// socket.end()           半关闭（不能再写，但还能读）
// socket.destroy()       立即销毁
// socket.pause()         暂停读取
// socket.resume()        恢复读取
// socket.setEncoding()   设置编码
// socket.setTimeout()    设置超时
// socket.setKeepAlive()  启用 keepalive
// socket.ref()           保持进程运行
// socket.unref()         不保持进程运行

// 常用事件
// 'data'       收到数据
// 'connect'    连接建立
// 'close'      连接关闭
// 'end'        对方发送 FIN
// 'error'      错误
// 'timeout'    超时
// 'drain'      写缓冲区排空
// 'lookup'     DNS 解析完成

// ───────── 聊天室示例（简化） ─────────

// 简单的 TCP 聊天室
// const clients = new Set()
//
// const chatServer = net.createServer((socket) => {
//   clients.add(socket)
//   socket.name = \`用户\${clients.size}\`
//
//   broadcast(\`\${socket.name} 加入了聊天室\`)
//
//   readLines(socket, (line) => {
//     broadcast(\`\${socket.name}: \${line}\`, socket)
//   })
//
//   socket.on('close', () => {
//     clients.delete(socket)
//     broadcast(\`\${socket.name} 离开了聊天室\`)
//   })
//
//   socket.on('error', () => {
//     clients.delete(socket)
//   })
// })
//
// function broadcast(message, exclude = null) {
//   for (const client of clients) {
//     if (client !== exclude && client.writable) {
//       client.write(message + '\\n')
//     }
//   }
// }
//
// chatServer.listen(3001, () => {
//   console.log('聊天室服务器在 3001 端口')
// })

// ───────── Keep-Alive ─────────

// TCP keepalive: 定期发送探测包，检测连接是否存活
// 防止连接已经断开但不知道的情况

// server.on('connection', (socket) => {
//   // 启用 keepalive，初始延迟 60 秒
//   socket.setKeepAlive(true, 60000)
// })

// 注意：TCP keepalive 是传输层的
// 应用层通常还需要自己的心跳机制（更可控）

// ───────── 半关闭 (Half-Close) ─────────

// socket.end() 关闭写入端，但还能读取
// 对方收到 FIN，说明没有更多数据了

// 示例：客户端发送完数据后关闭写入端
// client.write('数据发送完毕')
// client.end() // 半关闭，告诉服务器我发完了
// // 但还可以继续接收服务器响应

// ───────── 最佳实践 ─────────
// 处理粘包问题，设计清晰的协议格式
// 总是监听 error 事件
// 设置合理的超时时间
// 使用 keepalive 检测死连接
// 注意背压，不要写太快
// 连接数过多考虑用 cluster 或负载均衡
// 大并发场景考虑用更底层的优化
// 二进制协议用长度前缀，文本协议用换行分隔
// 客户端实现自动重连机制
// 敏感数据用 TLS（net 是明文的，用 tls 模块）
`;export{n as default};
