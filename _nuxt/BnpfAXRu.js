import{d as u,b as l,e as t,F as p,E as n,v as c,o,f as s,I as m}from"./DutfXOOr.js";const g={class:"demo-card"},y={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},x={style:{flex:"1"}},f=`<span style="color:#8a8a3a">// 静态 Metadata — app/layout.tsx</span>
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: '小松鼠举栗子',       <span style="color:#7c7c99">// 默认</span>
    template: '%s | 小松鼠'        <span style="color:#7c7c99">// 子页拼接</span>
  },
  description: '前端知识内容库',
}

<span style="color:#8a8a3a">// 动态 Metadata — app/blog/[slug]/page.tsx</span>
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise&lt;Metadata&gt; {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.cover],
    }
  }
}

<span style="color:#8a8a3a">// app/sitemap.ts — 动态站点地图</span>
export default async function sitemap() {
  const posts = await getAllPosts()
  return posts.map(p =&gt; ({
    url: \`https://example.com/blog/\${p.slug}\`,
    lastModified: p.updatedAt,
  }))
}

<span style="color:#8a8a3a">// app/robots.ts — 爬虫规则</span>
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: 'https://example.com/sitemap.xml',
  }
}`,M=u({__name:"X20Metadata",setup(b){const r=[{type:"静态 Metadata",desc:"layout/page 导出 metadata 对象",scope:"固定值"},{type:"动态 Metadata",desc:"导出 generateMetadata 函数",scope:"按参数生成"},{type:"文件约定",desc:"favicon.ico / icon.png / apple-icon.png",scope:"图标"},{type:"OG 图片",desc:"opengraph-image.tsx 动态生成",scope:"社交分享"},{type:"sitemap",desc:"app/sitemap.ts",scope:"SEO 索引"},{type:"robots",desc:"app/robots.ts",scope:"爬虫规则"}],d=["opengraph-image.tsx 用 ImageResponse 动态生成 OG 图","twitter-image.tsx 同理生成 Twitter 卡片","icon.tsx 可用代码动态生成 favicon","metadata 自动去重，子页面覆盖父级"];return(v,a)=>(o(),l("div",g,[a[5]||(a[5]=t("h3",null,"Metadata 与 SEO",-1)),t("div",y,[t("div",x,[a[1]||(a[1]=t("h4",null,"Metadata 类型",-1)),t("table",null,[a[0]||(a[0]=t("thead",null,[t("tr",null,[t("th",null,"类型"),t("th",null,"说明"),t("th",null,"范围")])],-1)),t("tbody",null,[(o(),l(p,null,n(r,e=>t("tr",{key:e.type},[t("td",null,[t("strong",null,s(e.type),1)]),t("td",null,[t("small",null,s(e.desc),1)]),t("td",null,[t("small",null,s(e.scope),1)])])),64))])]),a[2]||(a[2]=t("h4",{style:{"margin-top":"12px"}},"进阶技巧",-1)),t("ul",null,[(o(),l(p,null,n(d,(e,i)=>t("li",{key:i},[t("small",null,s(e),1)])),64))])]),t("div",{style:{flex:"1"}},[a[3]||(a[3]=t("h4",null,"代码示例",-1)),t("pre",{class:"mini-code",innerHTML:f}),a[4]||(a[4]=t("div",{class:"detail-box"},[t("p",null,[t("strong",null,"替代方案："),c("App Router 用 Metadata API 取代了 Pages Router 的 next/head。")])],-1))])])]))}}),w=m(M,[["__scopeId","data-v-3e12044e"]]);export{w as default};
