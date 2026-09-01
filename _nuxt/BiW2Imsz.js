import{d as p,b as o,e,F as a,E as r,v as i,o as s,f as l,I as d}from"./DutfXOOr.js";const g={class:"demo-card"},m={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},f={style:{flex:"1"}},x={class:"hooks-box"},C=`<span style="color:#8a8a3a">// app/page.tsx — Server Component</span>
import SearchBox from './SearchBox'  <span style="color:#7c7c99">// Client</span>

export default async function Page() {
  const data = await fetch('...').then(r =&gt; r.json())
  return (
    &lt;&gt;
      &lt;h1&gt;{data.title}&lt;/h1&gt;       <span style="color:#7c7c99">{/* Server 渲染 */}</span>
      &lt;SearchBox initial={data.q} /&gt; <span style="color:#7c7c99">{/* Client 交互 */}</span>
    &lt;/&gt;
  )
}

<span style="color:#8a8a3a">// app/SearchBox.tsx — Client Component</span>
<span style="color:#e85d04">'use client'</span>
import { useState } from 'react'

export default function SearchBox({ initial }: { initial: string }) {
  const [q, setQ] = useState(initial)
  return &lt;input value={q} onChange={e =&gt; setQ(e.target.value)} /&gt;
}`,y=p({__name:"X06ClientComponents",setup(S){const u=[{name:"交互组件",trigger:"onClick / onChange 等事件",action:'标记 "use client"'},{name:"状态组件",trigger:"useState / useReducer",action:'标记 "use client"'},{name:"生命周期",trigger:"useEffect / useLayoutEffect",action:'标记 "use client"'},{name:"浏览器 API",trigger:"window / document / localStorage",action:'标记 "use client"'},{name:"数据展示",trigger:"纯渲染 props 数据",action:"保持 Server Component"},{name:"数据获取",trigger:"async 组件 + await",action:"保持 Server Component"}],c=["useState","useReducer","useEffect","useRef","useLayoutEffect","useCallback","useMemo","useContext","useImperativeHandle","useTransition","useDeferredValue","useSyncExternalStore"];return(v,t)=>(s(),o("div",g,[t[5]||(t[5]=e("h3",null,"Client Components：客户端组件",-1)),e("div",m,[e("div",f,[t[1]||(t[1]=e("h4",null,'何时使用 "use client"',-1)),e("table",null,[t[0]||(t[0]=e("thead",null,[e("tr",null,[e("th",null,"场景"),e("th",null,"触发条件"),e("th",null,"处理方式")])],-1)),e("tbody",null,[(s(),o(a,null,r(u,n=>e("tr",{key:n.name},[e("td",null,[e("strong",null,l(n.name),1)]),e("td",null,l(n.trigger),1),e("td",null,[e("code",null,l(n.action),1)])])),64))])]),t[2]||(t[2]=e("h4",{style:{"margin-top":"12px"}},"仅客户端可用的 Hooks",-1)),e("div",x,[(s(),o(a,null,r(c,n=>e("span",{key:n,class:"hook-tag"},l(n),1)),64))])]),e("div",{style:{flex:"1"}},[t[3]||(t[3]=e("h4",null,"Server 与 Client 组合",-1)),e("pre",{class:"mini-code",innerHTML:C}),t[4]||(t[4]=e("div",{class:"detail-box"},[e("p",null,[e("strong",null,"数据流向："),i("Server 获取数据 → 作为 props 传给 Client → Client 接管交互")]),e("p",null,[e("strong",null,"注意："),i('"use client" 标记会向下传递，导入的子组件也变成 Client')])],-1))])])]))}}),k=d(y,[["__scopeId","data-v-5a4c34c4"]]);export{k as default};
