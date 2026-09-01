const n=`// ═══════════════════════════════════════════
// D11 - 输入安全与路径穿越防护
// ═══════════════════════════════════════════

import path from 'node:path'
import fs from 'node:fs/promises'

// ───────── 路径穿越攻击 (Path Traversal) ─────────
// 攻击者通过 ../ 等方式访问预期外的文件

// 危险的写法：直接拼接用户输入
async function unsafeReadFile(userInput) {
  // 攻击者传入: ../../etc/passwd
  const filePath = path.join('./data', userInput)
  // 可能变成: ./data/../../etc/passwd → /etc/passwd
  return await fs.readFile(filePath, 'utf-8')
}

// 安全的写法：规范化后验证是否在允许目录内
async function safeReadFile(userInput) {
  const baseDir = path.resolve('./data')
  const filePath = path.resolve(baseDir, userInput)

  // 验证解析后的路径是否仍在 baseDir 内
  if (!filePath.startsWith(baseDir + path.sep) && filePath !== baseDir) {
    throw new Error('非法路径访问')
  }

  return await fs.readFile(filePath, 'utf-8')
}

// 更好的做法：使用 path.normalize + 白名单验证
function sanitizePath(userPath, baseDir) {
  const resolvedBase = path.resolve(baseDir)
  const resolvedPath = path.resolve(resolvedBase, userPath)
  const relative = path.relative(resolvedBase, resolvedPath)

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('路径穿越检测')
  }

  return resolvedPath
}

// ───────── 输入验证 ─────────

// 1. 类型与格式验证
function validateEmail(email) {
  if (typeof email !== 'string') return false
  if (email.length > 254) return false
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
  return emailRegex.test(email)
}

function validateUsername(username) {
  if (typeof username !== 'string') return false
  // 只允许字母数字下划线，3-20 位
  return /^[a-zA-Z0-9_]{3,20}$/.test(username)
}

// 2. 长度限制
function validateInput(input, maxLength = 1000) {
  if (typeof input !== 'string') return false
  return input.length <= maxLength
}

// 3. 数字范围验证
function validatePage(page, maxPage = 1000) {
  const num = Number(page)
  if (!Number.isInteger(num)) return false
  return num >= 1 && num <= maxPage
}

// ───────── SQL 注入防护 ─────────
// 使用参数化查询，不要拼接 SQL

// 危险写法
// const sql = \`SELECT * FROM users WHERE name = '\${userInput}'\`

// 安全写法（参数化查询）
// const sql = 'SELECT * FROM users WHERE name = ?'
// db.query(sql, [userInput])

// ───────── XSS 防护（输出编码） ─────────

function escapeHtml(str) {
  if (typeof str !== 'string') return str
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\\//g, '&#x2F;')
}

// 使用示例
// const userComment = '<script>alert("xss")<\/script>'
// const safeHtml = \`<div>\${escapeHtml(userComment)}</div>\`

// ───────── 命令注入防护 ─────────

import { execFile, spawn } from 'node:child_process'

// 危险：使用 exec + 字符串拼接
// import { exec } from 'node:child_process'
// exec(\`ls \${userInput}\`, callback) // 可能被注入

// 安全：使用 execFile + 参数数组
function listFiles(dir) {
  return new Promise((resolve, reject) => {
    execFile('ls', ['-la', dir], (err, stdout, stderr) => {
      if (err) reject(err)
      else resolve(stdout)
    })
  })
}

// 更安全：白名单验证目录
function safeListFiles(dir) {
  const allowedDirs = ['/tmp', '/var/log']
  if (!allowedDirs.includes(dir)) {
    throw new Error('不允许的目录')
  }
  return listFiles(dir)
}

// ───────── CSRF 防护（Web 应用） ─────────
// - 使用 CSRF Token
// - 验证 Referer/Origin
// - SameSite Cookie

// ───────── 速率限制 (Rate Limiting) ─────────

class RateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit           // 时间窗口内最大请求数
    this.windowMs = windowMs     // 时间窗口（毫秒）
    this.requests = new Map()    // IP -> 时间戳数组
  }

  isAllowed(ip) {
    const now = Date.now()
    const windowStart = now - this.windowMs

    let timestamps = this.requests.get(ip) || []

    // 移除窗口外的记录
    timestamps = timestamps.filter((t) => t > windowStart)

    if (timestamps.length >= this.limit) {
      this.requests.set(ip, timestamps)
      return false
    }

    timestamps.push(now)
    this.requests.set(ip, timestamps)
    return true
  }

  // 定期清理过期数据
  startCleanup() {
    setInterval(() => {
      const now = Date.now()
      const windowStart = now - this.windowMs
      for (const [ip, timestamps] of this.requests) {
        const filtered = timestamps.filter((t) => t > windowStart)
        if (filtered.length === 0) {
          this.requests.delete(ip)
        } else {
          this.requests.set(ip, filtered)
        }
      }
    }, this.windowMs)
  }
}

// ───────── 敏感数据处理 ─────────

// 1. 不要在日志中记录敏感信息
function sanitizeForLog(obj) {
  const sensitive = ['password', 'token', 'secret', 'apiKey']
  const result = { ...obj }
  for (const key of sensitive) {
    if (key in result) {
      result[key] = '***REDACTED***'
    }
  }
  return result
}

// 2. 密码哈希（使用 bcrypt 等专业库）
// 不要自己实现加密算法！
// import bcrypt from 'bcrypt'
// const hash = await bcrypt.hash(password, 12)
// const isValid = await bcrypt.compare(password, hash)

// ───────── 安全头（HTTP 服务） ─────────
// - Content-Security-Policy
// - X-Frame-Options: DENY
// - X-Content-Type-Options: nosniff
// - Strict-Transport-Security
// - X-XSS-Protection

// ───────── 最佳实践 ─────────
// 永远不要信任用户输入，所有输入都要验证
// 使用参数化查询防止 SQL 注入
// 输出 HTML 时进行转义防止 XSS
// 文件操作验证路径，防止路径穿越
// 命令执行使用 execFile/spawn + 参数数组
// 敏感数据加密存储，不要明文存储密码
// 实现速率限制防止暴力攻击
// 定期更新依赖，修复安全漏洞
// 不要在错误信息中暴露内部实现细节
`;export{n as default};
