// 多线程与 Web Worker：单个实例顺序执行，多个 Worker + 共享内存才能利用多核
// 每个 Worker 实例化同一 atomic 模块（导入同一份共享内存），对共享内存执行原子自增

// Worker 内脚本：导入宿主传来的共享内存，循环调用 atomicAdd
const WORKER_SRC = `
self.onmessage = async (e) => {
  const { bytes, memory, iters } = e.data
  const { instance } = await WebAssembly.instantiate(bytes, { env: { memory } })
  const add = instance.exports.atomicAdd
  for (let i = 0; i < iters; i++) add(0)
  self.postMessage('done')
}
`

// 主线程：创建 1 页（64KiB）共享内存并清零；shared 必须同时给出 max
const memory = new WebAssembly.Memory({ initial: 1, maximum: 1, shared: true })
const sab = memory.buffer // 共享内存的 buffer 就是 SharedArrayBuffer
new Int32Array(sab)[0] = 0

const n = 4    // 并发 Worker 数
const k = 1000 // 每个 Worker 自增次数
const done = new Array(n).fill(false)

for (let i = 0; i < n; i++) {
  const worker = new Worker(
    URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' })),
  )
  worker.onmessage = () => {
    done[i] = true
    worker.terminate()
    if (done.every(Boolean)) {
      // 预期 n * k，原子操作保证并发不丢更新
      console.log(`最终库存：${new Int32Array(sab)[0]}`)
    }
  }
  // 把同一份 memory 传给每个 Worker，它们才操作同一块内存
  worker.postMessage({ bytes, memory, iters: k })
}
