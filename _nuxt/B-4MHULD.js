import{d,b as o,e as s,F as m,E as c,K as g,L as h,f as e,v as r,r as v,g as x,o as u,I as y}from"./DutfXOOr.js";const f={class:"demo-card"},b={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},P={style:{flex:"1"}},k={class:"detail-box"},w=`<span style="color:#7c7c99">// app/users/[id]/page.tsx</span>
export default function Page({
  params,        <span style="color:#8a8a3a">// { id: "42" }</span>
  searchParams,  <span style="color:#8a8a3a">// URL 查询参数</span>
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] }
}) {
  return &lt;h1&gt;用户 ID: {params.id}&lt;/h1&gt;
}

<span style="color:#7c7c99">// app/docs/[...slug]/page.tsx — Catch-all</span>
export default function Page({
  params,  <span style="color:#8a8a3a">// { slug: ["a","b","c"] }</span>
}: {
  params: { slug: string[] }
}) {
  return &lt;h1&gt;文档路径: {params.slug.join('/')}&lt;/h1&gt;
}`,C=d({__name:"X04DynamicRoutes",setup(D){const p=[{pattern:"[id]",match:"/users/42",param:'id = "42"',desc:"单段动态参数"},{pattern:"[slug]",match:"/blog/hello-world",param:'slug = "hello-world"',desc:"单段动态（语义化）"},{pattern:"[...slug]",match:"/docs/a/b/c",param:'slug = ["a","b","c"]',desc:"Catch-all 捕获多段"},{pattern:"[[...slug]]",match:"/shop",param:"slug = []",desc:"可选 Catch-all，空也匹配"}],l=v("/users/42"),i=x(()=>l.value.startsWith("/users/")?`id = "${l.value.slice(7)}"`:l.value.startsWith("/blog/")?`slug = "${l.value.slice(6)}"`:l.value.startsWith("/docs/")?`slug = [${l.value.slice(6).split("/").map(n=>`"${n}"`).join(", ")}]`:"无法匹配");return(n,a)=>(u(),o("div",f,[a[7]||(a[7]=s("h3",null,"动态路由与参数",-1)),s("div",b,[s("div",P,[a[3]||(a[3]=s("h4",null,"参数类型对比",-1)),s("table",null,[a[1]||(a[1]=s("thead",null,[s("tr",null,[s("th",null,"文件模式"),s("th",null,"匹配示例"),s("th",null,"说明")])],-1)),s("tbody",null,[(u(),o(m,null,c(p,t=>s("tr",{key:t.pattern},[s("td",null,[s("code",null,e(t.pattern),1)]),s("td",null,[s("code",null,e(t.match),1)]),s("td",null,e(t.desc),1)])),64))])]),a[4]||(a[4]=s("h4",{style:{"margin-top":"12px"}},"试一试：输入路径",-1)),g(s("input",{"onUpdate:modelValue":a[0]||(a[0]=t=>l.value=t),class:"url-input",placeholder:"/users/42"},null,512),[[h,l.value]]),s("div",k,[s("p",null,[a[2]||(a[2]=s("strong",null,"解析结果：",-1)),s("code",null,e(i.value),1)])])]),s("div",{style:{flex:"1"}},[a[5]||(a[5]=s("h4",null,"params 与 searchParams",-1)),s("pre",{class:"mini-code",innerHTML:w}),a[6]||(a[6]=s("div",{class:"detail-box",style:{"margin-top":"8px"}},[s("p",null,[s("strong",null,"params："),r("来自路径段，Server Component 中可直接 await")]),s("p",null,[s("strong",null,"searchParams："),r("来自 ?key=value 查询串")]),s("p",null,[s("strong",null,"Next.js 15+："),r("params 和 searchParams 为 Promise，需 await")])],-1))])])]))}}),T=y(C,[["__scopeId","data-v-10041e0a"]]);export{T as default};
