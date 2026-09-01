const n=`// 多线程与 Web Worker：Wasm 本身单线程，配合 Worker + 共享内存利用多核
// 每个 Worker 实例化同一 atomic 模块，对共享内存执行原子自增

// Worker 内脚本：实例化模块并循环 atomicAdd
const WORKER_SRC = \`
self.onmessage = async (e) => {
  const { bytes, iters, sab } = e.data
  const { instance } = await WebAssembly.instantiate(bytes)
  const add = instance.exports.atomicAdd
  for (let i = 0; i < iters; i++) add(0)
  self.postMessage('done')
}
\`

// 主线程：创建共享内存并清零
const sab = new SharedArrayBuffer(65536)
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
      console.log(\`最终库存：\${new Int32Array(sab)[0]}\`)
    }
  }
  worker.postMessage({ bytes, iters: k, sab })
}
`;export{n as default};
