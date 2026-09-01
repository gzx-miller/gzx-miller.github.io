const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

// 模拟一个 useCounter composable
function useCounter(initial: number = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initial }
  return { count, doubled, increment, decrement, reset }
}

const counter = useCounter(10)

// 模拟一个 useToggle composable
function useToggle(initial: boolean = false) {
  const state = ref(initial)
  function toggle() { state.value = !state.value }
  function setOn() { state.value = true }
  function setOff() { state.value = false }
  return { state, toggle, setOn, setOff }
}

const darkMode = useToggle(false)

// 模拟一个 useLocalStorage composable
function useLocalStorage(key: string, defaultValue: string) {
  const data = ref(defaultValue)
  function save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, data.value)
    }
  }
  function load() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key)
      if (stored) data.value = stored
    }
  }
  return { data, save, load }
}

const note = useLocalStorage('demo-note', '松鼠的笔记')

const codeExample = \`// composables/useCounter.ts
export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  function increment() { count.value++ }
  function reset() { count.value = initial }
  return { count, doubled, increment, reset }
}

// 页面中使用（自动导入）
const { count, doubled, increment } = useCounter(10)\`
<\/script>

<template>
  <div class="demo-card">
    <h3>Composables：可复用组合式函数</h3>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <h4>useCounter 示例</h4>
        <p>计数：{{ counter.count.value }} × 2 = {{ counter.doubled.value }}</p>
        <div style="display:flex;gap:6px;">
          <button @click="counter.increment">+1</button>
          <button @click="counter.decrement">-1</button>
          <button @click="counter.reset">重置</button>
        </div>

        <h4 style="margin-top:12px;">useToggle 示例</h4>
        <p>暗色模式：{{ darkMode.state.value ? '🌙 开启' : '☀️ 关闭' }}</p>
        <div style="display:flex;gap:6px;">
          <button @click="darkMode.toggle">切换</button>
          <button @click="darkMode.setOn">开启</button>
          <button @click="darkMode.setOff">关闭</button>
        </div>

        <h4 style="margin-top:12px;">useLocalStorage 示例</h4>
        <input v-model="note.data.value" style="width:80%;" />
        <button @click="note.save" style="margin-left:6px;">保存</button>
      </div>

      <div style="flex:1;">
        <h4>代码模板</h4>
        <pre class="code-block">{{ codeExample }}</pre>
      </div>
    </div>

    <div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;">
      💡 <code>composables/</code> 目录下以 <code>use</code> 开头的函数自动全局可用。每个 composable 应只封装一个关注点，返回响应式状态和操作方法。
    </div>
  </div>
</template>

<style scoped>
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{n as default};
