const n=`// ═══════════════════════════════════════════
// 1. 浮点精度与安全整数
// ═══════════════════════════════════════════

0.1 + 0.2            // 0.30000000000000004
0.1 + 0.2 === 0.3    // false   ← 二进制无法精确表示 0.1 与 0.2
(0.1 + 0.2).toFixed(2)  // '0.30' ← 显示时再按两位小数收敛

Number.MAX_SAFE_INTEGER      // 9007199254740991  ← 2^53 - 1
Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2  // true ← 超出范围后两值相等
Number.isSafeInteger(2 ** 53 - 1)  // true
Number.isSafeInteger(2 ** 53)      // false

// ═══════════════════════════════════════════
// 2. 处理超范围整数的 BigInt
// ═══════════════════════════════════════════

typeof 1n            // 'bigint'
10n + 5n             // 15n
999999999999999999n  // 999999999999999999n ← 精确表示，不丢位
// 1n + 1            // 抛 TypeError：BigInt 不能与 number 混合运算

// ═══════════════════════════════════════════
// 3. NaN 与 Infinity
// ═══════════════════════════════════════════

typeof NaN           // 'number'
NaN === NaN          // false  ← 连自己都不相等
0 / 0                // NaN
Number('abc')        // NaN
1 / 0                // Infinity
-1 / 0               // -Infinity
Number.isFinite(Infinity)  // false
Number.isFinite(123)       // true

// ═══════════════════════════════════════════
// 4. 判断方法：绕开隐式转换
// ═══════════════════════════════════════════

isNaN('abc')             // true   ← 全局 isNaN 先转数字，不可靠
Number.isNaN('abc')      // false  ← 只在本身是 NaN 时为 true
Number.isNaN(NaN)        // true
Number.isInteger(2)      // true
Number.isInteger(2.0)    // true   ← 2.0 就是整数 2
Number.isInteger(2.5)    // false
Number.isFinite('1')     // false  ← 不转换参数

// ═══════════════════════════════════════════
// 5. 解析：parseInt / parseFloat / Number
// ═══════════════════════════════════════════

parseInt('12px')         // 12     ← 解析到非数字字符即停
parseInt('ff', 16)       // 255    ← 按十六进制解析
parseInt('')             // NaN
parseFloat('3.14abc')    // 3.14   ← 保留小数，遇到非数字停止
parseFloat('3.14.15')    // 3.14
Number('12px')           // NaN    ← 要求整串合法，因此失败
Number('12')             // 12
Number('')               // 0

// ═══════════════════════════════════════════
// 6. 数值格式化：只影响显示
// ═══════════════════════════════════════════

(1.2).toFixed(3)         // '1.200'   ← 不足补零，返回字符串
(1234.5).toFixed(1)      // '1234.5'
(123.456).toPrecision(4) // '123.5'   ← 按有效数字位数
(0.0001234).toPrecision(2)  // '0.00012'
(1234567).toLocaleString('en-US')  // '1,234,567'   ← 按地区加千分位
(1234.5).toLocaleString('zh-CN')   // '1,234.5'

// ═══════════════════════════════════════════
// 7. Math 常用方法
// ═══════════════════════════════════════════

Math.round(2.5)      // 3      ← .5 向正方向
Math.round(-2.5)     // -2
Math.trunc(-2.7)     // -2     ← 直接丢弃小数
Math.floor(-2.7)     // -3     ← 向下取整，负数时与 trunc 不同
Math.ceil(-2.3)      // -2
Math.max(1, 7, 3)    // 7
Math.min(1, 7, 3)    // 1
Math.abs(-5)         // 5
Math.pow(2, 10)      // 1024
2 ** 10              // 1024   ← 与 Math.pow 等价
Math.floor(Math.random() * 10)  // 0~9 之间的整数，每次不同

// ═══════════════════════════════════════════
// 8. Date 的创建与时间戳
// ═══════════════════════════════════════════

const d = new Date(2026, 9, 14)  // 月份从 0 开始，9 表示 10 月
d.getFullYear()      // 2026
d.getMonth()         // 9      ← 返回值同样是 0-based
d.getDate()          // 14
d.getDay()           // 3      ← 星期三，0 表示周日
d.getTime()          // 该时刻的毫秒时间戳

new Date(0).getTime()                 // 0
new Date('1970-01-01T00:00:01.000Z').getTime()  // 1000
Date.now()                            // 当前毫秒时间戳
new Date(1000).toISOString()          // '1970-01-01T00:00:01.000Z'

// ═══════════════════════════════════════════
// 9. 日期坑与地区化格式化
// ═══════════════════════════════════════════

new Date('2026-10-14').toISOString()   // '2026-10-14T00:00:00.000Z' ← 按 UTC 解析
new Date('2026/10/14').getFullYear()   // 2026   ← 带斜杠的写法按本地时区解析

new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' })
  .format(new Date(2026, 9, 14))        // '2026年10月14日'
new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })
  .format(new Date(2026, 9, 14))        // 'October 14, 2026'
new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' })
  .format(new Date(2026, 9, 14, 9, 30)) // '09:30'
`;export{n as default};
