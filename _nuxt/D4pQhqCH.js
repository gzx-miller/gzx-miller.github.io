const n=`// ═══════════════════════════════════════════
// 1. createServer：req 与 res 两个流式对象
// ═══════════════════════════════════════════

import http from 'node:http'

const server = http.createServer((req, res) => {
  res.statusCode = 200                                     // 结果：状态码
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
                                                           // 说明：必须在 write / end 之前设
  res.end(JSON.stringify({ ok: true }))                    // 结果：显式结束，否则连接挂起
})

function inspect(req) {
  req.method        // 结果：GET / POST / ...，路由要连方法一起匹配
  req.url           // 结果：/api/courses?page=1，含查询串
  req.headers.host  // 结果：请求头里的 Host（键都是小写）
}

// ═══════════════════════════════════════════
// 2. 路由要同时匹配方法与路径
// ═══════════════════════════════════════════

const courses = [{ id: 1, title: 'Vue3 入门' }, { id: 2, title: 'Nuxt 实战' }]

function handle(req, res) {
  const { method } = req
  const { pathname } = new URL(req.url, 'http://localhost')  // 结果：只取路径，丢掉查询串

  if (method === 'GET' && pathname === '/api/courses') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(courses))                        // 结果：命中，返回 200
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Not Found' }))         // 结果：未命中一律 404 兜底
}

// ═══════════════════════════════════════════
// 3. req 是 Readable 流，读取要限制体积
// ═══════════════════════════════════════════

const MAX_BODY = 1e6   // 1MB

function readBody(req, res) {
  let body = ''
  let size = 0
  req.on('data', (chunk) => {
    size += chunk.length
    if (size > MAX_BODY) {                                  // 结果：超限立即收手，防 DoS
      res.writeHead(413).end('请求体过大')                  // 结果：413 Payload Too Large
      req.destroy()
      return
    }
    body += chunk.toString('utf8')
  })
  req.on('end', () => {
    try {
      res.writeHead(200).end(JSON.stringify(JSON.parse(body)))  // 结果：解析成功
    } catch {
      res.writeHead(400).end('JSON 格式错误')                  // 结果：400 Bad Request
    }
  })
}

// ═══════════════════════════════════════════
// 4. 超时、错误与优雅关闭
// ═══════════════════════════════════════════

server.setTimeout(30_000)                       // 说明：请求 30 秒未完成即超时
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') console.error('端口被占用')  // 结果：常见启动错误分支
})
server.on('connection', (socket) => { socket.setNoDelay(true) })
                                               // 说明：小响应即时发出

function shutdown() {
  server.close(() => process.exit(0))           // 结果：停止接收新连接，处理完已有的再退出
  setTimeout(() => process.exit(1), 10_000)     // 说明：强制兜底，防止一直挂着
}

// ═══════════════════════════════════════════
// 5. 状态码与 Content-Type 速查
// ═══════════════════════════════════════════

const STATUS = { OK: 200, CREATED: 201, BAD_REQUEST: 400, NOT_FOUND: 404, PAYLOAD_TOO_LARGE: 413 }
const TYPES = {
  json: 'application/json; charset=utf-8',      // 结果：前端可安全地 json()
  text: 'text/plain; charset=utf-8'             // 说明：省略 charset 中文可能乱码
}
`;export{n as default};
