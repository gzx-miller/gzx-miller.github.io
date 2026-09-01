import{s as x}from"./CLeGk598.js";import{d as S,r as u,b as a,e,M as m,F as g,E as f,f as s,A as v,o as i,z as C,I as q}from"./DutfXOOr.js";const z={class:"demo-card"},O={class:"tabs"},F={key:0,class:"tab-content"},I={class:"tech-layout"},E={class:"tech-sidebar"},L={class:"tech-list"},N=["onClick"],M={class:"tech-icon"},R={class:"tech-name"},$={class:"tech-main"},j={class:"tech-header"},J={class:"tech-desc"},A={class:"prompt-section"},B={class:"prompt-template"},V={class:"prompt-section"},D={class:"prompt-example"},G=["disabled"],H={key:0,class:"output-section"},Z={class:"output-box"},K={style:{"white-space":"pre-wrap"}},Q={key:1,class:"tab-content"},U={key:0,class:"comparison-grid"},W={class:"comparison-card-header"},X={class:"comparison-tech"},Y={class:"score-bar"},ee={class:"comparison-result"},te={key:1,class:"empty-comparison"},ne={key:2,class:"tab-content"},se={key:3,class:"tab-content"},oe={class:"knowledge-grid"},ae={style:{"white-space":"pre-wrap"}},ie=`// LangChain.js 提示词工程实践
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o', temperature: 0.7 })

// 1. 基础提示模板
const basicPrompt = ChatPromptTemplate.fromTemplate('请写一段关于{topic}的介绍。')
const basicChain = basicPrompt.pipe(model)
const basicResult = await basicChain.invoke({ topic: '秋日森林' })

// 2. 角色设定
const rolePrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一位资深的{role}，请以专业的角度回答问题。'],
  ['human', '{question}']
])
const roleChain = rolePrompt.pipe(model)
const roleResult = await roleChain.invoke({
  role: '自然摄影师',
  question: '秋日森林怎么拍才好看？'
})

// 3. 少样本提示
const examples = [
  { input: '春天', output: '万物复苏，春暖花开，一片生机勃勃的景象。' },
  { input: '夏天', output: '绿树成荫，蝉鸣阵阵，充满热情与活力。' }
]
const examplePrompt = ChatPromptTemplate.fromMessages([
  ['human', '{input}'],
  ['ai', '{output}']
])
const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examples,
  examplePrompt,
  prefix: '请用诗意的语言描述季节：',
  suffix: ['human', '{input}'],
  inputVariables: ['input']
})
const fewShotChain = fewShotPrompt.pipe(model)

// 4. 结构化输出
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    bestTime: z.string().describe('最佳观赏时间'),
    attractions: z.array(z.string()).describe('推荐景点'),
    tips: z.array(z.string()).describe('旅游建议')
  })
)
const structuredPrompt = ChatPromptTemplate.fromTemplate(
  '请提供关于{topic}的旅游信息。\\n{format_instructions}'
)
const structuredChain = structuredPrompt.pipe(model).pipe(parser)
const structuredResult = await structuredChain.invoke({
  topic: '秋日森林',
  format_instructions: parser.getFormatInstructions()
})`,le=S({__name:"L22PromptEngineering",setup(re){const h=u([{id:"basic",name:"基础提示",icon:"📝",description:"最简单直接的提问方式，只说明需求",template:"请写一段关于{主题}的介绍。",example:"请写一段关于秋日森林的介绍。",output:"秋日森林是一年中最美丽的季节之一。树叶变成金黄色、橙色和红色，构成了一幅绚丽的画卷。许多游客会在这个季节前往森林欣赏美景。森林里的动物也在为冬天做准备。"},{id:"role",name:"角色设定",icon:"🎭",description:"为模型设定专业角色，提升回答的专业性",template:"你是一位{角色}。请以专业的角度回答关于{主题}的问题。",example:"你是一位资深的自然摄影师。请以专业的角度介绍秋日森林的拍摄技巧。",output:`作为一名有20年经验的自然摄影师，我来分享秋日森林的拍摄心得：

**最佳光线时段**：黄金时段（日出后和日落前1小时）的侧光能最好地展现树叶的通透感和层次感。

**构图技巧**：利用引导线（如林间小径）引导视线；尝试前景虚化增加纵深感；寻找色彩对比（红枫与青松）。

**器材建议**：使用偏振镜消除树叶反光，增加色彩饱和度；三脚架保证慢门拍摄水流的丝滑效果。`},{id:"fewshot",name:"少样本学习",icon:"📚",description:"提供几个示例，让模型学习输出格式和风格",template:`以下是几个示例：
示例1：{示例1}
示例2：{示例2}
请按照相同格式回答：{输入}`,example:`以下是几个森林相关的诗句：
示例1："停车坐爱枫林晚，霜叶红于二月花。" —— 杜牧
示例2："空山新雨后，天气晚来秋。" —— 王维
请再写一句类似风格的秋日森林诗句。`,output:`"层林尽染秋意浓，落叶飘零满径红。山静似太古，日长如小年。"

这句诗描绘了秋日森林的绚烂色彩和宁静氛围，与前面两句的意境相呼应。`},{id:"cot",name:"思维链",icon:"🧠",description:"引导模型逐步推理，展示思考过程",template:`请一步步思考并解决这个问题：{问题}

第一步：分析问题
第二步：列出关键因素
第三步：给出结论`,example:`请一步步思考：为什么秋日森林的树叶会变色？

第一步：分析问题
第二步：列出关键因素
第三步：给出结论`,output:`**第一步：分析问题**
树叶变色是秋季的典型自然现象，涉及植物生理学和化学变化。需要从色素变化的角度来解释。

**第二步：列出关键因素**
1. 叶绿素：叶片中的主要色素，呈绿色，负责光合作用
2. 类胡萝卜素：黄色和橙色色素，平时被叶绿素掩盖
3. 花青素：红色和紫色色素，秋季糖分积累时合成
4. 环境因素：气温下降、日照时间缩短

**第三步：给出结论**
树叶变色的原因是：秋季气温降低、日照减少，树木停止生产叶绿素，绿色逐渐褪去。原本被掩盖的类胡萝卜素（黄橙色）显现出来，同时部分树种因糖分积累合成花青素（红色），形成五彩斑斓的秋色。`},{id:"structured",name:"结构化输出",icon:"📋",description:"指定输出格式，如 JSON、表格等结构化数据",template:"请以JSON格式输出关于{主题}的信息，包含以下字段：{字段列表}",example:"请以JSON格式输出关于秋日森林的旅游信息，包含以下字段：最佳观赏时间、推荐景点、必备物品、注意事项。",output:`\`\`\`json
{
  "最佳观赏时间": "10月中旬至11月上旬",
  "推荐景点": [
    "枫叶大道",
    "国家森林公园",
    "高山湖泊风景区",
    "红枫谷"
  ],
  "必备物品": [
    "防风保暖外套",
    "防滑徒步鞋",
    "相机及备用电池",
    "保温杯",
    "应急药品"
  ],
  "注意事项": [
    "早晚温差大，注意添减衣物",
    "秋季干燥，注意森林防火",
    "部分山区可能有雾，注意安全",
    "建议提前预订住宿"
  ]
}
\`\`\``}]),r=u(h.value[0]),p=u(!1),d=u(""),l=u("techniques"),_=u([]),k={basic:{result:"秋日森林很美，有很多树，叶子变黄了。",score:65},role:{result:"从植物学角度来看，秋日森林的叶色变化是温带落叶林的典型特征，主要由叶绿素分解和类胡萝卜素、花青素的显现所导致...",score:82},fewshot:{result:"秋天的森林像一幅被打翻的调色盘，金黄的银杏、火红的枫叶、深绿的松柏交织在一起。漫步其中，脚下是沙沙作响的落叶地毯...",score:88},cot:{result:`要了解秋日森林的魅力，我们可以从以下几个维度来分析：
1. 视觉层面：色彩丰富度、层次感...
2. 听觉层面：落叶声、鸟鸣...
3. 嗅觉层面：松针、泥土、果实...

综上，秋日森林通过多感官的沉浸体验...`,score:90},structured:{result:'```json\n{\n  "景观特色": "层林尽染，五彩斑斓",\n  "生态价值": "碳汇、生物多样性",\n  "旅游经济": "带动周边产业发展"\n}\n```',score:85}},w=[{title:"什么是提示词工程",content:"提示词工程（Prompt Engineering）是一门设计和优化提示词的艺术与科学，旨在让大语言模型更好地理解和执行任务，产出更高质量、更符合预期的结果。"},{title:"核心原则",content:`1. 明确具体：避免模糊不清的表述
2. 提供上下文：给出必要的背景信息
3. 设定角色：让模型以特定身份回答
4. 示例引导：用示例说明期望的输出
5. 分步思考：引导模型逐步推理`},{title:"常用技巧",content:`• 角色设定（Role Prompting）
• 少样本学习（Few-shot Learning）
• 思维链（Chain of Thought）
• 结构化输出（Structured Output）
• 自我一致性（Self-Consistency）
• 思维树（Tree of Thoughts）`},{title:"LangChain 支持",content:`• ChatPromptTemplate：消息模板
• FewShotPromptTemplate：少样本模板
• 输出解析器：JSON、列表、日期等
• 提示词序列化：加载/保存模板
• Hub 集成：分享和复用提示词`}];function P(o){r.value=o,d.value=""}async function y(){if(p.value)return;p.value=!0,d.value="",await new Promise(c=>setTimeout(c,800));const o=r.value.output;let t=0;const n=x(()=>{t<o.length?(d.value+=o[t],t++):(clearInterval(n),p.value=!1)},15)}async function T(){_.value=[];for(let o=0;o<h.value.length;o++){const t=h.value[o],n=k[t.id]||{result:"...",score:0};await new Promise(c=>setTimeout(c,400)),_.value.push({id:o+1,technique:t.name,prompt:t.example,result:n.result,score:n.score})}}const b=o=>o>=85?"#6b9e78":o>=70?"#e6a23c":"#c8703c";return(o,t)=>(i(),a("div",z,[t[10]||(t[10]=e("h3",null,"提示词工程最佳实践",-1)),t[11]||(t[11]=e("p",{class:"subtitle"},"掌握高质量提示词的设计技巧与方法",-1)),e("div",O,[e("button",{class:m({active:l.value==="techniques"}),onClick:t[0]||(t[0]=n=>l.value="techniques")},"技巧演示",2),e("button",{class:m({active:l.value==="comparison"}),onClick:t[1]||(t[1]=n=>l.value="comparison")},"效果对比",2),e("button",{class:m({active:l.value==="code"}),onClick:t[2]||(t[2]=n=>l.value="code")},"代码示例",2),e("button",{class:m({active:l.value==="knowledge"}),onClick:t[3]||(t[3]=n=>l.value="knowledge")},"知识点",2)]),l.value==="techniques"?(i(),a("div",F,[e("div",I,[e("div",E,[t[4]||(t[4]=e("h4",null,"提示词技巧",-1)),e("div",L,[(i(!0),a(g,null,f(h.value,n=>(i(),a("div",{key:n.id,class:m(["tech-item",{active:r.value.id===n.id}]),onClick:c=>P(n)},[e("span",M,s(n.icon),1),e("span",R,s(n.name),1)],10,N))),128))])]),e("div",$,[e("div",j,[e("h4",null,s(r.value.icon)+" "+s(r.value.name),1),e("p",J,s(r.value.description),1)]),e("div",A,[t[5]||(t[5]=e("label",null,"提示词模板",-1)),e("div",B,[e("pre",null,s(r.value.template),1)])]),e("div",V,[t[6]||(t[6]=e("label",null,"示例输入",-1)),e("div",D,[e("pre",null,s(r.value.example),1)])]),e("button",{class:"generate-btn",disabled:p.value,onClick:y},s(p.value?"生成中...":"运行示例"),9,G),d.value?(i(),a("div",H,[t[7]||(t[7]=e("label",null,"生成结果",-1)),e("div",Z,[e("pre",K,s(d.value),1)])])):v("",!0)])])])):v("",!0),l.value==="comparison"?(i(),a("div",Q,[e("div",{class:"comparison-header"},[t[8]||(t[8]=e("p",null,"对比不同提示词技巧的输出效果",-1)),e("button",{class:"compare-btn",onClick:T},"运行对比测试")]),_.value.length>0?(i(),a("div",U,[(i(!0),a(g,null,f(_.value,n=>(i(),a("div",{key:n.id,class:"comparison-card"},[e("div",W,[e("span",X,s(n.technique),1),e("span",{class:"comparison-score",style:C({color:b(n.score)})},s(n.score)+" 分 ",5)]),e("div",Y,[e("div",{class:"score-fill",style:C({width:n.score+"%",backgroundColor:b(n.score)})},null,4)]),e("div",ee,[e("p",null,s(n.result),1)])]))),128))])):(i(),a("div",te,[...t[9]||(t[9]=[e("p",{class:"empty-icon"},"📊",-1),e("p",null,"点击上方按钮运行对比测试",-1)])]))])):v("",!0),l.value==="code"?(i(),a("div",ne,[e("div",{class:"code-example"},[e("pre",null,s(ie))])])):v("",!0),l.value==="knowledge"?(i(),a("div",se,[e("div",oe,[(i(),a(g,null,f(w,(n,c)=>e("div",{key:c,class:"knowledge-card"},[e("h5",null,s(n.title),1),e("p",ae,s(n.content),1)])),64))])])):v("",!0)]))}}),pe=q(le,[["__scopeId","data-v-08c217c7"]]);export{pe as default};
