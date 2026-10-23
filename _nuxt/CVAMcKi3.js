const e=`// ═══════════════════════════════════════════
// 1. 字面量与构造函数
// ═══════════════════════════════════════════

const phoneRe = /^1[3-9]\\d{9}$/
phoneRe.test('13800138000')                        // true  ← 手机号正则字面量
new RegExp('^1[3-9]\\\\d{9}$').test('13800138000')   // true  ← 构造写法，反斜杠写两次
const prefix = '1[3-9]'
new RegExp(\`^\${prefix}\\\\d{9}$\`).test('18800000000')  // true ← 动态拼模式

// ═══════════════════════════════════════════
// 2. 字符类与量词
// ═══════════════════════════════════════════

const abcRe = /[abc]/
abcRe.test('b')            // true   ← 命中 a、b、c 之一
const lowerRe = /[a-z]/
lowerRe.test('Q')          // false  ← 区间不含大写
const notDigitRe = /[^0-9]/
notDigitRe.test('5')       // false  ← 取反：非数字
const fourDigitsRe = /\\d{4}/
fourDigitsRe.test('2026')  // true   ← 恰好 4 位数字
const wordRe = /\\w+/
wordRe.test('abc_1')       // true   ← 一个或多个单词字符
const colorRe = /colou?r/
colorRe.test('color')      // true   ← ? 表示 0 或 1 个
const abStarRe = /ab*c/
abStarRe.test('ac')        // true   ← * 表示 0 或多个 b
const abPlusRe = /ab+c/
abPlusRe.test('ac')        // false  ← + 表示至少 1 个 b

// ═══════════════════════════════════════════
// 3. 分组、捕获与命名捕获组
// ═══════════════════════════════════════════

const fullDateRe = /^(\\d{4})-(\\d{2})-(\\d{2})$/
fullDateRe.exec('2026-10-14')
// [ '2026-10-14', '2026', '10', '14' ] ← 下标 1、2、3 依次是捕获组

const dateRe = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/
const parsed = dateRe.exec('2026-10-14')
parsed.groups.year       // '2026'
parsed.groups.month      // '10'
parsed.groups.day        // '14'
parsed[0]                // '2026-10-14' ← 下标 0 是整个匹配

const nonCaptureRe = /(?:ab)+/
nonCaptureRe.exec('abab')[0]   // 'abab' ← (?:...) 只分组不捕获

// ═══════════════════════════════════════════
// 4. 前瞻与后行断言（不消耗字符）
// ═══════════════════════════════════════════

const lookaheadRe = /foo(?=bar)/
lookaheadRe.exec('foobar')[0]   // 'foo'  ← 前瞻：后面必须是 bar
const negLookaheadRe = /foo(?!bar)/
negLookaheadRe.test('foobaz')   // true   ← 负前瞻：后面不能是 bar
const lookbehindRe = /(?<=\\$)\\d+/
lookbehindRe.exec('$99')[0]     // '99'   ← 后行断言：前面必须是 $
const negLookbehindRe = /(?<!\\$)\\d+/
negLookbehindRe.exec('99')[0]   // '99'   ← 负后行：前面不能是 $

// ═══════════════════════════════════════════
// 5. 修饰符
// ═══════════════════════════════════════════

const helloRe = /hello/i
helloRe.test('HELLO')                  // true   ← i 忽略大小写
'a\\nb'.match(/^b/g)                    // null   ← 无 m，^ 不匹配换行之后
'a\\nb'.match(/^b/gm)                   // ['b']  ← m 让 ^ 匹配每一行开头
'line1\\nline2'.match(/line./gs)        // ['line1', 'line2'] ← s 让 . 匹配换行
const emojiRe = /^\\u{1F600}$/u
emojiRe.test(String.fromCodePoint(0x1F600))  // true ← u 按完整码点匹配
const stickyRe = /\\d+/y
stickyRe.lastIndex = 3
stickyRe.exec('abc123')                // ['123'] ← y 从 lastIndex 处锚定

// ═══════════════════════════════════════════
// 6. test / exec / match / matchAll / replace
// ═══════════════════════════════════════════

const shortRe = /(\\d{4})-(\\d{2})/
shortRe.test('2026-10')                // true
shortRe.exec('2026-10')[1]             // '2026' ← exec 返回捕获组
'2026-10-14'.match(/\\d+/g)             // ['2026', '10', '14'] ← 带 g 返回全部匹配
'2026-10-14'.match(/\\d+/)              // 返回一次 exec 的结果 ← 不带 g
const allMatches = [...'a1b2'.matchAll(/(\\d)/g)].map((m) => m[0])   // ['1', '2'] ← matchAll 需要 g
'2026-10'.replace(/(\\d{4})-(\\d{2})/, '$2/$1')    // '10/2026' ← 用 $1、$2 引用捕获组
'Vue vue'.replaceAll(/vue/gi, 'Vue')             // 'Vue Vue'

// ═══════════════════════════════════════════
// 7. lastIndex 陷阱：带 g 的正则带状态
// ═══════════════════════════════════════════

const stateRe = /\\d+/g
stateRe.test('a1b2')     // true，此时 stateRe.lastIndex 为 2
stateRe.test('a1b2')     // true，lastIndex 前进到 4
stateRe.test('a1b2')     // false ← 从位置 4 继续找，已无数字
stateRe.lastIndex        // 0   ← 失败后自动重置
const makeRe = () => /\\d+/g   // 每次新建，避免共享 lastIndex

// ═══════════════════════════════════════════
// 8. 转义用户输入与性能
// ═══════════════════════════════════════════

function escapeRegExp(text) {
  return text.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&')
}
new RegExp(escapeRegExp('a.b')).test('a.b')   // true  ← 点号被转义成字面量
new RegExp('a.b').test('axb')                 // true  ← 未转义时点号匹配任意字符

const anchoredRe = /^\\d{4}-\\d{2}-\\d{2}$/
anchoredRe.test('2026-10-14')                 // true  ← 锚定 + 具体位数，几乎不回溯
// 反面示例：/(a+)+$/ 在超长的 a 表面上会因回溯爆炸而变慢
`;export{e as default};
