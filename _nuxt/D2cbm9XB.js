import{d as p,b as n,e,F as r,E as u,f as a,r as f,o as i,M as m,I as c}from"./DutfXOOr.js";const v={class:"demo-card"},x={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},b=["onClick"],h={style:{display:"flex",gap:"16px"}},_={style:{flex:"1"}},w={class:"code-block"},y={style:{flex:"1"}},N={class:"code-block"},M={style:{width:"100%"}},k=p({__name:"N11Middleware",setup(C){const l=f("named"),d={named:{title:"命名中间件",code:`// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = false // 模拟判断
  if (!isLoggedIn && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
})`,usage:`// 页面中使用
definePageMeta({
  middleware: 'auth'
  // 或多个: middleware: ['auth', 'admin']
})`},global:{title:"全局中间件",code:`// middleware/stats.global.ts
// 文件名带 .global 后缀自动全局生效
export default defineNuxtRouteMiddleware((to, from) => {
  console.log('页面访问：', to.path)
  // 每次 navigation 都会执行
})`,usage:`// 无需在页面中声明
// .global.ts 后缀使中间件
// 对所有路由自动生效`},page:{title:"页面内联中间件",code:`// 直接在页面组件中定义
definePageMeta({
  middleware: [
    (to, from) => {
      if (to.params.id === 'forbidden') {
        return navigateTo('/')
      }
    }
  ]
})`,usage:`// 适合简单逻辑
// 不需要单独文件
// 直接写在页面组件中`}},g=[{method:"navigateTo",desc:"重定向到新路由",usage:"navigateTo('/login')"},{method:"abortNavigation",desc:"中止当前导航",usage:"abortNavigation()"},{method:"abortNavigation(error)",desc:"中止并抛出错误",usage:"abortNavigation(new Error('无权限'))"}];return(T,t)=>(i(),n("div",v,[t[3]||(t[3]=e("h3",null,"路由中间件",-1)),e("div",x,[(i(),n(r,null,u(d,(o,s)=>e("button",{key:s,class:m({active:l.value===s}),onClick:I=>l.value=s},a(o.title),11,b)),64))]),e("div",h,[e("div",_,[t[0]||(t[0]=e("h4",null,"中间件定义",-1)),e("pre",w,a(d[l.value].code),1)]),e("div",y,[t[1]||(t[1]=e("h4",null,"使用方式",-1)),e("pre",N,a(d[l.value].usage),1)])]),t[4]||(t[4]=e("h4",{style:{"margin-top":"12px"}},"导航控制方法",-1)),e("table",M,[t[2]||(t[2]=e("thead",null,[e("tr",null,[e("th",null,"方法"),e("th",null,"说明"),e("th",null,"用法")])],-1)),e("tbody",null,[(i(),n(r,null,u(g,o=>e("tr",{key:o.method},[e("td",null,[e("code",null,a(o.method),1)]),e("td",null,a(o.desc),1),e("td",null,[e("code",null,a(o.usage),1)])])),64))])]),t[5]||(t[5]=e("div",{style:{"margin-top":"10px",padding:"10px",background:"#fff8f0","border-radius":"6px","font-size":"13px"}}," 💡 中间件执行顺序：全局中间件 → 页面定义的命名中间件（按数组顺序）→ 内联中间件。中间件在 SSR 和 CSR 都会执行。 ",-1))]))}}),S=c(k,[["__scopeId","data-v-2cfd1205"]]);export{S as default};
