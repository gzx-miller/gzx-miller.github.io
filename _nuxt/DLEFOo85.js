import{d as j,b5 as q,b6 as H,b4 as J,b as i,e as s,f as o,y as m,K as S,L as V,aG as O,a1 as Q,F as P,E as x,A as $,a0 as W,aZ as tt,r as p,g as v,o as l,M as E,z as et,I as st}from"./DutfXOOr.js";const at={class:"demo-card"},ot={class:"task-app"},nt={class:"task-stats"},it={class:"stat-item"},lt={class:"stat-num"},dt={class:"stat-item done"},rt={class:"stat-num"},ct={class:"stat-item pending"},ut={class:"stat-num"},kt={class:"stat-item rate"},pt={class:"stat-num"},mt={class:"task-input"},vt={class:"filter-row"},gt=["onClick"],ft={class:"task-list"},ht=["checked","onChange"],Tt={class:"task-title"},bt={class:"task-tag"},wt=["onClick"],_t={class:"test-section"},yt={class:"test-header"},Ct=["disabled"],St={key:0,class:"test-summary"},Pt={class:"pass"},xt={class:"fail"},$t={class:"total"},Et={key:1,class:"test-list"},Bt={class:"test-icon"},Rt={class:"test-info"},At={class:"test-name"},Vt={key:0,class:"test-msg"},Mt={key:2,class:"test-empty"},Ut={class:"code-toggle"},zt={key:0,class:"code-block"},Dt=j({__name:"S21PiniaTesting",setup(It){const B=tt("task",()=>{const t=p([{id:1,title:"收集枫叶标本",completed:!0,priority:"low",tag:"自然"},{id:2,title:"准备秋季野餐",completed:!1,priority:"medium",tag:"生活"},{id:3,title:"写秋日散文",completed:!1,priority:"high",tag:"创作"}]),e=v(()=>t.value.filter(n=>n.completed).length),a=v(()=>t.value.filter(n=>!n.completed).length),u=v(()=>t.value.filter(n=>n.priority==="high"&&!n.completed)),F=v(()=>t.value.length===0?0:Math.round(e.value/t.value.length*100));function G(n,k="medium",f="其他"){n.trim()&&t.value.push({id:Date.now(),title:n.trim(),completed:!1,priority:k,tag:f})}function X(n){const k=t.value.find(f=>f.id===n);k&&(k.completed=!k.completed)}function Y(n){const k=t.value.findIndex(f=>f.id===n);k>-1&&t.value.splice(k,1)}function Z(){t.value=t.value.filter(n=>!n.completed)}return{tasks:t,completedCount:e,pendingCount:a,highPriorityTasks:u,completionRate:F,addTask:G,toggleTask:X,removeTask:Y,clearCompleted:Z}});q(H());const g=B(),{tasks:_,completedCount:M,pendingCount:U,highPriorityTasks:Kt,completionRate:z}=J(g),d=p([]),h=p(!1),T=p(""),y=p("medium"),C=p("生活"),b=p("all"),w=p(!1),D=v(()=>b.value==="all"?_.value:_.value.filter(t=>t.priority===b.value));function R(){g.addTask(T.value,y.value,C.value),T.value=""}async function I(){h.value=!0,d.value=[];const t=B();t.$reset(),await c(200),await r("addTask: 添加任务后数量增加",()=>{const e=t.tasks.length;if(t.addTask("测试任务","medium","测试"),t.tasks.length!==e+1)throw new Error(`期望 ${e+1} 个任务，实际 ${t.tasks.length}`)}),await c(150),await r("addTask: 空标题不添加任务",()=>{const e=t.tasks.length;if(t.addTask("   ","medium"),t.tasks.length!==e)throw new Error("空标题不应添加任务")}),await c(150),await r("toggleTask: 切换任务完成状态",()=>{t.addTask("切换测试","low");const e=t.tasks[t.tasks.length-1],a=e.completed;if(t.toggleTask(e.id),e.completed===a)throw new Error("任务状态未切换")}),await c(150),await r("removeTask: 删除指定任务",()=>{t.addTask("待删除","low");const e=t.tasks[t.tasks.length-1].id,a=t.tasks.length;if(t.removeTask(e),t.tasks.length!==a-1)throw new Error("任务未被删除");if(t.tasks.find(u=>u.id===e))throw new Error("已删除任务仍存在")}),await c(150),await r("clearCompleted: 清除已完成任务",()=>{t.$reset(),t.addTask("任务1","low"),t.addTask("任务2","low"),t.toggleTask(t.tasks[0].id);const e=t.tasks.length;if(t.clearCompleted(),t.tasks.length!==e-1)throw new Error("已完成任务未清除");if(t.tasks.some(a=>a.completed))throw new Error("仍有已完成任务")}),await c(150),await r("completedCount: 正确统计已完成数量",()=>{if(t.$reset(),t.addTask("A","low"),t.addTask("B","low"),t.addTask("C","low"),t.toggleTask(t.tasks[0].id),t.toggleTask(t.tasks[1].id),t.completedCount!==2)throw new Error(`期望 2，实际 ${t.completedCount}`)}),await c(150),await r("completionRate: 正确计算完成率",()=>{if(t.$reset(),t.addTask("X","low"),t.addTask("Y","low"),t.toggleTask(t.tasks[0].id),t.completionRate!==50)throw new Error(`期望 50%，实际 ${t.completionRate}%`)}),await c(150),await r("highPriorityTasks: 正确筛选高优先级待办",()=>{if(t.$reset(),t.addTask("高优1","high"),t.addTask("中优","medium"),t.addTask("高优2","high"),t.toggleTask(t.tasks[0].id),t.highPriorityTasks.length!==1)throw new Error(`期望 1 个高优待办，实际 ${t.highPriorityTasks.length}`)}),h.value=!1}async function r(t,e){try{e(),d.value.push({name:t,passed:!0,message:"通过 ✓"})}catch(a){d.value.push({name:t,passed:!1,message:a.message})}}function c(t){return new Promise(e=>setTimeout(e,t))}const K=v(()=>d.value.filter(t=>t.passed).length),L=v(()=>d.value.filter(t=>!t.passed).length),N=t=>({low:"#16a34a",medium:"#d97706",high:"#dc2626"})[t]||"#7c563f",A=t=>({low:"低",medium:"中",high:"高"})[t]||t;return(t,e)=>(l(),i("div",at,[e[12]||(e[12]=s("h4",null,"🧪 Pinia Store 单元测试",-1)),e[13]||(e[13]=s("p",null,"秋日待办清单 — 演示如何为 Pinia Store 编写单元测试",-1)),s("div",ot,[s("div",nt,[s("div",it,[s("span",lt,o(m(_).length),1),e[5]||(e[5]=s("span",{class:"stat-label"},"总任务",-1))]),s("div",dt,[s("span",rt,o(m(M)),1),e[6]||(e[6]=s("span",{class:"stat-label"},"已完成",-1))]),s("div",ct,[s("span",ut,o(m(U)),1),e[7]||(e[7]=s("span",{class:"stat-label"},"待完成",-1))]),s("div",kt,[s("span",pt,o(m(z))+"%",1),e[8]||(e[8]=s("span",{class:"stat-label"},"完成率",-1))])]),s("div",mt,[S(s("input",{"onUpdate:modelValue":e[0]||(e[0]=a=>T.value=a),placeholder:"添加秋日待办...",onKeyup:O(R,["enter"])},null,544),[[V,T.value]]),S(s("select",{"onUpdate:modelValue":e[1]||(e[1]=a=>y.value=a)},[...e[9]||(e[9]=[s("option",{value:"low"},"低优先级",-1),s("option",{value:"medium"},"中优先级",-1),s("option",{value:"high"},"高优先级",-1)])],512),[[Q,y.value]]),S(s("input",{"onUpdate:modelValue":e[2]||(e[2]=a=>C.value=a),placeholder:"标签",style:{width:"80px"}},null,512),[[V,C.value]]),s("button",{onClick:R},"添加")]),s("div",vt,[(l(),i(P,null,x(["all","low","medium","high"],a=>s("button",{key:a,class:E([{active:b.value===a},"filter-btn"]),onClick:u=>b.value=a},o(a==="all"?"全部":A(a)+"优先级"),11,gt)),64)),s("button",{class:"clear-btn",onClick:e[3]||(e[3]=a=>m(g).clearCompleted())},"清除已完成")]),s("div",ft,[(l(!0),i(P,null,x(D.value,a=>(l(),i("div",{key:a.id,class:E(["task-item",{completed:a.completed}])},[s("input",{type:"checkbox",checked:a.completed,onChange:u=>m(g).toggleTask(a.id)},null,40,ht),s("span",Tt,o(a.title),1),s("span",bt,o(a.tag),1),s("span",{class:"task-priority",style:et({color:N(a.priority)})},o(A(a.priority))+"优 ",5),s("button",{class:"delete-btn",onClick:u=>m(g).removeTask(a.id)},"×",8,wt)],2))),128))])]),s("div",_t,[s("div",yt,[e[10]||(e[10]=s("h5",null,"🧪 测试运行器",-1)),s("button",{onClick:I,disabled:h.value},o(h.value?"运行中...":"运行测试"),9,Ct)]),d.value.length?(l(),i("div",St,[s("span",Pt,"✓ "+o(K.value)+" 通过",1),s("span",xt,"✗ "+o(L.value)+" 失败",1),s("span",$t,"共 "+o(d.value.length)+" 个测试",1)])):$("",!0),d.value.length?(l(),i("div",Et,[(l(!0),i(P,null,x(d.value,(a,u)=>(l(),i("div",{key:u,class:E(["test-item",{pass:a.passed,fail:!a.passed}])},[s("span",Bt,o(a.passed?"✓":"✗"),1),s("div",Rt,[s("span",At,o(a.name),1),a.passed?$("",!0):(l(),i("span",Vt,o(a.message),1))])],2))),128))])):(l(),i("p",Mt,'点击"运行测试"查看 Store 单元测试结果'))]),s("div",Ut,[s("button",{onClick:e[4]||(e[4]=a=>w.value=!w.value)},o(w.value?"收起代码":"查看测试代码"),1)]),w.value?(l(),i("div",zt,[...e[11]||(e[11]=[s("pre",null,[s("code",null,`// Vitest + Pinia 单元测试示例
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from './task'

describe('Task Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('addTask: 添加任务后数量增加', () => {
    const store = useTaskStore()
    const before = store.tasks.length
    store.addTask('测试任务', 'medium', '测试')
    expect(store.tasks.length).toBe(before + 1)
  })

  it('addTask: 空标题不添加任务', () => {
    const store = useTaskStore()
    const before = store.tasks.length
    store.addTask('   ', 'medium')
    expect(store.tasks.length).toBe(before)
  })

  it('toggleTask: 切换任务完成状态', () => {
    const store = useTaskStore()
    store.addTask('切换测试', 'low')
    const task = store.tasks[0]
    const before = task.completed
    store.toggleTask(task.id)
    expect(task.completed).toBe(!before)
  })

  it('removeTask: 删除指定任务', () => {
    const store = useTaskStore()
    store.addTask('待删除', 'low')
    const id = store.tasks[0].id
    const before = store.tasks.length
    store.removeTask(id)
    expect(store.tasks.length).toBe(before - 1)
    expect(store.tasks.find(t => t.id === id)).toBeUndefined()
  })

  it('completedCount: 正确统计已完成数量', () => {
    const store = useTaskStore()
    store.addTask('A', 'low')
    store.addTask('B', 'low')
    store.toggleTask(store.tasks[0].id)
    expect(store.completedCount).toBe(1)
  })

  it('completionRate: 正确计算完成率', () => {
    const store = useTaskStore()
    store.addTask('X', 'low')
    store.addTask('Y', 'low')
    store.toggleTask(store.tasks[0].id)
    expect(store.completionRate).toBe(50)
  })
})`)],-1)])])):$("",!0),e[14]||(e[14]=W('<div class="knowledge-points" data-v-bfe3b3ce><h5 data-v-bfe3b3ce>💡 知识点</h5><ul data-v-bfe3b3ce><li data-v-bfe3b3ce><strong data-v-bfe3b3ce>setActivePinia</strong>：测试前需创建并激活独立的 Pinia 实例</li><li data-v-bfe3b3ce><strong data-v-bfe3b3ce>$reset()</strong>：Setup Store 需自定义 reset 方法或手动重置状态</li><li data-v-bfe3b3ce><strong data-v-bfe3b3ce>测试 Getters</strong>：直接访问 computed 属性验证计算结果</li><li data-v-bfe3b3ce><strong data-v-bfe3b3ce>测试 Actions</strong>：调用 action 后断言状态变更正确</li><li data-v-bfe3b3ce><strong data-v-bfe3b3ce>异步测试</strong>：异步 action 使用 async/await，确保状态更新完成再断言</li><li data-v-bfe3b3ce><strong data-v-bfe3b3ce>最佳实践</strong>：每个测试用例使用独立 Store 实例，避免状态污染</li></ul></div>',1))]))}}),Nt=st(Dt,[["__scopeId","data-v-bfe3b3ce"]]);export{Nt as default};
