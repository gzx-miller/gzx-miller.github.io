const n=`// ═══════════════════════════════════════════
// 1. JavaScript 的 7 种原始类型
// ═══════════════════════════════════════════

typeof 'hello'     // 'string'
typeof 42          // 'number'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof null        // 'object'  ← 历史遗留 bug
typeof Symbol()    // 'symbol'
typeof 1n          // 'bigint'

// ═══════════════════════════════════════════
// 2. 引用类型（typeof 全部返回 'object'）
// ═══════════════════════════════════════════

typeof {}           // 'object'
typeof []           // 'object'  ← 需要用 Array.isArray() 判断
typeof (() => {})   // 'function' ← 唯一例外
Array.isArray([])   // true

// ═══════════════════════════════════════════
// 3. 显式类型转换 — 推荐做法
// ═══════════════════════════════════════════

// 转数字
Number('42')       // 42
Number('')         // 0
Number('abc')      // NaN
Number(true)       // 1
Number(null)       // 0
Number(undefined)  // NaN

// 转字符串
String(42)         // '42'
String(null)       // 'null'
String(undefined)  // 'undefined'

// 转布尔 — 只有 5 个 falsy 值
// '', 0, NaN, null, undefined
Boolean('')        // false
Boolean(0)         // false
Boolean(NaN)       // false
Boolean(null)      // false
Boolean(undefined) // false
// 其余全是 truthy，包括空数组和空对象
Boolean([])        // true
Boolean({})        // true

// ═══════════════════════════════════════════
// 4. 隐式转换规则
// ═══════════════════════════════════════════

// + 运算符：有字符串则拼接，否则转数字相加
'5' + 3            // '53'   ← 字符串拼接
+'5' + 3           // 8      ← + 号前缀强制转数字

// -、*、/ 运算符：两侧都转数字
'5' - 3            // 2
'5' * '2'          // 10

// ═══════════════════════════════════════════
// 5. == 宽松相等 vs === 严格相等
// ═══════════════════════════════════════════

// == 会先隐式转换再比较
'0' == 0           // true   ← '0' 转为 0
'' == 0            // true   ← '' 转为 0
null == undefined  // true   ← 规范规定
null == 0          // false  ← null 只与 undefined 宽松相等
Array() == ''      // true   ← [] → '' → ''
Array() == false   // true   ← [] → '' → 0, false → 0

// === 不转换类型，类型不同直接 false
'0' === 0          // false
'' === 0           // false
null === undefined // false

// 特殊值
NaN === NaN        // false  ← NaN 不等于任何值
Number.isNaN(NaN)  // true   ← 正确判断方式
Object.is(NaN, NaN) // true  ← 同值相等

// ═══════════════════════════════════════════
// 6. 最佳实践
// ═══════════════════════════════════════════

// ✓ 始终用 === 和 !==
// ✓ 需要转换时显式调用 Number() / String() / Boolean()
// ✓ 用 Number.isNaN() 代替 isNaN()（全局 isNaN 会先转数字）
// ✓ 用 Array.isArray() 判断数组
// ✓ 用 Object.is() 处理 NaN 和 -0 的边界场景
`;export{n as default};
