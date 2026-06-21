// ========== Object.defineProperty ==========
const course = {}

// 数据描述符：直接定义值和行为
Object.defineProperty(course, 'name', {
  value: 'Vue3 进阶',
  writable: false,       // 不可修改
  enumerable: true,      // 可被枚举（for...in / Object.keys）
  configurable: false,   // 不可删除或重新定义
})

// 存取描述符：getter / setter
let _price = 299
Object.defineProperty(course, 'price', {
  get() { return `¥${_price}` },
  set(v) { _price = Math.max(0, v) },
  enumerable: true,
})

course.price = -50
console.log(course.price)  // '¥0'（setter 拦截了负数）

// ========== 对象锁定三兄弟 ==========
const config = { title: '课程', maxStudents: 50, active: true }

// Object.preventExtensions：禁止添加新属性
Object.preventExtensions(config)
config.newProp = 'test'
console.log(config.newProp)  // undefined

// Object.seal：禁止增删属性，现有属性变为不可配置
const sealed = Object.seal({ a: 1, b: 2 })
sealed.c = 3; delete sealed.a
console.log(Object.keys(sealed))  // ['a', 'b']

// Object.freeze：seal + 所有属性 writable: false
const frozen = Object.freeze({ x: 10, y: 20 })
frozen.x = 99
console.log(frozen.x)  // 10（静默失败，严格模式下报错）

// ========== 常用对象方法 ==========
const obj = { name: 'Vue', price: 299, students: 1200 }

console.log(Object.keys(obj))     // ['name', 'price', 'students']
console.log(Object.values(obj))   // ['Vue', 299, 1200]
console.log(Object.entries(obj))  // [['name','Vue'], ['price',299], ...]

// Object.fromEntries：entries 的逆操作
const map = new Map([['name', 'Node'], ['price', 199]])
console.log(Object.fromEntries(map))  // { name: 'Node', price: 199 }

// ========== 属性描述符获取 ==========
const desc = Object.getOwnPropertyDescriptor(course, 'name')
console.log(desc)  // { value: 'Vue3 进阶', writable: false, enumerable: true, configurable: false }
