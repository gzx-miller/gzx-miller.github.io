const t=`<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'dynamic' | 'mutable' | 'convert'>('dynamic')

const dynamicExamples = [
  { code: 'x = 42', type: "<class 'int'>", note: '整数' },
  { code: "x = '42'", type: "<class 'str'>", note: '字符串' },
  { code: 'x = 42.0', type: "<class 'float'>", note: '浮点数' },
  { code: 'x = [42]', type: "<class 'list'>", note: '列表（可变）' },
  { code: "x = {'k': 42}", type: "<class 'dict'>", note: '字典（可变）' },
]
const picked = ref(0)
const current = computed(() => dynamicExamples[picked.value])

const typeRows = [
  { name: 'int / float / bool', mutable: '不可变', behavior: '重新赋值即新建对象' },
  { name: 'str / tuple / frozenset', mutable: '不可变', behavior: '任何“修改”都返回新对象' },
  { name: 'list / dict / set', mutable: '可变', behavior: '就地修改，所有引用者都可见' },
]

const raw = ref('42')

function tryInt(text: string): { ok: boolean; result: string } {
  const trimmed = text.trim()
  if (/^[+-]?\\d+$/.test(trimmed)) return { ok: true, result: String(Number.parseInt(trimmed, 10)) }
  return { ok: false, result: 'ValueError' }
}

function tryFloat(text: string): { ok: boolean; result: string } {
  const trimmed = text.trim()
  if (/^[+-]?(\\d+\\.?\\d*|\\.\\d+)$/.test(trimmed)) return { ok: true, result: String(Number(trimmed)) }
  return { ok: false, result: 'ValueError' }
}

const conversions = computed(() => [
  { call: \`int(\${JSON.stringify(raw.value)})\`, ...tryInt(raw.value) },
  { call: \`float(\${JSON.stringify(raw.value)})\`, ...tryFloat(raw.value) },
  { call: \`str(\${JSON.stringify(raw.value)})\`, ok: true, result: \`'\${raw.value}'\` },
  { call: \`bool(\${JSON.stringify(raw.value)})\`, ok: true, result: raw.value === '' ? 'False' : 'True' },
])
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>变量、动态类型与转换</h4>

      <div class="tab-bar">
        <button class="tab-btn" :class="{ active: activeTab === 'dynamic' }" @click="activeTab = 'dynamic'">动态类型</button>
        <button class="tab-btn" :class="{ active: activeTab === 'mutable' }" @click="activeTab = 'mutable'">可变与不可变</button>
        <button class="tab-btn" :class="{ active: activeTab === 'convert' }" @click="activeTab = 'convert'">类型转换</button>
      </div>

      <div v-if="activeTab === 'dynamic'">
        <p class="hint">点击任意一行，看同一个名字 <code>x</code> 如何先后指向不同类型的对象。</p>
        <div class="tab-bar" style="margin-top: 10px;">
          <button
            v-for="(item, index) in dynamicExamples"
            :key="item.code"
            class="mini-btn"
            :class="{ active: picked === index }"
            @click="picked = index"
          >
            {{ item.code }}
          </button>
        </div>
        <pre class="mini-code">{{ current.code }}
print(type(x))   # {{ current.type }}</pre>
        <div class="tips-box">
          当前是 <strong>{{ current.note }}</strong>。变量只是名字，类型属于对象；同一个名字随时可以改绑到另一种类型。
        </div>
      </div>

      <div v-else-if="activeTab === 'mutable'">
        <table>
          <thead><tr><th>类型</th><th>是否可变</th><th>修改时的行为</th></tr></thead>
          <tbody>
            <tr v-for="row in typeRows" :key="row.name">
              <td><code>{{ row.name }}</code></td>
              <td>{{ row.mutable }}</td>
              <td><small>{{ row.behavior }}</small></td>
            </tr>
          </tbody>
        </table>
        <pre class="mini-code" style="margin-top: 12px;">a = [1, 2, 3]
b = a            # b 绑定到同一个列表
b.append(4)
print(a)         # [1, 2, 3, 4] —— a 跟着变了</pre>
        <div class="tips-box">可变对象被多个名字共享时，一处就地修改会体现在所有名字上；需要独立副本就显式 <code>copy()</code>。</div>
      </div>

      <div v-else>
        <p class="hint">改一下输入，观察四个转换函数的成败与结果。</p>
        <input type="text" v-model="raw" style="margin-top: 8px;" />
        <table style="margin-top: 12px;">
          <thead><tr><th>调用</th><th>结果</th></tr></thead>
          <tbody>
            <tr v-for="row in conversions" :key="row.call">
              <td><code>{{ row.call }}</code></td>
              <td><span class="badge" :class="row.ok ? 'success' : 'error'">{{ row.result }}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="tips-box">
          注意两个反直觉之处：<code>bool('')</code> 是 <code>False</code>，但 <code>bool('0')</code> 是 <code>True</code>（非空字符串恒为真）；<code>int('3.14')</code> 会抛 <code>ValueError</code>，要转浮点得用 <code>float()</code>。
        </div>
      </div>
    </div>
  </div>
</template>
`;export{t as default};
