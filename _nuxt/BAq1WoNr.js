const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

const items = ref<string[]>(['banana', 'apple', 'cherry'])
const value = ref('date')
const note = ref('')

function show(arr: string[]): string {
  return \`[\${arr.map((x) => \`'\${x}'\`).join(', ')}]\`
}

function appendItem() {
  items.value = [...items.value, value.value]
  note.value = \`lst.append('\${value.value}')，尾部新增一个元素\`
}

function insertFront() {
  items.value = [value.value, ...items.value]
  note.value = \`lst.insert(0, '\${value.value}')，在头部插入\`
}

function popItem() {
  if (items.value.length === 0) {
    note.value = 'lst.pop() → IndexError：空列表无法弹出'
    return
  }
  const last = items.value[items.value.length - 1]
  items.value = items.value.slice(0, -1)
  note.value = \`lst.pop() → '\${last}'，弹出并返回末位\`
}

function removeItem() {
  const i = items.value.indexOf(value.value)
  if (i < 0) {
    note.value = \`lst.remove('\${value.value}') → ValueError：列表中不存在该元素\`
    return
  }
  items.value = [...items.value.slice(0, i), ...items.value.slice(i + 1)]
  note.value = \`lst.remove('\${value.value}')，删除第一个匹配项\`
}

function sortAsc() {
  items.value = [...items.value].sort()
  note.value = 'lst.sort()，就地按字典序排序'
}

function reverseList() {
  items.value = [...items.value].reverse()
  note.value = 'lst.reverse()，就地反转'
}

const sliceRows = computed(() => {
  const lst = items.value
  return [
    { expr: 'lst[:2]', result: lst.slice(0, 2) },
    { expr: 'lst[-2:]', result: lst.slice(-2) },
    { expr: 'lst[::-1]', result: [...lst].reverse() },
  ]
})
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>列表、元组与序列操作</h4>

      <div class="row">
        <label>元素：</label>
        <input type="text" v-model="value" />
      </div>

      <div class="tab-bar" style="margin-top: 10px;">
        <button class="mini-btn" @click="appendItem">append</button>
        <button class="mini-btn" @click="insertFront">insert(0)</button>
        <button class="mini-btn" @click="popItem">pop</button>
        <button class="mini-btn" @click="removeItem">remove</button>
        <button class="mini-btn" @click="sortAsc">sort</button>
        <button class="mini-btn" @click="reverseList">reverse</button>
      </div>

      <pre class="mini-code">lst = {{ show(items) }}
len(lst) = {{ items.length }}</pre>

      <div class="tips-box">{{ note || '点一个按钮，看列表如何就地变化；再改一改上面的元素值。' }}</div>

      <table style="margin-top: 14px;">
        <thead><tr><th>切片表达式</th><th>结果</th></tr></thead>
        <tbody>
          <tr v-for="row in sliceRows" :key="row.expr">
            <td><code>{{ row.expr }}</code></td>
            <td><code>{{ show(row.result) }}</code></td>
          </tr>
        </tbody>
      </table>

      <div class="detail-box">
        对比元组：<code>t = ('a', 'b')</code> 不可变，写 <code>t[0] = 'x'</code> 会抛 <code>TypeError</code>；要「改」只能重建一个新元组。
      </div>
    </div>
  </div>
</template>
`;export{n as default};
