<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const rows = ref<number[][]>([])
const address = ref(0)
const value = ref(0)
const selected = ref(-1)
const status = ref('')

let memExports: any = null
let memBytes: Uint8Array | null = null

onMounted(async () => {
  try {
    const instance = await instantiateWasm('mem')
    memExports = instance.exports
    memBytes = new Uint8Array(instance.exports.memory.buffer)
    // 预置几个示例值，模拟"货架上的库存"
    memExports.store8(0, 12)
    memExports.store8(1, 34)
    memExports.store8(2, 56)
    status.value = 'mem 模块已加载：线性内存 1 页(64KiB)，导出 store8 / load8 / sum'
    refresh()
  } catch (e) {
    status.value = `加载失败：${(e as Error).message}`
  }
})

function refresh() {
  if (!memBytes) return
  const grid: number[][] = []
  for (let r = 0; r < 4; r++) {
    const row: number[] = []
    for (let c = 0; c < 8; c++) row.push(memBytes[r * 8 + c])
    grid.push(row)
  }
  rows.value = grid
}

function store() {
  if (!memExports) return
  const off = Math.max(0, Math.min(31, address.value | 0))
  const v = (value.value | 0) & 0xff
  memExports.store8(off, v)
  selected.value = off
  status.value = `store8(${off}, ${v}) 写入成功`
  refresh()
}

function load() {
  if (!memExports) return
  const off = Math.max(0, Math.min(31, address.value | 0))
  value.value = memExports.load8(off)
  selected.value = off
  status.value = `load8(${off}) = ${value.value}`
}

function pickCell(index: number) {
  selected.value = index
  address.value = index
  value.value = memBytes ? memBytes[index] : 0
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>线性内存：仓库里的货架</h3>
    <p class="desc">
      Wasm 用一块连续的"线性内存"存放数据，就像仓库的一排货架。内存按字节编号
      （0 ~ 65535），JS 与 Wasm 通过 <code>memory.buffer</code> 共享同一块存储，
      用 <code>store8</code> 上货、<code>load8</code> 取货。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="layout">
      <div class="shelf">
        <h4>🗄️ 内存字节视图（前 32 字节）</h4>
        <div class="shelf-rows">
          <div v-for="(row, r) in rows" :key="r" class="shelf-row">
            <span class="addr">{{ (r * 8).toString(16).padStart(4, '0') }}</span>
            <button
              v-for="(b, c) in row"
              :key="c"
              class="cell"
              :class="{ active: selected === r * 8 + c }"
              @click="pickCell(r * 8 + c)"
            >
              {{ b.toString(16).padStart(2, '0') }}
            </button>
          </div>
        </div>
        <p class="hint">点击任意格子选中地址，相当于直接查看该内存单元。</p>
      </div>

      <div class="controls">
        <h4>🛠️ 读写操作</h4>
        <label>地址（0~31）
          <input v-model.number="address" type="number" min="0" max="31" />
        </label>
        <label>数值（0~255）
          <input v-model.number="value" type="number" min="0" max="255" />
        </label>
        <div class="actions">
          <button @click="store">📦 写入 store8</button>
          <button @click="load">🔍 读取 load8</button>
        </div>
        <p class="status">{{ status }}</p>
      </div>
    </div>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>线性内存的最小单位是字节，地址从 0 开始连续编号</li>
        <li>Wasm 不能直接访问 <code>memory.buffer</code>，但 JS 能——两者天然共享</li>
        <li>越界读写不会破坏浏览器，引擎会抛出 <code>RuntimeError</code></li>
        <li>内存大小按页增长，1 页 = 64KiB</li>
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
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
}

.shelf,
.controls {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 14px;
}

.shelf-rows {
  display: grid;
  gap: 6px;
}

.shelf-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.addr {
  width: 42px;
  color: var(--muted);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 11px;
}

.cell {
  min-width: 34px;
  height: 30px;
  border: 1px solid var(--border) !important;
  border-radius: 4px !important;
  background: var(--surface-soft) !important;
  color: var(--text) !important;
  padding: 0 6px !important;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
}

.cell.active {
  border-color: var(--accent) !important;
  background: var(--accent) !important;
  color: #fff !important;
}

.hint {
  color: var(--muted);
  font-size: 12px;
}

.controls {
  display: grid;
  gap: 12px;
  align-content: start;
}

.controls label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  font-family: ui-monospace, Consolas, monospace;
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
