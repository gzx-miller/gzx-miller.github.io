import{d as I,b as l,e as n,f as o,z as f,A as y,M as _,F as k,E as h,K as T,L as w,aG as O,a0 as Z,ah as $,g as u,r as b,o as a}from"./DutfXOOr.js";const L={class:"demo-card"},N={class:"explorer-bar"},M={class:"explorer-info"},V={class:"name-row"},B={class:"level-badge"},P={class:"exp-bar"},R={class:"exp-text"},S={class:"energy-box"},A={class:"energy-value"},D=["disabled"],F={key:0,class:"explore-toast"},K={class:"tab-row"},U={key:1,class:"zones-section"},G={class:"zone-grid"},X={class:"zone-icon"},j={class:"zone-name"},q={class:"zone-desc"},H={key:0,class:"zone-meta"},J={key:1,class:"zone-features"},Q=["onClick","disabled"],W={class:"rename-row"},Y={key:2,class:"inventory-section"},ee={class:"inv-summary"},ne={class:"inv-stat"},te={class:"stat-num"},se={class:"inv-stat"},re={class:"stat-num"},oe={class:"inv-stat"},le={class:"stat-num"},ae={class:"inv-stat value"},ie={class:"stat-num"},de={class:"inv-list"},ce={class:"type-title"},ve={class:"type-items"},pe={class:"item-icon"},ue={class:"item-info"},me={class:"item-count"},ye={key:3,class:"structure-section"},xe={class:"code-toggle"},ge={key:4,class:"code-block"},ke=I({__name:"S24Overmind",setup(fe){const t=$({explorer:{name:"秋日探险家",level:2,experience:120,energy:80,maxEnergy:100},zones:[{id:"maple",name:"枫林小径",description:"铺满金色枫叶的幽静小路",unlocked:!0,visitCount:5,features:["枫叶","松鼠","野果"]},{id:"deep",name:"深林秘境",description:"古老树木参天的神秘森林",unlocked:!0,visitCount:2,features:["蘑菇","小鹿","苔藓"]},{id:"river",name:"清溪河畔",description:"清澈小溪流过的静谧之地",unlocked:!1,visitCount:0,features:["鱼群","鹅卵石","水草"]},{id:"mountain",name:"秋山远眺",description:"可以俯瞰整片森林的山顶",unlocked:!1,visitCount:0,features:["雄鹰","奇石","山风"]}],inventory:[{id:"maple_leaf",name:"红枫叶",type:"植物",count:12,rarity:"普通"},{id:"acorn",name:"橡树果",type:"植物",count:8,rarity:"普通"},{id:"mushroom",name:"红蘑菇",type:"蘑菇",count:3,rarity:"稀有"},{id:"crystal",name:"秋日水晶",type:"矿石",count:1,rarity:"史诗"}],currentZoneId:null}),c={currentZone:u(()=>t.zones.find(r=>r.id===t.currentZoneId)||null),lockedZones:u(()=>t.zones.filter(r=>!r.unlocked)),inventoryValue:u(()=>{const r={普通:1,稀有:10,史诗:50,传说:200};return t.inventory.reduce((e,s)=>e+s.count*r[s.rarity],0)}),expToNextLevel:u(()=>t.explorer.level*200),expProgress:u(()=>Math.round(t.explorer.experience/(t.explorer.level*200)*100)),inventoryByType:u(()=>{const r={};return t.inventory.forEach(e=>{r[e.type]||(r[e.type]=[]),r[e.type].push(e)}),r}),rareItems:u(()=>t.inventory.filter(r=>r.rarity!=="普通"))},p={enterZone(r){const e=t.zones.find(s=>s.id===r);e&&e.unlocked&&t.explorer.energy>=10&&(t.currentZoneId=r,t.explorer.energy-=10,e.visitCount++,p.gainExp(5),p.collectRandomItem())},leaveZone(){t.currentZoneId=null},collectRandomItem(){const r=c.currentZone.value;if(!r)return;const e=r.features,s=e[Math.floor(Math.random()*e.length)],d=t.inventory.find(i=>i.name.includes(s));if(d)d.count++;else{const i=["普通","普通","普通","稀有","稀有","史诗"],E=i[Math.floor(Math.random()*i.length)];t.inventory.push({id:`item_${Date.now()}`,name:s,type:r.features.indexOf(s)%2===0?"植物":"矿石",count:1,rarity:E})}},gainExp(r){for(t.explorer.experience+=r;t.explorer.experience>=c.expToNextLevel.value;){t.explorer.experience-=c.expToNextLevel.value,t.explorer.level++,t.explorer.maxEnergy+=20,t.explorer.energy=t.explorer.maxEnergy;const e=c.lockedZones.value;e.length>0&&t.explorer.level%2===0&&(e[0].unlocked=!0)}},rest(){t.explorer.energy=t.explorer.maxEnergy},renameExplorer(r){r.trim()&&(t.explorer.name=r.trim())}},v=b("zones"),m=b(""),x=b(!1),g=b("");function C(r){const e=t.explorer.level;p.enterZone(r);const s=c.currentZone.value;if(s){const d=t.explorer.level>e;g.value=d?`🎉 升级了！当前等级 Lv.${t.explorer.level}`:`🍂 在${s.name}探索了一圈`,setTimeout(()=>{p.leaveZone(),g.value=""},1500)}}const z=r=>({普通:"#6b7280",稀有:"#3b82f6",史诗:"#8b5cf6",传说:"#f59e0b"})[r]||"#6b7280";return(r,e)=>(a(),l("div",L,[e[17]||(e[17]=n("h4",null,"🌳 Overmind 分形状态管理",-1)),e[18]||(e[18]=n("p",null,"秋日森林大地图 — 演示 Overmind 的分形状态结构：state / getters / actions",-1)),n("div",N,[n("div",M,[e[8]||(e[8]=n("div",{class:"avatar"},"🍂",-1)),n("div",null,[n("div",V,[n("strong",null,o(t.explorer.name),1),n("span",B,"Lv."+o(t.explorer.level),1)]),n("div",P,[n("div",{class:"exp-fill",style:f({width:c.expProgress.value+"%"})},null,4),n("span",R,o(t.explorer.experience)+" / "+o(c.expToNextLevel.value)+" EXP",1)])])]),n("div",S,[e[9]||(e[9]=n("div",{class:"energy-label"},"⚡ 体力",-1)),n("div",A,o(t.explorer.energy)+" / "+o(t.explorer.maxEnergy),1),n("button",{onClick:e[0]||(e[0]=s=>p.rest()),disabled:t.explorer.energy===t.explorer.maxEnergy},"休息",8,D)])]),g.value?(a(),l("div",F,o(g.value),1)):y("",!0),n("div",K,[n("button",{class:_({active:v.value==="zones"}),onClick:e[1]||(e[1]=s=>v.value="zones")}," 🗺️ 森林区域 ",2),n("button",{class:_({active:v.value==="inventory"}),onClick:e[2]||(e[2]=s=>v.value="inventory")}," 🎒 背包 ",2),n("button",{class:_({active:v.value==="structure"}),onClick:e[3]||(e[3]=s=>v.value="structure")}," 🏗️ 状态结构 ",2)]),v.value==="zones"?(a(),l("div",U,[e[10]||(e[10]=n("p",{class:"section-hint"},"点击已解锁区域进行探索（消耗10体力）",-1)),n("div",G,[(a(!0),l(k,null,h(t.zones,s=>(a(),l("div",{key:s.id,class:_(["zone-card",{unlocked:s.unlocked,locked:!s.unlocked,active:t.currentZoneId===s.id}])},[n("div",X,o(s.unlocked?s.id==="maple"?"🍁":s.id==="deep"?"🌲":s.id==="river"?"🏞️":"⛰️":"🔒"),1),n("h5",j,o(s.unlocked?s.name:"???"),1),n("p",q,o(s.unlocked?s.description:"升级解锁新区域"),1),s.unlocked?(a(),l("div",H,[n("span",null,"已访问 "+o(s.visitCount)+" 次",1)])):y("",!0),s.unlocked?(a(),l("div",J,[(a(!0),l(k,null,h(s.features,d=>(a(),l("span",{key:d,class:"feature-tag"},o(d),1))),128))])):y("",!0),s.unlocked?(a(),l("button",{key:2,class:"explore-btn",onClick:d=>C(s.id),disabled:t.explorer.energy<10},o(t.explorer.energy<10?"体力不足":"探索 (-10体力)"),9,Q)):y("",!0)],2))),128))]),n("div",W,[T(n("input",{"onUpdate:modelValue":e[4]||(e[4]=s=>m.value=s),placeholder:"修改探险家名字...",onKeyup:e[5]||(e[5]=O(s=>{p.renameExplorer(m.value),m.value=""},["enter"]))},null,544),[[w,m.value]]),n("button",{onClick:e[6]||(e[6]=s=>{p.renameExplorer(m.value),m.value=""})},"修改名字")])])):v.value==="inventory"?(a(),l("div",Y,[n("div",ee,[n("div",ne,[n("span",te,o(t.inventory.length),1),e[11]||(e[11]=n("span",{class:"stat-label"},"物品种类",-1))]),n("div",se,[n("span",re,o(t.inventory.reduce((s,d)=>s+d.count,0)),1),e[12]||(e[12]=n("span",{class:"stat-label"},"物品总数",-1))]),n("div",oe,[n("span",le,o(c.rareItems.value.length),1),e[13]||(e[13]=n("span",{class:"stat-label"},"稀有以上",-1))]),n("div",ae,[n("span",ie,o(c.inventoryValue.value),1),e[14]||(e[14]=n("span",{class:"stat-label"},"收藏价值",-1))])]),n("div",de,[(a(!0),l(k,null,h(c.inventoryByType.value,(s,d)=>(a(),l("div",{key:d,class:"type-group"},[n("h6",ce,o(d),1),n("div",ve,[(a(!0),l(k,null,h(s,i=>(a(),l("div",{key:i.id,class:"item-card",style:f({borderColor:z(i.rarity)+"40"})},[n("div",pe,o(i.type==="植物"?"🌿":i.type==="矿石"?"💎":"🍄"),1),n("div",ue,[n("div",{class:"item-name",style:f({color:z(i.rarity)})},o(i.name),5),n("div",{class:"item-rarity",style:f({color:z(i.rarity)})},o(i.rarity),5)]),n("div",me,"×"+o(i.count),1)],4))),128))])]))),128))])])):(a(),l("div",ye,[...e[15]||(e[15]=[Z('<h5>🏗️ Overmind 分形状态结构</h5><p class="section-desc">Overmind 将状态组织成分形结构：每个模块都有自己的 state / getters / actions</p><div class="structure-tree"><div class="tree-node root"><span class="node-label">app (根模块)</span><div class="node-children"><div class="tree-node"><span class="node-label state">state</span><div class="node-children"><div class="tree-leaf"><span>explorer</span></div><div class="tree-leaf"><span>zones[]</span></div><div class="tree-leaf"><span>inventory[]</span></div><div class="tree-leaf"><span>currentZoneId</span></div></div></div><div class="tree-node"><span class="node-label getter">getters</span><div class="node-children"><div class="tree-leaf"><span>currentZone</span></div><div class="tree-leaf"><span>unlockedZones</span></div><div class="tree-leaf"><span>totalVisits</span></div><div class="tree-leaf"><span>expProgress</span></div><div class="tree-leaf"><span>inventoryByType</span></div></div></div><div class="tree-node"><span class="node-label action">actions</span><div class="node-children"><div class="tree-leaf"><span>enterZone()</span></div><div class="tree-leaf"><span>collectItem()</span></div><div class="tree-leaf"><span>gainExp()</span></div><div class="tree-leaf"><span>rest()</span></div></div></div></div></div></div><div class="structure-info"><div class="info-card"><h6>📦 模块化</h6><p>状态按功能模块划分，每个模块独立管理自己的 state、getters、actions</p></div><div class="info-card"><h6>🔄 可组合</h6><p>模块可以嵌套组合，形成分形结构，大应用也能清晰组织</p></div><div class="info-card"><h6>🧩 可复用</h6><p>相同模式的模块可以复用，支持多实例状态管理</p></div></div>',4)])])),n("div",xe,[n("button",{onClick:e[7]||(e[7]=s=>x.value=!x.value)},o(x.value?"收起代码":"查看 Overmind 代码"),1)]),x.value?(a(),l("div",ge,[...e[16]||(e[16]=[n("pre",null,[n("code",null,`// Overmind: 分形状态管理
import { createOvermind } from 'overmind'
import { createMixin } from 'overmind-vue'

// 1. 定义状态模块
const config = {
  state: {
    explorer: { name: '秋日探险家', level: 2, energy: 80 },
    zones: [],
    inventory: [],
  },
  getters: {
    currentZone: ({ state }) => 
      state.zones.find(z => z.id === state.currentZoneId),
    unlockedZones: ({ state }) => 
      state.zones.filter(z => z.unlocked),
    expProgress: ({ state }) => 
      Math.round((state.explorer.experience / (state.explorer.level * 200)) * 100),
    inventoryByType: ({ state }) => {
      const map = {}
      state.inventory.forEach(item => {
        if (!map[item.type]) map[item.type] = []
        map[item.type].push(item)
      })
      return map
    },
  },
  actions: {
    enterZone: ({ state, actions }, zoneId) => {
      const zone = state.zones.find(z => z.id === zoneId)
      if (zone && zone.unlocked && state.explorer.energy >= 10) {
        state.currentZoneId = zoneId
        state.explorer.energy -= 10
        zone.visitCount++
        actions.gainExp(5)
        actions.collectRandomItem()
      }
    },
    gainExp: ({ state, getters }, amount) => {
      state.explorer.experience += amount
      while (state.explorer.experience >= getters.expToNextLevel) {
        state.explorer.experience -= getters.expToNextLevel
        state.explorer.level++
      }
    },
    rest: ({ state }) => {
      state.explorer.energy = state.explorer.maxEnergy
    },
  },
}

// 2. 创建实例
const overmind = createOvermind(config)

// 3. 组件中使用
import { useOvermind } from 'overmind-vue'

export default {
  setup() {
    const { state, actions, getters } = useOvermind()
    return { state, actions, getters }
  }
}`)],-1)])])):y("",!0),e[19]||(e[19]=Z('<div class="knowledge-points"><h5>💡 知识点</h5><ul><li><strong>分形结构</strong>：每个模块都有 state / getters / actions，结构一致可嵌套</li><li><strong>模块化组织</strong>：按功能域划分模块，大型应用状态更清晰</li><li><strong>派生状态</strong>：getters 支持同步/异步，可依赖其他 getters</li><li><strong>动作追踪</strong>：内置 devtools，支持时间旅行和动作重放</li><li><strong>框架无关</strong>：核心独立，可适配 React / Vue / Angular 等</li><li><strong>效果系统</strong>：effects 层处理副作用（API、路由、存储等），逻辑更清晰</li></ul></div>',1))]))}});export{ke as default};
