<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

// add 模块的 WAT 源码（文本格式）
const wat = `(module
  ;; 函数签名：(i32, i32) -> i32
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )
  (export "add" (func $add))
)`

// WAT 指令 -> 二进制操作码 对照表
const mapping = [
  { wat: '(module', hex: '00 61 73 6d 01 00 00 00', note: '模块头：魔数 + 版本' },
  { wat: '(func (param i32 i32) (result i32)', hex: '01 07 01 60 02 7f 7f 01 7f', note: '类型段声明函数签名' },
  { wat: 'local.get $a', hex: '20 00', note: '取第 0 个参数入栈' },
  { wat: 'local.get $b', hex: '20 01', note: '取第 1 个参数入栈' },
  { wat: 'i32.add', hex: '6a', note: '弹出栈顶两数相加，结果入栈' },
  { wat: 'end / 函数体结束', hex: '0b', note: '函数体结束符' },
  { wat: '(export "add")', hex: '07 08 01 03 61 64 64 00 00', note: '导出段：把函数 0 导出为 add' },
]

const selected = ref(0)

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>WAT 文本格式与二进制对照</h3>
    <p class="desc">
      WAT（WebAssembly Text format）是可读的文本表示，用 <code>wat2wasm</code> 可编译成
      二进制。点左侧任意一条指令，右侧会高亮对应的操作码字节。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="layout">
      <div class="panel">
        <h4>📄 WAT 源码</h4>
        <pre class="wat-view"><code>{{ wat }}</code></pre>
      </div>
      <div class="panel">
        <h4>🔀 指令与字节对照</h4>
        <ul class="map-list">
          <li
            v-for="(item, index) in mapping"
            :key="index"
            class="map-item"
            :class="{ active: selected === index }"
            @click="selected = index"
          >
            <code class="wat-code">{{ item.wat }}</code>
            <code class="hex-code">{{ item.hex }}</code>
            <span class="note">{{ item.note }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>WAT 与二进制是一一对应的，文本只是"图纸"</li>
        <li><code>wat2wasm</code> 属于 WebAssembly Binary Toolkit（wabt）</li>
        <li>栈式指令：<code>local.get</code> 压栈，<code>i32.add</code> 弹两数压一数</li>
        <li>理解二进制结构后，可直接用 <code>new Uint8Array()</code> 手工组装模块</li>
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

.panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
  background: var(--surface);
}

.wat-view {
  margin: 0;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text);
  white-space: pre-wrap;
}

.map-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.map-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2px 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.map-item:hover {
  background: var(--surface-soft);
}

.map-item.active {
  border-color: var(--accent);
  background: rgba(255, 218, 159, 0.4);
}

.wat-code {
  color: var(--forest);
  font-size: 12px;
}

.hex-code {
  color: var(--accent-strong);
  font-size: 11px;
  text-align: right;
}

.note {
  grid-column: 1 / -1;
  color: var(--muted);
  font-size: 12px;
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
