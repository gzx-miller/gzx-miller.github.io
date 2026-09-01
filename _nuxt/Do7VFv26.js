import{I as S,b as p,e,F as k,E as w,K as h,L as v,f as n,M as y,A as x,r as u,g as _,o as d}from"./DutfXOOr.js";const V={class:"demo-card"},C={class:"section"},I={class:"cache-entries"},T={class:"cache-hash"},E={class:"cache-prompt"},F={class:"test-row"},M={class:"threshold-ctrl"},q={class:"hit-detail"},B={class:"section budget-section"},D={class:"budget-row"},L={class:"cost-val"},z=.002,A=`// 语义缓存：相似 prompt 复用历史响应
import { OpenAIEmbeddings } from '@langchain/openai'
import { cosineSimilarity } from 'langchain/util'

const cache = new Map()  // hash → { response, embedding }

async function cachedCall(prompt) {
  const embed = await embeddings.embedQuery(prompt)
  for (const [key, entry] of cache) {
    if (cosineSimilarity(embed, entry.embedding) > 0.92) {
      return { response: entry.response, cached: true }
    }
  }
  const response = await llm.invoke(prompt)
  cache.set(hash(prompt), { response, embedding: embed })
  return { response, cached: false }
}

// SSE 流式响应
app.get('/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  const stream = await chain.stream({ input: req.query.q })
  for await (const chunk of stream) {
    res.write(\`data: \${JSON.stringify(chunk)}\\n\\n\`)
  }
  res.end()
})`,N={__name:"L18Deploy",setup(P){const f=u([{prompt:"推荐 Vue3 入门课程",response:"推荐：Vue3 组合式 API 实战...",hash:"a3f8c2"},{prompt:"推荐 Vue3 基础教程",response:null,hash:"a3f8c1",hit:!1},{prompt:"TypeScript 泛型怎么用",response:"泛型允许你定义可复用的类型...",hash:"b7e1d4"}]),a=u("推荐 Vue3 入门教程"),i=u(.85),r=_(()=>{if(!a.value)return null;const l=f.value.reduce((s,o)=>m(a.value,o.prompt)>m(a.value,s.prompt)?o:s),t=m(a.value,l.prompt);return{entry:l,score:t,hit:t>=i.value}});function m(l,t){const s=new Set(l),o=new Set(t);return[...s].filter(g=>o.has(g)).length/Math.max(s.size,o.size)}const c=u(2e3),b=_(()=>(c.value/1e3*z).toFixed(4));return(l,t)=>(d(),p("div",V,[t[6]||(t[6]=e("h3",null,"部署优化与缓存",-1)),e("div",C,[t[3]||(t[3]=e("h4",null,"语义缓存模拟",-1)),e("div",I,[(d(!0),p(k,null,w(f.value,(s,o)=>(d(),p("div",{key:o,class:"cache-item"},[e("span",T,"#"+n(s.hash),1),e("span",E,n(s.prompt),1),e("span",{class:y(["cache-hit",s.hit===!1?"miss":"hit"])},n(s.hit===!1?"MISS":"HIT"),3)]))),128))]),e("div",F,[h(e("input",{"onUpdate:modelValue":t[0]||(t[0]=s=>a.value=s),placeholder:"输入测试 prompt...",class:"test-input"},null,512),[[v,a.value]]),e("div",M,[e("label",null,"阈值 "+n(i.value.toFixed(2)),1),h(e("input",{type:"range","onUpdate:modelValue":t[1]||(t[1]=s=>i.value=s),min:"0.5",max:"1",step:"0.05"},null,512),[[v,i.value,void 0,{number:!0}]])])]),r.value?(d(),p("div",{key:0,class:y(["hit-result",r.value.hit?"hit":"miss"])},[e("span",null,n(r.value.hit?"✅ 缓存命中":"❌ 缓存未命中"),1),e("span",q,'最相似："'+n(r.value.entry.prompt)+'"（相似度 '+n((r.value.score*100).toFixed(0))+"%）",1)],2)):x("",!0)]),e("div",B,[t[4]||(t[4]=e("h4",null,"Token 预算与成本估算",-1)),e("div",D,[e("label",null,"Token 预算："+n(c.value),1),h(e("input",{type:"range","onUpdate:modelValue":t[2]||(t[2]=s=>c.value=s),min:"500",max:"8000",step:"100"},null,512),[[v,c.value,void 0,{number:!0}]]),e("span",L,"≈ $"+n(b.value)+" / 请求",1)])]),e("div",{class:"code-section"},[t[5]||(t[5]=e("h4",null,"语义缓存 + SSE 流式代码",-1)),e("pre",{class:"code-block"},n(A))])]))}},K=S(N,[["__scopeId","data-v-8cce1d96"]]);export{K as default};
