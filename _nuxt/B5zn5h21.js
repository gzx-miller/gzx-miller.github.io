import{d as l,b as r,e,v as o,F as d,E as _,f as c,r as v,o as i,M as p,I as m}from"./DutfXOOr.js";const f={class:"v05"},u={class:"tabs"},E=["onClick"],I={class:"code-block"},V=l({__name:"V05Env",setup(T){const n=v("files"),s={files:`# 环境变量文件（按优先级从低到高）
.env                # 所有环境加载
.env.development    # npm run dev 时加载
.env.production     # npm run build 时加载
.env.local          # 本地覆盖，git 忽略`,usage:`// 在 vite.config.ts 中读取
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    define: {
      __API__: JSON.stringify(env.VITE_API_URL),
    },
  }
})

// 在代码中读取（仅 VITE_ 前缀暴露到客户端）
const apiUrl = import.meta.env.VITE_API_URL
const mode = import.meta.env.MODE`,prefix:`// .env
VITE_API_URL=https://api.example.com   ✅ 暴露到客户端
DB_PASSWORD=secret                      ❌ 不暴露（服务端专用）

// 服务端代码中可读取所有变量
// 客户端代码中只能读取 VITE_ 前缀的变量

// TypeScript 类型提示（vite-env.d.ts）
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // 更多环境变量...
}`};return(g,a)=>(i(),r("div",f,[a[0]||(a[0]=e("p",{class:"intro"},[o("Vite 使用 "),e("code",null,"dotenv"),o(" 加载环境变量，"),e("code",null,"VITE_"),o(" 前缀的变量会暴露到客户端。")],-1)),e("div",u,[(i(),r(d,null,_(s,(x,t)=>e("button",{key:t,class:p({active:n.value===t}),onClick:b=>n.value=t},c(t),11,E)),64))]),e("pre",I,[e("code",null,c(s[n.value]),1)])]))}}),A=m(V,[["__scopeId","data-v-6df32c65"]]);export{A as default};
