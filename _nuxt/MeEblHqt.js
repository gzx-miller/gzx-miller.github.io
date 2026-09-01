import{d as u,b as s,e as a,a0 as m,F as i,E as p,v as n,o,f as l,I as y}from"./DutfXOOr.js";const x={class:"demo-card"},g={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},f={style:{flex:"1"}},v=`<span style="color:#8a8a3a">// app/layout.tsx — 并行路由</span>
export default function Layout({
  children,     <span style="color:#7c7c99">// @main 或默认</span>
  sidebar,      <span style="color:#7c7c99">// @sidebar 插槽</span>
  analytics,    <span style="color:#7c7c99">// @analytics 插槽</span>
}: {
  children: React.ReactNode
  sidebar: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    &lt;div className="grid"&gt;
      &lt;main&gt;{children}&lt;/main&gt;
      &lt;aside&gt;{sidebar}&lt;/aside&gt;
      &lt;footer&gt;{analytics}&lt;/footer&gt;
    &lt;/div&gt;
  )
}

<span style="color:#8a8a3a">// 目录结构</span>
app/
├── layout.tsx
├── @main/page.tsx
├── @sidebar/page.tsx
└── @analytics/page.tsx

<span style="color:#8a8a3a">// default.tsx — 插槽未匹配时的默认内容</span>
<span style="color:#7c7c99">// app/@analytics/default.tsx</span>
export default function Default() {
  return &lt;p&gt;暂无数据&lt;/p&gt;
}`,b=u({__name:"X13ParallelRoutes",setup(R){const d=[{name:"@main",content:"主内容区",example:"app/@main/page.tsx"},{name:"@sidebar",content:"侧边栏",example:"app/@sidebar/page.tsx"},{name:"@analytics",content:"统计面板",example:"app/@analytics/page.tsx"}],r=["仪表盘：多个独立数据块并行加载","模态框：配合 Intercepting Routes 实现弹窗","条件渲染：不同子路由展示不同插槽组合","独立加载：每个插槽有自己的 loading 状态"];return(N,t)=>(o(),s("div",x,[t[5]||(t[5]=a("h3",null,"Parallel Routes：并行路由",-1)),a("div",g,[a("div",f,[t[1]||(t[1]=m('<h4 data-v-c03fe18a>插槽 (@) 概念</h4><div class="layout-preview" data-v-c03fe18a><div class="slot main" data-v-c03fe18a>@main</div><div class="slot side" data-v-c03fe18a>@sidebar</div><div class="slot analytics" data-v-c03fe18a>@analytics</div></div><h4 style="margin-top:12px;" data-v-c03fe18a>插槽列表</h4>',3)),a("ul",null,[(o(),s(i,null,p(d,e=>a("li",{key:e.name},[a("code",null,l(e.name),1),n(" — "+l(e.content)+" ",1),t[0]||(t[0]=a("br",null,null,-1)),a("small",null,[a("code",null,l(e.example),1)])])),64))]),t[2]||(t[2]=a("h4",{style:{"margin-top":"12px"}},"适用场景",-1)),a("ul",null,[(o(),s(i,null,p(r,(e,c)=>a("li",{key:c},[a("small",null,l(e),1)])),64))])]),a("div",{style:{flex:"1"}},[t[3]||(t[3]=a("h4",null,"代码示例",-1)),a("pre",{class:"mini-code",innerHTML:v}),t[4]||(t[4]=a("div",{class:"detail-box"},[a("p",null,[a("strong",null,"关键："),n("插槽用 @ 前缀命名，作为 props 传入 layout。")]),a("p",null,[a("strong",null,"default.tsx："),n("当插槽没有匹配的子路由时显示的默认内容。")])],-1))])])]))}}),k=y(b,[["__scopeId","data-v-c03fe18a"]]);export{k as default};
