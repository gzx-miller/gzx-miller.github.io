import{d as p,b as i,e as t,F as v,E as f,f as V,v as g,o as a,M as k,I as b}from"./DutfXOOr.js";const C={class:"demo-card"},M={class:"demo-section"},_={class:"rating-row"},x=["onClick"],I={class:"rating-value"},h={class:"title-row"},y=["value"],B=p({__name:"K22CustomVModel",props:{modelValue:{},title:{},titleModifiers:{}},emits:["update:modelValue","update:title"],setup(l,{emit:d}){const r=l,n=d,u=[1,2,3,4,5];function m(s){n("update:modelValue",s)}function c(s){let e=s.target.value;r.titleModifiers?.trim&&(e=e.trim()),n("update:title",e)}return(s,e)=>(a(),i("div",C,[e[3]||(e[3]=t("h3",null,"自定义 v-model",-1)),e[4]||(e[4]=t("div",{class:"usage-section"},[t("h4",null,"父组件使用"),t("pre",{class:"code-block"},`<RatingSelector
  v-model="rating"          <!-- 默认 modelValue -->
  v-model:title.trim="name" <!-- 命名 model + 修饰符 -->
/>`)],-1)),t("div",M,[e[2]||(e[2]=t("h4",null,"评分选择器（子组件）",-1)),t("div",_,[(a(),i(v,null,f(u,o=>t("span",{key:o,class:k(["star",{active:o<=l.modelValue}]),onClick:E=>m(o)},"★",10,x)),64)),t("span",I,V(l.modelValue)+" 分",1)]),t("div",h,[t("label",null,[e[0]||(e[0]=g("标题 ",-1)),t("input",{value:l.title,onInput:c,placeholder:"输入标题"},null,40,y)]),e[1]||(e[1]=t("span",{class:"modifier-hint"},".trim 修饰符已启用",-1))])]),e[5]||(e[5]=t("div",{class:"key-points"},[t("h4",null,"关键代码"),t("pre",{class:"code-block"},`// 子组件定义
const props = defineProps<{
  modelValue: number           // v-model 默认绑定
  title: string                // v-model:title 命名绑定
  titleModifiers?: { trim?: boolean }  // 修饰符对象
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]  // 默认更新事件
  'update:title': [value: string]       // 命名更新事件
}>()`)],-1))]))}}),F=b(B,[["__scopeId","data-v-74158e97"]]);export{F as default};
