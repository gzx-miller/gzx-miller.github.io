import{s as C}from"./CLeGk598.js";import{d as M,b as o,e,M as p,F as b,E as f,v as u,A as v,f as a,z as h,r as m,g as k,o as i,I as z}from"./DutfXOOr.js";const E={class:"demo-card"},B={class:"tab-bar"},w={key:0},T={class:"tips-grid"},V={class:"tip-icon"},D={key:1},K={key:2},F={key:3},I={class:"demo-header"},P=["disabled"],$={key:0,class:"progress-bar"},j={class:"progress-text"},H={class:"dep-list"},L={class:"dep-name"},N={class:"dep-size"},J={class:"summary-bar"},R=`<span style="color:#7c7c99">// vite.config.ts - 依赖预构建配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  <span style="color:#7c7c99">// 依赖预构建配置</span>
  optimizeDeps: {
    <span style="color:#7c7c99">// 强制预构建的依赖</span>
    include: [
      'vue',
      'vue-router',
      'pinia',
      'lodash-es',
      'dayjs',
    ],
    
    <span style="color:#7c7c99">// 排除不预构建的依赖</span>
    exclude: ['axios'],
    
    <span style="color:#7c7c99">// 自定义 esbuild 选项</span>
    esbuildOptions: {
      target: 'es2020',
    },
  },
  
  <span style="color:#7c7c99">// 强制重新预构建</span>
  <span style="color:#7c7c99">// 命令行: vite --force</span>
})`,U=`<span style="color:#e85d04">┌─────────────────────────────────────┐</span>
<span style="color:#e85d04">│  启动 Vite Dev Server                │</span>
<span style="color:#e85d04">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#d97706">┌─────────────────────────────────────┐</span>
<span style="color:#d97706">│  扫描入口文件，收集依赖              │</span>
<span style="color:#d97706">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#65a30d">┌─────────────────────────────────────┐</span>
<span style="color:#65a30d">│  esbuild 预构建 CommonJS / UMD      │</span>
<span style="color:#65a30d">│  → 转换为 ESM 模块                   │</span>
<span style="color:#65a30d">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#0891b2">┌─────────────────────────────────────┐</span>
<span style="color:#0891b2">│  缓存到 node_modules/.vite          │</span>
<span style="color:#0891b2">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#7c3aed">┌─────────────────────────────────────┐</span>
<span style="color:#7c3aed">│  浏览器直接加载预构建后的 ESM       │</span>
<span style="color:#7c3aed">└─────────────────────────────────────┘</span>`,A=M({__name:"V17DependencyPrebundle",setup(O){const n=m("intro"),d=m([{name:"vue",size:"42.3 KB",bundled:!0,status:"cached"},{name:"vue-router",size:"28.1 KB",bundled:!0,status:"cached"},{name:"pinia",size:"18.5 KB",bundled:!0,status:"cached"},{name:"lodash-es",size:"95.2 KB",bundled:!0,status:"new"},{name:"dayjs",size:"6.8 KB",bundled:!0,status:"cached"},{name:"axios",size:"14.3 KB",bundled:!1,status:"native"}]),r=m(!1),c=m(100),y=k(()=>d.value.filter(l=>l.bundled).reduce((l,s)=>{const t=parseFloat(s.size);return l+t},0).toFixed(1)),g=[{icon:"⚡",title:"为什么需要预构建",desc:"将 CommonJS/UMD 转换为 ESM，让浏览器能直接加载；将多文件依赖打包成单文件，减少 HTTP 请求数。"},{icon:"💾",title:"缓存机制",desc:"预构建产物缓存在 node_modules/.vite 中。依赖不变则复用缓存，仅新依赖或配置变化时才重新构建。"},{icon:"🎯",title:"include 与 exclude",desc:"include 强制预构建（如某些深层导入的依赖），exclude 排除依赖（如纯 ESM 且模块很多的库，按需加载更好）。"},{icon:"🔄",title:"强制重新构建",desc:"使用 vite --force 或删除 node_modules/.vite 目录，可强制重新预构建所有依赖。"}];function _(){if(r.value)return;r.value=!0,c.value=0,d.value.forEach(s=>{s.status==="cached"&&(s.status="rebuilding")});const l=C(()=>{c.value+=Math.random()*15+5,c.value>=100&&(c.value=100,clearInterval(l),d.value.forEach(s=>{s.status==="rebuilding"&&(s.status="cached")}),setTimeout(()=>{r.value=!1},500))},200)}function x(l){return{cached:"已缓存",new:"新增",native:"原生ESM",rebuilding:"构建中"}[l]||l}function S(l){return{cached:"status-cached",new:"status-new",native:"status-native",rebuilding:"status-rebuilding"}[l]||""}return(l,s)=>(i(),o("div",E,[s[11]||(s[11]=e("h3",null,"V17 · 依赖预构建与优化",-1)),e("div",B,[e("button",{class:p(["tab-btn",{active:n.value==="intro"}]),onClick:s[0]||(s[0]=t=>n.value="intro")},"核心概念",2),e("button",{class:p(["tab-btn",{active:n.value==="flow"}]),onClick:s[1]||(s[1]=t=>n.value="flow")},"构建流程",2),e("button",{class:p(["tab-btn",{active:n.value==="config"}]),onClick:s[2]||(s[2]=t=>n.value="config")},"配置示例",2),e("button",{class:p(["tab-btn",{active:n.value==="demo"}]),onClick:s[3]||(s[3]=t=>n.value="demo")},"交互演示",2)]),n.value==="intro"?(i(),o("div",w,[e("div",T,[(i(),o(b,null,f(g,t=>e("div",{key:t.title,class:"tip-card"},[e("span",V,a(t.icon),1),e("strong",null,a(t.title),1),e("p",null,[e("small",null,a(t.desc),1)])])),64))]),s[4]||(s[4]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"核心目标："),u("提升开发启动速度和页面加载性能。将大量小模块的依赖打包成单个文件，将非 ESM 格式转换为 ESM，让浏览器原生模块加载更高效。")])],-1))])):v("",!0),n.value==="flow"?(i(),o("div",D,[e("pre",{class:"mini-code",innerHTML:U}),s[5]||(s[5]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"第一次启动慢？"),u("首次启动时 Vite 需要扫描并预构建所有依赖，这是正常的。后续启动会直接使用缓存，速度极快。")])],-1))])):v("",!0),n.value==="config"?(i(),o("div",K,[e("pre",{class:"mini-code",innerHTML:R}),s[6]||(s[6]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"常用场景："),u("深层导入的依赖未被自动发现时用 include；某些库已经是纯 ESM 且希望按需加载时用 exclude。")])],-1))])):v("",!0),n.value==="demo"?(i(),o("div",F,[e("div",I,[s[7]||(s[7]=e("span",null,"依赖预构建模拟器",-1)),e("button",{class:"action-btn",disabled:r.value,onClick:_},a(r.value?"构建中...":"🔄 重新预构建"),9,P)]),r.value?(i(),o("div",$,[e("div",{class:"progress-fill",style:h({width:c.value+"%"})},null,4),e("span",j,a(Math.floor(c.value))+"%",1)])):v("",!0),e("ul",H,[(i(!0),o(b,null,f(d.value,t=>(i(),o("li",{key:t.name,class:"dep-item"},[e("span",L,a(t.name),1),e("span",N,a(t.size),1),e("span",{class:p(["dep-status",S(t.status)])},a(x(t.status)),3)]))),128))]),e("div",J,[e("span",null,[s[8]||(s[8]=u("预构建总大小：",-1)),e("strong",null,a(y.value)+" KB",1)]),e("span",null,[s[9]||(s[9]=u("已缓存：",-1)),e("strong",null,a(d.value.filter(t=>t.status==="cached").length),1),u(" / "+a(d.value.length),1)])]),s[10]||(s[10]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"观察："),u("点击「重新预构建」按钮，观察依赖状态变化和进度条。实际项目中缓存存在于 "),e("code",null,"node_modules/.vite"),u(" 目录。")])],-1))])):v("",!0)]))}}),Q=z(A,[["__scopeId","data-v-b0b743a6"]]);export{Q as default};
