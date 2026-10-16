const n=`// ═══════════════════════════════════════════
// 1. 危险拼接：把文件名当可信数据
// ═══════════════════════════════════════════

import { readFile } from 'node:fs/promises'
import path from 'node:path'

async function unsafeRead(name) {
  const file = path.join('uploads', name)                     // 危险：name 可含 ../../
  return readFile(file, 'utf8')                               // 结果：可读到允许目录之外的文件
}

// ═══════════════════════════════════════════
// 2. 用白名单只放行确定安全的形态
// ═══════════════════════════════════════════

const SAFE_NAME = /^[a-z0-9][a-z0-9._-]*$/i                   // 字母数字点下划线短横线，且非 . 开头

function isSafeName(name) {
  return typeof name === 'string'
    && name.length <= 128                                     // 限制长度，防超长拖垮解析
    && SAFE_NAME.test(name)
}

// ═══════════════════════════════════════════
// 3. 规范化后确认仍在允许目录内
// ═══════════════════════════════════════════

const BASE = path.resolve('uploads')

function resolveInsideBase(name) {
  const target = path.resolve(BASE, name)                     // .. 在这一步被真正走出去
  if (target !== BASE && !target.startsWith(BASE + path.sep)) {
    throw new Error('路径穿越被拒绝')                          // 结果：规范化后再校验前缀
  }
  return target
}

async function safeRead(name) {
  if (!isSafeName(name)) throw new Error('文件名不合法')
  return readFile(resolveInsideBase(name), 'utf8')            // 双重防线都通过才读
}

// ═══════════════════════════════════════════
// 4. 其余边界各守一类事故
// ═══════════════════════════════════════════

const MAX_BODY = 1_000_000                                    // 请求体上限：防资源耗尽

function guardBody(body) {
  if (body.length > MAX_BODY) throw new Error('请求体过大')
  return body
}

const sql = 'SELECT * FROM courses WHERE id = ?'              // 参数化占位符，不拼字符串
// db.query(sql, [courseId])
// 说明：错误响应不暴露内部路径/堆栈/版本，依赖定期 audit 并及时升级
`;export{n as default};
