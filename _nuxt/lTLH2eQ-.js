import{d as u,b as c,e,F as d,E as p,f as r,g as _,o as i,M as v,r as f,I as b}from"./DutfXOOr.js";const h={class:"v09"},M={class:"tabs"},g=["onClick"],A={class:"code-block"},P=u({__name:"V09MPA",setup(x){const o=f("config"),n={config:`// vite.config.ts - 多页面应用配置
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})

// 每个 HTML 文件都是独立的入口
// 共享的依赖会被提取为 common chunk`,structure:`my-mpa-app/
├── index.html        # 首页入口
├── about.html       # 关于页入口
├── contact.html     # 联系页入口
├── src/
│   ├── main.ts     # 首页 JS
│   ├── about.ts    # 关于页 JS
│   └── shared/     # 共享代码
└── vite.config.ts

// 每个 HTML 文件直接使用
// &lt;script type="module" src="/src/main.ts"&gt;&lt;/script&gt;`,compare:`// MPA vs SPA
// MPA：每个页面独立 HTML，适合 SEO 要求高的场景
// SPA：单 HTML + 前端路由，适合 Web App

// Vite 同时支持两种模式
// MPA：配置多个入口
// SPA：默认行为，一个 index.html`},l=_(()=>n[o.value]||""),m=t=>{(t==="config"||t==="structure"||t==="compare")&&(o.value=t)};return(t,a)=>(i(),c("div",h,[a[0]||(a[0]=e("p",{class:"intro"},"Vite 支持多页面应用（MPA），每个 HTML 文件都是独立入口，共享依赖自动提取。",-1)),e("div",M,[(i(),c(d,null,p(n,(S,s)=>e("button",{key:s,class:v({active:o.value===s}),onClick:C=>m(s)},r(s),11,g)),64))]),e("pre",A,[e("code",null,r(l.value),1)])]))}}),T=b(P,[["__scopeId","data-v-e4546eab"]]);export{T as default};
