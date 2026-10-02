const n=`// AbortController：取消进行中的异步操作

// 1. 取消 Fetch 请求
const controller = new AbortController()
const signal = controller.signal

fetch('/api/data', { signal })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('请求已取消')
    }
  })

// 在需要时取消
controller.abort()

// 2. 超时自动取消
const timeoutController = new AbortController()
setTimeout(() => controller.abort(), 5000)  // 5秒超时

fetch('/api/slow', { signal: timeoutController.signal })

// 3. 取消事件监听
const ac = new AbortController()
document.addEventListener('click', handler, { signal: ac.signal })
document.addEventListener('mousemove', handler, { signal: ac.signal })
// 一次调用取消所有带此 signal 的监听
ac.abort()

// 4. 手动触发 AbortSignal
const manualController = new AbortController()
manualController.signal.addEventListener('abort', () => {
  console.log('操作被取消！')
})
manualController.abort()  // 触发所有监听的 abort 事件
`;export{n as default};
