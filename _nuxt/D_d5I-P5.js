import{d as r,k as v,b as d,e as t,f as a,a0 as p,r as n,o as s,I as u}from"./DutfXOOr.js";const c={class:"demo-card"},y={style:{display:"flex",gap:"16px"}},m={style:{flex:"1"}},f={class:"demo-box"},_={class:"item"},C={class:"item"},h={key:0},b={key:1,style:{color:"#999"}},S=`<!-- 方式1：ClientOnly 组件 -->
<ClientOnly>
  <ChartComponent />
  <template #fallback>
    <p>加载中…</p>
  </template>
</ClientOnly>

<!-- 方式2：import.meta.client 判断 -->
<div v-if="true">
  仅客户端渲染的内容
</div>

<!-- 方式3：onMounted 中赋值 -->
const browserInfo = ref('')
onMounted(() => {
  browserInfo.value = navigator.userAgent
})

<!-- 方式4：插件中仅客户端注册 -->
// plugins/chart.client.ts
// 文件名加 .client 后缀，仅在客户端加载`,x=r({__name:"N10ClientOnly",setup(g){const l=n("服务端渲染：等待中…"),o=n(""),i=n(!1);return v(()=>{l.value="客户端挂载：✅ onMounted 已执行",o.value=new Date().toLocaleString("zh-CN"),i.value=!0}),(k,e)=>(s(),d("div",c,[e[5]||(e[5]=t("h3",null,"ClientOnly 与客户端专属渲染",-1)),t("div",y,[t("div",m,[e[2]||(e[2]=t("h4",null,"演示：SSR vs CSR 内容",-1)),t("div",f,[t("div",_,[e[0]||(e[0]=t("span",{class:"label"},"SSR + CSR：",-1)),t("span",null,a(l.value),1)]),t("div",C,[e[1]||(e[1]=t("span",{class:"label"},"仅客户端：",-1)),i.value?(s(),d("span",h,a(o.value||"加载中…"),1)):(s(),d("span",b,"[服务端跳过]"))])]),e[3]||(e[3]=p('<h4 style="margin-top:12px;" data-v-318d8e63>使用场景</h4><table style="width:100%;" data-v-318d8e63><thead data-v-318d8e63><tr data-v-318d8e63><th data-v-318d8e63>场景</th><th data-v-318d8e63>推荐方式</th></tr></thead><tbody data-v-318d8e63><tr data-v-318d8e63><td data-v-318d8e63>图表库（ECharts/D3）</td><td data-v-318d8e63>ClientOnly 包裹</td></tr><tr data-v-318d8e63><td data-v-318d8e63>浏览器 API（window/navigator）</td><td data-v-318d8e63>true 判断</td></tr><tr data-v-318d8e63><td data-v-318d8e63>第三方库不兼容 SSR</td><td data-v-318d8e63>.client.ts 插件</td></tr><tr data-v-318d8e63><td data-v-318d8e63>动态内容（时间/随机数）</td><td data-v-318d8e63>onMounted 中赋值</td></tr></tbody></table>',2))]),t("div",{style:{flex:"1"}},[e[4]||(e[4]=t("h4",null,"代码示例",-1)),t("pre",{class:"code-block"},a(S))])])]))}}),O=u(x,[["__scopeId","data-v-318d8e63"]]);export{O as default};
