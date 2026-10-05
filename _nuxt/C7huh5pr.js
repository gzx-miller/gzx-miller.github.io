const n=`// ═══════════════════════════════════════════
// D14 - WebSocket 实时通信
// ═══════════════════════════════════════════

// 注意：以下示例需要安装 ws 库
// npm install ws

// ───────── WebSocket 服务端 (ws 库) ─────────

// import { WebSocketServer } from 'ws'
//
// const wss = new WebSocketServer({ port: 8080 })
//
// // 客户端连接
// wss.on('connection', (ws, request) => {
//   const clientId = Math.random().toString(36).slice(2, 10)
//   console.log(\`客户端 \${clientId} 连接\`)
//
//   // 发送欢迎消息
//   ws.send(JSON.stringify({
//     type: 'welcome',
//     message: '欢迎连接到 WebSocket 服务器',
//     clientId
//   }))
//
//   // 广播在线人数
//   broadcastOnlineCount()
//
//   // 接收消息
//   ws.on('message', (data) => {
//     try {
//       const message = JSON.parse(data.toString())
//       handleMessage(ws, message, clientId)
//     } catch (err) {
//       ws.send(JSON.stringify({
//         type: 'error',
//         message: '消息格式错误'
//       }))
//     }
//   })
//
//   // 连接关闭
//   ws.on('close', () => {
//     console.log(\`客户端 \${clientId} 断开\`)
//     broadcastOnlineCount()
//   })
//
//   // 连接错误
//   ws.on('error', (err) => {
//     console.error(\`客户端 \${clientId} 错误:\`, err.message)
//   })
//
//   // 心跳检测
//   ws.isAlive = true
//   ws.on('pong', () => {
//     ws.isAlive = true
//   })
// })
//
// // 处理消息
// function handleMessage(ws, message, clientId) {
//   switch (message.type) {
//     case 'chat':
//       // 广播聊天消息
//       broadcast(JSON.stringify({
//         type: 'chat',
//         from: clientId,
//         content: message.content,
//         timestamp: Date.now()
//       }))
//       break
//
//     case 'ping':
//       ws.send(JSON.stringify({ type: 'pong', time: Date.now() }))
//       break
//
//     default:
//       ws.send(JSON.stringify({
//         type: 'error',
//         message: '未知消息类型'
//       }))
//   }
// }
//
// // 广播消息给所有客户端
// function broadcast(data) {
//   for (const client of wss.clients) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(data)
//     }
//   }
// }
//
// // 广播在线人数
// function broadcastOnlineCount() {
//   const count = Array.from(wss.clients).filter(
//     c => c.readyState === WebSocket.OPEN
//   ).length
//   broadcast(JSON.stringify({
//     type: 'online_count',
//     count
//   }))
// }
//
// // 心跳检测（防止连接假死）
// const heartbeatInterval = setInterval(() => {
//   for (const client of wss.clients) {
//     if (client.isAlive === false) {
//       client.terminate()
//       continue
//     }
//     client.isAlive = false
//     client.ping()
//   }
// }, 30000)
//
// wss.on('close', () => {
//   clearInterval(heartbeatInterval)
// })

// ───────── WebSocket 客户端 (浏览器) ─────────

// const clientHtml = \`
// <!DOCTYPE html>
// <html>
// <head><title>WebSocket 聊天</title></head>
// <body>
//   <div id="messages"></div>
//   <input id="input" type="text" placeholder="输入消息">
//   <button onclick="sendMessage()">发送</button>
//
//   <script>
//     const ws = new WebSocket('ws://localhost:8080')
//
//     ws.onopen = () => {
//       console.log('连接已建立')
//     }
//
//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data)
//       const messages = document.getElementById('messages')
//
//       if (data.type === 'chat') {
//         messages.innerHTML += \\\`<div>\\\${data.from}: \\\${data.content}</div>\\\`
//       } else if (data.type === 'welcome') {
//         messages.innerHTML += \\\`<div>系统: \\\${data.message}</div>\\\`
//       }
//     }
//
//     ws.onclose = () => {
//       console.log('连接已关闭')
//     }
//
//     ws.onerror = (error) => {
//       console.error('WebSocket 错误:', error)
//     }
//
//     function sendMessage() {
//       const input = document.getElementById('input')
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({
//           type: 'chat',
//           content: input.value
//         }))
//         input.value = ''
//       }
//     }
//   <\/script>
// </body>
// </html>
// \`

// ───────── Socket.IO 示例（更高层） ─────────
// Socket.IO 在 WebSocket 基础上提供更多功能：
// - 自动重连
// - 房间/命名空间
// - 事件确认
// - 广播
// - 兼容长轮询（降级）

// 服务端
// import { createServer } from 'http'
// import { Server } from 'socket.io'
//
// const httpServer = createServer()
// const io = new Server(httpServer, {
//   cors: { origin: '*' }
// })
//
// io.on('connection', (socket) => {
//   console.log('用户连接:', socket.id)
//
//   // 加入房间
//   socket.join('room1')
//
//   // 监听自定义事件
//   socket.on('chat message', (msg) => {
//     // 广播给所有人（包括发送者）
//     io.emit('chat message', { from: socket.id, msg })
//
//     // 只发给房间内的人
//     io.to('room1').emit('chat message', msg)
//
//     // 广播给所有人（除了发送者）
//     socket.broadcast.emit('chat message', msg)
//   })
//
//   // 事件确认
//   socket.on('get user', async (id, callback) => {
//     const user = await findUser(id)
//     callback(user) // 调用回调确认
//   })
//
//   socket.on('disconnect', () => {
//     console.log('用户断开:', socket.id)
//   })
// })
//
// httpServer.listen(3000)

// 客户端
// import { io } from 'socket.io-client'
//
// const socket = io('http://localhost:3000')
//
// socket.on('connect', () => {
//   console.log('连接成功')
// })
//
// socket.on('chat message', (data) => {
//   console.log('收到消息:', data)
// })
//
// // 发送消息
// socket.emit('chat message', '你好')
//
// // 带确认的发送
// socket.emit('get user', 123, (user) => {
//   console.log('用户信息:', user)
// })

// ───────── WebSocket 与 HTTP 对比 ─────────

// HTTP:
// - 半双工，请求-响应模式
// - 每次请求都有头部开销
// - 服务端不能主动推送
// - 轮询/长轮询实现实时（低效）

// WebSocket:
// - 全双工，双向通信
// - 连接建立后头部开销小
// - 服务端可以主动推送
// - 适合实时应用（聊天、游戏、协作）

// ───────── 应用场景 ─────────
// - 即时聊天
// - 实时协作编辑
// - 在线游戏
// - 实时数据监控
// - 通知推送
// - 股票/加密货币行情

// ───────── 最佳实践 ─────────
// 实现心跳检测，保持连接活跃
// 消息使用 JSON 格式，定义 type 字段
// 处理连接断开和重连
// 限制消息大小，防止攻击
// 对连接进行认证和鉴权
// 广播时遍历 clients，检查 readyState
// 生产环境使用反向代理（Nginx）做负载均衡
// 大规模场景考虑 Redis Pub/Sub 做消息同步
`;export{n as default};
