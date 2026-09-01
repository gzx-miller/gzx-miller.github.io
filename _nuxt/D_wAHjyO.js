import{d as h,b as l,e as s,M as u,F as v,E as y,A as r,v as p,f as i,z as B,r as b,o as a,I as M}from"./DutfXOOr.js";const S={class:"demo-card"},F={class:"tab-bar"},I={key:0},D={class:"format-grid"},z=["onClick"],E={class:"format-icon"},T={class:"format-ext"},V={class:"publish-steps"},L={class:"step-num"},U={class:"step-content"},N={key:0},$={key:1},J={key:1},K={key:2},w={key:3},A={class:"build-demo"},H={class:"build-header"},P=["disabled"],q={key:0,class:"build-progress"},O={class:"progress-track"},R={class:"progress-text"},G={key:1,class:"output-section"},Q={class:"output-list"},W={class:"file-icon"},X={class:"file-name"},Y={class:"file-size"},Z={class:"format-tag"},ss={key:2,class:"empty-state"},es=`<span style="color:#7c7c99">// vite.config.ts - 库模式配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  build: {
    <span style="color:#7c7c99">// 启用库模式</span>
    lib: {
      <span style="color:#7c7c99">// 入口文件</span>
      entry: resolve(__dirname, 'src/index.ts'),
      
      <span style="color:#7c7c99">// 库名（UMD/IIFE 时的全局变量名）</span>
      name: 'MyComponentLib',
      
      <span style="color:#7c7c99">// 输出格式，支持数组指定多种</span>
      formats: ['es', 'cjs', 'umd'],
      
      <span style="color:#7c7c99">// 输出文件名（可选）</span>
      fileName: (format) => \`my-lib.\${format}.js\`,
    },
    
    rollupOptions: {
      <span style="color:#7c7c99">// 外部化依赖，不打包进库中</span>
      external: ['vue', 'vue-router'],
      
      output: {
        <span style="color:#7c7c99">// UMD/IIFE 格式下的全局变量映射</span>
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
        },
      },
    },
    
    <span style="color:#7c7c99">// 是否生成 source map</span>
    sourcemap: true,
    
    <span style="color:#7c7c99">// 清空输出目录</span>
    emptyOutDir: true,
  },
})`,ts=`<span style="color:#7c7c99">// package.json 配置</span>
{
  "name": "my-component-lib",
  "version": "1.0.0",
  "type": "module",
  
  <span style="color:#7c7c99">// 入口文件声明</span>
  "main": "./dist/my-lib.cjs.js",    <span style="color:#7c7c99">// CommonJS</span>
  "module": "./dist/my-lib.es.js",   <span style="color:#7c7c99">// ES Module</span>
  "unpkg": "./dist/my-lib.umd.js",   <span style="color:#7c7c99">// UMD for CDN</span>
  "jsdelivr": "./dist/my-lib.umd.js",
  
  <span style="color:#7c7c99">// TypeScript 类型声明</span>
  "types": "./dist/index.d.ts",
  
  <span style="color:#7c7c99">// 导出映射（推荐）</span>
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js",
      "require": "./dist/my-lib.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/style.css"
  },
  
  <span style="color:#7c7c99">// 发布到 npm 的文件</span>
  "files": ["dist"],
  
  <span style="color:#7c7c99">// peerDependencies</span>
  "peerDependencies": {
    "vue": "^3.3.0"
  }
}`,os=`<span style="color:#7c7c99">// src/index.ts - 库入口文件</span>
import type { App } from 'vue'
import Button from './components/Button.vue'
import Card from './components/Card.vue'
import Input from './components/Input.vue'

<span style="color:#7c7c99">// 单独导出组件</span>
export { Button, Card, Input }

<span style="color:#7c7c99">// 导出类型</span>
export type { ButtonProps, CardProps } from './types'

<span style="color:#7c7c99">// 默认导出插件形式</span>
export default {
  install(app: App) {
    app.component('MyButton', Button)
    app.component('MyCard', Card)
    app.component('MyInput', Input)
  }
}`,ns=h({__name:"V20LibraryMode",setup(ls){const c=b("intro"),_=[{name:"ES Module",ext:".es.js",icon:"📦",desc:"现代 ESM 格式，支持 Tree Shaking，推荐用于现代打包工具"},{name:"CommonJS",ext:".cjs.js",icon:"📄",desc:"Node.js 传统格式，用于 require() 引入"},{name:"UMD",ext:".umd.js",icon:"🌐",desc:"通用格式，可直接在浏览器通过 script 标签使用"},{name:"IIFE",ext:".iife.js",icon:"⚡",desc:"立即执行函数，适合直接在浏览器引用的单文件"}],g=b("es"),o=b({isBuilding:!1,progress:0,outputFiles:[],currentStep:""}),d=["🔍 解析入口文件...","📦 打包组件源码...","🎨 处理样式文件...","🏷️  生成类型声明...","📝 生成 ES Module 格式...","📝 生成 CommonJS 格式...","📝 生成 UMD 格式...","✅ 构建完成！"],m=[{name:"my-lib.es.js",size:"45.2 KB",format:"es"},{name:"my-lib.cjs.js",size:"47.8 KB",format:"cjs"},{name:"my-lib.umd.js",size:"52.1 KB",format:"umd"},{name:"style.css",size:"8.3 KB",format:"css"},{name:"index.d.ts",size:"3.1 KB",format:"types"}];async function k(){if(!o.value.isBuilding){o.value.isBuilding=!0,o.value.progress=0,o.value.outputFiles=[],o.value.currentStep=d[0];for(let n=0;n<d.length;n++){if(await new Promise(e=>setTimeout(e,400+Math.random()*300)),o.value.currentStep=d[n],o.value.progress=(n+1)/d.length*100,n>=4&&n<=6){const e=n-4;m[e]&&o.value.outputFiles.push(m[e])}n===6&&(o.value.outputFiles.push(m[3]),o.value.outputFiles.push(m[4]))}setTimeout(()=>{o.value.isBuilding=!1},500)}}function x(n){return{es:"📦",cjs:"📄",umd:"🌐",css:"🎨",types:"🏷️"}[n]||"📁"}function j(n){return{es:"ES Module",cjs:"CommonJS",umd:"UMD",css:"样式",types:"类型声明"}[n]||n}const C=[{step:1,title:"构建库",desc:"npm run build",cmd:!0},{step:2,title:"登录 npm",desc:"npm login",cmd:!0},{step:3,title:"检查包名",desc:"确保包名唯一且符合规范",cmd:!1},{step:4,title:"发布包",desc:"npm publish",cmd:!0},{step:5,title:"验证安装",desc:"npm install your-package",cmd:!0}];return(n,e)=>(a(),l("div",S,[e[12]||(e[12]=s("h3",null,"V20 · 库模式与组件打包发布",-1)),s("div",F,[s("button",{class:u(["tab-btn",{active:c.value==="intro"}]),onClick:e[0]||(e[0]=t=>c.value="intro")},"输出格式",2),s("button",{class:u(["tab-btn",{active:c.value==="config"}]),onClick:e[1]||(e[1]=t=>c.value="config")},"配置示例",2),s("button",{class:u(["tab-btn",{active:c.value==="package"}]),onClick:e[2]||(e[2]=t=>c.value="package")},"package.json",2),s("button",{class:u(["tab-btn",{active:c.value==="demo"}]),onClick:e[3]||(e[3]=t=>c.value="demo")},"构建演示",2)]),c.value==="intro"?(a(),l("div",I,[e[4]||(e[4]=s("p",{class:"intro-text"}," Vite 库模式用于打包组件库、工具函数等，支持多种输出格式，可发布到 npm 供其他项目使用。 ",-1)),s("div",D,[(a(),l(v,null,y(_,(t,f)=>s("div",{key:t.name,class:u(["format-card",{selected:g.value===["es","cjs","umd","iife"][f]}]),onClick:is=>g.value=["es","cjs","umd","iife"][f]},[s("span",E,i(t.icon),1),s("strong",null,i(t.name),1),s("code",T,i(t.ext),1),s("p",null,[s("small",null,i(t.desc),1)])],10,z)),64))]),e[5]||(e[5]=s("h4",{style:{"margin-top":"12px"}},"发布流程",-1)),s("div",V,[(a(),l(v,null,y(C,t=>s("div",{key:t.step,class:"publish-step"},[s("span",L,i(t.step),1),s("div",U,[s("strong",null,i(t.title),1),t.cmd?(a(),l("code",N,i(t.desc),1)):(a(),l("small",$,i(t.desc),1))])])),64))])])):r("",!0),c.value==="config"?(a(),l("div",J,[s("pre",{class:"mini-code",innerHTML:es}),e[6]||(e[6]=s("div",{class:"tips-box"},[s("p",null,[s("strong",null,"关键点："),p("使用 "),s("code",null,"build.lib"),p(" 启用库模式，"),s("code",null,"external"),p(" 外部化 vue 等依赖（避免重复打包），"),s("code",null,"globals"),p(" 为 UMD 格式指定全局变量名。")])],-1)),e[7]||(e[7]=s("h4",{style:{"margin-top":"12px"}},"入口文件示例",-1)),s("pre",{class:"mini-code",innerHTML:os})])):r("",!0),c.value==="package"?(a(),l("div",K,[s("pre",{class:"mini-code",innerHTML:ts}),e[8]||(e[8]=s("div",{class:"tips-box"},[s("p",null,[s("strong",null,"推荐配置："),p("使用 "),s("code",null,"exports"),p(" 字段声明导出，比 main/module 更灵活。"),s("code",null,"peerDependencies"),p(" 声明依赖的宿主库版本范围。")])],-1))])):r("",!0),c.value==="demo"?(a(),l("div",w,[s("div",A,[s("div",H,[e[9]||(e[9]=s("span",{class:"build-title"},"🏗️ 库模式构建模拟器",-1)),s("button",{class:"action-btn primary",disabled:o.value.isBuilding,onClick:k},i(o.value.isBuilding?"构建中...":"▶ 开始构建"),9,P)]),o.value.isBuilding||o.value.progress>0?(a(),l("div",q,[s("div",O,[s("div",{class:"progress-fill",style:B({width:o.value.progress+"%"})},null,4)]),s("span",R,i(o.value.currentStep),1)])):r("",!0),o.value.outputFiles.length>0?(a(),l("div",G,[e[10]||(e[10]=s("h5",null,"📁 输出文件 (dist/)",-1)),s("ul",Q,[(a(!0),l(v,null,y(o.value.outputFiles,t=>(a(),l("li",{key:t.name,class:"output-item"},[s("span",W,i(x(t.format)),1),s("span",X,i(t.name),1),s("span",Y,i(t.size),1),s("span",Z,i(j(t.format)),1)]))),128))])])):r("",!0),o.value.outputFiles.length===0&&!o.value.isBuilding?(a(),l("div",ss," 点击「开始构建」模拟库模式打包过程 ")):r("",!0)]),e[11]||(e[11]=s("div",{class:"tips-box"},[s("p",null,[s("strong",null,"实际项目："),p("运行 "),s("code",null,"vite build"),p(" 后，dist 目录会生成多种格式的产物、样式文件和类型声明（需配置 vite-plugin-dts）。")])],-1))])):r("",!0)]))}}),cs=M(ns,[["__scopeId","data-v-a5859f29"]]);export{cs as default};
