const n=`// ═══════════════════════════════════════════
// 1. JSON 能表示什么、不能表示什么
// ═══════════════════════════════════════════

JSON.stringify({ a: undefined, b: () => {}, c: Symbol() })   // '{}'            ← 三个键全被丢弃
JSON.stringify([undefined, () => {}])                        // '[null,null]'   ← 数组里变 null
JSON.stringify(new Date(0))                                  // '"1970-01-01T00:00:00.000Z"'  ← 退化为字符串
JSON.stringify(new Map([['a', 1]]))                          // '{}'            ← Map 退化成空对象

// ═══════════════════════════════════════════
// 2. 循环引用无法序列化
// ═══════════════════════════════════════════

const loop = { name: 'A' }
loop.self = loop
JSON.stringify(loop)                                         // 抛错：Converting circular structure to JSON

// ═══════════════════════════════════════════
// 3. stringify(value, replacer, space) 的三个参数
// ═══════════════════════════════════════════

JSON.stringify({ a: 1, b: 2 }, null, 2)                      // 带两格缩进的多行文本
JSON.stringify({ a: 1, b: 2, c: 3 }, ['a', 'c'])             // '{"a":1,"c":3}'  ← 数组 replacer 只留这些键
JSON.stringify({ name: '小明', password: '123' }, (key, value) =>
  key === 'password' ? undefined : value)                    // '{"name":"小明"}'  ← 函数 replacer 过滤敏感字段

// ═══════════════════════════════════════════
// 4. 对象上的 toJSON 自定义输出
// ═══════════════════════════════════════════

const order = {
  id: 7, createdAt: new Date(0),
  toJSON() { return { id: this.id, date: '1970-01-01' } },
}
JSON.stringify(order)                                        // '{"id":7,"date":"1970-01-01"}'  ← toJSON 的结果被采用

// ═══════════════════════════════════════════
// 5. parse(text, reviver) 在还原时重建类型
// ═══════════════════════════════════════════

JSON.parse('[1,2,3]')                                        // [1, 2, 3]
JSON.parse('{"d":"1970-01-01"}', (key, value) =>
  typeof value === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(value) ? new Date(value) : value)
// 结果：{ d: Date }  ← 日期字符串被重建为 Date

// ═══════════════════════════════════════════
// 6. 展开语法只是浅拷贝
// ═══════════════════════════════════════════

const src = { meta: { tag: '热门' }, list: [1, 2] }
const shallow = { ...src }
shallow.meta === src.meta                                    // true     ← 嵌套对象仍共享引用
shallow.meta.tag = '冷门'
src.meta.tag                                                 // '冷门'   ← 改副本影响了原对象

// ═══════════════════════════════════════════
// 7. structuredClone 结构化克隆
// ═══════════════════════════════════════════

const original = { name: 'A', when: new Date(0), tags: new Set(['x']) }
original.self = original
const cloned = structuredClone(original)
cloned.self === cloned                                       // true     ← 循环引用被正确重建
cloned.tags instanceof Set                                   // true     ← Set 被克隆
cloned.when instanceof Date                                  // true     ← Date 被克隆
structuredClone({ fn: () => {} })                            // 抛 DataCloneError  ← 函数无法克隆
`;export{n as default};
