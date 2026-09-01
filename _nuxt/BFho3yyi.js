import{a as p}from"./BIj4yoEM.js";import{E as i}from"./DGJd1Aqu.js";import"./D9Wr7_iM.js";import{d as s,b as d,e as o,p as e,q as l,y as n,f as m,o as a,v as r}from"./DutfXOOr.js";import"./DHVfMpi6.js";import"./BsnBu67b.js";import"./CqPcjWQ5.js";import"./C8fXM7kb.js";import"./BK7kFwQP.js";import"./Bbje_1GQ.js";import"./BBvcQwod.js";import"./DCTLXrZ8.js";import"./IKbbVouS.js";import"./DR0Edt-E.js";const u={class:"demo-card"},f={class:"direction-row"},E={class:"trigger-row"},g=`// ElTooltip 关键属性
<ElTooltip
  content="提示内容"     // 文本内容
  placement="top"        // 方向：top/bottom/left/right
  trigger="hover"        // 触发：hover/click
  :hide-after="2000"     // 自动隐藏延迟
>
  <ElButton>触发元素</ElButton>
</ElTooltip>

// 富内容使用 #content 插槽
<ElTooltip placement="top">
  <template #content>
    <div>多行<br/>提示内容</div>
  </template>
  <ElButton>富内容提示</ElButton>
</ElTooltip>`,j=s({__name:"E12Tooltip",setup(v){return(y,t)=>(a(),d("div",u,[t[8]||(t[8]=o("h3",null,"工具提示 Tooltip",-1)),t[9]||(t[9]=o("h4",null,"不同方向",-1)),o("div",f,[e(n(p),{content:"上方提示：课程评分 4.8",placement:"top"},{default:l(()=>[e(n(i),null,{default:l(()=>[...t[0]||(t[0]=[r("上方",-1)])]),_:1})]),_:1}),e(n(p),{content:"右侧提示：已报名 128 人",placement:"right"},{default:l(()=>[e(n(i),{type:"primary"},{default:l(()=>[...t[1]||(t[1]=[r("右侧",-1)])]),_:1})]),_:1}),e(n(p),{content:"下方提示：课程时长 12 课时",placement:"bottom"},{default:l(()=>[e(n(i),{type:"success"},{default:l(()=>[...t[2]||(t[2]=[r("下方",-1)])]),_:1})]),_:1}),e(n(p),{content:"左侧提示：讲师认证",placement:"left"},{default:l(()=>[e(n(i),{type:"warning"},{default:l(()=>[...t[3]||(t[3]=[r("左侧",-1)])]),_:1})]),_:1})]),t[10]||(t[10]=o("h4",null,"点击触发 & 富内容",-1)),o("div",E,[e(n(p),{content:"点击后显示的提示信息",trigger:"click"},{default:l(()=>[e(n(i),{type:"info"},{default:l(()=>[...t[4]||(t[4]=[r("点击触发",-1)])]),_:1})]),_:1}),e(n(p),{placement:"top"},{content:l(()=>[...t[5]||(t[5]=[o("div",{class:"rich-tip"},[o("strong",null,"课程详情"),o("p",null,"讲师：李老师"),o("p",null,"评分：4.8 / 5.0"),o("p",null,"学员：128 人")],-1)])]),default:l(()=>[e(n(i),{type:"primary"},{default:l(()=>[...t[6]||(t[6]=[r("富内容提示",-1)])]),_:1})]),_:1})]),o("div",{class:"code-section"},[t[7]||(t[7]=o("h4",null,"关键代码",-1)),o("pre",{class:"code-block"},m(g))])]))}});export{j as default};
