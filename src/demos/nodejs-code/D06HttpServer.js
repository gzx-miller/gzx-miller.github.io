// ═══════════════════════════════════════════
// D06 - 原生 HTTP 服务与路由
// ═══════════════════════════════════════════

import http from 'node:http'
import url from 'node:url'

// ───────── 最简单的 HTTP 服务 ─────────

const server = http.createServer((req, res) => {
  // req: IncomingMessage（可读流）
  // res: ServerResponse（可写流）

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('Hello, Node.js HTTP Server!')
})

// server.listen(3000, () => {
//   console.log('Server running at http://localhost:3000/')
// })

// ───────── 路由处理 ─────────

function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname
  const method = req.method

  // 设置响应头
  const sendJSON = (statusCode, data) => {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8'
    })
    res.end(JSON.stringify(data))
  }

  const sendText = (statusCode, text) => {
    res.writeHead(statusCode, {
      'Content-Type': 'text/plain; charset=utf-8'
    })
    res.end(text)
  }

  // 路由表
  if (method === 'GET' && pathname === '/') {
    sendText(200, '首页 - Node.js HTTP Server')
  } else if (method === 'GET' && pathname === '/api/users') {
    // 查询参数
    const query = parsedUrl.query
    const users = [
      { id: 1, name: 'Alice', page: query.page || 1 }
    ]
    sendJSON(200, { code: 0, data: users })
  } else if (method === 'GET' && pathname.startsWith('/api/users/')) {
    // 路径参数
    const id = pathname.split('/')[3]
    sendJSON(200, { code: 0, data: { id, name: '用户' + id } })
  } else if (method === 'POST' && pathname === '/api/users') {
    // 读取请求体
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
      // 防止超大请求体
      if (body.length > 1e6) {
        req.destroy()
        sendJSON(413, { code: 413, message: '请求体过大' })
      }
    })
    req.on('end', () => {
      try {
        const user = JSON.parse(body)
        sendJSON(201, { code: 0, data: { id: Date.now(), ...user } })
      } catch (e) {
        sendJSON(400, { code: 400, message: 'JSON 格式错误' })
      }
    })
  } else if (method === 'GET' && pathname === '/redirect') {
    // 重定向
    res.writeHead(302, { Location: '/' })
    res.end()
  } else {
    sendJSON(404, { code: 404, message: 'Not Found' })
  }
}

// ───────── 更健壮的服务器 ─────────

const robustServer = http.createServer(handleRequest)

// 最大请求头大小（默认 16KB）
robustServer.maxHeadersCount = 100

// 超时设置
robustServer.timeout = 30000 // 请求超时 30 秒
robustServer.keepAliveTimeout = 5000 // keep-alive 超时

// 监听错误
robustServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('端口已被占用')
  } else {
    console.error('服务器错误:', err)
  }
})

// 连接事件
robustServer.on('connection', (socket) => {
  console.log('新的连接:', socket.remoteAddress)
})

// robustServer.listen(3000, '127.0.0.1', () => {
//   console.log('健壮服务器已启动')
// })

// ───────── 请求对象 (req) 常用属性 ─────────
// req.url          请求路径（含查询字符串）
// req.method       HTTP 方法
// req.headers      请求头对象（键都是小写）
// req.httpVersion  HTTP 版本
// req.socket       底层 socket

// req.headers.host
// req.headers['user-agent']
// req.headers['content-type']
// req.headers['content-length']

// ───────── 响应对象 (res) 常用方法 ─────────
// res.writeHead(statusCode, headers)  设置状态码和响应头
// res.setHeader(name, value)          设置单个响应头
// res.getHeader(name)                 获取响应头
// res.removeHeader(name)              移除响应头
// res.write(chunk)                    写入响应体（可多次调用）
// res.end([data])                     结束响应（可选最后一块数据）
// res.statusCode                      设置状态码

// ───────── HTTP 状态码速查 ─────────
// 200 OK           请求成功
// 201 Created      资源创建成功
// 301 Moved        永久重定向
// 302 Found        临时重定向
// 400 Bad Request  请求参数错误
// 401 Unauthorized 未授权
// 403 Forbidden    禁止访问
// 404 Not Found    资源不存在
// 500 Internal Server Error 服务器内部错误

// ───────── 优雅关闭 ─────────

// function gracefulShutdown(server) {
//   server.close(() => {
//     console.log('服务器已关闭，所有连接处理完毕')
//     process.exit(0)
//   })
//   // 强制超时
//   setTimeout(() => process.exit(1), 10000)
// }
//
// process.on('SIGTERM', () => gracefulShutdown(robustServer))
// process.on('SIGINT', () => gracefulShutdown(robustServer))

// ───────── 最佳实践 ─────────
// 生产环境使用 Express/Koa/Fastify 等框架
// 设置合理的超时，防止连接挂起
// 限制请求体大小，防止内存溢出
// 正确设置 Content-Type 和编码
// 使用 try/catch 处理 JSON 解析错误
// 实现优雅关闭，确保请求处理完成
// 生产环境放在反向代理（Nginx）后面
