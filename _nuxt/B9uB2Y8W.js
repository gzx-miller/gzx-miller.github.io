import{d as n,b as s,e as t,M as u,v as l,f as d,r,o as a,I as y}from"./DutfXOOr.js";const v={class:"demo-card"},p={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},c={style:{display:"flex",gap:"16px"}},f={style:{flex:"1"}},m={key:0,class:"layout-preview"},x={key:1,class:"layout-preview"},_={style:{flex:"1"}},b={key:0,class:"code-block"},k={key:1,class:"code-block"},g=`// 在页面组件中指定布局
definePageMeta({
  layout: 'custom'
})`,C=`<!-- layouts/default.vue -->
<template>
  <div class="layout">
    <header>网站导航栏</header>
    <main><slot /></main>
    <footer>底部信息</footer>
  </div>
</template>`,L=`<!-- layouts/custom.vue -->
<template>
  <div class="layout">
    <aside>侧边菜单</aside>
    <main><slot /></main>
  </div>
</template>`,M=n({__name:"N04Layouts",setup(N){const o=r("default");return(B,e)=>(a(),s("div",v,[e[7]||(e[7]=t("h3",null,"布局系统：Layout 与 definePageMeta",-1)),t("div",p,[t("button",{class:u({active:o.value==="default"}),onClick:e[0]||(e[0]=i=>o.value="default")},"Default 布局",2),t("button",{class:u({active:o.value==="custom"}),onClick:e[1]||(e[1]=i=>o.value="custom")},"Custom 布局",2)]),t("div",c,[t("div",f,[e[4]||(e[4]=t("h4",null,"布局预览",-1)),o.value==="default"?(a(),s("div",m,[...e[2]||(e[2]=[t("div",{class:"layout-header"},"🌐 导航栏 (Header)",-1),t("div",{class:"layout-body"},[t("div",{class:"layout-slot"},[l("📂 页面内容 "),t("code",null,"<slot />")])],-1),t("div",{class:"layout-footer"},"📝 底部 (Footer)",-1)])])):(a(),s("div",x,[...e[3]||(e[3]=[t("div",{class:"layout-sidebar"},"📋 侧边菜单 (Sidebar)",-1),t("div",{class:"layout-body",style:{flex:"1"}},[t("div",{class:"layout-slot"},[l("📂 页面内容 "),t("code",null,"<slot />")])],-1)])]))]),t("div",_,[e[5]||(e[5]=t("h4",null,"布局代码",-1)),o.value==="default"?(a(),s("pre",b,d(C))):(a(),s("pre",k,d(L))),e[6]||(e[6]=t("h4",{style:{"margin-top":"8px"}},"页面指定布局",-1)),t("pre",{class:"code-block"},d(g))])]),e[8]||(e[8]=t("div",{style:{"margin-top":"10px","font-size":"13px",color:"#666"}},[l(" 💡 布局通过 "),t("code",null,"<slot />"),l(" 接收页面内容；页面通过 "),t("code",null,"definePageMeta({ layout })"),l(" 选择布局；不指定则使用 default。 ")],-1))]))}}),w=y(M,[["__scopeId","data-v-0aa44831"]]);export{w as default};
