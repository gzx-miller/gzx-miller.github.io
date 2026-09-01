import{I as i,b as r,e as t,M as b,f as _,r as a,o as v}from"./DutfXOOr.js";const f={class:"demo-card"},p={class:"row"},k=["disabled"],m=["disabled"],S=["disabled"],W={class:"output"},h={__name:"J27WebSocket",setup(w){const o=a(""),s=a(!1);let e=null;function c(){o.value+=`正在连接…
`,e=new WebSocket("wss://echo.websocket.org"),e.onopen=()=>{s.value=!0,o.value+=`✅ 已连接
`},e.onmessage=l=>{o.value+=`📩 收到：${l.data}
`},e.onerror=l=>{o.value+=`❌ 连接出错
`},e.onclose=()=>{s.value=!1,o.value+=`🔌 连接关闭
`}}function d(){e&&s.value&&(e.send("Hello WebSocket!"),o.value+=`📤 发送：Hello WebSocket!
`)}function u(){e?.close()}return(l,n)=>(v(),r("div",f,[n[0]||(n[0]=t("h4",null,"WebSocket 实时通信",-1)),t("div",p,[t("button",{class:b(["btn",{active:s.value}]),onClick:c,disabled:s.value},"连接",10,k),t("button",{class:"btn",onClick:d,disabled:!s.value},"发送消息",8,m),t("button",{class:"btn btn-close",onClick:u,disabled:!s.value},"关闭",8,S)]),t("pre",W,_(o.value||"（日志为空）"),1),n[1]||(n[1]=t("p",{style:{"font-size":"12px",color:"#868e96"}},"💡 WebSocket 建立后，服务端可主动推送消息到客户端",-1))]))}},x=i(h,[["__scopeId","data-v-071997fd"]]);export{x as default};
