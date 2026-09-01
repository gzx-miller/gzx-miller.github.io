import{d as i,r as d,b as p,e as t,f as a,F as c,E as g,v as x,A as m,o as n,z as v,I as h}from"./DutfXOOr.js";const f={class:"demo-card"},y={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},b={style:{flex:"1"}},_=["onClick"],k={class:"tag"},R={key:0,class:"detail-box"},j=`app/
├── layout.tsx        # 根布局（必需）
├── page.tsx          # 首页 → /
├── globals.css       # 全局样式
├── loading.tsx       # 全局加载 UI
├── error.tsx         # 全局错误 UI
├── not-found.tsx     # 404 页面
├── about/
│   └── page.tsx      # → /about
├── blog/
│   ├── layout.tsx    # 博客专属布局
│   ├── page.tsx      # → /blog
│   └── [slug]/
│       └── page.tsx  # → /blog/:slug（动态）
└── api/
    └── route.ts      # → /api（Route Handler）`,A=i({__name:"X01ProjectStructure",setup(N){const r=[{path:"app/",desc:"App Router 根目录，存放路由、布局、页面",tag:"核心"},{path:"app/layout.tsx",desc:"根布局，所有页面共享",tag:"布局"},{path:"app/page.tsx",desc:"首页，对应 / 路由",tag:"页面"},{path:"app/globals.css",desc:"全局样式",tag:"样式"},{path:"public/",desc:"静态资源，直接通过 / 访问",tag:"静态"},{path:"next.config.js",desc:"Next.js 配置文件",tag:"配置"},{path:"middleware.ts",desc:"中间件，放在 src 或项目根",tag:"中间件"},{path:"package.json",desc:"依赖与脚本",tag:"配置"}],o=d("app/layout.tsx"),l=d(r.find(u=>u.path===o.value));return(u,e)=>(n(),p("div",f,[e[4]||(e[4]=t("h3",null,"项目结构：App Router 目录约定",-1)),t("div",y,[t("div",{style:{flex:"1"}},[e[0]||(e[0]=t("h4",null,"App Router 目录树",-1)),t("pre",{class:"mini-code"},a(j))]),t("div",b,[e[3]||(e[3]=t("h4",null,"核心目录说明",-1)),t("ul",null,[(n(),p(c,null,g(r,s=>t("li",{key:s.path,style:v({cursor:"pointer",fontWeight:o.value===s.path?"bold":"normal",color:o.value===s.path?"#e85d04":"inherit"}),onClick:C=>{o.value=s.path,l.value=s}},[t("code",null,a(s.path),1),t("span",k,a(s.tag),1)],12,_)),64))]),l.value?(n(),p("div",R,[t("p",null,[e[1]||(e[1]=t("strong",null,"路径：",-1)),t("code",null,a(l.value.path),1)]),t("p",null,[e[2]||(e[2]=t("strong",null,"作用：",-1)),x(a(l.value.desc),1)])])):m("",!0)])]),e[5]||(e[5]=t("small",null,"Next.js 13+ 使用 App Router（app/ 目录），Pages Router（pages/ 目录）为旧方案仍兼容但推荐迁移。",-1))]))}}),S=h(A,[["__scopeId","data-v-ddc6073c"]]);export{S as default};
