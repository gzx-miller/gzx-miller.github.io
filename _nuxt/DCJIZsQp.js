const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const n = ref(30)
const wasmTime = ref(0)
const jsTime = ref(0)
const wasmResult = ref<number | null>(null)
const jsResult = ref<number | null>(null)
const runs = ref(3)
const status = ref('')

let fibExports: any = null

// JS 版本递归斐波那契（与 Wasm 逻辑一致）
function fibJs(v: number): number {
  if (v < 2) return v
  return fibJs(v - 1) + fibJs(v - 2)
}

onMounted(async () => {
  try {
    const instance = await instantiateWasm('fib')
    fibExports = instance.exports
    status.value = 'fib 模块已加载：同一算法对比 Wasm 与 JS 执行耗时'
    run()
  } catch (e) {
    status.value = \`加载失败：\${(e as Error).message}\`
  }
})

function measure(v: number, fn: (x: number) => number): { result: number; ms: number } {
  // 预热，取多次运行的最小值以排除 JIT 波动
  fn(v)
  let best = Infinity
  let result = 0
  const count = Math.max(1, Math.min(10, runs.value | 0))
  for (let i = 0; i < count; i++) {
    const t0 = performance.now()
    result = fn(v)
    const dt = performance.now() - t0
    if (dt < best) best = dt
  }
  return { result, ms: best }
}

function run() {
  if (!fibExports) return
  const v = Math.max(0, Math.min(34, Number(n.value) | 0))
  const w = measure(v, (x) => fibExports.fib(x) as number)
  const j = measure(v, (x) => fibJs(x))
  wasmResult.value = w.result
  wasmTime.value = w.ms
  jsResult.value = j.result
  jsTime.value = j.ms
  const ratio = w.ms > 0 ? (j.ms / w.ms).toFixed(1) : '—'
  status.value = \`fib(\${v})：JS 耗时是 Wasm 的 \${ratio} 倍（取 \${runs} 次最小值）\`
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
const maxTime = computed(() => Math.max(wasmTime.value, jsTime.value, 0.1))
<\/script>

<template>
  <div class="demo-card">
    <h3>性能对比：Wasm 与 JS 谁的订单计算快</h3>
    <p class="desc">
      对同一递归算法分别用 Wasm 与 JS 执行，比较耗时。Wasm 是预编译字节码，通常更稳定
      可预测；JS 依赖 JIT 预热。注意：计算密集且热点稳定时 Wasm 优势明显。
    </p>

    <div class="toolbar">
      <label class="input-line">
        fib 参数 n（0~34）
        <input v-model.number="n" type="number" min="0" max="34" @input="run" />
      </label>
      <label class="input-line">
        取样次数
        <input v-model.number="runs" type="number" min="1" max="10" @input="run" />
      </label>
      <button @click="run">⚡ 重新测量</button>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="chart">
      <div class="bar-row" v-for="row in [
        { label: 'Wasm', time: wasmTime, result: wasmResult, cls: 'wasm' },
        { label: 'JS', time: jsTime, result: jsResult, cls: 'js' },
      ]" :key="row.label">
        <span class="bar-label">{{ row.label }}</span>
        <div class="bar-track">
          <div
            class="bar"
            :class="row.cls"
            :style="{ width: \`\${Math.min((row.time / maxTime) * 100, 100)}%\` }"
          ></div>
        </div>
        <code class="bar-time">{{ row.time.toFixed(2) }} ms</code>
      </div>
    </div>

    <div class="result-line">
      <span>结果一致校验</span>
      <code>{{ wasmResult !== null && wasmResult === jsResult ? '✅ 两版结果相同' : '…' }}</code>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>Wasm 编译产物接近机器码，执行路径更可预测</li>
        <li>JS 经过 JIT 预热后也能很快，短小逻辑差距不大</li>
        <li>跨边界调用有开销：小函数频繁调用反而更慢</li>
        <li>选型建议：计算密集、可复用、需要稳定性能的模块用 Wasm</li>
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
  width: 90px;
}

.chart {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 16px;
  display: grid;
  gap: 14px;
}

.bar-row {
  display: grid;
  grid-template-columns: 56px 1fr 90px;
  align-items: center;
  gap: 10px;
}

.bar-label {
  color: var(--muted);
  font-size: 13px;
}

.bar-track {
  height: 22px;
  border-radius: 6px;
  background: var(--surface-soft);
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s ease;
}

.bar.wasm {
  background: linear-gradient(90deg, var(--forest), var(--leaf-gold));
}

.bar.js {
  background: linear-gradient(90deg, var(--leaf-orange), var(--leaf-red));
}

.bar-time {
  color: var(--text);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 13px;
  text-align: right;
}

.result-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  background: rgba(255, 218, 159, 0.4);
  padding: 12px 14px;
}

.result-line span {
  color: var(--muted);
}

.result-line code {
  color: var(--forest);
  font-weight: 600;
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

@media (max-width: 560px) {
  .bar-row {
    grid-template-columns: 44px 1fr;
  }

  .bar-time {
    grid-column: 2;
    text-align: left;
  }
}
</style>
`;export{n as default};
