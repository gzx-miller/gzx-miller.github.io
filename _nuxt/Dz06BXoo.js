import{d as u,b as l,e,F as a,E as p,v as r,o as s,z as d,f as n,I as m}from"./DutfXOOr.js";const x={class:"demo-card"},f={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},y={style:{flex:"1"}},g=`<span style="color:#8a8a3a">// .env 文件</span>
NEXT_PUBLIC_API_URL=https://api.example.com  <span style="color:#7c7c99">// 客户端可见</span>
DATABASE_URL=postgresql://...               <span style="color:#7c7c99">// 仅服务端</span>
SECRET_KEY=xxx                              <span style="color:#7c7c99">// 仅服务端</span>

<span style="color:#8a8a3a">// 文件优先级（高→低）</span>
.env.local        <span style="color:#7c7c99">// 本地覆盖（gitignore）</span>
.env.[development|production]
.env

<span style="color:#8a8a3a">// next.config.js</span>
<span style="color:#e85d04">/** @type {import('next').NextConfig} */</span>
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }]
  },
  async rewrites() {
    return [
      { source: '/api/v1/:path*', destination: 'https://backend.example.com/:path*' }
    ]
  },
  output: 'standalone',
}
module.exports = nextConfig

<span style="color:#8a8a3a">// 读取运行时配置（服务端）</span>
import { db } from '@/lib/db'  <span style="color:#7c7c99">// process.env.DATABASE_URL</span>`,v=u({__name:"X22EnvConfig",setup(_){const i=[{prefix:"NEXT_PUBLIC_",scope:"客户端 + 服务端",example:"NEXT_PUBLIC_API_URL",exposed:"✅ 打包进前端",color:"#65a30d"},{prefix:"（无前缀）",scope:"仅服务端",example:"DATABASE_URL",exposed:"❌ 不会泄露",color:"#e85d04"}],c=[{option:"reactStrictMode",desc:"开启 React 严格模式",default:"true"},{option:"images.remotePatterns",desc:"远程图片域名白名单",default:"[]"},{option:"experimental.serverActions",desc:"启用 Server Actions",default:"已默认启用"},{option:"rewrites",desc:"URL 重写（代理）",default:"—"},{option:"redirects",desc:"URL 重定向",default:"—"},{option:"headers",desc:"自定义响应头",default:"—"},{option:'output: "export"',desc:"纯静态导出",default:"—"},{option:'output: "standalone"',desc:"独立部署包",default:"—"}];return(E,t)=>(s(),l("div",x,[t[6]||(t[6]=e("h3",null,"环境变量与 next.config",-1)),e("div",f,[e("div",y,[t[2]||(t[2]=e("h4",null,"环境变量前缀规则",-1)),(s(),l(a,null,p(i,o=>e("div",{key:o.prefix,class:"env-card",style:d({borderLeftColor:o.color})},[e("code",null,n(o.prefix),1),e("span",{class:"tag",style:d({background:o.color})},n(o.exposed),5),e("p",null,[e("small",null,"范围："+n(o.scope),1)]),e("p",null,[e("small",null,[t[0]||(t[0]=r("示例：",-1)),e("code",null,n(o.example),1)])])],4)),64)),t[3]||(t[3]=e("h4",{style:{"margin-top":"12px"}},"常用配置项",-1)),e("table",null,[t[1]||(t[1]=e("thead",null,[e("tr",null,[e("th",null,"选项"),e("th",null,"说明")])],-1)),e("tbody",null,[(s(),l(a,null,p(c,o=>e("tr",{key:o.option},[e("td",null,[e("code",null,n(o.option),1)]),e("td",null,[e("small",null,n(o.desc),1)])])),64))])])]),e("div",{style:{flex:"1"}},[t[4]||(t[4]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:g}),t[5]||(t[5]=e("div",{class:"detail-box"},[e("p",null,[e("strong",null,"安全："),r("密钥绝不加 NEXT_PUBLIC_ 前缀，否则会打包进前端 bundle。")])],-1))])])]))}}),A=m(v,[["__scopeId","data-v-04a7fefa"]]);export{A as default};
