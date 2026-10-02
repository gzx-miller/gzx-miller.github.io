const n=`// async/await：用同步写法处理异步流程

// 模拟异步请求
const fetch = (label, ms) =>
  new Promise((resolve) => setTimeout(() => resolve(label), ms))

// ── 串行：逐个等待，总耗时 = 各步之和 ──
async function loadSerial() {
  const steps = ['课程', '通知', '进度']
  for (const step of steps) {
    const result = await fetch(step, 200)
    console.log(\`已加载：\${result}\`)
  }
}

// ── 并发：同时发起，总耗时 ≈ 最慢那个 ──
async function loadParallel() {
  const [courses, notices, progress] = await Promise.all([
    fetch('课程', 300),
    fetch('通知', 400),
    fetch('进度', 200),
  ])
  console.log(courses, notices, progress)
}

// ── 错误处理：try/catch/finally ──
async function safeLoad() {
  try {
    const data = await fetch('数据', 100)
    console.log(data)
  } catch (err) {
    console.error('加载失败：', err.message)
  } finally {
    console.log('加载结束（无论成败）')
  }
}

// ── AbortController 取消请求概念 ──
const controller = new AbortController()
// fetch(url, { signal: controller.signal })
// controller.abort() — 调用后 promise 会 reject AbortError
`;export{n as default};
