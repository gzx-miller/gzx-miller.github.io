<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getWasmBytes, hexDump, instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
const hex = ref('')
const result = ref<number | null>(null)
const status = ref('')
const size = ref(0)

// 一个最小的 Wasm 模块（add 函数）的二进制结构注解，供对照阅读
const structure = [
  { bytes: '00 61 73 6d', label: '魔数 "\\0asm"', desc: '每个 Wasm 模块都以这 4 字节开头' },
  { bytes: '01 00 00 00', label: '版本号 v1', desc: '4 字节小端整数，当前固定为 1' },
  { bytes: '01', label: '类型段(id=1)', desc: '声明函数签名 (i32,i32)->i32' },
  { bytes: '02', label: '导入段(id=2)', desc: '声明模块依赖的外部导入' },
  { bytes: '07', label: '导出段(id=7)', desc: '把内部函数导出为 add' },
  { bytes: '0a', label: '代码段(id=10)', desc: '存放函数体：local.get 0 + local.get 1 + i32.add' },
]

onMounted(async () => {
  const bytes = getWasmBytes('add')
  hex.value = hexDump(bytes, 0, 64)
  size.value = bytes.byteLength
  try {
    const instance = await instantiateWasm('add')
    result.value = instance.exports.add(2, 3) as number
    status.value = `模块 add 实例化成功：add(2, 3) = ${result.value}`
  } catch (e) {
    status.value = `实例化失败：${(e as Error).message}`
  }
})

const themeLabel = computed(() => (theme.value === 'light' ? '秋日暖阳' : '夜森林'))
</script>

<template>
  <div class="demo-card">
    <h3>什么是 WebAssembly：读懂模块这个"包裹"</h3>
    <p class="desc">
      WebAssembly 是一种可移植的字节码格式。一个 <code>.wasm</code> 文件本质上是
      按"段（section）"排列的二进制数据，浏览器负责解析并交给引擎执行。下面这段
      十六进制就是 <code>add</code> 模块的真实二进制。
    </p>

    <div class="toolbar">
      <span class="badge">模块体积 {{ size }} 字节</span>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="layout">
      <div class="panel">
        <h4>🧾 原始十六进制</h4>
        <pre class="hex-view">{{ hex }}</pre>
      </div>
      <div class="panel">
        <h4>📦 模块结构拆解</h4>
        <ul class="structure-list">
          <li v-for="item in structure" :key="item.label">
            <code class="hex">{{ item.bytes }}</code>
            <div>
              <strong>{{ item.label }}</strong>
              <p>{{ item.desc }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="result-row">
      <div class="status" :class="{ ok: result !== null }">{{ status }}</div>
    </div>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>魔数 <code>0x00 0x61 0x73 0x6d</code> 即 ASCII 的 "<code>\0asm</code>"</li>
        <li>模块由若干个段组成，段的 id 决定其用途（类型/导入/代码/导出等）</li>
        <li><code>WebAssembly.instantiate</code> 把字节码编译并实例化为可调用对象</li>
        <li>Wasm 运行在虚拟 ISA 上，不依赖具体 CPU，天然跨平台</li>
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
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  border-radius: 999px;
  background: rgba(255, 218, 159, 0.68);
  color: var(--chestnut);
  padding: 6px 10px;
  font-size: 13px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
  background: var(--surface);
}

.hex-view {
  margin: 0;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-all;
}

.structure-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.structure-list li {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 10px;
  align-items: start;
}

.structure-list .hex {
  font-size: 11px;
  color: var(--accent-strong);
}

.structure-list p {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.result-row {
  margin-top: 4px;
}

.status {
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 8px 12px;
  color: var(--muted);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 13px;
}

.status.ok {
  color: var(--forest);
  background: rgba(107, 176, 70, 0.14);
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
