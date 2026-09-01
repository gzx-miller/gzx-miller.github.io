import{d as _,b as l,e as s,K as P,L as V,aG as f,f as u,F as x,E as h,A,r,o as d,M as y,I as g}from"./DutfXOOr.js";const S={class:"demo-card"},k={class:"qa-input"},w=["disabled"],B={class:"process-steps"},I={class:"phase-name"},K={class:"phase-detail"},T={key:0,class:"final-answer"},b=`Pinia 和 Vuex 的主要区别：

1. **架构设计**：Pinia 去除了 mutations，直接在 actions 中修改状态；Vuex 需要 mutations + actions 双层结构。

2. **TypeScript 支持**：Pinia 天然支持 TypeScript，无需额外类型声明；Vuex 需要 complex 类型包装。

3. **模块化**：Pinia 每个 Store 独立定义，无需嵌套模块；Vuex 使用 modules 嵌套，存在命名空间问题。

4. **体积**：Pinia 约 1KB，Vuex 约 6KB。

5. **组合式 API**：Pinia 完全兼容组合式 API，Vuex 主要面向选项式 API。`,C=_({__name:"L12QABot",setup(L){const p=r("Vue3 的 Pinia 和 Vuex 有什么区别？"),a=r([]),o=r(""),n=r(!1),v=[{phase:"Memory 检索",detail:"从对话历史中检索相关上下文：用户之前询问了 Vue3 状态管理相关内容"},{phase:"Retriever 检索",detail:`从 VectorStore 中检索到 3 篇相关文档：
1. Pinia 官方迁移指南
2. Vuex 到 Pinia 对比
3. 组合式 Store 最佳实践`},{phase:"Agent 推理",detail:"思考：需要从架构、API、TypeScript 支持三个维度对比 Pinia 和 Vuex"},{phase:"生成回答",detail:"基于检索结果和推理，生成结构化回答"}];async function c(){if(!n.value){n.value=!0,a.value=v.map(t=>({...t,status:"pending"})),o.value="";for(let t=0;t<a.value.length;t++)a.value[t].status="running",await new Promise(e=>setTimeout(e,1e3)),a.value[t].status="done";o.value=b,n.value=!1}}return(t,e)=>(d(),l("div",S,[e[2]||(e[2]=s("h3",null,"智能问答助手",-1)),e[3]||(e[3]=s("p",{class:"desc"},"Retriever + Agent + Memory 综合应用",-1)),s("div",k,[P(s("input",{"onUpdate:modelValue":e[0]||(e[0]=i=>p.value=i),placeholder:"输入问题",onKeyup:f(c,["enter"])},null,544),[[V,p.value]]),s("button",{disabled:n.value,onClick:c},u(n.value?"处理中...":"提问"),9,w)]),s("div",B,[(d(!0),l(x,null,h(a.value,(i,m)=>(d(),l("div",{key:m,class:y(["process-step",i.status])},[s("span",I,u(i.phase),1),s("pre",K,u(i.detail),1)],2))),128))]),o.value?(d(),l("div",T,[e[1]||(e[1]=s("h4",null,"最终回答",-1)),s("p",null,u(o.value),1)])):A("",!0)]))}}),Q=g(C,[["__scopeId","data-v-01acd1ea"]]);export{Q as default};
