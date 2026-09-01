import{d as c,b as r,e,F as u,E as m,f as o,g as p,o as i,M as b,r as f}from"./DutfXOOr.js";const v={class:"demo-card"},_={class:"button-row"},g=["onClick"],h={class:"code-block"},w=c({__name:"T17DeclarationFiles",setup(y){const n=[{id:"ambient",title:"环境模块声明",desc:"为无类型的 JS 库补充类型定义",code:`// lodash.d.ts
declare module 'lodash' {
  export function debounce<T extends (...args: any[]) => any>(
    fn: T, wait?: number
  ): T & { cancel(): void }
  export function cloneDeep<T>(value: T): T
}`},{id:"global",title:"全局增强 (declare global)",desc:"扩展 Window、HTMLElement 等内置接口",code:`// global.d.ts
export {}
declare global {
  interface Window {
    __APP_ENV__: 'dev' | 'prod'
    analytics: { track(event: string): void }
  }
  interface HTMLElement {
    dataset: DOMStringMap & { courseId?: string }
  }
}`},{id:"triple-slash",title:"三斜线指令",desc:"引用其他声明文件或 lib，适用于旧式项目",code:`/// <reference path="./vendor.d.ts" />
/// <reference types="node" />
/// <reference lib="dom.iterable" />

// 在现代项目中，优先使用 tsconfig 的
// "types" 和 "lib" 字段替代三斜线指令`},{id:"shorthand",title:"模块简写声明",desc:'快速告诉 TS "这个模块存在"，无需详细类型',code:`// 仅声明模块可被导入，所有导出为 any
declare module 'legacy-chart-lib'

// 使用
import { drawChart } from 'legacy-chart-lib'
drawChart('#container', data) // 无类型检查`}],l=f("ambient"),d=p(()=>n.find(s=>s.id===l.value));return(s,t)=>(i(),r("div",v,[t[0]||(t[0]=e("h4",null,"声明文件与全局增强",-1)),e("div",_,[(i(),r(u,null,m(n,a=>e("button",{key:a.id,class:b({active:l.value===a.id}),onClick:T=>l.value=a.id},o(a.title),11,g)),64))]),e("p",null,[e("strong",null,o(d.value.desc),1)]),e("pre",h,o(d.value.code),1),t[1]||(t[1]=e("small",null,".d.ts 文件只包含类型信息，不产生运行时代码；declare module 为 JS 库补类型，declare global 扩展全局对象",-1))]))}});export{w as default};
