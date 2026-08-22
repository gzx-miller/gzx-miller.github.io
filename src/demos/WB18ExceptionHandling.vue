<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const a = ref('10')
const b = ref('0')
const result = ref<number | null>(null)
const errorInfo = ref('')
const status = ref('')

let ehExports: any = null
let tag: WebAssembly.Tag | null = null

onMounted(async () => {
  try {
    const instance = await instantiateWasm('eh')
    ehExports = instance.exports
    tag = instance.exports.e
    status.value = 'eh 模块已加载：导出 div 与异常标签 e'
    compute()
  } catch (e) {
    status.value = `加载失败：${(e as Error).message}（浏览器需支持异常处理提案）`
  }
})

function compute() {
  if (!ehExports || !tag) return
  const av = Number(a.value) | 0
  const bv = Number(b.value) | 0
  errorInfo.value = ''
  result.value = null
  try {
    result.value = ehExports.div(av, bv)
    status.value = `div(${av}, ${bv}) 正常返回 ${result.value}`
  } catch (e) {
    // WebAssembly.Exception 带 tag，可判定来源并取出 payload
    if (e instanceof WebAssembly.Exception && e.is(tag)) {
      const payload = e.getArg(tag, 0)
      errorInfo.value = `除零异常：Wasm 抛出 tag "e"，携带负载 ${payload}`
      status.value = `div(${av}, ${bv}) 触发异常，已由 JS 捕获`
    } else {
      errorInfo.value = `其他错误：${(e as Error).message}`
      status.value = '发生了非自定义异常'
    }
  }
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>异常处理：分单除零保护</h3>
    <p class="desc">
      Wasm 可用 <code>tag</code> + <code>throw</code> 主动抛异常。下面的
      <code>div(a, b)</code> 在除数为 0 时抛出携带负载的异常，JS 用
      <code>WebAssembly.Exception</code> 捕获并取出数据。
    </p>

    <div class="toolbar">
      <label class="input-line">
        被除数 A
        <input v-model.number="a" type="number" @input="compute" />
      </label>
      <label class="input-line">
        除数 B
        <input v-model.number="b" type="number" @input="compute" />
      </label>
      <button @click="compute">🧮 执行 div</button>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="result-box">
      <div class="result-line">
        <span>div({{ a || 0 }}, {{ b || 0 }})</span>
        <code class="value">{{ result ?? '—' }}</code>
      </div>
      <div v-if="errorInfo" class="error-badge">⚠️ {{ errorInfo }}</div>
      <div v-else-if="result !== null" class="ok-badge">✅ 正常返回</div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>tag 定义异常"类型"，throw 时携带若干 payload 参数</li>
        <li>JS 侧捕获的是 <code>WebAssembly.Exception</code>，可用 <code>e.is(tag)</code> 判断</li>
        <li>Wasm 内部也可用 <code>try/catch</code> 处理，无需回到 JS</li>
        <li>异常不会破坏调用栈，支持跨 Wasm/JS 边界传递</li>
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
  gap: 12px;
  flex-wrap: wrap;
}

.input-line {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}

.input-line input {
  width: 110px;
}

.result-box {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 16px;
  display: grid;
  gap: 12px;
}

.result-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.result-line span {
  color: var(--muted);
  font-family: ui-monospace, Consolas, monospace;
}

.result-line .value {
  color: var(--accent-strong);
  font-size: 30px;
  font-weight: 800;
}

.error-badge {
  border-radius: 6px;
  background: rgba(217, 75, 38, 0.14);
  color: var(--leaf-red);
  padding: 10px 12px;
  font-size: 13px;
}

.ok-badge {
  border-radius: 6px;
  background: rgba(107, 176, 70, 0.14);
  color: var(--forest);
  padding: 10px 12px;
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
</style>
