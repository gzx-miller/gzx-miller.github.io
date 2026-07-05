// ═══════════════════════════════════════════
// D19 - child_process 子进程
// ═══════════════════════════════════════════

// Node.js 通过 child_process 模块创建子进程
// 用于执行外部命令、调用其他语言程序等

import { exec, execFile, spawn, fork } from 'node:child_process'

// ───────── exec: 执行 shell 命令 ─────────
// 缓冲区输出，回调中拿到完整结果
// 适合：执行简单命令，输出量小

// exec('ls -la', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`执行错误: ${error.message}`)
//     return
//   }
//   if (stderr) {
//     console.error(`stderr: ${stderr}`)
//     return
//   }
//   console.log(`stdout: ${stdout}`)
// })

// Windows 下
// exec('dir', (err, stdout, stderr) => { ... })

// exec 选项
// exec('ls', {
//   cwd: '/tmp',           // 工作目录
//   env: { ...process.env, NODE_ENV: 'production' },
//   timeout: 5000,         // 超时（毫秒）
//   maxBuffer: 200 * 1024  // 最大缓冲区大小（默认 200KB）
// }, callback)

// 注意：exec 会创建 shell，有命令注入风险！
// 不要把用户输入直接拼进 exec 的命令字符串

// ───────── execFile: 执行文件，不创建 shell ─────────
// 比 exec 更安全，没有 shell 注入风险
// 适合：执行具体的可执行文件

// execFile('ls', ['-la', '/home'], (error, stdout, stderr) => {
//   if (error) {
//     console.error('执行失败:', error)
//     return
//   }
//   console.log('输出:', stdout)
// })

// 参数以数组形式传递，不会被 shell 解析
// 安全！即使参数中有特殊字符也没问题

// 常用工具
// execFile('node', ['--version'], cb)
// execFile('git', ['status'], cb)
// execFile('python', ['script.py', 'arg1'], cb)

// ───────── spawn: 流式输出 ─────────
// 不缓冲输出，通过事件获取数据
// 适合：长时间运行、输出量大的命令

// const child = spawn('ls', ['-la', '/'])
//
// // stdout 是可读流
// child.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`)
// })
//
// // stderr 是可读流
// child.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`)
// })
//
// // 进程退出
// child.on('close', (code) => {
//   console.log(`子进程退出，退出码: ${code}`)
// })
//
// // 进程错误（启动失败等）
// child.on('error', (err) => {
//   console.error('子进程错误:', err)
// })
//
// // 标准输入（可写流）
// child.stdin.write('input data\n')
// child.stdin.end()

// spawn 选项
// const child = spawn('cmd', ['args'], {
//   cwd: '/path/to/dir',
//   env: process.env,
//   stdio: ['pipe', 'pipe', 'pipe'],  // 标准输入输出配置
//   detached: false,                  // 是否独立运行
//   shell: false                      // 是否在 shell 中运行
// })

// stdio 配置：
// 'pipe'     - 创建管道（默认）
// 'ignore'   - 忽略（dev null）
// 'inherit'  - 继承父进程的 stdin/stdout/stderr
// [0, 1, 2]  - 直接传递文件描述符

// 示例：让子进程直接输出到父进程的终端
// spawn('ls', ['-la'], { stdio: 'inherit' })

// ───────── fork: 专门用于 Node.js 子进程 ─────────
// spawn 的特殊版本，专门用于运行 Node.js 模块
// 建立了父子进程之间的 IPC 通信通道

// 父进程 parent.js
// const child = fork('./child.js')
//
// child.on('message', (message) => {
//   console.log('收到子进程消息:', message)
// })
//
// child.send({ type: 'start', data: [1, 2, 3] })
//
// child.on('close', (code) => {
//   console.log('子进程退出:', code)
// })

// 子进程 child.js
// process.on('message', (message) => {
//   console.log('收到父进程消息:', message)
//   if (message.type === 'start') {
//     const result = doWork(message.data)
//     process.send({ type: 'result', data: result })
//   }
// })
//
// function doWork(data) {
//   return data.map(x => x * 2)
// }

// fork 的特点：
// - 只能运行 Node.js 模块
// - 自动建立 IPC 通道（send/on('message')）
// - 子进程有独立的事件循环和内存
// - 可以用 child.disconnect() 断开连接

// ───────── 4 种方式对比 ─────────

// 特性      | exec        | execFile    | spawn       | fork
// --------- | ----------- | ----------- | ----------- | -----------
// Shell     | 是          | 否          | 可选        | 否
// 流式输出  | 否（缓冲）  | 否（缓冲）  | 是          | 是
// IPC 通道  | 否          | 否          | 可配置      | 是
// 命令注入  | 有风险      | 安全        | 安全        | 安全
// 适用场景  | 简单命令    | 执行文件    | 长时间运行  | Node子进程
// 返回      | 回调        | 回调        | ChildProcess | ChildProcess

// ───────── Promise 化 ─────────

import { promisify } from 'node:util'
const execPromise = promisify(exec)
const execFilePromise = promisify(execFile)

async function runCommand() {
  try {
    const { stdout, stderr } = await execPromise('ls -la')
    console.log('输出:', stdout)
  } catch (err) {
    console.error('错误:', err.message)
  }
}

// 也可以用 node:child_process/promises
// import { exec, execFile } from 'node:child_process/promises'

// ───────── 管道和进程组合 ─────────

// 模拟 shell 管道: ls -la | grep .js
// const ls = spawn('ls', ['-la'])
// const grep = spawn('grep', ['.js'])
//
// ls.stdout.pipe(grep.stdin)
// grep.stdout.on('data', (data) => {
//   console.log(`过滤结果: ${data}`)
// })

// ───────── 安全最佳实践 ─────────

// 1. 优先使用 execFile 或 spawn，不要用 exec（除非必须 shell）
// 2. 用户输入永远不要直接拼进命令
// 3. 参数用数组传递，不要用字符串拼接
// 4. 设置超时，防止进程挂起
// 5. 设置 maxBuffer，防止内存溢出
// 6. 限制执行权限，不要以 root 运行
// 7. 验证输入，白名单允许的命令

// 危险！不要这样做：
// exec(`ls ${userInput}`, callback) // 用户输入 "; rm -rf /" 就完了

// 安全的做法：
// function listDir(dir) {
//   const allowedDirs = ['/tmp', '/var/log', '/home/user']
//   if (!allowedDirs.includes(dir)) {
//     throw new Error('不允许的目录')
//   }
//   return execFile('ls', ['-la', dir])
// }

// ───────── 常见应用场景 ─────────
// 调用系统命令（git、ffmpeg 等）
// 运行其他语言脚本（Python、Shell 等）
// 编译代码（webpack、babel 等工具链）
// 进程管理（PM2 内部原理）
// 后台任务执行
// 沙箱环境执行不可信代码（谨慎）

// ───────── 注意事项 ─────────
// 子进程有独立的内存空间，开销比线程大
// 注意处理 stdout 和 stderr 的背压
// 及时清理子进程，防止僵尸进程
// 监听 error 事件，处理启动失败
// Windows 下有些命令需要 shell: true
// 跨平台用 cross-spawn 库
