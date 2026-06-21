<script setup>
import { ref } from 'vue'

const method = ref('spawn')
const running = ref(false)
const output = ref('')

const methods = {
  spawn: {
    title: 'spawn() — 流式输出',
    desc: '适合处理大量数据，子进程的输出以流的形式传递，内存占用小。',
    code: `// 执行 `ls -la`，流式读取输出
const { spawn } = require('child_process')
const ls = spawn('ls', ['-la', '/usr'])

ls.stdout.on('data', (data) => {
  console.log(\`输出: \${data}\`)
})

ls.stderr.on('data', (data) => {
  console.error(\`错误: \${data}\`)
})

ls.on('close', (code) => {
  console.log(\`退出码: \${code}\`)
})`,
    demo: '模拟执行: ls -la\n总用量 48\ndrwxr-xr-x  5 user  staff   160 6月  1 10:00 .\ndrwxr-xr-x  3 user  staff    96 5月 20 09:00 ..\n-rw-r--r--  1 user  staff  1024 6月  1 10:00 index.js\n-rw-r--r--  1 user  staff   512 6月  1 10:00 package.json\n\n退出码: 0'
  },
  fork: {
    title: 'fork() — 独立 Node.js 进程',
    desc: '专门用于运行 Node.js 脚本，父子进程通过 IPC 通道通信，适合 CPU 密集任务。',
    code: `// 父进程
const { fork } = require('child_process')
const child = fork('worker.js')

child.on('message', (msg) => {
  console.log('来自子进程:', msg)
})

child.send({ task: 'start', data: [1, 2, 3] })

// worker.js（子进程）
process.on('message', (msg) => {
  const result = processData(msg.data)
  process.send({ result })
})`,
    demo: '父进程: 发送任务 { task: "start", data: [1,2,3] }\n子进程: 接收到任务，开始处理...\n子进程: 处理完成，发送结果 { result: 6 }\n父进程: 收到结果 6'
  },
  exec: {
    title: 'exec() — 一次性完整输出',
    desc: '命令执行完成后一次性返回所有输出，适合输出量小的场景，有输出大小限制（默认 1MB）。',
    code: `// 执行命令，一次性获取输出
const { exec } = require('child_process')

exec('git log --oneline -5', (error, stdout, stderr) => {
  if (error) {
    console.error(\`执行出错: \${error}\`)
    return
  }
  console.log(\`最近 5 次提交:\\n\${stdout}\`)
})`,
    demo: '执行: git log --oneline -5\n\n输出:\na1b2c3d feat: 新增用户登录功能\nb2c3d4e fix: 修复首页样式问题\nc3d4e5f docs: 更新 README\n\ndone'
  }
}

function runDemo() {
  running.value = true
  output.value = ''
  const lines = methods[method.value].demo.split('\n')
  let i = 0
  const timer = setInterval(() => {
    if (i < lines.length) {
      output.value += (output.value ? '\n' : '') + lines[i]
      i++
    } else {
      clearInterval(timer)
      running.value = false
    }
  }, 150)
}
</script>

<template><div class="demo-card">
  <p>child_process 提供三种创建子进程的方式，适用场景各不相同。</p>
  <div class="method-tabs">
    <button v-for="(v, k) in methods" :key="k" :class="{active: method === k}" @click="method = k">{{ {spawn:'spawn',fork:'fork',exec:'exec'}[k] }}</button>
  </div>
  <div class="method-info">
    <strong>{{ methods[method].title }}</strong>
    <p>{{ methods[method].desc }}</p>
  </div>
  <button :disabled="running" @click="runDemo">运行模拟演示</button>
  <pre v-if="output" class="mini-code"><code>{{ output }}</code></pre>
  <pre class="mini-code"><code>{{ methods[method].code }}</code></pre>
  <small>选型建议：大数据量用 <code>spawn</code>，Node.js 脚本用 <code>fork</code>，简单命令用 <code>exec</code>。</small>
</div></template>

<style scoped>
.method-tabs { display: flex; gap: 6px; margin: 0.6rem 0; }
.method-tabs button { padding: 4px 14px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.method-tabs .active { background: #e8590c; color: #fff; border-color: #e8590c; }
.method-info { background: #fff9f0; padding: 8px 12px; border-radius: 6px; margin: 0.6rem 0; font-size: 12px; line-height: 1.8; }
.method-info strong { color: #e8590c; }
</style>
