const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const ops = [
  { id: 0, label: '原价 +', sym: '+' },
  { id: 1, label: '满减 -', sym: '-' },
  { id: 2, label: '折上 ×', sym: '×' },
  { id: 3, label: '拆分 ÷', sym: '÷' },
]

const a = ref('10')
const b = ref('3')
const activeOp = ref(0)
const result = ref<number | null>(null)
const tableEntries = ref<string[]>([])
const overwritten = ref(false)
const status = ref('')

let tableExports: any = null

onMounted(async () => {
  try {
    const instance = await instantiateWasm('table')
    tableExports = instance.exports
    refreshTable()
    status.value = 'table 模块已加载：函数表含 4 个函数，dispatch 用 call_indirect 按索引分发'
    compute()
  } catch (e) {
    status.value = \`加载失败：\${(e as Error).message}\`
  }
})

function refreshTable() {
  if (!tableExports) return
  tableEntries.value = [0, 1, 2, 3].map((i) => (tableExports.table.get(i) as Function).name)
}

function compute() {
  if (!tableExports) return
  const av = Number(a.value) | 0
  const bv = Number(b.value) | 0
  result.value = tableExports.dispatch(activeOp.value, av, bv)
}

// JS 可直接改写函数表：把"原价 +"换成"满减 -"，验证 dispatch 按新表分发
function overwriteTable() {
  if (!tableExports) return
  tableExports.table.set(0, tableExports.sub)
  overwritten.value = true
  refreshTable()
  compute()
  status.value = '已用 JS 把函数表第 0 项改写为 sub，dispatch(0, …) 现在执行减法'
}

function resetTable() {
  if (!tableExports) return
  tableExports.table.set(0, tableExports.add)
  overwritten.value = false
  refreshTable()
  compute()
  status.value = '函数表已还原：第 0 项恢复为 add'
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
<\/script>

<template>
  <div class="demo-card">
    <h3>函数表与 call_indirect：促销方式自由切换</h3>
    <p class="desc">
      函数表（table）把多个函数按索引存放，Wasm 用 <code>call_indirect</code> 根据索引
      动态调用——类似"接口分发"。结算台根据促销规则选择不同的计价函数，JS 甚至能改写表项。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="layout">
      <div class="panel">
        <h4>📑 函数表内容</h4>
        <ul class="table-list">
          <li
            v-for="(name, i) in tableEntries"
            :key="i"
            class="table-item"
            :class="{ active: activeOp === i }"
          >
            <span class="idx">[{{ i }}]</span>
            <code>{{ name }}</code>
            <span v-if="overwritten && i === 0" class="badge">已被 JS 改写</span>
          </li>
        </ul>
        <div class="table-actions">
          <button @click="overwriteTable">🔧 改写第 0 项为 sub</button>
          <button v-if="overwritten" @click="resetTable">↩️ 还原</button>
        </div>
      </div>

      <div class="panel">
        <h4>🧾 调用 dispatch(op, a, b)</h4>
        <div class="op-row">
          <button
            v-for="op in ops"
            :key="op.id"
            class="op-btn"
            :class="{ active: activeOp === op.id }"
            @click="activeOp = op.id; compute()"
          >
            {{ op.label }}
          </button>
        </div>
        <div class="inputs">
          <label>A
            <input v-model.number="a" type="number" @input="compute" />
          </label>
          <label>B
            <input v-model.number="b" type="number" @input="compute" />
          </label>
        </div>
        <div class="result">
          <span>{{ a || 0 }} {{ ops.find((o) => o.id === activeOp)?.sym }} {{ b || 0 }}</span>
          <code>{{ result ?? '…' }}</code>
        </div>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>表格的每一项是一个函数引用，索引即"指针"</li>
        <li><code>call_indirect</code> 在运行时取函数并校验签名，类型不符会抛异常</li>
        <li>JS 通过 <code>table.get/set</code> 直接操作表项，实现热替换</li>
        <li>函数表是实现多态、回调、动态插件的关键机制</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.desc {
  color: var(--muted);
  line-height: 1.7;
}

.toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 14px;
  display: grid;
  gap: 12px;
  align-content: start;
}

.table-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.table-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 8px 10px;
}

.table-item.active {
  outline: 2px solid var(--accent);
}

.idx {
  color: var(--muted);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
}

.table-item code {
  color: var(--forest);
}

.badge {
  margin-left: auto;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  padding: 2px 8px;
  font-size: 11px;
}

.table-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.op-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.op-btn {
  border: 1px solid var(--border) !important;
  background: var(--surface) !important;
  color: var(--text) !important;
}

.op-btn.active {
  border-color: var(--accent) !important;
  background: var(--accent) !important;
  color: #fff !important;
}

.inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.inputs label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}

.result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 12px 14px;
}

.result span {
  color: var(--muted);
  font-family: ui-monospace, Consolas, monospace;
}

.result code {
  color: var(--accent-strong);
  font-size: 22px;
  font-weight: 700;
}

.status {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.tips-box {
  border-radius: 8px;
  background: rgba(255, 218, 159, 0.24);
  padding: 12px 16px;
}

.tips-box ul {
  margin: 6px 0 0;
  padding-left: 20px;
  color: var(--muted);
  line-height: 1.8;
}

@media (max-width: 720px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
`;export{n as default};
