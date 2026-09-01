import{I as w,b as a,e,v as h,K as y,L as C,F as g,E as _,A as $,r as v,o,f as p,M}from"./DutfXOOr.js";import{s as P}from"./CLeGk598.js";const x={class:"demo-card"},T={class:"cluster-controls"},N=["disabled"],V={key:0,class:"cluster-log"},W={key:1,class:"req-table"},B={__name:"D20Cluster",setup(R){const d=v(4),r=v([]),n=v([]),m=v(!1);let b=0;function D(){n.value=[],r.value=[],m.value=!0,n.value.push(`主进程 PID ${Math.floor(Math.random()*1e4)+1e3} 启动，fork ${d.value} 个工作进程`);const i=[];for(let l=0;l<d.value;l++)i.push({id:l+1,pid:Math.floor(Math.random()*1e4)+2e3,status:"online",handled:0}),n.value.push(`  工作进程 ${l+1} 启动 (PID: ${i[l].pid})`);n.value.push("开始接收请求，使用轮询策略分发...");let s=0;const t=12;let c=0;const I=P(()=>{if(c>=t){clearInterval(I),n.value.push(`所有请求处理完成。各工作进程处理数: ${i.map(u=>`W${u.id}=${u.handled}`).join(", ")}`),m.value=!1;return}const l=s%d.value,f=++b,k=i[l];k.handled++;const q=Date.now();r.value=[...r.value,{id:f,worker:l+1,pid:k.pid,status:"processing",startTime:q}],n.value.push(`请求 #${f} → 工作进程 ${l+1} (PID: ${k.pid})`),setTimeout(()=>{r.value=r.value.map(u=>u.id===f?{...u,status:"done"}:u),c++},300+Math.random()*500),s++},400)}return(i,s)=>(o(),a("div",x,[s[3]||(s[3]=e("p",null,[h("cluster 模块让 Node.js 充分利用"),e("strong",null,"多核 CPU"),h("。主进程负责接收连接并分发给工作进程，工作进程各自独立处理请求。")],-1)),e("div",T,[e("label",null,[s[1]||(s[1]=h("工作进程数 ",-1)),y(e("input",{type:"number","onUpdate:modelValue":s[0]||(s[0]=t=>d.value=t),min:"1",max:"8"},null,512),[[C,d.value,void 0,{number:!0}]])]),e("button",{disabled:m.value,onClick:D},"启动集群模拟",8,N)]),n.value.length?(o(),a("div",V,[(o(!0),a(g,null,_(n.value,(t,c)=>(o(),a("div",{key:c,class:"log-line"},p(t),1))),128))])):$("",!0),r.value.length?(o(),a("div",W,[s[2]||(s[2]=e("div",{class:"req-header"},[e("span",null,"请求 ID"),e("span",null,"工作进程"),e("span",null,"PID"),e("span",null,"状态")],-1)),(o(!0),a(g,null,_(r.value,t=>(o(),a("div",{key:t.id,class:M(["req-row","status-"+t.status])},[e("span",null,"#"+p(t.id),1),e("span",null,"W"+p(t.worker),1),e("span",null,p(t.pid),1),e("span",null,p(t.status==="done"?"✓ 完成":"⏳ 处理中"),1)],2))),128))])):$("",!0),s[4]||(s[4]=e("pre",{class:"mini-code"},[e("code",null,`const cluster = require('node:cluster')
const http = require('node:http')

if (cluster.isPrimary) {
  // 主进程：fork 工作进程
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }
} else {
  // 工作进程：各自启动 HTTP 服务器
  http.createServer((req, res) => {
    res.end(\\\`Handled by Worker \\\${process.pid}\\\`)
  }).listen(3000)
}`)],-1)),s[5]||(s[5]=e("small",null,"要点：cluster 底层使用 child_process.fork()；工作进程共享同一个服务器端口；默认负载均衡策略为轮询（Round-Robin）。",-1))]))}},F=w(B,[["__scopeId","data-v-cf4f154e"]]);export{F as default};
