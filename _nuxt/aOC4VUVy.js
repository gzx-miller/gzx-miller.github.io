import{I as c,b as d,e as t,M as o,f as r,r as u,g as p,o as m}from"./DutfXOOr.js";const v={class:"demo-card"},f={class:"mode-row"},g={class:"panels"},b={class:"label"},S='{ "title": "Vue3 组合式 API", "teacher": "李老师", "duration": 45, "tags": ["Vue3", "Composition API", "前端"] }',O=`import { z } from 'zod'
import { ChatOpenAI } from '@langchain/openai'

const courseSchema = z.object({
  title:    z.string().describe('课程名称'),
  teacher:  z.string().describe('讲师姓名'),
  duration: z.number().describe('时长（分钟）'),
  tags:     z.array(z.string()).describe('标签列表'),
})

const llm = new ChatOpenAI({ model: 'gpt-4o-mini' })

// JSON 模式：withStructuredOutput 内部选 JSON mode
const structuredLlm = llm.withStructuredOutput(courseSchema)
const result = await structuredLlm.invoke('提取课程信息')

// Function Calling 模式：显式指定 method
const fnLlm = llm.withStructuredOutput(courseSchema, { method: 'functionCalling' })
const fnResult = await fnLlm.invoke('提取课程信息')`,C={__name:"L15StructuredOutput",setup(w){const s=u("json"),a={title:"Vue3 组合式 API",teacher:"李老师",duration:45,tags:["Vue3","Composition API","前端"]},n=u(!1),i=p(()=>n.value?"❌ Zod 校验失败：duration 必须为 number，tags 必须为 string[]":s.value==="json"?JSON.stringify(a,null,2):`Function: extract_course
Args: ${JSON.stringify(a)}`);return(h,e)=>(m(),d("div",v,[e[6]||(e[6]=t("h3",null,"结构化输出与 Zod",-1)),t("div",f,[t("button",{class:o({active:s.value==="json"}),onClick:e[0]||(e[0]=l=>s.value="json")},"JSON Mode",2),t("button",{class:o({active:s.value==="fn"}),onClick:e[1]||(e[1]=l=>s.value="fn")},"Function Calling",2),t("button",{class:o(["err-btn",{active:n.value}]),onClick:e[2]||(e[2]=l=>n.value=!n.value)},"模拟校验失败",2)]),t("div",g,[t("div",{class:"panel raw-panel"},[e[3]||(e[3]=t("span",{class:"label"},"LLM 原始文本",-1)),t("pre",null,r(S))]),e[4]||(e[4]=t("div",{class:"arrow"},"→",-1)),t("div",{class:o(["panel result-panel",{error:n.value}])},[t("span",b,r(n.value?"Zod 校验结果":s.value==="json"?"JSON Mode 解析结果":"Function Calling 解析结果"),1),t("pre",null,r(i.value),1)],2)]),t("div",{class:"code-section"},[e[5]||(e[5]=t("h4",null,"Zod Schema + withStructuredOutput",-1)),t("pre",{class:"code-block"},r(O))])]))}},k=c(C,[["__scopeId","data-v-ebdb2dfd"]]);export{k as default};
