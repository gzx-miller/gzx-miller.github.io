const n=`<script setup lang="ts">
import { ref } from 'vue'

const running = ref(false)
const logs = ref<string[]>([])
const step = ref(0)

const questions = [
  { q: '请输入你的名字：', key: 'name' },
  { q: '请输入你的年龄：', key: 'age' },
  { q: '请选择你喜欢的语言（js/ts/rust）：', key: 'lang' },
  { q: '确认提交？(y/n)', key: 'confirm' },
]

const answers = ref<Record<string, string>>({})

function startInteractive() {
  running.value = true
  logs.value = []
  step.value = 0
  answers.value = {}
  askQuestion(0)
}

function askQuestion(idx: number) {
  if (idx >= questions.length) {
    logs.value.push(\`\\n=== 收集完成 ===\`)
    logs.value.push(\`名字: \${answers.value.name || '(未输入)'}\`)
    logs.value.push(\`年龄: \${answers.value.age || '(未输入)'}\`)
    logs.value.push(\`语言: \${answers.value.lang || '(未输入)'}\`)
    logs.value.push(\`确认: \${answers.value.confirm || '(未输入)'}\`)
    running.value = false
    return
  }

  const q = questions[idx]
  logs.value.push(\`\\n\${q.q}\`)
  logs.value.push(\`> _ (模拟输入: \${['栗子', '3', 'ts', 'y'][idx]})\`)

  setTimeout(() => {
    const mockInput = ['栗子', '3', 'ts', 'y'][idx]
    answers.value[q.key] = mockInput
    logs.value.push(\`你输入了: \${mockInput}\`)
    askQuestion(idx + 1)
  }, 800)
}
<\/script>

<template><div class="demo-card">
  <p><code>readline</code> 模块提供逐行读取流数据的能力，常用于实现交互式命令行工具。</p>

  <button :disabled="running" @click="startInteractive">开始模拟交互式输入</button>

  <div v-if="logs.length" class="rl-log">
    <div v-for="(log, i) in logs" :key="i" :class="log.startsWith('>') ? 'log-input' : log.startsWith('你输入了') ? 'log-output' : 'log-question'">{{ log }}</div>
  </div>

  <div class="rl-example">
    <h4>基础用法：逐行读取文件</h4>
    <pre class="mini-code"><code>const fs = require('node:fs')
const readline = require('node:readline')

const rl = readline.createInterface({
  input: fs.createReadStream('data.txt'),
  output: process.stdout,
})

rl.on('line', (line) => {
  console.log(\\\`行内容: \\\${line}\\\`)
})

rl.on('close', () => {
  console.log('文件读取完成')
})</code></pre>
  </div>

  <div class="rl-example">
    <h4>交互式 CLI 工具</h4>
    <pre class="mini-code"><code>const readline = require('node:readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('请输入名字: ', (name) => {
  rl.question('请输入年龄: ', (age) => {
    console.log(\\\`你好 \\\${name}, 你 \\\${age} 岁\\\`)
    rl.close()
  })
})</code></pre>
  </div>

  <div class="rl-example">
    <h4>现代替代方案：<code>readline/promises</code></h4>
    <pre class="mini-code"><code>const readline = require('node:readline/promises')

async function askQuestions() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  try {
    const name = await rl.question('名字: ')
    const age = await rl.question('年龄: ')
    console.log(\\\`你好 \\\${name}, 你 \\\${age} 岁\\\`)
  } finally {
    rl.close()
  }
}</code></pre>
  </div>

  <small>要点：<code>readline</code> 是处理流数据的低级 API；现代 CLI 工具推荐使用 <code>inquirer</code> 或 <code>prompts</code> 库以获得更丰富的交互体验。</small>
</div></template>

<style scoped>
.rl-log { background: #1e1e2e; color: #cdd6f4; padding: 10px 14px; border-radius: 6px; font-size: 12px; line-height: 1.7; margin: 0.6rem 0; font-family: monospace; max-height: 250px; overflow-y: auto; white-space: pre-wrap; }
.log-question { color: #89b4fa; }
.log-input { color: #f9e2af; }
.log-output { color: #a6e3a1; }
.rl-example { margin: 0.8rem 0; }
.rl-example h4 { font-size: 13px; color: #334155; margin-bottom: 4px; }
</style>
`;export{n as default};
