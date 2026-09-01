import{s as x}from"./CLeGk598.js";import{d as b,b as l,e as t,f as d,F as u,E as c,v as m,r as f,o as n,I as y}from"./DutfXOOr.js";const S={class:"demo-card"},_={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},T={style:{flex:"1"}},h=["disabled"],A={class:"log-box"},P=`<span style="color:#8a8a3a">// app/actions.ts</span>
<span style="color:#e85d04">'use server'</span>
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function addTodo(formData: FormData) {
  const text = formData.get('text') as string
  await db.todo.create({ data: { text } })
  revalidatePath('/todos')  <span style="color:#7c7c99">// 刷新该路由缓存</span>
}

<span style="color:#8a8a3a">// app/todos/page.tsx — 调用</span>
import { addTodo } from '@/app/actions'

export default function Todos() {
  return (
    &lt;form action={addTodo}&gt;
      &lt;input name="text" /&gt;
      &lt;button&gt;添加&lt;/button&gt;
    &lt;/form&gt;
  )
}`,F=b({__name:"X10ServerActions",setup(I){const r=f([]),a=f(!1);function p(o){r.value.push(o)}function v(){r.value=[],a.value=!0;const o=['用户点击"提交"',"浏览器 POST 到当前路由（无需写 API）","Server Action 在服务端执行",'revalidatePath("/todos") 清缓存',"返回新数据，页面自动刷新"];let e=0;const s=x(()=>{e<o.length?(p(`[${e+1}] ${o[e]}`),e++):(clearInterval(s),a.value=!1,p("✓ 完成，无需手动 refetch"))},600)}const g=["无需手写 API 端点，直接在服务端运行","form action 属性原生支持","自动处理 CSRF 防护","配合 revalidatePath / revalidateTag 刷新缓存","支持 useFormState / useFormStatus 跟踪状态","可用 useOptimistic 实现乐观更新"];return(o,e)=>(n(),l("div",S,[e[4]||(e[4]=t("h3",null,"Server Actions：服务端操作",-1)),t("div",_,[t("div",T,[e[0]||(e[0]=t("h4",null,"执行流程",-1)),t("button",{class:"btn",disabled:a.value,onClick:v},d(a.value?"执行中...":"▶ 模拟 Server Action"),9,h),t("div",A,[(n(!0),l(u,null,c(r.value,(s,i)=>(n(),l("p",{key:i,class:"log-line"},d(s),1))),128))]),e[1]||(e[1]=t("h4",{style:{"margin-top":"12px"}},"核心特性",-1)),t("ul",null,[(n(),l(u,null,c(g,(s,i)=>t("li",{key:i},[t("small",null,d(s),1)])),64))])]),t("div",{style:{flex:"1"}},[e[2]||(e[2]=t("h4",null,"代码示例",-1)),t("pre",{class:"mini-code",innerHTML:P}),e[3]||(e[3]=t("div",{class:"detail-box"},[t("p",null,[t("strong",null,"关键："),m('文件顶部 "use server" 声明，函数即变成服务端可调用。')]),t("p",null,[t("strong",null,"注意："),m("Server Action 通过 POST 调用，参数自动序列化。")])],-1))])])]))}}),B=y(F,[["__scopeId","data-v-70fe5014"]]);export{B as default};
