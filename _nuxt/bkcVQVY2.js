import{d as r,k as c,b as d,e as t,f as e,a0 as v,r as n,o as s,F as f}from"./CfJSWYGO.js";const b={class:"demo-card"},p={style:{display:"flex",gap:"16px"}},u={style:{flex:"1"}},m={class:"demo-box"},y={class:"item"},_={class:"item"},C={key:0},h={key:1,style:{color:"#999"}},S=`<!-- 方式1：ClientOnly 组件 -->
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
// 文件名加 .client 后缀，仅在客户端加载`,x=r({__name:"N10ClientOnly",setup(g){const l=n("服务端渲染：等待中…"),o=n(""),i=n(!1);return c(()=>{l.value="客户端挂载：✅ onMounted 已执行",o.value=new Date().toLocaleString("zh-CN"),i.value=!0}),(k,a)=>(s(),d("div",b,[a[5]||(a[5]=t("h3",null,"ClientOnly 与客户端专属渲染",-1)),t("div",p,[t("div",u,[a[2]||(a[2]=t("h4",null,"演示：SSR vs CSR 内容",-1)),t("div",m,[t("div",y,[a[0]||(a[0]=t("span",{class:"label"},"SSR + CSR：",-1)),t("span",null,e(l.value),1)]),t("div",_,[a[1]||(a[1]=t("span",{class:"label"},"仅客户端：",-1)),i.value?(s(),d("span",C,e(o.value||"加载中…"),1)):(s(),d("span",h,"[服务端跳过]"))])]),a[3]||(a[3]=v('<h4 style="margin-top:12px;" data-v-b8c19fd9>使用场景</h4><table style="width:100%;" data-v-b8c19fd9><thead data-v-b8c19fd9><tr data-v-b8c19fd9><th data-v-b8c19fd9>场景</th><th data-v-b8c19fd9>推荐方式</th></tr></thead><tbody data-v-b8c19fd9><tr data-v-b8c19fd9><td data-v-b8c19fd9>图表库（ECharts/D3）</td><td data-v-b8c19fd9>ClientOnly 包裹</td></tr><tr data-v-b8c19fd9><td data-v-b8c19fd9>浏览器 API（window/navigator）</td><td data-v-b8c19fd9>import.meta<span data-v-b8c19fd9>.client</span> 判断</td></tr><tr data-v-b8c19fd9><td data-v-b8c19fd9>第三方库不兼容 SSR</td><td data-v-b8c19fd9>.client.ts 插件</td></tr><tr data-v-b8c19fd9><td data-v-b8c19fd9>动态内容（时间/随机数）</td><td data-v-b8c19fd9>onMounted 中赋值</td></tr></tbody></table>',2))]),t("div",{style:{flex:"1"}},[a[4]||(a[4]=t("h4",null,"代码示例",-1)),t("pre",{class:"code-block"},e(S))])])]))}}),O=f(x,[["__scopeId","data-v-b8c19fd9"]]);export{O as default};
