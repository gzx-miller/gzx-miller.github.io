// ═══════════════════════════════════════════
// D02 - node:path 和 node:url 路径处理
// ═══════════════════════════════════════════

import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// ───────── path 模块核心 API ─────────

// 1. 路径拼接与解析
const baseDir = '/home/user/projects'
const fileName = 'src/index.js'

// path.join: 拼接路径片段，会规范化结果
const joinedPath = path.join(baseDir, fileName)
// '/home/user/projects/src/index.js'

// path.resolve: 解析为绝对路径（从右向左，遇到绝对路径停止）
const resolvedPath = path.resolve('src', 'index.js')
// 相当于 process.cwd() + '/src/index.js'

// 2. 路径信息提取
const fullPath = '/home/user/docs/report.pdf'

path.dirname(fullPath)   // '/home/user/docs'  — 目录名
path.basename(fullPath)  // 'report.pdf'        — 文件名（含扩展名）
path.basename(fullPath, '.pdf')  // 'report'  — 文件名（不含扩展名）
path.extname(fullPath)   // '.pdf'              — 扩展名

// 3. 路径规范化
path.normalize('/home//user/../user/docs/./file.txt')
// '/home/user/docs/file.txt' — 解析 . 和 ..，合并重复分隔符

// 4. 相对路径计算
path.relative('/home/user/a', '/home/user/b/c')
// '../b/c' — 从第一个路径到第二个路径的相对路径

// 5. 路径分隔符与环境判断
path.sep        // Windows: '\\', POSIX: '/'
path.delimiter  // Windows: ';',  POSIX: ':'
path.isAbsolute('/home')  // true — 是否绝对路径

// ───────── 跨平台兼容 ─────────

// Windows 特有
path.win32.join('C:\\Users', 'name')  // 'C:\\Users\\name'

// POSIX 特有（Linux/macOS）
path.posix.join('/home', 'user')      // '/home/user'

// ───────── url 模块与 file URL 转换 ─────────

// 1. 文件路径转 file URL
const filePath = '/home/user/data.json'
const fileUrl = pathToFileURL(filePath)
// URL { href: 'file:///home/user/data.json' }

// 2. file URL 转文件路径
const urlStr = 'file:///home/user/data.json'
const convertedPath = fileURLToPath(urlStr)
// '/home/user/data.json'

// 3. ESM 中获取 __dirname 和 __filename（替代方案）
import.meta.url              // 当前模块的 file URL
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Node.js 21+ 可直接用：
// import.meta.filename
// import.meta.dirname

// ───────── URL 解析（WHATWG URL API） ─────────

const url = new URL('https://user:pass@example.com:8080/path?query=1#hash')
url.protocol    // 'https:'
url.hostname    // 'example.com'
url.port        // '8080'
url.pathname    // '/path'
url.search      // '?query=1'
url.hash        // '#hash'
url.username    // 'user'
url.origin      // 'https://example.com:8080'

// 构造 URL
const apiUrl = new URL('/api/users', 'https://api.example.com')
apiUrl.searchParams.set('page', '1')
apiUrl.searchParams.set('limit', '10')
// 'https://api.example.com/api/users?page=1&limit=10'

// ───────── 最佳实践 ─────────
// 始终用 path.join / path.resolve 拼接路径，不要手动拼字符串
// 跨平台项目避免硬编码路径分隔符
// 处理文件 URL 用 fileURLToPath / pathToFileURL
// ESM 模块中用 import.meta.url 获取当前文件路径
