const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const prices = ref('15, 28, 9, 46, 22')
const result = ref<number | null>(null)
const bars = ref<number[]>([])
const memoryHex = ref('')
const status = ref('')

let memExports: any = null
let memBytes: Uint8Array | null = null

onMounted(async () => {
  try {
    const instance = await instantiateWasm('mem')
    memExports = instance.exports
    memBytes = new Uint8Array(instance.exports.memory.buffer)
    status.value = 'mem 模块已加载：线性内存按 4 字节对齐存放 i32 数组'
    compute()
  } catch (e) {
    status.value = \`加载失败：\${(e as Error).message}\`
  }
})

function compute() {
  if (!memExports || !memBytes) return
  const list = prices.value
    .split(',')
    .map((s) => Number(s.trim()) | 0)
    .filter((n) => !Number.isNaN(n))
    .slice(0, 8)
  if (list.length === 0) return
  const view = new DataView(memBytes.buffer)
  memBytes.fill(0, 0, 64)
  list.forEach((p, i) => view.setInt32(i * 4, p, true))
  result.value = memExports.sum(0, list.length)
  bars.value = list
  memoryHex.value = Array.from(memBytes.slice(0, list.length * 4))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
  status.value = \`购物车 \${list.length} 件商品已写入内存，sum 返回合计 \${result.value}\`
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
const maxBar = computed(() => Math.max(...bars.value, 1))
<\/script>

<template>
  <div class="demo-card">
    <h3>内存中的数组：购物车价目与求和</h3>
    <p class="desc">
      数组在 Wasm 里没有专门类型，就是把元素按固定步长连续摆在内存里：这里每个 i32
      占 4 字节。把购物车价格写入内存后，交给 <code>sum</code> 累加，同时可视化数组分布。
    </p>

    <div class="toolbar">
      <label class="input-line">
        🛒 商品价格（逗号分隔，最多 8 项）
        <input v-model="prices" type="text" @keyup.enter="compute" />
      </label>
      <button @click="compute">📊 写入并求和</button>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="chart-panel">
      <h4>📈 内存中的 i32 数组（每个格子 4 字节）</h4>
      <div class="bars">
        <div v-for="(p, i) in bars" :key="i" class="bar-col">
          <div
            class="bar"
            :style="{ height: \`\${(p / maxBar) * 120}px\` }"
            :title="\`offset=\${i * 4}  value=\${p}\`"
          ></div>
          <span class="bar-val">{{ p }}</span>
        </div>
      </div>
      <pre class="mem-hex">{{ memoryHex }}</pre>
    </div>

    <div class="total">
      <span>sum(ptr=0, n={{ bars.length }})</span>
      <code>{{ result ?? '…' }}</code>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>数组 = 一段连续内存 + 起始地址 + 元素个数，无元数据开销</li>
        <li>i32 对齐到 4 字节：第 i 个元素地址是 <code>ptr + i * 4</code></li>
        <li>JS 用 <code>DataView</code> 按小端读写 <code>setInt32/getInt32</code></li>
        <li>越界访问会触发 <code>RuntimeError</code>，天然防缓冲区溢出</li>
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
  align-items: end;
  gap: 10px;
  flex-wrap: wrap;
}

.input-line {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}

.input-line input {
  min-width: 260px;
}

.chart-panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 14px;
  display: grid;
  gap: 12px;
}

.bars {
  display: flex;
  align-items: end;
  gap: 12px;
  min-height: 130px;
}

.bar-col {
  display: grid;
  gap: 4px;
  justify-items: center;
}

.bar {
  width: 34px;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(180deg, var(--leaf-orange), var(--leaf-red));
  transition: height 0.3s ease;
}

.bar-val {
  color: var(--muted);
  font-size: 12px;
}

.mem-hex {
  margin: 0;
  color: var(--accent-strong);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

.total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-radius: 8px;
  background: rgba(255, 218, 159, 0.5);
  padding: 14px 16px;
}

.total span {
  color: var(--muted);
  font-family: ui-monospace, Consolas, monospace;
}

.total code {
  color: var(--accent-strong);
  font-size: 26px;
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
</style>
`;export{n as default};
