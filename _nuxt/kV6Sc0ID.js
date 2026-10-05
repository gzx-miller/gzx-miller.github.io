const n=`// 迭代协议与生成器

// ── 迭代器协议：任何对象实现 [Symbol.iterator] 即可被 for...of 消费 ──
const courseList = {
  items: ['HTML', 'CSS', 'JavaScript'],
  [Symbol.iterator]() {
    let index = 0
    return {
      next: () =>
        index < this.items.length
          ? { value: this.items[index++], done: false }
          : { value: undefined, done: true },
    }
  },
}
for (const item of courseList) console.log(item)

// ── 生成器函数：function* + yield 暂停/恢复 ──
function* playlist(items) {
  for (const item of items) yield item
}
const gen = playlist(['Vue', 'React', 'Svelte'])
console.log(gen.next()) // { value: 'Vue', done: false }
console.log(gen.next()) // { value: 'React', done: false }
console.log(gen.next()) // { value: 'Svelte', done: false }
console.log(gen.next()) // { value: undefined, done: true }

// ── yield* 委托给另一个可迭代对象 ──
function* allCourses() {
  yield* ['基础', '进阶']
  yield* playlist(['Vue', 'React'])
}
console.log([...allCourses()]) // ['基础', '进阶', 'Vue', 'React']

// ── 双向通信：next() 传参作为上一次 yield 的返回值 ──
function* formFlow() {
  const name = yield '请输入姓名'
  const age = yield '请输入年龄'
  return \`报名：\${name}，\${age}岁\`
}
const form = formFlow()
form.next()            // 启动，停在 '请输入姓名'
form.next('小松鼠')    // name = '小松鼠'，停在 '请输入年龄'
form.next(3)           // age = 3, 返回 '报名：小松鼠，3岁'
`;export{n as default};
