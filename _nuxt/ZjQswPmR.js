import{I as x,b as i,e as s,F as u,E as v,f as t,v as f,K as C,a2 as S,r as _,g as y,o as c,M as h,z as w}from"./DutfXOOr.js";const A={class:"demo-card"},V={class:"store-grid"},B=["onClick"],L={class:"store-icon"},I={class:"store-feat"},M={class:"info-row"},F={class:"info-box"},D={class:"val"},E={class:"info-box"},N={class:"val"},R={class:"metric-section"},z={class:"metric-tabs"},O=["onClick"],P={class:"formula-box"},K={class:"sim-section"},T={class:"hybrid-label"},$={class:"sim-name"},j={class:"sim-bar-bg"},H={class:"sim-score"},Q=`import { Chroma } from '@langchain/community/vectorstores/chroma'
import { OpenAIEmbeddings } from '@langchain/openai'

const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' })

// 写入向量库
const store = await Chroma.fromDocuments(docs, embeddings, {
  collectionName: 'courses',
})

// 相似度检索
const results = await store.similaritySearch('Vue3 教程', 4)

// 混合检索：向量 + 关键词（MMR 多样性排序）
const mmrResults = await store.maxMarginalRelevanceSearch('Vue3 教程', {
  k: 4, fetchK: 20,
})`,U={__name:"L17VectorStore",setup(q){const l=[{name:"Chroma",dims:1536,metric:"余弦相似度",feature:"轻量本地，适合开发调试",icon:"🟢"},{name:"FAISS",dims:1536,metric:"L2 / 内积",feature:"高性能单机，Facebook 开源",icon:"🔵"},{name:"Pinecone",dims:1536,metric:"余弦 / 点积",feature:"全托管云端，自动扩缩容",icon:"🟣"},{name:"pgvector",dims:1536,metric:"余弦 / L2",feature:"与 PostgreSQL 深度集成",icon:"🟠"}],r=_(0),d=_("cosine"),p={cosine:"余弦相似度 = A·B / (|A|·|B|)",dot:"点积 = Σ(Ai·Bi)",l2:"L2 距离 = √Σ(Ai-Bi)²"},b=[{name:"Vue3 组合式 API",vec:[.75,.35,.48],score:.97},{name:"React Hooks 详解",vec:[.7,.28,.55],score:.89},{name:"TypeScript 泛型",vec:[.6,.5,.4],score:.74},{name:"Node.js 文件操作",vec:[.2,.8,.3],score:.35}],m=_(!1),g=y(()=>m.value?b.filter(a=>a.score>.5).map(a=>({...a,score:Math.min(1,a.score+.05)})):b);return(a,e)=>(c(),i("div",A,[e[7]||(e[7]=s("h3",null,"向量存储与检索策略",-1)),s("div",V,[(c(),i(u,null,v(l,(o,n)=>s("div",{key:o.name,class:h(["store-card",{active:r.value===n}]),onClick:k=>r.value=n},[s("span",L,t(o.icon),1),s("strong",null,t(o.name),1),s("span",I,t(o.feature),1)],10,B)),64))]),s("div",M,[s("div",F,[e[1]||(e[1]=s("span",{class:"lbl"},"维度",-1)),s("span",D,t(l[r.value].dims),1)]),s("div",E,[e[2]||(e[2]=s("span",{class:"lbl"},"相似度度量",-1)),s("span",N,t(l[r.value].metric),1)])]),s("div",R,[e[3]||(e[3]=s("h4",null,"相似度公式对比",-1)),s("div",z,[(c(),i(u,null,v(p,(o,n)=>s("button",{key:n,class:h({active:d.value===n}),onClick:k=>d.value=n},t(n),11,O)),64))]),s("div",P,t(p[d.value]),1)]),s("div",K,[s("h4",null,[e[5]||(e[5]=f("相似度检索结果 ",-1)),s("label",T,[C(s("input",{type:"checkbox","onUpdate:modelValue":e[0]||(e[0]=o=>m.value=o)},null,512),[[S,m.value]]),e[4]||(e[4]=f(" 混合检索（向量 + 关键词）",-1))])]),(c(!0),i(u,null,v(g.value,o=>(c(),i("div",{key:o.name,class:"sim-row"},[s("span",$,t(o.name),1),s("div",j,[s("div",{class:"sim-bar",style:w({width:o.score*100+"%"})},null,4)]),s("span",H,t((o.score*100).toFixed(0))+"%",1)]))),128))]),s("div",{class:"code-section"},[e[6]||(e[6]=s("h4",null,"向量存储代码",-1)),s("pre",{class:"code-block"},t(Q))])]))}},J=x(U,[["__scopeId","data-v-bee4018e"]]);export{J as default};
