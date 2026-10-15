// ═══════════════════════════════════════════
// 1. Map：任意类型键与插入顺序
// ═══════════════════════════════════════════

const map = new Map()
map.set('a', 1)
map.set(2, 'two')          // 数字键不会被字符串化
const objKey = {}
map.set(objKey, 'object-key')   // 对象也能当键
map.get(2)                 // 'two'
map.get('2')               // undefined  ← 数字键 2 与字符串键 '2' 不同
map.get(objKey)            // 'object-key' ← 同一引用才命中
map.size                   // 3
map.has('a')               // true
map.has('missing')         // false
const mapKeys = [...map.keys()]   // ['a', 2, objKey] ← 保持插入顺序

// ═══════════════════════════════════════════
// 2. Set：保证值唯一
// ═══════════════════════════════════════════

const tags = new Set(['Vue', 'Vue', 'React'])
tags.size                  // 2   ← 重复值被忽略
tags.has('Vue')            // true
const tagList = [...tags]  // ['Vue', 'React'] ← 保持插入顺序
const deduped = [...new Set([1, 2, 2, 3, 3])]   // [1, 2, 3] ← 数组去重的常用写法
new Set([NaN, NaN]).size   // 1   ← SameValueZero，NaN 也只留一个

// ═══════════════════════════════════════════
// 3. WeakMap：给对象挂私有元数据
// ═══════════════════════════════════════════

const meta = new WeakMap()
const node = {}            // 这里代表一个 DOM 节点或组件实例
meta.set(node, { clicks: 0 })
meta.get(node)             // { clicks: 0 }
meta.has(node)             // true
const found = meta.get(node)
found.clicks += 1
meta.get(node).clicks      // 1
// WeakMap 没有 size，也无法遍历 keys/values/entries
// 当 node 失去其他强引用后会被回收，对应条目自动消失，不阻止 GC

// ═══════════════════════════════════════════
// 4. 可迭代协议：Symbol.iterator 与 next()
// ═══════════════════════════════════════════

function makeRange(from, to) {
  let current = from
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return current <= to
            ? { value: current++, done: false }
            : { value: undefined, done: true }
        },
      }
    },
  }
}
const rangeIterator = makeRange(1, 3)[Symbol.iterator]()
rangeIterator.next()       // { value: 1, done: false }
rangeIterator.next()       // { value: 2, done: false }
rangeIterator.next()       // { value: 3, done: false }
rangeIterator.next()       // { value: undefined, done: true }
const oneToThree = [...makeRange(1, 3)]   // [1, 2, 3] ← 展开语法消费迭代器
Array.from(makeRange(1, 3))               // [1, 2, 3]

// ═══════════════════════════════════════════
// 5. 生成器：yield 暂停与 next(value) 回传
// ═══════════════════════════════════════════

function* talk() {
  const received = yield 'first'   // next(值) 会回传给这里
  yield received
  yield 'last'
}
const gen = talk()
gen.next()                 // { value: 'first', done: false }
gen.next(99)               // { value: 99, done: false } ← 回传给 received
gen.next()                 // { value: 'last', done: false }
gen.next()                 // { value: undefined, done: true }

function* step(items) {
  for (const item of items) yield item
}
const stepped = [...step(['a', 'b'])]   // ['a', 'b'] ← 惰性逐个产出

// ═══════════════════════════════════════════
// 6. yield* 委托给其他可迭代对象
// ═══════════════════════════════════════════

function* inner() { yield 1; yield 2 }
function* outer() { yield 0; yield* inner(); yield 3 }
const delegated = [...outer()]   // [0, 1, 2, 3] ← yield* 转发 inner 的产出

// ═══════════════════════════════════════════
// 7. for...of / 展开 / 解构都依赖迭代协议
// ═══════════════════════════════════════════

const [firstChar] = 'abc'           // 'a'  ← 字符串解构
const [head, ...rest] = [1, 2, 3]   // head 为 1，rest 为 [2, 3]
const chars = [...'abc']            // ['a', 'b', 'c'] ← 展开字符串
Math.max(...[1, 7, 3])              // 7   ← 展开数组
const entries = new Map([['a', 1], ['b', 2]])
const entryList = [...entries]      // [['a', 1], ['b', 2]] ← Map 本身可迭代
const entryKeys = [...entries.keys()]   // ['a', 'b']
Object.fromEntries(entries)         // { a: 1, b: 2 }
