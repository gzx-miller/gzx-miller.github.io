import{d as c,b as l,e,F as i,E as p,f as r,A as m,r as v,g as _,o as u,M as S,I as g}from"./DutfXOOr.js";const b={class:"demo-card"},f={class:"parser-tabs"},z=["onClick"],P={class:"parser-columns"},h={class:"parser-col"},V={class:"parsed-output"},L={key:0,class:"zod-schema"},o=`以下是推荐的三门课程：

1. Vue3 组合式 API 实战 - 适合有 Vue2 基础的开发者
2. TypeScript 类型体操 - 深入理解高级类型
3. 前端工程化实践 - 构建到部署全流程`,O=`z.array(z.object({
  name: z.string().describe("课程名称"),
  level: z.enum(["初级","中级","高级"]),
  audience: z.string().describe("适合人群"),
}))`,C=c({__name:"L03OutputParser",setup(I){const a=v("structured"),d={string:{label:"StringOutputParser",data:o},list:{label:"Zod array 解析",data:["Vue3 组合式 API 实战","TypeScript 类型体操","前端工程化实践"]},structured:{label:"StructuredOutputParser (Zod)",data:[{name:"Vue3 组合式 API 实战",level:"中级",audience:"有 Vue2 基础"},{name:"TypeScript 类型体操",level:"高级",audience:"有 TS 基础"},{name:"前端工程化实践",level:"中级",audience:"前端开发者"}]}},n=_(()=>d[a.value]);return(Z,s)=>(u(),l("div",b,[s[3]||(s[3]=e("h3",null,"输出解析器",-1)),e("div",f,[(u(),l(i,null,p(["string","list","structured"],t=>e("button",{key:t,class:S({active:a.value===t}),onClick:y=>a.value=t},r(t==="string"?"String":t==="list"?"List (Zod)":"Structured (Zod)"),11,z)),64))]),e("div",P,[e("div",{class:"parser-col"},[s[0]||(s[0]=e("h4",null,"LLM 原始输出",-1)),e("pre",{class:"raw-output"},r(o))]),s[1]||(s[1]=e("div",{class:"parser-arrow"},"→",-1)),e("div",h,[e("h4",null,r(n.value.label)+" 解析结果",1),e("pre",V,r(JSON.stringify(n.value.data,null,2)),1)])]),a.value==="structured"?(u(),l("div",L,[s[2]||(s[2]=e("h4",null,"对应 Zod Schema",-1)),e("pre",null,r(O))])):m("",!0)]))}}),T=g(C,[["__scopeId","data-v-6d685545"]]);export{T as default};
