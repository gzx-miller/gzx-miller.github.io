import{d as u,b as s,e as l,F as n,E as a,v as c,o as r,z as g,f as o,I as x}from"./DutfXOOr.js";const m={class:"demo-card"},f={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},y={style:{flex:"1"}},v=`<span style="color:#8a8a3a">// app/dashboard/loading.tsx</span>
export default function Loading() {
  return (
    &lt;div className="skeleton"&gt;
      &lt;div className="pulse" /&gt;
      &lt;div className="pulse" /&gt;
    &lt;/div&gt;
  )
}

<span style="color:#8a8a3a">// app/dashboard/error.tsx — 必须是 Client Component</span>
<span style="color:#e85d04">'use client'</span>

export default function Error({
  error,    <span style="color:#7c7c99">// Error 实例</span>
  reset,    <span style="color:#7c7c99">// 重置函数，重试渲染</span>
}: {
  error: Error & { digest?: string }
  reset: () =&gt; void
}) {
  return (
    &lt;div&gt;
      &lt;h2&gt;出错了：{error.message}&lt;/h2&gt;
      &lt;button onClick={reset}&gt;重试&lt;/button&gt;
    &lt;/div&gt;
  )
}

<span style="color:#8a8a3a">// app/not-found.tsx</span>
export default function NotFound() {
  return &lt;h1&gt;404 - 页面不存在&lt;/h1&gt;
}`,b=u({__name:"X16LoadingError",setup(E){const d=[{file:"loading.tsx",scope:"路由级",desc:"加载 UI，自动包裹 Suspense",color:"#d97706"},{file:"error.tsx",scope:"路由级",desc:"错误 UI，必须 Client Component",color:"#e85d04"},{file:"not-found.tsx",scope:"路由级",desc:"404 UI，匹配不到时显示",color:"#ca8a04"},{file:"global-error.tsx",scope:"全局",desc:"根 layout 出错时的兜底",color:"#dc2626"},{file:"default.tsx",scope:"插槽",desc:"Parallel Route 未匹配的默认",color:"#0891b2"},{file:"template.tsx",scope:"路由级",desc:"类似 layout 但每次重新挂载",color:"#65a30d"}],i=["loading.tsx 自动创建 Suspense 边界，包裹同目录 page","error.tsx 必须是 Client Component（需要 reset 交互）","error.tsx 只捕获子组件错误，不捕获 layout 错误","global-error.tsx 替换整个根 layout，需自带 html/body","error 层级向上冒泡，最近的 error.tsx 捕获"];return(C,t)=>(r(),s("div",m,[t[5]||(t[5]=l("h3",null,"Loading 与 Error UI",-1)),l("div",f,[l("div",y,[t[1]||(t[1]=l("h4",null,"特殊文件约定",-1)),l("table",null,[t[0]||(t[0]=l("thead",null,[l("tr",null,[l("th",null,"文件"),l("th",null,"范围"),l("th",null,"作用")])],-1)),l("tbody",null,[(r(),s(n,null,a(d,e=>l("tr",{key:e.file},[l("td",null,[l("code",{style:g({color:e.color})},o(e.file),5)]),l("td",null,o(e.scope),1),l("td",null,[l("small",null,o(e.desc),1)])])),64))])]),t[2]||(t[2]=l("h4",{style:{"margin-top":"12px"}},"规则要点",-1)),l("ul",null,[(r(),s(n,null,a(i,(e,p)=>l("li",{key:p},[l("small",null,o(e),1)])),64))])]),l("div",{style:{flex:"1"}},[t[3]||(t[3]=l("h4",null,"代码示例",-1)),l("pre",{class:"mini-code",innerHTML:v}),t[4]||(t[4]=l("div",{class:"detail-box"},[l("p",null,[l("strong",null,"层级关系："),c("loading → error → not-found，就近匹配，向上冒泡。")])],-1))])])]))}}),k=x(b,[["__scopeId","data-v-c32ef884"]]);export{k as default};
