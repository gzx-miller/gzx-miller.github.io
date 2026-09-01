import{I as y,b as d,e,f as o,F as h,E as g,A as v,r as u,o as n,M as m,v as k}from"./DutfXOOr.js";const N={class:"demo-card"},b=["disabled"],f={class:"graph-area"},E={class:"node-row"},w={class:"node-id"},G={class:"node-desc"},L={key:0,class:"edge-arrow"},x={key:0,class:"history-section"},z={class:"log-node"},C=`import { StateGraph, END } from '@langchain/langgraph'

const graph = new StateGraph({ channels: ['query', 'courses', 'ranked'] })
graph.addNode('analyze', analyzeNode)
graph.addNode('search',  searchNode)
graph.addNode('rank',    rankNode)
graph.addNode('respond', respondNode)

graph.addEdge('search', 'rank')
graph.addEdge('rank',   'respond')
graph.addConditionalEdges('analyze', routeByQuery, {
  has_keywords: 'search',
  empty_query:  'respond',
})
graph.addEdge('respond', END)

const app = graph.compile()
const result = await app.invoke({ query: '推荐 Vue3 入门课' })`,q={__name:"L16LangGraph",setup(B){const c=[{id:"analyze",label:"分析需求",desc:"解析用户偏好与目标领域"},{id:"search",label:"搜索课程",desc:"从知识库检索候选课程"},{id:"rank",label:"排序筛选",desc:"按匹配度与评分排序"},{id:"respond",label:"生成回复",desc:"组织推荐理由与结果"}],i=u(null),t=u([]),r=u(!1);async function _(){if(!r.value){r.value=!0,t.value=[];for(const l of c)i.value=l.id,t.value.push({node:l.label,state:`进入 ${l.id} 节点`}),await new Promise(a=>setTimeout(a,700));t.value.push({node:"END",state:"流程结束，返回推荐结果"}),i.value=null,r.value=!1}}return(l,a)=>(n(),d("div",N,[a[3]||(a[3]=e("h3",null,"LangGraph 多智能体状态机",-1)),e("button",{class:"run-btn",disabled:r.value,onClick:_},o(r.value?"运行中...":"运行状态机"),9,b),e("div",f,[e("div",E,[(n(),d(h,null,g(c,(s,p)=>e("div",{key:s.id,class:m(["node-box",{active:i.value===s.id}])},[e("strong",null,o(s.label),1),e("span",w,o(s.id),1),e("span",G,o(s.desc),1),p<c.length-1?(n(),d("span",L,"→")):v("",!0)],2)),64))]),a[0]||(a[0]=e("div",{class:"cond-edge"},[e("span",{class:"cond-label"},"条件边：empty_query 时跳过搜索，直达回复")],-1))]),t.value.length?(n(),d("div",x,[a[1]||(a[1]=e("h4",null,"状态流转日志",-1)),(n(!0),d(h,null,g(t.value,(s,p)=>(n(),d("div",{key:p,class:"log-item"},[e("span",z,o(s.node),1),k(o(s.state),1)]))),128))])):v("",!0),e("div",{class:"code-section"},[a[2]||(a[2]=e("h4",null,"StateGraph 构建代码",-1)),e("pre",{class:"code-block"},o(C))])]))}},S=y(q,[["__scopeId","data-v-9e11d94e"]]);export{S as default};
