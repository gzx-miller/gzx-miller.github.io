const n=`// 可选链、空值合并与逻辑赋值

// ── 可选链 ?. — 安全访问深层属性 ──
const user = { name: '小松鼠', profile: { bio: '爱收集栗子' } }
// 没有 address，传统写法会报 TypeError
console.log(user.address?.city)         // undefined（不报错）
console.log(user.profile?.bio)          // '爱收集栗子'
console.log(user.profile?.avatar?.url)  // undefined

// 可选索引访问
const list = null
console.log(list?.[0])   // undefined
console.log(list?.length) // undefined

// 可选函数调用
const callbacks = { onSuccess: () => '成功' }
console.log(callbacks.onSuccess?.())  // '成功'
console.log(callbacks.onError?.())    // undefined（不存在也不报错）

// ── 空值合并 ?? — 仅 null / undefined 时取默认值 ──
console.log(null ?? '默认值')       // '默认值'
console.log(undefined ?? '默认值')  // '默认值'
console.log(0 ?? 42)               // 0（0 不是空值）
console.log('' ?? '占位')          // ''（空串不是空值）

// ── ?? vs || 对比 ──
console.log(0 || '回退')   // '回退'（0 是 falsy）
console.log(0 ?? '回退')   // 0（?? 只看 null/undefined）
console.log('' || '回退')  // '回退'
console.log('' ?? '回退')  // ''

// ── 逻辑赋值（ES2021） ──
const config = {}
config.title ||= '默认标题'    // title 为 falsy 时赋值
config.theme ??= '秋日暖色'    // theme 为 null/undefined 时赋值
config.count &&= 10            // count 为 truthy 时才赋值（此时 count 不存在，不执行）
console.log(config) // { title: '默认标题', theme: '秋日暖色' }

// ── 短路求值 ──
const name = user.nickname ?? user.name ?? '匿名用户'
console.log(name) // '小松鼠'（nickname 为 undefined，取 name）
`;export{n as default};
