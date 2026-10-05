const n=`// ========== 字符串查询方法 ==========
const title = 'Vue3 组合式 API 实战指南'

console.log(title.includes('API'))       // true
console.log(title.startsWith('Vue3'))    // true
console.log(title.endsWith('指南'))      // true
console.log(title.indexOf('组合式'))     // 5

// ========== 截取与分割 ==========
console.log(title.slice(0, 4))           // 'Vue3'
console.log(title.substring(5, 8))       // '组合式'
console.log('a,b,c,d'.split(','))        // ['a', 'b', 'c', 'd']
console.log(['Vue', 'Node'].join(' + ')) // 'Vue + Node'

// ========== matchAll：获取所有匹配 ==========
const text = '课程价格 ¥199，优惠 ¥50，实付 ¥149'
const prices = [...text.matchAll(/¥(\\d+)/g)]
console.log(prices.map((m) => m[1]))  // ['199', '50', '149']

// ========== replaceAll ==========
const raw = 'vue是好的，vue很灵活，学习vue吧'
console.log(raw.replaceAll('vue', 'Vue3'))

// ========== 填充与修剪 ==========
console.log('42'.padStart(5, '0'))     // '00042'
console.log('hi'.padEnd(8, '.'))       // 'hi......'
console.log('  hello  '.trimStart())   // 'hello  '
console.log('  hello  '.trimEnd())     // '  hello'

// ========== Intl.DateTimeFormat ==========
const now = new Date()
console.log(new Intl.DateTimeFormat('zh-CN', { dateStyle: 'full' }).format(now))
// 2025年9月15日星期一
console.log(new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(now))
// Sep 15, 2025

// ========== Intl.NumberFormat ==========
console.log(new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(1299))
// ¥1,299.00
console.log(new Intl.NumberFormat('de-DE').format(1234567.89))
// 1.234.567,89

// ========== Intl.Collator：中文排序 ==========
const names = ['张三', '李四', '王五', '阿明']
const collator = new Intl.Collator('zh-CN', { sensitivity: 'base' })
console.log(names.sort(collator.compare))

// ========== Intl.RelativeTimeFormat ==========
const rtf = new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' })
console.log(rtf.format(-1, 'day'))   // '昨天'
console.log(rtf.format(3, 'hour'))   // '3小时后'
`;export{n as default};
