// 解构、剩余属性与展开语法
const profile = { name: '小栗', city: '杭州', role: '前端开发' }

// 解构提取字段，...rest 收集剩余属性
const { name, ...details } = profile

// 展开语法创建新对象，覆盖或追加字段
const card = { displayName: name.toUpperCase(), ...details }

console.log(card)
// { displayName: '小栗', city: '杭州', role: '前端开发' }

// 注意：展开是浅拷贝，嵌套对象仍共享引用
