import{d as m,o as n,b as t,e,F as r,E as p,z as c,f as o,I as y}from"./DutfXOOr.js";const x={class:"demo-card"},b={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},g={style:{flex:"1"}},f={style:{flex:"1"}},D={class:"detail-box"},_=`<span style="color:#8a8a3a">// 1. Vercel — 推送即部署</span>
git push origin main  <span style="color:#7c7c99">// Vercel 自动构建部署</span>

<span style="color:#8a8a3a">// 2. Node.js 自托管</span>
<span style="color:#7c7c99">// next.config.js</span>
module.exports = { output: 'standalone' }

<span style="color:#7c7c99">// 构建 + 运行</span>
next build
node .next/standalone/server.js

<span style="color:#8a8a3a">// 3. Docker</span>
<span style="color:#7c7c99">// Dockerfile</span>
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci &amp;&amp; npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

<span style="color:#8a8a3a">// 4. 静态导出</span>
<span style="color:#7c7c99">// next.config.js</span>
module.exports = { output: 'export' }
<span style="color:#7c7c99">// 生成 out/ 目录，托管到任意静态服务器</span>`,v=m({__name:"X24Deployment",setup(k){const d=[{name:"Vercel",type:"全托管",desc:"Next.js 官方平台，零配置，Edge/Serverless",best:"生产首选",color:"#000000"},{name:"Node.js Server",type:"自托管",desc:'next start，需 output: "standalone"',best:"自有服务器 / Docker",color:"#65a30d"},{name:"Docker",type:"容器化",desc:"基于 standalone 产物构建镜像",best:"K8s / 云原生",color:"#0891b2"},{name:"Static Export",type:"纯静态",desc:'output: "export"，生成纯 HTML',best:"CDN / GitHub Pages",color:"#d97706"}],i=["本地构建：next build","验证产物：.next/ 或 .output/","选择部署目标：Vercel / Node / Docker / 静态","配置环境变量（生产环境）","设置 CDN + 域名 + HTTPS","配置监控 / 日志 / 错误上报"],u=["静态导出不支持：动态路由参数、Server Actions、Middleware、Image Optimization","standalone 不含 node_modules，需 COPY 静态资源","Vercel Edge Functions 限制：无 Node API，冷启动快"];return(O,l)=>(n(),t("div",x,[l[4]||(l[4]=e("h3",null,"部署与 Vercel",-1)),e("div",b,[e("div",g,[l[0]||(l[0]=e("h4",null,"部署目标对比",-1)),(n(),t(r,null,p(d,s=>e("div",{key:s.name,class:"target-card",style:c({borderLeftColor:s.color})},[e("strong",null,o(s.name),1),e("span",{class:"tag",style:c({background:s.color})},o(s.type),5),e("p",null,[e("small",null,o(s.desc),1)]),e("p",null,[e("small",null,"适合："+o(s.best),1)])],4)),64)),l[1]||(l[1]=e("h4",{style:{"margin-top":"12px"}},"部署步骤",-1)),e("ol",null,[(n(),t(r,null,p(i,(s,a)=>e("li",{key:a},[e("small",null,o(s),1)])),64))])]),e("div",f,[l[3]||(l[3]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:_}),e("div",D,[l[2]||(l[2]=e("p",null,[e("strong",null,"限制提醒：")],-1)),e("ul",null,[(n(),t(r,null,p(u,(s,a)=>e("li",{key:a},[e("small",null,o(s),1)])),64))])])])])]))}}),S=y(v,[["__scopeId","data-v-08221b16"]]);export{S as default};
