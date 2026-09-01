import{d as j,b as o,e as s,M as d,F as f,E as b,f as i,v as p,A as c,z,r as m,g as k,o as a,I as A}from"./DutfXOOr.js";const T={class:"demo-card"},M={class:"tab-bar"},K={key:0},L={class:"page-switcher"},S=["onClick"],H={class:"page-icon"},P={class:"page-preview"},V={class:"preview-header"},D={class:"preview-title"},E={class:"preview-path"},O={class:"preview-body"},$={class:"preview-desc"},I={class:"preview-features"},N={class:"preview-entry"},q={key:1},J={key:2},U={key:3},Y={class:"build-demo"},G={class:"build-header"},Q=["disabled"],R={key:0,class:"build-progress"},W={class:"progress-track"},X={class:"progress-text"},Z={key:1,class:"output-section"},ss={class:"output-list"},es={class:"file-icon"},ts={class:"file-name"},ls={class:"file-size"},ns={class:"type-tag"},is={class:"build-summary"},os={class:"summary-item"},as={class:"summary-value"},us={class:"summary-item"},rs={class:"summary-value"},ps={class:"summary-item"},cs={class:"summary-value highlight"},ds={key:2,class:"empty-state"},ms=`<span style="color:#7c7c99">// vite.config.ts - 多页面配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  build: {
    rollupOptions: {
      <span style="color:#7c7c99">// 配置多页面入口</span>
      input: {
        <span style="color:#7c7c99">// 首页</span>
        main: resolve(__dirname, 'index.html'),
        
        <span style="color:#7c7c99">// 管理后台</span>
        admin: resolve(__dirname, 'admin.html'),
        
        <span style="color:#7c7c99">// 文档中心</span>
        docs: resolve(__dirname, 'docs.html'),
        
        <span style="color:#7c7c99">// 移动端</span>
        mobile: resolve(__dirname, 'mobile.html'),
      },
      
      output: {
        <span style="color:#7c7c99">// 按页面拆分 chunk</span>
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia')) {
              return 'vendor-vue'
            }
            if (id.includes('element-plus')) {
              return 'vendor-ui'
            }
            return 'vendor'
          }
        },
      },
    },
  },
  
  server: {
    <span style="color:#7c7c99">// 开发服务器打开指定页面</span>
    open: '/index.html',
  },
})`,vs=`<span style="color:#7c7c99">&lt;!-- admin.html --&gt;</span>
&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;link rel="icon" type="image/svg+xml" href="/favicon.ico" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
  &lt;title&gt;管理后台&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="admin-app"&gt;&lt;/div&gt;
  &lt;script type="module" src="/src/admin/main.ts"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;

<span style="color:#7c7c99">&lt;!-- src/admin/main.ts --&gt;</span>
import { createApp } from 'vue'
import AdminApp from './AdminApp.vue'
import router from './router'
import store from './store'

createApp(AdminApp)
  .use(router)
  .use(store)
  .mount('#admin-app')`,hs=`project-root/
├── index.html           <span style="color:#7c7c99"># 首页入口</span>
├── admin.html           <span style="color:#7c7c99"># 管理后台入口</span>
├── docs.html            <span style="color:#7c7c99"># 文档中心入口</span>
├── mobile.html          <span style="color:#7c7c99"># 移动端入口</span>
├── vite.config.ts
├── package.json
└── src/
    ├── main.ts          <span style="color:#7c7c99"># 首页入口脚本</span>
    ├── App.vue
    ├── components/      <span style="color:#7c7c99"># 共享组件</span>
    │   ├── Button.vue
    │   └── Card.vue
    ├── utils/           <span style="color:#7c7c99"># 共享工具</span>
    │   └── request.ts
    ├── stores/          <span style="color:#7c7c99"># 共享状态</span>
    │   └── user.ts
    ├── admin/           <span style="color:#7c7c99"># 管理后台模块</span>
    │   ├── main.ts
    │   ├── AdminApp.vue
    │   ├── router/
    │   └── views/
    ├── docs/            <span style="color:#7c7c99"># 文档中心模块</span>
    │   ├── main.ts
    │   ├── DocsApp.vue
    │   └── pages/
    └── mobile/          <span style="color:#7c7c99"># 移动端模块</span>
        ├── main.ts
        ├── MobileApp.vue
        └── views/`,gs=j({__name:"V21MultiPage",setup(ys){const u=m("intro"),v=[{id:"home",name:"首页",path:"/index.html",entry:"src/main.ts",icon:"🏠"},{id:"admin",name:"管理后台",path:"/admin.html",entry:"src/admin/main.ts",icon:"⚙️"},{id:"docs",name:"文档中心",path:"/docs.html",entry:"src/docs/main.ts",icon:"📚"},{id:"mobile",name:"移动端",path:"/mobile.html",entry:"src/mobile/main.ts",icon:"📱"}],F=m("home"),h=k(()=>v.find(n=>n.id===F.value)||v[0]),t=m({isBuilding:!1,progress:0,currentStep:"",outputFiles:[]}),g=["🔍 解析多页面入口...","📦 打包首页资源...","📦 打包管理后台...","📦 打包文档中心...","📦 打包移动端...","🎨 提取公共样式...","🔗 拆分共享代码...","✅ 构建完成！"],r=[{name:"index.html",size:"1.2 KB",type:"html"},{name:"admin.html",size:"1.1 KB",type:"html"},{name:"docs.html",size:"1.0 KB",type:"html"},{name:"mobile.html",size:"1.0 KB",type:"html"},{name:"assets/main-abc123.js",size:"68.4 KB",type:"js"},{name:"assets/admin-def456.js",size:"85.2 KB",type:"js"},{name:"assets/docs-ghi789.js",size:"52.1 KB",type:"js"},{name:"assets/mobile-jkl012.js",size:"45.8 KB",type:"js"},{name:"assets/vendor-vue-mno345.js",size:"125.6 KB",type:"vendor"},{name:"assets/style-pqr678.css",size:"24.3 KB",type:"css"}];async function B(){if(!t.value.isBuilding){t.value.isBuilding=!0,t.value.progress=0,t.value.outputFiles=[];for(let n=0;n<g.length;n++)await new Promise(e=>setTimeout(e,350+Math.random()*250)),t.value.currentStep=g[n],t.value.progress=(n+1)/g.length*100,n===1&&(t.value.outputFiles.push(r[0]),t.value.outputFiles.push(r[4])),n===2&&(t.value.outputFiles.push(r[1]),t.value.outputFiles.push(r[5])),n===3&&(t.value.outputFiles.push(r[2]),t.value.outputFiles.push(r[6])),n===4&&(t.value.outputFiles.push(r[3]),t.value.outputFiles.push(r[7])),n===6&&(t.value.outputFiles.push(r[8]),t.value.outputFiles.push(r[9]));setTimeout(()=>{t.value.isBuilding=!1},500)}}function C(n){return{html:"📄",js:"📜",css:"🎨",vendor:"📦"}[n]||"📁"}function w(n){return{html:"HTML",js:"页面 JS",css:"样式",vendor:"公共依赖"}[n]||n}const y=m("home"),x={home:{title:"首页",desc:"面向普通用户的主站点，展示产品介绍、新闻资讯等内容。",features:["响应式设计","SEO 优化","内容管理"]},admin:{title:"管理后台",desc:"运营人员使用的后台管理系统，包含数据统计、用户管理等功能。",features:["权限控制","数据可视化","批量操作"]},docs:{title:"文档中心",desc:"产品文档和 API 文档站点，提供搜索、导航等功能。",features:["全文搜索","版本管理","代码高亮"]},mobile:{title:"移动端",desc:"针对手机端优化的 H5 页面，提供类原生的交互体验。",features:["触摸优化","轻量快速","离线缓存"]}},_=k(()=>x[y.value]);return(n,e)=>(a(),o("div",T,[e[17]||(e[17]=s("h3",null,"V21 · 多页面应用配置与入口管理",-1)),s("div",M,[s("button",{class:d(["tab-btn",{active:u.value==="intro"}]),onClick:e[0]||(e[0]=l=>u.value="intro")},"适用场景",2),s("button",{class:d(["tab-btn",{active:u.value==="structure"}]),onClick:e[1]||(e[1]=l=>u.value="structure")},"目录结构",2),s("button",{class:d(["tab-btn",{active:u.value==="config"}]),onClick:e[2]||(e[2]=l=>u.value="config")},"配置示例",2),s("button",{class:d(["tab-btn",{active:u.value==="demo"}]),onClick:e[3]||(e[3]=l=>u.value="demo")},"构建演示",2)]),u.value==="intro"?(a(),o("div",K,[e[5]||(e[5]=s("p",{class:"intro-text"}," 多页面应用（MPA）是指有多个独立 HTML 入口页面的应用。Vite 通过配置多个入口，支持多页面同时开发和构建。 ",-1)),s("div",L,[(a(),o(f,null,b(v,l=>s("button",{key:l.id,class:d(["page-tab",{active:y.value===l.id}]),onClick:_s=>y.value=l.id},[s("span",H,i(l.icon),1),s("span",null,i(l.name),1)],10,S)),64))]),s("div",P,[s("div",V,[s("span",D,i(h.value.icon)+" "+i(_.value.title),1),s("code",E,i(h.value.path),1)]),s("div",O,[s("p",$,i(_.value.desc),1),s("div",I,[(a(!0),o(f,null,b(_.value.features,l=>(a(),o("span",{key:l,class:"feature-tag"}," ✓ "+i(l),1))),128))]),s("div",N,[e[4]||(e[4]=s("span",null,"入口文件：",-1)),s("code",null,i(h.value.entry),1)])])]),e[6]||(e[6]=s("div",{class:"tips-box"},[s("p",null,[s("strong",null,"适用场景："),p("一个项目包含多个独立应用（如前台 + 后台）、需要 SEO 的页面、不同端的入口页面等。共享组件和工具可放在公共目录复用。")])],-1))])):c("",!0),u.value==="structure"?(a(),o("div",q,[e[7]||(e[7]=s("h4",null,"推荐目录结构",-1)),s("pre",{class:"mini-code",innerHTML:hs}),e[8]||(e[8]=s("div",{class:"tips-box"},[s("p",null,[s("strong",null,"最佳实践："),p("共享的组件、工具函数、状态管理放在根目录的 "),s("code",null,"src/components"),p("、"),s("code",null,"src/utils"),p("、"),s("code",null,"src/stores"),p(" 中，各页面独立模块放在各自目录下。")])],-1))])):c("",!0),u.value==="config"?(a(),o("div",J,[s("pre",{class:"mini-code",innerHTML:ms}),e[9]||(e[9]=s("h4",{style:{"margin-top":"12px"}},"HTML 入口示例",-1)),s("pre",{class:"mini-code",innerHTML:vs}),e[10]||(e[10]=s("div",{class:"tips-box"},[s("p",null,[s("strong",null,"注意："),p("每个 HTML 文件需要有对应的入口脚本（main.ts），mount 到不同的 DOM 元素（如 #app、#admin-app）以避免冲突。")])],-1))])):c("",!0),u.value==="demo"?(a(),o("div",U,[s("div",Y,[s("div",G,[e[11]||(e[11]=s("span",{class:"build-title"},"🏗️ 多页面构建模拟器",-1)),s("button",{class:"action-btn primary",disabled:t.value.isBuilding,onClick:B},i(t.value.isBuilding?"构建中...":"▶ 开始构建"),9,Q)]),t.value.isBuilding||t.value.progress>0?(a(),o("div",R,[s("div",W,[s("div",{class:"progress-fill",style:z({width:t.value.progress+"%"})},null,4)]),s("span",X,i(t.value.currentStep),1)])):c("",!0),t.value.outputFiles.length>0?(a(),o("div",Z,[e[15]||(e[15]=s("h5",null,"📁 输出文件 (dist/)",-1)),s("ul",ss,[(a(!0),o(f,null,b(t.value.outputFiles,l=>(a(),o("li",{key:l.name,class:"output-item"},[s("span",es,i(C(l.type)),1),s("span",ts,i(l.name),1),s("span",ls,i(l.size),1),s("span",ns,i(w(l.type)),1)]))),128))]),s("div",is,[s("div",os,[s("span",as,i(t.value.outputFiles.filter(l=>l.type==="html").length),1),e[12]||(e[12]=s("span",{class:"summary-label"},"HTML 页面",-1))]),s("div",us,[s("span",rs,i(t.value.outputFiles.filter(l=>l.type==="js").length),1),e[13]||(e[13]=s("span",{class:"summary-label"},"页面脚本",-1))]),s("div",ps,[s("span",cs,i(t.value.outputFiles.filter(l=>l.type==="vendor").length),1),e[14]||(e[14]=s("span",{class:"summary-label"},"共享依赖",-1))])])])):c("",!0),t.value.outputFiles.length===0&&!t.value.isBuilding?(a(),o("div",ds," 点击「开始构建」模拟多页面打包过程 ")):c("",!0)]),e[16]||(e[16]=s("div",{class:"tips-box"},[s("p",null,[s("strong",null,"代码分割："),p("使用 "),s("code",null,"manualChunks"),p(" 将共享依赖（如 vue、组件库）提取为单独的 chunk，多个页面共享缓存，减少重复加载。")])],-1))])):c("",!0)]))}}),bs=A(gs,[["__scopeId","data-v-ef8f5216"]]);export{bs as default};
