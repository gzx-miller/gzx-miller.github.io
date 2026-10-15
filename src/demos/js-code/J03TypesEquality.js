// ═══════════════════════════════════════════
// 1. 七种原始类型与 typeof
// ═══════════════════════════════════════════

typeof 'hello'     // 'string'
typeof 42          // 'number'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof null        // 'object'   ← 历史遗留问题，判断 null 请用 x === null
typeof Symbol()    // 'symbol'
typeof 1n          // 'bigint'

// ═══════════════════════════════════════════
// 2. 引用类型与 typeof 的例外
// ═══════════════════════════════════════════

typeof {}            // 'object'
typeof []            // 'object'   ← 数组要用 Array.isArray() 判断
typeof (() => {})    // 'function' ← 唯一返回 function 的类型
Array.isArray([])    // true
Array.isArray({})    // false

// ═══════════════════════════════════════════
// 3. 显式转换：在输入边界调用
// ═══════════════════════════════════════════

Number('42')       // 42
Number('')         // 0
Number('abc')      // NaN
Number(true)       // 1
Number(null)       // 0
Number(undefined)  // NaN

String(42)         // '42'
String(null)       // 'null'
String(undefined)  // 'undefined'

Boolean('')        // false
Boolean(0)         // false
Boolean([])        // true   ← 空数组是 truthy
Boolean({})        // true   ← 空对象是 truthy

// ═══════════════════════════════════════════
// 4. 隐式转换：运算符里的转换规则
// ═══════════════════════════════════════════

'5' + 3      // '53'   ← + 只要有一侧是字符串就拼接
+'5' + 3     // 8      ← 前缀 + 强制转数字
'5' - 3      // 2      ← -、*、/ 两侧都转数字
'5' * '2'    // 10

// ═══════════════════════════════════════════
// 5. == 与 === 的差异
// ═══════════════════════════════════════════

'0' == 0           // true   ← '0' 转成 0
'' == 0            // true   ← '' 转成 0
null == undefined  // true   ← 规范规定的特例
null == 0          // false  ← null 只与 undefined 宽松相等
Array() == ''      // true   ← [] 经 toString 变成 ''
Array() == false   // true   ← 两边都转成 0

'0' === 0          // false
'' === 0           // false
null === undefined // false

// ═══════════════════════════════════════════
// 6. 三个必须绕开的边界
// ═══════════════════════════════════════════

NaN === NaN          // false  ← NaN 不等于任何值，包括自身
isNaN('abc')         // true   ← 全局 isNaN 会先转数字，不可靠
Number.isNaN(NaN)    // true   ← 正确写法
Number.isNaN('abc')  // false  ← 不转换，只判断是否真的是 NaN

Object.is(NaN, NaN)  // true   ← 同值相等
Object.is(-0, +0)    // false  ← 严格相等区分不了正负零

// ═══════════════════════════════════════════
// 7. 落到编码规范
// ═══════════════════════════════════════════

// ✓ 判断一律用 === 与 !==
// ✓ 需要转换时显式调用 Number() / String() / Boolean()
// ✓ 判断 NaN 用 Number.isNaN()，而不是全局 isNaN()
// ✓ 判断数组用 Array.isArray()，而不是 typeof
// ✓ 需要区分 +0 / -0 或让 NaN 等于自身时用 Object.is()
