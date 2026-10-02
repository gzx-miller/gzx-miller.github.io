const n=`// ═══════════════════════════════════════════
// D30 - readline 交互式输入
// ═══════════════════════════════════════════

import readline from 'node:readline'

// ───────── 基本用法：逐行读取文件 ─────────

import fs from 'node:fs'
import path from 'node:path'

// 逐行读取大文件（内存高效）
function readFileLineByLine(filePath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity // 识别 \\r\\n 作为行结束
  })

  let lineCount = 0

  rl.on('line', (line) => {
    lineCount++
    console.log(\`第 \${lineCount} 行: \${line}\`)

    // 可以在需要时暂停
    // if (lineCount >= 10) {
    //   rl.pause()
    //   setTimeout(() => rl.resume(), 1000)
    // }
  })

  rl.on('close', () => {
    console.log(\`文件读取完毕，共 \${lineCount} 行\`)
  })

  return rl
}

// 使用：
// readFileLineByLine('example.txt')

// 为什么用 readline 读文件？
// - 大文件不会占用太多内存
// - 逐行处理，适合日志分析
// - 比 readFile + split 更高效

// ───────── 命令行交互输入 ─────────

// 创建交互式界面
function createInteractiveInterface() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',          // 提示符
    historySize: 100,      // 历史记录大小
    removeHistoryDuplicates: true
  })

  // 显示提示符
  rl.prompt()

  // 处理每行输入
  rl.on('line', (input) => {
    input = input.trim()

    switch (input.toLowerCase()) {
      case 'help':
        console.log('可用命令: help, hello, date, exit')
        break

      case 'hello':
        console.log('你好！欢迎使用交互式程序')
        break

      case 'date':
        console.log('当前时间:', new Date().toLocaleString())
        break

      case 'exit':
      case 'quit':
        console.log('再见！')
        rl.close()
        break

      default:
        console.log(\`未知命令: \${input}\`)
        console.log('输入 help 查看帮助')
    }

    rl.prompt()
  })

  rl.on('close', () => {
    console.log('\\n程序退出')
    process.exit(0)
  })

  return rl
}

// 启动交互（取消注释运行）
// createInteractiveInterface()

// ───────── 提问 (question) ─────────

// 简单的提问函数
function askQuestion(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

// 使用
async function askDemo() {
  const name = await askQuestion('你叫什么名字？')
  const age = await askQuestion('你多大了？')
  console.log(\`你好，\${name}！你今年 \${age} 岁。\`)
}

// askDemo()

// ───────── 密码输入（不回显） ─────────

function askPassword(question = '请输入密码: ') {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    // 方法1：用 silent 模式
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      // 只显示提示，不显示输入
      if (stringToWrite === question) {
        rl.output.write(question)
      }
    }

    rl.question(question, (password) => {
      rl.close()
      console.log() // 换行
      resolve(password)
    })
  })
}

// 更简单的方法（Node 15+）
function askPasswordV2(question = '请输入密码: ') {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    // 监听 keypress
    const stdin = process.stdin
    let password = ''

    process.stdout.write(question)

    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf-8')

    const onData = (char) => {
      if (char === '\\n' || char === '\\r') {
        // 回车结束
        stdin.removeListener('data', onData)
        stdin.setRawMode(false)
        rl.close()
        console.log()
        resolve(password)
      } else if (char === '\\u0003') {
        // Ctrl+C
        stdin.removeListener('data', onData)
        stdin.setRawMode(false)
        rl.close()
        process.exit()
      } else if (char === '\\b' || char === '\\u007f') {
        // 退格
        if (password.length > 0) {
          password = password.slice(0, -1)
          process.stdout.write('\\b \\b') // 删除一个字符
        }
      } else {
        // 普通字符
        password += char
        process.stdout.write('*') // 显示星号
      }
    }

    stdin.on('data', onData)
  })
}

// 使用：
// const pwd = await askPasswordV2()
// console.log('密码长度:', pwd.length)

// ───────── 多步表单式交互 ─────────

async function interactiveForm() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (q) => new Promise(resolve => rl.question(q, resolve))

  console.log('=== 用户注册 ===')

  const username = await question('用户名: ')
  const email = await question('邮箱: ')
  const password = await askPasswordV2('密码: ')

  console.log('\\n=== 注册信息确认 ===')
  console.log(\`用户名: \${username}\`)
  console.log(\`邮箱: \${email}\`)
  console.log(\`密码: \${'*'.repeat(password.length)}\`)

  const confirm = await question('\\n确认注册？(y/n): ')

  if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
    console.log('注册成功！')
  } else {
    console.log('已取消注册')
  }

  rl.close()
}

// interactiveForm()

// ───────── tab 自动补全 ─────────

function createShellWithCompletion() {
  const commands = ['help', 'hello', 'date', 'exit', 'quit', 'clear', 'history']

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '$ ',
    completer: (line) => {
      const hits = commands.filter(c => c.startsWith(line))
      return [hits.length ? hits : commands, line]
    }
  })

  rl.prompt()

  rl.on('line', (line) => {
    const cmd = line.trim().toLowerCase()

    if (cmd === 'exit' || cmd === 'quit') {
      rl.close()
      return
    }

    if (cmd === 'clear') {
      console.clear()
      rl.prompt()
      return
    }

    if (cmd === 'history') {
      rl.history.forEach((h, i) => {
        console.log(\`  \${i + 1}: \${h}\`)
      })
      rl.prompt()
      return
    }

    console.log(\`执行命令: \${cmd}\`)
    rl.prompt()
  })

  return rl
}

// createShellWithCompletion()

// 按 Tab 键会自动补全命令
// 连续按两次 Tab 显示所有匹配项

// ───────── 常用的 CLI 交互库 ─────────

// 1. Inquirer.js (最流行)
//    npm install inquirer
//    功能丰富：输入、选择、复选框、密码、确认等
//
//    import inquirer from 'inquirer'
//
//    const answers = await inquirer.prompt([
//      { type: 'input', name: 'name', message: '你的名字？' },
//      { type: 'password', name: 'password', message: '密码？' },
//      { type: 'list', name: 'color', message: '选个颜色',
//        choices: ['红', '绿', '蓝'] },
//      { type: 'confirm', name: 'ok', message: '确认？', default: true }
//    ])

// 2. prompts
//    npm install prompts
//    轻量、现代、Promise 风格

// 3. enquirer
//    npm install enquirer
//    可定制性强

// ───────── readline 事件 ─────────

// line          读取到一行
// close         接口关闭
// pause         输入暂停
// resume        输入恢复
// SIGINT        Ctrl+C
// SIGTSTP       Ctrl+Z
// SIGCONT       从暂停恢复

// 处理 Ctrl+C
// rl.on('SIGINT', () => {
//   rl.question('确定要退出吗？(y/n) ', (answer) => {
//     if (answer.match(/^y(es)?$/i)) {
//       rl.close()
//     } else {
//       rl.prompt()
//     }
//   })
// })

// ───────── 最佳实践 ─────────
// 大文件逐行处理用 readline，不要 readFile 全量读取
// 命令行交互用 readline 或 inquirer 等库
// 密码输入用 raw 模式，不要回显
// 实现 tab 补全提升用户体验
// 处理 Ctrl+C 等特殊按键
// 交互式程序要有清晰的提示符和帮助
// 历史记录功能很有用
// 复杂交互直接用 inquirer 等专业库
// 注意 readline 的异步特性，用 Promise 封装
// 颜色输出用 chalk/picocolors 增强体验
`;export{n as default};
