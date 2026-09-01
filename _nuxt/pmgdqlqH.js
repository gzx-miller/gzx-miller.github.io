import{d as x,b9 as k,k as y,b,e,v as a,K as w,L as C,y as m,f as n,F as h,E as B,a0 as T,r,g as W,o as p,I as F}from"./DutfXOOr.js";import{i as M}from"./DNfO4ABJ.js";const N={class:"demo-card"},V={class:"toolbar"},E={class:"input-line"},I={class:"layout"},L={class:"panel"},D={class:"constructs"},S={class:"big-result"},A={class:"status"},K=`;; 递归斐波那契：n < 2 返回 n，否则 fib(n-1)+fib(n-2)
(func $fib (param $n i32) (result i32)
  local.get $n
  i32.const 2
  i32.lt_u          ;; n < 2 ?
  if (result i32)
    local.get $n    ;; 是 → 直接返回 n
  else
    local.get $n
    i32.const 1
    i32.sub
    call $fib       ;; fib(n-1)

    local.get $n
    i32.const 2
    i32.sub
    call $fib       ;; fib(n-2)
    i32.add         ;; 两者相加
  end
)`,U=x({__name:"WB11ControlFlow",setup(j){const{theme:g,toggleTheme:f}=k(),o=r(10),d=r(null),i=r("");let u=null;const _=[{name:"block",desc:"定义一个代码块，可被 br 跳出（不带参数）"},{name:"loop",desc:"定义一个循环体，br 回跳实现迭代"},{name:"if / else / end",desc:"条件分支，可带 result 类型返回值"},{name:"br / br_if",desc:"无条件 / 条件跳转，按标签深度索引"},{name:"call",desc:"直接调用函数；call_indirect 则按表索引调用"}];y(async()=>{try{u=(await M("fib")).exports,i.value="fib 模块已加载：递归函数演示 if / else / call",v()}catch(l){i.value=`加载失败：${l.message}`}});function v(){if(!u)return;const l=Math.max(0,Math.min(30,Number(o.value)|0));d.value=u.fib(l),i.value=`fib(${l}) = ${d.value}（递归调用了 ${c(l)} 次 fib）`}function c(l){return l<2?1:c(l-1)+c(l-2)+1}const $=W(()=>g.value==="light"?"浅色 🍂":"深色 🌙");return(l,t)=>(p(),b("div",N,[t[5]||(t[5]=e("h3",null,"控制流：if / loop / br",-1)),t[6]||(t[6]=e("p",{class:"desc"},[a(" Wasm 只有三种结构化控制流："),e("code",null,"block"),a("、"),e("code",null,"loop"),a("、 "),e("code",null,"if/else"),a("，配合 "),e("code",null,"br"),a(" 跳转。用递归的斐波那契看 "),e("code",null,"if/else"),a(" 的用法，体会分支与函数调用的配合。 ")],-1)),e("div",V,[e("label",E,[t[2]||(t[2]=a(" 输入 n（0~30） ",-1)),w(e("input",{"onUpdate:modelValue":t[0]||(t[0]=s=>o.value=s),type:"number",min:"0",max:"30",onInput:v},null,544),[[C,o.value,void 0,{number:!0}]])]),e("button",{onClick:t[1]||(t[1]=(...s)=>m(f)&&m(f)(...s))},"切换主题："+n($.value),1)]),e("div",I,[e("div",{class:"panel"},[t[3]||(t[3]=e("h4",null,"🔀 fib 的 WAT（if / else）",-1)),e("pre",{class:"wat"},[e("code",null,n(K))])]),e("div",L,[t[4]||(t[4]=e("h4",null,"🧭 控制流指令一览",-1)),e("ul",D,[(p(),b(h,null,B(_,s=>e("li",{key:s.name},[e("strong",null,n(s.name),1),e("span",null,n(s.desc),1)])),64))]),e("div",S,[e("span",null,"fib("+n(o.value)+")",1),e("code",null,n(d.value??"…"),1)])])]),e("p",A,n(i.value),1),t[7]||(t[7]=T('<div class="tips-box" data-v-464034e3><p data-v-464034e3><strong data-v-464034e3>🌰 核心概念：</strong></p><ul data-v-464034e3><li data-v-464034e3>没有 <code data-v-464034e3>goto</code>，跳转被限定在结构化块内，便于验证与优化</li><li data-v-464034e3><code data-v-464034e3>if</code> 需要以 <code data-v-464034e3>end</code> 收尾，可带 result 类型</li><li data-v-464034e3><code data-v-464034e3>loop</code> 的 <code data-v-464034e3>br 0</code> 表示跳回循环体开头</li><li data-v-464034e3>深递归会占用调用栈，超大 <code data-v-464034e3>n</code> 可能触发栈溢出异常</li></ul></div>',1))]))}}),G=F(U,[["__scopeId","data-v-464034e3"]]);export{G as default};
