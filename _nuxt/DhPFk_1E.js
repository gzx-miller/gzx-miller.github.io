import{d as c,b as n,e,F as l,E as u,v as r,o as a,z as m,f as o,I as x}from"./DutfXOOr.js";const y={class:"demo-card"},h={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},f={style:{flex:"1"}},b=`<span style="color:#8a8a3a">// app/api/users/route.ts</span>
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

<span style="color:#7c7c99">// GET /api/users</span>
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const users = await db.user.findMany({
    where: q ? { name: { contains: q } } : {}
  })
  return NextResponse.json(users)
}

<span style="color:#7c7c99">// POST /api/users</span>
export async function POST(request: Request) {
  const body = await request.json()
  const user = await db.user.create({ data: body })
  return NextResponse.json(user, { status: 201 })
}

<span style="color:#8a8a3a">// app/api/users/[id]/route.ts</span>
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({ where: { id: params.id } })
  if (!user) return NextResponse.json({ error: '未找到' }, { status: 404 })
  return NextResponse.json(user)
}`,T=c({__name:"X11RouteHandlers",setup(R){const d=[{method:"GET",desc:"读取数据",cache:"可缓存",color:"#65a30d"},{method:"POST",desc:"创建数据",cache:"不缓存",color:"#0891b2"},{method:"PUT",desc:"更新数据",cache:"不缓存",color:"#d97706"},{method:"DELETE",desc:"删除数据",cache:"不缓存",color:"#e85d04"},{method:"PATCH",desc:"部分更新",cache:"不缓存",color:"#ca8a04"}],p=["文件名固定为 route.ts / route.js","每个导出的 HTTP 方法对应一个处理函数","运行在 Node.js 或 Edge Runtime","可配合缓存：export const dynamic / revalidate","适合做 Webhook、第三方 API 代理"];return(g,s)=>(a(),n("div",y,[s[5]||(s[5]=e("h3",null,"Route Handlers：API 路由",-1)),e("div",h,[e("div",f,[s[1]||(s[1]=e("h4",null,"HTTP 方法映射",-1)),e("table",null,[s[0]||(s[0]=e("thead",null,[e("tr",null,[e("th",null,"方法"),e("th",null,"用途"),e("th",null,"缓存")])],-1)),e("tbody",null,[(a(),n(l,null,u(d,t=>e("tr",{key:t.method},[e("td",null,[e("span",{class:"method-tag",style:m({background:t.color})},o(t.method),5)]),e("td",null,o(t.desc),1),e("td",null,[e("small",null,o(t.cache),1)])])),64))])]),s[2]||(s[2]=e("h4",{style:{"margin-top":"12px"}},"核心特性",-1)),e("ul",null,[(a(),n(l,null,u(p,(t,i)=>e("li",{key:i},[e("small",null,o(t),1)])),64))])]),e("div",{style:{flex:"1"}},[s[3]||(s[3]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:b}),s[4]||(s[4]=e("div",{class:"detail-box"},[e("p",null,[e("strong",null,"路径："),r("app/api/users/route.ts → /api/users")]),e("p",null,[e("strong",null,"动态："),r("app/api/users/[id]/route.ts → /api/users/:id")]),e("p",null,[e("strong",null,"区别："),r("Server Action 是表单提交，Route Handler 是 REST API。")])],-1))])])]))}}),E=x(T,[["__scopeId","data-v-b28f101b"]]);export{E as default};
