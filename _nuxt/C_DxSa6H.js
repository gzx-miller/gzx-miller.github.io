const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type Case = {
  key: string
  label: string
  call: string
  bound: { name: string; value: string }[]
  note: string
}

const cases: Case[] = [
  {
    key: 'positional',
    label: '位置参数',
    call: "profile('小明', 20)",
    bound: [
      { name: 'name', value: "'小明'" },
      { name: 'age', value: '20' },
      { name: 'hobbies', value: '()' },
      { name: 'city', value: "'北京'" },
      { name: 'extra', value: '{}' },
    ],
    note: '两个实参按先后顺序落在 name 与 age 上，其余形参取各自默认值。',
  },
  {
    key: 'default',
    label: '默认参数',
    call: "profile('小明')",
    bound: [
      { name: 'name', value: "'小明'" },
      { name: 'age', value: '18' },
      { name: 'hobbies', value: '()' },
      { name: 'city', value: "'北京'" },
      { name: 'extra', value: '{}' },
    ],
    note: '省略 age 时使用定义处的默认值 18。默认参数必须排在不带默认值的位置参数之后。',
  },
  {
    key: 'keyword',
    label: '关键字参数',
    call: "profile('小明', age=22, city='上海')",
    bound: [
      { name: 'name', value: "'小明'" },
      { name: 'age', value: '22' },
      { name: 'hobbies', value: '()' },
      { name: 'city', value: "'上海'" },
      { name: 'extra', value: '{}' },
    ],
    note: '按名字传入，可以跳过中间的形参、顺序随意，读代码时一眼看出每个值的去向。',
  },
  {
    key: 'args',
    label: '*args',
    call: "profile('小明', 20, '读书', '跑步')",
    bound: [
      { name: 'name', value: "'小明'" },
      { name: 'age', value: '20' },
      { name: 'hobbies', value: "('读书', '跑步')" },
      { name: 'city', value: "'北京'" },
      { name: 'extra', value: '{}' },
    ],
    note: '多出来的位置实参被打包成一个元组，交给带星号的 *hobbies 接收。',
  },
  {
    key: 'kwargs',
    label: '**kwargs',
    call: "profile('小明', 20, city='上海', vip=True, level=3)",
    bound: [
      { name: 'name', value: "'小明'" },
      { name: 'age', value: '20' },
      { name: 'hobbies', value: '()' },
      { name: 'city', value: "'上海'" },
      { name: 'extra', value: "{'vip': True, 'level': 3}" },
    ],
    note: 'city 被同名关键字捕获，剩下没被认领的关键字打包成字典交给 **extra。',
  },
]

const activeKey = ref('positional')
const current = computed(() => cases.find((item) => item.key === activeKey.value)!)

const sharedBox = ref<string[]>([])
const boxText = computed(() => \`[\${sharedBox.value.map((item) => \`'\${item}'\`).join(', ')}]\`)

function callAgain() {
  sharedBox.value = [...sharedBox.value, '栗子']
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>函数的参数类型与形参绑定</h4>
      <p class="hint">选中一种调用方式，看同一份形参签名如何被实参逐项绑定。</p>

      <div class="tab-bar" style="margin-top: 10px;">
        <button
          v-for="item in cases"
          :key="item.key"
          class="tab-btn"
          :class="{ active: activeKey === item.key }"
          @click="activeKey = item.key"
        >
          {{ item.label }}
        </button>
      </div>

      <pre class="mini-code">def profile(name, age=18, *hobbies, city='北京', **extra):
    return {'name': name, 'age': age, 'hobbies': hobbies, 'city': city, 'extra': extra}

{{ current.call }}</pre>

      <table style="margin-top: 12px;">
        <thead><tr><th>形参</th><th>绑定到的值</th></tr></thead>
        <tbody>
          <tr v-for="row in current.bound" :key="row.name">
            <td><code>{{ row.name }}</code></td>
            <td><code>{{ row.value }}</code></td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box">{{ current.note }}</div>

      <h4 style="margin-top: 16px;">可变默认参数陷阱</h4>
      <p class="hint">默认值只在定义时求值一次，被后续所有调用共享。</p>
      <pre class="mini-code">def add_item(item, box=[]):
    box.append(item)
    return box

print(add_item('栗子'))   # 每次返回的都是同一个列表</pre>

      <div class="row" style="margin-top: 10px;">
        <button class="mini-btn" @click="callAgain">再调用一次 add_item('栗子')</button>
        <button class="mini-btn" @click="sharedBox = []">重置</button>
      </div>

      <div class="detail-box">
        当前 <code>box</code> 返回：<code>{{ boxText }}</code>
        <span class="badge" :class="sharedBox.length > 1 ? 'warning' : 'success'">
          {{ sharedBox.length > 1 ? '跨调用累积了' : '暂时正常' }}
        </span>
      </div>
      <div class="tips-box">
        正确做法是把默认值写成 <code>None</code>，在函数体内 <code>if box is None: box = []</code>，
        这样每次调用都会拿到一个全新的列表。
      </div>
    </div>
  </div>
</template>
`;export{n as default};
