import{d as f,b as n,e,M as r,K as m,L as g,v as l,f as a,F as x,E as y,A as p,r as c,g as b,o as d,I as k}from"./DutfXOOr.js";const _={class:"demo-card"},S={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},C={style:{display:"flex",gap:"16px"}},H={style:{flex:"1"}},N={class:"form-group"},V={class:"form-group"},E={class:"head-preview"},O={style:{flex:"1"}},h={key:0,class:"code-block"},M={key:1,class:"code-block"},w={key:2,class:"code-block"},T=`// 组合式 API 方式
useHead({
  title: '课程详情 - 小松鼠举栗子',
  meta: [
    { name: 'description', content: '课程描述' },
    { property: 'og:title', content: '课程详情' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ],
  style: [{ children: 'body { margin: 0 }' }],
  script: [
    { src: 'https://cdn.example.com/analytics.js', defer: true }
  ],
})`,$=`// 响应式 SEO（标题随状态变化）
const course = ref({ name: 'Nuxt 实战', desc: '学习 Nuxt 全栈' })

useHead(computed(() => ({
  title: course.value.name,
  meta: [
    { name: 'description', content: course.value.desc },
  ],
})))

// nuxt.config.ts 全局 SEO
export default defineNuxtConfig({
  app: {
    head: {
      title: '小松鼠举栗子',
      meta: [
        { name: 'description', content: '中文前端知识内容库' },
        { name: 'keywords', content: 'Vue3, Nuxt, 前端' },
      ],
    },
  },
})`,D=`<!-- 使用 useSeoMeta 简化 OG 标签 -->
useSeoMeta({
  title: '课程详情',
  ogTitle: '课程详情 - 小松鼠举栗子',
  description: '学习 Vue3 核心知识',
  ogDescription: '学习 Vue3 核心知识',
  ogImage: 'https://example.com/cover.jpg',
  ogUrl: 'https://example.com/course/1',
  twitterCard: 'summary_large_image',
})`,I=f({__name:"N14SEO",setup(U){const s=c("useHead"),i=c("课程详情"),u=c("Vue3 入门到精通在线课程"),v=b(()=>({title:`${i.value} - 小松鼠举栗子`,meta:[{name:"description",content:u.value},{property:"og:title",content:i.value},{property:"og:description",content:u.value}]}));return(B,t)=>(d(),n("div",_,[t[9]||(t[9]=e("h3",null,"SEO 与 useHead",-1)),e("div",S,[e("button",{class:r({active:s.value==="useHead"}),onClick:t[0]||(t[0]=o=>s.value="useHead")},"useHead",2),e("button",{class:r({active:s.value==="seo"}),onClick:t[1]||(t[1]=o=>s.value="seo")},"响应式 SEO",2),e("button",{class:r({active:s.value==="og"}),onClick:t[2]||(t[2]=o=>s.value="og")},"useSeoMeta",2)]),e("div",C,[e("div",H,[t[8]||(t[8]=e("h4",null,"实时预览 head 配置",-1)),e("div",N,[t[5]||(t[5]=e("label",null,"页面标题：",-1)),m(e("input",{"onUpdate:modelValue":t[3]||(t[3]=o=>i.value=o),style:{width:"100%"}},null,512),[[g,i.value]])]),e("div",V,[t[6]||(t[6]=e("label",null,"页面描述：",-1)),m(e("input",{"onUpdate:modelValue":t[4]||(t[4]=o=>u.value=o),style:{width:"100%"}},null,512),[[g,u.value]])]),e("div",E,[e("p",null,[t[7]||(t[7]=e("strong",null,"<title>",-1)),l(" "+a(v.value.title),1)]),(d(!0),n(x,null,y(v.value.meta,o=>(d(),n("p",{key:o.property||o.name},[e("code",null,a(o.property?`property="${o.property}"`:`name="${o.name}"`),1),l(' content="'+a(o.content)+'" ',1)]))),128))])]),e("div",O,[s.value==="useHead"?(d(),n("pre",h,a(T))):p("",!0),s.value==="seo"?(d(),n("pre",M,a($))):p("",!0),s.value==="og"?(d(),n("pre",w,a(D))):p("",!0)])]),t[10]||(t[10]=e("div",{style:{"margin-top":"10px",padding:"10px",background:"#fff8f0","border-radius":"6px","font-size":"13px"}},[l(" 💡 Nuxt 的 "),e("code",null,"useHead"),l(" 基于 Unhead 实现，支持响应式值（computed/ref）。SSR 时自动将 head 标签注入 HTML，CSR 时动态更新 DOM。全局默认在 "),e("code",null,"nuxt.config.ts"),l(" 的 "),e("code",null,"app.head"),l(" 配置。 ")],-1))]))}}),R=k(I,[["__scopeId","data-v-221dbdca"]]);export{R as default};
