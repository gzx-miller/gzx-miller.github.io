const n=`// ═══════════════════════════════════════════
// D24 - CLI 参数与命令行工具
// ═══════════════════════════════════════════

import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs/promises'

// ───────── 基础：process.argv ─────────

// 运行: node cli.js --name Alice --age 30 --verbose
console.log('process.argv:', process.argv)
// [
//   'C:\\\\Program Files\\\\nodejs\\\\node.exe',  // [0] node 路径
//   'D:\\\\project\\\\cli.js',                  // [1] 脚本路径
//   '--name',                               // [2] 参数1
//   'Alice',                                // [3] 参数2
//   '--age',
//   '30',
//   '--verbose'
// ]

// 去掉前两个元素
const args = process.argv.slice(2)

// ───────── 手动解析参数 ─────────

function parseArgs(argv) {
  const options = {
    _: [] // 位置参数
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg.startsWith('--')) {
      // 长选项: --name value 或 --name=value
      const eqIndex = arg.indexOf('=')
      if (eqIndex !== -1) {
        const key = arg.slice(2, eqIndex)
        const value = arg.slice(eqIndex + 1)
        options[camelCase(key)] = coerce(value)
      } else {
        const key = arg.slice(2)
        // 下一个参数不是选项，则作为值
        if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
          options[camelCase(key)] = coerce(argv[i + 1])
          i++
        } else {
          options[camelCase(key)] = true // 布尔标志
        }
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      // 短选项: -n value 或 -abc (多个布尔标志)
      const key = arg.slice(1)
      if (key.length === 1 && i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
        options[key] = coerce(argv[i + 1])
        i++
      } else {
        // 组合短选项: -abc → -a -b -c
        for (const char of key) {
          options[char] = true
        }
      }
    } else {
      // 位置参数
      options._.push(arg)
    }
  }

  return options
}

function camelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function coerce(value) {
  // 自动类型转换
  if (value === 'true') return true
  if (value === 'false') return false
  const num = Number(value)
  if (!isNaN(num) && value !== '') return num
  return value
}

// 使用示例
// const options = parseArgs(args)
// console.log('解析结果:', options)

// ───────── Node.js 内置 util.parseArgs (v18+) ─────────

import { parseArgs } from 'node:util'

// const { values, positionals } = parseArgs({
//   options: {
//     name: { type: 'string', short: 'n' },
//     age: { type: 'string', short: 'a' },
//     verbose: { type: 'boolean', short: 'v', default: false },
//     help: { type: 'boolean', short: 'h' }
//   },
//   allowPositionals: true
// })
//
// console.log('选项:', values)
// console.log('位置参数:', positionals)

// ───────── 完整 CLI 工具示例 ─────────

// 一个简单的文件处理 CLI 工具
// 用法:
//   node cli.js read <file>          读取文件
//   node cli.js write <file> <text>  写入文件
//   node cli.js list [dir]           列出目录
//   node cli.js --help               帮助

const HELP_TEXT = \`
文件处理 CLI 工具

用法:
  node D24Cli.js <command> [options]

命令:
  read <file>           读取文件内容
  write <file> <text>   写入文件
  list [dir]            列出目录内容（默认当前目录）

选项:
  -h, --help            显示帮助
  -v, --verbose         显示详细信息
  -e, --encoding <enc>  文件编码 (默认: utf-8)

示例:
  node D24Cli.js read package.json
  node D24Cli.js write hello.txt "Hello World"
  node D24Cli.js list ./src -v
\`

async function main() {
  const options = parseArgs(args)

  if (options.help || options.h) {
    console.log(HELP_TEXT)
    return
  }

  const command = options._[0]
  const encoding = options.encoding || options.e || 'utf-8'
  const verbose = options.verbose || options.v

  try {
    switch (command) {
      case 'read': {
        const file = options._[1]
        if (!file) {
          console.error('错误: 请指定要读取的文件')
          process.exit(1)
        }
        if (verbose) console.log(\`读取文件: \${file} (编码: \${encoding})\`)
        const content = await fs.readFile(file, encoding)
        console.log(content)
        break
      }

      case 'write': {
        const file = options._[1]
        const text = options._[2]
        if (!file || text === undefined) {
          console.error('错误: 请指定文件名和内容')
          process.exit(1)
        }
        if (verbose) console.log(\`写入文件: \${file}\`)
        await fs.writeFile(file, text, encoding)
        console.log(\`已写入: \${file}\`)
        break
      }

      case 'list': {
        const dir = options._[1] || '.'
        if (verbose) console.log(\`列出目录: \${dir}\`)
        const files = await fs.readdir(dir)
        for (const file of files) {
          if (verbose) {
            const stat = await fs.stat(path.join(dir, file))
            const type = stat.isDirectory() ? '目录' : '文件'
            const size = stat.size.toString().padStart(8)
            console.log(\`\${type}  \${size}B  \${file}\`)
          } else {
            console.log(file)
          }
        }
        break
      }

      case undefined:
        console.error('错误: 请指定命令')
        console.log(HELP_TEXT)
        process.exit(1)

      default:
        console.error(\`错误: 未知命令 "\${command}"\`)
        console.log(HELP_TEXT)
        process.exit(1)
    }
  } catch (err) {
    if (verbose) {
      console.error('详细错误:', err)
    } else {
      console.error('错误:', err.message)
    }
    process.exit(1)
  }
}

// main()

// ───────── 常用 CLI 库推荐 ─────────

// 1. Commander.js (最流行)
//    npm install commander
//    功能强大，生态丰富
//
//    const { Command } = require('commander')
//    const program = new Command()
//    program
//      .name('my-cli')
//      .version('1.0.0')
//      .description('我的 CLI 工具')
//      .option('-v, --verbose', '详细输出')
//      .argument('<file>', '输入文件')
//      .action((file, options) => {
//        console.log('处理:', file, options)
//      })
//    program.parse()

// 2. yargs
//    npm install yargs
//    功能全面，解析灵活
//
//    const yargs = require('yargs/yargs')
//    const { hideBin } = require('yargs/helpers')
//    yargs(hideBin(process.argv))
//      .command('serve [port]', '启动服务', (yargs) => {
//        yargs.positional('port', { default: 3000 })
//      }, (argv) => {
//        console.log('启动服务在端口', argv.port)
//      })
//      .help()
//      .argv

// 3. cac
//    npm install cac
//    轻量、现代、TypeScript 友好
//
//    import { cac } from 'cac'
//    const cli = cac('my-cli')
//    cli.command('build [dir]', '构建项目')
//      .option('--out <dir>', '输出目录')
//      .action((dir, options) => { ... })
//    cli.parse()

// 4. ink (React 风格的 CLI 界面)
//    npm install ink react
//    用 React 组件构建交互式 CLI UI

// ───────── 彩色输出 ─────────

// 不依赖库的 ANSI 颜色
const colors = {
  reset: '\\x1b[0m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[34m',
  magenta: '\\x1b[35m',
  cyan: '\\x1b[36m',
  white: '\\x1b[37m',
  bold: '\\x1b[1m'
}

// console.log(\`\${colors.green}成功:\${colors.reset} 操作完成\`)
// console.log(\`\${colors.red}错误:\${colors.reset}  something went wrong\`)

// 推荐库：chalk, kleur, picocolors

// ───────── CLI 最佳实践 ─────────
// 提供 --help 帮助信息
// 提供 --version 版本号
// 支持长选项和短选项 (--verbose, -v)
// 错误信息清晰友好
// 退出码有意义 (0=成功, 1=通用错误, 2=参数错误)
// 支持管道输入 (stdin) 和输出 (stdout)
// 进度条和加载动画（长时间运行的命令）
// 彩色输出（但检测是否支持颜色，非 TTY 时禁用）
// 配置文件支持（如 .clirc）
// 环境变量支持
// 文档和示例
`;export{n as default};
