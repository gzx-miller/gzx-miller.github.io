const n=`// ═══════════════════════════════════════════
// D22 - perf_hooks 性能分析
// ═══════════════════════════════════════════

import { PerformanceObserver, performance } from 'node:perf_hooks'

// ───────── 基础计时 ─────────

// 高精度时间戳（毫秒，精确到微秒级）
const now = performance.now()
console.log('当前时间戳:', now)

// 测量代码执行时间
const start = performance.now()

// 模拟一些工作
let sum = 0
for (let i = 0; i < 1000000; i++) {
  sum += i
}

const end = performance.now()
console.log(\`循环耗时: \${end - start} 毫秒\`)

// ───────── performance.timerify ─────────
// 包装函数，自动测量执行时间

function slowFunction(n) {
  let result = 0
  for (let i = 0; i < n; i++) {
    result += Math.sqrt(i)
  }
  return result
}

// const timedSlowFunction = performance.timerify(slowFunction)
// timedSlowFunction(1000000)
// 会自动输出性能指标到 PerformanceObserver

// ───────── Performance Mark & Measure ─────────
// 标记时间点，测量两个标记之间的时间

// 创建标记
performance.mark('start-operations')

// 操作1
performance.mark('op1-start')
let result1 = 0
for (let i = 0; i < 500000; i++) {
  result1 += i * 2
}
performance.mark('op1-end')

// 操作2
performance.mark('op2-start')
let result2 = 0
for (let i = 0; i < 500000; i++) {
  result2 += Math.pow(i, 2)
}
performance.mark('op2-end')

performance.mark('end-operations')

// 测量两个标记之间的时间
performance.measure('操作1', 'op1-start', 'op1-end')
performance.measure('操作2', 'op2-start', 'op2-end')
performance.measure('总操作', 'start-operations', 'end-operations')

// 获取所有测量结果
const measures = performance.getEntriesByType('measure')
measures.forEach((measure) => {
  console.log(\`\${measure.name}: \${measure.duration.toFixed(3)}ms\`)
})

// 获取所有标记
const marks = performance.getEntriesByType('mark')
marks.forEach((mark) => {
  console.log(\`标记 \${mark.name}: \${mark.startTime.toFixed(3)}ms\`)
})

// 清除标记和测量
// performance.clearMarks('op1-start')
// performance.clearMeasures('操作1')
// performance.clearMarks()  // 清除所有

// ───────── PerformanceObserver ─────────
// 监听性能事件

// const obs = new PerformanceObserver((list, observer) => {
//   const entries = list.getEntries()
//   entries.forEach((entry) => {
//     console.log(\`[\${entry.entryType}] \${entry.name}: \${entry.duration}ms\`)
//   })
// })
//
// obs.observe({ entryTypes: ['measure', 'mark', 'function'] })

// ───────── 函数性能分析示例 ─────────

function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// 手动测量
function measureAsync(fn, ...args) {
  return new Promise((resolve) => {
    const start = performance.now()
    const result = fn(...args)
    const end = performance.now()
    console.log(\`\${fn.name} 耗时: \${end - start}ms\`)
    resolve(result)
  })
}

// measureAsync(fibonacci, 30).then((result) => {
//   console.log('斐波那契结果:', result)
// })

// ───────── 内存使用监控 ─────────

// 注意：这是 V8 的堆统计，不是完整的 RSS
const mem = performance.memory
if (mem) {
  console.log('堆内存:', {
    used: Math.round(mem.usedJSHeapSize / 1024 / 1024) + 'MB',
    total: Math.round(mem.totalJSHeapSize / 1024 / 1024) + 'MB',
    limit: Math.round(mem.jsHeapSizeLimit / 1024 / 1024) + 'MB'
  })
}

// 更完整的内存信息用 process.memoryUsage()
import process from 'node:process'
const memUsage = process.memoryUsage()
console.log('进程内存:', {
  rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
  heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
  heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
  external: Math.round(memUsage.external / 1024 / 1024) + 'MB'
})

// ───────── 事件循环延迟测量 ─────────

function measureEventLoopDelay(duration = 1000) {
  return new Promise((resolve) => {
    let maxDelay = 0
    let minDelay = Infinity
    let totalDelay = 0
    let count = 0
    let lastTime = performance.now()

    const interval = setInterval(() => {
      const now = performance.now()
      const delay = now - lastTime - 10 // 预期 10ms
      if (delay > maxDelay) maxDelay = delay
      if (delay < minDelay) minDelay = delay
      totalDelay += delay
      count++
      lastTime = now
    }, 10)

    setTimeout(() => {
      clearInterval(interval)
      resolve({
        maxDelay: maxDelay.toFixed(2) + 'ms',
        minDelay: minDelay.toFixed(2) + 'ms',
        avgDelay: (totalDelay / count).toFixed(2) + 'ms',
        samples: count
      })
    }, duration)
  })
}

// 使用
// measureEventLoopDelay(2000).then((stats) => {
//   console.log('事件循环延迟:', stats)
// })

// ───────── 实际应用场景 ─────────

// 1. 基准测试函数
function benchmark(name, fn, iterations = 1000) {
  // 预热
  for (let i = 0; i < 10; i++) fn()

  // 正式测量
  performance.mark('bench-start')
  for (let i = 0; i < iterations; i++) {
    fn()
  }
  performance.mark('bench-end')
  performance.measure(name, 'bench-start', 'bench-end')

  const measure = performance.getEntriesByName(name)[0]
  const avgOp = measure.duration / iterations * 1000 // 微秒/次

  console.log(\`\${name}:\`)
  console.log(\`  总耗时: \${measure.duration.toFixed(2)}ms\`)
  console.log(\`  单次: \${avgOp.toFixed(3)}μs\`)
  console.log(\`  每秒: \${Math.round(iterations / measure.duration * 1000)} 次\`)
  console.log()
}

// 对比不同数组映射方式
// benchmark('for 循环', () => {
//   const arr = [1, 2, 3, 4, 5]
//   const result = []
//   for (let i = 0; i < arr.length; i++) {
//     result.push(arr[i] * 2)
//   }
//   return result
// })
//
// benchmark('Array.map', () => {
//   const arr = [1, 2, 3, 4, 5]
//   return arr.map(x => x * 2)
// })

// ───────── Node.js 内置分析工具 ─────────

// 1. --prof 生成 V8 分析日志
// node --prof app.js
// 然后用 --prof-process 处理
// node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt

// 2. --inspect 内置调试器
// node --inspect app.js
// 在 Chrome 打开 chrome://inspect

// 3. clinic.js（第三方工具）
// npm install -g clinic
// clinic doctor -- node app.js

// 4. 0x（火焰图生成）
// npm install -g 0x
// 0x app.js

// ───────── 性能优化思路 ─────────
// 1. 先测量，再优化（不要过早优化）
// 2. 找到瓶颈，针对性优化
// 3. 优化前后都要测量对比
// 4. 注意不要只看单次执行时间，要看平均值
// 5. 考虑内存使用，不要只看速度
// 6. 微优化通常不值得，优先优化算法和架构
// 7. 异步 I/O 是 Node.js 的强项，充分利用
// 8. CPU 密集任务用 Worker Threads

// ───────── 最佳实践 ─────────
// 用 performance.now() 做高精度计时
// 用 mark/measure 标记关键阶段
// 用 PerformanceObserver 收集性能数据
// 基准测试要预热，避免冷启动影响
// 多次测量取平均值，减少误差
// 生产环境抽样收集性能数据
// 关注 P95/P99 延迟，不要只看平均值
// 结合 CPU profile 和内存快照分析
`;export{n as default};
