import{d as b,b as l,e as s,M as d,v as n,K as u,L as v,z as m,A as c,a0 as g,r as p,g as y,o,I as f}from"./DutfXOOr.js";const $={class:"demo-card sass-demo"},S={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},C={style:{display:"flex",gap:"16px"}},M={style:{flex:"1"}},k={key:0},V={key:1},_={key:2},N=`<span style="color:#7c7c99">// _variables.scss — 编译期变量</span>
$accent: #c45125;
$radius: 12px;
$spacing: 16px;

<span style="color:#7c7c99">// 使用</span>
.course {
  color: $accent;
  border-radius: $radius;
  padding: $spacing;
}

<span style="color:#7c7c99">// Sass 变量 vs CSS 变量</span>
$accent: #c45125;           <span style="color:#8a8a3a">// 编译期，不可运行时改</span>
:root { --accent: #c45125; } <span style="color:#8a8a3a">// 运行时，可 JS 动态改</span>`,T=`<span style="color:#7c7c99">// ✅ 浅层嵌套（推荐）</span>
.course {
  border-radius: $radius;
  
  &__title { font-size: 1.25rem; }
  &__desc  { color: #805f4d; }
  
  &:hover { box-shadow: 0 8px 24px rgba(0,0,0,.1); }
}

<span style="color:#7c7c99">// ❌ 过深嵌套（不推荐）</span>
.page {
  .main {
    .list {
      .item {
        .title { color: red; }  <span style="color:#e85d04">// 5 层！特异性爆炸</span>
      }
    }
  }
}`,w=`<span style="color:#7c7c99">// 定义 Mixin — 可复用的样式块</span>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin card($radius: 8px, $shadow: true) {
  border-radius: $radius;
  background: #fff;
  @if $shadow {
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
  }
}

<span style="color:#7c7c99">// 使用</span>
.modal { @include flex-center; }
.product { @include card(12px); }
.banner { @include card(16px, false); }

<span style="color:#7c7c99">// 函数 — 返回单个值</span>
@function spacing($n) { @return $n * 8px; }
.list { gap: spacing(2); }  <span style="color:#8a8a3a">// 16px</span>`,z=b({__name:"SC01VariablesNesting",setup(B){const e=p("vars"),i=p("#c45125"),r=p(12),x=y(()=>({"--accent":i.value,"--radius":`${r.value}px`}));return(L,a)=>(o(),l("div",$,[a[11]||(a[11]=s("h3",null,"Sass 变量、嵌套与 Mixin",-1)),s("div",S,[s("button",{class:d(["tab-btn",{active:e.value==="vars"}]),onClick:a[0]||(a[0]=t=>e.value="vars")},"变量",2),s("button",{class:d(["tab-btn",{active:e.value==="nest"}]),onClick:a[1]||(a[1]=t=>e.value="nest")},"嵌套",2),s("button",{class:d(["tab-btn",{active:e.value==="mixin"}]),onClick:a[2]||(a[2]=t=>e.value="mixin")},"Mixin/函数",2)]),s("div",C,[s("div",M,[e.value==="vars"?(o(),l("div",k,[a[8]||(a[8]=s("h4",null,"实时预览",-1)),s("label",null,[a[5]||(a[5]=n("主题色 ",-1)),u(s("input",{"onUpdate:modelValue":a[3]||(a[3]=t=>i.value=t),type:"color"},null,512),[[v,i.value]])]),s("label",null,[a[6]||(a[6]=n("圆角 ",-1)),u(s("input",{"onUpdate:modelValue":a[4]||(a[4]=t=>r.value=t),type:"range",min:"0",max:"24"},null,512),[[v,r.value,void 0,{number:!0}]])]),s("article",{class:"course",style:m(x.value)},[...a[7]||(a[7]=[s("strong",null,"Sass 基础",-1),s("p",null,"变量集中表达复用值，修改一处全局生效。",-1),s("button",null,"加入课程",-1)])],4),s("pre",{class:"mini-code",innerHTML:N,style:{"margin-top":"10px"}})])):c("",!0),e.value==="nest"?(o(),l("div",V,[s("pre",{class:"mini-code",innerHTML:T}),a[9]||(a[9]=s("div",{class:"tips-box"},[s("p",null,[s("strong",null,"嵌套规则：")]),s("ul",null,[s("li",null,[s("code",null,"&"),n(" 表示父选择器，常用于 BEM 命名")]),s("li",null,"嵌套不超过 3 层，否则特异性和耦合过高"),s("li",null,[n("伪类、伪元素和修饰符用 "),s("code",null,"&:hover"),n(),s("code",null,"&__title")])])],-1))])):c("",!0),e.value==="mixin"?(o(),l("div",_,[s("pre",{class:"mini-code",innerHTML:w}),a[10]||(a[10]=g('<div class="tips-box" data-v-ab6c297e><p data-v-ab6c297e><strong data-v-ab6c297e>Mixin vs 函数 vs 占位符：</strong></p><ul data-v-ab6c297e><li data-v-ab6c297e><strong data-v-ab6c297e>@mixin</strong>：复用样式块，可传参（<code data-v-ab6c297e>@include</code>）</li><li data-v-ab6c297e><strong data-v-ab6c297e>@function</strong>：返回单个值（计算逻辑）</li><li data-v-ab6c297e><strong data-v-ab6c297e>%placeholder</strong>：类似 mixin 但用 <code data-v-ab6c297e>@extend</code>，不产生重复 CSS</li></ul></div>',1))])):c("",!0)])]),a[12]||(a[12]=s("div",{class:"tips-box",style:{"margin-top":"10px"}},[s("p",null,[s("strong",null,"关键区别："),n("Sass 变量在"),s("strong",null,"编译期"),n("固定（改了需重新构建）；CSS 变量在"),s("strong",null,"运行时"),n("可改（JS 可动态设置，适合主题切换）。")])],-1))]))}}),E=f(z,[["__scopeId","data-v-ab6c297e"]]);export{E as default};
