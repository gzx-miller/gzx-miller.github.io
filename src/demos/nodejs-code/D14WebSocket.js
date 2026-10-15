// ═══════════════════════════════════════════
// 1. HTTP 升级握手
// ═══════════════════════════════════════════

import { createServer } from 'node:http'
import { WebSocketServer } from 'ws'

const httpServer = createServer()
const wss = new WebSocketServer({ server: httpServer })   // 说明：由 Upgrade 握手升级为双向连接

wss.on('connection', (socket, req) => {
  const userId = new URL(req.url, 'http://local').searchParams.get('uid')  // 说明：握手阶段取出身份
  socket.send(JSON.stringify({ type: 'welcome', userId }))                 // 结果：连接建立后服务端即可主动推送
})

// ═══════════════════════════════════════════
// 2. 连接表与向目标集合广播
// ═══════════════════════════════════════════

const clients = new Map()                                 // 结果：userId → socket，服务端唯一知道谁在线
wss.on('connection', (socket, req) => {
  const userId = new URL(req.url, 'http://local').searchParams.get('uid')
  clients.set(userId, socket)                             // 说明：登记进连接表
  socket.on('close', () => clients.delete(userId))        // 说明：断开即清理，避免死连接堆积
})
function broadcast(payload) {
  const text = JSON.stringify(payload)
  for (const socket of clients.values()) socket.send(text)   // 说明：向全部在线连接推送
}

// ═══════════════════════════════════════════
// 3. 应用层心跳
// ═══════════════════════════════════════════

const HEARTBEAT_MS = 30_000
const alive = new WeakSet()                               // 说明：记录本轮心跳收到过响应的连接
wss.on('connection', (socket) => {
  alive.add(socket)
  socket.on('pong', () => alive.add(socket))              // 结果：收到 pong 才续命
})
setInterval(() => {
  for (const socket of clients.values()) {
    if (!alive.has(socket)) { socket.terminate(); continue }  // 说明：超时判定假死，主动关闭以触发重连
    alive.delete(socket)
    socket.ping()                                         // 说明：探测下一轮是否还活着
  }
}, HEARTBEAT_MS)

// ═══════════════════════════════════════════
// 4. 退避重连与随机抖动
// ═══════════════════════════════════════════

function nextDelay(attempt) {
  const base = Math.min(30_000, 1000 * 2 ** attempt)      // 说明：指数退避，封顶 30 秒
  return base + Math.random() * base * 0.3                // 结果：叠加抖动，错开重连时刻防惊群
}

// ═══════════════════════════════════════════
// 5. 鉴权与多实例广播
// ═══════════════════════════════════════════

const authAtHandshake = (token) => Boolean(token)         // 说明：鉴权在握手阶段或首条消息完成
const authOnFirstMessage = 'upgrade 之后首条消息里带凭证'  // 说明：不能复用 HTTP 中间件那套逻辑
const adapter = 'redis-pubsub'                            // 说明：多实例用共享发布订阅转发跨节点广播
const maxConnectionsPerNode = 10_000                      // 说明：连接是持久且昂贵的资源，单机需设上限
