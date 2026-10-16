<script setup lang="ts">
import { computed, ref } from 'vue'

type Op = '+' | '-' | '*' | '/' | '//' | '%' | '**'

const ops: Op[] = ['+', '-', '*', '/', '//', '%', '**']
const a = ref('7')
const b = ref('-2')
const op = ref<Op>('//')

function numKind(text: string): 'int' | 'float' | null {
  const t = text.trim()
  if (/^[+-]?\d+$/.test(t)) return 'int'
  if (/^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(t)) return 'float'
  return null
}

const kindA = computed(() => numKind(a.value))
const kindB = computed(() => numKind(b.value))
const valid = computed(() => kindA.value !== null && kindB.value !== null)

function repr(value: number, kind: 'int' | 'float'): string {
  if (kind === 'int') return String(value)
  return Number.isInteger(value) ? value.toFixed(1) : String(value)
}

const result = computed(() => {
  if (!valid.value) return { ok: false, text: '输入不是数字', type: '—' }
  const x = Number(a.value)
  const y = Number(b.value)
  const ka = kindA.value as 'int' | 'float'
  const kb = kindB.value as 'int' | 'float'

  if ((op.value === '/' || op.value === '//' || op.value === '%') && y === 0) {
    return { ok: false, text: 'ZeroDivisionError', type: '—' }
  }
  if (op.value === '**' && x === 0 && y < 0) {
    return { ok: false, text: 'ZeroDivisionError', type: '—' }
  }

  let value = 0
  let type: 'int' | 'float' = 'int'
  switch (op.value) {
    case '+':
      value = x + y
      type = ka === 'float' || kb === 'float' ? 'float' : 'int'
      break
    case '-':
      value = x - y
      type = ka === 'float' || kb === 'float' ? 'float' : 'int'
      break
    case '*':
      value = x * y
      type = ka === 'float' || kb === 'float' ? 'float' : 'int'
      break
    case '/':
      value = x / y
      type = 'float'
      break
    case '//':
      value = Math.floor(x / y)
      type = ka === 'int' && kb === 'int' ? 'int' : 'float'
      break
    case '%':
      value = x - Math.floor(x / y) * y
      type = ka === 'int' && kb === 'int' ? 'int' : 'float'
      break
    case '**':
      value = x ** y
      type = ka === 'int' && kb === 'int' && y >= 0 ? 'int' : 'float'
      break
  }
  return { ok: true, text: repr(value, type), type }
})

const expression = computed(() => `${a.value.trim()} ${op.value} ${b.value.trim()}`)

const resultLine = computed(() => {
  if (!result.value.ok) return `${expression.value}  ->  ${result.value.text}`
  return `${expression.value}  =  ${result.value.text}   # ${result.value.type}`
})

const divisionRows = computed(() => {
  if (!valid.value) return []
  const x = Number(a.value)
  const y = Number(b.value)
  if (y === 0) {
    return [
      { name: '真除法 a / b', detail: 'x / y，结果恒为 float', result: 'ZeroDivisionError' },
      { name: '地板除 a // b', detail: '向下取整 floor(x / y)', result: 'ZeroDivisionError' },
    ]
  }
  const bothInt = kindA.value === 'int' && kindB.value === 'int'
  return [
    { name: '真除法 a / b', detail: 'x / y，结果恒为 float', result: repr(x / y, 'float') },
    { name: '地板除 a // b', detail: '向下取整 floor(x / y)', result: repr(Math.floor(x / y), bothInt ? 'int' : 'float') },
  ]
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>运算符与表达式求值</h4>
      <p class="hint">改一改两个数字，点运算符按钮，实时看表达式的值与它推断出的类型。</p>

      <div class="row" style="margin-top: 10px;">
        <label>a =</label>
        <input type="text" v-model="a" />
        <label>b =</label>
        <input type="text" v-model="b" />
      </div>

      <div class="tab-bar" style="margin-top: 12px;">
        <button
          v-for="symbol in ops"
          :key="symbol"
          class="mini-btn"
          :class="{ active: op === symbol }"
          @click="op = symbol"
        >
          {{ symbol }}
        </button>
      </div>

      <pre class="mini-code">{{ resultLine }}</pre>

      <div v-if="result.ok" class="tips-box">
        表达式 <code>{{ expression }}</code> 的结果类型是 <strong>{{ result.type }}</strong>。整数运算保持 <code>int</code>；一旦有 <code>float</code> 参与，或用了永远返回 <code>float</code> 的 <code>/</code>，结果就变成 <code>float</code>。
      </div>
      <div v-else class="detail-box">
        结果 <span class="badge error">{{ result.text }}</span>：除法类运算遇到除数为 0 会抛 <code>ZeroDivisionError</code>。
      </div>

      <table style="margin-top: 16px;">
        <thead>
          <tr><th>写法</th><th>含义</th><th>结果</th></tr>
        </thead>
        <tbody>
          <tr v-for="row in divisionRows" :key="row.name">
            <td>{{ row.name }}</td>
            <td><small>{{ row.detail }}</small></td>
            <td><code>{{ row.result }}</code></td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        对照要点：<code>/</code> 永远返回 <code>float</code>；<code>//</code> 朝负无穷向下取整，两个整数相除结果是 <code>int</code>，带小数则仍是 <code>float</code>。把 <code>b</code> 设成负数试试。
      </div>
    </div>
  </div>
</template>
