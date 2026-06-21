<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'compare' | 'exports' | 'interop'>('compare')

const compareRows = [
  { aspect: '语法', esm: 'import / export', cjs: 'require / module.exports' },
  { aspect: '加载时机', esm: '编译期确定依赖（静态）', cjs: '运行时确定依赖（动态）' },
  { aspect: '是否支持 Tree Shaking', esm: '✅ 支持（静态分析）', cjs: '❌ 不支持' },
  { aspect: '顶层 this', esm: 'undefined', cjs: 'module.exports' },
  { aspect: '循环引用', esm: '引用已导出的绑定（可能 TDZ）', cjs: '得到已执行部分的 exports' },
  { aspect: '异步加载', esm: 'import()', cjs: 'require() 本身同步' },
  { aspect: '适用场景', esm: '现代前端 / Node 14+', cjs: '旧 Node / 旧工具链' },
]

const exportTypes = [
  { type: '命名导出', syntax: 'export const x = 1\nexport function f() {}', importSyntax: "import { x, f } from './mod'" },
  { type: '默认导出', syntax: 'export default class Cat {}', importSyntax: "import Cat from './mod'" },
  { type: '聚合导出', syntax: "export { x, f } from './a'\nexport { default as Cat } from './b'", importSyntax: "import { x, f, Cat } from './mod'" },
  { type: '重命名导出', syntax: 'export { x as value }', importSyntax: "import { value } from './mod'" },
]

const interopCode = `<span style="color:#7c7c99">// CJS 模块 (utils.cjs)</span>
const { join } = require('node:path')
module.exports = { greet: (name) => \`Hello, \${name}\` }

<span style="color:#7c7c99">// ESM 导入 CJS（default 即 module.exports）</span>
<span style="color:#8a8a3a">// app.mjs</span>
import utils from './utils.cjs'
console.log(utils.greet('栗子'))  <span style="color:#7c7c99">// Hello, 栗子</span>

<span style="color:#7c7c99">// CJS 导入 ESM（必须动态 import）</span>
<span style="color:#8a8a3a">// legacy.cjs</span>
const { greet } = await import('./app.mjs')
console.log(greet('栗子'))

<span style="color:#7c7c99">// package.json 声明模块类型</span>
{ "type": "module" }  <span style="color:#7c7c99">// .js 文件按 ESM 处理</span>
<span style="color:#7c7c99">// 无 type 字段 → .js 按 CJS 处理</span>
<span style="color:#7c7c99">// .mjs 始终 ESM，.cjs 始终 CJS</span>`

const esmCode = `<span style="color:#7c7c99">// math.mjs — ES Modules</span>
export const add = (a, b) => a + b
export const mul = (a, b) => a * b
export default function calc(x) { return x * 2 }

<span style="color:#7c7c99">// 使用</span>
import calc, { add, mul } from './math.mjs'
console.log(add(1, 2))   <span style="color:#8a8a3a">// 3</span>
console.log(calc(5))     <span style="color:#8a8a3a">// 10</span>`

const cjsCode = `<span style="color:#7c7c99">// math.cjs — CommonJS</span>
const add = (a, b) => a + b
const mul = (a, b) => a * b
module.exports = { add, mul }

<span style="color:#7c7c99">// 使用</span>
const { add, mul } = require('./math.cjs')
console.log(add(1, 2))   <span style="color:#8a8a3a">// 3</span>`
</script>

<template>
  <div class="demo-card">
    <h3>模块系统：ESM 与 CommonJS</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'compare' }" @click="activeTab = 'compare'">ESM vs CJS</button>
      <button class="tab-btn" :class="{ active: activeTab === 'exports' }" @click="activeTab = 'exports'">导出方式</button>
      <button class="tab-btn" :class="{ active: activeTab === 'interop' }" @click="activeTab = 'interop'">互操作</button>
    </div>

    <div v-if="activeTab === 'compare'">
      <table>
        <thead><tr><th>维度</th><th>ES Modules</th><th>CommonJS</th></tr></thead>
        <tbody>
          <tr v-for="r in compareRows" :key="r.aspect">
            <td><strong>{{ r.aspect }}</strong></td>
            <td><small>{{ r.esm }}</small></td>
            <td><small>{{ r.cjs }}</small></td>
          </tr>
        </tbody>
      </table>
      <div style="display:flex;gap:12px;margin-top:12px;">
        <div style="flex:1;">
          <h4>ESM 代码</h4>
          <pre class="mini-code" v-html="esmCode"></pre>
        </div>
        <div style="flex:1;">
          <h4>CJS 代码</h4>
          <pre class="mini-code" v-html="cjsCode"></pre>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'exports'">
      <table>
        <thead><tr><th>类型</th><th>导出语法</th><th>导入语法</th></tr></thead>
        <tbody>
          <tr v-for="e in exportTypes" :key="e.type">
            <td><strong>{{ e.type }}</strong></td>
            <td><pre class="mini-code small">{{ e.syntax }}</pre></td>
            <td><code>{{ e.importSyntax }}</code></td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        <p><strong>规则：</strong></p>
        <ul>
          <li>一个模块只能有一个 <code>default</code>，但可以有多个命名导出</li>
          <li><code>import *</code> 会把所有命名导出收集到一个命名空间对象</li>
          <li>静态 <code>import</code> 必须在顶层，动态 <code>import()</code> 可在任何位置</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'interop'">
      <pre class="mini-code" v-html="interopCode"></pre>
      <div class="tips-box">
        <p><strong>互操作要点：</strong></p>
        <ul>
          <li>ESM 导入 CJS：default 即 <code>module.exports</code>，命名导出需解构</li>
          <li>CJS 导入 ESM：必须用动态 <code>import()</code>（异步）</li>
          <li><code>package.json</code> 的 <code>"type": "module"</code> 决定 <code>.js</code> 的模块类型</li>
          <li>Node 12+ 支持 ESM，现代前端工具链（Vite/Webpack）默认 ESM</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.mini-code.small { font-size: 11px; padding: 6px; margin: 0; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
ul { padding-left: 18px; font-size: 12px; }
</style>
