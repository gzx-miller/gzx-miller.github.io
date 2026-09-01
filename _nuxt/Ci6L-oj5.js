import{d as v,b as s,e as t,M as c,F as p,E as r,A as n,a0 as i,r as y,o as l,f as d,I as b}from"./DutfXOOr.js";const x={class:"demo-card"},S={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},f={key:0},j={key:1},g={class:"mini-code small"},C={key:2},M=`<span style="color:#7c7c99">// CJS 模块 (utils.cjs)</span>
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
<span style="color:#7c7c99">// .mjs 始终 ESM，.cjs 始终 CJS</span>`,E=`<span style="color:#7c7c99">// math.mjs — ES Modules</span>
export const add = (a, b) => a + b
export const mul = (a, b) => a * b
export default function calc(x) { return x * 2 }

<span style="color:#7c7c99">// 使用</span>
import calc, { add, mul } from './math.mjs'
console.log(add(1, 2))   <span style="color:#8a8a3a">// 3</span>
console.log(calc(5))     <span style="color:#8a8a3a">// 10</span>`,k=`<span style="color:#7c7c99">// math.cjs — CommonJS</span>
const add = (a, b) => a + b
const mul = (a, b) => a * b
module.exports = { add, mul }

<span style="color:#7c7c99">// 使用</span>
const { add, mul } = require('./math.cjs')
console.log(add(1, 2))   <span style="color:#8a8a3a">// 3</span>`,J=v({__name:"D01ModuleSystem",setup(q){const a=y("compare"),m=[{aspect:"语法",esm:"import / export",cjs:"require / module.exports"},{aspect:"加载时机",esm:"编译期确定依赖（静态）",cjs:"运行时确定依赖（动态）"},{aspect:"是否支持 Tree Shaking",esm:"✅ 支持（静态分析）",cjs:"❌ 不支持"},{aspect:"顶层 this",esm:"undefined",cjs:"module.exports"},{aspect:"循环引用",esm:"引用已导出的绑定（可能 TDZ）",cjs:"得到已执行部分的 exports"},{aspect:"异步加载",esm:"import()",cjs:"require() 本身同步"},{aspect:"适用场景",esm:"现代前端 / Node 14+",cjs:"旧 Node / 旧工具链"}],u=[{type:"命名导出",syntax:`export const x = 1
export function f() {}`,importSyntax:"import { x, f } from './mod'"},{type:"默认导出",syntax:"export default class Cat {}",importSyntax:"import Cat from './mod'"},{type:"聚合导出",syntax:`export { x, f } from './a'
export { default as Cat } from './b'`,importSyntax:"import { x, f, Cat } from './mod'"},{type:"重命名导出",syntax:"export { x as value }",importSyntax:"import { value } from './mod'"}];return(T,o)=>(l(),s("div",x,[o[9]||(o[9]=t("h3",null,"模块系统：ESM 与 CommonJS",-1)),t("div",S,[t("button",{class:c(["tab-btn",{active:a.value==="compare"}]),onClick:o[0]||(o[0]=e=>a.value="compare")},"ESM vs CJS",2),t("button",{class:c(["tab-btn",{active:a.value==="exports"}]),onClick:o[1]||(o[1]=e=>a.value="exports")},"导出方式",2),t("button",{class:c(["tab-btn",{active:a.value==="interop"}]),onClick:o[2]||(o[2]=e=>a.value="interop")},"互操作",2)]),a.value==="compare"?(l(),s("div",f,[t("table",null,[o[3]||(o[3]=t("thead",null,[t("tr",null,[t("th",null,"维度"),t("th",null,"ES Modules"),t("th",null,"CommonJS")])],-1)),t("tbody",null,[(l(),s(p,null,r(m,e=>t("tr",{key:e.aspect},[t("td",null,[t("strong",null,d(e.aspect),1)]),t("td",null,[t("small",null,d(e.esm),1)]),t("td",null,[t("small",null,d(e.cjs),1)])])),64))])]),t("div",{style:{display:"flex",gap:"12px","margin-top":"12px"}},[t("div",{style:{flex:"1"}},[o[4]||(o[4]=t("h4",null,"ESM 代码",-1)),t("pre",{class:"mini-code",innerHTML:E})]),t("div",{style:{flex:"1"}},[o[5]||(o[5]=t("h4",null,"CJS 代码",-1)),t("pre",{class:"mini-code",innerHTML:k})])])])):n("",!0),a.value==="exports"?(l(),s("div",j,[t("table",null,[o[6]||(o[6]=t("thead",null,[t("tr",null,[t("th",null,"类型"),t("th",null,"导出语法"),t("th",null,"导入语法")])],-1)),t("tbody",null,[(l(),s(p,null,r(u,e=>t("tr",{key:e.type},[t("td",null,[t("strong",null,d(e.type),1)]),t("td",null,[t("pre",g,d(e.syntax),1)]),t("td",null,[t("code",null,d(e.importSyntax),1)])])),64))])]),o[7]||(o[7]=i('<div class="tips-box" data-v-c02db1dc><p data-v-c02db1dc><strong data-v-c02db1dc>规则：</strong></p><ul data-v-c02db1dc><li data-v-c02db1dc>一个模块只能有一个 <code data-v-c02db1dc>default</code>，但可以有多个命名导出</li><li data-v-c02db1dc><code data-v-c02db1dc>import *</code> 会把所有命名导出收集到一个命名空间对象</li><li data-v-c02db1dc>静态 <code data-v-c02db1dc>import</code> 必须在顶层，动态 <code data-v-c02db1dc>import()</code> 可在任何位置</li></ul></div>',1))])):n("",!0),a.value==="interop"?(l(),s("div",C,[t("pre",{class:"mini-code",innerHTML:M}),o[8]||(o[8]=i('<div class="tips-box" data-v-c02db1dc><p data-v-c02db1dc><strong data-v-c02db1dc>互操作要点：</strong></p><ul data-v-c02db1dc><li data-v-c02db1dc>ESM 导入 CJS：default 即 <code data-v-c02db1dc>module.exports</code>，命名导出需解构</li><li data-v-c02db1dc>CJS 导入 ESM：必须用动态 <code data-v-c02db1dc>import()</code>（异步）</li><li data-v-c02db1dc><code data-v-c02db1dc>package.json</code> 的 <code data-v-c02db1dc>&quot;type&quot;: &quot;module&quot;</code> 决定 <code data-v-c02db1dc>.js</code> 的模块类型</li><li data-v-c02db1dc>Node 12+ 支持 ESM，现代前端工具链（Vite/Webpack）默认 ESM</li></ul></div>',1))])):n("",!0)]))}}),h=b(J,[["__scopeId","data-v-c02db1dc"]]);export{h as default};
