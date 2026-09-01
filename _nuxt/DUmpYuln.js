import{d as v,b as d,e,F as c,E as f,f as t,v as a,M as n,a0 as g,g as b,o as p,r as m,I as N}from"./DutfXOOr.js";const x={class:"demo-card"},j={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},h={style:{flex:"1"}},k={class:"pair-list"},A=["onClick"],C={class:"result-box"},E={class:"note"},S={style:{flex:"1"}},O=`<span style="color:#7c7c99">// 1. 严格相等 ===（推荐）</span>
console.log('0' === 0)   <span style="color:#8a8a3a">// false，类型不同直接不等</span>
console.log(null === undefined)  <span style="color:#8a8a3a">// false</span>

<span style="color:#7c7c99">// 2. 宽松相等 ==（不推荐，易出错）</span>
console.log('0' == 0)    <span style="color:#8a8a3a">// true，字符串转数字后比较</span>
console.log(null == undefined)   <span style="color:#8a8a3a">// true，特例</span>
console.log([] == '')   <span style="color:#8a8a3a">// true，数组 toString() 为空串</span>

<span style="color:#7c7c99">// 3. typeof 判断基本类型</span>
typeof 'hello'  <span style="color:#8a8a3a">// 'string'</span>
typeof 42       <span style="color:#8a8a3a">// 'number'</span>
typeof null     <span style="color:#e85d04">// 'object'（历史 bug！）</span>

<span style="color:#7c7c99">// 4. 精确判断 null</span>
const x = null
x === null      <span style="color:#8a8a3a">// true，这是判断 null 的正确方式</span>

<span style="color:#7c7c99">// 5. 判断数组</span>
Array.isArray([])  <span style="color:#8a8a3a">// true</span>
typeof []          <span style="color:#e85d04">// 'object'，无法区分</span>

<span style="color:#7c7c99">// 6. Object.is 处理边界情况</span>
Object.is(NaN, NaN)     <span style="color:#8a8a3a">// true（=== 是 false）</span>
Object.is(-0, +0)       <span style="color:#8a8a3a">// false（=== 是 true）</span>`,T=v({__name:"J01TypesEquality",setup(_){const i=[{left:"'0'",right:"0",loose:!0,strict:!1,note:"字符串与数字：== 转换后相等，=== 不等"},{left:"null",right:"undefined",loose:!0,strict:!1,note:"null == undefined 为 true（特例）"},{left:"[]",right:"''",loose:!0,strict:!1,note:"空数组 toString() 为空字符串"},{left:"0",right:"false",loose:!0,strict:!1,note:"0 和 false 都是 falsy"},{left:"'1'",right:"1",loose:!0,strict:!1,note:"数字字符串转数字后比较"},{left:"{}",right:"{}",loose:!1,strict:!1,note:"对象按引用比较，不同引用必不等"},{left:"NaN",right:"NaN",loose:!1,strict:!1,note:"NaN 与任何值都不等（含自身）"},{left:"true",right:"1",loose:!0,strict:!1,note:"true 转为 1 后比较"}],r=m(0),o=b(()=>i[r.value]),y=[{value:"'hello'",typeof:"string",note:"字符串字面量"},{value:"42",typeof:"number",note:"数字字面量"},{value:"true",typeof:"boolean",note:"布尔值"},{value:"undefined",typeof:"undefined",note:"未定义"},{value:"null",typeof:"object",note:"⚠️ 历史遗留 bug，null 的 typeof 是 object"},{value:"[]",typeof:"object",note:"数组也是 object，需用 Array.isArray()"},{value:"{}",typeof:"object",note:"普通对象"},{value:"() => {}",typeof:"function",note:"函数（一等公民）"},{value:"Symbol()",typeof:"symbol",note:"唯一标识符"}];return(B,l)=>(p(),d("div",x,[l[9]||(l[9]=e("h3",null,"类型与相等：==、===、typeof 详解",-1)),e("div",j,[e("div",h,[l[6]||(l[6]=e("h4",null,"相等性对比（点击切换）",-1)),e("div",k,[(p(),d(c,null,f(i,(s,u)=>e("button",{class:n(["pair-btn",{active:r.value===u}]),key:u,onClick:V=>r.value=u},t(s.left)+" vs "+t(s.right),11,A)),64))]),e("div",C,[e("p",null,[e("code",null,t(o.value.left),1),l[0]||(l[0]=a()),l[1]||(l[1]=e("strong",null,"==",-1)),l[2]||(l[2]=a()),e("code",null,t(o.value.right),1)]),e("p",{class:n(["result",{true:o.value.loose,false:!o.value.loose}])},t(o.value.loose),3),e("p",null,[e("code",null,t(o.value.left),1),l[3]||(l[3]=a()),l[4]||(l[4]=e("strong",null,"===",-1)),l[5]||(l[5]=a()),e("code",null,t(o.value.right),1)]),e("p",{class:n(["result",{true:o.value.strict,false:!o.value.strict}])},t(o.value.strict),3),e("p",E,t(o.value.note),1)])]),e("div",S,[l[8]||(l[8]=e("h4",null,"typeof 类型检查表",-1)),e("table",null,[l[7]||(l[7]=e("thead",null,[e("tr",null,[e("th",null,"值"),e("th",null,"typeof"),e("th",null,"说明")])],-1)),e("tbody",null,[(p(),d(c,null,f(y,s=>e("tr",{key:s.value},[e("td",null,[e("code",null,t(s.value),1)]),e("td",null,[e("code",{class:n({warn:s.note.includes("⚠️")})},t(s.typeof),3)]),e("td",null,[e("small",null,t(s.note),1)])])),64))])])])]),l[10]||(l[10]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:O}),l[11]||(l[11]=g('<div class="tips-box" data-v-1186e7d0><p data-v-1186e7d0><strong data-v-1186e7d0>最佳实践：</strong></p><ul data-v-1186e7d0><li data-v-1186e7d0>始终用 <code data-v-1186e7d0>===</code>，避免 <code data-v-1186e7d0>==</code> 的隐式转换陷阱</li><li data-v-1186e7d0>判断 <code data-v-1186e7d0>null</code> 用 <code data-v-1186e7d0>x === null</code>，不用 <code data-v-1186e7d0>typeof</code></li><li data-v-1186e7d0>判断数组用 <code data-v-1186e7d0>Array.isArray()</code>，不用 <code data-v-1186e7d0>typeof</code></li><li data-v-1186e7d0>NaN 判断用 <code data-v-1186e7d0>Number.isNaN()</code> 或 <code data-v-1186e7d0>Object.is(x, NaN)</code></li></ul></div>',1))]))}}),F=N(T,[["__scopeId","data-v-1186e7d0"]]);export{F as default};
