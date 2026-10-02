const n=`// ========== 高阶函数 ==========
// 高阶函数：接收函数作为参数，或返回函数
const courses = [
  { name: 'Vue3 入门', price: 199, students: 1200 },
  { name: 'Node 实战', price: 299, students: 800 },
  { name: 'TypeScript', price: 149, students: 2000 },
]

// map / filter / reduce 本身就是高阶函数
const names = courses.map((c) => c.name)           // ['Vue3 入门', 'Node 实战', 'TypeScript']
const popular = courses.filter((c) => c.students > 1000)
const total = courses.reduce((sum, c) => sum + c.price, 0) // 647

// ========== 柯里化 ==========
// 将多参数函数转换为单参数链
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args)
    return (...more) => curried(...args, ...more)
  }
}

const add = (a, b, c) => a + b + c
const curriedAdd = curry(add)
console.log(curriedAdd(1)(2)(3))  // 6
console.log(curriedAdd(1, 2)(3))  // 6

// ========== 偏函数 ==========
// 固定部分参数，生成新函数
const multiply = (a, b) => a * b
const double = multiply.bind(null, 2)
console.log(double(5))  // 10

// ========== 函数组合 ==========
// pipe：从左到右执行；compose：从右到左执行
const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x)
const compose = (...fns) => (x) => fns.reduceRight((v, fn) => fn(v), x)

const discount = (p) => p * 0.8
const tax = (p) => p * 1.06
const format = (p) => \`¥\${p.toFixed(2)}\`

console.log(pipe(discount, tax, format)(200))  // '¥169.60'

// ========== 防抖与节流 ==========
function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

function throttle(fn, interval) {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= interval) { last = now; fn(...args) }
  }
}
`;export{n as default};
