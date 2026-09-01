import{d as m,b as s,e as o,F as a,E as p,v as d,o as n,f as l,I as c}from"./DutfXOOr.js";const x={class:"demo-card"},y={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},f={style:{flex:"1"}},h=`<span style="color:#8a8a3a">// 场景：点击图片在当前页弹窗显示，直接访问则全屏页</span>

<span style="color:#7c7c99">// 目录结构</span>
app/
├── feed/
│   ├── page.tsx           <span style="color:#7c7c99">// /feed 列表页</span>
│   └── (..)photo/[id]/
│       └── page.tsx       <span style="color:#7c7c99">// 拦截 /photo/:id → 弹窗</span>
├── photo/[id]/
│   └── page.tsx           <span style="color:#7c7c99">// 真实 /photo/:id → 全屏</span>
└── layout.tsx

<span style="color:#8a8a3a">// app/feed/(..)photo/[id]/page.tsx — 拦截版</span>
import { Modal } from '@/components/Modal'

export default function InterceptedPhoto({ params }) {
  return (
    &lt;Modal&gt;
      &lt;Photo id={params.id} /&gt;
    &lt;/Modal&gt;
  )
}

<span style="color:#8a8a3a">// app/photo/[id]/page.tsx — 直接访问版</span>
export default function PhotoPage({ params }) {
  return &lt;Photo id={params.id} fullscreen /&gt;
}`,g=m({__name:"X14InterceptingRoutes",setup(b){const r=[{symbol:".",name:"当前层级",example:"(.)photo",desc:"拦截同级 /photo"},{symbol:"..",name:"上一层级",example:"(..)photo",desc:"拦截父级 /photo"},{symbol:"(..)(..)",name:"上两层",example:"(..)(..)photo",desc:"拦截祖父级 /photo"},{symbol:"(...)",name:"根层级",example:"(...)photo",desc:"拦截根 /photo"}],i=["用户在 /feed 点击图片链接","路由被 (..)photo/[id] 拦截 → 弹窗展示","URL 变为 /photo/123（可分享、可刷新）","刷新页面 → 命中真实 photo/[id] → 全屏页","浏览器后退 → 回到 /feed（弹窗关闭）"];return(v,t)=>(n(),s("div",x,[t[5]||(t[5]=o("h3",null,"Intercepting Routes：拦截路由",-1)),o("div",y,[o("div",f,[t[1]||(t[1]=o("h4",null,"拦截符号",-1)),o("table",null,[t[0]||(t[0]=o("thead",null,[o("tr",null,[o("th",null,"符号"),o("th",null,"层级"),o("th",null,"示例")])],-1)),o("tbody",null,[(n(),s(a,null,p(r,e=>o("tr",{key:e.symbol},[o("td",null,[o("code",null,l(e.symbol),1)]),o("td",null,l(e.name),1),o("td",null,[o("code",null,l(e.example),1)])])),64))])]),t[2]||(t[2]=o("h4",{style:{"margin-top":"12px"}},"典型流程（图片弹窗）",-1)),o("ol",null,[(n(),s(a,null,p(i,(e,u)=>o("li",{key:u},[o("small",null,l(e),1)])),64))])]),o("div",{style:{flex:"1"}},[t[3]||(t[3]=o("h4",null,"代码示例",-1)),o("pre",{class:"mini-code",innerHTML:h}),t[4]||(t[4]=o("div",{class:"detail-box"},[o("p",null,[o("strong",null,"核心价值："),d("同一 URL，客户端导航时弹窗、直接访问时全屏，体验与可分享性兼得。")]),o("p",null,[o("strong",null,"配合："),d("通常和 Parallel Routes 的 Modal 插槽一起用。")])],-1))])])]))}}),M=c(g,[["__scopeId","data-v-c0338ee1"]]);export{M as default};
