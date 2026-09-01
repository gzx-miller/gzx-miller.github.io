import{d as i,b as o,e as a,F as f,E as l,f as c,a0 as p,r as v,o as n,M as u,I as y}from"./DutfXOOr.js";const h={class:"demo-card"},_={style:{display:"flex",gap:"6px","margin-bottom":"12px"}},m=["onClick"],x={style:{display:"flex",gap:"16px"}},A={style:{flex:"1"}},D={class:"code-block"},b={style:{flex:"1"}},g={class:"desc-box"},k=i({__name:"N08UseAsyncData",setup(z){const t=v("basic"),d={basic:{title:"基本用法",code:`const { data, pending, error, refresh } = 
  await useAsyncData('users', () => $fetch('/api/users'))`,desc:"手动指定 key，控制缓存和去重逻辑。key 相同的请求会复用结果。"},dedupe:{title:"去重策略",code:`const { data } = await useAsyncData('users', 
  () => $fetch('/api/users'), 
  { dedupe: 'defer' }  // 或 'cancel'
)`,desc:"defer：已有相同 key 的请求进行中，则等待其完成共享结果。cancel：取消前一个请求，发起新请求。"},transform:{title:"数据转换",code:`const { data } = await useAsyncData('products', 
  () => $fetch('/api/products'),
  { 
    transform: (data) => data.map(p => ({
      ...p, price: (p.price / 100).toFixed(2)
    })),
    default: () => [],  // 初始默认值
  }
)`,desc:"在服务端获取原始数据后，用 transform 处理格式；default 提供 data 的初始值，避免 undefined。"},lazy:{title:"Lazy 模式",code:`// 不等待 SSR，客户端再请求
const { data, pending } = useLazyAsyncData(
  'analytics', 
  () => $fetch('/api/analytics')
)`,desc:"useLazyAsyncData 不会阻塞导航，数据到达前 data 为 undefined、pending 为 true。适合非核心内容。"}};return(F,e)=>(n(),o("div",h,[e[0]||(e[0]=a("h3",null,"useAsyncData：异步数据管理",-1)),a("div",_,[(n(),o(f,null,l(d,(r,s)=>a("button",{key:s,class:u({active:t.value===s}),onClick:L=>t.value=s},c(r.title),11,m)),64))]),a("div",x,[a("div",A,[a("pre",D,c(d[t.value].code),1)]),a("div",b,[a("div",g,[a("p",null,c(d[t.value].desc),1)])])]),e[1]||(e[1]=p('<h4 style="margin-top:12px;" data-v-2a1241f9>useFetch vs useAsyncData 对比</h4><table style="width:100%;" data-v-2a1241f9><thead data-v-2a1241f9><tr data-v-2a1241f9><th data-v-2a1241f9>特性</th><th data-v-2a1241f9>useFetch</th><th data-v-2a1241f9>useAsyncData</th></tr></thead><tbody data-v-2a1241f9><tr data-v-2a1241f9><td data-v-2a1241f9>Key 管理</td><td data-v-2a1241f9>自动从 URL 生成</td><td data-v-2a1241f9>手动指定</td></tr><tr data-v-2a1241f9><td data-v-2a1241f9>底层实现</td><td data-v-2a1241f9>封装 useAsyncData</td><td data-v-2a1241f9>底层 API</td></tr><tr data-v-2a1241f9><td data-v-2a1241f9>适用场景</td><td data-v-2a1241f9>简单 HTTP 请求</td><td data-v-2a1241f9>复杂异步逻辑、自定义缓存</td></tr><tr data-v-2a1241f9><td data-v-2a1241f9>灵活性</td><td data-v-2a1241f9>适中</td><td data-v-2a1241f9>更高</td></tr></tbody></table><div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;" data-v-2a1241f9> 💡 <code data-v-2a1241f9>useFetch</code> 是 <code data-v-2a1241f9>useAsyncData</code> 的语法糖。需要自定义 key 或组合多个异步操作时，直接使用 <code data-v-2a1241f9>useAsyncData</code>。 </div>',3))]))}}),w=y(k,[["__scopeId","data-v-2a1241f9"]]);export{w as default};
