// ═══════════════════════════════════════════
// 1. if / else if / else 与真假值
// ═══════════════════════════════════════════

function grade(score) {
  if (score === undefined) return '未填写'   // 显式判断，避开 0 被当成假值
  if (score >= 90) return '优'
  else if (score >= 60) return '合格'
  else return '待定'
}
grade(0)          // '待定' —— 写成 if (score) 会在这一步误判
grade(88)         // '合格'
Boolean(0)        // false —— 所以 0 直接丢给条件会被当成没填

// ═══════════════════════════════════════════
// 2. 三元表达式与 switch
// ═══════════════════════════════════════════

const label = 88 >= 60 ? '合格' : '待定'   // '合格' —— 二选一取值

function statusOf(code) {
  switch (code) {
    case 1:
      return '待审核'
    case 2:            // 故意穿透：1 与 2 共用同一段逻辑
    case 3:
      return '处理中'
    default:
      return '已完成'
  }
}
statusOf(2)        // '处理中'
statusOf('1')      // '已完成' —— switch 用 ===，字符串 '1' 不命中数字 1

// ═══════════════════════════════════════════
// 3. for / while / do...while 的选择
// ═══════════════════════════════════════════

for (let k = 0; k < 3; k++) { }        // 次数已知：k 依次为 0、1、2

let queue = 3
while (queue > 0) { queue-- }          // 条件未知：循环结束时 queue 为 0

let visits = 0
do { visits++ } while (false)          // 结果：visits 为 1 —— 至少执行一次

// ═══════════════════════════════════════════
// 4. for...of 与 for...in
// ═══════════════════════════════════════════

const names = ['松松', '阿栗']
for (const name of names) { }          // 取到值：'松松'、'阿栗'
for (const key in names) { }           // 取到键：'0'、'1'（字符串）

const options = { limit: 20, page: 1 }
for (const key in options) { }         // 'limit'、'page'
Object.hasOwn(options, 'limit')        // true —— 过滤继承属性的标准写法

// ═══════════════════════════════════════════
// 5. continue / break / 带标签跳转
// ═══════════════════════════════════════════

const scores = [88, 45, 92, 60]
const passed = []
for (const score of scores) {
  if (score < 60) continue             // 跳过本轮，低分不进名单
  passed.push(score)
}
passed                                 // 结果：[88, 92, 60]

for (const score of scores) {
  if (score >= 90) break               // 结束整个循环
}

outer:
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    if (x + y === 2) break outer       // 一次跳出两层循环
  }
}
