<script setup lang="ts">
import { computed, ref } from 'vue'

const d = ref<Record<string, string>>({ name: 'Ada', lang: 'Python' })
const key = ref('age')
const val = ref('23')
const note = ref('')

function put() {
  const k = key.value.trim()
  if (k === '') {
    note.value = '键不能为空'
    return
  }
  d.value = { ...d.value, [k]: val.value }
  note.value = `d['${k}'] = '${val.value}'，存在则覆盖，不存在则新增`
}

function removeKey() {
  const k = key.value.trim()
  if (!(k in d.value)) {
    note.value = `del d['${k}'] → KeyError：键不存在`
    return
  }
  const next = { ...d.value }
  delete next[k]
  d.value = next
  note.value = `del d['${k}']`
}

const dictLine = computed(() => {
  const body = Object.entries(d.value)
    .map(([k, v]) => `'${k}': '${v}'`)
    .join(', ')
  return `d = {${body}}`
})

const getResult = computed(() => {
  const k = key.value.trim()
  return k in d.value ? `'${d.value[k]}'` : 'None'
})

const inResult = computed(() => (key.value.trim() in d.value ? 'True' : 'False'))

const setA = ['apple', 'banana', 'cherry']
const setB = ['banana', 'date', 'cherry']
const setOp = ref<'|' | '&' | '-' | '^'>('|')
const setOps: Array<'|' | '&' | '-' | '^'> = ['|', '&', '-', '^']

function show(arr: string[]): string {
  return `{${[...new Set(arr)].map((x) => `'${x}'`).join(', ')}}`
}

const setResult = computed(() => {
  const a = new Set(setA)
  const b = new Set(setB)
  let arr: string[]
  switch (setOp.value) {
    case '|':
      arr = [...setA, ...setB]
      break
    case '&':
      arr = setA.filter((x) => b.has(x))
      break
    case '-':
      arr = setA.filter((x) => !b.has(x))
      break
    case '^':
      arr = [...setA.filter((x) => !b.has(x)), ...setB.filter((x) => !a.has(x))]
      break
  }
  return show(arr)
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>字典与集合</h4>

      <div class="demo-panel">
        <p class="hint">字典：输入键和值，添加 / 覆盖，或按键删除。</p>
        <div class="row" style="margin-top: 8px;">
          <label>key</label>
          <input type="text" v-model="key" />
          <label>value</label>
          <input type="text" v-model="val" />
        </div>
        <div class="tab-bar" style="margin-top: 10px;">
          <button class="mini-btn" @click="put">d[key] = value</button>
          <button class="mini-btn" @click="removeKey">del d[key]</button>
        </div>
        <pre class="mini-code">{{ dictLine }}
d.get('{{ key }}') → {{ getResult }}    '{{ key }}' in d → {{ inResult }}</pre>
        <div class="tips-box">{{ note || '添加或删除键值对，观察字典内容与查询结果随之变化。' }}</div>
      </div>

      <div class="demo-panel" style="margin-top: 16px;">
        <p class="hint">集合运算：A = {apple, banana, cherry}，B = {banana, date, cherry}。</p>
        <div class="tab-bar" style="margin-top: 10px;">
          <button
            v-for="symbol in setOps"
            :key="symbol"
            class="mini-btn"
            :class="{ active: setOp === symbol }"
            @click="setOp = symbol"
          >
            {{ symbol }}
          </button>
        </div>
        <pre class="mini-code">A {{ setOp }} B = {{ setResult }}</pre>
        <div class="tips-box">
          <code>|</code> 并集、<code>&amp;</code> 交集、<code>-</code> 差集、<code>^</code> 对称差；集合自动去重且不保证顺序。
        </div>
      </div>
    </div>
  </div>
</template>
