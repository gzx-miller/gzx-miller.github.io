const n=`// ═══════════════════════════════════════════
// 1. 未声明就赋值造成隐式全局变量
// ═══════════════════════════════════════════

function sloppy() {
  leaked = 1              // 非严格模式：在全局悄悄建了变量 leaked
}
sloppy()
typeof leaked             // 结果：'number' —— 变量从函数里漏到了全局
// 严格模式下同样的赋值会抛 ReferenceError

// ═══════════════════════════════════════════
// 2. var 是函数作用域，let 是块作用域
// ═══════════════════════════════════════════

function scopeDemo() {
  if (true) {
    var fromVar = 'a'
    let fromLet = 'b'
  }
  return typeof fromVar           // 结果：'string' —— var 泄漏到了块外
  // typeof fromLet              // 结果：'undefined' —— let 出了块就没了
}
scopeDemo()

// ═══════════════════════════════════════════
// 3. 声明提升
// ═══════════════════════════════════════════

typeof hoistedVar        // 结果：'undefined' —— 只提升了名字，没有提升值
var hoistedVar = 42
hoistedVar               // 结果：42

typeof hoistedLet        // 结果：抛 ReferenceError —— 落在暂时性死区
let hoistedLet = 1

// ═══════════════════════════════════════════
// 4. 重复声明与重复赋值
// ═══════════════════════════════════════════

var twice = 1
var twice = 2            // var 允许重复声明，静默覆盖
twice                    // 结果：2
// let once = 1
// let once = 2          // 报错：let 在同一作用域内不能重复声明

let mutable = 1
mutable = 2              // let 可以重新赋值：结果 2
const fixed = 1
// fixed = 2             // 报错：const 不能重新赋值

// ═══════════════════════════════════════════
// 5. const 只锁绑定，不冻结内容
// ═══════════════════════════════════════════

const config = { theme: 'autumn' }
config.theme = 'maple'   // 合法：改的是对象内容，不是绑定
config.theme             // 结果：'maple'
// config = {}           // 报错：不能把 const 绑定指向新对象
Object.freeze(config)
config.theme = 'winter'  // 静默失败（严格模式下抛 TypeError）
config.theme             // 结果：'maple' —— freeze 之后内容也锁住了

// ═══════════════════════════════════════════
// 6. for 循环里 let 的每轮独立绑定
// ═══════════════════════════════════════════

const handlers = []
for (let i = 0; i < 3; i++) {
  handlers.push(() => i)         // 每一轮各有一份 i
}
handlers.map((fn) => fn())       // 结果：[0, 1, 2]

const handlersVar = []
for (var j = 0; j < 3; j++) {
  handlersVar.push(() => j)      // 所有回调共享同一个 j
}
handlersVar.map((fn) => fn())    // 结果：[3, 3, 3]
`;export{n as default};
