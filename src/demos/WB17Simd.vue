<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const a = ref('12, 18, 30, 45')
const b = ref('8, 2, 10, 5')
const sum = ref<number[]>([])
const status = ref('')

let simdExports: any = null
let memView: Int32Array | null = null

onMounted(async () => {
  try {
    const instance = await instantiateWasm('simd')
    simdExports = instance.exports
    memView = new Int32Array(instance.exports.memory.buffer)
    status.value = 'simd 模块已加载：vadd 一次性完成 4 路 i32 加法'
    compute()
  } catch (e) {
    status.value = `加载失败：${(e as Error).message}（浏览器需支持 SIMD）`
  }
})

function compute() {
  if (!simdExports || !memView) return
  const av = a.value.split(',').map((s) => Number(s.trim()) | 0).slice(0, 4)
  const bv = b.value.split(',').map((s) => Number(s.trim()) | 0).slice(0, 4)
  while (av.length < 4) av.push(0)
  while (bv.length < 4) bv.push(0)
  // a @ 0, b @ 16(4*i32), dest @ 32
  for (let i = 0; i < 4; i++) memView[i] = av[i]
  for (let i = 0; i < 4; i++) memView[4 + i] = bv[i]
  simdExports.vadd(32, 0, 16)
  const res: number[] = []
  for (let i = 0; i < 4; i++) res.push(memView[8 + i])
  sum.value = res
  status.value = 'vadd(32, 0, 16)：一条指令完成 4 路 i32.add'
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>SIMD 向量指令：一次给四件商品调价</h3>
    <p class="desc">
      SIMD（单指令多数据）让一条 <code>i32x4.add</code> 同时完成 4 个通道的加法，
      适合逐像素、逐元素的大批量运算。下面把两组 4 元素数组分别放入内存，用一条指令
      得到 4 个结果。
    </p>

    <div class="toolbar">
      <label class="input-line">
        数组 A（4 个整数）
        <input v-model="a" type="text" @keyup.enter="compute" />
      </label>
      <label class="input-line">
        数组 B（4 个整数）
        <input v-model="b" type="text" @keyup.enter="compute" />
      </label>
      <button @click="compute">⚡ 执行 vadd</button>
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="simd-visual">
      <div v-for="i in 4" :key="i" class="lane-group">
        <div class="lane">
          <span class="lane-label">lane{{ i - 1 }}</span>
          <code class="lane-val">{{ a.split(',')[i - 1]?.trim() ?? 0 }}</code>
          <code class="lane-op">+</code>
          <code class="lane-val">{{ b.split(',')[i - 1]?.trim() ?? 0 }}</code>
        </div>
        <div class="lane-result">
          <code>{{ sum[i - 1] ?? '…' }}</code>
        </div>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>v128 类型打包 4 个 i32（或 8 个 i16、16 个 i8、4 个 f32）</li>
        <li>常用指令：<code>i32x4.add</code>、<code>f32x4.mul</code>、<code>v128.load/store</code></li>
        <li>适合图像处理、音频、矩阵运算等数据并行场景</li>
        <li>无 SIMD 的浏览器会抛 <code>CompileError</code>，需要能力检测</li>
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
  min-width: 150px;
}

.simd-visual {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.lane-group {
  display: grid;
  gap: 8px;
}

.lane {
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 8px;
  display: grid;
  gap: 4px;
  justify-items: center;
}

.lane-label {
  color: var(--muted);
  font-size: 11px;
}

.lane-val {
  color: var(--text);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 14px;
}

.lane-op {
  color: var(--accent);
  font-weight: 700;
}

.lane-result {
  border-radius: 6px;
  background: rgba(255, 218, 159, 0.5);
  padding: 8px;
  text-align: center;
}

.lane-result code {
  color: var(--accent-strong);
  font-size: 18px;
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

@media (max-width: 680px) {
  .simd-visual {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
