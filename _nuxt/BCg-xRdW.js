import{d as k,b as a,e,M as r,F as d,E as u,f as l,A as y,v as T,r as g,g as K,o,I as C}from"./DutfXOOr.js";const U={class:"demo-card"},P={style:{display:"flex",gap:"8px","margin-bottom":"12px","flex-wrap":"wrap"}},E={key:0},R={class:"type"},w={style:{display:"flex",gap:"8px","flex-wrap":"wrap","margin-bottom":"8px"}},S=["onClick"],h={class:"result-box"},L={style:{"margin-top":"8px"}},N={class:"mini-code small"},_={key:1},z={class:"type"},O={key:2},$={class:"type"},F={key:3},H={style:{display:"flex",gap:"6px","flex-wrap":"wrap","margin-bottom":"10px"}},I=["onClick"],V={class:"result-box"},q={style:{margin:"0 0 8px 0",color:"#e85d04"}},A={class:"mini-code small"},B={style:{"margin-top":"8px"}},M=`<span style="color:#7c7c99">// 1. 映射类型：遍历键并转换</span>
type MyReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K]
}

<span style="color:#7c7c99">// 2. 条件类型：类型层面的 if-else</span>
type IsString&lt;T&gt; = T extends string ? true : false
type A = IsString&lt;'hello'&gt;  <span style="color:#8a8a3a">// true</span>
type B = IsString&lt;123&gt;      <span style="color:#8a8a3a">// false</span>

<span style="color:#7c7c99">// 3. 模板字面量类型</span>
type EventName&lt;T extends string&gt; = \`on\${Capitalize&lt;T&gt;}\`
type ClickEvent = EventName&lt;'click'&gt;  <span style="color:#8a8a3a">// 'onClick'</span>

<span style="color:#7c7c99">// 4. 类型体操：提取函数键</span>
type FunctionKeys&lt;T&gt; = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

<span style="color:#7c7c99">// 5. 递归类型 + 条件类型</span>
type DeepReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly&lt;T[K]&gt;
    : T[K]
}`,D=k({__name:"T23TypeLevelProgramming",setup(j){const s=g("mapped"),b=[{name:"Readonly<T>",desc:"所有属性变为只读",syntax:"readonly [K in keyof T]: T[K]"},{name:"Partial<T>",desc:"所有属性变为可选",syntax:"[K in keyof T]?: T[K]"},{name:"Required<T>",desc:"所有属性变为必选",syntax:"[K in keyof T]-?: T[K]"},{name:"Pick<T, K>",desc:"选取部分属性",syntax:"[K in Keys]: T[K]"},{name:"Omit<T, K>",desc:"排除部分属性",syntax:"Pick<T, Exclude<keyof T, K>>"},{name:"Record<K, T>",desc:"构造键值对类型",syntax:"[K in Keys]: T"}],v=[{name:"Exclude<T, U>",desc:"从 T 中排除可分配给 U 的类型",example:'Exclude<"a" | "b" | "c", "a"> → "b" | "c"'},{name:"Extract<T, U>",desc:"从 T 中提取可分配给 U 的类型",example:'Extract<"a" | "b" | "c", "a" | "b"> → "a" | "b"'},{name:"NonNullable<T>",desc:"排除 null 和 undefined",example:"NonNullable<string | null> → string"},{name:"ReturnType<T>",desc:"获取函数返回类型",example:"ReturnType<() => number> → number"},{name:"Parameters<T>",desc:"获取函数参数类型元组",example:"Parameters<(a: string) => void> → [a: string]"},{name:"Awaited<T>",desc:"递归解包 Promise",example:"Awaited<Promise<Promise<string>>> → string"}],x=[{name:"Capitalize<S>",desc:"首字母大写",before:"hello",after:"Hello"},{name:"Uppercase<S>",desc:"全大写",before:"hello",after:"HELLO"},{name:"Lowercase<S>",desc:"全小写",before:"HELLO",after:"hello"},{name:"Uncapitalize<S>",desc:"首字母小写",before:"Hello",after:"hello"},{name:"字符串拼接",desc:"使用模板字面量拼接类型",before:'"on" + "Click"',after:'"onClick"'},{name:"事件名生成",desc:"批量生成事件处理器类型",before:'"click" | "change"',after:'"onClick" | "onChange"'}],p=[{title:"获取对象值的联合类型",code:`type ValueOf<T> = T[keyof T]
type UserVals = ValueOf<User>
// → number | string | undefined | 'admin'|'editor'|'viewer'`,desc:"用 keyof 拿到键，再用索引访问拿到值"},{title:"交集属性",code:"type Intersection<T, U> = Pick<T, Extract<keyof T, keyof U>>",desc:"取两个类型共有的属性"},{title:"函数名过滤",code:`type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]`,desc:"找出类型中所有值为函数的键"},{title:"元组转联合",code:`type Tuple = [string, number, boolean]
type Union = Tuple[number]
// → string | number | boolean`,desc:"元组通过数字索引访问转联合"}],m=g("Readonly"),f=K(()=>{switch(m.value){case"Readonly":return`Readonly<User> = {
  readonly id: number
  readonly name: string
  readonly email: string
  readonly age?: number
  readonly role: 'admin' | 'editor' | 'viewer'
}`;case"Partial":return`Partial<User> = {
  id?: number
  name?: string
  email?: string
  age?: number
  role?: 'admin' | 'editor' | 'viewer'
}`;case"Required":return`Required<User> = {
  id: number
  name: string
  email: string
  age: number  // 不再可选
  role: 'admin' | 'editor' | 'viewer'
}`;case"Pick":return`Pick<User, 'id' | 'name'> = {
  id: number
  name: string
}`;case"Omit":return`Omit<User, 'age' | 'role'> = {
  id: number
  name: string
  email: string
}`;default:return""}}),i=g(0);return(X,n)=>(o(),a("div",U,[n[19]||(n[19]=e("h3",null,"类型级编程与类型体操",-1)),e("div",P,[e("button",{class:r(["tab-btn",{active:s.value==="mapped"}]),onClick:n[0]||(n[0]=t=>s.value="mapped")},"映射类型",2),e("button",{class:r(["tab-btn",{active:s.value==="conditional"}]),onClick:n[1]||(n[1]=t=>s.value="conditional")},"条件类型",2),e("button",{class:r(["tab-btn",{active:s.value==="template"}]),onClick:n[2]||(n[2]=t=>s.value="template")},"模板字面量",2),e("button",{class:r(["tab-btn",{active:s.value==="tricks"}]),onClick:n[3]||(n[3]=t=>s.value="tricks")},"进阶技巧",2)]),s.value==="mapped"?(o(),a("div",E,[n[7]||(n[7]=e("h4",null,"内置映射类型",-1)),n[8]||(n[8]=e("p",{style:{"font-size":"13px",color:"#5a4a32"}},"映射类型允许你基于已有类型创建新类型，遍历并转换每个属性。",-1)),e("table",null,[n[4]||(n[4]=e("thead",null,[e("tr",null,[e("th",null,"工具类型"),e("th",null,"说明"),e("th",null,"核心语法")])],-1)),e("tbody",null,[(o(),a(d,null,u(b,t=>e("tr",{key:t.name},[e("td",null,[e("code",R,l(t.name),1)]),e("td",null,l(t.desc),1),e("td",null,[e("code",null,l(t.syntax),1)])])),64))])]),n[9]||(n[9]=e("h4",{style:{"margin-top":"12px"}},"交互式演示",-1)),e("div",w,[(o(),a(d,null,u(["Readonly","Partial","Required","Pick","Omit"],t=>e("button",{key:t,class:r(["mini-btn",{active:m.value===t}]),onClick:c=>m.value=t},l(t),11,S)),64))]),e("div",h,[n[5]||(n[5]=e("p",null,[e("strong",null,"原始类型 User：")],-1)),n[6]||(n[6]=e("pre",{class:"mini-code small"},`interface User {
  id: number
  name: string
  email: string
  age?: number
  role: 'admin' | 'editor' | 'viewer'
}`,-1)),e("p",L,[e("strong",null,"应用 "+l(m.value)+" 后：",1)]),e("pre",N,l(f.value),1)])])):y("",!0),s.value==="conditional"?(o(),a("div",_,[n[11]||(n[11]=e("h4",null,"条件类型工具",-1)),n[12]||(n[12]=e("p",{style:{"font-size":"13px",color:"#5a4a32"}},[T("条件类型就像类型层面的三元表达式："),e("code",null,"T extends U ? X : Y")],-1)),e("table",null,[n[10]||(n[10]=e("thead",null,[e("tr",null,[e("th",null,"工具类型"),e("th",null,"说明"),e("th",null,"示例")])],-1)),e("tbody",null,[(o(),a(d,null,u(v,t=>e("tr",{key:t.name},[e("td",null,[e("code",z,l(t.name),1)]),e("td",null,l(t.desc),1),e("td",null,[e("code",null,l(t.example),1)])])),64))])]),n[13]||(n[13]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"核心思想："),T("条件类型 + infer + 递归 = 类型级编程的三大支柱。几乎所有复杂的类型工具都是它们的组合。")])],-1))])):y("",!0),s.value==="template"?(o(),a("div",O,[n[15]||(n[15]=e("h4",null,"模板字面量类型",-1)),n[16]||(n[16]=e("p",{style:{"font-size":"13px",color:"#5a4a32"}},"TS 4.1+ 支持在类型层面进行字符串操作，能玩出很多花样。",-1)),e("table",null,[n[14]||(n[14]=e("thead",null,[e("tr",null,[e("th",null,"工具/模式"),e("th",null,"说明"),e("th",null,"输入"),e("th",null,"输出")])],-1)),e("tbody",null,[(o(),a(d,null,u(x,t=>e("tr",{key:t.name},[e("td",null,[e("strong",null,l(t.name),1)]),e("td",null,l(t.desc),1),e("td",null,[e("code",null,l(t.before),1)]),e("td",null,[e("code",$,l(t.after),1)])])),64))])]),n[17]||(n[17]=e("div",{class:"result-box",style:{"margin-top":"12px"}},[e("p",null,[e("strong",null,"典型应用："),T("自动生成事件名、CSS 属性名、路由路径等批量字符串类型。")]),e("pre",{class:"mini-code small"},[e("span",{style:{color:"#7c7c99"}},"// 批量生成事件处理器类型"),T("\ntype Events = 'click' | 'change' | 'submit'\ntype HandlerNames = `on${Capitalize<Events>}`\n"),e("span",{style:{color:"#8a8a3a"}},"// → 'onClick' | 'onChange' | 'onSubmit'")])],-1))])):y("",!0),s.value==="tricks"?(o(),a("div",F,[n[18]||(n[18]=e("h4",null,"类型体操进阶技巧",-1)),e("div",H,[(o(),a(d,null,u(p,(t,c)=>e("button",{key:c,class:r(["mini-btn",{active:i.value===c}]),onClick:Y=>i.value=c},l(t.title),11,I)),64))]),e("div",V,[e("h5",q,l(p[i.value].title),1),e("pre",A,l(p[i.value].code),1),e("p",B,[e("small",null,l(p[i.value].desc),1)])])])):y("",!0),n[20]||(n[20]=e("h4",null,"综合代码示例",-1)),e("pre",{class:"mini-code",innerHTML:M})]))}}),J=C(D,[["__scopeId","data-v-96d43cce"]]);export{J as default};
