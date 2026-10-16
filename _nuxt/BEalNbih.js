const n=`// ═══════════════════════════════════════════
// 1. 三种写法的提升差异
// ═══════════════════════════════════════════

hoisted()            // '声明在定义前也能调用'  ← 函数声明整体提升
function hoisted() { return '声明在定义前也能调用' }

const expr = function () { return 'ok' }
typeof expr          // 'function'

expr2()              // TypeError: expr2 is not a function  ← 只提升变量名，赋值不提升
const expr2 = function () {}

// ═══════════════════════════════════════════
// 2. 参数默认值与剩余参数
// ═══════════════════════════════════════════

function addToCart(item, count = 1) { return { item, count } }
addToCart('栗子').count        // 1     ← 缺省或传 undefined 时取默认值
addToCart('栗子', 0).count     // 0     ← 传 0 不会被默认值覆盖
addToCart('栗子', null).count  // null  ← 只有 undefined 才触发默认值

function sum(...nums) { return nums.reduce((a, b) => a + b, 0) }
sum(1, 2, 3)                   // 6     ← 剩余参数收成真数组，可用数组方法

function legacy() { return arguments.length }
legacy(1, 2, 3)                // 3     ← arguments 只是类数组，没有 forEach
// 箭头函数里根本没有 arguments，收集参数只能用 ...rest

// ═══════════════════════════════════════════
// 3. 返回值与隐式 undefined
// ═══════════════════════════════════════════

function noReturn() { const x = 1 }
noReturn()                     // undefined  ← 没写 return 就返回 undefined

function check(n) { if (n > 0) return '正数' }
check(1)                       // '正数'
check(-1)                      // undefined  ← 分支没命中，走到函数末尾

function broken() {
  return
  42                           // 这里的 42 永远不会被返回
}
broken()                       // undefined  ← return 后换行，自动分号截断

// ═══════════════════════════════════════════
// 4. this 的四种绑定
// ═══════════════════════════════════════════

const teacher = {
  name: '松松',
  introduce() { return \`讲师：\${this.name}\` },
}

teacher.introduce()                // '讲师：松松'      ← 隐式绑定：this = teacher
const detached = teacher.introduce
detached()                         // 严格/模块下 this = undefined  ← 默认绑定

detached.call({ name: '临时讲师' })   // '讲师：临时讲师'   ← 显式绑定压过默认绑定
detached.apply({ name: '客座讲师' })  // '讲师：客座讲师'
const bound = detached.bind({ name: '固定讲师' })
bound()                            // '讲师：固定讲师'   ← bind 返回永久绑定的副本

function Course(title) { this.title = title }
new Course('异步')                 // Course { title: '异步' }  ← new 绑定，优先级最高

// ═══════════════════════════════════════════
// 5. 箭头函数的词法 this
// ═══════════════════════════════════════════

const team = {
  name: '前端组',
  members: ['小栗', '松松'],
  list() {
    return this.members.map((m) => \`\${this.name}：\${m}\`)  // 箭头沿用 list 的 this
  },
}
team.list()                        // ['前端组：小栗', '前端组：松松']

function outer() { return () => this }
outer.call({ tag: 'A' })()         // { tag: 'A' }  ← call 作用在外层，箭头沿用外层 this

const arrowFn = () => this
arrowFn.call({ tag: 'B' })         // 仍是定义处的 this，call 对箭头无效

// 方法脱离对象后作为回调，this 会丢
const titles = [{ title: '闭包' }, { title: '原型' }]
titles.map((c) => c.title)         // ['闭包', '原型']  ← 用箭头包一层，仍是被 c. 调用
`;export{n as default};
