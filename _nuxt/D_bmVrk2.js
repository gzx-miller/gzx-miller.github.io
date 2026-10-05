const e=`// Map、Set 与弱引用

// ── Set：自动去重的集合 ──
const tags = new Set(['Vue', 'React', 'Vue', 'CSS'])
tags.add('Vue')       // 重复，不生效
tags.has('Vue')       // true
tags.delete('CSS')
console.log([...tags]) // ['Vue', 'React']

// 数组去重一行搞定
const dedup = [...new Set([1, 2, 2, 3, 3, 3])]  // [1, 2, 3]

// ── Map：任意类型做键 ──
const courseMap = new Map()
courseMap.set('Vue', 12)
courseMap.set('React', 8)
courseMap.get('Vue')       // 12
courseMap.has('Vue')       // true
courseMap.delete('React')
console.log(courseMap.size) // 1

// 对象做键（普通对象做不到）
const objKey = { id: 1 }
courseMap.set(objKey, '元数据')
courseMap.get(objKey) // '元数据'

// ── WeakMap：弱引用键，不阻止垃圾回收 ──
const cache = new WeakMap()
function getMetadata(element) {
  if (cache.has(element)) return cache.get(element)
  const data = { createdAt: Date.now() }
  cache.set(element, data)
  return data
}
// 当 DOM 元素被移除且没有其他强引用时，WeakMap 不会阻止其被回收

// ── WeakRef 与 FinalizationRegistry（概念） ──
const ref = new WeakRef({ name: '课程缓存' })
// ref.deref() — 如果对象未被回收则返回，否则 undefined

const registry = new FinalizationRegistry((label) => {
  console.log(\`\${label} 已被回收\`)
})
// registry.register(obj, '课程对象')  — 对象被 GC 时回调
// GC 与回调时机都不可预测，不能用它执行关键清理或业务流程
`;export{e as default};
