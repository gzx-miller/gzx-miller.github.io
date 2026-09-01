import{d as r,b as s,e,M as c,f as a,a0 as d,A as l,F as u,E as f,r as v,o as i,I as g}from"./DutfXOOr.js";const C={class:"demo-card"},y={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},m={key:0},_={key:1},x={key:2},b={style:{width:"100%"}},k=`// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 私有配置（仅服务端）
    secretKey: process.env.SECRET_KEY || 'dev-secret',
    dbUrl: process.env.DATABASE_URL,
    
    // 公有配置（客户端 + 服务端）
    public: {
      apiKey: process.env.PUBLIC_API_KEY || '',
      appVersion: '1.0.0',
      baseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  },
})`,E=`# .env 文件
SECRET_KEY=my-super-secret-key
DATABASE_URL=postgresql://localhost:5432/mydb
PUBLIC_API_KEY=pk_live_abc123
PUBLIC_BASE_URL=https://example.com

# .env.production
SECRET_KEY=prod-secret-key
PUBLIC_API_KEY=pk_live_prod`,K=`// 服务端 API 中使用
// server/api/data.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  // 可以访问所有配置
  const secret = config.secretKey
  const dbUrl = config.dbUrl
  const apiKey = config.public.apiKey
})

// 客户端组件中使用
const config = useRuntimeConfig()
// 只能访问 public 下的配置
console.log(config.public.apiKey)  // ✅
console.log(config.public.appVersion)  // ✅
// console.log(config.secretKey)  // ❌ undefined

// 使用 useAppConfig（编译时配置）
const appConfig = useAppConfig()
console.log(appConfig.theme)  // 不可在运行时修改`,A=`// app.config.ts（编译时配置）
export default defineAppConfig({
  theme: {
    primaryColor: '#e85d04',
    borderRadius: '8px',
  },
  features: {
    darkMode: true,
    analytics: false,
  },
})

// 与 runtimeConfig 区别：
// app.config.ts → 构建时确定，不可用环境变量
// runtimeConfig → 运行时确定，可用环境变量`,U=r({__name:"N18RuntimeConfig",setup(R){const t=v("config"),p=[{feature:"定义位置",runtimeConfig:"nuxt.config.ts",appConfig:"app.config.ts"},{feature:"环境变量",runtimeConfig:"✅ 支持",appConfig:"❌ 不支持"},{feature:"运行时修改",runtimeConfig:"❌ 不可",appConfig:"❌ 不可"},{feature:"服务端私有值",runtimeConfig:"✅ 支持",appConfig:"❌ 全部暴露"},{feature:"使用方式",runtimeConfig:"useRuntimeConfig()",appConfig:"useAppConfig()"}];return(B,o)=>(i(),s("div",C,[o[7]||(o[7]=e("h3",null,"运行时配置",-1)),e("div",y,[e("button",{class:c({active:t.value==="config"}),onClick:o[0]||(o[0]=n=>t.value="config")},"配置定义",2),e("button",{class:c({active:t.value==="env"}),onClick:o[1]||(o[1]=n=>t.value="env")},"环境变量",2),e("button",{class:c({active:t.value==="usage"}),onClick:o[2]||(o[2]=n=>t.value="usage")},"使用方式",2)]),t.value==="config"?(i(),s("div",m,[e("div",{style:{display:"flex",gap:"16px"}},[e("div",{style:{flex:"1"}},[e("pre",{class:"code-block"},a(k))]),e("div",{style:{flex:"1"}},[o[3]||(o[3]=d('<div class="security-note" data-v-179662c8><h4 data-v-179662c8>安全模型</h4><div class="lock-demo" data-v-179662c8><div class="lock-row" data-v-179662c8><span class="lock-icon" data-v-179662c8>🔒</span><span data-v-179662c8><strong data-v-179662c8>secretKey</strong> → 仅服务端可访问</span></div><div class="lock-row" data-v-179662c8><span class="lock-icon" data-v-179662c8>🔓</span><span data-v-179662c8><strong data-v-179662c8>public.apiKey</strong> → 客户端可访问</span></div></div></div><h4 style="margin-top:8px;" data-v-179662c8>对比 app.config.ts</h4>',2)),e("pre",{class:"code-block",style:{"font-size":"11px"}},a(A))])])])):l("",!0),t.value==="env"?(i(),s("div",_,[e("div",{style:{display:"flex",gap:"16px"}},[e("div",{style:{flex:"1"}},[e("pre",{class:"code-block"},a(E))]),o[4]||(o[4]=d('<div style="flex:1;" data-v-179662c8><div class="desc-box" data-v-179662c8><p data-v-179662c8><strong data-v-179662c8>环境变量命名规则：</strong></p><ul style="font-size:13px;" data-v-179662c8><li data-v-179662c8>私有配置：<code data-v-179662c8>NUXT_SECRET_KEY</code> → <code data-v-179662c8>config.secretKey</code></li><li data-v-179662c8>公有配置：<code data-v-179662c8>NUXT_PUBLIC_API_KEY</code> → <code data-v-179662c8>config.public.apiKey</code></li><li data-v-179662c8>也可直接在 <code data-v-179662c8>.env</code> 中用 <code data-v-179662c8>process.env</code> 引用</li></ul></div></div>',1))])])):l("",!0),t.value==="usage"?(i(),s("div",x,[e("pre",{class:"code-block"},a(K)),o[6]||(o[6]=e("h4",{style:{"margin-top":"8px"}},"runtimeConfig vs appConfig",-1)),e("table",b,[o[5]||(o[5]=e("thead",null,[e("tr",null,[e("th",null,"特性"),e("th",null,"runtimeConfig"),e("th",null,"appConfig")])],-1)),e("tbody",null,[(i(),s(u,null,f(p,n=>e("tr",{key:n.feature},[e("td",null,a(n.feature),1),e("td",null,a(n.runtimeConfig),1),e("td",null,a(n.appConfig),1)])),64))])])])):l("",!0)]))}}),L=g(U,[["__scopeId","data-v-179662c8"]]);export{L as default};
