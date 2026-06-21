// ========== 短路运算 ==========
const user = { name: '小明', role: 'student' }

// || 返回第一个真值（常用于默认值）
const displayName = user.nickname || user.name  // '小明'

// && 返回第一个假值或最后一个真值
const greeting = user && user.name && `你好，${user.name}`

// ?? 空值合并：只在 null/undefined 时取右侧值（0、''、false 不会触发）
const count = 0
console.log(count || 10)  // 10（0 是假值）
console.log(count ?? 10)  // 0 （0 不是 null/undefined）

// ========== 逻辑赋值 ==========
const config = { theme: null }
config.theme ??= 'dark'     // 仅 null/undefined 时赋值
config.debug ||= false      // 仅假值时赋值
config.max &&= 100          // 仅真值时赋值

// ========== 三元表达式 ==========
const level = 85 >= 90 ? '优秀' : 85 >= 60 ? '及格' : '不及格'

// ========== 位运算基础 ==========
// AND (&)：两位都是1才为1
console.log(0b1100 & 0b1010)  // 0b1000 = 8

// OR (|)：有一位1就为1
console.log(0b1100 | 0b1010)  // 0b1110 = 14

// XOR (^)：不同为1
console.log(0b1100 ^ 0b1010)  // 0b0110 = 6

// NOT (~)：按位取反
console.log(~5)  // -6（~n = -(n+1)）

// ========== 位移运算 ==========
console.log(1 << 3)   // 8（左移3位 = ×8）
console.log(16 >> 2)  // 4（右移2位 = ÷4）
console.log(-1 >>> 0) // 4294967295（无符号右移）

// ========== 位运算权限模型 ==========
const READ  = 1 << 0  // 0b001 = 1
const WRITE = 1 << 1  // 0b010 = 2
const ADMIN = 1 << 2  // 0b100 = 4

let perm = 0
perm |= READ | WRITE   // 授予读写 → 0b011 = 3
console.log(perm & READ)   // 1（有读权限）
console.log(perm & ADMIN)  // 0（无管理权限）
perm ^= ADMIN            // 切换管理 → 0b111 = 7
perm &= ~WRITE           // 移除写 → 0b101 = 5

// ========== 逗号运算符 ==========
// 依次执行，返回最后一个表达式的值
let a = 0
const result = (a = 1, a + 2, a * 10)
console.log(result)  // 10
