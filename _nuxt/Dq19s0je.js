const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const inputArgs = ref('--name 栗子 --age 3 --verbose')
const parsed = computed(() => {
  const args = inputArgs.value.trim().split(/\\s+/).filter(Boolean)
  const result: Record<string, string | boolean> = {}
  let i = 0
  while (i < args.length) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2)
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        result[key] = args[i + 1]
        i += 2
      } else {
        result[key] = true
        i += 1
      }
    } else {
      i += 1
    }
  }
  return result
})

const libraries = [
  { name: 'commander', stars: '12.8k', desc: '最流行的 CLI 框架，Express 风格 API' },
  { name: 'yargs', stars: '8.5k', desc: '功能全面，支持命令组、补全、国际化' },
  { name: 'minimist', stars: '2.1k', desc: '轻量级参数解析，无依赖' },
  { name: 'cac', stars: '1.2k', desc: 'Vue CLI 使用的轻量 CLI 框架' },
]
<\/script>

<template><div class="demo-card">
  <p>Node.js CLI 工具需要解析命令行参数。<code>process.argv</code> 提供原始参数，但实际项目使用 <code>commander</code> 等库。</p>

  <div class="cli-input">
    <label>模拟命令行输入 <code>node cli.js</code></label>
    <input v-model="inputArgs" placeholder="--name 栗子 --age 3 --verbose" />
  </div>

  <div class="parse-result">
    <strong>解析结果：</strong>
    <pre class="mini-code"><code>process.argv = ['node', 'cli.js', \${inputArgs.split(' ').map(a => \`'\${a}'\`).join(', ')}]
→ 解析为：
{{ JSON.stringify(parsed, null, 2) }}</code></pre>
  </div>

  <div class="lib-compare">
    <strong>常用 CLI 库对比：</strong>
    <div class="lib-list">
      <div v-for="lib in libraries" :key="lib.name" class="lib-item">
        <div class="lib-name">{{ lib.name }} <span class="lib-stars">★ {{ lib.stars }}</span></div>
        <div class="lib-desc">{{ lib.desc }}</div>
      </div>
    </div>
  </div>

  <pre class="mini-code"><code>// 使用 commander 构建 CLI 工具
const { program } = require('commander')

program
  .name('my-cli')
  .description('我的命令行工具')
  .version('1.0.0')

program.command('greet &lt;name&gt;')
  .description('问候某人')
  .option('-v, --verbose', '详细输出')
  .action((name, options) => {
    console.log(\\\`Hello \\\${name}!\\\`)
    if (options.verbose) console.log('(详细模式)')
  })

program.parse()</code></pre>
  <small>要点：<code>process.argv[0]</code> 是 node 路径，<code>process.argv[1]</code> 是脚本路径，实际参数从 <code>process.argv[2]</code> 开始。</small>
</div></template>

<style scoped>
.cli-input { margin: 0.6rem 0; }
.cli-input label { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; }
.cli-input input { width: 100%; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 13px; box-sizing: border-box; }
.parse-result { margin: 0.6rem 0; }
.lib-compare { margin: 0.8rem 0; }
.lib-list { display: grid; gap: 6px; margin-top: 6px; }
.lib-item { background: #fff9f0; padding: 6px 10px; border-radius: 4px; font-size: 12px; }
.lib-name { font-weight: 600; color: #e8590c; }
.lib-stars { font-size: 11px; color: #f59e0b; margin-left: 6px; }
.lib-desc { color: #64748b; margin-top: 2px; }
</style>
`;export{n as default};
