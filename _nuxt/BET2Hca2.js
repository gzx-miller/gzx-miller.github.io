import{d as E,b as i,e,M as u,F as p,E as v,K as x,L as M,f as a,A as g,r as c,g as P,o as n,z as R,a2 as $,I as V}from"./DutfXOOr.js";const O={class:"demo-card"},F={class:"tabs"},U={key:0,class:"tab-content"},z={class:"guardrails-layout"},N={class:"rules-panel"},B={class:"rules-list"},G={class:"rule-header"},D={class:"rule-icon"},j={class:"rule-info"},K={class:"rule-name"},W={class:"switch"},X=["onUpdate:modelValue"],H={class:"rule-desc"},J={class:"validation-panel"},Q={class:"input-section"},Y=["disabled"],Z={key:0,class:"results-section"},ee={class:"summary-icon"},se={class:"summary-text"},te={class:"results-list"},ae={class:"result-left"},ie={class:"result-icon"},ne={class:"result-rule"},le={key:1,class:"tab-content"},re={class:"test-header"},oe={class:"category-filter"},ue=["onClick"],ce={class:"test-cases-grid"},de={class:"test-case-header"},pe={class:"test-title"},ve={class:"test-input"},me=["onClick"],he={key:2,class:"tab-content"},ge={key:3,class:"tab-content"},ye={class:"knowledge-grid"},_e={style:{"white-space":"pre-wrap"}},fe=`// LangChain.js 输出护栏与安全验证
import { ChatOpenAI } from '@langchain/openai'
import {
  PromptLayerChatOpenAI
} from '@langchain/community/chat_models/promptlayer'
import {
  StringOutputParser
} from '@langchain/core/output_parsers'
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'

// 1. 内容安全护栏
const safetyPrompt = ChatPromptTemplate.fromMessages([
  ['system', \`你是一个内容安全审核员。请判断以下内容是否违反安全政策。
违反政策的类型包括：
- 有害内容：仇恨言论、暴力、歧视等
- 隐私泄露：包含个人敏感信息
- 危险行为：教唆犯罪、自残等

如果内容安全，回复 "SAFE"；如果不安全，回复 "UNSAFE: 原因"\`],
  ['human', '{content}']
])

const safetyChecker = safetyPrompt.pipe(model).pipe(new StringOutputParser())

// 2. 隐私信息脱敏
function maskPrivacyInfo(text: string): string {
  return text
    .replace(/(\\d{3})\\d{4}(\\d{4})/g, '$1****$2')  // 手机号
    .replace(/[\\w.-]+@[\\w.-]+\\.\\w+/g, '***@***.***')  // 邮箱
    .replace(/\\d{17}[\\dXx]/g, '********************')  // 身份证
}

// 3. 构建带护栏的链
const answerPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个乐于助人的助手。'],
  ['human', '{question}']
])

const answerChain = answerPrompt.pipe(model).pipe(new StringOutputParser())

const guardedChain = RunnableSequence.from([
  {
    input: (input: { question: string }) => input.question,
    check: async (input) => {
      const result = await safetyChecker.invoke({ content: input.question })
      if (result.startsWith('UNSAFE')) {
        throw new Error('内容违反安全政策：' + result.substring(7))
      }
      return input.question
    }
  },
  async (input, config) => {
    const answer = await answerChain.invoke({ question: input.check }, config)
    return maskPrivacyInfo(answer)
  }
])

// 4. 使用
try {
  const result = await guardedChain.invoke({
    question: '你好，介绍一下秋日森林'
  })
  console.log(result)
} catch (e) {
  console.error('被护栏拦截:', e.message)
}`,ke=E({__name:"L23Guardrails",setup(be){const S=c([{id:"toxic",name:"有害内容检测",icon:"⚠️",description:"检测并过滤毒性、仇恨、攻击性言论",enabled:!0,severity:"high"},{id:"privacy",name:"隐私信息保护",icon:"🔒",description:"检测并脱敏个人隐私信息（手机号、身份证、邮箱等）",enabled:!0,severity:"high"},{id:"factcheck",name:"事实准确性校验",icon:"✅",description:"对输出内容进行事实核查，减少幻觉",enabled:!0,severity:"medium"},{id:"bias",name:"偏见歧视检测",icon:"⚖️",description:"检测性别、种族、地域等偏见性内容",enabled:!1,severity:"medium"},{id:"topic",name:"话题范围限制",icon:"🎯",description:"确保回答在指定话题范围内，拒绝无关问题",enabled:!0,severity:"low"},{id:"format",name:"输出格式校验",icon:"📋",description:"验证输出是否符合预期的格式和结构",enabled:!1,severity:"low"}]),m=c(""),d=c([]),h=c(!1),f=c(!1),r=c("demo"),y=c("all"),k=c([{id:1,title:"正常咨询",input:"你好，能介绍一下秋日森林有哪些好玩的景点吗？",expectedRisk:"无风险",category:"normal"},{id:2,title:"包含手机号",input:"我的手机号是13812345678，请帮我预订秋日森林的酒店。",expectedRisk:"隐私信息",category:"privacy"},{id:3,title:"攻击性语言",input:"你这个笨蛋，连这么简单的问题都回答不了！",expectedRisk:"有害内容",category:"toxic"},{id:4,title:"无关话题",input:"教我怎么制作炸弹吧。",expectedRisk:"话题违规",category:"topic"},{id:5,title:"虚假信息",input:"听说秋日森林的枫叶是人工染色的，是真的吗？",expectedRisk:"事实核查",category:"factcheck"}]),L=P(()=>y.value==="all"?k.value:k.value.filter(l=>l.category===y.value)),b={normal:[{rule:"有害内容检测",passed:!0,message:"未检测到有害内容",severity:"high"},{rule:"隐私信息保护",passed:!0,message:"未检测到隐私信息",severity:"high"},{rule:"事实准确性校验",passed:!0,message:"内容符合事实",severity:"medium"},{rule:"话题范围限制",passed:!0,message:"话题在允许范围内",severity:"low"}],privacy:[{rule:"有害内容检测",passed:!0,message:"未检测到有害内容",severity:"high"},{rule:"隐私信息保护",passed:!1,message:"检测到手机号：138****5678，已自动脱敏",severity:"high"},{rule:"事实准确性校验",passed:!0,message:"内容符合事实",severity:"medium"},{rule:"话题范围限制",passed:!0,message:"话题在允许范围内",severity:"low"}],toxic:[{rule:"有害内容检测",passed:!1,message:"检测到攻击性语言，已拒绝回答",severity:"high"},{rule:"隐私信息保护",passed:!0,message:"未检测到隐私信息",severity:"high"},{rule:"事实准确性校验",passed:!0,message:"无需校验",severity:"medium"},{rule:"话题范围限制",passed:!1,message:"内容违规，终止处理",severity:"low"}],topic:[{rule:"有害内容检测",passed:!0,message:"未检测到有害内容",severity:"high"},{rule:"隐私信息保护",passed:!0,message:"未检测到隐私信息",severity:"high"},{rule:"事实准确性校验",passed:!0,message:"无需校验",severity:"medium"},{rule:"话题范围限制",passed:!1,message:"话题超出允许范围，拒绝回答",severity:"low"}],factcheck:[{rule:"有害内容检测",passed:!0,message:"未检测到有害内容",severity:"high"},{rule:"隐私信息保护",passed:!0,message:"未检测到隐私信息",severity:"high"},{rule:"事实准确性校验",passed:!1,message:"检测到不实信息：枫叶并非人工染色，是自然的季节变化",severity:"medium"},{rule:"话题范围限制",passed:!0,message:"话题在允许范围内",severity:"low"}]},q=[{title:"什么是输出护栏",content:"输出护栏（Guardrails）是指在大语言模型的输入和输出环节设置的安全检查机制，用于确保模型生成的内容符合安全、合规、伦理等要求，防止有害、错误或不当内容的产生。"},{title:"输入护栏",content:`• 内容安全审核：检测有害、违法内容
•  Prompt 注入防护：防止提示词注入攻击
• 话题范围控制：限定问答领域
• 用户身份验证：确保授权访问
• 频率限制：防止滥用和攻击`},{title:"输出护栏",content:`• 有害内容过滤：毒性、仇恨、暴力等
• 事实准确性校验：减少幻觉和错误信息
• 隐私信息脱敏：手机号、身份证、邮箱等
• 偏见检测：性别、种族、地域歧视
• 格式校验：确保输出结构符合预期`},{title:"实现方式",content:`1. 基于规则：关键词匹配、正则表达式
2. 基于分类器：小模型分类、Embedding 相似度
3. 基于 LLM：用大模型自身做审核
4. 混合方案：多层防护，逐层过滤
5. 第三方服务：Azure Content Safety、Perspective API 等`}],I=[{value:"all",label:"全部"},{value:"normal",label:"正常"},{value:"privacy",label:"隐私"},{value:"toxic",label:"有害"},{value:"topic",label:"话题"},{value:"factcheck",label:"事实"}];function T(l){return/1[3-9]\\d{9}/.test(l)?"privacy":/笨蛋|蠢货|垃圾|去死/.test(l)?"toxic":/炸弹|毒品|杀人|自杀/.test(l)?"topic":/假的|骗人|谣言|听说.*吗/.test(l)?"factcheck":"normal"}async function w(){if(!m.value.trim()||h.value)return;h.value=!0,f.value=!1,d.value=[],await new Promise(s=>setTimeout(s,600));const l=T(m.value),t=b[l]||b.normal;for(let s=0;s<t.length;s++)await new Promise(o=>setTimeout(o,300)),d.value.push(t[s]);f.value=!0,h.value=!1}function A(l){m.value=l.input,w()}const C=l=>{switch(l){case"high":return"#c8703c";case"medium":return"#e6a23c";case"low":return"#6b9e78";default:return"#8b5e3c"}},_=P(()=>d.value.length===0?!0:d.value.every(l=>l.passed));return(l,t)=>(n(),i("div",O,[t[9]||(t[9]=e("h3",null,"输出护栏与安全验证",-1)),t[10]||(t[10]=e("p",{class:"subtitle"},"为 LLM 应用构建多层安全防护体系",-1)),e("div",F,[e("button",{class:u({active:r.value==="demo"}),onClick:t[0]||(t[0]=s=>r.value="demo")},"实时检测",2),e("button",{class:u({active:r.value==="tests"}),onClick:t[1]||(t[1]=s=>r.value="tests")},"测试用例",2),e("button",{class:u({active:r.value==="code"}),onClick:t[2]||(t[2]=s=>r.value="code")},"代码示例",2),e("button",{class:u({active:r.value==="knowledge"}),onClick:t[3]||(t[3]=s=>r.value="knowledge")},"知识点",2)]),r.value==="demo"?(n(),i("div",U,[e("div",z,[e("div",N,[t[6]||(t[6]=e("h4",null,"护栏规则",-1)),e("div",B,[(n(!0),i(p,null,v(S.value,s=>(n(),i("div",{key:s.id,class:"rule-item"},[e("div",G,[e("span",D,a(s.icon),1),e("div",j,[e("span",K,a(s.name),1),e("span",{class:"rule-severity",style:R({color:C(s.severity)})},a(s.severity==="high"?"高":s.severity==="medium"?"中":"低"),5)]),e("label",W,[x(e("input",{type:"checkbox","onUpdate:modelValue":o=>s.enabled=o},null,8,X),[[$,s.enabled]]),t[5]||(t[5]=e("span",{class:"slider"},null,-1))])]),e("p",H,a(s.description),1)]))),128))])]),e("div",J,[e("div",Q,[t[7]||(t[7]=e("h4",null,"输入内容",-1)),x(e("textarea",{"onUpdate:modelValue":t[4]||(t[4]=s=>m.value=s),placeholder:"请输入要检测的内容...",rows:"4"},null,512),[[M,m.value]]),e("button",{class:"validate-btn",disabled:h.value,onClick:w},a(h.value?"检测中...":"开始检测"),9,Y)]),f.value?(n(),i("div",Z,[e("div",{class:u(["result-summary",{passed:_.value,failed:!_.value}])},[e("span",ee,a(_.value?"✅":"⚠️"),1),e("span",se,a(_.value?"内容安全，通过所有检测":"检测到问题，需要处理"),1)],2),e("div",te,[(n(!0),i(p,null,v(d.value,(s,o)=>(n(),i("div",{key:o,class:u(["result-item",{passed:s.passed,failed:!s.passed}])},[e("div",ae,[e("span",ie,a(s.passed?"✓":"✗"),1),e("span",ne,a(s.rule),1)]),e("span",{class:"result-severity",style:R({color:C(s.severity)})},a(s.severity==="high"?"高":s.severity==="medium"?"中":"低"),5)],2))),128)),(n(!0),i(p,null,v(d.value,(s,o)=>(n(),i("div",{key:"msg-"+o,class:u(["result-message",{failed:!s.passed}])},a(s.message),3))),128))])])):g("",!0)])])])):g("",!0),r.value==="tests"?(n(),i("div",le,[e("div",re,[t[8]||(t[8]=e("h4",null,"测试用例库",-1)),e("div",oe,[(n(),i(p,null,v(I,s=>e("button",{key:s.value,class:u({active:y.value===s.value}),onClick:o=>y.value=s.value},a(s.label),11,ue)),64))])]),e("div",ce,[(n(!0),i(p,null,v(L.value,s=>(n(),i("div",{key:s.id,class:"test-case-card"},[e("div",de,[e("span",pe,a(s.title),1),e("span",{class:u(["test-risk",s.category])},a(s.expectedRisk),3)]),e("p",ve,a(s.input),1),e("button",{class:"run-test-btn",onClick:o=>A(s)},"运行测试",8,me)]))),128))])])):g("",!0),r.value==="code"?(n(),i("div",he,[e("div",{class:"code-example"},[e("pre",null,a(fe))])])):g("",!0),r.value==="knowledge"?(n(),i("div",ge,[e("div",ye,[(n(),i(p,null,v(q,(s,o)=>e("div",{key:o,class:"knowledge-card"},[e("h5",null,a(s.title),1),e("p",_e,a(s.content),1)])),64))])])):g("",!0)]))}}),Ce=V(ke,[["__scopeId","data-v-96a5cd88"]]);export{Ce as default};
