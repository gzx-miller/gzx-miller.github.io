const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const count = ref(0)
const logs = ref<string[]>([])
const status = ref('')

let counterExports: any = null

// 导入到 Wasm 的宿主函数：env.log
function hostLog(v: number) {
  logs.value.unshift(\`[env.log] 当前库存被读取 → \${v}\`)
  if (logs.value.length > 6) logs.value.pop()
}

onMounted(async () => {
  try {
    const instance = await instantiateWasm('counter', { env: { log: hostLog } })
    counterExports = instance.exports
    count.value = counterExports.get()
    status.value = 'counter 模块已加载：从 env 导入 log，导出全局变量 count 与 4 个函数'
  } catch (e) {
    status.value = \`加载失败：\${(e as Error).message}\`
  }
})

function inc() {
  if (!counterExports) return
  counterExports.inc()
  count.value = counterExports.get()
}

function dec() {
  if (!counterExports) return
  counterExports.dec()
  count.value = counterExports.get()
}

function emit() {
  if (!counterExports) return
  counterExports.emit() // 调用内部导入的 env.log
  count.value = counterExports.get()
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
<\/script>

<template>
  <div class="demo-card">
    <h3>导入、导出与全局变量：库存计数器</h3>
    <p class="desc">
      Wasm 通过"导入"使用宿主（JS）提供的能力，通过"导出"把内部函数/全局变量暴露给
      宿主。<code>counter</code> 模块从 <code>env.log</code> 导入打印函数，并在内部维护
      一个可变全局变量 <code>count</code>。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="layout">
      <div class="counter-panel">
        <h4>📦 全局变量 count</h4>
        <div class="count-display">{{ count }}</div>
        <div class="actions">
          <button @click="inc">➕ 入库 inc()</button>
          <button @click="dec">➖ 出库 dec()</button>
          <button @click="emit">📣 上报 emit()</button>
        </div>
      </div>

      <div class="log-panel">
        <h4>📜 导入函数 env.log 输出</h4>
        <ul class="log-list">
          <li v-for="(line, i) in logs" :key="i">{{ line }}</li>
          <li v-if="logs.length === 0" class="empty">点击"上报"触发 Wasm 调用宿主函数</li>
        </ul>
      </div>
    </div>

    <div class="sig-panel">
      <h4>🔗 模块接口清单</h4>
      <div class="sig-grid">
        <div class="sig-card">
          <strong>导入</strong>
          <code>env.log : (i32) -> ()</code>
          <p>打印函数，由 JS 提供实现</p>
        </div>
        <div class="sig-card">
          <strong>导出 · 变量</strong>
          <code>count : global i32 (mut)</code>
          <p>可变全局变量，可在两端读写</p>
        </div>
        <div class="sig-card">
          <strong>导出 · 函数</strong>
          <code>get / inc / dec / emit</code>
          <p>读写全局变量的四个入口</p>
        </div>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>导入段声明依赖，实例化时由 JS 通过 <code>importObject</code> 注入</li>
        <li>导出段把函数（kind=0）、内存、表格、全局变量（kind=3）暴露出去</li>
        <li>全局变量必须声明是否可变（<code>mut</code>），默认不可变</li>
        <li>Wasm 调用宿主函数是同步的，适合日志、回调等场景</li>
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

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.counter-panel,
.log-panel,
.sig-panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 14px;
}

.count-display {
  font-size: 48px;
  font-weight: 800;
  color: var(--accent-strong);
  text-align: center;
  margin: 8px 0;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.log-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
  max-height: 180px;
  overflow: auto;
}

.log-list li {
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 6px 10px;
  color: var(--text);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
}

.log-list .empty {
  color: var(--muted);
  font-family: inherit;
  font-size: 13px;
}

.sig-panel {
  margin-top: 16px;
}

.sig-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.sig-card {
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 10px 12px;
  display: grid;
  gap: 4px;
}

.sig-card code {
  color: var(--forest);
  font-size: 12px;
}

.sig-card p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

.status {
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
