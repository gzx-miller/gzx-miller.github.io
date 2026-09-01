import{d as N,b as n,e,M as m,F as b,E as k,A as p,K as w,L as z,aG as W,f as a,r as _,o,v as I,a2 as O,I as R}from"./DutfXOOr.js";const V={class:"demo-card"},S={class:"tabs"},j={key:0,class:"tab-content"},q={class:"chat-container"},B={class:"chat-messages"},K={key:0,class:"empty-state"},U={class:"suggestions"},G={class:"suggestion-buttons"},H=["onClick"],Q={class:"message-bubble"},J={key:0,class:"msg-content user-msg"},X={key:1,class:"msg-content assistant-msg"},Y={key:0,class:"tool-indicator"},Z={key:2,class:"msg-content tool-msg"},ee={class:"tool-header"},te={class:"tool-title"},se={class:"tool-result"},ne={class:"chat-input-area"},oe=["disabled"],ae={key:1,class:"tab-content"},le={class:"tools-grid"},ie={class:"tool-card-header"},ce={class:"tool-icon"},re={class:"tool-info"},ue={class:"switch"},de=["onUpdate:modelValue"],me={class:"tool-schema"},pe={key:2,class:"tab-content"},he={key:3,class:"tab-content"},ge={class:"knowledge-grid"},ve={style:{"white-space":"pre-wrap"}},_e=`// LangChain.js 函数调用与工具使用
import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents'

// 1. 定义工具
const getWeatherTool = tool(
  async ({ city, unit }) => {
    const weather = await fetchWeatherAPI(city)
    return \`\${city}天气：\${weather.temp}\${unit === 'celsius' ? '°C' : '°F'}\`
  },
  {
    name: 'getWeather',
    description: '获取指定城市的天气信息',
    schema: z.object({
      city: z.string().describe('城市名称'),
      unit: z.enum(['celsius', 'fahrenheit']).describe('温度单位')
    })
  }
)

const searchTool = tool(
  async ({ query }) => {
    const results = await searchAPI(query)
    return results.map(r => r.title + ': ' + r.snippet).join('\\n')
  },
  {
    name: 'searchForestInfo',
    description: '搜索秋日森林相关信息',
    schema: z.object({
      query: z.string().describe('搜索关键词')
    })
  }
)

// 2. 创建 Agent
const tools = [getWeatherTool, searchTool]

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个乐于助人的助手，善于使用工具解决问题。'],
  ['human', '{input}'],
  ['assistant', '{agent_scratchpad}']
])

const model = new ChatOpenAI({ model: 'gpt-4o', temperature: 0 })
const agent = await createOpenAIToolsAgent({ llm: model, tools, prompt })
const agentExecutor = new AgentExecutor({ agent, tools, verbose: true })

// 3. 执行 Agent
const result = await agentExecutor.invoke({
  input: '北京今天天气怎么样？适合去森林玩吗？'
})

console.log(result.output)`,be=N({__name:"L21FunctionCalling",setup(ke){const A=_([{name:"getWeather",description:"获取指定城市的实时天气信息",icon:"🌤️",enabled:!0,schema:`{
  "name": "getWeather",
  "parameters": {
    "city": "城市名称，如北京、上海",
    "unit": "温度单位：celsius/fahrenheit"
  }
}`},{name:"searchForestInfo",description:"搜索秋日森林相关的知识信息",icon:"🌲",enabled:!0,schema:`{
  "name": "searchForestInfo",
  "parameters": {
    "query": "搜索关键词",
    "category": "类别：生态/植物/动物/旅游"
  }
}`},{name:"calculateDistance",description:"计算两个地点之间的距离",icon:"📏",enabled:!0,schema:`{
  "name": "calculateDistance",
  "parameters": {
    "from": "起点城市",
    "to": "终点城市",
    "unit": "单位：km/mile"
  }
}`},{name:"bookHotel",description:"预订指定日期和地点的酒店",icon:"🏨",enabled:!1,schema:`{
  "name": "bookHotel",
  "parameters": {
    "city": "城市名称",
    "checkIn": "入住日期",
    "checkOut": "离店日期",
    "guests": "入住人数"
  }
}`}]),r=_(""),i=_([]),h=_(!1),l=_("chat");let g=0;const y={北京今天天气怎么样:{toolCalls:[{name:"getWeather",args:{city:"北京",unit:"celsius"}}],response:"好的，我来查询一下北京今天的天气。"},秋日森林有什么好玩的:{toolCalls:[{name:"searchForestInfo",args:{query:"秋日森林 旅游",category:"旅游"}}],response:"让我搜索一下秋日森林的旅游信息。"},从上海到杭州有多远:{toolCalls:[{name:"calculateDistance",args:{from:"上海",to:"杭州",unit:"km"}}],response:"我来计算一下上海到杭州的距离。"},default:{toolCalls:[],response:"你好！我可以帮你查询天气、搜索森林信息、计算距离等。有什么我可以帮你的吗？"}},T={getWeather:"北京今日天气：晴转多云，气温 12°C ~ 20°C，西北风 3-4 级。空气质量良好，适合户外活动。早晚温差较大，建议携带外套。",searchForestInfo:`秋日森林旅游推荐：

1. 最佳观赏期：10月中旬至11月上旬
2. 推荐景点：
   - 枫叶大道：绵延800公里的壮丽秋色
   - 国家森林公园：丰富的植被和野生动物
   - 山间湖泊：倒影如画的静谧美景
3. 活动推荐：徒步、摄影、露营、观鸟
4. 注意事项：早晚温差大，注意保暖；穿防滑徒步鞋`,calculateDistance:`上海到杭州的距离约为 175 公里。

交通方式参考：
- 高铁：约 1 小时
- 自驾：约 2.5 小时
- 大巴：约 3 小时`},x=[{title:"什么是函数调用",content:"函数调用（Function Calling）是大语言模型的一种能力，模型可以根据用户意图，判断是否需要调用外部工具/函数来获取信息或执行操作，并生成符合格式的调用参数。"},{title:"工具调用的价值",content:`• 突破模型知识截止日期限制
• 接入实时数据和私有数据
• 执行具体操作（发邮件、订酒店等）
• 接入专业系统和 API
• 构建复杂的多步骤工作流`},{title:"LangChain 工具生态",content:`LangChain 提供了丰富的内置工具：
- 搜索引擎：Tavily、SerpAPI、DuckDuckGo
- 数据库：SQL 数据库、向量数据库
- 文件处理：PDF、Excel、CSV 读取
- 代码执行：Python REPL、Bash
- 第三方 API：天气、地图、电商等`},{title:"Agent 与工具",content:`Agent 是基于函数调用的更高阶抽象：
1. 思考：分析问题，规划步骤
2. 行动：选择并调用合适的工具
3. 观察：获取工具执行结果
4. 循环：根据结果继续思考或给出最终答案`}],P=["北京今天天气怎么样","秋日森林有什么好玩的","从上海到杭州有多远"];function F(u){for(const s of Object.keys(y))if(s!=="default"&&u.includes(s.substring(0,5)))return y[s];return y.default}async function f(){if(!r.value.trim()||h.value)return;const u={id:++g,role:"user",content:r.value};i.value.push(u);const s=r.value;r.value="",h.value=!0,await new Promise(c=>setTimeout(c,800));const t=F(s),d={id:++g,role:"assistant",content:t.response,toolName:t.toolCalls.length>0?t.toolCalls[0].name:void 0};if(i.value.push(d),t.toolCalls.length>0){await new Promise(v=>setTimeout(v,1e3));const c=t.toolCalls[0],$={id:++g,role:"tool",content:`调用工具: ${c.name}`,toolName:c.name,toolResult:JSON.stringify(c.args,null,2)};i.value.push($),await new Promise(v=>setTimeout(v,1200));const C=T[c.name]||"工具执行完成",D={id:++g,role:"tool",content:`工具结果: ${c.name}`,toolName:c.name,toolResult:C};i.value.push(D),await new Promise(v=>setTimeout(v,600));const E={id:++g,role:"assistant",content:C};i.value.push(E)}h.value=!1}function M(u){r.value=u,f()}function L(){i.value=[]}return(u,s)=>(o(),n("div",V,[s[12]||(s[12]=e("h3",null,"函数调用与工具扩展",-1)),s[13]||(s[13]=e("p",{class:"subtitle"},"通过 LangChain Tools 为大模型赋予外部能力",-1)),e("div",S,[e("button",{class:m({active:l.value==="chat"}),onClick:s[0]||(s[0]=t=>l.value="chat")},"对话演示",2),e("button",{class:m({active:l.value==="tools"}),onClick:s[1]||(s[1]=t=>l.value="tools")},"工具列表",2),e("button",{class:m({active:l.value==="code"}),onClick:s[2]||(s[2]=t=>l.value="code")},"代码示例",2),e("button",{class:m({active:l.value==="knowledge"}),onClick:s[3]||(s[3]=t=>l.value="knowledge")},"知识点",2)]),l.value==="chat"?(o(),n("div",j,[e("div",q,[e("div",B,[i.value.length===0?(o(),n("div",K,[s[6]||(s[6]=e("p",{class:"empty-icon"},"🤖",-1)),s[7]||(s[7]=e("p",{class:"empty-text"},"你好！我可以调用各种工具来帮你解决问题。",-1)),e("div",U,[s[5]||(s[5]=e("p",{class:"suggestion-label"},"试试这些问题：",-1)),e("div",G,[(o(),n(b,null,k(P,t=>e("button",{key:t,onClick:d=>M(t)},a(t),9,H)),64))])])])):p("",!0),(o(!0),n(b,null,k(i.value,t=>(o(),n("div",{key:t.id,class:m(["message",t.role])},[e("div",Q,[t.role==="user"?(o(),n("div",J,a(t.content),1)):t.role==="assistant"?(o(),n("div",X,[t.toolName?(o(),n("span",Y,[s[8]||(s[8]=e("span",{class:"tool-dot"},null,-1)),I(" 正在调用 "+a(t.toolName)+"... ",1)])):p("",!0),I(" "+a(t.content),1)])):(o(),n("div",Z,[e("div",ee,[s[9]||(s[9]=e("span",{class:"tool-icon"},"🔧",-1)),e("span",te,a(t.content),1)]),e("pre",se,a(t.toolResult),1)]))])],2))),128))]),e("div",ne,[w(e("input",{"onUpdate:modelValue":s[4]||(s[4]=t=>r.value=t),placeholder:"输入你的问题...",onKeyup:W(f,["enter"])},null,544),[[z,r.value]]),e("button",{disabled:h.value,onClick:f},a(h.value?"处理中...":"发送"),9,oe),e("button",{class:"clear-btn",onClick:L},"清空")])])])):p("",!0),l.value==="tools"?(o(),n("div",ae,[e("div",le,[(o(!0),n(b,null,k(A.value,t=>(o(),n("div",{key:t.name,class:m(["tool-card",{disabled:!t.enabled}])},[e("div",ie,[e("span",ce,a(t.icon),1),e("div",re,[e("h5",null,a(t.name),1),e("p",null,a(t.description),1)]),e("label",ue,[w(e("input",{type:"checkbox","onUpdate:modelValue":d=>t.enabled=d},null,8,de),[[O,t.enabled]]),s[10]||(s[10]=e("span",{class:"slider"},null,-1))])]),e("div",me,[s[11]||(s[11]=e("small",null,"参数定义",-1)),e("pre",null,a(t.schema),1)])],2))),128))])])):p("",!0),l.value==="code"?(o(),n("div",pe,[e("div",{class:"code-example"},[e("pre",null,a(_e))])])):p("",!0),l.value==="knowledge"?(o(),n("div",he,[e("div",ge,[(o(),n(b,null,k(x,(t,d)=>e("div",{key:d,class:"knowledge-card"},[e("h5",null,a(t.title),1),e("p",ve,a(t.content),1)])),64))])])):p("",!0)]))}}),fe=R(be,[["__scopeId","data-v-f4bc1ab6"]]);export{fe as default};
