// 类型推导：TS 从初始值自动推断类型
let courseName = 'Vue 3 实战'   // 推导为 string
let price = 99                   // 推导为 number

// 显式标注：当类型无法完全推断或需要扩展时使用
let seats: number | null = 20   // 允许后续赋 null
seats = null                     // ✓ 合法

// 函数返回值推导
function formatCourse(name: string, price: number) {
  return `${name} · ¥${price}`  // 推导返回 string
}

console.log(formatCourse(courseName, price))
