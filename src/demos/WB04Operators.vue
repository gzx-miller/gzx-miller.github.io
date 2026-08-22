<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const ops = [
  { key: 'mul', label: '乘法 mul', op: '*' },
  { key: 'div', label: '整除 div_s', op: '/' },
  { key: 'xor', label: '异或 xor', op: '^' },
  { key: 'shl', label: '左移 shl', op: '<<' },
  { key: 'fadd', label: '浮点加 f32.add', op: '+' },
]

const a = ref('12')
const b = ref('4')
const result = ref<number | null>(null)
const activeOp = ref('mul')
const status = ref('')

let exports: any = null

onMounted(async () => {
  try {
    const instance = await instantiateWasm('calc')
    exports = instance.exports
    status.value = 'calc 模块已加载（5 个运算函数全部可用）'
    compute()
  } catch (e) {
    status.value = `加载失败：${(e as Error).message}`
  }
})

function compute() {
  if (!exports) return
  const av = Number(a.value) || 0
  const bv = Number(b.value) || 0
  try {
    if (activeOp.value === 'fadd') {
      result.value = exports.fadd(av, bv)
    } else {
      result.value = exports[activeOp.value](av | 0, bv | 0)
    }
  } catch (e) {
    result.value = null
    status.value = `运算失败：${(e as Error).message}`
  }
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>运算指令集：为订单打个折</h3>
    <p class="desc">
      以"折扣计算"为场景体验 Wasm 的运算指令：整数乘法、整除、位运算、左移、浮点加法
      全部在 <code>calc</code> 模块里由引擎直接执行。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="calc-box">
      <div class="inputs">
        <label>操作数 A
          <input v-model="a" type="number" @input="compute" />
        </label>
        <label>操作数 B
          <input v-model="b" type="number" @input="compute" />
        </label>
      </div>

      <div class="op-picker">
        <button
          v-for="op in ops"
          :key="op.key"
          class="op-btn"
          :class="{ active: activeOp === op.key }"
          @click="activeOp = op.key; compute()"
        >
          {{ op.label }}
        </button>
      </div>

      <div class="result-line">
        <span>{{ a || 0 }} {{ ops.find((o) => o.key === activeOp)?.op }} {{ b || 0 }}</span>
        <code>= {{ result ?? '…' }}</code>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>整数指令对栈上的两个 i32 操作：<code>6a</code> 加法、<code>6c</code> 乘法、<code>6d</code> 整除</li>
        <li>位运算：<code>73</code> 异或、<code>74</code> 左移（移位数需小于 32）</li>
        <li>浮点指令独立命名空间：<code>92</code> 是 <code>f32.add</code></li>
        <li>除数 / 移位数错误不会让进程崩溃，而是由引擎抛出运行时异常</li>
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

.calc-box {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 16px;
  display: grid;
  gap: 14px;
}

.inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.inputs label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}

.op-picker {
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

.result-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 12px 14px;
}

.result-line span {
  color: var(--muted);
  font-family: ui-monospace, Consolas, monospace;
}

.result-line code {
  color: var(--forest);
  font-size: 20px;
  font-weight: 700;
}

.status {
  color: var(--muted);
  font-size: 13px;
  margin: 0;
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

@media (max-width: 560px) {
  .inputs {
    grid-template-columns: 1fr;
  }
}
</style>
