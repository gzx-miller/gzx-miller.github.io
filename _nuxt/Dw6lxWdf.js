import{s as c}from"./CLeGk598.js";import{d as m,b as a,e,F as f,E as g,v as n,r as u,o,z as S,f as v,A as x,I as y}from"./DutfXOOr.js";const b={class:"demo-card"},w={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},_={style:{flex:"1"}},k={style:{"margin-top":"8px"}},L={key:0,class:"tag slow"},h={key:1,class:"tag ok"},F=`<span style="color:#8a8a3a">// app/page.tsx — 流式渲染</span>
import { Suspense } from 'react'
import SlowList from './SlowList'
import FastHeader from './FastHeader'

export default function Page() {
  return (
    &lt;&gt;
      &lt;FastHeader /&gt;  <span style="color:#7c7c99">{/* 立即返回 */}</span>
      &lt;Suspense fallback={&lt;p&gt;加载列表中...&lt;/p&gt;}&gt;
        &lt;SlowList /&gt;  <span style="color:#7c7c99">{/* 流式替换 */}</span>
      &lt;/Suspense&gt;
    &lt;/&gt;
  )
}

<span style="color:#8a8a3a">// SlowList.tsx — 慢组件（async Server Component）</span>
export default async function SlowList() {
  const data = await fetch('https://api.example.com/slow')
  const items = await data.json()
  return &lt;ul&gt;{items.map(i =&gt; &lt;li key={i.id}&gt;{i.name}&lt;/li&gt;)}&lt;/ul&gt;
}`,H=m({__name:"X08StreamingSuspense",setup(I){const r=u([{label:"服务端开始渲染",done:!1,slow:!1},{label:"遇到 <Suspense> 包裹的慢组件",done:!1,slow:!1},{label:"立即返回 fallback UI + 已完成部分",done:!1,slow:!0},{label:"慢组件 resolve 后流式替换",done:!1,slow:!1}]),i=u(-1);function d(){i.value=-1,r.value.forEach(l=>l.done=!1);let s=0;const t=c(()=>{s<r.value.length?(r.value[s].done=!0,i.value=s,s++):clearInterval(t)},700)}return(s,t)=>(o(),a("div",b,[t[4]||(t[4]=e("h3",null,"Streaming 与 Suspense 流式渲染",-1)),e("div",w,[e("div",_,[t[0]||(t[0]=e("h4",null,"流式渲染流程",-1)),e("button",{class:"btn",onClick:d},"▶ 模拟流式渲染"),e("ol",k,[(o(!0),a(f,null,g(r.value,(l,p)=>(o(),a("li",{key:p,style:S({opacity:l.done?1:.4,color:i.value===p?"#e85d04":"inherit",fontWeight:i.value===p?"bold":"normal",transition:"all 0.3s"})},[n(v(l.label)+" ",1),l.slow&&l.done?(o(),a("span",L,"慢")):l.done?(o(),a("span",h,"✓")):x("",!0)],4))),128))]),t[1]||(t[1]=e("div",{class:"detail-box"},[e("p",null,[e("strong",null,"优势："),n("用户无需等待最慢的组件，先看到页面骨架。")]),e("p",null,[e("strong",null,"原理："),n("服务端把 HTML 分块发送，Suspense 边界处插入 fallback，数据就绪后流式替换。")])],-1))]),e("div",{style:{flex:"1"}},[t[2]||(t[2]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:F}),t[3]||(t[3]=e("div",{class:"detail-box",style:{"margin-top":"8px"}},[e("p",null,[e("strong",null,"loading.tsx："),n("等价于路由级 Suspense，自动包裹页面。")]),e("p",null,[e("strong",null,"组合："),n("多个 Suspense 可并行流式，互不阻塞。")])],-1))])])]))}}),B=y(H,[["__scopeId","data-v-3d923473"]]);export{B as default};
