<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'mode' | 'with' | 'path'>('mode')

const modes = [
  { key: 'r', label: "'r'", desc: '只读，文件必须已存在', pointer: '开头', truncate: '不截断', exists: '文件不存在则报错' },
  { key: 'w', label: "'w'", desc: '只写，覆盖原有内容', pointer: '开头', truncate: '清空原内容', exists: '不存在则新建' },
  { key: 'a', label: "'a'", desc: '追加写，保留原内容', pointer: '末尾', truncate: '不截断', exists: '不存在则新建' },
  { key: 'r+', label: "'r+'", desc: '读写，文件必须已存在', pointer: '开头', truncate: '不截断', exists: '文件不存在则报错' },
]
const pickedMode = ref(0)
const currentMode = computed(() => modes[pickedMode.value])

const withSteps = [
  { title: 'open() 打开文件', log: "f = open('data.txt', 'r', encoding='utf-8')" },
  { title: '读取内容', log: "text = f.read()" },
  { title: '离开 with 代码块', log: '# 代码块结束，无论是否出错都会执行 f.close()' },
  { title: '文件自动关闭', log: 'print(f.closed)   # 结果：True' },
]
const withStep = ref(0)
const withLog = computed(() => withSteps.slice(0, withStep.value + 1))

const rawPath = ref('reports/2024/data.csv')
const pathExists = ref(true)

const pathResult = computed(() => {
  const text = rawPath.value.trim()
  const parts = text.split('/').filter(Boolean)
  const segments = parts.length > 0 ? parts : ['']
  const name = segments[segments.length - 1]
  const dot = name.lastIndexOf('.')
  const stem = dot > 0 ? name.slice(0, dot) : name
  const suffix = dot > 0 ? name.slice(dot) : '（无后缀）'
  const parent = segments.length > 1 ? segments.slice(0, -1).join('/') : '.'
  const joined = [parent === '.' ? '' : parent, stem + '_bak' + (dot > 0 ? suffix : '')].filter(Boolean).join('/')
  return { name, stem, suffix, parent, joined }
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>文件模式、with 上下文与 pathlib</h4>

      <div class="tab-bar">
        <button class="tab-btn" :class="{ active: activeTab === 'mode' }" @click="activeTab = 'mode'">模式对照</button>
        <button class="tab-btn" :class="{ active: activeTab === 'with' }" @click="activeTab = 'with'">with 流程</button>
        <button class="tab-btn" :class="{ active: activeTab === 'path' }" @click="activeTab = 'path'">pathlib</button>
      </div>

      <div v-if="activeTab === 'mode'">
        <p class="hint">点击模式按钮，对照打开文件时的行为差异。</p>
        <div class="tab-bar" style="margin-top: 10px;">
          <button
            v-for="(item, index) in modes"
            :key="item.key"
            class="mini-btn"
            :class="{ active: pickedMode === index }"
            @click="pickedMode = index"
          >open(path, {{ item.label }})</button>
        </div>
        <table>
          <thead><tr><th>模式</th><th>用途</th><th>写入位置</th><th>原内容</th><th>文件不存在时</th></tr></thead>
          <tbody>
            <tr>
              <td><code>{{ currentMode.label }}</code></td>
              <td>{{ currentMode.desc }}</td>
              <td>{{ currentMode.pointer }}</td>
              <td>{{ currentMode.truncate }}</td>
              <td>{{ currentMode.exists }}</td>
            </tr>
          </tbody>
        </table>
        <div class="tips-box">
          最危险的是 <code>'w'</code>：它一打开就把文件清零。想保留原内容追加，必须用 <code>'a'</code>。
        </div>
      </div>

      <div v-else-if="activeTab === 'with'">
        <div class="row">
          <button class="mini-btn" @click="withStep = Math.min(withStep + 1, withSteps.length - 1)" :disabled="withStep === withSteps.length - 1">下一步</button>
          <button class="mini-btn" @click="withStep = 0" :disabled="withStep === 0">重置</button>
        </div>
        <div class="log-panel" style="margin-top: 12px;">
          <p v-for="(item, index) in withLog" :key="item.title" class="log-line" :class="index === withStep ? 'success' : ''">
            {{ index + 1 }}. {{ item.title }}　<code>{{ item.log }}</code>
          </p>
        </div>
        <div class="tips-box">
          <code>with</code> 把「打开—使用—关闭」打包成一个块，无论中途是否抛异常，离开时都会关闭文件，因此不再需要手写 <code>close()</code>。
        </div>
      </div>

      <div v-else>
        <p class="hint">改一下路径，看 pathlib 如何拆出名字、后缀与父目录。</p>
        <div class="row" style="margin-top: 8px;">
          <input type="text" v-model="rawPath" style="flex: 1;" />
          <button class="mini-btn" :class="{ active: pathExists }" @click="pathExists = !pathExists">
            exists: {{ pathExists ? 'True' : 'False' }}
          </button>
        </div>
        <table style="margin-top: 12px;">
          <thead><tr><th>表达式</th><th>结果</th></tr></thead>
          <tbody>
            <tr><td><code>Path(p).name</code></td><td><code>{{ pathResult.name }}</code></td></tr>
            <tr><td><code>Path(p).stem</code></td><td><code>{{ pathResult.stem }}</code></td></tr>
            <tr><td><code>Path(p).suffix</code></td><td><code>{{ pathResult.suffix }}</code></td></tr>
            <tr><td><code>Path(p).parent</code></td><td><code>{{ pathResult.parent }}</code></td></tr>
            <tr><td><code>Path(p).exists()</code></td><td><span class="badge" :class="pathExists ? 'success' : 'warning'">{{ pathExists }}</span></td></tr>
            <tr><td><code>Path(p).with_stem(...)</code></td><td><code>{{ pathResult.joined }}</code></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
