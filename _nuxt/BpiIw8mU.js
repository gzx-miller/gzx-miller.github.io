import{d as i,b as n,e,F as S,E as l,f as a,r as u,o as c,M as d,I as p}from"./DutfXOOr.js";const v={class:"v11"},_={class:"tabs"},m=["onClick"],f={class:"code-block"},V=i({__name:"V11SSR",setup(x){const r=u("concept"),s={concept:`// Vite SSR 工作原理
// 1. 服务端渲染：在服务器上运行 Vue 组件，生成 HTML
// 2. 客户端激活（Hydration）：在浏览器中接管静态 HTML

// 优势
// - SEO 友好（搜索引擎可抓取完整 HTML）
// - 首屏速度快（无需等待 JS 下载执行）
// - 低端设备体验更好`,setup:`// vite.config.ts
export default defineConfig({
  ssr: {
    // SSR 外部化依赖（不打包到服务端 bundle）
    external: ['vue', 'vue-router'],
  },
})

// server.ts - 简易 SSR 服务器
import { createServer } from 'vite'
import { renderToString } from 'vue/server-renderer'

const vite = await createServer({ ssr: true })
const html = await vite.transformIndexHtml(url, template)
const app = createSSRApp(App)
const rendered = await renderToString(app)`,nuxt:`// Nuxt 3 基于 Vite + Vue 3 的 SSR 框架
// 零配置 SSR、自动路由、文件系统路由

// Nuxt 内置了：
// - Vite 作为构建工具
// - Vue 3 SSR
// - 自动代码分割
// - 静态站点生成（SSG）

// 本仓库就是使用 Nuxt 4 + Vite 构建的！`};return(R,o)=>(c(),n("div",v,[o[0]||(o[0]=e("p",{class:"intro"},"Vite 原生支持 SSR，Nuxt 3/4 就是基于 Vite + Vue 3 SSR 构建的。",-1)),e("div",_,[(c(),n(S,null,l(s,(b,t)=>e("button",{key:t,class:d({active:r.value===t}),onClick:g=>r.value=t},a(t),11,m)),64))]),e("pre",f,[e("code",null,a(s[r.value]),1)])]))}}),H=p(V,[["__scopeId","data-v-d955d87e"]]);export{H as default};
