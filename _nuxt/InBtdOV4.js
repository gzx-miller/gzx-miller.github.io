import{d as p,b as c,e,F as v,E as h,f as n,K as _,L as f,aG as y,A as k,r as i,o as u,M as C,I as g}from"./DutfXOOr.js";const b={class:"demo-card"},x={class:"tool-list"},T=["onClick"],$={class:"tool-detail"},z={class:"tool-info"},L={class:"tool-schema"},w={class:"tool-call"},I=["placeholder"],j={key:0,class:"tool-result"},q=`// LangChain.js 推荐使用 tool 函数定义工具
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

const searchTool = tool(async ({ query }) => {
  // 实际调用搜索 API
  return searchResults
}, {
  name: 'search',
  description: '搜索互联网获取最新信息',
  schema: z.object({
    query: z.string().describe('搜索关键词'),
  }),
})`,B=p({__name:"L09Tools",setup(E){const d=[{name:"search",description:"搜索互联网获取最新信息",schema:{query:"string - 搜索关键词"},mockCall:o=>`搜索结果：找到 3 条关于"${o}"的相关信息。1. 官方文档说明... 2. 社区讨论... 3. 最佳实践...`},{name:"calculator",description:"执行数学计算",schema:{expression:"string - 数学表达式"},mockCall:o=>{if(!/^[\d\s+\-*/().]+$/.test(o))return"计算错误：仅支持数字和基本运算符 + - * / ( )";try{const t=new Function("return "+o)();return`计算结果：${o} = ${t}`}catch{return"计算错误：请输入有效的数学表达式"}}},{name:"weather",description:"查询指定城市的天气信息",schema:{city:"string - 城市名称"},mockCall:o=>`${o}今天：晴，温度 22°C，湿度 45%，微风`}],l=i(d[0]),a=i(""),r=i("");function m(){a.value.trim()&&(r.value=l.value.mockCall(a.value))}return(o,s)=>(u(),c("div",b,[s[4]||(s[4]=e("h3",null,"工具调用模拟",-1)),e("div",x,[(u(),c(v,null,h(d,t=>e("button",{key:t.name,class:C(["tool-btn",{active:l.value.name===t.name}]),onClick:F=>{l.value=t,r.value=""}},n(t.name),11,T)),64))]),e("div",$,[e("div",z,[e("h4",null,n(l.value.name),1),e("p",null,n(l.value.description),1),e("div",L,[s[1]||(s[1]=e("strong",null,"参数 Schema:",-1)),e("pre",null,n(JSON.stringify(l.value.schema,null,2)),1)])]),e("div",w,[_(e("input",{"onUpdate:modelValue":s[0]||(s[0]=t=>a.value=t),placeholder:Object.keys(l.value.schema)[0],onKeyup:y(m,["enter"])},null,40,I),[[f,a.value]]),e("button",{onClick:m},"调用"),r.value?(u(),c("div",j,[s[2]||(s[2]=e("small",null,"输出",-1)),e("p",null,n(r.value),1)])):k("",!0)])]),e("div",{class:"code-example"},[s[3]||(s[3]=e("h4",null,"tool 函数定义方式",-1)),e("pre",null,n(q))])]))}}),N=g(B,[["__scopeId","data-v-be1c6b99"]]);export{N as default};
