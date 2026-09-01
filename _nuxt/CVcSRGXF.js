const r=`// 错误处理与自定义异常

// ── try / catch / finally 基础 ──
function parseJSON(str) {
  try {
    return JSON.parse(str)
  } catch (err) {
    console.error('解析失败：', err.message)
    return null
  } finally {
    console.log('解析结束（无论成败）')
  }
}

// ── 自定义异常类 ──
class ValidationError extends Error {
  constructor(field, message) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = 'NetworkError'
    this.statusCode = statusCode
  }
}

// ── error.cause 错误链（ES2022） ──
function saveCourse(data) {
  try {
    if (!data.title) throw new ValidationError('title', '课程标题不能为空')
  } catch (err) {
    // 包装原始错误，保留上下文
    throw new Error('保存课程失败', { cause: err })
  }
}
try {
  saveCourse({ title: '' })
} catch (err) {
  console.log(err.message)           // '保存课程失败'
  console.log(err.cause.name)        // 'ValidationError'
  console.log(err.cause.field)       // 'title'
}

// ── 内置错误类型 ──
// TypeError  — 类型不对  null.foo
// RangeError — 超出范围  new Array(-1)
// SyntaxError — 语法错误  eval('let let')
// ReferenceError — 引用不存在  unknownVar

// ── 异步错误处理 ──
async function safeFetch(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new NetworkError(res.statusText, res.status)
    return await res.json()
  } catch (err) {
    // async 中的 catch 能捕获 await 链上的所有 reject
    console.error(\`\${err.name}: \${err.message}\`)
  }
}
`;export{r as default};
