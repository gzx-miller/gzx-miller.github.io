import{d as h,b as r,e,F as d,E as m,f as a,g,o as c,M as v,z as C,r as _,I as x}from"./DutfXOOr.js";const k={class:"demo-card"},z={class:"case-tabs"},L=["onClick"],y={class:"eval-layout"},q={class:"qa-panel"},w={class:"question-box"},P={class:"answer-box"},E={class:"eval-panel"},F={class:"criteria-header"},I={class:"criteria-desc"},M={class:"score-row"},O={class:"auto-score"},B={class:"user-score"},V={class:"score-buttons"},A=["onClick"],J=`// LLM-as-Judge 评估模式
import { ChatOpenAI } from '@langchain/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'

const evaluator = ChatOpenAI({ modelName: 'gpt-4o-mini' })

const evalSchema = z.object({
  relevance: z.number().min(0).max(1),
  accuracy: z.number().min(0).max(1),
  completeness: z.number().min(0).max(1),
  reasoning: z.string(),
})

const parser = StructuredOutputParser.fromZodSchema(evalSchema)

// 评估提示词
const evalPrompt = \`评估以下回答的质量：
问题：{question}
回答：{answer}

请从相关性、准确性和完整性三个维度打分。
{format_instructions}\``,N=h({__name:"L14Evaluation",setup($){const p=[{question:"Vue3 的 ref 和 reactive 有什么区别？",answer:"ref 适合基本类型，需要 .value 访问；reactive 适合对象类型，可直接访问属性。ref 在模板中自动解包，reactive 不能替换整个对象。",criteria:[{name:"相关性",description:"回答是否与问题直接相关",autoScore:.95},{name:"准确性",description:"技术描述是否正确",autoScore:.9},{name:"完整性",description:"是否覆盖关键要点",autoScore:.75}]},{question:"如何用 Pinia 替换 Vuex？",answer:"Pinia 去除了 mutations，直接在 actions 中修改状态。每个 Store 独立定义，不需要嵌套模块。",criteria:[{name:"相关性",description:"回答是否与问题直接相关",autoScore:.9},{name:"准确性",description:"技术描述是否正确",autoScore:.85},{name:"完整性",description:"是否覆盖关键要点",autoScore:.55}]}],l=_(0),i=g(()=>p[l.value]),u=_({});function b(n,s){u.value[n]=s}function f(n){return n>=.8?"#6b9e78":n>=.6?"#d4a574":"#c8503c"}return(n,s)=>(c(),r("div",k,[s[6]||(s[6]=e("h3",null,"输出质量评估",-1)),e("div",z,[(c(),r(d,null,m(p,(t,o)=>e("button",{key:o,class:v({active:l.value===o}),onClick:S=>{l.value=o,u.value={}}}," 内容 "+a(o+1),11,L)),64))]),e("div",y,[e("div",q,[e("div",w,[s[0]||(s[0]=e("span",{class:"label"},"问题",-1)),e("p",null,a(i.value.question),1)]),e("div",P,[s[1]||(s[1]=e("span",{class:"label"},"LLM 回答",-1)),e("p",null,a(i.value.answer),1)])]),e("div",E,[s[4]||(s[4]=e("h4",null,"评估维度",-1)),(c(!0),r(d,null,m(i.value.criteria,t=>(c(),r("div",{key:t.name,class:"criteria-item"},[e("div",F,[e("strong",null,a(t.name),1),e("span",I,a(t.description),1)]),e("div",M,[e("div",O,[s[2]||(s[2]=e("span",{class:"score-label"},"自动评分",-1)),e("span",{class:"score-value",style:C({color:f(t.autoScore)})},a((t.autoScore*100).toFixed(0))+"%",5)]),e("div",B,[s[3]||(s[3]=e("span",{class:"score-label"},"人工评分",-1)),e("div",V,[(c(),r(d,null,m([.2,.4,.6,.8,1],o=>e("button",{key:o,class:v(["score-btn",{selected:u.value[t.name]===o}]),onClick:S=>b(t.name,o)},a((o*100).toFixed(0)),11,A)),64))])])])]))),128))])]),e("div",{class:"code-section"},[s[5]||(s[5]=e("h4",null,"LLM-as-Judge 评估代码",-1)),e("pre",{class:"code-block"},a(J))])]))}}),D=x(N,[["__scopeId","data-v-8719bc69"]]);export{D as default};
