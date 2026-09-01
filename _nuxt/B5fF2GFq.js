import{d as u,b as n,e as r,M as l,f as s,A as d,F as c,E as v,v as i,r as g,o as a,I as h}from"./DutfXOOr.js";const y={class:"demo-card"},f={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},m={style:{display:"flex",gap:"16px"}},x={style:{flex:"1"}},E={key:0,class:"code-block"},b={key:1,class:"code-block"},k={key:2,class:"code-block"},_={style:{flex:"1"}},C={style:{width:"100%"}},S=`<!-- error.vue（项目根目录或 src/ 下） -->
<script setup lang="ts">
const props = defineProps<{
  error: {
    url: string
    statusCode: number
    statusMessage: string
    message: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
<\/script>

<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage || '出错了' }}</p>
    <button @click="handleError">返回首页</button>
  </div>
</template>`,w=`// plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error('Vue 错误：', error)
    // 上报错误到监控服务
  })
  
  nuxtApp.hook('app:error', (error) => {
    console.error('应用错误：', error)
  })
})

// server/api/ 中抛出错误
export default defineEventHandler(() => {
  throw createError({
    statusCode: 404,
    statusMessage: '资源不存在',
  })
})`,A=`// useFetch 错误处理
const { data, error, pending } = await useFetch('/api/users')

// 模板中
// <div v-if="error">{{ error.message }}</div>
// <div v-else-if="pending">加载中…</div>
// <div v-else>{{ data }}</div>

// 手动抛出错误
try {
  await $fetch('/api/submit', { method: 'POST', body: formData })
} catch (err) {
  // 处理请求错误
  console.error(err)
}

// showLoadingError 自动处理
const { data, error } = await useFetch('/api/data', {
  onRequestError({ error }) {
    console.error('请求错误：', error)
  },
  onResponseError({ response }) {
    console.error('响应错误：', response.status)
  },
})`,F=u({__name:"N19ErrorHandling",setup(N){const o=g("error-page"),p=[{type:"404",desc:"页面不存在",handler:"error.vue + 中间件"},{type:"500",desc:"服务端渲染错误",handler:"error.vue + app:error hook"},{type:"API Error",desc:"接口请求错误",handler:"useFetch error + $fetch try/catch"},{type:"Hydration Mismatch",desc:"SSR/CSR 不一致",handler:"修复不一致或用 ClientOnly"},{type:"Vue Runtime Error",desc:"组件运行时错误",handler:"vue:error hook + ErrorBoundary"}];return(P,e)=>(a(),n("div",y,[e[6]||(e[6]=r("h3",null,"错误处理",-1)),r("div",f,[r("button",{class:l({active:o.value==="error-page"}),onClick:e[0]||(e[0]=t=>o.value="error-page")},"错误页面",2),r("button",{class:l({active:o.value==="on-error"}),onClick:e[1]||(e[1]=t=>o.value="on-error")},"错误钩子",2),r("button",{class:l({active:o.value==="api-error"}),onClick:e[2]||(e[2]=t=>o.value="api-error")},"API 错误",2)]),r("div",m,[r("div",x,[o.value==="error-page"?(a(),n("pre",E,s(S))):d("",!0),o.value==="on-error"?(a(),n("pre",b,s(w))):d("",!0),o.value==="api-error"?(a(),n("pre",k,s(A))):d("",!0)]),r("div",_,[e[4]||(e[4]=r("h4",null,"错误类型速查",-1)),r("table",C,[e[3]||(e[3]=r("thead",null,[r("tr",null,[r("th",null,"类型"),r("th",null,"说明"),r("th",null,"处理方式")])],-1)),r("tbody",null,[(a(),n(c,null,v(p,t=>r("tr",{key:t.type},[r("td",null,[r("code",null,s(t.type),1)]),r("td",null,s(t.desc),1),r("td",null,s(t.handler),1)])),64))])]),e[5]||(e[5]=r("div",{style:{"margin-top":"10px",padding:"10px",background:"#fff8f0","border-radius":"6px","font-size":"13px"}},[i(" 💡 "),r("code",null,"clearError()"),i(" 可清除错误状态并导航；"),r("code",null,"createError()"),i(" 可主动触发错误。SSR 中的错误会通过 payload 传递到客户端。 ")],-1))])])]))}}),M=h(F,[["__scopeId","data-v-01d8ee9b"]]);export{M as default};
