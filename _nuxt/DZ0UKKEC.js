import{d as i,b as l,e,F as n,E as p,o as a,z as c,f as o,I as m}from"./DutfXOOr.js";const g={class:"demo-card"},f={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},x={style:{flex:"1"}},y={style:{flex:"1"}},_=`<span style="color:#8a8a3a">// 路由组：同一 URL 不同布局</span>
app/
├── (marketing)/
│   ├── layout.tsx     <span style="color:#7c7c99">// 营销页布局</span>
│   ├── page.tsx       → /
│   └── about/
│       └── page.tsx   → /about
├── (dashboard)/
│   ├── layout.tsx     <span style="color:#7c7c99">// 后台布局</span>
│   └── settings/
│       └── page.tsx   → /settings

<span style="color:#8a8a3a">// 私有文件夹：不参与路由</span>
app/
├── _components/        <span style="color:#7c7c99">// 工具组件</span>
│   └── Button.tsx
├── _lib/               <span style="color:#7c7c99">// 工具函数</span>
│   └── utils.ts
└── page.tsx            <span style="color:#7c7c99">// 只导出 page.tsx 参与路由</span>`,b=i({__name:"X15RouteGroups",setup(v){const u=[{pattern:"(folder)",name:"路由组",effect:"不影响 URL，用于组织代码 / 切换布局",example:"app/(marketing)/about → /about",color:"#0891b2"},{pattern:"_folder",name:"私有文件夹",effect:"不参与路由，可放工具函数 / 组件",example:"app/_components/Button",color:"#6b7280"},{pattern:"@folder",name:"并行路由插槽",effect:"布局插槽，不影响 URL",example:"app/@sidebar/page",color:"#7c3aed"},{pattern:"[folder]",name:"动态路由",effect:"生成 URL 参数",example:"app/blog/[slug] → /blog/:slug",color:"#e85d04"}],d=[{group:"路由组",cases:["同一 URL 不同布局","组织代码不影响路径","多套主题切换"]},{group:"私有文件夹",cases:["存放内部组件库","工具函数 / 常量","避免误生成路由"]}];return(L,t)=>(a(),l("div",g,[t[3]||(t[3]=e("h3",null,"Route Groups 与私有文件夹",-1)),e("div",f,[e("div",x,[t[0]||(t[0]=e("h4",null,"目录约定对比",-1)),(a(),l(n,null,p(u,s=>e("div",{key:s.pattern,class:"conv-card",style:c({borderLeftColor:s.color})},[e("code",{style:c({color:s.color})},o(s.pattern),5),e("strong",null,o(s.name),1),e("p",null,[e("small",null,o(s.effect),1)]),e("p",null,[e("small",null,[e("code",null,o(s.example),1)])])],4)),64))]),e("div",y,[t[1]||(t[1]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:_}),t[2]||(t[2]=e("h4",{style:{"margin-top":"12px"}},"使用场景",-1)),(a(),l(n,null,p(d,s=>e("div",{key:s.group,class:"detail-box"},[e("strong",null,o(s.group)+"：",1),e("ul",null,[(a(!0),l(n,null,p(s.cases,r=>(a(),l("li",{key:r},[e("small",null,o(r),1)]))),128))])])),64))])])]))}}),k=m(b,[["__scopeId","data-v-4671c50a"]]);export{k as default};
