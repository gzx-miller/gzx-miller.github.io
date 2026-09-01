import{d as g,b as n,e,F as r,E as i,v as o,o as a,z as c,f as l,I as f}from"./DutfXOOr.js";const m={class:"demo-card"},y={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},x={style:{flex:"1"}},h=`<span style="color:#8a8a3a">// 静态渲染（默认）— 构建时生成 HTML</span>
export default async function Page() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  return &lt;PostList posts={posts} /&gt;
}

<span style="color:#8a8a3a">// 动态渲染 — 每次请求重新执行</span>
import { cookies } from 'next/headers'

export default async function Dashboard() {
  const token = cookies().get('token')?.value  <span style="color:#7c7c99">// 触发动态</span>
  const user = await getUser(token)
  return &lt;Profile user={user} /&gt;
}`,k=g({__name:"X07StaticDynamic",setup(v){const d=[{type:"静态渲染",timing:"构建时",when:"默认行为",example:"博客文章、产品页",color:"#65a30d"},{type:"动态渲染",timing:"请求时",when:"使用了动态函数",example:"用户 dashboard、搜索",color:"#e85d04"}],p=[{signal:"cookies()",desc:"读取 Cookie",force:"动态"},{signal:"headers()",desc:"读取请求头",force:"动态"},{signal:"searchParams",desc:"URL 查询参数",force:"动态"},{signal:"fetch(..., { cache: 'no-store' })",desc:"禁用缓存",force:"动态"},{signal:"fetch(..., { next: { revalidate: 0 } })",desc:"零秒重新验证",force:"动态"},{signal:"noStore()",desc:"明确 opt-out 缓存",force:"动态"}],u=[{signal:"fetch() 默认",desc:"force-cache（构建时缓存）",force:"静态"},{signal:"fetch(..., { next: { revalidate: 60 } })",desc:"ISR，60 秒重新验证",force:"静态"},{signal:"generateStaticParams()",desc:"预生成动态路由",force:"静态"}];return(S,t)=>(a(),n("div",m,[t[5]||(t[5]=e("h3",null,"静态与动态渲染",-1)),e("div",y,[e("div",x,[t[0]||(t[0]=e("h4",null,"两种渲染模式",-1)),(a(),n(r,null,i(d,s=>e("div",{key:s.type,class:"render-card",style:c({borderLeftColor:s.color})},[e("strong",null,l(s.type),1),e("span",{class:"tag",style:c({background:s.color})},l(s.timing),5),e("p",null,[e("small",null,"触发："+l(s.when),1)]),e("p",null,[e("small",null,"示例："+l(s.example),1)])],4)),64)),t[1]||(t[1]=e("h4",{style:{"margin-top":"12px"}},"强制动态的信号",-1)),e("ul",null,[(a(),n(r,null,i(p,s=>e("li",{key:s.signal},[e("code",null,l(s.signal),1),o(" — "+l(s.desc),1)])),64))]),t[2]||(t[2]=e("h4",null,"保持静态的信号",-1)),e("ul",null,[(a(),n(r,null,i(u,s=>e("li",{key:s.signal},[e("code",null,l(s.signal),1),o(" — "+l(s.desc),1)])),64))])]),e("div",{style:{flex:"1"}},[t[3]||(t[3]=e("h4",null,"代码对比",-1)),e("pre",{class:"mini-code",innerHTML:h}),t[4]||(t[4]=e("div",{class:"detail-box"},[e("p",null,[e("strong",null,"判断规则："),o("只要组件树中使用了任何动态函数，整个路由就变成动态渲染。")]),e("p",null,[e("strong",null,"Next.js 14+："),o("默认尽量静态，按需动态（Partial Prerendering 实验中）。")])],-1))])])]))}}),P=f(k,[["__scopeId","data-v-8a8a6e5f"]]);export{P as default};
