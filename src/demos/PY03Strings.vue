<script setup lang="ts">
import { computed, ref } from 'vue'

type Tab = 'format' | 'slice' | 'method'

const tab = ref<Tab>('format')
const name = ref('Ada')
const age = ref('23')
const text = ref('  Hello World  ')

function pad(v: string, width: number, align: '>' | '<' | '^'): string {
  if (v.length >= width) return v
  const total = width - v.length
  if (align === '>') return ' '.repeat(total) + v
  if (align === '<') return v + ' '.repeat(total)
  const left = Math.floor(total / 2)
  return ' '.repeat(left) + v + ' '.repeat(total - left)
}

function bracket(v: string): string {
  return `[${v}]`
}

const formatRows = computed(() => {
  const rawAge = age.value.trim()
  const parsed = Number(rawAge)
  const ageOk = rawAge !== '' && !Number.isNaN(parsed)
  return [
    { call: 'f"{name:>6}"', result: bracket(pad(name.value, 6, '>')) },
    { call: 'f"{name:<6}"', result: bracket(pad(name.value, 6, '<')) },
    { call: 'f"{name:^6}"', result: bracket(pad(name.value, 6, '^')) },
    { call: 'f"{age:.2f}"', result: ageOk ? bracket(parsed.toFixed(2)) : 'ValueError' },
    { call: 'f"{name} = {age}"', result: `'${name.value} = ${age.value}'` },
  ]
})

function pySlice(s: string, start: number | null, stop: number | null, step: number): string {
  const n = s.length
  const isNeg = step < 0
  const norm = (v: number | null, dflt: number): number => {
    if (v === null) return dflt
    let i = v < 0 ? v + n : v
    if (isNeg) {
      if (i < 0) i = -1
      else if (i >= n) i = n - 1
    } else {
      if (i < 0) i = 0
      else if (i > n) i = n
    }
    return i
  }
  const start2 = norm(start, isNeg ? n - 1 : 0)
  const stop2 = norm(stop, isNeg ? -1 : n)
  let out = ''
  if (!isNeg) {
    for (let i = start2; i < stop2; i += step) if (i >= 0 && i < n) out += s[i]
  } else {
    for (let i = start2; i > stop2; i += step) if (i >= 0 && i < n) out += s[i]
  }
  return out
}

const sliceSpecs = [
  { expr: 's[0:4]', start: 0, stop: 4, step: 1 },
  { expr: 's[-3:]', start: -3, stop: null, step: 1 },
  { expr: 's[:-2]', start: null, stop: -2, step: 1 },
  { expr: 's[::2]', start: null, stop: null, step: 2 },
  { expr: 's[::-1]', start: null, stop: null, step: -1 },
]

const sliceRows = computed(() =>
  sliceSpecs.map((spec) => ({
    expr: spec.expr,
    result: `'${pySlice(text.value, spec.start, spec.stop, spec.step)}'`,
  })),
)

const methodRows = computed(() => {
  const s = text.value
  const trimmed = s.trim()
  const words = trimmed.split(/\s+/).filter(Boolean)
  return [
    { call: 's.upper()', result: `'${s.toUpperCase()}'` },
    { call: 's.strip()', result: `'${trimmed}'` },
    { call: 's.split()', result: `[${words.map((w) => `'${w}'`).join(', ')}]` },
    { call: "s.replace('l', 'L')", result: `'${s.replace(/l/g, 'L')}'` },
    { call: "s.startswith('Hello')", result: trimmed.startsWith('Hello') ? 'True' : 'False' },
    { call: "s.lower().count('o')", result: String((s.toLowerCase().match(/o/g) ?? []).length) },
  ]
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>字符串、切片与格式化</h4>
      <div class="row" style="margin-top: 10px;">
        <label>姓名</label>
        <input type="text" v-model="name" />
        <label>年龄</label>
        <input type="text" v-model="age" />
      </div>
      <div class="row" style="margin-top: 10px;">
        <label>句子</label>
        <input type="text" v-model="text" style="flex: 1;" />
      </div>

      <div class="tab-bar" style="margin-top: 12px;">
        <button class="tab-btn" :class="{ active: tab === 'format' }" @click="tab = 'format'">格式化</button>
        <button class="tab-btn" :class="{ active: tab === 'slice' }" @click="tab = 'slice'">切片</button>
        <button class="tab-btn" :class="{ active: tab === 'method' }" @click="tab = 'method'">方法</button>
      </div>

      <div v-if="tab === 'format'">
        <p class="hint">方括号只是边界标记，方便看清对齐补出的空格位置。</p>
        <table style="margin-top: 8px;">
          <thead><tr><th>f-string</th><th>渲染结果</th></tr></thead>
          <tbody>
            <tr v-for="row in formatRows" :key="row.call">
              <td><code>{{ row.call }}</code></td>
              <td><code>{{ row.result }}</code></td>
            </tr>
          </tbody>
        </table>
        <div class="tips-box">
          <code>{v:&gt;6}</code> 右对齐、<code>{v:&lt;6}</code> 左对齐、<code>{v:^6}</code> 居中，宽度不够时按原样输出；<code>{v:.2f}</code> 保留两位小数。
        </div>
      </div>

      <div v-else-if="tab === 'slice'">
        <p class="hint">当前字符串 <code>{{ text }}</code>，长度 {{ text.length }}。</p>
        <table style="margin-top: 8px;">
          <thead><tr><th>切片表达式</th><th>结果</th></tr></thead>
          <tbody>
            <tr v-for="row in sliceRows" :key="row.expr">
              <td><code>{{ row.expr }}</code></td>
              <td><code>{{ row.result }}</code></td>
            </tr>
          </tbody>
        </table>
        <div class="tips-box">步长为负表示从右往左走，<code>s[::-1]</code> 是反转字符串的惯用写法；负索引 <code>s[-1]</code> 取最后一个字符。</div>
      </div>

      <div v-else>
        <p class="hint">对 <code>{{ text }}</code> 逐个调用常用方法。</p>
        <table style="margin-top: 8px;">
          <thead><tr><th>调用</th><th>返回值</th></tr></thead>
          <tbody>
            <tr v-for="row in methodRows" :key="row.call">
              <td><code>{{ row.call }}</code></td>
              <td><code>{{ row.result }}</code></td>
            </tr>
          </tbody>
        </table>
        <div class="tips-box">
          <code>split()</code> 不带参数会按连续空白切分并丢弃空串；<code>strip()</code> 去掉首尾空白；所有方法都<strong>返回新字符串</strong>，原字符串不变。
        </div>
      </div>
    </div>
  </div>
</template>
