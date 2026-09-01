import{I as d,b as o,e as s,M as n,F as f,E as m,f as r,r as y,g as l,o as p}from"./DutfXOOr.js";const v={class:"demo-card"},x={class:"toggle-row"},h={class:"route-table"},_={class:"mini-code"},E={__name:"D13ExpressFastify",setup(b){const e=y("express"),u=[{method:"GET",path:"/api/users",desc:"获取用户列表"},{method:"POST",path:"/api/users",desc:"创建用户"},{method:"GET",path:"/api/users/:id",desc:"获取单个用户"}],i=l(()=>e.value!=="express"?"":`// Express 中间件链模式
const app = express()
app.use(cors())          // 中间件 1
app.use(authenticate)    // 中间件 2
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users')
  res.json(users)
})`),c=l(()=>e.value!=="fastify"?"":`// Fastify Schema 验证模式
const app = fastify()
app.get('/api/users', {
  schema: {
    response: {
      200: { type: 'array', items: { $ref: 'User#' } }
    }
  },
  handler: async () => db.users.findMany()
})`);return(g,a)=>(p(),o("div",v,[a[2]||(a[2]=s("p",null,"Express 依赖中间件链逐层处理请求；Fastify 内置 JSON Schema 验证与序列化，性能更优。",-1)),s("div",x,[s("button",{class:n({active:e.value==="express"}),onClick:a[0]||(a[0]=t=>e.value="express")},"Express",2),s("button",{class:n({active:e.value==="fastify"}),onClick:a[1]||(a[1]=t=>e.value="fastify")},"Fastify",2)]),s("table",h,[s("tbody",null,[(p(),o(f,null,m(u,t=>s("tr",{key:t.method+t.path},[s("td",null,[s("code",null,r(t.method),1)]),s("td",null,r(t.path),1),s("td",null,r(t.desc),1)])),64))])]),s("pre",_,[s("code",null,r(e.value==="express"?i.value:c.value),1)]),s("small",null,r(e.value==="express"?"中间件按注册顺序执行，每个可修改 req/res 或调用 next()。":"Schema 自动验证请求与响应，序列化速度比 JSON.stringify 更快。"),1)]))}},S=d(E,[["__scopeId","data-v-24828489"]]);export{S as default};
