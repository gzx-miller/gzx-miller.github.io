const e=`// ═══════════════════════════════════════════
// 1. exec：走 shell、缓冲式输出，有注入风险
// ═══════════════════════════════════════════

import { exec, execFile, spawn, fork } from 'node:child_process'

exec('git log --oneline -5', (error, stdout, stderr) => {
  if (error) return console.error(error.message)      // 说明：输出超 maxBuffer 会报错
  console.log(stdout)                                 // 结果：一次性拿到全部输出
})
// exec(\`convert \${userInput}\`) 危险：; && | 会被 shell 当成语法执行

// ═══════════════════════════════════════════
// 2. execFile：绕过 shell，参数以数组传入
// ═══════════════════════════════════════════

execFile('node', ['--version'], (error, stdout) => {
  console.log(stdout.trim())                          // 结果：参数不经 shell，天然免疫注入
})

// ═══════════════════════════════════════════
// 3. spawn：stdout / stderr 是流，边产边读
// ═══════════════════════════════════════════

const child = spawn('git', ['log'])
child.stdout.on('data', (chunk) => process.stdout.write(chunk))  // 说明：分块到达，是 Buffer
child.stderr.on('data', (chunk) => process.stderr.write(chunk))  // 说明：实时读错误日志
child.on('close', (code) => console.log('exit', code))           // 结果：拿到退出码

// ═══════════════════════════════════════════
// 4. fork：Node 子进程，自带 IPC 通道
// ═══════════════════════════════════════════

const worker = fork('./worker.js')
worker.send({ task: 'start' })                         // 说明：父进程发给子进程
worker.on('message', (msg) => console.log(msg))        // 说明：接收子进程回传的结果
// 子进程里：process.on('message', ...) 与 process.send(result)

// ═══════════════════════════════════════════
// 5. 生命周期：超时 kill、error / exit、Promise 版
// ═══════════════════════════════════════════

const slow = spawn('sleep', ['10'], { timeout: 3000 })       // 说明：超时自动 kill，防僵尸
slow.on('error', (err) => console.error(err.message))        // 说明：启动失败走这里
slow.on('exit', (code, signal) => console.log(code, signal)) // 结果：退出信息

import { execFile as execFileAsync } from 'node:child_process/promises'
async function version() {
  const { stdout } = await execFileAsync('node', ['--version'])  // 结果：Promise 风格直接 await
  return stdout.trim()
}
`;export{e as default};
