import{d as h,b as o,e,F as l,E as c,o as n,z as r,f as s,I as f}from"./DutfXOOr.js";const m={class:"demo-card"},u={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},x={style:{flex:"1"}},y=`<span style="color:#8a8a3a">// 1. 默认缓存（静态）</span>
const res = await fetch('https://api.example.com/posts')
<span style="color:#7c7c99">// 等价于 fetch(url, { cache: 'force-cache' })</span>

<span style="color:#8a8a3a">// 2. 禁用缓存（动态）</span>
const res = await fetch('https://api.example.com/live', {
  cache: 'no-store'
})

<span style="color:#8a8a3a">// 3. ISR — 定时重新验证</span>
const res = await fetch('https://api.example.com/news', {
  next: { revalidate: 60 }  <span style="color:#7c7c99">// 60秒</span>
})

<span style="color:#8a8a3a">// 4. 按标签缓存 + 主动失效</span>
const res = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
})

<span style="color:#8a8a3a">// 在 Server Action 或 Route Handler 中失效</span>
import { revalidateTag } from 'next/cache'
revalidateTag('posts')  <span style="color:#7c7c99">// 清除该标签缓存</span>`,g=h({__name:"X09DataFetching",setup(v){const p=[{option:"cache: 'force-cache'",desc:"默认，构建时缓存，永久有效",when:"静态内容",color:"#65a30d"},{option:"cache: 'no-store'",desc:"不缓存，每次请求都重新获取",when:"实时数据",color:"#e85d04"},{option:"next: { revalidate: 60 }",desc:"ISR，60 秒后重新验证",when:"半静态内容",color:"#d97706"},{option:"next: { tags: ['posts'] }",desc:"按标签缓存，可主动失效",when:"按需更新",color:"#0891b2"}],i=["Next.js 扩展了原生 fetch，自动去重和缓存","同一渲染周期内相同 URL 的 fetch 只执行一次","Server Component 中直接 await fetch，无需 useEffect","缓存存储在服务端，跨请求共享"];return(w,t)=>(n(),o("div",m,[t[3]||(t[3]=e("h3",null,"数据获取与 fetch 缓存",-1)),e("div",u,[e("div",x,[t[0]||(t[0]=e("h4",null,"fetch 缓存选项",-1)),(n(),o(l,null,c(p,a=>e("div",{key:a.option,class:"cache-card",style:r({borderLeftColor:a.color})},[e("code",null,s(a.option),1),e("span",{class:"tag",style:r({background:a.color})},s(a.when),5),e("p",null,[e("small",null,s(a.desc),1)])],4)),64)),t[1]||(t[1]=e("h4",{style:{"margin-top":"12px"}},"关键事实",-1)),e("ul",null,[(n(),o(l,null,c(i,(a,d)=>e("li",{key:d},[e("small",null,s(a),1)])),64))])]),e("div",{style:{flex:"1"}},[t[2]||(t[2]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:y})])])]))}}),b=f(g,[["__scopeId","data-v-8fe0b23e"]]);export{b as default};
