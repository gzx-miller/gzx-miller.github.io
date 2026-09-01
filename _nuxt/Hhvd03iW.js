import{d as n,b as s,A as c,e as r,r as p,g as l,o as i,I as m}from"./DutfXOOr.js";const f={imports:{react:"https://esm.sh/react@19.2.0?dev","react-dom":"https://esm.sh/react-dom@19.2.0?dev","react-dom/client":"https://esm.sh/react-dom@19.2.0/client?dev",zustand:"https://esm.sh/zustand@5.0.14?dev&external=react","zustand/middleware":"https://esm.sh/zustand@5.0.14/middleware?dev&external=react",jotai:"https://esm.sh/jotai@2.20.1?dev&external=react","@reduxjs/toolkit":"https://esm.sh/@reduxjs/toolkit@2.12.0?dev","react-redux":"https://esm.sh/react-redux@9.3.0?dev&external=react",xstate:"https://esm.sh/xstate@5.32.1?dev","@xstate/react":"https://esm.sh/@xstate/react@6.1.0?dev&external=react"}},x=`
  :root {
    color: #32190f;
    font-family: Inter, "Microsoft YaHei", system-ui, sans-serif;
    background: #fffaf2;
  }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 18px; }
  button, input, select {
    font: inherit;
  }
  button {
    min-height: 36px;
    border: 1px solid #b7431f;
    border-radius: 7px;
    background: #b7431f;
    color: white;
    padding: 7px 13px;
    cursor: pointer;
  }
  button:hover { background: #8f2f18; }
  button.secondary {
    background: transparent;
    color: #8f2f18;
  }
  button.secondary:hover { background: #ffe6c0; }
  button:disabled { cursor: not-allowed; opacity: .5; }
  input, select {
    min-height: 38px;
    width: 100%;
    border: 1px solid #ddb98b;
    border-radius: 7px;
    background: white;
    color: #32190f;
    padding: 8px 10px;
  }
  h3, p { margin-top: 0; }
  h3 { margin-bottom: 6px; font-size: 18px; }
  ul { margin: 0; padding-left: 20px; }
  .app { display: grid; gap: 14px; }
  .kicker {
    margin-bottom: 4px;
    color: #8f2f18;
    font-size: 12px;
    font-weight: 700;
  }
  .muted { color: #7c563f; font-size: 13px; line-height: 1.6; }
  .toolbar, .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }
  .panel, .item {
    border: 1px solid #efc48d;
    border-radius: 7px;
    background: white;
    padding: 12px;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .metric { color: #8f2f18; font-size: 22px; font-weight: 750; }
  .badge {
    border-radius: 999px;
    background: #ffe6c0;
    color: #8f2f18;
    padding: 3px 8px;
    font-size: 12px;
    font-weight: 700;
  }
  .success { color: #28744b; font-weight: 700; }
  .error { color: #a33122; font-size: 13px; }
  .field { display: grid; gap: 5px; }
  .field label { color: #6f4935; font-size: 13px; font-weight: 650; }
  @media (max-width: 520px) {
    body { padding: 14px; }
    .item { align-items: flex-start; }
  }
`;function u(e){const o=e.replaceAll("<\/script>","<\\/script>");return`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${x}</style>
    <script type="importmap">${JSON.stringify(f)}<\/script>
  </head>
  <body>
    <div id="root"><p class="muted">正在加载 React 演示...</p></div>
    <script type="module">${o}<\/script>
  </body>
</html>`}const h={class:"react-demo-shell"},g={key:0,class:"react-demo-loading"},b=["title","srcdoc"],v=n({__name:"ReactJsDemo",props:{code:{},title:{}},setup(e){const o=e,a=p(!1),d=l(()=>u(o.code));return(y,t)=>(i(),s("div",h,[a.value?c("",!0):(i(),s("div",g,"正在加载 React 19.2 演示...")),r("iframe",{title:e.title,srcdoc:d.value,sandbox:"allow-scripts",loading:"eager",onLoad:t[0]||(t[0]=w=>a.value=!0)},null,40,b),t[1]||(t[1]=r("p",{class:"react-runtime-note"}," 运行环境：React 19.2 ES Module，通过 JavaScript URL 引入；未向 Vue3 工程安装 React 依赖。 ",-1))]))}}),z=Object.assign(m(v,[["__scopeId","data-v-c6ae4650"]]),{__name:"ReactJsDemo"});export{z as R};
