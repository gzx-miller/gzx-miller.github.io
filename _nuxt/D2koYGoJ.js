import{d as S,b as l,e as s,F as k,E as f,f as u,v as w,A as _,r as d,o as i,M as g,I as T}from"./DutfXOOr.js";const y={class:"demo-card"},L={class:"mode-tabs"},M=["onClick"],x=["disabled"],P={class:"columns"},R={class:"col output-col"},$={key:0,class:"elapsed"},A={class:"output-area"},D={key:0,class:"cursor"},E={key:0,class:"placeholder"},I={class:"col event-col"},z={class:"event-log"},B={class:"event-name"},F={class:"event-data"},N={class:"code-section"},V={class:"code-block"},r="LangChain.js 是构建 LLM 应用的开源框架。它提供了模型调用、提示模板、链式调用、RAG 检索增强生成等核心能力，帮助开发者快速搭建智能问答、文档分析等应用。",q=S({__name:"L13Streaming",setup(O){const c=d("stream"),v=d(""),a=d([]),o=d(!1),m=d("");async function b(){if(o.value)return;o.value=!0,v.value="",a.value=[];const p=Date.now();if(c.value==="invoke")a.value.push({event:"invoke 开始",data:"等待完整响应..."}),await new Promise(e=>setTimeout(e,2e3)),v.value=r,a.value.push({event:"invoke 完成",data:`返回完整文本，共 ${r.length} 字符`});else if(c.value==="stream"){a.value.push({event:"stream 开始",data:"开始逐 token 接收"});let e=0;for(;e<r.length;){const t=Math.floor(Math.random()*3)+1,n=r.slice(e,e+t);v.value+=n,e+=t,a.value.push({event:"chunk",data:`"${n}"`}),await new Promise(h=>setTimeout(h,50))}a.value.push({event:"stream 完成",data:"所有 token 接收完毕"})}else{a.value.push({event:"start",data:"chain: RunnableSequence"}),await new Promise(t=>setTimeout(t,300)),a.value.push({event:"start",data:"llm: ChatOpenAI"}),await new Promise(t=>setTimeout(t,200));let e=0;for(;e<r.length;){const t=Math.floor(Math.random()*3)+1,n=r.slice(e,e+t);v.value+=n,a.value.push({event:"llm_chunk",data:`token="${n}" run_id=abc123`}),e+=t,await new Promise(h=>setTimeout(h,50))}a.value.push({event:"end",data:"llm: ChatOpenAI (5 tokens)"}),a.value.push({event:"end",data:"chain: RunnableSequence"})}m.value=`${((Date.now()-p)/1e3).toFixed(1)}s`,o.value=!1}const C={invoke:`// invoke: 等待完整响应
const result = await chain.invoke({ input: "..." })
console.log(result) // 完整文本`,stream:`// stream: 逐 token 流式输出
const stream = await chain.stream({ input: "..." })
for await (const chunk of stream) {
  process.stdout.write(chunk) // 逐块输出
}`,astream_events:`// astream_events: 事件级流式
const eventStream = chain.astreamEvents({
  input: "..."
}, { version: "v2" })
for await (const event of eventStream) {
  // event.name: 事件名称
  // event.data: 事件数据
  // event.tags: 标签元数据
  if (event.event === "on_llm_stream") {
    process.stdout.write(event.data.chunk)
  }
}`};return(p,e)=>(i(),l("div",y,[e[3]||(e[3]=s("h3",null,"流式输出策略对比",-1)),s("div",L,[(i(),l(k,null,f(["invoke","stream","astream_events"],t=>s("button",{key:t,class:g({active:c.value===t}),onClick:n=>c.value=t},u(t),11,M)),64))]),s("button",{disabled:o.value,class:"run-btn",onClick:b},u(o.value?"运行中...":"运行"),9,x),s("div",P,[s("div",R,[s("h4",null,[e[0]||(e[0]=w("输出 ",-1)),m.value?(i(),l("span",$,u(m.value),1)):_("",!0)]),s("div",A,[s("p",null,[w(u(v.value),1),o.value&&c.value!=="invoke"?(i(),l("span",D,"|")):_("",!0)]),!v.value&&!o.value?(i(),l("p",E,'点击"运行"查看输出')):_("",!0)])]),s("div",I,[e[1]||(e[1]=s("h4",null,"事件日志",-1)),s("div",z,[(i(!0),l(k,null,f(a.value.slice(-8),(t,n)=>(i(),l("div",{key:n,class:g(["event-item",t.event])},[s("span",B,u(t.event),1),s("span",F,u(t.data),1)],2))),128))])])]),s("div",N,[e[2]||(e[2]=s("h4",null,"代码示例",-1)),s("pre",V,u(C[c.value]),1)])]))}}),G=T(q,[["__scopeId","data-v-b316c832"]]);export{G as default};
