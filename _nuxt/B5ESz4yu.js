import{d as f,b as o,e,f as a,M as b,F as g,E as _,A as m,v as i,r as c,o as n,I as y}from"./DutfXOOr.js";const k={class:"demo-card"},x={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},F=["disabled"],w=["disabled"],C=["disabled"],N={key:0,style:{"margin-top":"8px"}},E={key:1,style:{"margin-top":"8px",color:"#c62828"}},D=`// 基本 useFetch
const { data, pending, error, refresh } = 
  await useFetch('/api/users')

// 带参数的 useFetch
const { data } = await useFetch('/api/users', {
  query: { page: 1, size: 10 },
  method: 'GET',
})

// 动态 URL（参数变化自动重新请求）
const id = ref(1)
const { data } = await useFetch(\`/api/users/\${id.value}\`)

// 只在客户端请求
const { data } = await useFetch('/api/chart', {
  server: false,
})`,R=f({__name:"N07UseFetch",setup(S){const t=c("idle"),l=c(null),u=c("");async function p(){t.value="loading",l.value=null,u.value="",await new Promise(r=>setTimeout(r,1200)),l.value={users:[{id:1,name:"小松鼠",role:"前端"},{id:2,name:"大栗子",role:"后端"},{id:3,name:"花栗鼠",role:"全栈"}]},t.value="success"}async function v(){t.value="loading",l.value=null,u.value="",await new Promise(r=>setTimeout(r,800)),u.value="网络请求失败：404 Not Found",t.value="error"}function h(){p()}return(r,s)=>(n(),o("div",k,[s[1]||(s[1]=e("h3",null,"useFetch：声明式数据获取",-1)),e("div",x,[e("button",{onClick:p,disabled:t.value==="loading"},"获取数据",8,F),e("button",{onClick:v,disabled:t.value==="loading"},"模拟错误",8,w),e("button",{onClick:h,disabled:t.value!=="success"},"刷新 refresh()",8,C)]),e("div",{class:b(["status-bar",t.value])}," 状态："+a({idle:"等待请求",loading:"⏳ 请求中…",success:"✅ 成功",error:"❌ 失败"}[t.value]),3),t.value==="success"&&l.value?(n(),o("div",N,[e("table",null,[s[0]||(s[0]=e("thead",null,[e("tr",null,[e("th",null,"ID"),e("th",null,"姓名"),e("th",null,"角色")])],-1)),e("tbody",null,[(n(!0),o(g,null,_(l.value.users,d=>(n(),o("tr",{key:d.id},[e("td",null,a(d.id),1),e("td",null,a(d.name),1),e("td",null,a(d.role),1)]))),128))])])])):m("",!0),t.value==="error"?(n(),o("div",E,a(u.value),1)):m("",!0),s[2]||(s[2]=e("h4",{style:{"margin-top":"12px"}},"useFetch 用法",-1)),e("pre",{class:"code-block"},a(D)),s[3]||(s[3]=e("div",{style:{"margin-top":"10px",padding:"10px",background:"#fff8f0","border-radius":"6px","font-size":"13px"}},[i(" 💡 "),e("code",null,"useFetch"),i(" 是 Nuxt 封装的数据获取组合式函数，自动生成请求 key、处理 SSR/CSR 双端请求、去重和缓存。等价于 "),e("code",null,"useAsyncData(key, () => $fetch(...))"),i(" 的语法糖。 ")],-1))]))}}),z=y(R,[["__scopeId","data-v-e821e0db"]]);export{z as default};
