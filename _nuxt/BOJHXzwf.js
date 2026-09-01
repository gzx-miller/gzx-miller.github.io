const n=`<script setup>
import { ref } from 'vue'

const log = ref('')

// 自定义可迭代对象：Symbol.iterator
function makeIterable() {
  const courseList = {
    items: ['JavaScript 基础', 'Vue3 实战', 'Node.js 进阶'],
    [Symbol.iterator]() {
      let index = 0
      return {
        next: () => index < this.items.length
          ? { value: this.items[index++], done: false }
          : { done: true },
      }
    },
  }
  // 有了 Symbol.iterator 就能用 for...of 和展开运算符
  const arr = [...courseList]
  log.value = \`展开结果：\${arr.join(' → ')}\`
}

// Symbol.toPrimitive：自定义类型转换
function toPrimitiveDemo() {
  const price = {
    value: 299,
    [Symbol.toPrimitive](hint) {
      if (hint === 'number') return this.value
      if (hint === 'string') return \`¥\${this.value}\`
      return this.value  // default
    },
  }
  log.value = \`数字转换：\${+price}，字符串转换：\${price + ''}，模板：\${\`\${price}\`}\`
}

// Symbol.for：全局共享
function symbolFor() {
  const s1 = Symbol.for('course.type')
  const s2 = Symbol.for('course.type')
  const key = Symbol.keyFor(s1)
  log.value = \`Symbol.for 共享：\${s1 === s2}，keyFor 还原：\${key}\`
}
<\/script>

<template><div class="demo-card">
  <div class="button-row">
    <button @click="makeIterable">自定义迭代器</button>
    <button @click="toPrimitiveDemo">类型转换</button>
    <button @click="symbolFor">全局 Symbol</button>
  </div>
  <p>{{ log || '点击按钮查看结果' }}</p>
  <small>Symbol.iterator 让对象可迭代（for...of/展开）；Symbol.toPrimitive 自定义类型转换行为。</small>
</div></template>
`;export{n as default};
