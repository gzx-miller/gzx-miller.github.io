import{d as b,b as l,e,M as i,f as c,A as g,r as m,g as k,o as p}from"./DutfXOOr.js";const x={class:"demo-card"},_={class:"button-row"},S={class:"code-block"},$={key:0};var r;(a=>{function o(s){return`${s.title}（${s.level==="beginner"?"入门":"进阶"}）`}a.formatCourse=o})(r||(r={}));const A=`namespace CourseApp {
  export interface Course { id: number; title: string }
  export function format(c: Course): string { ... }
}
// 合并：同名命名空间自动追加成员
namespace CourseApp {
  export interface Student { name: string }
}
// 使用：CourseApp.format(course)`,E=`// course.ts — ES 模块方式
export interface Course { id: number; title: string }
export function format(c: Course): string { ... }

// student.ts
import type { Course } from './course'
export interface Student { name: string; enrolled: Course[] }

// 使用：import { format } from './course'`,y=b({__name:"T18Namespace",setup(a){const o=m("namespace"),s=k(()=>o.value==="namespace"?A:E),d={id:1,title:"Vue3 基础",level:"beginner"},u={name:"小明",role:"student"},n=m("");function f(){n.value=r.formatCourse(d)}function C(){n.value=`用户 ${u.name}，角色：${u.role}`}return(N,t)=>(p(),l("div",x,[t[2]||(t[2]=e("h4",null,"命名空间与全局类型",-1)),e("div",_,[e("button",{class:i({active:o.value==="namespace"}),onClick:t[0]||(t[0]=v=>o.value="namespace")},"namespace 方式",2),e("button",{class:i({active:o.value==="module"}),onClick:t[1]||(t[1]=v=>o.value="module")},"ES 模块方式",2)]),e("pre",S,c(s.value),1),e("div",{class:"button-row"},[e("button",{onClick:f},"运行 namespace 示例"),e("button",{onClick:C},"运行模块示例")]),n.value?(p(),l("p",$,c(n.value),1)):g("",!0),t[3]||(t[3]=e("small",null,"namespace 适合同文件内组织全局类型并支持合并；跨文件场景优先使用 ES 模块，tree-shaking 友好",-1))]))}});export{y as default};
