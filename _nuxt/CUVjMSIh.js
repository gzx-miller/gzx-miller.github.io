import{d as x,b9 as k,k as y,b,e,v as a,I as w,J as C,y as m,f as n,K as h,L as B,a0 as T,r as c,g as W,o as p,F}from"./CfJSWYGO.js";import{i as M}from"./DNfO4ABJ.js";const N={class:"demo-card"},V={class:"toolbar"},I={class:"input-line"},L={class:"layout"},D={class:"panel"},E={class:"constructs"},S={class:"big-result"},A={class:"status"},J=`;; 递归斐波那契：n < 2 返回 n，否则 fib(n-1)+fib(n-2)
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
)`,K=x({__name:"WB11ControlFlow",setup(U){const{theme:g,toggleTheme:r}=k(),o=c(10),i=c(null),d=c("");let u=null;const _=[{name:"block",desc:"定义一个代码块，可被 br 跳出（不带参数）"},{name:"loop",desc:"定义一个循环体，br 回跳实现迭代"},{name:"if / else / end",desc:"条件分支，可带 result 类型返回值"},{name:"br / br_if",desc:"无条件 / 条件跳转，按标签深度索引"},{name:"call",desc:"直接调用函数；call_indirect 则按表索引调用"}];y(async()=>{try{u=(await M("fib")).exports,d.value="fib 模块已加载：递归函数演示 if / else / call",v()}catch(l){d.value=`加载失败：${l.message}`}});function v(){if(!u)return;const l=Math.max(0,Math.min(30,Number(o.value)|0));i.value=u.fib(l),d.value=`fib(${l}) = ${i.value}（递归调用了 ${f(l)} 次 fib）`}function f(l){return l<2?1:f(l-1)+f(l-2)+1}const $=W(()=>g.value==="light"?"浅色 🍂":"深色 🌙");return(l,t)=>(p(),b("div",N,[t[5]||(t[5]=e("h3",null,"控制流：if / loop / br",-1)),t[6]||(t[6]=e("p",{class:"desc"},[a(" Wasm 只有三种结构化控制流："),e("code",null,"block"),a("、"),e("code",null,"loop"),a("、 "),e("code",null,"if/else"),a("，配合 "),e("code",null,"br"),a(" 跳转。用递归的斐波那契看 "),e("code",null,"if/else"),a(" 的用法，体会分支与函数调用的配合。 ")],-1)),e("div",V,[e("label",I,[t[2]||(t[2]=a(" 输入 n（0~30） ",-1)),w(e("input",{"onUpdate:modelValue":t[0]||(t[0]=s=>o.value=s),type:"number",min:"0",max:"30",onInput:v},null,544),[[C,o.value,void 0,{number:!0}]])]),e("button",{onClick:t[1]||(t[1]=(...s)=>m(r)&&m(r)(...s))},"切换主题："+n($.value),1)]),e("div",L,[e("div",{class:"panel"},[t[3]||(t[3]=e("h4",null,"🔀 fib 的 WAT（if / else）",-1)),e("pre",{class:"wat"},[e("code",null,n(J))])]),e("div",D,[t[4]||(t[4]=e("h4",null,"🧭 控制流指令一览",-1)),e("ul",E,[(p(),b(h,null,B(_,s=>e("li",{key:s.name},[e("strong",null,n(s.name),1),e("span",null,n(s.desc),1)])),64))]),e("div",S,[e("span",null,"fib("+n(o.value)+")",1),e("code",null,n(i.value??"…"),1)])])]),e("p",A,n(d.value),1),t[7]||(t[7]=T('<div class="tips-box" data-v-26defd5f><p data-v-26defd5f><strong data-v-26defd5f>🌰 核心概念：</strong></p><ul data-v-26defd5f><li data-v-26defd5f>没有 <code data-v-26defd5f>goto</code>，跳转被限定在结构化块内，便于验证与优化</li><li data-v-26defd5f><code data-v-26defd5f>if</code> 需要以 <code data-v-26defd5f>end</code> 收尾，可带 result 类型</li><li data-v-26defd5f><code data-v-26defd5f>loop</code> 的 <code data-v-26defd5f>br 0</code> 表示跳回循环体开头</li><li data-v-26defd5f>深递归会占用调用栈，超大 <code data-v-26defd5f>n</code> 可能触发栈溢出异常</li></ul></div>',1))]))}}),z=F(K,[["__scopeId","data-v-26defd5f"]]);export{z as default};
