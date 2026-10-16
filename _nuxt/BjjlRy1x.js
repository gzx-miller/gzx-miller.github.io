const n=`// ═══════════════════════════════════════════
// 1. 标识符的命名规则
// ═══════════════════════════════════════════

let userName = '松松'      // 合法：字母开头
let _cacheSize = 0         // 合法：下划线开头
let $price = 12            // 合法：$ 开头
let item2 = '栗子'         // 合法：首字符之后可以接数字
userName === '松松'        // true
// userName 与 username 是两个变量 —— 标识符区分大小写
// let class = 1           // 报错：class 是保留字，不能充当标识符

// ═══════════════════════════════════════════
// 2. 语句与表达式
// ═══════════════════════════════════════════

const total = 12 * 3       // 右边 12 * 3 是表达式，值为 36
total + 8                  // 表达式求值：44
total === 36               // true
if (total > 30) { }        // 语句：执行判断，本身不产出值
let doubled = total * 2    // 表达式的值被外层语句接收：doubled 为 72

// ═══════════════════════════════════════════
// 3. 自动分号插入（ASI）的两处经典坑
// ═══════════════════════════════════════════

function pickFirst() {
  return
  1                          // 结果：undefined —— ASI 在 return 后擅自分了句
}
pickFirst()                  // 结果：undefined

const list = [10, 20]
let picked = list
[0]                          // 结果：picked 变成 10 —— 与上一行连成 list[0]

// ═══════════════════════════════════════════
// 4. 注释
// ═══════════════════════════════════════════

// 行注释：从 // 一直到本行结束
/* 块注释
   可以跨越多行 */
const rate = 0.9            // 结果：0.9
// 注意：/* 块注释不能嵌套，内层出现的 */ 会提前闭合外层

// ═══════════════════════════════════════════
// 5. 严格模式
// ═══════════════════════════════════════════

function loose() {
  dangle = 1                // 非严格模式：静默创建全局变量 dangle
}
function strict() {
  'use strict'
  try {
    other = 1               // 严格模式：抛 ReferenceError
  } catch (error) {
    error.name              // 结果：'ReferenceError'
  }
}

function whoAmI() {
  'use strict'
  return this
}
whoAmI()                    // 结果：undefined —— 不再指向全局对象
`;export{n as default};
