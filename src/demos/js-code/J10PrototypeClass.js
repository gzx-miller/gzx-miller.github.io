// ═══════════════════════════════════════════
// 1. prototype 与实例共享
// ═══════════════════════════════════════════

function Course(title) { this.title = title }
Course.prototype.summary = function () { return `课程：${this.title}` }

const a = new Course('异步')
const b = new Course('闭包')
a.summary()                       // '课程：异步'
b.summary()                       // '课程：闭包'
a.summary === b.summary           // true  ← 共享 prototype 上的同一个函数
Object.hasOwn(a, 'summary')       // false ← summary 不在实例自身

// ═══════════════════════════════════════════
// 2. 原型链查找与属性遮蔽
// ═══════════════════════════════════════════

const parent = { type: '课程' }
const child = Object.create(parent)
child.type                        // '课程'  ← 自身没有，顺着原型链找到
child.type = '直播课'              // 在自身挂上同名属性
child.type                        // '直播课' ← 自身属性遮蔽了原型上的
parent.type                       // '课程'  ← 原型未受影响
Object.getPrototypeOf(child) === parent   // true

// ═══════════════════════════════════════════
// 3. new 的四步
// ═══════════════════════════════════════════

function Point(x, y) {
  // 1 创建空对象；2 原型指向 Point.prototype；
  // 3 this = 新对象并执行函数体；4 无显式返回对象则返回该对象
  this.x = x
  this.y = y
}
const p = new Point(1, 2)         // Point { x: 1, y: 2 }

// ═══════════════════════════════════════════
// 4. 构造函数与 instanceof
// ═══════════════════════════════════════════

p instanceof Point                 // true  ← Point.prototype 在 p 的原型链上
p instanceof Object                // true  ← 原型链最终到达 Object.prototype
Object.getPrototypeOf(p) === Point.prototype   // true

// 构造函数显式返回对象时，new 会改用这个返回值
function Weird() { return { tag: '自定义' } }
new Weird()                        // { tag: '自定义' }

// ═══════════════════════════════════════════
// 5. class 与继承
// ═══════════════════════════════════════════

class LiveCourse {
  constructor(title) { this.title = title }
  summary() { return `课程：${this.title}` }   // 自动放到 prototype 上
  static create(title) { return new LiveCourse(title) }  // static 挂在类本身
}

class RoomCourse extends LiveCourse {
  constructor(title, room) {
    super(title)                   // 必须先调用父类构造，才能用 this
    this.room = room
  }
  summary() { return `直播 ${super.summary()}` }   // super 复用父类方法
}

const live = new RoomCourse('异步', 'A101')
live.summary()                     // '直播 课程：异步'
live instanceof LiveCourse         // true  ← extends 建立了原型链
LiveCourse.create('闭包').summary() // '课程：闭包'

// ═══════════════════════════════════════════
// 6. 私有字段与访问器
// ═══════════════════════════════════════════

class Wallet {
  #balance = 0                     // 私有字段，类外不可访问
  constructor(initial) { this.#balance = initial }
  get balance() { return this.#balance }
  set balance(value) {
    if (value < 0) throw new Error('余额不能为负')
    this.#balance = value
  }
  deposit(amount) { this.#balance += amount }
}
const w = new Wallet(100)
w.deposit(50)
w.balance          // 150  ← getter 读出私有字段
w.balance = -1     // 抛错：余额不能为负  ← setter 拦截
// w.#balance      // 报错：私有字段类外无法访问

// ═══════════════════════════════════════════
// 7. Object.create 与组合优先
// ═══════════════════════════════════════════

const canSwim = { swim() { return 'swim' } }
const canFly = { fly() { return 'fly' } }

const duck = Object.assign(Object.create(null), canSwim, canFly)
duck.swim()                        // 'swim'  ← 按需组合能力，而非层层继承
duck.fly()                         // 'fly'
Object.getPrototypeOf(duck)        // null    ← 也可以不挂任何原型
