<script setup lang="ts">
import { computed, ref } from 'vue'

type Mode = 'list' | 'dict' | 'set' | 'gen'

const mode = ref<Mode>('list')
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const genCursor = ref(0)

const modes: Array<{ key: Mode; label: string }> = [
  { key: 'list', label: '列表推导式' },
  { key: 'dict', label: '字典推导式' },
  { key: 'set', label: '集合推导式' },
  { key: 'gen', label: '生成器表达式' },
]

function selectMode(m: Mode) {
  mode.value = m
  genCursor.value = 0
}

const loopCode = computed(() => {
  switch (mode.value) {
    case 'list':
      return `result = []
for x in data:
    if x % 2 == 0:
        result.append(x * x)`
    case 'dict':
      return `result = {}
for x in data:
    if x % 2 == 0:
        result[x] = x * x`
    case 'set':
      return `result = set()
for x in data:
    result.add(x % 3)`
    default:
      return `# 生成器没有「先建容器」的等价写法
# 它把每个值推迟到 next() 时才计算`
  }
})

const compCode = computed(() => {
  switch (mode.value) {
    case 'list':
      return '[x * x for x in data if x % 2 == 0]'
    case 'dict':
      return '{x: x * x for x in data if x % 2 == 0}'
    case 'set':
      return '{x % 3 for x in data}'
    default:
      return '(x * x for x in data if x % 2 == 0)'
  }
})

const resultText = computed(() => {
  switch (mode.value) {
    case 'list':
      return `[${data.filter((x) => x % 2 === 0).map((x) => x * x).join(', ')}]`
    case 'dict':
      return `{${data.filter((x) => x % 2 === 0).map((x) => `${x}: ${x * x}`).join(', ')}}`
    case 'set':
      return `{${[...new Set(data.map((x) => x % 3))].sort((a, b) => a - b).join(', ')}}`
    default:
      return '(惰性序列，元素尚未计算)'
  }
})

const genValues = computed(() => data.filter((x) => x % 2 === 0).map((x) => x * x))
const genLog = computed(() =>
  genValues.value.slice(0, genCursor.value).map((v, i) => `next() → ${v}（第 ${i + 1} 个）`),
)

function genNext() {
  if (genCursor.value < genValues.value.length) genCursor.value += 1
}

function genReset() {
  genCursor.value = 0
}
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>推导式与迭代协议</h4>
      <p class="hint">同一个需求，左边是 for 循环写法，右边是推导式写法，可切换推导式类型。</p>

      <div class="tab-bar" style="margin-top: 10px;">
        <button
          v-for="m in modes"
          :key="m.key"
          class="tab-btn"
          :class="{ active: mode === m.key }"
          @click="selectMode(m.key)"
        >
          {{ m.label }}
        </button>
      </div>

      <div class="grid-2">
        <div class="demo-panel">
          <h5>for 循环版</h5>
          <pre class="mini-code">{{ loopCode }}</pre>
        </div>
        <div class="demo-panel">
          <h5>推导式版</h5>
          <pre class="mini-code">{{ compCode }}</pre>
        </div>
      </div>

      <div class="tips-box">结果：<code>{{ resultText }}</code></div>

      <div v-if="mode === 'gen'" class="detail-box">
        <p class="hint">生成器是惰性的：每点一次 <code>next()</code> 才算出下一个值。</p>
        <div class="tab-bar" style="margin-top: 8px;">
          <button class="mini-btn" :disabled="genCursor >= genValues.length" @click="genNext">next()</button>
          <button class="mini-btn" @click="genReset">重置</button>
        </div>
        <div class="log-panel">
          <p v-if="genLog.length === 0" class="hint">还没有取值。</p>
          <p v-for="(line, i) in genLog" :key="i" class="log-line">{{ line }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
