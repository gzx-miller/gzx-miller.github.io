const n=`// ═══════════════════════════════════════════
// D23 - HTTPS 与 TLS 配置
// ═══════════════════════════════════════════

import https from 'node:https'
import http from 'node:http'
import fs from 'node:fs'

// ───────── HTTPS 服务端 ─────────

// 需要证书和私钥文件
// 自签名证书生成命令（仅用于开发）：
// openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

// const options = {
//   key: fs.readFileSync('key.pem'),    // 私钥
//   cert: fs.readFileSync('cert.pem'),  // 证书
//
//   // 推荐的安全配置
//   minVersion: 'TLSv1.2',             // 最低 TLS 版本
//   maxVersion: 'TLSv1.3',             // 最高 TLS 版本
//
//   // 密码套件（推荐的安全套件）
//   ciphers: [
//     'TLS_AES_256_GCM_SHA384',
//     'TLS_CHACHA20_POLY1305_SHA256',
//     'TLS_AES_128_GCM_SHA256',
//     'ECDHE-RSA-AES256-GCM-SHA384',
//     'ECDHE-RSA-AES128-GCM-SHA256'
//   ].join(':'),
//
//   // 优先使用服务器端的密码套件顺序
//   honorCipherOrder: true,
//
//   // OCSP Stapling（证书状态查询）
//   // 需要 CA 提供的 OCSP 响应
// }
//
// const server = https.createServer(options, (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
//   res.end('Hello HTTPS!')
// })
//
// server.listen(443, () => {
//   console.log('HTTPS Server running on port 443')
// })

// ───────── HTTP 重定向到 HTTPS ─────────

// 常见做法：80 端口重定向到 443
// const httpServer = http.createServer((req, res) => {
//   res.writeHead(301, {
//     Location: \`https://\${req.headers.host}\${req.url}\`
//   })
//   res.end()
// })
//
// httpServer.listen(80, () => {
//   console.log('HTTP redirect server running on port 80')
// })

// ───────── HTTPS 客户端请求 ─────────

// GET 请求
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        })
      })
    }).on('error', reject)
  })
}

// 完整请求（带选项）
function httpsRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        })
      })
    })

    req.on('error', reject)
    req.setTimeout(10000, () => req.destroy(new Error('请求超时')))

    if (body) {
      req.write(body)
    }
    req.end()
  })
}

// POST 请求示例
// async function postJson() {
//   const result = await httpsRequest({
//     hostname: 'api.example.com',
//     port: 443,
//     path: '/api/users',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer token123'
//     }
//   }, JSON.stringify({ name: '张三' }))
//
//   console.log('状态码:', result.statusCode)
//   console.log('响应:', result.body)
// }

// ───────── TLS 相关选项 ─────────

// 客户端 TLS 选项
const tlsOptions = {
  // CA 证书（用于自签名证书或私有 CA）
  // ca: fs.readFileSync('ca.pem'),

  // 客户端证书（双向认证时使用）
  // key: fs.readFileSync('client-key.pem'),
  // cert: fs.readFileSync('client-cert.pem'),

  // 拒绝未授权的证书（默认 true）
  // 设为 false 不安全，仅开发调试用！
  rejectUnauthorized: true,

  // 服务器名称指示（SNI）
  servername: 'example.com',

  // 最低 TLS 版本
  minVersion: 'TLSv1.2',

  // 检查证书有效期
  // checkServerIdentity: (host, cert) => { ... }
}

// 警告：不要在生产环境使用 rejectUnauthorized: false
// 这会完全禁用证书验证，极易受到中间人攻击！
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' 同样危险

// ───────── 证书相关概念 ─────────

// 1. 证书类型
//    - 自签名证书：自己生成，仅开发用
//    - DV (Domain Validation)：验证域名所有权
//    - OV (Organization Validation)：验证组织
//    - EV (Extended Validation)：最高级别验证

// 2. 免费证书：Let's Encrypt
//    - 免费、自动化
//    - 90 天有效期，需自动续期
//    - 工具：certbot, acme.sh

// 3. 证书链
//    服务器证书 → 中间 CA → 根 CA
//    浏览器/系统内置信任的根 CA

// 4. SNI (Server Name Indication)
//    一个 IP 可以有多个域名的证书
//    客户端在握手时告诉服务器要访问的域名

// ───────── 安全配置建议 ─────────

// TLS 版本：
// ✓ 启用: TLS 1.2, TLS 1.3
// ✗ 禁用: SSLv3, TLS 1.0, TLS 1.1（已知漏洞）

// 密码套件选择原则：
// - 优先 AEAD 认证加密（GCM, ChaCha20-Poly1305）
// - 优先前向保密（ECDHE）
// - 禁用 RC4, DES, 3DES, CBC 模式（有漏洞）
// - 禁用弱密钥交换（RSA 密钥交换，无前向保密）

// 推荐的密码套件（TLS 1.2 + 1.3）：
// TLS_AES_256_GCM_SHA384
// TLS_CHACHA20_POLY1305_SHA256
// TLS_AES_128_GCM_SHA256
// ECDHE-ECDSA-AES256-GCM-SHA384
// ECDHE-RSA-AES256-GCM-SHA384
// ECDHE-ECDSA-CHACHA20-POLY1305
// ECDHE-RSA-CHACHA20-POLY1305
// ECDHE-ECDSA-AES128-GCM-SHA256
// ECDHE-RSA-AES128-GCM-SHA256

// ───────── 常见安全头 ─────────

// 在 HTTP 响应中添加这些头增强安全性

function addSecurityHeaders(res) {
  // 强制 HTTPS（HSTS）
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  // 内容安全策略
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'"
  )

  // 防止 MIME 类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // 防止点击劫持
  res.setHeader('X-Frame-Options', 'DENY')

  // XSS 保护（现代浏览器主要靠 CSP）
  res.setHeader('X-XSS-Protection', '1; mode=block')

  // 引荐来源信息控制
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
}

// ───────── 测试 HTTPS 配置 ─────────

// 在线工具：
// - SSL Labs Server Test (ssllabs.com)
// - testssl.sh (命令行工具)

// 命令行测试：
// openssl s_client -connect example.com:443 -tls1_2
// openssl s_client -connect example.com:443 -tls1_3
// curl -v https://example.com
// nmap --script ssl-enum-ciphers -p 443 example.com

// ───────── 生产环境最佳实践 ─────────
// 使用 Let's Encrypt 等免费证书
// 启用 TLS 1.2 和 1.3，禁用旧版本
// 使用强密码套件，禁用弱套件
// 启用 HSTS，强制 HTTPS
// 配置证书自动续期
// 定期扫描 TLS 配置
// 考虑使用 CDN（内置 HTTPS 和安全优化）
// 不要在代码中硬编码证书路径，用配置管理
// 证书私钥妥善保管，不要提交到代码仓库
// 双向认证（mTLS）用于内部服务间通信

// ───────── 常见错误 ─────────
// 1. rejectUnauthorized: false（完全禁用验证）
// 2. 硬编码证书和私钥到代码中
// 3. 使用已过期的证书
// 4. 只配置证书，忘记配置中间证书
// 5. 启用了 SSLv3/TLS 1.0 等不安全协议
// 6. 私钥文件权限太宽松（应该 600）
`;export{n as default};
