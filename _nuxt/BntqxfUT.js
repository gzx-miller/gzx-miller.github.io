import{d as v,b as o,e as n,v as r,F as p,E as m,A as C,r as u,o as s,M as T,f as g,I as S}from"./DutfXOOr.js";const f={class:"demo-card"},P={class:"net-controls"},_=["disabled"],h=["disabled"],k={key:0,class:"net-log"},H=v({__name:"D26NetTcp",setup(b){const l=u(!1),e=u([]);function i(){l.value=!0,e.value=[],e.value.push("[Server] 创建 TCP 服务器..."),e.value.push("[Server] 监听端口 8080..."),setTimeout(()=>{e.value.push("[Server] 服务器已启动，等待客户端连接..."),setTimeout(()=>{e.value.push("[Server] 客户端已连接（socket）"),e.value.push('[Server] 收到数据: "Hello TCP!"'),setTimeout(()=>{e.value.push('[Server] 发送响应: "Hello from Server!"'),e.value.push("[Server] 连接关闭"),l.value=!1},500)},800)},600)}function c(){l.value=!0,e.value=[],e.value.push("[Client] 连接到服务器 127.0.0.1:8080..."),setTimeout(()=>{e.value.push("[Client] 连接成功！"),e.value.push('[Client] 发送数据: "Hello TCP!"'),setTimeout(()=>{e.value.push('[Client] 收到响应: "Hello from Server!"'),e.value.push("[Client] 断开连接"),l.value=!1},500)},800)}return(x,t)=>(s(),o("div",f,[t[0]||(t[0]=n("p",null,[n("code",null,"net"),r(" 模块提供 TCP 服务器和客户端能力，是 HTTP 模块的底层基础。")],-1)),n("div",P,[n("button",{disabled:l.value,onClick:i},"模拟 TCP 服务器",8,_),n("button",{disabled:l.value,onClick:c},"模拟 TCP 客户端",8,h)]),e.value.length?(s(),o("div",k,[(s(!0),o(p,null,m(e.value,(a,d)=>(s(),o("div",{key:d,class:T(a.startsWith("[Server]")?"log-server":"log-client")},g(a),3))),128))])):C("",!0),t[1]||(t[1]=n("div",{class:"net-example"},[n("strong",null,"TCP 服务器示例："),n("pre",{class:"mini-code"},[n("code",null,`const net = require('node:net')

const server = net.createServer((socket) => {
  console.log('客户端连接:', socket.remoteAddress)

  socket.on('data', (data) => {
    console.log('收到:', data.toString())
    socket.write('Hello from Server!')
  })

  socket.on('end', () => {
    console.log('客户端断开')
  })
})

server.listen(8080, () => {
  console.log('TCP 服务器监听 8080 端口')
})`)])],-1)),t[2]||(t[2]=n("div",{class:"net-example"},[n("strong",null,"TCP 客户端示例："),n("pre",{class:"mini-code"},[n("code",null,`const net = require('node:net')

const client = net.createConnection({ port: 8080 }, () => {
  console.log('连接到服务器')
  client.write('Hello TCP!')
})

client.on('data', (data) => {
  console.log('收到响应:', data.toString())
  client.end()
})

client.on('end', () => {
  console.log('断开连接')
})`)])],-1)),t[3]||(t[3]=n("small",null,[r("要点：TCP 是面向连接的可靠传输协议；"),n("code",null,"net"),r(" 模块基于 Stream；HTTP 服务器底层就是 TCP 服务器。")],-1))]))}}),y=S(H,[["__scopeId","data-v-d6465060"]]);export{y as default};
