const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const status = ref('')
const mulResult = ref<number | null>(null)
const faddResult = ref<number | null>(null)

// 值类型速查表
const types = [
  { name: 'i32', size: 32, desc: '32 位有符号整数，价格、数量、索引' },
  { name: 'i64', size: 64, desc: '64 位整数，与 JS 交互必须用 BigInt' },
  { name: 'f32', size: 32, desc: '32 位单精度浮点，普通商品单价' },
  { name: 'f64', size: 64, desc: '64 位双精度浮点，精确计算与 JS 一致' },
]

onMounted(async () => {
  try {
    const instance = await instantiateWasm('calc')
    mulResult.value = instance.exports.mul(6, 7) as number
    faddResult.value = instance.exports.fadd(1.5, 2.25) as number
    status.value = 'calc 模块已加载：内含 i32 与 f32 两类函数的签名'
  } catch (e) {
    status.value = \`加载失败：\${(e as Error).message}\`
  }
})

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
<\/script>

<template>
  <div class="demo-card">
    <h3>值类型与类型系统</h3>
    <p class="desc">
      WebAssembly 只有四种数值类型：<code>i32</code>、<code>i64</code>、
      <code>f32</code>、<code>f64</code>。所有函数签名、局部变量、内存操作都必须声明类型，
      类型是 Wasm 能被高效编译和验证的基础。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="type-grid">
      <div v-for="t in types" :key="t.name" class="type-card">
        <strong>{{ t.name }}</strong>
        <span>{{ t.size }} 位</span>
        <p>{{ t.desc }}</p>
      </div>
    </div>

    <div class="result-row">
      <div class="result-card">
        <span class="label">i32 函数 mul(6, 7)</span>
        <code>{{ mulResult ?? '…' }}</code>
      </div>
      <div class="result-card">
        <span class="label">f32 函数 fadd(1.5, 2.25)</span>
        <code>{{ faddResult ?? '…' }}</code>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>i64 作为参数/返回值时，JS 侧必须使用 <code>BigInt</code> 传输</li>
        <li>f32 与 f64 精度不同，价格计算建议用 f64 避免累计误差</li>
        <li>类型信息写在类型段，函数只引用类型的索引</li>
        <li>Wasm 没有字符串、对象、null，它们都要通过内存或引用类型表达</li>
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

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.type-card {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 12px;
}

.type-card strong {
  color: var(--accent-strong);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 15px;
}

.type-card span {
  float: right;
  color: var(--muted);
  font-size: 12px;
}

.type-card p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.result-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.result-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 10px 12px;
}

.result-card .label {
  color: var(--muted);
  font-size: 13px;
}

.result-card code {
  color: var(--forest);
  font-size: 16px;
  font-weight: 600;
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

@media (max-width: 600px) {
  .result-row {
    grid-template-columns: 1fr;
  }
}
</style>
`;export{n as default};
