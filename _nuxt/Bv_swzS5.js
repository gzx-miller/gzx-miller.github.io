import{d as g,b as o,e as t,v as l,f as n,F as d,E as p,r as S,o as i,M as h,I as y}from"./DutfXOOr.js";const x={class:"demo-card"},k={style:{display:"flex",gap:"16px"}},C={style:{flex:"1"}},_={class:"demo-section"},b={class:"demo-section"},B={style:{flex:"1"}},w={style:{width:"100%"}},N=`// useState 基本用法
const count = useState('counter', () => 0)
count.value++  // 跨组件共享

// 组件 A
const theme = useState('theme', () => 'light')

// 组件 B（自动同步）
const theme = useState('theme')

// 与 Pinia 对比
// useState: 轻量、SSR 友好、无 action/getter
// Pinia: 完整状态管理、插件生态、DevTools 支持`,P=g({__name:"N13UseState",setup(T){const u=S(0),a=S("light");function r(){u.value++}function c(){a.value=a.value==="light"?"dark":"light"}const f=[{step:"Server",action:"useState 初始化默认值，随请求创建"},{step:"Server",action:"数据序列化到 payload，发送到客户端"},{step:"Client",action:"从 payload 恢复 useState 的值（不重复初始化）"},{step:"Client",action:"后续修改仅客户端生效，不会跨请求污染"}],v=[{feature:"SSR 支持",useState:"✅ 内置",pinia:"✅ 需配置"},{feature:"跨组件共享",useState:"✅ 通过 key",pinia:"✅ 通过 store"},{feature:"DevTools",useState:"❌ 无",pinia:"✅ 完整支持"},{feature:"插件生态",useState:"❌ 无",pinia:"✅ 丰富"},{feature:"Getters/Actions",useState:"❌ 需手动",pinia:"✅ 内置"},{feature:"适用场景",useState:"轻量共享状态",pinia:"复杂业务状态"}];return(A,e)=>(i(),o("div",x,[e[7]||(e[7]=t("h3",null,"useState：跨组件状态共享",-1)),t("div",k,[t("div",C,[e[2]||(e[2]=t("h4",null,"交互演示",-1)),t("div",_,[t("p",null,[e[0]||(e[0]=l("共享计数器：",-1)),t("strong",null,n(u.value),1)]),t("button",{onClick:r},"+1（模拟组件 A 操作）"),t("button",{onClick:r},"+1（模拟组件 B 操作）")]),t("div",b,[t("p",null,[e[1]||(e[1]=l("主题：",-1)),t("strong",null,n(a.value),1)]),t("button",{onClick:c},"切换主题")]),e[3]||(e[3]=t("h4",{style:{"margin-top":"8px"}},"SSR 数据流",-1)),(i(),o(d,null,p(f,(s,m)=>t("div",{key:m,class:"flow-item"},[t("span",{class:h(["badge",s.step.toLowerCase()])},n(s.step),3),l(" "+n(s.action),1)])),64))]),t("div",B,[e[5]||(e[5]=t("h4",null,"代码示例",-1)),t("pre",{class:"code-block"},n(N)),e[6]||(e[6]=t("h4",{style:{"margin-top":"8px"}},"useState vs Pinia",-1)),t("table",w,[e[4]||(e[4]=t("thead",null,[t("tr",null,[t("th",null,"特性"),t("th",null,"useState"),t("th",null,"Pinia")])],-1)),t("tbody",null,[(i(),o(d,null,p(v,s=>t("tr",{key:s.feature},[t("td",null,n(s.feature),1),t("td",null,n(s.useState),1),t("td",null,n(s.pinia),1)])),64))])])])])]))}}),E=y(P,[["__scopeId","data-v-a66bc01d"]]);export{E as default};
