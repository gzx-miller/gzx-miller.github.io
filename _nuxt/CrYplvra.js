const n=`// ═══════════════════════════════════════════
// 1. 字符串不可变：方法只返回新串
// ═══════════════════════════════════════════

const s = 'abc'
s.toUpperCase()      // 'ABC'
s                    // 'abc'   ← 原串并没有被改动
s.replace('b', 'B')  // 'aBc'
s.concat('!')         // 'abc!'  ← 返回新串，s 仍是 'abc'

// ═══════════════════════════════════════════
// 2. 搜索与截取
// ═══════════════════════════════════════════

'Vue3 组合式 API'.includes('组合')   // true
'Vue3 组合式 API'.startsWith('Vue')  // true
'Vue3 组合式 API'.endsWith('API')    // true
'abcdef'.slice(1, 4)                 // 'bcd'
'abcdef'.slice(-3)                   // 'def'  ← 负数从尾部算起
'abc'.at(-1)                         // 'c'    ← at 支持负索引
'abc'.at(0)                          // 'a'

// ═══════════════════════════════════════════
// 3. 批量替换与拆分
// ═══════════════════════════════════════════

'aaa'.replace('a', 'b')    // 'baa'   ← 只替换第一个
'aaa'.replaceAll('a', 'b') // 'bbb'   ← 全部替换
'a,b,c'.split(',')         // ['a', 'b', 'c']
'abc'.split('')            // ['a', 'b', 'c']
const charArr = [...'abc']                 // ['a', 'b', 'c'] ← 展开字符串同样得到字符数组

// ═══════════════════════════════════════════
// 4. 修剪与填充
// ═══════════════════════════════════════════

'  hi  '.trim()          // 'hi'
'  hi  '.trimStart()     // 'hi  '
'  hi  '.trimEnd()       // '  hi'
String(123).padStart(6, '0')  // '000123'
'7'.padEnd(3, '-')       // '7--'

// ═══════════════════════════════════════════
// 5. 模板字面量：插值与多行
// ═══════════════════════════════════════════

const count = 3
const total = 29
const summary = \`共 \${count} 件，合计 ¥\${total}\`   // '共 3 件，合计 ¥29'

const lines = \`第一行
第二行\`                            // 直接换行，无需写 \\n

// ═══════════════════════════════════════════
// 6. 标签模板与 String.raw
// ═══════════════════════════════════════════

function tag(strings, ...values) {
  return strings.map((part, i) => part + (values[i] ?? '')).join('')
}
tag\`共 \${3} 件，合计 ¥\${29}\`         // '共 3 件，合计 ¥29'

String.raw\`a\\nb\`                     // 'a\\\\nb'  ← 反斜杠 n 原样保留，不换行
'\\n' === String.raw\`\\n\`              // false    ← 普通模板把 \\n 解析成换行

// ═══════════════════════════════════════════
// 7. 用标签模板做 HTML 转义
// ═══════════════════════════════════════════

function escapeHtml(strings, ...values) {
  const safe = values.map((v) => String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;'))
  return strings.reduce((out, part, i) => out + part + (safe[i] ?? ''), '')
}
const userInput = '<img src=x onerror=alert(1)>'
escapeHtml\`<p>\${userInput}</p>\`      // '<p>&lt;img src=x onerror=alert(1)&gt;</p>'

// ═══════════════════════════════════════════
// 8. Intl 地区化格式化
// ═══════════════════════════════════════════

new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(1299.5) // '¥1,299.50'
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1299.5) // '$1,299.50'
new Intl.NumberFormat('zh-CN', { style: 'percent' }).format(0.123)                   // '12%'
new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  .format(new Date(2026, 9, 14))                                                     // '2026年10月14日'
new Intl.RelativeTimeFormat('zh-CN').format(-1, 'day')                               // '1天前'
new Intl.RelativeTimeFormat('zh-CN').format(3, 'day')                                // '3天后'
new Intl.Collator('en').compare('a', 'b')                                            // -1
const sorted = ['c', 'a', 'b'].sort(new Intl.Collator('en').compare)                                // ['a', 'b', 'c']
`;export{n as default};
