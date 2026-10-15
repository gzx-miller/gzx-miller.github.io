// ═══════════════════════════════════════════
// 1. 词法作用域与作用域链
// ═══════════════════════════════════════════

const site = '小松鼠举栗子'
function outer() {
  const topic = 'Vue3'
  return function inner() {
    return `${site} · ${topic}`    // 先找 topic，再往上找 site
  }
}
outer()()              // '小松鼠举栗子 · Vue3'

const label = 'global'
function show() { return label }
function run() {
  const label = 'local'
  return show()        // 'global'  ← 看函数定义在哪，不看调用在哪
}
run()                  // 'global'

// ═══════════════════════════════════════════
// 2. 闭包的形成：内部函数带走词法环境
// ═══════════════════════════════════════════

function createCounter() {
  let count = 0
  return () => ++count
}
const next = createCounter()
next()                 // 1
next()                 // 2   ← 外层已返回，内部仍能读写 count

const another = createCounter()
another()              // 1   ← 每次调用工厂都得到独立的环境

// ═══════════════════════════════════════════
// 3. 用闭包封装私有状态
// ═══════════════════════════════════════════

function createCart() {
  const items = []
  return {
    add: (item) => items.push(item),
    count: () => items.length,
  }
}
const cart = createCart()
cart.add('栗子')
cart.add('枫叶')
cart.count()           // 2
typeof cart.items      // 'undefined'  ← 数据藏在闭包里，只能走暴露的接口

// ═══════════════════════════════════════════
// 4. 循环里的 var 与 let
// ═══════════════════════════════════════════

for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i)) }
// 3, 3, 3   ← var 只有一个 i，回调执行时循环已结束

for (let j = 0; j < 3; j++) { setTimeout(() => console.log(j)) }
// 0, 1, 2   ← let 每轮迭代生成新的绑定

// 旧写法：用 IIFE 为每一轮制造独立作用域
for (var k = 0; k < 3; k++) {
  (function (n) { setTimeout(() => console.log(n)) })(k)
}
// 0, 1, 2

// ═══════════════════════════════════════════
// 5. 闭包会留住内存
// ═══════════════════════════════════════════

function attach() {
  const bigData = new Array(1e6).fill('栗子')
  return () => bigData.length      // 闭包一直引用 bigData，无法回收
}
let len = attach()

// 不再需要时解除引用，让整个词法环境可被回收
len = null

// 只捕获真正需要的字段，而不是整个大对象
function pickId(user) {
  const id = user.id               // 只留住 id
  return () => id
}

// ═══════════════════════════════════════════
// 6. 闭包工厂与模块模式
// ═══════════════════════════════════════════

function createStore(initial) {
  let state = { ...initial }
  return {
    get: (key) => state[key],
    set: (key, value) => { state = { ...state, [key]: value } },
  }
}
const store = createStore({ theme: '暖光' })
store.set('theme', '枫红')
store.get('theme')     // '枫红'  ← 外部无法直接改 state，只能通过 get/set
