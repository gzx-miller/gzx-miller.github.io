import{d as c,b as s,e,F as r,E as o,v as d,o as a,f as l,M as m,I as f}from"./DutfXOOr.js";const x={class:"demo-card"},g={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},h={style:{flex:"1"}},y=`<span style="color:#8a8a3a">// next/link — 客户端导航</span>
import Link from 'next/link'

&lt;Link href="/about" prefetch&gt;关于&lt;/Link&gt;
&lt;Link href="/blog/1" prefetch={false}&gt;条件预取&lt;/Link&gt;

<span style="color:#8a8a3a">// useRouter — 编程式导航（Client Component）</span>
<span style="color:#e85d04">'use client'</span>
import { useRouter } from 'next/navigation'

export default function Nav() {
  const router = useRouter()
  return &lt;button onClick={() =&gt; router.push('/dashboard')}&gt;
    进入后台
  &lt;/button&gt;
}

<span style="color:#8a8a3a">// redirect — 服务端重定向</span>
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await getUser()
  if (!user) redirect('/login')  <span style="color:#7c7c99">// 服务端 307</span>
  return &lt;Dashboard /&gt;
}

<span style="color:#8a8a3a">// 获取路由信息</span>
import { usePathname, useSearchParams } from 'next/navigation'
const pathname = usePathname()      <span style="color:#7c7c99">// "/about"</span>
const search = useSearchParams()    <span style="color:#7c7c99">// URLSearchParams</span>`,k=c({__name:"X19NextLink",setup(v){const i=[{api:'<Link href="/about">',desc:"客户端导航，预取目标路由",client:!0},{api:"useRouter().push('/x')",desc:"编程式跳转",client:!0},{api:"useRouter().replace('/x')",desc:"替换当前历史",client:!0},{api:"useRouter().back()",desc:"后退",client:!0},{api:"useRouter().refresh()",desc:"刷新当前路由数据",client:!0},{api:"useRouter().prefetch('/x')",desc:"手动预取",client:!0},{api:'redirect("/x")',desc:"服务端重定向",client:!1},{api:"usePathname()",desc:"获取当前路径",client:!0},{api:"useSearchParams()",desc:"获取查询参数",client:!0}],u=["Link 默认 prefetch：预取 RSC payload","静态路由：链接进入视口即预取","动态路由：仅在点击时预取","prefetch={false}：禁用自动预取"];return(b,t)=>(a(),s("div",x,[t[5]||(t[5]=e("h3",null,"next/link 与导航",-1)),e("div",g,[e("div",h,[t[1]||(t[1]=e("h4",null,"导航 API 一览",-1)),e("table",null,[t[0]||(t[0]=e("thead",null,[e("tr",null,[e("th",null,"API"),e("th",null,"说明"),e("th",null,"端")])],-1)),e("tbody",null,[(a(),s(r,null,o(i,n=>e("tr",{key:n.api},[e("td",null,[e("code",null,l(n.api),1)]),e("td",null,[e("small",null,l(n.desc),1)]),e("td",null,[e("span",{class:m(n.client?"tag client":"tag server")},l(n.client?"Client":"Server"),3)])])),64))])]),t[2]||(t[2]=e("h4",{style:{"margin-top":"12px"}},"预取行为",-1)),e("ul",null,[(a(),s(r,null,o(u,(n,p)=>e("li",{key:p},[e("small",null,l(n),1)])),64))])]),e("div",{style:{flex:"1"}},[t[3]||(t[3]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:y}),t[4]||(t[4]=e("div",{class:"detail-box"},[e("p",null,[e("strong",null,"关键："),d("App Router 的导航 API 从 next/navigation 导入（非 next/router）。")])],-1))])])]))}}),P=f(k,[["__scopeId","data-v-d81db6e2"]]);export{P as default};
