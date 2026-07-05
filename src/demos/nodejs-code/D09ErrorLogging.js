// ═══════════════════════════════════════════
// D09 - 错误边界与结构化日志
// ═══════════════════════════════════════════

// ───────── 错误类型 ─────────

// 1. 操作错误（Operational Errors）- 可预期的
//    - 网络请求失败
//    - 文件不存在
//    - 用户输入无效
//    - 数据库连接失败

// 2. 编程错误（Programmer Errors）- Bug
//    - 调用 undefined 的方法
//    - 数组越界
//    - 类型错误
//    - 内存泄漏

// ───────── 自定义错误类 ─────────

class AppError extends Error {
  constructor(message, code, statusCode = 500, details = {}) {
    super(message)
    this.name = this.constructor.name
    this.code = code              // 业务错误码
    this.statusCode = statusCode  // HTTP 状态码
    this.details = details        // 详细信息
    this.timestamp = new Date().toISOString()

    // 保持正确的堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    }
  }
}

// 更具体的错误类
class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 'VALIDATION_ERROR', 400, details)
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} not found`, 'NOT_FOUND', 404, { resource, id })
  }
}

class DatabaseError extends AppError {
  constructor(message, cause) {
    super(message, 'DATABASE_ERROR', 500, { cause: cause.message })
    this.cause = cause
  }
}

// ───────── 错误抛出与捕获 ─────────

function validateUser(user) {
  if (!user.name || user.name.length < 2) {
    throw new ValidationError('用户名至少2个字符', {
      field: 'name',
      value: user.name
    })
  }
  if (!user.email || !user.email.includes('@')) {
    throw new ValidationError('邮箱格式无效', {
      field: 'email',
      value: user.email
    })
  }
  return true
}

function handleRequestError(req, res, err) {
  if (err instanceof AppError) {
    // 已知的业务错误
    console.warn('业务错误:', err.message)
    res.statusCode = err.statusCode
    res.end(JSON.stringify(err.toJSON()))
  } else {
    // 未知错误 - 记录详细日志，返回通用错误
    console.error('未知错误:', err)
    res.statusCode = 500
    res.end(JSON.stringify({
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    }))
  }
}

// ───────── 异步错误处理 ─────────

// 错误的写法：未捕获 Promise 拒绝
// async function badExample() {
//   const result = await someAsyncOperation()
//   // 如果失败，会变成 unhandledRejection
// }

// 正确的写法：try/catch
async function safeOperation() {
  try {
    const result = await riskyAsyncCall()
    return result
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      throw new AppError('服务暂时不可用', 'SERVICE_UNAVAILABLE', 503)
    }
    throw err // 其他错误继续抛出
  }
}

// Express 风格的错误处理中间件模式
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// ───────── 结构化日志 ─────────

// 日志级别
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4
}

class StructuredLogger {
  constructor(options = {}) {
    this.level = options.level || 'info'
    this.service = options.service || 'app'
  }

  _shouldLog(level) {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level]
  }

  _format(level, message, data = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      ...data
    }
  }

  _output(level, message, data) {
    if (!this._shouldLog(level)) return

    const entry = this._format(level, message, data)

    if (level === 'error' || level === 'fatal') {
      console.error(JSON.stringify(entry))
    } else if (level === 'warn') {
      console.warn(JSON.stringify(entry))
    } else {
      console.log(JSON.stringify(entry))
    }
  }

  debug(message, data) { this._output('debug', message, data) }
  info(message, data)  { this._output('info', message, data) }
  warn(message, data)  { this._output('warn', message, data) }
  error(message, data) { this._output('error', message, data) }

  errorWithError(message, error, data = {}) {
    this._output('error', message, {
      ...data,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    })
  }
}

// 使用示例
const logger = new StructuredLogger({
  service: 'user-service',
  level: process.env.LOG_LEVEL || 'info'
})

// logger.info('用户登录', { userId: 123, ip: '192.168.1.1' })
// logger.errorWithError('数据库查询失败', err, { query: 'SELECT * FROM users' })

// ───────── 请求 ID 追踪 ─────────

import { randomUUID } from 'node:crypto'

function createRequestContext(req) {
  const requestId = randomUUID()
  return {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent']
  }
}

// 在请求处理中
// const ctx = createRequestContext(req)
// logger.info('请求开始', ctx)

// ───────── 错误边界模式 ─────────

// 顶层错误捕获
function setupErrorHandling(app) {
  // 未捕获异常
  process.on('uncaughtException', (err) => {
    logger.errorWithError('未捕获的异常', err)
    process.exit(1)
  })

  // 未处理的 Promise 拒绝
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('未处理的 Promise 拒绝', {
      reason: reason?.message || String(reason),
      promise: String(promise)
    })
  })

  // 全局错误中间件（Express 风格）
  // app.use((err, req, res, next) => {
  //   handleRequestError(req, res, err)
  // })
}

// ───────── 最佳实践 ─────────
// 用自定义错误类区分错误类型
// 抛出有意义的错误，包含上下文信息
// 异步代码一定要 try/catch 或 .catch()
// 使用结构化日志（JSON 格式）便于分析
// 日志分级，生产环境不要输出 debug
// 始终监听 uncaughtException 和 unhandledRejection
// 给错误添加请求 ID，便于追踪
// 不要用 try/catch 包裹所有代码，只在能处理的地方捕获
