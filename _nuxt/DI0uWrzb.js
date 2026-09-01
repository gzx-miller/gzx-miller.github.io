import{d as f,b as a,e as t,F as m,E as _,f as v,a0 as g,r as c,o as d,M as x,I as y}from"./DutfXOOr.js";const b={class:"demo-card"},E={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},h=["onClick"],T={style:{display:"flex",gap:"16px"}},C={style:{flex:"1"}},k={class:"code-block"},N={style:{flex:"1"}},R={style:{display:"flex",gap:"6px","margin-bottom":"8px"}},S=["disabled"],P=["disabled"],A=["disabled"],B={class:"result-box"},H={key:0},w={key:1},G={key:2,style:{color:"#999"}},I=f({__name:"N16ApiRoutes",setup(F){const i=c("basic"),p={basic:{title:"GET 接口",code:`// server/api/hello.ts
export default defineEventHandler((event) => {
  return { message: '你好，小松鼠！' }
})

// 请求 GET /api/hello
// 响应 { "message": "你好，小松鼠！" }`},method:{title:"RESTful 方法",code:`// server/api/users/index.get.ts → GET /api/users
export default defineEventHandler(async (event) => {
  return [{ id: 1, name: '松鼠' }]
})

// server/api/users/index.post.ts → POST /api/users
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return { id: 2, ...body }
})

// server/api/users/[id].delete.ts → DELETE /api/users/:id
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return { deleted: id }
})`},params:{title:"参数与工具",code:`// 路由参数
const id = getRouterParam(event, 'id')

// 查询参数
const query = getQuery(event)  // ?page=1&size=10

// 请求体
const body = await readBody(event)

// 设置响应头
setResponseHeader(event, 'Cache-Control', 'max-age=3600')

// 设置状态码
setResponseStatus(event, 201)

// 返回错误
throw createError({
  statusCode: 404,
  statusMessage: 'Not Found'
})`}},s=c(""),o=c(!1);async function l(r){o.value=!0,s.value="",await new Promise(e=>setTimeout(e,500)),r==="hello"?s.value=JSON.stringify({message:"你好，小松鼠！"},null,2):r==="users"?s.value=JSON.stringify([{id:1,name:"松鼠"},{id:2,name:"栗子"}],null,2):s.value=JSON.stringify({statusCode:404,statusMessage:"Not Found"},null,2),o.value=!1}return(r,e)=>(d(),a("div",b,[e[4]||(e[4]=t("h3",null,"API 路由：Server Routes",-1)),t("div",E,[(d(),a(m,null,_(p,(n,u)=>t("button",{key:u,class:x({active:i.value===u}),onClick:O=>i.value=u},v(n.title),11,h)),64))]),t("div",T,[t("div",C,[t("pre",k,v(p[i.value].code),1)]),t("div",N,[e[3]||(e[3]=t("h4",null,"模拟 API 调用",-1)),t("div",R,[t("button",{onClick:e[0]||(e[0]=n=>l("hello")),disabled:o.value},"GET /api/hello",8,S),t("button",{onClick:e[1]||(e[1]=n=>l("users")),disabled:o.value},"GET /api/users",8,P),t("button",{onClick:e[2]||(e[2]=n=>l("error")),disabled:o.value},"模拟 404",8,A)]),t("div",B,[o.value?(d(),a("p",H,"⏳ 请求中…")):s.value?(d(),a("pre",w,v(s.value),1)):(d(),a("p",G,"点击按钮发起请求"))])])]),e[5]||(e[5]=g('<div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;" data-v-67949301> 💡 <code data-v-67949301>server/api/</code> 下的文件自动注册为 API 路由，路径 <code data-v-67949301>/api/</code> 前缀。文件名后缀 <code data-v-67949301>.get.ts</code>、<code data-v-67949301>.post.ts</code> 等限定 HTTP 方法。工具函数如 <code data-v-67949301>readBody</code>、<code data-v-67949301>getQuery</code> 从 <code data-v-67949301>h3</code> 自动导入。 </div>',1))]))}}),z=y(I,[["__scopeId","data-v-67949301"]]);export{z as default};
