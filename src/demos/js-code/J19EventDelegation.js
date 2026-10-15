// ═══════════════════════════════════════════
// 0. 取几个稳定的父节点与子节点
// ═══════════════════════════════════════════

const parent = document.querySelector('#parent')
const child = document.querySelector('#child')
const list = document.querySelector('#list')
const link = document.querySelector('#link')
const el = document.querySelector('#el')
const log = []

// ═══════════════════════════════════════════
// 1. 事件流的三站：捕获 → 目标 → 冒泡
// ═══════════════════════════════════════════

parent.addEventListener('click', () => log.push('parent 捕获'), true)   // 捕获阶段
child.addEventListener('click', () => log.push('child 目标'))           // 目标阶段
parent.addEventListener('click', () => log.push('parent 冒泡'))         // 冒泡阶段
child.click()                                                           // 顺序：parent 捕获 → child 目标 → parent 冒泡

// ═══════════════════════════════════════════
// 2. 第三个参数与 options
// ═══════════════════════════════════════════

el.addEventListener('click', handler)                        // 默认在冒泡阶段触发
el.addEventListener('click', handler, { capture: true })     // 改到捕获阶段触发
el.addEventListener('click', handler, { once: true })        // 触发一次后自动移除
el.addEventListener('scroll', onScroll, { passive: true })   // 承诺不调用 preventDefault

// ═══════════════════════════════════════════
// 3. preventDefault 与 stopPropagation 的区别
// ═══════════════════════════════════════════

link.addEventListener('click', (e) => e.preventDefault())        // 阻止默认跳转，事件仍继续传播
parent.addEventListener('click', (e) => e.stopPropagation())     // 阻止继续冒泡，默认行为照常
el.removeEventListener('click', handler)                         // 移除监听器：必须传同一个函数引用

// ═══════════════════════════════════════════
// 4. target 与 currentTarget
// ═══════════════════════════════════════════

list.addEventListener('click', (e) => {
  e.target.name          // ''        ← 真正被点中的元素，可能是列表项里的 span
  e.currentTarget.id     // 'list'    ← 挂着监听器的元素，永远是 list
})

// ═══════════════════════════════════════════
// 5. 事件委托：一次监听，分派多个子节点
// ═══════════════════════════════════════════

list.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]')   // 向上找到带 data-id 的按钮
  if (!btn) return                                    // 点在空中，直接返回
  console.log(btn.dataset.id)                         // '42'  ← dataset 读取 data-id
})
// 之后动态 push 的新按钮，无需重新绑定，点击照样命中这个监听器

// ═══════════════════════════════════════════
// 6. 不冒泡的事件要借助捕获阶段
// ═══════════════════════════════════════════

parent.addEventListener('focus', onFocus, true)      // focus / blur 不冒泡，用 capture 在父级监听
parent.addEventListener('scroll', onScroll, true)    // scroll 也不冒泡，同理改走捕获阶段
