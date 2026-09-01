import{d as m,b as o,e as c,v as g,F as b,E as h,A as q,a0 as _,r as l,o as r,M as y,f as k,I as $}from"./DutfXOOr.js";const I={class:"demo-card"},C=["disabled"],x={key:0,class:"rl-log"},N=m({__name:"D30Readline",setup(V){const d=l(!1),e=l([]),v=l(0),i=[{q:"请输入你的名字：",key:"name"},{q:"请输入你的年龄：",key:"age"},{q:"请选择你喜欢的语言（js/ts/rust）：",key:"lang"},{q:"确认提交？(y/n)",key:"confirm"}],n=l({});function p(){d.value=!0,e.value=[],v.value=0,n.value={},u(0)}function u(t){if(t>=i.length){e.value.push(`
=== 收集完成 ===`),e.value.push(`名字: ${n.value.name||"(未输入)"}`),e.value.push(`年龄: ${n.value.age||"(未输入)"}`),e.value.push(`语言: ${n.value.lang||"(未输入)"}`),e.value.push(`确认: ${n.value.confirm||"(未输入)"}`),d.value=!1;return}const a=i[t];e.value.push(`
${a.q}`),e.value.push(`> _ (模拟输入: ${["栗子","3","ts","y"][t]})`),setTimeout(()=>{const s=["栗子","3","ts","y"][t];n.value[a.key]=s,e.value.push(`你输入了: ${s}`),u(t+1)},800)}return(t,a)=>(r(),o("div",I,[a[0]||(a[0]=c("p",null,[c("code",null,"readline"),g(" 模块提供逐行读取流数据的能力，常用于实现交互式命令行工具。")],-1)),c("button",{disabled:d.value,onClick:p},"开始模拟交互式输入",8,C),e.value.length?(r(),o("div",x,[(r(!0),o(b,null,h(e.value,(s,f)=>(r(),o("div",{key:f,class:y(s.startsWith(">")?"log-input":s.startsWith("你输入了")?"log-output":"log-question")},k(s),3))),128))])):q("",!0),a[1]||(a[1]=_(`<div class="rl-example" data-v-58fb0eea><h4 data-v-58fb0eea>基础用法：逐行读取文件</h4><pre class="mini-code" data-v-58fb0eea><code data-v-58fb0eea>const fs = require(&#39;node:fs&#39;)
const readline = require(&#39;node:readline&#39;)

const rl = readline.createInterface({
  input: fs.createReadStream(&#39;data.txt&#39;),
  output: process.stdout,
})

rl.on(&#39;line&#39;, (line) =&gt; {
  console.log(\\\`行内容: \\\${line}\\\`)
})

rl.on(&#39;close&#39;, () =&gt; {
  console.log(&#39;文件读取完成&#39;)
})</code></pre></div><div class="rl-example" data-v-58fb0eea><h4 data-v-58fb0eea>交互式 CLI 工具</h4><pre class="mini-code" data-v-58fb0eea><code data-v-58fb0eea>const readline = require(&#39;node:readline&#39;)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question(&#39;请输入名字: &#39;, (name) =&gt; {
  rl.question(&#39;请输入年龄: &#39;, (age) =&gt; {
    console.log(\\\`你好 \\\${name}, 你 \\\${age} 岁\\\`)
    rl.close()
  })
})</code></pre></div><div class="rl-example" data-v-58fb0eea><h4 data-v-58fb0eea>现代替代方案：<code data-v-58fb0eea>readline/promises</code></h4><pre class="mini-code" data-v-58fb0eea><code data-v-58fb0eea>const readline = require(&#39;node:readline/promises&#39;)

async function askQuestions() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  try {
    const name = await rl.question(&#39;名字: &#39;)
    const age = await rl.question(&#39;年龄: &#39;)
    console.log(\\\`你好 \\\${name}, 你 \\\${age} 岁\\\`)
  } finally {
    rl.close()
  }
}</code></pre></div><small data-v-58fb0eea>要点：<code data-v-58fb0eea>readline</code> 是处理流数据的低级 API；现代 CLI 工具推荐使用 <code data-v-58fb0eea>inquirer</code> 或 <code data-v-58fb0eea>prompts</code> 库以获得更丰富的交互体验。</small>`,4))]))}}),B=$(N,[["__scopeId","data-v-58fb0eea"]]);export{B as default};
