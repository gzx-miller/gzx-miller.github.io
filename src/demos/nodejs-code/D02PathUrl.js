// ═══════════════════════════════════════════
// 1. join 只拼接，resolve 从右向左求绝对路径
// ═══════════════════════════════════════════

import path from 'node:path'

const baseDir = '/app/data'

// join：把各段拼起来并规范化，绝对片段只当成普通一段
path.join(baseDir, 'reports/2026.json')       // 结果：/app/data/reports/2026.json
path.join('/app', '/etc')                     // 结果：/app/etc，不是 /etc

// resolve：从右向左解析，遇到绝对片段即停下并丢弃左侧
path.resolve('/app', '/etc')                  // 结果：/etc
path.resolve(baseDir, '../../etc/passwd')     // 结果：/etc/passwd，向上跳没被拦住

// 求绝对路径用 resolve；安全拼接则先固定基准、再 join 相对片段
const absBase = path.resolve(baseDir)         // 结果：基准显式求绝对路径，不依赖 cwd
const safe = path.join(absBase, 'reports/2026.json')
                                              // 结果：/app/data/reports/2026.json

// ═══════════════════════════════════════════
// 2. 分隔符交给 path，别在字符串里手写
// ═══════════════════════════════════════════

path.sep        // 结果：Windows '\\'，POSIX '/'
path.delimiter  // 结果：Windows ';'，POSIX ':'，用于拼接 PATH 类列表

// 不要写 'a' + '\\' + 'b'，交给 join 让平台自己决定
path.join('a', 'b')                           // 结果：Windows a\b，POSIX a/b

// ═══════════════════════════════════════════
// 3. win32 / posix 显式指定平台规则
// ═══════════════════════════════════════════

// 在任一平台都能算出另一种平台的解析结果，便于测试与核对
path.win32.join('C:\\Users', 'name')          // 结果：C:\Users\name
path.posix.join('/home', 'user')              // 结果：/home/user
path.posix.isAbsolute('/home/user')           // 结果：true

// ═══════════════════════════════════════════
// 4. 拆解一段路径：basename / extname / parse
// ═══════════════════════════════════════════

const fullPath = '/app/docs/report.tar.gz'

path.basename(fullPath)             // 结果：report.tar.gz
path.dirname(fullPath)              // 结果：/app/docs
path.extname(fullPath)              // 结果：.gz，只取最后一段扩展名
path.basename(fullPath, '.gz')      // 结果：report.tar，去掉指定后缀

const parts = path.parse(fullPath)  // 说明：一次拿到 root/dir/base/ext/name
parts.name                          // 结果：report.tar
parts.ext                           // 结果：.gz
parts.root                          // 结果：/

// ═══════════════════════════════════════════
// 5. ESM 里找回 __dirname / __filename
// ═══════════════════════════════════════════

import { fileURLToPath, pathToFileURL } from 'node:url'

// ESM 没有 __dirname，模块自身位置是一条 file: URL
const __filename = fileURLToPath(import.meta.url)   // 结果：/app/src/index.mjs
const __dirname = path.dirname(__filename)          // 结果：/app/src
import.meta.dirname                                 // 结果：Node 20.11+ 直接给出，等同上一行

// 反过来，把普通路径包装成 file URL 交给需要 URL 的 API
pathToFileURL('/app/data/2026.json').href           // 结果：file:///app/data/2026.json

// ═══════════════════════════════════════════
// 6. URL 类与查询串解析
// ═══════════════════════════════════════════

const u = new URL('https://shop.example.com:8443/order?id=42&tag=hot#detail')
u.protocol              // 结果：https:
u.hostname              // 结果：shop.example.com
u.pathname              // 结果：/order
u.searchParams.get('id')  // 结果：42，直接从查询串取一项
u.origin                // 结果：https://shop.example.com:8443

// 相对地址拼到基准上，再由 searchParams 组装查询串
const api = new URL('/api/courses', 'https://api.example.com')
api.searchParams.set('page', '1')   // 结果：https://api.example.com/api/courses?page=1
