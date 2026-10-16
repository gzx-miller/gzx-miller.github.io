const n=`// ═══════════════════════════════════════════
// 1. 就地增删改：会改掉原数组
// ═══════════════════════════════════════════

const cart = [10, 20, 30]
cart.push(40)        // 返回新长度 4，cart 变成 [10, 20, 30, 40]
cart.pop()           // 返回 40，cart 变回 [10, 20, 30]
cart.unshift(5)      // 返回 4，cart 变成 [5, 10, 20, 30]
cart.shift()         // 返回 5，cart 回到 [10, 20, 30]
cart.splice(1, 1)    // 返回删除的 [20]，cart 变成 [10, 30]

// ═══════════════════════════════════════════
// 2. 非破坏版本：原数组保持不变
// ═══════════════════════════════════════════

const base = [10, 20, 30]
base.toSpliced(1, 1)            // [10, 30]         ← base 仍是 [10, 20, 30]
base.with(0, 99)                // [99, 20, 30]     ← base 未变
base.toSorted((a, b) => b - a)  // [30, 20, 10]     ← base 顺序未变
base.toReversed()               // [30, 20, 10]     ← base 未变
const appended = [...base, 40]  // [10, 20, 30, 40] ← 展开复制后再追加

// ═══════════════════════════════════════════
// 3. sort 就地修改 vs toSorted 返回新数组
// ═══════════════════════════════════════════

const scores = [4.6, 4.9, 4.8]
const sortedInPlace = scores.sort((a, b) => b - a)  // 返回 [4.9, 4.8, 4.6]
scores                // [4.9, 4.8, 4.6]  ← sort 把原数组也改了

const fresh = [4.6, 4.9, 4.8]
const sortedCopy = fresh.toSorted((a, b) => b - a)   // 返回 [4.9, 4.8, 4.6]
fresh                 // [4.6, 4.9, 4.8]  ← toSorted 原数组不动

// ═══════════════════════════════════════════
// 4. 只读检索：不改数组，只回答问题
// ═══════════════════════════════════════════

const withNaN = [1, 2, NaN]
withNaN.includes(NaN)                      // true   ← SameValueZero 能识别 NaN
const objItems = [{ id: 2 }]
objItems.includes({ id: 2 })               // false  ← 引用不同，比较的是引用
const nums = [3, 7, 9]
nums.find((n) => n > 5)                    // 7      ← 返回第一个命中的元素
nums.findIndex((n) => n > 5)               // 1      ← 返回它的下标
nums.some((n) => n > 8)                    // true   ← 有一个满足即可，命中即停
nums.every((n) => n > 0)                   // true   ← 全部都满足才为 true
nums.every((n) => n > 5)                   // false  ← 有一个不满足即停

// ═══════════════════════════════════════════
// 5. 转换方法：返回新数组
// ═══════════════════════════════════════════

const seq = [1, 2, 3]
seq.map((n) => n * 2)                      // [2, 4, 6]
const toFilter = [1, 2, 3, 4]
toFilter.filter((n) => n % 2 === 0)        // [2, 4]
const toSum = [1, 2, 3]
toSum.reduce((sum, n) => sum + n, 0)       // 6
const nested = [1, [2, [3]]]
nested.flat()                              // [1, 2, [3]]  ← 默认只拍一层
nested.flat(2)                             // [1, 2, 3]    ← 指定深度拍到两层
const groups = ['a b', 'c']
groups.flatMap((s) => s.split(' '))        // ['a', 'b', 'c'] ← 先映射再拍平

// ═══════════════════════════════════════════
// 6. forEach 只做副作用，不参与转换
// ═══════════════════════════════════════════

const log = []
const sideEffects = [1, 2, 3]
sideEffects.forEach((n) => log.push(n * 10)) // 返回 undefined
log                                          // [10, 20, 30] ← 结果落在外部变量

// ═══════════════════════════════════════════
// 7. Array.from 与类数组、稀疏数组
// ═══════════════════════════════════════════

Array.from('abc')                              // ['a', 'b', 'c']
Array.from({ length: 3 })                      // [undefined, undefined, undefined]
Array.from({ length: 3 }, (_, i) => i + 1)     // [1, 2, 3]  ← 第二个参数做映射

const sparse = [1, , 3]
sparse.length                                  // 3   ← 中间有一个空槽
sparse.map((n) => n * 2)                       // [2, empty, 6] ← map 跳过空槽
sparse.forEach((n) => n)                       // 只执行 2 次，空槽被跳过
Array.from(sparse)                             // [1, undefined, 3] ← 空槽补成 undefined

// ═══════════════════════════════════════════
// 8. 流水线：每一步都基于新数组，原数组不动
// ═══════════════════════════════════════════

const courses = [
  { title: 'JavaScript 基础', score: 4.8 },
  { title: 'Node.js 服务', score: 4.6 },
  { title: 'Vue 组件设计', score: 4.9 },
]
const keyword = 's'
const picked = courses
  .filter((course) => course.title.includes(keyword))
  .toSorted((a, b) => b.score - a.score)
  .map((course) => \`\${course.title} · \${course.score}\`)
picked          // ['Vue 组件设计 · 4.9', 'JavaScript 基础 · 4.8'] ← 按评分排序后的结果
courses.length  // 3   ← 原数组始终没被改动
`;export{n as default};
