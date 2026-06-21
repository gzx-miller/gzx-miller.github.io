// Fetch API 基础用法
async function fetchPost(id) {
  // GET 请求（默认）
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)

  // 检查响应状态
  if (!res.ok) {
    throw new Error(`请求失败：${res.status}`)
  }

  // 解析 JSON 响应体
  const data = await res.json()
  return data
}

// POST 请求（带请求体）
async function createPost(title, body) {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body, userId: 1 }),
  })

  return res.json()
}

// 读取响应头
async function logHeaders() {
  const res = await fetch('/api/data')
  console.log(res.headers.get('content-type'))
  console.log(res.status)        // 200
  console.log(res.statusText)    // 'OK'
  console.log(res.ok)            // true（status 在 200-299 之间）
}

// Request 对象（可复用配置）
const req = new Request('/api/data', {
  headers: { 'Accept': 'application/json' },
})
fetch(req)
