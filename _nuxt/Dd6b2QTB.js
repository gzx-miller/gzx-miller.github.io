import{d as u,b as l,e,F as o,E as r,v as d,o as a,f as n,I as c}from"./DutfXOOr.js";const m={class:"demo-card"},x={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},f={style:{flex:"1"}},g=`<span style="color:#8a8a3a">// middleware.ts — 项目根或 src/ 下</span>
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  <span style="color:#7c7c99">// 未登录 → 重定向到登录页</span>
  if (!token &amp;&amp; request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  <span style="color:#7c7c99">// 注入请求头，供下游读取</span>
  const response = NextResponse.next()
  response.headers.set('x-user-id', token || '')
  return response
}

<span style="color:#8a8a3a">// 限定匹配路径（性能优化）</span>
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    <span style="color:#7c7c99">// 排除静态资源</span>
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}`,y=u({__name:"X21Middleware",setup(v){const p=[{feat:"执行时机",desc:"每个请求、缓存前，Edge Runtime 运行"},{feat:"位置",desc:"项目根或 src/ 下的 middleware.ts"},{feat:"能力",desc:"重写、重定向、改请求头、改响应头"},{feat:"限制",desc:"不能访问 Node API，依赖需兼容 Edge"}],i=[{case:"认证鉴权",example:"检查 token，未登录跳 /login"},{case:"A/B 测试",example:"按 Cookie 分流到不同版本"},{case:"i18n",example:"按 Accept-Language 重定向到对应语言"},{case:"灰度发布",example:"按用户标识切换新旧版本"},{case:"地理重定向",example:"按地区跳转不同子站"}];return(k,t)=>(a(),l("div",m,[t[5]||(t[5]=e("h3",null,"Middleware 中间件",-1)),e("div",x,[e("div",f,[t[1]||(t[1]=e("h4",null,"核心特性",-1)),(a(),l(o,null,r(p,s=>e("div",{key:s.feat,class:"feat-card"},[e("strong",null,n(s.feat),1),e("p",null,[e("small",null,n(s.desc),1)])])),64)),t[2]||(t[2]=e("h4",{style:{"margin-top":"12px"}},"典型场景",-1)),e("table",null,[t[0]||(t[0]=e("thead",null,[e("tr",null,[e("th",null,"场景"),e("th",null,"示例")])],-1)),e("tbody",null,[(a(),l(o,null,r(i,s=>e("tr",{key:s.case},[e("td",null,[e("strong",null,n(s.case),1)]),e("td",null,[e("small",null,n(s.example),1)])])),64))])])]),e("div",{style:{flex:"1"}},[t[3]||(t[3]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:g}),t[4]||(t[4]=e("div",{class:"detail-box"},[e("p",null,[e("strong",null,"性能："),d("用 matcher 限定路径，避免对所有请求执行。")]),e("p",null,[e("strong",null,"注意："),d("middleware 在 Edge Runtime，慎用重依赖。")])],-1))])])]))}}),w=c(y,[["__scopeId","data-v-408961d0"]]);export{w as default};
