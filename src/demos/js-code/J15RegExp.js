// 正则表达式与模式匹配

// ── 创建方式 ──
const literal = /^hello/i          // 字面量（编译期确定）
const dynamic = new RegExp('hello', 'i') // 构造器（可拼接变量）

// ── 字符类与量符 ──
const phone = /^1[3-9]\d{9}$/               // 手机号
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // 简易邮箱

// ── test / exec ──
phone.test('13800138000')  // true
const result = /(\d{4})-(\d{2})/.exec('2025-06-15')
console.log(result[0])     // '2025-06'（完整匹配）
console.log(result[1])     // '2025'（第一个捕获组）

// ── 命名捕获组 ──
const dateRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
const m = dateRe.exec('2025-06-15')
console.log(m.groups)  // { year: '2025', month: '06', day: '15' }

// ── matchAll：获取所有匹配 ──
const text = '价格：¥12、¥35、¥7'
const prices = [...text.matchAll(/¥(\d+)/g)]
console.log(prices.map((p) => p[1])) // ['12', '35', '7']

// ── replace 与回调 ──
const masked = '13800138000'.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
console.log(masked) // '138****8000'

// ── 先行断言（lookahead） ──
// (?=...) 正向前瞻，(?!...) 负向前瞻
const strongPwd = /^(?=.*[A-Z])(?=.*\d).{8,}$/
strongPwd.test('Hello123')  // true — 含大写 + 数字 + 8位以上
strongPwd.test('hello123')  // false — 缺少大写

// ── 后行断言（lookbehind） ──
const currency = /(?<=¥)\d+/g
'¥12 和 ¥35'.match(currency) // ['12', '35']
