// ========== Symbol 基础 ==========
// 每个 Symbol 都是唯一的，用作对象属性的"私有键"
const id = Symbol('课程ID')
const course = { [id]: 1001, name: 'Vue3 进阶' }
console.log(course[id])           // 1001
console.log(Object.keys(course))  // ['name']（Symbol 属性不被枚举）

// ========== Symbol.for：全局注册表 ==========
const s1 = Symbol.for('app.config')
const s2 = Symbol.for('app.config')
console.log(s1 === s2)                    // true（共享同一实例）
console.log(Symbol.keyFor(s1))            // 'app.config'

// ========== Symbol.iterator：自定义可迭代对象 ==========
const courseList = {
  items: ['JavaScript', 'Vue3', 'Node.js'],
  [Symbol.iterator]() {
    let i = 0
    return {
      next: () => i < this.items.length
        ? { value: this.items[i++], done: false }
        : { value: undefined, done: true },
    }
  },
}

// 现在可以用 for...of 和展开运算符
for (const name of courseList) console.log(name)
console.log([...courseList])  // ['JavaScript', 'Vue3', 'Node.js']

// ========== Symbol.toPrimitive：自定义类型转换 ==========
const price = {
  value: 299,
  [Symbol.toPrimitive](hint) {
    // hint: 'number' | 'string' | 'default'
    if (hint === 'number') return this.value
    if (hint === 'string') return `¥${this.value}`
    return this.value  // default（如 +price）
  },
}
console.log(+price)          // 299
console.log(`${price}`)      // '¥299'

// ========== Symbol.hasInstance：自定义 instanceof ==========
class Course {
  static [Symbol.hasInstance](obj) {
    return 'title' in obj && 'price' in obj
  }
}
console.log({ title: 'Vue', price: 0 } instanceof Course)  // true

// ========== Symbol.toStringTag ==========
const myObj = { [Symbol.toStringTag]: 'CourseData' }
console.log(Object.prototype.toString.call(myObj))  // '[object CourseData]'

// ========== 常用内置符号一览 ==========
// Symbol.iterator      — 定义迭代行为（for...of）
// Symbol.toPrimitive   — 定义类型转换
// Symbol.hasInstance   — 自定义 instanceof
// Symbol.toStringTag   — 自定义 toString 标签
// Symbol.asyncIterator — 异步迭代（for await...of）
// Symbol.match/replace/search/split — 自定义正则行为
