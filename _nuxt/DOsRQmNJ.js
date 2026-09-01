import{d as f,b as u,e as s,F as p,E as y,v as l,f as t,g as v,o as i,M as S,r as g,I as _}from"./DutfXOOr.js";const x={class:"demo-card"},w={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},h={style:{flex:"1"}},q={class:"scenario-list"},k=["onClick"],R={class:"result-box"},L={style:{flex:"1"}},b={class:"flow-list"},I={class:"flow-num"},U={class:"yes"},C={class:"no"},B=`<span style="color:#7c7c99">// 1. 组件本地状态 — ref（Vue）/ useState（React）</span>
const isOpen = ref(false)
const input = useState('input', () => '')

<span style="color:#7c7c99">// 2. URL 状态 — 路由 query（可分享、可刷新）</span>
const route = useRoute()
const keyword = computed(() => route.query.q)

<span style="color:#7c7c99">// 3. 服务端缓存 — TanStack Query（自动缓存 + 失效）</span>
const { data, isLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: fetchCourses,
})

<span style="color:#7c7c99">// 4. 跨组件共享 — Pinia store</span>
const cart = useCartStore()
cart.addItem(course)
cart.total  <span style="color:#7c7c99">// 计算属性</span>

<span style="color:#7c7c99">// 5. 持久化 — localStorage</span>
const theme = useStorage('theme', 'light')`,F=f({__name:"S01StateBoundaries",setup(P){const a=g("modal"),c=[{id:"modal",name:"弹窗开关",state:"单组件 UI 状态",source:"组件自身",tool:"ref / useState",why:"只有当前组件用，无需共享"},{id:"cart",name:"购物车",state:"跨页面业务状态",source:"多组件共享",tool:"Pinia / Zustand / Redux",why:"多个页面读写同一份数据"},{id:"filter",name:"搜索筛选",state:"可分享的 URL 状态",source:"地址栏",tool:"路由 query / URL params",why:"刷新和分享都应保持筛选"},{id:"courses",name:"课程列表",state:"服务端缓存状态",source:"API 返回",tool:"TanStack Query / useAsyncData",why:"需缓存失效、请求去重、加载态"},{id:"theme",name:"主题偏好",state:"持久化客户端状态",source:"localStorage",tool:"useStorage / 自定义 composable",why:"跨会话保持，无需服务端"},{id:"form",name:"表单草稿",state:"临时客户端状态",source:"组件内部",tool:"ref / reactive",why:"提交前临时保存，无需全局"}],n=v(()=>c.find(d=>d.id===a.value)),m=[{q:"数据只在一个组件用？",yes:"组件内 ref / useState",no:"继续往下"},{q:"需要刷新后保持？",yes:"URL 参数 或 localStorage",no:"继续往下"},{q:"来自服务端 API？",yes:"TanStack Query / useFetch",no:"继续往下"},{q:"多个组件共享？",yes:"Pinia / Zustand / Redux",no:"组件内 ref"}];return(d,e)=>(i(),u("div",x,[e[6]||(e[6]=s("h3",null,"状态归属与边界",-1)),s("div",w,[s("div",h,[e[4]||(e[4]=s("h4",null,"业务场景（点击切换）",-1)),s("div",q,[(i(),u(p,null,y(c,o=>s("button",{class:S(["scenario-btn",{active:a.value===o.id}]),key:o.id,onClick:r=>a.value=o.id},t(o.name),11,k)),64))]),s("div",R,[s("p",null,[e[0]||(e[0]=s("strong",null,"状态类型：",-1)),l(t(n.value.state),1)]),s("p",null,[e[1]||(e[1]=s("strong",null,"数据来源：",-1)),l(t(n.value.source),1)]),s("p",null,[e[2]||(e[2]=s("strong",null,"推荐工具：",-1)),s("code",null,t(n.value.tool),1)]),s("p",null,[e[3]||(e[3]=s("strong",null,"原因：",-1)),s("small",null,t(n.value.why),1)])])]),s("div",L,[e[5]||(e[5]=s("h4",null,"决策流程",-1)),s("div",b,[(i(),u(p,null,y(m,(o,r)=>s("div",{key:r,class:"flow-item"},[s("span",I,t(r+1),1),s("div",null,[s("p",null,[s("strong",null,t(o.q),1)]),s("p",U,"是 → "+t(o.yes),1),s("p",C,"否 → "+t(o.no),1)])])),64))])])]),e[7]||(e[7]=s("h4",null,"各方案代码对比",-1)),s("pre",{class:"mini-code",innerHTML:B}),e[8]||(e[8]=s("div",{class:"tips-box"},[s("p",null,[s("strong",null,"核心原则："),l("Store 只承载需要跨组件共享、具有业务生命周期的客户端状态。局部 UI、URL 参数和远程缓存各有更合适的归属。")]),s("p",null,[s("strong",null,"常见误区："),l("把所有状态都塞进全局 store，导致组件无法独立、调试困难。")])],-1))]))}}),Q=_(F,[["__scopeId","data-v-c6df0366"]]);export{Q as default};
