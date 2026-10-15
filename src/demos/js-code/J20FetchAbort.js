// ═══════════════════════════════════════════
// 1. fetch 基本用法与 Response 对象
// ═══════════════════════════════════════════

const res = await fetch('/api/courses')   // Promise 兑现为 Response
res instanceof Response                   // true
res.ok                                    // true   ← 状态码落在 200-299
res.status                                // 200
res.statusText                            // 'OK'   ← 响应头先到，正文还没读

// ═══════════════════════════════════════════
// 2. 请求配置：method / headers / body
// ═══════════════════════════════════════════

await fetch('/api/courses', {
  method: 'POST',                                    // 默认是 GET
  headers: { 'Content-Type': 'application/json' },   // 声明请求体类型
  body: JSON.stringify({ title: 'Vue 组件通信' }),   // 请求体必须是字符串
})

// ═══════════════════════════════════════════
// 3. credentials 决定凭证是否随请求携带
// ═══════════════════════════════════════════

await fetch('/api/me', { credentials: 'include' })   // 跨域时带上 Cookie
// 'same-origin'（默认，仅同源）/ 'include'（跨域也带）/ 'omit'（从不带）

// ═══════════════════════════════════════════
// 4. 状态码不会让 fetch 拒绝
// ═══════════════════════════════════════════

const notFound = await fetch('/api/not-found')
notFound.ok        // false
notFound.status    // 404  ← 404/500 依然走兑现分支，不会进 catch
// 只有断网、DNS 失败、主动取消才会让 Promise 拒绝

// ═══════════════════════════════════════════
// 5. 响应体只能读一次，二次读取先 clone
// ═══════════════════════════════════════════

const bodyRes = await fetch('/api/courses')
const copy = bodyRes.clone()         // 第一次读取之前先复制
const data = await bodyRes.json()    // 消费原始响应体
const raw = await copy.text()        // 另一份还能继续读
// 不加 clone 直接读两次会抛：TypeError: body stream already read

// ═══════════════════════════════════════════
// 6. json 与 text 都返回 Promise
// ═══════════════════════════════════════════

const asJson = res.json()            // Promise，兑现为解析后的对象
const asText = res.text()            // Promise，兑现为原始字符串
typeof asJson                        // 'object'  ← 拿到的是 Promise，不是结果
await asJson                         // { title: 'Vue 组件通信' }

// ═══════════════════════════════════════════
// 7. AbortController 与 AbortError
// ═══════════════════════════════════════════

const controller = new AbortController()
const signal = controller.signal
controller.abort()                                   // 触发取消
await fetch('/api/courses', { signal })              // 以异常拒绝
// 这次异常的 name === 'AbortError'，表示被主动取消

// ═══════════════════════════════════════════
// 8. 用定时器实现超时中断
// ═══════════════════════════════════════════

const timeoutController = new AbortController()
const timer = setTimeout(() => timeoutController.abort(), 3000)
try {
  await fetch('/api/slow', { signal: timeoutController.signal })
} catch (e) {
  e.name     // 'AbortError'  ← 超过 3 秒被中断
} finally {
  clearTimeout(timer)          // 成功返回后撤掉定时器
}

// ═══════════════════════════════════════════
// 9. 搜索联想：取消过期请求，避免旧结果覆盖新结果
// ═══════════════════════════════════════════

let searchController
async function search(keyword) {
  searchController?.abort()                            // 先取消上一次请求
  searchController = new AbortController()
  const r = await fetch(`/api/search?q=${keyword}`, {
    signal: searchController.signal,
  })
  return r.json()
}
// 旧请求被 abort 后走 catch 的 AbortError 分支，不会再写回列表
