<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const n = ref(10)
const result = ref<number | null>(null)
const status = ref('')

let fibExports: any = null

// fib 的 WAT，展示 if/else 结构
const wat = `;; 递归斐波那契：n < 2 返回 n，否则 fib(n-1)+fib(n-2)
(func $fib (param $n i32) (result i32)
  local.get $n
  i32.const 2
  i32.lt_u          ;; n < 2 ?
  if (result i32)
    local.get $n    ;; 是 → 直接返回 n
  else
    local.get $n
    i32.const 1
    i32.sub
    call $fib       ;; fib(n-1)

    local.get $n
    i32.const 2
    i32.sub
    call $fib       ;; fib(n-2)
    i32.add         ;; 两者相加
  end
)`

// 常见控制流指令
const constructs = [
  { name: 'block', desc: '定义一个代码块，可被 br 跳出（不带参数）' },
  { name: 'loop', desc: '定义一个循环体，br 回跳实现迭代' },
  { name: 'if / else / end', desc: '条件分支，可带 result 类型返回值' },
  { name: 'br / br_if', desc: '无条件 / 条件跳转，按标签深度索引' },
  { name: 'call', desc: '直接调用函数；call_indirect 则按表索引调用' },
]

onMounted(async () => {
  try {
    const instance = await instantiateWasm('fib')
    fibExports = instance.exports
    status.value = 'fib 模块已加载：递归函数演示 if / else / call'
    compute()
  } catch (e) {
    status.value = `加载失败：${(e as Error).message}`
  }
})

function compute() {
  if (!fibExports) return
  const v = Math.max(0, Math.min(30, Number(n.value) | 0))
  result.value = fibExports.fib(v)
  status.value = `fib(${v}) = ${result.value}（递归调用了 ${fibCallCount(v)} 次 fib）`
}

// 统计递归调用次数：F(n) 的调用次数 = F(n-1) + F(n-2) + 1
function fibCallCount(v: number): number {
  if (v < 2) return 1
  return fibCallCount(v - 1) + fibCallCount(v - 2) + 1
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>控制流：if / loop / br</h3>
    <p class="desc">
      Wasm 只有三种结构化控制流：<code>block</code>、<code>loop</code>、
      <code>if/else</code>，配合 <code>br</code> 跳转。用递归的斐波那契看 <code>if/else</code>
      的用法，体会分支与函数调用的配合。
    </p>

    <div class="toolbar">
      <label class="input-line">
        输入 n（0~30）
        <input v-model.number="n" type="number" min="0" max="30" @input="compute" />
      </label>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="layout">
      <div class="panel">
        <h4>🔀 fib 的 WAT（if / else）</h4>
        <pre class="wat"><code>{{ wat }}</code></pre>
      </div>
      <div class="panel">
        <h4>🧭 控制流指令一览</h4>
        <ul class="constructs">
          <li v-for="c in constructs" :key="c.name">
            <strong>{{ c.name }}</strong>
            <span>{{ c.desc }}</span>
          </li>
        </ul>
        <div class="big-result">
          <span>fib({{ n }})</span>
          <code>{{ result ?? '…' }}</code>
        </div>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>没有 <code>goto</code>，跳转被限定在结构化块内，便于验证与优化</li>
        <li><code>if</code> 需要以 <code>end</code> 收尾，可带 result 类型</li>
        <li><code>loop</code> 的 <code>br 0</code> 表示跳回循环体开头</li>
        <li>深递归会占用调用栈，超大 <code>n</code> 可能触发栈溢出异常</li>
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
  width: 120px;
}

.layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
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

.wat {
  margin: 0;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
  line-height: 1.7;
  color: var(--forest);
  white-space: pre-wrap;
  overflow-x: auto;
}

.constructs {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.constructs li {
  display: grid;
  gap: 2px;
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 8px 10px;
}

.constructs strong {
  color: var(--accent-strong);
  font-family: ui-monospace, Consolas, monospace;
}

.constructs span {
  color: var(--muted);
  font-size: 12px;
}

.big-result {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-radius: 6px;
  background: rgba(255, 218, 159, 0.5);
  padding: 12px 14px;
}

.big-result span {
  color: var(--muted);
}

.big-result code {
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

@media (max-width: 720px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
