import{d as N,b as i,e as t,f as o,z as b,M as y,F as f,E as x,K as L,L as P,aG as $,A as _,a0 as B,ah as E,r as u,g as F,o as r,I as T}from"./DutfXOOr.js";const X={class:"demo-card"},S={class:"profile-bar"},O={class:"profile-info"},R={class:"name-row"},V={class:"level-badge"},z={class:"exp-bar"},K={class:"exp-text"},A={class:"energy-box"},D={class:"energy-value"},G=["disabled"],H={class:"tab-row"},U={key:0,class:"explore-section"},j={class:"explore-area"},q={class:"explore-scene"},J=["disabled"],Q={class:"explore-log"},W={key:0,class:"empty-log"},Y={key:1,class:"log-list"},Z={class:"name-edit"},ee={key:1,class:"collection-section"},te={class:"filter-row"},se=["onClick"],ne={class:"progress-text"},oe={class:"progress-bar"},ie={class:"collection-grid"},re={class:"item-icon"},ae={class:"item-name"},le={class:"item-type"},de={key:0,class:"item-count"},ce={key:1,class:"item-desc"},ve={key:2,class:"stats-section"},ue={class:"stat-grid"},pe={class:"stat-card"},me={class:"stat-num"},ye={class:"stat-card"},ge={class:"stat-num"},he={class:"stat-card"},be={class:"stat-num"},fe={class:"stat-card"},xe={class:"stat-num"},_e={class:"type-stats"},ke={class:"type-list"},Ee={class:"type-name"},Ce={class:"type-bar"},we={class:"type-count"},Me={class:"code-toggle"},Ie={key:3,class:"code-block"},Ne=N({__name:"S23Mobx",setup(Le){class C{items=E([{id:1,name:"枫叶",type:"植物",rarity:"普通",discovered:!0,count:24,description:"秋日最常见的红叶"},{id:2,name:"松鼠",type:"动物",rarity:"普通",discovered:!0,count:5,description:"林间穿梭的小精灵"},{id:3,name:"橡树果",type:"植物",rarity:"普通",discovered:!0,count:12,description:"小松鼠的最爱"},{id:4,name:"红蘑菇",type:"蘑菇",rarity:"稀有",discovered:!0,count:3,description:"色彩鲜艳的毒蘑菇"},{id:5,name:"琥珀",type:"矿石",rarity:"史诗",discovered:!1,count:0,description:"封存远古记忆的宝石"},{id:6,name:"白狐",type:"动物",rarity:"传说",discovered:!1,count:0,description:"传说中的森林守护者"},{id:7,name:"灵芝",type:"植物",rarity:"稀有",discovered:!1,count:0,description:"珍贵的药用菌类"},{id:8,name:"水晶",type:"矿石",rarity:"稀有",discovered:!0,count:2,description:"晶莹剔透的矿石"},{id:9,name:"鹿",type:"动物",rarity:"稀有",discovered:!0,count:1,description:"优雅的森林居民"},{id:10,name:"人参",type:"植物",rarity:"史诗",discovered:!1,count:0,description:"百草之王"}]);explorerName="秋日探险家";energy=100;maxEnergy=100;level=3;experience=240;nextLevelExp=500;get discoveredCount(){return this.items.filter(e=>e.discovered).length}get totalCount(){return this.items.length}get discoveryProgress(){return Math.round(this.discoveredCount/this.totalCount*100)}get discoveredItems(){return this.items.filter(e=>e.discovered)}get rareItems(){return this.items.filter(e=>e.discovered&&(e.rarity==="稀有"||e.rarity==="史诗"||e.rarity==="传说"))}get itemsByType(){const e={};return this.items.forEach(s=>{e[s.type]||(e[s.type]=[]),e[s.type].push(s)}),e}get totalCollected(){return this.items.reduce((e,s)=>e+s.count,0)}get expProgress(){return Math.round(this.experience/this.nextLevelExp*100)}discoverItem(e){if(this.energy<10)return!1;const s=this.items.find(a=>a.id===e);return s?(this.energy-=10,s.discovered?(s.count++,this.gainExp(2)):(s.discovered=!0,s.count=1,this.gainExp(s.rarity==="传说"?100:s.rarity==="史诗"?50:s.rarity==="稀有"?20:5)),!0):!1}gainExp(e){for(this.experience+=e;this.experience>=this.nextLevelExp;)this.experience-=this.nextLevelExp,this.level++,this.nextLevelExp=Math.round(this.nextLevelExp*1.5),this.maxEnergy+=20,this.energy=this.maxEnergy}rest(){this.energy=this.maxEnergy}setName(e){this.explorerName=e}}const n=E(new C),l=u("explore"),g=u("全部"),p=u(""),h=u(!1),c=u([]),m=u(!1),w=F(()=>g.value==="全部"?n.items:n.itemsByType[g.value]||[]),M=v=>({普通:"#6b7280",稀有:"#3b82f6",史诗:"#8b5cf6",传说:"#f59e0b"})[v]||"#6b7280";async function I(){if(n.energy<10||m.value)return;m.value=!0,await new Promise(d=>setTimeout(d,800));const v=n.items.filter(d=>!d.discovered),e=v.length>0&&Math.random()>.4?v:n.items,s=e[Math.floor(Math.random()*e.length)],a=!s.discovered;n.discoverItem(s.id),a?c.value.unshift(`🎉 发现新物种：${s.name}（${s.rarity}）！`):c.value.unshift(`🍂 又发现了 ${s.name}`),c.value.length>8&&c.value.pop(),m.value=!1}function k(){p.value.trim()&&(n.setName(p.value.trim()),p.value="")}return(v,e)=>(r(),i("div",X,[e[17]||(e[17]=t("h4",null,"🌲 MobX 响应式状态与 Observable",-1)),e[18]||(e[18]=t("p",null,"秋日森林图鉴 — 模拟 MobX 的 observable、action、computed 响应式模型",-1)),t("div",S,[t("div",O,[e[6]||(e[6]=t("div",{class:"avatar"},"🦊",-1)),t("div",null,[t("div",R,[t("strong",null,o(n.explorerName),1),t("span",V,"Lv."+o(n.level),1)]),t("div",z,[t("div",{class:"exp-fill",style:b({width:n.expProgress+"%"})},null,4),t("span",K,o(n.experience)+" / "+o(n.nextLevelExp)+" EXP",1)])])]),t("div",A,[e[7]||(e[7]=t("div",{class:"energy-label"},"⚡ 体力",-1)),t("div",D,o(n.energy)+" / "+o(n.maxEnergy),1),t("button",{onClick:e[0]||(e[0]=s=>n.rest()),disabled:n.energy===n.maxEnergy},"休息恢复",8,G)])]),t("div",H,[t("button",{class:y({active:l.value==="explore"}),onClick:e[1]||(e[1]=s=>l.value="explore")}," 🔍 探索 ",2),t("button",{class:y({active:l.value==="collection"}),onClick:e[2]||(e[2]=s=>l.value="collection")}," 📖 图鉴 ",2),t("button",{class:y({active:l.value==="stats"}),onClick:e[3]||(e[3]=s=>l.value="stats")}," 📊 统计 ",2)]),l.value==="explore"?(r(),i("div",U,[t("div",j,[t("div",q,[e[8]||(e[8]=t("div",{class:"scene-decor"},"🍂 🌲 🍄 🌿 🦊 🍁 🌲",-1)),t("button",{class:"explore-btn",onClick:I,disabled:n.energy<10||m.value},o(m.value?"探索中...":n.energy<10?"体力不足":"🌿 开始探索 (-10体力)"),9,J),e[9]||(e[9]=t("p",{class:"explore-hint"},"在秋日森林中寻找各种动植物和矿石",-1))])]),t("div",Q,[e[10]||(e[10]=t("h5",null,"📜 探索日志",-1)),c.value.length===0?(r(),i("div",W,"还没有探索记录，去探索吧~")):(r(),i("div",Y,[(r(!0),i(f,null,x(c.value,(s,a)=>(r(),i("div",{key:a,class:"log-item"},o(s),1))),128))]))]),t("div",Z,[L(t("input",{"onUpdate:modelValue":e[4]||(e[4]=s=>p.value=s),placeholder:"修改探险家名称...",onKeyup:$(k,["enter"])},null,544),[[P,p.value]]),t("button",{onClick:k},"修改名称")])])):l.value==="collection"?(r(),i("div",ee,[t("div",te,[(r(),i(f,null,x(["全部","植物","动物","矿石","蘑菇"],s=>t("button",{key:s,class:y([{active:g.value===s},"filter-btn"]),onClick:a=>g.value=s},o(s),11,se)),64)),t("span",ne," 发现进度: "+o(n.discoveredCount)+" / "+o(n.totalCount)+" ("+o(n.discoveryProgress)+"%) ",1)]),t("div",oe,[t("div",{class:"progress-fill",style:b({width:n.discoveryProgress+"%"})},null,4)]),t("div",ie,[(r(!0),i(f,null,x(w.value,s=>(r(),i("div",{key:s.id,class:y(["item-card",{discovered:s.discovered,locked:!s.discovered}])},[t("div",{class:"item-rarity",style:b({background:M(s.rarity)})},o(s.rarity),5),t("div",re,o(s.discovered?s.type==="植物"?"🌿":s.type==="动物"?"🦊":s.type==="矿石"?"💎":"🍄":"❓"),1),t("div",ae,o(s.discovered?s.name:"???"),1),t("div",le,o(s.type),1),s.discovered?(r(),i("div",de,"已收集 ×"+o(s.count),1)):_("",!0),s.discovered?(r(),i("div",ce,o(s.description),1)):_("",!0)],2))),128))])])):(r(),i("div",ve,[t("div",ue,[t("div",pe,[t("span",me,o(n.discoveredCount),1),e[11]||(e[11]=t("span",{class:"stat-label"},"已发现物种",-1))]),t("div",ye,[t("span",ge,o(n.discoveryProgress)+"%",1),e[12]||(e[12]=t("span",{class:"stat-label"},"图鉴完成度",-1))]),t("div",he,[t("span",be,o(n.totalCollected),1),e[13]||(e[13]=t("span",{class:"stat-label"},"总收集数",-1))]),t("div",fe,[t("span",xe,o(n.rareItems.length),1),e[14]||(e[14]=t("span",{class:"stat-label"},"稀有以上",-1))])]),t("div",_e,[e[15]||(e[15]=t("h5",null,"📂 分类统计",-1)),t("div",ke,[(r(!0),i(f,null,x(n.itemsByType,(s,a)=>(r(),i("div",{key:a,class:"type-row"},[t("span",Ee,o(a),1),t("div",Ce,[t("div",{class:"type-fill",style:b({width:Math.round(s.filter(d=>d.discovered).length/s.length*100)+"%"})},null,4)]),t("span",we,o(s.filter(d=>d.discovered).length)+" / "+o(s.length),1)]))),128))])])])),t("div",Me,[t("button",{onClick:e[5]||(e[5]=s=>h.value=!h.value)},o(h.value?"收起代码":"查看 MobX 代码"),1)]),h.value?(r(),i("div",Ie,[...e[16]||(e[16]=[t("pre",null,[t("code",null,`// MobX: observable + action + computed
import { makeObservable, observable, action, computed } from 'mobx'

class ForestExplorer {
  items: ForestItem[] = []
  explorerName = '秋日探险家'
  energy = 100
  level = 3

  constructor() {
    makeObservable(this, {
      items: observable,
      explorerName: observable,
      energy: observable,
      level: observable,
      
      discoveredCount: computed,
      discoveryProgress: computed,
      rareItems: computed,
      itemsByType: computed,
      
      discoverItem: action,
      gainExp: action,
      rest: action,
      setName: action,
    })
  }

  get discoveredCount() {
    return this.items.filter(i => i.discovered).length
  }

  get discoveryProgress() {
    return Math.round((this.discoveredCount / this.items.length) * 100)
  }

  get itemsByType() {
    const map: Record<string, ForestItem[]> = {}
    this.items.forEach(item => {
      if (!map[item.type]) map[item.type] = []
      map[item.type].push(item)
    })
    return map
  }

  discoverItem(id: number) {
    if (this.energy < 10) return false
    const item = this.items.find(i => i.id === id)
    if (!item) return false
    this.energy -= 10
    if (!item.discovered) {
      item.discovered = true
      item.count = 1
      this.gainExp(50)
    } else {
      item.count++
    }
    return true
  }

  gainExp(amount: number) {
    this.experience += amount
    if (this.experience >= this.nextLevelExp) {
      this.level++
      this.experience = 0
    }
  }

  rest() {
    this.energy = this.maxEnergy
  }
}

// React 组件中使用（observer HOC）
import { observer } from 'mobx-react-lite'

const ExplorerPanel = observer(() => {
  const store = useForestStore()
  return (
    <div>
      <h3>{store.explorerName}</h3>
      <p>进度: {store.discoveryProgress}%</p>
      <button onClick={() => store.discoverItem(1)}>探索</button>
    </div>
  )
})`)],-1)])])):_("",!0),e[19]||(e[19]=B('<div class="knowledge-points" data-v-73123f34><h5 data-v-73123f34>💡 知识点</h5><ul data-v-73123f34><li data-v-73123f34><strong data-v-73123f34>Observable</strong>：可观察状态，使用 <code data-v-73123f34>observable</code> 标记，修改时自动通知</li><li data-v-73123f34><strong data-v-73123f34>Computed</strong>：派生值，使用 <code data-v-73123f34>computed</code> 定义，自动缓存和追踪依赖</li><li data-v-73123f34><strong data-v-73123f34>Action</strong>：状态修改方法，使用 <code data-v-73123f34>action</code> 标记，统一管理状态变更</li><li data-v-73123f34><strong data-v-73123f34>响应式追踪</strong>：MobX 自动追踪函数中访问的 observable，变化时重新执行</li><li data-v-73123f34><strong data-v-73123f34>observer</strong>：React 组件用 <code data-v-73123f34>observer</code> 包裹，自动响应 observable 变化</li><li data-v-73123f34><strong data-v-73123f34>面向对象</strong>：MobX 倾向于面向对象风格，状态和逻辑封装在类中</li></ul></div>',1))]))}}),$e=T(Ne,[["__scopeId","data-v-73123f34"]]);export{$e as default};
