import{d as v,b as a,e,f as n,F as u,E as _,r as d,o as l,A as f,M as L,I as C}from"./DutfXOOr.js";const b={class:"demo-card"},y=["disabled"],h={class:"pipeline-flow"},E={key:0,class:"pipe-arrow"},k={class:"step-name"},g={class:"step-io"},w={class:"io-item"},x={class:"io-item"},P=`// LCEL 两种写法等价
// 1. 管道操作符 (推荐)
const chain = prompt.pipe(model).pipe(parser)

// 2. RunnableSequence.from
const chain = RunnableSequence.from([
  prompt, model, parser
])

// 执行
const result = await chain.invoke({
  product: "智能手表"
})`,I=v({__name:"L04LCEL",setup(R){const p=d([]),t=d(!1),m=[{name:"ChatPromptTemplate",type:"prompt",input:'{product: "智能手表"}',output:'请为"智能手表"撰写一段面向"科技爱好者"的产品介绍。'},{name:"ChatOpenAI",type:"model",input:'请为"智能手表"撰写一段面向"科技爱好者"的产品介绍。',output:"智能手表是一款融合前沿科技与日常佩戴的革新设备，搭载高精度健康传感器，支持血氧、心率和睡眠监测..."},{name:"StringOutputParser",type:"parser",input:"AIMessage: 智能手表是一款融合前沿科技与日常佩戴的革新设备...",output:"智能手表是一款融合前沿科技与日常佩戴的革新设备..."}];async function c(){if(!t.value){t.value=!0,p.value=[];for(const i of m)await new Promise(s=>setTimeout(s,800)),p.value.push(i);t.value=!1}}return(i,s)=>(l(),a("div",b,[s[3]||(s[3]=e("h3",null,"LCEL 管道执行",-1)),s[4]||(s[4]=e("p",{class:"desc"},"prompt.pipe(model).pipe(parser) — 数据依次流过每个 Runnable",-1)),e("button",{disabled:t.value,class:"run-btn",onClick:c},n(t.value?"执行中...":"执行管道"),9,y),e("div",h,[(l(!0),a(u,null,_(p.value,(o,r)=>(l(),a(u,{key:r},[r>0?(l(),a("div",E,".pipe()")):f("",!0),e("div",{class:L(["pipe-step",o.type])},[e("span",k,n(o.name),1),e("div",g,[e("div",w,[s[0]||(s[0]=e("small",null,"输入",-1)),e("p",null,n(o.input),1)]),e("div",x,[s[1]||(s[1]=e("small",null,"输出",-1)),e("p",null,n(o.output),1)])])],2)],64))),128))]),e("div",{class:"code-example"},[s[2]||(s[2]=e("h4",null,"等价写法",-1)),e("pre",null,n(P))])]))}}),A=C(I,[["__scopeId","data-v-da0762e9"]]);export{A as default};
