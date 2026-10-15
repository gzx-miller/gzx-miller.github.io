// ═══════════════════════════════════════════
// 1. process.argv 的结构
// ═══════════════════════════════════════════

import process from 'node:process'
import { parseArgs } from 'node:util'

console.log(process.argv[0])                          // 结果：node 可执行文件路径
console.log(process.argv[1])                          // 结果：脚本自身路径
const rawArgs = process.argv.slice(2)                 // 结果：用户参数从这里开始

// ═══════════════════════════════════════════
// 2. 手写解析会漏掉「等号形式」
// ═══════════════════════════════════════════

const flags = {}
for (let i = 0; i < rawArgs.length; i += 1) {
  const arg = rawArgs[i]
  if (arg.startsWith('--')) {
    const key = arg.slice(2)                          // 说明：--port=8080 被原样当键名
    flags[key] = rawArgs[i + 1] ?? true               // 结果：等号右侧的值丢了
    i += 1
  }
}

// ═══════════════════════════════════════════
// 3. 小工具交给内置 util.parseArgs
// ═══════════════════════════════════════════

const { values, positionals } = parseArgs({
  options: {
    name: { type: 'string' },                         // 说明：等号与空格两种形态都认
    age: { type: 'string' },
    verbose: { type: 'boolean', default: false },
  },
  allowPositionals: true,
})
console.log(values, positionals)                      // 结果：命名选项与位置参数分开

// ═══════════════════════════════════════════
// 4. 复杂 CLI 用 commander / yargs / cac
// ═══════════════════════════════════════════

// commander：Express 风格，子命令与类型转换齐全
// program.command('greet <name>').option('-v, --verbose').action(run)
// 说明：它们额外负责 help / version 与子命令层级的拆分

// ═══════════════════════════════════════════
// 5. 解析失败要以非零退出码结束
// ═══════════════════════════════════════════

if (!values.name) {
  console.error('用法: cli --name <name> [--age n] [--verbose]')  // 说明：先打印 usage
  process.exit(1)                                     // 结果：非零退出码，CI 才能判定失败
}

// ═══════════════════════════════════════════
// 6. shebang 与 package.json 的 bin 字段
// ═══════════════════════════════════════════

// 文件首行：#!/usr/bin/env node                        // 说明：让脚本可直接执行
// package.json：{ "bin": { "my-cli": "./cli.js" } }     // 说明：安装后暴露全局命令
const cliName = 'my-cli'
console.log(cliName)                                  // 结果：终端里敲 my-cli 即可运行
