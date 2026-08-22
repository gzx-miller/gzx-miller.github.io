// 导入回调：同一份 counter 二进制，用不同 env.log 实现实例化两次
// 模块只声明依赖的导入函数与签名，不关心实现
const bytes = await fetch('counter.wasm').then((r) => r.arrayBuffer())

// 实例 A：注入"明细日志"回调
const a = await WebAssembly.instantiate(bytes, {
  env: { log: (v) => console.log(`明细：库存量 ${v}`) },
})
a.instance.exports.inc()
a.instance.exports.emit() // 触发 A 的回调

// 实例 B：注入"价格累计"回调
const b = await WebAssembly.instantiate(bytes, {
  env: { log: (v) => console.log(`累计：第 ${v} 件已入账`) },
})
b.instance.exports.inc()
b.instance.exports.emit() // 触发 B 的回调

// 两套实例互不影响：同一二进制 + 不同导入 = 可复用、可测试
