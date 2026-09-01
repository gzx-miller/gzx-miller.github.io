import{d as b,b9 as x,k as y,b as w,e as l,v as s,K as _,L as k,aG as B,y as g,f as a,r as d,g as N,o as T,I as W}from"./DutfXOOr.js";import{i as h}from"./DNfO4ABJ.js";const L={class:"demo-card"},V={class:"toolbar"},C={class:"input-line"},D={class:"layout"},E={class:"panel result-panel"},I={class:"big-result"},K={class:"status"},A=`;; 函数签名：(ptr, n) -> i32
(func $sum (param $ptr i32) (param $n i32) (result i32)
  (local $end i32)   ;; 局部变量：结束地址
  (local $acc i32)   ;; 局部变量：累加器
  local.get $ptr
  local.get $n
  i32.const 4
  i32.mul
  i32.add
  local.set $end

  i32.const 0
  local.set $acc

  (block $exit
    (loop $loop
      local.get $ptr
      local.get $end
      i32.ge_u
      br_if $exit

      local.get $acc
      local.get $ptr
      i32.load offset=0
      i32.add
      local.set $acc

      local.get $ptr
      i32.const 4
      i32.add
      local.set $ptr
      br $loop
    )
  )
  local.get $acc
)`,F=b({__name:"WB07FunctionsLocals",setup(M){const{theme:$,toggleTheme:p}=x(),u=d("12, 18, 30"),m=d(null),o=d("");let i=null,r=null;y(async()=>{try{const e=await h("mem");i=e.exports,r=new Uint8Array(e.exports.memory.buffer),o.value="mem 模块已加载：sum 函数按 4 字节累加一段 i32 数组",c()}catch(e){o.value=`加载失败：${e.message}`}});function c(){if(!i||!r)return;const e=u.value.split(",").map(n=>Number(n.trim())).filter(n=>!Number.isNaN(n));if(e.length===0)return;const t=new DataView(r.buffer);e.forEach((n,v)=>t.setInt32(v*4,n,!0)),m.value=i.sum(0,e.length),o.value=`sum(ptr=0, n=${e.length})：把 ${e.length} 个商品价格累加`}const f=N(()=>$.value==="light"?"浅色 🍂":"深色 🌙");return(e,t)=>(T(),w("div",L,[t[7]||(t[7]=l("h3",null,"函数与局部变量：结算函数 sum",-1)),t[8]||(t[8]=l("p",{class:"desc"},[s(' Wasm 函数由"签名 + 参数 + 局部变量 + 指令体"组成。下面用 '),l("code",null,"sum"),s(" 结算一笔购物车：它接收指针和数量两个参数，用两个局部变量（结束地址、累加器） 完成循环累加，最终返回合计。 ")],-1)),l("div",V,[l("label",C,[t[2]||(t[2]=s(" 🛒 商品价格（逗号分隔） ",-1)),_(l("input",{"onUpdate:modelValue":t[0]||(t[0]=n=>u.value=n),type:"text",onKeyup:B(c,["enter"])},null,544),[[k,u.value]])]),l("button",{onClick:c},"💸 结算"),l("button",{onClick:t[1]||(t[1]=(...n)=>g(p)&&g(p)(...n))},"切换主题："+a(f.value),1)]),l("div",D,[l("div",{class:"panel"},[t[3]||(t[3]=l("h4",null,"🔢 sum 的 WAT 源码",-1)),l("pre",{class:"wat"},[l("code",null,a(A))])]),l("div",E,[t[5]||(t[5]=l("h4",null,"🧮 结算结果",-1)),l("div",I,[t[4]||(t[4]=l("span",null,"合计",-1)),l("code",null,a(m.value??"…"),1)]),t[6]||(t[6]=l("ul",{class:"anatomy"},[l("li",null,[l("strong",null,"参数"),s("：ptr（数组起始地址）、n（元素个数）")]),l("li",null,[l("strong",null,"局部变量"),s("：end（结束地址）、acc（累加器）")]),l("li",null,[l("strong",null,"返回值"),s("：i32，压入结果后 "),l("code",null,"return")])],-1))])]),l("p",K,a(o.value),1),t[9]||(t[9]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"🌰 核心概念：")]),l("ul",null,[l("li",null,[s('参数与局部变量同属"函数局部索引空间"，'),l("code",null,"local.get/set"),s(" 按索引访问")]),l("li",null,"函数在执行时使用独立的栈帧，调用结束后局部变量被回收"),l("li",null,[s("返回值在函数体末尾用 "),l("code",null,"0b"),s("（end）收尾")]),l("li",null,"类型安全：参数/局部/返回的类型必须与签名严格一致")])],-1))]))}}),S=W(F,[["__scopeId","data-v-2bb5801f"]]);export{S as default};
