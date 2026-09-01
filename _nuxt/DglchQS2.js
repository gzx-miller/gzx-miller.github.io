const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const text = ref('squirrel hazelnut')
const length = ref(0)
const upper = ref('')
const memoryBytes = ref('')
const status = ref('')

let strExports: any = null
let memBytes: Uint8Array | null = null

onMounted(async () => {
  try {
    const instance = await instantiateWasm('str')
    strExports = instance.exports
    memBytes = new Uint8Array(instance.exports.memory.buffer)
    status.value = 'str 模块已加载：导出 strlen / toupper（内存中处理 C 风格字符串）'
    process()
  } catch (e) {
    status.value = \`加载失败：\${(e as Error).message}\`
  }
})

function process() {
  if (!strExports || !memBytes) return
  const str = text.value
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  memBytes.fill(0, 0, 64)
  memBytes.set(data, 0)
  memBytes[data.length] = 0 // 以 \\0 结尾
  length.value = strExports.strlen(0)
  strExports.toupper(0)
  upper.value = new TextDecoder().decode(memBytes.slice(0, data.length))
  memoryBytes.value = Array.from(memBytes.slice(0, 16))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
  status.value = '已写入内存 → strlen → toupper 全流程完成'
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
<\/script>

<template>
  <div class="demo-card">
    <h3>字符串互操作：把收货地址转大写</h3>
    <p class="desc">
      Wasm 没有字符串类型，只能用"内存地址 + 长度/结束符"表达。下面的地址文本会被
      写入线性内存，交给 Wasm 的 <code>strlen</code> 数长度、<code>toupper</code>
      原地转大写，再由 JS 读回展示。
    </p>

    <div class="toolbar">
      <label class="input-line">
        📮 收货地址
        <input v-model="text" type="text" @keyup.enter="process" />
      </label>
      <button @click="process">🚀 交给 Wasm 处理</button>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="result-grid">
      <div class="result-card">
        <span class="label">原始文本</span>
        <code>{{ text }}</code>
      </div>
      <div class="result-card">
        <span class="label">strlen 长度</span>
        <code>{{ length }}</code>
      </div>
      <div class="result-card highlight">
        <span class="label">toupper 结果</span>
        <code>{{ upper }}</code>
      </div>
    </div>

    <div class="mem-panel">
      <h4>🧾 内存前 16 字节（Wasm 视角）</h4>
      <pre class="hex">{{ memoryBytes }}</pre>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>C 风格字符串以 <code>\\\\0</code> 结尾，<code>strlen</code> 数到 <code>\\\\0</code> 为止</li>
        <li>Wasm 通过指针（内存偏移量）引用字符串，JS 用 <code>TextEncoder/TextDecoder</code> 转换</li>
        <li><code>toupper</code> 是"原地修改"——不产生新字符串，直接改内存字节</li>
        <li>更现代的做法是 wasm-bindgen 等工具自动生成字符串编解码胶水代码</li>
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
  min-width: 240px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.result-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 10px 12px;
}

.result-card .label {
  color: var(--muted);
  font-size: 12px;
}

.result-card code {
  color: var(--text);
  word-break: break-all;
}

.result-card.highlight {
  background: rgba(255, 218, 159, 0.5);
}

.result-card.highlight code {
  color: var(--forest);
  font-weight: 600;
}

.mem-panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 12px 14px;
}

.mem-panel .hex {
  margin: 0;
  color: var(--accent-strong);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 13px;
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

@media (max-width: 640px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
}
</style>
`;export{n as default};
