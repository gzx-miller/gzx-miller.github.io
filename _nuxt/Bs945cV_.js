import{d as C,b as o,e,M as d,F as g,E as f,v as a,A as c,f as l,K as J,L as T,r as u,g as V,o as i,I as _}from"./DutfXOOr.js";const X={class:"demo-card"},j={class:"tab-bar"},E={key:0},w={class:"feature-grid"},I={class:"feature-icon"},M={class:"stat-fast"},D={key:1},F={key:2},$={class:"code-editor"},h={class:"mini-code"},L={key:3},N={class:"transform-demo"},U={class:"editor-pane"},B={class:"editor-header"},O=["disabled"],R={class:"editor-pane"},z={class:"editor-header"},H={class:"badge output-badge"},P={class:"mini-code output-code"},A=`<span style="color:#7c7c99">// vite.config.ts - esbuild 配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),  <span style="color:#7c7c99">// Vue JSX 支持</span>
  ],
  
  <span style="color:#7c7c99">// esbuild 全局配置</span>
  esbuild: {
    <span style="color:#7c7c99">// JSX 配置（React 风格）</span>
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    
    <span style="color:#7c7c99">// 目标环境</span>
    target: 'es2020',
    
    <span style="color:#7c7c99">// 构建时移除 console/debugger</span>
    pure: ['console.log', 'debugger'],
    
    <span style="color:#7c7c99">// 依赖预构建的 esbuild 选项</span>
  },
  
  optimizeDeps: {
    esbuildOptions: {
      <span style="color:#7c7c99">// 预构建专用配置</span>
      target: 'es2020',
    }
  }
})`,G=`<span style="color:#7c7c99">// tsconfig.json</span>
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",  <span style="color:#7c7c99">// JSX 保留给 Vite/esbuild</span>
    "esModuleInterop": true,
    "skipLibCheck": true,
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}`,K=C({__name:"V18Esbuild",setup(q){const n=u("intro"),S=[{icon:"⚡",title:"极速编译",desc:"esbuild 用 Go 编写，比传统 JS 工具快 10-100 倍，毫秒级完成 TS/JSX 转换。"},{icon:"🎯",title:"TypeScript 支持",desc:"直接编译 .ts/.tsx 文件，只做类型擦除，不做类型检查（类型检查交给 IDE 或 tsc）。"},{icon:"🧩",title:"JSX 转换",desc:"支持 React JSX、Vue JSX 等多种 JSX 风格，可通过配置自定义 pragma 和 Fragment。"},{icon:"📦",title:"依赖预构建",desc:"Vite 使用 esbuild 进行依赖预构建，将 CommonJS/UMD 转换为 ESM 模块。"}],p=u(`// TypeScript 示例
interface User {
  id: number
  name: string
  email: string
}

function greet(user: User): string {
  const message: string = \`你好，\${user.name}！\`
  return message
}

const user: User = {
  id: 1,
  name: '小明',
  email: 'xiaoming@example.com'
}

console.log(greet(user))`),x=u(`// Vue JSX 示例
import { defineComponent, ref } from 'vue'

interface CounterProps {
  initialValue?: number
  title?: string
}

export default defineComponent({
  name: 'Counter',
  props: {
    initialValue: { type: Number, default: 0 },
    title: { type: String, default: '计数器' }
  },
  setup(props: CounterProps) {
    const count = ref(props.initialValue || 0)
    const increment = () => count.value++
    const decrement = () => count.value--
    
    return () => (
      <div class="counter-card">
        <h3>{props.title}</h3>
        <div class="count-display">{count.value}</div>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
    )
  }
})`),y=V(()=>p.value.replace(/interface\s+\w+\s*\{[^}]*\}/g,"").replace(/:\s*\w+(\[\])?/g,"").replace(/<[^>]+>/g,"").replace(/^\s*\/\/.*$/gm,b=>b)),k=u([{name:"TypeScript 编译",esbuild:"12ms",webpack:"1,200ms",babel:"850ms"},{name:"JSX 转换",esbuild:"8ms",webpack:"650ms",babel:"420ms"},{name:"依赖预构建",esbuild:"230ms",webpack:"3,500ms",babel:"2,800ms"}]);let m=null;const r=u(!1);function v(){r.value=!0,m&&clearTimeout(m),m=window.setTimeout(()=>{r.value=!1},300)}return(b,t)=>(i(),o("div",X,[t[15]||(t[15]=e("h3",null,"V18 · esbuild 转换与 JSX/TS 处理",-1)),e("div",j,[e("button",{class:d(["tab-btn",{active:n.value==="intro"}]),onClick:t[0]||(t[0]=s=>n.value="intro")},"核心特性",2),e("button",{class:d(["tab-btn",{active:n.value==="ts"}]),onClick:t[1]||(t[1]=s=>n.value="ts")},"TypeScript",2),e("button",{class:d(["tab-btn",{active:n.value==="jsx"}]),onClick:t[2]||(t[2]=s=>n.value="jsx")},"JSX 支持",2),e("button",{class:d(["tab-btn",{active:n.value==="demo"}]),onClick:t[3]||(t[3]=s=>n.value="demo")},"实时转换",2)]),n.value==="intro"?(i(),o("div",E,[e("div",w,[(i(),o(g,null,f(S,s=>e("div",{key:s.title,class:"feature-card"},[e("span",I,l(s.icon),1),e("strong",null,l(s.title),1),e("p",null,[e("small",null,l(s.desc),1)])])),64))]),t[6]||(t[6]=e("h4",{style:{"margin-top":"12px"}},"性能对比",-1)),e("table",null,[t[5]||(t[5]=e("thead",null,[e("tr",null,[e("th",null,"任务"),e("th",null,"esbuild"),e("th",null,"webpack"),e("th",null,"babel")])],-1)),e("tbody",null,[(i(!0),o(g,null,f(k.value,s=>(i(),o("tr",{key:s.name},[e("td",null,[e("strong",null,l(s.name),1)]),e("td",null,[e("span",M,l(s.esbuild),1)]),e("td",null,[e("small",null,l(s.webpack),1)]),e("td",null,[e("small",null,l(s.babel),1)])]))),128))])]),t[7]||(t[7]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"注意："),a("esbuild 只做语法转换，不做类型检查。类型检查请使用 "),e("code",null,"tsc --noEmit"),a(" 或 IDE 的 TypeScript 支持。")])],-1))])):c("",!0),n.value==="ts"?(i(),o("div",D,[e("pre",{class:"mini-code",innerHTML:A}),t[8]||(t[8]=e("h4",{style:{"margin-top":"12px"}},"tsconfig 配置",-1)),e("pre",{class:"mini-code",innerHTML:G}),t[9]||(t[9]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"类型检查："),a("Vite 开发时不做类型检查以保证速度。建议在构建前或 CI 中运行 "),e("code",null,"vue-tsc --noEmit"),a(" 进行类型检查。")])],-1))])):c("",!0),n.value==="jsx"?(i(),o("div",F,[e("div",$,[t[10]||(t[10]=e("div",{class:"editor-header"},[e("span",null,"Vue JSX 示例"),e("span",{class:"badge"},".tsx")],-1)),e("pre",h,[e("code",null,l(x.value),1)])]),t[11]||(t[11]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"Vue JSX 插件："),a("使用 "),e("code",null,"@vitejs/plugin-vue-jsx"),a(" 启用 Vue JSX 支持，支持 v-model、v-on 等指令的 JSX 写法。")])],-1))])):c("",!0),n.value==="demo"?(i(),o("div",L,[e("div",N,[e("div",U,[e("div",B,[t[12]||(t[12]=e("span",null,"TypeScript 输入",-1)),e("button",{class:"transform-btn",onClick:v,disabled:r.value},l(r.value?"转换中...":"⚡ 转换"),9,O)]),J(e("textarea",{"onUpdate:modelValue":t[4]||(t[4]=s=>p.value=s),class:"code-textarea",onInput:v,spellcheck:"false"},null,544),[[T,p.value]])]),e("div",R,[e("div",z,[t[13]||(t[13]=e("span",null,"JavaScript 输出",-1)),e("span",H,l(r.value?"转换中":"已转换"),1)]),e("pre",P,[e("code",null,l(y.value),1)])])]),t[14]||(t[14]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"体验："),a("在左侧编辑 TypeScript 代码，右侧实时显示转换后的 JavaScript。实际项目中 esbuild 转换发生在请求时，速度极快。")])],-1))])):c("",!0)]))}}),W=_(K,[["__scopeId","data-v-07ae8b14"]]);export{W as default};
