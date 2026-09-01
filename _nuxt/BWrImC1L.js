import{d as i,b as d,e as t,F as p,E as c,f as s,a0 as u,r as m,o as r,z as f,A as v,v as g,I as y}from"./DutfXOOr.js";const x={class:"demo-card"},b={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},h={style:{flex:"1"}},_=["onClick"],L={key:0,class:"tag"},k={class:"detail-box"},N=`<span style="color:#7c7c99">// app/layout.tsx — 根布局</span>
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="zh"&gt;
      &lt;body&gt;
        &lt;Header /&gt;
        &lt;main&gt;{children}&lt;/main&gt;
        &lt;Footer /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  )
}

<span style="color:#7c7c99">// app/blog/layout.tsx — 嵌套布局</span>
export default function BlogLayout({ children }) {
  return (
    &lt;div className="blog-shell"&gt;
      &lt;aside&gt;分类导航&lt;/aside&gt;
      &lt;article&gt;{children}&lt;/article&gt;
    &lt;/div&gt;
  )
}`,q=i({__name:"X03Layouts",setup(B){const o=[{name:"根布局",file:"app/layout.tsx",scope:"全站",desc:"必需，包含 <html> <body>，所有页面共享",required:!0},{name:"嵌套布局",file:"app/blog/layout.tsx",scope:"子路由",desc:"blog/ 下所有页面共享，套在根布局内",required:!1},{name:"路由组布局",file:"app/(dashboard)/layout.tsx",scope:"路由组",desc:"同一路径下不同布局，不影响 URL",required:!1},{name:"模板",file:"app/template.tsx",scope:"全站",desc:"类似布局但每次导航都重新挂载",required:!1}],l=m(0);return(C,e)=>(r(),d("div",x,[e[3]||(e[3]=t("h3",null,"布局与模板：共享 UI 的层级",-1)),t("div",b,[t("div",h,[e[1]||(e[1]=t("h4",null,"布局类型",-1)),t("ul",null,[(r(),d(p,null,c(o,(a,n)=>t("li",{key:a.name,style:f({cursor:"pointer",fontWeight:l.value===n?"bold":"normal",color:l.value===n?"#e85d04":"inherit",padding:"6px 0"}),onClick:F=>l.value=n},[t("strong",null,s(a.name),1),a.required?(r(),d("span",L,"必需")):v("",!0),e[0]||(e[0]=t("br",null,null,-1)),t("small",null,[t("code",null,s(a.file),1),g(" · "+s(a.scope),1)])],12,_)),64))]),t("div",k,[t("p",null,[t("strong",null,s(o[l.value].name),1)]),t("p",null,s(o[l.value].desc),1)])]),t("div",{style:{flex:"1"}},[e[2]||(e[2]=u('<h4 data-v-795f5272>布局嵌套示意</h4><div class="nest-box" data-v-795f5272><div class="nest-layer root" data-v-795f5272>根布局 layout.tsx<br data-v-795f5272><small data-v-795f5272>Header + Footer</small></div><div class="nest-layer nested" data-v-795f5272>嵌套布局 blog/layout.tsx<br data-v-795f5272><small data-v-795f5272>侧边栏</small></div><div class="nest-layer page" data-v-795f5272>页面 page.tsx<br data-v-795f5272><small data-v-795f5272>具体内容</small></div></div><h4 style="margin-top:12px;" data-v-795f5272>代码示例</h4>',3)),t("pre",{class:"mini-code",innerHTML:N})])]),e[4]||(e[4]=t("small",null,"布局在导航时保持状态不重新挂载；template.tsx 则每次导航重新创建，适合需要重置状态的场景。",-1))]))}}),V=y(q,[["__scopeId","data-v-795f5272"]]);export{V as default};
