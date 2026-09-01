import{d as x,b as i,e as t,K as S,L as D,aG as G,f as n,M as h,F as f,E as w,A as u,r as c,o as a,I as L}from"./DutfXOOr.js";import{s as P}from"./CLeGk598.js";const E={class:"demo-card"},T={class:"query-section"},I={class:"btn-group"},M=["disabled"],V=["disabled"],B={class:"tabs"},$={key:0,class:"tab-content"},F={class:"steps-container"},K={class:"step-left"},O={class:"step-badge"},z={class:"step-right"},N={class:"step-title-row"},Q={class:"step-name"},q={class:"step-status-icon"},U={class:"step-desc"},j={key:0,class:"step-detail"},H={key:0,class:"retrieved-section"},J={class:"doc-header"},W={class:"doc-title"},X={class:"doc-score"},Y={class:"doc-snippet"},Z={key:1,class:"answer-section"},ee={class:"answer-box"},te={class:"answer-text",style:{"white-space":"pre-wrap"}},se={key:1,class:"tab-content"},ne={key:2,class:"tab-content"},ie={class:"knowledge-grid"},ae={style:{"white-space":"pre-wrap"}},b=`秋日森林具有以下显著特点：

1. **植被特征**：属于温带落叶阔叶林，主要树种包括橡树、枫树、山毛榉等。秋季时树叶呈现橙红、金黄等丰富色彩，是森林一年中最美的季节。

2. **变色原理**：秋季气温下降和日照减少导致叶绿素分解，类胡萝卜素和花青素显现，形成壮观的秋色景观。

3. **生态价值**：作为重要的碳汇，每年每公顷可吸收约15-20吨二氧化碳，在应对气候变化中发挥关键作用。

4. **经济价值**：秋日森林旅游带动了餐饮、住宿、手工艺品等相关产业发展，创造了大量就业机会。`,oe=`// RAG 完整流水线实现
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from '@langchain/openai'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'

// 1. 文档加载与切分
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50
})
const chunks = await splitter.splitDocuments(documents)

// 2. 构建向量知识库
const vectorStore = await MemoryVectorStore.fromDocuments(
  chunks,
  new OpenAIEmbeddings()
)

// 3. 创建检索器
const retriever = vectorStore.asRetriever({ k: 3 })

// 4. 构建 RAG 链
const combineChain = await createStuffDocumentsChain({
  llm,
  prompt: ragPrompt
})

const ragChain = await createRetrievalChain({
  retriever,
  combineDocsChain: combineChain
})

// 5. 执行查询
const result = await ragChain.invoke({
  input: userQuestion
})`,le=x({__name:"L19RagPipeline",setup(ce){const y=c([{id:1,title:"秋日森林生态系统",content:"秋日森林是温带落叶阔叶林的典型代表，主要树种包括橡树、枫树、山毛榉等。秋季时树叶呈现橙红金黄等丰富色彩，是森林一年中最美的季节。森林中的动物如松鼠、黑熊等会在秋季储存食物以备冬眠。",source:"自然百科全书"},{id:2,title:"枫叶变色原理",content:"枫叶在秋季变红是由于叶绿素分解，露出了类胡萝卜素和花青素。随着气温下降和日照时间减少，树木停止生产叶绿素，原本被掩盖的红色素和黄色素显现出来，形成壮观的秋色。",source:"植物生理学"},{id:3,title:"森林碳汇功能",content:"森林是地球上最重要的碳汇之一，通过光合作用吸收二氧化碳并释放氧气。成熟的秋日森林每年每公顷可吸收约15-20吨二氧化碳，在应对气候变化中发挥着关键作用。",source:"环境科学报告"},{id:4,title:"森林旅游经济",content:"秋日森林旅游已成为重要的生态经济模式。以加拿大枫叶大道为例，每年秋季吸引数百万游客，带动当地餐饮、住宿、手工艺品等相关产业发展，创造大量就业机会。",source:"旅游经济研究"}]),g=c("秋日森林有什么特点？"),l=c("process"),d=c(!1),m=c(""),_=c(!1),o=c([{id:1,name:"查询理解",description:"分析用户问题意图",status:"pending"},{id:2,name:"向量检索",description:"在知识库中匹配相关文档",status:"pending"},{id:3,name:"文档重排",description:"对检索结果进行相关性排序",status:"pending"},{id:4,name:"上下文构建",description:"组装检索到的文档片段",status:"pending"},{id:5,name:"LLM 生成",description:"基于上下文生成回答",status:"pending"}]),v=c([]),C=[{id:1,title:"秋日森林生态系统",snippet:"秋日森林是温带落叶阔叶林的典型代表，主要树种包括橡树、枫树、山毛榉等。秋季时树叶呈现橙红金黄等丰富色彩...",score:.92},{id:2,title:"枫叶变色原理",snippet:"枫叶在秋季变红是由于叶绿素分解，露出了类胡萝卜素和花青素。随着气温下降和日照时间减少...",score:.78},{id:3,title:"森林碳汇功能",snippet:"森林是地球上最重要的碳汇之一，通过光合作用吸收二氧化碳并释放氧气...",score:.65}],R=[{title:"什么是 RAG",content:"RAG (Retrieval-Augmented Generation) 即检索增强生成，是一种结合信息检索与大语言模型的技术框架，通过外部知识库增强模型回答的准确性和时效性。"},{title:"核心流程",content:"用户提问 → 查询向量化 → 向量检索 → 文档重排 → 上下文构建 → LLM 生成回答 → 返回结果"},{title:"主要优势",content:`1. 减少幻觉，提高准确性
2. 支持私有知识库问答
3. 信息可溯源
4. 降低模型微调成本`},{title:"优化方向",content:`• 嵌入模型选择
• 分块策略优化
• 多路召回策略
• 重排序模型
• 提示词工程`}];async function k(){if(d.value||!g.value.trim())return;d.value=!0,_.value=!1,m.value="",v.value=[],o.value.forEach(e=>{e.status="pending",e.detail=""});for(let e=0;e<o.value.length;e++)o.value[e].status="running",await new Promise(p=>setTimeout(p,800)),e===0?o.value[e].detail="检测到问题类型：知识查询，涉及关键词：秋日森林、特点":e===1?(o.value[e].detail=`在 ${y.value.length} 篇文档中检索，找到 3 篇相关文档`,v.value=C):e===2?o.value[e].detail="使用相似度评分排序，Top 1 得分：0.92":e===3&&(o.value[e].detail="已组装 3 段上下文，总字符数：约 600 字"),o.value[e].status="done",await new Promise(p=>setTimeout(p,400));_.value=!0;let r=0;const s=P(()=>{r<b.length?(m.value+=b[r],r++):(clearInterval(s),d.value=!1)},20)}function A(){o.value.forEach(r=>{r.status="pending",r.detail=""}),m.value="",_.value=!1,v.value=[]}return(r,s)=>(a(),i("div",E,[s[6]||(s[6]=t("h3",null,"RAG 完整流水线",-1)),s[7]||(s[7]=t("p",{class:"subtitle"},"基于秋日森林知识库的检索增强生成演示",-1)),t("div",T,[S(t("input",{"onUpdate:modelValue":s[0]||(s[0]=e=>g.value=e),placeholder:"请输入您的问题...",onKeyup:G(k,["enter"])},null,544),[[D,g.value]]),t("div",I,[t("button",{disabled:d.value,class:"primary",onClick:k},n(d.value?"执行中...":"运行 RAG"),9,M),t("button",{disabled:d.value,onClick:A},"重置",8,V)])]),t("div",B,[t("button",{class:h({active:l.value==="process"}),onClick:s[1]||(s[1]=e=>l.value="process")},"执行过程",2),t("button",{class:h({active:l.value==="code"}),onClick:s[2]||(s[2]=e=>l.value="code")},"代码示例",2),t("button",{class:h({active:l.value==="knowledge"}),onClick:s[3]||(s[3]=e=>l.value="knowledge")},"知识点",2)]),l.value==="process"?(a(),i("div",$,[t("div",F,[(a(!0),i(f,null,w(o.value,e=>(a(),i("div",{key:e.id,class:h(["rag-step",e.status])},[t("div",K,[t("span",O,n(e.id),1)]),t("div",z,[t("div",N,[t("span",Q,n(e.name),1),t("span",q,n(e.status==="done"?"✓":e.status==="running"?"⟳":"○"),1)]),t("p",U,n(e.description),1),e.detail?(a(),i("p",j,n(e.detail),1)):u("",!0)])],2))),128))]),v.value.length>0?(a(),i("div",H,[s[4]||(s[4]=t("h4",null,"检索到的文档",-1)),(a(!0),i(f,null,w(v.value,e=>(a(),i("div",{key:e.id,class:"doc-item"},[t("div",J,[t("span",W,n(e.title),1),t("span",X,"相似度 "+n((e.score*100).toFixed(0))+"%",1)]),t("p",Y,n(e.snippet),1)]))),128))])):u("",!0),_.value?(a(),i("div",Z,[s[5]||(s[5]=t("h4",null,"生成回答",-1)),t("div",ee,[t("p",te,n(m.value),1)])])):u("",!0)])):u("",!0),l.value==="code"?(a(),i("div",se,[t("div",{class:"code-example"},[t("pre",null,n(oe))])])):u("",!0),l.value==="knowledge"?(a(),i("div",ne,[t("div",ie,[(a(),i(f,null,w(R,(e,p)=>t("div",{key:p,class:"knowledge-card"},[t("h5",null,n(e.title),1),t("p",ae,n(e.content),1)])),64))])])):u("",!0)]))}}),ue=L(le,[["__scopeId","data-v-98d54783"]]);export{ue as default};
