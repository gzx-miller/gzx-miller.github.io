import{d as b,b as d,e,v as l,f as m,A as _,F as x,E as w,y as A,r as h,o as u,z as F,g as N,I as B}from"./DutfXOOr.js";const S={class:"demo-card"},O=["disabled"],P={key:0,class:"perf-phase"},T={key:1,class:"perf-results"},$={class:"perf-dur"},j={class:"perf-total"},E=b({__name:"D22PerfHooks",setup(z){const f=[],o=[],c=h(!1),t=h("");function y(){c.value=!0,f.length=0,o.length=0,t.value="准备";const a=[{name:"开始解析 JSON",fn:()=>JSON.parse('{"data":'+JSON.stringify(Array(1e3).fill(1))+"}")},{name:"开始排序",fn:()=>Array(1e4).fill(0).map((s,p)=>Math.random()).sort()},{name:"开始字符串拼接",fn:()=>Array(5e3).fill("hello").join("-")},{name:"开始正则匹配",fn:()=>/[a-z]+/.test("hello-world-123")}];let n=0;const r=performance.now();function i(){if(n>=a.length){const g=(performance.now()-r).toFixed(1);t.value=`完成！总耗时 ${g}ms`,c.value=!1;return}const s=a[n];t.value=s.name;const p=performance.now();s.fn();const v=(performance.now()-p).toFixed(1);f.push({name:s.name,time:p}),o.push({name:s.name,duration:parseFloat(v)}),t.value=`${s.name} 完成，耗时 ${v}ms`,n++,setTimeout(i,300)}i()}const k=N(()=>o.reduce((a,n)=>a+n.duration,0).toFixed(1));return(a,n)=>(u(),d("div",S,[n[1]||(n[1]=e("p",null,[e("code",null,"perf_hooks"),l(" 模块提供 Node.js 性能打点能力，类似浏览器 "),e("code",null,"performance"),l(" API。")],-1)),e("button",{disabled:c.value,onClick:y},"运行性能基准测试",8,O),t.value?(u(),d("div",P,m(t.value),1)):_("",!0),o.length?(u(),d("div",T,[n[0]||(n[0]=e("div",{class:"perf-header"},[e("span",null,"操作"),e("span",null,"耗时 (ms)"),e("span",null,"占比")],-1)),(u(),d(x,null,w(o,(r,i)=>e("div",{key:i,class:"perf-row"},[e("span",null,m(r.name),1),e("span",$,m(r.duration.toFixed(1)),1),e("span",{class:"perf-bar",style:F({width:r.duration/Math.max(...o.map(s=>s.duration))*100+"%"})},null,4)])),64)),e("div",j,"总耗时："+m(A(k))+"ms",1)])):_("",!0),n[2]||(n[2]=e("pre",{class:"mini-code"},[e("code",null,`const { performance, PerformanceObserver } = require('node:perf_hooks')

// 打点
performance.mark('A')
doSomething()
performance.mark('B')
performance.measure('A到B', 'A', 'B')

// 监听性能条目
const obs = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(\\\`\\\${entry.name}: \\\${entry.duration.toFixed(2)}ms\\\`)
  })
})
obs.observe({ entryTypes: ['measure'] })`)],-1)),n[3]||(n[3]=e("small",null,[l("要点："),e("code",null,"perf_hooks"),l(" 是 Node.js 内置模块，无需安装；适合定位函数级别的性能瓶颈；配合 "),e("code",null,"clinic.js"),l(" 可做更专业的性能分析。")],-1))]))}}),I=B(E,[["__scopeId","data-v-5aaea3fb"]]);export{I as default};
