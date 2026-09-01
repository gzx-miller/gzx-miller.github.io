import{d as n,b as o,e,f as t,M as a,r,o as d,I as u}from"./DutfXOOr.js";const i={class:"demo-card sass-demo"},p=n({__name:"SC06Selectors",setup(m){const l=r(!1);return(f,s)=>(d(),o("div",i,[e("button",{class:a(["lesson-card",{active:l.value}]),onClick:s[0]||(s[0]=v=>l.value=!l.value)},[s[1]||(s[1]=e("span",null,"🌰",-1)),s[2]||(s[2]=e("strong",null,"父选择器 &",-1)),e("small",null,t(l.value?"已选中":"点击选中"),1)],2),s[3]||(s[3]=e("pre",null,`.lesson-card {
  &:hover { ... }
  &--featured { ... }
  [dir="rtl"] & { ... }
}`,-1)),s[4]||(s[4]=e("small",null,"& 代表当前复合选择器，可生成伪类、BEM 后缀或上下文规则；插值适合生成名称，但过度动态化会降低可搜索性。",-1))]))}}),S=u(p,[["__scopeId","data-v-f277332a"]]);export{S as default};
