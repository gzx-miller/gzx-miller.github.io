// 闭包：内部函数持续访问外部词法作用域中的变量
function createCartCounter(initial = 0) {
  let count = initial
  return () => ++count
}

const nextCount = createCartCounter()
console.log(nextCount())  // 1
console.log(nextCount())  // 2
console.log(nextCount())  // 3

// 每次调用 createCartCounter 都创建独立的词法环境
const another = createCartCounter(10)
console.log(another())    // 11
