import{d as b,b as t,e,M as c,F as r,E as u,v as p,A as i,r as y,o,f as a,I as m}from"./DutfXOOr.js";const g={class:"demo-card"},f={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},k={key:0},x={class:"concept-grid"},C={class:"concept-icon"},M={key:1},S={key:2},V=`<span style="color:#7c7c99">// vite.config.ts</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  <span style="color:#7c7c99">// 开发服务器</span>
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'  <span style="color:#7c7c99">// 代理后端</span>
    }
  },
  
  <span style="color:#7c7c99">// 路径别名</span>
  resolve: {
    alias: { '@': '/src' }
  },
  
  <span style="color:#7c7c99">// 生产构建优化</span>
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})`,w=`<span style="color:#7c7c99">// Vite 两大阶段</span>

<span style="color:#e85d04">┌─────────────────────────────────┐</span>
<span style="color:#e85d04">│     开发阶段 (dev)              │</span>
<span style="color:#e85d04">│  浏览器 ←ESM→ Vite Dev Server   │</span>
<span style="color:#e85d04">│  按需加载，不打包               │</span>
<span style="color:#e85d04">│  HMR: 只更新变化的模块          │</span>
<span style="color:#e85d04">└─────────────────────────────────┘</span>

<span style="color:#65a30d">┌─────────────────────────────────┐</span>
<span style="color:#65a30d">│     生产构建 (build)            │</span>
<span style="color:#65a30d">│  Rollup 打包 + Tree Shaking     │</span>
<span style="color:#65a30d">│  代码分割 + 压缩                │</span>
<span style="color:#65a30d">│  输出 dist/ 静态资源            │</span>
<span style="color:#65a30d">└─────────────────────────────────┘</span>`,R=b({__name:"V01Core",setup(E){const n=y("concept"),d=[{label:"原生 ESM",icon:"⚡",desc:"开发阶段直接用浏览器加载 ES 模块，无需打包。浏览器按需请求文件，冷启动不受项目规模影响。"},{label:"基于 Rollup",icon:"📦",desc:"生产构建使用 Rollup，输出高度优化的静态资源：Tree Shaking、代码分割、压缩一应俱全。"},{label:"HMR 热更新",icon:"🔥",desc:"基于 ESM 的热更新，只更新修改的模块，保留组件状态，速度极快（毫秒级）。"},{label:"插件系统",icon:"🔌",desc:"兼容 Rollup 插件接口，同时提供 Vite 特有钩子（config、configureServer 等）。"}],v=[{aspect:"开发启动",vite:"毫秒级（原生 ESM）",webpack:"秒级（需打包）"},{aspect:"HMR 速度",vite:"毫秒级（单模块）",webpack:"秒级（重打包）"},{aspect:"冷启动",vite:"不受项目规模影响",webpack:"随规模变慢"},{aspect:"生产构建",vite:"Rollup",webpack:"webpack 自身"},{aspect:"配置复杂度",vite:"简洁",webpack:"复杂"},{aspect:"生态成熟度",vite:"快速成长中",webpack:"非常成熟"}];return(_,l)=>(o(),t("div",g,[l[8]||(l[8]=e("h3",null,"Vite 核心：开发与构建双引擎",-1)),e("div",f,[e("button",{class:c(["tab-btn",{active:n.value==="concept"}]),onClick:l[0]||(l[0]=s=>n.value="concept")},"核心概念",2),e("button",{class:c(["tab-btn",{active:n.value==="compare"}]),onClick:l[1]||(l[1]=s=>n.value="compare")},"对比 Webpack",2),e("button",{class:c(["tab-btn",{active:n.value==="config"}]),onClick:l[2]||(l[2]=s=>n.value="config")},"配置示例",2)]),n.value==="concept"?(o(),t("div",k,[e("div",x,[(o(),t(r,null,u(d,s=>e("div",{key:s.label,class:"concept-card"},[e("span",C,a(s.icon),1),e("strong",null,a(s.label),1),e("p",null,[e("small",null,a(s.desc),1)])])),64))]),l[3]||(l[3]=e("h4",{style:{"margin-top":"12px"}},"两大阶段",-1)),e("pre",{class:"mini-code",innerHTML:w}),l[4]||(l[4]=e("pre",{class:"mini-code",style:{"margin-top":"10px"}},[e("span",{style:{color:"#7c7c99"}},"# 快速创建项目"),p(`
npm create vite@latest my-app
`),e("span",{style:{color:"#7c7c99"}},"# 开发启动（无需打包）"),p(`
npm run dev
`),e("span",{style:{color:"#7c7c99"}},"# 生产构建"),p(`
npm run build`)],-1))])):i("",!0),n.value==="compare"?(o(),t("div",M,[e("table",null,[l[5]||(l[5]=e("thead",null,[e("tr",null,[e("th",null,"维度"),e("th",null,"Vite"),e("th",null,"Webpack")])],-1)),e("tbody",null,[(o(),t(r,null,u(v,s=>e("tr",{key:s.aspect},[e("td",null,[e("strong",null,a(s.aspect),1)]),e("td",null,[e("small",null,a(s.vite),1)]),e("td",null,[e("small",null,a(s.webpack),1)])])),64))])]),l[6]||(l[6]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"为什么 Vite 快："),p("开发阶段利用浏览器原生 ESM，每个模块独立请求，无需打包成 bundle。Webpack 必须先打包再启动。")])],-1))])):i("",!0),n.value==="config"?(o(),t("div",S,[e("pre",{class:"mini-code",innerHTML:V}),l[7]||(l[7]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"常用配置："),p("plugins（框架插件）、server.proxy（代理）、resolve.alias（路径别名）、build.rollupOptions（分包）。")])],-1))])):i("",!0)]))}}),H=m(R,[["__scopeId","data-v-468802df"]]);export{H as default};
