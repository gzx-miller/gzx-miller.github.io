// 性能对比：同一递归算法分别用 Wasm 与 JS 实现，实测耗时
function fibJs(v) {
  if (v < 2) return v
  return fibJs(v - 1) + fibJs(v - 2)
}

// 预热 + 多次取样取最小值，排除 JIT 波动
function measure(v, fn) {
  fn(v) // 预热
  let best = Infinity
  let result = 0
  for (let i = 0; i < 5; i++) {
    const t0 = performance.now()
    result = fn(v)
    best = Math.min(best, performance.now() - t0)
  }
  return { result, ms: best }
}

const w = measure(30, (x) => wasm.exports.fib(x)) // Wasm 版本（预编译字节码）
const j = measure(30, (x) => fibJs(x))            // JS 版本（依赖 JIT 预热）
console.log(`Wasm ${w.ms.toFixed(2)}ms，JS ${j.ms.toFixed(2)}ms`)

// 结论：计算密集、热点稳定、可复用时选 Wasm；
// 跨边界调用有开销，小函数频繁跨界反而更慢，应让计算尽量留在模块内。
