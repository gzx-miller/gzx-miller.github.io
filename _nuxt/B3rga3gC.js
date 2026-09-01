import{s as v}from"./CLeGk598.js";import{d as g,b as i,e,F as h,E as x,f as o,A as k,v as r,r as u,g as w,o as p,M as C,I as b}from"./DutfXOOr.js";const j={class:"demo-card"},D={class:"method-tabs"},N=["onClick"],$={class:"method-info"},I=["disabled"],M={key:0,class:"mini-code"},B={class:"mini-code"},E=g({__name:"D19ChildProcess",setup(P){const a=u("spawn"),c=u(!1),n=u(""),m={spawn:{title:"spawn() — 流式输出",desc:"适合处理大量数据，子进程的输出以流的形式传递，内存占用小。",code:`// 执行 ls -la，流式读取输出
const { spawn } = require("child_process")
const ls = spawn("ls", ["-la", "/usr"])

ls.stdout.on("data", (data) => {
  console.log(\`输出: \${data}\`)
})

ls.stderr.on("data", (data) => {
  console.error(\`错误: \${data}\`)
})

ls.on("close", (code) => {
  console.log(\`退出码: \${code}\`)
})`,demo:`模拟执行: ls -la
总用量 48
drwxr-xr-x  5 user  staff   160 6月  1 10:00 .
drwxr-xr-x  3 user  staff    96 5月 20 09:00 ..
-rw-r--r--  1 user  staff  1024 6月  1 10:00 index.js
-rw-r--r--  1 user  staff   512 6月  1 10:00 package.json

退出码: 0`},fork:{title:"fork() — 独立 Node.js 进程",desc:"专门用于运行 Node.js 脚本，父子进程通过 IPC 通道通信，适合 CPU 密集任务。",code:`// 父进程
const { fork } = require("child_process")
const child = fork("worker.js")

child.on("message", (msg) => {
  console.log("来自子进程:", msg)
})

child.send({ task: "start", data: [1, 2, 3] })

// worker.js（子进程）
process.on("message", (msg) => {
  const result = processData(msg.data)
  process.send({ result })
})`,demo:`父进程: 发送任务 { task: "start", data: [1,2,3] }
子进程: 接收到任务，开始处理...
子进程: 处理完成，发送结果 { result: 6 }
父进程: 收到结果 6`},exec:{title:"exec() — 一次性完整输出",desc:"命令执行完成后一次性返回所有输出，适合输出量小的场景，有输出大小限制（默认 1MB）。",code:`// 执行命令，一次性获取输出
const { exec } = require("child_process")

exec("git log --oneline -5", (error, stdout, stderr) => {
  if (error) {
    console.error(\`执行出错: \${error}\`)
    return
  }
  console.log(\`最近 5 次提交:\\n\${stdout}\`)
})`,demo:`执行: git log --oneline -5

输出:
a1b2c3d feat: 新增用户登录功能
b2c3d4e fix: 修复首页样式问题
c3d4e5f docs: 更新 README

done`}},t=w(()=>m[a.value]);function _(){c.value=!0,n.value="";const d=t.value.demo.split(`
`);let s=0;const f=v(()=>{s<d.length?(n.value+=(n.value?`
`:"")+d[s],s++):(clearInterval(f),c.value=!1)},150)}return(d,s)=>(p(),i("div",j,[s[0]||(s[0]=e("p",null,"child_process 提供三种创建子进程的方式，适用场景各不相同。",-1)),e("div",D,[(p(),i(h,null,x(m,(f,l)=>e("button",{key:l,class:C({active:a.value===l}),onClick:q=>a.value=l},o(l),11,N)),64))]),e("div",$,[e("strong",null,o(t.value.title),1),e("p",null,o(t.value.desc),1)]),e("button",{disabled:c.value,onClick:_},"运行模拟演示",8,I),n.value?(p(),i("pre",M,[e("code",null,o(n.value),1)])):k("",!0),e("pre",B,[e("code",null,o(t.value.code),1)]),s[1]||(s[1]=e("small",null,[r("选型建议：大数据量用 "),e("code",null,"spawn"),r("，Node.js 脚本用 "),e("code",null,"fork"),r("，简单命令用 "),e("code",null,"exec"),r("。")],-1))]))}}),A=b(E,[["__scopeId","data-v-ee488524"]]);export{A as default};
