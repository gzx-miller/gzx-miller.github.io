import{d as o,b as p,e as s,v as c,F as i,E as d,f as l,r as u,o as r,M as g,I as f}from"./DutfXOOr.js";const m={class:"v13"},_={class:"tabs"},v=["onClick"],y={class:"code-block"},b=o({__name:"V13TypeScript",setup(k){const t=u("config"),e={config:`// vite.config.ts
export default defineConfig({
  // Vite 使用 esbuild 转译 TS（很快，但不做类型检查）
  esbuild: {
    loader: 'ts',       // 处理 .ts
    target: 'es2020',   // 目标 ES 版本
  },
})

// TypeScript 类型检查由 IDE 或单独运行 tsc --noEmit 完成
// Vite 不负责类型检查（保证开发服务器速度）`,vue:`<span class="cm">&lt;!-- Vue SFC 中使用 TypeScript --&gt;</span>
<span class="tag">&lt;script</span> <span class="attr">lang</span>=<span class="str">"ts"</span> <span class="attr">setup</span><span class="tag">&gt;</span>
<span class="keyword">import</span> { ref } <span class="keyword">from</span> <span class="str">'vue'</span>

<span class="keyword">interface</span> <span class="type">User</span> {
  name: string
  age: number
}

<span class="keyword">const</span> user = ref(<span class="type">User</span>)({ name: <span class="str">'张三'</span>, age: 25 })
<span class="tag">&lt;/script&gt;</span>

<span class="cm">&lt;!-- 如果需要类型推导，建议使用 &lt;script setup lang="ts"&gt; --&gt;</span>
<span class="tag">&lt;script</span> <span class="attr">lang</span>=<span class="str">"ts"</span> <span class="attr">setup</span><span class="tag">&gt;</span>
<span class="cm">// 更好的类型推导和 IDE 支持</span>
<span class="keyword">const</span> count = ref(<span class="num">0</span>) <span class="cm">// 自动推导为 Ref&lt;number&gt;</span>
<span class="tag">&lt;/script&gt;</span>`,check:`// 类型检查方案
// 1. IDE 实时检查（推荐）
// VS Code + Volar 扩展

// 2. 构建时检查（慢但安全）
export default defineConfig({
  typescript: {
    enabled: true,  // 默认 false，启用后构建会做类型检查
  },
})

// 3. 单独运行（最灵活）
// package.json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "npm run type-check && vite build"
  }
}`};return(E,n)=>(r(),p("div",m,[n[0]||(n[0]=s("p",{class:"intro"},[c("Vite 使用 Esbuild 极速转译 TypeScript，类型检查由 IDE 或 "),s("code",null,"vue-tsc"),c(" 单独完成。")],-1)),s("div",_,[(r(),p(i,null,d(e,(S,a)=>s("button",{key:a,class:g({active:t.value===a}),onClick:V=>t.value=a},l(a),11,v)),64))]),s("pre",y,[s("code",null,l(e[t.value]),1)])]))}}),T=f(b,[["__scopeId","data-v-cac426f2"]]);export{T as default};
