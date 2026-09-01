import{d as l,b as a,e as s,F as r,E as p,f as i,r as d,o as c,M as u,I as _}from"./DutfXOOr.js";const g={class:"v06"},m={class:"tabs"},v=["onClick"],b={class:"code-block"},f=l({__name:"V06Assets",setup(h){const t=d("import"),o={import:`// 显式导入（推荐）
import logo from './assets/logo.png'
// → 开发阶段：/src/assets/logo.png
// → 构建后：/assets/logo.hash.png（自动哈希）

// 图片路径会自动处理
const img = new URL('./assets/bg.png', import.meta.url).href
// → 构建后同样会哈希化`,public:`// public 目录下的文件（不经过 Vite 处理）
// 直接复制到构建产物的根目录

// 引用方式：绝对路径
<img src="/favicon.svg" />
// → 开发时从 /public/favicon.svg 提供
// → 构建时原样复制到 dist/favicon.svg

// 适合：robots.txt、favicon、不常变更的静态资源`,inline:`// 小资源自动内联（base64）
// 默认阈值：4KB（可配置）

export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // 4KB，单位 byte
  },
})

// 小于 4KB 的图片会被内联为 base64
// 减少 HTTP 请求，但增加 bundle 体积`};return(B,n)=>(c(),a("div",g,[n[0]||(n[0]=s("p",{class:"intro"},"Vite 对静态资源有三种处理方式：导入哈希化、public 原样复制、小资源内联。",-1)),s("div",m,[(c(),a(r,null,p(o,(x,e)=>s("button",{key:e,class:u({active:t.value===e}),onClick:C=>t.value=e},i(e),11,v)),64))]),s("pre",b,[s("code",null,i(o[t.value]),1)])]))}}),k=_(f,[["__scopeId","data-v-841ded95"]]);export{k as default};
