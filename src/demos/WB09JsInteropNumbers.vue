<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const a = ref('3.9')
const b = ref('2.1')
const receivedA = ref<number | null>(null)
const receivedB = ref<number | null>(null)
const result = ref<number | null>(null)
const status = ref('')

let addExports: any = null

onMounted(async () => {
  try {
    const instance = await instantiateWasm('add')
    addExports = instance.exports
    status.value = 'add 模块已加载：函数签名 (i32, i32) -> i32'
    compute()
  } catch (e) {
    status.value = `加载失败：${(e as Error).message}`
  }
})

function compute() {
  if (!addExports) return
  const av = Number(a.value) || 0
  const bv = Number(b.value) || 0
  // JS 数值跨 i32 边界时被 ToInt32 截断为 32 位整数
  receivedA.value = av | 0
  receivedB.value = bv | 0
  result.value = addExports.add(av, bv)
  status.value = `add(${av}, ${bv})：JS 数值 → Wasm 按 i32 截断后相加`
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>JS 与 Wasm 数值互操作：下单数量取整</h3>
    <p class="desc">
      浏览器把 JS 数值传给 Wasm 时会按函数签名做类型转换：i32 会经
      <code>ToInt32</code> 截断（小数丢弃、超出 32 位取低 32 位）。模拟一次下单，
      看看 <code>3.9</code> 这样的"件数"进入 Wasm 后变成了多少。
    </p>

    <div class="toolbar">
      <label class="input-line">
        件数 A
        <input v-model="a" type="number" step="0.1" @input="compute" />
      </label>
      <label class="input-line">
        件数 B
        <input v-model="b" type="number" step="0.1" @input="compute" />
      </label>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="flow">
      <div class="flow-card">
        <span>JS 传入</span>
        <code>{{ a }} + {{ b }}</code>
      </div>
      <div class="arrow">→</div>
      <div class="flow-card">
        <span>Wasm 接收（ToInt32）</span>
        <code>{{ receivedA }} + {{ receivedB }}</code>
      </div>
      <div class="arrow">→</div>
      <div class="flow-card result">
        <span>add 结果</span>
        <code>{{ result }}</code>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="i64-note">
      <strong>💡 大数怎么办？</strong>
      <p>
        i64 不能由普通 number 表示。若模块的签名是 <code>(i64, i64) -> i64</code>，
        JS 必须用 <code>BigInt</code>（如 <code>10n</code>）传参，返回的也是
        <code>BigInt</code>，需要 <code>Number()</code> 转回普通数字。
      </p>
    </div>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>整数截断：小数直接丢弃（非四舍五入），即 <code>3.9 → 3</code></li>
        <li>f32 传入会做精度降级：<code>0.1</code> 存成 f32 后不再是精确的 0.1</li>
        <li>i64 ↔ BigInt 是一对一的，不会丢精度</li>
        <li>引用类型（对象等）不能直接传，需要内存指针或 externref</li>
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
  width: 130px;
}

.flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 8px;
}

.flow-card {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 12px;
  display: grid;
  gap: 6px;
  text-align: center;
}

.flow-card span {
  color: var(--muted);
  font-size: 12px;
}

.flow-card code {
  color: var(--text);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 15px;
}

.flow-card.result {
  background: rgba(255, 218, 159, 0.5);
}

.flow-card.result code {
  color: var(--accent-strong);
  font-weight: 700;
}

.arrow {
  color: var(--muted);
}

.status {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.i64-note {
  border-radius: 8px;
  background: rgba(107, 176, 70, 0.12);
  padding: 10px 14px;
  color: var(--forest);
}

.i64-note p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
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

@media (max-width: 680px) {
  .flow {
    grid-template-columns: 1fr;
  }

  .arrow {
    text-align: center;
  }
}
</style>
