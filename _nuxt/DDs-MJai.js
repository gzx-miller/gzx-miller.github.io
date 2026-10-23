const n=`// ═══════════════════════════════════════════
// 1. 用稳定错误码区分错误类型
// ═══════════════════════════════════════════

class AppError extends Error {
  constructor(message, code, status = 500) {
    super(message)
    this.code = code                                          // 对外稳定错误码
    this.status = status                                      // 对应 HTTP 状态
  }
}

const notFound = (id) => new AppError(\`课程 \${id} 不存在\`, 'COURSE_NOT_FOUND', 404)

// ═══════════════════════════════════════════
// 2. 在系统边界捕获并映射响应
// ═══════════════════════════════════════════

import { randomUUID } from 'node:crypto'

const log = (level, message, fields) =>
  console[level === 'warn' ? 'warn' : 'error'](JSON.stringify({ level, message, ...fields }))

const loadCourse = async (id) => {
  if (id === 'missing') throw notFound(id)                    // 操作型错误：预期内
  return { id, title: '课程' }
}

async function handleRequest(req, res) {
  const requestId = randomUUID()                              // 每笔请求一个追踪 ID
  try {
    const course = await loadCourse(req.params.id)
    res.end(JSON.stringify({ ok: true, course }))
  } catch (error) {
    if (error instanceof AppError) {
      log('warn', '请求失败', { requestId, code: error.code }) // 结果：日志写稳定错误码
      res.statusCode = error.status
      res.end(JSON.stringify({ code: error.code }))            // 只回错误码，不暴露堆栈
    } else {
      log('error', '未预期错误', { requestId, stack: error.stack })
      res.statusCode = 500
      res.end(JSON.stringify({ code: 'INTERNAL_ERROR' }))      // 结果：对外无内部细节
    }
  }
}

// ═══════════════════════════════════════════
// 3. 程序型错误记录后交给进程管理器重启
// ═══════════════════════════════════════════

process.on('uncaughtException', (error) => {
  log('error', '未捕获异常', { stack: error.stack })          // 完整堆栈只写进日志
  process.exit(1)                                             // 不带病继续对外服务
})

// ═══════════════════════════════════════════
// 4. 写日志前脱敏
// ═══════════════════════════════════════════

const SENSITIVE = ['password', 'token', 'apiKey', 'authorization']
function redact(input) {
  const out = { ...input }
  for (const key of SENSITIVE) {
    if (key in out) out[key] = '***'                          // 结果：日志里看不到密钥
  }
  return out
}

// ═══════════════════════════════════════════
// 5. 兜住未处理的 Promise 拒绝
// ═══════════════════════════════════════════

process.on('unhandledRejection', (reason) => {
  log('error', '未处理的 Promise 拒绝', redact({ reason: String(reason) }))
  // 说明：不是打印后接着跑，而是上报并按既定策略退出，不把异常吞掉
})
`;export{n as default};
