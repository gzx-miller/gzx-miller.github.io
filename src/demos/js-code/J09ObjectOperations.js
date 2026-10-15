// ═══════════════════════════════════════════
// 1. 字面量、属性简写与取值
// ═══════════════════════════════════════════

const name = '小栗'
const role = '前端'
const key = 'city'
const user = { name, role, [key]: '杭州' }   // 简写 + 计算属性名
user            // { name: '小栗', role: '前端', city: '杭州' }

user.name       // '小栗'
const field = 'role'
user[field]     // '前端'      ← 动态键用方括号
user.field      // undefined  ← 点访问取的是叫 field 的属性

// ═══════════════════════════════════════════
// 2. Object.keys / values / entries
// ═══════════════════════════════════════════

const profile = { name: '小栗', age: 3 }
Object.keys(profile)     // ['name', 'age']
Object.values(profile)   // ['小栗', 3]
Object.entries(profile)  // [['name', '小栗'], ['age', 3]]

for (const [k, v] of Object.entries(profile)) { /* 只遍历自身可枚举属性 */ }

// ═══════════════════════════════════════════
// 3. 解构：默认值、重命名、嵌套
// ═══════════════════════════════════════════

const { name: userName } = user            // 重命名
userName                                   // '小栗'

const { city = '未知' } = user             // 默认值：键缺失或为 undefined 时生效
city                                       // '杭州'

const order = { owner: { name: '松松' } }
const { owner: { name: ownerName } } = order   // 嵌套解构
ownerName                                  // '松松'

// ═══════════════════════════════════════════
// 4. 剩余与展开语法
// ═══════════════════════════════════════════

const { name: n, ...rest } = { name: '小栗', age: 3, city: '杭州' }
rest            // { age: 3, city: '杭州' }  ← 剩余收集其余属性

const merged = { ...rest, city: '上海' }   // 同名键后者覆盖前者
merged.city     // '上海'

// ═══════════════════════════════════════════
// 5. 浅拷贝与逐层展开
// ═══════════════════════════════════════════

const original = { name: '小栗', address: { city: '杭州' } }
const draft = { ...original }              // 浅拷贝：只复制第一层
draft.name = '松松'
original.name                // '小栗'    ← 第一层是独立副本

draft.address.city = '上海'
original.address.city        // '上海'    ← 嵌套对象仍是同一引用！

// 逐层展开：只重建要改动的那条路径
const next = { ...original, address: { ...original.address, city: '北京' } }
next.address.city            // '北京'
original.address.city        // '上海'    ← 原对象未被改动

// ═══════════════════════════════════════════
// 6. 可选链与空值合并
// ═══════════════════════════════════════════

const person = { name: '小栗' }
person.address                   // undefined
person.address?.city             // undefined  ← 链在 undefined 处短路，不报错
person.address?.city ?? '未设置'  // '未设置'

const settings = { volume: 0 }
settings.volume || 50            // 50  ← || 把 0 也当成空值
settings.volume ?? 50            // 0   ← ?? 只在 null / undefined 时取默认值
