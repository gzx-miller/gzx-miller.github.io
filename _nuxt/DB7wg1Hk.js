import{d as c,b as o,e as t,F as p,E as u,v as l,o as r,f as s,I as i}from"./DutfXOOr.js";const d={class:"demo-card"},f={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},m={style:{flex:"1"}},C=`<span style="color:#8a8a3a">// app/products/page.tsx — Server Component（默认）</span>
import { db } from '@/lib/db'

<span style="color:#7c7c99">// 直接 await 数据库查询，不会进入前端 bundle</span>
export default async function ProductsPage() {
  const products = await db.product.findMany()
  return (
    &lt;ul&gt;
      {products.map(p =&gt; (
        &lt;li key={p.id}&gt;{p.name} - ¥{p.price}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  )
}`,g=`<span style="color:#8a8a3a">// app/components/Counter.tsx — Client Component</span>
<span style="color:#e85d04">'use client'</span>

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    &lt;button onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;
      点击 {count} 次
    &lt;/button&gt;
  )
}`,v=c({__name:"X05ServerComponents",setup(y){const a=[{feat:"运行环境",sc:"服务端",cc:"客户端"},{feat:"JS Bundle",sc:"不打包进前端",cc:"打包进前端"},{feat:"可用 API",sc:"fs、数据库、密钥",cc:"useState、DOM、事件"},{feat:"交互事件",sc:"❌ 不可用",cc:"✅ onClick 等"},{feat:"Hooks",sc:"❌ useState/useEffect",cc:"✅ 全部可用"},{feat:"数据获取",sc:"直接 async/await",cc:"需 useEffect 或 SWR"},{feat:"默认类型",sc:"✅ 默认就是",cc:'需 "use client" 声明'}];return(S,e)=>(r(),o("div",d,[e[4]||(e[4]=t("h3",null,"Server Components：服务端组件",-1)),t("div",f,[t("div",m,[e[1]||(e[1]=t("h4",null,"Server vs Client 对比",-1)),t("table",null,[e[0]||(e[0]=t("thead",null,[t("tr",null,[t("th",null,"特性"),t("th",null,"Server Component"),t("th",null,"Client Component")])],-1)),t("tbody",null,[(r(),o(p,null,u(a,n=>t("tr",{key:n.feat},[t("td",null,[t("strong",null,s(n.feat),1)]),t("td",null,s(n.sc),1),t("td",null,s(n.cc),1)])),64))])])]),t("div",{style:{flex:"1"}},[e[2]||(e[2]=t("h4",null,"Server Component 示例",-1)),t("pre",{class:"mini-code",innerHTML:C}),e[3]||(e[3]=t("h4",{style:{"margin-top":"8px"}},"Client Component 示例",-1)),t("pre",{class:"mini-code",innerHTML:g})])]),e[5]||(e[5]=t("div",{class:"detail-box"},[t("p",null,[t("strong",null,"组合规则："),l("Server 可导入 Client，但 Client 不能导入 Server（只能作为 children 传入）。")]),t("p",null,[t("strong",null,"边界："),l('把 "use client" 放在组件树尽量靠下的位置，让更多组件留在服务端。')])],-1))]))}}),b=i(v,[["__scopeId","data-v-7977fde2"]]);export{b as default};
