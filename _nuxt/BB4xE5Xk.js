import{d as r,b as u,e,F as d,E as a,f as s,r as x,o as i,M as h,I as k}from"./DutfXOOr.js";const g={class:"demo-card"},_={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},f=["onClick"],m={style:{display:"flex",gap:"16px"}},v={style:{flex:"1"}},A={class:"code-block"},y={style:{flex:"1"}},b={class:"desc-box"},N={style:{width:"100%"}},P=r({__name:"N12Plugins",setup(E){const n=x("auto"),l={auto:{title:"自动注册插件",code:`// plugins/element-plus.ts
import ElementPlus from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus)
})`,desc:"plugins/ 目录下的文件自动注册，按文件名字母序执行。无需在 nuxt.config.ts 中配置。"},client:{title:"仅客户端插件",code:`// plugins/chart.client.ts
import * as echarts from 'echarts'

export default defineNuxtPlugin((nuxtApp) => {
  // 仅在浏览器环境执行
  nuxtApp.provide('echarts', echarts)
})`,desc:"文件名加 .client 后缀，该插件只在客户端加载和执行，避免 SSR 环境报错。"},custom:{title:"插件注入 provide/inject",code:`// plugins/i18n.ts
export default defineNuxtPlugin((nuxtApp) => {
  const messages = {
    zh: { hello: '你好' },
    en: { hello: 'Hello' },
  }
  
  // 注入全局属性
  nuxtApp.provide('i18n', (key: string, lang = 'zh') => 
    messages[lang]?.[key] ?? key
  )
})

// 组件中使用
const { $i18n } = useNuxtApp()
console.log($i18n('hello')) // 你好`,desc:"通过 nuxtApp.provide 注入的功能，在组件中通过 useNuxtApp().$xxx 访问。"}},c=[{hook:'nuxtApp.hook("vue:setup")',desc:"组件 setup 时"},{hook:'nuxtApp.hook("vue:error")',desc:"Vue 错误时"},{hook:'nuxtApp.hook("app:created")',desc:"应用创建后"},{hook:'nuxtApp.hook("app:beforeMount")',desc:"挂载前"},{hook:'nuxtApp.hook("app:mounted")',desc:"挂载后"},{hook:'nuxtApp.hook("app:error")',desc:"应用级错误"},{hook:'nuxtApp.hook("page:start")',desc:"页面导航开始"},{hook:'nuxtApp.hook("page:finish")',desc:"页面导航完成"}];return(C,t)=>(i(),u("div",g,[t[1]||(t[1]=e("h3",null,"插件系统",-1)),e("div",_,[(i(),u(d,null,a(l,(o,p)=>e("button",{key:p,class:h({active:n.value===p}),onClick:H=>n.value=p},s(o.title),11,f)),64))]),e("div",m,[e("div",v,[e("pre",A,s(l[n.value].code),1)]),e("div",y,[e("div",b,s(l[n.value].desc),1)])]),t[2]||(t[2]=e("h4",{style:{"margin-top":"12px"}},"常用 Nuxt App Hooks",-1)),e("table",N,[t[0]||(t[0]=e("thead",null,[e("tr",null,[e("th",null,"Hook"),e("th",null,"触发时机")])],-1)),e("tbody",null,[(i(),u(d,null,a(c,o=>e("tr",{key:o.hook},[e("td",null,[e("code",null,s(o.hook),1)]),e("td",null,s(o.desc),1)])),64))])])]))}}),z=k(P,[["__scopeId","data-v-82672b22"]]);export{z as default};
