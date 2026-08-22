<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getWasmBytes, getWasmSize } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const result = ref<number | null>(null)
const size = ref(0)
const step = ref(0)
const status = ref('')

const steps = [
  { name: '编写源码', desc: '用 C/Rust/AssemblyScript 编写业务逻辑，或手写 WAT' },
  { name: '编译成 .wasm', desc: 'clang / rustc / asc / wat2wasm 等工具链输出二进制' },
  { name: '编译为 Module', desc: 'WebAssembly.compile 校验并编译，得到不可变的 Module' },
  { name: '实例化 Instance', desc: 'WebAssembly.instantiate 注入导入并生成可调用实例' },
  { name: '部署与调用', desc: '随静态资源发布，加载后即可调用 exports.add 等函数' },
]

onMounted(async () => {
  size.value = getWasmSize('add')
  try {
    // instantiateStreaming 边下载边编译（这里用 Blob 模拟网络响应）
    const response = new Response(getWasmBytes('add').buffer as ArrayBuffer)
    const { instance } = await WebAssembly.instantiateStreaming(response)
    result.value = (instance.exports.add as (a: number, b: number) => number)(2, 3)
    status.value = `add 模块 ${size.value} 字节，流式编译 + 实例化成功：add(2,3)=${result.value}`
    step.value = steps.length - 1
  } catch (e) {
    status.value = `加载失败：${(e as Error).message}`
  }
})

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>工具链与部署：从源码到线上</h3>
    <p class="desc">
      一个 Wasm 应用的生命周期：源码 → 编译器 → 二进制 → 编译/实例化 → 部署。这里用
      <code>instantiateStreaming</code> 演示生产级的加载方式（边下载边编译）。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
      <span class="badge">模块体积 {{ size }} 字节</span>
    </div>

    <ol class="steps">
      <li
        v-for="(s, i) in steps"
        :key="s.name"
        :class="{ done: i <= step }"
      >
        <span class="step-idx">{{ i + 1 }}</span>
        <div>
          <strong>{{ s.name }}</strong>
          <p>{{ s.desc }}</p>
        </div>
        <span v-if="i < step" class="check">✓</span>
      </li>
    </ol>

    <div class="result-line">
      <span>最终调用</span>
      <code>add(2, 3) = {{ result ?? '…' }}</code>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>常用工具链：wabt（wat2wasm）、emscripten（C/C++）、rustc（wasm32-unknown-unknown）、AssemblyScript</li>
        <li><code>instantiateStreaming</code> 能并行下载与编译，比 <code>instantiate</code> 更快</li>
        <li>Module 可缓存复用（如 <code>WebAssembly.Module</code> + IndexedDB），多次实例化零编译</li>
        <li>部署时设置正确的 MIME：<code>application/wasm</code>，并配合 COOP/COEP 使用线程特性</li>
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

.steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.steps li {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 10px 12px;
}

.steps li.done {
  border-color: rgba(107, 176, 70, 0.5);
  background: rgba(107, 176, 70, 0.08);
}

.step-idx {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface-soft);
  color: var(--muted);
  display: grid;
  place-items: center;
  font-size: 13px;
}

.steps li.done .step-idx {
  background: var(--forest);
  color: #fff;
}

.steps p {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.check {
  color: var(--forest);
  font-weight: 700;
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
  color: var(--accent-strong);
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
</style>
