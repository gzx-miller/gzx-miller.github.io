// 数组不可变转换流水线
const courses = [
  { id: 1, title: 'JavaScript 基础', score: 4.8 },
  { id: 2, title: 'Node.js 服务', score: 4.6 },
  { id: 3, title: 'Vue 组件设计', score: 4.9 },
]

// filter 筛选 → toSorted 排序（不修改原数组）
function search(keyword) {
  return courses
    .filter((c) => c.title.includes(keyword))
    .toSorted((a, b) => b.score - a.score)
}

console.log(search(''))       // 全部，按评分降序
console.log(search('Java'))   // 仅匹配项
