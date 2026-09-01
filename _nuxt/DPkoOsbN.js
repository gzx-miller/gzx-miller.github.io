import{d as x,b as o,e,M as u,F as a,E as p,f as n,A as d,v as i,r as f,o as r,I as v}from"./DutfXOOr.js";const S={class:"demo-card"},y={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},b={key:0},m={style:{display:"flex",gap:"16px"}},C={style:{flex:"1"}},k={class:"step-num"},R={style:{width:"100%"}},_={key:1},N={key:2},I=`// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,     // 自动爬取页面内的链接
      routes: ['/', '/about', '/products'],
      failOnError: false,   // 预渲染失败不中断
    },
  },
})`,w=`// nuxt.config.ts - ISR (增量静态再生)
export default defineNuxtConfig({
  routeRules: {
    '/blog/**': { swr: 3600 },     // 1小时后重新验证
    '/products/**': { swr: 86400 }, // 1天后重新验证
    '/': { prerender: true },       // 构建时预渲染
  },
})`,G=`// nuxt.config.ts - 混合渲染
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },              // SSG
    '/blog/**': { swr: 3600 },             // ISR
    '/admin/**': { ssr: false },           // SPA
    '/api/**': { cors: true },             // API CORS
    '/dashboard': { ssr: true },           // SSR
  },
})`,h=x({__name:"N17SSG",setup(P){const l=f("ssg"),c=[{step:1,action:"nuxt generate 启动构建"},{step:2,action:"Nitro 启动内部服务器执行 SSR"},{step:3,action:"遍历预渲染路由，生成 HTML 文件"},{step:4,action:"收集所有 JS/CSS/图片等静态资源"},{step:5,action:"输出到 .output/public/ 目录"},{step:6,action:"部署到任意静态托管服务"}],g=[{target:"GitHub Pages",cmd:"npx nuxi generate",note:"纯静态，部署 .output/public"},{target:"Vercel",cmd:"自动检测",note:"零配置部署"},{target:"Cloudflare Pages",cmd:"npx nuxi build",note:"preset: cloudflare-pages"},{target:"Node.js 服务器",cmd:"npx nuxi build",note:"preset: node-server"},{target:"Deno Deploy",cmd:"npx nuxi build",note:"preset: deno-server"}];return(z,t)=>(r(),o("div",S,[t[8]||(t[8]=e("h3",null,"静态站点生成与混合渲染",-1)),e("div",y,[e("button",{class:u({active:l.value==="ssg"}),onClick:t[0]||(t[0]=s=>l.value="ssg")},"SSG",2),e("button",{class:u({active:l.value==="isr"}),onClick:t[1]||(t[1]=s=>l.value="isr")},"ISR",2),e("button",{class:u({active:l.value==="hybrid"}),onClick:t[2]||(t[2]=s=>l.value="hybrid")},"混合渲染",2)]),l.value==="ssg"?(r(),o("div",b,[e("div",m,[e("div",C,[t[4]||(t[4]=e("h4",null,"SSG 构建流程",-1)),(r(),o(a,null,p(c,s=>e("div",{key:s.step,class:"step-row"},[e("span",k,n(s.step),1),i(" "+n(s.action),1)])),64)),t[5]||(t[5]=e("h4",{style:{"margin-top":"12px"}},"部署目标",-1)),e("table",R,[t[3]||(t[3]=e("thead",null,[e("tr",null,[e("th",null,"目标"),e("th",null,"命令"),e("th",null,"说明")])],-1)),e("tbody",null,[(r(),o(a,null,p(g,s=>e("tr",{key:s.target},[e("td",null,n(s.target),1),e("td",null,[e("code",null,n(s.cmd),1)]),e("td",null,n(s.note),1)])),64))])])]),e("div",{style:{flex:"1"}},[e("pre",{class:"code-block"},n(I))])])])):d("",!0),l.value==="isr"?(r(),o("div",_,[e("div",{style:{display:"flex",gap:"16px"}},[e("div",{style:{flex:"1"}},[e("pre",{class:"code-block"},n(w))]),t[6]||(t[6]=e("div",{style:{flex:"1"}},[e("div",{class:"desc-box"},[e("h4",null,"ISR 原理"),e("ol",{style:{"font-size":"13px"}},[e("li",null,"首次请求时服务端渲染并缓存"),e("li",null,"后续请求直接返回缓存（快速响应）"),e("li",null,"超过 swr 时间后，后台重新生成"),e("li",null,"新请求获得更新后的页面")]),e("p",{style:{"font-size":"13px","margin-top":"8px"}},"💡 ISR 需要服务器运行环境（非纯静态托管）")])],-1))])])):d("",!0),l.value==="hybrid"?(r(),o("div",N,[e("pre",{class:"code-block"},n(G)),t[7]||(t[7]=e("div",{style:{"margin-top":"8px","font-size":"13px"}},[e("strong",null,"渲染模式对照："),e("ul",null,[e("li",null,[e("code",null,"prerender: true"),i(" — SSG：构建时生成，零服务器成本")]),e("li",null,[e("code",null,"swr: 秒"),i(" — ISR：缓存 + 定时刷新，适合内容站")]),e("li",null,[e("code",null,"ssr: false"),i(" — SPA：纯客户端，适合后台管理")]),e("li",null,"默认 — SSR：每次请求渲染，最灵活")])],-1))])):d("",!0)]))}}),V=v(h,[["__scopeId","data-v-8e07c51e"]]);export{V as default};
