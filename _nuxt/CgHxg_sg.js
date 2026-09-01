const n=`// ========== JSON.stringify ==========
const course = {
  name: 'Node.js 实战',
  price: 299,
  date: new Date(2025, 8, 1),
  secret: '内部密钥',
  students: [{ id: 1, name: '小明' }],
}

// replacer 函数：控制序列化行为
const json = JSON.stringify(course, (key, value) => {
  if (key === 'secret') return undefined   // 过滤字段
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return value
}, 2)  // 缩进2空格

// replacer 数组：白名单模式
const filtered = JSON.stringify(course, ['name', 'price'])
// '{"name":"Node.js 实战","price":299}'

// ========== JSON.parse ==========
// reviver：还原时转换值
const restored = JSON.parse(json, (key, value) => {
  if (typeof value === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(value)) {
    return new Date(value)
  }
  return value
})
console.log(restored.date instanceof Date)  // true

// ========== toJSON 方法 ==========
// 对象可自定义 toJSON 控制序列化输出
const lesson = {
  title: 'Promise',
  toJSON() { return { title: this.title, summary: '异步核心' } },
}
console.log(JSON.stringify(lesson))  // '{"title":"Promise","summary":"异步核心"}'

// ========== structuredClone ==========
// 支持：循环引用、Date、RegExp、Map、Set、ArrayBuffer 等
const original = { name: '课程', tags: ['热门'] }
original.self = original  // 循环引用，JSON.stringify 会报错

const clone = structuredClone(original)
console.log(clone.self === clone)       // true（独立副本）
console.log(clone.tags !== original.tags) // true（深层拷贝）

// ========== 对比 ==========
// 展开运算符：浅拷贝，嵌套对象共享引用
const shallow = { ...original }

// JSON 方式：不支持函数、undefined、循环引用、Date 变字符串
// structuredClone：最完整，但不支持函数和 DOM 节点
`;export{n as default};
