// ═══════════════════════════════════════════
// 1. 高阶函数：接收或返回函数
// ═══════════════════════════════════════════

const double = (n) => n * 2
const mapWith = (fn) => (arr) => arr.map(fn)
mapWith(double)([1, 2, 3])    // [2, 4, 6]  ← 接收函数，又返回函数
[1, 2, 3].map(double)         // [2, 4, 6]  ← map 本身也是高阶函数

// ═══════════════════════════════════════════
// 2. 纯函数与副作用
// ═══════════════════════════════════════════

const withTax = (price) => price * 1.06
withTax(100)                  // 106  ← 相同输入永远相同输出（纯函数）

let total = 0
const addImpure = (n) => { total += n }   // 改动了外部变量（有副作用）

// ═══════════════════════════════════════════
// 3. 柯里化与偏函数
// ═══════════════════════════════════════════

const applyDiscount = (rate) => (price) => price * (1 - rate)
const memberPrice = applyDiscount(0.2)     // 固定 rate，得到专用函数
memberPrice(200)              // 160
memberPrice(300)              // 240

const addTax = (rate, price) => price * (1 + rate)
const addVat = addTax.bind(null, 0.06)     // 偏函数：预填第一个参数
addVat(200)                   // 212

// ═══════════════════════════════════════════
// 4. pipe 与 compose
// ═══════════════════════════════════════════

const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x)
const compose = (...fns) => (x) => fns.reduceRight((v, fn) => fn(v), x)
const format = (p) => `¥${p.toFixed(2)}`

pipe(applyDiscount(0.2), addVat, format)(200)      // '¥169.60'  ← 从左到右
compose(format, addVat, applyDiscount(0.2))(200)   // '¥169.60'  ← 从右到左

// ═══════════════════════════════════════════
// 5. 用闭包记住状态
// ═══════════════════════════════════════════

function once(fn) {
  let called = false
  let result
  return (...args) => {
    if (!called) { called = true; result = fn(...args) }
    return result
  }
}
const init = once(() => '初始化完成')
init()                        // '初始化完成'
init()                        // '初始化完成'  ← 第二次直接返回缓存，不再执行

function memoize(fn) {
  const cache = new Map()
  return (key) => {
    if (!cache.has(key)) cache.set(key, fn(key))
    return cache.get(key)
  }
}
const square = memoize((n) => n * n)
square(5)                     // 25
square(5)                     // 25  ← 命中缓存，未重新计算

// 防抖：停止触发后只执行最后这一次（适合搜索输入）
function debounce(fn, wait) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

// 节流：固定间隔内至多执行一次（适合滚动、拖拽）
function throttle(fn, gap) {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= gap) { last = now; fn(...args) }
  }
}
