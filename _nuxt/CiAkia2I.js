import{d as p,b as n,e,F as r,E as o,o as l,f as s,A as m,v as u,I as g}from"./DutfXOOr.js";const x={class:"demo-card"},f={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},h={style:{flex:"1"}},y={key:0,class:"tag rec"},_=`<span style="color:#8a8a3a">// 方案一：App Router Dynamic i18n（推荐）</span>
<span style="color:#7c7c99">// app/[lang]/layout.tsx</span>
const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(m => m.default),
  zh: () => import('@/dictionaries/zh.json').then(m => m.default),
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: 'en' | 'zh' }
}) {
  const dict = await dictionaries[params.lang]()
  return (
    &lt;html lang={params.lang}&gt;
      &lt;body&gt;&lt;I18nProvider dict={dict}&gt;{children}&lt;/I18nProvider&gt;&lt;/body&gt;
    &lt;/html&gt;
  )
}

<span style="color:#8a8a3a">// middleware.ts — 自动检测语言</span>
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'zh']

export function middleware(request) {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  const accept = new Negotiator({ headers }).languages()
  const lang = match(accept, locales, 'en')
  if (!request.nextUrl.pathname.startsWith(\`/\${lang}\`)) {
    return NextResponse.redirect(new URL(\`/\${lang}\${request.nextUrl.pathname}\`, request.url))
  }
}

<span style="color:#8a8a3a">// app/[lang]/page.tsx — 使用</span>
export default function Page({ params }) {
  const t = useI18n()  <span style="color:#7c7c99">// 从 Context 读取字典</span>
  return &lt;h1&gt;{t('welcome')}&lt;/h1&gt;
}`,v=p({__name:"X23I18n",setup(I){const c=[{name:"子路径路由",pattern:"/zh/about, /en/about",desc:"URL 带语言前缀，SEO 友好",recommended:!0},{name:"域名策略",pattern:"example.com, example.cn",desc:"不同域名不同语言",recommended:!1},{name:"Cookie/Header",pattern:"根据 Accept-Language",desc:"自动检测，配合 middleware",recommended:!0},{name:"Dynamic i18n",pattern:"App Router 原生方案",desc:"Next.js 14+ 推荐，无插件",recommended:!0}],d=["SEO：每个语言版本用独立 URL，配合 hreflang 标签","字典：按语言拆分 JSON，按需加载避免全量打包","复数/日期：用 Intl API 或 formatjs 处理","next-intl：社区流行的 App Router i18n 方案"];return(N,t)=>(l(),n("div",x,[t[4]||(t[4]=e("h3",null,"国际化 i18n",-1)),e("div",f,[e("div",h,[t[1]||(t[1]=e("h4",null,"路由策略对比",-1)),(l(),n(r,null,o(c,a=>e("div",{key:a.name,class:"strat-card"},[e("strong",null,s(a.name),1),a.recommended?(l(),n("span",y,"推荐")):m("",!0),e("p",null,[e("small",null,[t[0]||(t[0]=u("模式：",-1)),e("code",null,s(a.pattern),1)])]),e("p",null,[e("small",null,s(a.desc),1)])])),64)),t[2]||(t[2]=e("h4",{style:{"margin-top":"12px"}},"实践要点",-1)),e("ul",null,[(l(),n(r,null,o(d,(a,i)=>e("li",{key:i},[e("small",null,s(a),1)])),64))])]),e("div",{style:{flex:"1"}},[t[3]||(t[3]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:_})])])]))}}),b=g(v,[["__scopeId","data-v-bc26d2c9"]]);export{b as default};
