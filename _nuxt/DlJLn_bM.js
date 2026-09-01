const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const prices = ref('12, 18, 30')
const result = ref<number | null>(null)
const status = ref('')

let memExports: any = null
let memBytes: Uint8Array | null = null

// sum 函数的 WAT（含参数与局部变量），配合讲解函数机制
const wat = \`;; 函数签名：(ptr, n) -> i32
(func $sum (param $ptr i32) (param $n i32) (result i32)
  (local $end i32)   ;; 局部变量：结束地址
  (local $acc i32)   ;; 局部变量：累加器
  local.get $ptr
  local.get $n
  i32.const 4
  i32.mul
  i32.add
  local.set $end

  i32.const 0
  local.set $acc

  (block $exit
    (loop $loop
      local.get $ptr
      local.get $end
      i32.ge_u
      br_if $exit

      local.get $acc
      local.get $ptr
      i32.load offset=0
      i32.add
      local.set $acc

      local.get $ptr
      i32.const 4
      i32.add
      local.set $ptr
      br $loop
    )
  )
  local.get $acc
)\`

onMounted(async () => {
  try {
    const instance = await instantiateWasm('mem')
    memExports = instance.exports
    memBytes = new Uint8Array(instance.exports.memory.buffer)
    status.value = 'mem 模块已加载：sum 函数按 4 字节累加一段 i32 数组'
    compute()
  } catch (e) {
    status.value = \`加载失败：\${(e as Error).message}\`
  }
})

function compute() {
  if (!memExports || !memBytes) return
  const list = prices.value
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n))
  if (list.length === 0) return
  const view = new DataView(memBytes.buffer)
  list.forEach((p, i) => view.setInt32(i * 4, p, true))
  result.value = memExports.sum(0, list.length)
  status.value = \`sum(ptr=0, n=\${list.length})：把 \${list.length} 个商品价格累加\`
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
<\/script>

<template>
  <div class="demo-card">
    <h3>函数与局部变量：结算函数 sum</h3>
    <p class="desc">
      Wasm 函数由"签名 + 参数 + 局部变量 + 指令体"组成。下面用 <code>sum</code>
      结算一笔购物车：它接收指针和数量两个参数，用两个局部变量（结束地址、累加器）
      完成循环累加，最终返回合计。
    </p>

    <div class="toolbar">
      <label class="input-line">
        🛒 商品价格（逗号分隔）
        <input v-model="prices" type="text" @keyup.enter="compute" />
      </label>
      <button @click="compute">💸 结算</button>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="layout">
      <div class="panel">
        <h4>🔢 sum 的 WAT 源码</h4>
        <pre class="wat"><code>{{ wat }}</code></pre>
      </div>
      <div class="panel result-panel">
        <h4>🧮 结算结果</h4>
        <div class="big-result">
          <span>合计</span>
          <code>{{ result ?? '…' }}</code>
        </div>
        <ul class="anatomy">
          <li><strong>参数</strong>：ptr（数组起始地址）、n（元素个数）</li>
          <li><strong>局部变量</strong>：end（结束地址）、acc（累加器）</li>
          <li><strong>返回值</strong>：i32，压入结果后 <code>return</code></li>
        </ul>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>参数与局部变量同属"函数局部索引空间"，<code>local.get/set</code> 按索引访问</li>
        <li>函数在执行时使用独立的栈帧，调用结束后局部变量被回收</li>
        <li>返回值在函数体末尾用 <code>0b</code>（end）收尾</li>
        <li>类型安全：参数/局部/返回的类型必须与签名严格一致</li>
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

.layout {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
}

.panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 14px;
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

.big-result {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 14px 16px;
}

.big-result span {
  color: var(--muted);
}

.big-result code {
  color: var(--accent-strong);
  font-size: 26px;
  font-weight: 700;
}

.anatomy {
  margin: 12px 0 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.8;
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

@media (max-width: 720px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
`;export{n as default};
