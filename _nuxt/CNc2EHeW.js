import{d as H,b as d,e,M as k,f as n,y as o,v as a,F as K,E as U,z as J,K as Q,L as W,aG as X,A as Y,a0 as Z,r as m,o as c,I as O}from"./DutfXOOr.js";const h={class:"demo-card"},ee={class:"tab-row"},se={key:0,class:"demo-section"},te={class:"greeting-box"},oe={class:"greeting-text"},le={class:"level-badge"},ne={class:"profile-section"},ae={class:"form-row"},re=["value"],ie={class:"form-row"},de={class:"mood-buttons"},ce=["onClick"],ue={class:"progress-section"},ve={class:"progress-header"},me={class:"progress-bar"},pe={class:"progress-hint"},ge={class:"leaves-section"},fe={class:"section-header"},ye={class:"leaf-input"},ke={class:"leaf-tags"},Ae=["onClick"],Se={key:1,class:"atoms-section"},be={class:"atom-list"},Ce={class:"atom-card"},Le={class:"atom-value"},Re={class:"atom-card"},Ve={class:"atom-value"},Ne={class:"atom-card"},xe={class:"atom-value"},Me={class:"atom-card"},we={class:"atom-value"},$e={key:2,class:"selectors-section"},Ie={class:"selector-list"},_e={class:"selector-card"},Pe={class:"selector-value"},De={class:"selector-card"},Ke={class:"selector-value"},Ue={class:"selector-card"},ze={class:"selector-value"},Be={class:"selector-card"},Ee={class:"selector-value"},Fe={class:"code-toggle"},Te={key:3,class:"code-block"},je=H({__name:"S22Recoil",setup(Ge){const u=m({});function f(t){t.key in u.value||(u.value[t.key]=m(t.default));const s=u.value[t.key],l=g=>{typeof g=="function"?s.value=g(s.value):s.value=g};return[s.value,l]}function r(t){return"get"in t?t.get():(t.key in u.value||(u.value[t.key]=m(t.default)),u.value[t.key].value)}const C={key:"userName",default:"秋日旅人"},L={key:"userMood",default:"平静"},A={key:"forestVisits",default:12},R={key:"collectedLeaves",default:["枫叶","银杏叶","橡树叶"]},z={key:"greeting",get:()=>{const t=r(C),s=r(L);return`你好，${t}！今天心情${s}，适合去林间走走~`}},B={key:"leafCount",get:()=>r(R).length},E={key:"explorerLevel",get:()=>{const t=r(A);return t>=50?"森林大师 🏆":t>=30?"资深探险家 ⭐":t>=15?"林间漫步者 🍂":t>=5?"初入森林 🌱":"新手探险者 🌿"}},F={key:"progressPercent",get:()=>{const t=r(A);return Math.min(100,Math.round(t/50*100))}},[V,N]=f(C),[x,M]=f(L),[S,w]=f(A),[p,b]=f(R),$=r(z),I=r(B),_=r(E),P=r(F),v=m(""),i=m("demo"),y=m(!1),T=["开心","平静","兴奋","悠闲","沉思","温暖"];function D(){v.value.trim()&&(p.includes(v.value.trim())||b([...p,v.value.trim()]),v.value="")}function j(t){b(p.filter(s=>s!==t))}function G(){w(t=>t+1)}function q(){N("秋日旅人"),M("平静"),w(12),b(["枫叶","银杏叶","橡树叶"])}return(t,s)=>(c(),d("div",h,[s[43]||(s[43]=e("h4",null,"⚛️ Recoil 原子状态与 Selector",-1)),s[44]||(s[44]=e("p",null,"秋日森林探险家 — 模拟 Recoil 的 Atom 原子状态与 Selector 派生状态",-1)),e("div",ee,[e("button",{class:k({active:i.value==="demo"}),onClick:s[0]||(s[0]=l=>i.value="demo")}," 🎮 交互演示 ",2),e("button",{class:k({active:i.value==="atoms"}),onClick:s[1]||(s[1]=l=>i.value="atoms")}," 🔬 Atoms 原子 ",2),e("button",{class:k({active:i.value==="selectors"}),onClick:s[2]||(s[2]=l=>i.value="selectors")}," 🧩 Selectors 派生 ",2)]),i.value==="demo"?(c(),d("div",se,[e("div",te,[e("p",oe,n(o($)),1),e("p",le,"等级："+n(o(_)),1)]),e("div",ne,[s[8]||(s[8]=e("h5",null,"👤 探险者档案",-1)),e("div",ae,[e("label",null,[s[6]||(s[6]=a(" 昵称 ",-1)),e("input",{value:o(V),onInput:s[3]||(s[3]=l=>o(N)(l.target.value))},null,40,re)])]),e("div",ie,[s[7]||(s[7]=e("label",null,"今日心情",-1)),e("div",de,[(c(),d(K,null,U(T,l=>e("button",{key:l,class:k([{active:o(x)===l},"mood-btn"]),onClick:g=>o(M)(l)},n(l),11,ce)),64))])])]),e("div",ue,[e("div",ve,[s[9]||(s[9]=e("h5",null,"🌲 森林探险进度",-1)),e("span",null,"已访问 "+n(o(S))+" 次",1)]),e("div",me,[e("div",{class:"progress-fill",style:J({width:o(P)+"%"})},null,4)]),e("p",pe,"距离「森林大师」还需 "+n(Math.max(0,50-o(S)))+" 次访问",1),e("button",{onClick:G},"➕ 记录一次森林访问")]),e("div",ge,[e("div",fe,[e("h5",null,"🍁 树叶收藏 ("+n(o(I))+"种)",1)]),e("div",ye,[Q(e("input",{"onUpdate:modelValue":s[4]||(s[4]=l=>v.value=l),placeholder:"输入树叶名称...",onKeyup:X(D,["enter"])},null,544),[[W,v.value]]),e("button",{onClick:D},"添加")]),e("div",ke,[(c(!0),d(K,null,U(o(p),l=>(c(),d("span",{key:l,class:"leaf-tag"},[a(n(l)+" ",1),e("button",{class:"remove-tag",onClick:g=>j(l)},"×",8,Ae)]))),128))])]),e("div",{class:"reset-row"},[e("button",{class:"reset-btn",onClick:q},"🔄 重置所有状态")])])):i.value==="atoms"?(c(),d("div",Se,[s[22]||(s[22]=e("h5",null,"🔬 Atom 原子状态一览",-1)),s[23]||(s[23]=e("p",{class:"section-desc"},"Atom 是 Recoil 的最小状态单元，可以独立更新和订阅",-1)),e("div",be,[e("div",Ce,[s[11]||(s[11]=e("div",{class:"atom-head"},[e("code",{class:"atom-key"},"userNameAtom"),e("span",{class:"atom-type"},"string")],-1)),s[12]||(s[12]=e("p",{class:"atom-desc"},"用户昵称",-1)),e("p",Le,[s[10]||(s[10]=a("当前值：",-1)),e("code",null,n(o(V)),1)])]),e("div",Re,[s[14]||(s[14]=e("div",{class:"atom-head"},[e("code",{class:"atom-key"},"userMoodAtom"),e("span",{class:"atom-type"},"string")],-1)),s[15]||(s[15]=e("p",{class:"atom-desc"},"用户心情",-1)),e("p",Ve,[s[13]||(s[13]=a("当前值：",-1)),e("code",null,n(o(x)),1)])]),e("div",Ne,[s[17]||(s[17]=e("div",{class:"atom-head"},[e("code",{class:"atom-key"},"forestVisitsAtom"),e("span",{class:"atom-type"},"number")],-1)),s[18]||(s[18]=e("p",{class:"atom-desc"},"森林访问次数",-1)),e("p",xe,[s[16]||(s[16]=a("当前值：",-1)),e("code",null,n(o(S)),1)])]),e("div",Me,[s[20]||(s[20]=e("div",{class:"atom-head"},[e("code",{class:"atom-key"},"collectedLeavesAtom"),e("span",{class:"atom-type"},"string[]")],-1)),s[21]||(s[21]=e("p",{class:"atom-desc"},"收藏的树叶列表",-1)),e("p",we,[s[19]||(s[19]=a("当前值：",-1)),e("code",null,n(o(p).length)+" 项",1)])])])])):(c(),d("div",$e,[s[40]||(s[40]=e("h5",null,"🧩 Selector 派生状态一览",-1)),s[41]||(s[41]=e("p",{class:"section-desc"},"Selector 是纯函数，从 Atom 或其他 Selector 派生出新状态",-1)),e("div",Ie,[e("div",_e,[s[25]||(s[25]=e("div",{class:"selector-head"},[e("code",{class:"selector-key"},"greetingSelector"),e("span",{class:"selector-type"},"string")],-1)),s[26]||(s[26]=e("p",{class:"selector-desc"},"组合用户名和心情的问候语",-1)),e("p",Pe,[s[24]||(s[24]=a("结果：",-1)),e("code",null,n(o($)),1)]),s[27]||(s[27]=e("p",{class:"selector-deps"},"依赖：userNameAtom, userMoodAtom",-1))]),e("div",De,[s[29]||(s[29]=e("div",{class:"selector-head"},[e("code",{class:"selector-key"},"leafCountSelector"),e("span",{class:"selector-type"},"number")],-1)),s[30]||(s[30]=e("p",{class:"selector-desc"},"树叶收藏数量",-1)),e("p",Ke,[s[28]||(s[28]=a("结果：",-1)),e("code",null,n(o(I)),1)]),s[31]||(s[31]=e("p",{class:"selector-deps"},"依赖：collectedLeavesAtom",-1))]),e("div",Ue,[s[33]||(s[33]=e("div",{class:"selector-head"},[e("code",{class:"selector-key"},"explorerLevelSelector"),e("span",{class:"selector-type"},"string")],-1)),s[34]||(s[34]=e("p",{class:"selector-desc"},"根据访问次数计算探险等级",-1)),e("p",ze,[s[32]||(s[32]=a("结果：",-1)),e("code",null,n(o(_)),1)]),s[35]||(s[35]=e("p",{class:"selector-deps"},"依赖：forestVisitsAtom",-1))]),e("div",Be,[s[37]||(s[37]=e("div",{class:"selector-head"},[e("code",{class:"selector-key"},"progressPercentSelector"),e("span",{class:"selector-type"},"number")],-1)),s[38]||(s[38]=e("p",{class:"selector-desc"},"进度百分比（到50次为100%）",-1)),e("p",Ee,[s[36]||(s[36]=a("结果：",-1)),e("code",null,n(o(P))+"%",1)]),s[39]||(s[39]=e("p",{class:"selector-deps"},"依赖：forestVisitsAtom",-1))])])])),e("div",Fe,[e("button",{onClick:s[5]||(s[5]=l=>y.value=!y.value)},n(y.value?"收起代码":"查看 Recoil 代码"),1)]),y.value?(c(),d("div",Te,[...s[42]||(s[42]=[e("pre",null,[e("code",null,`// Recoil: Atom 定义
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

// 1. Atom — 最小状态单元
const userNameAtom = atom({
  key: 'userName',
  default: '秋日旅人',
})

const forestVisitsAtom = atom({
  key: 'forestVisits',
  default: 12,
})

const collectedLeavesAtom = atom({
  key: 'collectedLeaves',
  default: ['枫叶', '银杏叶', '橡树叶'],
})

// 2. Selector — 派生状态
const greetingSelector = selector({
  key: 'greeting',
  get: ({ get }) => {
    const name = get(userNameAtom)
    const mood = get(userMoodAtom)
    return \`你好，\${name}！今天心情\${mood}~\`
  },
})

const leafCountSelector = selector({
  key: 'leafCount',
  get: ({ get }) => get(collectedLeavesAtom).length,
})

// 3. 组件中使用
function ExplorerProfile() {
  const [userName, setUserName] = useRecoilState(userNameAtom)
  const greeting = useRecoilValue(greetingSelector)
  return <div>{greeting}</div>
}

// 4. 异步 Selector
const userDataSelector = selector({
  key: 'userData',
  get: async ({ get }) => {
    const userId = get(userIdAtom)
    const res = await fetch(\`/api/users/\${userId}\`)
    return res.json()
  },
})`)],-1)])])):Y("",!0),s[45]||(s[45]=Z('<div class="knowledge-points" data-v-0053e729><h5 data-v-0053e729>💡 知识点</h5><ul data-v-0053e729><li data-v-0053e729><strong data-v-0053e729>Atom</strong>：最小状态单元，可被任意组件订阅和更新，自动触发重渲染</li><li data-v-0053e729><strong data-v-0053e729>Selector</strong>：纯函数派生状态，可依赖 Atom 或其他 Selector</li><li data-v-0053e729><strong data-v-0053e729>按需渲染</strong>：组件只订阅自己用到的 Atom/Selector，精准更新</li><li data-v-0053e729><strong data-v-0053e729>异步 Selector</strong>：get 函数支持 async，天然处理异步数据流</li><li data-v-0053e729><strong data-v-0053e729>Key 唯一</strong>：每个 Atom/Selector 的 key 必须全局唯一</li><li data-v-0053e729><strong data-v-0053e729>React 生态</strong>：Recoil 由 Meta 开发，专为 React 设计</li></ul></div>',1))]))}}),He=O(je,[["__scopeId","data-v-0053e729"]]);export{He as default};
